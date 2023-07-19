<template>
  <SearchForm :rule="rule" @submitParams="submitParams">
    <template #operationSlot>
      <a-space>
        <a-button v-if="useButton('goods_Center_costcontrol_editFollow')" type="primary" @click="editFollow()">
          修改处理人
        </a-button>
        <a-button v-if="useButton('goods_Center_costcontrol_import')" type="primary" @click="batchImport()">
          批量导入
        </a-button>
      </a-space>
    </template>
  </SearchForm>
  <DataTable
    ref="dataTable"
    :columns="columns"
    :methodName="selectRefundDetailReport"
    :rowSelection="{
        selectedRowKeys: selectedRowKeys,
        onChange: (selectRows:any)=> selectedRowKeys = selectRows
      }"
    @resData="selectedRowKeys = []"
  >
    <template #bodyCell="{ record, column }">
      <template v-if="isCurrentMonth(record.month)">
        <template v-if="column.dataIndex === 'officialFee'">
          <a-input-number
            v-model:value="record.officialFee"
            :min="0"
            :precision="2"
            @focus="focusKeyStr(record, 'officialFee')"
            @blur="submitKeyStr(record, 'officialFee')"
          />
        </template>
        <template v-if="column.dataIndex === 'officialFeeCurrency'">
          <a-select
            v-model:value="record.officialFeeCurrency"
            style="width: 100%"
            @change="submitKeyStr(record, 'officialFeeCurrency')"
          >
            <a-select-option v-for="(li, index) of data.feeTypeList" :key="index" :value="li.code">
              {{ li.name }}
            </a-select-option>
          </a-select>
        </template>
        <template v-if="column.dataIndex === 'thirdServiceFee'">
          <a-input-number
            v-model:value="record.thirdServiceFee"
            :min="0"
            :precision="2"
            @focus="focusKeyStr(record, 'thirdServiceFee')"
            @blur="submitKeyStr(record, 'thirdServiceFee')"
          />
        </template>
        <template v-if="column.dataIndex === 'thirdServiceFeeCurrency'">
          <a-select
            v-model:value="record.thirdServiceFeeCurrency"
            style="width: 100%"
            @change="submitKeyStr(record, 'thirdServiceFeeCurrency')"
          >
            <a-select-option v-for="(li, index) of data.feeTypeList" :key="index" :value="li.code">
              {{ li.name }}
            </a-select-option>
          </a-select>
        </template>
      </template>
      <template v-if="column.dataIndex === 'month'">
        {{ record.month ? record.month.split('-')[0] + '-' + record.month.split('-')[1] : '' }}
      </template>
      <template v-if="column.dataIndex === 'belongerList'">
        {{ record.belongerList ? record.belongerList.join('，') : '' }}
      </template>

      <template v-if="column.dataIndex === 'operation'">
        <a-button type="text" @click="historyRecord(record)">历史记录</a-button>
      </template>
    </template>
  </DataTable>
  <EditFollowModal ref="editFollowModal" :selectedRowKeys="selectedRowKeys" @submit="getList(false)" />
  <BatchImportModal ref="batchImportModal" :record="data.record" />
</template>

<script setup lang="ts">
import { ref, reactive, type Ref, onMounted } from 'vue';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import { rule, columns } from './config';
import { useButton, jumpPage } from '@/utils/utils';
import { selectRefundDetailReport, updateBusinessConfig, getFeeTypeList } from '@/api/goodsCenter/costcontrol';
import EditFollowModal from './components/EditFollowModal.vue';
import BatchImportModal from './components/BatchImportModal.vue';
import { message } from 'ant-design-vue';

const dataTable: Ref = ref(null);
const data: any = reactive({
  feeTypeList: [],
  params: {},
  record: {},
});
const selectedRowKeys = ref([]);

onMounted(() => {
  getFeeTypeListFun();
});

//点击搜索
const submitParams = (p: object) => {
  data.params = p;
  if (data.params.productCategoryIdList) {
    data.params.productCategoryIdList = data.params.productCategoryIdList.params;
  }
  getList();
};

//获取列表
const getList = (resetCurrent = true) => {
  selectedRowKeys.value = [];
  dataTable.value.getList(data.params, resetCurrent);
};

//修改处理人
const editFollowModal: Ref = ref(null);
const editFollow = () => {
  if (selectedRowKeys.value.length === 0) {
    message.error('请选择');
    return false;
  }
  editFollowModal.value.showModal = true;
};

//批量导入
const batchImportModal: Ref = ref(null);
const batchImport = () => {
  batchImportModal.value.showModal = true;
};

//历史记录
const historyRecord = (record: any) => {
  jumpPage('/goodsCenter/costcontrol/historyRecord?title=成本管理-历史记录&id=' + record.businessCostId);
};

//获取焦点
const focusKeyStr = (record: any, keyStr: string) => {
  record.copyValue = record[keyStr];
};

//修改字段值
const submitKeyStr = (record: any, keyStr: string) => {
  if (record.copyValue !== record[keyStr]) {
    const params = {
      businessCostId: record.businessCostId,
      [keyStr]: record[keyStr],
    };
    updateBusinessConfig(params).then((res: any) => {
      message.success('操作成功');
    });
  }
};

//是否当前月
const isCurrentMonth = (month: string) => {
  let flag = false;
  if (month) {
    const date = new Date();
    const d = date.getFullYear() + '-' + (date.getMonth() + 1) + '-01 00:00:00';
    flag = !dayjs(month).isBefore(dayjs(d));
  }
  return flag;
};

//获取币种下拉列表
const getFeeTypeListFun = () => {
  getFeeTypeList().then((res: any) => {
    data.feeTypeList = res || [];
  });
};
</script>

<style scoped lang="less"></style>
