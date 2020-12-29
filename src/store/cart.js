import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  Cart: []
}

const getters = {
  contentsOfCart: state => {
    console.log('Store => cart -> Retreive contents: ' + JSON.stringify(state.Cart))
    return state.Cart
  }
}

const mutations = {
  addToCart (state, items) {
    console.log('Store => cart -> Add to cart: ' + JSON.stringify(items))
    for (var i = 0; i < items.length; i++) {
      Vue.set(state.Cart, state.Cart.length, items[i])
    }
  }
}

const actions = {
  addToCart (state, item) {
    state.commit('addToCart', item)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
