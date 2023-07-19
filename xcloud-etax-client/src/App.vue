<template>
  <a-config-provider :locale="zhCN">
    <div id="app">
      <Layout />
      <div id="pay-box"></div>
    </div>
  </a-config-provider>
</template>

<script>
import Layout from '@/layout';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
export default {
  name: 'App',
  components: { Layout },
  data() {
    return {
      zhCN,
    };
  },
};
</script>
