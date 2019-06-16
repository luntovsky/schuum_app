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
              @keyup.enter="login()"
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
                  v-model="dateFormatted"
                  label="Anfangsdatum"
                  persistent-hint
                  prepend-icon="event"
                  @blur="date = parseDate(dateFormatted)"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="date" no-title @input="menu1 = false"></v-date-picker>
            </v-menu>
          </v-list-tile>
          <v-list-tile avatar>
            <v-menu
              ref="menu"
              v-model="menu2"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="endDate"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="endDate"
                  label="Enddatum"
                  prepend-icon="event"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="endDate" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                <v-btn flat color="primary" @click="$refs.menu.save(endDate)">OK</v-btn>
              </v-date-picker>
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

export default {
  components: {
    FullCalendar
  },
  data: vm => ({
    calendarPlugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    windowH: "",
    windowHeight: "",
    calendarEvents: [
      { title: "event 1", date: "2019-06-01" },
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
    date: new Date().toISOString().substr(0, 10),
    dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
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
    addEvent: function() {
      this.calendarEvents.push({
        title: this.event.title,
        date: this.event.start,
        end: this.event.end,
        backgroundColor: this.event.backgroundColor,
        allDay: this.event.allDay
      });
      this.dialog = false;
      console.log(this.calendarEvents);
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
    }
  },
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date);
    }
  },
  watch: {
    windowHeight(newHeight, oldHeight) {
      this.windowH = newHeight;
      this.$router.go("/calendar");
    },
    date(val) {
      this.dateFormatted = this.formatDate(this.date);
    }
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
