<template lang='pug'>
  img.fullBody#fadeID.fadeElement(:src='image')
</template>

<script>

export default {
  data () {
    return {
      delay: 8000,
      visible: 1,
      imageIndex: 0,
      onPage: false,
      images: ['leaves.jpg', 'pour2.webp', 'socks.webp', 'steep.webp'],
      credits: ['Koko Rahmadie from Pexels', 'NIKOLAY OSMACHKO from Pexels', 'Pixabay', 'Julia Sakelli from Pexels'],
    }
  },
  mounted () {
    this.onPage = true
    this.fadeInOut()
  },
  beforeDestroy () {
    this.onPage = false
  },
  computed: {
    image () {
      return './assets/images/' + this.images[this.imageIndex]
    }
  },
  methods: {
    fade (show) {
      if (this.onPage) {
        var el = document.getElementById("fadeID")
        if (el) {
          el.style.opacity = show;
        }
      } else {
        console.log('ignore (on new page)')
      }
    },
    async fadeInOut () {
      setTimeout( () => {
        if (this.onPage) {
          this.nextImage()
          this.fadeInOut()
        }
      }, this.delay)
    },
    nextImage () {
      this.fade(0)

      setTimeout( () => {
        if (this.imageIndex >= this.images.length - 1) {
          this.imageIndex = 0
        } else {
          this.imageIndex++
        }
        setTimeout( () => {
          this.fade(1)
        }, 500)
      }, 2500)
    }
  },
  watch: {
    // imageIndex () {
    //   console.log(this.imageIndex + ' image: ' + this.image)
    // }
  }
}
</script>

<style>
.fadeElement {
  color: black;
  transition: opacity 3s;
}
</style>
