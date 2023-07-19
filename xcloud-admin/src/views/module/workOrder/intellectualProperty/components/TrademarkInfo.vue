<template>
  <div class="data-previews" v-if="serviceInfo">
    <div v-if="showRegisterInfo">
      <h2 class="module-name"><b></b>商标注册信息</h2>
      <table class="data-table-wrap">
        <tr>
          <td class="table-label">受理号</td>
          <td class="table-item">
            <div>{{ serviceInfo.acceptNum || '-' }}</div>
          </td>
        </tr>
        <tr>
          <td class="table-label">备案验证码</td>
          <td class="table-item">
            <div>{{ serviceInfo.verificationCode || '-' }}</div>
          </td>
        </tr>
        <tr>
          <td class="table-label">注册号</td>
          <td class="table-item">
            <div>{{ serviceInfo.registerNo || '-' }}</div>
          </td>
        </tr>
      </table>
    </div>
    <div v-for="(modules, modulesIndex) in dataList" :key="modulesIndex">
      <h2 class="module-name"><b></b>{{ modules.moduleName }}</h2>
      <table class="data-table-wrap">
        <tr v-for="li in modules.columns" :key="li.id">
          <td class="table-label">{{ li.keyLabel }}</td>
          <td class="table-item">
            <div v-if="li.keyName == 'trademarkCategory'" class="category-table">
              <table v-for="(item, itemIndex) in li.value || []" :key="item.category1Num">
                <tr>
                  <td width="110">大类{{ itemIndex + 1 }}</td>
                  <td :colspan="99">{{ item.category1Name }}</td>
                </tr>
                <tr>
                  <td :rowspan="item.listTrademarkCategory2.length + 1">小类</td>
                  <td width="50">序号</td>
                  <td>商标小类（中文）</td>
                  <td v-if="serviceInfo.countryCode !== 'CN'">商标小类（英文）</td>
                  <td v-if="serviceInfo.countryCode === 'KR'">商标小类（韩文）</td>
                  <td v-if="serviceInfo.countryCode === 'DE'">商标小类（德文）</td>
                  <td v-if="serviceInfo.countryCode === 'JP'">商标小类（日文）</td>
                  <td v-if="serviceInfo.countryCode === 'JP'">类似群组</td>
                  <td v-if="serviceInfo.countryCode === 'US'">指定关键词</td>
                </tr>
                <tr v-for="(sub, subIndex) in item.listTrademarkCategory2" :key="sub.category2Num">
                  <td width="50">{{ subIndex + 1 }}</td>
                  <td>{{ sub.category2Name || '-' }}</td>
                  <td v-if="serviceInfo.countryCode !== 'CN'">{{ sub.category2NameEn || '-' }}</td>
                  <td v-if="serviceInfo.countryCode === 'KR'">{{ sub.categoryNameMore || '-' }}</td>
                  <td v-if="serviceInfo.countryCode === 'DE'">{{ sub.categoryNameMore || '-' }}</td>
                  <td v-if="serviceInfo.countryCode === 'JP'">{{ sub.categoryNameJp || '-' }}</td>
                  <td v-if="serviceInfo.countryCode === 'JP'">{{ sub.similarGroup || '-' }}</td>
                  <td v-if="serviceInfo.countryCode === 'US'">{{ (sub.keyword ?? []).join('、') || '-' }}</td>
                </tr>
              </table>
            </div>
            <div v-else-if="li.keyName == 'marketHref'">
              <div v-for="(item, itemIndex) in li.value || []" :key="itemIndex">
                <div style="margin-bottom: 8px">小类：{{ item.category2NameEn }}</div>
                <div>链接：{{ item.marketHref }}</div>
              </div>
            </div>
            <div v-else-if="li.keyName == 'useProductImg' || li.keyName == 'useEvidence'">
              <div v-for="(item, itemIndex) in li.value || []" :key="itemIndex">
                <div style="margin-bottom: 8px">小类：{{ (item.fileName || '').split('.')[0] }}</div>
                <div v-if="isImageFile(item.fileUrl)">
                  图片：
                  <a :href="item.fileUrl" target="_blank" title="点击查看">
                    <img
                      :src="item.fileUrl"
                      style="max-width: 80px; max-height: 80px; border: 1px solid #f1f1f1; margin-right: 10px"
                    />
                  </a>
                </div>
                <div v-else>
                  <a :href="item.fileUrl" target="_blank" title="点击查看">
                    {{ item.fileName }}
                  </a>
                </div>
              </div>
            </div>
            <div v-else-if="li.keyName == 'companyAddressCountryEn'">{{ countryNameFormat(li.value) }}</div>
            <div v-else>
              <template v-if="isImageFile(li.value)">
                <a :href="li.value" target="_blank" title="点击查看">
                  <img :src="li.value" style="max-width: 80px; max-height: 80px; border: 1px solid #f1f1f1" />
                </a>
              </template>
              <template v-else>
                {{ li.value || '-' }}
              </template>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { getCountrySelectList } from '@/api/base/basicsData';

