<template lang='pug'>
  div
    v-card
      v-card-title.cardHeader
        h3 Edit {{tea.name}} c: {{changed.shelf}}

      v-card-text
        div(v-if='options.indexOf(key)===-1' v-for='val,key in tea' :key='key')
          v-text-field(v-model='tea[key]' :label='key' :disabled='disable(key)' @blur='trackChange(key)' v-bind:class="{ highlightInput: changed[key] !== undefined }")
        div(v-for='opt in options' :key='opt')
          v-switch(v-model='tea[opt]' :label='opt' @change='trackChange(opt)' v-bind:class="{ highlightInput: changed[opt] !== undefined}")
      v-card-actions  
        v-row.justify-space-around
          v-btn.btn-primary(@click='updateMe()' :disabled='disableUpdate') Update
          v-btn.btn-danger(@click='deleteMe()') Delete
          v-btn(@click='cancel') Cancel
          
</template>
<script>
  import Shared from '@/mixins/Shared'

  export default {
    mixins: [
      Shared
    ],
    data () {
      return {
        changed: {},
        original: {},
        disableUpdate: true,
        options: ['organic', 'flavoured', 'caffeine-free']
      }
    },
    props: {
        tea: { type: Object },
        onCancel: { type: Function }
    },
    async created () {
      // this.original = JSON.parse(JSON.stringify(this.tea)) || {}
      console.log('original values: ' + JSON.stringify(this.original))
    },
    methods: {
        trackChange (key) {
          var changes = Object.keys(this.changed)

          console.log('track change of ' + key)
          if (changes.indexOf(key) === -1 && (this.original[key] !== this.tea[key])) {
            console.log(key + " change from " + this.original[key] + ' to ' + this.tea[key])
            this.$set(this.changed, key, this.original[key] || '')
          } else if (this.original[key] === this.tea[key]) {
            console.log('restored original value')
            this.$delete(this.changed, key)
          } else if (!this.original[key] && this.tea[key] === false) {
            // account for blank vs false (equivalent)
            console.log('restored false value')
            this.$delete(this.changed, key)
          } else {
            console.log(key + ' remains changed')
          }
          var finalChanges = Object.keys(this.changed)
          if (finalChanges.length) { this.disableUpdate = false }
          else { this.disableUpdate = true }

          console.log('was: ' + JSON.stringify(this.changed))
          console.log('now: ' + JSON.stringify(this.tea))
        },
        async updateMe () {
          var changes = Object.keys(this.changed)
          console.log('original: ' + JSON.stringify(this.changed))
          console.log('now: ' + JSON.stringify(this.tea) + ' : ' + changes.length)

          var updated = {}
          for (var i = 0; i < changes.length; i++) {
            var field = changes[i]
            updated[field] = this.tea[field]
            console.log('track Change in ' + field)
          }

          if (changes.length) {
            var update = await this.updateTea(this.tea.id, updated)
            console.log('updated tea: ' + JSON.stringify(update))
            this.$set(this, 'changed', {})
          } else {
            console.log('nothing to update')
          }

          if (this.onCancel) { this.onCancel() }
        },
        deleteMe () {
          console.log('delete: ' + JSON.stringify(this.tea))
        },
        disable (key) {
          if (key === 'id') {
            return true
          } else {
            return false
          }
        },
        cancel () {
          this.$set(this, 'changed', {})
          if (this.onCancel) { this.onCancel() }
        }
    },
    watch: {
    }
  }
</script>

<style scoped>

div.highlightInput {
  background-color: pink;
}
</style>
