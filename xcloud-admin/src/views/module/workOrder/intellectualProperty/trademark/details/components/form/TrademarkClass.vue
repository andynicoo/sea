<!-- 商标分类 -->
<template>
  <div>
    <div class="list-wrap">
      <div class="li" v-for="(item, index) of formModal" :key="index">
        <div class="max-type">
          <span>大类：{{ item.category1Name || '-' }}</span>
          <a-button class="btn" size="small" type="primary" @click="openModal(index)">编辑</a-button>
        </div>
        <div class="min-type">
          <a-table
            size="small"
            :data-source="item.listTrademarkCategory2"
            :pagination="false"
            :scroll="{ scrollToFirstRowOnChange: true, x: '100%', y: '200px' }"
            :locale="{ emptyText: '请选择小类' }"
          >
            <a-table-column title="序号" width="60px" #default="{ index }">
              {{ index + 1 }}
            </a-table-column>
            <a-table-column title="商标小类（中文）" data-index="category2Name" />
            <a-table-column title="商标小类（英文）" data-index="category2NameEn" v-if="countryCode !== 'CN'" />
            <a-table-column title="商标小类（韩文）" data-index="categoryNameMore" v-if="countryCode === 'KR'" />
            <a-table-column title="商标小类（德文）" data-index="categoryNameMore" v-if="countryCode === 'DE'" />
            <a-table-column title="商标小类（日文）" data-index="categoryNameJp" v-if="countryCode === 'JP'" />
            <a-table-column title="类似群组" data-index="similarGroup" v-if="countryCode === 'JP'" />
          </a-table>
        </div>
        <template v-if="item.riskClassifyList.length > 0">
          <div class="max-type">
            <span>风险小类</span>
            <span class="tips-text">（含有风险小类，需指定关键词）</span>
          </div>
          <div class="min-type">
            <a-table
              size="small"
              :data-source="item.riskClassifyList"
              :pagination="false"
              :scroll="{ scrollToFirstRowOnChange: true, x: '100%', y: '200px' }"
            >
              <a-table-column title="序号" width="60px" #default="{ index }">
                {{ index + 1 }}
              </a-table-column>
              <a-table-column title="商标小类" data-index="category2NameEn" />
              <a-table-column title="指定关键词" #default="{ record }">
                <a-form-item-rest>
                  <a-input
                    placeholder="请从风险小类{ }内指定一个关键词"
                    v-model:value="record.keyword"
                    @blur="blurKeyword(record, item)"
                  />
                </a-form-item-rest>
              </a-table-column>
            </a-table>
          </div>
        </template>
      </div>
    </div>

    <a-modal
      title="编辑"
      width="1200px"
      v-model:visible="showModal"
      :maskClosable="false"
      :keyboard="false"
      @ok="submitModal"
    >
      <div class="modal-wrap">
        <a-form :model="formModal" layout="inline">
          <a-form-item label="大类">
            <a-select
              v-model:value="data.record.category1Num"
              placeholder="请选择"
              showArrow
              showSearch
              :fieldNames="{ label: 'categoryName', value: 'categoryNum' }"
              optionFilterProp="categoryName"
              :options="data.categoryList"
              style="width: 180px"
              @change="changeMax"
            />
          </a-form-item>
          <a-form-item label="小类名称">
            <a-input v-model:value="data.record.searchtext" placeholder="请输入" />
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              @click="
                data.searchParams.page = 1;
                getPageSubCategoryFun();
              "
              >搜索</a-button
            >
          </a-form-item>
        </a-form>
        <div class="table-wrap">
          <div class="flex1">
            <a-table
              size="small"
              :data-source="data.subCategoryList"
              :scroll="{ scrollToFirstRowOnChange: true, x: '100%', y: '300px' }"
              :pagination="{
              position: ['bottomRight'],
              current: data.searchParams.page,
              pageSize: data.searchParams.limit,
              showQuickJumper: true,
              showSizeChanger: true,
              total: data.total,
              showTotal: (total: number) => `共 ${total} 条`,
            }"
              @change="changeTable"
            >
              <a-table-column title="选择" width="60px" #default="{ record }">
                <a-form-item-rest>
                  <a-checkbox v-model:checked="record.checkedFlag" @change="changeRecord(record)" />
                </a-form-item-rest>
              </a-table-column>
              <a-table-column title="商标小类（中文）" data-index="categoryName" />
              <a-table-column title="商标小类（英文）" data-index="categoryNameEn" />
              <a-table-column title="商标小类（韩文）" data-index="categoryNameMore" v-if="countryCode === 'KR'" />
              <a-table-column title="商标小类（德文）" data-index="categoryNameMore" v-if="countryCode === 'DE'" />
              <a-table-column title="商标小类（日文）" data-index="categoryNameJp" v-if="countryCode === 'JP'" />
              <a-table-column title="类似群组" data-index="similarGroup" v-if="countryCode === 'JP'" />
            </a-table>
          </div>
          <div class="selected">
            <a-table
              size="small"
              :data-source="data.record.listTrademarkCategory2"
              :scroll="{ scrollToFirstRowOnChange: true, x: '100%', y: '300px' }"
              :pagination="false"
            >
              <a-table-column title="已选商标小类" data-index="category2Name" />
              <a-table-column title="操作" width="80px" #default="{ index }">
                <span @click="deleteSelect(index)">删除</span>
              </a-table-column>
            </a-table>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { getAllCategoryList, getPageSubCategory } from '@/api/workOrder/intellectualProperty/trademark';
