import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import MainStore from "@/store";
require("@/assets/main.scss");
import "@/assets/font-awesome/all.min.css";

createApp(App).use(router).use(MainStore).mount("#app");
