<template>
  <a-layout-sider
    ref="sideBar"
    :collapsed="collapsed"
    :collapsible="collapsible"
    width="170px"
    :collapsed-width="48"
    :inline-indent="16"
    :selectable="false"
    @breakpoint="onBreakpoint"
    @collapse="hanldeCollapse"
  >
    <template #trigger>
      <a-icon :type="collapsed ? 'right' : 'left'" />
    </template>
    <div
      class="logo"
      :class="{ 'logo-min': collapsed }"
    >
      <img
        v-if="!collapsed"
        :src="imgUrl"
        height="36px"
      >
      <i
        v-else
        class="iconfont icona-1"
      />
    </div>
    <!-- {{ menu }}-- -->
    <menu-item
      :collapsed="collapsed"
      :menu="menu"
      :theme="theme"
      :mode="mode"
      class="side-scroll"
      @select="onSelect"
    />
  </a-layout-sider>
</template>

<script>
import menuItem from './menu'
import { mapState } from 'vuex'
const imgUrl = require('@/assets/logo-white.png')
export default {
  components: {
    menuItem
  },
  props: {
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    collapsible: {
      type: Boolean,
      required: false,
      default: true
    },
    menu: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      // collapsed: true,
      collapsedChild: true,
      imgUrl
    }
  },
  computed: {
    ...mapState({
      collapsed: (state) => state.vars?.menu?.collapsed ?? false
    })
  },
  mounted() {
    // this.$refs.sideBar.$el.onmouseenter = event => {
    //   this.openSidebar()
    // }
    // this.$refs.sideBar.$el.onmouseleave = event => {
    //   this.closeSidebar()
    // }
  },
  methods: {
    onSelect(item) {},
    onBreakpoint(broken) {},
    hanldeCollapse(collapsed, type) {
      this.$store.commit('setVars', { menu: { collapsed } })
    },
    openSidebar() {
      this.collapsed = false
      setTimeout(() => {
        this.collapsedChild = false
      }, 500)
    },
    closeSidebar() {
      this.collapsed = true
      this.collapsedChild = true
    }
  }
}
</script>

<style lang="less" scoped>
.logo {
  height: 50px;
  display: flex;
  align-items: center;
  background: #fff;
  // padding: 16px;
  padding-left: 12px;
  .iconfont {
    font-size: 30px;
    color: #fff;
    margin-left: 8px;
    margin-top: 6px;
  }
}
.logo-min {
  background: none;
  padding-left: 0px;
}
/deep/.ant-layout-sider-children {
  overflow: hidden;
}
/deep/.ant-menu-inline-collapsed {
  width: 48px;
  & > .ant-menu-submenu > .ant-menu-submenu-title,
  .ant-menu-item {
    padding: 0 16px !important;
  }
}
// 二级菜单项
/deep/ .ant-menu-sub.ant-menu-inline > .ant-menu-item,
.ant-menu-sub.ant-menu-inline > .ant-menu-submenu > .ant-menu-submenu-title {
  line-height: 30px;
  height: 30px;
  margin: 0;
  &:nth-of-type(1) {
    margin-top: 8px;
  }
  &:nth-last-of-type(1) {
    margin-bottom: 8px;
  }
}
</style>
