<template>
  <SearchForm :rule="rule" @submitParams="submitParams"> </SearchForm>

  <DataTable ref="dataTable" :columns="columns" :methodName="getFeedbackList">
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'enterpriseId'">
        <span>{{ enterpriseMap[record.enterpriseId] }}</span>
        <!-- <span v-if="record.enterpriseId === 29">跨税云</span>
        <span v-if="record.enterpriseId === 30">跨标云</span>
        <span v-if="record.enterpriseId === 49">辰知云</span> -->
      </template>
      <template v-if="column.dataIndex === 'screenshot'">
        <!-- <img v-for="item in record.screenshot.split(',')" :key="item" :src="item" style="width: 180px" /> -->
        <div v-for="item in record.screenshot.split(',')" :key="item" class="imgsbox">
          <a-popover trigger="click" :title="null" placement="left">
            <template #content>
              <p><img :src="item" style="width: 380px" /></p>
            </template>
            <img :src="item" class="handimgs" />
          </a-popover>
        </div>
      </template>
      <template v-if="column.dataIndex === 'status'">
        <span v-if="record.status">已处理</span>
        <span v-else>未处理</span>
      </template>
      <template v-if="column.dataIndex === 'operation'">
        <span v-if="record.status">-</span>
        <a-button type="link" @click="operationFeed(record)" v-else :loading="record.handing">标记处理</a-button>
      </template>
    </template>
  </DataTable>
</template>

<script lang="ts" setup>
import { ref, reactive, type Ref } from 'vue';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import { getFeedbackList, feedbackHandle } from '@/api/customerManage/memberConfig';
import { rule, columns } from './config';
import { handleTime } from '@/utils/utils';
import { message } from 'ant-design-vue';

interface SearchType {
  mobile: string;
  functionalModule: string;
  createTimeQuery: Array<string>;
  handlingTimeQuery: Array<string>;
  createStartTime?: string;
  createEndTime?: string;
  handlingStartTime?: string;
  handlingEndTime?: string;
}

const data = reactive<{ searchParams: SearchType }>({
  searchParams: {
    mobile: '',
    functionalModule: '',
    createTimeQuery: [],
    handlingTimeQuery: [],
    createStartTime: '',
    createEndTime: '',
    handlingStartTime: '',
    handlingEndTime: '',
  },
});
const enterpriseMap: any = {
  28: '	辰海云-商标',
  29: '	跨税云',
  30: '	跨标云',
  39: '	财赋优',
  40: '	辰海云-vat',
  42: '	卖旺云',
  45: '	卖旺云',
  47: '	金华麦问',
  48: '	卖旺信息',
  49: '	香港恒盛和',
  50: '	香港恒盛和(国际)',
  52: '	patent-insight(香港)',
};

//点击搜索
const submitParams = (p: SearchType) => {
  data.searchParams = p;
  data.searchParams.createStartTime = handleTime(data.searchParams.createTimeQuery, true);
  data.searchParams.createEndTime = handleTime(data.searchParams.createTimeQuery, false);
  data.searchParams.handlingStartTime = handleTime(data.searchParams.handlingTimeQuery, true);
  data.searchParams.handlingEndTime = handleTime(data.searchParams.handlingTimeQuery, false);

  getList();
};

const dataTable: Ref = ref(null);
//获取列表
const getList = (resetCurrent = true) => {
  dataTable.value.getList(data.searchParams, resetCurrent);
};

interface RecordType {
  adminId: number;
  createTime: string;
  description: string;
  enterpriseId: 30;
  feedbackNo: string;
  functionalModule: string;
  handlingTime: string;
  id: string;
  mobile: string;
  screenshot: string;
  status: boolean;
  title: string;
  updateTime: string;
  userId: string;
  handing?: boolean;
}

const operationFeed = async (item: RecordType) => {
  item.handing = true;
  const res: any = (await feedbackHandle({ id: item.id })) as any;
  console.log(res);
  if (res) {
    message.success('已标记处理');
    getList();
  }
  item.handing = false;
};
</script>

<style>
.imgsbox {
  display: inline-block;
  margin-right: 5px;
}
.handimgs {
  width: 30px;
  cursor: pointer;
  border: 1px solid #dcdcdc;
}
</style>
