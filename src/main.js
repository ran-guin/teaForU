import Vue from 'vue'
import firebase from 'firebase'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

import '@/assets/text_sizing.css'
import '@/assets/page.css'
import '@/assets/colours.css'

import config from '@/config'

const firebaseConfig = config.firebaseConfig

import "firebase/auth";
import "firebase/firestore";

firebase.initializeApp(firebaseConfig)

Vue.config.productionTip = false

var app

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

firebase.auth().onAuthStateChanged( () => {
  if (!app) {
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }
})
