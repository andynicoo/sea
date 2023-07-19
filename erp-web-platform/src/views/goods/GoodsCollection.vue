<template>
  <div class="me-pa-2" style="height: 100%">
    <Carouse adKey="product_banner" v-if="!queryPlatform" />
    <a-page-header class="me-page-header" v-if="queryPlatform">
      <template slot="title"> 选品工具/找货源结果 </template>
    </a-page-header>
    <a-page-header
      v-else
      class="me-page-header"
      :title="$t('goodsCollection.goodsCollection')"
    >
      <template slot="tags">
        <div class="count-crawl-user">
          <span>今日采集情况：</span>
          剩余采集数：<span class="me-status-error">
            {{ userCountCrawlData.surplusNum }}
          </span>
          , 采集成功数：
          <span class="me-status-success">
            {{ userCountCrawlData.successNum }}
          </span>
          , 授权店铺数：
          <span class="me-status-primary">
            {{ storeListAll.length }}
          </span>
        </div>
      </template>
      <small class="link-text-color" slot="extra" @click="setGuide()">
        <a-icon type="question-circle" />
        使用指南
      </small>
    </a-page-header>
    <div
      class="me-card me-goods-collection"
      :class="{ 'me-st': queryPlatform }"
    >
      <a-tabs
        type="card"
        :tabBarGutter="5"
        :tabBarStyle="{ margin: '0 10px', paddingTop: '10px' }"
        size="large"
        :animated="false"
        v-model="currentTab"
        @change="onTabChange"
        style="margin-left: 8px"
        :class="{ 'query-platform': queryPlatform }"
      >
        <a-tab-pane key="1" :tab="$t('goodsCollection.linkCollection')">
          <LinkCollection
            ref="LinkCollect"
            v-model="disableCollectButton"
            :platformSite="platformSite"
          />
        </a-tab-pane>
        <a-tab-pane key="2" :tab="$t('goodsCollection.storeCollection')">
          <StoreCollection
            ref="StoreCollect"
            v-model="disableCollectButton"
            :collectionPlatformConfig="collectionPlatformConfig"
            :platformSite="platformSite"
          />
        </a-tab-pane>
        <a-tab-pane key="3" :tab="$t('goodsCollection.platformCollection')">
          <PlatformCollection
            ref="PlatCollect"
            v-model="disableCollectButton"
            :collectionPlatformConfig="collectionPlatformConfig"
            :platformSite="platformSiteName"
          />
        </a-tab-pane>
        <a-tab-pane
          key="4"
          :tab="$t('goodsCollection.pluginCollection')"
          class="plugin-panel-wrap"
        >
          <PluginCollection />
        </a-tab-pane>
        <a-button
          @click="settingVisible = true"
          slot="tabBarExtraContent"
          class="me-fr"
        >
          <a-icon type="setting" />
          {{ $t('goodsCollection.acquisitionSettings') }}
        </a-button>
      </a-tabs>
      <div class="collect-button-wrap" v-if="queryPlatform">
        <a-button type="primary" @click="$router.go(-1)"> 返回 </a-button>
      </div>
      <div
        v-if="currentTab !== '4' && !queryPlatform"
        class="collect-button-wrap"
      >
        <div class="button-content" style="width: auto" id="step_2">
          <a-button
            :loading="loading"
            size="large"
            type="primary"
            @click="handleCollect()"
            style="margin-right: 20px; line-height: 1"
            :disabled="disableCollectButton"
          >
            {{ $t('goodsCollection.collect') }}
          </a-button>
          <a-button-group size="large">
            <a-button
              :loading="loading"
              type="primary"
              @click="handleCollect(1)"
              :disabled="disableCollectButton"
            >
              {{ $t('goodsCollection.collectAndPublish') }}
            </a-button>
            <a-tooltip :title="$t('goodsCollection.autoPublishSet1')">
              <a-button
                icon="setting"
                style="width: 46px"
                type="default"
                @click="publishVisible = true"
              />
            </a-tooltip>
          </a-button-group>
        </div>
      </div>
    </div>

    <!-- 采集设置 -->
    <a-modal
      :visible="settingVisible"
      :maskClosable="false"
      destroyOnClose
      :bodyStyle="{ padding: 0 }"
      @cancel="settingCancel"
      width="90%"
      :footer="null"
    >
      <AcquisitionSettings @closeVisible="settingClose" />
    </a-modal>

    <!-- 自动发布 -->
    <a-modal
      :visible="publishVisible"
      :title="$t('goodsCollection.autoPublishSet1')"
      :confirm-loading="publishSetLoading"
      :maskClosable="false"
      :bodyStyle="{ padding: 0 }"
      @ok="publishSetOk"
      @cancel="publishVisible = false"
      destroyOnClose
      width="90%"
    >
      <AutoPublishSettings ref="autoPublishSet" />
    </a-modal>

    <!-- 采集提示弹窗 -->
    <a-modal
      :visible="colleTipsVisible"
      title="温馨提示"
      :maskClosable="false"
      @cancel="colleTipsVisible = false"
      destroyOnClose
      width="600px"
    >
      <template slot="footer">
        <a-button key="back" @click="$router.go(0)"> 刷新网页 </a-button>
        <a-button
          key="submit"
          type="primary"
          :loading="loading"
          @click="goGoodsDetails"
        >
          进入商品详情页
        </a-button>
      </template>
      <dl class="me-colleTips">
        <dt>
          <a-icon type="exclamation-circle" />
          由于
          {{ getPlatformName.join() }}
          采集接口不稳定，请使用马六甲采集插件进行采集
        </dt>
        <dd><span class="me-stp">1</span>下载安装马六甲插件</dd>
        <dd><span>2</span>进入商品详情页点击“采集该商品”</dd>
      </dl>
      <img src="../../assets/images/colleTipsImg.png" width="90%" />
    </a-modal>

    <!-- 安装插件提示 -->
    <PlugInstallTips
      :plugPopVisible="plugPopVisible"
      @closePlugPop="closePlugPop"
    />
  </div>
