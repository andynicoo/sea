<template>
  <div class="layout-sider-children">
    <div class="layout-sider-children-item" v-if="envpla === 'kqy'">
      <Tooltip placement="right">
        <div slot="content">
          <router-link to="/renewal" @click.native="handClick('/renewal', '/renewal')">续费管理</router-link>
        </div>
        <router-link to="/renewal" @click.native="handClick('/renewal', '/renewal')">
          <div :class="{ imgbox: activeName === '/renewal' }">
            <img src="@/assets/images/common/icon-xf-cur.svg" v-if="activeName === '/renewal'" class="menu-icon" />
            <img src="@/assets/images/common/icon-xf.svg" v-else class="menu-icon" />
          </div>
        </router-link>
      </Tooltip>
    </div>
    <div v-if="envpla === 'ksy'">
      <div class="layout-sider-children-item">
        <Tooltip placement="right">
          <div slot="content">
            <router-link to="/serviceList" @click.native="handClick('/serviceList', '/serviceList')"
              >购买服务</router-link
            >
          </div>
          <router-link to="/serviceList" @click.native="handClick('/serviceList', '/serviceList')">
            <div :class="{ imgbox: activeName === '/serviceList' }">
              <img
                src="@/assets/images/common/icon-gm-cur.svg"
                v-if="activeName === '/serviceList'"
                class="menu-icon"
              />
              <img src="@/assets/images/common/icon-gm.svg" v-else class="menu-icon" />
            </div>
          </router-link>
        </Tooltip>
      </div>
      <div class="layout-sider-children-item">
        <Tooltip placement="right">
          <div slot="content">
            <router-link to="/renewal" @click.native="handClick('/renewal', '/renewal')">续费管理</router-link>
          </div>
          <router-link to="/renewal" @click.native="handClick('/renewal', '/renewal')">
            <div :class="{ imgbox: activeName === '/renewal' }">
              <img src="@/assets/images/common/icon-xf-cur.svg" v-if="activeName === '/renewal'" class="menu-icon" />
              <img src="@/assets/images/common/icon-xf.svg" v-else class="menu-icon" />
            </div>
          </router-link>
        </Tooltip>
      </div>
      <div class="layout-sider-children-item">
        <Tooltip placement="right">
          <div slot="content">
            <router-link to="/work" @click.native="handClick('/work', '/work')">工作台</router-link>
          </div>
          <router-link to="/work" @click.native="handClick('/work', '/work')">
            <div :class="{ imgbox: activeName === '/work' }">
              <img src="@/assets/images/common/icon-gzt-cur.svg" v-if="activeName === '/work'" class="menu-icon" />
              <img src="@/assets/images/common/icon-gzt.svg" v-else class="menu-icon" />
            </div>
          </router-link>
        </Tooltip>
      </div>
      <div class="tiaos"></div>
      <div class="layout-sider-children-item">
        <Dropdown placement="right-start">
          <div :class="{ imgbox: activeOpenMenu === '/taxation' }">
            <img
              src="@/assets/images/common/icon-vat-cur.svg"
              v-if="activeOpenMenu === '/taxation'"
              class="menu-icon"
            />
            <img src="@/assets/images/common/icon-vat.svg" v-else class="menu-icon" />
          </div>
          <DropdownMenu slot="list">
            <DropdownItem :selected="activeName === '/myVantService'">
              <a @click="handClick('/myVantService', '/taxation')"> VAT税号 </a>
            </DropdownItem>
            <DropdownItem :selected="activeName === '/filingManagement'">
              <a @click="handClick('/filingManagement', '/taxation')"> VAT申报 （{{ declareNum }}） </a>
            </DropdownItem>
            <DropdownItem :selected="activeName === '/annalsDeList'">
              <a @click="handClick('/annalsDeList', '/taxation')"> 年报管理 </a>
            </DropdownItem>
            <DropdownItem :selected="activeName === '/varletters'">
              <a @click="handClick('/varletters', '/taxation')"> VAT信件（{{ $store.state.login.xinjianCount }}） </a>
            </DropdownItem>
            <DropdownItem :selected="activeName === '/computedTax'">
              <a @click="handClick('/computedTax', '/taxation')"> 一键算税 </a>
            </DropdownItem>
            <DropdownItem :selected="activeName === '/addedServices'">
              <a @click="handClick('/addedServices', '/taxation')"> 增值服务申请 </a>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div class="layout-sider-children-item">
        <Dropdown placement="right-start">
          <div :class="{ imgbox: activeOpenMenu === '/EPRList' }">
            <img src="@/assets/images/common/icon-erp-cur.svg" v-if="activeOpenMenu === '/EPRList'" class="menu-icon" />
            <img src="@/assets/images/common/icon-erp.svg" v-else class="menu-icon" />
          </div>
          <DropdownMenu slot="list">
            <DropdownItem :selected="activeName === '/complianceBusiness/EPRList'">
              <a @click="handClick('/complianceBusiness/EPRList', '/EPRList')">
                EPR注册
              </a>
            </DropdownItem>
            <DropdownItem :selected="activeName === '/complianceBusiness/EPRDeclareList'">
              <a @click="handClick('/complianceBusiness/EPRDeclareList', '/EPRList')">
                EPR申报工作台
              </a>
            </DropdownItem>
            <DropdownItem :selected="activeName === '/complianceBusiness/addCategoryBrandList'">
              <a @click="handClick('/complianceBusiness/addCategoryBrandList', '/EPRList')">
                EPR加类加品牌工作台
              </a>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div class="layout-sider-children-item">
        <Dropdown placement="right-start">
          <div :class="{ imgbox: activeOpenMenu === '/manageList' }">
            <img
              src="@/assets/images/common/icon-hg-cur.svg"
              v-if="activeOpenMenu == '/manageList'"
              class="menu-icon"
            />
            <img src="@/assets/images/common/icon-hg.svg" v-else class="menu-icon" />
          </div>
          <DropdownMenu slot="list">
            <DropdownItem :selected="activeName === '/complianceBusiness/manageList'">
              <a @click="handClick('/complianceBusiness/manageList', '/manageList')"> 欧代/英代/美代 </a>
            </DropdownItem>
            <DropdownItem :selected="activeName === '/complianceBusiness/filingList'">
              <a @click="handClick('/complianceBusiness/filingList', '/manageList')"> 合规备案 </a>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div class="layout-sider-children-item">
        <Dropdown placement="right-start">
          <div :class="{ imgbox: activeOpenMenu === '/storeList' }">
            <img src="@/assets/images/common/icon-dp-cur.svg" v-if="activeOpenMenu == '/storeList'" class="menu-icon" />
            <img src="@/assets/images/common/icon-dp.svg" v-else class="menu-icon" />
          </div>
          <DropdownMenu slot="list">
            <DropdownItem :selected="activeName === '/storeManage/storeList'">
              <a @click="handClick('/storeManage/storeList', '/storeList')"> 店铺列表 </a>
            </DropdownItem>
            <DropdownItem :selected="activeName === '/storeManage/salesReport'">
              <a @click="handClick('/storeManage/salesReport', '/storeList')"> 销售报告管理 </a>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    <div class="layout-sider-children-item" v-if="envpla === 'ksy' || envpla === 'kqy'">
      <Dropdown placement="right-start">
        <div :class="{ imgbox: activeOpenMenu === '/userCenter' }">
          <img
            src="@/assets/images/common/icon-user-cur.svg"
            v-if="activeOpenMenu == '/userCenter'"
            class="menu-icon"
          />
          <img src="@/assets/images/common/icon-user.svg" v-else class="menu-icon" />
        </div>
        <DropdownMenu slot="list">
          <DropdownItem :selected="activeName === '/orderList'">
            <a @click="handClick('/orderList', '/userCenter')"> 我的订单 </a>
          </DropdownItem>
          <DropdownItem :selected="activeName === '/user'">
            <a @click="handClick('/user', '/userCenter')"> 我的信息 </a>
          </DropdownItem>
          <DropdownItem :selected="activeName === '/coupon'">
            <a @click="handClick('/coupon', '/userCenter')"> 优惠券 </a>
          </DropdownItem>
          <DropdownItem :selected="activeName === '/otherService'">
            <a @click="handClick('/otherService', '/userCenter')"> 其他服务 </a>
          </DropdownItem>
          <DropdownItem :selected="activeName === '/integralMal'">
            <a @click="handClick('/integralMal', '/userCenter')"> 我的积分 </a>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    activeName: {
      default: '',
      type: String,
    },
    activeOpenMenu: {
      default: '',
      type: String,
    },
    declareNum: {
      default: 0,
      type: Number,
    },
  },
  computed: {
    ...mapGetters(['sidebar', 'token']),
    // 菜单收缩标识
    isCollapsed: {
      get() {
        return this.$store.getters.sidebar.opened;
      },
      set() {},
    },
  },
  methods: {
    handClick(val1, val2) {
      this.$emit('handClick', {
        path: val1,
        activeOpenMenu: val2,
      });
      console.log(val1);
      this.$router.push({ path: val1 });
    },
  },
};
</script>

