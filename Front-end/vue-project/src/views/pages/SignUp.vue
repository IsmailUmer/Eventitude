<template>
  <div class="signup-container">
    <h1>Sign Up</h1>
    <form @submit.prevent="handleSignUp" class="signup-form">
      <div class="form-group">
        <label for="first-name">First Name</label>
        <input id="first-name" v-model="user.first_name" type="text" placeholder="Enter your first name" />
      </div>
      <div class="form-group">
        <label for="last-name">Last Name</label>
        <input id="last-name" v-model="user.last_name" type="text" placeholder="Enter your last name" />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" v-model="user.email" type="email" placeholder="Enter your email" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input id="password" v-model="user.password" type="password" placeholder="Enter your password" />
      </div>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <button type="submit" class="submit-button">Sign Up</button>
    </form>
  </div>
</template>

<script>
import { createAccount } from "../../services/events.service.js";

export default {
  name: "SignUp",
  data() {
    return {
      user: {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
      },
      errorMessage: "",
    };
  },
  methods: {
    handleSignUp() {
      createAccount(this.user)
        .then((response) => {
          console.log("Account created:", response);
          this.errorMessage = ""; // Clear error message on success
          alert("Account successfully created!");
        })
        .catch((error) => {
          this.errorMessage = error.message || "Failed to create account.";
        });
    },
  },
};
</script>

<style scoped>
.signup-container {
  max-width: 500px;
  margin: 3rem auto;
  padding: 3rem;
  background-color: #2b2b2b; /* Matches navbar background */
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3);
  text-align: center;
}

h1 {
  margin-bottom: 2rem;
  color: #ffffff; /* White text */
  font-size: 2rem;
  text-align: center;
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
}

.form-group {
  width: 100%;
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.5rem;
  font-size: 1rem;
  color: #ffffff; /* White text */
  font-weight: bold;
}

input {
  width: calc(100% - 1rem);
  margin: 0 auto;
  padding: 0.8rem;
  border: 1px solid #ffffff; /* White border */
  border-radius: 5px;
  font-size: 1rem;
  background-color: #ffffff; /* White input background */
  color: #1b1b1b; /* Dark text */
}

input::placeholder {
  color: #b3b3b3; /* Placeholder text color */
}

input:focus {
  border-color: #a3c9a8; /* Celadon */
  outline: none;
}

.submit-button {
  width: calc(100% - 1rem);
  margin: 0 auto;
  padding: 1rem;
  background-color: #a3c9a8; /* Celadon */
  color: #1b1b1b; /* Eerie Black */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1rem;
}

.submit-button:hover {
  background-color: #ffffff; /* White */
  color: #1b1b1b; /* Eerie Black */
}
</style>
