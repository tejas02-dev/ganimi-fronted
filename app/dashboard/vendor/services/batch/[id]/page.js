"use client";

import { Toaster } from "sonner"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Loader2, Pencil, Calendar, Clock, Users, MapPin, IndianRupee, Tag, TrendingUp, TrendingDown, BarChart3, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"


export default function Batch() {
    const { id } = useParams();
    const [batch, setBatch] = useState(null);
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [attendanceFilter, setAttendanceFilter] = useState('all');
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [attendanceData, setAttendanceData] = useState({});
    const router = useRouter();

    // Helper function to convert 24-hour to 12-hour format
    const formatTime = (time24) => {
        if (!time24) return 'Not set';
        const [hours, minutes] = time24.split(':');
        const hour24 = parseInt(hours);
        const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
        const period = hour24 < 12 ? 'AM' : 'PM';
        return `${hour12}:${minutes} ${period}`;
    };

    // Helper function to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Helper function to format date with short month
    const formatDateShort = (dateString) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    // Dummy attendance data for different dates
    const generateAttendanceData = () => {
        const students = [
            { id: 1, name: "Aarav Sharma", image: "https://randomuser.me/api/portraits/men/32.jpg" },
            { id: 2, name: "Isha Patel", image: "https://randomuser.me/api/portraits/women/44.jpg" },
            { id: 3, name: "Rohan Mehta", image: "https://randomuser.me/api/portraits/men/65.jpg" },
            { id: 4, name: "Priya Singh", image: "https://randomuser.me/api/portraits/women/68.jpg" },
            { id: 5, name: "Arjun Kumar", image: "https://randomuser.me/api/portraits/men/75.jpg" },
            { id: 6, name: "Sneha Reddy", image: "https://randomuser.me/api/portraits/women/82.jpg" }
        ];

        const attendanceRecords = {};
        const today = new Date();
        
        // Generate attendance for last 30 days
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateKey = date.toISOString().split('T')[0];
            
            attendanceRecords[dateKey] = students.map(student => ({
                ...student,
                status: Math.random() > 0.15 ? 'present' : 'absent'
            }));
        }
        
        return attendanceRecords;
    };

    // Initialize attendance data on component mount
    useEffect(() => {
        setAttendanceData(generateAttendanceData());
    }, []);

    // Get attendance for selected date
    const getAttendanceForDate = (date) => {
        const dateKey = date.toISOString().split('T')[0];
        return attendanceData[dateKey] || [];
    };

    // Update student attendance status
    const updateStudentAttendance = (date, studentId, newStatus) => {
        const dateKey = date.toISOString().split('T')[0];
        setAttendanceData(prev => ({
            ...prev,
            [dateKey]: prev[dateKey]?.map(student => 
                student.id === studentId 
                    ? { ...student, status: newStatus }
                    : student
            ) || []
        }));
    };

    // Calculate attendance stats
    const calculateStats = (attendanceList) => {
        const total = attendanceList.length;
        const present = attendanceList.filter(s => s.status === 'present').length;
        const absent = attendanceList.filter(s => s.status === 'absent').length;
        const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;
        
        return { total, present, absent, attendanceRate };
    };

    // Filter attendance based on selected filter
    const filterAttendance = (attendanceList, filter) => {
        if (filter === 'all') return attendanceList;
        return attendanceList.filter(student => student.status === filter);
    };


    const fetchBatch = async (id) => {
        try{
            const response = await fetch(`http://localhost:5500/api/v1/batches/${id}`, {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "GET",
                credentials: "include"
            })
            const data = await response.json()
            setBatch(data.data)
        } catch (error) {
            console.error(error)
        }
    }

    
    const fetchService = async (serviceId) => {
        try{
            const response = await fetch(`http://localhost:5500/api/v1/services/${serviceId}`, {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "GET",
                credentials: "include"
            })
            const data = await response.json()
            setService(data.data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchBatch(id)
    }, [id])

    useEffect(() => {
        if (batch?.serviceId) {
            fetchService(batch.serviceId)
        }
    }, [batch])

    return (
        <div className="p-4 sm:p-6 lg:p-10">
        <Toaster />
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard/vendor/services">Services</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/vendor/services/${service?.id}`}>{service?.name}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>{batch?.name}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>

        {loading ? (
                <Card className="w-full mt-6">
                    <CardHeader>
                        <div className="flex justify-center items-center py-8">
                            <Loader2 className="animate-spin w-6 h-6 mr-2" />
                            <span>Loading service details...</span>
                        </div>
                    </CardHeader>
                </Card>
            ) : batch ? (
                <>
                <div className="mt-6">
                    {/* Compact Batch Overview */}
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
                                        onClick={() => router.push(`/dashboard/vendor/services/${service?.id}`)}
                                    >
                                        Back to Service
                                    </Button>
                                    <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => {
                                            router.push(`/dashboard/vendor/services/${service?.id}#edit-${batch.id}`);
                                        }}
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

                    {/* Students and Attendance Section Placeholder */}
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="text-lg">Students & Attendance Management</CardTitle>
                            <CardDescription>Manage students enrolled in this batch and track attendance</CardDescription>
                        </CardHeader>
                        <CardContent>
                           
                        {/* Tabs for Students & Attendance */}
                        <Tabs defaultValue="students" className="w-full">
                            <TabsList className="w-full mb-4">
                                <TabsTrigger value="students">Student List</TabsTrigger>
                                <TabsTrigger value="attendance">Attendance Monitoring</TabsTrigger>
                            </TabsList>
                            <TabsContent value="students">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle>Students</CardTitle>
                                                <CardDescription>Search and manage students in this batch</CardDescription>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-gray-900">Today's Attendance</p>
                                                <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}</p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center mb-4 gap-2">
                                            <Input
                                                placeholder="Search students..."
                                                className="max-w-xs"
                                            />
                                            <Button variant="outline" size="sm" className="ml-auto">
                                                Mark All Present
                                            </Button>
                                        </div>
                                        <div className="space-y-3">
                                                {[
                                                    {
                                                        id: 1,
                                                        name: "Aarav Sharma",
                                                        image: "https://randomuser.me/api/portraits/men/32.jpg",
                                                        status: "present",
                                                    },
                                                    {
                                                        id: 2,
                                                        name: "Isha Patel",
                                                        image: "https://randomuser.me/api/portraits/women/44.jpg",
                                                        status: "absent",
                                                    },
                                                    {
                                                        id: 3,
                                                        name: "Rohan Mehta",
                                                        image: "https://randomuser.me/api/portraits/men/65.jpg",
                                                        status: "present",
                                                    },
                                                    {
                                                        id: 4,
                                                        name: "Priya Singh",
                                                        image: "https://randomuser.me/api/portraits/women/68.jpg",
                                                        status: "present",
                                                    },
                                                ].map((student) => (
                                                <div key={student.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                                    {/* Student Info */}
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={student.image}
                                                            alt={student.name}
                                                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                                        />
                                                        <div>
                                                            <p className="font-medium text-gray-900">{student.name}</p>
                                                            <p className="text-sm text-gray-500">Student ID: ST{student.id.toString().padStart(3, '0')}</p>
                                                        </div>
                                                    </div>

                                                    {/* Attendance Toggle Buttons */}
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant={student.status === 'present' ? 'default' : 'outline'}
                                                            size="sm"
                                                            className={`min-w-[80px] ${
                                                                student.status === 'present' 
                                                                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                                                                    : 'hover:bg-green-50 hover:text-green-700 hover:border-green-300'
                                                            }`}
                                                            onClick={() => {
                                                                // Handle present toggle
                                                                console.log(`Mark ${student.name} as present`);
                                                            }}
                                                        >
                                                            Present
                                                        </Button>
                                                        <Button
                                                            variant={student.status === 'absent' ? 'default' : 'outline'}
                                                            size="sm"
                                                            className={`min-w-[80px] ${
                                                                student.status === 'absent' 
                                                                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                                                                    : 'hover:bg-red-50 hover:text-red-700 hover:border-red-300'
                                                            }`}
                                                            onClick={() => {
                                                                // Handle absent toggle
                                                                console.log(`Mark ${student.name} as absent`);
                                                            }}
                                                        >
                                                            Absent
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="attendance">
                                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                    {/* Calendar Section */}
                                    <div className="lg:col-span-1">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <Calendar className="w-5 h-5" />
                                                    Select Date
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    {/* Calendar Component */}
                                                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                className="w-full justify-start text-left font-normal"
                                                            >
                                                                <Calendar className="mr-2 h-4 w-4" />
                                                                {selectedDate.toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric'
                                                                })}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <CalendarComponent
                                                                mode="single"
                                                                selected={selectedDate}
                                                                onSelect={(date) => {
                                                                    if (date) {
                                                                        setSelectedDate(date);
                                                                        setCalendarOpen(false);
                                                                    }
                                                                }}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    
                                                    {/* Quick Date Buttons */}
                                                    <div className="space-y-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full justify-start"
                                                            onClick={() => setSelectedDate(new Date())}
                                                        >
                                                            Today
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full justify-start"
                                                            onClick={() => {
                                                                const yesterday = new Date();
                                                                yesterday.setDate(yesterday.getDate() - 1);
                                                                setSelectedDate(yesterday);
                                                            }}
                                                        >
                                                            Yesterday
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full justify-start"
                                                            onClick={() => {
                                                                const lastWeek = new Date();
                                                                lastWeek.setDate(lastWeek.getDate() - 7);
                                                                setSelectedDate(lastWeek);
                                                            }}
                                                        >
                                                            Last Week
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Main Dashboard Section */}
                                    <div className="lg:col-span-3">
                                        <div className="space-y-6">
                                            {/* Date Header & Stats */}
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        Attendance for {selectedDate.toLocaleDateString('en-US', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        Review and manage attendance records
                                                    </p>
                                                </div>

                                                {/* Filter Buttons */}
                                                <div className="flex gap-2">
                                                    {['all', 'present', 'absent'].map((filter) => (
                                                        <Button
                                                            key={filter}
                                                            variant={attendanceFilter === filter ? 'default' : 'outline'}
                                                            size="sm"
                                                            onClick={() => setAttendanceFilter(filter)}
                                                            className="capitalize"
                                                        >
                                                            {filter}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Stats Cards */}
                                            {(() => {
                                                const attendanceList = getAttendanceForDate(selectedDate);
                                                const stats = calculateStats(attendanceList);
                                                return (
                                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                        <Card>
                                                            <CardContent className="p-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="p-2 bg-blue-100 rounded-lg">
                                                                        <Users className="w-5 h-5 text-blue-600" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm text-gray-500">Total Students</p>
                                                                        <p className="text-xl font-bold text-gray-900">{stats.total}</p>
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                        
                                                        <Card>
                                                            <CardContent className="p-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="p-2 bg-green-100 rounded-lg">
                                                                        <TrendingUp className="w-5 h-5 text-green-600" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm text-gray-500">Present</p>
                                                                        <p className="text-xl font-bold text-green-600">{stats.present}</p>
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                        
                                                        <Card>
                                                            <CardContent className="p-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="p-2 bg-red-100 rounded-lg">
                                                                        <TrendingDown className="w-5 h-5 text-red-600" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm text-gray-500">Absent</p>
                                                                        <p className="text-xl font-bold text-red-600">{stats.absent}</p>
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                        
                                                        <Card>
                                                            <CardContent className="p-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="p-2 bg-blue-100 rounded-lg">
                                                                        <BarChart3 className="w-5 h-5 text-blue-600" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm text-gray-500">Attendance Rate</p>
                                                                        <p className="text-xl font-bold text-blue-600">{stats.attendanceRate}%</p>
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </div>
                                                );
                                            })()}

                                            {/* Student Attendance List */}
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-lg">Student Attendance</CardTitle>
                                                    <CardDescription>
                                                        Detailed attendance status for the selected date
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    {(() => {
                                                        const attendanceList = getAttendanceForDate(selectedDate);
                                                        const filteredList = filterAttendance(attendanceList, attendanceFilter);
                                                        
                                                        if (filteredList.length === 0) {
                                                            return (
                                                                <div className="text-center py-8 text-gray-500">
                                                                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                                                    <p>No attendance records found for this date and filter.</p>
                                                                </div>
                                                            );
                                                        }

                                                        return (
                                                            <div className="space-y-3">
                                                                {filteredList.map((student) => (
                                                                    <div key={student.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                                                        {/* Student Info */}
                                                                        <div className="flex items-center gap-3">
                                                                            <img
                                                                                src={student.image}
                                                                                alt={student.name}
                                                                                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                                                            />
                                                                            <div>
                                                                                <p className="font-medium text-gray-900">{student.name}</p>
                                                                                <p className="text-sm text-gray-500">Student ID: ST{student.id.toString().padStart(3, '0')}</p>
                                                                            </div>
                                                                        </div>

                                                                        {/* Attendance Toggle Buttons */}
                                                                        <div className="flex gap-2">
                                                                            <Button
                                                                                variant={student.status === 'present' ? 'default' : 'outline'}
                                                                                size="sm"
                                                                                className={`min-w-[70px] ${
                                                                                    student.status === 'present' 
                                                                                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                                                                                        : 'hover:bg-green-50 hover:text-green-700 hover:border-green-300'
                                                                                }`}
                                                                                onClick={() => updateStudentAttendance(selectedDate, student.id, 'present')}
                                                                            >
                                                                                Present
                                                                            </Button>
                                                                            <Button
                                                                                variant={student.status === 'absent' ? 'default' : 'outline'}
                                                                                size="sm"
                                                                                className={`min-w-[70px] ${
                                                                                    student.status === 'absent' 
                                                                                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                                                                                        : 'hover:bg-red-50 hover:text-red-700 hover:border-red-300'
                                                                                }`}
                                                                                onClick={() => updateStudentAttendance(selectedDate, student.id, 'absent')}
                                                                            >
                                                                                Absent
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        );
                                                    })()}
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                        </CardContent>
                    </Card>
                </div>
                </>
            ) : (
                <div className="flex justify-center items-center py-8">
                    <span>No batch found</span>
                </div>
            )}
        </div>
    )
}
