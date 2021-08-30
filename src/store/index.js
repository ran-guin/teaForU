import Vue from 'vue'
import Vuex from 'vuex'

import cart from './cart'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({

  state: {
    status: 'initialized',
    user: {}
  },
  
  mutations: {
    LOGIN (state, user) {
      console.log('define user: ' + JSON.stringify(user))
      Vue.set(state, 'user', user)
    },

    LOGOUT (state) {
      Vue.set(state, 'user', {})
    }
  },

  actions: {
    LOGIN (state, user) {
    state.commit('LOGIN', user)
    },

    LOGOUT (state) {
      state.commit('logout')
    }
  },

  modules: {
    cart
  },

  plugins: [createPersistedState()],
  
  strict: debug
})

export default store
