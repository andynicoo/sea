<template>
  <a-select
    v-model:value="productInfo.formState.addValueList[props.addIndex].productCategoryId"
    @change="handleChange"
    style="width: 250px; margin-right: 15px"
  >
    <a-select-option :value="its.id" v-for="its in props.bigListArr" :key="its.id">{{
      its.productCategoryName
    }}</a-select-option>
  </a-select>
  <a-select
    v-model:value="productInfo.formState.addValueList[props.addIndex].addValueProductInfoId"
    style="width: 250px; margin-right: 15px"
  >
    <a-select-option :value="its.id" v-for="its in productList" :key="its.id">{{ its.productName }}</a-select-option>
  </a-select>
  排序：<a-input-number
    v-model:value="productInfo.formState.addValueList[props.addIndex].sort"
    :min="0"
    :max="1000000"
  />
  <a-button type="link" @click="deleteProductValue(props.addIndex)">移除</a-button>
  <!-- :disabled="productInfo.formState.addValueList.length > 3" -->
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { getProductList } from '@/api/saasManage/productList';
import { useProduct } from '@/composables/useProduct';
const { productInfo, deleteProductValue } = useProduct();

// 产品大类可选项,addValueList的index
const props = defineProps({
  bigListArr: {
    default: () => [],
    type: Array<any>,
  },
  addIndex: {
    default: 0,
    type: Number,
  },
});

onMounted(async () => {
  const params = {
    size: 1000,
    page: 1,
    productCategoryId: productInfo.formState.addValueList[props.addIndex].productCategoryId,
    productStatus: 'ENABLE',
  };
  const res = (await getProductList(params)) as any;
  productList.value = res.records;
});

// 选择产品大类后可选的产品[]
const productList: any = ref([]);

const handleChange = async (value: string) => {
  productInfo.formState.addValueList[props.addIndex].addValueProductInfoId = '';
  const params = {
    size: 1000,
    page: 1,
    productCategoryId: value,
    productStatus: 'ENABLE',
  };
  const res = (await getProductList(params)) as any;
  productList.value = res.records;
};
</script>
