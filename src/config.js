export default {
    headerTitle: 'Tea4U',
    footerTitle: 'Community Teas',
    teaTypes: ['Green', 'Black', 'Oolong', 'Rooibos', 'Sencha', 'Tisane', 'Yerba'],
    Teas: [
        {name: 'Rooibos Vanilla', type: 'Tisanes', subtype: 'Rooibos', cost_100g: 15, cost_200g: 25, description: 'Classic Rooibos with orange'},
        {name: 'Rooibos Honeybush', type: 'Tisanes', subtype: 'Rooibos', cost_100g: 15, cost_200g: 25},
        {name: 'Earl Grey', type: 'Black', subtype: 'Earl Grey', cost_100g: 15, cost_200g: 25},
        {name: 'Lady Earl Grey', type: 'Black', subtype: 'Earl Grey', cost_100g: 15, cost_200g: 25},
        {name: 'Organic Earl Grey', type: 'Black', subtype: 'Earl Grey', cost_100g: 15, cost_200g: 25},
        {name: 'Oolong', type: 'Oolong', subtype: '', cost_100g: 15, cost_200g: 25},
        {name: 'Jasmine', type: 'Green', subtype: 'Jasmine', cost_100g: 15, cost_200g: 25},
        {name: 'Earl Grey', type: 'Green', subtype: 'Earl Grey', cost_100g: 15, cost_200g: 25}
    ],

    firebaseConfig: {
        apiKey: "AIzaSyDnl1ewdgGxfITaVssdvEqhjWQEty1snLw",
        authDomain: "tea4u-f1576.firebaseapp.com",
        projectId: "tea4u-f1576",
        storageBucket: "tea4u-f1576.appspot.com",
        messagingSenderId: "365036120067",
        appId: "1:365036120067:web:339d451b650dcc33388636",
        measurementId: "G-E4VK6M97MN"
    },
    rules: {
        required: [ value => !!value || 'Required.' ],
        email: [
            v => !!v || 'Email is required',
            v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(v) || 'Email must be valid'
        ],
        NAPhone: [
            v => !v || /^(\+?1 |)\(\d\d\d\) \d\d\d-\d\d\d\d$/.test(v) || 'Phone must be valid and include area code'
        ],
        internationalPhone: [
            v => !v || /^\+\d+ [\d\s\-()]{5,15}$/.test(v) || 'Phone must be valid and include country and area code'
        ],
        phone: [
            v => !v || /^(\+\d+ |)\(?\d\d\d(\) | |-)\d\d\d(-| )\d\d\d\d$/.test(v) || 'phone must include area code eg 604 123-4567'
        ],
        username: [
            v => !!v || 'Name is required',
            v => v && v.length >= 3 && v.length <= 32 || 'Name must be between 3 and 32 characters',
            v => /^[a-zA-Z0-9.\-_@]+$/.test(v) || 'The only non-alphanumeric characters allowed in names are: @ . - _'      
        ],
        password: [
            v => !!v || 'Password is required',
            v => v && v.length >= 6 || 'Password must be at least 6 characters'
        ]
    },              
    dynamicRules: {
        counter: (value, l) => {
            if (value.length <= l) { return [] }
            else { return value.length + ' Max ' + l + ' characters' }
        },
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
        min: function (m) {
          m = m || 8
          return v => (v && v.length >= m) ? true : 'Must be at least ' + m + ' characters'
        },
        max: function (m) {
          return v => (v && v.length <= m) ? true : 'May not exeed ' + m + ' characters'
        },
        password: function () {
            return v => (v && v.length >= 8) ? true : 'Must be at least 8 characters'
        },
        username: function () {
            return v => (v && v.length >= 3) ? true : 'Must be at least 3 characters'
        }
    }
}