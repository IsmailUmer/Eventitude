import { createApp } from "vue";
import App from "./views/App.vue";
import router from "./router/Index";

const app = createApp(App);

app.use(router); // Use the router
app.mount("#app");
