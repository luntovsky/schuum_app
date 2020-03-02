<template>
  <v-app>
    <Header v-if="isLoggedIn"></Header>

    <router-view :key="$route.fullPath"></router-view>
  </v-app>
</template>

<script>
import Header from "./components/Header";
import store from "./store";

export default {
  name: "App",
  components: {
    Header
  },
  data() {
    return {
      isLoggedIn: store.state.status
    };
  }
};
</script>

<style>
body {
  background-color: "#f0c40f";
}
</style>
