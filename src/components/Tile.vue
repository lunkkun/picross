<template>
  <div class="tile" :style="styleObject"
    @click.left="changeColor"
    @click.right="toggleMarkedAsEmpty"
    @contextmenu.prevent
    @mouseenter="setHovered()"
    @mouseleave="unsetHovered()">
    <span v-if="showMarkedAsEmpty">-</span>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import tinycolor from 'tinycolor2'

export default {
  name: 'Tile',
  props: {
    rownum: Number,
    colnum: Number,
  },
  computed: {
    color: function () {
      let color = tinycolor(this.$store.getters['board/tileColor'](this.rownum, this.colnum))
      if (this.hovered) {
        if (color.getBrightness() > 16) {
          color.darken(color.getBrightness() / 256 * 30)
        } else {
          color.lighten(color.getBrightness() / 256 * 30)
        }
      }
      return color.toString()
    },
    markedAsEmpty: function () {
      return this.$store.getters['board/tileMarkedAsEmpty'](this.rownum, this.colnum)
    },
    showMarkedAsEmpty: function () {
      return this.markedAsEmpty && !this.boardIsCompleted
    },
    hovered: function () {
      return this.$store.getters['board/tileIsHovered'](this.rownum, this.colnum)
    },
    styleObject: function () {
      return {
        'background-color': this.color,
        'border-right-width': this.colnum % 5 === 4 && this.colnum < this.width - 1 ? 'medium' : 'thin',
        'border-bottom-width': this.rownum % 5 === 4 && this.rownum < this.height - 1 ? 'medium' : 'thin',
        'color': this.defaultColorBrightness < 144 ? 'white' : 'black',
        'border-color': this.defaultColorBrightness < 144 && this.defaultColorBrightness > 112 ? 'lightgrey' : 'grey',
      }
    },
    defaultColorBrightness: function () {
      return tinycolor(this.defaultColor).getBrightness()
    },
    ...mapGetters({
      width: 'board/width',
      height: 'board/height',
      defaultColor: 'board/defaultColor',
      boardIsCompleted: 'board/isCompleted',
    }),
  },
  methods: {
    changeColor: function () {
      this.$store.commit('board/incrementTileColor', {rownum: this.rownum, colnum: this.colnum})
    },
    toggleMarkedAsEmpty: function () {
      this.$store.commit('board/toggleTileMarkedAsEmpty', {rownum: this.rownum, colnum: this.colnum})
    },
    setHovered: function () {
      this.$store.commit('board/setHovered', {rownum: this.rownum, colnum: this.colnum})
    },
    unsetHovered: function () {
      this.$store.commit('board/unsetHovered', {rownum: this.rownum, colnum: this.colnum})
    },
  },
}
</script>

<style scoped>
  .tile {
    display: inline-block;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    vertical-align: bottom;
    font-size: 15px;
    border-style: solid;
    border-top-width: thin;
    border-left-width: thin;
    cursor: default;
    user-select: none;
  }
</style>
