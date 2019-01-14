<template>
  <div class="tile noselect" :style="styleObject"
    @click.left="changeColor"
    @click.right="toggleMarkedAsEmpty"
    @contextmenu.prevent>
    <span v-if="markedAsEmpty">-</span>
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
    markedAsEmpty: function () {
      return this.$store.getters['board/tileMarkedAsEmpty'](this.rownum, this.colnum)
    },
    styleObject: function () {
      return {
        'background-color': this.color,
        'border-right-width': this.colnum % 5 === 4 && this.colnum < this.width - 1 ? 'medium' : 'thin',
        'border-bottom-width': this.rownum % 5 === 4 && this.rownum < this.height - 1 ? 'medium' : 'thin',
        'color': tinycolor(this.defaultColor).isDark() ? 'white' : 'black',
        'border-color': tinycolor(this.defaultColor).getBrightness() < 200 ? 'lightgrey' : 'grey',
      }
    },
    ...mapGetters({
      width: 'board/width',
      height: 'board/height',
      defaultColor: 'board/defaultColor',
    }),
  },
  methods: {
    changeColor: function () {
      this.$store.commit('board/incrementTileColor', {rownum: this.rownum, colnum: this.colnum})
    },
    toggleMarkedAsEmpty: function () {
      this.$store.commit('board/toggleTileMarkedAsEmpty', {rownum: this.rownum, colnum: this.colnum})
    },
  },
}
</script>

<style scoped>
  .tile {
    width: 20px;
    height: 20px;
    float: left;
    border-style: solid;
    border-top-width: thin;
    border-left-width: thin;
    text-align: center;
    cursor: default;
  }
  .noselect {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
  }
</style>
