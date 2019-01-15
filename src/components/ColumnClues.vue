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
    styleObject: function () {
      return {
        'border-right-width': this.colnum % 5 === 4 && this.colnum < this.width - 1 ? 'medium' : 'thin',
        'opacity': this.completed ? 0.4 : 1,
      }
    },
    ...mapGetters({
      width: 'board/width',
    }),
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
    border-color: white;
    border-left-width: thin;
  }
  .clue {
    height: 20px;
    font-size: 15px;
  }
</style>
