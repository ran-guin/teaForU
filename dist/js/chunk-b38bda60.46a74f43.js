(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-b38bda60"],{"20a2":function(e,t,r){},"66aa":function(e,t,r){"use strict";r.r(t);var a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("v-card",[r("v-card-title",{staticClass:"cardHeader"},[r("h2",[e._v("Profile")])]),r("v-card-text",[r("v-container",{staticClass:"padded"},e._l(e.show,(function(t,a){return r("v-text-field",{attrs:{label:t,disabled:e.disable(t)},model:{value:e.form[a],callback:function(t){e.$set(e.form,a,t)},expression:"form[key]"}})})),1),e.message?r("h3",{staticClass:"message"},[e._v(e._s(e.message))]):e._e(),e.error?r("h3",{staticClass:"error"},[e._v(e._s(e.error))]):e._e()],1),r("v-card-actions",[r("v-row",{staticClass:"justify-space-around"},[r("v-btn",{staticClass:"btn-primary",on:{click:e.update}},[e._v("Update")]),r("v-btn",{on:{click:e.cancel}},[e._v("Cancel")])],1)],1)],1)},n=[],s=(r("b64b"),r("d3b7"),r("ddb0"),r("973f")),i={mixins:[s["a"]],data:function(){return{form:{},show:{displayName:"Username",email:"Email"},message:"",error:""}},props:{onCancel:{type:Function}},created:function(){for(var e=this.keys,t=0;t<e.length;t++)this.$set(this.form,e[t],this.currentUser[e[t]]);console.log(JSON.stringify(this.form)),this.message="",this.error=""},computed:{currentUser:function(){return this.$store.state.user},keys:function(){return Object.keys(this.show)}},methods:{update:function(){var e=this;console.log("update user information..."+JSON.stringify(this.form)),this.currentUser.updateProfile(this.form).then((function(){e.message="Updated information...",console.log(e.currentUser),setTimeout((function(){e.message="",e.onCancel&&e.onCancel()}),3e3)})).catch((function(t){console.log("Error updating information: "+t.message),e.error="Error upating information"}))},verified:function(e){return"Email"===e?this.currentUser.emailVerified?"mdi-check":"mdi-alert":""},disable:function(e){return"Email"===e},cancel:function(){this.onCancel()}}},o=i,c=(r("ad3f"),r("2877")),l=r("6544"),u=r.n(l),d=r("8336"),f=r("b0af"),m=r("99d9"),h=r("a523"),p=r("0fd9"),b=r("8654"),v=Object(c["a"])(o,a,n,!1,null,"94ca9b1e",null);t["default"]=v.exports;u()(v,{VBtn:d["a"],VCard:f["a"],VCardActions:m["a"],VCardText:m["b"],VCardTitle:m["c"],VContainer:h["a"],VRow:p["a"],VTextField:b["a"]})},ad3f:function(e,t,r){"use strict";r("20a2")}}]);
//# sourceMappingURL=chunk-b38bda60.46a74f43.js.map