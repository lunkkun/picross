<template>
  <div class="clues" :style="styleObject">
    <div class="clue" v-for="clue in clues" :key="clue.id" :style="{'color': clue.color}">
      {{ clue.count }}
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'RowClues',
  props: {
    rownum: Number,
  },
  computed: {
    clues: function () {
      return this.$store.getters['board/cluesForRow'](this.rownum)
    },
    completed: function () {
      return this.$store.getters['board/rowIsCompleted'](this.rownum)
    },
    styleObject: function () {
      return {
        'border-bottom-width': this.rownum % 5 === 4 && this.rownum < this.height - 1 ? 'medium' : 'thin',
        'opacity': this.completed ? 0.4 : 1,
      }
    },
    ...mapGetters({
      height: 'board/height',
    }),
  },
}
</script>

<style scoped>
  .clues {
    float: right;
    clear: both;
    border-style: solid none solid none;
    border-color: white;
    border-top-width: thin;
    height: 20px;
  }
  .clue {
    float: left;
    width: 20px;
  }
</style>
