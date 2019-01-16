<template>
  <div class="clue" :class="classes" :style="styles">
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
    classes: function () {
      return {
        completed: this.completed,
      }
    },
    styles: function () {
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
    line-height: 20px;
  }
  .completed {
    opacity: 0.4;
  }
</style>
