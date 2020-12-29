<template lang='pug'>
  PageLayout(page='Home')
    v-row.justify-space-around.align-center.fullBody
      v-flex(lg6)
        img.fullBody(:src='images[3]')

        //- v-carousel(cycle interval='4000' hide-delimiters hide-delimiter-background show-arrows-on-hover touchless)
        //-   v-carousel-item(v-for='image, i in images' :key='i')
        //-     img.center.padded(:src='images[i]' height='100%')         
      v-flex(lg6)
        v-card.coloured(width='300px')
          v-card-text
            h3.light My Profile
            h3.light My Favourites
            h3.light My Order History
  </template>

<script>
// @ is an alias to /src
import PageLayout from '@/layouts/PageLayout.vue'
import Quotes from '@/components/Quotes.vue'
import Shared from '@/mixins/Shared.vue'

// import config from '@/config'

export default {
  name: 'Home',
  components: {
    PageLayout,
    Quotes
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
      credits: ['Koko Rahmadie from Pexels', 'NIKOLAY OSMACHKO from Pexels', 'Pixabay', 'Julia Sakelli from Pexels']
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
    }
  },
  methods: {
  }
}
</script>

<style>
.container.padded {
  padding: 5% !important;
}
</style>
