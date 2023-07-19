<!-- 新VAT注册+申报 -->
<template>
  <div class="waper">
    <!-- 头部 -->
    <div class="headContent">
      <a-affix :offset-top="top" :target="getAnchorContainer">
        <div class="fill-information-title">
          <img @click="$router.push('/myVantService')" src="@comp/images/dynamicForm/icon_fanhui2x.png" />
          【{{ detailObj.countryNameZh }}注册+申报】驳回信息
          <a class="header-btn" @click="editOtherReviews">编辑其他资料</a>
        </div>
        <div class="wait-modify-wrapper">
          <div class="wait-modify-wrapper-title">
            待改正总字段：<span class="wait-modify-wrapper-title-num">{{ totalNum }}</span
            >个
          </div>
          <div class="wait-modify-wrapper-list">
            <div
              class="wait-modify-wrapper-block"
              :class="
                $store.getters.getCompleteNum[item.moduleCode] === otherTodoNum[item.moduleCode]
                  ? 'wait-modify-wrapper-block-complete'
                  : ''
              "
              v-for="item in moduleList"
              :key="item.moduleCode"
              @click="scrollToModule(item.moduleCode)"
            >
              <template v-if="item.columns.filter((i) => i.displayFlag).length">
                <span class="wait-modify-wrapper-block-title">{{ item.moduleName }}</span>
                <span class="wait-modify-wrapper-block-count">
                  {{ $store.getters.getCompleteNum[item.moduleCode] }}/{{ otherTodoNum[item.moduleCode] }}
                </span>
                <img
                  v-if="$store.getters.getCompleteNum[item.moduleCode] === otherTodoNum[item.moduleCode]"
                  class="wait-modify-wrapper-block-icon"
                  src="@comp/assets/images/duigou.svg"
                />
              </template>
            </div>
          </div>
        </div>
      </a-affix>
      <form-create :rule="rule" class="form-create-new" :option="option" v-model="fApi" />
      <div class="btn-group">
        <Button class="keep" @click="preserveBtn">暂存</Button>
        <Button type="primary" @click="submit">提交</Button>
      </div>
    </div>
  </div>
