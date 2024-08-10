import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createVuetify } from "vuetify";
import "vuetify/styles";
import "./assets/main.css";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import DateTimePicker from './components/DateTimePicker.vue';
import LoginDialog from './components/LoginDialog.vue';

import axios from "axios";

axios.defaults.withCredentials = true;

import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);

app.use(router);
app.use(vuetify);

app.component("VueDatePicker", VueDatePicker);
app.component("DateTimePicker", DateTimePicker);
app.component("LoginDialog", LoginDialog);

app.mount("#app");
