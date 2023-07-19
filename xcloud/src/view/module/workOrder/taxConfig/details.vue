<template>
  <div class="app-container">
    <header>
      <BackHerader @back="goback" title="查看详情"></BackHerader>
      <div class="top itemTem">
        <div class="serverCountry">
          <!-- <span>服务国家:</span> -->
          <Tmp tName="服务国家" :tVal="setCountry(fieldForm.countryCode)"></Tmp>
        </div>
        <div class="serverTraders">
          <Tmp tName="服务商" :tVal="setSupplier(fieldForm.supplierId) || '暂无数据'"></Tmp>
        </div>
      </div>
    </header>

    <!-- 表单 -->
    <div class="form-container">
      <!-- 应用属性 -->
      <div class="lattice">
        <Title class="title" titieName="选择服务"></Title>
        <div class="itemTem">
          <Tmp tName="税确名称" :tVal="fieldForm.templateName"></Tmp>
          <Tmp tName="工单类型" :tVal="workOrderTypeTxt"></Tmp>
          <Tmp tName="国家" :tVal="setCountry(fieldForm.countryCode)"></Tmp>
          <Tmp tName="服务商" :tVal="setSupplier(fieldForm.supplierId) || '暂无数据'"></Tmp>
        </div>
      </div>
      <div class="lattice">
        <Title class="title" titieName="上传模板"></Title>
        <div class="itemTem">
          <Tmp tName="月报申报格式" :tVal="setViewData(fieldForm.monthPeriodFormat, monthData, 'value', 'label') || '暂无数据'"></Tmp>
          <Tmp tName="季报申报格式" :tVal="setViewData(fieldForm.quarterPeriodFormat, quarterData, 'value', 'label') || '暂无数据'"></Tmp>
          <Tmp tName="汇款备注/附言" :tVal="fieldForm.remark || '暂无数据'"></Tmp>
          <div class="item">
            确税文件:
            <el-button type="text" @click="viewFile(fieldForm.templateUrl)">{{ fieldForm.templateUrl }}</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { findCountrys, findSuppliers, getTax, editTax } from "@/api/newApi/processFields/processConfig";
