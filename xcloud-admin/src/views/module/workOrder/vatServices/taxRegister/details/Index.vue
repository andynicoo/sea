<template>
  <a-spin :spinning="showLoadding">
    <div class="content">
      <div class="detailsInfo">
        <ContentInfo :detailsInfo="detailsInfo" @submit="getTaxRegisterDetailFun()">
          <template #pageOpt>
            <span class="page-opt" @click="showTabInfo = !showTabInfo">
              <a-popover color="#1890FF" placement="bottomLeft" v-model:visible="showPopover" v-if="!showTabInfo">
                <template #content>
                  <div style="overflow: hidden">
                    <div class="popover-tips">
                      <span>工单信息收起在这里啦，查看请点击展开！</span>
                    </div>
                    <div class="popover-close" @click="showPopover = false">知道了</div>
                  </div>
                </template>
                <span>展开</span>
              </a-popover>
              <span v-else>收缩</span>
            </span>
          </template>
        </ContentInfo>
      </div>
      <div class="tabsInfo" v-show="showTabInfo">
        <TabsInfo :detailsInfo="detailsInfo" :operationLog="data.operationLog" @submit="getTaxRegisterDetailFun()" />
      </div>
    </div>
  </a-spin>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import router from '@/router';
import { getListByNoList, getTaxRegisterDetail } from '@/api/workOrder/vatServices/taxRegister';
import ContentInfo from './components/ContentInfo.vue';
import TabsInfo from './components/TabsInfo.vue';

const showPopover = ref(true);
const showLoadding = ref(false);
const showTabInfo = ref(false);
const detailsInfo: any = ref({});
const data: any = reactive({
  operationLog: [], //操作记录
});
//workOrder/vatServices/taxRegister/details?id=1668456265975730176

onMounted(() => {
  getTaxRegisterDetailFun();
});

//获取详情
const getTaxRegisterDetailFun = () => {
  showLoadding.value = true;
  getTaxRegisterDetail({
    id: router.currentRoute.value.query.id,
  })
    .then((res: any) => {
      detailsInfo.value = res || {};
      const dataReview = detailsInfo.value.dataReview || [];
      detailsInfo.value.dataReview = handleModuleList(dataReview);
      getListByNoListFun(detailsInfo.value.workNo);
    })
    .catch(() => {
      showLoadding.value = false;
    });
};

//获取操作记录
const getListByNoListFun = (workNo: string) => {
  getListByNoList({
    businessNo: workNo,
  })
    .then((res: any) => {
      data.operationLog = res || [];
      showLoadding.value = false;
    })
    .catch(() => {
      showLoadding.value = false;
    });
};

//处理数据
const handleModuleList = (workflowColumns: any[]) => {
  workflowColumns = JSON.parse(JSON.stringify(workflowColumns));
  const resArr: any[] = [];
  const map = new Map();
  workflowColumns.forEach((md: any) => {
    md.columns.forEach((item: any) => {
      if (item.columnId) {
        map.set(item.columnId, item);
      }
    });
  });
  workflowColumns.forEach((md: any) => {
    const mdHandle = JSON.parse(JSON.stringify(md));
    mdHandle.columns = [];
    md.columns.forEach((item: any) => {
      let itemShow = null;
      if (item.columnPid) {
        const parentVal = map.get(item.columnPid).reView;
        if (item.columnOption.includes(parentVal)) {
          itemShow = item;
        }
      } else {
        itemShow = item;
      }
      if (itemShow) {
        item.value = valFormat(item);
        mdHandle.columns.push(item);
      }
    });
    resArr.push(mdHandle);
  });
  return resArr;
};

//设置value
const valFormat = (item: any) => {
  try {
    if (JSON.stringify(item.reView) == '{}') {
      item.reView = '';
    }
    if (typeof JSON.parse(item.reView) !== 'number') {
      item.reView = JSON.parse(item.reView);
    }
  } catch (e) {
    // console.log(item.keyLabel + ':' + item.reView);
  }

  try {
    item.info = JSON.parse(item.info);
  } catch (e) {
    // console.log(item.keyLabel + ':' + item.reView);
  }

  let res = item.reView;
  if ([2, 3, 5].includes(item.inputType)) {
    //单选框、复选框、下拉框
    if (item.info.groups && item.info.groups.length > 0) {
      let resArr = [];
      if (Array.isArray(item.reView)) {
        resArr = item.reView.map((val: string) => {
          const obj = item.info.groups.find((v: { value: string }) => v.value === String(val));
          if (obj) {
            return obj;
          } else {
            return {
              label: val,
              value: val,
            };
          }
        });
      } else {
        resArr = item.info.groups.filter((v: { value: string }) => v.value === String(item.reView));
      }
      if (resArr && resArr.length > 0) {
        res = resArr.map((v: { label: string }) => v.label).join('、');
      }
    }
  } else if (item.inputType === 8) {
    //日期
    if (item.reView) {
      res = item.reView.split(' ')[0];
    }
  } else if (item.inputType === 9) {
    //日期范围
    if (item.reView && Array.isArray(item.reView)) {
      res = item.reView.join(' ~ ');
    }
  }
  return res;
};
</script>

<style scoped lang="less">
.content {
  height: calc(100vh - 120px);
  display: flex;
  .detailsInfo {
    flex: 1;
    padding: 10px;
    background-color: #fff;
    .page-opt {
      cursor: pointer;
    }
  }
  .tabsInfo {
    width: 25%;
    margin-left: 13px;
    padding: 0 10px;
    background-color: #fff;
    overflow-y: auto;
  }
}
&:deep(.popover-tips) {
  width: 160px;
  color: #fff;
}
&:deep(.popover-close) {
  width: 70px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  color: #1890ff;
  background-color: #fff;
  border-radius: 4px;
  float: right;
  cursor: pointer;
  margin-top: 10px;
}
</style>
