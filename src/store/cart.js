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
  clearCart (state) {
    console.log('Clear cart' )
    Vue.set(state, 'Cart', [])
  },
  addToCart (state, items) {
    console.log('Store => cart -> Add to cart: ' + JSON.stringify(items))
    for (var i = 0; i < items.length; i++) {
      Vue.set(state.Cart, state.Cart.length, items[i])
    }
  },
  removeFromCart (state, id) {
    console.log('Store => cart -> Remove from cart: ' + JSON.stringify(id))
    for (var i = 0; i < state.Cart.length; i++) {
      var index = -1
      if (state.Cart[i].id === id) {
        index = i
      } else if (state.Cart[i].name === id) {
        index = i
      }
    }
    if (index >=0) {
      state.Cart.splice(index, 1)
    }
  }
}

const actions = {
  clearCart (state) {
    state.commit('clearCart')
  },
  addToCart (state, item) {
    state.commit('addToCart', item)
  },
  removeFromCart (state, item) {
    state.commit('removeFromCart', item)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
