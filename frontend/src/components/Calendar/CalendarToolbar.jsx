/**
 * Custom toolbar component for FullCalendar
 * Provides navigation buttons (Prev, Next, Today) and Add Event button
 * @param {Object} props
 * @param {Object} props.calendarRef - Reference to FullCalendar instance
 * @param {string} props.currentDate - Current month/year string to display
 * @param {Function} props.onAddEvent - Callback for Add Event button
 */
const CalendarToolbar = ({ calendarRef, currentDate, onAddEvent }) => {
  /**
   * Navigate to previous month
   */
  const handlePrev = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.prev();
    }
  };

  /**
   * Navigate to next month
   */
  const handleNext = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.next();
    }
  };

  /**
   * Navigate to today's date
   */
  const handleToday = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.today();
    }
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrev}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Prev
        </button>
        <button
          onClick={handleToday}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-medium"
        >
          Today
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Next
        </button>
        <span className="ml-4 text-lg font-semibold text-gray-700">
          {currentDate || 'Loading...'}
        </span>
      </div>
      <div>
        <button
          onClick={onAddEvent}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
        >
          Add Event
        </button>
      </div>
    </div>
  );
};

export default CalendarToolbar;

