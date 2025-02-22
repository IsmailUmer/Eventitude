<template>
  <div class="event-questions-container">
    <h1>Event Questions</h1>

    <!-- Search Questions Section -->
    <section class="search-questions">
      <form @submit.prevent="loadQuestions" class="search-form">
        <div class="form-group">
          <label for="searchEventId">Search by Event ID:</label>
          <input
            type="text"
            id="searchEventId"
            v-model="searchEventId"
            placeholder="Enter Event ID to search questions"
          />
        </div>
        <button type="submit" class="submit-button">Load Questions</button>
      </form>
    </section>

    <!-- Questions List -->
    <section v-if="questions.length > 0" class="questions-list">
      <div v-for="(question, index) in questions" :key="index" class="question-item">
        <p class="question-text"><strong>Question:</strong> {{ question.text }}</p>
        <p class="question-meta"><strong>Asked By:</strong> {{ question.askedBy || 'Anonymous' }}</p>
        <p class="question-meta"><strong>Total Votes:</strong> {{ question.votes }}</p>
        <p class="question-meta"><strong>Total Upvotes:</strong> {{ question.upvotes }}</p>
        <p class="question-meta"><strong>Total Downvotes:</strong> {{ question.downvotes }}</p>
      </div>
    </section>
    <section v-else-if="questionsLoaded" class="no-questions">
      <p>No questions found for this event.</p>
    </section>

    <!-- Add Question Section -->
    <section class="add-question">
      <h2>Add a New Question</h2>
      <form @submit.prevent="addQuestion" class="add-question-form">
        <div class="form-group">
          <label for="newQuestion">Question:</label>
          <textarea
            id="newQuestion"
            v-model="newQuestion"
            placeholder="Enter your question here..."
          ></textarea>
        </div>
        <button type="submit" class="submit-button">Add Question</button>
      </form>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchEventId: "", 
      questions: [], 
      questionsLoaded: false, 
      newQuestion: "", 
    };
  },
  methods: {
    loadQuestions() {
      if (!this.searchEventId.trim()) {
        alert("Please enter an Event ID to search!");
        return;
      }

   
      fetch(`http://localhost:3333/event/${this.searchEventId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to load questions. Please check the Event ID.");
          }
          return response.json();
        })
        .then((data) => {
      
          this.questions = (data.questions || []).map((question) => ({
            id: question.question_id,
            text: question.question_text || "No question text provided",
            askedBy: question.asked_by || "Anonymous",
            votes: question.votes || 0,
            upvotes: question.upvotes || 0,
            downvotes: question.downvotes || 0,
          }));
          this.questionsLoaded = true;
        })
        .catch((error) => {
          console.error("Error loading questions:", error);
          alert(error.message);
          this.questions = []; 
          this.questionsLoaded = true;
        });
    },

    addQuestion() {
      if (!this.searchEventId.trim() || !this.newQuestion.trim()) {
        alert("Please enter an Event ID and a question!");
        return;
      }

      fetch(`http://localhost:3333/event/${this.searchEventId}/question`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": localStorage.getItem("session_token"), 
        },
        body: JSON.stringify({ question: this.newQuestion }), 
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((err) => {
              throw new Error(err.message || "Failed to add the question.");
            });
          }
          return response.json();
        })
        .then(() => {
          alert("Question added successfully!");
          this.newQuestion = "";
          this.loadQuestions(); 
        })
        .catch((error) => {
          console.error("Error adding question:", error);
          alert(error.message);
        });
    },
  },
};
</script>

<style scoped>
.event-questions-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #2b2b2b;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3);
  color: #ffffff;
}

h1,
h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
}

.search-questions {
  margin-bottom: 2rem;
}

.add-question {
  margin-top: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

label {
  margin-bottom: 0.5rem;
}

input,
textarea {
  padding: 0.8rem;
  border-radius: 5px;
  border: 1px solid #ffffff;
  background-color: #ffffff;
  color: #000000;
}

.submit-button {
  padding: 0.8rem;
  background-color: #a3c9a8;
  color: #1b1b1b;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.questions-list {
  margin-top: 1rem;
}

.question-item {
  background-color: #3c3c3c;
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1rem;
}

.question-text {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.question-meta {
  font-size: 1rem;
  color: #c0c0c0;
}
</style>
