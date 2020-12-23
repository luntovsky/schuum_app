<template>
  <v-layout>
    <v-flex xs12 sm12>
      <FullCalendar
        class="demo-app-calendar"
        ref="fullCalendar"
        defaultView="dayGridMonth"
        :header="{
      left: 'prev',
      center: 'title',
      right: 'next'
      }"
        :plugins="calendarPlugins"
        :events="calendarEvents"
        @dateClick="handleDateClick"
        :firstDay="1"
        height="parent"
        @eventClick="showEvent"
        @eventRender="eventRender"
      />
    </v-flex>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark>
          <v-btn icon dark @click="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Neues Gebräu</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="addEvent()">
              <v-icon>save_alt</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-row justify="center">
          <v-list three-line subheader min-width="340px">
            <v-list-title avatar>
              <v-select
                v-model="beerSort"
                :items="beerSorts"
                item-text="name"
                menu-props="auto"
                label="Biersorte"
                return-object
                prepend-icon="local_drink"
                single-line
              ></v-select>
            </v-list-title>
            <v-list-title avatar>
              <v-select
                v-model="event.tank"
                :items="tanks"
                item-text="name"
                menu-props="auto"
                label="Tank"
                prepend-icon="meeting_room"
                single-line
              ></v-select>
            </v-list-title>
            <v-list-title avatar>
              <v-select
                v-model="event.backgroundColor"
                :items="colors"
                item-text="label"
                menu-props="auto"
                label="Farbe"
                prepend-icon="colorize"
                single-line
              ></v-select>
            </v-list-title>
            <br />
            <v-list-title avatar>
              <v-menu
                ref="menu1"
                v-model="menu1"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="dateFormatted1"
                    label="Anfangsdatum"
                    prepend-icon="event"
                    @blur="date1 = parseDate(dateFormatted1)"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="date1"
                  no-title
                  @input="menu1 = false"
                  first-day-of-week="1"
                ></v-date-picker>
              </v-menu>
            </v-list-title>

            <br />
            <v-textarea label="Anmerkung" rows="1" prepend-icon="comment" v-model="anmerkung"></v-textarea>
          </v-list>
        </v-row>
        <v-dialog v-model="deleteDialog" max-width="290">
          <v-card>
            <v-card-title class="headline">Bier löschen?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="red darken-1" text @click="deleteItem()">Löschen</v-btn>

              <v-btn color="black" text @click="deleteDialog = false">Abbrechen</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
    </v-dialog>
  </v-layout>
</template>


<script>
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import firebase from "./firebase";
let db = firebase.firestore();

var moment = require("moment");
moment().format();

