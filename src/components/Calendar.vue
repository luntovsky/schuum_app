<template>
  <v-layout>
    <v-flex>
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
      />
    </v-flex>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>New Event</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click="addEvent()">Save</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list three-line subheader>
          <v-list-tile avatar>
            <v-text-field
              prepend-icon="event"
              name="login"
              label="Event"
              type="text"
              v-model="event.title"
            ></v-text-field>
          </v-list-tile>
          <v-list-tile avatar>
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
              <v-date-picker v-model="date1" no-title @input="menu1 = false" first-day-of-week="1"></v-date-picker>
            </v-menu>
          </v-list-tile>
          <v-list-tile avatar>
            <v-menu
              ref="menu2"
              v-model="menu2"
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
                  v-model="dateFormatted2"
                  label="Enddatum"
                  prepend-icon="event"
                  @blur="date2 = parseDate(dateFormatted2)"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="date2" no-title @input="menu2 = false" first-day-of-week="1"></v-date-picker>
            </v-menu>
          </v-list-tile>
          <v-list-tile avatar>
            <v-select
              v-model="event.backgroundColor"
              :items="colors"
              item-text="label"
              menu-props="auto"
              label="Farbe"
              prepend-icon="colorize"
              single-line
            ></v-select>
          </v-list-tile>
        </v-list>
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
import { log } from "util";
let db = firebase.firestore();

export default {
  components: {
    FullCalendar
  },
  data: vm => ({
    calendarPlugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    windowH: "",
    windowHeight: "",
    calendarEvents: [
      { title: "event 1", date: "2019-07-01", rendering: "background" },
      { title: "event 2", date: "2019-06-09" }
    ],
    dialog: false,
    event: {
      title: "",
      start: "",
      end: "",
      backgroundColor: "#3F51B5",
      allDay: true
    },
    date1: new Date().toISOString().substr(0, 10),
    date2: new Date().toISOString().substr(0, 10),

    dateFormatted1: vm.formatDate(new Date().toISOString().substr(0, 10)),
    dateFormatted2: vm.formatDate(new Date().toISOString().substr(0, 10)),

    menu1: false,
    menu2: false,
    colors: [
      { label: "Rot", hex: "#F44336" },
      { label: "Orange", hex: "#FF5722" },
      { label: "Pink", hex: "#E91E63" },
      { label: "Violett", hex: "#9C27B0" },
      { label: "Indigo", hex: "#3F51B5" },
      { label: "Blaugrün", hex: "#009688" }
    ]
  }),
  methods: {
    handleDateClick(arg) {
      this.dialog = true;
    },
    showEvent: function(info) {
      console.log(info.event.date);
      this.event.title = info.event.title;
      this.date1 = info.event.date;
      this.date2 = info.event.end;
      this.event.backgroundColor = info.event.backgroundColor;
      this.dialog = true;
    },
    addEvent: function() {
      db.collection("Events")
        .add({
          title: this.event.title,
          date: this.date1,
          end: this.date2,
          backgroundColor: this.event.backgroundColor,
          eventBorderColor: "#FF5722",
          allDay: this.event.allDay
        })
        .then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
        });
      this.dialog = false;
      this.clearData();
    },
    editEvent: function(eventID) {
      db.collection("Events")
        .doc(eventID)
        .update({
          title: this.event.title,
          date: this.date1,
          end: this.date2,
          backgroundColor: this.event.backgroundColor,
          eventBorderColor: "#FF5722",
          allDay: this.event.allDay
        });
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
      (this.date1 = ""), (this.date2 = ""), (this.event.title = "");
    }
  },
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date1, this.date2);
    }
  },
  watch: {
    windowHeight(newHeight, oldHeight) {
      this.windowH = newHeight;
    },
    date1(val) {
      this.dateFormatted1 = this.formatDate(this.date1);
    },
    date2(val) {
      this.dateFormatted2 = this.formatDate(this.date2);
    }
  },
  created() {
    db.collection("Events").onSnapshot(res => {
      const changes = res.docChanges();

      changes.forEach(change => {
        if (change.type === "added") {
          this.calendarEvents.push({
            ...change.doc.data()
          });
        }
      });
    });
    // console.log(this.calendarEvents);
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", () => {
        this.windowHeight = window.innerHeight;
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
