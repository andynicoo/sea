<template>
  <div class="layout-public-wrap">
    <Header nav />
    <div class="main-content">
      <router-view :key="$route.path"></router-view>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from './Header'
import Footer from './Footer'
export default {
  components: {
    Header,
    Footer
  },
  data: () => ({}),

  methods: {}
}
</script>

<style lang="scss" scoped>
.layout-public-wrap {
  width: 100vw;
  height: 100vh;
  background: #f5f6f9;
  position: relative;
  overflow: hidden;

  .main-content {
    padding: 20px;
    height: calc(100vh - 140px);
    background: #fff;
    overflow: auto;
  }
}
</style>
