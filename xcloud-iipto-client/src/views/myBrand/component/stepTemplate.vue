<template>
  <ul class="answer-step">
    <div v-for="(item, index) in steps" :key="index" class="div-item">
      <Tooltip
        v-if="index === 3"
        placement="top-end"
        max-width="800px"
        content="您收到商标局驳回的审查意见，需要由律师撰文答复商标局，跨标云将会根据答复的难易程度评定，您需缴纳一定的官费或律师代理费用"
      >
        <li :class="[index < step ? 'active' : '', `li-${index + 1}`]">
          <img src="./img/tag-how.svg" alt="" />
          {{ item.label }}
        </li></Tooltip
      >
      <li v-else :class="[index < step ? 'active' : '', `li-${index + 1}`]">
        {{ item.label }}
      </li>
    </div>
  </ul>
</template>
<script>
export default {
  data() {
    return {
      steps: [
        {
          label: '查看审查意见内容',
        },
        {
          label: '选择答复方案',
        },
        {
          label: '准备答复材料',
        },
        {
          label: '缴费并提交资料',
        },
      ],
    };
  },
  props: {
    step: {
      type: Number,
      default: () => 1,
    },
  },
};
</script>
<style lang="less" scoped>
.answer-step {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 500;
  color: #333333;
  line-height: 14px;
  li {
    padding: 52px 0 0;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      width: 48px;
      height: 12px;
      right: calc(100% + 12px);
      top: 16px;
      background: url(./img/arrow-a.svg) no-repeat left center / 100% auto;
    }
    &.active::before {
      background: url(./img/arrow-d.svg) no-repeat left center / 100% auto;
    }
    background-repeat: no-repeat;
    background-position: center top;
    background-size: 44px 44px;
    &.li-1 {
      background-image: url(./img/step-d-1.svg);
      &.active {
        background-image: url(./img/step-a-1.svg);
      }
    }
    &.li-2 {
      background-image: url(./img/step-d-2.svg);
      &.active {
        background-image: url(./img/step-a-2.svg);
      }
    }
    &.li-3 {
      background-image: url(./img/step-d-3.svg);
      &.active {
        background-image: url(./img/step-a-3.svg);
      }
    }
    &.li-4 {
      background-image: url(./img/step-d-4.svg);
      &.active {
        background-image: url(./img/step-a-4.svg);
      }
    }
    img {
      position: absolute;
      right: 16px;
      top: -2px;
    }
  }
  .div-item:first-child {
    li:before {
      background: none;
    }
  }
}
/deep/ .ivu-tooltip-inner {
  background: #fff;
  color: #333333;
}
/deep/ .ivu-tooltip-popper[x-placement^='top'] .ivu-tooltip-arrow {
  background: transparent;
  border-top-color: #fff;
  box-shadow: 0px 4px 5px 0px rgba(0, 0, 0, 0.05), 0px -4px 5px 0px rgba(0, 0, 0, 0.05);
}
</style>
