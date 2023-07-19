<template>
  <div class="progress">
    <a-steps :current="currentStep">
      <template #progressDot="{ prefixCls }">
        <span :class="`${prefixCls}-icon-dot`" />
      </template>
      <a-step v-for="(step, index) in stepsArr" :key="index" :title="step.nodeName">
        <template #description>
          <p>{{ step.operateUserDept }} {{ step.operateUserName }}</p>
          <p>{{ step.operateTime }}</p>
        </template>
      </a-step>
    </a-steps>
  </div>
</template>
<script lang="ts" setup>
import { inject, computed } from 'vue';

const detail = inject('detail') as any;
const stepsArr = computed(() => {
  if (detail.value) {
    const stepsData = detail.value.timeAxisVO;
    const arr: any = [];
    for (const key in stepsData) {
      const cur = stepsData[key];
      if (cur.nodeStatus !== 0) {
        arr.push(cur);
      }
    }
    return arr;
  } else {
    return null;
  }
});
const currentStep = computed(() => {
  if (stepsArr.value) {
    const index = stepsArr.value.findIndex((item: any) => item.nodeStatus === 2);
    return index > -1 ? index : stepsArr.value.length;
  } else {
    return null;
  }
});
</script>
<style lang="less" scoped>
.progress {
  padding: 40px 10px 20px;
  background: #fff;
  margin-bottom: 10px;
}
.ant-steps-item-process .ant-steps-item-icon > .ant-steps-icon .ant-steps-icon-dot {
  border: 1px solid #1890ff;
  background: #fff;
  width: 120%;
  height: 120%;
  left: -1px;
  top: -1px;
}
::v-deep .ant-steps-item-description {
  font-size: 12px;
}
::v-deep .ant-steps-item-title {
  font-size: 14px;
}
</style>
