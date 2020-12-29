import Vue from 'vue'
import Vuex from 'vuex'

import cart from './cart'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({

  state: {
    status: 'initialized'
  },

  modules: {
    cart
  },

  strict: debug
})

export default store
