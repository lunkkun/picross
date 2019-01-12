<template>
  <div class="board">
    <div class="segment"></div>
    <div class="segment">Column clues</div>
    <div class="segment">Row clues</div>
    <div class="segment">
      <div v-for="rownum in height">
        <tile v-for="colnum in width" :rownum="rownum - 1" :colnum="colnum - 1"></tile>
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
    let winged = require('../boards/winged.json')
    this.$store.dispatch('board/load', winged)
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
</style>
