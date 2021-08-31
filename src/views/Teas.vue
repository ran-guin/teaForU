<template lang='pug'>
  PageLayout(page='Teas')
    v-row
      v-flex(:class="$vuetify.breakpoint.lgAndUp ? 'lg8' : 'lg12'")
        v-row.justify-space-between.align-center
          div(style='padding-left: 5%; width: 500px')
            v-text-field(v-model='searchFor' prepend-icon='search' placeholder='Search teas..' clearable @input='filter()')
          div(v-if='isAdmin()' style='padding-right: 5%')
            v-btn(v-if='editMode' @click='editMode=false') Finished Edits
            v-btn(v-else @click='editMode=true') Edit Tea Records
        v-row
          v-container
            v-tabs(centered dark background-color="#721" v-model='tab' width='100%')
              v-tabs-slider()
              v-tab(v-for='teaType,i in teaTypes' :key='i' :href='"#tab-" + i' @click='toggleCategory(i)')
                //- v-row.justify-space-around
                span.spaced(v-if='Show[teaType] && Show[teaType].length' style='color: white') {{teaType}} ({{Show[teaType].length}})
                span(v-else style='color: darkgrey') {{teaType}} (..)
            v-tabs-items(v-model='tab')
              v-tab-item(v-for='teaType,i in teaTypes' :key='i' :value='"tab-" + i' style='background-color: tan;')
                v-container(:style='padding')
                  v-card(elevation='9')
                    v-card-text
                      Teas(:category='teaType' :list='Show[teaType]' :edit='editMode')
      v-flex(v-if='$vuetify.breakpoint.lgAndUp' lg4)
          Images
  </template>

<script>
// @ is an alias to /src
import PageLayout from '@/layouts/PageLayout.vue'

const Teas = () => import('@/components/Teas')
const Images = () => import('@/components/Images')

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
      tabIndex: 0,
      start: false,
      teaTypes: config.teaTypes || [],
      category: '',

      index: 0,
      images: ['leaves.jpg', 'pour2.webp', 'socks.webp', 'steep.webp'],
      credits: ['Koko Rahmadie from Pexels', 'NIKOLAY OSMACHKO from Pexels', 'Pixabay', 'Julia Sakelli from Pexels'],

      searchFor: '',
      list: {},
      Cart: {},
      Teas: {},
      Show: { Green: [], Black: [], OOlong: [], Rooibos: [], Sencha: [], Tisane: [], Yerba: [] },
      editMode: true,
    }
  },
  created () {
  },
  mounted () {
    this.loadTeas()
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
    async loadTeas () {
      console.log(JSON.stringify(this.teaTypes))
      console.log('loading teas...')
      for (var i = 0; i < this.teaTypes.length; i++) {
        var category = this.teaTypes[i]
        console.log('get ' + category + ' teas ...')
        var list = await this.getTea({category: category})
        this.$set(this.Teas, category, list)
        this.$set(this.Show, category, list)
      }
      console.log('Show: ' + JSON.stringify(this.Show))
    },
    toggleCategory (i) {
      this.tabIndex = i
      this.category = this.teaTypes[this.tabIndex]

      this.index++      
      if (this.index >= this.images.length) {
        this.index = 0
      }
    },
    filter () {
      if (!this.searchFor) { this.searchFor = '' }

      for (var i = 0; i < this.teaTypes.length; i++) {
        var category = this.teaTypes[i]
        if (this.filter) {
          var list = this.Teas[category] || []
          console.log(category + " filter ON " + this.searchFor)
          this.Show[category] = list.filter(a => {
            var test = new RegExp (this.searchFor, 'i')
            if (a.description.match(test) || a.name.match(test)) {
              return true
            } else {
              return false
            }
          })
          console.log(category + ' filtered TO:' + JSON.stringify(this.Show[category]))
        } else {
          console.log(category = ' reset ')
          this.Show[category] = this.Teas[category]
        }
      }
    }
    // pickTypes (type, selected) {
    //   this.Cart[type] = selected
    //   console.log('Cart updated: ' + JSON.stringify(this.Cart))
    // }
  },
  watch: {
    tab () {
      var category = this.teaTypes[this.tabIndex]
      console.log(this.tabIndex + ' switch to ' + category)
      // console.log(category + ' Showing: ' + this.Show[category].length)
    },
    editMode () {
      console.log('changed edit mode')
    }
  }
}
</script>

<style>
.container.padded {
  padding: 5% !important;
}
.spaced {
  padding-top: 3rem;
  padding-bottom: 3rem;
}
</style>
