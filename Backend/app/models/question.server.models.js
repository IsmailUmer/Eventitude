const db = require('../../database');

// Add a new question
const addQuestion = (eventId, userId, question, callback) => {
    const sql = `
        INSERT INTO questions (question, asked_by, event_id, votes)
        VALUES (?, ?, ?, 0)
    `;
    const params = [question, userId, eventId];

    db.run(sql, params, function (err) {
        if (err) {
            return callback(err);
        }
        callback(null, { id: this.lastID });
    });
};

// Check if the user is registered for an event
const isRegisteredForEvent = (eventId, userId, callback) => {
    const sql = `
        SELECT 1 FROM attendees WHERE event_id = ? AND user_id = ?
    `;
    db.get(sql, [eventId, userId], (err, row) => {
        if (err) {
            return callback(err);
        }
        callback(null, !!row);
    });
};

// Check if the user is the creator of an event
const isEventCreator = (eventId, userId, callback) => {
    const sql = `
        SELECT 1 FROM events WHERE event_id = ? AND creator_id = ?
    `;
    db.get(sql, [eventId, userId], (err, row) => {
        if (err) {
            return callback(err);
        }
        callback(null, !!row);
    });
};

// Check if the user is the creator of a question
const isQuestionCreator = (questionId, userId, callback) => {
    const sql = `
        SELECT 1 FROM questions WHERE question_id = ? AND asked_by = ?
    `;
    db.get(sql, [questionId, userId], (err, row) => {
        if (err) {
            return callback(err);
        }
        callback(null, !!row);
    });
};

// Check if the user is the creator of the event associated with a question
const isEventCreatorByQuestion = (questionId, userId, callback) => {
    const sql = `
        SELECT 1 
        FROM questions 
        INNER JOIN events ON questions.event_id = events.event_id
        WHERE questions.question_id = ? AND events.creator_id = ?
    `;
    db.get(sql, [questionId, userId], (err, row) => {
        if (err) {
            return callback(err);
        }
        callback(null, !!row);
    });
};

// Get the event ID associated with a question
const getEventIdByQuestionId = (questionId, callback) => {
    const sql = `
        SELECT event_id
        FROM questions
        WHERE question_id = ?
    `;
    db.get(sql, [questionId], (err, row) => {
        if (err) {
            console.error("Error fetching event ID by question ID:", err);
            return callback(err);
        }
        callback(null, row ? row.event_id : null);
    });
};

// Delete a question
const deleteQuestion = (questionId, callback) => {
    const sql = `
        DELETE FROM questions WHERE question_id = ?
    `;
    db.run(sql, [questionId], function (err) {
        if (err) {
            return callback(err);
        }
        if (this.changes === 0) {
            return callback(null, { status: 404 });
        }
        callback(null, { status: 200 });
    });
};

// Upvote a question
const upvotequestion = (questionId, userId, callback) => {
    hasVoted(questionId, userId, (err, alreadyVoted) => {
        if (err) return callback(err);
        if (alreadyVoted) {
            return callback({ status: 403, error_message: "You have already voted on this question." });
        }

        const sql = `
            UPDATE questions
            SET votes = votes + 1
            WHERE question_id = ?
        `;

        db.run(sql, [questionId], function (err) {
            if (err) return callback(err);
            if (this.changes === 0) {
                return callback({ status: 404, error_message: "Question not found." });
            }

            saveVote(questionId, userId, (err) => {
                if (err) return callback(err);
                callback(null, { success: true, message: "Question upvoted successfully." });
            });
        });
    });
};

// Downvote a question
const downvotequestion = (questionId, userId, callback) => {
    hasVoted(questionId, userId, (err, alreadyVoted) => {
        if (err) return callback(err);
        if (alreadyVoted) {
            return callback({ status: 403, error_message: "You have already voted on this question." });
        }

        const sql = `
            UPDATE questions
            SET votes = votes - 1
            WHERE question_id = ?
        `;

        db.run(sql, [questionId], function (err) {
            if (err) return callback(err);
            if (this.changes === 0) {
                return callback({ status: 404, error_message: "Question not found." });
            }

            saveVote(questionId, userId, (err) => {
                if (err) return callback(err);
                callback(null, { success: true, message: "Question downvoted successfully." });
            });
        });
    });
};


const hasVoted = (questionId, userId, callback) => {
    const sql = `
        SELECT 1 FROM votes WHERE question_id = ? AND voter_id = ?
    `;
    db.get(sql, [questionId, userId], (err, row) => {
        if (err) {
            console.error("Error checking vote status:", err);
            return callback(err);
        }
        callback(null, !!row); // Correctly return true or false based on the presence of a vote.
    });
};


// Save a vote in the votes table
const saveVote = (questionId, userId, callback) => {
    const sql = `
        INSERT INTO votes (question_id, voter_id)
        VALUES (?, ?)
    `;
    const params = [questionId, userId];

    db.run(sql, params, function (err) {
        if (err) {
            console.error("Error saving vote to database:", err);
            return callback(err);
        }
        console.log(`Vote saved: questionId=${questionId}, userId=${userId}`);
        callback(null);
    });
};
const getEventDetails = (eventId, callback) => {
    const sql = `
        SELECT e.*, 
               q.question_id, 
               q.question, 
               q.votes 
        FROM events e
        LEFT JOIN questions q ON e.event_id = q.event_id
        WHERE e.event_id = ?
    `;

    db.all(sql, [eventId], (err, rows) => {
        if (err) {
            console.error("Error fetching event details:", err);
            return callback(err);
        }

        const event = rows.reduce((result, row) => {
            if (!result) {
                result = {
                    event_id: row.event_id,
                    name: row.name,
                    description: row.description,
                    location: row.location,
                    start_date: row.start_date,
                    close_registration: row.close_registration,
                    max_attendees: row.max_attendees,
                    questions: []
                };
            }
            if (row.question_id) {
                result.questions.push({
                    question_id: row.question_id,
                    question: row.question,
                    votes: row.votes
                });
            }
            return result;
        }, null);

        callback(null, event);
    });
};


module.exports = {
    addQuestion,
    isRegisteredForEvent,
    isEventCreator,
    isQuestionCreator,
    isEventCreatorByQuestion,
    getEventIdByQuestionId,
    deleteQuestion,
    upvotequestion,
    downvotequestion,
    hasVoted,
    saveVote,
    getEventDetails,
 
};
