<!-- 人员选择下拉框 -->
<template>
  <a-select
    v-model:value="val"
    @change="changeVal"
    :mode="mode"
    placeholder="请选择"
    allowClear
    showArrow
    showSearch
    :maxTagCount="1"
    :maxTagTextLength="5"
    optionFilterProp="label"
    :dropdownMatchSelectWidth="260"
    :options="list"
    style="width: 200px"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { getAllUsers } from '@/api/base/basicsData';

const emit = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {
    default: null,
  },
  emptySelect: {
    default: false,
  },
  mode: {
    default: 'multiple',
  },
});

const list = ref<Array<any>>([]);
const val = ref<Array<string>>([]);

onMounted(() => {
  val.value = props.modelValue || [];
  getList();
});

watch(props, newVal => {
  val.value = newVal.modelValue || [];
});

//改变
const changeVal = (val: string) => {
  emit('update:modelValue', val);
};

//获取数据
const getList = () => {
  getAllUsers().then((res: any) => {
    list.value = res || [];
    list.value = list.value
      .filter((v: { status: number }) => v.status === 1)
      .map((v: { userId: string; nickName: string; mobile: string; departmentName: string }) => {
        return {
          value: v.userId,
          label: v.nickName + '——' + v.departmentName,
        };
      });
    if (props.emptySelect) {
      list.value.unshift({
        value: 0,
        label: '空',
      });
    }
  });
};
</script>

<style scoped lang="less"></style>
