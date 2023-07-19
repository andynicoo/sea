<template>
  <SearchForm
    ref="searchForm"
    :rule="['', rule, ruleBatch, rule3][activeKey]"
    :searchOpen="activeKey === 3"
    :initSearch="activeKey !== 3"
    @submitParams="submitParams"
  >
    <template #topSlot>
      <a-tabs v-model:activeKey="activeKey" class="tabs-wrap">
        <a-tab-pane :key="1" tab="单个核名" />
        <a-tab-pane :key="2" tab="批量核名">
          <div v-if="useButton('workOrder_intellectualProperty_trademarkName_download_template')" class="file-template">
            温馨提示：点击下载
            <a @click="downLoadTemplate()">「批量核名模板」</a>
            模板，需上传符合要求的文件，然后点击查询即可
          </div>
          <div class="upload-wrap">
            <div class="upload-content">
              <a-upload-dragger
                v-model:fileList="fileInfo.fileList"
                accept=".xls,.xlsx"
                :action="fileInfo.actionUrl"
                :maxCount="1"
                @change="handleChange"
              >
                <div class="icon">
                  <InboxOutlined />
                </div>
                <div class="text">
                  <span>上传文件</span>
                  <span class="text-tips">支持扩展名：xls或xlsx</span>
                </div>
              </a-upload-dragger>
            </div>
            <a-button class="btn-search" type="primary" :disabled="fileInfo.fileUrl === ''" @click="searchFileSubmit()">
              查询
            </a-button>
          </div>
          <div class="file-wrap">
            <span :href="fileInfo.fileUrl === '' ? 'javascript:void(0)' : fileInfo.fileUrl">
              {{ fileInfo.origFileName || '请上传文件...' }}
            </span>
            <a-button v-if="fileInfo.fileUrl" type="link" @click="deleteFIle()"> 删除 </a-button>
          </div>
        </a-tab-pane>
        <a-tab-pane :key="3" tab="核名2.0"> </a-tab-pane>
      </a-tabs>
    </template>
    <template #operationSlot>
      <a-space>
        <a-button
          v-if="activeKey === 2 && useButton('workOrder_intellectualProperty_trademarkName_download_batch')"
          type="danger"
          :disabled="selectedRowKeys.length === 0"
          @click="downLoadBatch()"
        >
          批量下载
        </a-button>
      </a-space>
    </template>
  </SearchForm>
  <KeepAlive>
    <DataTable v-if="activeKey === 1" ref="dataTable" :columns="columns" :methodName="selectTrademarkCheckList">
      <template #bodyCell="{ record, column }">
        <template v-if="column.dataIndex === 'createUserName'"> {{ record.createUserName || '-' }} </template>
        <template v-if="column.dataIndex === 'queryCategory'">
          {{ record.queryCategory }} <span v-if="record.queryCategory">类</span>
        </template>
        <template v-if="column.dataIndex === 'approximateTrademark'"> {{ record.queryCategory || '-' }} </template>
        <template v-if="column.dataIndex === 'correspondingCountryName'">
          {{ record.correspondingCountryName || '-' }}
        </template>
        <template v-if="column.dataIndex === 'correspondingCategory'">
          {{ record.correspondingCategory || '-' }} <span v-if="record.correspondingCategory">类</span>
        </template>
        <template v-if="column.dataIndex === 'trademarkStatus'"> {{ record.trademarkStatus || '-' }} </template>
        <template v-if="column.dataIndex === 'applyTime'"> {{ record.applyTime || '-' }} </template>
      </template>
    </DataTable>
    <DataTable
      v-else-if="activeKey === 2"
      ref="dataTable"
      :columns="columnsBatch"
      :methodName="selectTrademarkBatchList"
      rowKey="trademarkBatchCheckId"
      :rowSelection="{
        selectedRowKeys: selectedRowKeys,
        onChange: (selectRows:any)=> selectedRowKeys = selectRows
      }"
      :initSearch="true"
    >
      <template #bodyCell="{ record, column }">
        <template v-if="column.dataIndex === 'operation'">
          <template v-if="record.operationStatus === 'FIGUREOUT'">
            <a-button
              v-if="useButton('workOrder_intellectualProperty_trademarkName_download')"
              type="link"
              @click="downLoadRecord(record)"
            >
              下载
            </a-button>
          </template>
          <a-button v-else type="text">正在查询</a-button>
        </template>
      </template>
    </DataTable>
    <TabThree v-else :data="tab3Data" :title="tab3title" :loading="tab3Loading"></TabThree>
  </KeepAlive>
</template>

