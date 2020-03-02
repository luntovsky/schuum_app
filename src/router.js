import Vue from "vue";
import Router from "vue-router";
import Home from "./components/Home.vue";
import Login from "./components/Login.vue";
import Calendar from "./components/Calendar.vue";
import Inventory from "./components/Inventory.vue";
import Beers from "./components/Beers.vue";



import store from "./store"


Vue.use(Router);

export const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/home",
      name: "home",
      component: Home
    },
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
    },
    {
      path: "/inventory",
      name: "inventory",
      component: Inventory
    },
    {
      path: "/beers",
      name: "beers",
      component: Beers
    }
  ]
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path);

  const loggedIn = store.state.status

  if (authRequired && !loggedIn) {
    return next('/login')
  }
  next();
})
