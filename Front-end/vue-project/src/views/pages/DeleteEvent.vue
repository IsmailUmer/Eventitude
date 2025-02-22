<template>
    <div class="delete-event-container">
      <h1>Delete Event</h1>
      <form @submit.prevent="handleDeleteEvent" class="delete-event-form">
        <div class="form-group">
          <label for="event-id">Event ID</label>
          <input
            type="text"
            id="event-id"
            v-model="eventId"
            placeholder="Enter Event ID"
          />
        </div>
        <div v-if="responseMessage" class="response-message">{{ responseMessage }}</div>
        <button type="submit" class="submit-button">Delete Event</button>
      </form>
    </div>
  </template>
  
  <script>
  import { deleteEvent } from "../../services/events.service.js";
  
  export default {
    name: "DeleteEvent",
    data() {
      return {
        eventId: "", // Input for Event ID
        responseMessage: "", // Message to display the backend response
      };
    },
    methods: {
  handleDeleteEvent() {
    if (!this.eventId) {
      this.responseMessage = "Event ID is required.";
      return;
    }

    deleteEvent(this.eventId)
      .then((response) => {
        this.responseMessage = response.message || "Event deleted successfully!";
      })
      .catch((error) => {
        console.error("Error deleting event:", error);
        this.responseMessage = error.message || "Failed to delete the event.";
      });
  },
},


  };
  </script>


  
  
  <style scoped>
  .delete-event-container {
    max-width: 600px;
    margin: 3rem auto;
    padding: 2.5rem;
    background-color: #2b2b2b; /* Matches navbar background */
    border-radius: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3);
  }
  
  h1 {
    color: #ffffff;
    font-size: 2rem;
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  .delete-event-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
  }
  
  label {
    color: #ffffff;
    margin-bottom: 0.5rem;
  }
  
  input {
    padding: 0.8rem;
    border: 1px solid #ffffff;
    border-radius: 5px;
    background-color: #ffffff;
    color: #1b1b1b;
  }
  
  input:focus {
    border-color: #a3c9a8; /* Celadon */
  }
  
  .response-message {
    color: #a3c9a8; /* Celadon */
    font-size: 1rem;
  }
  
  .submit-button {
    padding: 1rem;
    background-color: #a3c9a8; /* Celadon */
    color: #1b1b1b;
    font-weight: bold;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .submit-button:hover {
    background-color: #ffffff;
    color: #1b1b1b;
  }
  </style>
  