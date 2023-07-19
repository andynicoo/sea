<template>
  <div class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <!-- <router-view /> -->
        <router-view v-if="authStatus === AUTH_STATUS_MAP.ALLOWED" :key="key" />
        <NotAllowed v-else type="403" />
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import NotAllowed from '@/view/error/Error.vue'
import { mapState } from 'vuex'
export default {
  name: 'AppMain',
  components: {
    NotAllowed
  },
  computed: {
    ...mapState({
      routeAuthMap: (state) => state.vars?.auth?.routeAuthMap ?? [],
      treeMenu: (state) => state.vars?.auth?.treeMenu ?? []
    }),
    cachedViews() {
      return []
    },
    AUTH_STATUS_MAP() {
      return {
        LOADING: 0,
        NULL: 1,
        ALLOWED: 2
      }
    },
    authStatus({ routeAuthMap }) {
      const auth = this.$route.meta?.auth
      // 加载中
      if (routeAuthMap === null) {
        return this.AUTH_STATUS_MAP.LOADING
      }
      if (auth || routeAuthMap.includes(this.$route.name)) {
        return this.AUTH_STATUS_MAP.ALLOWED
      }
      return this.AUTH_STATUS_MAP.NULL
    },
    key() {
      return this.$route.path
    }
  },
  watch: {
    // authStatus(val) {
    // console.log(val)
    // if (val === this.AUTH_STATUS_MAP.NULL) {
    //   const [first] = this.treeMenu
    //   // 默认跳转到第一个菜单页面
    //   if (first) {
    //     if (first.children) {
    //       this.$router.push({ name: first.children[0].menuCode })
    //     } else {
    //       this.$router.push({ name: first.menuCode })
    //     }
    //   }
    // }
    // }
  }
}
</script>

<style lang="less" scoped>
.wrapper {
  border-radius: 3px;
  padding: 16px;
  min-height: calc(100vh - 50px - 32px);
  background-color: #fff;
}
</style>
