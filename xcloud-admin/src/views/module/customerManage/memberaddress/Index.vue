<template>
  <div class="title">
    <SearchForm :rule="rule" @submitParams="submitParams"> </SearchForm>
  </div>

  <DataTable ref="dataTable" :columns="columns" :methodName="findAddressList">
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'defaultFlag'">
        <span v-if="record.defaultFlag === 1">是</span>
        <span v-else>否</span>
      </template>
      <template v-if="column.dataIndex === 'province'">
        {{ record.province }} {{ record.city }} {{ record.region }} {{ record.street }} {{ record.detailAddress }}
      </template>
    </template>
  </DataTable>
</template>

<script lang="ts" setup>
import router from '@/router';
import { ref, reactive, type Ref } from 'vue';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import { rule, columns } from './config';
import { findAddressList } from '@/api/customerManage/memberConfig';

const dataTable: Ref = ref(null);

interface SearchType {
  userMobile: string;
  name: string;
  mobile: string;
}

const data = reactive<{ searchParams: SearchType }>({
  searchParams: {
    userMobile: '',
    name: '',
    mobile: '',
  },
});

const goRuleConfig = () => {
  router.push('/customerManage/memberruleconfig');
};

//点击搜索
const submitParams = (p: SearchType) => {
  data.searchParams = p;
  console.log(data.searchParams);
  getList();
};

//获取列表
const getList = (resetCurrent = true) => {
  dataTable.value.getList(data.searchParams, resetCurrent);
};
</script>

<style lang="less" scoped>
.title {
  margin-bottom: 10px;
  padding: 10px;
  background-color: #fff;
  .top {
    min-height: 45px;
    font-size: 18px;
  }
  .btn {
    float: right;
  }
}
</style>
