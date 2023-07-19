<template>
  <SearchForm :rule="rule" @submitParams="submitParams">
    <!-- <template #topSlot>
      <Statistics />
    </template> -->
    <template #operationSlot>
      <a-space>
        <a-button
          v-if="useButton('xcloudplat_customerManage_DataSource_refreshMarket')"
          type="danger"
          @click="refreshMarket()"
          :loading="loadingBtn1"
        >
          刷新市场活动
        </a-button>
        <a-button
          v-if="useButton('xcloudplat_customerManage_DataSource_refreshCustomer')"
          type="danger"
          @click="refreshCustomer()"
          :loading="loadingBtn2"
        >
          刷新客户来源
        </a-button>
        <a-button v-if="useButton('xcloudplat_customerManage_DataSource_add')" type="danger" @click="add()">
          添加数据源
        </a-button>
      </a-space>
    </template>
  </SearchForm>
  <DataTable ref="dataTable" :columns="columns" :methodName="getSourcePageList">
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'status'">
        <span v-if="record.status === 1">启用</span>
        <span style="color: red" v-else>禁用</span>
      </template>
      <template v-if="column.dataIndex === 'secret'">
        <div v-if="record.secret" class="secret-wrap">
          <div class="secret-text">{{ record.secret }}</div>
          <a-button size="small" type="primary" style="margin-left: 10px" @click="textCopy(record.secret)">
            复制
          </a-button>
        </div>
        <template v-else>-</template>
      </template>
      <template v-if="column.dataIndex === 'pushCrm'">
        <span v-if="record.pushCrm === 1">已开启</span>
        <span v-else>已关闭</span>
      </template>
      <template v-if="column.dataIndex === 'pushLxy'">
        <span v-if="record.pushLxy === 1">已开启</span>
        <span v-else>已关闭</span>
      </template>
      <template v-if="column.dataIndex === 'operation'">
        <a-button type="text" @click="edit(record)">编辑</a-button>
        <a-button type="text" @click="detail(record)">详情</a-button>
      </template>
    </template>
  </DataTable>
  <EditModal ref="editModal" :record="data.record" @submit="getList(false)" />
  <DetailModal ref="detailModal" :record="data.record" />
</template>

<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import { rule, columns } from './config';
import { useButton } from '@/utils/utils';
import { textCopy } from '@/utils/utils';
import { message } from 'ant-design-vue';
import { getSourcePageList, findCampaign, getCrmSource } from '@/api/customerManage/dataSource';
import Statistics from './components/Statistics.vue';
import EditModal from './components/EditModal.vue';
import DetailModal from './components/DetailModal.vue';

const loadingBtn1 = ref(false);
const loadingBtn2 = ref(false);
const dataTable: Ref = ref(null);

const data: any = reactive({
  params: {},
  record: {},
});

//点击搜索
const submitParams = (p: object) => {
  data.params = p;
  getList();
};

//获取列表
const getList = (resetCurrent = true) => {
  if (data.params.createTimeQuery && data.params.createTimeQuery.length === 2) {
    data.params.createTimeQuery = [
      data.params.createTimeQuery[0].split(' ')[0] + ' 00:00:00',
      data.params.createTimeQuery[1].split(' ')[0] + ' 23:59:59',
    ];
  }
  dataTable.value.getList(data.params, resetCurrent);
};

//刷新市场活动
const refreshMarket = () => {
  loadingBtn1.value = true;
  findCampaign({})
    .then((res: any) => {
      loadingBtn1.value = false;
      message.success('操作成功');
    })
    .catch(() => {
      loadingBtn1.value = false;
    });
};

//刷新客户来源
const refreshCustomer = () => {
  loadingBtn2.value = true;
  getCrmSource({
    code: 'lead',
  })
    .then((res: any) => {
      loadingBtn2.value = false;
      message.success('操作成功');
    })
    .catch(() => {
      loadingBtn2.value = false;
    });
};

//添加数据源
const editModal: Ref = ref(null);
const add = () => {
  data.record = {};
  editModal.value.visible = true;
};

//编辑数据源
const edit = (record: any) => {
  data.record = record;
  editModal.value.visible = true;
};

//详情
const detailModal: Ref = ref(null);
const detail = (record: any) => {
  data.record = record;
  detailModal.value.visible = true;
};
</script>

<style scoped lang="less">
.secret-wrap {
  display: flex;
  .secret-text {
    flex: 1;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
