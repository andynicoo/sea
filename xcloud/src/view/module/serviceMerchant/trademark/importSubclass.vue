<template>
  <div class="import-subclass-wrapper" v-loading="importLoading" element-loading-text="正在导入，预计用时1-3分钟">
    <el-steps :active="active" simple finish-status="finish">
      <el-step title="1 上传表格"></el-step>
      <el-step title="2 确认导入"></el-step>
      <el-step title="3 导入完成"></el-step>
    </el-steps>
    <div class="step-wrapper" v-if="active === 0">
      <h3 class="text-default" >1、操作指引</h3>
      <div class="content">
        <el-descriptions  direction="vertical" :column="2" border :labelStyle="{'text-align':'center'}">
        <el-descriptions-item label="使用说明（只支持固定模版导入）">
          <div class="list-item">
          <p>1、选择表格文件</p>
          <p>2、核对数据对应关系，简单调整</p>
          <p>3、确认导入</p>
          <el-link type="primary" :underline="false" icon="el-icon-download" @click="downloadTemplate" v-show="hasAuthority('D1_29')">下载模板</el-link>
        </div>
        </el-descriptions-item>
        <el-descriptions-item label="导入规则说明">
          <div class="list-item">
          <p>1.文件后缀名必须为：xls或xlsx（Excel标准格式），文件大小&lt;20M。</p>
          <p>2.商标分类和国家不允许为空</p>
          <p>3.模板中的表头名称不可更改，表头行不能删除</p>
          <p>4.商标小类信息如果与已有数据重复，系统将自动覆盖历史数据。</p>
        </div>
        </el-descriptions-item>
      </el-descriptions>
      </div>
      <h3>2、上传execl数据</h3>
      <div class="upload-wrapper">
        <!-- <el-input class="upload-input" size="small" v-model="fileName" disabled /> -->
        <el-upload
          ref="uploadRef"
          :data="{ fileCode: randomStr }"
          :action="uploadUrl"
          accept=".xls,.xlsx"
          :headers="uploadHeaders"
          :limit="2"
          :before-upload="beforeUpload"
          :on-progress="handleProgress"
          :on-success="handleSuccess"
          :on-error="handleError"
          :on-change="handleChange"
          drag
        >
        <div class="drag-wrapper">
          <i class="icon icon-file-upload"></i>
          <div class="el-upload__text" style="line-height: 1.5;margin-top: 10px;font-size: 12px">
            <div>点击或将文件拖拽到这里上传</div>
          </div>
        </div>
          <!-- <el-button size="small" type="primary" :loading="uploadLoading">选择文件</el-button> -->
        </el-upload>
      </div>
      <el-alert
        v-if="uploadErrorText"
        :title="uploadErrorText"
        type="error"
        :closable="false"
        class="upload-error"
        show-icon>
      </el-alert>
      <div class="btn-group">
        <el-button type="primary" size="small" @click="next" v-show="hasAuthority('D1_27')">下一步</el-button>
        <el-button size="small" @click="cancel">取消</el-button>
      </div>
    </div>
    <div class="step-wrapper" v-if="active === 1">
      <el-alert :title="'验证情况：您导入的数据，正确：'+successData+'条；有误：'+failData+'条。'" class="warning-msg" type="warning" :closable="false"></el-alert>
      <el-table border :data="form">
        <el-table-column align="center" label="序号" width="70">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
            <a :title="scope.row.failInfo"><i class="el-icon-warning" /></a>
          </template>
        </el-table-column>
        <el-table-column align="center" label="商标分类" prop="parentCategoryNumName"></el-table-column>
        <el-table-column align="center" label="商标小类(中文)" prop="categoryName"></el-table-column>
        <el-table-column align="center" label="商标小类(英文)" prop="categoryNameEn"></el-table-column>
        <el-table-column align="center" label="国家" prop="countryName"></el-table-column>
      </el-table>
      <div class="bottom-area">
        <el-checkbox v-model="checked" style="margin-right: 20px">只提交正确数据</el-checkbox>
        <el-button type="primary" size="small" :loading="exportLoading" :disabled="!!(form.length && !checked)" @click="exportConfirm" v-show="hasAuthority('D1_28')">确定导入</el-button>
        <el-button size="small" @click="cancel">取消</el-button>
      </div>
      <div style="padding-top: 60px"></div>
    </div>
    <div class="step-wrapper" v-if="active === 2">
      <el-result icon="success" title="导入成功" :subTitle="'您已成功导入的'+successData+'条数据，有误：'+failData+'条'">
        <template slot="extra">
          <div class="download"><el-link type="primary" icon="el-icon-download" @click="downloadErrorData">下载错误数据</el-link></div>
          <el-button type="primary" size="medium" @click="navigateToList">返回列表</el-button>
          <el-button size="medium" @click="close">关闭页面</el-button>
        </template>
      </el-result>
    </div>
    <el-dialog
      title="上传商品数据"
      :visible.sync="uploadDialogVisible"
      width="30%"
    >
      <el-progress :percentage="percentage"></el-progress>
      <span slot="footer" class="dialog-footer">
      </span>
    </el-dialog>
    <DownloadTemplateDialog ref="templateDialog" :countryList="templateCountryList" />
  </div>
