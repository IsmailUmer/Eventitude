const events = require("../controllers/event.server.controllers");

const auth = require("../lib/authentication");

module.exports = function (app) {
    app.route("/events")
        .post(auth.isAuthenticated, events.create_event); // Create a new event

    app.route("/event/:eventId")
        .get(events.get_event) // Fetch a specific event by ID
        .post(auth.isAuthenticated, events.register_for_event) // Register for an event
        .patch(auth.isAuthenticated, events.update_event) // Update an event by ID
        .delete(auth.isAuthenticated, events.delete_event); // Delete an event by ID

        app.route("/search")
        .get(events.search_events); 
     // Search events
};
