import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/pages/Home.vue";
import Login from "../views/pages/Login.vue";
import SignUp from "../views/pages/SignUp.vue";
import CreateEvent from "../views/pages/CreateEvent.vue";
import UpdateEvent from "../views/pages/UpdateEvent.vue";
import DeleteEvent from "../views/pages/DeleteEvent.vue";
import RegisterEvent from "../views/pages/RegisterEvent.vue"; // Import the Register Event component
import EventQuestions from "../views/pages/EventQuestion.vue"; // Import the Event Questions component

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/login", name: "Login", component: Login },
  { path: "/signup", name: "SignUp", component: SignUp },
  {
    path: "/create-event",
    name: "CreateEvent",
    component: CreateEvent,
    beforeEnter: (to, from, next) => {
      const isLoggedIn = !!localStorage.getItem("session_token");
      if (isLoggedIn) {
        next();
      } else {
        next("/login"); // Redirect to login if not logged in
      }
    },
  },
  {
    path: "/update-event",
    name: "UpdateEvent",
    component: UpdateEvent,
  },
  {
    path: "/delete-event",
    name: "DeleteEvent",
    component: DeleteEvent,
  },
  {
    path: "/register-event",
    name: "RegisterEvent",
    component: RegisterEvent, // Navigate to the Register Event page
  },
  {
    path: "/event-questions",
    name: "EventQuestions",
    component: EventQuestions, // Navigate to the Event Questions page
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
