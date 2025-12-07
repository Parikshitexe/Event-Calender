import CalendarView from './components/Calendar/CalendarView'
import ErrorBoundary from './components/common/ErrorBoundary'
import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Event Calendar</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your events with ease</p>
          </header>
          <CalendarView />
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default App
