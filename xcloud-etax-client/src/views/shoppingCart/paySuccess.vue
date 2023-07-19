<template>
  <div class="container">
    <div class="headContent">
      <div class="bottom">
        服务详情
      </div>
    </div>
    <div class="outContent">
      <div class="flex-column content">
        <img src="@/assets/images/common/pay-success.png"
             alt />
        <div class="success" v-if="fuwuType==1">
          您已成功购买vat服务
        </div>
        <div class="success" v-if="fuwuType==2">
          您已成功购买授权代表服务
        </div>
        <div class="success" v-if="fuwuType==3">
          您已经成功购买VAT、授权代表服务
        </div>
        <div class="orderNo ">
          <div class="">
            订单号：{{orderNo || orderId}}
          </div>
          <span class="fuzhi cobyOrderSn"
                data-clipboard-action="copy"
                :data-clipboard-text="'订单号：' + orderNo"
                @click="copyLink">
            复制
          </span>
        </div>
        <div class="flex" v-if="fuwuType==1 || fuwuType==3">
          <Button @click="$router.push('/serviceList')" style="width:200px;margin-top:24px;margin-right:12px;">继续购买VAT</Button>
          <Button style="width:200px;margin-top:24px;"
                  type="primary"
                  v-if="fuwuType==3"
                  @click="$router.push('/')">去使用</Button>
          <Button style="width:200px;margin-top:24px;"
                  type="primary"
                  v-if="fuwuType==1"
                  @click="$router.push('/work')">去使用</Button>
        </div>
        <div class="flex" v-else>
          <Button @click="$router.push('/complianceBusiness/productList')"
                  style="width:200px;margin-top:24px;margin-right:12px;">继续购买合规服务</Button>
          <Button style="width:200px;margin-top:24px;"
                  type="primary"
                  @click="$router.push('/complianceBusiness/manageList')">去使用</Button>
        </div>

      </div>
      <div class="followContent " v-if="fuwuType==1 || fuwuType==3 || fuwuType==4">
        <div class="title">
          温馨提示：注册/转代理VAT等服务需要准备以下资料，您可以提前准备：
        </div>
        <div class="contentInfo">
          <p>1、公司营业执照信息（开店使用的公司/个体户主体）；</p>
          <p>2、 法人身份证信息；</p>
          <p>3、 店铺信息（英德等国家支持无店铺注册）；</p>
          <p>4、历史申报回执、缴税凭证（转代理使用）；</p>
        </div>
      </div>
      <div class="followContent " v-else>
        <div class="title">
          温馨提示：欧盟/英国授权代表等服务需要准备以下资料，您可以提前准备：
        </div>
        <div class="contentInfo">
          <p>1、公司营业执照信息（开店使用的公司/个体户主体）；</p>
          <p>2、 产品信息；</p>
          <p>3、 店铺信息；</p>
          <p>4、CE证书、产品检测报告、DOC声明文件；</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      orderNo: this.$route.query.orderNo,
      orderId:'',
      fuwuType:'1'
    }
  },
  created() {
    this.orderId = window.localStorage.getItem('orderNo')
    if(this.orderId) this.orderNo = this.orderId
    window.localStorage.removeItem('orderNo')
    this.fuwuType = window.localStorage.getItem('fuwuType')
  },
  methods: {
    copyLink() {
      let _this = this;
      let clipboard = new this.clipboard(".cobyOrderSn");
      clipboard.on('success', function () {
        _this.$Message.success("复制成功")
      });
      clipboard.on('error', function () {
        _this.$Message.info("复制失败")
      });
      setTimeout(() => {
        clipboard.destroy()
      }, 1000);
    },
  }
}
</script>

<style lang="less" scoped>
.container {
  margin-bottom: 0px;
  min-height: calc(100vh - 60px);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  .headContent {
    height: 78px;
    background: #ffffff;
    box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 0.12);
    padding: 20px 32px;
    .top {
      margin-bottom: 14px;
      .flink,
      .clink {
        font-size: 14px;

        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
        line-height: 22px;
      }
      .clink {
        font-weight: 500;
        color: rgba(0, 0, 0, 0.65);
      }
    }
    .bottom {
      font-size: 20px;
      font-family: "Microsoft Yahei", PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 28px;
      span {
        font-size: 14px;

        font-weight: 400;
        color: rgba(0, 0, 0, 0.65);
        line-height: 22px;
      }
    }
  }
  .outContent {
    background: #ffffff;
    margin: 24px;
    padding-bottom: 40px;
    margin-bottom: 0px;
  }
  .flex-column {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .content {
    padding-top: 70px;
    img {
      width: 76px;
      height: 76px;
    }
    .success {
      font-size: 20px;
      font-family: "Microsoft Yahei", SourceHanSansSC-Medium, SourceHanSansSC;
      font-weight: 500;
      color: #333333;
      line-height: 20px;
      margin-top: 24px;
      margin-bottom: 20px;
    }
    .orderNo {
      font-size: 12px;
      font-family: "Microsoft Yahei", PingFangSC;
      color: #333333;
      line-height: 17px;
      display: flex;
      .fuzhi {
        width: 36px;
        height: 18px;
        background: #16ade9;
        border-radius: 2px;
        font-size: 12px;
        font-family: "Microsoft Yahei", PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 14px;
        padding: 3px 5px;
        margin-left: 5px;
        cursor: pointer;
      }
    }
    .info {
      margin-bottom: 12px;
      font-size: 16px;
      font-family: "Microsoft Yahei", SourceHanSansSC-Regular, SourceHanSansSC;
      font-weight: 400;
      color: #333333;
      line-height: 16px;
      text-align: center;
      span {
        color: #16ade9;
      }
    }
  }
  .followContent {
    width: 730px;
    background: rgba(22, 173, 233, 0.1);
    margin: 40px auto;
    padding: 24px;
    .title {
      font-size: 14px;
      font-family: "Microsoft Yahei", PingFangSC;
      color: #333333;
      line-height: 20px;
      margin-bottom: 12px;
    }
    .contentInfo {
      p {
        font-size: 12px;
        font-family: "Microsoft Yahei", PingFangSC;
        color: #666666;
        line-height: 12px;
        margin-bottom: 12px;
      }
    }
    img {
      width: 144px;
    }
  }
}
</style>