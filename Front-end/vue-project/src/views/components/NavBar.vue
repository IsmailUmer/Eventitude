<template>
  <div class="navbar">
    <div class="navbar-left">
      <span class="website-name">Eventitute</span>
    </div>
    <div class="navbar-right">
      <router-link to="/" class="nav-button">Home</router-link>
      <div v-if="isLoggedIn" class="dropdown">
        <button class="dropbtn">Event</button>
        <div class="dropdown-content">
          <router-link to="/create-event">Create Event</router-link>
          <router-link to="/update-event">Update Event</router-link>
          <router-link to="/delete-event">Delete Event</router-link>
          <router-link to="/register-event">Register Event</router-link>
          <router-link to="/event-questions">Event Questions</router-link>
        </div>
      </div>
      <router-link v-if="!isLoggedIn" to="/signup" class="nav-button">Sign Up</router-link>
      <router-link v-if="!isLoggedIn" to="/login" class="nav-button">Login</router-link>
      <button v-if="isLoggedIn" @click="handleLogout" class="nav-button">Logout</button>
    </div>
  </div>
</template>

<script>
import { logoutUser } from "../../services/auth.service.js";

export default {
  name: "NavBar",
  data() {
    return {
      isLoggedIn: !!localStorage.getItem("session_token"), // Check login state
    };
  },
  methods: {
    handleLogout() {
      logoutUser()
        .then(() => {
          localStorage.removeItem("session_token"); // Clear session token
          this.isLoggedIn = false; // Update login state
          window.location.href = "/"; // Redirect to home page and refresh
        })
        .catch((error) => {
          console.error("Logout failed:", error);
          alert("Failed to log out. Please try again.");
        });
    },
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #2b2b2b; /* Dark background */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.website-name {
  font-size: 1.8rem;
  font-weight: bold;
  color: #ffffff;
}

.navbar-right {
  display: flex;
  gap: 1.5rem; /* Equal spacing between buttons */
  align-items: center; /* Ensure vertical alignment */
}

/* Button styling for Home, Logout, and dropdown */
.nav-button,
.dropbtn {
  padding: 0.5rem 1rem;
  background-color: transparent;
  color: #ffffff;
  border: 1px solid #ffffff;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-button:hover,
.dropbtn:hover {
  background-color: #a3c9a8; /* Celadon */
  color: #1b1b1b; /* Eerie Black */
  border-color: #a3c9a8;
}

/* Dropdown styles */
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #2b2b2b; /* Matches navbar background */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;
  min-width: 160px;
  border-radius: 5px;
}

.dropdown-content a {
  color: #ffffff;
  padding: 0.5rem 1rem;
  text-decoration: none;
  display: block;
  font-size: 1rem;
}

.dropdown-content a:hover {
  background-color: #a3c9a8; /* Celadon */
  color: #1b1b1b; /* Eerie Black */
}

.dropdown:hover .dropdown-content {
  display: block; /* Show the dropdown on hover */
}
</style>
