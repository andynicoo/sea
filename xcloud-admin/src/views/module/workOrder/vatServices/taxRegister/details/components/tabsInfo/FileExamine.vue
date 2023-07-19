<template>
  <div class="cell-box">
    <div class="tab-title">{{ title }}</div>
    <div class="cell-row">
      <div class="file-img" v-if="currentImg.length > 0" v-viewer>
        <embed :src="currentImg[0]" width="100%" height="100%" v-if="currentImg[0].indexOf('.pdf') !== -1" />
        <img :src="currentImg[0]" v-else />
        <div class="opt-btn" v-if="detailsInfo && detailsInfo.currentNodeCode === 'NODE3' && prevExamine">
          <a-button class="btn" type="primary" ghost @click="goExamine()"> 去 审 核 </a-button>
        </div>
      </div>
      <div
        class="status-wrap"
        v-if="currentStatus.audit !== 0 && detailsInfo && detailsInfo.currentNodeCode === 'NODE3'"
      >
        <div class="result">
          <span>审核结果： </span>
          <span v-if="currentStatus.audit === 1" style="color: #52c41a">通过 <CheckCircleFilled /></span>
          <span v-else-if="currentStatus.audit === 2" style="color: #f5222d">驳回 <CloseCircleFilled /></span>
        </div>
        <div class="cell" v-if="currentStatus.audit === 2">
          <div class="tips-text">您好，您的资料有以下信息建议修改：</div>
          <div class="content-text">
            <div class="text">
              {{ currentStatus.rejects || '-' }}
            </div>
            <div class="img-list">
              <div class="li" v-for="(url, index) of currentStatus.annexs" :key="index">
                <a-image :src="url" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <a-drawer
    placement="bottom"
    :visible="showDrawer"
    :maskClosable="false"
    :keyboard="false"
    :closable="false"
    height="80vh"
    :bodyStyle="{ padding: '10px 24px' }"
  >
    <template #title>
      <span class="title-drawer">{{ title }}</span>
      <span class="result-tips" v-if="currentStatus.audit === 1 || currentStatus.audit === 2">
        <span>审核结果： </span>
        <span v-if="currentStatus.audit === 1" style="color: #52c41a">通过</span>
        <span v-else-if="currentStatus.audit === 2" style="color: #f5222d">驳回</span>
      </span>
    </template>
    <template #extra>
      <a-space :size="24">
        <a-button type="primary" ghost @click="reject()"> 驳 回 </a-button>
        <a-button type="primary" ghost @click="pass()"> 通 过 </a-button>
        <CloseOutlined class="icon-close" @click="showDrawer = false" />
      </a-space>
    </template>
    <div class="content-wrap">
      <div class="cell" v-viewer>
        <div class="title-text">
          <span>示例文件</span>
          <span class="href-a" v-if="currentModalImg[0].indexOf('.pdf') !== -1">
            <a
              v-if="currentModalImg[0]"
              :href="currentModalImg[0]"
              target="_blank"
              style="word-break: keep-all; color: #00a3ff"
            >
              在新页面打开PDF文件
            </a>
          </span>
        </div>
        <div class="img-wrap">
          <embed :src="currentModalImg[0]" width="100%" height="99%" v-if="currentModalImg[0].indexOf('.pdf') !== -1" />
          <img :src="currentModalImg[0]" v-else />
        </div>
      </div>
      <div class="cell" v-viewer>
        <div class="title-text">
          <span>客户上传文件</span>
          <span class="href-a" v-if="currentImg[0].indexOf('.pdf') !== -1">
            <a v-if="currentImg[0]" :href="currentImg[0]" target="_blank" style="word-break: keep-all; color: #00a3ff">
              在新页面打开PDF文件
            </a>
          </span>
        </div>
        <div class="img-wrap">
          <embed :src="currentImg[0]" width="100%" height="99%" v-if="currentImg[0].indexOf('.pdf') !== -1" />
          <img :src="currentImg[0]" v-else />
        </div>
      </div>
    </div>
  </a-drawer>
  <RejectDrawer ref="rejectDrawer" :statusList="statusList" :keyStr="keyStr" @submit="rejectDrawerSubmit()" />
</template>

