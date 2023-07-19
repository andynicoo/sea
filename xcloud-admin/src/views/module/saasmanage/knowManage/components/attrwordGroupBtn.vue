<template>
  <div class="attr-word-btn-group" :class="{ disabled: props.selected.length }">
    <a-tooltip placement="top" :title="props.tip">
      <label>
        <i class="icon icon-white-upload zx"></i>
        <span>设置属性词</span>
      </label>
    </a-tooltip>
    <ul>
      <li @click="setAttr('cover')">覆盖属性词</li>
      <li @click="setAttr('add')">增加属性词</li>
    </ul>
  </div>
  <TableModal v-model:visible="data.visible" @selectedRow="setAttrword" />
</template>

<script setup lang="ts">
import { reactive } from "vue";
import TableModal from "./tableModal.vue";
import { message } from "ant-design-vue";
import { coverAttr, addAttr } from "@/api/saasManage/kownManage/qaList";

interface props {
  tip: string;
  selected: Array<any>;
  addUrl: string;
  coverUrl: string;
  module: string;
}

const props = withDefaults(defineProps<props>(), {
  disabled: () => {
    return [];
  },
  tip: "请选择条目",
  addUrl: "/information/labelAttributeWordRelation/add",
  coverUrl: "/information/labelAttributeWordRelation/cover",
  module: "tag",
});

const data = reactive({
  visible: false,
  attrType: "",
});

// 打开设置属性词面板
function setAttr(type: string) {
  data.visible = true;
  data.attrType = type;
}

const emits = defineEmits(["comfirm"]);

// 设置属性词
async function setAttrword(nameArr: any[], itemArr: any[]) {
  let attrObj = { tag: "labelIds", qa: "questionIds" };
  let parmas = {
    attributeWordIds: [],
  };
  parmas[attrObj[props.module]] = props.selected;
  itemArr.forEach((item) => {
    parmas.attributeWordIds.push(item.id as never);
  });
  let result: any = null;
  if (data.attrType === "add") {
    result = await addAttr(props.addUrl, parmas);
  }
  if (data.attrType === "cover") {
    result = await coverAttr(props.coverUrl, parmas);
  }
  if (result === true) {
    message.success(data.attrType === "add" ? "添加属性词成功" : "覆盖属性词成功");
  }
  emits("comfirm");
}
</script>

<style scoped lang="less">
.attr-word-btn-group {
  display: inline-block;
  font-size: 12px;
  color: #fff;
  background: #b8b8b8;
  position: relative;
  margin-right: 10px;
  border-radius: 2px;
  height: auto;
  padding: 0;
  z-index: 100;
  cursor: no-drop;
  &.disabled {
    background: #1890ff;
    cursor: pointer;
    &:hover {
      > ul {
        display: block;
      }
    }
    > label {
      cursor: pointer;
      > i,
      span {
        cursor: pointer;
      }
    }
  }
  label {
    display: block;
    height: 37px;
    padding: 0 15px;
    cursor: no-drop;
    > i {
      cursor: no-drop;
    }
    > span {
      line-height: 37px;
      cursor: no-drop;
    }
  }
  > ul {
    display: none;
    width: 118px;
    position: absolute;
    top: 37px;
    left: 0;
    background: #fff;
    text-align: center;
    border: 1px solid #d8d8d8;
    list-style: none;
    padding: 0;
    margin: 0;
    > li {
      line-height: 30px;
      border-bottom: 1px solid #d8d8d8;
      color: #333;
      cursor: pointer;
      margin: 0;
      padding: 0;
      &:hover {
        background: #d8d8d8;
      }
    }
    > li:last-child {
      border: none;
    }
  }
}
</style>
