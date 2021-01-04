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
      }
    }
  }
</script>