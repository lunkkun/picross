<template>
  <td class="tile" :style="styleObject"
  ></td>
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
        "border-top-width": this.rownum % 5 === 0 ? "medium" : "thin",
        "border-right-width": this.colnum % 5 === 4 ? "medium" : "thin",
        "border-bottom-width": this.rownum % 5 === 4 ? "medium" : "thin",
        "border-left-width": this.colnum % 5 === 0 ? "medium" : "thin",
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
  }
</style>