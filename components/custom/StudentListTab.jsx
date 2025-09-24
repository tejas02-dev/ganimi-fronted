"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function StudentListTab({ 
    enrollments, 
    selectedDate, 
    updateStudentAttendance 
}) {
    return (
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
                    {enrollments.map((enrollment) => (
                        <div key={enrollment.studentId} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                            {/* Student Info */}
                            <div className="flex items-center gap-3">
                                <img
                                    src={enrollment.studentProfilePicture}
                                    alt={enrollment.studentName}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                />
                                <div>
                                    <p className="font-medium text-gray-900">{enrollment.studentName}</p>
                                    <p className="text-sm text-gray-500">Student ID: ST{enrollment.studentId.toString().padStart(3, '0')}</p>
                                </div>
                            </div>

                            {/* Attendance Toggle Buttons */}
                            <div className="flex gap-2">
                                <Button
                                    variant={enrollment.todaysAttendance?.status === 'present' ? 'default' : 'outline'}  
                                    size="sm"
                                    className={`min-w-[80px] ${
                                        enrollment.todaysAttendance?.status === 'present' 
                                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                                            : 'hover:bg-green-50 hover:text-green-700 hover:border-green-300'
                                    }`}
                                    onClick={() => {
                                        updateStudentAttendance(selectedDate, enrollment.studentId, 'present');
                                    }}
                                >
                                    Present
                                </Button>
                                <Button
                                    variant={enrollment.todaysAttendance?.status === 'absent' ? 'default' : 'outline'}
                                    size="sm"
                                    className={`min-w-[80px] ${
                                        enrollment.todaysAttendance?.status === 'absent' 
                                            ? 'bg-red-600 hover:bg-red-700 text-white' 
                                            : 'hover:bg-red-50 hover:text-red-700 hover:border-red-300'
                                    }`}
                                    onClick={() => {
                                        updateStudentAttendance(selectedDate, enrollment.studentId, 'absent');
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
    );
}
