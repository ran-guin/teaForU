export default {
    required: value => !!value || 'Required.',
    counter: (value, l) => {
      if (value.length <= l) { return }
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
    }
}