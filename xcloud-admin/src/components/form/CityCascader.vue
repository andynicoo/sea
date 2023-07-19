<template>
  <a-cascader
    v-model:value="val"
    multiple
    :maxTagCount="1"
    :options="options"
    allowClear
    showArrow
    showSearch
    :searchValue="searchValue"
    expandTrigger="hover"
    @search="search"
    @change="changeVal"
    placeholder="请选择"
    style="width: 200px"
  ></a-cascader>
</template>
<script setup lang="ts">
import { ref, onMounted, watch, toRaw } from 'vue';
import { getCities } from '@/api/base/basicsData';
import type { CascaderProps } from 'ant-design-vue';
const props = defineProps({
  modelValue: {
    default: null,
  },
});
const emit = defineEmits(['update:modelValue']);
const val = ref<string[]>([]);
const options = ref<CascaderProps['options']>();
const searchValue = ref(null);
watch(props, (newVal: any) => {
  if (newVal.modelValue && newVal.modelValue.value) {
    val.value = newVal.modelValue.value || [];
  } else {
    val.value = [];
  }
});
//搜索
const search = (val: any) => {
  searchValue.value = val;
};
//获取数据
const getList = () => {
  getCities().then((res: any) => {
    const data = res;
    data.unshift({
      province: '无',
      cityList: ['无'],
    });

    const arr: CascaderProps['options'] = data.reduce((all: any, cur: any) => {
      const tempParent = {
        label: cur.province,
        value: cur.province,
        children: [],
      };
      if (cur.cityList.length) {
        tempParent.children = cur.cityList.map((item: string) => {
          const temp: any = {
            label: item,
            value: item,
          };
          return temp;
        });
      }
      all.push(tempParent);
      return all;
    }, []);
    if (arr) {
      options.value = [...arr];
    }
  });
};
//改变
const changeVal = (val: string, selectedOptions: any) => {
  const temps = {
    attributionPlaceProvinceList: [] as any,
    attributionPlaceCityList: [] as any,
  };
  const useData: any = val;
  if (useData.length) {
    useData.forEach((item: any) => {
      temps.attributionPlaceProvinceList.push(item[0]);
      if (item.length > 1) {
        item.forEach((itemChild: any, index: number) => {
          if (index > 0) {
            temps.attributionPlaceCityList.push(itemChild);
          }
        });
      }
    });
  }
  emit('update:modelValue', {
    value: val,
    params: temps,
  });
};
onMounted(() => {
  getList();
});
</script>
<style scoped lang="less"></style>
