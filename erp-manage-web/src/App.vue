<template>
  <a-config-provider :locale="zhCN">
    <div id="app">
      <router-view />
      <div v-show="loading" class="pa-app-spin">
        <a-spin :spinning="loading" :indicator="indicator" size="large" />
      </div>
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { mapState } from 'vuex'

export default {
  name: 'App',
  components: {},
  data() {
    return {
      zhCN,
      indicator: <a-icon type='loading' size='font-size: 30px' spin></a-icon>
    }
  },
  computed: {
    ...mapState({
      // loading: (state) => state.app.isLoading
      loading: (state) => state.vars.isLoading
    })
  },
  created() {
    this.$message.config({
      maxCount: 1
    })
  }
}
</script>

<style lang="less">
#app {
  .pa-app-spin {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    z-index: 1001;
    background: rgba(255, 255, 255, 0.3);
    .ant-spin {
      position: absolute;
      top: 50%;
      display: block;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
