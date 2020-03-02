import Vue from "vue";
import './plugins/vuetify'
import App from "./App.vue";
import { router } from "./router";
import store from "./store";
import vuetify from './plugins/vuetify';
import 'vuetify/dist/vuetify.min.css'

Vue.config.productionTip = false

import "./registerServiceWorker";

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount("#app");

