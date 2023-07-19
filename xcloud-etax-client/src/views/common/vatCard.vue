<template>
  <div class="vatContainer flex-between">
    <div class="left flex-center">
      <div class="nationalFlag">
        <div v-for="(item, index) in countryList" :key="index">
          <img v-if="item['countryCode'] === data.countryCode" :src="item.countryHeadImage" alt="" />
        </div>
      </div>
      <div v-if="unUsed" class="flex-center">
        <div class="vatTaxNumber">
          <div class="word" style="margin-bottom: 8px">
            <span>服务号：</span>

            <span class="right">
              {{ data.serverNo }}
            </span>
          </div>
          <div class="word">
            <span> 类型： </span>
            <span class="right">
              {{
                data.productFunctionCode == "1"
                  ? "税号注册"
                  : data.productFunctionCode == "2"
                  ? "转代理+申报"
                  : data.productFunctionCode == "3"
                  ? "税务补缴"
                  : data.productFunctionCode == "4"
                  ? "转代理"
                  : data.productFunctionCode == "5"
                  ? "注册+申报"
                  : data.productFunctionCode == "6"
                  ? "注销税号"
                  : data.productFunctionCode == "7"
                  ? "税务稽查"
                  : ""
              }}
            </span>
          </div>
        </div>
        <div class="registerDeclare">
          <div class="word" style="margin-bottom: 8px">
            <span> 服务国家： </span>
            <span v-if="data.countryNameZh" class="right">
              {{ data.countryNameZh }}
            </span>
          </div>
          <div class="word">
            <span> 截止日期： </span>
            <span v-if="data.expirationTime" class="right">
              {{ data.expirationTime.slice(0, 10) }}
            </span>
            <span v-else class="right" style="color: #666666"> 使用后计时 </span>
          </div>
        </div>
      </div>
      <div v-else class="flex-center">
        <div class="vatTaxNumber">
          <div class="word" style="margin-bottom: 8px">
            <span> VAT税号： </span>
            <span v-if="data.vatTaxNumber" class="right">
              {{ data.vatTaxNumber }}
            </span>
            <span v-else> 暂无 </span>
          </div>
          <div class="word">
            <span>服务号：</span>

            <span class="right">
              {{ data.serverNo }}
            </span>
          </div>
        </div>
        <div class="registerDeclare">
          <div class="word" style="margin-bottom: 8px">
            <span> 类型： </span>
            <span class="right">
              {{
                data.productFunctionCode == "1"
                  ? "税号注册"
                  : data.productFunctionCode == "2"
                  ? "转代理+申报"
                  : data.productFunctionCode == "3"
                  ? "税务补缴"
                  : data.productFunctionCode == "4"
                  ? "转代理"
                  : data.productFunctionCode == "5"
                  ? "注册+申报"
                  : data.productFunctionCode == "6"
                  ? "注销税号"
                  : data.productFunctionCode == "7"
                  ? "税务稽查"
                  : ""
              }}
            </span>
          </div>
          <div class="word">
            <span> 截止日期： </span>
            <span v-if="data.expirationTime" class="right">
              {{ data.expirationTime.slice(0, 10) }}
            </span>
            <span v-else class="right" style="color: #666666"> 使用后计时 </span>
          </div>
        </div>
      </div>
    </div>
    <div class="right flex-column">
      <div class="statusTxt" style="margin-bottom: 8px">
        <!-- 业务进度(税务注册：0、待上传资料 1、待审核资料 3、注册中 4、注册完成 8、资料驳回 税务申报：19、未开始 
        20、未开始(已开始报税) 21、待提交报税资料 
        8、申报中（沙特、阿联酋）22、待缴纳税金 
        25、申报完成（客户端完成） 26、申报失败 27、申报完成(整体完成) 
        28、待上传资料(转代理) 29、转代理中 31、待审核转代理资料 32、转代理资料驳回) 33、缴税凭证待审核(意大利) 
        34、缴税凭证被驳回(意大利) 35、待上传零申报凭证 5、待授权海牙认证(西班牙注册) 6、海牙认证中(西班牙注册) 
        7、待授权注册税号(法国) 9、待授权注册税号(法国) 36、待授权海牙认证(西班牙转代理) 
        37、待授权海牙认证中(西班牙转代理)) 38、待授权转代理(法国、意大利) 51、待上传资料 52、待审核 
        53、注销中 54、已完成 55、资料驳回 56、注销失败-->
        <span
          :class="
            data.progressBar === 4 ||
            data.progressBar === 25 ||
            data.progressBar === 27 ||
            data.progressBar === 19 ||
            data.progressBar === 20
              ? 'blue'
              : data.progressBar === 21 ||
                data.progressBar === 31 ||
                data.progressBar === 22 ||
                data.progressBar === 24 ||
                data.progressBar === 6 ||
                data.progressBar === 36 ||
                data.progressBar === 37
              ? 'yellow'
              : data.progressBar === ''
              ? 'grey'
              : 'red'
          "
          v-if="data.status != 2"
          >{{
            data.progressBar == 0
              ? "待上传资料"
              : data.progressBar == 1
              ? "待审核资料"
              : data.progressBar == 3
              ? "注册中"
              : data.progressBar == 4
              ? "注册完成"
              : data.progressBar == 5
              ? "待授权海牙认证"
              : data.progressBar == 6
              ? "海牙认证中"
              : data.progressBar == 7
              ? "待授权注册"
              : data.progressBar == 8
              ? "资料驳回"
              : data.progressBar == 19
              ? "等待申报中"
              : data.progressBar == 20
              ? "等待申报中"
              : data.progressBar == 21
              ? "待提交报税资料"
              : data.progressBar == 18
              ? "申报中"
              : data.progressBar == 22
              ? "待缴纳税金"
              : data.progressBar == 23
              ? "待审核申报"
              : data.progressBar == 24
              ? "申报驳回"
              : data.progressBar == 25
              ? "申报完成"
              : data.progressBar == 27
              ? "申报完成"
              : data.progressBar == 26
              ? "申报失败"
              : data.progressBar == 28
              ? "待上传资料"
              : data.progressBar == 29
              ? "转代理中"
              : data.progressBar == 31
              ? "待审核转代理资料"
              : data.progressBar == 32
              ? "转代理资料驳回"
              : data.progressBar == 33
              ? "税金待审核"
              : data.progressBar == 34
              ? "缴税凭证被驳回"
              : data.progressBar == 35
              ? "待上传零申报凭证"
              : data.progressBar == 36
              ? "待授权海牙认证"
              : data.progressBar == 37
              ? "海牙认证中"
              : data.progressBar == 38
              ? "待授权转代理"
              : data.progressBar == 51
              ? "待上传资料"
              : data.progressBar == 52
              ? "待审核"
              : data.progressBar == 53
              ? "注销中"
              : data.progressBar == 54
              ? "已完成"
              : data.progressBar == 55
              ? "资料驳回"
              : data.progressBar == 56
              ? "注销失败"
              : data.progressBar == 71
              ? "待上传稽查资料"
              : data.progressBar == 72
              ? "待处理"
              : data.progressBar == 73
              ? "处理中"
              : data.progressBar == 74
              ? "处理完成"
              : "暂无"
          }}</span
        >
        <span v-else style="color: #ed3e3e">待续费</span>
      </div>
      <!-- <div class="statusBtn"
           slot="statusBtn">

      </div> -->
      <slot name="statusBtn"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    countryList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    unUsed: {
      type: Boolean,
      default: false,
    },
  },
  created() {},
};
</script>

