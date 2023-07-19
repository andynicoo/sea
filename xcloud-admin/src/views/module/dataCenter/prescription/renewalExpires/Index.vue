<template>
  <SearchForm :rule="rule" @submitParams="submitParams">
    <template #operationSlot>
      <a-space>
        <a-button
          v-if="useButton('xcloudplat_dataCenter_renewalExpires_tips')"
          type="danger"
          class="bg-yellow"
          @click="showTipsRemark()"
        >
          注意事项
        </a-button>
        <a-button
          v-if="useButton('xcloudplat_dataCenter_renewalExpires_export')"
          type="danger"
          @click="downLoadFileFun()"
        >
          导出
        </a-button>
      </a-space>
    </template>
  </SearchForm>
  <DataTable ref="dataTable" :columns="columns" :methodName="getRenewalAlarmList">
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'userMobile'">
        <span v-hidden>{{ record.userMobile }}</span>
      </template>
      <template v-if="column.dataIndex === 'taxEffectiveDate'">
        {{ record.taxEffectiveDate || '--' }}
      </template>
      <template v-if="column.dataIndex === 'expirationTime'">
        {{ record.expirationTime || '--' }}
      </template>
      <template v-if="column.dataIndex === 'renewalDate'">
        {{ record.renewalDate || '--' }}
      </template>
      <template v-if="column.dataIndex === 'renewalStatus'">
        <span v-if="record.renewalStatus === 'OverdueNotRenewal'">过期未续费</span>
        <span v-else-if="record.renewalStatus === 'ContinuedFee'">待续费</span>
        <span v-else-if="record.renewalStatus === 'HaveRenewal'">已续费</span>
      </template>
      <template v-if="column.dataIndex === 'status'">
        <template v-if="record.parentProductCategoryName === 'VAT服务'">
          <span v-if="record.status === 0">未购买</span>
          <span v-else-if="record.status === 1">正常（服务中）</span>
          <span v-else-if="record.status === 2">待续费</span>
          <span v-else-if="record.status === 3">税号注销</span>
          <span v-else-if="record.status === 4">已转出</span>
          <span v-else-if="record.status === 9">已取消</span>
          <span v-else-if="record.status === 10">封存</span>
          <span v-else-if="record.status === 11">取消中</span>
          <span v-else-if="record.status === 12">已续费</span>
          <span v-else-if="record.status === 13">确认转出</span>
        </template>
        <template v-else>
          <span>-</span>
        </template>
      </template>
      <template v-if="column.dataIndex === 'followUpRecord'">
        <a-textarea
          show-count
          :maxlength="20"
          v-if="record.editFlag"
          v-model:value="record.followUpRecord"
          @blur="editFollowUpRecord(record)"
        />
        <span v-else>
          {{ record.followUpRecord || '-' }} <EditOutlined class="edit-icon" @click="record.editFlag = true" />
        </span>
      </template>
      <template v-if="column.dataIndex === 'remake'">
        <a-select
          v-model:value="record.remake"
          placeholder="请选择"
          style="width: 160px"
          @change="changeRemark($event, record)"
        >
          <a-select-option value="CustomerWriteOff"> 客户已注销 </a-select-option>
          <a-select-option value="CustomerTransferAgent"> 客户转代理 </a-select-option>
          <a-select-option value="CustomerStoreClosed"> 客户店铺关闭 </a-select-option>
          <a-select-option value="ProductPricesTooExpensive"> 产品价格太贵 </a-select-option>
          <a-select-option value="CompanyServiceisNotGood"> 公司服务不行 </a-select-option>
          <a-select-option value="CustomerRenewed"> 客户已在中台续费 </a-select-option>
          <a-select-option value="Empty"> 空 </a-select-option>
        </a-select>
      </template>
    </template>
  </DataTable>
  <TipsRemark ref="tipsRemark" />
</template>

<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import { rule, columns } from './config';
import {
  getRenewalAlarmList,
  updateRenewalAlarmRemark,
  editFollowUpRecordById,
  renewalAlarmExport,
} from '@/api/dataCenter/renewalExpires';
import { message } from 'ant-design-vue';
import { downloadFile, useButton } from '@/utils/utils';
import TipsRemark from './components/TipsRemark.vue';
import { EditOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';

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
  if (data.params.departmentIdList) {
    data.params.departmentIdList = data.params.departmentIdList.params;
  }
  if (data.params.expirationTimeList && data.params.expirationTimeList.length === 2) {
    data.params.expirationTimeList = [
      data.params.expirationTimeList[0].split(' ')[0] + ' 00:00:00',
      data.params.expirationTimeList[1].split(' ')[0] + ' 23:59:59',
    ];
  }
  if (data.params.taxEffectiveDateList && data.params.taxEffectiveDateList.length === 2) {
    data.params.taxEffectiveDateList = [
      data.params.taxEffectiveDateList[0].split(' ')[0] + ' 00:00:00',
      data.params.taxEffectiveDateList[1].split(' ')[0] + ' 23:59:59',
    ];
  }
  if (data.params.renewalDateList && data.params.renewalDateList.length === 2) {
    data.params.renewalDateList = [
      data.params.renewalDateList[0].split(' ')[0] + ' 00:00:00',
      data.params.renewalDateList[1].split(' ')[0] + ' 23:59:59',
    ];
  }
  if (data.params.customerDepartmentIds) {
    data.params.customerDepartmentIds = data.params.customerDepartmentIds.params;
  }
  if (data.params.productCategoryIds) {
    data.params.productCategoryIds = data.params.productCategoryIds.params;
  }

  dataTable.value.getList(data.params, resetCurrent);
};

//注意事项
const tipsRemark: Ref = ref(null);
const showTipsRemark = () => {
  tipsRemark.value.showModal = true;
};

//修改跟进情况
const editFollowUpRecord = (record: any) => {
  editFollowUpRecordById({
    followUpRecord: record.followUpRecord,
    id: record.renewalAlarmId,
  }).then((res: any) => {
    message.success('操作成功');
    // record.editFlag = false;
    getList(false);
  });
};

//改变备注
const changeRemark = (val: any, record: any) => {
  updateRenewalAlarmRemark({
    renewalAlarmId: record.renewalAlarmId,
    remake: val,
  }).then((res: any) => {
    message.success('操作成功');
    getList(false);
  });
};

//导出
const downLoadFileFun = () => {
  renewalAlarmExport(data.params).then((res: any) => {
    downloadFile(res, '续费预警报表' + dayjs().format('YYYYMMDDHHmmss') + '.xlsx');
  });
};
</script>

<style scoped lang="less">
.edit-icon {
  cursor: pointer;
}
</style>
