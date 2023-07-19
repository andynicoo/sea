<template>
  <div class="password">
    <div class="tit">
      <span :class="{ cur: tabCur === 1 }" @click="changeTab(1)">当前密码修改</span>
      <Divider type="vertical" />
      <span :class="{ cur: tabCur === 2 }" @click="changeTab(2)">短信验证码修改</span>
    </div>
    <Password v-if="tabCur === 1" />

    <VeriCode v-else />
  </div>
</template>

<script>
import Password from './Password.vue'; // 修改密码
import VeriCode from './VeriCode.vue'; // 验证码修改密码
export default {
  components: {
    VeriCode,
    Password,
  },
  data() {
    return {
      tabCur: 1,
    };
  },
  methods: {
    changeTab(val) {
      this.tabCur = val;
    },
  },
};
</script>

<style lang="less" scoped>
.password {
  .tit {
    span {
      height: 25px;
      line-height: 25px;
      font-size: 14px;
      margin: 0px 10px;
      cursor: pointer;
      display: inline-block;
    }
    .cur {
      // border-bottom: 2px solid #00a3ff;
      color: #00a3ff;
    }
  }
}
</style>
