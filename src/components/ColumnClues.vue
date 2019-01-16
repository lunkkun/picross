<template>
  <div class="clues" :style="styleObject">
    <clue v-for="(clue, index) in clues" :key="index + 1" :color="clue.color" :completed="completed">
      {{ clue.count }}
    </clue>
  </div>
</template>

<script>
import Clue from './Clue.vue'
import {mapGetters} from 'vuex'

export default {
  name: 'ColumnClues',
  props: {
    colnum: Number,
  },
  computed: {
    clues: function () {
      return this.$store.getters['board/cluesForColumn'](this.colnum)
    },
    completed: function () {
      return this.$store.getters['board/columnIsCompleted'](this.colnum)
    },
    hovered: function () {
      return this.$store.getters['board/columnIsHovered'](this.colnum)
    },
    styleObject: function () {
      return {
        'border-right-width': this.colnum % 5 === 4 && this.colnum < this.width - 1 ? 'medium' : 'thin',
        'background-color': this.hovered ? '#EEEEEE' : 'white',
      }
    },
    ...mapGetters({
      width: 'board/width',
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
    flex-direction: column;
    justify-content: flex-end;
    width: 20px;
    border-style: none solid none solid;
    border-color: grey;
    border-left-width: thin;
  }
</style>
