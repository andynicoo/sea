<template>
  <Modal v-model="show" width="500" class-name="dialog-rules" :closable="false" :footer-hide="true">
    <template #header></template>
    <div class="dialog-rules-content">
      <img src="../images/new/rule-title.png" alt="" />
      <p v-for="(rule, index) in rules" :key="index">
        {{ `${index + 1}、${rule}` }}{{ rules.length - index === 1 ? '。' : ';' }}
      </p>
      <div class="close-btn-wrap">
        <div class="close-btn" @click="handleClose">我知道了</div>
      </div>
    </div>
  </Modal>
</template>
<script>
export default {
  name: 'DialogRules',
  data() {
    return {
      show: false,
    };
  },
  props: {
    rules: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    handleClose() {
      this.show = false;
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .ivu-modal {
  border-radius: 10px;
  &-content {
    background: none;
    padding: 0;
    box-shadow: none;
    .ivu-modal-body {
      padding: 0;
    }
  }
}
/deep/ .ivu-modal-content {
  background: none;
  padding: 0;
  box-shadow: none;
}
.close-btn-wrap {
  display: flex;
  justify-content: center;
  padding: 0;
  margin-top: 40px;
  .close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 151px;
    height: 36px;
    border: 2px solid #ffeaab;
    background: linear-gradient(180deg, #ff794a 0%, #e53c15 100%);
    border-radius: 18px;
    font-size: 16px;
    font-weight: 500;
    color: #fef3ea;
  }
}
.dialog-rules-content {
  background: #fef3ea;
  border-radius: 20px;
  font-size: 14px;
  color: #b1776d;
  line-height: 2em;
  color: #666666;
  box-shadow: -6px -9px 13px 0px rgba(217, 132, 66, 0.23), 4px 5px 6px 0px rgba(217, 132, 66, 0.24);
  img {
    display: block;
    width: 100%;
    margin-bottom: 32px;
  }
  padding: 0 32px 32px;
}
.new {
  .dialog-rules-content {
    background: linear-gradient(137deg, #ffffff 0%, #d8e3ff 100%);
    box-shadow: inset 0px 4px 6px 0px #b1ccff;
    img {
      width: 290px;
      margin-left: auto;
      margin-right: auto;
      position: relative;
      top: -15px;
      margin-bottom: 20px;
    }
    .close-btn {
      border: 0;
      background: linear-gradient(180deg, #a0aaff 11%, #1e1cc4 71%);
    }
  }
}
</style>
