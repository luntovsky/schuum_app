<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height class="bg-color">
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <img class="logo" :src="'../../img/logo.png'" />
            <img class="beerGif" :src="'../../img/beer.gif'" />
            <v-form class="input-field">
              <v-text-field
                dark
                prepend-icon="person"
                name="login"
                label="Login"
                type="text"
                color="#e8b504"
                v-model="email"
              ></v-text-field>
              <v-text-field
                dark
                prepend-icon="lock"
                name="password"
                label="Password"
                type="password"
                color="#e8b504"
                v-model="password"
                @keydown.enter="login()"
              ></v-text-field>
            </v-form>
            <v-card-actions class="justify-center">
              <v-btn color="#e8b504" dark v-on:click="login()">Login</v-btn>
            </v-card-actions>
          </v-flex>
        </v-layout>
      </v-container>
      <v-snackbar
        v-model="snackbar"
        :color="color"
        :bottom="true"
        :multi-line="mode === 'multi-line'"
        :timeout="timeout"
        :vertical="mode === 'vertical'"
      >{{ error }}</v-snackbar>
    </v-content>
  </v-app>
</template>

<script>
import firebase from "firebase";

export default {
  name: "login",
  data: function() {
    return {
      email: "",
      password: "",

      snackbar: false,
      color: "red",
      mode: "",
      timeout: 4000,
      error: ""
    };
  },
  methods: {
    login: function() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(response => {
          this.$store.dispatch("setUser", response.user.email);
          this.$store.dispatch("setStatus", true);

          this.$router.go({
            path: "/home"
          });
        })
        .catch(error => {
          this.error = error.message;
          this.snackbar = true;
        });
    }
  },
  created() {
    if (this.$store.state.status) {
      this.$router.push({
        path: "/home"
      });
    }
  }
};
</script>

<style scoped>
.body {
  background-color: #201f1e;
}

.bg-color {
  background-color: #201f1e;
}

.my-text-style >>> .v-text-field__slot input {
  color: red;
}

.input-field {
  margin-top: -50px;
}

.beerGif {
  height: 100%;
  width: 100%;
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: -50px;
}

.logo {
  height: 60%;
  width: 60%;
  display: block;
  margin-left: auto;
  margin-right: auto;
  filter: invert(100%);
}

.body {
  background-color: #201f1e;
}
</style>