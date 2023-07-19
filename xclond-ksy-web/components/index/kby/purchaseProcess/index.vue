<template>
  <div class="purchase-process-page index-page">
    <div class="main-box">
      <div class="ksy-w1320 center">
        <div class="main-box-head">
          <template v-if="NODE_PLA === 'kby'">
            <div class="main-box-head-title">{{ mainHead.title }}</div>
            <div class="main-box-head-text">{{ mainHead.text }}</div>
          </template>
          <template v-if="NODE_PLA === 'wg'">
            <div class="main-box-head-title">{{ wgmainHead.title }}</div>
            <div class="main-box-head-text">{{ wgmainHead.text }}</div>
          </template>
        </div>
        <div class="main-box-content purchase-process-content">
          <div class="purchase-process-content-big flex">
            <div v-for="(big, index) in totalSteps.first" :key="`f_${index}`" :class="['item', `bg-${index + 1}`]">
              {{ big }}
            </div>
          </div>
          <div class="purchase-process-content-small flex">
            <div :key="`col_${index}`" v-for="(small, index) in totalSteps.second" :class="['item', `bg-${7 - index}`]">
              {{ small }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "purchaseProcess",
  data() {
    return {
      NODE_PLA: process.env.NODE_PLA,
      steps: {
        first: ["购买商标注册服务", "已审核", "通过资料"],
        second: ["进入审核期", "公告期", "注册公告", "核发证书"].reverse(),
      },
      mainHead: {
        title: "跨标云商标购买流程",
        text: "全周期AI智能监控，进度实时掌握，平台安全有保障",
      },
      wgmainHead: {
        title: "辰知云外观专利购买流程",
        text: "全周期AI智能监控，进度实时掌握，平台安全有保障",
      },
      wgsteps: {
        first: ["购买专利注册服务", "提交专利申请资料", "初步审核"],
        second: ["律师审核", "进入审核期", "授权公告", "核发证书"].reverse(),
      },
    };
  },
  computed: {
    totalSteps() {
      const { NODE_PLA } = this;
      if (NODE_PLA === "kby") {
        return this.steps;
      } else if (NODE_PLA === "wg") {
        return this.wgsteps;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.stepFn(@n, @i: 1) when (@i =< @n) {
  .bg-@{i} {
    background: #fff url("./images/step-@{i}.png") no-repeat center / 100% 100%;
    background-origin: border-box;
    box-shadow: 0px 15px 21px 0px rgba(16, 68, 166, 0.09);
    border-radius: 4px;
  }
  .stepFn(@n, (@i + 1));
}
.stepFn(7);
[class^="purchase-process-content"] {
  justify-content: space-between;
}
.purchase-process {
  &-page {
    padding: 0 0 80px 0;
  }
  &-content {
    font-size: 16px;
    color: rgba(@textColor, 0.9);
    line-height: 19px;
    &-big {
      .item {
        width: 312px;
        height: 168px;
        display: flex;
        padding: 0 0 26px 0;
        align-items: flex-end;
        justify-content: center;
        position: relative;
        &::after {
          content: "";
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translate(37px, -50%);
          width: 55px;
          height: 54px;
          background: url(./images/arrow-big.png) no-repeat center/100% auto;
        }
        &:last-child {
          &::after {
            left: 50%;
            top: 100%;
            transform: translate(0, 26px) rotate(90deg);
          }
        }
      }
      margin-bottom: 104px;
    }
    &-small {
      .item {
        width: 246px;
        height: 168px;
        display: flex;
        padding: 0 0 26px 0;
        align-items: flex-end;
        justify-content: center;
        position: relative;
        &::after {
          content: "";
          position: absolute;
          width: 39px;
          height: 33px;
          background: url(./images/arrow-small.png) no-repeat center/100% auto;
          top: 50%;
          right: 100%;
          transform: translate(-20px, -50%);
        }
        &:first-child {
          &::after {
            display: none;
          }
        }
      }
    }
  }
}
</style>
