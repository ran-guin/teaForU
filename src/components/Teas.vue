<template lang='pug'>
    div
        h3 {{category}} teas...
       
        v-data-table(:headers='headers' :items='showTeas' :show-select='selectable' v-model='selected' item-key='name')
          template(v-slot:item.caffeine_free="{ item }")
            v-icon(v-if='item.caffeine_free' color='green') mdi-check
</template>
<script>
  import Shared from '@/mixins/Shared'

  export default {
    mixins: [
      Shared
    ],
    data () {
      return {
          selectable: true,
          selected: [],
          Teas: [],
          showTeas: [],

          headers: [
            {
                text: 'Name',
                align: 'start',
                sortable: true,
                value: 'name',
            },
            { text: 'Category', value: 'category' },
            { text: 'Type', value: 'type' },
            { text: 'Price (100g)', value: 'cost_100g' },
            // { text: 'Price (100g)', value: 'Price (100g)' },
            // { text: 'Location'},
            // { text: 'Cost (100g)', value: 'cost_100g' },
            // { text: 'Cost (200g)', value: 'cost_200g' },
            { text: 'caffeine-free', value: 'caffeine_free' },
          ]
      }
    },
    props: {
        category: { type: String },
        onSelect: { type: Function }
    },
    async created () {
        console.log('load ' + this.category + ' Teas...')

        this.selected = this.allSelected
        console.log("(pre)-Selected: " + JSON.stringify(this.selected))
        this.Teas = await this.getTea({category: this.category})
        this.reloadList()
    },
    methods: {
        async reloadList () {
            if (this.category) {
                this.showTeas = await this.getTea({category: this.category})
                // this.Teas.filter(a => { return (a.category === this.category) })
                console.log('filtered tea list to ' + this.showTeas.length)
            } else {
                this.showTeas = this.Teas
            }
        }
    },
    computed: {
      allSelected () {
        return this.$store.getters.contentsOfCart || []
      }
    },
    watch: {
        category () {
            this.reloadList()
        },
        selected () {
          console.log('selected list updated..' + this.selected)
          var items = this.selected.map(a => {
            a.cost = a.cost_100g || 0
            a.qty = a.qty || 1
            a.size = '100g'
            return a
          })
          this.$store.dispatch('addToCart', items)
        }
    }
  }
</script>