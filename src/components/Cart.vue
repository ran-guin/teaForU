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
                    th.narrow Qty
                    th.wide Name
                    th.narrow Unit Price
                    th.narrow(v-if='sizes') Size
                    th.midSize Cost
                tr(v-for="item, key in contents")
                  td.centred
                    input(type='number' size=5 v-model='item.qty')
                  td {{item.name}}
                  td.centred(text-align='center') {{item.cost}}
                  td.centred(v-if='sizes') {{item.size}}
                  td.centred()
                    b.subtotal ${{ subtotal(item.cost, item.qty) }}
              v-row.justify-space-between.align-center.total 
                h4.subtotal Sub-total: ${{ Number((items.subtotal).toFixed(2)) }}
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
                //- form.right(action="/process-payment" method="POST")
                v-btn.btn-primary.right(:disabled="!items") Checkout
                  //- stripe-checkout(stripe-key="my-stripe-key" product="product(tea.name, tea.description, tea.price100g)")
              hr
              Checkout()
            div(v-else)
              h3 Nothing in Cart
              hr
              h3 Delivery Information:
              v-row.justify-space-around
                h4 {{customer.address || 'unknown address'}}
                v-btn(@click='customerInfo=true') Update my information 
    //- hr
    //- h5(v-for='content in contents') {{content}}
    //- form(action="/process-payment" method="POST")
    //-   button.btn.btn-primary(:disabled="!items") Checkout
    //-   stripe-checkout(stripe-key="my-stripe-key" product="product(tea.name, tea.description, tea.price100g)")

    v-dialog(v-model='customerInfo')
      v-card(max-width='600px')
        v-card-title.header
          h3 Customer Information
        v-card-text
          v-text-field(v-model='customer.name' label='Name')
          v-text-field(v-model='customer.address' label='Address')
          v-text-field(v-model='customer.email' label='Email')
          v-text-field(v-model='customer.phone' label = 'Phone')
</template>

<script>
import Checkout from '@/components/Checkout'
// import { StripeCheckout } from 'vue-stripe-checkout'

export default {
  name: 'hello',
  components: {
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
      customerInfo: false
    }
  },
  props: {
    add: { type: Function },
    recalculate: { type: Function },
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
  padding: 1rem;
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