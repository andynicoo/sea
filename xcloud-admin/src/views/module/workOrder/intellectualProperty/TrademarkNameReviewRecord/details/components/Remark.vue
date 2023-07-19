<template>
  <div class="remark-page">
    <div class="panel-hd">
      <div class="title">备注</div>
    </div>
    <div class="panel-bd">
      <a-button
        v-if="useButton('trademarkDetail_report_remark_add')"
        @click="tableItemEdit({})"
        type="primary"
        style="margin-bottom: 10px"
        >+写备注</a-button
      >
      <a-table
        :dataSource="data"
        :columns="columns"
        :bordered="true"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <div v-if="column.dataIndex === 'remarkUrl'">
            <a-image-preview-group v-if="record.remarkUrl.split(',').length">
              <a-image
                v-for="(img, index) in record.remarkUrl.split(',')"
                :key="index"
                :width="100"
                :src="img"
                :style="{ display: index === 0 ? 'block' : 'none' }"
              ></a-image>
            </a-image-preview-group>
            <span v-else>--</span>
          </div>
          <div v-if="column.dataIndex === 'operate'">
            <a-button v-if="useButton('trademarkDetail_report_remark_edit')" type="link" @click="tableItemEdit(record)"
              >编辑</a-button
            >
            <a-button v-if="useButton('trademarkDetail_report_remark_del')" type="link" @click="handleDelete(record)"
              >删除</a-button
            >
          </div>
        </template>
      </a-table>
    </div>
    <!-- 填写修改备注弹窗 -->
    <ModalDealRemark
      v-if="dealRemarkShow"
      @close="dealRemarkShow = false"
      @update="getList"
      :item="TableItem"
    ></ModalDealRemark>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, inject } from 'vue';
import { message, type TableColumnsType } from 'ant-design-vue';
import { getTrademarkeRemark, delTrademarkRemark } from '@/api/workOrder/intellectualProperty/trademark';
import { Modal } from 'ant-design-vue';
import { useButton } from '@/utils/utils';
import ModalDealRemark from './ModalDealRemark.vue';

interface Emits {
  (e: 'edit'): void;
}
const emit = defineEmits<Emits>();
const recordId = inject('id') as string;
const dealRemarkShow = ref(false);
const data = ref([]);
const columns = ref<TableColumnsType>([
  {
    title: '操作员',
    dataIndex: 'createUserName',
    key: 'createUserName',
    width: 200,
  },
  {
    title: '部门',
    dataIndex: 'createUserDepName',
    key: 'createUserDepName',
  },
  {
    title: '操作时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
  },
  {
    title: '图片附件',
    dataIndex: 'remarkUrl',
    key: 'remarkUrl',
    width: 200,
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    width: 200,
    align: 'center',
  },
]);
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
});
const handleTableChange = (e: any) => {
  pagination.current = e.current;
  getList();
};
const TableItem = ref<any>({});
const tableItemEdit = (item: any) => {
  dealRemarkShow.value = true;
  TableItem.value = item;
};
const handleDelete = (item: any) => {
  Modal.confirm({
    title: '删除记录',
    content: '是否删除该条记录',
    cancelText: '取消',
    okText: '删除',
    onOk: async () => {
      await delTrademarkRemark({ remarkId: item.id });
      message.success('删除成功');
      getList();
    },
    onCancel() {
      console.log('Cancel');
    },
  });
};
const getList = () => {
  dealRemarkShow.value = false;
  getTrademarkeRemark({
    limit: pagination.pageSize,
    page: pagination.current,
    recordId: recordId,
  }).then(res => {
    data.value = res.records;
    pagination.total = +res.total;
  });
};
onMounted(() => {
  getList();
});
defineExpose({
  getList,
});
</script>
<style lang="less" scoped>
.remark-page {
  background: #fff;
  margin-bottom: 10px;
  .title {
    font-weight: bold;
  }
}
</style>
