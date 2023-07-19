<template>
  <div class="import-excel">
    <div>
      <h5>下载模板</h5>
      <p>导入的内容请参考模板，不符合规则的配对，将无法配对。</p>
      <span class="me-status-primary me-cp" @click="downloadTemClick">
        <a-icon type="download" />下载导入模板
      </span>
    </div>
    <div>
      <h5>上传配对表格</h5>
      <p>目前支持的文件类型为*.xls，*.xlsx。</p>
      <a-upload
        accept=".xls,.xlsx"
        :file-list="fileList"
        :remove="handleRemove"
        :before-upload="beforeUpload"
        :multiple="multiple"
      >
        <a-button type="primary"> 导入文件 </a-button>
      </a-upload>
    </div>
  </div>
</template>

<script>
import Storage from '@/api/storage'
import { downloadFile } from '@/util/index'
import store from '@/store'
export default {
  props: {
    suppliers: {
      type: Array,
      default: () => []
    },
    multiple: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      columns: [
        {
          title: this.$t('purchase.supplier'),
          dataIndex: 'supplierName'
        },
        {
          title: this.$t('common.handler'),
          dataIndex: 'handler',
          scopedSlots: { customRender: 'handler' },
          align: 'center'
        }
      ],
      accessToken: 'Bearer ' + store.getters.getAccessToken,
      fileList: []
    }
  },
  methods: {
    downloadTemClick() {
      Storage.getDownloadPairExcel().then((res) => {
        downloadFile(res, '配对模板')
      })
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    beforeUpload(file) {
      if (this.$props.multiple) {
        this.fileList = [...this.fileList, file]
      } else {
        this.fileList = [file]
      }
      return false
    },
    handleUpload() {
      const { fileList } = this
      const formData = new FormData()
      fileList.forEach((file) => {
        formData.append('file', file)
      })

      return new Promise((resolve, reject) => {
        Storage.importProductPair(formData)
          .then((res) => {
            this.fileList = []
            resolve(res)
          })
          .catch((error) => {
            reject(error.data)
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.import-excel {
  > div + div {
    margin-top: 16px;
  }
  h5 {
    font-size: 18px;
    font-weight: 600;
  }
  p {
    margin: 10px 0;
  }
}
</style>
