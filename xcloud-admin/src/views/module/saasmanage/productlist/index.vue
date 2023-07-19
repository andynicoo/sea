<template>
  <SearchForm :rule="rule" @submitParams="submitParams">
    <template #operationSlot>
      <a-button type="primary" :loading="syncProduct" @click="rfreshListFunc"> 同步商品 </a-button>
    </template>
  </SearchForm>

  <DataTable
    ref="dataTable"
    :columns="columns"
    :methodName="getProductList"
    :pageKeyStr="{ currentKey: 'current', pageSizeKey: 'size' }"
  >
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'productImage'">
        <ImageViewer :img="record.productImage" />
      </template>
      <template v-if="column.dataIndex === 'packageContent'">
        <template v-if="record.packageContent === ''"> - </template>
        <template v-if="record.packageContent !== ''">
          <div v-html="record.packageContent" class="tablecontent"></div>
        </template>
      </template>
      <template v-if="column.dataIndex === 'productStatus'">
        <a-tag color="red" v-if="record.productStatus === 'DISABLE'">禁用</a-tag>
        <a-tag color="green" v-else>启用</a-tag>
      </template>
      <template v-if="column.dataIndex === 'dataNumber'"> {{ handleNum(record.dataNumber) }} </template>
      <template v-if="column.dataIndex === 'processNumber'"> {{ handleNum(record.processNumber) }} </template>
      <template v-if="column.dataIndex === 'advantageNumber'"> {{ handleNum(record.advantageNumber) }} </template>
      <template v-if="column.dataIndex === 'whoNeedNumber'"> {{ handleNum(record.whoNeedNumber) }} </template>
      <template v-if="column.dataIndex === 'addValueNumber'"> {{ handleNum(record.addValueNumber) }} </template>
      <template v-if="column.dataIndex === 'operation'">
        <a-button
          type="link"
          @click="switchEnable('ENABLE', record)"
          v-if="record.productStatus === 'DISABLE'"
          :loading="record.handing"
          v-show="useButton('PRO_ABLE')"
          >启用</a-button
        >
        <a-button
          type="link"
          @click="switchEnable('DISABLE', record)"
          v-else
          :loading="record.handing"
          v-show="useButton('PRO_DIS')"
          >禁用</a-button
        >

        <a-button type="link" @click="editProduct(record.id)" v-show="useButton('PRO_EDIT')">编辑</a-button>
      </template>
    </template>
  </DataTable>
</template>

<script lang="ts" setup>
import { ref, reactive, type Ref } from 'vue';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import { getProductList, updateStatus, rfreshList } from '@/api/saasManage/productList';
import { jumpPage } from '@/utils/utils';
import { rule, columns } from './config';
import type { SearchType, productIdType, ProductType } from '@/types/saasmanage';
import ImageViewer from '@/components/page/ImageViewer.vue';
import { message } from 'ant-design-vue';
import { stringSlice } from '@/utils/utils';
import { useButton } from '@/utils/utils';

const data = reactive<{ searchParams: SearchType }>({
  searchParams: {
    productName: '',
    productStatus: '',
  },
});

//点击搜索
const submitParams = (p: SearchType) => {
  data.searchParams = p;
  getList();
};

const dataTable: Ref = ref(null);
//获取列表
const getList = (resetCurrent = true) => {
  dataTable.value.getList(data.searchParams, resetCurrent);
};

// 同步产品 loading
const syncProduct: Ref<boolean> = ref(false);
const rfreshListFunc = async () => {
  syncProduct.value = true;
  const res = (await rfreshList({})) as any;
  syncProduct.value = false;
  if (res) {
    message.success('已同步商品');
    getList();
  }
};

//产品详情
const detailedReportPage = (id: number) => {
  jumpPage(`/saasmanage/productlist/EditProduct?id=${id}`);
};

// 处理数字
const handleNum = (num: number) => {
  let reNum: string | number = '';
  num === 0 ? (reNum = '-') : (reNum = num);
  return reNum;
};

// 更新状态
const switchEnable = async (status: string, record: ProductType) => {
  record.handing = true;
  const res = (await updateStatus({ id: record.id, productStatus: status })) as any;
  record.handing = false;
  if (res) {
    message.success('状态已调整');
    getList();
  }
};

const editProduct = (productId: number) => {
  console.log(productId);
  detailedReportPage(productId);
};

const updateProductStatus = (product: productIdType) => {
  console.log(product);
};
</script>

<style lang="less" scoped>
.tablecontent {
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  /*限制在一个块元素显示的文本的行数*/
  -webkit-box-orient: vertical;
}
</style>
