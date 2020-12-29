<template lang='pug'>
  PageLayout(page='Public')
    Cart
  </template>

<script>
// @ is an alias to /src
import PageLayout from '@/layouts/PageLayout.vue'
import Cart from '@/components/Cart.vue'
import Shared from '@/mixins/Shared.vue'

// import config from '@/config'

export default {
  name: 'Home',
  components: {
    PageLayout,
    Cart
  },
  mixins: [
    Shared
  ],
  data () {
    return {
    }
  },
  created () {
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style>
</style>
