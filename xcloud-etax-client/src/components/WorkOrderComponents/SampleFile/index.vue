<template>
  <div>
    <!-- 文件示例 -->
    <span>
      <div class="text-tips">{{ remindMessage }}</div>
      <a
        v-if="fileObj.fileModelUrl"
        :href="fileObj.fileModelUrl"
        target="_blank"
        style="color: #16ade9; margin-right: 20px"
      >
        <img src="@/assets/images/common/serch.png" style="position: relative; top: 4px" />
        查看示例
      </a>
      <a v-if="fileObj.oldSourceFileUrl" :href="fileObj.oldSourceFileUrl" style="color: #16ade9" target="_blank">
        <img src="@/assets/images/hague/kan.png" style="position: relative; top: 4px" />
        模板文件
      </a>
      <template v-else-if="hasSourceFileUrl">
        <a
          v-for="url in $util.convertImage(this.fileObj.sourceFileUrl)"
          :key="url"
          href="javascript:void(0);"
          target="_self"
          style="color: #16ade9; margin-right: 20px"
          @click="downLoad(url + '?response-content-type=application/octet-stream')"
        >
          <img src="@/assets/images/hague/kan.png" style="position: relative; top: 4px" />
          模板文件
        </a>
      </template>
      <a
        v-if="!hasSourceFileUrl && showAuthorizeFile"
        href="javascript:void(0);"
        style="color: #ed3e3e; margin-right: 20px"
        @click="downLoadAuthor"
      >
        <img src="@/assets/images/common/downloadImg.svg" style="position: relative; top: 4px" />
        下载授权书
      </a>
      <!-- EPR模板文件 -->
      <a v-if="fileObj.oldSourceFileUrl" :href="fileObj.oldSourceFileUrl" style="color: #16ade9" target="_blank">
        <img src="@/assets/images/hague/kan.png" style="position: relative; top: 4px" />
        模板文件
      </a>
      <a
        v-else-if="!hasSourceFileUrl && showSourceFile"
        href="javascript:void(0);"
        style="color: #16ade9;margin-right: 20px"
        @click="eprDownLoadAuthor"
      >
        <img src="@/assets/images/hague/kan.png" style="position: relative; top: 4px" />
        模板文件
      </a>
      <!-- 下载驳回原文件 -->
      <a v-if="oldReViewUrl" :href="oldReViewUrl" style="color: #16ade9" target="_blank">
        <img src="@/assets/images/hague/kan.png" style="position: relative; top: 4px" />
        下载驳回原文件
      </a>
    </span>
  </div>
</template>
<script>
export default {
  props: {
    fileObj: {
      type: Object,
      default() {
        return {};
      },
    },
    remindMessage: String,
    // 显示授权书
    showAuthorizeFile: {
      type: Boolean,
      default: false,
    },
    // 显示EPR模板文件
    showSourceFile: {
      type: Boolean,
      default: false,
    },
    serviceId: {
      type: String,
      default: '',
    },
    workInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    hasSourceFileUrl() {
      return this.fileObj.sourceFileUrl && this.fileObj.sourceFileUrl != '[]';
    },
  },
  data() {
    return {
      oldReViewUrl: '',
    };
  },
  created() {
    this.hasOldReViewUrl();
  },
  methods: {
    hasOldReViewUrl() {
      if (Array.isArray(this.fileObj.oldReView) && this.fileObj.oldReView.length) {
        //返回数组
        this.oldReViewUrl = this.fileObj.oldReView[0];
      } else if (this.fileObj.oldReView && typeof this.fileObj.oldReView === 'string') {
        //返回字符串
        this.oldReViewUrl = this.fileObj.oldReView;
      }
    },
    /** 下载授权书 */
    downLoadAuthor() {
      this.$util.downFile(
        this.baseUrl +
          `/workorder/client/vat/download/new?columnId=${this.fileObj.columnId}&workId=${this.workInfo.workId}`,
        this.fileObj.keyLabel
      );
    },
    // epr下载授权书
    eprDownLoadAuthor() {
      this.$util.downFile(
        this.baseUrl +
          `/workorder/client/vat/download?columnId=${this.fileObj.columnId}&serviceId=${this.$route.query.serviceId}`,
        this.fileObj.keyLabel
      );
    },
    // 下载模板文件
    downLoad(url) {
      this.$util.downloadFile(url, this.fileObj.keyLabel);
    },
  },
};
</script>

<style></style>
