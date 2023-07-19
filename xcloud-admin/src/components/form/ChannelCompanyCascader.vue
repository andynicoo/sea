<!-- 渠道选择下拉框 -->
<template>
  <a-cascader
    v-model:value="val"
    :options="list"
    placeholder="请选择"
    :fieldNames="{ label: 'name', value: 'id', children: 'childList' }"
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
import { getChannelUserAll } from '@/api/dataCenter/channelAnalysis';

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
const changeVal = (val: string, selectedOptions: any) => {
  let idsArr: Array<string> = [];
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
const getIds = (list: Array<any>, idsArr: Array<string> = []): Array<string> => {
  let listArr: Array<any> = [];
  if (list.length > 0) {
    for (const li of list) {
      idsArr.push(li.id);
      listArr = listArr.concat(li.childList || []);
    }
    return getIds(listArr, idsArr);
  } else {
    return idsArr;
  }
};

//获取数据
const getList = () => {
  getChannelUserAll().then((res: any) => {
    list.value = (res || []).map(
      (v: { userId: string; nickName: string; childList: Array<{ serviceCompanyName: string }> }) => {
        return {
          id: v.userId,
          name: v.nickName,
          childList: v.childList.map((v2: { serviceCompanyName: string }) => {
            return {
              id: v.userId + '-' + v2.serviceCompanyName,
              name: v2.serviceCompanyName,
            };
          }),
        };
      }
    );
  });
};
</script>

<style scoped lang="less"></style>
