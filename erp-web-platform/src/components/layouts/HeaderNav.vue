<template>
  <div class="emalacca-app-header-wrap me-headcontent">
    <div class="logo-wrap">
      <img
        src="@/assets/images/logo-primary.svg"
        height="36"
        @click="$router.push('/overview')"
      />
    </div>

    <div class="emalacca-header-nav-wrap">
      <div v-for="item in computeMenu" :key="item.menuId" class="nav-main-item">
        <span
          @click="handleClick(null, item)"
          class="main-nav-name"
          :class="{
            active: rootMainIsActive(item.href)
          }"
          v-show="item.menuName.indexOf('套餐') == -1"
        >
          {{ item.menuI18n | menuLang }}
          <span class="buttom-line" v-if="rootMainIsActive(item.href)"></span>
        </span>
        <div
          class="sub-nav-wrap me-goods-nav"
          v-if="
            selectivePlatform(morePlatformMenu, item) &&
              item.children &&
              item.children.length
          "
        >
          <a-tabs
            v-model="selectPlatform"
            tab-position="left"
            type="card"
            @tabClick="
              (key) => menuChange(key, platformMenus[item.menuName].children)
            "
          >
            <a-tab-pane
              :key="Nav.menuName"
              v-for="Nav in platformMenus[item.menuName]
                ? platformMenus[item.menuName].children
                : []"
            >
              <template slot="tab">
                <div class="me-menu-ic">
                  <i class="iconfont" :class="Nav.icon"></i>{{ Nav.menuName }}
                </div>
              </template>
              <div v-for="subNav in Nav.children" :key="subNav.menuId">
                <p class="sub-nav-name">{{ subNav.menuI18n | menuLang }}</p>
                <div class="grand-sub-wrap">
                  <span
                    class="grand-sub-item"
                    v-for="grandSubItem in subNav.children"
                    :key="grandSubItem.menuId"
                    @click.stop="handleClick(grandSubItem.href, item)"
                  >
                    {{ grandSubItem.menuI18n | menuLang }}
                    <span
                      class="me-newic"
                      v-if="grandSubItem.href == 'leliaochat'"
                    >
                      new
                    </span>
                  </span>
                </div>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
        <div
          class="sub-nav-wrap"
          v-else-if="item.children && item.children.length"
        >
          <div v-for="subItem in item.children" :key="subItem.menuId">
            <p class="sub-nav-name">
              {{ subItem.menuI18n | menuLang }}
            </p>
            <div class="grand-sub-wrap">
              <span
                class="grand-sub-item"
                v-for="grandSubItem in subItem.children"
                :key="grandSubItem.menuId"
                @click.stop="handleClick(grandSubItem.href, item)"
              >
                {{ grandSubItem.menuI18n | menuLang }}
                <span class="me-newic" v-if="grandSubItem.href == 'leliaochat'">
                  new
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="emalacca-header-right-operation">
      <!-- <a-button
        style="background: #fe5044; color: #fff"
        @click="goMemberCenter"
      >
        订购套餐
      </a-button> -->
      <MessagePopover />

      <LangSelect class="operation-item" />
      <a
        class="operation-item"
        @click="openPage('/information/info-list?type=1&listId=-1')"
        target="_blank"
      >
        <i class="iconfont iconshiyongjiaocheng news"></i>
        {{ $t('common.course') }}
      </a>
      <a class="operation-item" @click="openPage('/pay/center')">
        <img src="@/assets/images/recharge-button.png" alt="" />
      </a>

      <a-popover
        :title="null"
        placement="bottomRight"
        trigger="hover"
        @visibleChange="onVisibleChange"
        overlayClassName="xxxx"
      >
        <template slot="content">
          <div style="width: 350px">
            <div
              class="me-vipcontent"
              :class="{
                memberfree: memberInfo.level === 0,
                membervip: memberInfo.level === 1,
                membervip1: memberInfo.level === 2,
                membervip2: memberInfo.level === 3,
                membervip3: memberInfo.level === 4
              }"
            >
              <p class="me-account">
                账号:
                <span @click="openPage('/user/info')">
                  {{ userInfo.maAccount }}
                </span>

                <span class="signout me-fr" @click="handleLogut()">
                  {{ $t('common.signout') }}
                </span>
              </p>
              <p>当前版本:{{ memberInfo.name }}</p>
              <p v-if="memberInfo.level !== 0">
                套餐时间:{{
                  moment(memberInfo.startTime).format('YYYY-MM-DD')
                }}-{{ moment(memberInfo.endTime).format('YYYY-MM-DD') }}
              </p>
              <!-- <a-space>
                <div
                  class="vipbtn"
                  @click="$router.push('/member/Index')"
                  :style="{
                    marginTop: memberInfo.level === 0 ? '15px' : '2px'
                  }"
                >
                  升级套餐
                </div>
                <div
                  class="vipbtn coupon"
                  @click="$router.push('/member/coupon')"
                  :style="{
                    marginTop: memberInfo.level === 0 ? '15px' : '2px'
                  }"
                >
                  我的优惠券
                </div>
              </a-space> -->
            </div>
            <div class="me-memberinfo">
              <h2>我的特权</h2>
              <div
                v-if="memberInfo.myPrivilege && memberInfo.myPrivilege.length"
              >
                <p v-for="item in memberInfo.myPrivilege" :key="item.name">
                  <template v-if="item.name === '图片空间'">
                    <span> {{ item.name }}: </span>
                    <span v-if="item.current > 0">
                      {{ Number(item.current / 1024 / 1024).toFixed(2) }}
                    </span>
                    <span v-else>{{ item.current }}</span>
                    <span> / {{ item.total }} {{ item.unit }} </span>
                  </template>
                  <template v-else>
                    <span v-show="item.total !== 0">
                      {{ item.name }}
                      <span v-show="item.dayUnit">({{ item.dayUnit }})</span>
                      :
                      <span
                        v-show="
                          item.name !== '采集箱数据存储天数' &&
                            item.name !== '订单数据存储天数'
                        "
                      >
                        {{ item.current }} /
                      </span>
                      {{ item.total }}
                      {{ item.unit }}
                    </span>

                    <!-- item.total===0，并且unit!='不限制' || unit!='独立付费'，显示'不限制' -->
                    <span v-show="item.total === 0">
                      <span
                        v-if="
                          item.unit === '不限制' || item.unit === '独立付费'
                        "
                      >
                        {{ item.name }}:{{ item.unit }}
                      </span>
                      <span v-else> {{ item.name }}:不限制 </span>
                    </span>
                  </template>
                </p>
              </div>
            </div>
          </div>
        </template>
        <a
          class="ant-dropdown-link"
          @click="(e) => e.preventDefault()"
          style="margin-right: 12px"
        >
          <template v-if="getAvatar">
            <img
              :src="getAvatar"
              height="36"
              style="height: 36px; width: 36px"
            />
          </template>
          <template v-else>
            <img
              src="@/assets/images/avatar.png"
              height="36"
              style="height: 36px; width: 36px"
              contain
            />
          </template>
        </a>
      </a-popover>
    </div>
  </div>
