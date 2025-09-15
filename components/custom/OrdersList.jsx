"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, MapPin, IndianRupee, MoreVertical, Edit, Trash2, Eye, Loader2, User, Clock } from "lucide-react";
import { toast } from "sonner";

export default function OrdersList({ refreshTrigger }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    useEffect(() => {
        fetchOrders();
    }, [refreshTrigger, user.id]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5500/api/v1/orders`, {
                credentials: "include",
            });
            if(response.ok){
                const data = await response.json();
                setOrders(Array.isArray(data.orders) ? data.orders : []);
            }else{
                console.error("Failed to fetch orders");
                toast.error("Failed to load orders");
            }
        }catch(error){
            console.error("Error fetching orders:", error);
            toast.error("Error loading orders");
        }finally{
            setLoading(false);
        }
    }

    if(loading){
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2 flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                </div>
                                <div className="h-8 w-20 bg-gray-200 rounded"></div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }
    
    if(orders.length === 0){
        return (
            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Orders</CardTitle>
                        <CardDescription>No orders found</CardDescription>
    
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-12 text-gray-500">
                            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">No orders found</p>
                            <p className="text-sm">Orders will appear here when you make a purchase</p>
                        </div>
                    </CardContent>
    
                </Card>
            </div>
        );
    }
    
    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <Card key={order.orderId} className="hover:shadow-lg transition-shadow">
                    <CardContent className="">
                        <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                            {order.categoryName}
                                        </h3>
                                        <Badge 
                                            className={
                                                (order.status || '').toLowerCase() === 'completed' ? 'bg-green-100 text-green-700' :
                                                (order.status || '').toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                (order.status || '').toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                (order.status || '').toLowerCase() === 'processing' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-700'
                                            }
                                        >
                                            {order.status || 'Unknown'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="text-right">
                                            <div className="flex items-center text-lg font-bold text-green-600">
                                                <IndianRupee className="w-4 h-4" />
                                                {Number(order.amount || 0).toLocaleString('en-IN')}
                                            </div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Track Order
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <User className="w-4 h-4 mr-1" />
                                        <span>{order.userName}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Badge variant="secondary" className="text-xs">
                                            {order.type}
                                        </Badge>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between text-xs text-gray-400">
                                    <span>
                                        Order ID: #{order.orderId}
                                    </span>
                                    <span>
                                        Ordered: {new Date(order.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
