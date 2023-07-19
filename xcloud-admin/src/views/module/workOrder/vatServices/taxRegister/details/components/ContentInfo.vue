<template>
  <div class="title-opt">
    <div class="tit">
      <span class="t1" v-if="detailsInfo" @click="returnBack()">
        <LeftOutlined />
        {{ detailsInfo.functionCode === '2' ? '德国VAT转代理资料审核' : '德国VAT注册资料审核' }}
      </span>
      <!-- <span class="t2">审核规则</span> -->
    </div>
    <div class="opt">
      <a-space :size="24">
        <a-button type="primary" ghost @click="changeServiceFun()"> 修改服务商 </a-button>
        <a-button type="primary" ghost @click="downloadInformationFun()"> 下载资料 </a-button>
        <a-button
          type="primary"
          ghost
          @click="submitForm()"
          :disabled="detailsInfo && detailsInfo.currentNodeCode !== 'NODE3'"
        >
          提交审核结果
        </a-button>
        <slot name="pageOpt"></slot>
      </a-space>
    </div>
  </div>

  <a-tabs v-model:activeKey="activeKey" class="tabs-wrap">
    <a-tab-pane key="companyInfo" tab="公司信息"> </a-tab-pane>
    <a-tab-pane key="corporateInfo" tab="法人信息"> </a-tab-pane>
    <a-tab-pane key="storeInfo,taxInfo" tab="店铺和税务信息"> </a-tab-pane>
    <a-tab-pane key="fileExamine" tab="文件审核" v-if="detailsInfo && detailsInfo.functionCode !== '2'"> </a-tab-pane>
  </a-tabs>

  <div class="detailsInfo-overflow">
    <div class="tab-li" v-if="activeKey === 'companyInfo'">
      <CompanyInfo :detailsInfo="detailsInfo">
        <template #optDiv>
          <div class="opt-wrap" v-if="detailsInfo && detailsInfo.currentNodeCode === 'NODE3' && prevExamine">
            <div class="opt-btn">
              <a-space :size="24">
                <a-button type="primary" ghost @click="reject()"> 驳 回 </a-button>
                <a-button type="primary" ghost @click="pass()"> 通 过 </a-button>
                <a-button type="primary" @click="next()" v-if="currentStatus.audit !== 0"> 下 一 个 </a-button>
              </a-space>
            </div>
            <div class="status-wrap" v-if="currentStatus.audit !== 0">
              <div class="result">
                <span>审核结果： </span>
                <span v-if="currentStatus.audit === 1" style="color: #52c41a">通过 <CheckCircleFilled /></span>
                <span v-else-if="currentStatus.audit === 2" style="color: #f5222d">驳回 <CloseCircleFilled /></span>
              </div>
              <div v-if="currentStatus.audit === 2 && currentStatus.columns">
                <div class="cell" v-for="(li, index) of currentStatus.columns" :key="index">
                  <div class="tips-text">
                    您好，您的 <span style="color: #1890ff">{{ li.columnName }}</span> 有以下信息建议修改：
                  </div>
                  <div class="content-text">
                    <div class="text">
                      {{ li.rejects || '-' }}
                    </div>
                    <div class="img-list">
                      <div class="li" v-for="(url, index) of li.annexs" :key="index">
                        <a-image :src="url" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </CompanyInfo>
    </div>
    <div class="tab-li" v-if="activeKey === 'corporateInfo'">
      <LegalPersonInfo :detailsInfo="detailsInfo">
        <template #optDiv>
          <div class="opt-wrap" v-if="detailsInfo && detailsInfo.currentNodeCode === 'NODE3' && prevExamine">
            <div class="opt-btn">
              <a-space :size="24">
                <a-button type="primary" ghost @click="reject()"> 驳 回 </a-button>
                <a-button type="primary" ghost @click="pass()"> 通 过 </a-button>
                <a-button type="primary" @click="next()" v-if="currentStatus.audit !== 0"> 下 一 个 </a-button>
              </a-space>
            </div>
            <div class="status-wrap" v-if="currentStatus.audit !== 0">
              <div class="result">
                <span>审核结果： </span>
                <span v-if="currentStatus.audit === 1" style="color: #52c41a">通过 <CheckCircleFilled /></span>
                <span v-else-if="currentStatus.audit === 2" style="color: #f5222d">驳回 <CloseCircleFilled /></span>
              </div>
              <div v-if="currentStatus.audit === 2 && currentStatus.columns">
                <div class="cell" v-for="(li, index) of currentStatus.columns" :key="index">
                  <div class="tips-text">
                    您好，您的 <span style="color: #1890ff">{{ li.columnName }}</span> 有以下信息建议修改：
                  </div>
                  <div class="content-text">
                    <div class="text">
                      {{ li.rejects || '-' }}
                    </div>
                    <div class="img-list">
                      <div class="li" v-for="(url, index) of li.annexs" :key="index">
                        <a-image :src="url" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </LegalPersonInfo>
    </div>
    <div class="tab-li" v-if="activeKey === 'storeInfo,taxInfo'">
      <StoreTaxInfo :detailsInfo="detailsInfo">
        <template #optDiv>
          <div class="opt-wrap" v-if="detailsInfo && detailsInfo.currentNodeCode === 'NODE3' && prevExamine">
            <div class="opt-btn">
              <a-space :size="24">
                <a-button type="primary" ghost @click="reject()"> 驳 回 </a-button>
                <a-button type="primary" ghost @click="pass()"> 通 过 </a-button>
                <a-button
                  type="primary"
                  @click="next()"
                  v-if="currentStatus.audit !== 0 && detailsInfo.functionCode !== '2'"
                >
                  下 一 个
                </a-button>
              </a-space>
            </div>
            <div class="status-wrap" v-if="currentStatus.audit !== 0">
              <div class="result">
                <span>审核结果： </span>
                <span v-if="currentStatus.audit === 1" style="color: #52c41a">通过 <CheckCircleFilled /></span>
                <span v-else-if="currentStatus.audit === 2" style="color: #f5222d">驳回 <CloseCircleFilled /></span>
              </div>
              <div v-if="currentStatus.audit === 2 && currentStatus.columns">
                <div class="cell" v-for="(li, index) of currentStatus.columns" :key="index">
                  <div class="tips-text">
                    您好，您的 <span style="color: #1890ff">{{ li.columnName }}</span> 有以下信息建议修改：
                  </div>
                  <div class="content-text">
                    <div class="text">
                      {{ li.rejects || '-' }}
                    </div>
                    <div class="img-list">
                      <div class="li" v-for="(url, index) of li.annexs" :key="index">
                        <a-image :src="url" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </StoreTaxInfo>
    </div>
    <div class="tab-li" v-if="activeKey === 'fileExamine'">
      <FileExamine
        :detailsInfo="detailsInfo"
        :statusList="data.statusList"
        keyStr="shopConsoleScreenshot"
        title="店铺信息截图"
        @submit="getDetailsStatusInfoFun()"
      />
      <FileExamine
        :detailsInfo="detailsInfo"
        :statusList="data.statusList"
        keyStr="storageAddressImg"
        title="仓储地址截图"
        @submit="getDetailsStatusInfoFun()"
        v-if="!isShowStorageContract"
      />
      <FileExamine
        :detailsInfo="detailsInfo"
        :statusList="data.statusList"
        keyStr="storageContract"
        title="仓储合同"
        @submit="getDetailsStatusInfoFun()"
        v-if="isShowStorageContract"
      />
    </div>
  </div>
  <ChangeServiceModal ref="changeServiceModal" :detailsInfo="detailsInfo" @submit="emit('submit')" />
  <SubmitResiltModal
    ref="submitResiltModal"
    :isShowStorageContract="isShowStorageContract"
    :detailsInfo="detailsInfo"
    :statusList="data.statusList"
    @submit="emit('submit')"
  />
  <RejectDrawer
    ref="rejectDrawer"
    :statusList="data.statusList"
    :keyStr="activeKey"
    @submit="getDetailsStatusInfoFun()"
  />
