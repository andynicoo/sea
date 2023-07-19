<!-- formCreate 上传图片组件 -->
<template>
  <div>
    <Upload :accept="accept" @submitUrl="submitUrl" v-if="fileUrl.length < limit"> </Upload>
    <div class="file-list" v-for="(li, index) of fileUrl" :key="index">
      <a :href="li" target="_blank" style="word-break: keep-all; color: #00a3ff">
        <span>{{ li.substring(li.lastIndexOf('/') + 1) }}（可点击查看）</span>
      </a>
      <span class="btn" @click="deleteFile(index)">删除</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import Upload from '@/components/upload/Upload.vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  accepts: {
    type: Array<string>,
    default: [],
  },
  limit: {
    type: Number,
    default: 1,
  },
});

watch(props, (newVal: any) => {
  if (newVal.modelValue) {
    fileUrl.value = valFormat(newVal.modelValue);
  } else {
    fileUrl.value = [];
  }
});
const emit = defineEmits(['update:modelValue']);
const fileUrl: any = ref([]);
const accept = ref('.jpg,.png');

onMounted(() => {
  fileUrl.value = valFormat(props.modelValue);
  if (props.accepts && props.accepts.length > 0) {
    accept.value = '.' + props.accepts.join(',.');
  }
});

//上传文件
const submitUrl = (url: string) => {
  fileUrl.value.push(url);
  emitSubmit();
};

//删除文件
const deleteFile = (index: number) => {
  fileUrl.value.splice(index, 1);
  emitSubmit();
};

//提交值
const emitSubmit = () => {
  if (fileUrl.value.length > 0) {
    if (props.limit === 1) {
      emit('update:modelValue', '"' + fileUrl.value[0] + '"');
    } else {
      emit('update:modelValue', JSON.stringify(fileUrl.value));
    }
  } else {
    emit('update:modelValue', props.limit === 1 ? '' : '[]');
  }
};

//格式化值
const valFormat = (val: any) => {
  let resArr = [];
  if (val && IsJsonString(val) && typeof JSON.parse(val) === 'string') {
    resArr = JSON.parse(val);
  } else {
    if (IsJsonString(val)) {
      resArr = JSON.parse(val);
    } else {
      resArr = val;
    }
  }
  if (typeof resArr === 'string' && resArr) {
    resArr = [resArr];
  }
  if (!resArr) {
    resArr = [];
  }
  return resArr;
};

//判断是否json字符串
function IsJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
</script>

<style scoped lang="less">
.file-list {
  line-height: 26px;
  .btn {
    color: red;
    cursor: pointer;
  }
}
</style>
