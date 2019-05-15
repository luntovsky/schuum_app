import Vue from "vue";
import Router from "vue-router";
import Home from "./components/Home.vue";
import Login from "./components/Login.vue";
import Calendar from "./components/Calendar.vue";

import firebase from "firebase/app";


Vue.use(Router);

export const router = new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/calendar",
      name: "calendar",
      component: Calendar
    }
  ]
});
