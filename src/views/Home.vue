<template lang='pug'>
  PageLayout(page='Home')
    v-row.justify-space-around.align-center.fullBody
      v-flex(lg6)
        Images

      v-flex(lg6)
        v-card.coloured(width='300px')
          v-card-title.cardHeader
            h4(v-if='currentUser') {{currentUser.displayName}}
          v-card-text
            a(@click='goto("profile")')
              h3.light My Profile
            a(@click='goto("favourites")')
              h3.light My Favourites
            a(@click='goto("history")')
              h3.light My Order History
            
    v-dialog(v-model='profile' width='600px')
      Profile(:onCancel='cancel')
    v-dialog(v-model='favourites' width='600px')
      Favourites(:onCancel='cancel')
    v-dialog(v-model='history' width='600px')
      History(:onCancel='cancel')
  </template>

<script>
// @ is an alias to /src
import PageLayout from '@/layouts/PageLayout.vue'

// import Quotes from '@/components/Quotes.vue'
// import Images from '@/components/Images.vue'
const Quotes = () => import('@/components/Quotes')
const Images = () => import('@/components/Images')

// import Profile from '@/components/Profile.vue'
// import Favourites from '@/components/Favourites.vue'
// import History from '@/components/History.vue'
const Profile = () => import('@/components/Profile')
const Favourites = () => import('@/components/Favourites')
const History = () => import('@/components/History')

import Shared from '@/mixins/Shared.vue'

// import config from '@/config'

export default {
  name: 'Home',
  components: {
    PageLayout,
    Quotes,
    Images,
    Profile,
    Favourites,
    History
  },
  mixins: [
    Shared
  ],
  data () {
    return {
      tab: '',
      start: false,

      index: 0,
      images: ['leaves.jpg', 'pour2.webp', 'socks.webp', 'steep.webp'],
      credits: ['Koko Rahmadie from Pexels', 'NIKOLAY OSMACHKO from Pexels', 'Pixabay', 'Julia Sakelli from Pexels'],
    
      profile: false,
      favourites: false,
      history: false
    }
  },
  created () {
    if (!this.loggedIn) {
      this.$router.replace('Public')
    }
  },
  computed: {
    padding () {
      return "padding: " + this.$vuetify.breakpoint.width / 30 + "px;"
    },
    currentUser () {
      return this.$store.state.user
    }
  },
  methods: {
    clear () {
      this.profile = false
      this.favourites = false
      this.history = false
    },
    goto (page) {
      this.clear()
      this[page] = true
    },
    cancel () {
      this.favourites = false
      this.profile = false
      this.history = false
    }
  }
}
</script>

<style>
.container.padded {
  padding: 5% !important;
}
</style>