<style lang="less" scoped>
.layout-sider-children {
  display: flex;
  flex-direction: column;
  width: 64px;
  align-items: center;
  height: 100%;
  .layout-sider-children-item {
    height: 64px;
    width: 100%;
    text-align: center;
    line-height: 64px;
    cursor: pointer;
    /deep/ .ivu-tooltip-rel {
      a {
        width: 64px;
        height: 64px;
        display: block;
      }
    }
    /deep/ .ivu-tooltip-popper {
      left: 66px !important;
      // background: rgba(0, 0, 0, 0.75);
      a {
        color: #ffffff;
        display: block;
        width: 100%;
        padding: 8px 12px;
      }
      .ivu-tooltip-arrow {
        border-right-color: rgba(0, 0, 0, 0.75);
      }
      .ivu-tooltip-inner {
        background: rgba(0, 0, 0, 0.75);
      }
    }
    /deep/ .ivu-select-dropdown {
      width: 165px !important;
      left: 65px !important;
      background: rgba(0, 0, 0, 0.75);
      box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05), 0px 6px 16px 0px rgba(0, 0, 0, 0.08),
        0px 3px 6px -4px rgba(0, 0, 0, 0.12);
      .ivu-dropdown {
        width: 64px;
      }
      .ivu-dropdown-item {
        font-size: 14px;
        font-family: 'Microsoft Yahei', 'PingFang SC', sans-serif;
        font-weight: 400;
        color: #ffffff;
        line-height: 18px;
        text-align: left;
        padding: 0px;
      }
      .ivu-dropdown-item:hover {
        background: #1890ff;
      }
      .ivu-dropdown-item-selected,
      .ivu-dropdown-item-selected:hover {
        background: #1890ff;
      }
      a {
        color: #ffffff;
        display: block;
        width: 100%;
        padding: 7px 16px;
      }
    }
  }
  .active {
    background: #1890ff;
  }
}
.imgbox {
  width: 40px;
  height: 40px;
  background: #e6f7ff;
  border-radius: 4px 4px 4px 4px;
  opacity: 1;
  line-height: 40px;
  margin: 0 auto;
  img {
    vertical-align: middle;
  }
}
.tiaos {
  width: 48px;
  height: 1px;
  background: #e6e6e6;
  border-radius: 0px 0px 0px 0px;
  opacity: 1;
}
</style>
