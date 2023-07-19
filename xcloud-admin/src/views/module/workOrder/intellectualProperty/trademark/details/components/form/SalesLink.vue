<!-- 销售链接 -->
<template>
  <div class="list">
    <div class="li" v-for="(item, index) of formModal" :key="index">
      <a-form-item-rest>
        <a-select
          class="li-select"
          v-model:value="item.category2Num"
          placeholder="请选择"
          showArrow
          @change="change($event, item)"
        >
          <a-select-option v-for="(li, index) of data.categoryList" :key="index" :value="li.category2Num">
            {{ li.category2Name }} / {{ li.category2NameEn }}
          </a-select-option>
        </a-select>
        <a-input class="li-input" v-model:value="item.marketHref" placeholder="请输入" @blur="emitSubmit" />
        <span class="li-btn" @click="deleteRecord(index)">删除</span>
      </a-form-item-rest>
    </div>
    <a-button size="small" ghost type="primary" @click="addRecord()">添加更多</a-button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  categoryList: {
    type: Array,
    defalt: [],
  },
});

watch(props, (newVal: any) => {
  if (newVal.modelValue) {
    formModal.value = valFormat(newVal.modelValue);
    data.categoryList = props.categoryList;
  } else {
    formModal.value = [];
  }
});

const emit = defineEmits(['update:modelValue']);
const formModal: any = ref([]);
const data: any = reactive({
  categoryList: [],
});

onMounted(() => {
  formModal.value = valFormat(props.modelValue);
  data.categoryList = props.categoryList;
});

//新增
const addRecord = () => {
  formModal.value.push({
    category2Name: '',
    category2NameEn: '',
    category2Num: null,
    marketHref: '',
  });
  emitSubmit();
};

//删除
const deleteRecord = (index: number) => {
  formModal.value.splice(index, 1);
  emitSubmit();
};

//改变分类
const change = (val: string, item: any) => {
  const obj = data.categoryList.find((v: { category2Num: string }) => v.category2Num === val);
  if (obj) {
    item.category2Num = obj.category2Num;
    item.category2Name = obj.category2Name;
    item.category2NameEn = obj.category2NameEn;
    item.marketHref = '';
  }
  emitSubmit();
};

//提交值
const emitSubmit = () => {
  emit('update:modelValue', JSON.stringify(formModal.value));
};

//格式化值
const valFormat = (val: any) => {
  let res = [];
  if (val && typeof val === 'string') {
    res = JSON.parse(val);
  }
  return res;
};
</script>

<style scoped lang="less">
.list {
  .li {
    margin-bottom: 10px;
    .li-select {
      width: 240px;
    }
    .li-input {
      width: 300px;
      margin-left: 15px;
    }
    .li-btn {
      margin-left: 15px;
      color: red;
    }
  }
}
</style>
