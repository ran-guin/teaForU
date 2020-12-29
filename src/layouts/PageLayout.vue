<template lang='pug'>
  v-flex(xs12 fill-height)
    Header.myHeader(:page='page')

    v-flex.myBody.imgBody(v-if='bg' :style='myStyle')
      slot
    div.myBody(v-else :style='myStyle')
      hr.std-colour
      slot
    v-footer.myFooter(absolute)
      Footer(v-if='!noFooter')
    v-dialog(v-model='showMessage' max-width='80%')
      v-container
        v-card.coloured
          v-card-text
            h3 {{message}}
</template>

<script>
import Header from './Header.vue'
import Footer from './Footer.vue'

import config from '@/config'

export default {
  components: {
    Header,
    Footer
  },
  data () {
    return {
      showMessage: false,
      message: '',
      messageDelay: 2000
    }
  },
  onIdle () {
    if (config.timeout) {
      this.auth_logout('timeout')
    } else {
      console.log('idle... but timeout turned off')
    }
  },
  onActive () {
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ')
    console.log('... idle-vue monitoring status as active: ' + timestamp)
  },
  props: {
    title: {
      type: String
    },
    loggedIn: {
      type: Object
    },
    myStyle: {
      type: String
    },
    mode: {
      type: String
    },
    redirect: {type: Function},
    interests: {type: Array},
    events: {type: Array},
    invites: {type: Array},
    noMobileHeader: {
      type: Boolean,
      default: false
    },
    noFooter: {
      type: Boolean,
      default: false
    },
    noHeader: {
      type: Boolean,
      default: false
    },
    noRefresh: {
      // Refresh token automatically unless excluded specifically
      type: Boolean
    },
    noLogin: {
      type: Boolean
    },
    private: {
      type: Boolean,
      default: false
    },
    page: {
      type: String
    },
    bg: {
      type: Boolean
    }
  },
  mounted: function () {

  },
  created: function () {
    this.message = this.$route.params.timed_message || this.$route.query.timed_message
    var delay = this.$route.params.delay || this.$route.query.delay || this.messageDelay
    if (this.message) {
      this.showMessage = true
      var _this = this
      setTimeout(() => {
        _this.showMessage = false
      }, delay)
    }

  },
  computed: {
  }
}
</script>

<style lang='scss'>
$footer: 120px;
$header: 100px;

.myHeader {
  height: $header;
}
.myBody, .fullBody {
  min-height: calc(100vh - #{$footer} - #{$header});
}

.fullBody {
  height: calc(100vh - #{$footer} - #{$header});
}


.myFooter {
  height: $footer;
}
</style>
