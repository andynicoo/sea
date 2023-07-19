<template>
  <div class="app-container">
    <BackHerader @back="goback" :title="tempId ? (preView ? '查看详情' : '更换模板') : '新增模板'"></BackHerader>
    <!-- 表单 -->
    <div class="form-container">
      <!-- 应用属性 -->
      <!-- <h3>选择服务</h3> -->
      <FormTitle value="选择服务" style="margin-bottom: 20px"></FormTitle>
      <el-form label-width="140px" ref="fieldFormRef" :model="fieldForm" :rules="fieldFormRules" v-loading="pageLoading">
        <el-form-item label="模板名称" prop="templateName">
          <el-input v-model="fieldForm.templateName" placeholder="模板名称" clearable style="width: 360px" :disabled="preView" />
        </el-form-item>
        <el-form-item label="工单类型" prop="workOrderType">
          <el-cascader @change="workOrderTypeChange" style="width: 360px" :props="{ value: 'code', label: 'name', children: 'workFunctionList' }" v-model="fieldForm.workOrderType" :options="workOrderTypeList"></el-cascader>
        </el-form-item>
        <el-form-item label="国家" prop="countryCode">
          <el-select style="width: 360px" v-model="fieldForm.countryCode" @change="getFlowInfos" clearable filterable placeholder="选择国家" :disabled="preView">
            <el-option :value="item.countryCode" :label="item.countryNameZh" v-for="item in countryList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务商" prop="supplierId">
          <el-select v-model="fieldForm.supplierId" placeholder="选择服务商" clearable filterable popper-class="supplier-table" style="width: 360px" @change="getFlowInfos" :disabled="preView">
            <el-option value disabled class="supplier-table-head">
              <el-row>
                <!-- <el-col :span="8">全称</el-col> -->
                <el-col :span="12">简称</el-col>
                <el-col :span="12">服务商编码</el-col>
              </el-row>
            </el-option>
            <div class="el-select-dropdown__empty" v-if="supplierList.length == 0">暂无数据</div>
            <el-option class="supplier-table-td" :value="item.id" :label="item.shortName" v-for="item in supplierList" :key="item.id">
              <el-row>
                <el-col :span="12">{{ item.shortName }}</el-col>
                <el-col :span="12">
                  {{ item.supplierCode }}
                </el-col>
              </el-row>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应用到节点" prop="nodeIds">
          <el-checkbox-group v-model="fieldForm.nodeIds" v-if="flowInfo.length" :disabled="preView">
            <el-checkbox v-for="t in flowInfo" :key="t.nodeId" :label="t.nodeId">
              {{ t.nodeName }}
            </el-checkbox>
          </el-checkbox-group>
          <div v-else>
            <el-tooltip class="item" effect="dark" content="请先选择业务分类、国家、服务商" placement="top-start">
              <span>--</span>
            </el-tooltip>
          </div>
          <span v-if="getNodeIdsing">节点加载中...</span>
        </el-form-item>
        <!-- ---- {{ fieldForm }} -->
        <el-form-item label="是否应用到客户端" prop="applyPlatform">
          <el-radio-group v-model="fieldForm.applyPlatform">
            <el-radio :label="2">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="定位到客户端字段" prop="columnId" v-if="fieldForm.applyPlatform == 1">
          <el-button @click="openFieldSelection('client')">选择在客户端要定位到的字段</el-button>
        </el-form-item>

        <!-- <h3>上传模板</h3> -->
        <FormTitle class="title" value="上传模板"></FormTitle>
        <!-- 附加信息 -->
        <el-form-item label="选择字段" prop="columnIds">
          <el-button @click="openFieldSelection('template')">选择要填充到模板中的字段</el-button>
        </el-form-item>
        <el-form-item label="下载文件命名" prop="renameText">
          <el-input v-model="fieldForm.renameText" placeholder="下载文件命名" clearable style="width: 360px" :disabled="preView" />
        </el-form-item>
        <el-form-item label="模板文件" prop="templateUrl">
          <div v-show="!preView">
            <el-upload class="upload-demo" :action="uploadUrl" :on-success="templateUploadSuccess" :on-remove="templateUploadRemove" :file-list="templateFileList" :before-upload="beforeFileUpload" drag :limit="1" :multiple="false" style="width: 360px">
              <img style="margin-top: 10%" src="@/assets/images/zt-upgrade-1/upload.svg" alt="" />
              <div class="el-upload__text">
                <!-- 将文件拖到此处，或
                <em>点击上传</em> -->
                <p>点击或将文件拖拽到这里上传</p>
                <span>支持格式：pdf/doc/docx/csv/xls/xlsx</span>
              </div>
            </el-upload>

            <div class="tipsWarning" v-show="!templateFileList.length">
              <i class="el-icon-warning"></i>
              <span>注：文件大小不超过5M</span>
            </div>
          </div>
          <div v-show="preView">
            <a @click="viewFile(fieldForm.templateUrl)">
              {{ fieldForm.templateUrl }}
            </a>
          </div>
        </el-form-item>
        <el-form-item v-show="!preView">
          <el-button type="primary" :loading="submitting" @click="handleSubmit">保存</el-button>
          <el-button @click="sureCancal()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="选择字段" :visible.sync="dialogVisible" destroy-on-close>
      <FieldSelection :columnIds="columnIds" @cancel="cancel" :keyName="fieldSelection" @submit="submit" />
    </el-dialog>
  </div>
