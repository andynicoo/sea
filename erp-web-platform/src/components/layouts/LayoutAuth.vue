<template>
  <div class="layout-auth-wrap">
    <Header lang />
    <div class="auth-content">
      <div class="left-image-content">
        <div class="content-headline">马六甲ERP</div>
        <div class="content-info">{{ $t('login.platformDescribed') }}</div>
      </div>
      <div class="right-form-content">
        <router-view :key="$route.path"></router-view>
      </div>
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
.layout-auth-wrap {
  width: 100vw;
  height: 100vh;
  background: #f5f6f9;
  position: relative;
  overflow: hidden;

  .auth-content {
    width: 1000px;
    height: 550px;
    background: #fff;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    display: flex;
    border-radius: 0 10px 10px 0;
    .left-image-content {
      width: 480px;
      height: 100%;
      text-align: center;
      padding-top: 50px;
      background: url('../../assets/images/auth-page-banner.png');
      background-size: 100% 100%;
      color: #fff;
      .content-headline {
        font-weight: 500;
        font-size: 35px;
      }
      .content-info {
        margin-top: 8px;
        font-size: 16px;
      }
    }
    .right-form-content {
      flex: 1;
    }
  }
}
</style>
