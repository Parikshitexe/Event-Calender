import { useRef, useState, useEffect, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEvents } from '../../hooks/useEvents';
import { useModal } from '../../hooks/useModal';
import CalendarToolbar from './CalendarToolbar';
import EventFormModal from '../EventForm/EventFormModal';

/**
 * Main calendar view component
 * Integrates FullCalendar with backend API and handles user interactions
 */
const CalendarView = () => {
  const calendarRef = useRef(null);
  const [currentDate, setCurrentDate] = useState('');
  const { events, loading, createEvent, updateEvent } = useEvents();
  const { 
    isOpen, 
    mode, 
    eventData, 
    selectedDate, 
    openCreateModal, 
    openEditModal, 
    closeModal 
  } = useModal();

  /**
   * Handle date click - opens create event modal with selected date
   * @param {Object} info - FullCalendar dateClick event info
   */
  const handleDateClick = (info) => {
    openCreateModal(info.date);
  };

  /**
   * Handle event click - opens edit event modal with event data
   * @param {Object} info - FullCalendar eventClick event info
   */
  const handleEventClick = (info) => {
    // Find the full event object from our events array
    const event = events.find((e) => e._id === info.event.id);
    if (event) {
      openEditModal(event);
    }
  };

  /**
   * Update date display - can be called manually or by event listener
   */
  const updateCurrentDate = useCallback(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi && calendarApi.view) {
      const view = calendarApi.view;
      setCurrentDate(view.title);
    }
  }, []);

  /**
   * Update current date display when calendar view changes
   */
  useEffect(() => {
    // Initial update after calendar renders
    const timer = setTimeout(() => {
      updateCurrentDate();
      
      // Set up listener after calendar is ready
      const calendarApi = calendarRef.current?.getApi();
      if (calendarApi) {
        // Remove any existing listener first to avoid duplicates
        calendarApi.off('datesSet', updateCurrentDate);
        // Add listener for view changes
        calendarApi.on('datesSet', updateCurrentDate);
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      const calendarApi = calendarRef.current?.getApi();
      if (calendarApi) {
        calendarApi.off('datesSet', updateCurrentDate);
      }
    };
  }, [updateCurrentDate]);

  /**
   * Format time for event display
   * Returns formatted time string or empty for all-day events
   */
  const formatEventTime = (startDate, allDay) => {
    if (allDay) return '';
    const date = new Date(startDate);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  /**
   * Transform backend events to FullCalendar format
   * FullCalendar expects events with id, title, start, end, allDay properties
   */
  const calendarEvents = events.map((event) => {
    const timeStr = formatEventTime(event.start, event.allDay);
    const displayTitle = timeStr ? `${timeStr} ${event.title}` : event.title;
    
    return {
      id: event._id,
      title: displayTitle,
      start: event.start,
      end: event.end,
      allDay: event.allDay,
      backgroundColor: event.allDay ? '#3b82f6' : '#10b981',
      borderColor: event.allDay ? '#2563eb' : '#059669',
    };
  });

  /**
   * Handle Add Event button click
   */
  const handleAddEvent = () => {
    openCreateModal(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading calendar...</div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
      <CalendarToolbar 
        calendarRef={calendarRef} 
        currentDate={currentDate}
        onAddEvent={handleAddEvent}
        onDateUpdate={updateCurrentDate}
      />
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={false} // We're using custom toolbar
          events={calendarEvents}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          height="auto"
          editable={false}
          selectable={false}
          dayMaxEvents={true}
          moreLinkClick="popover"
          displayEventTime={false}
        />
      </div>
      
      {/* Event Form Modal */}
      <EventFormModal
        isOpen={isOpen}
        mode={mode}
        eventData={eventData}
        selectedDate={selectedDate}
        onClose={closeModal}
        createEvent={createEvent}
        updateEvent={updateEvent}
      />
    </>
  );
};

export default CalendarView;

