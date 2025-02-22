const questions = require('../controllers/event.question.controllers');
const auth = require('../lib/authentication');

module.exports = function (app) {
    app.route('/event/:eventId/question')
        .post(auth.isAuthenticated, questions.ask_question); // Create a question

    app.route('/question/:questionId')
        .delete(auth.isAuthenticated, questions.delete_question); // Delete a question

        app.route("/question/:id/vote")
        .post(auth.isAuthenticated, questions.upvote_question) // For upvoting
        .delete(auth.isAuthenticated, questions.downvote_question); // For downvoting

     };

     