"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Calendar, Clock, Users, IndianRupee, Tag } from "lucide-react"

export default function BatchOverview({ batch, service, onBackToService, onEdit }) {
    // Helper function to convert 24-hour to 12-hour format
    const formatTime = (time24) => {
        if (!time24) return 'Not set';
        const [hours, minutes] = time24.split(':');
        const hour24 = parseInt(hours);
        const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
        const period = hour24 < 12 ? 'AM' : 'PM';
        return `${hour12}:${minutes} ${period}`;
    };

    // Helper function to format date with short month
    const formatDateShort = (dateString) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Card className="w-full mb-6 gap-0">
            <CardHeader className="">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl font-bold text-gray-900">
                                {batch.name}
                            </CardTitle>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                                {batch.status || 'Active'}
                            </Badge>
                        </div>
                        <CardDescription className="text-gray-600 mb-3">
                            Part of <span className="font-medium text-blue-600">{service?.name}</span> service
                        </CardDescription>
                    </div>
                    
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onBackToService}
                        >
                            Back to Service
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            onClick={onEdit}
                            className="bg-primary hover:bg-primary/50"
                        >
                            <Pencil className="w-4 h-4 mr-1" />
                            Edit
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                {/* Compact Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <IndianRupee className="w-4 h-4 text-green-600" />
                        <div>
                            <p className="text-xs text-gray-500">Price</p>
                            <p className="font-semibold text-green-600">₹{batch.price}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <div>
                            <p className="text-xs text-gray-500">Capacity</p>
                            <p className="font-medium">{batch.capacity} students</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-purple-600" />
                        <div>
                            <p className="text-xs text-gray-500">Age Group</p>
                            <p className="font-medium">{batch.ageGroup}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <div>
                            <p className="text-xs text-gray-500">Time</p>
                            <p className="font-medium">{formatTime(batch.startTime)} - {formatTime(batch.endTime)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-red-600" />
                        <div>
                            <p className="text-xs text-gray-500">Duration</p>
                            <p className="font-medium">{formatDateShort(batch.startDate)} - {formatDateShort(batch.endDate)}</p>
                        </div>
                    </div>
                    <div className="col-span-2 md:col-span-2 lg:col-span-1">
                        <p className="text-xs text-gray-500 mb-1">Days</p>
                        <div className="flex flex-wrap gap-1">
                            {(batch.daysOfWeek || '').split(', ').filter(day => day).map((day, index) => (
                                <Badge key={index} variant="secondary" className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5">
                                    {day.substring(0, 3)}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