import { workFunctionListByCode } from '@/api/newApi/workOrder/typeConfig.js';
import BackHerader from "@/components/backHerader";
import FormTitle from "@/components/WorkOrderComponents/FormTitle";
import Title from "@/components/title/index";
import { cloneDeep } from "lodash";
const Tmp = {
  props: {
    tName: String,
    tVal: String,
  },

  template: `<div><span class="name">{{tName}}: </span>{{ tVal }}</div> `,
};
export default {
  components: {
    BackHerader,
    FormTitle,
    Title,
    Tmp,
  },
  data() {
    return {
      workOrderTypeTxt:'',
      uploadUrl: this.baseUrl + "/file/oss/upload",
      // 商品，国家，服务商，状态
      productList: [
        { label: "VAT", value: 1 },
        { label: "IOSS", value: 2 },
      ],
      countryList: [],
      supplierList: [],
      // 字段配置
      fieldForm: {
        templateName: "",
        functionCode: "",
        workOrderType:"",
        countryCode: "",
        supplierId: "",
        monthPeriodFormat: "",
        quarterPeriodFormat: "",
        previewFile: "",
        templateUrl: "",
      },
      fieldFormRules: {
        templateName: [{ required: true, message: "请输入模板名称", trigger: "blur" }],
        functionCode: [{ required: true, message: "请选择业务分类", trigger: "blur" }],
        countryCode: [{ required: true, message: "请选择国家", trigger: "blur" }],
        supplierId: [{ required: true, message: "请选择服务商", trigger: "blur" }],
        templateUrl: [{ required: true, message: "请上传模板文件", trigger: "blur" }],
        // monthPeriodFormat: [{ required: true, message: '请输入月报时间', trigger: 'blur' }],
        // quarterPeriodFormat: [{ required: true, message: '请输入季报时间', trigger: 'blur' }]
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
      monthData: [
        { label: "10/2021", value: "MONTH_1" },
        { label: "10-2021", value: "MONTH_2" },
        { label: "2021-10", value: "MONTH_3" },
      ],
      quarterData: [
        { label: "2021-01-01 to 2021-03-31", value: "QUARTER_1" },
        { label: "12/2020 - 12/2020", value: "QUARTER_2" },
        { label: "2021Q3", value: "QUARTER_3" },
        { label: "Q3_2021", value: "QUARTER_4" },
        { label: "01st Jun~31st Aug 2021", value: "QUARTER_5" },
      ],
    };
  },

  filters: {
    formatId: function (value) {
      return "sdfsd";
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
    // await this.queryProductList()
    await this.queryCountryList();
    await this.querySupplierList();
  },
  methods: {
    viewFile(url) {
      window.open(url);
    },
    goback() {
      this.$router.push({
        path: "/workOrder/taxConfig/index",
      });
    },
    // 业务分类
    setCountry(val) {
      let newVal = "";
      this.countryList.forEach((ele) => {
        if (ele.countryCode == val) {
          newVal = ele.countryNameZh;
        }
      });
      return newVal;
    },
    // 根据 code活动国家
    setFunctionName(val) {
      let newVal = "";
      this.productList.forEach((ele) => {
        if (ele.code == val) {
          newVal = ele.name;
        }
      });
      return newVal;
    },
    // 服务商
    setSupplier(val) {
      let newVal = "";
      this.supplierList.forEach((ele) => {
        if (ele.supplierId == val) {
          newVal = ele.shortName;
        }
      });
      return newVal;
    },

    setViewData(val, List, key, value) {
      let newVal = "";
      List.forEach((ele) => {
        if (ele[key] == val) {
          newVal = ele[value];
        }
      });
      return newVal;
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
      findSuppliers({
        // productCategoryId: this.fieldForm.functionId,
        countryCode: this.fieldForm.countryCode,
        page: 1,
        limit: 9999,
      }).then((res) => {
        if (res.code === 0) {
          this.supplierList = res.data.records;
        }
      });
    },

    getTax() {
      getTax({ id: this.tempId }).then((res) => {
        if (res.code === 0) {
          console.log(res);
          this.fieldForm = res.data;
          if (this.fieldForm.templateUrl !== "") {
            this.templateFileList.push({
              name: this.getFileName(this.fieldForm.templateUrl),
              url: this.fieldForm.templateUrl,
            });
          }
          // 获得参数，请求节点信息
          // this.getFlowInfos()
          workFunctionListByCode({code:this.fieldForm.functionCode}).then(res => {
            if(res.data.name) this.workOrderTypeTxt = `${res.data.category.name}/${res.data.name}`
          })
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
      if (!url) return "";
      return url.substring(url.lastIndexOf("/") + 1);
    },

    previewUploadRemove() {
      this.fieldForm.previewFile = "";
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
      this.fieldForm.templateUrl = "";
      this.templateFileList = [];
    },

    templateUploadProgress(event, file, fileList) {
      console.log(file);
    },

    beforeFileUpload(file) {
      var fileType = file.name.substring(file.name.lastIndexOf(".") + 1);
      const isJPG = fileType === "pdf";
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isJPG) {
        this.$message.error("上传的文件只能是pdf格式!");
      }
      if (!isLt5M) {
        this.$message.error("上传的文件大小不能超过 5MB!");
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
                this.$Message.success("操作成功");
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
      this.$confirm("若取消，您的模板不会被保存!", "确认提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.goback();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
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
  // display: grid;
  // grid-template-rows: 14.8% 84.9%;
  header {
    background: #fff;
    padding-left: 30px;
    .el-page-header {
      // padding: 20px 0px 30px 0px;
      height: 56px;
      align-items: center;
      .el-page-header__left {
        display: flex;
        align-items: baseline;
      }
      border-bottom: 1px solid #eeeeee;
    }
    .top {
      height: 70px;
      line-height: 70px;
    }
  }
  .title {
    margin: 30px 0px 30px 0px;
  }
  .form-container {
    background: #fff;
    padding: 30px;
    margin-top: 10px;
    border-radius: 4px;
    height: calc(100vh - 250px);
    .type-options {
      background: #f5f5f5;
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
  }
  .remarks {
    height: 17px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.45);
    line-height: 17px;
  }

  .lattice {
    border: 1px solid #eeeeee;
    padding-left: 19px;
    padding-right: 19px;
    padding-bottom: 35px;
    margin-top: 30px;
    .item {
      white-space: nowrap;
      overflow: hidden;
    }
  }
}

.itemTem {
  display: grid;
  grid-template-columns: repeat(4, 25%);
}
</style>
<style lang="less">
.page-header {
  .el-page-header__left::after {
    background: none;
  }
}
</style>
