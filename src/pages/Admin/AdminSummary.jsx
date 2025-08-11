import React, { useState, useEffect } from "react";
import "./AdminSummary.scss";
import { getAccessLogs, getFabricLogs } from "../../services/api";

const AdminSummary = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [accessLogCount, setAccessLogCount] = useState(0);
  const [fabricLogCount, setFabricLogCount] = useState(0);

  useEffect(() => {
    fetchLogsData();
  }, []);

  const fetchLogsData = async () => {
    try {
      const [accessLogsResponse, fabricLogsResponse] = await Promise.all([
        getAccessLogs(),
        getFabricLogs(),
        
      ]);

      setAccessLogCount(accessLogsResponse?.data?.totalLogs || 0);
      setFabricLogCount(fabricLogsResponse?.data[0]?.id || 0);
    } catch (error) {
      console.error("Error fetching logs data:", error);
    }
  };

  const cards = [
    { title: "Total Doctors", value: 12, note: "Active registered doctors", icon: "👨‍⚕️" },
    { title: "Total Patients", value: 124, note: "Records in the system", icon: "🧍‍♂️" },
    { title: "Access Logs", value: accessLogCount, note: "Total access events", icon: "📜" },
    { title: "Fabric Logs", value: fabricLogCount, note: "Blockchain transactions", icon: "⛓️" },
    { title: "Pending Requests", value: 3, note: "Awaiting admin approval", icon: "⏳" },
  ];

  const latestLogs = [
    { id: 1, action: "Doctor Login", user: "Dr. Kshitj Ghodekar", time: "09:15 AM" },
    { id: 2, action: "Patient Record Access", user: "Dr. Darshit", time: "10:30 AM" },
    { id: 3, action: "Fabric Transaction", user: "System", time: "11:45 AM" },
    { id: 4, action: "User Blocked", user: "Admin", time: "12:10 PM" },
  ];

  const renderCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isCurrentDay =
        day === new Date().getDate() &&
        month === new Date().getMonth() &&
        year === new Date().getFullYear();

      days.push(
        <div
          key={`day-${day}`}
          className={`calendar-day ${isCurrentDay ? "current-day" : ""}`}
          onClick={() => setSelectedDate(new Date(year, month, day))}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="summaryContainer">
      <h2 className="summaryHeading">Admin Dashboard</h2>
      <div className="summaryContent">
        <div className="summaryGrid">
          {cards.map((card, index) => (
            <div className="summaryCard" key={index}>
              <div className="summaryIcon">{card.icon}</div>
              <div className="summaryValue">{card.value}</div>
              <div className="summaryTitle">{card.title}</div>
              <div className="summaryNote">{card.note}</div>
            </div>
          ))}
        </div>

        <div className="calendarSection">
          <div className="calendarContainer">
            <div className="calendarHeader">
              <h3>
                {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
              </h3>
            </div>
            <div className="calendarWeekdays">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="weekday">
                  {day}
                </div>
              ))}
            </div>
            <div className="calendarDays">{renderCalendarDays()}</div>
          </div>

          {/* Latest Logs */}
          <div className="appointmentsList">
            <h3>Recent Logs</h3>
            {latestLogs.length > 0 ? (
              <ul>
                {latestLogs.map((log) => (
                  <li key={log.id} className="appointmentItem">
                    <div className="appointmentTime">{log.time}</div>
                    <div className="appointmentDetails">
                      <div className="appointmentPatient">{log.action}</div>
                      <div className="appointmentType">{log.user}</div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="noAppointments">No recent logs</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSummary;
