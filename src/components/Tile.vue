<template>
  <div class="tile"
    :class="classes"
    :style="styles"
    @click.left="changeColor"
    @click.right="markOrUnmarkTileAsEmpty"
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
  data: function () {
    return {
      hovered: false,
      markedAsEmpty: false,
      colorValue: 0,
    }
  },
  created: function () {
    if (this.editing) {
      this.colorValue = this.$store.getters['board/solutionColorValue'](this.rownum, this.colnum)
    }
  },
  computed: {
    color: function () {
      return this.colorScheme[this.colorValue]
    },
    /**
     * Determines the color for the tile when hovered.
     * We differentiate between light and dark colors.
     * For our purpose, colors with a brightness of 48 and below are considered dark.
     * For dark colors, we make the hovered color lighter, by calculating the relative distance to our defined bound
     * and multiplying by a factor of 20, with a baseline of 5.
     * For lighter colors, we make the hovered color lighter, by calculating the relative distance to our defined bound
     * and multiplying by a factor of 5, with a baseline of 5.
     *
     * @returns {string}
     */
    hoveredColor: function () {
      let color = tinycolor(this.color)
      let brightness = color.getBrightness()
      if (brightness > 48) {
        color.darken((brightness - 48) / 208 * 5 + 5)
      } else {
        color.brighten((48 - brightness) / 48 * 20 + 5)
      }
      return color.toString()
    },
    showMarkedAsEmpty: function () {
      return this.markedAsEmpty && !this.boardIsCompleted
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
      return tinycolor(this.colorScheme[0]).getBrightness()
    },
    ...mapGetters({
      width: 'board/width',
      height: 'board/height',
      colorScheme: 'board/colorScheme',
      editing: 'board/editing',
      boardIsCompleted: 'board/isCompleted',
    }),
  },
  methods: {
    changeColor: function () {
      if (this.colorValue === this.colorScheme.length - 1) {
        this.colorValue = 0
      } else {
        this.colorValue++
      }

      this.markedAsEmpty = false

      this.dispatchColorValue()
    },
    markOrUnmarkTileAsEmpty: function () {
      if (!this.editing) {
        this.markedAsEmpty = !this.markedAsEmpty
      }
      this.colorValue = 0

      this.dispatchColorValue()
    },
    dispatchColorValue: function () {
      this.$store.dispatch('board/setTileColorValue', {rownum: this.rownum, colnum: this.colnum, value: this.colorValue})
    },
    setHovered: function () {
      this.hovered = true
      this.$store.dispatch('board/setHovered', {rownum: this.rownum, colnum: this.colnum})
    },
    unsetHovered: function () {
      this.hovered = false
      // note: the store will be updated by the curser moving into another tile, or by leaving the board
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
