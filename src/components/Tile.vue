<template>
  <div class="tile"
    :class="classes"
    :style="styles"
    @click.left="changeColor"
    @click.right="markOrUnmarkTileAsEmpty"
    @contextmenu.prevent
    @mouseenter="setHovered()">
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
      return this.$store.getters['board/tileColor'](this.rownum, this.colnum)
    },
    /**
     * Determines the color for the tile when hovered.
     * We differentiate between light and dark colors.
     * For our purpose, colors with a brightness of 32 and below are considered dark.
     * For dark colors, we make the hovered color lighter, by calculating the relative distance to our defined bound
     * and multiplying by a factor of 20, with a baseline of 5.
     * For lighter colors, we make the hovered color lighter, by calculating the relative distance to our defined bound
     * and multiplying by a factor of 10, with a baseline of 5.
     *
     * @returns {string}
     */
    hoveredColor: function () {
      let color = tinycolor(this.color)
      let brightness = color.getBrightness()
      if (brightness > 32) {
        color.darken((brightness - 32) / 224 * 10 + 5)
      } else {
        color.lighten((32 - brightness) / 32 * 20 + 5)
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
    classes: function () {
      return {
        'thick-border-right': this.colnum % 5 === 4 && this.colnum < this.width - 1,
        'thick-border-bottom': this.rownum % 5 === 4 && this.rownum < this.height - 1,
        'white-text': this.defaultColorBrightness < 144,
        'light-border': this.defaultColorBrightness < 144 && this.defaultColorBrightness > 112,
      }
    },
    styles: function () {
      return {
        'background-color': this.hovered ? this.hoveredColor : this.color,
      }
    },
    defaultColorBrightness: function () {
      return tinycolor(this.defaultColor).getBrightness()
    },
    ...mapGetters({
      width: 'board/width',
      height: 'board/height',
      defaultColor: 'board/defaultColor',
      editing: 'board/editing',
      boardIsCompleted: 'board/isCompleted',
    }),
  },
  methods: {
    changeColor: function () {
      this.$store.commit('board/incrementTileColor', {rownum: this.rownum, colnum: this.colnum})
    },
    markOrUnmarkTileAsEmpty: function () {
      if (this.editing) {
        this.$store.commit('board/setTileToDefaultColor', {rownum: this.rownum, colnum: this.colnum})
      } else {
        this.$store.commit('board/toggleTileMarkedAsEmpty', {rownum: this.rownum, colnum: this.colnum})
      }
    },
    setHovered: function () {
      this.$store.commit('board/setHovered', {rownum: this.rownum, colnum: this.colnum})
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
    border: thin solid grey;
    color: black;
    cursor: default;
    user-select: none;
  }
  .thick-border-right {
    border-right-width: medium;
  }
  .thick-border-bottom {
    border-bottom-width: medium;
  }
  .white-text {
    color: white;
  }
  .light-border {
    border-color: lightgrey;
  }
</style>
