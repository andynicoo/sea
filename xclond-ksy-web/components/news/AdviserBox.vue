<template>
  <div class="adviser">
    <h2>专业顾问</h2>
    <p>免费咨询专家顾问，解决您的烦恼</p>
    <a-button type="primary" @click="customerFunc">立即咨询</a-button>
  </div>
</template>

<script>
import { customerFunc } from "@/utils/index";
export default {
  data() {
    return {
      customerFunc,
    };
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="less" scoped>
.adviser {
  height: 140px;
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
  padding: 16px 26px;
  h2 {
    font-size: 16px;
    font-weight: bold;
  }
  p {
    font-size: 14px;
    color: @textColor6;
  }
}
</style>
