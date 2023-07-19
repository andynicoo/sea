<template>
  <a-layout id="layout">
    <Sidebar ref="sidebar" :menu="menuArr" :collapsed="collapsed" />
    <a-layout>
      <a-layout-header class="layout-header">
        <!-- <breadcrumb /> -->
        <NavBar />
      </a-layout-header>
      <a-layout-content class="container">
        <AppMain />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import Sidebar from './component/sidebar/SideMenu'
import NavBar from './component/Navbar'
import AppMain from './component/AppMain'
import { mapState } from 'vuex'

export default {
  components: {
    Sidebar,
    AppMain,
    NavBar
  },
  data() {
    return {
      collapsed: false
    }
  },
  computed: {
    ...mapState({
      menuArr: (state) => state.vars?.auth?.treeMenu || []
    })
  }
}
</script>

<style lang="less" scoped>
#layout {
  height: 100vh;
  overflow: hidden;
  .layout-header {
    display: flex;
    align-items: center;
    padding: 0 16px;
    background-color: #fff;
    height: 50px;
    line-height: 50px;
  }
  .container {
    padding: 16px;
    height: calc(100vh - 50px);
    overflow: auto;
    overflow-x: hidden;
  }
}
</style>