</template>

<script>
import UploadFile from "@/components/UploadFile/index";
import {categoryTemplate, uploadFile, downLoadFailFile, importRecord, getCountryTemplates} from "@/api/newApi/servicemerchant/trademark.js";
import util from '@/utils/util.js'
import { getToken } from "@/libs/util";
import { mapMutations } from "vuex";
import DownloadTemplateDialog from './components/downloadTemplateDialog'
export default {
  components:{
    UploadFile,
    DownloadTemplateDialog
  },
  data() {
    return {
      active: 0,
      form: [],
      successData: 0,
      failData: 0,
      checked: true,
      fileName: '',
      uploadErrorText: '',
      uploadUrl: this.baseUrl + "/workorder/management/trademark/category/excel/vaildFile",
      uploadHeaders: {
        Authorization: "Bearer " + getToken(),
        enterpriseId: localStorage.getItem("enterpriseId")
      },
      // 随机生成fileCode
      randomStr: Math.random().toString(36).substr(-10),
      uploadData: {},
      fileLength: 0,
      uploadDialogVisible: false,
      percentage: 0,
      exportLoading: false,
      uploadLoading: false,
      importLoading: false,
      templateCountryList: [], // 下载模板国家选项
      templateShow: false
    }
  },
  methods: {
    // 下载模板
    downloadTemplate() {
      this.$refs.templateDialog.modalShow()
      // categoryTemplate().then(res => {
      //   util.exportExcel(res)
      // })
    },
    beforeUpload(file) {
      console.log('beforeUpload')
      let fileType = util.getFileSuffixName(file.name)
      const FILE_TYPE = ["xlsx", "xls"];
      const MAX_SIZE = file.size / 1024 / 1024 < 20
      // 验证文件类型
      if (!FILE_TYPE.includes(fileType)) {
        this.uploadErrorText = '请选择excel格式的文件'
        return false
      }
      // 验证文件大小
      if (!MAX_SIZE) {
        this.uploadErrorText = '文件不大于20M'
        return false
      }
      this.uploadErrorText = ''
      return true
    },
    handleProgress(e, file) {
      this.uploadLoading = true
      console.log('progress')
      this.uploadDialogVisible = true
      this.percentage = e.percent
      if(e.percent === 100) {
        this.uploadDialogVisible = false
      }
    },
    handleSuccess(e, file) {
      console.log('success')
      this.uploadLoading = false
      if(e.code === 0) {
        let data = e.data
        this.form = data.failTrademarkCategoryList
        this.successData = data.importSuccessTotal
        this.failData = data.importFailTotal
        this.uploadData = {
          fileCode: this.randomStr,
          fileName: file.name
        }
        this.randomStr = Math.random().toString(36).substr(-10)
        this.fileLength = 1
        this.fileName = file.name
      } else {
        this.$message.error(e.message)
      }
    },
    handleError(e, file) {
      console.log('error')
      this.uploadLoading = false
      this.$message.error('上传失败，请重试')
    },
    handleChange(file, fileList) {
      if(fileList.length > 1) {
        fileList.splice(0, 1)
      }
    },
    // 下一步，第一步到第二步
    next() {
      if(!this.fileLength) {
        this.uploadErrorText = '请选择文件'
        return
      }
      this.active = 1
    },
    // 确定导入
    exportConfirm() {
      this.exportLoading = true
      uploadFile(this.uploadData).then(res => {
        this.exportLoading = false
        if(res.code === 0) {
          this.importLoading = true
          this.ifImportComplete()
          // this.active = 2
        }
      })
    },
    // 判断是否导入完成
    ifImportComplete() {
      importRecord({
        fileName: this.fileName,
        operationType: 0
      }).then(res => {
        let status = res.data.status
        if(status !== 0) {
          this.importLoading = false
          if(status === 1) {
            this.active = 2
          } else{
            this.$message.error('导入失败')
          }
        } else {
          this.timer = setTimeout(() => {
            this.ifImportComplete()
          }, 2000)
        }
      })
    },
    // 取消
    cancel() {
      this.$confirm("确定取消？", "取消提示", {
        customClass: "custom-confirm",
        type: "warning",
        center: true
      }).then(() => {
        this.navigateToList()
      })
    },
    navigateToList() {
      this.$router.push({
        path: '/serviceMerchant/trademark/index',
        query: {
          activeName: 'secondSort'
        }
      })
    },
    // 下载错误数据
    downloadErrorData() {
      downLoadFailFile(this.uploadData).then(res => {
        util.exportExcel(res)
      })
    },
    ...mapMutations(["closeTag"]),
    // 关闭页面
    close() {
      this.closeTag(this.$route)
      this.navigateToList()
    }
  },
  created() {
    getCountryTemplates().then(res=> {
      if(res.code === 0) {
        const { data } = res
        if(Object.keys(data).length) {
          for(let key in data) {
            let temp = {
              countryName: key,
              templateUrl: data[key]
            }
            this.templateCountryList.push(temp)
          }
        }
      }
    })
  },
  beforeDestroy() {
    if(this.timer) {
      clearTimeout(this.timer)
    }
  }
}
</script>

