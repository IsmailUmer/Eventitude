<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <h1>Welcome to Eventitute</h1>
      <p>Discover and register for professional events near you.</p>
    </section>

    <!-- Search Bar -->
    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search events..."
      />
      <button @click="searchEvents">Search</button>
    </div>

    <!-- Event List -->
    <section class="event-list">
      <h2>Events</h2>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="pagedEvents.length > 0" class="event-grid">
        <div
          v-for="(event, index) in pagedEvents"
          :key="event.event_id"
          class="event-card"
        >
          <!-- Event Details -->
          <h3>{{ event.name }}</h3>
          <p class="event-description">{{ event.description }}</p>
          <p><strong>Start Date:</strong> {{ formatDate(event.start_date) }}</p>

          <!-- Buttons -->
          <div class="card-actions">
            <button @click="goToRegister(event.event_id)" class="register-button">
              Register
            </button>
            <button @click="toggleDetails(index)">
              {{ expandedIndex === index ? "Hide Details" : "More Details" }}
            </button>
          </div>

          <!-- Collapsible Details Section -->
          <div v-if="expandedIndex === index" class="event-details">
            <p><strong>Location:</strong> {{ event.location }}</p>
            <p>
              <strong>Organizer:</strong>
              {{ event.creator.first_name }} {{ event.creator.last_name }}
            </p>
            <p><strong>Event ID:</strong> {{ event.event_id }}</p>
          </div>
        </div>
      </div>
      <div v-else>
        <p>No events found.</p>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <button @click="previousPage" :disabled="currentPage === 1">Previous</button>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </section>
  </div>
</template>

<script>
import { searchEvents, getEvents } from "../../services/events.service.js";

export default {
  name: "Home",
  data() {
    return {
      searchQuery: "",
      events: [],
      pagedEvents: [], // Events for the current page
      currentPage: 1,
      pageSize: 10, // Number of events per page
      totalPages: 1,
      errorMessage: "",
      expandedIndex: null, // Track which event's details are expanded
    };
  },
  methods: {
    fetchInitialEvents() {
      getEvents()
        .then((data) => {
          this.events = data;
          this.updatePagination();
          this.errorMessage = "";
        })
        .catch((error) => {
          console.error("Error fetching events:", error);
          this.errorMessage = "Failed to load events.";
        });
    },
    searchEvents() {
      const query = this.searchQuery.trim();
      if (!query) {
        this.fetchInitialEvents();
        return;
      }

      searchEvents(query)
        .then((data) => {
          this.events = data;
          this.updatePagination();
          this.errorMessage = "";
        })
        .catch((error) => {
          console.error("Error searching events:", error);
          this.errorMessage = "Failed to search events.";
        });
    },
    toggleDetails(index) {
      this.expandedIndex = this.expandedIndex === index ? null : index;
    },
    goToRegister(eventId) {
      this.$router.push({ name: "RegisterEvent", params: { eventId } });
    },
    formatDate(timestamp) {
      const date = new Date(timestamp * 1000);
      return date.toLocaleDateString();
    },
    updatePagination() {
      this.totalPages = Math.ceil(this.events.length / this.pageSize);
      this.pagedEvents = this.events.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.updatePagination();
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.updatePagination();
      }
    },
  },
  mounted() {
    this.fetchInitialEvents();
  },
};
</script>

<style scoped>
/* General Styles */
.hero {
  text-align: center;
  background-color: #333;
  color: white;
  padding: 2rem 1rem;
}

.search-bar {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
}

.search-bar input {
  width: 40%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.search-bar button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  margin-left: 1rem;
  cursor: pointer;
}

.search-bar button:hover {
  background-color: #0056b3;
}

/* Event Grid */
.event-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); /* Increased size */
  gap: 1.5rem;
  padding: 1rem;
}

.event-card {
  background-color: #6c757d; /* Grey color */
  color: white;
  border-radius: 5px;
  padding: 1.5rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.event-card h3 {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
}

.event-description {
  color: #dcdcdc;
  margin: 0.5rem 0 1rem;
}

.card-actions {
  display: flex;
  justify-content: space-between;
}

.register-button {
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.register-button:hover {
  background-color: #218838;
}

.event-card button {
  padding: 0.5rem 1rem;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.event-card button:hover {
  background-color: #0056b3;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
  gap: 1rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
