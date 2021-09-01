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
    hr
    b {{list.length}} teas {{edit}}:
    v-data-table(:headers='headers' :items='list' :show-select='selectable' v-model='selected' item-key='name')
      template(v-if='filter' slot="no-data")
        v-alert(:value="true" icon="warning") Sorry, no {{category}} teas matching "{{filter}}"
      template(v-slot:item.options="{ item }")
        v-row.justify-space-around
          v-chip(v-if='item.caffeine_free' color='brown' dark) CF
          v-chip(v-if='item.flavoured' color='orange' dark) F
          v-chip(v-if='item.organic' color='green' dark) O
      //- template(v-if='isAdmin()' v-slot:item.favourites="{ item }")
      //-   //- v-icon.mr-2(small @click="deleteMe(item)") mdi-delete
      //-   v-icon.mr-2(v-if='item.favourite' small color='red') mdi-cards-heart
      //-   v-icon.mr-2(v-if='item.favourite' small @click="removeFave(item)") mdi-minus
      //-   v-icon.mr-2(v-else small @click="addFave(item)") mdi-plus
      template(v-if='edit' v-slot:item.actions="{ item }")
        v-icon.mr-2(small @click="editMe(item)") mdi-pencil
        v-icon.mr-2(small @click="deleteMe(item)") mdi-delete
    v-dialog(v-model='editBlock' width='800')
      EditTeas(:tea='editItem' :onCancel='clearDialog')
</template>
<script>
  import Shared from '@/mixins/Shared'
  const EditTeas = () => import('@/components/EditTeas')

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
          preloaded: false,

          editBlock: false,
          // edit: false,
          editItem: {name: 'preset'},

          headers: [],
          baseHeaders: [
            {
                text: 'Name',
                align: 'start',
                sortable: true,
                value: 'name',
            },
            { text: 'Price (100g)', value: 'cost_100g' },
           
            { text: 'options', value: 'options' },
          ]
      }
    },
    props: {
        category: { type: String },
        onSelect: { type: Function },
        filter: { type: String },
        list: { type: Array, default: () => { return [] }},
        count: { type: Number, default: 0 },
        edit: { type: Boolean, default: false }
    },
    async created () {
      this.loadHeaders()

      console.log('load ' + this.category + ' Teas ...')
      this.selected = this.allSelected
      console.log("(pre)-Selected: " + JSON.stringify(this.allSelected))
      console.log('LIST:  ' + this.list.length)
      // this.reloadList()
    },
    methods: {
      loadHeaders () {
        this.headers = Object.assign([], this.baseHeaders)

        if (this.edit) {
          this.headers.push({ text: 'Type', value: 'type' })
          this.headers.push({ text: 'Code', value: 'code' })
          this.headers.push({ text: 'Shelf', value: 'shelf' })
          this.headers.push({ text: 'actions', value: 'actions' })
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
          this.editBlock = true
          this.editItem = item
        },
        deleteMe (item) {
          console.log('delete: ' + JSON.stringify(item))
        },
        clearDialog () {
          this.editBlock = false
        },
        addFave () {

        },
        removeFave () {
          
        }
    },
    computed: {
      noData () {
        if (this.filter) {
          return 'Nothing matching "' + this.filter + '"'
        } else {
          return 'Nottin'
        }
      },
      allSelected () {
        return this.$store.getters.contentsOfCart || []
      }
    },
    watch: {
      edit () {
        console.log('changed edit mode..')
        this.loadHeaders()
        console.log('H: ' + JSON.stringify(this.headers))
      },
      list () {
        console.log('updated LIST ' + JSON.stringify(this.list))
      },
      count () {
        console.log('number changed...')
      },
      selected () {
        console.log('selected: ' + JSON.stringify(this.selected))
        this.updateCart()
      }
    }
  }
</script>
<style scoped>
.v-chip {
  padding-left: 1rem;
}
.heart {
  color: red;
}
</style>