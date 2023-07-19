<!-- 工单类型组件 -->
<template>
  <a-cascader
    v-model:value="val"
    :options="list"
    placeholder="请选择"
    :fieldNames="{ label: 'name', value: 'code', children: 'children' }"
    :maxTagCount="1"
    multiple
    allowClear
    showSearch
    showArrow
    expandTrigger="hover"
    @change="changeVal"
    style="width: 200px"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { listByCategory } from '@/api/base/basicsData';

const props = defineProps({
  modelValue: {
    default: null,
  },
});
const emit = defineEmits(['update:modelValue']);
const list = ref<Array<any>>([]);
const val = ref<Array<any>>([]);
watch(props, (newVal: any) => {
  if (newVal.modelValue && newVal.modelValue.value) {
    val.value = newVal.modelValue.value || [];
  } else {
    val.value = [];
  }
});

onMounted(() => {
  // val.value = props.modelValue || [];
  getList();
});

//改变
const changeVal = (val: number, selectedOptions: any) => {
  let idsArr: Array<number> = [];
  for (const arr of selectedOptions) {
    for (let i = 0; i < arr.length - 1; i++) {
      idsArr.push(arr[i].code);
    }
    idsArr = Array.from(new Set(idsArr.concat(getIds([arr[arr.length - 1]]))));
  }
  //后端不需要大类id
  idsArr = idsArr.filter((v: any) => v.indexOf('p1_') === -1);
  emit('update:modelValue', {
    value: val,
    params: idsArr,
  });
};

//获取ids
const getIds = (list: Array<any>, idsArr: Array<number> = []): Array<number> => {
  let listArr: Array<any> = [];
  if (list.length > 0) {
    for (const li of list) {
      idsArr.push(li.code);
      listArr = listArr.concat(li.children || []);
    }
    return getIds(listArr, idsArr);
  } else {
    return idsArr;
  }
};

//获取数据
const getList = () => {
  listByCategory().then((res: any) => {
    list.value = (res || []).map((v: any) => {
      return {
        code: 'p1_' + v.id,
        name: v.name,
        children: v.workFunctionList || [],
      };
    });
  });
};
</script>

<style scoped lang="less"></style>
