<template>
  <div>
    <!-- 文件示例 -->
    <span>
      <!-- <a v-if="fileObj.sourceFileUrl && fileObj.sourceFileUrl != '[]'" href="javascript:void(0);" target="_blank" style="color: #16ade9; margin-right: 20px" @click="downLoad"> -->
      <a v-if="sourceFileUrl" :href="sourceFileUrl" target="_blank" style="color: #16ade9; margin-right: 20px">
        <i class="el-icon-download"></i>
        下载模板
      </a>
      <span style="margin: 0 10px" v-if="!fileObj.sourceFileUrl && currentNodeCode === currentCodeEnum.NODE4">暂无模板，请上传模板</span>
      <span style="margin: 0 10px" v-else-if="isEPRNoSourceFileUrl">未配置模板</span>
      <a v-if="fileObj.fileModelUrl" :href="fileObj.fileModelUrl" target="_blank" style="color: #16ade9; margin-right: 20px">
        <i class="el-icon-search"></i>
        查看示例
      </a>
      <a v-if="showAuthorizeFile" href="javascript:void(0);" style="color: #ed3e3e" @click="downLoadAuthor">
        <i class="el-icon-download"></i>
        下载授权书
      </a>
      <a v-if="EPRAuthFile" :href="EPRAuthFile" target="_blank" style="color: #16ade9; margin-right: 20px">
        <i class="el-icon-search"></i>
        查看驳回文件
      </a>
      <div class="text-tips">{{ remindMessage }}</div>
    </span>
  </div>
</template>
<script>
import { currentCodeEnum } from '@/view/module/workOrder/map.js';
import { progressBarObj as EPRManageprogressBarObj } from '@/view/module/workOrder/EPRManage/enumObj.js';

export default {
  props: {
    fileObj: {
      type: Object,
      default() {
        return {};
      },
    },
    remindMessage: String,
    showAuthorizeFile: {
      type: Boolean,
      default: false,
    },
    currentNodeCode: [String, undefined],
    workId: String,
  },
  data() {
    return {
      currentCodeEnum,
    };
  },
  computed: {
    // 代审核时, 授权书的值为空. 则展示
    isEPRNoSourceFileUrl() {
      return EPRManageprogressBarObj.WAIT_AUTHORIZE === this.currentNodeCode && !this.fileObj.oldSourceFileUrl && !this.fileObj.sourceFileUrl;
    },
    sourceFileUrl() {
      return this.fileObj.oldSourceFileUrl || this.fileObj.sourceFileUrl;
    },
    // ERP授权书
    EPRAuthFile() {
      if (this.fileObj.oldReView) {
        // this.fileObj.reView 可能为空对象
        const isEmptyObj = Object.keys(this.fileObj.oldReView).length === 0;
        return isEmptyObj ? '' : this.fileObj.oldReView;
      } else {
        return '';
      }
    },
  },
  methods: {
    /** VAT下载授权书 */
    downLoadAuthor() {
      this.$util.downFile(this.baseUrl + `/workorder/client/vat/download/new?columnId=${this.fileObj.columnId}&workId=${this.workId}`);
    },
    // 下载模板文件
    downLoad() {
      let url = this.$util.convertImage(this.sourceFileUrl);
      url.forEach((item) => {
        this.$util.downloadFile(item);
      });
    },
  },
};
</script>

<style></style>
