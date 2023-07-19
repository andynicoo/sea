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
        <img src="@/assets/images/common/serch.png" style="position: relative;" />
        查看示例
      </a>
      <template v-if="fileObj.sourceFileUrl && fileObj.sourceFileUrl != '[]'">
        <a
          v-for="url in $util.convertImage(this.fileObj.sourceFileUrl)"
          :key="url"
          href="javascript:void(0);"
          target="_self"
          style="color: #16ade9; margin-right: 20px"
          @click="downLoad(url)"
        >
          <img src="@/assets/images/common/kan.png" style="position: relative;" />
          模板文件
        </a>
      </template>
      <a v-if="showAuthorizeFile" href="javascript:void(0);" style="color: #ed3e3e" @click="downLoadAuthor">
        <img src="@/assets/images/common/downloadImg.svg" style="position: relative; top: 4px" />
        下载授权书
      </a>
    </span>
  </div>
</template>
<script>
import { forEach } from 'mathjs'

export default {
  props: {
    fileObj: {
      type: Object,
      default () {
        return {}
      }
    },
    remindMessage: String,
    showAuthorizeFile: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  methods: {
    /** 下载授权书 */
    downLoadAuthor () {
      this.$util.downFile(
        this.baseUrl +
          `/workorder/client/vat/download?columnId=${this.fileObj.columnId}&serviceId=${this.$route.query.serviceId}`
      )
    },
    // 下载模板文件
    downLoad (url) {
      // let url = this.$util.convertImage(this.fileObj.sourceFileUrl)
      // url.forEach((item) => {
      //   this.$util.downloadFile(item)
      // });
      this.$util.downloadFile(url)
    }
  }
}
</script>

<style></style>
