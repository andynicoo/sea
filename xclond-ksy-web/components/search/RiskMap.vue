<template>
  <div class="riskmaps ksy-pl-5">
    <span class="yuan1"></span>
    <span class="tip1">低风险</span>
    <span class="tips1">立即注册</span>
    <span class="yuan2 ksy-ml-5"></span>
    <span class="tip1">中风险</span>
    <span class="tips1">尝试注册</span>
    <span class="yuan3  ksy-ml-5"></span>
    <span class="tip1">高风险</span>
    <span class="tips1">谨慎注册</span>
  </div>
</template>

<style lang="less">
.riskmaps {
  display: inline-block;
  .yuan1 {
    width: 8px;
    height: 8px;
    background: #00a870;
    display: inline-block;
    border-radius: 50%;
  }
  .yuan2 {
    width: 8px;
    height: 8px;
    background: #FFAC0A;
    display: inline-block;
    border-radius: 50%;
  }
  .yuan3 {
    width: 8px;
    height: 8px;
    background: #E34D59;
    display: inline-block;
    border-radius: 50%;
  }
  .tip1 {
    color: @textColor6;
    font-size: 12px;
  }
  .tips1 {
    color: @textColor4;
    font-size: 12px;
  }
}
</style>
