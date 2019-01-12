<template>
  <td class="tile" :style="styleObject">
    <span v-if="markedAsEmpty">-</span>
  </td>
</template>

<script>
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
        "background-color": this.color,
        "border-right-width": this.colnum % 5 === 4 ? "medium" : "thin",
        "border-bottom-width": this.rownum % 5 === 4 ? "medium" : "thin",
      }
    },
  },
}
</script>

<style scoped>
  .tile {
    width: 20px;
    height: 20px;
    border-style: solid;
    border-top-width: thin;
    border-left-width: thin;
    text-align: center;
  }
</style>
