<template>
  <div class="create-event-container">
    <h1>Create Event</h1>
    <form @submit.prevent="handleCreateEvent" class="create-event-form">
      <div class="form-group">
        <label for="name">Event Name</label>
        <input id="name" v-model="event.name" type="text" placeholder="Enter event name" />
      </div>
      <div class="form-group">
        <label for="description">Description</label>
        <textarea
          id="description"
          v-model="event.description"
          placeholder="Enter event description"
        ></textarea>
      </div>
      <div class="form-group">
        <label for="start">Start Date & Time</label>
        <input id="start" v-model="event.start" type="datetime-local" />
      </div>
      <div class="form-group">
        <label for="close-registration">Close Registration</label>
        <input id="close-registration" v-model="event.close_registration" type="datetime-local" />
      </div>
      <div class="form-group">
        <label for="location">Location</label>
        <input id="location" v-model="event.location" type="text" placeholder="Enter location" />
      </div>
      <div class="form-group">
        <label for="max-attendees">Max Attendees</label>
        <input id="max-attendees" v-model="event.max_attendees" type="number" min="1" />
      </div>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="eventId" class="success-message">
        Event created successfully! Event ID: {{ eventId }}
      </div>
      <button type="submit" class="submit-button">Create Event</button>
    </form>
  </div>
</template>

<script>
import { createEvent } from "../../services/events.service.js";

export default {
  name: "CreateEvent",
  data() {
    return {
      event: {
        name: "",
        description: "",
        start: "",
        close_registration: "",
        location: "",
        max_attendees: 1,
      },
      errorMessage: "",
      eventId: null, 
    };
  },
  methods: {
    handleCreateEvent() {
      const eventData = {
        ...this.event,
        start: new Date(this.event.start).getTime(),
        close_registration: new Date(this.event.close_registration).getTime(),
      };

      createEvent(eventData)
        .then((response) => {
          this.eventId = response.event_id; 
          this.errorMessage = ""; 
        })
        .catch((error) => {
          console.error("Error creating event:", error);
          this.errorMessage =
            error.message || "Failed to create the event. Please try again.";
        });
    },
  },
};
</script>

<style scoped>
.create-event-container {
  max-width: 600px;
  margin: 3rem auto;
  padding: 2.5rem;
  background-color: #2b2b2b; 
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3);
}

h1 {
  color: #ffffff;
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.create-event-form {
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

input,
textarea {
  padding: 0.8rem;
  border: 1px solid #ffffff;
  border-radius: 5px;
  background-color: #ffffff;
  color: #1b1b1b;
}

input:focus,
textarea:focus {
  border-color: #a3c9a8; 
}

.error-message {
  color: #ff4d4d;
}

.success-message {
  color: #a3c9a8; 
  font-size: 1rem;
  margin-top: 1rem;
}

.submit-button {
  padding: 1rem;
  background-color: #a3c9a8; 
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
