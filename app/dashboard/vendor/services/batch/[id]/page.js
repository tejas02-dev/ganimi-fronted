"use client";

import { Toaster } from "sonner"
import { toast } from "sonner"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import api from "@/lib/api"
import BatchOverview from "@/components/custom/BatchOverview"
import StudentListTab from "@/components/custom/StudentListTab"
import AttendanceTab from "@/components/custom/AttendanceTab"

export default function Batch() {
    const { id } = useParams();
    const [batch, setBatch] = useState(null);
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [attendanceFilter, setAttendanceFilter] = useState('all');
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [attendanceData, setAttendanceData] = useState({});
    const [enrollments, setEnrollments] = useState([]);
    const router = useRouter();


    // Get attendance for selected date
    const getAttendanceForDate = (date) => {
        const dateKey = getLocalDateString(date);
        return attendanceData[dateKey] || [];
    };

    // Helper function to get local date string (avoids timezone issues)
    const getLocalDateString = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Fetch attendance data for a specific date
    const fetchAttendanceForDate = async (date) => {
        try {
            const dateKey = getLocalDateString(date);
            const response = await api.get(`/attendance/batch/${batch.id}/date/${dateKey}`);
            const data = response.data;
            if(response.status === 200) {
                setAttendanceData(prev => ({
                    ...prev,
                    [dateKey]: data.data
                }));
            }
        } catch (error) {
            console.error("Error fetching attendance:", error);
            toast.error("Failed to fetch attendance data");
        }
    };

    // Filter attendance based on status
    const filterAttendance = (attendanceList, filter) => {
        if (filter === 'all') return attendanceList;
        return attendanceList.filter(student => {
            const status = student.todaysAttendance?.status;
            if (filter === 'present') return status === 'present';
            if (filter === 'absent') return status === 'absent' || status === null;
            return true;
        });
    };

    // Calculate attendance stats
    const calculateStats = (attendanceList) => {
        const total = attendanceList.length;
        const present = attendanceList.filter(s => s.todaysAttendance?.status === 'present').length;
        const absent = attendanceList.filter(s => s.todaysAttendance?.status === 'absent' || s.todaysAttendance === null).length;
        const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;
        
        return { total, present, absent, attendanceRate };
    }

    // Update student attendance for a specific date
    const updateStudentAttendance = async (date, studentId, status) => {
        try {
            const dateKey = getLocalDateString(date);
            const response = await api.put(`/attendance/batch/${batch.id}/mark`, {
                date: dateKey,
                studentId: studentId,
                status: status
            });
            
            if (response.status === 200) {
                toast.success(`Marked student as ${status}`);
                // Update the attendance data locally
                setEnrollments(prev => prev.map(enrollment => 
                    enrollment.studentId === studentId || enrollment.id === studentId
                        ? { ...enrollment, todaysAttendance: { ...enrollment.todaysAttendance, status: status } }
                        : enrollment
                ));
                setAttendanceData(prev => ({
                    ...prev,
                    [dateKey]: prev[dateKey]?.map(student => 
                        student.studentId === studentId || student.id === studentId
                            ? { ...student, todaysAttendance: { ...student.todaysAttendance, status: status } }
                            : student
                    ) || []
                }));
            }
        } catch (error) {
            console.error("Error updating attendance:", error);
            toast.error("Failed to update attendance");
        }
    };

    const fetchEnrollments = async (batchId) => {
        try{
            const response = await api.get(`/enrollment/batch/${batchId}`);
            const data = response.data;
            if(response.status === 200) {
                setEnrollments(data.data);
            }
        }catch(error)
        {
            console.error(error);
        }
    }

    const fetchBatch = async (id) => {
        try{
            const response = await api.get(`/batches/${id}`);
            const data = response.data;
            if(response.status === 200) {
                setBatch(data.data);
            }
        }catch(error)
        {
            console.error(error);
        }
    }

    const fetchService = async (serviceId) => {
        try{
            const response = await api.get(`/services/${serviceId}`);
            const data = response.data;
            if(response.status === 200) {
                setService(data.data);
            }
        }catch(error)
        {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchBatch(id)
    }, [id])

    useEffect(() => {
        if (batch?.id) {
            fetchEnrollments(batch.id)
        }
    }, [batch])

    useEffect(() => {
        if (batch?.serviceId) {
            fetchService(batch.serviceId)
        }
    }, [batch])

    useEffect(() => {
        if (batch?.id && selectedDate) {
            fetchAttendanceForDate(selectedDate)
        }
    }, [batch?.id, selectedDate])

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
                    <BatchOverview 
                        batch={batch}
                        service={service}
                        onBackToService={() => router.push(`/dashboard/vendor/services/${service?.id}`)}
                        onEdit={() => router.push(`/dashboard/vendor/services/${service?.id}#edit-${batch.id}`)}
                    />

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
                                <StudentListTab 
                                    enrollments={enrollments}
                                    selectedDate={selectedDate}
                                    updateStudentAttendance={updateStudentAttendance}
                                />
                            </TabsContent>

                            <TabsContent value="attendance">
                                <AttendanceTab 
                                    selectedDate={selectedDate}
                                    setSelectedDate={setSelectedDate}
                                    calendarOpen={calendarOpen}
                                    setCalendarOpen={setCalendarOpen}
                                    attendanceFilter={attendanceFilter}
                                    setAttendanceFilter={setAttendanceFilter}
                                    getAttendanceForDate={getAttendanceForDate}
                                    filterAttendance={filterAttendance}
                                    updateStudentAttendance={updateStudentAttendance}
                                    fetchAttendanceForDate={fetchAttendanceForDate}
                                />
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
