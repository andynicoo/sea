<template>
  <div class="header-content">
    <img
      src="@/assets/images/logo-primary.svg"
      class="logo-image"
      @click="openPage('https://www.emalacca.com/')"
    />
    <div class="lang-select-wrap">
      <LangSelect v-if="lang" />
    </div>
    <div class="login-register-button" v-if="nav">
      <button @click="$router.push('/auth/login')">
        {{ $t('login.login') }}
      </button>
      <button @click="$router.push('/auth/register')">
        {{ $t('login.register') }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    LangSelect: () => import('@/components/LangSelect')
  },
  props: {
    lang: {
      type: Boolean,
      default: false
    },
    nav: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.header-content {
  height: 71px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  .logo-image {
    height: 34px;
    cursor: pointer;
  }
  .login-register-button {
    margin-left: auto;
    align-items: center;
    button {
      height: 32px;
      padding: 0 30px;
      border: 1px solid $primaryColor;
      margin: 0 12px;
      color: $primaryColor;
      &:hover {
        background: $primaryColor;
        color: #fff;
      }
    }
  }
}
</style>
