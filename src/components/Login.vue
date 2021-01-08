<template lang='pug'>
    v-card
        v-card-title.cardHeader
          h3(style='width: 100%')
            span(v-if='newUser') Register
            span(v-else) Login Page
            v-btn.right(icon @click='onClose')
              v-icon mdi-close
        v-card-text
          v-form(ref='form')
            v-text-field(label='Username / Email' v-model='loginForm.name' :rules='Rules.name')
            //- :prepend-icon='ready ? mdi-home : mdi-close'
            v-text-field(label='Password' v-model='loginForm.password' 
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
              v-icon(v-if='ready' color=green) mdi-check

              v-row.justify-space-around
              v-btn.btn-primary(:disabled="!ready" @click='register') Register
            div(v-else)
              v-row.justify-space-around
                v-btn.btn-primary(@click='login') Login
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
  import rules from '@/rules'

  export default {
    data () {
      return {
        loginForm: {name: '', password: ''},

        visiblePwd: false,
        newUser: false,

        Rules: {},
        validated: false,

        message: '',
        error: ''
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
        this.login = {
          name: '',
          password: ''
        }
      },
      validate () {
        this.Rules = {
          name: [rules.required, rules.email],
          password: [rules.required, rules.min(5)]
        }
        
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
          })
          .catch ( err => {
            console.log('Registration error: ' + err.message)
            this.message = ''
            this.error = err.message
          })
        }
      },
      async login () {
        // console.log('use firebase ui...')
        // var ui = new firebaseui.auth.AuthUI(firebase.auth());
        // var uiConfig = {
        //   signInOptions: [
        //     {
        //       provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        //       requireDisplayName: false
        //     }
        //   ]
        // }
        // ui.start('#firebaseui-auth-container', uiConfig);
        
        await this.validate()
        if (this.validated) {
          this.message = 'signing in...'
          firebase.auth().signInWithEmailAndPassword(this.loginForm.name, this.loginForm.password)
          .then ( user => {
            this.message = 'Signed in Successfully !'
            console.log('Signed in user: ' + JSON.stringify(user))
            this.$router.replace('Teas')
          })
          .catch ( err => {
            console.log('Error signing in: ' + err.message)
            this.message = ''
            this.error = err.message
          })
        }
      },
      recover () {
          console.log('send password recovery request...')
      }
    },
    computed: {
        ready () {
            if (this.loginForm.password.length > 6 && this.loginForm.name.match(/^[\w.+]+@\w+\.\w+$/)) {
                if (this.new && this.loginForm.password === this.loginForm.confirmPassword) {
                  return true
                } else if (!this.new) {
                  return true
                } else {
                  return true
                }
            } else {
                return false
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
        if (this.error) {
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