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
    }
  }
</script>