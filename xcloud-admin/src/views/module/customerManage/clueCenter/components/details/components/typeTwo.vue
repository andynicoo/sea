<template>
  <div v-if="data" class="panel">
    <dl v-for="(val, key) in useData" :key="key" class="panel-item">
      <dt>{{ val.label }}：</dt>
      <dd>{{ val.values || '--' }}</dd>
    </dl>
  </div>
</template>
<script setup lang="ts">
import { reactive, computed, watchEffect } from 'vue';
import useFn from './use';

interface Props {
  data: any;
}
const props = defineProps<Props>();
const { countryMap } = useFn();
const formData = reactive({
  companyName: {
    label: '公司名称',
    values: '',
  },
  categoryLabels: {
    label: '商标大类',
    values: '',
  },
  competingName: {
    label: '竞品商标名',
    values: '',
  },
  country: {
    label: '意向国家',
    values: '',
  },
  logonName: {
    label: '已注册商标名',
    values: '',
  },
  mainProduct: {
    label: '主营产品',
    values: '',
  },
  preference: {
    label: '取名偏好',
    values: '',
  },
  webUrl: {
    label: '官网链接',
    values: '',
  },
});
const useData = computed(() => {
  if (props.data) {
    const data: any = formData;
    for (const key in data) {
      const val = props.data[key];
      console.log('val专家取名', val);
      if (val) {
        if (key == 'categoryLabels') {
          data[key].values = val.join('，');
        } else if (key == 'country') {
          data[key].values = val.map((v: string | number) => countryMap[v]).join('，');
        } else {
          data[key].values = val;
        }
      }
    }
    return data;
  } else {
    return {};
  }
});
watchEffect(() => {
  console.log('useData', useData);
});
</script>
<style lang="less" scoped>
@import url(./style.less);
</style>
