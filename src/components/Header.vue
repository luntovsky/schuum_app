<template>
  <v-layout>
    <v-flex xs12 sm12>
      <v-app-bar color="#f0c40f" dense>
        <v-btn @click.stop="drawer = !drawer" icon>
          <v-icon>$menu</v-icon>
        </v-btn>
        <v-toolbar-title class="font"></v-toolbar-title>
      </v-app-bar>
    </v-flex>

    <v-layout>
      <v-navigation-drawer v-model="drawer" absolute temporary dark>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>{{username}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list dense>
          <v-list-item v-for="item in items" :key="item.title" link @click="goTo(item.location)">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-layout>
  </v-layout>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      test: "",
      swipeDirection: "none",

      username: this.$store.state.user,
      drawer: null,

      currentPage: this.$store.state.currentPage,

      items: [
        { title: "Home", icon: "dashboard", location: "home" },
        { title: "Kalender", icon: "calendar_today", location: "calendar" },
        { title: "Biere", icon: "kitchen", location: "beers" },
        { title: "Inventar", icon: "storage", location: "inventory" },
        { title: "Logout", icon: "exit_to_app", location: "logout" }
      ]
    };
  },
  methods: {
    goTo: function(location) {
      if (location === "logout") {
        this.logout();
      } else {
        this.$store.dispatch("setCp", `${location}`);
        this.$router.push({
          path: `/${location}`
        });
      }
    },
    logout: function() {
      this.$store.dispatch("setUser", null);
      this.$store.dispatch("setStatus", false);
      this.$store.dispatch("setCp", null);

      this.$router.go({
        path: "/login"
      });
    },
    swipe: function(direction) {
      this.swipeDirection = direction;
    }
  },
  watch: {
    swipeDirection: function() {
      if (this.swipeDirection == "Right") {
        this.drawer = true;
      }
      if (this.swipeDirection == "Left") {
        this.drawer = false;
      }
    }
  }
};
</script>

<style>
.black--text {
  color: #1c1e20 !important;
}

.push {
  height: 65.5vh;
}

.pointer {
  cursor: pointer !important;
}

body {
  background-color: "#f0c40f";
}

.font {
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
