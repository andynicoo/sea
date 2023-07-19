<template>
  <a-modal
    :title="$t('collect.claimToShop')"
    :visible="claimVisible"
    :width="900"
    @cancel="cancel"
    dialogClass="me-claim-dialog"
  >
    <div class="me-claim-wrap">
      <!-- 选择平台 -->
      <dl class="me-selecte-platform">
        <dt>选择平台</dt>
        <dd
          class="band"
          v-for="item in platformOption"
          :key="item.name"
          :class="{ active: item.name == currentPlatform }"
          @click="changePlatform(item)"
        >
          <i class="iconfont me-platform-icon" :class="[item.icon]"></i
          >{{ item.value }} <span></span>
        </dd>
      </dl>
      <div class="me-w100b">
        <!-- 选择站点 -->
        <dl class="me-selecte-site">
          <dt>
            <a-checkbox
              :indeterminate="siteIndeterminate"
              :checked="siteCheckAll"
              @change="siteCheckAllChange"
            >
              选择站点
            </a-checkbox>
          </dt>
          <dd>
            <a-checkbox-group
              v-model="currentPlatformOption.siteCheckVal"
              @change="siteCheckChange"
            >
              <a-checkbox
                v-for="item in currentPlatformOption.option"
                :key="item.value"
                :value="item.value"
                >{{ item.label }}({{ item.value }})</a-checkbox
              >
            </a-checkbox-group>
          </dd>
        </dl>

        <!-- 选择店铺 -->
        <dl class="me-selecte-store">
          <dt
            v-show="
              currentPlatformOption && currentPlatformOption.siteCheckVal.length
            "
          >
            <a-checkbox
              :indeterminate="storeIndeterminate"
              :checked="storeCheckAll"
              @change="storeCheckAllChange"
            >
              选择店铺
            </a-checkbox>
          </dt>
          <dd v-if="currentPlatformOption">
            <div
              v-for="item in currentSiteOption"
              :key="item.value"
              class="me-mb-3"
            >
              <span class="me-site-label">{{ item.value }}:</span>
              <div class="me-store-list">
                <a-checkbox
                  :indeterminate="item.siteSubIndeterminate"
                  :checked="item.siteSubCheckAll"
                  @change="(e) => siteSubCheckAllChange(e, item)"
                >
                  全选
                </a-checkbox>
                <a-checkbox
                  :checked="store.storeSubCheck"
                  @change="(e) => storeCheckChange(e, store, item)"
                  v-for="store in item.children"
                  :key="store.storeId"
                >
                  <a-tooltip placement="topLeft">
                    <template slot="title">
                      {{ store.storeAlias || store.storeName }}
                    </template>
                    <span class="me-em1">{{
                      store.storeAlias || store.storeName
                    }}</span>
                  </a-tooltip>
                </a-checkbox>
              </div>
            </div>
          </dd>
        </dl>

        <!-- 已选中的店铺 -->
        <dl class="me-store-selected">
          <dt class="me-mb-3">已选择{{ storeSelectedNum }}个店铺</dt>
          <dd v-for="(item, index) in platformOption" :key="item.name">
            <span
              v-show="storeSelected[index].option.length"
              class="me-site-label"
              >{{ item.name }}</span
            >
            <div class="me-store-list">
              <span v-for="site in item.option" :key="site.value">
                <span v-for="store in site.children" :key="store.storeId">
                  <a-tag
                    v-if="store.storeSubCheck"
                    closable
                    @close="(e) => storeCheckChange(false, store, site)"
                    >{{ store.storeAlias || store.storeName }}</a-tag
                  >
                </span>
              </span>
            </div>
          </dd>
        </dl>
      </div>
    </div>
    <template slot="footer">
      <a-checkbox
        :checked="autoCategory"
        class="me-auto-category"
        @change="autoCategoryChange"
      >
        自动类目匹配
      </a-checkbox>
      <a-button key="back" @click="cancel">
        取消
      </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="ok">
        保存
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import Cnsc from '@/api/cnsc'
import { mapState } from 'vuex'
import { cloneDeep } from 'lodash'
export default {
  props: {
    claimVisible: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: 'claimVisible',
    event: 'input'
  },
  data() {
    return {
      loading: false,
      autoCategory: true, //是否自动匹配类目
      siteCheckAll: false, //站点全选
      siteIndeterminate: false, //站点半选
      storeCheckAll: false, //店铺全选
      storeIndeterminate: false, //店铺半选
      currentPlatform: 'Shopee', //选中平台
      currentPlatformOption: '', //选中平台的数据
      siteInfoAll: '',
      platformOption: [
        {
          name: 'Shopee',
          value: '',
          icon: 'iconshopee-logo',
          option: [],
          siteCheckVal: [], //选中的站点
          storeCheckVal: [] //选中的店铺
        },
        {
          name: 'Lazada',
          value: 'Lazada',
          icon: 'iconLAZADA',
          option: [],
          siteCheckVal: [], //选中的站点
          storeCheckVal: [] //选中的店铺
        }
      ],
      allSiteInfo: []
    }
  },
  computed: {
    ...mapState({
      storeListAll: (state) => state.auth.storeListAll,
      storeListSize: (state) => state.auth.basicStoreListSize,
      lazadaStoreListSize: (state) => state.auth.lazadaStoreListSize
    }),
    //选中的站点
    currentSiteOption() {
      if (this.currentPlatformOption.option) {
        return this.currentPlatformOption.option.filter((item) =>
          this.currentPlatformOption.siteCheckVal.includes(item.value)
        )
      } else {
        return []
      }
    },
    //选中的平台下-所有站点值
    plainSiteOptions() {
      return this.$data.currentPlatformOption.option.map((item) => item.value)
    },
    //选中的站点下-所有店铺值
    plainStoreOptions() {
      let plainOptions = []
      this.currentSiteOption.forEach((item) => {
        plainOptions.push(...item.children.map((ele) => ele.storeId))
      })
      return plainOptions
    },
    //处理选中的店铺
    storeSelected() {
      let storeList = []
      this.$data.platformOption.forEach((item, index) => {
        storeList.push({ label: item.name, option: [] })
        if (item.option) {
          item.option.forEach((item2) => {
            storeList[index].option.push(
              ...item2.children.filter((ele) => ele.storeSubCheck)
            )
          })
        }
      })
      return storeList
    },
    //选中店铺数量
    storeSelectedNum() {
      let sum = 0
      this.storeSelected.forEach((item) => {
        sum += item.option.length
      })
      return sum
    }
  },
  async created() {
    this.allSiteInfo = [
      cloneDeep(this.storeListSize),
      cloneDeep(this.lazadaStoreListSize)
    ]
    let { data } = await Cnsc.getMerchantPublishable()
    data = data.filter((item) => {
      return this.storeListAll.filter(
        (store) => store.merchantId == item.merchant_id
      ).length
    })

    if (data.length) this.handleCNSC(data)
    this.allSiteInfo.forEach((ele) => {
      if (ele) {
        ele.forEach((item) => {
          this.$set(item, 'siteSubCheckVal', [])
          this.$set(item, 'siteSubIndeterminate', false)
          this.$set(item, 'siteSubCheckAll', false)
          item.children.forEach((item2) => {
            this.$set(item2, 'storeSubCheck', false)
          })
        })
      }
    })
    this.$data.platformOption.forEach((item, index) => {
      item.option = this.allSiteInfo[index]
    })
    this.$data.currentPlatformOption = this.$data.platformOption.filter(
      (item) => item.name == this.currentPlatform
    )[0]
  },
  methods: {
    //处理cnsc商户
    handleCNSC(data) {
      let cnscChild = []
      data.forEach((item) => {
        let expire = item.expire ? '(已过期请重新授权)' : ''
        cnscChild.push({
          storeAlias: item.merchant_name + expire,
          storeId: item.merchant_id,
          isCnsc: true
        })
      })
      let cnsc = {
        label: '全球商品',
        value: 'CNSC',
        children: cnscChild
      }
      this.allSiteInfo[0].push(cnsc)
    },
    //切换平台
    changePlatform(item) {
      this.$data.currentPlatform = item.name
      this.$data.currentPlatformOption = this.$data.platformOption.find(
        (ele) => ele.name == item.name
      )
      this.updateStoreCheck()
      this.updateSiteCheck(this.currentSiteOption)
    },
    //全选站点
    siteCheckAllChange(e) {
      if (!e.target.checked) this.storeCheckAllChange(e)
      this.updateStoreCheck()
      this.$data.siteCheckAll = e.target.checked
      this.$data.siteIndeterminate = false
      this.$data.currentPlatformOption.siteCheckVal = e.target.checked
        ? this.plainSiteOptions
        : []
    },
    //选择单个站点
    siteCheckChange(checkedList) {
      this.currentPlatformOption.option.forEach((item) => {
        if (!checkedList.includes(item.value)) {
          this.siteSubCheckAllChange({ target: { checked: false } }, item)
        }
      })
      this.updateSiteCheck(checkedList)
    },
    //更新选择站点-全选状态
    updateSiteCheck(checkedList) {
      this.$data.siteIndeterminate =
        !!checkedList.length &&
        checkedList.length < this.plainSiteOptions.length
      this.$data.siteCheckAll =
        checkedList.length === this.plainSiteOptions.length
    },
    //全选店铺
    storeCheckAllChange(e) {
      this.$data.storeCheckAll = e.target.checked
      this.$data.storeIndeterminate = false
      this.currentSiteOption.forEach((item) => {
        this.siteSubCheckAllChange(e, item)
      })
    },
    //全选站点下的店铺
    siteSubCheckAllChange(e, item) {
      console.log(e, item)
      let plainOptions = item.children.map((ele) => ele.storeId)
      Object.assign(item, {
        siteSubIndeterminate: false,
        siteSubCheckAll: e.target.checked,
        siteSubCheckVal: e.target.checked ? plainOptions : []
      })
      item.children.forEach((ele) => (ele.storeSubCheck = e.target.checked))

      this.updateStoreCheck()
    },
    //选择单个店铺
    storeCheckChange(e, store, item) {
      let plainOptions = item.children.map((ele) => ele.storeId)
      store.storeSubCheck = e ? e.target.checked : false
      if (e ? e.target.checked : false) {
        item.siteSubCheckVal.push(store.storeId)
      } else {
        item.siteSubCheckVal = item.siteSubCheckVal.filter(
          (ele) => ele != store.storeId
        )
      }
      item.siteSubCheckAll = item.siteSubCheckVal.length === plainOptions.length
      item.siteSubIndeterminate =
        !!item.siteSubCheckVal.length &&
        item.siteSubCheckVal.length < plainOptions.length
      this.updateStoreCheck()
    },
    //更新选择店铺-全选状态
    updateStoreCheck() {
      let storeSelLen = this.storeSelected.filter(
        (ele) => ele.label == this.$data.currentPlatform
      )[0].option.length
      if (storeSelLen && storeSelLen == this.plainStoreOptions.length) {
        this.$data.storeCheckAll = true
      } else {
        this.$data.storeCheckAll = false
      }
    },
    //是否自动匹配类目
    autoCategoryChange(e) {
      this.$data.autoCategory = e.target.checked
    },
    ok() {
      console.log(this.storeSelected)
      let storeIds = []
      let cnscIds = []
      this.storeSelected.forEach((item) => {
        item.option.forEach((item2) => {
          if (item2.isCnsc) {
            cnscIds.push(item2.storeId)
          } else {
            storeIds.push(item2.storeId)
          }
        })
      })
      if (storeIds.length || cnscIds.length) {
        this.$emit('submit', {
          storeIds,
          cnscIds,
          isAutoMatch: this.autoCategory
        })
        this.$data.loading = true
      } else {
        this.$message.warning('请选择店铺！')
      }
    },
    cancel() {
      this.$emit('input', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.me-w100b {
  width: 100%;
}
.band {
  width: 130px;
  height: 44px;
  background: #ffffff;
  border-radius: 2px;
  border: 1px solid #fff;
  text-align: center;
  cursor: pointer;
  color: #9c9ca0;
  line-height: 44px;
  position: relative;
  margin-bottom: 10px;
}
.me-platform-icon {
  font-size: 28px;
}
.iconLAZADA {
  vertical-align: middle;
}
.active {
  border: 1px solid #fd6b36;
  position: relative;
  color: #fd6b36;
  .iconLAZADA {
    display: inline-block;
    width: 27px;
    height: 27px;
    background: url('../../../../assets/images/laz.png');
    background-size: cover;
    position: relative;
    top: -1px;
    left: -1px;
    &:before {
      opacity: 0;
    }
  }
  span {
    width: 16px;
    height: 16px;
    background: url('../../../../assets/images/shopeeactive.png');
    bottom: 0px;
    right: 0px;
    position: absolute;
  }
}
.me-em1 {
  width: 100px;
  display: inline-block;
  overflow: hidden;
  vertical-align: top;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.me-claim-wrap {
  display: flex;
}
.me-selecte-platform {
  dt {
    font-weight: bold;
    margin-bottom: 17px;
  }
  padding: 17px;
  border-right: 1px solid #e8e8e8;
}
.me-selecte-site {
  height: 320px;
  overflow-y: auto;
  border-right: 1px solid #e8e8e8;
  float: left;
  padding: 15px 15px 0;
  width: 200px;
  dt {
    font-weight: bold;
    margin-bottom: 25px;
  }
  ::v-deep .ant-checkbox-wrapper {
    display: block;
    margin-left: 0;
    margin-bottom: 12px;
  }
}
.me-selecte-store {
  height: 320px;
  overflow-y: auto;
  padding: 15px 15px 0;
  margin-left: 200px;
  dt {
    font-weight: bold;
    margin-bottom: 25px;
  }
}

.me-site-label {
  float: left;
  min-width: 50px;
}
.me-store-list {
  overflow: hidden;
  ::v-deep .ant-checkbox-wrapper {
    min-width: 135px;
    margin: 0 8px 5px 0;
  }
}
.me-store-selected {
  border-top: 1px solid #e8e8e8;
  padding: 23px 14px 0;
  height: 200px;
  overflow-y: auto;
  .me-site-label {
    min-width: 60px;
  }
  .me-store-list {
    margin-right: 10px;
    margin-bottom: 15px;
  }
  .ant-tag {
    margin-bottom: 8px;
    height: 28px;
    line-height: 28px;
    border: none;
    background: #f5f5f5;
    border-radius: 0;
  }
  .ant-tag:hover {
    ::v-deep .anticon-close {
      color: #ff6b38;
    }
  }
}
.me-auto-category {
  float: left;
  margin: 8px 0 0 0;
}
</style>
<style lang="scss">
.me-claim-dialog {
  .ant-modal-body {
    padding: 0;
  }
}
</style>
