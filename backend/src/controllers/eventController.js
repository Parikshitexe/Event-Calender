import Event from '../models/Event.js';

/**
 * Get all events
 * Returns all events from the database
 */
export const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find().sort({ start: 1 });
    res.json({
      success: true,
      data: events,
      count: events.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new event
 * Validates and saves a new event to the database
 */
export const createEvent = async (req, res, next) => {
  try {
    const { title, description, start, end, allDay } = req.body;

    // For all-day events, ensure dates are at 00:00 UTC
    let startDate = new Date(start);
    let endDate = new Date(end);

    if (allDay) {
      // Set to start of day in UTC
      startDate.setUTCHours(0, 0, 0, 0);
      endDate.setUTCHours(0, 0, 0, 0);
    }

    const event = await Event.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      start: startDate,
      end: endDate,
      allDay: allDay || false,
    });

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing event
 * Finds event by ID and updates it
 */
export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, start, end, allDay } = req.body;

    // Find event by ID
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found',
      });
    }

    // Handle all-day event date normalization
    let startDate = start ? new Date(start) : event.start;
    let endDate = end ? new Date(end) : event.end;

    if (allDay || (allDay === undefined && event.allDay)) {
      startDate.setUTCHours(0, 0, 0, 0);
      endDate.setUTCHours(0, 0, 0, 0);
    }

    // Update event fields
    if (title !== undefined) event.title = title.trim();
    if (description !== undefined) event.description = description.trim();
    if (start !== undefined) event.start = startDate;
    if (end !== undefined) event.end = endDate;
    if (allDay !== undefined) event.allDay = allDay;

    // Validate end > start before saving
    if (event.end <= event.start) {
      return res.status(400).json({
        success: false,
        error: 'End date must be after start date',
      });
    }

    await event.save();

    res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an event
 * Finds event by ID and removes it from database
 */
export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found',
      });
    }

    res.json({
      success: true,
      message: 'Event deleted successfully',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