<style lang="less" scoped>
.vatContainer {
  width: 100%;
  padding: 16px 24px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid rgba(41, 56, 246, 0.1);
  display: flex;
  margin-bottom: 16px;
  cursor: pointer;
  .nationalFlag {
    width: 45px;
    height: 45px;
    background: #ffffff;
    margin-right: 24px;
    border-radius: 50%;
    box-shadow: 0px 2px 8px 0px rgba(0, 35, 119, 0.1);
    img {
      width: 100%;
      height: 100%;
    }
  }
  .vatTaxNumber {
    margin-right: 32px;
  }
  .registerDeclare {
  }

  .right {
    .statusBtn {
      width: 100px;
      height: 28px;
      background: #16ade9;
      box-shadow: 0px 2px 6px 0px rgba(9, 80, 228, 0.12);
      border-radius: 100px;
      font-size: 14px;
      font-family: "Microsoft Yahei", "PingFang SC", sans-serif;
      color: #ffffff;
      text-align: center;
      line-height: 28px;
    }
    .statusTxt {
      font-size: 12px;
      font-family: "Microsoft Yahei", "PingFang SC", sans-serif;
      // color: #ed3e3e;
      line-height: 17px;
      text-align: center;
      margin-bottom: 6px;
      min-width: 60px;
      span {
        font-family: "Microsoft Yahei", "PingFangSC-Medium", "PingFang SC", sans-serif;
        font-weight: 500;
      }
      .yellow {
        color: #ed3e3eff;
        margin-right: 13px;
      }
      .blue {
        color: #16ade9ff;
      }
      .red {
        color: #ed3e3eff;
      }
    }
  }
  .word {
    font-size: 14px;
    font-weight: 500;
    color: #333333;
    line-height: 22px;
    span {
      font-family: "Microsoft Yahei", PingFangSC-Regular, PingFang SC;
    }
    // span.right {
    //   font-family: PingFangSC-Medium, PingFang SC;
    // }
  }
  &:hover {
    box-shadow: 0px 2px 8px 0px rgba(22, 92, 229, 0.2);
    border: 1px solid rgba(41, 56, 246, 0.14);
  }
}
@media screen and (min-width: 1920px) {
  .vatContainer {
    padding: 16px 48px 16px 32px;
    .nationalFlag {
      margin-right: 32px;
    }
    .vatTaxNumber {
      margin-right: 102px;
    }
  }
}
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.flex-around {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.flex-column {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.flex-start {
  display: flex;
  align-items: center;
  justify-content:flex-start;
}
.flex-column {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.flex {
  display: flex;
}
.relative {
  position: relative;
}
.flex-wrap {
  display: flex;
  flex-wrap: wrap;
}
</style>
