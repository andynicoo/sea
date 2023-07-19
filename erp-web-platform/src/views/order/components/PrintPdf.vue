<template>
  <a-spin :spinning='showSpinning' size='default' tip='加载中...'>
    <div>
      <a-button type='primary' size='small' style='margin-right:5px;' @click='prePage'>
        <Icon type='left' />
        上一页
      </a-button>
      <a-button type='primary' size='small' @click='nextPage'>下一页
        <Icon type='right' />
      </a-button>
      <a-button type='primary' size='small' @click='print'>打印
        <Icon type='printer' />
      </a-button>
      <div style='marginTop: 10px; color: #409EFF;'>{{ pageNum }} / {{ pageTotalNum }}</div>
      <pdf
        :page='pageNum'
        :src='url'
        @page-loaded='loadSuccess'
        @progress='loadedRatio = $event'
        @num-pages='pageTotalNum = $event'
      ></pdf>
    </div>
  </a-spin>
</template>

<script>
import pdf from 'vue-pdf'

export default {
  props: ['type'],
  name: 'Pdf',
  components: {
    pdf,
  },
  data() {
    return {
      showSpinning: false,
      url: '',
      filePreviewUrl: '',
      numPages: null, // pdf 总页数
      pageNum: 1,
      pageTotalNum: 1, //总页数
      loadedRatio: 0 // 当前页面的加载进度，范围是0-1 ，等于1的时候代表当前页已经完全加载完成了
    }
  },
  mounted() {
    this.showSpinning = true
    console.log(this.type)
    //1 FTP PDF预览
    if (this.type == '1') {
      this.filePreviewUrl = `${config.contextPath}/api/attachCommon/preview/`
    } else {
      this.filePreviewUrl = `${config.contextPath}/api/filePreview/`
    }
    this.$emit('getPdfItem')
  },
  methods: {
    // 上一页
    prePage() {
      let page = this.pageNum
      page = page > 1 ? page - 1 : this.pageTotalNum
      this.pageNum = page
    },
    // 下一页
    nextPage() {
      let page = this.pageNum
      page = page < this.pageTotalNum ? page + 1 : 1
      this.pageNum = page
    },
    showPdf(pdfId) {
      this.url = this.filePreviewUrl + pdfId
      this.getNumPages()
    },
    //计算pdf页码总数
    getNumPages() {
      var loadingTask = pdf.createLoadingTask(this.url, { withCredentials: true })
      loadingTask.promise.then(pdf => {
        this.pageTotalNum = pdf.numPages
        console.log(this.pageTotalNum)
      }).catch(err => {
        console.error('pdf 加载失败', err)
      })
    },
    //加载完成
    loadSuccess() {
      console.log('加载完成')
      this.showSpinning = false
    }
  }
}
</script>

<style scoped>

</style>