import { message } from 'ant-design-vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  count: {
    type: Number,
    defalt: 1,
  },
  countryCode: {
    type: String,
    defalt: 'US',
  },
});

watch(props, (newVal: any) => {
  if (newVal.modelValue) {
    formModal.value = valFormat(newVal.modelValue);
  } else {
    formModal.value = [];
  }
});

const emit = defineEmits(['update:modelValue']);
const showModal = ref(false);
const formModal: any = ref([]);
const data: any = reactive({
  categoryList: [],
  recordIndex: 0,
  searchParams: {
    limit: 10,
    page: 1,
    countryCode: '',
  },
  subCategoryList: [],
  total: 0,
  record: {},
});

onMounted(() => {
  getAllCategoryListFun();
  data.searchParams.countryCode = props.countryCode;
  formModal.value = valFormat(props.modelValue);
});

//打开弹出
const openModal = (index: number) => {
  data.recordIndex = index;
  data.record = JSON.parse(JSON.stringify(formModal.value[data.recordIndex]));
  getPageSubCategoryFun();
  showModal.value = true;
};

//弹窗提交
const submitModal = () => {
  for (const li of formModal.value) {
    if (
      li.category1Num === data.record.category1Num &&
      data.record.category1Num !== formModal.value[data.recordIndex].category1Num
    ) {
      message.error('所选大类已添加');
      return false;
    }
  }
  //风险小类处理(新增)
  for (const li of data.record.listTrademarkCategory2) {
    if (li.category2NameEn && li.category2NameEn.indexOf('{') !== -1) {
      const index = data.record.riskClassifyList.findIndex(
        (v: { category2Num: string }) => v.category2Num === li.category2Num
      );
      if (index === -1) {
        data.record.riskClassifyList.push(Object.assign({}, li, { keyword: '' }));
      }
    }
  }
  //风险小类处理(删除)
  const category2NumArr = data.record.listTrademarkCategory2.map((v: { category2Num: string }) => v.category2Num);
  for (const i in data.record.riskClassifyList) {
    if (category2NumArr.indexOf(data.record.riskClassifyList[i].category2Num) === -1) {
      data.record.riskClassifyList.splice(i, 1);
    }
  }
  formModal.value[data.recordIndex] = JSON.parse(JSON.stringify(data.record));
  showModal.value = false;
  emitSubmit();
};

//改变大类
const changeMax = (val: string) => {
  const obj = data.categoryList.find((v: { categoryNum: string }) => v.categoryNum === val);
  if (obj) {
    data.record = {
      category1Name: obj.categoryName,
      category1NameEn: obj.categoryNameEn,
      category1Num: obj.categoryNum,
      listTrademarkCategory2: [],
      riskClassifyList: [],
      searchtext: '',
      isSearch: true,
      category1Price: 0,
    };
    data.searchParams.page = 1;
    getPageSubCategoryFun();
  }
};

