<template>
  <a-modal v-model="visible" max-width="860" :footer="null">
    <div class="pa-4 notice-wrap">
      <h3 class="title">系统通知:</h3>
      <p style="line-height: 38px; text-indent: 2em">
        Shopee将于2021年6月9日-2021年6月21日，按站点依次上线全新类目树，更新时间如下:
      </p>
      <p style="line-height: 38px; text-indent: 2em">
        新加坡SG: 2021年6月9日18：00至19：00
      </p>
      <p style="line-height: 38px; text-indent: 2em">
        菲律宾PH、越南VN: 2021年6月16日18：00至19：00
      </p>
      <p style="line-height: 38px; text-indent: 2em">
        马来MY、台湾TW、印尼ID、墨西哥MX、泰国TH: 2021年6月21日18：00至19：00
      </p>
      <p style="line-height: 38px; text-indent: 2em; font-weight: 600;">
        因类目更新，将会对软件业务造成如下影响：
      </p>
      <p style="line-height: 38px; text-indent: 2em">
        1.Shopee类目更新完成后，采集箱内（包含未发布、及已发布商品）商品类目分类会全部失效，旧的采集商品将无法正常发布，未完成的发布任务将全部失败。商家朋友需注意Shopee更新时间节点，提前一个小时内完成商品发布等操作，等类目树更新完成后，需重新修改采集箱商品分类，提交上货任务，才能完成正常发布！！！
      </p>
      <p style="line-height: 38px; text-indent: 2em">
        2.因类目更新，部分类目新增必填属性，在截止九月末的过渡期结束前,检查以及填入存量商品缺失的必填属性,否则您将无法更新商品对此造成的不便，敬请谅解！
      </p>
      <div @click="catchInfo" class="info-btn">我知道了</div>
    </div>
  </a-modal>
</template>

<script>
export default {
  data() {
    return {
      visible: false
    }
  },
  mounted() {
    if (localStorage.getItem('catch-message') != 1) {
      this.visible = true
    }
  },
  methods: {
    catchInfo() {
      localStorage.setItem('catch-message', 1)
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.notice-wrap {
  .title {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 550;
    color: #313131;
    line-height: 30px;
    margin-bottom: 10px;
  }

  .item {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #615b5b;
    line-height: 20px;
  }

  .info-btn {
    width: 144px;
    height: 40px;
    background: #ff720d;
    border-radius: 23px;
    text-align: center;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    line-height: 40px;
    cursor: pointer;
    margin: 20px auto 0px auto;
  }
}
</style>
