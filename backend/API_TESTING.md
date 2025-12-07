# API Testing Guide

This document provides examples for testing the Event Calendar API endpoints.

## Prerequisites

1. Start the backend server:
```bash
cd backend
npm install
npm run dev
```

2. Ensure MongoDB connection is configured in `.env` file

3. Use Postman, Thunder Client (VS Code), or curl to test endpoints

## Base URL
```
http://localhost:5000
```

## Endpoints

### 1. Health Check
**GET** `/health`

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-01-10T10:00:00.000Z"
}
```

---

### 2. Get All Events
**GET** `/api/events`

**Response:**
```json
{
  "success": true,
  "data": [],
  "count": 0
}
```

---

### 3. Create Event
**POST** `/api/events`

**Request Body:**
```json
{
  "title": "Team Meeting",
  "description": "Weekly standup",
  "start": "2025-01-15T10:00:00.000Z",
  "end": "2025-01-15T11:00:00.000Z",
  "allDay": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "title": "Team Meeting",
    "description": "Weekly standup",
    "start": "2025-01-15T10:00:00.000Z",
    "end": "2025-01-15T11:00:00.000Z",
    "allDay": false,
    "createdAt": "2025-01-10T10:00:00.000Z",
    "updatedAt": "2025-01-10T10:00:00.000Z"
  }
}
```

**All-Day Event Example:**
```json
{
  "title": "Holiday",
  "description": "New Year",
  "start": "2025-01-01T00:00:00.000Z",
  "end": "2025-01-01T00:00:00.000Z",
  "allDay": true
}
```

---

### 4. Update Event
**PUT** `/api/events/:id`

Replace `:id` with the actual MongoDB `_id` from the created event.

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Meeting",
  "description": "Changed description",
  "start": "2025-01-15T14:00:00.000Z",
  "end": "2025-01-15T15:00:00.000Z",
  "allDay": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "title": "Updated Meeting",
    ...
  }
}
```

---

### 5. Delete Event
**DELETE** `/api/events/:id`

Replace `:id` with the actual MongoDB `_id`.

**Response:**
```json
{
  "success": true,
  "message": "Event deleted successfully",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    ...
  }
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "error": "Title is required"
}
```

### Not Found (404)
```json
{
  "success": false,
  "error": "Event not found"
}
```

### Invalid ID Format (400)
```json
{
  "success": false,
  "error": "Invalid event ID format"
}
```

---

## Testing with cURL

### Create Event
```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Event",
    "description": "This is a test",
    "start": "2025-01-20T10:00:00.000Z",
    "end": "2025-01-20T11:00:00.000Z",
    "allDay": false
  }'
```

### Get All Events
```bash
curl http://localhost:5000/api/events
```

### Update Event
```bash
curl -X PUT http://localhost:5000/api/events/YOUR_EVENT_ID \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title"
  }'
```

### Delete Event
```bash
curl -X DELETE http://localhost:5000/api/events/YOUR_EVENT_ID
```

---

## Test Scenarios

1. ✅ Create event with all fields
2. ✅ Create event with only required fields
3. ✅ Create all-day event
4. ✅ Get all events
5. ✅ Update event (partial update)
6. ✅ Update event (full update)
7. ✅ Delete event
8. ❌ Create event without title (should fail)
9. ❌ Create event with end before start (should fail)
10. ❌ Update non-existent event (should return 404)
11. ❌ Delete non-existent event (should return 404)

