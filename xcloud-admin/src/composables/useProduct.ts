import { reactive, type Ref, ref, onMounted } from 'vue';
import type { ProductType, DataList } from '@/types/saasmanage';
import { cloneDeep } from 'lodash-es';

interface DataType {
  formState: ProductType;
}
const initData = {
  seoTitle: '',
  keyword: '',
  productCategoryId: '',
  productName: '',
  productStatus: '',
  seoDescribe: '',
  sort: '',
  packageContent: '',
  dataList: [],
  processList: [],
  advantageList: [],
  whoNeedList: [],
  addValueList: [],
};

// saas平台管理，产品管理-编辑详情 Composables
const productInfo = reactive<DataType>({
  formState: {
    // seoTitle: '',
    // keyword: '',
    // productCategoryId: '',
    // productName: '',
    // productStatus: '',
    // seoDescribe: '',
    // sort: '',
    // packageContent: '',
    dataList: [],
    processList: [],
    advantageList: [],
    whoNeedList: [],
    addValueList: [],
  },
});

onMounted(() => {
  const copys = cloneDeep(productInfo.formState);
  console.log(copys);
});

// 重置产品
const resetProduct = () => {
  productInfo.formState = initData;
};

// 设置产品数据
const setProduct = (product: ProductType) => {
  productInfo.formState = initData;
  productInfo.formState = product;
};

// 为产品[]添加一项
const addProductItem = (name: string, data: DataList | any) => {
  productInfo.formState[name].push(data);
};
// 为产品[]删除第index项
const deleteProductItem = (name: string, index: number) => {
  productInfo.formState[name].splice(index, 1);
};
// 编辑产品[]的第index项目
const setProductItem = (name: string, data: DataList | any, index: number) => {
  console.log(name, data, index);
  productInfo.formState[name][index] = data;
};

// 为产品增值服务添加一项
const addProductValue = () => {
  productInfo.formState.addValueList.push({
    addValueProductInfoId: '',
    sort: '0',
    productCategoryId: '',
    productInfoId: '',
  });
};
// 为产品增值服务删除第index项
const deleteProductValue = (index: number) => {
  productInfo.formState.addValueList.splice(index, 1);
};

export function useProduct() {
  return {
    productInfo,
    resetProduct,
    addProductItem,
    deleteProductItem,
    addProductValue,
    deleteProductValue,
    setProductItem,
    setProduct,
  };
}
