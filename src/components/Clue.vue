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
    completed: Boolean,
  },
  computed: {
    styleObject: function () {
      return {
        color: this.color,
        opacity: this.completed ? 0.4 : 1,
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
    line-height: 20px;
  }
</style>
