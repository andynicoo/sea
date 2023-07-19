<template>
  <div v-for="(item, index) in productInfo.formState.addValueList" :key="index" class="zt-mb-2">
    <a-space>
      <AddValueItem :bigListArr="props.bigListArr" :addIndex="index" />
    </a-space>
  </div>
  <a-button type="link" @click="addProductValue" :disabled="productInfo.formState.addValueList.length > 3"
    >添加</a-button
  >
</template>

<script lang="ts" setup>
import AddValueItem from '@/components/page/saasmanage/AddValueItem.vue';
import { useProduct } from '@/composables/useProduct';
const { productInfo, addProductValue } = useProduct();

// 产品大类可选项
const props = defineProps({
  bigListArr: {
    default: () => [],
    type: Array<any>,
  },
});
</script>
