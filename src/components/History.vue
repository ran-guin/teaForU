<template lang='pug'>
  PageLayout(page='Profile')
    v-container
      v-card()
        v-card-title.cardHeader
          h2 History
        v-card-text
          v-container.padded
            h3 {{orders.length}} Orders:
            div(v-for='order in orders')
              h5 {{order.status}} : {{dateOf(order.placed)}} ({{order.deliveryMode}})
              ul
                li(v-for='item in order.items') {{item.name}} ({{item.qty}} x {{item.size}} : {{item.unit_cost}})

              hr

</template>
<script>
  import Shared from '@/mixins/Shared'
  import PageLayout from '@/layouts/PageLayout.vue'

  export default {
    components: { PageLayout },
    mixins: [
      Shared
    ],
    data () {
      return {
        orders: []
      }
    },
    props: {
      onCancel: { type: Function }
    },
    async created () {
      this.orders = await this.getOrder({user: this.loggedIn})
    },
    methods: {
      dateOf (date) {
        return date.toDate().toISOString().substring(0,10)
      }
    }
  }
</script>