<style lang="scss" scoped>
.import-subclass-wrapper {
  padding: 10px;
  margin: 10px;
  background-color: #fff;
  min-height: calc(100% - 20px);
  position: relative;
  .step-wrapper {
    font-size: 14px;
    padding: 20px;
    .content {
      padding-left: 30px;
      width: 703px;
      margin: 20px 0;
      .text-default{
        margin:  10px 0;
        font-weight: bold;
      }
      .tip {
        margin-bottom: 20px;
      }
      .list-item {
        padding-left: 20px;
        margin-bottom: 20px;
        line-height: 24px;
      }
    }
    .upload-wrapper {
      display: flex;
      align-items: center;
      padding: 30px;
      .upload-input {
        width: 300px;
        margin-right: 20px;
      }
    }
    .upload-error {
      margin-left: 15px;
      margin-top: -30px;
      width: 300px;
      background: none;
    }
    .btn-group {
      text-align: center;
      padding: 50px;
    }
    .warning-msg {
      margin-bottom: 20px;
    }
    .el-icon-warning {
      font-size: 16px;
      color: red;
    }
    .bottom-area {
      position: fixed;
      bottom: 10px;
      left: 210px;
      right: 0;
      height: 60px;
      line-height: 60px;
      background-color: #f1f1f1;
      text-align: right;
      padding-right: 20px;
      z-index: 10;
    }
    .download {
      margin-bottom: 20px;
    }
  }
  ::v-deep .el-table__body-wrapper {
    max-height: calc(100vh - 420px) !important;
    overflow-y: auto;
  }
}
::v-deep .el-upload{
  max-width: 300px;
  max-height: 120px;
  // padding: 20px;
  box-sizing: border-box;
  .el-upload-dragger {
    width: 300px;
    height: 120px;
  }
  .drag-wrapper {
    padding: 30px;
  }
}
</style>
