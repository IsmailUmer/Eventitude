<template>
  <div id="app">
    <!-- Global Navbar -->
    <NavBar />
    <!-- Dynamic Content -->
    <router-view />
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";

export default {
  name: "App",
  components: {
    NavBar,
  },
};
</script>


<style>
/* Reset the margin and padding for the entire page */
html, body {
  margin: 0;
  padding: 0;
  box-sizing: border-box; /* Ensures consistent sizing for all elements */
  width: 100%;
  height: 100%;
  background-color: #1b1b1b; /* Eerie Black */
}

/* Ensure the app container spans the entire viewport */
#app {
  min-height: 100vh;
  background-color: #1b1b1b; /* Eerie Black */
  color: #ffffff; /* White text */
  overflow-x: hidden; /* Prevent horizontal scrollbars */
}
</style>