//选择小类
const changeRecord = (record: any) => {
  if (record.checkedFlag) {
    data.record.listTrademarkCategory2.push({
      category2Num: record.categoryNum,
      category2Name: record.categoryName,
      category2NameEn: record.categoryNameEn, //商标小类（英文）
      categoryNameMore: record.categoryNameMore, //商标小类（德文、韩文 。。。）
      categoryNameJp: record.categoryNameJp, //商标小类（日文）
      similarGroup: record.similarGroup, //类似群组
      keyword: [''],
      parentCategoryNum: record.parentCategoryNum,
    });
  } else {
    const index = data.record.listTrademarkCategory2.findIndex(
      (v: { category2Num: string }) => v.category2Num === record.categoryNum
    );
    if (index !== -1) {
      deleteSelect(index);
    }
  }
};

//删除已选
const deleteSelect = (index: number) => {
  data.record.listTrademarkCategory2.splice(index, 1);
  setCheckedFlag();
};

//获取所有大类
const getAllCategoryListFun = () => {
  getAllCategoryList().then((res: any) => {
    data.categoryList = res || [];
  });
};

//查询小类
const getPageSubCategoryFun = () => {
  if (!data.record.category1Num) {
    data.subCategoryList = [];
    data.total = 0;
    return false;
  }
  getPageSubCategory(
    Object.assign({}, data.searchParams, {
      parentCategoryNum: data.record.category1Num,
      searchName: data.record.searchtext,
    })
  ).then((res: any) => {
    data.subCategoryList = res.records || [];
    data.total = Number(res.total);
    setCheckedFlag();
  });
};

//设置选中
const setCheckedFlag = () => {
  const selectedRowKeys = data.record.listTrademarkCategory2.map((v: { category2Num: string }) => v.category2Num);
  for (const li of data.subCategoryList) {
    if (selectedRowKeys.indexOf(li.categoryNum) !== -1) {
      li.checkedFlag = true;
    } else {
      li.checkedFlag = false;
    }
  }
};

//关键字提交
const blurKeyword = (record: any, item: any) => {
  const currData = item.listTrademarkCategory2.find(
    (v: { category2Num: string }) => v.category2Num === record.category2Num
  );
  if (currData) {
    currData.keyword = [record.keyword];
  }
  emit('update:modelValue', JSON.stringify(formModal.value));
};

//提交值
const emitSubmit = () => {
  emit('update:modelValue', JSON.stringify(formModal.value));
};

//分页、排序、筛选变化时触发 pagination, filters, sorter, { currentDataSource }
const changeTable = (pagination: any, filters = {}, sorter = {}, extra: { action: string }) => {
  data.searchParams.page = pagination.current;
  data.searchParams.limit = pagination.pageSize;
  if (extra.action === 'paginate') {
    getPageSubCategoryFun();
  }
};

//格式化值
const valFormat = (val: any) => {
  let res = [];
  if (val && typeof val === 'string') {
    res = JSON.parse(val);
    for (const li of res) {
      li.riskClassifyList = [];
      for (const sub of li.listTrademarkCategory2) {
        if (sub.category2NameEn && sub.category2NameEn.indexOf('{') !== -1) {
          const subObj = JSON.parse(JSON.stringify(sub));
          if (sub.keyword && sub.keyword[0]) {
            subObj.keyword = sub.keyword[0];
          } else {
            subObj.keyword = null;
          }
          li.riskClassifyList.push(subObj);
        }
      }
    }
  } else {
    for (let i = 0; i < (props as any).count; i++) {
      res.push({
        category1Name: '',
        category1NameEn: '',
        category1Num: '',
        listTrademarkCategory2: [],
        riskClassifyList: [],
        searchtext: '',
        isSearch: true,
        category1Price: 0,
      });
    }
  }
  return res;
};
</script>

<style scoped lang="less">
.list-wrap {
  max-width: 660px;
  .li {
    padding: 10px;
    border: 1px solid #f1f1f1;
    margin-bottom: 10px;
    .max-type {
      height: 24px;
      line-height: 24px;
      padding: 0 10px;
      margin-bottom: 10px;
      font-weight: bold;
      overflow: hidden;
      .btn {
        float: right;
      }
      .tips-text {
        color: #999;
      }
    }
    .min-type {
      border: 1px solid #f1f1f1;
      margin-bottom: 10px;
    }
  }
}
.modal-wrap {
  .table-wrap {
    margin-top: 20px;
    display: flex;
    min-height: 300px;
    .flex1 {
      flex: 6;
      border: 1px solid #f1f1f1;
    }
    .selected {
      flex: 3;
      border: 1px solid #f1f1f1;
      margin-left: 20px;
    }
  }
}
</style>
