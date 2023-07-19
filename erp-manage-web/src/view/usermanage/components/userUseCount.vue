<template>
  <div class="usercount">
    <!-- <p>
      {{ userUseCount }}
    </p> -->
    <p><span>子账号创建数</span> {{ userUseCount.subAccountCount }}</p>
    <p><span>图片翻译数</span> {{ userUseCount.picTranslateCount }}</p>
    <p><span>商品采集数</span> {{ userUseCount.productCrawlCount }}</p>
    <p><span>发布商品数</span> {{ userUseCount.productPublishCount }}</p>
    <p><span>批量编辑数</span> {{ userUseCount.batchEditCount }}</p>
    <p><span>在线修图张数</span> {{ userUseCount.translateCount }}</p>
    <p><span>一键翻译题描述数量</span> {{ userUseCount.subAccountCount }}</p>
    <p><span>定时发布商品数</span> {{ userUseCount.timePushToolCount }}</p>
    <p><span>发起代打包下单数</span> {{ userUseCount.initiatePackageCount }}</p>
    <p><span>代打包下单完成数</span> {{ userUseCount.packageCompleteCount }}</p>
  </div>
</template>

<script>
export default {
  props: {
    userUseCount: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="less" scoped>
.usercount {
  p {
    height: 35px;
    line-height: 30px;
    background: #dcdcdc40;
    padding: 5px 0px;
    padding-left: 5px;
    span {
      width: 150px;
      display: inline-block;
    }
  }
}
</style>
