<!-- formCreate 标题 -->
<template>
  <div class="cell-title">{{ title }}</div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    default: '',
  },
});
</script>

<style scoped lang="less">
.cell-title {
  line-height: 30px;
  font-size: 16px;
  font-weight: bold;
  margin: 15px 25px 10px;
}
</style>
