import React, { useState } from "react";
import "./Summary.scss";

const Summary = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const cards = [
    {
      title: "Patient Requests Made",
      value: 42,
      note: "Total requests to other hospitals",
      icon: "📤",
    },
    {
      title: "Records Received",
      value: 38,
      note: "Patient data successfully retrieved",
      icon: "📥",
    },
    {
      title: "Requests Rejected",
      value: 4,
      note: "Access denied by remote hospital",
      icon: "❌",
    },
    {
      title: "PDF Reports Sent",
      value: 29,
      note: "Reports emailed to respective doctors",
      icon: "📄",
    },
  ];

  // Sample appointments data
  const todayAppointments = [
    { id: 1, patient: "Kshitij Ghodekar", time: "09:30 AM", type: "Follow-up" },
    { id: 2, patient: "Dr. Salim Saay", time: "11:15 AM", type: "Consultation" },
    { id: 3, patient: "Ashutosh", time: "02:00 PM", type: "Check-up" },
    { id: 4, patient: "Ameya Kale", time: "04:45 PM", type: "Follow-up" },
  ];

  // Function to render the days of the current month
  const renderCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    // Create array of days
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isCurrentDay = day === new Date().getDate() && 
                          month === new Date().getMonth() && 
                          year === new Date().getFullYear();
      
      days.push(
        <div 
          key={`day-${day}`} 
          className={`calendar-day ${isCurrentDay ? 'current-day' : ''}`}
          onClick={() => setSelectedDate(new Date(year, month, day))}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", 
                     "July", "August", "September", "October", "November", "December"];

  return (
    <div className="summaryContainer">
      <h2 className="summaryHeading">Doctor Overview</h2>
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
              <h3>{monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}</h3>
            </div>
            <div className="calendarWeekdays">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="weekday">{day}</div>
              ))}
            </div>
            <div className="calendarDays">
              {renderCalendarDays()}
            </div>
          </div>

          <div className="appointmentsList">
            <h3>Today's Appointments</h3>
            {todayAppointments.length > 0 ? (
              <ul>
                {todayAppointments.map(appointment => (
                  <li key={appointment.id} className="appointmentItem">
                    <div className="appointmentTime">{appointment.time}</div>
                    <div className="appointmentDetails">
                      <div className="appointmentPatient">{appointment.patient}</div>
                      <div className="appointmentType">{appointment.type}</div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="noAppointments">No appointments scheduled for today</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;