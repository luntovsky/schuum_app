<template>
  <v-layout
    row
    v-touch="{
      left: () => swipe('Left'),
      right: () => swipe('Right'),
      up: () => swipe('Up'),
      down: () => swipe('Down')
    }"
  >
    <v-flex xs12 sm12>
      <v-card>
        <v-toolbar color="#f0c40f" dark flat>
          <v-toolbar-side-icon class="black--text" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
          <v-toolbar-title class="black--text">Übersicht</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon class="black--text">search</v-icon>
          </v-btn>
        </v-toolbar>
      </v-card>
    </v-flex>

    <v-layout wrap row>
      <v-navigation-drawer v-model="drawer" dark absolute temporary>
        <v-list class="pa-1">
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{username}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>

        <v-list class="pt-0" dense>
          <v-divider></v-divider>

          <v-list-tile v-for="item in items" :key="item.title" v-ripple>
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <div class="push"></div>

          <v-list-tile v-ripple="{ class: 'red--text' }">
            <v-list-tile-action>
              <v-icon>exit_to_app</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>Logout</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
    </v-layout>
  </v-layout>
</template>

<script>
import db from "./firebase";

export default {
  name: "Home",
  data() {
    return {
      test: "",
      swipeDirection: "none",

      username: "Bali",
      drawer: null,
      items: [
        { title: "Home", icon: "dashboard" },
        { title: "Kalender", icon: "calendar_today" },
        { title: "Inventar", icon: "storage" }
      ]
    };
  },
  methods: {
    storeTest: function() {
      testRef.push({
        test: this.test
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
</style>
