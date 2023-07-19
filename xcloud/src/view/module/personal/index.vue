<template>
  <div class="app-container">
    <div class="header-container">
      <el-tabs>
        <el-tab-pane label="基本信息">
          <InForMation :userInfo="userInfo"/>
        </el-tab-pane>
        <!-- <el-tab-pane label="账号安全" name="page2">
          <AccountSecurity />
        </el-tab-pane> -->
      </el-tabs>
    </div>
  </div>
</template>
<script>
import InForMation from './components/InForMation.vue' // 基本信息
// import AccountSecurity from './components/AccountSecurity.vue'
import { getBaseUserInfo } from '@/api/user'
import store from '@/store'
export default {
  // components: { InForMation, AccountSecurity },
  components: { InForMation },
  data () {
    return {
      userInfo: {}
    }
  },
  created () {
    this.getInfo()
  },
  methods: {
    getInfo () {
      getBaseUserInfo({
        userId: store.state.user.userId
      }).then(res => {
        if (res.code === 0) {
          this.userInfo = res.data
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
</style>
