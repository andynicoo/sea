<template>
  <div class="cell-wrap">
    <div class="cell-title">官方下发文件</div>
    <div class="cell-table">
      <a-table
        :dataSource="fileList"
        bordered
        :pagination="false"
        :locale="{ emptyText: '暂无文件，请先上传后再查看' }"
      >
        <a-table-column width="80px" title="序号">
          <template #default="{ index }">
            {{ index + 1 }}
          </template>
        </a-table-column>
        <a-table-column width="180px" title="官方原文" #default="{ record }">
          <template v-if="record.fileType === 15">
            <!-- 文件类型为授权书显示 -->
            <FileLink :fileUrl="record.authorizationTemplateFile" fileName="授权书模版文件.pdf" />
            <FileLink :fileUrl="record.authorizationExampleFile" fileName="授权书示例文件.pdf" />
          </template>
          <template v-else>
            <FileLink :fileUrl="record.fileUrl" />
          </template>
        </a-table-column>
        <a-table-column width="180px" title="审核意见详情" #default="{ record }">
          <template v-if="record.fileType === 15">
            <!-- 文件类型为授权书显示 -->
            -
          </template>
          <template v-else>
            <div v-for="(item, index) in JSON.parse(record.hlepDocument || '[]')" :key="index">
              <FileLink :fileUrl="item.fileUrl" :fileName="item.oldFileName" />
            </div>
            <span v-if="!record.hlepDocument">-</span>
          </template>
        </a-table-column>
        <a-table-column width="130px" title="文件类型" data-index="fileRemark"> </a-table-column>
        <a-table-column width="130px" title="官方起止日期" #default="{ record }">
          <div>{{ (record.officeDate || '').slice(0, 10) || '-' }}</div>
          <div>{{ (record.officialExpirationDate || '').slice(0, 10) || '-' }}</div>
        </a-table-column>
        <a-table-column width="130px" title="客户截止日期" #default="{ record }">
          {{ (record.lastDealDate || '').slice(0, 10) || '-' }}
          <div v-if="record.overdue" style="word-break: keep-all; color: red">超过官方截止日期未处理</div>
        </a-table-column>
        <a-table-column width="180px" title="备注" #default="{ record }">
          {{ record.remark || '-' }}
        </a-table-column>
        <a-table-column width="120px" title="操作" #default="{ record }">
          <template v-if="record.fileType === 21">-</template>
          <template v-else-if="record.fileType === 15">
            <!-- 文件类型为授权书显示 -->
            <a-button
              type="link"
              @click="uploadTemplateFile(record)"
              v-if="
                useButton('workOrder_intellectualProperty_OaExamination_uploadTemplateFile') && record.status === 15
              "
            >
              重新上传授权书模板
            </a-button>
            <a-button
              type="link"
              @click="authorizationFile(record)"
              v-if="useButton('workOrder_intellectualProperty_OaExamination_authorizationFile') && record.status === 15"
            >
              代客户上传授权书
            </a-button>
          </template>
          <template v-else>
            <a-button
              type="link"
              @click="translateOa(record)"
              v-if="useButton('workOrder_intellectualProperty_OaExamination_translateOa') && record.status === 3"
            >
              翻译OA
            </a-button>
            <a-button
              type="link"
              @click="seeTranslateOa(record)"
              v-if="useButton('workOrder_intellectualProperty_OaExamination_seeTranslateOa') && record.status !== 3"
            >
              查看翻译件
            </a-button>
            <a-button
              type="link"
              @click="translateOa(record)"
              v-if="useButton('workOrder_intellectualProperty_OaExamination_translateOa2') && record.status === 5"
            >
              修改翻译件
            </a-button>
            <a-button
              type="link"
              @click="delecteDetails(record)"
              v-if="useButton('workOrder_intellectualProperty_OaExamination_delecteDetails') && record.status === 3"
            >
              删除
            </a-button>
            <a-button
              type="link"
              @click="closeOa(record)"
              v-if="
                useButton('workOrder_intellectualProperty_OaExamination_closeOa') &&
                (record.status === 12 || record.status === 5 || record.status === 9)
              "
            >
              关闭OA
            </a-button>
            <a-button
              type="link"
              @click="updateFileOa(record)"
              v-if="useButton('workOrder_intellectualProperty_OaExamination_updateFileOa') && record.status === 3"
            >
              修改官文
            </a-button>
            <a-button
              type="link"
              @click="uploadReplyInformation(record)"
              v-if="
                useButton('workOrder_intellectualProperty_OaExamination_uploadReplyInformation') && record.status === 5
              "
            >
              代客户上传答复材料
            </a-button>
            <a-button
              type="link"
              @click="uploadReplyInformationAgain(record)"
              v-if="
                useButton('workOrder_intellectualProperty_OaExamination_uploadReplyInformationAgain') &&
                (record.status === 9 || record.status === 17)
              "
            >
              代客户再次上传答复材料
            </a-button>
          </template>
        </a-table-column>
      </a-table>
      <div class="table-bottom-tips" v-if="fileList.length > 0">
        说明：商标注册过程中，脚本会一直抓取各阶段公布的官方文件；默认是脚本自动执行，爬取官方文件和官方日期后，回传到系统指定商标的官方文件。
        因某些客观因素，脚本未抓取到文件，可在系统点击【抓取官方文件】按钮，触发脚本代码，实现官方文件抓取，并回传到系统指定商标的官方文件。
        如脚本抓取异常，可点击【上传官方文件】上传指定文件。
      </div>
    </div>
  </div>
  <div class="cell-wrap">
    <div class="cell-title">关联文件信息</div>
    <div class="cell-table">
      <a-table :dataSource="data.relevanceFileList" bordered :pagination="false">
        <a-table-column width="80px" title="序号">
          <template #default="{ index }">
            {{ index + 1 }}
          </template>
        </a-table-column>
        <a-table-column width="130px" title="文件类型" #default="{ record }">
          <span v-if="record.nodeCodeStr">使用证据补正</span>
          <span v-else>
            <span v-if="record.fileType === 1">受理回执</span>
            <span v-else-if="record.fileType === 2">受理书</span>
            <span v-else-if="record.fileType === 3">审查意见</span>
            <span v-else-if="record.fileType === 4">审查意见的答复函</span>
            <span v-else-if="record.fileType === 7">暂停信</span>
            <span v-else-if="record.fileType === 15">授权书</span>
            <span v-else>-</span>
          </span>
        </a-table-column>
        <a-table-column width="130px" title="文件信息" #default="{ record }">
          <template v-if="record.fileType === 15">
            <!-- 文件类型为授权书显示 -->
            <FileLink :fileUrl="record.authorizationFile" />
          </template>
          <template v-else>
            <FileLink :fileUrl="record.answerFile" />
          </template>
        </a-table-column>
        <a-table-column width="180px" title="备注" data-index="businessRemark"> </a-table-column>
        <a-table-column width="180px" title="上传时间" #default="{ record }">
          <template v-if="record.fileType === 15">
            <!-- 文件类型为授权书显示 -->
            {{ record.uploadAuthorizationFileTime || '-' }}
          </template>
          <template v-else>
            {{ record.uploadAnswerFileTime || '-' }}
          </template>
        </a-table-column>
        <a-table-column width="180px" title="驳回原因" #default="{ record }">
          {{ record.rejectReason }}
          <FileLink :fileUrl="record.rejectFile" />
        </a-table-column>
        <a-table-column width="120px" title="操作" #default="{ record }">
          <template v-if="record.fileType === 15">
            <!-- 文件类型为授权书显示 -->
            <a-button
              type="link"
              @click="auditAuthorization(record)"
              v-if="
                useButton('workOrder_intellectualProperty_OaExamination_auditAuthorization') && record.status === 16
              "
            >
              审核授权书
            </a-button>
          </template>
          <template v-else>
            <a-button
              type="link"
              @click="platformAuditFun(record)"
              v-if="useButton('workOrder_intellectualProperty_OaExamination_platformAuditFun') && record.status === 6"
            >
              平台审核
            </a-button>
            <a-button
              type="link"
              @click="lawyerReviewFun(record)"
              v-if="useButton('workOrder_intellectualProperty_OaExamination_lawyerReviewFun') && record.status === 7"
            >
              律师审核
            </a-button>
          </template>
        </a-table-column>
      </a-table>
    </div>
  </div>
  <TranslateOaDrawer
    ref="translateOaDrawer"
    :record="data.record"
    @submit="emit('updateDetails'), getRelationFilesFun()"
  />
  <TranslateOaModal ref="translateOaModal" :record="data.record" />
  <UpdateFileOaModal
    ref="updateFileOaModal"
    :record="data.record"
    @submit="emit('updateDetails'), getRelationFilesFun()"
  />
  <UploadReplyInformationModal
    ref="uploadReplyInformationModal"
    :record="data.record"
    @submit="emit('updateDetails'), getRelationFilesFun()"
  />

  <UploadReplyInformationAgainModal
    ref="uploadReplyInformationAgainModal"
    :record="data.record"
    @submit="emit('updateDetails'), getRelationFilesFun()"
  />

  <TemplateFileModal
    ref="templateFileModal"
    :record="data.record"
    @submit="emit('updateDetails'), getRelationFilesFun()"
  />
  <AuthorizationFileModal
    ref="authorizationFileModal"
    :record="data.record"
    @submit="emit('updateDetails'), getRelationFilesFun()"
  />

  <PlatformAuditModal
    ref="platformAuditModal"
    :record="data.record"
    @submit="emit('updateDetails'), getRelationFilesFun()"
  />
  <LawyerReviewModal
    ref="lawyerReviewModal"
    :record="data.record"
    @submit="emit('updateDetails'), getRelationFilesFun()"
  />
  <AuditAuthorizationModal
    ref="auditAuthorizationModal"
    :record="data.record"
    @submit="emit('updateDetails'), getRelationFilesFun()"
  />
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, type Ref } from 'vue';
import router from '@/router';
import { useButton } from '@/utils/utils';
import { closeOaAPI, delFileOaAPI, getRelationFiles } from '@/api/workOrder/intellectualProperty/oaExamination';
import { message, Modal } from 'ant-design-vue';
import FileLink from '@/components/assembly/FileLink.vue';
import TranslateOaDrawer from './official/TranslateOaDrawer.vue';
import TranslateOaModal from './official/TranslateOaModal.vue';
import UpdateFileOaModal from './official/UpdateFileOaModal.vue';
import UploadReplyInformationModal from './official/UploadReplyInformationModal.vue';
import UploadReplyInformationAgainModal from './official/UploadReplyInformationAgainModal.vue';
import TemplateFileModal from './official/TemplateFileModal.vue';
import AuthorizationFileModal from './official/AuthorizationFileModal.vue';

