<template>
  <SearchForm :rule="rule" @submitParams="submitParams">
    <template #operationSlot>
      <a-button type="primary" @click="goRuleConfig" v-if="useButton('xcloudplat_customerManage_Member_add')"
        >积分规则设置</a-button
      >
    </template>
  </SearchForm>

  <DataTable ref="dataTable" :columns="columns" :methodName="getMemberList">
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'changeType'">
        <!-- <a-tag color="success" v-if="record.changeType === 1">收入</a-tag>
        <a-tag color="processing" v-if="record.changeType === 2">支出</a-tag>
        <a-tag color="error" v-if="record.changeType === 3">退回</a-tag> -->
        <span style="color: red" v-if="record.changeType === 2"
          >{{ record.changeTypeDes }} {{ record.changeIntegral }}</span
        >
        <span style="color: green" v-else>{{ record.changeTypeDes }} +{{ record.changeIntegral }}</span>
      </template>
    </template>
  </DataTable>

  <RuleConfig ref="ruleConfig" />
</template>

<script lang="ts" setup>
import { ref, reactive, type Ref } from 'vue';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import { rule, columns } from './config';
import { getMemberList } from '@/api/customerManage/memberConfig';
import RuleConfig from './RuleConfig.vue';
import { useButton } from '@/utils/utils';

const dataTable: Ref = ref(null);
const ruleConfig: Ref = ref(null);

interface SearchType {
  userMobile: string;
  createTimeQuery: Array<string>;
  changeTypeEnum: string;
}

const data = reactive<{ searchParams: SearchType }>({
  searchParams: {
    userMobile: '',
    createTimeQuery: [],
    changeTypeEnum: '',
  },
});

const goRuleConfig = () => {
  ruleConfig.value.visible = true;
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
