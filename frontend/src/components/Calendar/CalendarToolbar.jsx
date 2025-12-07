/**
 * Custom toolbar component for FullCalendar
 * Provides navigation buttons (Prev, Next, Today) and Add Event button
 * @param {Object} props
 * @param {Object} props.calendarRef - Reference to FullCalendar instance
 * @param {string} props.currentDate - Current month/year string to display
 * @param {Function} props.onAddEvent - Callback for Add Event button
 * @param {Function} props.onDateUpdate - Callback to manually trigger date update
 */
const CalendarToolbar = ({ calendarRef, currentDate, onAddEvent, onDateUpdate }) => {
  /**
   * Navigate to previous month
   */
  const handlePrev = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.prev();
      // Manually trigger date update after navigation
      setTimeout(() => {
        if (onDateUpdate) onDateUpdate();
      }, 50);
    }
  };

  /**
   * Navigate to next month
   */
  const handleNext = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.next();
      // Manually trigger date update after navigation
      setTimeout(() => {
        if (onDateUpdate) onDateUpdate();
      }, 50);
    }
  };

  /**
   * Navigate to today's date
   */
  const handleToday = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.today();
      // Manually trigger date update after navigation
      setTimeout(() => {
        if (onDateUpdate) onDateUpdate();
      }, 50);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handlePrev}
          className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
          aria-label="Previous month"
        >
          Prev
        </button>
        <button
          onClick={handleToday}
          className="px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-medium text-sm"
          aria-label="Go to today"
        >
          Today
        </button>
        <button
          onClick={handleNext}
          className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
          aria-label="Next month"
        >
          Next
        </button>
        <span className="ml-2 sm:ml-4 text-base sm:text-lg font-semibold text-gray-700">
          {currentDate || ''}
        </span>
      </div>
      <div>
        <button
          onClick={onAddEvent}
          className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium text-sm"
          aria-label="Add new event"
        >
          Add Event
        </button>
      </div>
    </div>
  );
};

export default CalendarToolbar;

