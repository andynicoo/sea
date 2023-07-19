<template>
  <div class="title-min">
    <div class="">
      <span class="label">线索</span>
      <span>{{ router.currentRoute.value.query.mobile }}</span>
      <a-button size="small" type="primary" class="add" @click="addRecord()">新增跟进记录</a-button>
    </div>
  </div>
  <div style="width: 900px">
    <DataTable ref="dataTable" :columns="columns" :methodName="recordPageList" :mainTable="false">
      <template #bodyCell="{ record, column }">
        <template v-if="column.dataIndex === 'businessType'">
          <span v-if="record.businessType === 1"> 线索 </span>
          <span v-else-if="record.businessType === 2"> 客户 </span>
        </template>
      </template>
    </DataTable>
  </div>
  <AddFollowModal ref="addFollowModal" @submit="getList()" />
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';

import DataTable from '@/components/page/DataTable.vue';
import { recordPageList } from '@/api/customerManage/clueCenter';
import router from '@/router';
import AddFollowModal from './AddFollowModal.vue';

const columns = ref([
  {
    title: '添加人',
    dataIndex: 'createUserName',
    width: 120,
  },
  {
    title: '平台',
    dataIndex: 'platformName',

    width: 120,
  },
  {
    title: '跟进记录内容',
    dataIndex: 'content',
    width: 120,
  },
  {
    title: '跟进时间',
    dataIndex: 'platformTime',
    width: 120,
  },
]);

onMounted(() => {
  getList();
});

//新增记录
const addFollowModal: Ref = ref(null);
const addRecord = () => {
  addFollowModal.value.showModal = true;
};

//获取列表
const dataTable: Ref = ref(null);
const getList = () => {
  dataTable.value.getList({
    mobile: router.currentRoute.value.query.mobile,
    brandId: router.currentRoute.value.query.brandId,
  });
};
</script>

<style scoped lang="less">
.title-min {
  line-height: 30px;
  margin-bottom: 15px;
  font-weight: bold;
  .label {
    background-color: rgb(205, 224, 245);
    color: rgb(45, 140, 240);
    padding: 2px 8px;
    border-radius: 3px;
    margin-right: 10px;
  }
  .add {
    float: right;
  }
}
</style>
