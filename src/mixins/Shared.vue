<script>
  import firebase from 'firebase'

  export default {
    data () {
      return {}
    },
    computed: {
      currentUser () {
        return firebase.auth().currentUser || {}
      },
      loggedIn () {
        return this.currentUser.uid
      }
    },
    methods: {
      firebaseLogout () {
        console.log('logout via mixin')
        this.$store.dispatch('clearCart')
        return firebase.auth().signOut()
      },
      isAdmin () {
        if (this.currentUser && this.currentUser.email && this.currentUser.email.match('guin@')) {
          return true
        } else {
          return false
        }
      },
      async getTea (filter) {
        var db = firebase.firestore()
        var teas = db.collection('teas')

        var query = teas
        if (filter) {
          if (filter.string) {
            query = query.where('name', '>=', filter.string).where('name', '<', filter.string + 'z')
          }
          if (filter.category) {
            query = query.where('category', '==', filter.category)
          }
          if (filter.list) {
            query = query.where('name', 'in', filter.list)
          }
        }
        var found = await query.get()
        console.log(found)

        var Teas = []
        found.forEach(doc => {
          console.log(doc.id + ' name: ' + doc.data().name)
          console.log(doc.data())
          Teas.push(doc.data())
          Teas[Teas.length-1].id = doc.id
        });
        console.log('found ' + Teas.length + ' teas...')
        console.log(JSON.stringify(Teas))
        return Promise.resolve(Teas)
      },
      addTea (form) {
        var db = firebase.firestore()
        var teas = db.collection('teas')
        
        console.log('add to database: ' + JSON.stringify(form))
        var added = teas.add(form)
        
        return Promise.resolve(added)
      },
      async getOrder (filter) {
        var db = firebase.firestore()
        var query = db.collection('orders')

        if (filter) {
          if (filter.user) {
            query = query.where('user', '==', filter.user)
          }
          if (filter.status) {
            query = query.where('status', '==', filter.status)
          }
        }
        var found = await query.get()
        console.log(found)

        var Orders = []
        found.forEach(doc => {
          console.log(doc.id)
          console.log(doc.data())
          Orders.push(doc.data())
          Orders[Orders.length-1].id = doc.id
        });
        console.log('found ' + Orders.length + ' orders...')
        console.log(JSON.stringify(Orders))
        return Promise.resolve(Orders)
      },

      confirmOrder (form) {
        var db = firebase.firestore()
        var orders = db.collection('orders')
        
        console.log('add to database: ' + JSON.stringify(form))
        var added = orders.add(form)
        
        return Promise.resolve(added)
      },
      async teaFavourites () {
        var db = firebase.firestore()
        var query = db.collection('favourites')

        if (this.loggedIn) {
          query = query.where('user', '==', this.loggedIn)
        
          var found = await query.get()
          console.log(found)
        
          if (found.length) {
            console.log('Favourites: ' + found.teas)
            return found.teas
          }
        }
        return []
      },
    }
   
  }
</script>