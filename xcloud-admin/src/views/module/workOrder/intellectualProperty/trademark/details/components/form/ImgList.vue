<!-- 上传产品  &&  上传订单详情截图 -->
<template>
  <div class="list">
    <div class="li" v-for="(item, index) of formModal" :key="index">
      <a-form-item-rest>
        <a-select
          class="li-select"
          v-model:value="item.category2NameEn"
          placeholder="请选择"
          showArrow
          @change="change($event, item)"
        >
          <a-select-option
            v-for="(li, index) of data.categoryList"
            :key="index"
            :value="li.category2NameEn"
            :disabled="formModal.map((v:any) => v.category2NameEn).includes(li.category2NameEn)"
          >
            {{ li.category2Name }} / {{ li.category2NameEn }}
          </a-select-option>
        </a-select>
        <Upload accept=".jpg,.png" @submitUrl="submitUrl($event, index)" v-if="item.category2NameEn" />
        <a-button disabled v-else> <UploadOutlined />上传文件</a-button>
        <span class="li-btn" @click="deleteRecord(index)">删除</span>
      </a-form-item-rest>
      <div class="img-list">
        <div class="img-li" v-for="(url, indexImg) of item.imgList" :key="indexImg">
          <img :src="url" />
          <div class="delete-btn" @click="deleteImg(index, indexImg)">
            <RestOutlined />
          </div>
        </div>
        <div class="img-none" v-if="item.imgList.length === 0">暂无图片</div>
      </div>
    </div>
    <a-button
      size="small"
      ghost
      type="primary"
      @click="addRecord()"
      v-if="formModal.length < data.categoryList.length || formModal.length === 0"
    >
      添加更多
    </a-button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import Upload from '@/components/upload/Upload.vue';
import { RestOutlined, UploadOutlined } from '@ant-design/icons-vue';

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
    data.categoryList = valFormatCategory(props.categoryList);
  } else {
    formModal.value = [];
  }
});

const emit = defineEmits(['update:modelValue']);
const reg = /_|\r|\n|\\|\/|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\!|\~|\`|\|/g;
const formModal: any = ref([]);
const data: any = reactive({
  categoryList: [],
});

onMounted(() => {
  formModal.value = valFormat(props.modelValue);
  data.categoryList = valFormatCategory(props.categoryList);
});

//上传图片
const submitUrl = (url: string, index: number) => {
  formModal.value[index].imgList.push(url);
  emitSubmit();
};

//删除
const deleteRecord = (index: number) => {
  formModal.value.splice(index, 1);
  emitSubmit();
};

//删除图片
const deleteImg = (index: number, indexImg: number) => {
  formModal.value[index].imgList.splice(indexImg, 1);
  emitSubmit();
};

//新增
const addRecord = () => {
  formModal.value.push({
    category2NameEn: '',
    imgList: [],
  });
  emitSubmit();
};

//改变分类
const change = (val: string, item: any) => {
  const obj = data.categoryList.find((v: { category2NameEn: string }) => v.category2NameEn === val);
  if (obj) {
    item.category2NameEn = obj.category2NameEn;
  }
  emitSubmit();
};

//提交值
const emitSubmit = () => {
  const res: { fileName: string; fileUrl: string }[] = [];
  for (const li of formModal.value) {
    if (li.imgList.length > 0) {
      for (const url of li.imgList) {
        res.push({
          fileName: li.category2NameEn + url.substring(url.lastIndexOf('.')),
          fileUrl: url,
        });
      }
    } else {
      res.push({
        fileName: li.category2NameEn,
        fileUrl: '',
      });
    }
  }
  emit('update:modelValue', JSON.stringify(res));
};

//格式化值
const valFormat = (val: any) => {
  let list = [];
  if (val && typeof val === 'string') {
    list = JSON.parse(val);
  }
  const res: { category2NameEn: string | null; imgList: string[] }[] = [];
  for (const li of list) {
    let fileName: any = null;
    if (li.fileName) {
      fileName = li.fileName.replace(reg, '').split('.')[0];
      if (fileName[fileName.length - 1] == ')') {
        fileName = fileName.slice(0, -3);
      }
    }
    const index = res.findIndex((v: { category2NameEn: string | null }) => v.category2NameEn === fileName);
    if (index === -1) {
      res.push({
        category2NameEn: fileName,
        imgList: li.fileUrl ? [li.fileUrl] : [],
      });
    } else {
      if (li.fileUrl) {
        res[index].imgList.push(li.fileUrl);
      } else {
        res.push({
          category2NameEn: fileName,
          imgList: [],
        });
      }
    }
  }
  return res;
};

//格式化值 类别
const valFormatCategory = (categoryList: any) => {
  if (categoryList && categoryList.length > 0) {
    for (const li of categoryList || []) {
      li.category2NameEn = li.category2NameEn.replace(reg, '');
    }
    return categoryList;
  } else {
    return [];
  }
};
</script>

<style scoped lang="less">
.list {
  .li {
    margin-bottom: 10px;
    .li-select {
      width: 320px;
      margin-right: 15px;
    }
    .li-btn {
      margin-left: 15px;
      color: red;
    }
  }
}
.img-list {
  overflow: hidden;
  padding: 6px 0;
  .img-none {
    width: 100px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    border: 1px solid #f1f1f1;
    color: #999;
  }
  .img-li {
    position: relative;
    width: 100px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    cursor: pointer;
    overflow: hidden;
    float: left;
    border: 1px solid #f1f1f1;
    margin-right: 8px;
    img {
      width: 100px;
      float: left;
    }
    .delete-btn {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      font-size: 28px;
      color: #fff;
    }
  }
  .img-li:hover {
    .delete-btn {
      display: block;
    }
  }
}
</style>
