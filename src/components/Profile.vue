<template lang='pug'>
  v-card()
    v-card-title.cardHeader
      h2 Profile
    v-card-text
      v-container.padded
        v-text-field(v-for='label, key in show' v-model='form[key]' :label='label' :disabled='disable(label)')
      h3.message(v-if='message') {{message}}
      h3.error(v-if='error') {{error}}
    v-card-actions
      v-row.justify-space-around
        v-btn.btn-primary(@click='update') Update
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
        form: {},
        show: {
          displayName: 'Username',
          email: 'Email',
          // emailVerified: 'Verified',
          // phoneNumber: 'Phone',
          // Address: 'Address',
        },
        message: '',
        error: ''
      }
    },
    props: {
      onCancel: { type: Function }
    },
    created () {
      var keys = this.keys
      for (var i = 0; i < keys.length; i++) {
        this.$set(this.form, keys[i], this.currentUser[keys[i]])
      }
      console.log(JSON.stringify(this.form))
      this.message = ''
      this.error = ''
    },
    computed: {
      currentUser () {
        return this.$store.state.user
      },
      keys () {
        return Object.keys(this.show)
      }
    },
    methods: {
      update () {
        console.log('update user information...' + JSON.stringify(this.form))
        this.currentUser.updateProfile(this.form)
        .then( () => {
          this.message = 'Updated information...'
          console.log(this.currentUser)
          setTimeout( () => {
            this.message = ''
            if (this.onCancel) { this.onCancel() }
          }, 3000)
        })
        .catch ( err => {
          console.log('Error updating information: ' + err.message)
          this.error = 'Error upating information'
        })
      },
      verified (label) {
        if (label === 'Email') {
          if (this.currentUser.emailVerified) {
            return 'mdi-check'
          } else {
            return 'mdi-alert'
          }
        } else {
          return ''
        }
      },
      disable (label) {
        if (label === 'Email') {
          return true
        } else {
          return false
        }
      },
      cancel () {
        this.onCancel()
      }    
    }
  }
</script>
<style scoped>
.message {
  color: green;
}
.error {
  color: red;
}
</style>