const props = defineProps({
  //是否线索注册信息
  showRegisterInfo: {
    type: Boolean,
    default: false,
  },
  serviceInfo: {
    type: Object,
    default: () => null,
  },
  moduleList: {
    type: Array<any>,
    default: () => [],
  },
});

watch(props, (newVal: any) => {
  if (newVal) {
    dataList.value = handleModuleList(props.moduleList);
  }
});

const allCountryList = ref([]);
const dataList: any = ref([]);

onMounted(() => {
  getCountryList();
  dataList.value = handleModuleList(props.moduleList);
});

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
        const parentVal = map.get(item.columnPid).keyNameValue;
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
    if (JSON.stringify(item.keyNameValue) == '{}') {
      item.keyNameValue = '';
    }
    if (typeof JSON.parse(item.keyNameValue) !== 'number') {
      item.keyNameValue = JSON.parse(item.keyNameValue);
    }
    item.info = JSON.parse(item.info);
  } catch (e) {
    // console.log(item.keyLabel + ':' + item.keyNameValue);
    // console.warn(e);
  }

  let res = item.keyNameValue;
  if ([2, 3, 5].includes(item.inputType)) {
    //单选框、复选框、下拉框
    if (item.info.groups && item.info.groups.length > 0) {
      const arr = item.info.groups.filter((v: { value: string }) => v.value === String(item.keyNameValue));
      if (arr && arr.length > 0) {
        res = arr.map((v: { label: string }) => v.label).join(',');
      }
    }
  } else if (item.inputType === 8) {
    //日期
    if (item.keyNameValue) {
      res = item.keyNameValue.split(' ')[0];
    }
  }
  return res;
};

//获取国家数据
const getCountryList = () => {
  getCountrySelectList().then((res: any) => {
    allCountryList.value = res || [];
  });
};

//国家中文转换
const countryNameFormat = (countryCode: string) => {
  const arr = allCountryList.value.filter((v: { countryCode: string }) => v.countryCode === String(countryCode));
  if (arr && arr.length > 0) {
    return arr.map((v: { countryNameZh: string }) => v.countryNameZh).join(',');
  } else {
    return countryCode;
  }
};

//是否图片文件
const isImageFile = (fileUrl: string) => {
  let flag = false;
  if (
    fileUrl &&
    ['png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG', 'BMP'].includes(
      String(fileUrl).substring(String(fileUrl).lastIndexOf('.') + 1)
    )
  ) {
    flag = true;
  }
  return flag;
};
</script>

<style scoped lang="less">
.data-previews {
  .module-name {
    font-size: 16px;
    color: #303132;
    margin-bottom: 12px;
    span {
      float: right;
      font-size: 14px;
      color: #3a7fff;
      cursor: pointer;
    }
    b {
      display: inline-block;
      width: 2px;
      height: 15px;
      background: #3a7fff;
      margin-right: 8px;
      position: relative;
      top: 2px;
    }
  }
  .data-table-wrap {
    width: 100%;
    margin-bottom: 30px;
    td {
      border: 1px solid #f0f0f0;
      padding: 10px 32px;
    }
    .table-label {
      background: #fafafa;
      width: 264px;
    }
    .table-item {
      padding: 0;
      > div {
        padding: 10px 32px;
      }
      .category-table {
        padding: 5px;
        table {
          width: 100%;
          margin-bottom: 10px;
          td {
            padding: 5px 10px;
          }
        }
        table:last-child {
          margin: 0;
        }
      }
    }
  }
}
</style>
