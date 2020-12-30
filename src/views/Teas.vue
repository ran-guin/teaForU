<template lang='pug'>
  PageLayout(page='Teas')
    v-row
      v-tabs(centered dark background-color="#721" v-model='tab' width='100%')
        v-tabs-slider()
        v-tab(v-for='teaType,i in teaTypes' :key='i' :href='"#tab-" + i' @click='viewTeas()') {{teaType}}
    v-row
      v-flex(:class="$vuetify.breakpoint.lgAndUp ? 'lg8' : 'lg12'")
        //- v-container.padding
        v-tabs-items(v-model='tab')
          v-tab-item(v-for='teaType,i in teaTypes' :key='i' :value='"tab-" + i' style='background-color: tan;')
            v-container(:style='padding')
              v-card(elevation='9')
                v-card-text
                  Teas(:category='teaType')

      v-flex(v-if='$vuetify.breakpoint.lgAndUp' lg4)
          Images
  </template>

<script>
// @ is an alias to /src
import PageLayout from '@/layouts/PageLayout.vue'
import Teas from '@/components/Teas.vue'
import Images from '@/components/Images.vue'
import Shared from '@/mixins/Shared.vue'
import config from '@/config'

export default {
  name: 'Home',
  components: {
    PageLayout,
    Teas,
    Images
  },
  mixins: [
    Shared
  ],
  data () {
    return {
      tab: '',
      start: false,
      teaTypes: config.teaTypes || [],

      index: 0,
      images: ['leaves.jpg', 'pour2.webp', 'socks.webp', 'steep.webp'],
      credits: ['Koko Rahmadie from Pexels', 'NIKOLAY OSMACHKO from Pexels', 'Pixabay', 'Julia Sakelli from Pexels'],

      Cart: {}
    }
  },
  created () {
  },
  computed: {
    padding () {
      return "padding: " + this.$vuetify.breakpoint.width / 30 + "px;"
    },
    image () {
      return './assets/images/' + this.images[this.index]
    }
  },
  methods: {
    viewTeas () {
      this.index++      
      if (this.index >= this.images.length) {
        this.index = 0
      }
    },
    // pickTypes (type, selected) {
    //   this.Cart[type] = selected
    //   console.log('Cart updated: ' + JSON.stringify(this.Cart))
    // }
  }
}
</script>

<style>
.container.padded {
  padding: 5% !important;
}
</style>
