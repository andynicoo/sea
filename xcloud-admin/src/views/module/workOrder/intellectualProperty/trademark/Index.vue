<template>
  <SearchForm ref="searchForm" :rule="rule" @submitParams="submitParams">
    <template #operationSlot>
      <a-space>
        <a-button type="primary" @click="sealed(1)"> 封存工单 </a-button>
        <a-button type="primary" @click="sealed(2)"> 取消封存 </a-button>
        <a-button
          type="primary"
          @click="modifyLawyer()"
          v-if="['NODE0035', 'NODE0036', 'NODE0037', 'NODE0038'].includes(data.nodeCode)"
        >
          修改律师
        </a-button>
        <ChangeHandlerModal :serviceIdsArr="selectedRowKeys.map((v: any) => v.serviceId)" @submit="getList(false)" />
        <a-button type="primary" @click="downLoadFile()"> 导出 </a-button>
      </a-space>
    </template>
  </SearchForm>
  <DataTable
    ref="dataTable"
    :columns="columns"
    :rowSelection="{
        selectedRowKeys: selectedRowKeys,
        onChange: (selectRows:any)=> selectedRowKeys = selectRows
      }"
    :methodName="workorderListAPI"
  >
    <template #topSlot>
      <StatusOpt ref="statusOpt" :rule="rule" @submitNodeCode="submitNodeCode" />
    </template>

    <template #bodyCell="{ record, column }: { record: IWorkorderRecord, column: TableColumnType }">
      <template v-if="column.dataIndex === 'trademarkInfo'">
        <div>订单号：{{ record.orderNo }}</div>
        <div>服务编号：{{ record.serviceNo }}</div>
        <div>商标名称：{{ record.trademarkNameEn }}</div>
        <div>服务名称：{{ record.serviceName }}</div>
      </template>
      <template v-if="column.dataIndex === 'acceptInfo'">
        <div>受理号：{{ record.acceptNum }}</div>
        <div>日期：{{ record.acceptTime }}</div>
      </template>
      <template v-if="column.dataIndex === 'cutOffTime'">
        <div>{{ cutOffTimeFilter(record) }}</div>
      </template>
      <template v-if="column.dataIndex === 'handleInfo'">
        <template v-if="record.workorderHandlerList && record.workorderHandlerList.length > 0">
          <div v-for="(item, index) in record.workorderHandlerList" :key="index">
            {{ item.handleTypeName }}：{{ item.handlerUserName }}
          </div>
        </template>
      </template>
      <template v-if="column.dataIndex === 'orderRemark'">
        <div>{{ record.orderRemark || '-' }}</div>
      </template>

      <template v-if="column.dataIndex === 'operation'">
        <FileSearchOutlined
          style="color: #1890ff; margin-left: 10px"
          @click="goDetailsPage(record)"
          v-if="useButton('workOrder_intellectualProperty_trademark_details')"
        />
      </template>
    </template>
  </DataTable>
  <ChangeLawyerModal
    ref="changeLawyerModal"
    :serviceIds="selectedRowKeys.map((v: any) => v.serviceId).join(',')"
    :countryCode="selectedRowKeys[0]?.countryCode"
    :functionCode="selectedRowKeys[0]?.productFunctionCode"
    :showButton="false"
    @submit="getList(false)"
  />
</template>

<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import { rule, columns } from './config';
import { downloadFile, jumpPage, useButton } from '@/utils/utils';
import { workorderListAPI, changeSealedAPI, importListAPI } from '@/api/workOrder/intellectualProperty/trademark';
import ChangeLawyerModal from '../components/ChangeLawyerModal.vue';
import ChangeHandlerModal from '../components/ChangeHandlerModal.vue';
import StatusOpt from './components/StatusOpt.vue';
import { FileSearchOutlined } from '@ant-design/icons-vue';
import type { IWorkorderQueryParams, IWorkorderRecord } from '@/types/trademark';
import { message, type TableColumnType } from 'ant-design-vue';
import dayjs from 'dayjs';

const selectedRowKeys = ref<IWorkorderRecord[]>([]);
const searchForm: Ref = ref(null);
const dataTable: Ref = ref(null);
const statusOpt: Ref = ref(null);
const data: {
  nodeCode: string;
  params: IWorkorderQueryParams;
  record: IWorkorderRecord;
} = reactive({
  nodeCode: '', //状态
  params: {}, //入参
  record: {},
});

