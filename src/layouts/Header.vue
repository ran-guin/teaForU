<template lang='pug'>
  div
    div.padded.fillParentHeight()
      v-row.fillParentHeight.justify-space-between.align-center()
        div
          v-row
            img(v-if='logo' :src='logo' height='50px')
            v-icon(v-else color='black') mdi-coffee
            h3.light {{title}}
        div
          v-btn(large dark)
            router-link(to='/Teas' style='color: white; textDecoration: none') Shop for Teas
        div
          v-row.justify-end
            span
            v-btn(v-if='loggedIn' href='#Cart' style='margin-right: 2rem')
              router-link(to='/Cart')
                v-icon.dark mdi-cart
            span &nbsp;
            span
              div.text-center
                v-btn(v-if='!loggedIn' @click='showLogin=true') Login
                v-menu(v-else offset-y dark)
                  template(v-slot:activator="{on, attrs}")
                    v-btn(v-bind='attrs' v-on='on')
                      v-avatar.mr-2(v-if='currentUser.pic' size=30)
                        img(:src='currentUser.pic')
                      b(v-else) {{showName}}
                  v-list(style='background-color: sienna')
                    v-list-item(v-if='loggedIn' @click='logout()') Logout
                    //- v-list-item(v-else @click='logout()') Logout
                    v-list-item(v-if='loggedIn' @click='logout()')
                      hr(width='100%')
                    v-list-item(v-for='item in general_menu')
                        v-list-item-title
                          a(v-if='item.icon' :href='item.link' style='color: white; ')
                            v-icon {{item.icon}}
                          a(v-else :href='item.link' style='color: white; ') {{item.title}}
                    v-list-item(v-if='loggedIn' @click='logout()')
                      hr(width='100%')
                    v-list-item(v-for='item in personal_menu')
                        v-list-item-title
                          b(v-if='item.open' @click='open(item.open)' style='color: white; ')
                            b {{item.title}}
                          a(v-else-if='item.icon' :href='item.link' style='color: white; ')
                            v-icon {{item.icon}}
                          a(v-else :href='item.link' style='color: white; ') {{item.title}}
    v-dialog(v-model='showLogin' max-width='600px')
      Login(:onClose='closeDialog')
    v-dialog(v-model='editProfile' max-width='600px')
      Profile(:onCancel='clearDialog' :onChange='loadUser' :reload='random')
</template>

<script>
  import config from '@/config'
  import Shared from '@/mixins/Shared'

  const Login = () => import('@/components/Login')
  const Profile = () => import('@/components/Profile')

  export default {
    components: {
      Login,
      Profile
    },
    mixins: [
      Shared
    ],
    data () {
      return {
        user: {},
        logo: '/assets/images/teacup.png',
        // pages: ['Teas', 'About'],
        general_menu: [
          {title: 'Public', link: '/Public', icon: 'home'},
          {title: 'About Tea4u', link: '/About'}
          // {title: 'Teas', link: '/Teas'}
        ],
        personal_menu: [
          {title: 'My Profile', link: '/Profile', open: 'editProfile'},
          {title: 'My Favourites', link: '/Favourites'},
          {title: 'My Orders', link: '/Orders'}
        ],

        showLogin: false,
        editProfile: false,
        
        
        Htab: '',

        title: config.headerTitle || 'Header',
        random: 0
        // logo: 'T4U.png'
      }
    },
    props: {
      page: { type: String }
    },
    created (){
      console.log('init header ' + this.page)
      if (this.page) { this.Htab = this.page }
      this.loadUser()
    },
    computed: {
      showName () {
        if (this.user && this.user.username) {
          return this.user.username
        } else if (this.currentUser) {
          var parse = this.currentUser.displayName ? this.currentUser.displayName.match(/(.+)@/) : this.currentUser.email.match(/(.+)@/)
          if (parse) { 
            console.log('parsed: ' + JSON.stringify(parse))
            return parse[1]
          } else { return this.currentUser.displayName || '' }
        } else { return '' }
      }
    },
    methods: {
      async loadUser () {
        console.log('get user info from ' + JSON.stringify(this.currentUser))
        this.user = await this.userInfo(this.currentUser.uid)
        console.log('user: ' + JSON.stringify(this.user))
      },
      open (page) {
        this.clearDialog()
        this.random = this.randomInt(4)
        console.log('open ' + page + ' ' + this.random)
        this.$set(this, page, true)
        // this.editProfile = true
      },
      clearDialog () {
        this.editProfile = false
        this.showLogin = false
      },
      getName () {
        if (this.currentUser) {
          var parse = this.currentUser.displayName.match(/(.+)@/)
          if (parse) { 
            console.log('parsed: ' + JSON.stringify(parse))
            this.showName = parse[1]
          } else { this.showName = this.currentUser.displayName || '' }
        } else { this.showName = '' }
      },
      launchLogin () {
        this.showLogin = true
      },
      closeDialog (delay) {
        if (delay) {
          setTimeout( () => {
            this.showLogin = false
            this.showRegister = false
          }, delay)          
        } else {
          this.showLogin = false
          this.showRegister = false
        }
      },
      logout () {
        this.firebaseLogout()
        .then (response => {
          console.log('logged out ' + JSON.stringify(response))
          if (this.$route.path !== '/Public') {
            this.$router.replace('Public')
          }
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
        this.loadUser()
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