</template>

<script>
import { leliao } from '@/util/index'
import { mapState } from 'vuex'
import LangSelect from '@/components/LangSelect'
import MessagePopover from '@/views/message/components/MessagePopover'
import Cookies from 'js-cookie'
import Basic from '@/api/basic'
import member from '@/api/member'
import moment from 'moment'

export default {
  components: {
    LangSelect,
    MessagePopover
  },
  computed: {
    ...mapState({
      menuList: (state) => state.auth.menuList,
      userInfo: (state) => state.auth.userInfo,
      memberInfo: (state) => state.auth.memberInfo,
      getAvatar: (state) => state.auth.headImgurl,
      drawerWidthStore: (state) => state.app.drawerWidth,
      leftMenuList: (state) => state.app.leftMenuList
      // selectPlatform: (state) => state.product.selectPlatform
    }),

    selectPlatform: {
      get() {
        return this.$store.state.product.selectPlatform
      },
      set(val) {
        this.$store.state.product.selectPlatform = val
      }
    },
    computeMenu() {
      // 过滤掉按钮
      const filterMenu = (menuList) => {
        return menuList
          .filter((item) => {
            return item.menuType !== 'F'
          })
          .map((item) => {
            return {
              ...item,
              children: item.children && filterMenu(item.children)
            }
          })
      }

      return filterMenu(this.menuList)
    },
    //是否有选择平台
    selectivePlatform() {
      return (morePlatformMenu, menus) => {
        if (morePlatformMenu.includes(menus.menuName)) {
          let menuLen = menus.children.filter(
            (item) => item.menuName == '选择平台'
          ).length
          if (menuLen) {
            return true
          }
          return false
        } else {
          return false
        }
      }
    },
    // 根结点是否需要高亮
    rootMainIsActive() {
      return (current) => {
        return this.$route.path.split('/')[1].search(current) >= 0
      }
    },
    // 左侧菜单是否可见
    leftMenuVisible() {
      return this.leftMenuList && this.leftMenuList.children
        ? this.leftMenuList.children
        : false
    },
    curPath() {
      return this.$route.path
    }
  },
  filters: {
    menuLang: function(value) {
      const obj = JSON.parse(value)
      // return obj.ma_ma
      return obj[Cookies.get('language')]
    },
    menuLangSlice: function(value) {
      const obj = JSON.parse(value)
      var newMenu
      obj[Cookies.get('language')].length > 9
        ? (newMenu = obj[Cookies.get('language')].slice(0, 9) + '...')
        : (newMenu = obj[Cookies.get('language')])
      return newMenu
    }
  },
  data() {
    return {
      moment,
      morePlatformMenu: ['商品', '订单'],
      platformMenus: {},
      memberList: [] // 预售期间显示，预售期过后删除相关
      // goodsKey: 1
    }
  },
  created() {
    this.computeMenu.forEach((item) => {
      if (this.$data.morePlatformMenu.includes(item.menuName)) {
        this.handlePlatformMenu(item.menuName)
      }
    })
    member.getMemeberLevelInfo({}).then((res) => {
      this.$store.commit('SET_MEMBER_INFO', res.data)
    })
  },
  mounted() {
    // const { path } = this.$route
    // if (!localStorage.getItem('first-view-nav-change') && !/auth/.test(path)) {
    //   this.setGuide()
    //   localStorage.setItem('first-view-nav-change', 1)
    // }
  },

  methods: {
    // 每次hover头像时，更新个人套餐信息(使用量)
    onVisibleChange(visible) {
      if (visible) {
        member.getMemeberLevelInfo({}).then((res) => {
          this.$store.commit('SET_MEMBER_INFO', res.data)
        })

        // 预售相关，过期删除
        const params = {
          status: 'NORMAL',
          size: 10,
          current: 1
        }
        member.getMemberListType(params).then((res) => {
          console.log(res)
          this.memberList = res.data?.records
        })
      }
    },
    menuChange(key, platform) {
      console.log(key, platform)
      // this.$data.goodsKey = key
      this.$store.commit('setSelectPlatform', key)
      platform.forEach((item) => {
        if (item.menuName == key) {
          this.$router.push(item.href)
        }
      })
    },
    //处理多平台菜单
    handlePlatformMenu(menuTxt) {
      let menus = this.computeMenu.filter((item) => item.menuName == menuTxt)[0]
      if (!menus) return false
      let platform = menus.children.filter(
        (item) => item.menuName == '选择平台'
      )[0]
      if (!platform) return false

      platform.children.forEach((ele) => {
        // console.log(ele, 99)
        // ele.children = []
        this.$set(ele, 'children', [])
        if (menuTxt == '商品') {
          ele.children = menus.children.filter(
            (item) => item.menuName == '商品采集'
          )
        }
        menus.children.forEach((ele2) => {
          if (ele2.menuName.includes(ele.menuName)) {
            ele.children.push(ele2)
          }
        })
      })
      this.$set(this.$data.platformMenus, menuTxt, platform)
    },
    setGuide() {
      let data = [
        {
          element: document.querySelector('.emalacca-header-nav-wrap'),
          intro: this.$t('goodsCollection.tooltipTitle22'),
          position: 'bottom'
        }
      ]
      this.$intro()
        .setOptions({
          showBullets: false,
          steps: data,
          tooltipClass: 'me-introjs-tooltip',
          highlightClass: 'me-introjs-highlight',
          doneLabel: this.$t('goodsCollection.iiKnowThat')
        })
        .start()
    },
    handleClick(href, menuModule) {
      if (href == 'leliaochat') {
        leliao(this.$store.getters.getAccessToken)
      } else {
        if (href == this.$route.path) return false
        if (href && href != this.$route.path) {
          this.$router.push({
            path: href
          })
        } else if (menuModule.children && menuModule.children.length > 0) {
          //点击的是根结点菜单,就去该模块的第一个页面
          let firstChildrenPath = menuModule.children[0].children[0]
          this.$router.push({
            path: firstChildrenPath.href
          })
        } else {
          // 根结点直接跳转
          this.$router.push({
            path: '/' + menuModule.href
          })
        }
        let targetLeftModule = menuModule.children ? menuModule : null
        this.$store.commit('SET_LEFT_MENU', targetLeftModule)
      }
    },
    loadPage(route) {
      this.$router.push(route)
    },
    async handleLogut() {
      // window._VV.$emit('SHOW_SNACKBAR', {
      //   text: window._VV.getLocalLang('prompt', 'logoutSuccess'),
      //   color: 'success'
      // })
      let data = await Basic.signOut()
      console.log(data)
      window._VV.$store.commit('SET_ACCESS_TOKEN', null)
      window.location.reload('/auth')
      sessionStorage.clear()
    },
    goMemberCenter() {
      this.$router.push({
        path: '/member/Index'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.emalacca-app-header-wrap {
  height: 60px;
  width: 100%;
  background: #fff;
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  box-shadow: 0px 2px 11px 0px rgba(180, 180, 180, 0.5);
  .logo-wrap {
    width: 175px;
    img {
      height: 36px;
      margin-top: 12px;
      margin-left: 20px;
      cursor: pointer;
    }
  }
  .emalacca-header-nav-wrap {
    height: 60px;
    display: flex;
    line-height: 60px;
    // margin-left: 38px;
    .nav-main-item {
      user-select: none;
      position: relative;
      .main-nav-name {
        font-size: 16px;
        font-weight: 400;
        cursor: pointer;
        position: relative;
        display: inline-block;
        width: 100%;
        padding: 0 14px;
        color: #606166;
        min-width: 60px;

        &.active {
          color: $primaryColor;
        }
        .buttom-line {
          position: absolute;
          bottom: 8px;
          left: 30%;
          height: 2px;
          width: 40%;
          background: $primaryColor;
        }
      }
      .sub-nav-wrap {
        position: absolute;
        width: auto;
        min-width: 366px;
        top: 60px;
        z-index: 10;
        background: #fff;
        display: none;
        box-shadow: 0px 2px 9px 0px rgba(177, 177, 177, 0.5);
        border-radius: 5px;
        padding: 12px 12px 0 12px;
        .sub-nav-name {
          font-weight: 500;
          line-height: 30px;
          color: #999;
          font-size: 12px;
        }
        .grand-sub-wrap {
          width: 100%;
          float: left;
          line-height: 30px;
          margin-bottom: 12px;
          .grand-sub-item {
            cursor: pointer;
            width: 112px;
            // background: #ccc;
            float: left;
            margin-right: 1px;
            color: #606166;
            &:hover {
              color: $primaryColor;
            }
          }
        }
      }
      &:hover .sub-nav-wrap {
        display: block;
      }
    }
  }
  .emalacca-header-right-operation {
    margin-left: auto;
    line-height: 60px;
    display: flex;
    padding-right: 4px;
    user-select: none;
    align-items: center;
    a {
      color: #65666c !important;
      i {
        margin-right: 5px;
      }
    }
    .operation-item {
      cursor: pointer;
      color: #65666c;
      min-width: 100px;
      img {
        height: 28px;
      }
    }
    .avatar-wrap {
      margin-left: 8px;
    }
  }
}

.box {
  width: 100%;
  margin: 0 auto;
  border: 1px solid #ff6700;
  overflow: hidden;
}

.animate {
  padding-left: 20px;
  font-size: 12px;
  color: #000;
  display: inline-block;
  white-space: nowrap;
  animation: 20s wordsLoop linear infinite normal;
}

@keyframes wordsLoop {
  0% {
    transform: translateX(100%);
    -webkit-transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
    -webkit-transform: translateX(-100%);
  }
}

@-webkit-keyframes wordsLoop {
  0% {
    transform: translateX(100%);
    -webkit-transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
    -webkit-transform: translateX(-100%);
  }
}

.me-goods-nav {
  padding: 0 !important;
  background: #f8f8f8 !important;
  min-width: 486px !important;
  ::v-deep .ant-tabs {
    .ant-tabs-left-content {
      padding-top: 10px;
      background: #fff;
      border: none;
      min-height: 150px;
    }
    .ant-tabs-left-bar {
      border: none !important;
    }
    .ant-tabs-tab {
      border: none !important;
    }
    .ant-tabs-tab {
      height: 48px !important;
      line-height: 48px !important;
      margin-bottom: 0 !important;
    }
  }
}

.iconshopee-logo1,
.iconLAZADA {
  font-size: 24px !important;
  margin-right: 8px !important;
  position: relative;
  top: -3px;
  color: #ff6b38;
  vertical-align: middle;
}
.iconLAZADA {
  display: inline-block;
  width: 24px;
  height: 24px;
  background: url('../../assets/images/laz.png');
  background-size: cover;
  top: -2px;
  left: -2px;
  &:before {
    opacity: 0;
  }
}
.me-menu-ic {
  height: 48px;
  overflow: hidden;
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
.me-memberinfo {
  padding: 10px 15px;
  h2 {
    font-size: 24px;
    margin: 2px 0px;
  }
  p {
    line-height: 30px;
  }
}
</style>
<style lang="scss">
// 预售样式，过期删除
.me-vipyushou {
  padding: 20px;
  .me-account {
    height: 45px;
    line-height: 45px;
    margin-bottom: 15px;
    border-bottom: 1px solid #dcdcdc;
    span {
      cursor: pointer;
      font-weight: bold;
    }
  }
  .me-memberinfo2 {
    h2 {
      font-size: 16px;
      margin: 2px 0px;
    }
    p {
      line-height: 30px;
    }
  }
}

.xxxx {
  .ant-popover-inner-content {
    padding: 0px !important;
  }
}
.me-vipcontent {
  height: 150px;
  padding: 20px;
  .me-account {
    font-size: 24px;
    span {
      font-size: 24px;
    }
    .signout {
      font-size: 14px;
      margin-top: 8px;
    }
  }
  p {
    padding: 2px 0px;
  }
  span {
    cursor: pointer;
  }
  .vipbtn {
    background: url('../../assets/images/vipbutton.png') no-repeat;
    width: 90px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
  }
  .coupon {
    background: #ffffff24;
    border-radius: 16px;
  }
}
.memberfree {
  background: url('../../assets/images/free.png') no-repeat;
  background-size: 350px 150px;
  color: #313f49;
  .coupon {
    color: #313f49;
  }
}
.membervip {
  background: url('../../assets/images/VIP.png') no-repeat;
  background-size: 350px 150px;
  color: #0f5d66;
  .coupon {
    color: #0f5d66;
  }
}
.membervip1 {
  background: url('../../assets/images/VIP1.png') no-repeat;
  background-size: 350px 150px;
  color: #405980;
  .coupon {
    color: #405980;
  }
}
.membervip2 {
  background: url('../../assets/images/VIP2.png') no-repeat;
  background-size: 350px 150px;
  color: #5c4327;
  .coupon {
    color: #5c4327;
  }
}
.membervip3 {
  background: url('../../assets/images/VIP3.png') no-repeat;
  background-size: 350px 150px;
  color: #eeeeda;
  .coupon {
    color: #eeeeda;
  }
}
</style>
