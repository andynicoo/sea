<template>
  <div
    class="emalacca-app-left-menu-wrap overflow-y"
    v-if="leftMenu.length > 0"
  >
    <div
      class="left-nav-item"
      v-for="item in leftMenu"
      :key="item.menuId"
      v-show="menuVisible(item.menuName)"
    >
      <p class="menu-main-name">
        {{ item.menuI18n | menuLang }}
      </p>
      <div
        class="menu-sub-wrap"
        v-for="subItem in item.children"
        :key="subItem.menuId"
      >
        <p
          class="sub-name"
          :data-left-menu="subItem.href"
          @click="handleClick(subItem.href, subItem.menuI18n)"
          :class="{
            active:
              isActive(subItem.href, subItem) || commActive(subItem.menuName)
          }"
        >
          <i class="iconfont" :class="subItem.icon"></i>
          <span class="menu-title"
            >{{ subItem.menuI18n | menuLang
            }}<span class="me-newic" v-if="subItem.href == 'leliaochat'"
              >new</span
            ></span
          >

          <span class="left-line" v-if="isActive(subItem.href)"></span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Cookies from 'js-cookie'
import { traceParentNode, leliao } from '@/util/index'
// import { debounce } from 'lodash'

/**
 * 菜单控制需要注意的几个点
 * 1. 有一部分三级页面是没有明确权限所属的，需要在切换到该页面后左侧保持上一级页面高亮项 residentPath 就是用来标识这一项的
 * 2. $route.path 变化时需要控制左侧菜单是否显示，所以要将特殊的三级页面做标记
 */

export default {
  data() {
    // this.setMenuName = debounce(this.setMenuName, 200)
    return {
      residentPath: null
    }
  },
  computed: {
    ...mapState({
      menuList: (state) => state.auth.menuList,
      leftMenuList: (state) => state.app.leftMenuList,
      selectPlatform: (state) => state.product.selectPlatform
    }),
    leftMenu() {
      return this.leftMenuList && this.leftMenuList.children
        ? this.leftMenuList.children
        : []
    },
    isActive() {
      return (currentHref) => {
        const flag =
          this.$route.path == currentHref || this.residentPath == currentHref
        return flag
      }
    },
    //显示对应平台菜单
    menuVisible() {
      return (currentName) => {
        if (this.selectPlatform == 'Shopee') {
          if (
            ['Lazada商品发布', 'Lazada店铺商品', 'Lazada订单管理'].includes(
              currentName
            )
          ) {
            return false
          } else {
            return true
          }
        } else if (this.selectPlatform == 'Lazada') {
          if (
            ['Shopee商品发布', 'Shopee店铺商品', 'Shopee订单管理'].includes(
              currentName
            )
          ) {
            return false
          } else {
            return true
          }
        }
      }
    },
    //选择平台菜单保持选中
    commActive() {
      return (currentName) => {
        if (this.$route.path.includes('/goods/lazada')) {
          if (currentName == 'Lazada') {
            return true
          }
        } else if (
          this.$route.path.includes('/goods') &&
          !this.$route.path.includes('/goods/goods-collection') &&
          !this.$route.path.includes('/goods/collect') &&
          !this.$route.path.includes('/goods/selection-tool')
        ) {
          if (currentName == 'Shopee') {
            return true
          }
        } else if (this.$route.path.includes('/order/lazada')) {
          if (currentName == 'Lazada') {
            return true
          }
        } else if (this.$route.path.includes('/order')) {
          if (currentName == 'Shopee') {
            return true
          }
        }
      }
    }
  },

  filters: {
    menuLang: function(value) {
      const obj = JSON.parse(value)
      return obj[Cookies.get('language')]
    }
  },

  watch: {
    '$route.path': {
      handler(newVal, oldVal) {
        function findMenuId(href, source, currentMenuId = []) {
          source.map((el) => {
            if (el.children && el.children.length > 0) {
              findMenuId(href, el.children, currentMenuId)
            }
            if (el.href == href) {
              currentMenuId.push(el.menuId)
            }
          })
          return currentMenuId[0]
        }

        let currId = findMenuId(newVal, this.menuList)
        // 需要常驻左侧菜单的特定页面,左侧菜单不动
        const NeedResident = [
          'goodsedit',
          'discountedit',
          'discounteditsetmeal',
          'discounteditfllow',
          'discounteditcoupon',
          'discounteditadditional',
          'discountloading',
          'discountdetail',
          'goodscnscedit',
          'orderfirstkilometerforecastinterior',
          'orderaftersaledetails',
          'ordersplitorder',
          'warehousemanagecreatesku',
          'warehousemanagecreatemanualinorder',
          'warehousemanagecreatemanualoutorder',
          'goodscreatepricingtemplate',
          'goodssourceresults'
        ]
        if (NeedResident.includes(this.$route.name)) {
          this.residentPath = oldVal
          return false
        }
        if (currId) {
          this.residentPath = null
          let parentNode = traceParentNode(currId, this.menuList)
          this.$store.commit('SET_LEFT_MENU', parentNode[parentNode.length - 1])
        } else {
          this.residentPath = null
          this.$store.commit('SET_LEFT_MENU', null)
        }

        //点击左侧菜单栏平台显示对应平台菜单
        if (newVal.includes('/goods/lazada')) {
          this.$store.commit('setSelectPlatform', 'Lazada')
        } else if (
          newVal.includes('/goods') &&
          !newVal.includes('/goods/goods-collection') &&
          !newVal.includes('/goods/collect')
        ) {
          this.$store.commit('setSelectPlatform', 'Shopee')
        } else if (newVal.includes('/order/lazada')) {
          this.$store.commit('setSelectPlatform', 'Lazada')
        } else if (newVal.includes('/order')) {
          this.$store.commit('setSelectPlatform', 'Shopee')
        }
      },
      immediate: true
    }
  },
  created() {},
  methods: {
    handleClick(href, platform) {
      if (href == 'leliaochat') {
        leliao(this.$store.getters.getAccessToken)
      } else {
        if (href != this.$route.path) {
          this.$router.push({
            path: href
          })
          if (platform == 'Shopee') {
            this.$store.commit('setSelectPlatform', 'Shopee')
          } else if (platform == 'Lazada') {
            this.$store.commit('setSelectPlatform', 'Lazada')
          }
        }
      }
    },
    setMenuName(menuName) {
      this.$store.commit('setVars', { menuName })
    }
  }
}
</script>

