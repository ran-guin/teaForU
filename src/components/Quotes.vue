<template lang='pug'>
  v-card.coloured()
    v-card-title.cardHeader
      h2 Tea ...
    v-card-text
      v-container.padded
        div(v-for='quote, i in quotes' :key='i')
          h4.light
            i {{quote.text}}
          h5.light - {{quote.by}}
          hr
</template>
<script>
  export default {
    data () {
      return {
        quotes: [
          {text: 'No matter where you are in the world, you are at home when tea is served', by: 'Earlene Grey'},
          {text: 'There is something in the nature of tea that leads us into a world of quiet contemplation of life', by: 'Lin Yutang'},
          {text: 'There is no problem on earth that can’t be ameliorated by a hot bath and a cup of tea', by: 'Jasper Fforde'},
          {text: 'Wherever you are drinking your tea, whether at work, in a cafe, or at home, it is wonderful to allow enough time to appreciate it', by: 'Thich Nhat Hanh'}
        ]
      }
    }
  }
</script>