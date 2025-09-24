"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"

export default function AttendanceDashboard({ 
    selectedDate, 
    attendanceFilter, 
    setAttendanceFilter, 
    getAttendanceForDate, 
    filterAttendance, 
    updateStudentAttendance, 
    fetchAttendanceForDate 
}) {
    return (
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

            {/* Stats Cards Placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Stats cards are commented out in original - keeping placeholder */}
            </div>

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
                                    <Button 
                                        onClick={() => fetchAttendanceForDate(selectedDate)}
                                        variant="outline"
                                        className="mt-4"
                                    >
                                        Refresh Attendance
                                    </Button>
                                </div>
                            );
                        }

                        return (
                            <div className="space-y-3">
                                {filteredList.map((student, index) => (
                                    <div key={student.studentId || student.enrollmentId || index} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                        {/* Student Info */}
                                        <div className="flex items-center gap-3">
                                            {student.studentProfilePicture || student.user?.profilePicture ? (
                                                <img
                                                    src={student.studentProfilePicture || student.user?.profilePicture}
                                                    alt={student.studentName || student.user?.name}
                                                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}
                                            <div 
                                                className={`w-10 h-10 rounded-full border-2 border-gray-200 bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm ${
                                                    student.studentProfilePicture || student.user?.profilePicture ? 'hidden' : 'flex'
                                                }`}
                                            >
                                                {(student.studentName || student.user?.name)?.charAt(0)?.toUpperCase() || 'S'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{student.studentName || student.user?.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {student.studentEmail || student.user?.email}
                                                </p>
                                                {student.studentId && (
                                                    <p className="text-xs text-gray-400">ID: {student.studentId}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Attendance Toggle Buttons */}
                                        <div className="flex gap-2">
                                            <Button
                                                variant={student.todaysAttendance?.status === 'present' ? 'default' : 'outline'}
                                                 size="sm"
                                                 className={`min-w-[70px] ${
                                                     student.todaysAttendance?.status === 'present' 
                                                         ? 'bg-green-600 hover:bg-green-700 text-white' 
                                                         : 'hover:bg-green-50 hover:text-green-700 hover:border-green-300'
                                                 }`}
                                                onClick={() => updateStudentAttendance(selectedDate, student.enrollmentId || student.studentId, 'present')}
                                            >
                                                Present
                                            </Button>
                                            <Button
                                                variant={student.todaysAttendance?.status === 'absent' ? 'default' : 'outline'}
                                                 size="sm"
                                                 className={`min-w-[70px] ${
                                                     student.todaysAttendance?.status === 'absent' 
                                                         ? 'bg-red-600 hover:bg-red-700 text-white' 
                                                         : 'hover:bg-red-50 hover:text-red-700 hover:border-red-300'
                                                 }`}
                                                onClick={() => updateStudentAttendance(selectedDate, student.enrollmentId || student.studentId, 'absent')}
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
    );
}
