<template>
  <a-drawer v-model:visible="showDrawer" placement="right" :closable="false" width="40%">
    <template #title>
      <div class="company-tags">
        <a-tag>公司：{{ checkCompany?.companyName }}</a-tag>
        <a-tag v-for="(companyType, index) in data.companyTypeList" :key="index" :color="companyType.color">{{
          companyType.text
        }}</a-tag>
        <a-tooltip title="企查查搜索" placement="top">
          <a-button
            type="link"
            size="small"
            :href="`https://www.qcc.com/web/search?key=${checkCompany?.companyName}`"
            target="_blank"
          >
            <img class="img" src="@/assets/img/icon/qichacha.png" />
          </a-button>
        </a-tooltip>
      </div>
      <div class="title-head">
        <span class="text">业务数据</span>
        <span class="close-icon" @click="showDrawer = false">
          <CloseOutlined />
        </span>
      </div>
    </template>
    <DataTable
      ref="dataTable"
      :columns="columnsList"
      :methodName="getCompanyDetail"
      customKey="businessDataList"
      :mainTable="false"
      :pageSize="10"
      @resData="resData"
    >
      <template #bodyCell="{ record, column }">
        <template v-if="column.dataIndex === 'detail'">
          <template v-if="record.taxNumberInfo">
            <div v-if="record.taxNumberInfo.taxNumber">
              {{ isEU(record) ? '本土税号：' : '' }}{{ record.taxNumberInfo.taxNumber }}
            </div>
            <div v-if="isEU(record) && record.taxNumberInfo.taxNumberEu">
              欧盟税号：{{ record.taxNumberInfo.taxNumberEu }}
            </div>
          </template>
          <template v-if="record.tradeMarkVO">
            <div v-if="record.tradeMarkVO.tradeMarkName">
              <span>商标名称：{{ record.tradeMarkVO.tradeMarkName }}</span>
              <a-tooltip title="亚马逊搜索" placement="top" v-if="isIipto(record)">
                <a-button
                  type="link"
                  size="small"
                  :href="`https://www.amazon.com/s?k=${record.tradeMarkVO.tradeMarkName}`"
                  target="_blank"
                >
                  <img class="img" src="@/assets/img/icon/amazon.png" />
                </a-button>
              </a-tooltip>
            </div>
            <div v-if="record.tradeMarkVO.acceptNum">
              <span>受理号：{{ record.tradeMarkVO.acceptNum }}</span>
              <a-tooltip title="商标详情" placement="top" v-if="isIipto(record)">
                <a-button
                  type="link"
                  size="small"
                  :href="`https://www.iipto.com/trademarkdetails?countryCode=${record.countryCode}&id=${record.tradeMarkVO.acceptNum}`"
                  target="_blank"
                >
                  <img class="img" src="@/assets/img/icon/iipto.png" />
                </a-button>
              </a-tooltip>
            </div>
          </template>
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <template v-if="!isIipto(record)">
            <a-button
              type="link"
              size="small"
              title="店铺链接"
              :href="record.storeLink"
              target="_blank"
              v-if="record.storeLink"
            >
              店铺链接
            </a-button>
            <a-button
              type="link"
              size="small"
              title="店铺截图"
              :href="record.storesScreenshots"
              target="_blank"
              v-if="record.storesScreenshots"
            >
              店铺截图
            </a-button>
          </template>
        </template>
      </template>
    </DataTable>
  </a-drawer>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch, type Ref } from 'vue';
import DataTable from '@/components/page/DataTable.vue';
import { CloseOutlined } from '@ant-design/icons-vue';
import { getCompanyDetail } from '@/api/dataCenter/customerRevenue';

interface StringMap {
  [key: string]: any;
}
const props = defineProps({
  checkCompany: Object,
});
const data = reactive<{ params: StringMap; companyTypeList: StringMap }>({
  params: {
    companyName: '',
  },
  companyTypeList: {
    SERVICE: {
      text: '服务公司',
      color: 'success',
    },
    SIGN: {
      text: '签署公司',
      color: 'processing',
    },
    ORDER: {
      text: '下单公司',
      color: 'error',
    },
    PAY: {
      text: '付款公司',
      color: 'warning',
    },
  },
});

const columnsList = computed(() => {
  return [
    {
      title: '国家',
      dataIndex: 'countryName',
      width: 100,
    },
    {
      title: '业务类型',
      dataIndex: 'businessType',
      width: 100,
    },
    {
      title: '详情',
      dataIndex: 'detail',
      width: 200,
    },
    {
      title: '店铺所在电商平台',
      dataIndex: 'platform',
      width: 140,
    },
    {
      title: '查看',
      dataIndex: 'operation',
      width: 120,
    },
  ];
});

const isIipto = (record: any) => {
  return [61, 62].includes(record.functionCode);
};

const isEU = (record: any) => {
  return !['SA', 'AE', 'JP', 'EU', 'GB'].includes(record.countryCode);
};

const showDrawer = ref(false);

watch(showDrawer, newVal => {
  if (newVal) {
    nextTick(() => {
      getList();
    });
  }
});

//获取列表
const dataTable: Ref = ref(null);
const getList = () => {
  data.params.companyName = props.checkCompany?.companyName;
  dataTable.value.getList(data.params);
};

// 获取列表的其他数据
const resData = (res: any) => {
  data.companyTypeList = Object.fromEntries(
    Object.entries(data.companyTypeList).filter(([key]) => res.companyTypeList.includes(key))
  );
};

defineExpose({ showDrawer });
</script>

<style scoped lang="less">
.company-tags {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  ::v-deep .ant-tag {
    font-size: 16px;
    margin-bottom: 5px;
    white-space: pre-wrap;
  }
  ::v-deep .ant-btn-link {
    line-height: initial;
    margin-bottom: 5px;
  }
}
.title-head {
  .text {
    font-size: 14px;
    color: #333;
  }
  .close-icon {
    float: right;
    cursor: pointer;
  }
}
.img {
  width: 16px;
  height: 16px;
  cursor: pointer;
}
</style>
<style>
.ant-drawer-header-title {
  overflow: hidden;
}
.ant-drawer-title {
  overflow: hidden;
}
</style>
