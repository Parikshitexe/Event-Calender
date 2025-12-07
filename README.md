# Event Calendar
A full-stack event calendar application built with React, Node.js, Express, and MongoDB.

## Project Structure

```
Event-Calendar/
├── frontend/          # React + Vite + TailwindCSS
└── backend/          # Node.js + Express + MongoDB
```

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **ODM**: Mongoose

### Frontend (Phase 2)
- **Framework**: React (Vite)
- **Styling**: TailwindCSS
- **Calendar**: FullCalendar
- **HTTP Client**: Axios

## Backend Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)

### Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```


### Running the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will run on `http://localhost:5000`

**What the App Does**

- Shows a monthly calendar using FullCalendar

- Lets users create, edit, and delete events

- Supports all-day and timed events

- Clicking a date instantly opens the event form

- Events update without reloading the page

