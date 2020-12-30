<template lang='pug'>
  PageLayout(page='About')
    v-container
      v-row
        v-flex(:class="$vuetify.breakpoint.lgAndUp ? 'lg8' : 'lg12'")
          h2 Bio for Subir
        v-flex(v-if='$vuetify.breakpoint.lgAndUp' lg4)
          h2 Photo(s)
</template>

<script>
import PageLayout from '@/layouts/PageLayout.vue'
export default {
  components: {
    PageLayout
  }
}
</script>