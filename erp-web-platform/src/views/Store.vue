<template>
  <div class="me-pa-2">
    <Carouse adKey="authorization_banner" />
    <div class="me-bgfff">
      <a-page-header
        class="me-page-header"
        :title="$t('store.authStore')"
        v-show="$route.path.indexOf('/oms/') !== 0"
      >
        <a @click="openPage(config[currentPlatform].guideUrl)" slot="extra">
          <small
            style="
              float: right;
              font-size: 14px;
              color: #4c86ff;
              cursor: pointer;
            "
            ><a-icon type="question-circle" />授权指南</small
          >
        </a>
      </a-page-header>
      <div class="auth-form">
        <span class="tit">{{ $t('store.authPlatform') }} </span>
        <span
          class="band"
          v-for="item in stroeAuth"
          :key="item.name"
          :class="{ active: item.name == currentPlatform }"
          @click="changePlatform(item)"
        >
          <i class="iconfont me-platform-icon" :class="[item.icon]"></i
          >{{ item.value }}
          <span></span>
        </span>
      </div>

      <div class="me-card">
        <a-space>
          <template v-if="currentPlatform == 'Shopee'">
            <!-- <a-button
            type="primary"
            class="mr-2 authbtn"
            @click="getAuthUrl('v1')"
            >{{ $t('store.authLocalStore') }}</a-button
          >
          <a-button
            type="primary"
            class="mr-2 authbtn"
            @click="getAuthUrl('v2')"
            >{{ $t('store.authV2Store') }}</a-button
          > -->
            <a-button type="primary" @click="storeTypePop">
              普通店铺授权
            </a-button>
            <a-button type="primary" @click="getAuthUrl('v2')">{{
              $t('store.authGlobalStore')
            }}</a-button>
          </template>
          <a-button
            v-else
            type="primary"
            class="mr-2 authbtn"
            @click="getAuthUrl('v1')"
            >店铺授权</a-button
          >
          <a-button @click="handleDeleteConfirm()" class="delbtn newbtn">
            {{ $t('store.batchDetele') }}
          </a-button>
        </a-space>
        <a-space class="me-fr">
          <a-input
            allow-clear
            v-model="storeAlias"
            :placeholder="
              storeTypeTab == 2 ? '请输入商户名称' : $t('store.searchLabel')
            "
            style="width: 210px"
          />
          <a-button class="mr-2 authbtn" @click="reLoadData">{{
            $t('store.searchIt')
          }}</a-button>
        </a-space>
      </div>
      <a-tabs
        v-if="currentPlatform == 'Shopee'"
        v-model="storeTypeTab"
        type="card"
        @change="changeStoreType"
        class="me-ml-2 me-mr-2"
      >
        <a-tab-pane :key="1">
          <template slot="tab">
            普通店铺<span v-if="ordinaryShop">({{ ordinaryShop }})</span>
          </template>
        </a-tab-pane>
        <a-tab-pane :key="2">
          <template slot="tab">
            全球店铺<span v-if="globalStore">({{ globalStore }})</span>
          </template>
        </a-tab-pane>
      </a-tabs>
      <div class="me-card table-wrap">
        <a-table
          :columns="columnss"
          :pagination="getPagination"
          :data-source="dataSource"
          :loading="tableLoading"
          :row-selection="rowSelection"
          rowKey="storeId"
          @change="changePage"
          :class="{ 'me-store-infolist': storeTypeTab == 2 }"
        >
          <template slot="merchantName" slot-scope="text, record">
            {{ record.merchantName || '--' }}
          </template>
          <template slot="storeName" slot-scope="text, record">
            <ul class="me-merchant-store me-bl" v-if="record.merchantId">
              <li v-for="item in record.storeInfoDTOList" :key="item.storeId">
                <div>
                  {{ item.storeName }}
                  <p>ID：{{ item.platformId }}</p>
                </div>
              </li>
            </ul>
            <div v-else>
              {{ record.storeName }}
              <p>ID：{{ record.platformId }}</p>
            </div>
          </template>
          <template slot="storeAlias" slot-scope="text, record">
            <ul class="me-merchant-store" v-if="record.merchantId">
              <li v-for="item in record.storeInfoDTOList" :key="item.storeId">
                <editable-cell
                  :text="item.storeAlias"
                  @change="onCellChange(item.storeId, $event)"
                  :placeholder="$t('store.aliasPlaceholder')"
                />
              </li>
            </ul>
            <div v-else>
              <editable-cell
                :text="text"
                @change="onCellChange(record.storeId, $event)"
                :placeholder="$t('store.aliasPlaceholder')"
              />
            </div>
          </template>
          <template slot="countryCode" slot-scope="text, record">
            <ul class="me-merchant-store" v-if="record.merchantId">
              <li v-for="item in record.storeInfoDTOList" :key="item.storeId">
                {{ item.countryCode }}
              </li>
            </ul>
            <div v-else>{{ record.countryCode }}</div>
          </template>

          <template slot="storeType" slot-scope="text, record">
            <ul class="me-merchant-store" v-if="record.merchantId">
              <li v-for="item in record.storeInfoDTOList" :key="item.storeId">
                {{
                  item.storeType == 1
                    ? $t('store.localStore')
                    : $t('store.crossStore')
                }}
              </li>
            </ul>
            <div v-else>
              {{
                record.storeType == 1
                  ? $t('store.localStore')
                  : $t('store.crossStore')
              }}
            </div>
          </template>
          <template slot="authorizedStatus" slot-scope="text, record">
            <ul class="me-merchant-store" v-if="record.merchantId">
              <li v-for="item in record.storeInfoDTOList" :key="item.storeId">
                <p v-if="item.authorizedStatus == 1">
                  {{ $t('store.authed') }}
                  <a-tooltip
                    title="需要您重新授权,若没有授权将会影响您后续使用商品的发布以及在线商品的管理。"
                    v-if="item.authType === 1"
                  >
                    <span class="me-handler-red"
                      >(即将过期<a-icon type="question-circle" />)</span
                    >
                  </a-tooltip>
                </p>
                <p v-else>
                  {{ $t('store.noAuth') }}
                </p>
              </li>
            </ul>
            <div v-else>
              <p v-if="record.authorizedStatus == 1">
                {{ $t('store.authed') }}
                <a-tooltip
                  title="需要您重新授权,若没有授权将会影响您后续使用商品的发布以及在线商品的管理。"
                  v-if="record.authType === 1"
                >
                  <span class="me-handler-red"
                    >(即将过期<a-icon type="question-circle" />)</span
                  >
                </a-tooltip>
              </p>
              <p v-else>
                {{ $t('store.noAuth') }}
              </p>
            </div>
          </template>
          <template slot="authorizedTime" slot-scope="text, record">
            <ul class="me-merchant-store" v-if="record.merchantId">
              <li v-for="item in record.storeInfoDTOList" :key="item.storeId">
                {{ item.authorizedTime }}
              </li>
            </ul>
            <div v-else>{{ record.authorizedTime }}</div>
          </template>
          <template slot="lastSyncTime" slot-scope="text, record">
            <ul class="me-merchant-store me-br" v-if="record.merchantId">
              <li v-for="item in record.storeInfoDTOList" :key="item.storeId">
                {{ item.lastSyncTime }}
              </li>
            </ul>
            <div v-else>{{ record.lastSyncTime }}</div>
          </template>
          <template slot="operation" slot-scope="text, record">
            <a-button
              type="link"
              class="me-pa-1 me-ml-1"
              @click="handleAuth(record)"
            >
              {{ $t('store.reAuth') }}
            </a-button>
            <a-divider type="vertical" />
            <a-button type="link" class="me-pa-1" @click="handleSync(record)">
              {{ $t('store.synStoreInfo') }}
            </a-button>
            <a-divider type="vertical" />
            <a-button
              type="link"
              class="me-error"
              @click="handleDeleteConfirm(record)"
            >
              {{ $t('common.delete') }}
            </a-button>
          </template>
        </a-table>
      </div>
      <!-- 选择店铺授权类型 -->
      <a-modal
        title="选择店铺授权类型"
        :visible="storeTypeVisible"
        @cancel="storeTypeVisible = false"
        @ok="storeTypeOk"
        width="500px"
        :maskClosable="false"
        :destroyOnClose="true"
        :confirm-loading="confirmLoading"
      >
        <a-radio-group v-model="storeType">
          <a-radio :value="2"> 跨境店铺 </a-radio>
          <a-radio :value="1"> 本土店铺 </a-radio>
        </a-radio-group>
      </a-modal>
      <!-- 温馨提示 -->
      <!-- <a-modal
      :visible="authV1ModalVisible"
      title="重大更新提示"
      @cancel="authV1ModalVisible = false"
    >
      <div style="line-height: 28px">
        <p>
          shopee官方进行了开放平台接口的更新升级，将从1.0接口升级到2.0，更新范围涉及到整个ERP系统，更新接口后将对产品体验、系统性能、安全性有大幅度提升，请各位卖家务必在2021-08-01前完成所有店铺在2.0接口重新授权。
        </p>

        <div style="width:220px;height:220px;margin:0 auto">
          <img src="@/assets/images/wechat-code-4.jpg" style="width:220px" />
        </div>
      </div>
      <template slot="footer">
        <a-button type="primary" @click="authV1ModalVisible = false">
          朕知道了
        </a-button>
      </template>
    </a-modal> -->
    </div>
  </div>
