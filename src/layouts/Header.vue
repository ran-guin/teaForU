<template lang='pug'>
  div
    div.padded.fillParentHeight()
      v-row.fillParentHeight.justify-space-between.align-center()
        v-icon(color='black') mdi-coffee
        h3.light {{title}}
        v-row.justify-end
          span
            v-tabs(centered dark background-color="brown" v-model='Htab' width='100%')
              v-tabs-slider()
              //- v-tab(href='#Home')
              //-   router-link(to='/Home')
              //-     v-icon.dark mdi-home
              v-tab(v-for='page,i in pages' :key='i' :href='"#" + page' @click='visit(i)') {{page}}
              v-tab(href='#Cart')
                router-link(to='/Cart')
                  v-icon.dark mdi-cart
          span
            v-btn.btn-primary(v-if='loggedIn' @click='logout()').right Logout
            v-btn.btn-primary(v-else @click='showLogin=true').right Login
            b.right.padded(v-if='loggedIn') {{currentUser.displayName || currentUser.email}}
    v-dialog(v-model='showLogin' max-width='600px')
      Login(:onClose='closeDialog')
</template>

<script>
  import config from '@/config'
  import Shared from '@/mixins/Shared'

  const Login = () => import('@/components/Login')

  export default {
    components: {
      Login
    },
    mixins: [
      Shared
    ],
    data () {
      return {
        pages: ['Teas', 'About'],
        showLogin: false,
        Htab: '',

        title: config.headerTitle || 'Header',
        logo: 'T4U.png'
      }
    },
    props: {
      page: { type: String }
    },
    created (){
      console.log('init header ' + this.page)
      if (this.page) { this.Htab = this.page }
    },
    methods: {
      launchLogin () {
        this.showLogin = true
      },
      closeDialog () {
        this.showLogin = false
      },
      logout () {
        this.firebaseLogout()
        .then (response => {
          console.log('logged out ' + JSON.stringify(response))
          this.$router.replace('Public')
        })
        .catch (err => {
          console.log('err: ' + err.message)
        })
      },
      visit (i) {
        var page = this.pages[i]
        if (this.$route.name !== page) {
          console.log('go to ' + page)
          this.$router.push(page)
          this.Htab = 'Htab-' + i
        } else {
          console.log('already on ' + page)
        }
      }      
    },
    watch: {
      loggedIn () {
        console.log('login changed')
      },
      currentUser () {
        console.log('current user changed to ' + this.currentUser)
      }
    }
  }
</script>

<style>
.right {
  float: right
}
.padded {
  padding-left: 4rem;
  padding-right: 4rem;
}
.fillParentHeight {
  height: inherit;
}
</style>