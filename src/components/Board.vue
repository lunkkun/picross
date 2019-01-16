<template>
  <div class="board">
    <div class="segment"></div>
    <div class="segment column-clues">
      <clues v-for="colnum in width" :key="colnum" :direction="'column'" :index="colnum - 1"></clues>
    </div>
    <div class="segment row-clues">
      <clues v-for="rownum in height" :key="rownum" :direction="'row'" :index="rownum - 1"></clues>
    </div>
    <div class="segment">
      <div class="tile-row" v-for="rownum in height" :key="rownum">
        <tile v-for="colnum in width" :key="rownum * 1000 + colnum" :rownum="rownum - 1" :colnum="colnum - 1"></tile>
      </div>
    </div>
  </div>
</template>

<script>
import Tile from './Tile.vue'
import Clues from './Clues.vue'
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
    Clues,
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
  .column-clues {
    display: flex;
    flex-direction: row;
  }
  .row-clues {
    display: flex;
    flex-direction: column;
  }
  .tile-row {
    white-space: nowrap;
  }
</style>
