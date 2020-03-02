<template>
  <v-flex xs12 sm12 class="bodywrapper">
    <br />
    <v-card class="mx-auto" max-width="344" v-if="schwellItems.length != 0">
      <v-card-text>
        <v-list>
          <v-list-item v-for="item in schwellItems" :key="item.title">
            <v-list-item-content>
              <v-list-item-title v-text="item.zutat"></v-list-item-title>
            </v-list-item-content>
            <v-list-item-content>
              <v-list-item-title v-text="item.anzahl + ' kg' " class="text-red"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
    <div v-if="schwellItems.length != 0">
      <br />
      <br />
    </div>
    <v-card class="mx-auto" max-width="344">
      <v-card-text>
        <v-list>
          <v-list-item v-for="item in upTanks" :key="item.name">
            <v-list-item-content>
              <v-list-item-title v-text="item.beer"></v-list-item-title>
            </v-list-item-content>
            <v-list-item-conten>
              <v-list-item-title v-text="item.name" class="text-name caption"></v-list-item-title>
            </v-list-item-conten>
            <v-list-item-content>
              <v-list-item-title v-text="item.endDate" class="text-date"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
import firebase from "./firebase";
let db = firebase.firestore();

var moment = require("moment");
moment().format();

export default {
  name: "HOME",
  data: () => ({
    inventory: [],
    tanks: [],
    schwellItems: [],
    upTanks: []
  }),

  methods: {
    filterdItems: function() {
      console.log(this.inventory);
      this.inventory.forEach(item => {
        if (item.anzahl <= Number(item.schwellwert)) {
          console.log("hi");
          this.schwellItems.push({
            ...item
          });
        }
      });
      console.log(this.schwellItems);
    },
    filterdTanks: function() {
      this.tanks.forEach(tank => {
        let endDate = moment(tank.end).fromNow();
        if (endDate != "a few seconds ago") {
          this.upTanks.push({
            ...tank,
            endDate
          });
        }
        console.log(this.upTanks);
      });
    }
  },
  watch: {},
  created() {
    db.collection("Tanks").onSnapshot(res => {
      const changes = res.docChanges();
      changes.forEach(change => {
        if (change.type === "added") {
          this.tanks.push({
            ...change.doc.data()
          });
        }
      });
      this.filterdTanks();
    });
    db.collection("Inventory").onSnapshot(res => {
      const changes = res.docChanges();
      changes.forEach(change => {
        if (change.type === "added") {
          this.inventory.push({
            ...change.doc.data()
          });
        }
      });
      this.filterdItems();
    });
  }
};
</script>

<style>
.bodywrapper {
  padding-top: 10px;
}
.text-red {
  color: firebrick;
  margin-left: 60%;
  text-align: center;
}
.text-date {
  margin-left: 40%;
  text-align: center;
}
</style>
