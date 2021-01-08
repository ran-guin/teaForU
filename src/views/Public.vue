<template lang='pug'>
  PageLayout(page='Public')
    //- v-row.justify-space-around.align-center.fullBody
      //- div.fullBody(max-width='65%')
      //-   v-carousel.fullBody(cycle interval='4000' hide-delimiters hide-delimiter-background show-arrows-on-hover touchless width='50%')

      //-     v-carousel-item(v-for='image, i in images' :key='i')
    v-row.justify-space-around.align-center
      v-flex(sm4)
        Images
      v-flex(sm4)
        Quotes()
  </template>

<script>
// @ is an alias to /src
import PageLayout from '@/layouts/PageLayout.vue'
import Images from '@/components/Images.vue'
import Quotes from '@/components/Quotes.vue'
import Shared from '@/mixins/Shared.vue'

// import config from '@/config'

export default {
  name: 'Home',
  components: {
    PageLayout,
    Quotes,
    Images
  },
  mixins: [
    Shared
  ],
  data () {
    return {
      tab: '',
      start: false,
    }
  },
  created () {
    if (this.loggedIn) {
      this.$router.replace('Teas')
    }
  },
  computed: {
    padding () {
      return "padding: " + this.$vuetify.breakpoint.width / 30 + "px;"
    }
  },
  methods: {
  },
  watch: {
  }
}
</script>

<style>
.container.padded {
  padding: 5% !important;
}

.fadeElement {
  color: black;
  transition: opacity 3s;
}
</style>
