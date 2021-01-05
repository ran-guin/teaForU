<template lang='pug'>
  div
    v-card
      v-card-title.cardHeader
        h3 Edit {{tea.name}}
      v-card-text
        div(v-for='val,key in tea' :key='key')
          v-text-field(v-model='tea[key]' :label='key' :disabled='disable(key)')
      v-card-actions  
        v-row.justify-space-around
          v-btn.btn-primary(@click='updateMe()') Update
          v-btn.btn-danger(@click='deleteMe()') Delete
          v-btn(@click='onCancel') Cancel
          
</template>
<script>
  import Shared from '@/mixins/Shared'

  export default {
    mixins: [
      Shared
    ],
    data () {
      return {
      }
    },
    props: {
        tea: { type: Object },
        onCancel: { type: Function }
    },
    async created () {
    },
    methods: {
        updateMe () {
          console.log('update ' + JSON.stringify(this.tea))
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
        }
    },
    computed: {
    },
    watch: {
    }
  }
</script>
