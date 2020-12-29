<template lang='pug'>
    div
        h3 {{type}} teas...
       
        v-data-table(:headers='headers' :items='showTeas' :show-select='selectable' v-model='selected' item-key='name')
        hr
        h4 Selected:
        h5(v-for='tea in selected') {{tea}}
        hr
        h4 AllSelected:
        h5(v-for='tea in allSelected') {{tea}}
</template>
<script>
  // import config from '@/config'
  import teaList from '@/teas'

  export default {
    data () {
      return {
          selectable: true,
          selected: [],
          Teas: teaList.Teas || [],
          showTeas: [],

          headers: [
            {
                text: 'Tea',
                align: 'start',
                sortable: true,
                value: 'name',
            },
            // { text: 'Category', value: 'type' },
            { text: 'Type', value: 'subtype' },
            { text: 'Cost (100g)', value: 'cost_100g' },
            { text: 'Cost (200g)', value: 'cost_200g' },
            { text: 'Caffeine', value: 'caffeine' },
          ]
      }
    },
    props: {
        type: { type: String },
        onSelect: { type: Function }
    },
    created () {
        console.log('load ' + this.type + ' teas...')
        this.reloadList()
    },
    methods: {
        reloadList () {
            if (this.type) {
                this.showTeas = this.Teas.filter(a => { return (a.type === this.type) })
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
        type () {
            this.reloadList()
        },
        selected () {
          console.log('selected list updated..')
          var items = this.selected.map(a => {
            a.cost = a.cost_100g || 0
            a.qty = 1
            a.size = '100g'
            return a
          })
          this.$store.dispatch('addToCart', items)
        }
    }
  }
</script>