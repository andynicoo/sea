<!-- 数据以表格格式展示信息组件 -->
<template>
  <div class="table-wrap">
    <div class="tr" v-for="(item, index) of columnsList" :key="index">
      <div class="td hd">
        <span class="is-need">{{ item.isNeed ? '*' : ' ' }}</span>
        <span> {{ item.keyLabel }} </span>
      </div>
      <div class="td bd">
        <span v-if="['regionCode', 'companyAddressZhCountry', 'personCardAddressCountryZh'].includes(item.keyName)">
          {{ countryNameFormat(item.value) }}
        </span>
        <span v-else-if="item.keyName === 'shopHref'">
          <a v-if="item.value" :href="item.value" target="_blank" class="link-a" :title="item.value">
            {{ item.value || '-' }}
          </a>
          <span v-else>-</span>
        </span>
        <span
          v-else-if="
            ['companyRegisteredCapital', 'shopPredictNextSale', 'shopPredictSale', 'betrag'].includes(item.keyName)
          "
        >
          {{ item.value || '-' }} 欧元
        </span>
        <span v-else-if="['companyRegisteredCapitalCny'].includes(item.keyName)"> {{ item.value || '-' }} 元 </span>
        <span v-else-if="['vorwahlNational'].includes(item.keyName)">
          {{ item.value ? '+ ' + item.value : '-' }}
        </span>
        <span v-else-if="['companyNameEn'].includes(item.keyName)">
          {{ item.value || '-' }}
          <span v-if="companyInfo">
            <a-popover placement="bottomLeft">
              <template #content>
                <div class="popover-cell" v-if="companyInfo.companyNameZh">
                  <span>营业执照公司名:</span>
                  <span>{{ companyInfo.companyNameZh }}</span>
                </div>
                <div class="popover-cell" v-if="companyInfo.licenseRegisteredCompanyNameEn">
                  <span>营业执照公司(拼音）:</span>
                  <span>{{ companyInfo.licenseRegisteredCompanyNameEn }}</span>
                </div>
                <div class="popover-cell" v-if="companyInfo.companyCreditCode">
                  <span>统一信用代码: </span>
                  <span>{{ companyInfo.companyCreditCode }}</span>
                </div>
              </template>
              <span class="popover-label">对比</span>
            </a-popover>
          </span>
        </span>
        <span v-else-if="item.inputType === 4">
          <FileLink v-if="Array.isArray(item.value)" :fileUrl="item.value[0]" fileName="查看文件" />
          <FileLink v-else :fileUrl="item.value" fileName="查看文件" />
        </span>
        <span v-else>{{ item.value || '-' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCountrySelectList, getRegionList } from '@/api/base/basicsData';
import { computed, onMounted, ref } from 'vue';
import FileLink from '@/components/assembly/FileLink.vue';

const props = defineProps({
  columns: {
    default: () => [],
    type: Array<any>,
  },
  filterKeyStr: {
    default: () => [],
    type: Array<string>,
  },
  companyInfo: {
    default: () => null,
    type: Object,
  },
});

const columnsList: any = computed(() => {
  const list = props.columns || [];
  return list.filter((v: { keyName: string }) => !props.filterKeyStr.includes(v.keyName));
});

const allCountryList = ref([]);

onMounted(() => {
  getCountryList();
});

//获取国家数据
const getCountryList = () => {
  getCountrySelectList().then((res: any) => {
    allCountryList.value = res || [];
    getRegionListFun();
  });
};

//获取公司所在地区列表
const getRegionListFun = () => {
  getRegionList().then((res: any) => {
    const list = (res || []).map((v: { regionCode: string; regionName: string }) => {
      return {
        countryCode: v.regionCode,
        countryNameZh: v.regionName,
      };
    });
    allCountryList.value = allCountryList.value.concat(list);
  });
};

//国家中文转换
const countryNameFormat = (countryCode: string) => {
  const arr = allCountryList.value.filter((v: { countryCode: string }) => v.countryCode === String(countryCode));
  if (arr && arr.length > 0) {
    return arr.map((v: { countryNameZh: string }) => v.countryNameZh).join(',');
  } else {
    return countryCode || '-';
  }
};
</script>
<style scoped lang="less">
.table-wrap {
  width: 100%;
  border: 1px solid #ddd;
  .tr {
    border-bottom: 1px solid #ddd;
    display: flex;
    .td {
      padding: 10px 8px;
      border-right: 1px solid #ddd;
      word-wrap: break-word;
      white-space: pre-wrap;
      word-break: break-all;
      display: flex;
      align-items: center;
    }
    .td:last-child {
      border-right: 0;
    }
    .is-need {
      color: red;
      font-weight: bold;
      padding-right: 4px;
    }
    .td.hd {
      flex: 2;
      min-width: 100px;
      max-width: 300px;
      background: #f6f6f6;
      color: #666;
    }
    .td.bd {
      flex: 4;
      min-width: 200px;
      color: #333;
    }
    .link-a {
      word-wrap: break-word;
      white-space: pre-wrap;
      word-break: break-all;
      color: #00a3ff;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .tr:last-child {
    border-bottom: 0;
  }
}
.popover-cell {
  font-size: 14px;
  color: #333;
  line-height: 30px;
  font-weight: 600;
  span:last-child {
    font-weight: 400;
    margin-left: 5px;
  }
}
.popover-label {
  background-color: #ff6700;
  border-radius: 2px;
  font-size: 12px;
  color: #fff;
  padding: 2px 5px;
  margin-left: 5px;
}
</style>
