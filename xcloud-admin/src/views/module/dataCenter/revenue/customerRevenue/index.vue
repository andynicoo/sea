<template>
  <SearchForm :rule="rule" @submitParams="submitParams" :searchOpen="true" />
  <a-row :gutter="10">
    <a-col :span="12">
      <TotalDealsCompare ref="totalDealsCompare" :params="data.params" @getCompanyInfo="getCompanyInfo" />
    </a-col>
    <a-col :span="12">
      <div class="cell-wrapper">
        <div class="cell-title">
          <span>商品金额</span>
          <span class="tips-icon">
            <a-tooltip placement="top">
              <template #title>
                <div style="font-size: 12px">默认根据商品总计（已到账）倒序排序</div>
              </template>
              <ExclamationCircleFilled style="color: #f0b955" />
            </a-tooltip>
          </span>
        </div>
        <DataTable ref="dataTable" :columns="columns" :otherHeight="56" :methodName="productPaymentAmount">
          <template #bodyCell="{ record, column }">
            <template v-if="column.dataIndex === 'operation'">
              <a-button type="link" size="small" @click="detail(record)" title="查看"> 查看 </a-button>
            </template>
          </template>
        </DataTable>
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { ref, reactive, type Ref, nextTick } from 'vue';
import { ExclamationCircleFilled } from '@ant-design/icons-vue';
import { jumpPage, useButton } from '@/utils/utils';
import SearchForm from '@/components/page/SearchForm.vue';
import { rule, columns } from './config';
import TotalDealsCompare from './components/echartBox/TotalDealsCompare.vue';
import { productPaymentAmount } from '@/api/dataCenter/customerRevenue';

const data: any = reactive({
  params: {},
  company: {},
});
const dataTable: Ref = ref(null);
const totalDealsCompare: Ref = ref(null);

const emit = defineEmits(['detail']);

//点击搜索
const submitParams = (p: object) => {
  data.params = p;
  nextTick(() => {
    getList();
  });
};

//获取数据
const getList = (resetCurrent = true) => {
  totalDealsCompare.value.getList(resetCurrent);
  dataTable.value.getList(data.params, resetCurrent);
};

// 获取单个公司列表数据
const getCompanyInfo = (company: any) => {
  data.company = company;
  dataTable.value.getList(
    {
      ...data.params,
      companyName: company.companyName,
    },
    true
  );
};

// 查看详情
const detail = (record: any) => {
  jumpPage(`/dataCenter/revenue/customerRevenue/salesDetail?companyName=${record.companyName}`);
};
</script>

<style scoped lang="less">
.cell-wrapper {
  background-color: #fff;
  padding: 0 20px;
  .cell-title {
    height: 56px;
    line-height: 56px;
    color: #000;
    font-size: 14px;
    font-weight: 400;

    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    .tips-icon {
      margin-left: 12px;
      cursor: pointer;
    }
    .more-btn {
      float: right;
    }
    .select-wrap {
      float: right;
      margin-right: 24px;
    }
  }
  .table-wrap {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
