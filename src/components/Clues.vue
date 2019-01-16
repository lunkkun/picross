<template>
  <div class="clues" :class="classes">
    <clue v-for="(clue, index) in clues" :key="index" :color="clue.color" :completed="completed">
      {{ clue.count }}
    </clue>
  </div>
</template>

<script>
import Clue from './Clue.vue'
import {mapGetters} from 'vuex'

export default {
  name: 'Clues',
  props: {
    direction: String,
    index: Number,
  },
  computed: {
    clues: function () {
      return this.direction === 'row' ?
        this.$store.getters['board/cluesForRow'](this.index) :
        this.$store.getters['board/cluesForColumn'](this.index)
    },
    completed: function () {
      return this.direction === 'row' ?
        this.$store.getters['board/rowIsCompleted'](this.index) :
        this.$store.getters['board/columnIsCompleted'](this.index)
    },
    hovered: function () {
      return this.direction === 'row' ?
        this.$store.getters['board/rowIsHovered'](this.index) :
        this.$store.getters['board/columnIsHovered'](this.index)
    },
    classes: function () {
      return {
        column: this.direction === 'column',
        row: this.direction === 'row',
        'thick-border-right': this.direction === 'column' && this.index % 5 === 4 && this.index < this.width - 1,
        'thick-border-bottom': this.direction === 'row' && this.index % 5 === 4 && this.index < this.height - 1,
        hovered: this.hovered,
      }
    },
    ...mapGetters({
      width: 'board/width',
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
    justify-content: flex-end;
    border: thin grey;
  }
  .column {
    flex-direction: column;
    width: 20px;
    border-style: none solid none solid;
  }
  .row {
    flex-direction: row;
    height: 20px;
    border-style: solid none solid none;
  }
  .thick-border-bottom {
    border-bottom-width: medium;
  }
  .thick-border-right {
    border-right-width: medium;
  }
  .hovered {
    background-color: #EEEEEE;
  }
</style>
