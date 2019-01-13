<template>
  <div class="tile" :style="styleObject" @click="changeColor">
    <span v-if="markedAsEmpty">-</span>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

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
      }
    },
    ...mapGetters({
      width: 'board/width',
      height: 'board/height',
    }),
  },
  methods: {
    changeColor: function () {
      this.$store.commit('board/incrementTileColor', {rownum: this.rownum, colnum: this.colnum})
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
  }
</style>
