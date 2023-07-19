<template>
  <a-layout class="home-wrap">
    <a-layout-sider v-model:collapsed="collapsed" :width="220" :trigger="null" collapsible class="sider-wrap">
      <Sider />
    </a-layout-sider>
    <a-layout>
      <Header />
      <Tabs />
      <Content />
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '@/stores/store';
import Sider from '@/components/layouts/Sider.vue';
import Header from '@/components/layouts/Header.vue';
import Tabs from '@/components/layouts/Tabs.vue';
import Content from '@/components/layouts/Content.vue';

const collapsed = computed<boolean>(() => useStore().collapsed);
</script>

<style scoped lang="less">
.home-wrap {
  height: 100vh;
}
</style>