<script setup lang="ts">
import { computed, createVNode, ref, type Ref } from 'vue';
import router from '@/router';
import { CheckCircleFilled, CloseCircleFilled, CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import RejectDrawer from '../RejectDrawer.vue';
import { editDetailsStatusInfo } from '@/api/workOrder/vatServices/taxRegister';

const props = defineProps({
  detailsInfo: {
    type: Object,
    default: () => null,
  },
  statusList: {
    type: Object,
    default: () => null,
  },
  keyStr: {
    default: 'shopConsoleScreenshot',
    type: String,
  },
  title: {
    default: '店铺信息截图',
    type: String,
  },
});

//当前状态对象
const currentStatus: any = computed(() => {
  let list: any = [];
  try {
    list = props.statusList.fileExamine.columns;
  } catch {
    list = [];
  }
  const obj = list.find((v: { columnKey: string }) => v.columnKey === props.keyStr);
  return (
    obj || {
      audit: 0,
      columns: [],
    }
  );
});

//上一个审核完了？
const prevExamine: any = computed(() => {
  let flag = false;
  try {
    flag = props.statusList['storeInfo,taxInfo'].audit !== 0;
  } catch {
    flag = false;
  }
  return flag;
});

//当前示例图片信息列表
const currentModalImg: any = computed(() => {
  const dataReview = props.detailsInfo.dataReview || [];
  const list = dataReview.find((v: { moduleCode: string }) => v.moduleCode === 'storeInfo');
  const obj = list.columns.find((v: { keyName: string }) => v.keyName === props.keyStr);
  const val = obj ? obj.fileModelUrl : [];
  return typeof val === 'string' ? [val] : val;
});

//当前图片信息列表
const currentImg: any = computed(() => {
  const dataReview = props.detailsInfo.dataReview || [];
  const list = dataReview.find((v: { moduleCode: string }) => v.moduleCode === 'storeInfo');
  const obj = list.columns.find((v: { keyName: string }) => v.keyName === props.keyStr);
  const val = obj ? obj.value : [];
  return typeof val === 'string' ? [val] : val;
});

const emit = defineEmits(['submit']);
const showDrawer = ref(false);

//去审核
const goExamine = () => {
  showDrawer.value = true;
};

//驳回
const rejectDrawer: Ref = ref(null);
const reject = () => {
  if (currentStatus.value.audit === 1) {
    Modal.confirm({
      title: '修改驳回结果',
      icon: createVNode(ExclamationCircleOutlined),
      content: '您真的要将审核结果修改为驳回吗？',
      centered: true,
      onOk() {
        return new Promise((resolve, reject) => {
          resolve(true);
          rejectDrawer.value.showDrawer = true;
        }).catch(() => console.log('Oops errors!'));
      },
    });
  } else {
    rejectDrawer.value.showDrawer = true;
  }
};

//通过
const pass = () => {
  const params = JSON.parse(JSON.stringify(props.statusList));
  if (params.fileExamine && params.fileExamine.columns) {
    for (const li of params.fileExamine.columns) {
      if (li.columnKey === props.keyStr) {
        li.audit = 1;
        li.annexs = [];
        li.rejects = '';
      }
    }
  }
  if (currentStatus.value.audit === 2) {
    Modal.confirm({
      title: '修改驳回结果',
      icon: createVNode(ExclamationCircleOutlined),
      content: '将审核结果改为通过后，之前驳回的记录将被清除。',
      centered: true,
      onOk() {
        return new Promise((resolve, reject) => {
          editDetailsStatusInfo(
            {
              id: router.currentRoute.value.query.id,
            },
            params
          ).then(() => {
            resolve(true);
            showDrawer.value = false;
            emit('submit');
            message.success('操作成功');
          });
        }).catch(() => console.log('Oops errors!'));
      },
    });
  } else {
    Modal.confirm({
      title: '提示',
      icon: createVNode(ExclamationCircleOutlined),
      content: '已确认所有字段无误，通过审核。',
      centered: true,
      onOk() {
        return new Promise((resolve, reject) => {
          editDetailsStatusInfo(
            {
              id: router.currentRoute.value.query.id,
            },
            params
          ).then(() => {
            resolve(true);
            showDrawer.value = false;
            emit('submit');
            message.success('操作成功');
          });
        }).catch(() => console.log('Oops errors!'));
      },
    });
  }
};

//驳回提交
const rejectDrawerSubmit = () => {
  showDrawer.value = false;
  emit('submit');
};
</script>

<style scoped lang="less">
.cell-box {
  border-bottom: 1px solid #ddd;
  padding: 0 10px 24px;
  margin-bottom: 24px;
  .tab-title {
    position: relative;
    padding: 8px 18px;
    font-weight: bold;
  }
  .tab-title::after {
    position: absolute;
    content: '';
    left: 5px;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    width: 2px;
    height: 14px;
    background-color: #1890ff;
    border-radius: 1px;
  }
  .cell-row {
    display: flex;
    .file-img {
      position: relative;
      width: 246px;
      height: 165px;
      line-height: 165px;
      border: 1px solid #ddd;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        max-width: 100%;
        max-height: 100%;
      }
      .opt-btn {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.1);
        .btn {
          background-color: #fff;
        }
      }
    }
    .status-wrap {
      flex: 1;
      margin-left: 20px;
      .result {
        line-height: 30px;
        font-size: 16px;
        margin-bottom: 5px;
      }
      .cell {
        background-color: #f5f8fb;
        padding: 10px 15px;
        font-size: 14px;
        .tips-text {
          line-height: 30px;
        }
        .content-text {
          line-height: 24px;
          .text {
            white-space: pre-wrap;
            margin-bottom: 5px;
          }
        }
        .img-list {
          overflow: hidden;
          .li {
            width: 80px;
            height: 80px;
            border: 1px solid #ddd;
            overflow: hidden;
            border-radius: 4px;
            line-height: 80px;
            float: left;
            margin-right: 10px;
            img {
              max-width: 100%;
              max-height: 100%;
            }
          }
        }
      }
    }
  }
}
.cell-box:last-child {
  border-bottom: 0;
}
.title-drawer {
  font-size: 24px;
  color: #333;
  font-weight: bold;
}
.result-tips {
  font-size: 16px;
  color: #333;
  margin-left: 35px;
}
.content-wrap {
  display: flex;
  height: 100%;
  .cell {
    flex: 1;
    .title-text {
      height: 30px;
      line-height: 30px;
      margin: 0 10px;
      color: #333;
      font-weight: bold;
      .href-a {
        float: right;
      }
    }
    .img-wrap {
      height: calc(100% - 30px);
      margin: 0 10px;
      border: 1px solid #ddd;
      overflow-y: auto;
      img {
        width: 100%;
      }
    }
  }
}
</style>
