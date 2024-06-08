<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title class="text-h5">Login</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="login">
          <v-text-field
            v-model="loginForm.email"
            label="Email"
            required
          ></v-text-field>
          <v-text-field
            v-model="loginForm.password"
            label="Password"
            type="password"
            required
          ></v-text-field>
          <v-btn type="submit" color="primary">Login</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      dialog: false,
      loginForm: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/login",
          this.loginForm
        );
        localStorage.setItem("authToken", response.data.token); // Store token
        this.$emit("login-success", response.data.user);
        this.dialog = false;
      } catch (error) {
        console.error(
          "Login failed:",
          error.response ? error.response.data : error
        );
      }
    },
  },
};
</script>
