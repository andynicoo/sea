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
      <!-- <h3>选择服务</h3> -->
      <div class="lattice">
        <Title class="title" titieName="选择服务"></Title>
        <div class="itemTem">
          <Tmp tName="模板名称" :tVal="fieldForm.templateName"></Tmp>
          <Tmp tName="工单类型" :tVal="workOrderTypeTxt"></Tmp>
          <Tmp tName="国家" :tVal="setCountry(fieldForm.countryCode)"></Tmp>
          <Tmp tName="服务商" :tVal="setSupplier(fieldForm.supplierId) || '暂无数据'"></Tmp>
        </div>
      </div>
      <div class="lattice">
        <Title class="title" titieName="上传模板"></Title>
        <div class="itemTem">
          <Tmp tName="应用到节点" :tVal="nodeListInfo || '暂无数据'"></Tmp>
          <div>
            选择字段:
            <el-button type="text" @click="dialogVisible = true">选择要填充到模板中的字段</el-button>
          </div>
          <Tmp tName="下载命名文件" :tVal="fieldForm.renameText || '暂无数据'"></Tmp>
          <div class="item">
            模板文件:
            <el-button type="text" @click="viewFile(fieldForm.templateUrl)">{{ fieldForm.templateUrl }}</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="选择字段" :visible.sync="dialogVisible" width="60%" destroy-on-close>
      <FieldSelection :columnIds="fieldForm.columnIds" @cancel="cancel" @submit="submit" />
    </el-dialog>
  </div>
</template>
<script>
import { findProducts, findCountrys, findSuppliers, getDownload, editTemp, getFlowInfo } from '@/api/newApi/processFields/processConfig';
import { workFunctionListByCode } from '@/api/newApi/workOrder/typeConfig.js';
import FieldSelection from './components/FieldSelection';
import { cloneDeep } from 'lodash';
import BackHerader from '@/components/backHerader';
import Title from '@/components/title/index';
const Tmp = {
  props: {
    tName: String,
    tVal: String,
  },

  template: `<div><span class="name">{{tName}}: </span>{{ tVal }}</div> `,
};
export default {
  components: {
    FieldSelection,
    BackHerader,
    Title,
    Tmp,
  },
  data() {
    return {
      workOrderTypeTxt: '',
      uploadUrl: this.baseUrl + '/file/oss/upload',
      // 商品，国家，服务商，状态
      productList: [],
      countryList: [],
      supplierList: [],
      currentNodeName: '',
      // 字段配置
      fieldForm: {
        templateName: '',
        functionCode: '',
        countryCode: '',
        applyPlatform: 1,
        supplierId: '',
        nodeIds: [],
        columnIds: [],
        renameText: '',
        previewFile: '',
        templateUrl: '',
        serviceProviderId: '',
      },
      fieldFormRules: {
        templateName: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
        functionCode: [{ required: true, message: '请选择业务分类', trigger: 'blur' }],
        countryCode: [{ required: true, message: '请选择国家', trigger: 'blur' }],
        supplierId: [{ required: true, message: '请选择业务分类', trigger: 'blur' }],
        renameText: [{ required: true, message: '请输入文件命名', trigger: 'blur' }],
        templateUrl: [{ required: true, message: '请上传模板文件', trigger: 'blur' }],
        columnIds: [{ type: 'array', required: true, message: '请至少选择一个字段', trigger: 'change' }],
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
    };
  },

  computed: {
    nodeListInfo() {
      let item = '';

      this.fieldForm.nodeIds.forEach((val) => {
        for (const key in this.flowInfo) {
          console.log(val);
          if (val == this.flowInfo[key].nodeId) {
            item += this.flowInfo[key].nodeName + '; ';
          }
        }
      });
      return item;
    },
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
    // await this.querySupplierList()
  },
  methods: {
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
      findSuppliers({
        functionCode: this.fieldForm.functionCode,
        countryCode: this.fieldForm.countryCode,
        page: 1,
        limit: 9999,
      }).then((res) => {
        if (res.code === 0) {
          this.supplierList = res.data.records;
        }
      });
    },

    // 根据 code活动国家
    setCountry(val) {
      let newVal = '';
      this.countryList.forEach((ele) => {
        if (ele.countryCode == val) {
          newVal = ele.countryNameZh;
        }
      });
      return newVal;
    },
    // 服务商
    setSupplier(val) {
      let newVal = '';
      this.supplierList.forEach((ele) => {
        if (ele.supplierId == val) {
          newVal = ele.shortName;
        }
      });
      return newVal;
    },

    // 根据 code活动国家
    setFunctionName(val) {
      let newVal = '';
      this.productList.forEach((ele) => {
        if (ele.code == val) {
          newVal = ele.name;
        }
      });
      return newVal;
    },

    getDownload() {
      getDownload({ id: this.tempId }).then((res) => {
        if (res.code === 0) {
          res.data.nodeIds = res.data.nodeIds.split(',');
          res.data.columnIds = res.data.columnIds.split(',');
          this.fieldForm = res.data;
          console.log(res.data);
          if (!res.data.applyPlatform) {
            // this.fieldForm.applyPlatform = '2'
            this.$set(this.fieldForm, 'applyPlatform', 2);
          }
          if (this.fieldForm.templateUrl !== '') {
            this.templateFileList.push({
              name: this.getFileName(this.fieldForm.templateUrl),
              url: this.fieldForm.templateUrl,
            });
          }
          // 获得参数，请求节点信息
          this.getFlowInfos();
          workFunctionListByCode({ code: this.fieldForm.functionCode }).then((res) => {
            if (res.data.name) this.workOrderTypeTxt = `${res.data.category.name}/${res.data.name}`;
          });
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
            console.log(res);
            if (res.code === 0) {
              this.flowInfo = res.data.forwardNodes.length ? res.data.forwardNodes : [];
              this.flowId = res.data.flowId;
              this.currentNodeName = res.data.currentNodeName;
            }
          })
          .catch((err) => {
            console.log(err);
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

    cancel() {
      this.dialogVisible = false;
    },
    submit(data) {
      console.log(data);
      this.fieldForm.columnIds = data;
      this.dialogVisible = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  height: 100%;
  position: relative;
  // background: #fff;
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
  .page-header {
    padding: 16px;
    border-radius: 4px;
    margin-bottom: 16px;
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
  }
}

.itemTem {
  display: grid;
  grid-template-columns: repeat(4, 25%);
}

.item {
  white-space: nowrap;
  overflow: hidden;
}
.lattice {
  border: 1px solid #eeeeee;
  padding-left: 19px;
  padding-right: 19px;
  padding-bottom: 35px;
  margin-top: 30px;
}
</style>
<style lang="less">
.page-header {
}
</style>
