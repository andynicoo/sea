<template>
  <div id="iframeId" style="height: calc(100vh - 66px);"></div>
</template>

<script>
import { toPage } from '@/util'
export default {
  mounted() {
    toPage('/order/out')
  }
}
</script>
