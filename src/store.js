import Vue from "vue";
import Vuex from "vuex";

import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    // Presistend States are saved in the localstorage
    createPersistedState({
      reducer: state => ({
        user: state.user,
        status: state.status,
        currentPage: state.currentPage
      })
    })
  ],
  state: {
    user: null,
    status: false,
    currentPage: null,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_STATUS(state, status) {
      state.status = status
    },
    SET_CP(state, currentPage) {
      state.currentPage = currentPage
    }
  },
  actions: {
    setUser({ commit }, user) {
      commit('SET_USER', user)
    },
    setStatus({ commit }, status) {
      commit('SET_STATUS', status)
    },
    setCp({ commit }, currentPage) {
      commit('SET_CP', currentPage)
    }
  }
});
