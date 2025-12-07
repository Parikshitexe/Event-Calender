import mongoose from 'mongoose';

/**
 * Event Schema
 * Defines the structure of events stored in MongoDB
 * All dates are stored in UTC format
 */
const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [1, 'Title must be at least 1 character'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    start: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    end: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function (value) {
          // End date must be after start date
          return value > this.start;
        },
        message: 'End date must be after start date',
      },
    },
    allDay: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Index for faster queries on date ranges
eventSchema.index({ start: 1, end: 1 });

const Event = mongoose.model('Event', eventSchema);

export default Event;

