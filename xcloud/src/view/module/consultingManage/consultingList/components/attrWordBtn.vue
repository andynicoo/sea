<template>
  <div class="attr-word-btn" :class="{ disabled: !disabled }">
    <el-tooltip effect="dark" :disabled="!disabled" :content="tip" placement="top-start">
      <label>
        <i class="icon icon-white-upload zx"></i>
        <span>设置属性词</span>
      </label>
    </el-tooltip>
    <ul>
      <li @click="setAttr('cover')">覆盖属性词</li>
      <li @click="setAttr('add')">增加属性词</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "attrWordBtn",
  props: {
    disabled: {
      type: Boolean | Number,
      default: true,
    },
    tip:{
      type:String,
      default:'请选择资讯'
    }
  },
  methods: {
    setAttr(type){
      this.$emit('setAttr',type)
    }
  },
};
</script>

<style scoped lang="scss">
.attr-word-btn {
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
