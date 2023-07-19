<template>
  <div class="app">
    <HeaderNav />
    <LeftMenu v-if="!hideLeftMenu" />

    <!-- <VersionUpdateTips /> -->
    <!-- <GlobalNotice v-model="globalNoticeVisible" /> -->
    <div
      class="emalacca-app-main"
      :style="{
        'margin-left': leftMenuVisible && !hideLeftMenu ? '175px' : '0',
        width: leftMenuVisible && !hideLeftMenu ? 'calc(100vw - 170px)' : ''
      }"
    >
      <a-config-provider :locale="locale">
        <div class="page-wrapper" :style="{}">
          <!-- <template v-if="!isShowStoreV1">
            <a-alert
              message="重大更新提示"
              type="warning"
              class="alert-width"
              :class="!isStoreV1MaxWidth ? 'max-width-auto' : 'max-width-1140'"
              closable
              :after-close="closeStoreV1"
            >
              <p slot="description">
                shopee官方进行了开放平台接口的更新升级，将从1.0接口升级到2.0，更新范围涉及到整个ERP系统，更新接口后将对产品体验、系统性能、安全性有大幅度提升，请各位卖家务必在2021-08-01前完成所有店铺在2.0接口重新授权。
                <a class="link-text-color" @click="openPage('/store')"
                  >去授权</a
                >
              </p>
            </a-alert>
          </template> -->
          <router-view />
        </div>
      </a-config-provider>
    </div>
    <BackTop />
  </div>
</template>

<script>
import HeaderNav from './HeaderNav'
import LeftMenu from './LeftMenu'

import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'

import zhTW from 'ant-design-vue/lib/locale-provider/zh_TW'

import enGB from 'ant-design-vue/lib/locale-provider/en_GB'

import thTH from 'ant-design-vue/lib/locale-provider/th_TH'

import ptPT from 'ant-design-vue/lib/locale-provider/pt_PT'

import viVN from 'ant-design-vue/lib/locale-provider/vi_VN'

import Cookies from 'js-cookie'

import moment from 'moment'

import 'moment/locale/zh-cn'

import 'moment/locale/en-gb'

moment.locale('ja-jp')
import { mapState } from 'vuex'
import { BackTop } from 'ant-design-vue'
export default {
  name: 'LayoutDefault',
  components: {
    HeaderNav,
    LeftMenu,
    // VersionUpdateTips,
    BackTop
  },
  data() {
    return {
      showDrawer: true,
      locale: zhCN,
      curlanguage: '',
      globalNoticeVisible: true,
      isShowStoreV1: false,
      isStoreV1MaxWidth: false
    }
  },

  computed: {
    ...mapState({
      leftMenuList: (state) => state.app.leftMenuList,
      storeSumV1: (state) => state.auth.storeSumV1,
      hideLeftMenu: (state) => state.vars?.hideLeftMenu
    }),
    leftMenuVisible() {
      return this.leftMenuList?.children?.length
    }
  },

  created() {
    this.curlanguage = Cookies.get('language')
    if (Cookies.get('language') == undefined) {
      this.curlanguage = 'zh_cn'
      Cookies.set('language', 'zh_cn')
    }
    if (this.curlanguage == 'zh_tw') {
      this.locale = zhTW
    } else if (this.curlanguage == 'zh_cn') {
      this.locale = zhCN
    } else if (this.curlanguage == 'en_bg') {
      this.locale = enGB
    } else if (this.curlanguage == 'th_th') {
      this.locale = thTH
    } else if (this.curlanguage == 'pt_pt') {
      this.locale = ptPT
    } else if (this.curlanguage == 'vi_vn') {
      this.locale = viVN
    } else {
      //  ant中，马来 印尼 转英语

      this.locale = enGB
    }
  },
  watch: {
    $route(to, from) {
      this.isShowStoreV1 = false
      this.isStoreV1MaxWidth = false
      if (/(\/goods\/)|(\/overview)|(\/order\/)/.test(to.path)) {
        this.isStoreV1MaxWidth = ['/goods/cnsc-edit', '/goods/edit'].includes(
          to.path
        )
        this.isShowStoreV1 = this.storeSumV1 > 0
      }
    }
  },

  methods: {
    handleDrawerVisiable() {
      this.$refs.drawer.toggleDrawer()
    },
    closeStoreV1() {
      this.isShowStoreV1 = false
    }
  }
}
</script>

<style lang="scss" scoped>
.app {
  min-width: 1200px;
  .emalacca-app-main {
    min-height: 100vh;
    width: 100%;
    padding-top: 60px;
    box-sizing: border-box;
    background: #f5f5f5;
  }
  .page-wrapper {
    width: 100%;
    padding: 3px;
  }
}
.alert-width {
  width: calc(100% - 16px);
  margin: 4px auto 0;
}
.max-width-auto {
  max-width: auto;
}
.max-width-1140 {
  max-width: 1140px;
}
</style>