</template>

<script>
import PlugInstallTips from '@/components/PlugInstallTips'
import LinkCollection from './components/goodsCollection/LinkCollection'
import StoreCollection from './components/goodsCollection/StoreCollection'
import PlatformCollection from './components/goodsCollection/PlatformCollection'
import PluginCollection from './components/goodsCollection/PluginCollection'
import AcquisitionSettings from './components/goodsCollection/AcquisitionSettings'
import AutoPublishSettings from './components/goodsCollection/AutoPublishSettings'
import Carouse from '@/components/Carouse'

// import { URL } from '@/util/regex'
import CrawlApi from '@/api/crawl'

import bus from '@/bus'
import { mapState } from 'vuex'
export default {
  components: {
    LinkCollection,
    StoreCollection,
    PlatformCollection,
    PluginCollection,
    AcquisitionSettings,
    AutoPublishSettings,
    PlugInstallTips,
    Carouse
  },
  data() {
    return {
      currentTab: '1',
      settingVisible: false,
      publishVisible: false,
      publishSetLoading: false,
      loading: false,
      collectSitePageVisible: false,
      disableCollectButton: true,
      userCountCrawlData: {
        storeNum: 0,
        successNum: 0,
        surplusNum: 0
      },
      ruleColumns: [
        {
          title: '授权店铺数(不包括授权失效)',
          dataIndex: 'storeNum',
          key: 'storeNum',
          scopedSlots: { customRender: 'storeNum' }
        },
        {
          title: '限制采集数量(每个用户/每天)',
          dataIndex: 'crawlNum',
          key: 'crawlNum',
          scopedSlots: { customRender: 'crawlNum' }
        }
      ],
      ruleData: [],
      colleTipsVisible: false, //淘宝拼多多等平台提示
      plugPopVisible: false,
      urls: '',
      collectionPlatformConfig: {},
      platformSite: {
        SMT: 'aliexpress.com',
        LAZADA_ID: 'lazada.co.id',
        LAZADA_SG: 'lazada.sg',
        LAZADA_MY: 'lazada.com.my',
        LAZADA_VN: 'lazada.vn',
        LAZADA_TH: 'lazada.co.th',
        LAZADA_PH: 'lazada.com.ph',
        SHOPEE_TW: 'xiapi.xiapibuy.com',
        SHOPEE_SG: 'shopee.sg',
        SHOPEE_MY: 'shopee.com.my',
        SHOPEE_TH: 'shopee.co.th',
        SHOPEE_ID: 'shopee.co.id',
        SHOPEE_PH: 'shopee.ph',
        SHOPEE_VN: 'shopee.vn',
        SHOPEE_BR: 'shopee.com.br',
        DHGATE: 'dhgate.com',
        PDDPF: 'pifa.pinduoduo.com',
        TM: 'tmall.',
        TB: 'taobao.com',
        PDD: 'yangkeduo.com',
        ALBB: '1688.com',
        SOOXIE: 'sooxie.com',
        YWG: 'yiwugo.com',
        YQZWD: '17zwd.com',
        SJXZW: '571xz.com',
        MOGU: 'mogu.com'
      },
      platformSiteName: {
        SMT: '速卖通',
        LAZADA_ID: 'Lazada(印度尼西亚)',
        LAZADA_SG: 'Lazada(新加坡)',
        LAZADA_MY: 'Lazada(马来西亚)',
        LAZADA_VN: 'Lazada(越南)',
        LAZADA_TH: 'Lazada(泰国)',
        LAZADA_PH: 'Lazada(菲律宾)',
        SHOPEE_TW: 'Shopee(台湾)',
        SHOPEE_SG: 'Shopee(新加坡)',
        SHOPEE_MY: 'Shopee(马来西亚)',
        SHOPEE_TH: 'Shopee(泰国)',
        SHOPEE_ID: 'Shopee(印度尼西亚)',
        SHOPEE_PH: 'Shopee(菲律宾)',
        SHOPEE_VN: 'Shopee(越南)',
        SHOPEE_BR: 'Shopee(巴西)',
        DHGATE: '敦煌',
        PDDPF: '拼多多批发',
        TM: '天猫',
        TB: '淘宝',
        PDD: '拼多多',
        ALBB: '1688',
        SOOXIE: '爱搜鞋',
        YWG: '义乌购',
        YQZWD: '17网',
        SJXZW: '四季星座',
        MOGU: '蘑菇街'
      },
      getPlatformName: [],
      queryPlatform: ''
    }
  },
  computed: {
    calcIframeWidth() {
      return document.body.offsetWidth > 1400 ? '90%' : '96%'
    },
    ...mapState({
      storeListAll: (state) => state.auth.storeListAll
    })
  },
  async created() {
    this.queryPlatform = this.$route.query.platform
    if (this.queryPlatform) {
      this.$data.currentTab = '3'
    }
    let { data } = await CrawlApi.getPlugInCrawlUseConfig()
    this.collectionPlatformConfig = data
  },
  mounted() {
    // 拼多多友好提示
    // this.showPDDWarning()
    // 获取用户当天采集数量
    this.getCountCrawlToday()
  },
  methods: {
    //关闭插件下载提示弹窗
    closePlugPop() {
      this.$data.plugPopVisible = false
    },
    //跳转商品详情
    goGoodsDetails() {
      const PluginNode = document.querySelector(
        '#emalacca-chrome-extension-installed'
      )
      if (!PluginNode) {
        this.$data.colleTipsVisible = false
        this.$data.plugPopVisible = true
      } else {
        for (let i = 0; i < this.$data.urls.length && i < 3; i++) {
          window.open(this.$data.urls[i], '_blank')
        }
      }
    },
    // 拼多多友情提示
    showPDDWarning() {
      if (sessionStorage.getItem('first-show-pdd-collect-warning')) {
        return false
      }
      sessionStorage.setItem('first-show-pdd-collect-warning', true)
      this.$success({
        title: this.$t('goodsCollection.pluginMessage11'),
        content: this.$t('goodsCollection.pluginMessage12'),
        okText: this.$t('goodsCollection.pluginMessage13 ')
      })
    },
    // 提示步骤窗口
    setGuide() {
      let data = [
        {
          element: document.querySelector('#textareaCollection'),
          intro: this.$t('goodsCollection.tooltipTitle15'),
          position: 'bottom'
        },
        {
          element: document.querySelector('#supplyPlatform'),
          intro: this.$t('goodsCollection.tooltipTitle16'),
          position: 'top'
        },
        {
          element: '#step_2',
          intro: this.$t('goodsCollection.tooltipTitle17'),
          position: 'top'
        },
        {
          element: document.querySelector(
            '.sub-name[data-left-menu="/goods/collect"]'
          ),
          intro: this.$t('goodsCollection.tooltipTitle18'),
          position: 'right'
        }
      ]
      // https://introjs.com/docs/intro/options#showbuttons
      this.$intro()
        .setOptions({
          prevLabel: this.$t('goodsCollection.tooltipTitle19'),
          nextLabel: this.$t('goodsCollection.tooltipTitle20'),
          showBullets: false,
          steps: data,
          tooltipClass: 'me-introjs-tooltip',
          highlightClass: 'me-introjs-highlight',
          doneLabel: this.$t('common.ok')
        })
        .start()
    },
    // 采集按钮统一调度
    async handleCollect(autoClaimStore = null) {
      this.autoClaimStore = autoClaimStore
      let urlsArr = []
      let idsArr = []
      switch (this.currentTab) {
        //链接采集
        case '1':
          // eslint-disable-next-line no-case-declarations
          urlsArr = await this.$refs.LinkCollect.onCollectionBefor()
          break
        case '2':
          urlsArr = await this.$refs.StoreCollect.onBatchImport()
          break
        case '3':
          urlsArr = await this.$refs.PlatCollect.onBatchImport()
          idsArr = this.$refs.PlatCollect.idSelectedArr
          break
        default:
          break
      }
      this.importSubmit(urlsArr, autoClaimStore, idsArr)
    },
    //接口，插件采集开关
    platformSwitch(item) {
      if (!this.$data.collectionPlatformConfig) return false
      this.getPlatformName = []
      let keys = Object.keys(this.$data.collectionPlatformConfig)
      for (let i = 0; i < keys.length; i++) {
        if (this.$data.collectionPlatformConfig[keys[i]] == 1) {
          if (this.platformSiteName[keys[i]]) {
            this.getPlatformName.push(this.platformSiteName[keys[i]])
          }
        }
      }
      for (let i = 0; i < keys.length; i++) {
        if (
          this.$data.collectionPlatformConfig[keys[i]] == 1 &&
          item.includes(this.platformSite[keys[i]])
        ) {
          return true
        }
      }
      return false
    },
    /**
     * 采集到采集箱
     */
    importSubmit(urlArr = [], autoClaimStore, idsArr = []) {
      let flag = false
      urlArr.forEach((item) => {
        if (this.platformSwitch(item)) {
          flag = true
        }
      })
      if (flag) {
        this.$data.urls = urlArr
        this.$data.colleTipsVisible = true
        return false
      }
      let params = {
        linkArr: urlArr,
        autoClaimStore: this.autoClaimStore
      }
      if (idsArr.length !== 0) {
        params = Object.assign(params, { itemIds: idsArr })
      }
      CrawlApi.addCrawlWithLink(params)
        .then((res) => {
          if (res.code === 0) {
            bus.$emit('work-flow-steps', autoClaimStore) // 显示头部导航提示
            if (!autoClaimStore) {
              this.$message.success(
                this.$t('goodsCollection.linkCollectionSuccess')
              )
            } else {
              this.$message.success(
                this.$t('goodsCollection.collectAndPublishSuccess')
              )
            }
            this.getCountCrawlToday()
          }
        })
        .catch(() => {})
        .finally(() => {
          this.$data.loading = false
        })
    },

    /**
     * tab改变事件
     */
    onTabChange(activeKey) {
      this.$data.currentTab = activeKey
    },
    /**
     * 采集设置取消
     */
    settingCancel() {
      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('goodsCollection.confirmContent1'),
        onOk: () => {
          this.$data.settingVisible = false
        }
      })
    },
    settingClose() {
      this.$data.settingVisible = false
    },

    // 自动发布确认
    publishSetOk() {
      this.publishSetLoading = true
      this.$refs.autoPublishSet
        .submit()
        .then(() => {
          this.$message.success(this.$t('common.handlerSuccess'))
          this.publishVisible = false
        })
        .catch(() => {})
        .finally(() => {
          this.publishSetLoading = false
        })
    },
    // 获取当天用户采集情况
    getCountCrawlToday() {
      CrawlApi.getCountSuccessCrawlToday().then((res) => {
        if (res.code == 0) {
          this.userCountCrawlData = res.data
          let entries = Object.entries(res.data.storeRule)
          this.ruleData = []
          // 排序
          entries.sort((a, b) => Number(a[1]) - Number(b[1]))
          entries.forEach((item, index) => {
            let num = ''
            if (index == 0) {
              num = item[0]
            } else if (index === entries.length - 1) {
              num = Number(item[0]) + '以上'
            } else {
              num = item[0] + ' ~ ' + (Number(entries[index + 1][0]) - 1)
            }
            this.ruleData.push({ storeNum: num, crawlNum: item[1] })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.me-card {
  &.me-goods-collection {
    height: 100%;
    padding: 0;
  }
  .ant-tabs-tabpane-active {
    overflow-x: hidden;
    overflow-y: auto;
    height: calc(100vh - 250px);
    &.plugin-panel-wrap {
      height: calc(100vh - 190px);
      overflow: hidden;
    }
  }
}
.me-st {
  .ant-tabs-tabpane-active {
    height: calc(100vh - 190px);
  }
  .collect-button-wrap {
    padding: 12px 0;
    width: calc(100% - 196px);
  }
}

.collect-button-wrap {
  width: calc(100% - 175px);
  display: flex;
  justify-content: center;
  background: #fff;
  position: fixed;
  bottom: 0px;
  align-items: center;
  padding: 12px 0 20px;
}
.count-crawl-user {
  display: inline-block;
}

.me-colleTips {
  padding-bottom: 13px;
  dt {
    padding: 6px 0 6px 8px;
    min-height: 32px;
    background: #f9f4ec;
    border-radius: 2px;
    color: #d38c5a;
  }
  dd {
    font-size: 14px;
    color: #303133;
    margin-top: 10px;
    span {
      margin-right: 10px;
      display: inline-block;
      width: 18px;
      height: 18px;
      line-height: 18px;
      text-align: center;
      border-radius: 50%;
      font-size: 12px;
      border: 1px solid #a8a8b3;
      position: relative;
    }
  }
}
.me-stp::before {
  content: '';
  position: absolute;
  top: 16px;
  left: 8px;
  border-left: 1px dashed #a2a3ac;
  height: 15px;
  width: 0px;
}
.me-plug-pop {
  text-align: center;

  h2 {
    font-weight: 600;
    color: #262424;
    line-height: 25px;
    font-size: 18px;
  }

  p {
    line-height: 22px;
    color: #909099;
    font-size: 12px;
  }

  .me-f12 {
    font-size: 12px;
  }
}
.query-platform {
  ::v-deep .ant-tabs-bar {
    display: none;
  }
}
</style>
<style lang="scss">
.count-crawl-user-help {
  .ant-tooltip-content {
    width: 360px;
  }
}
</style>
