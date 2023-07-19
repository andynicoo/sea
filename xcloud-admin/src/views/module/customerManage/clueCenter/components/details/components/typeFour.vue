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
  mainProduct: {
    label: '要调整的商标名',
    values: '',
  },
  reName: {
    label: '希望要包含的字母',
    values: '',
  },
});
const useData = computed(() => {
  if (props.data) {
    const data: any = formData;
    for (const key in data) {
      const val = props.data[key];
      data[key].values = val;
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
