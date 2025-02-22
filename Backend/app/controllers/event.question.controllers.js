const Joi = require('joi');
const questionModel = require('../models/question.server.models');
const userModel = require('../models/user.server.models'); // Import the user model for token validation

// Validation schema for asking a question
const askQuestionSchema = Joi.object({
    question: Joi.string().required(),
}).options({ allowUnknown: false });

// Create a question
const ask_question = (req, res) => {
    const { eventId } = req.params;
    const userId = req.authenticatedUserId;

    const { error } = askQuestionSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error_message: error.details[0].message });
    }

    const { question } = req.body;

    // Check if the user is registered for the event
    questionModel.isRegisteredForEvent(eventId, userId, (err, isRegistered) => {
        if (err) {
            return res.status(500).json({ error_message: "Internal server error." });
        }

        if (!isRegistered) {
            return res.status(403).json({ error_message: "You cannot ask questions on events you are not registered for or your own events." });
        }

        // Check if the user is the creator of the event
        questionModel.isEventCreator(eventId, userId, (err, isCreator) => {
            if (err) {
                return res.status(500).json({ error_message: "Internal server error." });
            }

            if (isCreator) {
                return res.status(403).json({ error_message: "Event creators cannot ask questions about their own events." });
            }

            // Proceed to add the question
            questionModel.addQuestion(eventId, userId, question, (err, result) => {
                if (err) {
                    return res.status(500).json({ error_message: "Internal server error." });
                }

                return res.status(201).json({ question_id: result.id });
            });
        });
    });
};

// Delete a question
const delete_question = (req, res) => {
    const { questionId } = req.params;
    const userId = req.authenticatedUserId;

    questionModel.isQuestionCreator(questionId, userId, (err, isCreator) => {
        if (err) {
            return res.status(500).json({ error_message: "Internal server error." });
        }

        if (isCreator) {
            questionModel.deleteQuestion(questionId, (err, result) => {
                if (err) {
                    return res.status(500).json({ error_message: "Internal server error." });
                }

                if (result.status === 404) {
                    return res.status(404).json({ error_message: "You cannot delete a question that does not exist." });
                }

                return res.status(200).end();
            });
        } else {
            questionModel.isEventCreatorByQuestion(questionId, userId, (err, isEventCreator) => {
                if (err) {
                    return res.status(500).json({ error_message: "Internal server error." });
                }

                if (!isEventCreator) {
                    return res.status(403).json({
                        error_message: "You can only delete your own questions or questions from events you created.",
                    });
                }

                questionModel.deleteQuestion(questionId, (err, result) => {
                    if (err) {
                        return res.status(500).json({ error_message: "Internal server error." });
                    }

                    if (result.status === 404) {
                        return res.status(404).json({ error_message: "You cannot delete a question that does not exist." });
                    }

                    return res.status(200).end();
                });
            });
        }
    });
};

const upvote_question = (req, res) => {
    const { id: questionId } = req.params; // Get the question ID from the request params
    const userId = req.authenticatedUserId; // Logged-in user ID

    questionModel.getEventIdByQuestionId(questionId, (err, eventId) => {
        if (err || !eventId) {
            return res.status(400).json({ error_message: "Invalid question ID or internal server error." });
        }

            // Proceed to upvote the question
            questionModel.upvotequestion(questionId, userId, (err, result) => {
                if (err) {
                    if (err.status === 403) {
                        return res.status(403).json({ error_message: err.error_message });
                    }
                    return res.status(500).json({ error_message: "Internal server error." });
                }

                return res.status(200).json({ message: "Question upvoted successfully." });
            });
        
    });
};

const downvote_question = (req, res) => {
    const { id: questionId } = req.params; // Get the question ID from the request params
    const userId = req.authenticatedUserId; // Logged-in user ID

    questionModel.getEventIdByQuestionId(questionId, (err, eventId) => {
        if (err || !eventId) {
            return res.status(400).json({ error_message: "Invalid question ID or internal server error." });
        }

            // Proceed to downvote the question
            questionModel.downvotequestion(questionId, userId, (err, result) => {
                if (err) {
                    if (err.status === 403) {
                        return res.status(403).json({ error_message: err.error_message });
                    }
                    return res.status(500).json({ error_message: "Internal server error." });
                }

                return res.status(200).json({ message: "Question downvoted successfully." });
            });
        
    });
};

module.exports = {
    ask_question,
    delete_question,
    upvote_question,
    downvote_question,
};
