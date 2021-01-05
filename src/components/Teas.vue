<template lang='pug'>
  div
    v-row.justify-space-around
      h1 {{category}}
      span
        v-chip(color='brown' dark) CF
        span - Caffeine-free
      span
        v-chip(color='orange' dark) F
        span - Flavoured
      span
        v-chip(color='green' dark) O
        span - Organic

    v-data-table(:headers='headers' :items='showTeas' :show-select='selectable' v-model='selected' item-key='name')
      template(v-slot:item.options = "{ item }")
        v-row.justify-space-around
          v-chip(v-if='item.caffeine_free' color='brown' dark) CF
          v-chip(v-if='item.flavoured' color='orange' dark) F
          v-chip(v-if='item.organic' color='green' dark) O
      template(v-if='isAdmin()' v-slot:item.actions="{ item }")
        v-icon.mr-2(small @click="editMe(item)") mdi-pencil
        v-icon.mr-2(small @click="deleteMe(item)") mdi-delete
    v-dialog(v-model='edit' width='800')
      EditTeas(:tea='editItem')
</template>
<script>
  import Shared from '@/mixins/Shared'
  import EditTeas from '@/components/EditTeas'

  export default {
    mixins: [
      Shared
    ],
    components: {
      EditTeas
    },
    data () {
      return {
          selectable: true,
          selected: [],
          Teas: [],
          showTeas: [],
          preloaded: false,

          edit: false,
          editItem: {name: 'preset'},

          headers: [
            {
                text: 'Name',
                align: 'start',
                sortable: true,
                value: 'name',
            },
            // { text: 'Category', value: 'category' },
            // { text: 'Type', value: 'type' },
            { text: 'Price (100g)', value: 'cost_100g' },
            // { text: 'Price (100g)', value: 'Price (100g)' },
            // { text: 'Location'},
            // { text: 'Cost (100g)', value: 'cost_100g' },
            // { text: 'Cost (200g)', value: 'cost_200g' },
            // { text: 'caffeine-free', value: 'caffeine_free' },
            // { text: 'flavoured', value: 'caffeine_free' },
            // { text: 'organic', value: 'caffeine_free' },
            { text: 'options', value: 'options' },
          ]
      }
    },
    props: {
        category: { type: String },
        onSelect: { type: Function }
    },
    async created () {
      if (this.isAdmin()) {
        this.headers.push({ text: 'Type', value: 'type' })
        this.headers.push({ text: 'Code', value: 'code' })
        this.headers.push({ text: 'Location', value: 'location' })
        this.headers.push({ text: 'actions', value: 'actions' })
      }
      console.log('load ' + this.category + ' Teas ...')
      this.selected = this.allSelected
      console.log("(pre)-Selected: " + JSON.stringify(this.allSelected))
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
        },
        adjusted (items) {
          var list = []
          for (var i = 0; i < items.length; i++) {
            var clone = items[i]

            clone.cost = clone.cost_100g || 0
            clone.qty = clone.qty || 1
            clone.size = clone.size || '100g'

            console.log("adjusted: " + JSON.stringify(clone))
            list.push(clone)
          }
          return list
        },
        updateCart () {
          console.log('selected list updated..')
          if (this.selected.length === this.allSelected.length) {
            console.debug('skip cart update...')
          } else if (!this.allSelected.length) {
            console.debug(this.selected.length + ' INITIALLY ADDED ' + this.allSelected.length)
            this.$store.dispatch('addToCart', this.adjusted(this.selected))
          } else if (this.selected.length > this.allSelected.length) {
            console.debug(this.selected.length + ' ADDED to ' + this.allSelected.length)
            var cartIds = this.allSelected.map(a => a.name)
            console.log(JSON.stringify(this.allSelected))
            console.log('ids: ' + JSON.stringify(cartIds))
            var newPicks = this.selected.filter(a => {
              return (cartIds.indexOf(a.name) === -1)
            })
            console.log('added ' + JSON.stringify(newPicks))
            this.$store.dispatch('addToCart', this.adjusted(newPicks))
          } else if (this.selected.length < this.allSelected.length) {
            console.debug(this.selected.length + ' REMOVED ' + this.allSelected.length)
            var removeIds = this.selected.map(a => a.name)
            console.log(JSON.stringify(this.allSelected))
            console.log('ids: ' + JSON.stringify(removeIds))
            var removed = this.allSelected.filter(a => {
              return (removeIds.indexOf(a.name) === -1)
            })
            console.log('removed ' + JSON.stringify(removed))
            this.$store.dispatch('removeFromCart', removed[0].name)
          }
        },
        editMe (item) {
          this.edit = true
          this.editItem = item
        },
        deleteMe (item) {
          console.log('delete: ' + JSON.stringify(item))
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
          this.updateCart()
        }
    }
  }
</script>
<style scoped>
.v-chip {
  padding-left: 1rem;
}
</style>