export default {
  components: {
    FullCalendar
  },
  data: vm => ({
    calendarPlugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    tempBeerName: "",
    calendarEvents: [
      { title: "event 1", date: "2019-07-01", rendering: "background" },
      { title: "event 2", date: "2019-06-09" }
    ],
    deleteItemID: "",
    deleteDialog: false,
    beerSorts: [],
    beerSort: {},
    tanks: [],
    dialog: false,
    event: {
      beerSort: "",
      start: "",
      end: "",
      tank: "",
      anmerkung: "",
      backgroundColor: "#3F51B5",
      allDay: true
    },
    anmerkung: "",

    date1: new Date().toISOString().substr(0, 10),
    date2: new Date().toISOString().substr(0, 10),

    endDate: "",

    dateFormatted1: vm.formatDate(new Date().toISOString().substr(0, 10)),
    dateFormatted2: vm.formatDate(new Date().toISOString().substr(0, 10)),

    menu1: false,
    menu2: false,
    colors: [
      { label: "Red", hex: "red" },
      { label: "Orange", hex: "#FF5722" },
      { label: "Pink", hex: "#E91E63" },
      { label: "Green", hex: "#00ff00" }
    ],
    inventory: []
  }),
  methods: {
    handleDateClick(arg) {
      this.dialog = true;
    },
    deleteItem() {
      // this.inventoryUpdateDelete();
      db.collection("Events")
        .doc(this.deleteItemID)
        .delete();
      this.deleteDialog = false;
      this.deleteItemID = "";
    },
    showEvent: function(info) {
      this.deleteDialog = true;
      this.deleteItemID = info.event.id;
    },
    addEvent: function() {
      this.tempBeerName = this.beerSort.name;
      this.endDate = moment(this.date1, "YYYY-MM-DD")
        .add(this.beerSort.dauer, "days")
        .format("YYYY-MM-DD");

      db.collection("Events")
        .add({
          title: this.beerSort.name,
          beerSort: this.beerSort.name,
          zutaten: this.beerSort.zutaten,
          date: this.date1,
          end: this.endDate,
          tank: this.event.tank,
          anmerkung: this.anmerkung,
          allDay: this.event.allDay,
          backgroundColor: this.event.backgroundColor,
          borderColor: this.event.backgroundColor,
          textColor: "white"
        })
        .then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
        });
      this.tankUpdate();
      this.inventoryUpdate();
      this.dialog = false;
    },
    tankUpdate: function() {
      console.log(this.endDate);

      db.collection("Tanks")
        .where("name", "==", this.event.tank)
        .get()
        .then(querySnapshot => {
          console.log(this.endDate);

          querySnapshot.forEach(doc => {
            db.collection("Tanks")
              .doc(doc.id)
              .update({
                end: this.endDate,
                beer: this.tempBeerName
              });
          });
        });
    },
    inventoryUpdate: function() {
      for (let i = 0; i < this.beerSort.zutaten.length; i++) {
        const result = this.inventory.find(
          beer => beer.zutat === this.beerSort.zutaten[i].name
        );
        let updatedInv = result.anzahl - this.beerSort.zutaten[i].anzahl;
        console.log(updatedInv);
        db.collection("Inventory")
          .where("zutat", "==", this.beerSort.zutaten[i].name)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              db.collection("Inventory")
                .doc(doc.id)
                .update({ anzahl: updatedInv });
            });
          });
      }
      this.clearData();
    },
    inventoryUpdateDelete: function() {
      for (let i = 0; i < this.beerSort.zutaten.length; i++) {
        const result = this.inventory.find(
          beer => beer.zutat === this.beerSort.zutaten[i].name
        );
        let updatedInv = result.anzahl + this.beerSort.zutaten[i].anzahl;
        console.log(updatedInv);
        db.collection("Inventory")
          .where("zutat", "==", this.beerSort.zutaten[i].name)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              db.collection("Inventory")
                .doc(doc.id)
                .update({ anzahl: updatedInv });
            });
          });
      }
      this.clearData();
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    clearData: function() {
      (this.date1 = ""), (this.event.title = ""), (this.anmerkung = "");
      this.beerSort = {};
      this.event.backgroundColor = "";
      this.event.tank = "";
    },
    // eventRender: function(info) {
    //   console.log(info.event.extendedProps.anmerkung);
    //   console.log(info.event.title);
    //   let title = info.event.title + " " + info.event.extendedProps.anmerkung;
    //   console.log(title)
    // }
    eventRender: function(arg) {
      let span = document.createElement("span");
      span.setAttribute("id", "BeerID");
      arg.el.appendChild(span);
      document.getElementById("BeerID").innerHTML = "<p>hi</p>";
      console.log(arg.event.extendedProps.anmerkung);
    }
  },
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date1, this.date2);
    }
  },
  watch: {
    date1(val) {
      this.dateFormatted1 = this.formatDate(this.date1);
    },
    date2(val) {
      this.dateFormatted2 = this.formatDate(this.date2);
    }
  },
  async created() {

    const products = await db
      .collection("BeerSorts")
      .get();

    const json = JSON.stringify(products.docs.map((doc) => ({ ...doc.data() })));
    console.log(json);

    db.collection("Events").onSnapshot(res => {
      const changes = res.docChanges();

      changes.forEach(change => {
        if (change.type === "added") {
          this.calendarEvents.push({
            ...change.doc.data(),
            id: change.doc.id
          });
        } else if (change.type === "removed") {
          let index = this.calendarEvents
            .map(x => {
              return x.id;
            })
            .indexOf(change.doc.id);
          this.calendarEvents.splice(index, 1);
        }
      });
    });
    db.collection("BeerSorts").onSnapshot(res => {
      const changes = res.docChanges();
      changes.forEach(change => {
        if (change.type === "added") {
          this.beerSorts.push({
            ...change.doc.data()
          });
        }
      });
    });
    db.collection("Tanks").onSnapshot(res => {
      const changes = res.docChanges();
      changes.forEach(change => {
        if (change.type === "added") {
          this.tanks.push({
            ...change.doc.data()
          });
        }
      });
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
    });
  }
};
</script>

<style scoped>
@import "~@fullcalendar/core/main.css";
@import "~@fullcalendar/daygrid/main.css";
@import "~@fullcalendar/timegrid/main.css";

.demo-app-calendar {
  height: 80vh;
}
</style>
