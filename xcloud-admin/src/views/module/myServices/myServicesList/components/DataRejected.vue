<template>
  <DataTable
    ref="dataTable"
    :columns="columns"
    :initSearch="false"
    :rowSelection="{
        selectedRowKeys: selectedRowKeys,
        onChange: (selectRows:any)=> selectedRowKeys = selectRows
      }"
    :methodName="getListPage"
  >
    <template #topSlot>
      <a-button class="export-btn" type="primary" v-if="useButton('MSL_5')" ghost @click="downLoadFile()"
        ><img src="@/assets/img/icon/export.png" /> 导出</a-button
      >
      <a-radio-group class="statusList-group" v-model:value="data.rejectCount" @change="getList()">
        <a-radio-button v-for="(li, index) of Object.keys(data.statusList)" :key="index" :value="data.statusList[li].id"
          >{{ data.statusList[li].label }}（{{ data.statusList[li].value }}）</a-radio-button
        >
      </a-radio-group>
    </template>

    <template #bodyCell="{ record, column }">
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
      <template v-if="column.dataIndex === 'serviceName'">
        <a-tooltip>
          <template #title>{{ record.serviceName }}</template>
          {{ record.serviceName }}
        </a-tooltip>
      </template>
      <template v-if="column.dataIndex === 'handleInfo'">
        <div
          v-for="(item, index) in record.workorderHandlerList || []"
          :key="index"
          style="margin: 2px 0; font-size: 12px"
        >
          <span>{{ item.handleTypeName }}</span>
          <span>：</span>
          <span>{{ item.handlerUserName }}</span>
        </div>
      </template>
      <template v-if="column.dataIndex === 'userLevel'">
        {{ userLevelMap[record.userLevel] }}
      </template>
      <template v-if="column.dataIndex === 'functionCode'">
        {{ functionCodesMap.filter(item => record.functionCode == item.value)[0].label }}
      </template>
      <template v-if="column.dataIndex === 'rejectCount'">
        <span class="rejectCount" :class="`rejectCount${record.rejectCount}`">{{ record.rejectCount }}次</span>
      </template>
      <template v-if="column.dataIndex === 'situationContent'">
        <a-tooltip v-if="record.situationContent" :title="record.situationContent" placement="topLeft">
          <span @click="followUpShow(record)" style="color: rgb(24, 144, 255)">{{
            record.situationContent?.slice?.(0, 10)
          }}</span>
          <!-- <a-button type="link" ></a-button> -->
        </a-tooltip>
        <a-button v-else shape="circle" @click="followUpShow(record)">
          <template #icon><FormOutlined /></template>
        </a-button>
      </template>
      <template v-if="column.dataIndex === 'operation'">
        <a-tooltip title="工单详情" v-if="useButton('MSL_4')">
          <FileSearchOutlined style="color: #1890ff" @click="goDetailsPage(record)" />
        </a-tooltip>
      </template>
    </template>
  </DataTable>
  <FollowUpRecords ref="followUp" :dataRecord="data.record" @getList="getList" />
</template>

<script setup lang="ts">
import { FileSearchOutlined, FormOutlined } from '@ant-design/icons-vue';
import DataTable from '@/components/page/DataTable.vue';
import FollowUpRecords from './FollowUpRecords.vue';
import { columns, userLevelMap, functionCodesMap } from './../config';
import { downloadFile, useButton } from '@/utils/utils';
import { getListPage, getListCount, getListExport } from '@/api/management/vat';
import { cloneDeep } from 'lodash';
import { message } from 'ant-design-vue';
import type { DataRejectedRecordVO } from '@/types/myServices';
import { useStore } from '@/stores/store';

//传入参数
interface SearchParamsOV {
  searchParams: object;
}
const props = defineProps<SearchParamsOV>();

const { setPageCache, cacheData } = useSearchFormCache();

const selectedRowKeys = ref<any[]>([]);
const dataTable: Ref = ref(null);
const data: any = reactive({
  statusList: {
    all: {
      label: '全部',
      value: 0,
      id: '',
    },
    rejectOneCount: {
      label: '驳回1次',
      value: 0,
      id: 1,
    },
    rejectTwoCount: {
      label: '驳回2次',
      value: 0,
      id: 2,
    },
    rejectThreeCount: {
      label: '驳回3次',
      value: 0,
      id: 3,
    },
    rejectFourCount: {
      label: '驳回超过3次',
      value: 0,
      id: 4,
    },
  }, //状态列表
  rejectCount: cacheData.value.rejectCount || '', //驳回次数
  params: {},
  record: {},
});
const getList = (resetCurrent = true) => {
  data.params.rejectCount = data.rejectCount;
  selectedRowKeys.value = [];
  setPageCache(data.params);
  dataTable.value.getList(data.params, resetCurrent);
};

//获取状态
const getOaStatusListFun = () => {
  getListCount(data.params).then((res: any) => {
    let all = 0;
    Object.keys(res).forEach(key => {
      if (data.statusList[key]) {
        data.statusList[key].value = res[key];
        all += Number(res[key]);
      }
    });
    data.statusList.all.value = all;
  });
};

//跟进
const followUp: Ref = ref(null);
const followUpShow = (record: DataRejectedRecordVO) => {
  data.record = record;
  setTimeout(() => {
    followUp.value.visible = true;
  });
};

// 跳转详情
const userStore = useStore();
const goDetailsPage = (row: DataRejectedRecordVO) => {
  if (row.functionCode === 5 || row.functionCode === 23) {
    userStore.$router().push({
      path: '/serviceManage/taxRegisterInfo',
      query: { workOrderId: row.id, serviceNo: row.serviceNo, isBack: 1 },
    });
  } else if (row.functionCode === 2) {
    userStore.$router().push({
      path: '/serviceManage/taxInfo',
      query: { workOrderId: row.id, serviceNo: row.serviceNo, isBack: 1 },
    });
  } else {
    message.error('未定义 row.functionCode ');
  }
};

//导出
const downLoadFile = () => {
  console.log(selectedRowKeys.value.length);
  if (!selectedRowKeys.value.length) return message.warning('请勾选需要导出的数据！');
  const serviceIds = selectedRowKeys.value.map(item => item.id);
  getListExport({ serviceIds }).then(res => {
    downloadFile(res, 'VAT服务-资料被驳回.xlsx');
  });
};

//props.searchParams值变化
watch(
  () => props.searchParams,
  newValue => {
    data.params = cloneDeep(newValue);
    getList();
    getOaStatusListFun();
  },
  { deep: true }
);
</script>

<style scoped lang="less">
.export-btn {
  float: right;
  margin-top: 10px;
  padding: 0 16px;
  img {
    width: 14px;
    height: 14px;
    float: left;
    margin: 4px 4px 0 0;
  }
}
.statusList-group {
  margin: 10px 0 20px;
  :deep(.ant-radio-button-wrapper) {
    padding: 2px 24px;
    height: auto;
  }
}
.rejectCount {
  background: #e72014;
  border-radius: 4px 4px 4px 4px;
  font-size: 12px;
  padding: 2px 6px;
  color: #fff;
}
.rejectCount1 {
  background: #d9d9d9;
}
.rejectCount2 {
  background: #52c41a;
}
.rejectCount3 {
  background: #f0b955;
}
</style>
