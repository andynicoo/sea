<!-- 商品分类选择下拉框 -->
<template>
  <a-cascader
    v-model:value="val"
    :options="list"
    placeholder="请选择"
    :fieldNames="{ label: 'categoryName', value: 'id', children: 'childrenProductCategoryVo' }"
    :maxTagCount="1"
    multiple
    allowClear
    showArrow
    showSearch
    :searchValue="searchValue"
    expandTrigger="hover"
    @change="changeVal"
    @search="search"
    style="width: 200px"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { getAllCategory } from '@/api/base/basicsData';

const props = defineProps({
  modelValue: {
    default: null,
  },
});
const emit = defineEmits(['update:modelValue']);
const list = ref<Array<any>>([]);
const val = ref<Array<any>>([]);
const searchValue = ref(null);
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

//搜索
const search = (val: any) => {
  searchValue.value = val;
};

//改变
const changeVal = (val: number, selectedOptions: any) => {
  let idsArr: Array<number> = [];
  for (const arr of selectedOptions) {
    for (let i = 0; i < arr.length - 1; i++) {
      idsArr.push(arr[i].id);
    }
    idsArr = Array.from(new Set(idsArr.concat(getIds([arr[arr.length - 1]]))));
  }

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
      idsArr.push(li.id);
      listArr = listArr.concat(li.childrenProductCategoryVo || []);
    }
    return getIds(listArr, idsArr);
  } else {
    return idsArr;
  }
};

//获取数据
const getList = () => {
  getAllCategory({
    current: 1,
    size: 100,
    status: 'ENABLE',
  }).then((res: any) => {
    list.value = (res.records || []).map((v: any) => {
      return {
        id: v.id,
        categoryName: v.categoryName,
        childrenProductCategoryVo: v.childrenProductCategory || [],
      };
    });
  });
};
</script>

<style scoped lang="less"></style>
