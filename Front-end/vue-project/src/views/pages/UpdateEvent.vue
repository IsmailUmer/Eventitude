<template>
  <div class="update-event-container">
    <h1>Update Event</h1>
    <form @submit.prevent="handleUpdate">
      <div class="form-group">
        <label for="event-id">Event ID</label>
        <input
          type="text"
          id="event-id"
          v-model="eventId"
          placeholder="Enter Event ID"
        />
      </div>
      <div class="form-group">
        <label for="name">Event Name</label>
        <input
          type="text"
          id="name"
          v-model="event.name"
          placeholder="Enter Event Name"
        />
      </div>
      <div class="form-group">
        <label for="description">Description</label>
        <textarea
          id="description"
          v-model="event.description"
          placeholder="Enter Description"
        ></textarea>
      </div>
      <div class="form-group">
        <label for="location">Location</label>
        <input
          type="text"
          id="location"
          v-model="event.location"
          placeholder="Enter Location"
        />
      </div>
      <div class="form-group">
        <label for="max-attendees">Max Attendees</label>
        <input
          type="text"
          id="max-attendees"
          v-model="event.max_attendees"
          placeholder="Enter Max Attendees"
        />
      </div>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <button type="submit" class="submit-button">Update Event</button>
    </form>
  </div>
</template>

<script>
import { updateEvent } from "../../services/auth.service.js";

export default {
  name: "UpdateEvent",
  data() {
    return {
      eventId: "", // The event ID to be updated
      event: {
        name: "",
        description: "",
        location: "",
        max_attendees: "",
      },
      errorMessage: "", // Error message to display
    };
  },
  methods: {
    handleUpdate() {
      if (!this.eventId) {
        this.errorMessage = "Event ID is required to update the event.";
        return;
      }

      // Remove empty fields
      const eventToUpdate = {};
      for (const key in this.event) {
        if (this.event[key]) {
          eventToUpdate[key] = this.event[key]; // Include only non-empty fields
        }
      }

      console.log("Updating event with ID:", this.eventId);
      console.log("Event data being sent:", eventToUpdate);

      updateEvent(this.eventId, eventToUpdate)
        .then(() => {
          this.errorMessage = ""; // Clear any previous error messages
          alert("Event updated successfully!");
        })
        .catch((error) => {
          console.error("Error updating event:", error);
          this.errorMessage =
            error.message || "Failed to update the event. Please try again.";
        });
    },
  },
};
</script>

<style scoped>
.update-event-container {
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
}

form {
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
  border-color: #a3c9a8; /* Celadon */
}

.error-message {
  color: #ff4d4d;
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
