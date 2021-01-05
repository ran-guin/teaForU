<template lang='pug'>
  div
    v-container
      v-row.justify-space-around
        v-btn.btn-primary(@click='paymentForm=true') Arrange Payment
    v-dialog(v-model='paymentForm' width=800)
      v-card
        v-card-title.cardHeader
          h2 Payment Processing
        v-card-text
          h2 We currently accept e-transfers or cash (on pickup)
          h3 We will let you know when your order is ready 
          //- h2(v-if='currentUser') Email Address: {{currentUser.email}}
          v-text-field(v-model='form.email' label='Email Address' type='email' placeholder='...so we can notify you when your order is ready')
          //- v-text-field(label='Notes')
          v-row.justify-space-around
            v-radio-group(v-model='form.paymentMode')
              v-radio(value='transfer' label='I will e-transfer this amount') 
              v-radio(value='cash' label='I will pay on pickup') 
            v-btn.btn-primary(@click='confirm' :disabled='disable') Confirm Order
            v-btn(@click='paymentForm=false') Cancel
</template>

<script>
import Shared from '@/mixins/Shared'
import { StripeCheckout } from 'vue-stripe-checkout';
export default {
  components: {
    StripeCheckout
  },
  mixins: [
    Shared
  ],
  data: () => ({
    paymentForm: false,
    form: {email: ''},
    loading: false,
    publishableKey: process.env.PUBLISHABLE_KEY || 'abc',
    // items: [
    //   {
    //     sku: 'sku_FdQKocNoVzznpJ', 
    //     quantity: 1
    //   }
    // ],
    successUrl: 'your-success-url',
    cancelUrl: 'your-cancel-url',
  }),
  props: {
    items: {
      type: Array,
      default () { return [] }
    },
    deliveryMode: {
      type: String
    }
  },
  created () {
    if (this.currentUser) {
      this.form.email = this.currentUser.email
    }
  },
  computed: {
    disable () {
      var okay = this.form.email && this.form.paymentMode

      return !okay
    }
  },
  methods: {
    checkout () {
      this.$refs.checkoutRef.redirectToCheckout();
    },
    confirm () {
      console.log('Confirm Order')
      const order = this.items.map(d => { 
        return {id: d.id, name: d.name, qty: d.qty, unit_cost: d.cost, size: d.size}
      })
      console.log(JSON.stringify(order))
      var data = {
        user: this.loggedIn,
        placed: new Date(),
        status: 'Ordered',
        email: this.form.email,
        items: order,
        deliveryMode: this.deliveryMode,
        paymentMode: this.form.paymentMode
      }
      this.confirmOrder(data)
    }
  }
}
</script>