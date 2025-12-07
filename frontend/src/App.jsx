import { useState } from 'react'
import CalendarView from './components/Calendar/CalendarView'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Event Calendar</h1>
        <CalendarView />
      </div>
    </div>
  )
}

export default App
