<template>
  <a-layout-content class="content-main-wrap">
    <RouterView />
  </a-layout-content>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
.content-main-wrap {
  padding: 10px 10px 0;
  overflow: auto;
}
</style>
