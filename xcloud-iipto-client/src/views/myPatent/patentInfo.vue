<template>
  <div class="content">
    <DynamicForm
      ref="dynamicForm"
      :moduleList="dataReview"
      :showSubmit="false"
      :showSave="false"
      :colspan="12"
      :serviceNo="serviceInfo.serviceNo"
      :isOld="true"
    />
  </div>
</template>

<script>
import '@/assets/style/common.less';
import DynamicForm from '@/components/DynamicForm/dynamicForm'; // 表单配置
import { getPatentDetail } from '@/api/myPatent';
export default {
  data() {
    return {
      moduleList: [],
      serviceId: this.$route.params.id,
      isEdit: false,
      serviceInfo: {},
    };
  },
  components: {
    DynamicForm,
  },
  mounted() {
    this.getDetail();
  },
  computed: {
    dataReview() {
      this.moduleList.forEach((pro) => {
        pro.columns.forEach((item, i) => {
          if (!item.hasOwnProperty('disabled')) {
            this.$set(item, 'disabled', !this.isEdit);
          } else {
            item.disabled = !this.isEdit;
          }
          let hiddenList = [];
          switch (this.serviceInfo.modelingDrawType) {
            // 1仅建模，隐藏建模，是建模后再绘图，包含建模绘图
            // 3建模绘图，隐藏建模和绘图
            case 1:
            case 3:
              hiddenList = ['modelingFile', 'drawingFile'];
              break;
            case 2:
              // 仅绘图，隐藏绘图
              hiddenList = ['drawingFile'];
              break;
            default:
              hiddenList = ['productProtection'];
              // 0:无建模绘图，不处理
              break;
          }
          if (hiddenList.includes(item.keyName)) {
            item.inputType = 'hidden';
          }
        });
      });
      return this.moduleList;
    },
  },
  methods: {
    // 详情
    getDetail() {
      getPatentDetail(this.serviceId).then((res) => {
        if (res.code === 0) {
          this.serviceInfo = res.data.serviceInfo;
          if (res.data.dataReview.length) {
            this.moduleList = res.data.dataReview;
          }
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  padding: 20px 0 0;
}
/deep/ .ivu-form-item-content .text-tips {
  color: #bbb;
}
</style>
