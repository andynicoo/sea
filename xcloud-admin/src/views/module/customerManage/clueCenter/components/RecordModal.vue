<template>
  <a-modal title="疑似重复线索列表" width="1300px" v-model:visible="showModal" :maskClosable="false" :keyboard="false">
    <div class="wrap">
      <a-button type="danger" @click="editFollow()"> 修改跟进人 </a-button>
      <DataTable
        ref="dataTable"
        :columns="columns"
        :methodName="getClueCenterList"
        :mainTable="false"
        :pageSize="10"
        :rowSelection="{
          selectedRowKeys: selectedRowKeys,
          onChange: (selectRows:any)=> selectedRowKeys = selectRows
        }"
      >
        <template #bodyCell="{ record, column }">
          <template v-if="column.dataIndex === 'registerSource'">
            <span v-if="record.registerSource === 0">PC网页端</span>
            <span v-else-if="record.registerSource === 1">H5端</span>
            <span v-else-if="record.registerSource === 2">微信小程序</span>
            <span v-else-if="record.registerSource === 5">后台录入</span>
            <span v-else-if="record.registerSource === 6">销售易</span>
            <span v-else></span>
          </template>
        </template>
      </DataTable>
    </div>
    <template #footer>
      <a-button @click="showModal = false">关闭</a-button>
    </template>
  </a-modal>
  <EditFollowModal ref="editFollowModal" :selectedRowKeys="selectedRowKeys" @submit="submit()" />
</template>
<script setup lang="ts">
import { nextTick, ref, watch, type Ref } from 'vue';
import DataTable from '@/components/page/DataTable.vue';
import { getClueCenterList } from '@/api/customerManage/clueCenter';
import EditFollowModal from './EditFollowModal.vue';
import { message } from 'ant-design-vue';

const props = defineProps({
  record: {
    default: () => null,
    type: Object,
  },
});
const emit = defineEmits(['submit']);
const selectedRowKeys = ref([]);
const showModal = ref(false);
const columns = ref([
  {
    title: '手机号',
    dataIndex: 'mobile',
    width: 140,
    fixed: true,
  },
  {
    title: '品牌',
    dataIndex: 'brandName',
    width: 110,
    fixed: true,
  },
  {
    title: '数据源',
    dataIndex: 'platformDes',
    width: 120,
  },
  {
    title: '姓名',
    dataIndex: 'name',
    width: 120,
  },
  {
    title: '线索来源(大类)',
    dataIndex: 'sourceLargeDes',
    width: 130,
  },
  {
    title: '线索来源(小类)',
    dataIndex: 'sourceSmallDes',
    width: 130,
  },
  {
    title: '市场活动',
    dataIndex: 'campaignDes',
    width: 200,
  },
  {
    title: '跟进状态',
    dataIndex: 'leadFollowStatusDes',
    width: 100,
  },
  {
    title: '跟进人',
    dataIndex: 'followUserName',
    width: 130,
  },
  {
    title: '跟进人部门',
    dataIndex: 'followDepartmentName',
    width: 120,
  },
  {
    title: '邀请人',
    dataIndex: 'inviteUserName',
    width: 130,
  },
  {
    title: '注册来源',
    dataIndex: 'registerSource',
    width: 130,
  },
  {
    title: '注册时间',
    dataIndex: 'createTime',
    width: 160,
  },
  {
    title: '潜客转化时间',
    dataIndex: 'opportunityTime',
    width: 160,
  },
  {
    title: '客户转换时间',
    dataIndex: 'changeTime',
    width: 160,
  },
  {
    title: '推送状态',
    dataIndex: 'lxyStatusDes',
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

//获取下载列表
const dataTable: Ref = ref(null);
const getList = () => {
  dataTable.value.getList({
    flagRepeat: true,
    mobile: props.record.mobile,
    brandId: props.record.brandId,
  });
};

//修改跟进人成功
const submit = () => {
  getList();
  selectedRowKeys.value = [];
  emit('submit');
};

//修改跟进人
const editFollowModal: Ref = ref(null);
const editFollow = () => {
  if (selectedRowKeys.value.length === 0) {
    message.error('请选择线索');
    return false;
  }
  editFollowModal.value.showModal = true;
};

//暴露方法
defineExpose({ showModal });
</script>
<style scoped lang="less">
.wrap {
  max-height: 60vh;
  overflow-y: auto;
}
</style>
