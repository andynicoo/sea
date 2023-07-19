<template>
  <a-spin :spinning="productLoading">
    <a-form
      :model="productInfo.formState"
      name="basic"
      :label-col="{ span: 2 }"
      :wrapper-col="{ span: 14 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form-item
        label="所属产品大类"
        name="productCategoryId"
        :rules="[{ required: true, message: '请选择所属产品大类' }]"
      >
        <a-select ref="select" v-model:value="productInfo.formState.productCategoryId" style="width: 450px">
          <a-select-option :value="item.id" v-for="item in bigListArr" :key="item.id">{{
            item.productCategoryName
          }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="seo标题" name="seoTitle">
        <a-input v-model:value="productInfo.formState.seoTitle" placeholder="请输入seo标题" class="wt450" />
      </a-form-item>
      <a-form-item label="seo关键词" name="keyword" extra="请使用英文“,”分隔，最多添加5个标签">
        <a-input v-model:value="productInfo.formState.keyword" placeholder="请输入seo关键词" />
      </a-form-item>
      <a-form-item label="seo描述" name="seoDescribe">
        <a-textarea
          v-model:value="productInfo.formState.seoDescribe"
          placeholder="请输入seo描述"
          :autoSize="{ minRows: 2, maxRows: 6 }"
        />
      </a-form-item>
      <a-form-item label="排序" name="sort">
        <a-input-number v-model:value="productInfo.formState.sort" :min="0" :max="1000000" />
      </a-form-item>
      <a-form-item label="套餐内容" name="packageContent">
        <Editor :html="valueHtml" ref="editorDom" />
      </a-form-item>
      <a-form-item label="所需资料" name="dataList">
        <ProductOption :optionKey="'dataList'" :optionTit="'所需资料'" :btnTit="'资料'" />
      </a-form-item>
      <a-form-item label="服务流程" name="processList">
        <ProductOption :optionKey="'processList'" :optionTit="'服务流程'" />
      </a-form-item>
      <a-form-item label="服务优势" name="advantageList">
        <ProductOption :optionKey="'advantageList'" :optionTit="'服务优势'" :btnTit="'优势'" />
      </a-form-item>
      <a-form-item label="谁需要" name="whoNeedList">
        <ProductOption :optionKey="'whoNeedList'" :optionTit="'谁需要'" :btnTit="'类型'" />
      </a-form-item>
      <a-form-item label="增值服务" name="addValueList">
        <AddValueOption :bigListArr="bigListArr" />
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 2, span: 6 }">
        <a-space>
          <a-button @click="goProductList">取消</a-button>
          <a-button type="primary" html-type="submit">确认</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </a-spin>
</template>

<script lang="ts" setup>
import { onMounted, ref, type Ref } from 'vue';
import { getProductById, editProduct } from '@/api/saasManage/productList';
// import router from '@/router';
import { useRoute } from 'vue-router';
import { jumpPage } from '@/utils/utils';
import { message } from 'ant-design-vue';
import Editor from '@/components/wangeditor/Editor.vue';
import { useProduct } from '@/composables/useProduct';
import ProductOption from '@/components/page/saasmanage/ProductOption.vue';
import AddValueOption from '@/components/page/saasmanage/AddValueOption.vue';
import { getProductBigList } from '@/api/saasManage/productList';
const route = useRoute();

const { productInfo, resetProduct, setProduct } = useProduct();

const querys = route.query;
const { id: queryId } = querys;

// 加载产品详情中
const productLoading: Ref<boolean> = ref(false);
// 所属产品大类 []
const bigListArr: Ref<any> = ref([]);

onMounted(() => {
  if (queryId) {
    loadProduct();
  } else {
    message.info('无产品id信息');
    goProductList();
  }
});

const loadProduct = async () => {
  productLoading.value = true;
  // 产品大类
  const bigList = (await getProductBigList({})) as any;
  const res = (await getProductById({ id: queryId })) as any;
  bigListArr.value = bigList;
  setProduct(res);
  valueHtml.value = res.packageContent;

  productLoading.value = false;
};

//产品列表
const goProductList = () => {
  resetProduct();
  jumpPage(`/saasmanage/productlist`);
};

// 重置页面数据
// const resetPageProduct = () => {
//   valueHtml.value = '';
//   resetProduct();
// };

const editorDom: Ref = ref(null);
const valueHtml: Ref<string | undefined> = ref('<p></p>');

// 提交
const submitIng = ref(false);
const onFinish = (values: any) => {
  const editor = editorDom.value.editorRef;
  if (editor !== null) {
    productInfo.formState.packageContent = editor.getHtml();
  }
  console.log('Success:', values);
  submitBtn();
};
const submitBtn = async () => {
  submitIng.value = true;
  const res = (await editProduct(productInfo.formState)) as any;
  submitIng.value = false;
  if (res) {
    message.success('提交成功');
    goProductList();
  }
};
// 提交报错
const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};
</script>

<style lang="less">
.wt450 {
  width: 450px;
}
</style>
