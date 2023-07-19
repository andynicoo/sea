<template>
  <keep-alive :include="['RouteWrapper', 'goodsselectiontool']">
    <router-view></router-view>
  </keep-alive>
</template>
<script>
export default {
  name: 'RouteWrapper'
}
</script>

<style></style>
