<template lang='pug'>
    v-card
        v-card-title.cardHeader
          h3(style='width: 100%')
            span(v-if='newUser') Register
            span(v-else) Login Page
            v-btn.right(icon @click='onClose')
              v-icon mdi-close
        v-card-text
          v-form(ref='form' v-model='validForm')
            v-text-field.validate(label='Email' v-model='loginForm.name' :rules='Rules.email')
            //- :prepend-icon='ready ? mdi-home : mdi-close'
            v-text-field.validate(label='Password' v-model='loginForm.password' 
              :append-icon='visiblePwd ? "mdi-eye" : "mdi-eye-off"'
              @click:append='() => (visiblePwd = !visiblePwd)'
              :type='visiblePwd ? "text" : "password"'
              :rules='Rules.password'
              )

            div(v-if='newUser')
              v-text-field(label='Confirm Password' v-model='loginForm.confirmPassword' 
                :append-icon='visiblePwd ? "mdi-eye" : "mdi-eye-off"'
                @click:append='() => (visiblePwd = !visiblePwd)'
                :type='visiblePwd ? "text" : "password"'
                )
              span(v-if='newUser && !confirmPwd' style='color: red') Passwords must match

              v-row.justify-space-around
              v-btn.btn-primary(:disabled="!validForm || !confirmPwd" @click='register()') Register 
            div(v-else)
              v-row.justify-space-around
                v-btn.btn-primary(:disabled="!validForm || !confirmPwd"  @click='login()') Log In
          p &nbsp;
          h4.error.fade(v-if='error') {{error}}
          h4.message(v-if='message') {{message}}
          v-row.justify-space-around(v-if='newUser')
            a(@click='newUser=false') I already have an account
          v-row.justify-space-around(v-else)
            a(@click='recover') I forgot my password
            br
            a(@click='newUser=true') Register for new account
          //- hr
          //- h3 Login via FB:
          //- hr
          //- div#firebaseui-auth-container
          //- div#loader Loading...

</template>

<script>
  import firebase from 'firebase'
  // import firebaseui from 'firebaseui'

  // import * as firebase from 'firebase/app'
  // import 'firebase/auth'
  import config from '@/config'

  export default {
    data () {
      return {
        loginForm: {name: '', password: ''},

        visiblePwd: false,
        newUser: false,

        Rules: config.rules,
        validated: false,

        message: '',
        error: '',
        validForm: false
      }
    },
    props: {
        onClose: { type: Function }
    },
    created () {
      // this.Rules.name = [rules.email]
      // this.Rules.password = [rules.required]
    },
    methods: {
      clearForm () {
        this.loginForm = {
          name: '',
          password: ''
        }
      },
      validate () {
        console.log("Rules: " + JSON.stringify(this.Rules))
        // this.Rules = {
        //   name: [rules.required, rules.email],
        //   password: [rules.required, rules.min(5)]
        // }
        console.log('validate rules...')
        this.$nextTick(() => {
          //manually trigger Vuetify validation
          if(this.$refs.form.validate()) {
              //it’s valid, do work
              console.log('validated...')
              this.validated = true
              return Promise.resolve()
          } else {
            console.log('failed validation')
              this.validated = false
              return Promise.resolve()
          }
          //if not valid, errors will be automatically displayed
        })
      },
      async register () {
        var ok = await this.validate()
        console.log('ok ? ' + ok)
        if (this.validated) {
          this.message = 'registering...'
          firebase.auth().createUserWithEmailAndPassword(this.loginForm.name, this.loginForm.password)
          .then ( user => {
            this.message = 'Registered Successfully !'
            console.log('Created user: ' + user)
            setTimeout( () => {
              this.message = ''
              this.login()
            }, 1000)
          })
          .catch ( err => {
            console.log('Registration error: ' + err.message)
            this.message = ''
            this.error = err.message
          })
        }
      },
      async login () {
        console.log('logging in...')  
        await this.validate()
        if (this.validated) {
          this.message = 'signing in...'
          firebase.auth().signInWithEmailAndPassword(this.loginForm.name, this.loginForm.password)
          .then ( response => {
            this.message = 'Signed in Successfully !'

            if (response.user) {
              var access = 'normal'
              if (response.user.email.match(/[._]guin@/)) { access = 'admin' }

              var payload = {
                uid: response.user.uid,
                displayName: response.user.displayName,
                email: response.user.email,
                access: access
              }
              console.log('Payload: ' + JSON.stringify(payload))
              this.$store.dispatch('LOGIN', payload)
            } else {
              console.debug('user not found in firebase response (?)')
              console.debug(JSON.stringify(response))
            }
            
            if (this.onClose) { this.onClose() }
          })
          .catch ( err => {
            console.log('Error signing in: ' + err.message)
            this.message = ''
            this.error = err.message
          })
        }
      },
      recover () {
          console.log('send new password recovery request...')
      }
    },
    computed: {
        confirmPwd () {
          if (this.newUser) {
            if (this.loginForm.password === this.loginForm.confirmPassword) {
              return true
            } else {
              return false
            }
          } else {
            return true
          }
        }
    },
    watch: {
      error () {
        console.log('error changed')
        if (this.error) {
          setTimeout( () => {
            this.error = ''
          }, 2000)
        }
      },
      message () {
        console.log('message changed')
        if (this.message) {
          setTimeout( () => {
            this.message = ''
            this.clearForm()
            this.onClose()
          }, 2000)
        }
      }
    }
  }
</script>

<style>
.right {
  float: right;
}
.message {
  color: green;
}
</style>
