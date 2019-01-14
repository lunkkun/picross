<template>
  <div class="board">
    <div class="segment"></div>
    <div class="segment">
      <column-clues v-for="colnum in width" :key="colnum" :colnum="colnum - 1"></column-clues>
    </div>
    <div class="segment">
      <row-clues v-for="rownum in height" :key="rownum" :rownum="rownum - 1"></row-clues>
    </div>
    <div class="segment">
      <div v-for="rownum in height" :key="rownum">
        <tile v-for="colnum in width" :key="rownum * 1000 + colnum" :rownum="rownum - 1" :colnum="colnum - 1"></tile>
      </div>
    </div>
  </div>
</template>

<script>
import Tile from './Tile.vue'
import ColumnClues from './ColumnClues.vue'
import RowClues from './RowClues.vue'
import {mapGetters} from 'vuex'

export default {
  name: 'Board',
  created: function () {
    let board = require('../boards/healthy-snack.json')
    this.$store.dispatch('board/load', board)
  },
  computed: {
    ...mapGetters({
      width: 'board/width',
      height: 'board/height',
    }),
  },
  components: {
    Tile,
    ColumnClues,
    RowClues,
  },
}
</script>

<style scoped lang="scss">
  .board {
    display: inline-grid;
    grid-template-columns: auto auto;
  }
  .segment {
    border-style: none solid solid none;
  }
</style>
