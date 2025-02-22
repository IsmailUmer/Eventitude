const API_URL = "http://localhost:3333"; 
export function loginUser(credentials) {
  return fetch("http://localhost:3333/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials), // Sending user credentials
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw new Error(err.error_message || "Login failed");
        });
      }
      return response.json(); // Return response data if successful
    })
    .catch((error) => {
      console.error("Login error:", error);
      throw error; // Re-throw for the front-end to handle
    });
}


export function logoutUser() {
  const token = localStorage.getItem("session_token"); // Retrieve session token

  return fetch("http://localhost:3333/logout", {
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
      "X-Authorization": token, // Include the session token
    },
  })
    .then((response) => {
      if (!response.ok) {
        return response.text().then((err) => {
          throw new Error(err || "Failed to log out.");
        });
      }
      return response.json(); // Parse the JSON response
    })
    .catch((error) => {
      console.error("Logout error:", error);
      throw error;
    });
}


// Check user authentication status
export function isAuthenticated() {
  return fetch(`${API_URL}/auth-status`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error checking authentication status");
      }
      return response.json();
    })
    .then((data) => data.isAuthenticated)
    .catch((error) => {
      console.error("Error checking authentication status:", error);
      return false;
    });
}

export function updateEvent(eventId, eventData) {
  const fullApiLink = `http://localhost:3333/event/${eventId}`;

  const token = localStorage.getItem("session_token"); 
  return fetch(fullApiLink, {
    method: "PATCH", 
    headers: {
      "Content-Type": "application/json",
      "X-Authorization": token, 
    },
    body: JSON.stringify(eventData), 
  })
    .then((response) => {
      if (!response.ok) {
        return response.text().then((err) => {
          throw new Error(err || `Failed to update event with ID: ${eventId}`);
        });
      }
      return response.json(); 
    })
    .catch((error) => {
      console.error("Error updating event:", error);
      throw error;
    });
}



export function deleteEvent(eventId) {
  return fetch(`http://localhost:3333/event/${eventId}`, {
    method: "DELETE", 
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw new Error(err.error_message || "Failed to delete the event.");
        });
      }
      return response.json(); 
    })
    .catch((error) => {
      console.error("Error deleting event:", error);
      throw error;
    });
}


