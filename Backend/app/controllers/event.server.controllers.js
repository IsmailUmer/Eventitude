const Joi = require('joi');
const eventModel = require('../models/event.server.models.js');

// Validation schema for creating an event
const createEventSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    start: Joi.number().required(), // UNIX timestamp
    close_registration: Joi.number().required(), // UNIX timestamp
    location: Joi.string().required(),
    max_attendees: Joi.number().required().greater(0), // Must be > 0
}).options({ allowUnknown: false });

// Function to create an event
const create_event = (req, res) => {
    const { error } = createEventSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error_message: error.details[0].message });
    }

    const { start, close_registration, max_attendees, location, description, name } = req.body;

    // Ensure start time is in the future
    const now = Date.now(); // Current UNIX timestamp in milliseconds
    if (start <= now) {
        return res.status(400).json({ error_message: "Start time must be in the future." });
    }

    // Ensure close_registration is a valid UNIX timestamp and before the start time
    if (close_registration >= start || close_registration <= now) {
        return res.status(400).json({
            error_message: "Close registration must be before the start time and after the current time.",
        });
    }

    let userId = req.authenticatedUserId;

    // Step 1: Add the event to the database
    eventModel.addNewEvent(userId, req.body, (err, result) => {
        if (err) {
            return res.status(500).json({ error_message: "Internal server error." });
        }
        if (result.status === 403) {
            return res.status(403).json({ error_message: result.error_message });
        }
        if (result.status === 404) {
            return res.status(404).json({ error_message: result.error_message });
        }

        const eventId = result.id;

        // Step 2: Register the creator as an attendee
        eventModel.registerForEvent(userId, eventId, (err) => {
            if (err) {
                return res.status(500).json({
                    error_message: "Event created, but failed to register the creator as an attendee.",
                });
            }

            // Step 3: Respond with the event ID
            res.status(201).json({ event_id: eventId });
        });
    });
};

const update_event = (req, res) => {
    // Validation schema for updating an event
    const updateEventSchema = Joi.object({
        name: Joi.string(),
        description: Joi.string(),
        start: Joi.number(), // UNIX timestamp
        close_registration: Joi.number(), // UNIX timestamp
        location: Joi.string(),
        max_attendees: Joi.number().greater(0), // Must be > 0
    }).options({ allowUnknown: false });

    const eventId = req.params.eventId;
    const userId = req.authenticatedUserId; // Assuming user authentication middleware

    const { error } = updateEventSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error_message: error.details[0].message });
    }

    const eventData = req.body;

    // Ensure start time is in the future
    const now = Date.now(); // Current UNIX timestamp in seconds
    if (eventData.start < now) {
        return res.status(400).json({ error_message: 'Start time must be in the future.' });
    }

    // Ensure close_registration is a valid UNIX timestamp and before the start time
    if (eventData.close_registration >= eventData.start || eventData.close_registration <= now) {
        return res
            .status(400)
            .json({ error_message: 'Close registration must be before the start time and after the current time.' });
    }

    eventModel.updateEvent(userId, eventId, eventData, (err, result) => {
        if (err) {
            return res.status(500).json({ error_message: 'Internal server error.' });
        }
        if (result.status === 403) {
            return res.status(403).json({ error_message: 'You can only update your own events.' });
        }
        if (result.status === 404) {
            return res.status(404).json({ error_message: 'Event not found.' });
        }
        if (result.status === 400) {
            return res.status(400).json({ error_message: result.error_message });
        }

        // Include updated event details in the response
        return res.status(200).json({
            message: 'Event updated successfully',
            event: result.updatedEvent, // Updated event details passed from the model
        });
    });
};

const get_event = (req, res) => {
    const eventId = req.params.eventId;
    const userId = req.authenticatedUserId || null; // Check if the user is authenticated

    eventModel.getEventById(eventId, userId, (err, result) => {
        if (err) {
            return res.status(500).json({ error_message: "Internal server error." });
        }
        if (!result) {
            return res.status(404).json({ error_message: "Event not found." });
        }

        return res.status(200).json(result);
    });
};

const register_for_event = (req, res) => {
    const userId = req.authenticatedUserId; // Set by authentication middleware
    const eventId = req.params.eventId; // Extract event ID from URL

    // Check if the user is authenticated
    if (!userId) {
        return res.status(401).json({ error_message: "Unauthorized. Please log in to register for an event" });
    }

    // Validate registration logic
    eventModel.getEventById(eventId, userId, (err, event) => {
        if (err) {
            return res.status(500).json({ error_message: "Internal server error while fetching event details" });
        }

        if (!event) {
            return res.status(404).json({ error_message: "Event not found" });
        }

        // Check if the user is the creator of the event
        if (event.creator_id === userId) {
            return res.status(403).json({ error_message: "You cannot register for your own event" });
        }

        // Check if the user is already registered
        eventModel.isAttendee(eventId, userId, (err, isRegistered) => {
            if (err) {
                return res.status(500).json({ error_message: "Internal server error while checking registration" });
            }

            if (isRegistered) {
                return res.status(403).json({ error_message: "You are already registered" });
            }

            const now = Date.now();

            // Check if the event is archived/Deleted/Re
            if (event.close_registration === -1) {
                return res.status(403).json({ error_message: "Registration is closed" });
            }

            // Proceed with registration if validations pass
            eventModel.registerForEvent(userId, eventId, (err, result) => {
                if (err) {
                    return res.status(500).json({ error_message: "Internal server error during registration" });
                }

                return res.status(result.status).json({ message: result.message });
            });
        });
    });
};

const delete_event = (req, res) => {
    const eventId = req.params.eventId;
    const userId = req.authenticatedUserId;

    eventModel.deleteEvent(userId, eventId, (err, result) => {
        if (err) {
            return res.status(500).end(); // Return 500 with no body
        }

        if (result.status === 403) {
            return res.status(403).end(); // Return 403 with no body
        }

        if (result.status === 404) {
            return res.status(404).end(); // Return 404 with no body
        }

        return res.status(200).end(); // Return 200 OK with no body
    });
};

const search_events = (req, res) => {
    const validQueryParams = ["q", "status", "limit", "offset"];
    const queryKeys = Object.keys(req.query);

    // Validate query parameters
    for (const key of queryKeys) {
        if (!validQueryParams.includes(key)) {
            return res.status(400).json({
                error_message: `Invalid query parameter: ${key}`,
            });
        }
    }

    const { q, status, limit = 20, offset = 0 } = req.query;
    const userId = req.authenticatedUserId || null;

    eventModel.searchEvents(q, status, userId, limit, offset, (err, results) => {
        if (err) {
            return res.status(500).json({ error_message: "Internal server error." });
        }

        res.status(200).json(results);
    });
};

module.exports = {
    create_event,
    get_event,
    update_event,
    delete_event,
    register_for_event,
    search_events,
};
