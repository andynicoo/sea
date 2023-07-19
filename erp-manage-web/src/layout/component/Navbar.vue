<template>
  <div class="nav-bar">
    <div class="breadcrumd-wrapper">
      <a-icon
        class="trigger"
        :type="collapsed ? 'menu-unfold' : 'menu-fold'"
        @click="
          () => $store.commit('setVars', { menu: { collapsed: !collapsed } })
        "
      />
      <Breadcrumb />
    </div>
    <div class="user-info">
      <a-dropdown>
        <a-menu slot="overlay" @click="hanldeLogout">
          <a-menu-item key="0">
            <a-icon type="user" />
            {{ userInfo.managerAccount }}({{ userInfo.maAccount }})
          </a-menu-item>
          <a-menu-item key="1">
            <a-icon type="logout" />
            退出登录
          </a-menu-item>
        </a-menu>
        <img src="@/assets/avatar.png" alt="" height="46">
      </a-dropdown>
    </div>
  </div>
</template>

<script>
import Breadcrumb from './breadcrumb/index'
import { mapState } from 'vuex'
export default {
  components: {
    Breadcrumb
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.vars?.auth?.userInfo ?? {},
      collapsed: (state) => state.vars?.menu?.collapsed ?? false
    })
  },
  methods: {
    hanldeLogout(item) {
      const { key } = item
      if (key === '0') return
      this.$store.commit('clearVars')
      this.$message.success('退出成功')
      this.$router.replace('/login')
    }
  }
}
</script>

<style lang="less" scoped>
.nav-bar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-content: center;
  height: 100%;
  .breadcrumd-wrapper {
    display: flex;
    align-items: center;
  }
  .trigger {
    font-size: 22px;
    margin-right: 15px;
  }
  .user-info {
    display: flex;
    align-items: center;
  }
}
.logout {
  cursor: pointer;
}
</style>
