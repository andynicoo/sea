<template>
  <div class="cell-wrap">
    <div class="cell-table">
      <a-table
        :dataSource="fileList"
        bordered
        :pagination="false"
        :locale="{ emptyText: '暂无文件，请先上传后再查看' }"
      >
        <a-table-column width="60px" title="序号" #default="{ index }">
          {{ index + 1 }}
        </a-table-column>
        <a-table-column width="180px" title="官方原文" #default="{ record }">
          <FileLink :style="{ maxWidth: '260px' }" :fileUrl="record.fileUrl" />
        </a-table-column>
        <a-table-column width="180px" title="官方翻译件" #default="{ record }">
          <FileLink :style="{ maxWidth: '260px' }" :fileUrl="record.translateFileUrl" />
        </a-table-column>
        <a-table-column width="150px" title="文件类型" data-index="fileRemark"> </a-table-column>
        <a-table-column width="150px" title="官方下发日期" #default="{ record }">
          <div>{{ (record.officeDate || '').slice(0, 10) }}</div>
          <div>{{ (record.officialExpirationDate || '').slice(0, 10) }}</div>
        </a-table-column>
        <a-table-column width="150px" title="客户截止日期" #default="{ record }">
          <div>{{ (record.lastDealDate || '').slice(0, 10) || '无' }}</div>
          <div class="table-tip" v-if="record.overdue" style="word-break: keep-all; color: red">
            超过官方截止日期未处理
          </div>
        </a-table-column>
        <a-table-column width="100px" title="操作" #default="{ record }">
          <UploadOfficialFileModal
            ref="uploadOfficialFileModal"
            btnText="修改文件"
            :record="data.record"
            @submit="emit('submit')"
            v-if="
              (record.fileType === 3 && ![8, 14].includes(record.status)) ||
              !(serviceInfo.nodeCode === 'NODE0038' && [9, 10, 11, 12].includes(record.fileType))
            "
          >
            <a-button type="link" @click="editFile(record)"> 修改文件 </a-button>
          </UploadOfficialFileModal>
          <a-button
            type="link"
            @click="deleteFun(record)"
            v-if="!(serviceInfo.nodeCode === 'NODE0038' && [9, 10, 11, 12].includes(record.fileType))"
          >
            删除
          </a-button>
          <template v-if="record.fileType == 7">
            <a-button type="link" @click="translateStopLetterFun(record)" v-if="[10, 11].includes(record.status)">
              翻译暂停信
            </a-button>
            <a-button type="link" @click="cancelLetterAPIFun(record)" v-if="[11].includes(record.status)">
              取消暂停
            </a-button>
          </template>
        </a-table-column>
      </a-table>
    </div>
    <div class="table-bottom-tips" v-if="fileList.length > 0">
      <span>说明：</span
      >商标注册过程中，脚本会一直抓取各阶段公布的官方文件；默认是脚本自动执行，爬取官方文件和官方日期后，回传到系统指定商标的官方文件。
      因某些客观因素，脚本未抓取到文件，可在系统点击【抓取官方文件】按钮，触发脚本代码，实现官方文件抓取，并回传到系统指定商标的官方文件。
      如脚本抓取异常，可点击【上传官方文件】上传指定文件。
    </div>
  </div>
  <TranslateStopLetterModal ref="translateStopLetterModal" :record="data.record" @submit="emit('submit')" />
</template>

<script setup lang="ts">
import { reactive, ref, type Ref } from 'vue';
import FileLink from '@/components/assembly/FileLink.vue';
import { cancelLetterAPI, delFileOaAPI } from '@/api/workOrder/intellectualProperty/trademark';
import { message, Modal } from 'ant-design-vue';
import UploadOfficialFileModal from './opt/UploadOfficialFileModal.vue';
import TranslateStopLetterModal from './fileOpt/TranslateStopLetterModal.vue';

defineProps({
  serviceInfo: {
    type: Object,
    default: null,
  },
  fileList: {
    type: Array<any>,
    default: () => [],
  },
});
const emit = defineEmits(['submit']);
const uploadOfficialFileModal: Ref = ref(null);
const translateStopLetterModal: Ref = ref(null);
const data: any = reactive({
  record: {},
});

//修改文件
const editFile = (record: any) => {
  data.record = record;
  uploadOfficialFileModal.value.showModal = true;
};

//删除
const deleteFun = (record: any) => {
  Modal.confirm({
    title: '提示',
    width: 500,
    content: record.fileRemark.includes('OA')
      ? '如果答复审查意见所产生的关联订单未处于已取消或全部退款状态否则将无法关闭'
      : `确认删除${record.fileRemark}吗？`,
    onOk() {
      return new Promise(resolve => {
        resolve(true);
        delFileOaAPI({
          oaFileId: record.id,
        }).then(() => {
          message.success('操作成功');
          emit('submit');
        });
      });
    },
  });
};

//翻译暂停信
const translateStopLetterFun = (record: any) => {
  data.record = record;
  translateStopLetterModal.value.showModal = true;
};

//取消暂停
const cancelLetterAPIFun = (record: any) => {
  Modal.confirm({
    title: '提示',
    width: 500,
    content: '取消暂停，商标将恢复正常审查状态。你确定吗？',
    onOk() {
      return new Promise(resolve => {
        resolve(true);
        cancelLetterAPI({
          oaFileId: record.id,
        }).then(() => {
          message.success('操作成功');
          emit('submit');
        });
      });
    },
  });
};
</script>

<style scoped lang="less">
.cell-wrap {
  margin-bottom: 20px;
  .cell-table {
    padding: 5px 10px;
  }
  .table-bottom-tips {
    padding: 5px 10px;
    margin: 10px;
    background: #fff5eb;
    border-radius: 2px;
    color: #666;
  }
}
</style>
