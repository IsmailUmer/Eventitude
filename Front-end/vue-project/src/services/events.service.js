const API_URL = "http://localhost:3333"; 

// Fetch all events (initial load or fallback)
export function getEvents(limit = 10, offset = 0) {
  const url = `${API_URL}/search?limit=${limit}&offset=${offset}`;
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error fetching events:", error);
      throw error;
    });
}

// Search for events
export function searchEvents(query, limit = 10, offset = 0) {
  const url = `${API_URL}/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`;
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to search events");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error searching events:", error);
      throw error;
    });
}

// Create a new user account
export function createAccount(user) {
  return fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw new Error(err.error_message || "Failed to create account");
        });
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error creating account:", error);
      throw error;
    });
}

// Login user
export function loginUser(credentials) {
  return fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw new Error(err.error_message || "Login failed");
        });
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Login failed:", error);
      throw error;
    });
}

// Logout user
export function logoutUser() {
  const token = localStorage.getItem("session_token");
  return fetch(`${API_URL}/logout`, {
    method: "POST",
    headers: { "X-Authorization": token },
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw new Error(err.error_message || "Logout failed");
        });
      }
    })
    .catch((error) => {
      console.error("Error during logout:", error);
      throw error;
    });
}

// Create a new event
export function createEvent(eventData) {
  const token = localStorage.getItem("session_token"); // Retrieve session token
  return fetch(`${API_URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Authorization": token,
    },
    body: JSON.stringify(eventData),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw new Error(err.error_message || "Error creating event");
        });
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error creating event:", error);
      throw error;
    });
}

// Update an event
export function updateEvent(eventId, eventData) {
  const token = localStorage.getItem("session_token");
  return fetch(`${API_URL}/events/${eventId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Authorization": token,
    },
    body: JSON.stringify(eventData),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw new Error(err.error_message || "Failed to update the event.");
        });
      }
    })
    .catch((error) => {
      console.error("Error updating event:", error);
      throw error;
    });
}

// Delete an event
export function deleteEvent(eventId) {
  const token = localStorage.getItem("session_token"); // Retrieve the session token
  return fetch(`${API_URL}/event/${eventId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-Authorization": token, // Include the session token
    },
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw new Error(err.error_message || "Failed to delete the event.");
        });
      }
      return response.text().then((text) => {
        return text ? JSON.parse(text) : { message: "Event deleted successfully!" };
      });
    })
    .catch((error) => {
      console.error("Error deleting event:", error);
      throw error;
    });
}

// Register for an event
export function registerForEvent(eventId) {
  const token = localStorage.getItem("session_token"); // Retrieve the session token
  return fetch(`${API_URL}/event/${eventId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Authorization": token, // Include the session token in the header
    },
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw new Error(err.error_message || "Failed to register for the event.");
        });
      }
      return response.json(); // Parse the backend response
    })
    .catch((error) => {
      console.error("Error registering for event:", error);
      throw error;
    });
}



