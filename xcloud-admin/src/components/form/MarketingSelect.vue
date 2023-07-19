<!-- 市场活动下拉框 -->
<template>
  <a-select
    v-model:value="val"
    placeholder="请选择"
    :maxTagCount="1"
    :maxTagTextLength="5"
    optionFilterProp="label"
    mode="multiple"
    showSearch
    allowClear
    showArrow
    @change="changeVal"
    style="width: 200px"
  >
    <a-select-option v-for="(li, index) of list" :key="index" :label="li.linkName" :value="li.linkAddressId">
      {{ li.linkName }}
    </a-select-option>
  </a-select>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { pageListLink } from '@/api/base/basicsData';

const props = defineProps({
  modelValue: {
    default: null,
  },
});
const emit = defineEmits(['update:modelValue']);
const list = ref<Array<any>>([]);
const val = ref<Array<any>>([]);
watch(props, newVal => {
  val.value = newVal.modelValue || [];
});

onMounted(() => {
  val.value = props.modelValue || [];
  getList();
});

//获取数据
const getList = () => {
  pageListLink({ getAll: 1 }).then((res: any) => {
    list.value = res.records || [];
  });
};

//改变
const changeVal = (val: string, selectedOptions: any) => {
  emit('update:modelValue', val);
};
</script>

<style scoped lang="less"></style>
