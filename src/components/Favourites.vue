<template lang='pug'>
  PageLayout(page='Profile')
    v-container
      v-card()
        v-card-title.cardHeader
          h2 Favourites
        v-card-text
          v-container.padded
            h2 No Favourites yet registered
            h4 (Note: this functionality may still be pending)

</template>
<script>
  import PageLayout from '@/layouts/PageLayout.vue'

  export default {
    components: { PageLayout },
    data () {
      return {}
    },
    props: {
      onCancel: { type: Function }
    }
  }
</script>