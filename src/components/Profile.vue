<template lang='pug'>
    v-container
      v-card()
        v-card-title.cardHeader
          h2 Profile
        v-card-text
          v-container.padded
            v-text-field(v-for='key, label in preset' v-model='form[label]' :label='label' :disabled='disable(key)')
          h3.message(v-if='message') {{message}}
          h3.error(v-if='error') {{error}}
        v-card-actions
          v-row.justify-space-around
            v-btn.btn-primary(@click='update') Update
            v-btn(@click='onCancel') Cancel
</template>
<script>
  import Shared from '@/mixins/Shared'
  // import PageLayout from '@/layouts/PageLayout.vue'

  export default {
    // components: { PageLayout },
    mixins: [
      Shared
    ],
    data () {
      return {
        form: {},
        preset: {
          username: '',
          phone: '',
          address: ''
        },

        userData: null,
        message: '',
        error: ''
      }
    },
    props: {
      onCancel: { type: Function },
      onChange: { type: Function }
    },
    async created () {
      console.log('User: ' + JSON.stringify(this.currentUser))
      var user = await this.userInfo(this.currentUser.uid)
      console.log('Info: ' + JSON.stringify(user))

      if (user) { 
        this.userData = user
        var keys = Object.keys(this.userData)
        for (var i = 0; i < keys.length; i++) {
          this.$set(this.form, keys[i], this.userData[keys[i]])
          this.$set(this.preset, keys[i], this.userData[keys[i]] || keys[i])
        }
      }
      this.message = ''
      this.error = ''
    },
    computed: {
      currentUser () {
        return this.$store.state.user
      }
    },
    methods: {
      update () {
        console.log('update user information...' + JSON.stringify(this.form))

        console.log('user data: ' + JSON.stringify(this.userData))
        if (this.userData) {
          this.updateUser(this.currentUser.uid, this.form)
          .then( () => {
            this.message = 'Updated information...'
            setTimeout( () => {
              this.message = ''
              if (this.onCancel) { this.onCancel() }
            }, 2000)
          })
          .catch ( err => {
            console.log('Error updating information: ' + err.message)
            this.error = 'Error upating information'
          })
        } else {
          this.addUserInfo(this.currentUser.uid, this.form)
          .then( () => {
            this.message = 'Added user information...'
            setTimeout( () => {
              this.message = ''
              if (this.onCancel) { this.onCancel() }
            }, 2000)
          })
          .catch ( err => {
            console.log('Error updating information: ' + err.message)
            this.error = 'Error upating information'
          })

        }
        if (this.onChange) { this.onChange() }
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