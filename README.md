# Event Calendar - Full Stack Application

A full-stack event calendar application built with React, Node.js, Express, and MongoDB.

## Project Structure

```
Event-Calendar/
├── frontend/          # React + Vite + TailwindCSS (to be added)
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

4. Update `.env` with your MongoDB connection string:
```
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=5000
FRONTEND_URL=http://localhost:5173
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

## API Endpoints

Base URL: `http://localhost:5000/api/events`

### Get All Events
```
GET /api/events
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 2
}
```

### Create Event
```
POST /api/events
```

**Request Body:**
```json
{
  "title": "Meeting",
  "description": "Project kickoff",
  "start": "2025-01-10T10:00:00.000Z",
  "end": "2025-01-10T11:00:00.000Z",
  "allDay": false
}
```

### Update Event
```
PUT /api/events/:id
```

**Request Body:** (same as create, all fields optional)

### Delete Event
```
DELETE /api/events/:id
```

## Event Model

```javascript
{
  "_id": "ObjectId",
  "title": "String (required, 1-100 chars)",
  "description": "String (optional, max 500 chars)",
  "start": "Date (required, UTC)",
  "end": "Date (required, UTC, must be after start)",
  "allDay": "Boolean (default: false)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Development Phases

- ✅ **Phase 1**: Backend foundation (Current)
- ⏳ **Phase 2**: Frontend setup and calendar integration
- ⏳ **Phase 3**: Event creation and form
- ⏳ **Phase 4**: Event editing and deletion
- ⏳ **Phase 5**: Polish and deployment

## Notes

- All dates are stored in UTC format
- All-day events are normalized to 00:00 UTC
- CORS is configured for frontend development
- Error handling is implemented with consistent response format