</template>

<script setup lang="ts">
import { computed, createVNode, onMounted, reactive, ref, type Ref } from 'vue';
import { CheckCircleFilled, CloseCircleFilled, ExclamationCircleOutlined, LeftOutlined } from '@ant-design/icons-vue';
import router from '@/router';
import { downloadFile } from '@/utils/utils';
import CompanyInfo from './tabsInfo/CompanyInfo.vue';
import LegalPersonInfo from './tabsInfo/LegalPersonInfo.vue';
import StoreTaxInfo from './tabsInfo/StoreTaxInfo.vue';
import FileExamine from './tabsInfo/FileExamine.vue';
import ChangeServiceModal from './ChangeServiceModal.vue';
import SubmitResiltModal from './SubmitResiltModal.vue';
import RejectDrawer from './RejectDrawer.vue';
import {
  downloadInformation,
  getDetailsStatusInfo,
  editDetailsStatusInfo,
} from '@/api/workOrder/vatServices/taxRegister';
import { Modal } from 'ant-design-vue';
import { useStore } from '@/stores/store';

const props = defineProps({
  detailsInfo: {
    type: Object,
    default: () => null,
  },
});

//当前状态对象
const currentStatus: any = computed(() => {
  return (
    data.statusList[activeKey.value] || {
      audit: 0,
      columns: [],
    }
  );
});

