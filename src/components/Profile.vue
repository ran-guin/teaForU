<template lang='pug'>
  v-card()
    v-card-title.cardHeader
      h2 Profile
    v-card-text
      v-container.padded
        h2 uid: {{currentUser.uid}}
        h2 email: {{currentUser.email}}
        h2 verified: {{currentUser.emailVerified}}
        h2 phone: {{currentUser.phoneNumber}}
        h2 name: {{currentUser.displayName}}

</template>
<script>
  import Shared from '@/mixins/Shared'

  export default {
    mixins: [
      Shared
    ],
    data () {
      return {}
    }
  }
</script>