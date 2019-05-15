<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height class="bg-color">
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-form class="input-field">
              <v-text-field
                prepend-icon="person"
                name="login"
                label="Login"
                type="text"
                color="#1c1e20"
                v-model="email"
              ></v-text-field>
              <v-text-field
                prepend-icon="lock"
                name="password"
                label="Password"
                type="password"
                color="#1c1e20"
                v-model="password"
              ></v-text-field>
            </v-form>
            <v-card-actions class="justify-center">
              <v-btn color="#1c1e20" dark v-on:click="login()">Login</v-btn>
            </v-card-actions>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import firebase from "firebase/app";
require("firebase/auth");

import nativeToast from "native-toast";

export default {
  name: "login",
  data: function() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    login: function() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          user => {
            nativeToast({
              message: `You are logged in as ${user.email}`,
              type: "success",
              position: "top"
            });
            this.$router.go({ path: this.$router.path });
          },
          err => {
            nativeToast({
              message: err.message,
              type: "error"
            });
          }
        );
    }
  }
};
</script>

<style scoped>
.bg-color {
  background-color: #f0c40f;
}

.my-text-style >>> .v-text-field__slot input {
  color: red;
}
</style>