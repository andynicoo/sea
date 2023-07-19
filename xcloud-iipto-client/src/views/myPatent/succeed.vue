<template>
  <div class="mainContent">
    <div class="succeed">
      <img src="@/assets/images/common/paySuccess.png">
      <div>资料信息提交成功</div>
      <p>您的表格已成功递交，如需建模/绘图服务可随时与我司联系。我司会在1个工作日内审核您的资料。</p>
      <Button type="primary" @click="goView">查看资料信息</Button>
    </div>
  </div>
</template>

<script>
import '@/assets/style/common.less'
export default {
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
    goView () {
      this.$router.push({
        path: `/myPatent/detail/${this.$route.params.serviceId}`
      })
    }
  }
}
</script>
<style lang="less" scoped>
.mainContent {
  display: inline-block;
  width: 946px;
  vertical-align: top;
  box-shadow: 0px 2px 6px 0px rgba(0, 21, 41, 0.06);
  .succeed{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 600px;
    div{
      font-size: 20px;
      margin: 15px 0;
      font-weight: 700;
      color: #333;
    }
    p{
      margin-bottom: 10px;
      font-size: 14px;
      color: #666;
    }
  }
}
</style>
