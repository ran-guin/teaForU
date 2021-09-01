<script>
  import firebase from 'firebase'

  export default {
    data () {
      return {
      }
    },
    computed: {
      currentUser () {
        // return firebase.auth().currentUser || {}
        return this.$store.state.user
        // return {}
      },
      loggedIn () {
        return this.currentUser.uid
      },
      randomNumber () {
        var digits = 6
        return Math.floor(Math.random() * (10**digits))
      }
    },
    methods: {
      randomInt (digits) {
        return Math.floor(Math.random() * (10**digits))
      },
      firebaseLogout () {
        console.log('logout via mixin')
        this.$store.dispatch('clearCart')
        this.$store.dispatch('LOGOUT')
        return firebase.auth().signOut()
      },

      /*  *** Generic DB Accessors *** */
      async getRecord (table, ref, idField) {
        var db = firebase.firestore()
        
        var query = db.collection(table)

        if (idField) {
          query = query
            .where(idField, '==', ref)
            console.log(idField + ' : ' + ref)
        } else {
          query = query.doc(ref)
        }

        var found = await query.get()

        if (found && found.length) {
          console.log('found: ' + found.length)
          return Promise.resolve(found[0].data())
        } else {
          console.log('nothing found with ' + idField + ' : ' + ref)
          return Promise.resolve()
        }
      },
      async updateDB (table, ref, data) {
        var db = firebase.firestore()
        console.log(table + " update : " + ref)
        console.log(JSON.stringify(data))

        var record = db.collection(table)

        console.log(table + ' : ' + ref + ' : ' + JSON.stringify(data))
        
        if (ref) {
          var updated = record.doc(ref).update(data)
          return Promise.resolve(updated)
        } else {
          var added = record.set(data)
          console.log('added: ' + JSON.stringify(added))
          return Promise.resolve(added)
        }
      },

      /*  *** User Accessors *** */
      isAdmin () {
        if (this.currentUser && this.currentUser.email && this.currentUser.email.match('guin@')) {
          console.log('recognized admin')
          return true
        } else {
          console.log('not admin')
          return false
        }
      },
      async userInfo (ref) {
        var db = firebase.firestore()
        
        var found = await db.collection('users').doc(ref).get()
       
        if (found.exists) {
          return Promise.resolve(found.data())
        } else {
          return Promise.resolve(null)
        }
      },
      async updateUser (ref, data) {
        var db = firebase.firestore()
        console.log('update user : ' + ref + ' : ' + JSON.stringify(data))
        
        var updated = await db.collection('users').doc(ref).update(data)
        return Promise.resolve(updated)
      },
      async addUserInfo (ref, data) {
        var db = firebase.firestore()

        console.log('add user : ' + ref + ' : ' + JSON.stringify(data))
        
        // var added = await db.collection('users').doc(ref).set(data)
        var added = await db.collection('users').doc(ref).set(data)
        // var added = await db.collection('orders').doc('xyz').set(data)
        return Promise.resolve(added)
      },
  
      /*  *** Tea Accessors *** */
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
        // console.log(found)

        var Teas = []
        found.forEach(doc => {
          // console.log(doc.id + ' name: ' + doc.data().name)
          // console.log(doc.data())
          Teas.push(doc.data())
          Teas[Teas.length-1].id = doc.id
        });
        console.log('found ' + Teas.length + ' teas...')
        console.log(JSON.stringify(Teas))
        return Promise.resolve(Teas)
      },
      async addTea (form) {
        var db = firebase.firestore()
        var teas = db.collection('teas')
        
        console.log('add to database: ' + JSON.stringify(form))
        var added = teas.add(form)
        
        return Promise.resolve(added)
      },
      async updateTea (ref, data) {
        var db = firebase.firestore()
        var teas = db.collection('teas')

        console.log('update tea: ' + ref + ' : ' + JSON.stringify(data))
        teas.doc(ref).update(data)
        
        return Promise.resolve(data)
      },
      /*  *** Order Accessors *** */
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