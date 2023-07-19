<template>
  <SearchForm :rule="rule" @submitParams="submitParams">
    <template #operationSlot>
      <a-button
        v-if="useButton('xcloudplat_customerManage_CustomerCenter_editCustomerBusiness')"
        type="primary"
        @click="editCustomerBusiness()"
      >
        批量修改客户成功
      </a-button>
      <a-button
        v-if="useButton('xcloudplat_customerManage_CustomerCenter_editOneId')"
        type="primary"
        @click="editOneId()"
      >
        修改ID标识
      </a-button>
    </template>
  </SearchForm>
  <DataTable
    ref="dataTable"
    :columns="columns"
    :methodName="getCustomerCenterList"
    :rowSelection="{
        selectedRowKeys: selectedRowKeys,
        onChange: (selectRows:any)=> selectedRowKeys = selectRows
      }"
    @resData="selectedRowKeys = []"
  >
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'unionId'">
        <span>{{ record.unionId || '-' }}</span>
      </template>
      <template v-if="column.dataIndex === 'mobile'">
        <span v-hidden>{{ record.mobile }}</span>
      </template>
      <template v-if="column.dataIndex === 'city'">
        <template v-if="record.attributionPlaceProvince && record.attributionPlaceProvince !== '空'">
          {{ record.attributionPlaceProvince }}
          <template v-if="record.attributionPlaceCity"> - {{ record.attributionPlaceCity }}</template>
        </template>
        <template v-else> 无 </template>
      </template>
      <template v-if="column.dataIndex === 'level'">
        <span v-if="record.level === 1">SMB客户</span>
        <span v-else-if="record.level === 2">KA客户</span>
        <span v-else-if="record.level === 3">品牌客户</span>
        <span v-else-if="record.level === 4">渠道客户</span>
      </template>
      <template v-if="column.dataIndex === 'followUserName'">
        <span v-if="record.followUserName">
          {{ record.followUserName.substring(0, record.followUserName.length - 1) }}
        </span>
      </template>
      <template v-if="column.dataIndex === 'followUserDepName'">
        <span v-if="record.followUserDepName">
          {{ record.followUserDepName.substring(0, record.followUserDepName.length - 1) }}
        </span>
      </template>
      <template v-if="column.dataIndex === 'customerSuccessList'">
        <div class="details-list">
          <div class="details-li" v-for="(li, index) of record.customerSuccessList || []" :key="index">
            <span v-if="li.customerBusinessType === 'VAT'">VAT ：</span>
            <span v-else-if="li.customerBusinessType === 'EPR'">EPR ：</span>
            <span v-else-if="li.customerBusinessType === 'IIPTO'">商标 ：</span>
            <span> {{ li.customerSuccessName || '-' }}</span>
          </div>
        </div>
      </template>
      <template v-if="column.dataIndex === 'details'">
        <div class="details-list">
          <div class="details-li" v-for="(li, index) of record.details || []" :key="index">
            <span> {{ li.brandName || '-' }} </span>
            <span>（{{ li.orderCount || 0 }} 单）: </span>
            <span> {{ li.orderSumAmount || 0 }}</span>
          </div>
        </div>
      </template>
      <template v-if="column.dataIndex === 'custStatus'">
        <span v-if="record.custStatus === 0">提升期</span>
        <span v-else-if="record.custStatus === 1">维护期</span>
        <span v-else-if="record.custStatus === 2">衰退期</span>
        <span v-else-if="record.custStatus === 3">流失期</span>
        <span v-else>-</span>
      </template>
      <template v-if="column.dataIndex === 'operation'">
        <FileSearchOutlined style="color: #1890ff; margin-left: 10px" @click="goDetailsPage(record)" />
      </template>
    </template>
  </DataTable>
  <EditCustomerBusinessModal
    ref="editCustomerBusinessModal"
    :selectedRowKeys="selectedRowKeys"
    @submit="getList(false)"
  />

  <EditOneIdModal ref="editOneIdModal" :selectedRowKeys="selectedRowKeys" @submit="getList(false)" />
</template>

<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import { rule, columns } from './config';
import { FileSearchOutlined } from '@ant-design/icons-vue';
import { getCustomerCenterList } from '@/api/customerManage/customerCenter';
import { jumpPage, useButton } from '@/utils/utils';
import EditCustomerBusinessModal from './components/EditCustomerBusinessModal.vue';
import EditOneIdModal from './components/EditOneIdModal.vue';
import { message } from 'ant-design-vue';

const selectedRowKeys = ref([]);
const dataTable: Ref = ref(null);
const data: any = reactive({
  params: {},
  record: {},
});

//点击搜索
const submitParams = (p: object) => {
  data.params = p;
  if (data.params?.city?.params?.attributionPlaceProvinceList.length) {
    const { attributionPlaceProvinceList, attributionPlaceCityList } = data.params.city.params;
    data.params.attributionPlaceProvinceList = attributionPlaceProvinceList;
    data.params.attributionPlaceCityList = attributionPlaceCityList;
    data.params.city = undefined;
  } else {
    data.params.city = undefined;
  }
  if (data.params.followDepIds) {
    data.params.followDepIds = data.params.followDepIds.params;
  }
  if (data.params.orderTime && data.params.orderTime.length === 2) {
    data.params.orderTime = [
      data.params.orderTime[0].split(' ')[0] + ' 00:00:00',
      data.params.orderTime[1].split(' ')[0] + ' 23:59:59',
    ];
  }
  if (data.params.orderCount) {
    data.params.startOrderCount = data.params.orderCount.start;
    data.params.endOrderCount = data.params.orderCount.end;
    data.params.orderCount = undefined;
  }
  if (data.params.dealAmount) {
    data.params.brandSumAmountMix = data.params.dealAmount.start;
    data.params.brandSumAmountMax = data.params.dealAmount.end;
    data.params.dealAmount = undefined;
  }
  if (data.params.yearSumAmount) {
    data.params.yearSumAmountMix = data.params.yearSumAmount.start;
    data.params.yearSumAmountMax = data.params.yearSumAmount.end;
    data.params.yearSumAmount = undefined;
  }

  getList();
};

//获取列表
const getList = (resetCurrent = true) => {
  selectedRowKeys.value = [];
  dataTable.value.getList(data.params, resetCurrent);
};

//客户成功编辑人员
const editCustomerBusinessModal: Ref = ref(null);
const editCustomerBusiness = () => {
  if (selectedRowKeys.value.length === 0) {
    message.error('请选择客户');
    return false;
  }
  editCustomerBusinessModal.value.showModal = true;
};

//编辑OneID
const editOneIdModal: Ref = ref(null);
const editOneId = () => {
  if (selectedRowKeys.value.length === 0) {
    message.error('请选择客户');
    return false;
  }
  editOneIdModal.value.showModal = true;
};

//详情
const goDetailsPage = (record: any) => {
  jumpPage(
    '/customerManage/customerCenter/Details?id=' +
      record.customerId +
      '&mobile=' +
      record.mobile +
      '&userId=' +
      record.userId
  );
};
</script>

<style scoped lang="less">
.details-list {
  .details-li {
    padding: 5px 0;
    border-bottom: 1px solid #f0f0f0;
  }
  .details-li:last-child {
    border-bottom: 0;
  }
}
</style>
