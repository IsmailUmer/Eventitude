<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" v-model="credentials.email" type="email" placeholder="Enter your email" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input id="password" v-model="credentials.password" type="password" placeholder="Enter your password" />
      </div>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <button type="submit" class="submit-button">Login</button>
    </form>
  </div>
</template>

<script>
import { loginUser } from "../../services/auth.service.js";

export default {
  name: "Login",
  data() {
    return {
      credentials: {
        email: "",
        password: "",
      },
      errorMessage: "",
    };
  },
  methods: {
  handleLogin() {
    loginUser(this.credentials)
      .then((response) => {
        console.log("Login successful:", response);

        // Store the session token
        localStorage.setItem("session_token", response.session_token);

        // Redirect to the home page
        this.$router.push("/").then(() => {
          window.location.reload();
        });
      })
      .catch((error) => {
        console.error("Login failed:", error);
        // Display a more detailed error message
        this.errorMessage = error.message || "An unexpected error occurred.";
      });
  },
},

};
</script>


<style scoped>
.login-container {
  max-width: 400px;
  margin: 3rem auto;
  padding: 2rem;
  background-color: #2b2b2b; /* Matches the navbar background */
  border-radius: 10px;
}

h1 {
  color: #ffffff;
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  font-size: 1rem;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ffffff;
  border-radius: 5px;
  background-color: #ffffff;
  color: #1b1b1b; /* Eerie Black */
}

input:focus {
  border-color: #a3c9a8; /* Celadon */
  outline: none;
}

.error-message {
  margin-bottom: 1rem;
  color: #ff4d4d; /* Red for error messages */
  font-size: 0.9rem;
}

.submit-button {
  width: 100%;
  padding: 1rem;
  background-color: #a3c9a8; /* Celadon */
  border: none;
  color: #1b1b1b; /* Eerie Black */
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #ffffff;
  color: #1b1b1b;
}
</style>
