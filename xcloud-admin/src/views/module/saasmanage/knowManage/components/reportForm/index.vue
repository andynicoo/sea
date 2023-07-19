<template>
  <a-form class="form" :wrapper-col="props.wrapperCol" :label-col="props.labelCol">
    <a-form-item
      v-for="item in props.formItems"
      :wrapper-col="item.wrapperCol"
      :label-col="item.labelCol"
      :label="item.name"
      :name="item.name"
    >
      <component
        v-if="item.control !== 'upload'"
        :is="item.control ? `a-${item.control}` : Editor"
        :options="item.options"
        :html="!item.control ? valueHtml : null"
        ref="editorDom"
        type="primary"
      >
        <span v-if="item.control === 'button'" @click="data.visible = true"
          >编辑关键词</span
        >
      </component>
      <component
        v-if="item.control === 'upload'"
        :is="`a-${item.control}`"
        accept="image/png, image/jpeg"
        :showUploadList="false"
        :action="`${data.baseUrl}/file/oss/upload`"
        @change="change"
      >
        <div class="upload">
          <plus-outlined class="icon" v-if="!data.imgMainUrl"></plus-outlined>
          <img v-if="data.imgMainUrl" :src="data.imgMainUrl" />
        </div>
      </component>
    </a-form-item>
  </a-form>
  <TableModal title="编辑关键词" v-model:visible="data.visible" />
</template>

<script setup lang="ts">
import { ref,type Ref , reactive } from "vue";
import { PlusOutlined } from '@ant-design/icons-vue';
import Editor from "@/components/wangeditor/Editor.vue";
import TableModal from "../tableModal.vue";

interface ColType {
  span?:Number,
  offset?:Number
}

interface ItemType {
  name: string;
  control?: string|boolean;
  labelCol?:ColType,
  wrapperCol?:ColType,
  options?:Array<any>;
}

interface props {
  formItems: Array<ItemType>,
  labelCol?:ColType,
  wrapperCol?:ColType,
}

const editorDom:Ref = ref(null);
const valueHtml:Ref = ref("");

const props = withDefaults(defineProps<props>(),{
  labelCol:()=>{return {span:3}},
  wrapperCol:()=>{return {span:24}}
});

// 初始化数据
const data=reactive({
  visible:true,
  baseUrl:import.meta.env.VITE_APP_API,
  imgMainUrl:'',
  imgUrl:'',
  change:{
    uploadChangeMain:(fileData:any)=>{
      debugger
      if(fileData?.file?.response){
        data.imgMainUrl=fileData.file.response?.data?.fileUrl
      }
    },
    uploadChange:(fileData:any)=>{
      debugger
      if(fileData?.file?.response){
        data.imgUrl=fileData.file.response?.data?.fileUrl
      }
    }
  }
})

function change(data:any){
 debugger
}
</script>

<style scoped lang="less">
.form {
  width: 70%;
  padding-left: 16px;
  background: #fff;
  :deep(textarea) {
    height: 150px;
  }
  .upload {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 168px;
    height: 168px;
    border: 1px solid #d9d9d9;
    cursor: pointer;
    .icon {
      font-size: 28px;
    }
    > img {
      width: 168px;
      height: 168px;
    }
  }
  :deep(.ant-btn-primary) {
    padding: 0;
    > span {
      display: inline-block;
      width: 100%;
      height: 100%;
      padding: 4px 15px;
    }
  }
}
</style>
