<template>
  <a-modal title="批量导入" width="1000px" v-model:visible="showModal" :maskClosable="false" :keyboard="false">
    <div class="wrap">
      <a-tabs v-model:activeKey="activeKey" @change="changeTags">
        <a-tab-pane :key="1" tab="批量导入">
          <div class="temp">
            <p class="text">请按照数据模板的格式准备要导入的数据</p>
            <a-button type="primary" class="btn" @click="downLoadTemplate()">下载数据模板</a-button>
            <p class="temp-tips">注意事项：</p>
            <p class="temp-tips">1、模板中的表头名称不可更改，表头行不可删除</p>
            <p class="temp-tips">2、无成本请填0，币种不能为空</p>
            <p class="temp-tips">2、请勿上传加密文件</p>
          </div>
          <div class="upload-wrap">
            <p class="text">上传文件</p>
            <div class="upload-content">
              <a-upload-dragger
                v-model:fileList="fileInfo.fileList"
                accept=".xls,.xlsx"
                :action="fileInfo.actionUrl"
                :maxCount="1"
                @change="handleChange"
              >
                <div class="text-tips">支持扩展名：xls或xlsx</div>
              </a-upload-dragger>
            </div>

            <div class="file-name">
              <span :href="fileInfo.fileUrl === '' ? 'javascript:void(0)' : fileInfo.fileUrl">
                {{ fileInfo.origFileName || '请上传文件...' }}
              </span>
              <a-button v-if="fileInfo.fileUrl" type="link" @click="deleteFIle()"> 删除 </a-button>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane :key="2" tab="导入日志">
          <DataTable ref="dataTable" :columns="columns" :methodName="queryExportLog" :mainTable="false">
            <template #bodyCell="{ record, column }">
              <template v-if="column.dataIndex === 'dataStatus'">
                <span v-if="record.dataStatus === 'FINISH'">完成</span>
                <span v-else-if="record.dataStatus === 'ARTLYCOMPLETED'">部分完成</span>
                <span v-else-if="record.dataStatus === 'FAIL'">失败</span>
                <span v-else-if="record.dataStatus === 'UNFINISHED'">未完成</span>
              </template>
              <template v-if="column.dataIndex === 'operation'">
                <a-button :disabled="record.newAddress === ''" type="link" @click="downloadRecordFun(record)">
                  下载
                </a-button>
              </template>
            </template>
          </DataTable>
        </a-tab-pane>
      </a-tabs>
    </div>

    <template #footer>
      <a-button @click="showModal = false">取消</a-button>
      <a-button type="primary" v-if="activeKey === 1" :disabled="fileInfo.fileUrl === ''" @click="submit()">
        确定
      </a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref, watch, type Ref } from 'vue';
import { message } from 'ant-design-vue';
import DataTable from '@/components/page/DataTable.vue';
import { submitExportLog, queryExportLog, verificationTemplateDownload } from '@/api/goodsCenter/costcontrol';
import { downloadFile } from '@/utils/utils';

defineProps({
  record: {
    default: () => null,
    type: Object,
  },
});

const showModal = ref(false);
const activeKey = ref(1);
const fileInfo = reactive({
  actionUrl: import.meta.env.VITE_APP_API + '/file/oss/upload',
  fileList: [],
  origFileName: '',
  fileUrl: '',
});
const columns = ref([
  {
    title: '提交人',
    dataIndex: 'createUserName',
    width: 100,
  },
  {
    title: '开始时间',
    dataIndex: 'createTime',
    width: 140,
  },
  {
    title: '状态',
    dataIndex: 'dataStatus',
    width: 80,
  },
  {
    title: '已导入记录',
    dataIndex: 'successfulRecord',
    width: 80,
  },
  {
    title: '已失败记录',
    dataIndex: 'failureRecord',
    width: 80,
  },
  {
    title: '详情',
    dataIndex: 'operation',
    width: 80,
  },
]);

watch(showModal, newVal => {
  if (newVal) {
    deleteFIle();
    changeTags(1);
  }
});

//切换tags
const changeTags = (index: number) => {
  activeKey.value = index;
  if (index === 2) {
    nextTick(() => {
      getList();
    });
  }
};

//获取下载列表
const dataTable: Ref = ref(null);
const getList = () => {
  dataTable.value.getList({});
};

//单个下载
const downloadRecordFun = (record: { newAddress: string }) => {
  window.open(record.newAddress);
};

//提交
const submit = () => {
  submitExportLog({
    filePath: fileInfo.fileUrl,
  }).then(() => {
    message.success('操作成功');
    deleteFIle();
    changeTags(2);
  });
};

//下载模板
const downLoadTemplate = () => {
  verificationTemplateDownload().then((res: any) => {
    downloadFile(res, '模板文件.xlsx');
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

//删除上传文件
const deleteFIle = () => {
  fileInfo.fileList = [];
  fileInfo.origFileName = '';
  fileInfo.fileUrl = '';
};

//暴露方法
defineExpose({ showModal });
</script>

<style scoped lang="less">
.wrap {
  max-height: 60vh;
  overflow-y: auto;
  padding: 0 20px;
  .temp {
    .text {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .btn {
      margin-bottom: 10px;
    }
    .temp-tips {
      font-size: 14px;
      color: #666;
      margin: 0;
      line-height: 22px;
    }
  }
  .upload-wrap {
    margin-top: 20px;
    .text {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .upload-content {
      width: 500px;
      height: 80px;
      margin-bottom: 10px;
      overflow: hidden;
      .text-tips {
        line-height: 40px;
      }
    }
    .file-name {
      font-size: 16px;
    }
  }
}
</style>
