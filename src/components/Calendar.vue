<template>
  <v-layout>
    <v-flex>
      <div v-if="this.windowH > 650">
        <v-sheet height="600">
          <v-calendar :now="today" :value="today" color="primary" :weekdays="weekdays">
            <template v-slot:day="{ date }">
              <template v-for="event in eventsMap[date]">
                <v-menu :key="event.title" v-model="event.open" full-width offset-x>
                  <template v-slot:activator="{ on }">
                    <div
                      v-if="!event.time"
                      v-ripple
                      class="my-event"
                      v-on="on"
                      v-html="event.title"
                    ></div>
                  </template>
                  <v-card color="grey lighten-4" min-width="350px" flat>
                    <v-toolbar color="primary" dark>
                      <v-btn icon>
                        <v-icon>edit</v-icon>
                      </v-btn>
                      <v-toolbar-title v-html="event.title"></v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-btn icon>
                        <v-icon>favorite</v-icon>
                      </v-btn>
                      <v-btn icon>
                        <v-icon>more_vert</v-icon>
                      </v-btn>
                    </v-toolbar>
                    <v-card-title primary-title>
                      <span v-html="event.details"></span>
                    </v-card-title>
                    <v-card-actions>
                      <v-btn flat color="secondary">Cancel</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </template>
            </template>
          </v-calendar>
        </v-sheet>
      </div>
      <div v-else>
        <v-sheet height="400">
          <v-calendar
            ref="calendar"
            v-model="start"
            :type="type"
            :end="end"
            color="primary"
            :weekdays="weekdays"
          ></v-calendar>
        </v-sheet>
      </div>
    </v-flex>
  </v-layout>
</template>


<script>
export default {
  data: () => ({
    today: "2019-01-08",
    windowHeight: screen.height,
    windowH: screen.height,
    weekdays: [1, 2, 3, 4, 5, 6, 0],
    type: "week",
    start: "2019-01-05",
    end: "2019-01-06",
    typeOptions: [
      { text: "Day", value: "day" },
      { text: "4 Day", value: "4day" },
      { text: "Week", value: "week" },
      { text: "Month", value: "month" },
      { text: "Custom Daily", value: "custom-daily" },
      { text: "Custom Weekly", value: "custom-weekly" }
    ],
    events: [
      {
        title: "Vacation",
        details: "Going to the beach!",
        date: "2018-12-30",
        open: true
      },
      {
        title: "Vacation",
        details: "Going to the beach!",
        date: "2018-12-31",
        open: false
      },
      {
        title: "Vacation",
        details: "Going to the beach!",
        date: "2019-01-01",
        open: false
      }
    ]
  }),
  methods: {
    open(event) {
      alert(event.title);
    }
  },
  computed: {
    // convert the list of events into a map of lists keyed by date
    eventsMap() {
      const map = {};
      this.events.forEach(e => (map[e.date] = map[e.date] || []).push(e));
      return map;
    }
  },
  watch: {
    windowHeight(newHeight, oldHeight) {
      this.windowH = newHeight;
      this.$router.go("/calendar");
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
.my-event {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 2px;
  background-color: #1867c0;
  color: #ffffff;
  border: 1px solid #1867c0;
  width: 100%;
  font-size: 12px;
  padding: 3px;
  cursor: pointer;
  margin-bottom: 1px;
}
</style>
