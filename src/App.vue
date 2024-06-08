<template>
  <v-app>
    <v-app-bar app dense class="main_bar">
      <v-toolbar-title>Rezervis</v-toolbar-title>
      <v-spacer></v-spacer>
      <span class="align-middle">{{ userName }}</span>
      <v-btn icon @click="showLoginDialog">
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer app permanent>
      <v-list>
        <router-link to="/" class="text-decoration-none">
          <v-list-item link>
            <v-list-item-content class="d-flex align-center">
              <v-list-item-icon>
                <v-icon class="mr-2">mdi-home</v-icon>
              </v-list-item-icon>
              <v-list-item-title class="text-start"
                >Pagrindinės parinktys</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </router-link>

        <router-link to="/patalpu-rezervacija" class="text-decoration-none">
          <v-list-item link>
            <v-list-item-content class="d-flex align-center">
              <v-list-item-icon>
                <v-icon class="mr-2">mdi-door</v-icon>
              </v-list-item-icon>
              <v-list-item-title class="text-start"
                >Patalpų rezervacija</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </router-link>

        <router-link to="/irangos-rezervacija" class="text-decoration-none">
          <v-list-item link>
            <v-list-item-content class="d-flex align-center">
              <v-list-item-icon>
                <v-icon class="mr-2">mdi-laptop</v-icon>
              </v-list-item-icon>
              <v-list-item-title class="text-start"
                >Įrangos rezervacija</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </router-link>

        <router-link to="/automobiliu-rezervacija" class="text-decoration-none">
          <v-list-item link>
            <v-list-item-content class="d-flex align-center">
              <v-list-item-icon>
                <v-icon class="mr-2">mdi-car</v-icon>
              </v-list-item-icon>
              <v-list-item-title class="text-start"
                >Automobilių rezervacija</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </router-link>
      </v-list>
      <v-list-item title="Aktualūs"></v-list-item>
      <v-divider></v-divider>
      <router-link to="/detali-paieska" class="text-decoration-none">
        <v-list-item link>
          <v-list-item-content class="d-flex align-center">
            <v-list-item-icon>
              <v-icon class="mr-2">mdi-magnify</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="text-start"
              >Detali paieška</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
      </router-link>
      <router-link to="/rezervaciju-istorija" class="text-decoration-none">
        <v-list-item link>
          <v-list-item-content class="d-flex align-center">
            <v-list-item-icon>
              <v-icon class="mr-2">mdi-magnify</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="text-start"
              >Rezervacijų istorija</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
      </router-link>
    </v-navigation-drawer>

    <v-main>
      <RouterView />
    </v-main>

    <login-dialog
      ref="loginDialog"
      @login-success="handleLoginSuccess"
    ></login-dialog>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  components: {},
  data() {
    return {
      userName: "Guest",
    };
  },
  methods: {
    showLoginDialog() {
      this.$refs.loginDialog.dialog = true;
    },
    handleLoginSuccess(user) {
      this.userName = user.name;
    },
    checkUserLoggedIn() {
      const token = localStorage.getItem("authToken");
      if (token) {
        axios
          .get("http://127.0.0.1:8000/api/user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          })
          .then((response) => {
            this.userName = response.data.name;
          })
          .catch(() => {
            localStorage.removeItem("authToken");
            this.userName = "Guest";
          });
      }
    },
  },
  created() {
    this.checkUserLoggedIn();
    console.log(axios);
  },
};
</script>
