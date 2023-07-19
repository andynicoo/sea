<template>
  <div class="purchase-process-page index-page">
    <div class="ksy-w1320 center">
      <div class="main-box-head">
        <template>
          <div class="main-box-head-title">{{ mainHead.title }}</div>
          <div class="main-box-head-text">{{ mainHead.text }}</div>
        </template>
      </div>
      <div class="main-box-content purchase-process-content">
        <div class="purchase-process-content-small flex" v-if="NODE_PLA === 'kqy'">
          <div :key="`col_${index}`" v-for="(small, index) in totalSteps.second" :class="['item22', `bg-${index + 1}`]">
            {{ small }}
          </div>
        </div>
        <div class="purchase-process-content-small flex" v-else>
          <div :key="`col_${index}`" v-for="(small, index) in totalSteps.second" :class="['item', `bg-${index + 1}`]">
            {{ small }}
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
        second: ["提交注册资料", "公司名称查册", "政府审批", "公司成立完毕"],
      },
      mainHead: {
        title: "简单4步，轻松完成公司注册",
        text: "迅速创立，注册便捷",
      },
    };
  },
  computed: {
    totalSteps() {
      return this.steps;
    },
  },
};
</script>

<style lang="less" scoped>
.stepFn(@n, @i: 1) when (@i =< @n) {
  .bg-@{i} {
    background: #fff url("./images/kqy/step-@{i}.png") no-repeat center / 100% 100%;
    background-origin: border-box;
    box-shadow: 0px 15px 21px 0px rgba(16, 68, 166, 0.09);
    border-radius: 4px;
  }
  .stepFn(@n, (@i + 1));
}
.stepFn(4);
[class^="purchase-process-content"] {
  justify-content: space-between;
}
.purchase-process {
  &-page {
    padding: 0 0 100px 0;
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
      .item22 {
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
          background: url(./images/arrow-right.png) no-repeat center/100% auto;
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
