<template>
  <a-upload
    ref="upload"
    :action="uploadUrl"
    list-type="picture-card"
    :file-list="fileList"
    :headers="headers"
    @change="handleChange"
    @preview="handlePreview"
  >
    <div v-if="fileList.length < max">
      <a-icon type="plus" />
      <div class="ant-upload-text">
        {{ uploadText }}
        <div
          v-if="tips"
          class="tips"
        >{{ tips }}</div>
      </div>
    </div>
  </a-upload>
</template>

<script>
import { getBase64 } from '@/utils/index'
import { uploadImgUrl } from '@/api/uploadImgUrl'
import store from '@/store'
export default {
  name: 'Upload',
  props: {
    action: {
      type: String,
      default: uploadImgUrl
    },
    /**
     * [{uid,url,name,status}]类似这样的格式
     */
    filesList: {
      type: [Array, null, undefined],
      default: () => []
    },
    max: {
      type: Number,
      default: 1
    },
    uploadText: {
      type: String,
      default: 'Upload'
    },
    tips: {
      type: String,
      default: ''
    },
    index: {
      type: Number,
      default: 1 // 页面用v-for使用上传组件时，给'index'
    }
  },
  data() {
    return {
      previewVisible: false,
      fileList: [],
      previewImg: '',
      uploadUrl: this.action,
      headers: {
        Authorization: 'Bearer ' + store.getters.getAccessToken
      }
    }
  },
  watch: {
    filesList: {
      handler(val) {
        this.init(val)
      }
    }
  },
  created() {
    if (/^(https:|http:)/.test(this.action)) {
      this.uploadUrl = '/api' + this.action
    } else {
      this.uploadUrl =
        (process.env.VUE_APP_BASE_API || location.origin) + this.action
      if (process.env.NODE_ENV === 'development') {
        const str = this.uploadUrl.replace(/\/api\//, '/')
        this.uploadUrl = str
      } else {
        this.uploadUrl = '/api' + this.action
      }
    }
    this.init(this.filesList)
  },
  methods: {
    init(list) {
      let temp = list.filter(ele => {
        if (ele.url !== '' && ele.url !== null) { return ele }
      })
      this.fileList =
        temp &&
        temp.map((item, index) => {
          return {
            uid: item.uid || -(this.index + 1),
            url: item.url,
            name: item.name || 'image.png',
            status: item.status || 'done'
          }
        })
    },
    handleChange({ file, fileList }) {
      if (file.status === 'error') {
        this.$message.error('上传失败')
      }
      const { response } = file
      const { code } = response || {}
      const data = response?.data || []
      if (!file.url && code === '0') {
        console.log('add')
        file.url = data.join()
        fileList.map((item) => {
          if (item.uid === file.uid) {
            item.url = file.url
          }
          return item
        })
        this.fileList[0].index = this.index
        // console.log('a', fileList)
        this.$emit('change', fileList)
      }
      if (file.status === 'removed' && !file.error) {
        this.$confirm({
          content: '确定删除上传照片吗？',
          onOk: () => {
            this.fileList = fileList
            // console.log('r', fileList)
            this.$emit('change', fileList, this.index)
          }
        })
        return
      }
      this.fileList = fileList
      // this.$emit('change', fileList)
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImg = file.url || file.preview
      this.$previewImg({
        url: this.previewImg
      })
    },
    afterClose() {
      this.previewImg = ''
    },
    reset() {
      this.fileList = []
    }
  }
}
</script>

<style lang="less" scoped>
.ant-upload-text {
  color: #999999;
}
.tips {
  font-size: 12px;
  transform: scale(0.8);
  white-space: nowrap;
}
</style>
