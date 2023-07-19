<template>
  <div class="container">
    <!-- <div class="title" style="padding-bottom: 16px">
      {{ info.currentNodeCode | filterKey(currentCodeList) }}
      <span class="line">（{{ info.countryNameEn }}税务稽查）</span>
      <span class="import-templates" @click="$refs.dynamicForm.importTemplatesModal = true">使用模版导入</span>
    </div> -->
    <div class="headContent">
      <div class="fill-information-title">
        <img @click="$router.push('/myVantService')" src="@/assets/images/common/dynamicForm/icon_fanhui2x.png" /><span
          v-if="$store.state.app.stepIndex != 3"
          >填写</span
        >【{{ info.countryNameEn }}税务稽查】服务资料
        <span
          class="import-using-templates"
          v-if="$store.state.app.stepIndex == 2"
          @click="$refs.dynamicForm.importTemplatesModal = true"
          ><img src="@/assets/images/common/downloadIcon.png" />使用模板导入</span
        >
      </div>
    </div>
    <div class="content">
      <DynamicForm
        ref="dynamicForm"
        :moduleList="dataReview"
        @formsubmit="getInfo"
        :isCancel="isCancel"
        :showSubmit="isEdit"
        :showSave="true"
        taxInspection
        :taxInspectionCountry="info.countryNameZh"
        :workOrderId="id"
        :workInfo="info"
      />
    </div>
  </div>
</template>

<script>
import DynamicForm from '@/components/DynamicForm/dynamicForm'; //表单配置
import { getDetail, submitInfo } from '@/api/taxInspection';
import { getNodeField } from '@/api/taxRegister.js';
import mixin from '@/views/home/mixin';
import vatLink from '@/views/home/mixin/vatLink';
import isServiceCancel from '@/views/home/mixin/isServiceCancel';
import { currentCodeList, currentCodeEnum } from '@/views/userManage/setting/staticList.js';
import { workOrderCommonOperator } from '@/components/DynamicForm/commonOperator.js';
export default {
  data() {
    return {
      id: this.$route.query.id,
      countryCode: this.$route.query.countryCode,
      info: {},
      moduleList: [],
      nodeCodeObj: {
        WAIT_UPLOAD: currentCodeEnum.NODE2, //待上传
        PENDING: currentCodeEnum.NODE3, // 待处理
        PROCESSING: currentCodeEnum.NODE7, // 处理中
        COMPLETE: currentCodeEnum.NODE8, // 已完成
      },
      currentCodeList,
      currentCodeEnum,
    };
  },
  components: {
    DynamicForm,
  },
  mixins: [mixin, vatLink, isServiceCancel],
  computed: {
    isEdit() {
      return this.info.currentNodeCode === this.nodeCodeObj.WAIT_UPLOAD;
    },
  },
  filters: {
    filterKey(value, list, findKey = 'value', filterKey = 'label') {
      let temp = list.find((item) => item[findKey] === value);
      return temp ? temp[filterKey] : value;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      await this.getCountryList();
      this.getInfo();
    },
    getInfo() {
      workOrderCommonOperator('detail', this.id).then((res) => {
        this.info = res.data;
        localStorage.workflowId = this.info.flowId || this.info.workflowId;
        this.ifCancel(res.data.status);
        if (res.data.dataReview && res.data.dataReview.length) {
          this.moduleList = res.data.dataReview;
        } else {
          this.getData();
        }
      });
    },
    /** 初始化字段模板 */
    getData() {
      getNodeField({
        nodeCode: this.info.currentNodeCode,
        nodeId: '',
        workFlowId: this.info.workflowId,
      })
        .then((res) => {
          this.moduleList = res.data;
        })
        .catch((err) => {
          this.$Message.error(err.message);
        });
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.$store.state.app.stepIndex == 2) {
      this.$Modal.confirm({
        title: '是否保存内容后再离开？',
        content: '选择确定后，系统会保存本次您填写的内容，方便您下次继续提交',
        okText: '保存后离开',
        cancelText: '直接离开',
        onOk: () => {
          let materialData = this.$refs.dynamicForm.getMaterial();
          workOrderCommonOperator('save', {
            material: materialData,
            workOrderId: this.id,
          }).then((res) => {
            if (res.code == 0) {
              this.$Message.success('保存成功');
              next();
            }
          });
        },
        onCancel: () => {
          next();
        },
      });
      next(false);
    } else {
      next();
    }
  },
};
</script>

<style lang="less" scoped>
.title {
  background-color: rgba(255, 255, 255, 1);
  font-size: 20px;
  font-weight: 600;
  border-bottom: 1px solid #e8e8e8;
  padding: 0 24px;
  .line {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    font-weight: 400;
  }
}
.import-templates {
  float: right;
  font-size: 16px;
  font-weight: normal;
  color: #3a7fff;
  cursor: pointer;
}
.headContent {
  background: #ffffff;
  padding: 0px 24px 0px;
  overflow: hidden;
  border-bottom: 1px solid #f0f0f0;
}
</style>
