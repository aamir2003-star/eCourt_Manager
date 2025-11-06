// Frontend/src/pages/MyCalendar.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import api from '../services/api';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [hearingsRes, appointmentsRes] = await Promise.all([
          api.get('/api/cases/hearings/my'),
          api.get('/api/appointments')
        ]);

        const hearings = hearingsRes.data.data.map(hearing => ({
          title: `Hearing: ${hearing.case.case_title}`,
          start: new Date(hearing.hearing_date),
          end: new Date(hearing.hearing_date),
          allDay: true,
          resource: 'hearing'
        }));

        const appointments = appointmentsRes.data.data.map(appointment => ({
          title: `Appointment: ${appointment.client.f_name}`,
          start: new Date(appointment.date),
          end: new Date(appointment.date),
          allDay: true,
          resource: 'appointment'
        }));

        setEvents([...hearings, ...appointments]);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const eventStyleGetter = (event, start, end, isSelected) => {
    let style = {
      backgroundColor: event.resource === 'hearing' ? '#3174ad' : '#4caf50',
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    };
    return {
      style: style
    };
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ height: '500px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
};

export default MyCalendar;