</template>
<script>
import { dynamicForm } from '@comp/utils/dynamicForm.js';
import { workOrderCommonOperator } from '../../DynamicForm/commonOperator.js';
export default {
  data() {
    return {
      top: 60,
      moduleList: [],
      detailObj: {},
      id: this.$route.query.id,
      isCancel: false,
      option: {
        form: { labelWidth: undefined, labelPosition: 'top' },
        resetBtn: false,
        submitBtn: false,
      },
      fApi: {},
    };
  },
  filters: {
    filterDisplayLength(columns) {
      return columns.filter((column) => column.displayFlag).length;
    },
  },
  created() {
    this.$store.commit('setTotalTodoNum', 0);
    this.getWorkOrderDetail(); //获取详情
  },
  computed: {
    rule() {
      return dynamicForm(
        this.moduleList,
        {
          isReject: true,
        },
        this.fApi
      );
    },
    totalNum() {
      return this.$store.getters.getTotalTodoNum;
    },
    otherTodoNum() {
      return this.$store.getters.getOtherTodoNum;
    },
  },
  methods: {
    getAnchorContainer() {
      return document.querySelector('.main-container');
    },
    // 如果工单状态为取消中（11）或已取消（9），则禁用所有操作按钮，并给出提示
    ifCancel(status) {
      this.isCancel = status === 2 || status === 9 || status === 11;
      if (status === 11) {
        this.$Message.warning('此服务在取消中，暂时不能操作');
      } else if (status === 9) {
        this.$Message.warning('该服务已取消');
      } else if (status === 2) {
        this.$Message.warning('该服务待续费');
      }
    },
    /**  工单详情 */
    getWorkOrderDetail() {
      workOrderCommonOperator('detail', this.id).then((res) => {
        if (res.code === 0) {
          this.detailObj = res.data;
          localStorage.workflowId = this.detailObj.flowId || this.detailObj.workflowId;
          this.ifCancel(res.data.status);
          this.getRejectData(res.data.dataReview);
          setTimeout(() => {
            this.$store.commit('setOtherTodoNum', this.fApi.rule);
          });
        }
      });
    },
    getRejectData(dataReview) {
      dataReview.forEach((item) => {
        item.columns.forEach((column) => {
          column.moduleCode = item.moduleCode;
          if (['storeInfo', 'taxInfo'].includes(item.moduleCode)) {
            column.moduleCode = 'storeAndTaxInfo';
          }
          if (
            column.rejectDTO &&
            ((column.rejectDTO.annexList && column.rejectDTO.annexList.length) || column.rejectDTO.reject)
          ) {
            column.displayFlag = true;
          } else {
            column.displayFlag = false;
          }
        });
      });
      let columns = [];
      this.moduleList = dataReview
        .map((item) => {
          if (['storeInfo', 'taxInfo'].includes(item.moduleCode)) {
            columns = columns.concat(item.columns);
            return undefined;
          } else {
            return item;
          }
        })
        .concat({
          columns,
          moduleCode: 'storeAndTaxInfo',
          moduleName: '店铺和税务信息',
        })
        .filter((item) => item && item.columns.length);
    },
    scrollToModule(moduleCode) {
      let el = document.getElementById(`module-code--${moduleCode}`);
      let main = document.querySelector('.main-container');
      let top = el.getBoundingClientRect().top - 210 + main.scrollTop;
      document.querySelector('.main-container').scrollTo({
        top,
        behavior: 'smooth',
      });
    },
    editOtherReviews() {
      this.$router.push({
        path: '/registrationInformation',
        query: {
          id: this.id,
          serviceNo: this.detailObj.serviceNo,
        },
      });
    },
    // 移除对象中的空属性
    removePropertyOfNull(obj) {
      return Object.fromEntries(Object.entries(obj).filter((item) => item[1] !== ''));
    },
    preserveBtn() {
      let { testField, ...materialData } = this.fApi.form;
      let material = JSON.stringify(this.removePropertyOfNull(materialData));
      workOrderCommonOperator('save', {
        material,
        workOrderId: this.id,
      })
        .then((res) => {
          if (res.code == 0) {
            this.$Message.success('保存成功');
          }
        })
        .catch((res) => {
          this.$Message.error(res.msg);
        });
    },
    submit() {
      if (!this.totalNum) {
        this.fApi.submit(
          (formData) => {
            let { testField, ...materialData } = formData;
            let material = JSON.stringify(this.removePropertyOfNull(materialData));
            workOrderCommonOperator('commit', {
              workOrderId: this.id,
              material,
            })
              .then((res) => {
                if (res.code == 0) {
                  localStorage.backPath = '/myVantService';
                  this.$router.push('/submittedSucceeded');
                  // this.$Message.success('提交成功');
                  // this.getWorkOrderDetail(); //获取详情
                }
              })
              .catch((res) => {
                this.$Message.error(res.msg);
              });
          },
          (...error) => {
            this.$Message.warning('请检查输入的数据');
            this.$nextTick(() => {
              let topNum =
                document.querySelector('.main-container').scrollTop +
                document.querySelector('.ivu-form-item-error-tip').getBoundingClientRect().top -
                410;
              document.querySelector('.main-container').scrollTo({
                top: topNum,
                behavior: 'smooth',
              });
            });
          }
        );
      } else {
        this.$Message.warning('请确认待改正字段已全部修改！');
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    // if (this.moduleList.length) {
    //   this.$Modal.confirm({
    //     title: '是否保存内容后再离开？',
    //     content: '选择确定后，系统会保存本次您填写的内容，方便您下次继续提交',
    //     okText: '保存后离开',
    //     cancelText: '直接离开',
    //     onOk: () => {
    //       let { testField, ...materialData } = this.fApi.form;
    //       let material = JSON.stringify(this.removePropertyOfNull(materialData));
    //       workOrderCommonOperator('save', {
    //         material,
    //         workOrderId: this.id,
    //       }).then((res) => {
    //         if (res.code == 0) {
    //           this.$Message.success('保存成功');
    //           next();
    //         }
    //       });
    //     },
    //     onCancel: () => {
    //       next();
    //     },
    //   });
    // } else {
    next();
    // }
  },
};
</script>

<style lang="less" scoped>
.headContent {
  background: #ffffff;
  padding: 1px 24px 40px;
  border-bottom: 1px solid #f0f0f0;
  /deep/.ant-affix {
    z-index: 11;
    .fill-information-title {
      background: #fff;
      padding-top: 16px;
    }
  }
}
.header-btn {
  float: right;
  font-size: 14px;
}

.form-create-new {
  transform: none;
  padding: 16px 52px;
  min-height: calc(100vh - 292px);
  /deep/ .tittleStyle {
    height: auto;
    position: relative;
    line-height: 24px;
    padding: 8px 0 8px 12px;
    border-bottom: 1px solid #f0f0f0;
    margin-top: 16px;
    &::before {
      position: absolute;
      content: '';
      width: 2px;
      height: 15px;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      background-color: #3a7fff;
    }
  }
  /deep/ .ivu-upload {
    max-width: 332px;
  }
  // margin: 24px;

  /deep/ .ivu-form-item {
    // margin-bottom: 32px;
    &.form-title-one {
      margin-bottom: 32px;
    }
    .ivu-upload-list {
      margin-bottom: 0;
    }
    .ivu-form-item-label {
      font-size: 14px;
      line-height: 22px;
      color: #303132;
      padding: 0;
      display: flex;
      &::before {
        content: '';
      }
    }
  }
}
/deep/ .confirm-success {
  .ivu-form-item-label::before {
    content: '';
    width: 20px;
    height: 20px;
    background: url('../../../../assets/images/duigou.svg');
    background-size: cover;
    margin-right: 12px;
  }
}
.form-create {
  /deep/ .ivu-upload-list-remove {
    display: inherit !important;
  }
  /deep/ .ivu-upload-list-file {
    padding: 4px;
    color: #515a6e;
    border-radius: 4px;
    transition: background-color 0.2s ease-in-out;
    overflow: hidden;
    position: relative;
  }
  //上传文件样式
  /deep/ .ivu-upload-select {
    min-width: 110px;
    color: #919498;
    border: 1px solid #d9d9d9;
    line-height: 36px;
    height: 36px;
    border-radius: 2px;
    text-align: center;
    cursor: pointer;
    .ivu-icon-ios-cloud-upload-outline {
      font-size: 16px;
      font-weight: bold;
    }
  }

  /deep/.ivu-col > .ivu-form-item {
    margin-bottom: 48px;
  }
  /deep/.ivu-form-item-label {
    padding: 0;
    &::before {
      content: '';
    }
  }
  /deep/ .ivu-input-group {
    width: auto !important;
  }
  /deep/ .ivu-input-wrapper input:hover,
  /deep/ .ivu-input-wrapper input:focus,
  /deep/ .ivu-select-visible .ivu-select-selection,
  /deep/ .ivu-select-selection-focused,
  /deep/ .ivu-select-selection:hover {
    border-color: #639fff !important;
    box-shadow: none !important;
  }
  /deep/ .ivu-input,
  /deep/ .el-textarea,
  /deep/ .ivu-select,
  /deep/ .ant-select-selection,
  /deep/.ant-input {
    width: 280px;
    border-radius: 2px;
    .ivu-select-selection {
      border-radius: 2px;
    }
  }
  /deep/.shopPredictSaleAppend {
    .ivu-input-group-append {
      position: relative;
      left: -44px;
      border-left: 1px solid #dcdee2;
      z-index: 2;
    }
  }
  /deep/.formMaxWidth {
    width: 560px !important;
    .ivu-input,
    .ant-select-selection {
      width: 560px;
    }
  }
}
.wait-modify-wrapper {
  padding: 15px 24px;
  background-color: #f0f6ff;
  &-title {
    font-size: 14px;
    color: #000000;
    margin-bottom: 11px;
    &-num {
      color: #e81e19;
    }
  }
  .wait-modify-wrapper-list {
    display: flex;
    align-items: center;
    .wait-modify-wrapper-block {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.6);
      margin-right: 32px;
      display: flex;
      align-items: center;
      cursor: pointer;
      &-title {
        border-bottom: 1px solid rgba(0, 0, 0, 0.6);
        margin-right: 10px;
      }
      &-count {
        color: rgba(0, 0, 0, 0.4);
      }
      &-icon {
        width: 16px;
        height: 16px;
        margin-left: 10px;
      }
      &-complete {
        color: #00a870;
        .wait-modify-wrapper-block-title {
          border-bottom: 1px solid #00a870;
        }
        .wait-modify-wrapper-block-count {
          color: #00a870;
        }
      }
    }
  }
}
.btn-group {
  text-align: center;
  height: 64px;
  padding-top: 10px;
  position: fixed;
  right: 0;
  bottom: 0;
  background: #fff;
  width: 100%;
  box-shadow: 0px -1px 10px 0px #ebf0f5;
  z-index: 2;
  button {
    margin: 5px;
    height: 32px;
    border-radius: 0;
  }
}
</style>
