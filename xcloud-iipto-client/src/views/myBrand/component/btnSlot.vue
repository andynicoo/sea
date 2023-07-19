<template>
  <div class="answer-box-footer">
    <slot></slot>
  </div>
</template>
<style lang="less" scoped>
.answer-box-footer {
  height: 56px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 24px;
  border-top: 1px solid rgba(153, 153, 153, 0.2);
  button {
    margin-left: 8px;
  }
}
</style>