//点击搜索
const submitParams = (params: IWorkorderQueryParams) => {
  if (params.nodeServiceProgressKey) {
    const arr = params.nodeServiceProgressKey.split('>><<');
    statusOpt.value.nodeCode = arr[0];
    data.nodeCode = arr[0];
    params.progressBar = arr[1];
    params.nodeServiceProgressKey = undefined;
  }
  if (params.creatTime && params.creatTime.length === 2) {
    params.createStartTime = params.creatTime[0].split(' ')[0] + ' 00:00:00';
    params.createEndTime = params.creatTime[1].split(' ')[0] + ' 23:59:59';
    params.creatTime = undefined;
  }
  if (params.updateTime && params.updateTime.length === 2) {
    params.updateStartTime = params.updateTime[0].split(' ')[0] + ' 00:00:00';
    params.updateEndTime = params.updateTime[1].split(' ')[0] + ' 23:59:59';
    params.updateTime = undefined;
  }
  if (params.acceptTime && params.acceptTime.length === 2) {
    params.updateStartTime = params.acceptTime[0].split(' ')[0] + ' 00:00:00';
    params.acceptEndTime = params.acceptTime[1].split(' ')[0] + ' 23:59:59';
    params.acceptTime = undefined;
  }
  if (params.platformAuditTime && params.platformAuditTime.length === 2) {
    params.platformAuditStartDate = params.platformAuditTime[0].split(' ')[0] + ' 00:00:00';
    params.platformAuditEndDate = params.platformAuditTime[1].split(' ')[0] + ' 23:59:59';
    params.platformAuditTime = undefined;
  }
  data.params = params;
  getList();
};

//获取列表
const getList = (resetCurrent = true) => {
  selectedRowKeys.value = [];
  data.params.nodeCode = data.nodeCode;
  dataTable.value.getList(data.params, resetCurrent);
};

//改变状态
const submitNodeCode = (nodeCode: string) => {
  rule.value[8].value = undefined;
  data.nodeCode = nodeCode;
  searchForm.value.submit();
};

//封存工单、取消封存
const sealed = (type: number) => {
  if (selectedRowKeys.value.length === 0) {
    message.error(' 请先选择服务');
    return false;
  }
  changeSealedAPI({
    type: type,
    serviceIds: selectedRowKeys.value.map((v: IWorkorderRecord) => v.serviceId).join(','),
  }).then(() => {
    message.success('操作成功');
    getList();
  });
};

//批量修改律师
const changeLawyerModal: Ref = ref(null);
const modifyLawyer = () => {
  if (selectedRowKeys.value.length === 0) {
    message.error('请先选择服务');
    return false;
  } else {
    const countryLawyer = selectedRowKeys.value[0].countryCode;
    const productFunctionCode = selectedRowKeys.value[0].productFunctionCode;
    for (const li of selectedRowKeys.value) {
      if (li.countryCode !== countryLawyer || li.productFunctionCode !== productFunctionCode) {
        message.error('不符合批量操作要求，服务单商品对应的工单类型及国家需保持一致');
        return false;
      }
    }
    changeLawyerModal.value.showModal = true;
  }
};

//导出
const downLoadFile = () => {
  importListAPI(
    Object.assign({}, data.params, {
      ids: selectedRowKeys.value.map((v: IWorkorderRecord) => v.serviceId).join(','),
    })
  ).then((res: any) => {
    downloadFile(res, '工单列表导出文件.xlsx');
  });
};

//详情
const goDetailsPage = (record: IWorkorderRecord) => {
  jumpPage(`/workOrder/intellectualProperty/trademark/details?title=国际商标注册详情&serviceId=${record.serviceId}`);
};

//服务截止日期 转换
const cutOffTimeFilter = (row: IWorkorderRecord) => {
  let date = '-';
  try {
    const d = dayjs(row.acceptTime || row.createTime);
    if (d.year() >= 2022) {
      date = d.add(12, 'month').format('YYYY-MM-DD HH:mm:ss');
    } else {
      date = d.add(18, 'month').format('YYYY-MM-DD HH:mm:ss');
    }
  } catch (error) {
    console.error(error);
  }
  return date;
};
</script>

<style scoped lang="less"></style>
