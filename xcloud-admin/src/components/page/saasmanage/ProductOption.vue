<template>
  <a-space>
    <a-button type="primary" @click="addSomeItem" :disabled="productInfo.formState[props.optionKey]?.length > 5">
      新增{{ props.btnTit }}
    </a-button>
    最多添加6条
  </a-space>

  <!-- {{ productInfo.formState[props.optionKey] }} -->
  <a-table
    :dataSource="productInfo.formState[props.optionKey]"
    :columns="props.optionKey === 'advantageList' || props.optionKey === 'whoNeedList' ? columns2 : columns"
    class="zt-mt-3"
    :pagination="false"
  >
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.dataIndex === 'iconUrl'">
        <ImageViewer :img="record.iconUrl" />
      </template>
      <template v-if="column.key === 'operation'">
        <a-space>
          <a-button type="link" @click="editItem(record, index)">编辑</a-button>
          <a-button type="link" danger @click="deleteItem(index)">删除</a-button>
        </a-space>
      </template>
    </template>
  </a-table>

  <a-modal
    v-model:visible="visible"
    :title="isAddItem ? '新增' + props.optionTit : '编辑' + props.optionTit"
    destroyOnClose
    @ok="handleOk"
  >
    <a-form
      ref="formRef"
      :model="dataListItem"
      name="basic"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 18 }"
      autocomplete="off"
    >
      <a-form-item label="标题" name="title" :rules="[{ required: true, message: '请输入标题' }]">
        <a-input v-model:value="dataListItem.title" />
      </a-form-item>
      <a-form-item label="描述" name="dataDescribe">
        <a-input v-model:value="dataListItem.dataDescribe" />
      </a-form-item>
      <a-form-item label="排序" name="sort" :rules="[{ required: true, message: '请输入排序' }]">
        <a-input-number id="inputNumber" v-model:value="dataListItem.sort" :min="0" :max="100000" />
      </a-form-item>
      <a-form-item
        v-if="props.optionKey === 'advantageList' || props.optionKey === 'whoNeedList'"
        label="图标"
        name="iconUrl"
      >
        <UploadBox v-model="dataListItem.iconUrl" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { type Ref, ref, watch } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import { useProduct } from '@/composables/useProduct';
import { columns, columns2, dataListItem, initDataListItem } from './config';
import type { DataList } from '@/types/saasmanage';
import UploadBox from '@/components/upload/UploadBox.vue';
import ImageViewer from '@/components/page/ImageViewer.vue';

const { productInfo, addProductItem, setProductItem, deleteProductItem } = useProduct();

// 下方几个表格，编辑时的index
const editIndex: Ref<number> = ref(0);
// 操作按钮
const deleteItem = (index: number) => {
  deleteProductItem(props.optionKey, index);
};
const editItem = (record: DataList, index: number) => {
  isAddItem.value = false;
  dataListItem.value = record;
  visible.value = true;
  editIndex.value = index;
};

// 弹窗 表单
const formRef = ref<FormInstance>();
const visible: Ref<boolean> = ref(false);
// 关弹窗清空form
watch(visible, newVal => {
  if (!visible.value) {
    console.log(dataListItem.value);
    initDataListItem();
  }
});
const handleOk = async () => {
  const result = await formRef.value?.validate();
  if (result) {
    if (isAddItem.value) {
      addProductItem(props.optionKey, result);
      visible.value = false;
    } else {
      setProductItem(props.optionKey, result, editIndex.value);
      visible.value = false;
    }
  }
};

// 是新增还是编辑 弹窗
const isAddItem = ref(false);

const addSomeItem = () => {
  isAddItem.value = true;
  visible.value = true;
};

const props = defineProps({
  optionKey: {
    default: 'dataList',
    type: String,
  },
  optionTit: {
    default: '',
    type: String,
  },
  btnTit: {
    default: '流程',
    type: String,
  },
});
</script>
