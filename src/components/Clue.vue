<template>
  <div class="clue" :style="styleObject">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Clue',
  props: {
    color: String,
  },
  computed: {
    styleObject: function () {
      return {
        color: this.color,
      }
    },
  },
}
</script>

<style scoped>
  .clue {
    width: 20px;
    height: 20px;
    font-size: 15px;
    line-height:20px;
  }
</style>
