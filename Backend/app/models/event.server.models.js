    const db = require('../../database'); // Assuming database.js provides the SQLite connection

    // Add a new event
    const addNewEvent = (userId, eventData, callback) => {

        const sql = 
            'INSERT INTO events (name, description, start_date, close_registration, max_attendees, location, creator_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const params = [
            eventData.name,
            eventData.description,
            eventData.start,
            eventData.close_registration,
            eventData.max_attendees,
            eventData.location,
            userId
        ];

        db.run(sql, params, function (err) {
            if (err) {
                return callback(err);
            }
            if (!this.lastID) {
                return callback(null, {error_message:"Insertion Failed!"});
            }
            callback(null, { id: this.lastID });
        });
    };



    const getEventById = (eventId, userId, callback) => {
        console.log("DEBUG: getEventById called with eventId:", eventId, "userId:", userId);
    
        const sql = `
            SELECT 
                e.event_id, 
                e.name, 
                e.description, 
                e.start_date, 
                e.close_registration, 
                e.location, 
                e.max_attendees, 
                q.question_id, 
                q.question AS question_text, 
                q.asked_by, 
                q.votes
            FROM events e
            LEFT JOIN questions q ON e.event_id = q.event_id
            WHERE e.event_id = ?
        `;
    
        const params = [eventId];
    
        db.all(sql, params, (err, rows) => {
            if (err) {
                console.error("ERROR: SQL query failed:", err);
                return callback(err);
            }
    
            if (rows.length === 0) {
                return callback(null, null); // No event found
            }
    
            // Transform the rows into a structured event object with a questions array
            const event = {
                event_id: rows[0].event_id,
                name: rows[0].name,
                description: rows[0].description,
                start_date: rows[0].start_date,
                close_registration: rows[0].close_registration,
                location: rows[0].location,
                max_attendees: rows[0].max_attendees,
                questions: rows
                    .filter(row => row.question_id) // Exclude rows without questions
                    .map(row => ({
                        question_id: row.question_id,
                        question_text: row.question_text,
                        asked_by: row.asked_by,
                        votes: row.votes,
                    })),
            };
    
            callback(null, event);
        });
    };
    




    const updateEvent = (userId, eventId, eventData, back) => {
        const sqlE = "SELECT event_id FROM events WHERE event_id = ?";
        db.get(sqlE, eventId, (err, result) => {
            if (err) return back(err);
            if (!result) {
                return back(null, { status: 404, error_message: "Event doesn't exist" });
            }

            const sql_creator = "SELECT creator_id FROM events WHERE event_id = ? AND creator_id = ?";
            db.get(sql_creator, [eventId, userId], (err, row) => {
                if (err) {
                    console.error("Error in SELECT query:", err.message || err);
                    return back(err);
                }
                if (!row) {
                    return back(null, { status: 403, error_message: "You can only update your own events." });
                }

                let sql = "UPDATE events SET ";
                const params = [];
                let hasUpdates = false;

                if (eventData.name !== undefined) {
                    sql += "name = ?, ";
                    params.push(eventData.name);
                    hasUpdates = true;
                }
                if (eventData.description !== undefined) {
                    sql += "description = ?, ";
                    params.push(eventData.description);
                    hasUpdates = true;
                }
                if (eventData.start !== undefined) {
                    sql += "start_date = ?, ";
                    params.push(eventData.start);
                    hasUpdates = true;
                }
                if (eventData.close_registration !== undefined) {
                    sql += "close_registration = ?, ";
                    params.push(eventData.close_registration);
                    hasUpdates = true;
                }
                if (eventData.location !== undefined) {
                    sql += "location = ?, ";
                    params.push(eventData.location);
                    hasUpdates = true;
                }
                if (eventData.max_attendees !== undefined) {
                    sql += "max_attendees = ?, ";
                    params.push(eventData.max_attendees);
                    hasUpdates = true;
                }

                if (!hasUpdates) {
                    console.warn("No updates provided for event:", { userId, eventId });
                    return back(null, { status: 400, error_message: "No fields to update." });
                }

                sql = sql.slice(0, -2) + " WHERE event_id = ?";
                params.push(eventId);

                console.log("Executing SQL:", sql, "with params:", params);

                db.run(sql, params, function (err) {
                    if (err) {
                        console.error("Error in UPDATE query:", err.message || err);
                        return back(err);
                    }
                    if (this.changes === 0) {
                        console.warn("Event not found or no changes made:", { eventId });
                        return back(null, { status: 404, error_message: "Event not found or no changes made." });
                    }

                    console.log("Event updated successfully:", { eventId });

                    // Fetch the updated event details after the update operation
                    const sqlFetchUpdatedEvent = "SELECT * FROM events WHERE event_id = ?";
                    db.get(sqlFetchUpdatedEvent, [eventId], (err, updatedEvent) => {
                        if (err) {
                            console.error("Error fetching updated event:", err.message || err);
                            return back(err);
                        }
                        return back(null, {
                            status: 200,
                            message: "Event updated successfully.",
                            updatedEvent, // Include updated event details in the response
                        });
                    });
                });
            });
        });
    };

    const registerForEvent = (userId, eventId, callback) => {
        const sql = `
            INSERT INTO attendees (event_id, user_id) 
            VALUES (?, ?)
        `;
        const params = [eventId, userId];

        db.run(sql, params, function (err) {
            if (err) {
                if (err.code === "SQLITE_CONSTRAINT") {
                    // Handle duplicate registration attempts
                    return callback(null, { status: 403, message: "You are already registered." });
                }
                
                return callback(err);
                
            }

            callback(null, { status: 200, message: "Successfully registered for the event." });
        });
    };


    const getAttendeeCount = (eventId, callback) => {
        const sql = `
            SELECT COUNT(*) AS attendeeCount 
            FROM attendees 
            WHERE event_id = ?
        `;
        db.get(sql, [eventId], (err, row) => {
            if (err) {
                return callback(err);
            }
            callback(null, row.attendeeCount);
        });
    };




    // Check if a user is an attendee of an event
    const isAttendee = (eventId, userId, callback) => {
        const sql = 
            'SELECT 1 FROM attendees WHERE event_id = ? AND user_id = ?'
        ;
        const params = [eventId, userId];

        db.get(sql, params, (err, row) => {
            if (err) {
                return callback(err);
            }
            callback(null, !!row);
        });
    };


    const deleteEvent = (userId, eventId, callback) => {
        const sqlCheckEvent = "SELECT creator_id FROM events WHERE event_id = ?";
        db.get(sqlCheckEvent, [eventId], (err, result) => {
            if (err) {
                return callback(err);
            }

            if (!result) {
                return callback(null, { status: 404 });
            }

            if (result.creator_id !== userId) {
                return callback(null, { status: 403 });
            }

            const sqlSoftDelete = "UPDATE events SET close_registration = -1 WHERE event_id = ?";
            db.run(sqlSoftDelete, [eventId], function (err) {
                if (err) {
                    return callback(err);
                }

                if (this.changes === 0) {
                    return callback(null, { status: 404 });
                }

                return callback(null, { status: 200 });
            });
        });
    };
    const searchEvents = (q, status, userId, limit, offset, callback) => {
        let sql = `
            SELECT 
                e.event_id, 
                e.name, 
                e.description, 
                e.start_date, 
                e.close_registration, 
                e.location, 
                e.max_attendees, 
                e.creator_id,
                u.first_name AS creator_first_name, 
                u.last_name AS creator_last_name, 
                u.email AS creator_email 
            FROM events e
            JOIN users u ON e.creator_id = u.user_id
        `;
        const params = [];

        // Apply filters based on status
        const conditions = [];
        if (q) {
            conditions.push("(e.name LIKE ? OR e.description LIKE ?)");
            params.push(`%${q}%`, `%${q}%`);
        }
        if (status) {
            if (status === "MY_EVENTS") {
                conditions.push("e.creator_id = ?");
                params.push(userId);
            } else if (status === "ATTENDING") {
                sql += " JOIN attendees a ON e.event_id = a.event_id AND a.user_id = ?";
                params.push(userId);
            } else if (status === "OPEN") {
                conditions.push("e.close_registration > strftime('%s', 'now')"); // Events still open
            } else if (status === "ARCHIVE") {
                conditions.push("e.close_registration <= strftime('%s', 'now')"); // Past events
            }
        }

        // Add conditions to the query
        if (conditions.length > 0) {
            sql += ` WHERE ${conditions.join(" AND ")}`;
        }

        // Apply pagination
        sql += " LIMIT ? OFFSET ?";
        params.push(parseInt(limit), parseInt(offset));

        // Execute the query
        db.all(sql, params, (err, rows) => {
            if (err) {
                return callback(err);
            }

            // Transform results for response
            const results = rows.map(row => ({
                event_id: row.event_id,
                name: row.name,
                description: row.description,
                start_date: row.start_date,
                close_registration: row.close_registration,
                location: row.location,
                max_attendees: row.max_attendees,
                creator: {
                    creator_id: row.creator_id,
                    first_name: row.creator_first_name,
                    last_name: row.creator_last_name,
                    email: row.creator_email,
                },
            }));

            callback(null, results);
        });
    };



    module.exports = {
        addNewEvent,
        getEventById,
        updateEvent,
        deleteEvent,
        registerForEvent,
        isAttendee,
        getAttendeeCount,
        searchEvents,
    };