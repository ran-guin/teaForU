<template lang='pug'>
  div.myCart
    b.input-lg {{items.count}} items: &nbsp; &nbsp;
    form.form#cartForm
      v-row.justify-space-around
        v-card(width='800px')
          v-card-title.cardHeader
            h3 Cart
          v-card-text
            div(v-if='contents.length')
              table.table(style='background-color: white')
                thead
                  tr
                    th
                    th.narrow Qty
                    th.wide Name
                    th.narrow Unit Price
                    th.narrow(v-if='sizes') Size
                    th.midSize Cost
                tr(v-for="item, key in contents")
                  td.centred
                    //- v-row.justify-space-around
                    //- span
                    v-btn(@click='plus(item.id)' x-small icon color='green')
                      v-icon(xs) mdi-plus
                    v-btn(@click='minus(item.name)' icon x-small color='orange')
                      v-icon mdi-minus
                  td.centred
                      span {{item.qty}}
                  td {{item.name}}
                  td.centred(text-align='center') {{item.cost}}
                  td.centred(v-if='sizes') {{item.size}}
                  td.centred()
                    b.subtotal ${{ subtotal(item.cost, item.qty) }}
              v-row.justify-space-between.align-center.total 
                h4.subtotal Sub-total: ${{ Number((items.subtotal).toFixed(2)) }}
                v-btn.btn-primary(@click='clearModal=true') Clear Cart
              h3 Delivery Information:
              v-row.justify-space-around
                h4 {{customer.address || 'unknown address'}}
                v-btn(@click='customerInfo=true') Update my information 
              v-radio-group(v-model='deliveryMode')
                v-radio(value='pickup' label='Will pick up (no charge)' @click='deliveryCost=0') 
                v-radio(value='mail' label='Deliver by mail ($)' @click='deliveryCost=mailCost') 
                v-radio(value='dropoff' label='Deliver in person  ($0.50 / km)' @click='deliveryCost=10')
              h3.subtotal Delivery Cost: ${{deliveryCost}}
              v-row.justify-space-between.align-center.total 
                h4.highlight Total: ${{ Number((items.total).toFixed(2)) }}
              Checkout(:items='contents' :deliveryMode='deliveryMode')
              
            div(v-else)
              h3 Nothing in Cart
              hr
              h3 Delivery Information:
              v-row.justify-space-around
                h4 {{customer.address || 'unknown address'}}
                v-btn(@click='customerInfo=true') Update my information 

    v-dialog(v-model='customerInfo' width='500')
      v-card(max-width='600px')
        v-card-title.header
          h3 Customer Information
        v-card-text
          v-text-field(v-model='customer.name' label='Name')
          v-text-field(v-model='customer.address' label='Address')
          v-text-field(v-model='customer.email' label='Email')
          v-text-field(v-model='customer.phone' label = 'Phone')
          v-row.justify-space-around
            v-btn(@click='updateInfo') Update
            v-btn(@click='clearDialog') Cancel        
    v-dialog(v-model='clearModal' width='600px')
      v-card()
        v-card-text
          h3 Are you sure you want to clear the contents of the cart ?
          v-row.justify-space-around
            v-btn.btn-primary(@click='confirmClear()') Yes
            v-btn(@click='clearDialog') Cancel        

</template>

<script>
import Checkout from '@/components/ManualCheckout'
import stripe from 'stripe'
// import { StripeCheckout } from 'vue-stripe-checkout'

export default {
  name: 'hello',
  components: {
    // StripeCheckout,
    Checkout
  },
  data () {
    return {
      showCart: true,
      total: 0,
      sizes: true, // include if size information is included in itemized list
      deliveryMode: '',
      deliveryCost: 5,
      mailCost: 15,
      customer: {},
      customerInfo: false,

      clearModal: false
    }
  },
  props: {
    add: { type: Function },
    recalculate: { type: Function },
  },
  created () {
    console.log("Contents: " + JSON.stringify(this.contents))
  },
  computed: {
    contents () {
      return this.$store.getters.contentsOfCart
    },
    product: function (name, desc, price) {
      return { name: name, description: desc, cost: price }
    },
    items: function () {
      var ids = Object.keys(this.contents)
      var count = 0
      var subtotal = 0
      // var total = 0
      for (var i = 0; i < ids.length; i++) {
        var qty = this.contents[i].qty || 1
        var price = this.contents[i].cost || 0
        if (price.constructor === String) {
          price = price.replace('$', '')
        }
        // var subtotal = this.contents[ids[i]].cost * qty
        // total += subtotal
        count += qty
        subtotal += qty * price
      }

      const total = subtotal + this.deliveryCost
      
      // this.total = total .. cannot introduce side-effects
      return {count: count, subtotal: subtotal, total: total}
    }
  },
  methods: {
    plus (id) {
      this.$store.dispatch('increaseQtyInCart', id)
    },
    minus (id) {
      this.$store.dispatch('reduceQtyInCart', id)
    },
    openCart () {
      this.showCart = true
    },
    closeCart () {
      this.showCart = false
    },
    add2cart (item) {
      if (this.add) {
        console.log('add to contents...')
        this.add(item)
      } else {
        console.log('no add function supplied')
      }
    },
    subtotal (cost, qty) {
      if (cost.constructor === String) {
        cost = cost.replace('$','')
      } else {
        cost = cost || 0
      }

      return Number((cost * qty).toFixed(2))
    },
    updateInfo () {
      console.log('update form info... TBD')
    },
    clearDialog() {
      this.closeCart()
      this.clearModal = false
    },
    confirmClear () {
      this.$store.dispatch('clearCart')
      this.clearModal = false
    },
    checkout () {
      console.log('checkout ...')

      stripe
        .redirectToCheckout({
          lineItems: [
            // Replace with the ID of your price
            {price: 'price_123', quantity: 1},
          ],
          mode: 'payment',
          successUrl: 'https://google.com',
          cancelUrl: 'https://cbc.com',
        })
        .then(function(result) {
          console.log('r: ' + JSON.stringify(result))
          // If `redirectToCheckout` fails due to a browser or network
          // error, display the localized error message to your customer
          // using `result.error.message`.
        })
        .catch (err => {
          console.log('err: ' + err.message)
        });

      // var config = {
      //   data-key: 'abc',
      //   data-amount: '5',
      //   data-currency: 'cad',
      //   data-locale: 'auto'
      // }
      // axios.post('//checkout.stripe.com/v2/checkout.js', config)
      // .then (response => {
      //   console.log("stripe response: " + JSON.stringify(response))
      // })
      // .catch (err => {
      //   console.log("stripe err: " + err.message)
      // })

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.narrow {
  width: 100px;
}
.midSize {
  width: 200px;
}
.centred {
  text-align: center;
}
.total {
  border: 1px solid black;
  padding: 0.25rem;
  background-color: #eee;
}
.highlight {
  font-weight: bold;
  color: red;
}
.subtotal {
  font-weight: bold;
  color: orange;
}

.myCart {
  /*position: relative;*/
  /*right: 20px;*/
  margin: 10px;
}

.myOpenCart {
  /*position: relative;*/
  background-color: #eee;
  padding: 10px;
  border: 1px solid black;
  /*width: 100%;*/
  min-width: 400px;
}

.myClosedCart {
  /*position: relative;*/
  background-color: #999;
  padding: 20px;
  padding-top: 20px;
  border: 1px solid black;
}

ul {
  list-style-type: none;
}

</style>