<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import TabThree from './components/TabThree.vue';
import { rule, ruleBatch, rule3, columns, columnsBatch } from './config';
import {
  selectTrademarkCheckList,
  selectTrademarkBatchList,
  batchCheckTrademark,
  downloadTemplate,
  batchCheckTrademarkDownload,
  downloadRecord,
  queryTrademarkName,
} from '@/api/workOrder/intellectualProperty/trademarkName';
import type { QueryTrademarkNameParams, QueryTrademarkNameRes } from '@/api/workOrder/intellectualProperty/type';
import { message } from 'ant-design-vue';
import { InboxOutlined } from '@ant-design/icons-vue';
import { useButton } from '@/utils/utils';
import { downloadFile } from '@/utils/utils';

const searchForm: Ref = ref(null);
const dataTable: Ref = ref(null);
const data: any = reactive({
  params: {},
  record: {},
});
const activeKey = ref(3);
const fileInfo = reactive({
  actionUrl: import.meta.env.VITE_APP_API + '/file/oss/upload',
  fileList: [],
  origFileName: '',
  fileUrl: '',
});
const selectedRowKeys = ref([]);

// 核名2.0
const tab3Data = reactive<QueryTrademarkNameRes>({
  tbTrademarkCustomWordsList: [],
  trademarkSearchCheckResultList: [],
  trademarkSearchCheckCategortyName: '',
});
const tab3title = ref('');
const tab3Loading = ref(false);

//点击搜索
const submitParams = async (p: object) => {
  data.params = p;
  if (activeKey.value === 3) {
    tab3Loading.value = true;
    const res = await queryTrademarkName(p as QueryTrademarkNameParams);
    tab3Loading.value = false;
    tab3title.value = res.trademarkSearchCheckCategortyName as string;
    tab3Data.tbTrademarkCustomWordsList = res.tbTrademarkCustomWordsList;
    tab3Data.trademarkSearchCheckResultList = res.trademarkSearchCheckResultList;
  } else {
    getList();
  }
};

//获取列表
const getList = (resetCurrent = true) => {
  if (data.params.createTimeList && data.params.createTimeList.length === 2) {
    data.params.createTimeList = [
      data.params.createTimeList[0].split(' ')[0] + ' 00:00:00',
      data.params.createTimeList[1].split(' ')[0] + ' 23:59:59',
    ];
  }
  if (data.params.successfulTime && data.params.successfulTime.length === 2) {
    data.params.successfulTime = [
      data.params.successfulTime[0].split(' ')[0] + ' 00:00:00',
      data.params.successfulTime[1].split(' ')[0] + ' 23:59:59',
    ];
  }
  selectedRowKeys.value = [];
  dataTable.value.getList(data.params, resetCurrent);
};

//点击查询核名
const searchFileSubmit = () => {
  batchCheckTrademark({
    filepath: fileInfo.fileUrl,
  }).then((res: any) => {
    deleteFIle();
    getList();
  });
};

//删除上传文件
const deleteFIle = () => {
  fileInfo.fileList = [];
  fileInfo.origFileName = '';
  fileInfo.fileUrl = '';
};

//下载模板
const downLoadTemplate = () => {
  downloadTemplate({}).then((res: any) => {
    downloadFile(res, '模板文件.xlsx');
  });
};

//批量下载
const downLoadBatch = () => {
  batchCheckTrademarkDownload(selectedRowKeys.value).then((res: any) => {
    downloadFile(res, '批量下载文件.zip');
  });
};

//单条下载
const downLoadRecord = (record: any) => {
  downloadRecord({
    path: record.fileAddress,
  }).then((res: any) => {
    downloadFile(res, (record.fileName || '下载文件') + '.xlsx');
  });
};

//上传
const handleChange = (file: any) => {
  if (file.file.status == 'done') {
    const res = file.file.response;
    if (res.code == 0) {
      fileInfo.fileList = [];
      fileInfo.origFileName = res.data.origFileName || '';
      fileInfo.fileUrl = res.data.fileUrl || '';
    } else {
      message.error('上传失败');
    }
  }
};
</script>

<style scoped lang="less">
.tabs-wrap {
  margin: 0 20px;
  .file-template {
    line-height: 30px;
  }
  .upload-wrap {
    width: 1000px;
    height: 115px;
    overflow: hidden;
    .upload-content {
      width: 700px;
      height: 115px;
      float: left;
      .icon {
        font-size: 36px;
        height: 57px;
      }
      .text {
        font-size: 16px;
        .text-tips {
          margin-left: 15px;
          font-size: 14px;
          color: #666;
        }
      }
    }
    .btn-search {
      float: left;
      margin: 75px 30px 15px;
    }
  }
  .file-wrap {
    line-height: 30px;
    margin-top: 5px;
    font-size: 15px;
  }
}
</style>
