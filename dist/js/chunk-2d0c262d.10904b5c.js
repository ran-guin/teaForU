(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0c262d"],{"49a3":function(e,t,r){"use strict";r.r(t);var n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("PageLayout",{attrs:{page:"Profile"}},[r("v-container",[r("v-card",[r("v-card-title",{staticClass:"cardHeader"},[r("h2",[e._v("History")])]),r("v-card-text",[r("v-container",{staticClass:"padded"},[r("h3",[e._v(e._s(e.orders.length)+" Orders:")]),e._l(e.orders,(function(t){return r("div",[r("h5",[e._v(e._s(t.status)+" : "+e._s(e.dateOf(t.placed))+" ("+e._s(t.deliveryMode)+")")]),r("ul",e._l(t.items,(function(t){return r("li",[e._v(e._s(t.name)+" ("+e._s(t.qty)+" x "+e._s(t.size)+" : "+e._s(t.unit_cost)+")")])})),0),r("hr")])}))],2)],1)],1)],1)],1)},a=[],s=(r("96cf"),r("1da1")),c=r("973f"),o=r("45eb"),i={components:{PageLayout:o["a"]},mixins:[c["a"]],data:function(){return{orders:[]}},props:{onCancel:{type:Function}},created:function(){var e=this;return Object(s["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.getOrder({user:e.loggedIn});case 2:e.orders=t.sent;case 3:case"end":return t.stop()}}),t)})))()},methods:{dateOf:function(e){return e.toDate().toISOString().substring(0,10)}}},d=i,u=r("2877"),l=r("6544"),f=r.n(l),_=r("b0af"),p=r("99d9"),v=r("a523"),h=Object(u["a"])(d,n,a,!1,null,null,null);t["default"]=h.exports;f()(h,{VCard:_["a"],VCardText:p["b"],VCardTitle:p["c"],VContainer:v["a"]})}}]);
//# sourceMappingURL=chunk-2d0c262d.10904b5c.js.map