import PlatformAuditModal from './relevance/PlatformAuditModal.vue';
import LawyerReviewModal from './relevance/LawyerReviewModal.vue';
import AuditAuthorizationModal from './relevance/AuditAuthorizationModal.vue';

defineProps({
  fileList: {
    type: Array<any>,
    default: () => [],
  },
});
const emit = defineEmits(['updateDetails']);
const data: any = reactive({
  record: {},
  relevanceFileList: [], //OA关联文件
});

onMounted(() => {
  getRelationFilesFun();
});

//删除
const delecteDetails = (record: any) => {
  Modal.confirm({
    title: '是否确认删除？',
    content: '如果答复审查意见所产生的关联订单未处于已取消或全部退款状态否则将无法关闭',
    okText: '确认',
    cancelText: '取消',
    onOk() {
      return new Promise<void>((resolve, reject) => {
        delFileOaAPI({
          oaFileId: record.id,
        }).then((res: any) => {
          getRelationFilesFun();
          message.success('操作成功');
        });
        resolve();
      });
    },
  });
};

//关闭OA
const closeOa = (record: any) => {
  Modal.confirm({
    title: '是否关闭OA？',
    content: '如果答复审查意见所产生的关联订单未处于已取消或全部退款状态否则将无法关闭',
    okText: '确认',
    cancelText: '取消',
    onOk() {
      return new Promise<void>((resolve, reject) => {
        closeOaAPI({
          serviceId: record.serviceId,
          workOrderId: record.workId,
          workOaId: record.id,
        }).then((res: any) => {
          getRelationFilesFun();
          message.success('操作成功');
        });
        resolve();
      });
    },
  });
};

