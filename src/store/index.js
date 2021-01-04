import Vue from 'vue'
import Vuex from 'vuex'

import cart from './cart'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({

  state: {
    status: 'initialized'
  },

  modules: {
    cart
  },

  plugins: [createPersistedState()],
  
  strict: debug
})

export default store
