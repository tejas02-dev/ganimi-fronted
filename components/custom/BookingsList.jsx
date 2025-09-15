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


export default function BookingsList({ refreshTrigger }) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    useEffect(() => {
        fetchBookings();
    }, [refreshTrigger, user.id]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5500/api/v1/bookings`, {
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                setBookings(Array.isArray(data.data) ? data.data : []);
            } else {
                toast.error("Failed to fetch bookings");
            }
        } catch (error) {
            toast.error("Error fetching bookings");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
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

    if (bookings.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Bookings</CardTitle>
                    <CardDescription>Customer appointments and scheduled services</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-gray-500">
                        <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">No bookings yet</p>
                        <p className="text-sm">Customer bookings will appear here</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return(
        <>
            <div className="space-y-4">
                {
                    bookings.map((booking) => (
                        <Card key={booking.bookingId} className="hover:shadow-lg transition-shadow">
                            <CardContent className="">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                    {booking.serviceName}
                                                </h3>
                                                <Badge 
                                                    className={
                                                        (booking.status || '').toLowerCase() === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                        (booking.status || '').toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        (booking.status || '').toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                        'bg-gray-100 text-gray-700'
                                                    }
                                                >
                                                    {booking.status || 'Unknown'}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="text-right">
                                                    <div className="flex items-center text-lg font-bold text-green-600">
                                                        <IndianRupee className="w-4 h-4" />
                                                        {Number(booking.servicePrice || 0).toLocaleString('en-IN')}
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
                                                            Update Status
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Cancel Booking
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <User className="w-4 h-4 mr-1" />
                                                <span>{booking.studentName}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 mr-1" />
                                                <span>{new Date(booking.bookingDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between text-xs text-gray-400">
                                            <span>
                                                Booking ID: #{booking.bookingId}
                                            </span>
                                            <span>
                                                Booked: {new Date(booking.createdAt || booking.bookingDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                }
            </div>
        </>
    )
}