//翻译Oa
const translateOaDrawer: Ref = ref(null);
const translateOa = (record: any) => {
  data.record = record;
  translateOaDrawer.value.showDrawer = true;
};

//查看翻译Oa
const translateOaModal: Ref = ref(null);
const seeTranslateOa = (record: any) => {
  data.record = record;
  translateOaModal.value.showModal = true;
};

//修改官文
const updateFileOaModal: Ref = ref(null);
const updateFileOa = (record: any) => {
  data.record = record;
  updateFileOaModal.value.showModal = true;
};

//代客户上传答复材料
const uploadReplyInformationModal: Ref = ref(null);
const uploadReplyInformation = (record: any) => {
  data.record = record;
  uploadReplyInformationModal.value.showModal = true;
};

//代客户再次上传答复材料
const uploadReplyInformationAgainModal: Ref = ref(null);
const uploadReplyInformationAgain = (record: any) => {
  data.record = record;
  uploadReplyInformationAgainModal.value.showModal = true;
};

//重新上传授权书模板
const templateFileModal: Ref = ref(null);
const uploadTemplateFile = (record: any) => {
  data.record = record;
  templateFileModal.value.showModal = true;
};

//代客户上传授权书
const authorizationFileModal: Ref = ref(null);
const authorizationFile = (record: any) => {
  data.record = record;
  authorizationFileModal.value.showModal = true;
};

//平台审核
const platformAuditModal: Ref = ref(null);
const platformAuditFun = (record: any) => {
  data.record = record;
  platformAuditModal.value.showModal = true;
};

//律师审核
const lawyerReviewModal: Ref = ref(null);
const lawyerReviewFun = (record: any) => {
  data.record = record;
  lawyerReviewModal.value.showModal = true;
};

//审核授权书
const auditAuthorizationModal: Ref = ref(null);
const auditAuthorization = (record: any) => {
  data.record = record;
  auditAuthorizationModal.value.showModal = true;
};

//获取OA关联文件
const getRelationFilesFun = () => {
  getRelationFiles({
    serviceId: router.currentRoute.value.query.serviceId,
    workId: 0,
  }).then((res: any) => {
    data.relevanceFileList = res || [];
  });
};
</script>

<style scoped lang="less">
.cell-wrap {
  margin-bottom: 20px;
  .cell-title {
    font-size: 15px;
    font-weight: bold;
    margin: 8px;
  }
  .cell-table {
    padding: 5px 10px;
    .table-bottom-tips {
      background: #fff5eb;
      border-radius: 2px;
      padding: 12px;
      margin-top: 10px;
      font-size: 12px;
      color: #666;
    }
    .null-file {
      text-align: center;
      line-height: 24px;
      padding: 15px;
    }
  }
}
</style>