</template>
<script>
import tableMixins from '@/mixins/tableMixins'
import storeMixins from '@/mixins/storeMixins'
import Store from '@/api/store'
import { isDev } from '@/util'
import EditableCell from '@/packages/edit-table-cell'
import { mapState } from 'vuex'
import Carouse from '@/components/Carouse'
export default {
  mixins: [tableMixins, storeMixins],
  components: {
    EditableCell,
    Carouse
  },
  computed: {
    ...mapState({
      storeSumV1: (state) => state.auth.storeSumV1
    }),
    columnss() {
      let tableHead = [...this.columnsPublic]
      if (this.currentPlatform == 'Shopee') {
        tableHead = [...this.columusShopee, ...this.columnsPublic]
      }
      return tableHead
    }
  },
  data() {
    return {
      config: {
        Shopee: {
          //获取授权地址
          getAuthApi: {
            v1: '/store/store/shopee/auth/local/url',
            v2: '/store/store/shopee/auth/v2/url'
          },
          //授权指南
          guideUrl: '/information/info?type=1&listId=3&newsId=2',
          //获取店铺列表/store/info/page
          getStoreListApi: '/store/store/info/page',
          //同步店铺列表
          syncApi: '/store/store/info/syncStore',
          //删除店铺
          delStoreApi: '/store/store/info/delete',
          //修改店铺名称
          editStoreApi: '/store/store/info/edit'
        },
        Lazada: {
          getAuthApi: {
            v1: '/store/lazada/auth/url',
            v2: '/store/lazada/auth/url'
          },
          guideUrl: '/information/info?type=1&listId=3&newsId=31',
          getStoreListApi: '/store/lazada/info/page',
          syncApi: '/store/lazada/info/syncStore',
          delStoreApi: '/store/lazada/info/delete',
          editStoreApi: '/store/lazada/info/edit'
        }
      },
      autoLoad: false,
      columusShopee: [
        {
          title: '商户',
          dataIndex: this.$t('store.merchantName'),
          scopedSlots: { customRender: 'merchantName' },
          width: 120
        }
      ],
      columnsPublic: [
        {
          title: this.$t('store.storeName'),
          dataIndex: 'storeName',
          scopedSlots: { customRender: 'storeName' },
          width: 300
        },
        {
          title: this.$t('store.storeAlias'),
          dataIndex: 'storeAlias',
          width: 300,
          scopedSlots: { customRender: 'storeAlias' }
        },
        {
          title: '站点',
          dataIndex: 'countryCode',
          width: 80,
          scopedSlots: { customRender: 'countryCode' }
        },
        {
          title: this.$t('store.storeType'),
          dataIndex: 'storeType',
          width: 120,
          scopedSlots: { customRender: 'storeType' }
        },
        {
          title: this.$t('store.authStatus'),
          dataIndex: 'authorizedStatus',
          width: 150,
          scopedSlots: { customRender: 'authorizedStatus' }
        },
        {
          title: this.$t('store.authTime'),
          dataIndex: 'authorizedTime',
          width: 180,
          scopedSlots: { customRender: 'authorizedTime' }
        },
        {
          title: this.$t('store.lastSynTime'),
          dataIndex: 'lastSyncTime',
          width: 180,
          scopedSlots: { customRender: 'lastSyncTime' }
        },
        {
          title: this.$t('common.handler'),
          dataIndex: 'operation',
          key: 'operation',
          fixed: 'right',
          width: 270,
          scopedSlots: { customRender: 'operation' }
        }
      ],
      storeAlias: null, //店铺别名
      storeList: [], //店铺列表
      stroeAuth: [
        {
          name: 'Shopee',
          value: '',
          icon: 'iconshopee-logo'
        },
        {
          name: 'Lazada',
          value: 'Lazada',
          icon: 'iconLAZADA'
        }
        // { name: 'wish', value: 'wish', active:false }
      ],
      cleartime: '',
      interval: null,
      authV1ModalVisible: false,
      currentPlatform: 'Shopee', //选中平台
      storeType: 2,
      storeTypeVisible: false,
      confirmLoading: false,
      storeTypeTab: 1,
      ordinaryShop: 0,
      globalStore: 0,
      clearSelectedRows: false //重新加载不清空选中
    }
  },
  beforeDestroy() {
    clearInterval(this.$data.interval)
  },
  async mounted() {
    this.$data.tableLoading = true
    this.infoAuthV1()
    if (!isDev) {
      this.$data.interval = setInterval(async () => {
        await this.loadData()
      }, 3000)
    }
    await this.loadData()
    let { data } = await Store.getStoreListM('/store/store/info/cnsc/page', {
      platform: 1
    })
    this.$data.globalStore = data.total
  },
  methods: {
    storeTypeOk() {
      if (this.$data.storeType == 1) {
        this.getAuthUrl('v1')
      } else {
        this.getAuthUrl('v2')
      }
      this.$data.storeTypeVisible = false
    },
    //选择店铺类型弹窗
    storeTypePop() {
      this.$data.storeTypeVisible = true
    },
    //切换店铺类型
    changeStoreType(item) {
      this.$data.storeAlias = ''
      this.reLoadData()
    },
    //切换平台
    changePlatform(item) {
      this.$data.currentPlatform = item.name
      this.$data.storeTypeTab = 1
      this.reLoadData()
    },
    //获取店铺列表
    getTableData() {
      let { config, currentPlatform, storeTypeTab } = this.$data
      let params = Object.assign(this.paginationData, {
        storeAlias: this.storeAlias,
        platform: currentPlatform == 'Shopee' ? 1 : 2,
        cnsc: 0
      })
      if (currentPlatform == 'Shopee' && storeTypeTab == 2) {
        return Store.getStoreListM(
          config[currentPlatform].getStoreListApiCnsc,
          params
        )
      } else {
        return Store.getStoreListM(
          config[currentPlatform].getStoreListApi,
          params
        )
      }
    },

    getTableDataAfter() {
      // 更新店铺列表vuex
      // let oldStoreLength = this.$store.getters.getStoreListAll.length
      // // 如果添加了店铺的话
      // if (oldStoreLength !== this.paginationData.total) {
      //   this.$store.commit('GET_STORE_LIST')
      // }
      this.dataSource.forEach((item) => {
        if (item.merchantId) {
          this.$set(item, 'storeId', item.merchantId)
        }
      })
      if (this.$data.storeTypeTab == 1) {
        this.$data.ordinaryShop = this.$data.paginationData.total
      } else {
        this.$data.globalStore = this.$data.paginationData.total
      }
      console.log(this.$data.ordinaryShop, this.$data.globalStore)
      // // 如果更新了店铺，比如重新授权，从v1到v2，需要更新
      // if (this.paginationData.current == 1) {
      this.$store.commit('GET_STORE_LIST')
      // }
    },

    //更新店铺信息
    updateStoreInfo(params) {
      let { config, currentPlatform } = this.$data
      Store.updateStoreInfo(config[currentPlatform].editStoreApi, params).then(
        (res) => {
          if (res.code == 0) {
            this.loadData()
            // 更新缓存中店铺的信息
            // this.$store.commit('UPDATED_STORE_ALIAS', params)
            this.successAlert(this.$t('common.updateSuccess'))
          }
        }
      )
    },

    onCellChange(key, value) {
      // const dataSource = [...this.dataSource]
      // const target = dataSource.find((item) => item.storeId === key)
      let params = {
        storeId: key,
        storeAlias: value.replace(/\s*/g, '')
      }
      this.updateStoreInfo(params)
    },

    //确认删除操作
    handleDeleteConfirm(item) {
      let checkedIds =
        this.rowSelection.selectedRowKeys.length > 0
          ? this.rowSelection.selectedRowKeys.map((el) => el.storeId)
          : null
      if (!item && checkedIds == null) {
        this.errorAlert(this.$t('store.choseStore'))
        return false
      }

      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('store.sureDeleteStore'),
        onOk: async () => {
          this.deleteStore(item)
        }
      })
    },
    //获取操作店铺id
    getStoreId(item, type) {
      let params = { storeId: [], merchantId: [] }
      if (item) {
        if (item.merchantId) {
          let ids = []
          item.storeInfoDTOList.forEach((ele) => {
            ids.push(ele.storeId)
          })
          params.storeId = ids
          params.merchantId = [item.merchantId]
        } else {
          params.storeId = [item.storeId]
        }
      } else {
        if (this.selectedRows[0].merchantId) {
          let ids = []
          let mids = []
          this.selectedRows.forEach((item) => {
            item.storeInfoDTOList.forEach((ele) => {
              ids.push(ele.storeId)
            })
            mids.push(item.merchantId)
          })
          params.storeId = ids
          params.merchantId = mids
        } else {
          params.storeId = this.rowSelection.selectedRowKeys
        }
      }
      if (type == 'sync') {
        return params.storeId
      } else {
        return params
      }
    },
    //删除店铺
    deleteStore(item) {
      let ids = this.getStoreId(item)
      let params = { storeId: ids.storeId }
      let { config, currentPlatform } = this.$data
      if (currentPlatform == 'Shopee') {
        params.merchantId = ids.merchantId
      }
      Store.handleBatchDelete(config[currentPlatform].delStoreApi, params).then(
        (res) => {
          if (res.code == 0) {
            this.loadData('delete')
            this.successAlert(this.$t('common.deleteSuccess'))
          }
        }
      )
    },

    //授权
    handleAuth(item) {
      const version = item.storeType === 1 ? 'v1' : 'v2'
      this.getAuthUrl(version)
    },

    //同步
    handleSync(item) {
      this.$data.tableLoading = true
      let params = {
        storeIds: this.getStoreId(item, 'sync')
      }
      let { config, currentPlatform } = this.$data

      Store.handleSync(config[currentPlatform].syncApi, params).then((res) => {
        if (res.code == 0) {
          this.successAlert(this.$t('store.synSuccess'))
          this.getTableData()
          this.$data.tableLoading = false
        }
      })
    },

    //授权操作
    async getAuthUrl(version) {
      let { config, currentPlatform } = this.$data
      let { data } = await Store.getAuthUrl(
        config[currentPlatform].getAuthApi[version]
      )
      if (data) {
        this.openPage(data, '_blank')
      }
    },
    // 提示重新授权
    infoAuthV1() {
      // 判断店铺列表里是否有1.0授权的店铺,只给非邀请用户显示
      // authType 1, "shopee 1.0 授权"; 2, "shopee 2.0 授权"; 3, "shopee 2.0 本土店铺授权"
      this.authV1ModalVisible = this.storeSumV1 > 0
    }
  }
}
</script>
<style lang="scss" scoped>
.me-pa-2 {
  h2.tit {
    height: 68px;
    font-size: 20px;
    font-weight: bold;
    color: #1a1a1a;
    line-height: 68px;
    background: #ffffff;
    padding-left: 16px;
  }

  .auth-form {
    height: 68px;
    background: #fff;
    padding: 16px;
    display: flex;
    span.tit {
      height: 35px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: bold;
      color: #1a1a1a;
      line-height: 35px;
    }
    .band {
      width: 96px;
      height: 36px;
      background: #ffffff;
      border-radius: 2px;
      border: 1px solid #d6d6d6;
      text-align: center;
      cursor: pointer;
      margin-right: 12px;
      color: #9c9ca0;
      line-height: 36px;
      position: relative;
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
        background: url('../assets/images/laz.png');
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
        background: url('../assets/images/shopeeactive.png');
        bottom: 0px;
        right: 0px;
        position: absolute;
      }
    }
  }

  .table-wrap {
    min-height: calc(100vh - 280px);
    position: relative;
  }
  .auth-button-center {
    position: absolute;
    width: 200px;
    left: 50%;
    top: 250px;
    z-index: 10;
    bottom: 210px;
    margin-left: -100px;
    text-align: center;
  }
  .newbtn {
    height: 33px;
  }
  .authbtn {
    height: 32px;
  }
  .span {
    transform: scale(0.9, 0.9);
    margin-right: -8px !important;
    width: 225px;
    margin-left: auto;
  }
  .searchint {
    height: 33px;
    width: 250px;
    // margin-right: auto;
  }
  .searchbtn {
    margin-left: 0px;
  }
}
.me-merchant-store {
  li {
    min-height: 58px;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    align-items: center;
    padding: 0 8px;
    margin-bottom: -1px;
  }
}
.me-store-infolist {
  ::v-deep .ant-table-tbody > tr > td {
    padding: 0;
  }
}
.me-bl {
  border-left: 1px solid #e8e8e8;
}
.me-br {
  border-right: 1px solid #e8e8e8;
}
.me-bgfff {
  background: #fff;
}
.me-ml-2.me-mr-2 {
  ::v-deep .ant-tabs-bar {
    margin-bottom: 0;
  }
}
</style>
