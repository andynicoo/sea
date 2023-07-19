<template>
  <div class="container">
    <div class="headContent">
      <div class="top">
        <!-- <Breadcrumb>
          <BreadcrumbItem>
            <span class="flink">工作台</span>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span class="clink">上传资料</span>
          </BreadcrumbItem>
        </Breadcrumb> -->
      </div>
      <div class="bottom" v-if="productFunctionCode === '5'">
        上传注册资料
        <span>（{{ countryNameZh }}注册+申报）</span>
      </div>
      <div class="bottom" v-if="productFunctionCode === '2'">
        上传转代理资料
        <span>（{{ countryNameZh }}转代理申报）</span>
      </div>
      <div class="bottom" v-if="productFunctionCode === '16'">
        上传注册资料
        <span>（{{ countryNameZh }}授权代表）</span>
      </div>
    </div>
    <div class="outContent">
      <div class="success">
        <img src="@/assets/images/common/pay-success1.png" alt />
        <div class="success-tips" v-if="productFunctionCode === '5'">提交注册资料成功，已通知税务师进行审核！</div>
        <div class="success-tips" v-if="productFunctionCode === '2'">提交转代理资料成功，已通知税务师进行审核！</div>
        <div class="success-tips" v-if="productFunctionCode === '16'">提交注册资料成功，已通知工作人员进行审核！</div>
        <div class="success-tips" v-if="productFunctionCode === '24'">提交退税资料成功，已通知税务师进行审核！</div>
        <div class="submitTime">提交时间：{{ submitTime }}</div>
        <div class="country" v-if="productFunctionCode === '5' && countryCode == 'ES' && hyFlag != 2">{{ countryNameZh }}注册税号参考时效：{{ registerEfficiency }}（海牙认证额外一周），请耐心等待</div>
        <div class="country" v-if="productFunctionCode === '5' && countryCode == 'ES' && hyFlag == 2">{{ countryNameZh }}注册税号参考时效：{{ registerEfficiency }}，请耐心等待</div>
        <div class="country" v-if="productFunctionCode === '5' && countryCode != 'ES'">{{ countryNameZh }}注册税号参考时效：{{ registerEfficiency }}，请耐心等待</div>
        <div class="country" v-if="productFunctionCode === '2'">{{ countryNameZh }}转代理税号参考时效：{{ transformEfficiency }}，请耐心等待</div>
        <div class="country" v-if="productFunctionCode === '16'">{{ countryNameZh }}授权代表服务参考时效：3-5个工作日，请耐心等待</div>
        <div class="country" v-if="productFunctionCode === '24'">{{ countryNameZh }}退税参考时效：6-8周，请耐心等待</div>
        <div class="btns">
          <Button type="info" ghost style="width: 142px" @click="$router.push('/')">返回工作台</Button>
        </div>

        <!-- <div class="btns">
          <Button @click="$router.push('/serviceList')"
                  style="width:200px;margin-right:20px;margin-bottom:32px;">继续购买VAT</Button>
          <Button style="width:200px;margin-bottom:32px;"
                  type="primary"
                  @click="$router.push('/work')">去使用</Button>
        </div> -->
        <div class="followContent flex-column">
          <div class="title">关注跨税云公众号，实时查看VAT进度</div>
          <div>
            <img src="@/assets/images/common/itaxQR.jpg" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { listBaseInfoByCondition } from "@/api/taxModule";
export default {
  data() {
    return {
      countryNameZh: this.$route.query.countryNameZh,
      countryCode: this.$route.query.countryCode,
      hyFlag: this.$route.query.hyFlag,
      timestamp: this.$route.query.timestamp,
      submitTime: "",
      registerEfficiency: "",
      transformEfficiency: "",
      productFunctionCode: this.$route.query.productFunctionCode,
    };
  },
  created() {
    this.submitTime = this.set_time(this.timestamp);
    this.baseInfo();
  },
  methods: {
    //回到工作台
    goHome() {
      this.$router.push({ path: "/" });
    },
    goBuy() {},
    set_time(str) {
      var n = parseInt(str);
      var D = new Date(n);
      var year = D.getFullYear(); //四位数年份

      var month = D.getMonth() + 1; //月份(0-11),0为一月份
      month = month < 10 ? "0" + month : month;

      var day = D.getDate(); //月的某一天(1-31)
      day = day < 10 ? "0" + day : day;

      var hours = D.getHours(); //小时(0-23)
      hours = hours < 10 ? "0" + hours : hours;

      var minutes = D.getMinutes(); //分钟(0-59)
      minutes = minutes < 10 ? "0" + minutes : minutes;

      var now_time = year + "-" + month + "-" + day + " " + hours + ":" + minutes;
      return now_time;
    },
    baseInfo() {
      listBaseInfoByCondition({
        countryCode: this.countryCode,
      }).then((res) => {
        if (res.code === 0) {
          this.registerEfficiency = res.data.registerEfficiency;
          this.transformEfficiency = res.data.transformEfficiency;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  margin-bottom: 0px;
  min-height: calc(100vh - 60px);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  .headContent {
    height: 100px;
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
    & .success {
      text-align: center;
      min-height: 600px;
      background: #ffffff;
      & > img {
        margin-top: 50px;
        width: 76px;
        height: 76px;
        margin-bottom: 24px;
      }
      & .success-tips {
        font-size: 20px;
        font-family: "Microsoft Yahei", SourceHanSansSC-Medium, SourceHanSansSC;
        font-weight: 500;
        color: #333333;
        line-height: 20px;
        margin-bottom: 24px;
      }
      .btns {
        display: flex;
        justify-content: center;
        margin-top: 20px;
        margin-bottom: 32px;
      }
      .submitTime {
        font-size: 12px;
        font-family: "Microsoft Yahei", PingFangSC;
        color: #333333;
        line-height: 17px;
      }
      .country {
        font-size: 12px;
        font-family: "Microsoft Yahei", PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ed3e3e;
        line-height: 17px;
        margin-top: 8px;
        // margin-bottom: 20px;
      }
      & .btn {
        margin: 10px 10px 0px;

        & span {
          display: inline-block;
          width: 140px;
          height: 36px;
          border: 1px solid #16ade9;
          line-height: 36px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 400;
          color: #16ade9;
          margin-bottom: 32px;
        }
      }
      & .followContent {
        width: 730px;
        height: 240px;
        background: rgba(22, 173, 233, 0.1);
        margin: 0px auto;
        padding: 24px;
        .title {
          font-size: 16px;
          font-family: "Microsoft Yahei", SourceHanSansSC-Medium, SourceHanSansSC;
          font-weight: 500;
          color: #333333;
          line-height: 24px;
          margin-bottom: 17px;
        }
        img {
          width: 144px;
        }
      }
    }
  }
}
</style>
