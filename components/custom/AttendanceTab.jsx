"use client";

import DateCalendar from "./DateCalendar"
import AttendanceDashboard from "./AttendanceDashboard"

export default function AttendanceTab({ 
    selectedDate, 
    setSelectedDate, 
    calendarOpen, 
    setCalendarOpen, 
    attendanceFilter, 
    setAttendanceFilter, 
    getAttendanceForDate, 
    filterAttendance, 
    updateStudentAttendance, 
    fetchAttendanceForDate 
}) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Calendar Section */}
            <div className="lg:col-span-1">
                <DateCalendar 
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    calendarOpen={calendarOpen}
                    setCalendarOpen={setCalendarOpen}
                />
            </div>

            {/* Main Dashboard Section */}
            <div className="lg:col-span-3">
                <AttendanceDashboard 
                    selectedDate={selectedDate}
                    attendanceFilter={attendanceFilter}
                    setAttendanceFilter={setAttendanceFilter}
                    getAttendanceForDate={getAttendanceForDate}
                    filterAttendance={filterAttendance}
                    updateStudentAttendance={updateStudentAttendance}
                    fetchAttendanceForDate={fetchAttendanceForDate}
                />
            </div>
        </div>
    );
}
