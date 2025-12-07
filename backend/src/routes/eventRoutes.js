import express from 'express';
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController.js';
import { validateEvent } from '../middleware/validateEvent.js';

const router = express.Router();

/**
 * Event Routes
 * Base path: /api/events
 */

// GET /api/events - Get all events
router.get('/', getEvents);

// POST /api/events - Create a new event
router.post('/', validateEvent, createEvent);

// PUT /api/events/:id - Update an event
router.put('/:id', validateEvent, updateEvent);

// DELETE /api/events/:id - Delete an event
router.delete('/:id', deleteEvent);

export default router;