//上一个审核完了？
const prevExamine: any = computed(() => {
  let flag = false;
  try {
    if (activeKey.value === 'companyInfo') {
      flag = true;
    } else if (activeKey.value === 'corporateInfo') {
      flag = data.statusList['companyInfo'].audit !== 0;
    } else if (activeKey.value === 'storeInfo,taxInfo') {
      flag = data.statusList['corporateInfo'].audit !== 0;
    }
  } catch {
    flag = false;
  }
  return flag;
});

//是否显示仓储合同，（店铺信息里所在平台非亚马逊时显示） （亚马逊时显示仓储地址截图）
const isShowStorageContract: any = computed(() => {
  let flag = false;
  try {
    const dataReview = props.detailsInfo.dataReview || [];
    const list = dataReview.find((v: { moduleCode: string }) => v.moduleCode === 'storeInfo');
    flag = list.columns.findIndex((v: { keyName: string }) => v.keyName === 'storageContract') !== -1;
  } catch {
    flag = false;
  }
  return flag;
});

const emit = defineEmits(['submit']);
const activeKey = ref('companyInfo');
const data: any = reactive({
  statusList: {},
});

onMounted(() => {
  getDetailsStatusInfoFun();
});

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
            Object.assign({}, data.statusList, {
              [activeKey.value]: {
                audit: 1,
                columns: [],
              },
            })
          ).then((res: any) => {
            resolve(true);
            getDetailsStatusInfoFun();
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
            Object.assign({}, data.statusList, {
              [activeKey.value]: {
                audit: 1,
                columns: [],
              },
            })
          ).then((res: any) => {
            resolve(true);
            getDetailsStatusInfoFun();
          });
        }).catch(() => console.log('Oops errors!'));
      },
    });
  }
};

//下一个
const next = () => {
  if (activeKey.value === 'companyInfo') {
    activeKey.value = 'corporateInfo';
  } else if (activeKey.value === 'corporateInfo') {
    activeKey.value = 'storeInfo,taxInfo';
  } else if (activeKey.value === 'storeInfo,taxInfo') {
    activeKey.value = 'fileExamine';
  }
};

//获取审核状态信息
const getDetailsStatusInfoFun = () => {
  getDetailsStatusInfo({
    id: router.currentRoute.value.query.id,
  }).then((res: any) => {
    // console.log(res);
    data.statusList = res || {};
  });
};

//修改服务商
const changeServiceModal: Ref = ref(null);
const changeServiceFun = () => {
  changeServiceModal.value.showModal = true;
};

//下载资料
const downloadInformationFun = () => {
  downloadInformation({ id: router.currentRoute.value.query.id }).then((res: any) => {
    downloadFile(res, '测录入税号申请书_德国_德国VAT注册+申报资料.zip');
  });
};

//提交审核结果
const submitResiltModal: Ref = ref(null);
const submitForm = () => {
  submitResiltModal.value.showModal = true;
};

//页面返回列表
const returnBack = () => {
  const userStore = useStore();
  if (props.detailsInfo.functionCode === '2') {
    userStore.$router().push('/newTaxServices/serviceManage/index');
  } else {
    userStore.$router().push('/newTaxServices/taxRegister/index');
  }
};
</script>

<style scoped lang="less">
.title-opt {
  display: flex;
  padding: 10px;
  margin-bottom: 10px;
  .tit {
    flex: 1;
    .t1 {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      line-height: 32px;
      cursor: pointer;
    }
    .t2 {
      font-size: 14px;
      color: #3a7fff;
      background-color: #e5f3ff;
      padding: 2px 3px;
      margin-left: 10px;
    }
  }
  .opt {
    flex: 1;
    text-align: right;
  }
}
.tabs-wrap {
  margin: 0 10px;
  &:deep(.ant-tabs-nav) {
    padding: 0 20px;
    margin: 0 0 6px 0;
  }
}
.detailsInfo-overflow {
  height: calc(100% - 120px);
  overflow-y: auto;
  padding: 10px;
  .tab-li {
    min-height: 400px;
  }
  .opt-wrap {
    margin: 30px 0;
    .opt-btn {
      margin-bottom: 10px;
    }
    .status-wrap {
      .result {
        line-height: 30px;
        font-size: 16px;
        margin-bottom: 5px;
      }
      .cell {
        background-color: #f5f8fb;
        padding: 10px 15px;
        font-size: 14px;
        margin-bottom: 15px;
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
            border: 1px solid #ccc;
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
</style>
