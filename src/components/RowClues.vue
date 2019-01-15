<template>
  <div class="clues" :style="styleObject">
    <clue v-for="(clue, index) in clues" :key="index + 1" :color="clue.color">
      {{ clue.count }}
    </clue>
  </div>
</template>

<script>
import Clue from './Clue.vue'
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
  components: {
    Clue,
  },
}
</script>

<style scoped>
  .clues {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    height: 20px;
    border-style: solid none solid none;
    border-color: grey;
    border-top-width: thin;
  }
</style>
