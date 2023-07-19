<template>
  <a-modal title="详情" width="1000px" v-model:visible="showModal" :maskClosable="false" :keyboard="false">
    <div class="wrap">
      <DataTable ref="dataTable" :columns="columns" :methodName="recordPageList" :mainTable="false">
        <template #bodyCell="{ record, column }">
          <template v-if="column.dataIndex === 'businessType'">
            <span v-if="record.businessType === 1"> 线索 </span>
            <span v-else-if="record.businessType === 2"> 客户 </span>
          </template>
        </template>
      </DataTable>
    </div>

    <template #footer>
      <a-button @click="showModal = false">关闭</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, ref, watch, type Ref } from 'vue';

import DataTable from '@/components/page/DataTable.vue';
import { recordPageList } from '@/api/customerManage/clueCenter';

const props = defineProps({
  record: {
    default: () => null,
    type: Object,
  },
});

const showModal = ref(false);

const columns = ref([
  {
    title: '序号',
    dataIndex: 'index',
    width: 120,
  },
  {
    title: '机会点',
    dataIndex: 'weixin',
    width: 120,
  },
  {
    title: '创建次数',
    dataIndex: 'enterpriseName',
    width: 120,
  },
  {
    title: '处理次数',
    dataIndex: 'leadFollowStatusDes',
    width: 120,
  },
  {
    title: '处理时效',
    dataIndex: 'followUserName',
    width: 120,
  },
]);

watch(showModal, newVal => {
  if (newVal) {
    nextTick(() => {
      getList();
    });
  }
});

//获取列表
const dataTable: Ref = ref(null);
const getList = () => {
  let params = {};
  if (props.record.customerLeadId) {
    params = {
      platformId: props.record.platformId,
      mobile: props.record.mobile,
      enterpriseId: props.record.enterpriseId,
    };
  } else if (props.record.customerAccountId) {
    params = {
      mobile: props.record.mobile,
      enterpriseId: props.record.enterpriseId,
    };
  }
  dataTable.value.getList(params);
};

//暴露方法
defineExpose({ showModal });
</script>

<style scoped lang="less">
.wrap {
  max-height: 60vh;
  overflow-y: auto;
  padding: 0 10px;
}
</style>
