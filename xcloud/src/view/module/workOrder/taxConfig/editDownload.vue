<template>
  <div class="app-container">
    <!-- <el-page-header @back="goback" :title="tempId ? '更换模板' : '新增模板'" class="page-header" /> -->
    <BackHerader @back="goback" :title="tempId ? (preView ? '查看详情' : '更换模板') : '新增模板'" class="page-header"> </BackHerader>
    <!-- 表单 -->
    <div class="form-container">
      <!-- 应用属性 -->
      <el-form label-width="130px" ref="fieldFormRef" :model="fieldForm" :rules="fieldFormRules" v-loading="pageLoading">
        <FormTitle value="选择服务" class="edTitle"></FormTitle>
        <el-form-item label="税确名称" prop="templateName">
          <el-input v-model="fieldForm.templateName" placeholder="税确名称" clearable style="width: 360px" :disabled="preView" />
        </el-form-item>
        <el-form-item label="业务分类" prop="functionCode">
          <el-select style="width: 360px" v-model="fieldForm.functionCode" placeholder="选择业务分类" clearable filterable :disabled="preView">
            <el-option :value="item.value" :label="item.label" v-for="item in productList" :key="item.value"></el-option>
          </el-select>
          <!-- <el-cascader @change="workOrderTypeChange" style="width: 360px" :props="{ value: 'code', label: 'name', children: 'workFunctionList' }" v-model="fieldForm.workOrderType" :options="workOrderTypeList"></el-cascader> -->
        </el-form-item>
        <el-form-item label="国家" prop="countryCode">
          <el-select style="width: 360px" v-model="fieldForm.countryCode" @change="getFlowInfos" clearable filterable placeholder="选择国家" :disabled="preView">
            <el-option :value="item.countryCode" :label="item.countryNameZh" v-for="item in countryList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务商" prop="supplierId">
          <el-select v-model="fieldForm.supplierId" placeholder="选择服务商" clearable filterable popper-class="supplier-table" style="width: 360px" :disabled="preView">
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
                <!-- <el-col :span="8">
                  {{ item.supplierName.length > 9 ? item.supplierName.slice(0, 9) + "..." : item.supplierName }}
                </el-col> -->
                <el-col :span="12">{{ item.shortName }}</el-col>
                <el-col :span="12">
                  {{ item.supplierCode }}
                  <!-- {{ item.supplierType == 1 ? "服务商" : item.supplierType == 2 ? "律师" : "" }} -->
                </el-col>
              </el-row>
            </el-option>
          </el-select>
        </el-form-item>

        <!-- <h3>上传模板</h3> -->
        <!-- 附加信息 -->
        <FormTitle value="上传模板" class="edTitle"></FormTitle>
        <el-form-item label="月报申报格式" prop="monthPeriodFormat">
          <el-select v-model="fieldForm.monthPeriodFormat" placeholder="请选择" :disabled="preView" style="width: 360px" filterable>
            <el-option v-for="item in monthData" :key="item.periodFormat" :label="item.formatExample" :value="item.periodFormat"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="汇款备注/附言" prop="remark">
          <el-row :gutter="10">
            <el-col :span="6.5">
              <el-input v-model="fieldForm.remark" placeholder="请输入服务商要求的汇款备注" clearable style="width: 360px; margin-right: 15px" :disabled="preView" />
              <el-dropdown @command="(value) => insertVariable(value, 1)" v-model="fieldForm.input1">
                <el-button type="success">
                  插入变量
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="item in remarkList" :key="item.value" :command="item">
                    {{ item.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
            <el-col :span="6">
              <span style="padding-left: 10px">
                <i class="el-icon-warning" style="color: #ff9900; padding-right: 12px"></i>
                <span class="text-tips item-tip" style="padding: 10px 0"> 备注中的变量需用变量符号标记 </span>
              </span>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="月报" v-if="fieldForm.remark.includes('{申报周期}')">
          <el-select v-model="fieldForm.remarkMonthPeriodFormat" placeholder="请选择" :disabled="preView" style="width: 200px" filterable>
            <el-option v-for="item in monthData" :key="item.periodFormat" :label="item.formatExample" :value="item.periodFormat"></el-option>
          </el-select>
          <!-- 将选择的下拉选项的remark输出 -->
          <p class="extantinfo">
            {{ monthData.filter((ele) => ele.periodFormat === fieldForm.remarkMonthPeriodFormat).length ? monthData.filter((ele) => ele.periodFormat === fieldForm.remarkMonthPeriodFormat)[0].remark : '' }}
          </p>
        </el-form-item>
        <div class="hrbox"></div>
        <el-form-item label="季报申报格式" prop="quarterPeriodFormat">
          <el-select v-model="fieldForm.quarterPeriodFormat" placeholder="请选择" :disabled="preView" style="width: 360px" filterable>
            <el-option v-for="item in quarterData" :key="item.periodFormat" :label="item.formatExample" :value="item.periodFormat"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="汇款备注/附言" prop="remarkQuarter">
          <el-row :gutter="10">
            <el-col :span="6.5">
              <el-input v-model="fieldForm.remarkQuarter" placeholder="请输入服务商要求的汇款备注" clearable style="width: 360px; margin-right: 15px" :disabled="preView" />
              <el-dropdown @command="(value) => insertVariable(value, 2)" v-model="fieldForm.input2">
                <el-button type="success">
                  插入变量
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="item in remarkList" :key="item.value" :command="item">
                    {{ item.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
            <el-col :span="6">
              <span style="padding-left: 10px">
                <i class="el-icon-warning" style="color: #ff9900; padding-right: 12px"></i>
                <span class="text-tips item-tip" style="padding: 10px 0"> 备注中的变量需用变量符号标记 </span>
              </span>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="季报" v-if="fieldForm.remarkQuarter.includes('{申报周期}')">
          <el-select v-model="fieldForm.remarkQuarterPeriodFormat" placeholder="请选择" :disabled="preView" style="width: 200px" filterable>
            <el-option v-for="item in quarterData" :key="item.periodFormat" :label="item.formatExample" :value="item.periodFormat"></el-option>
          </el-select>
          <!-- 将选择的下拉选项的remark输出 -->
          <p class="extantinfo">
            {{ quarterData.filter((ele) => ele.periodFormat === fieldForm.remarkQuarterPeriodFormat).length ? quarterData.filter((ele) => ele.periodFormat === fieldForm.remarkQuarterPeriodFormat)[0].remark : '' }}
          </p>
        </el-form-item>
        <div class="hrbox"></div>
        <el-form-item label="年报申报格式" prop="remarkYear">
          <el-select placeholder="请选择" :disabled="preView" style="width: 360px" filterable v-model="fieldForm.yearPeriodFormat">
            <el-option key="1" label="2021" value="2021"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="汇款备注/附言" prop="remarkYear">
          <el-row :gutter="10">
            <el-col :span="6.5">
              <el-input v-model="fieldForm.remarkYear" placeholder="请输入服务商要求的汇款备注" clearable style="width: 360px; margin-right: 15px" :disabled="preView" />
              <el-dropdown @command="(value) => insertVariable(value, 3)">
                <el-button type="success">
                  插入变量
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="item in remarkList" :key="item.value" :command="item">
                    {{ item.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
            <el-col :span="6">
              <span style="padding-left: 10px">
                <i class="el-icon-warning" style="color: #ff9900; padding-right: 12px"></i>
                <span class="text-tips item-tip" style="padding: 10px 0"> 备注中的变量需用变量符号标记 </span>
              </span>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="年报" v-if="fieldForm.remarkYear.includes('{申报周期}')">
          <el-select placeholder="请选择" :disabled="preView" style="width: 200px" filterable v-model="remarkYearPeriodFormat">
            <el-option key="1" label="2021" value="2021"></el-option>
          </el-select>
          <p class="extantinfo">指年份</p>
        </el-form-item>
        <div class="hrbox"></div>
        <!-- <el-form-item label="汇款备注/附言" prop="remark">
          <el-row :gutter="10">
            <el-col :span="6.5">
              <el-input v-model="fieldForm.remark" placeholder="请输入服务商要求的汇款备注" clearable style="width: 360px; margin-right: 15px" :disabled="preView" />
              <el-dropdown @command="insertVariable">
                <el-button type="success">
                  插入变量
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="item in remarkList" :key="item.value" :command="item">
                    {{ item.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
            <el-col :span="6">
              <span style="padding-left: 10px">
                <i class="el-icon-warning" style="color: #ff9900; padding-right: 12px"></i>
                <span class="text-tips item-tip" style="padding: 10px 0"> 备注中的变量需用变量符号标记 </span>
              </span>
            </el-col>
          </el-row>
        </el-form-item> -->

        <!-- <div class="type-options" v-if="fieldForm.remark.includes('{申报周期}')">
          <el-form-item label="备注申报周期格式">
            <span style="padding-left: 10px">
              <i class="el-icon-warning" style="color: #ff9900; padding-right: 12px"></i>
              <span class="text-tips item-tip" style="padding: 10px 0"> 请按照服务商要求配置备注中的申报周期格式 </span>
            </span>
          </el-form-item>
          <el-form-item label="月报">
            <el-select v-model="fieldForm.remarkMonthPeriodFormat" placeholder="请选择" :disabled="preView"
              style="width: 200px" filterable>
              <el-option v-for="item in monthData" :key="item.periodFormat" :label="item.formatExample"
                :value="item.periodFormat"></el-option>
            </el-select>22
          </el-form-item>
          <el-form-item label="季报">
            <el-select v-model="fieldForm.remarkQuarterPeriodFormat" placeholder="请选择" :disabled="preView"
              style="width: 200px" filterable>
              <el-option v-for="item in quarterData" :key="item.periodFormat" :label="item.formatExample"
                :value="item.periodFormat"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年报">
            <el-select placeholder="请选择" :disabled="preView" style="width: 200px" filterable
              v-model="fieldForm.remarkYear">
              <el-option key="1" label="2021" value="2021"></el-option>
            </el-select>
          </el-form-item>
        </div> -->

        <!-- <div class="type-options" v-if="variableKey==='REMARK_9'">
          <el-form-item label="月报">
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div> -->

        <el-form-item label="税确文件" prop="templateUrl">
          <div v-show="!preView">
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :on-success="templateUploadSuccess"
              :on-remove="templateUploadRemove"
              :on-progress="templateUploadProgress"
              :file-list="templateFileList"
              :before-upload="beforeFileUpload"
              accept=".pdf,.docx"
              drag
              :limit="1"
              :multiple="false"
              style="width: 360px"
            >
              <!-- <div slot="file" slot-scope="{file}">
            {{file.url}}
          </div> -->
              <img style="margin-top: 10%" src="@/assets/images/zt-upgrade-1/upload.svg" alt="" />
              <div class="el-upload__text">
                <!-- 将文件拖到此处，或
                <em>点击上传</em> -->
                点击或将文件拖拽到这里上传
                <p class="remarks">支持: PDF、DOCX 格式</p>
              </div>
            </el-upload>
            <!-- <div v-show="!templateFileList.length">
              <span style="color: red">*</span>
              支持格式：pdf
            </div> -->
            <div v-show="!templateFileList.length" class="fleTips">
              <!-- <span style="color: red">*</span> tips-->
              <img src="@/assets/images/zt-upgrade-1/tips.svg" />
              注：文件大小不超过5M
            </div>
          </div>
          <div title="点击查看" @click="viewFile(fieldForm.templateUrl)">
            {{ fieldForm.templateUrl }}
          </div>
        </el-form-item>
        <el-form-item v-show="!preView">
          <el-button type="primary" :loading="submitting" @click="handleSubmit">保存</el-button>
          <el-button @click="sureCancal()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { findCountrys, newfindProcesses, getTax, editTax, getTaxConfirmTemplateApi } from '@/api/newApi/processFields/processConfig';
import { workCategoryList, workFunctionListByCode } from '@/api/newApi/workOrder/typeConfig.js';
import BackHerader from '@/components/backHerader';
import FormTitle from '@/components/WorkOrderComponents/FormTitle';
import { cloneDeep } from 'lodash';
import { getHandlerUserList } from '@/api/newApi/supplyChain/allocationRules.js';
export default {
  components: {
    BackHerader,
    FormTitle,
  },
  data() {
    return {
      //工单类型列表
      workOrderTypeList: [],
      uploadUrl: this.baseUrl + '/file/oss/upload',
      // 商品，国家，服务商，状态
      productList: [
        { label: 'VAT', value: 1 },
        { label: 'IOSS', value: 2 },
      ],
      countryList: [],
      supplierList: [],
      // 字段配置
      fieldForm: {
        templateName: '',
        functionCode: '',
        countryCode: '',
        supplierId: '',
        monthPeriodFormat: '',
        quarterPeriodFormat: '',
        yearPeriodFormat: '', // 新加
        remarkQuarterPeriodFormat: '', // 新加
        previewFile: '',
        templateUrl: '',
        remark: '',
        remarkQuarter: '', // 新加
        remarkYear: '', // 新加
        insert1: '',
        insert2: '',
        insert3: '',
      },
      remarkYearPeriodFormat: '2021', // 新加
      fieldFormRules: {
        templateName: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
        functionCode: [{ required: true, message: '请选择工单类型', trigger: 'blur' }],
        // workOrderType: [{ required: true, message: '请选择工单类型', trigger: 'blur' }],
        countryCode: [{ required: true, message: '请选择国家', trigger: 'blur' }],
        supplierId: [{ required: true, message: '请选择服务商', trigger: 'blur' }],
        templateUrl: [{ required: true, message: '请上传模板文件', trigger: 'blur' }],
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
      preView: false,
      variableKey: '', // 当前插入变量的key
      monthData: [],
      quarterData: [],
      remarkList: [
        { label: '公司英文名称', value: 'REMARK_1' },
        { label: '税号', value: 'REMARK_2' },
        { label: '服务商编码', value: 'REMARK_3' },
        { label: '发票号', value: 'REMARK_4' },
        { label: '申报周期', value: 'REMARK_5' },
        { label: 'SIRET号', value: 'REMARK_6' },
        { label: 'GIBAN号', value: 'REMARK_7' },
        { label: 'SIRET号前9位', value: 'REMARK_8' },
        { label: '月份', value: 'REMARK_9' },
        { label: '季度', value: 'REMARK_10' },
        { label: '年份', value: 'REMARK_11' },
        { label: '参考号', value: 'REMARK_12' },
        { label: 'TIN号', value: 'REMARK_13' },
      ],
      options: [
        {
          value: '选项1',
          label: '1月',
        },
        {
          value: '选项2',
          label: '2月',
        },
        {
          value: '选项3',
          label: '3月',
        },
        {
          value: '选项4',
          label: '4月',
        },
        {
          value: '选项5',
          label: '5月',
        },
      ],
      value: '',
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
      await this.getTax();
    }
    this.pageLoading = false;
  },
  async mounted() {
    await this.queryCountryList();
    await this.querySupplierList();
    await this.getTaxConfirmTemplate();
    // workCategoryList().then((res) => {
    //   if (res.code === 0) {
    //     res.data.forEach((item) => {
    //       item.code = 'i' + item.id;
    //     });
    //     this.workOrderTypeList = res.data;
    //   }
    // });
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
    },
    viewFile(url) {
      window.open(url);
    },
    goback() {
      this.$router.push({
        path: '/workOrder/taxConfig/index',
      });
    },
    // 插入变量
    insertVariable(item, index) {
      this.fieldForm[`insert${index}`] = item.label;
      this.variableKey = item.value;
      if (index === 1) {
        this.fieldForm.remark += `{${item.label}}`;
      }
      if (index === 2) {
        this.fieldForm.remarkQuarter += `{${item.label}}`;
      }
      if (index === 3) {
        this.fieldForm.remarkYear += `{${item.label}}`;
      }
    },
    // 获取申报周期格式列表
    getTaxConfirmTemplate() {
      getTaxConfirmTemplateApi().then((res) => {
        if (res.code === 0) {
          this.monthData = [];
          this.quarterData = [];
          let TaxConfirmTemplate = res.data;
          console.log(res.data);
          // 根据periodType分类
          TaxConfirmTemplate.forEach((item) => {
            if (item.periodType === 1) {
              this.monthData.push(item);
            } else if (item.periodType === 2) {
              this.quarterData.push(item);
            }
          });
        }
      });
    },
    // 业务分类
    queryProductList() {
      // findProducts().then((res) => {
      //   if (res.code === 0) {
      //     this.productList = res.data
      //   }
      // })
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
      getHandlerUserList({
        supplierType: 1,
        countryCode: this.fieldForm.countryCode,
        countryCodeList: [this.fieldForm.countryCode],
      }).then((res) => {
        if (res.code === 0) {
          this.supplierList = res.data;
        }
      });
    },

    getTax() {
      getTax({ id: this.tempId }).then((res) => {
        if (res.code === 0) {
          console.log(res);
          this.fieldForm = res.data;
          if (this.fieldForm.templateUrl !== '') {
            this.templateFileList.push({
              name: this.getFileName(this.fieldForm.templateUrl),
              url: this.fieldForm.templateUrl,
            });
          }
          // 获得参数，请求节点信息
          // this.getFlowInfos()
          workFunctionListByCode({ code: this.fieldForm.functionCode }).then((res) => {
            this.fieldForm.workOrderType = ['i' + res.data.category.id, res.data.code];
          });
        } else {
          this.$Message.info(res.message);
        }
      });
    },

    getFlowInfos() {
      // 获取服务商
      this.querySupplierList();
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

    templateUploadProgress(event, file, fileList) {
      console.log(file);
    },

    beforeFileUpload(file) {
      var fileType = file.name.substring(file.name.lastIndexOf('.') + 1);
      const isJPG = fileType === 'pdf' || fileType === 'doc' || fileType === 'docx';
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isJPG) {
        this.$message.error('上传的文件只能是PDF、DOCX、DOC格式!');
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
          var params = {
            id: this.tempId,
            ...forms,
          };
          editTax(params)
            .then((res) => {
              console.log(res);
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
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
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
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  height: 100%;
  position: relative;
  min-width: 1200px;

  .page-header {
    background: #fff;
    padding: 16px;
    border-radius: 4px;
    // margin-bottom: 16px;
  }

  .form-container {
    background: #fff;
    padding: 16px;
    border-radius: 4px;

    .type-options {
      background: #f5f5f5;
      padding: 10px;
      margin-bottom: 10px;
    }

    .edTitle {
      margin-bottom: 20px;
    }

    .fleTips {
      display: flex;
      align-items: center;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
    }

    .fleTips2 {
      background: #ffffff;
      border: 1px solid rgba(123, 123, 125, 0.25);
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      width: 209px;
      text-align: center;
      height: 27px;
      line-height: 27px;
      margin-left: 6px;
      // box-shadow: 0.25;
      // opacity: ;
      // filter: blur(2px);
    }
  }

  .remarks {
    height: 17px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.45);
    line-height: 17px;
  }
}
</style>
<style lang="less">
.page-header {
  .el-page-header__left::after {
    background: none;
  }
}

.hrbox {
  width: 950px;
  height: 1px;
  border-bottom: 1px solid #dcdcdc;
  margin-bottom: 10px;
}
.extantinfo {
  color: #ff9900;
}
</style>