</template>
<script>
import { findProducts, findCountrys, getDownload, editTemp, getFlowInfo } from '@/api/newApi/processFields/processConfig';
import { workCategoryList, workFunctionListByCode } from '@/api/newApi/workOrder/typeConfig.js';
import FieldSelection from './components/FieldSelection';
import { cloneDeep } from 'lodash';
import BackHerader from '@/components/backHerader';
import FormTitle from '@/components/WorkOrderComponents/FormTitle';
import { supplierFunctionCode } from '@/api/newApi/workOrder/processConfiguration';
export default {
  components: {
    FieldSelection,
    BackHerader,
    FormTitle,
  },
  data() {
    return {
      //工单类型列表
      workOrderTypeList: [],
      uploadUrl: this.baseUrl + '/file/oss/upload',
      // 商品，国家，服务商，状态
      productList: [],
      countryList: [],
      supplierList: [],
      // 字段配置
      fieldForm: {
        templateName: '',
        functionCode: '',
        workOrderType: '',
        countryCode: '',
        applyPlatform: 2,
        supplierId: '',
        nodeIds: [],
        columnIds: [],
        renameText: '',
        previewFile: '',
        templateUrl: '',
        columnId: '',
      },
      fieldFormRules: {
        templateName: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
        functionCode: [{ required: true, message: '请选择业务分类', trigger: 'blur' }],
        countryCode: [{ required: true, message: '请选择国家', trigger: 'blur' }],
        supplierId: [{ required: true, message: '请选择业务分类', trigger: 'blur' }],
        renameText: [{ required: true, message: '请输入文件命名', trigger: 'blur' }],
        templateUrl: [{ required: true, message: '请上传模板文件', trigger: 'blur' }],
        nodeIds: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个节点',
            trigger: 'change',
          },
        ],
        columnIds: [{ type: 'array', required: true, message: '请至少选择一个字段', trigger: 'change' }],
        columnId: [{ required: true, message: '请选择在客户端要定位到的字段', trigger: 'change' }],
        applyPlatform: [{ required: true, message: '请选择是否应用到客户端', trigger: 'blur' }],
      },
      // 示例文件和模板文件列表
      previewFileList: [],
      templateFileList: [],
      // 下拉框固定选项的列表
      selectFixedList: [],
      tempId: null,
      submitting: false,
      pageLoading: false,
      flowInfo: {}, // 节点信息
      flowId: '', // 节点id
      preView: false,
      getNodeIdsing: false,
      dialogVisible: false,
      listParams: {},
      scene: '',
      columnIds: [],
      fieldSelection: '',
    };
  },

  filters: {
    formatId: function (value) {
      return 'sdfsd';
    },
  },
  async created() {
    this.tempId = this.$route.query.tempId;
    this.preView = !!this.$route.query.preView;
    // 根据id查询模板资料
    this.pageLoading = true;
    if (this.tempId) {
      await this.getDownload();
    }
    this.pageLoading = false;
  },
  async mounted() {
    // await this.queryProductList();
    await this.queryCountryList();
    workCategoryList().then((res) => {
      if (res.code === 0) {
        res.data.forEach((item) => {
          item.code = 'i' + item.id;
        });
        this.workOrderTypeList = res.data;
      }
    });
  },
  methods: {
    //选择工单类型
    workOrderTypeChange(val) {
      if (!val) return;
      let currWorkList = '';
      this.workOrderTypeList.forEach((item) => {
        if (item.code == val[0]) {
          currWorkList = item.workFunctionList.filter((work) => work.code == val[1])[0];
        }
      });
      this.fieldForm.functionCode = currWorkList.code;
      this.querySupplierList();
    },
    viewFile(url) {
      window.open(url);
    },
    goback() {
      this.$router.push({
        path: '/workOrder/downloadConfig/index',
        name: 'xcloudplat_workOrder_downloadConfig',
        params: {
          moduleId: this.fieldForm.moduleId,
        },
      });
    },
    // 定位到字段
    openFieldSelection(key) {
      this.fieldSelection = key;
      if (key == 'template') {
        this.columnIds = this.fieldForm.columnIds;
      }
      if (key == 'client') {
        this.columnIds = this.fieldForm.columnId && this.fieldForm.columnId != '0' ? [this.fieldForm.columnId] : [];
      }
      this.dialogVisible = true;
    },
    // 业务分类
    queryProductList() {
      findProducts().then((res) => {
        if (res.code === 0) {
          this.productList = res.data;
        }
      });
    },
    // 国家code
    queryCountryList() {
      findCountrys().then((res) => {
        if (res.code === 0) {
          this.countryList = res.data;
        }
      });
    },
    // 服务商
    querySupplierList() {
      const { functionCode, countryCode } = this.fieldForm;
      if (!functionCode || !countryCode) return;
      supplierFunctionCode({
        functionCode: this.fieldForm.functionCode,
        countryCodeList: [this.fieldForm.countryCode],
        supplierType: this.fieldForm.workOrderType.includes('i3') ? 2 : 1,
        flow: false,
      }).then((res) => {
        if (res.code === 0) {
          this.supplierList = res.data;
        }
      });
    },

    getDownload() {
      getDownload({ id: this.tempId }).then((res) => {
        if (res.code === 0) {
          res.data.nodeIds = res.data.nodeIds.split(',');
          res.data.columnIds = res.data.columnIds.split(',');
          this.fieldForm = res.data;
          if (!res.data.applyPlatform) {
            this.$set(this.fieldForm, 'applyPlatform', 2);
          }
          if (this.fieldForm.templateUrl !== '') {
            this.templateFileList.push({
              name: this.getFileName(this.fieldForm.templateUrl),
              url: this.fieldForm.templateUrl,
            });
          }
          workFunctionListByCode({ code: this.fieldForm.functionCode }).then((res) => {
            this.fieldForm.workOrderType = ['i' + res.data.category.id, res.data.code];
            this.getFlowInfos();
          });
          // // 获得参数，请求节点信息
        } else {
          this.$Message.info(res.message);
        }
      });
    },

    getFlowInfos() {
      // 获取服务商
      this.querySupplierList();
      const params = {
        functionCode: this.fieldForm.functionCode,
        countryCode: this.fieldForm.countryCode,
        serviceProviderId: this.fieldForm.supplierId,
      };
      if (this.fieldForm.functionCode !== '' && this.fieldForm.countryCode !== '' && this.fieldForm.supplierId !== '') {
        this.getNodeIdsing = true;
        getFlowInfo(params)
          .then((res) => {
            // console.log(res);
            if (res.code === 0) {
              this.flowInfo = res.data.forwardNodes.length ? res.data.forwardNodes : [];
              this.flowId = res.data.flowId;
            }
          })
          .catch((err) => {
            this.flowInfo = [];
            this.fieldForm.nodeIds = [];
          })
          .finally(() => {
            this.getNodeIdsing = false;
          });
      }
    },

    // 获得文件名称
    getFileName(url) {
      if (!url) return '';
      return url.substring(url.lastIndexOf('/') + 1);
    },

    previewUploadRemove() {
      this.fieldForm.previewFile = '';
      this.previewFileList = [];
    },
    /**
     * 模板文件
     */
    templateUploadSuccess(response, file, fileList) {
      this.fieldForm.templateUrl = response.data.fileUrl;
      this.templateFileList.push({
        name: response.data.origFileName,
        url: response.data.fileUrl,
      });
    },
    templateUploadRemove() {
      this.fieldForm.templateUrl = '';
      this.templateFileList = [];
    },

    beforeFileUpload(file) {
      var fileType = file.name.substring(file.name.lastIndexOf('.') + 1);
      const isJPG = fileType === 'pdf' || fileType === 'doc' || fileType === 'docx' || fileType === 'csv' || fileType === 'xls' || fileType === 'xlsx';
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isJPG) {
        this.$message.error('上传的文件只能是pdf/doc/docx/csv/xls/xlsx 格式!');
      }
      if (!isLt5M) {
        this.$message.error('上传的文件大小不能超过 5MB!');
      }
      return isJPG && isLt5M;
    },

    /**
     * 提交表单
     */
    handleSubmit() {
      this.$refs.fieldFormRef.validate((valid) => {
        if (valid) {
          this.submitting = true;
          var forms = cloneDeep(this.fieldForm);
          forms.nodeIds = forms.nodeIds.filter((item) => item !== '').toString();
          // forms.nodeIds = forms.nodeIds.toString()
          forms.columnIds = forms.columnIds.toString();
          var params = {
            id: this.tempId,
            ...forms,
            flowId: this.flowId,
          };
          editTemp(params)
            .then((res) => {
              // console.log(res);
              if (res.code === 0) {
                this.$Message.success('操作成功');
                this.goback();
              } else {
                this.$Message.info(res.message);
              }
            })
            .finally(() => {
              this.submitting = false;
            });
        }
      });
    },
    sureCancal() {
      this.$confirm('若取消，您的模板不会被保存!', '确认提示', {
        customClass: 'custom-confirm',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      })
        .then(() => {
          this.goback();
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          });
        });
    },
    cancel() {
      this.dialogVisible = false;
    },
    submit(data) {
      if (this.fieldSelection == 'template') {
        this.fieldForm.columnIds = data;
      }
      if (this.fieldSelection == 'client') {
        this.fieldForm.columnId = data[0];
      }
      this.dialogVisible = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  // height: 100%;
  position: relative;
  background: #fff;
  padding: 0px 30px 30px;
  .el-page-header {
    padding: 20px 0px 30px 0px;
    .el-page-header__left {
      display: flex;
      align-items: baseline;
    }
  }
  .title {
    margin: 30px 0px 30px 0px;
  }
  .page-header {
    padding: 16px;
    border-radius: 4px;
    margin-bottom: 16px;
  }
  .form-container {
    background: #fff;
    // padding: 16px;
    border-radius: 4px;
    .type-options {
      background: #f5f5f5;
    }
    .el-upload__text {
      p {
        height: 17px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 0.85);
        line-height: 17px;
      }
      span {
        height: 17px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
        line-height: 17px;
      }
    }
    .tipsWarning {
      display: flex;
      align-items: center;
      i {
        color: rgba(240, 185, 85, 1);
      }
      span {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 17px;
      }
    }
  }
}
</style>
<style lang="less">
.page-header {
}
</style>