<style lang="scss" scoped>
.emalacca-app-left-menu-wrap {
  width: 175px;
  height: calc(100vh - 60px);
  position: fixed;
  left: 0;
  top: 60px;
  padding: 12px 0;
  z-index: 10;
  background: #fff;
  border-top: 1px solid #f5f5f5;
  overflow-x: hidden;
  overflow-y: hidden;
  &:hover {
    overflow-y: auto;
  }
  .left-nav-item {
    margin-bottom: 15px;
  }
  .menu-main-name {
    line-height: 36px;
    color: #65666c;
    font-size: 12px;
    padding: 0 12px;
  }
  .menu-sub-wrap {
    .sub-name {
      width: 100%;
      line-height: 40px;
      cursor: pointer;
      padding-left: 22px;
      position: relative;
      color: #606166;
      .iconfont {
        font-size: 14px;
        margin-right: 6px;
      }
      &.active {
        background: #f8f8f8;
        color: $primaryColor;
        font-weight: 400;
        .iconLAZADA {
          display: inline-block;
          width: 24px;
          height: 24px;
          background: url('../../assets/images/laz.png');
          background-size: cover;
          top: 11px;
        }
        .iconLAZADA:before {
          opacity: 0;
        }
      }
      .left-line {
        position: absolute;
        bottom: 4px;
        left: 0px;
        height: 32px;
        width: 2px;
        background: $primaryColor;
        border-radius: 4px;
      }
      &:hover {
        background: #f1f2f6;
      }
    }
  }
}
.iconshopee-logo1,
.iconLAZADA {
  font-size: 24px !important;
  margin-right: 0px !important;
  position: relative;
  top: 3px;
}
.me-newic {
  position: relative;
  background: #ff6b38;
  color: #fff;
  font-size: 12px;
  padding: 0 2px;
  border-radius: 2px;
  top: -5px;
}
</style>
