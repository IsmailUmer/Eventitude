<template>
    <div class="register-event-container">
      <h1>Register for an Event</h1>
      <form @submit.prevent="handleRegisterEvent" class="register-event-form">
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
        <button type="submit" class="submit-button">Register</button>
      </form>
    </div>
  </template>
  
  <script>
  import { registerForEvent } from "../../services/events.service.js";
  
  export default {
    name: "RegisterEvent",
    data() {
      return {
        eventId: "", // Input for Event ID
        responseMessage: "", // Message to display the backend response
      };
    },
    methods: {
      handleRegisterEvent() {
        if (!this.eventId) {
          this.responseMessage = "Event ID is required.";
          return;
        }
  
        registerForEvent(this.eventId)
          .then((response) => {
            this.responseMessage = response.message || "Successfully registered for the event!";
          })
          .catch((error) => {
            console.error("Error registering for event:", error);
            this.responseMessage = error.message || "Failed to register for the event.";
          });
      },
    },
  };
  </script>
  
  <style scoped>
  .register-event-container {
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
  
  .register-event-form {
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
  