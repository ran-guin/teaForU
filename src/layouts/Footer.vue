<template lang='pug'>
  v-container
    h3.light {{title}}
</template>

<script>
import config from '@/config'
export default {
  data () {
    return {
      title: config.footerTitle || 'Footer',
    }
  }
}
</script>