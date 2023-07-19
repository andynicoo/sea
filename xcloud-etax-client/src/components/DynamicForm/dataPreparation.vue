<template>
  <div class="data-preparation">
    <p v-if="moduleListUploadSelect.length" class="data-preparation-tips upload-files-tips">
      选择信息，生成资料清单
    </p>
    <div v-for="column in moduleListUploadSelect" :key="column.columnId" class="module-radio-group">
      <span>{{ column.keyLabel }}:</span>
      <RadioGroup v-model="column.value">
        <Radio v-for="item in column.info.groups" :label="item.value" :key="item.value">{{ item.label }}</Radio>
      </RadioGroup>
    </div>
    <p class="data-preparation-tips upload-files-tips">
      需要以下文件<span @click="downloadHandle" class="download-btn"
        ><img src="@/assets/images/common/downloadIcon.png" />下载资料清单</span
      >
    </p>
    <table class="data-preparation-list" v-for="list in moduleListUpload" :key="list.moduleId">
      <template v-for="(item, index) in list.uploadArr">
        <tr :key="index">
          <td
            class="upload-files-parent-label"
            :rowspan="list.uploadArr.length"
            v-if="index == 0 && getUploadArrLen(list.uploadArr)"
          >
            {{ list.moduleName }}
          </td>
          <td class="upload-files-item" width="200" v-if="item.isShow">
            {{ item.keyLabel }}
          </td>
          <td class="upload-files-item" v-if="item.isShow">
            <p class="upload-remind-message">
              {{ item.isNeed ? '必填' : '选填' }} <span v-if="item.remindMessage">/ {{ item.remindMessage }}</span>
            </p>
          </td>
          <td width="200" v-if="item.isShow">
            <a v-if="item.fileModelUrl" :href="item.fileModelUrl" target="_black">查看示例</a>
          </td>
        </tr>
      </template>
    </table>
  </div>
</template>
<script>
import { workFlowColumnRelationDownloadList } from '@/api/commonOperator.js';
export default {
  props: {
    // 工单详情
    workInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    moduleListUpload: {
      typeof: Array,
    },
    moduleListUploadSelect: {
      typeof: Array,
    },
  },
  watch: {
    //自动识别监听
    moduleListUploadSelect: {
      handler(newVal) {
        this.moduleListUpload.forEach((modules) => {
          modules.uploadArr.forEach((list) => {
            this.$set(list, 'isShow', true);
            newVal.forEach((ele) => {
              if (ele.columnId == list.columnPid) {
                list.isShow = false;
                if (list.columnOption.split(',').includes(ele.value)) {
                  list.isShow = true;
                }
              }
            });
          });
        });
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      invoiceFile: '',
    };
  },
  mounted() {},
  methods: {
    //获取长度
    getUploadArrLen(uploadArr) {
      let index = 0;
      uploadArr.forEach((item) => {
        if (item.isShow) {
          index += 1;
        }
      });
      return index;
    },
    //下载资料清单
    async downloadHandle() {
      console.log(this.workInfo, 'this.workInfo');
      let downloadConditionList = [];
      this.moduleListUploadSelect.forEach((column) => {
        downloadConditionList.push({
          conditionColumnId: column.columnId,
          conditionValue: column.value,
        });
      });
      let { data } = await workFlowColumnRelationDownloadList({
        workflowId: this.workInfo.workflowId || this.workInfo.flowId,
        currentNodeCode: this.workInfo.currentNodeCode || this.workInfo.cureentNodeCode || this.workInfo.nodeCode,
        downloadConditionList: downloadConditionList,
        serviceId: this.workInfo.serviceId || this.workInfo.id,
      });
      this.$util.downloadFile(data, '资料清单');
    },
  },
};
</script>
<style scoped lang="less">
.data-preparation {
  padding-right: 6px;
  margin-top: 32px;
  h2 {
    color: #303132;
    font-size: 16px;
  }
}
.information-safety-tips {
  min-height: 38px;
  margin: 16px 0 32px;
  background: #f0f6ff;
  color: #303132;
  border-radius: 2px 2px 2px 2px;
  border: 1px solid #cce1ff;
  padding: 10px 16px;
}
.upload-files-tips {
  color: #919498;
  margin-bottom: 24px;
  .download-btn {
    float: right;
    color: #3a7fff;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    top: 2px;
    img {
      width: 16px;
      vertical-align: top;
    }
  }
}
.data-preparation-list {
  margin-bottom: -1px;
  width: 100%;
  border: 1px solid #f0f0f0;
  td {
    border-bottom: 1px solid #f0f0f0;
    padding: 10px 32px;
  }
  .upload-files-parent-label {
    background: #fafafa;
    width: 192px;
    border-right: 1px solid #f0f0f0;
  }
  .upload-files-label {
    background: #fafafa;
    width: 260px;
  }
  .upload-files-item {
    > span {
      display: inline-block;
      height: 22px;
      line-height: 22px;
      padding: 0 30px;
      border-right: 1px solid rgba(0, 0, 0, 0.1);
      margin-bottom: 10px;
      a {
        color: #606266;
      }
      a:hover {
        color: #3a7fff;
        cursor: pointer;
      }
    }
    b {
      font-weight: normal;
    }
    span:last-child {
      border: none;
    }
  }
}
.module-radio-group {
  margin-bottom: 20px;
  > span {
    display: inline-block;
    width: 192px;
  }
  /deep/ .ivu-radio-wrapper {
    margin-right: 24px;
  }
}
.upload-remind-message {
  color: #919498;
  margin-bottom: 0;
}
.data-preparation-tips {
  font-size: 16px;
  color: #303132;
  margin: 42px 0 24px;
  font-weight: bold;
}
</style>
