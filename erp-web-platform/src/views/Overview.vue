<template>
  <div class="me-pa-2">
    <!-- <span @click="android">聊聊</span> -->
    <a-alert
      type="info"
      closable
      showIcon
      class="me-mb-2"
      v-if="storeList.length === 0"
    >
      <span slot="description"
        >温馨提示：您当前还没有授权店铺，请<a
          style="color:#3795ff"
          @click="openPage('/store')"
          >前往授权</a
        ></span
      >
    </a-alert>
    <div class="home-page">
      <div class="homeleft">
        <div class="datashow">
          <div class="order-nav">
            <div class="title-g">{{ $t('overView.saleData') }}</div>
            <div class="nav">
              <div class="title">
                <div class="text">{{ $t('overView.todayOrderNum') }}</div>
                <div class="num">{{ todayTotalOrder }}</div>
              </div>
            </div>
            <div class="nav">
              <div class="title">
                <div class="text">{{ $t('overView.todaySaleNum') }}</div>
                <div class="num">¥{{ todayTotalSales }}</div>
              </div>
            </div>
            <div class="nav">
              <div class="title">
                <div class="text">{{ $t('overView.yestodaySaleNum') }}</div>
                <div class="num">¥{{ yesterdayTotalSales }}</div>
              </div>
            </div>
            <div class="nav nav-last">
              <div class="title">
                <div class="text">{{ $t('overView.last7DaySaleNum') }}</div>
                <div class="num">¥{{ recentlyTotalSales }}</div>
              </div>
            </div>
          </div>
          <div class="pending">
            <div class="title-p">{{ $t('overView.pendingBusiness') }}</div>
            <div class="content-box">
              <!-- <div class="content" @click="linkOrder('pendingPay')">
                <div class="num">{{ pendingPaymentOrder }}</div>
                <div class="text">{{ $t('overView.orderToBePaid') }}</div>
              </div> -->
              <div
                class="content"
                @click="linkOrder(ylUser ? 'pagePacking' : 'pendingOrder')"
              >
                <div class="text" v-if="ylUser">未录单订单</div>
                <div class="text" v-else>
                  {{ $t('overView.pendingOrders') }}
                </div>
                <div class="num">{{ pendingOrder }}</div>
              </div>
              <div class="content last" @click="linkOrder('recentlyShip')">
                <div class="text">
                  {{ $t('overView.deliveryLessThan24Hours') }}
                </div>
                <div class="num">{{ recentlyShip }}</div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="me-shope-chat"
          :style="{ width: usercarouselWidth + 'px' }"
          v-if="adboxShow"
        >
          <Carouse adKey="erp_home_banner" />
        </div>
        <div v-else style="text-align: center;margin-top: 10px;">
          <a-icon type="loading" />
        </div>

        <div class="goods-section" ref="goodssection">
          <div class="goods-over">
            <div class="title-g">{{ $t('overView.productOverview') }}</div>
            <div class="goods-box">
              <div class="item" @click="linkGoods('pushFail')">
                <div class="me-fl me-mr-2">
                  <img src="../assets/images/shibai.png" width="100%" />
                </div>
                <div>
                  <div class="status">
                    {{ $t('overView.publishingFailed') }}
                  </div>
                  <div class="num">{{ pushFail }}</div>
                </div>
              </div>
              <div class="item" @click="linkGoods('pendingPushGoods')">
                <div class="me-fl me-mr-2">
                  <img src="../assets/images/daifahuo.png" width="100%" />
                </div>
                <div>
                  <div class="status">{{ $t('overView.toBePublish') }}</div>
                  <div class="num">{{ pendingPushGoods }}</div>
                </div>
              </div>
              <div class="item" @click="linkGoods('inactiveGoods')">
                <div class="me-fl me-mr-2">
                  <img src="../assets/images/yixiajia.png" width="100%" />
                </div>
                <div>
                  <div class="status">{{ $t('overView.offShelf') }}</div>
                  <div class="num">{{ inactiveGoods }}</div>
                </div>
              </div>
              <div class="item" @click="linkGoods('normalGoods')">
                <div class="me-fl me-mr-2">
                  <img src="../assets/images/yishagnjia.png" width="100%" />
                </div>
                <div>
                  <div class="status">{{ $t('overView.onShelf') }}</div>
                  <div class="num">{{ normalGoods }}</div>
                </div>
              </div>
              <div class="item">
                <div class="me-fl me-mr-2">
                  <img src="../assets/images/quanbu.png" width="100%" />
                </div>
                <div>
                  <div class="status">{{ $t('overView.allGoods') }}</div>
                  <div class="num">{{ allGoods }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="order-total total-item">
          <div class="leftdiv">
            <h3>
              <span
                :class="{ cur: curStatistical === 1 }"
                @click="changeTab(1)"
                >{{ $t('overView.orderStatic') }}</span
              >
              <span
                :class="{ cur: curStatistical === 2 }"
                @click="changeTab(2)"
                >{{ $t('overView.salesStatic') }}</span
              >
            </h3>
            <div class="total-section" v-show="curStatistical === 1">
              <div class="left">
                <div class="month">
                  <div class="text">
                    {{ $t('overView.thisMonthOrdersNum') }}
                  </div>
                  <div class="total-box">
                    <div class="num">{{ orderData.totalThisMonthOrder }}</div>
                    <div class="rate">
                      {{ parseFloat(orderData.thisMonthYoY) + '%' }}
                    </div>
                    <span
                      :class="{ down: parseFloat(orderData.thisMonthYoY) < 0 }"
                    ></span>
                    <div class="text-a">{{ $t('overView.monthOnMonth') }}</div>
                  </div>
                </div>
                <div class="month">
                  <div class="text">{{ $t('overView.thisWeekOrdersNum') }}</div>
                  <div class="total-box">
                    <div class="num">{{ orderData.totalThisWeekOrder }}</div>
                    <div class="rate">
                      {{ parseFloat(orderData.thisWeekYoY) + '%' }}
                    </div>
                    <span
                      :class="{ down: parseFloat(orderData.thisWeekYoY) < 0 }"
                    ></span>
                    <div class="text-a">{{ $t('overView.weekOnWeek') }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="right-section" v-show="curStatistical === 1">
              <div>
                <span style="margin-left:54px;">
                  近一月订单统计
                </span>
                <a-radio-group
                  :value="orderChoose"
                  @change="handleOrderChange"
                  class="me-fr"
                >
                  <a-radio-button value="week">
                    本周
                  </a-radio-button>
                  <a-radio-button value="month">
                    本月
                  </a-radio-button>
                </a-radio-group>
              </div>
              <div
                class="chart-content"
                id="orderChart"
                style="height: 334px;"
              ></div>
            </div>
            <div class="total-section" v-if="curStatistical === 2">
              <div class="left">
                <div class="month">
                  <div class="text">
                    {{ $t('overView.totalSalesThisMonth') }}
                  </div>
                  <div class="total-box">
                    <div class="num">{{ salesData.totalThisMonthSales }}</div>
                    <div class="rate">
                      {{ parseFloat(salesData.thisMonthYoY) + '%' }}
                    </div>
                    <span
                      :class="{ down: parseFloat(salesData.thisMonthYoY) < 0 }"
                    ></span>
                    <div class="text-a">{{ $t('overView.monthOnMonth') }}</div>
                  </div>
                </div>
                <div class="month">
                  <div class="text">
                    {{ $t('overView.totalSalesThisWeek') }}
                  </div>
                  <div class="total-box">
                    <div class="num">{{ salesData.totalThisWeekSales }}</div>
                    <div class="rate">
                      {{ parseFloat(salesData.thisWeekYoY) + '%' }}
                    </div>
                    <span
                      :class="{ down: parseFloat(salesData.thisWeekYoY) < 0 }"
                    ></span>
                    <div class="text-a">{{ $t('overView.weekOnWeek') }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="right-section" v-if="curStatistical === 2">
              <div>
                <span style="margin-left:54px;"> 近一月订单统计 </span>
                <a-radio-group
                  :value="saleChoose"
                  @change="handleSaleChange"
                  class="me-fr"
                >
                  <a-radio-button value="week">
                    本周
                  </a-radio-button>
                  <a-radio-button value="month">
                    本月
                  </a-radio-button>
                </a-radio-group>
              </div>
              <div
                class="chart-content"
                id="saleChart"
                style="height: 334px;"
              ></div>
            </div>
          </div>
          <div
            style="width: 1px;background: #EBEBEB;height: 211px;margin-top: 10px;"
          ></div>
          <div class="rightdiv">
            <div class="shop-ranking">
              <div class="title-g">{{ $t('overView.storeOrderRanking') }}</div>
              <div
                class="ranking-content"
                v-for="(item, index) in shopArry"
                :key="index"
              >
                <div
                  class="ranking"
                  :class="{
                    red: index == 0,
                    yellow: index == 1,
                    orange: index == 2
                  }"
                >
                  {{ index + 1 }}
                </div>
                <div class="shop" :title="item.name">
                  {{
                    item.name.length > 15
                      ? item.name.substring(0, 15) + '...'
                      : item.name
                  }}
                </div>
                <div class="sale">{{ item.value }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="homeright">
        <a
          :href="systemConfig.plugDownloadUrl"
          :download="systemConfig.plugDownloadUrl"
        >
          <div class="func-large">
            <img src="@/assets/images/plugin-icon.png" alt="" class="icon" />
            <div class="desc">
              <p class="title">
                {{ $t('overView.downloadPlus2') }}
              </p>
              <p class="breakAll">
                {{ $t('overView.collectPlatformCommodities') }}
              </p>
            </div>
          </div>
        </a>

        <router-link to="/featrue/apply-store">
          <div class="func">
            <i class="iconfont iconyijiankaidian iconsarr"></i>
            <span :title="$t('overView.oneClickShop')">{{
              $t('overView.oneClickShop')
            }}</span>
          </div>
        </router-link>

        <router-link to="/featrue/invitation">
          <div class="func">
            <i class="iconfont iconyaoqinghaoyou iconsarr"></i>
            <span :title="$t('overView.inviteFriend')">{{
              $t('overView.inviteFriend')
            }}</span>
          </div>
        </router-link>
        <router-link to="/featrue/feedback">
          <div class="func">
            <i class="iconfont iconyijianfankui iconsarr"></i>
            <span :title="$t('overView.feedBack')">{{
              $t('overView.feedBack')
            }}</span>
          </div>
        </router-link>
        <div class="qqservice">
          <a
            target="_blank"
            href="http://wpa.qq.com/msgrd?v=3&uin=2402131278&site=qq&menu=yes"
          >
            <i class="iconfont iconqq iconsarr"></i>
            <span>{{ $t('overView.qqService') }}</span>
          </a>
        </div>
        <!-- v-auth="'overview.overview-qr-code'" -->
        <div class="gzh">
          <div class="gzh1">
            <img
              :src="gzh1"
              height="52"
              @mouseenter="visibleDialog(1)"
              @mouseleave="invisibleDialog(1)"
            />
            <div class="tit">
              <h2>{{ $t('overView.followMLJ') }}</h2>
              <span>{{ $t('overView.getNewsTrends') }}</span>
            </div>
            <div class="dialog" v-show="showgzh1 == true">
              <h2>
                <!-- {{ $t('overView.addWechatService') }} -->
              </h2>
              <h3>
                {{ $t('overView.getNewsTrends') }}
              </h3>
              <div>
                <img :src="gzh1" height="117" />
              </div>
            </div>
            <div class="san" v-show="showgzh1 == true"></div>
          </div>
          <div class="gzh1" v-if="!ylUser">
            <img
              :src="gzh2"
              height="52"
              @mouseenter="visibleDialog(2)"
              @mouseleave="invisibleDialog(2)"
            />
            <div class="tit">
              <h2>{{ $t('overView.addWechatService') }}</h2>
              <span>{{ $t('overView.qAdnA') }}</span>
            </div>
            <div class="dialog" v-show="showgzh2 == true">
              <h2>
                {{ $t('overView.addWechatService') }}
              </h2>
              <h3>
                {{ $t('overView.qAdnA') }}
              </h3>
              <div>
                <img :src="gzh2" height="117" />
              </div>
            </div>
            <div class="san" v-show="showgzh2 == true"></div>
          </div>
          <div class="gzh1">
            <img
              :src="gzh3"
              height="52"
              @mouseenter="visibleDialog(3)"
              @mouseleave="invisibleDialog(3)"
            />
            <div class="tit">
              <h2>进【大卖交流】群</h2>
              <span>领取运营资料包</span>
            </div>
            <div class="dialog" v-show="showgzh3 == true">
              <h2>
                进【大卖交流】群
              </h2>
              <h3>
                领取运营资料包
              </h3>
              <div>
                <img :src="gzh3" height="117" />
              </div>
            </div>
            <div class="san" v-show="showgzh3 == true"></div>
          </div>
        </div>

        <div class="pro-dynamic">
          <h2>
            最新活动
          </h2>
          <div class="me-activity">
            <Carouse adKey="erp_home_right_banner" />
          </div>
        </div>

        <div class="pro-dynamic">
          <h2 :title="$t('overView.shopeeTrends')">
            {{ $t('overView.shopeeTrends') }}
            <span @click="goList('2')">{{ $t('overView.more') }}</span>
          </h2>
          <ul>
            <li
              v-for="(item, index) in productNews"
              :key="item.contentId"
              @click="routerToNews(item)"
              v-show="index < 1"
            >
              <a class="me-dot">
                <span v-show="index < 2">new</span>
                {{ item.createTime | monthAndDay }} {{ item.title }}
              </a>
            </li>
          </ul>
        </div>

        <div class="pro-dynamic">
          <h2 :title="$t('overView.guideToUse')">
            {{ $t('overView.guideToUse') }}
            <span @click="goList('1')">{{ $t('overView.more') }}</span>
          </h2>
          <ul>
            <li
              v-for="(item, index) in guideNews"
              :key="item.contentId"
              @click="routerToNews(item)"
              v-show="index < 5"
            >
              <a class="me-dot">
                <span v-show="index < 2">new</span>
                {{ item.createTime | monthAndDay }} {{ item.title }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 虾皮聊聊二维码 -->
    <a-modal
      title=""
      :visible="liaoliaochatVisible"
      @cancel="liaoliaochatVisible = false"
      :destroyOnClose="true"
      :footer="false"
      :width="461"
      :bodyStyle="{ padding: 0 }"
      dialogClass="me-leliao-pop"
    >
      <div class="me-liaoliaochat-con">
        <img src="../assets/images/leliaopop.png" width="100%" />
        <h2>Chat++聊聊工具，客服提效神器！0元体验ing，速度！</h2>
        <p>
          消息收发及时、无需采购IP，稳定又安全！多店管理，自动翻译，接待便捷
        </p>
        <a-button class="me-leliao-btn" type="primary" @click="goLeliao()"
          >免费试用</a-button
        >
      </div>
    </a-modal>
    <!-- <a-modal
      title=""
      :visible="banner1210Visible"
      @cancel="banner1210Visible = false"
      :destroyOnClose="true"
      :footer="false"
      :width="461"
      :centered="true"
      :bodyStyle="{ padding: 0 }"
      dialogClass="me-leliao-pop"
    >
      <div class="me-liaoliaochat-con">
        <img src="../assets/images/banner1210.jpg" width="100%" />
      </div>
    </a-modal> -->
    <!-- vip销售弹窗 -->
    <!-- <div class="vipcontent">
      <a-modal
        title=""
        :visible="vipVisible"
        @cancel="vipVisible = false"
        :destroyOnClose="true"
        :footer="false"
        :width="950"
        :bodyStyle="{ padding: 0 }"
        :centered="true"
        dialogClass="vipcontent"
      >
        <div
          class="me-liaoliaochat-con hand"
          @click="
            $router.push({
              path: '/information/info?type=2&listId=8&newsId=51'
            })
          "
        >
          <img src="../assets/images/indexvip.jpg" width="100%" />
        </div>
      </a-modal>
    </div> -->
  </div>
</template>
<script>
import { leliao } from '@/util/index'
import Basic from '@/api/basic'
import echarts from '@/util/echarts'
import { mapState } from 'vuex'
import moment from 'moment'
import { getAdByKey } from '@/util/document'
import Carouse from '@/components/Carouse'
export default {
  components: { Carouse },
  data() {
    let that = this
    return {
      getAdByKey,
      liaoliaochatVisible: false,
      orderChartsDate: [], //订单图表
      saleChartsDate: [], // 销量图表

      todayTotalOrder: '',
      todayTotalSales: '',
      yesterdayTotalSales: '',
      recentlyTotalSales: '',
      pendingOrder: '',
      pendingPaymentOrder: '',
      recentlyShip: '',
      pushFail: '',
      pendingPushGoods: '',
      allGoods: '',
      normalGoods: '',
      inactiveGoods: '',
      shopArry: [],
      orderData: {},
      salesData: {},
      startTitle: this.$t('overView.startTitle'),
      endTitle: this.$t('overView.endTitle'),
      defaultStart: '',
      defaultEnd: new Date().toISOString().substr(0, 10),
      type: '',
      type_s: '',

      index: 0,
      orderDataName: [],
      orderDataValue: [],
      salesDataName: [],
      salesDataValue: [],
      clickType: '',
      showgzh1: false,
      showgzh2: false,
      showgzh3: false,
      productNews: [],
      guideNews: [],
      ylUser: false,
      // 订单统计|| 销售统计，1||2
      curStatistical: 1,
      orderChoose: 'month',
      saleChoose: 'month',
      banner1210Visible: false,
      newActivity: 0,
      // vipVisible: true,
      usercarouselWidth: '',
      adboxShow: true
    }
  },
  beforeRouteEnter(to, rom, next) {
    let redirectPath = localStorage.getItem('redirectPath')
    if (redirectPath === '/member/Index') {
      localStorage.removeItem('redirectPath')
      next({ path: redirectPath })
    } else {
      next()
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  created() {
    this.ylUser = localStorage.ylUser == 'true' ? true : false
  },
  mounted() {
    this.usercarouselWidth = this.$refs.goodssection.clientWidth
    window.addEventListener('resize', this.handleResize)

    this.newActivity = localStorage.newActivity
    const lastSevenDay = moment()
      .day(-7)
      .format('yyyy-MM-DD')
    this.orderChartsDate[0] = moment()
      .startOf('month')
      .format('yyyy-MM-DD')
    this.orderChartsDate[1] = moment().format('yyyy-MM-DD')
    this.saleChartsDate[0] = moment()
      .startOf('month')
      .format('yyyy-MM-DD')
    this.saleChartsDate[1] = moment().format('yyyy-MM-DD')
    this.getHomeData()
    this.getIndexProduct()
    this.getIndexGuide()
  },
  filters: {
    monthAndDay(val) {
      var time = new Date(val)
      var month = time.getMonth() + 1
      var day = time.getDate()
      month < 10 ? (month = '0' + month) : month
      day < 10 ? (day = '0' + day) : day
      return month + '/' + day
    }
  },
  computed: {
    gzh1() {
      return require('@/assets/images/wechat-code-2.jpg')
    },
    gzh2() {
      return require('@/assets/images/wechat_new20220718.jpg')
    },
    gzh3() {
      return require('@/assets/images/wechat_new20220722.png')
    },
    dateRanges() {
      let obj = {}
      obj[this.$t('overView.today')] = [moment(), moment()]
      obj[this.$t('overView.pastWeek')] = [moment().day(-7), moment()]
      obj[this.$t('overView.currentMonth')] = [
        moment().startOf('month'),
        moment().endOf('month')
      ]
      return obj
    },
    ...mapState({
      systemConfig: (state) => state.app.systemConfig,
      storeList: (state) => state.auth.storeList,
      storeSumV1: (state) => state.auth.storeSumV1
    })
  },
  methods: {
    handleResize(event) {
      const that = this
      this.adboxShow = false
      setTimeout(() => {
        const fullWidth = that.$refs.goodssection.clientWidth
        that.usercarouselWidth = fullWidth
        that.adboxShow = true
      }, 1000)
    },
    //聊聊二维码
    getLiaoliaoChat() {
      this.liaoliaochatVisible = true
    },
    // 货代商广告
    // showP2Warning() {
    //   if (sessionStorage.getItem('first-show-p2-warning')) {
    //     return false
    //   }
    //   localStorage.newActivity = 0
    //   sessionStorage.setItem('first-show-p2-warning', true)
    //   console.log(typeof localStorage.invitationCode)
    //   if (!this.ylUser) {
    //     if (
    //       ![
    //         '560413',
    //         '058348',
    //         '408712',
    //         '952197',
    //         '368870',
    //         '390354',
    //         '264973',
    //         '873938',
    //         '368443',
    //         '394978',
    //         '023215',
    //         '111286',
    //         '102338',
    //         '393594'
    //       ].includes(localStorage.invitationCode)
    //     ) {
    //       this.banner1210Visible = true
    //       localStorage.newActivity = 1
    //     }
    //   }
    // },
    moment,
    initOrderCharts() {
      let orderChart = echarts.init(document.getElementById('orderChart'))
      let t = this
      orderChart.setOption({
        title: { text: '' },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: [this.$t('overView.orderStatic')]
        },
        xAxis: {
          data: this.orderDataName
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: {},
        series: [
          {
            name: this.$t('overView.orderNum'),
            type: 'line',
            data: this.orderDataValue,
            itemStyle: {
              normal: {
                color: '#FF6B38',
                lineStyle: {
                  color: '#FF6B38'
                }
              }
            },
            areaStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#FF6B38' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#ffffff' // 100% 处的颜色
                    }
                  ],
                  globalCoord: false // 缺省为 false
                }
              }
            }
          }
        ]
      })
    },
    initSaleCharts() {
      if (!document.getElementById('saleChart')) return
      let saleChart = echarts.init(document.getElementById('saleChart'))
      saleChart.setOption({
        title: { text: '' },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: [this.$t('overView.salesStatic')]
        },
        xAxis: {
          data: this.salesDataName
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: {},
        series: [
          {
            name: this.$t('overView.salesNum'),
            type: 'line',
            data: this.salesDataValue,
            itemStyle: {
              normal: {
                color: '#FF6B38',
                lineStyle: {
                  color: '#FF6B38'
                }
              }
            },
            areaStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#FF6B38' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#ffffff' // 100% 处的颜色
                    }
                  ],
                  globalCoord: false // 缺省为 false
                }
              }
            }
          }
        ]
      })
    },
    getHomeData() {
      let params = {
        startTime: this.orderChartsDate[0],
        endTime: this.orderChartsDate[1]
      }
      if (this.clickType == 'sale') {
        params = {
          startTime: this.saleChartsDate[0],
          endTime: this.saleChartsDate[1]
        }
      }
      Basic.getHomeData(params).then(({ data }) => {
        this.todayTotalOrder = data.todayTotalOrder
        this.todayTotalSales = data.todayTotalSales
        this.yesterdayTotalSales = data.yesterdayTotalSales
        this.recentlyTotalSales = data.recentlyTotalSales
        this.pendingOrder = data.pendingOrder
        this.pendingPaymentOrder = data.pendingPaymentOrder
        this.recentlyShip = data.recentlyShip
        this.pushFail = data.pushFail
        this.pendingPushGoods = data.pendingPushGoods
        this.allGoods = data.allGoods
        this.normalGoods = data.normalGoods
        this.inactiveGoods = data.inactiveGoods
        // data.storeOrderTotalRanking.length>5? this.shopArry= data.storeOrderTotalRanking.splice(0, 5): this.shopArry = data.storeOrderTotalRanking
        this.shopArry = data.storeOrderTotalRanking.splice(0, 10)
        this.orderData = data.orderData
        this.salesData = data.salesData
        if (this.clickType == '') {
          this.orderDataName = data.orderData.data.map((item) =>
            item.name.substr(5, 10)
          )
          this.orderDataValue = data.orderData.data.map((item) => item.value)
          this.salesDataName = data.salesData.data.map((item) =>
            item.name.substr(5, 10)
          )
          this.salesDataValue = data.salesData.data.map((item) => item.value)
          this.initOrderCharts()
          this.initSaleCharts()
        } else if (this.clickType == 'order') {
          this.orderDataName = data.orderData.data.map((item) =>
            item.name.substr(5, 10)
          )
          this.orderDataValue = data.orderData.data.map((item) => item.value)
          this.initOrderCharts()
        } else if (this.clickType == 'sale') {
          this.salesDataName = data.salesData.data.map((item) =>
            item.name.substr(5, 10)
          )
          this.salesDataValue = data.salesData.data.map((item) => item.value)
          this.initSaleCharts()
        }
      })
    },
    handleOrderChange(e) {
      console.log(e.target.value)
      this.$data.orderChoose = e.target.value
      if (e.target.value == 'week') {
        this.orderChartsDate[0] = moment()
          .startOf('week')
          .format('yyyy-MM-DD')
        this.orderChartsDate[1] = moment().format('yyyy-MM-DD')
      } else {
        this.orderChartsDate[0] = moment()
          .startOf('month')
          .format('yyyy-MM-DD')
        this.orderChartsDate[1] = moment().format('yyyy-MM-DD')
      }
      this.clickType = 'order'
      this.getHomeData()
    },
    handleSaleChange(e) {
      console.log(e.target.value)
      this.$data.saleChoose = e.target.value
      if (e.target.value == 'week') {
        this.saleChartsDate[0] = moment()
          .startOf('week')
          .format('yyyy-MM-DD')
        this.saleChartsDate[1] = moment().format('yyyy-MM-DD')
      } else {
        this.saleChartsDate[0] = moment()
          .startOf('month')
          .format('yyyy-MM-DD')
        this.saleChartsDate[1] = moment().format('yyyy-MM-DD')
      }
      this.clickType = 'sale'
      this.getHomeData()
    },
    // 获取首页产品动态
    getIndexProduct() {
      let params = {
        module: 2,
        size: 6,
        current: 1
      }
      Basic.getNewsList(params).then(({ data }) => {
        this.productNews = data.records
      })
    },
    // 获取首页使用指南
    getIndexGuide() {
      let params = {
        module: 1,
        size: 6,
        current: 1
      }
      Basic.getNewsList(params).then(({ data }) => {
        this.guideNews = data.records
      })
    },
    // 前往列表
    goList(val) {
      this.$router.push({
        path: `/information/info-list?type=${val}&&listId=${-1}`
      })
    },
    //跳转到单个新闻
    routerToNews(item) {
      this.$router.push({
        path: `/information/info?type=${item.module}&listId=${item.classifyId}&newsId=${item.contentId}`
      })
    },

    //订单统计
    handleChangeOrderDate() {
      this.clickType = 'order'
      this.getHomeData()
    },

    //销量统计
    handleChangeSaleDate() {
      this.clickType = 'sale'
      this.getHomeData()
    },
    goLeliao() {
      leliao(this.$store.getters.getAccessToken)
      this.$data.liaoliaochatVisible = false
    },
    linkOrder(type) {
      switch (type) {
        case 'pendingPay':
          this.$router.push('/order/page?status=UNPAID')
          break
        case 'pendingOrder':
          this.$router.push('/order/page-ready')
          break
        case 'recentlyShip':
          this.$router.push('/order/page?status=READY_TO_SHIP')
          break
        case 'pagePacking':
          this.$router.push('/order/page-packing')
          break
      }
    },
    linkGoods(type) {
      switch (type) {
        case 'pushFail':
          this.$router.push('/goods/faild')
          break
        case 'pendingPushGoods':
          this.$router.push('/goods/to-be-edit?status=1')
          break
        case 'inactiveGoods':
          this.$router.push('/goods/on-sale?status=0')
          break
        case 'normalGoods':
          this.$router.push('/goods/on-sale?status=1')
          break
      }
    },
    visibleDialog(val) {
      val == 1
        ? (this.showgzh1 = true)
        : val == 2
        ? (this.showgzh2 = true)
        : (this.showgzh3 = true)
    },
    invisibleDialog(val) {
      val == 1
        ? (this.showgzh1 = false)
        : val == 2
        ? (this.showgzh2 = false)
        : (this.showgzh3 = false)
    },
    changeTab(num) {
      this.$data.curStatistical = num
      if (num == 1) {
        this.handleChangeOrderDate()
      } else {
        this.handleChangeSaleDate()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.home-page {
  display: flex;
  .homeleft {
    flex: 1;
    padding-right: 16px;
  }
  .homeright {
    width: 240px;
    background: #ffffff;
    .pro-dynamic {
      margin-bottom: 18px;
      h2 {
        line-height: 44px;
        font-size: 20px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: #2c2d2e;
        padding-left: 19px;
        span {
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          color: #9a9a9a;
          margin-left: auto;
          padding-right: 16px;
          cursor: pointer;
          float: right;
        }
      }
      ul {
        padding-left: 16px;
        span {
          width: 38px;
          height: 16px;
          background: #ff720d;
          border-radius: 2px;
          display: inline-block;
          font-size: 12px;
          color: #ffffff;
          line-height: 16px;
          text-align: center;
        }
        li {
          height: 32px;
          line-height: 32px;
          overflow: hidden;
          a {
            height: 20px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #626466;
            line-height: 20px;
          }
        }
      }
    }
    .func {
      width: 208px;
      height: 48px;
      line-height: 48px;
      background: #f5f6fa;
      border-radius: 2px;
      margin: 8px 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      .iconsarr {
        margin: 16px;
        font-size: 18px;
      }
      span {
        height: 20px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 600;
        color: #626466;
        line-height: 20px;
      }
    }
    .func:hover {
      span,
      .iconsarr {
        color: #ff720d;
      }
    }
    .func-large {
      display: flex;
      height: 98px;
      background: #f5f6fa;
      margin: 16px 16px 4px 16px;
      padding: 12px;
      align-items: center;
      cursor: pointer;
      .icon {
        height: 41px;
        width: 41px;
        margin: 17px 10px;
      }
      .desc {
        color: #606166;
      }
      .title {
        color: #303133;
        font-size: 16px;
        font-weight: 600;
      }
    }
    .qqservice {
      width: 208px;
      line-height: 32px;
      border-radius: 2px;
      border: 1px solid #ff720d;
      margin: 12px 16px 19px 16px;
      cursor: pointer;
      text-align: center;
      .iconsarr {
        height: 13px;
        font-size: 13px;
        width: 13px;
        margin: 3px;
        color: #ff720d;
      }
      span {
        height: 17px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ff720d;
        line-height: 17px;
      }
    }
    .gzh {
      border-top: 1px solid #f5f5f5;
      .gzh1 {
        width: 240px;
        height: 75px;
        background: #ffffff;
        border-radius: 2px;
        display: flex;
        position: relative;
        img {
          margin: 12px 8px 11px 16px;
          cursor: pointer;
        }
        .tit {
          margin-top: 17px;
          h2 {
            width: 158px;
            font-size: 13px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: bold;
            color: #1c1b1b;
            line-height: 18px;
          }
          span {
            width: 147px;
            height: 20px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #a4a4a4;
            line-height: 20px;
          }
        }
        .dialog {
          position: absolute;
          top: 10px;
          left: -205px;
          width: 200px;
          height: 200px;
          background: #ffffff;
          box-shadow: 0px 5px 12px 0px rgba(208, 209, 209, 0.5);
          text-align: center;
          h2 {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #1c1b1b;
            line-height: 20px;
            margin-top: 12px;
          }
          h3 {
            height: 12px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #a4a4a4;
            line-height: 12px;
          }
        }
        .san {
          position: absolute;
          top: 30px;
          left: -5px;
          width: 0;
          height: 0;
          border-top: 5px solid transparent;
          border-left: 5px solid #fff;
          border-bottom: 5px solid transparent;
        }
      }
    }
    .mt30 {
      margin-top: 30px;
    }
  }
  .order-nav {
    flex: 1;
    background: #fff;
    margin-right: 20px;
    width: 50%;
    box-shadow: 0px 2px 4px 0px rgba(214, 214, 214, 0.5);
    border-radius: 4px;
    .title-g {
      font-size: 20px;
      line-height: 28px;
      color: #262424;
      font-weight: bold;
      padding: 20px 20px 0px 20px;
    }
    .nav {
      width: 50%;
      padding: 20px;
      float: left;
      .title {
        flex: 1;
        .text {
          font-size: 14px;
          color: #727272;
        }
        .num {
          font-size: 24px;
        }
      }
    }
    .nav-last {
      margin-right: 0;
    }
  }
  .pending {
    background: #ffffff;
    box-shadow: 0px 2px 4px 0px rgba(214, 214, 214, 0.5);
    border-radius: 4px;
    padding: 20px;
    width: 50%;
    .title-p {
      font-size: 20px;
      line-height: 28px;
      color: #262424;
      font-weight: bold;
      margin-bottom: 12px;
    }
    .content-box {
      display: flex;
      .content {
        flex: 1;
        background: #fff;
        padding: 5px 0 16px 0;
        cursor: pointer;
        .num {
          font-size: 24px;
          color: #262424;
          text-align: left;
          display: inline;
        }
        .text {
          font-size: 14px;
          color: #727272;
          text-align: left;
        }
        .num:hover {
          text-decoration: underline;
        }
        margin-right: 14px;
      }
      .last {
        margin-right: 0;
      }
      .content:hover {
        // background: #f8f8f8;
      }
    }
  }
  .goods-section {
    display: flex;
    margin-top: 16px;
    .goods-over {
      flex: 1;
      background: #ffffff;
      box-shadow: 0px 2px 4px 0px rgba(214, 214, 214, 0.5);
      border-radius: 4px;
      padding: 20px;
      .goods-box {
        img {
          width: 44px;
        }
        overflow: hidden;
        .item {
          width: 18%;
          float: left;
          margin-right: 16px;
          margin-bottom: 12px;
          padding: 5px 20px 16px 20px;
          cursor: pointer;
          .num {
            font-size: 24px;
            color: #262424;
            text-align: left;
            display: inline;
          }
          .num:hover {
            text-decoration: underline;
          }
          .status {
            font-size: 12px;
            color: #727272;
            text-align: left;
          }
        }
        .item:hover {
          // background: #f8f8f8;
          .num {
            // color: #f5222d;
          }
        }
      }
    }
    .title-g {
      font-size: 20px;
      line-height: 28px;
      color: #262424;
      font-weight: bold;
      margin-bottom: 12px;
    }
  }
  .total-item {
    border-radius: 4px;
    margin-top: 16px;
    padding: 0px;
    display: flex;
    background: #fff;
    .title-g {
      font-size: 20px;
      line-height: 28px;
      color: #262424;
      font-weight: 500;
      margin-bottom: 12px;
    }
    .total-section {
      overflow: hidden;
      width: 200px;
      float: left;
      margin-top: 65px;
      .left {
        width: 200px;
        float: left;
        .month {
          margin-bottom: 48px;
          .text {
            font-size: 14px;
            color: #727272;
          }
          .total-box {
            overflow: hidden;
            .num {
              float: left;
              font-size: 30px;
              color: #262424;
              line-height: 38px;
            }
            .text-a {
              font-size: 14px;
              float: right;
              color: rgba(0, 0, 0, 0.65);
              line-height: 38px;
            }
            span {
              width: 10px;
              height: 10px;
              float: right;
              background-size: cover;
              background: url('../assets/images/up.png');
              line-height: 38px;
              margin: 14px 8px;
            }
            .rate {
              float: right;
              font-size: 14px;
              color: #35e323;
              line-height: 38px;
              min-width: 50px;
            }
            .down {
              background: url('../assets/images/dwon.png');
            }
          }
        }
      }
      .right {
        float: right;
        // width: calc(100% - 256px);
        // width: 100%;
        .pick-date {
          overflow: hidden;
          padding-top: 10px;
          .date-type {
            float: right;
            overflow: hidden;
            span {
              float: left;
              margin-right: 24px;
              cursor: pointer;
              line-height: 46px;
            }
            .active {
              color: #ff720d;
            }
          }
          .date-box {
            float: right;
            width: 500px;
          }
        }
      }
    }
  }
}
.me-shope-chat {
  margin-top: 16px;
  cursor: pointer;
}
.me-liaoliaochat-con {
  text-align: center;
  font-size: 16px;
  h2 {
    width: 83%;
    margin: 32px auto 10px;
    font-size: 24px;
    font-weight: bold;
    color: #303133;
  }
  p {
    width: 85%;
    margin: 13px auto 23px;
    font-size: 16px;
    color: #606166;
  }
  .me-leliao-btn {
    margin-bottom: 30px;
    padding: 0 30px;
  }
}
.me-dot {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 215px;
  display: block;
}
.leftdiv {
  flex: 1;
  margin-right: 20px;
  padding: 20px;
  h3 {
    font-size: 20px;
    height: 40px;
    line-height: 40px;
    cursor: pointer;
    span {
      margin-right: 10px;
    }
    .cur {
      font-weight: bold;
      border-bottom-style: solid;
      border-color: $primaryColor;
      display: inline-block;
    }
  }
}
.shop-ranking {
  width: 280px;
  border-radius: 2px;
  padding: 20px;
  height: 437px;
  .ranking-content {
    overflow: hidden;
    padding-top: 4px;
    .ranking {
      width: 20px;
      height: 20px;
      color: #727272;
      font-size: 12px;
      text-align: center;
      line-height: 20px;
      float: left;
      border-radius: 50%;
      margin-bottom: 12px;
    }
    .red {
      color: #fe2d46;
    }
    .yellow {
      color: #ff6600;
    }
    .orange {
      color: #faa90e;
    }
    .shop {
      float: left;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      margin-left: 12px;
      cursor: pointer;
    }
    .sale {
      float: right;
      size: 14px;
      color: rgba(0, 0, 0, 0.65);
    }
  }
}
.chart-content {
  width: calc(100% - 200px);
  float: right;
}
.datashow {
  display: flex;
}
.me-activity {
  margin: 0 auto;
  width: 215px;
  display: block;
  border-radius: 5px;
  cursor: pointer;
  overflow: hidden;
}
</style>
<style lang="scss">
.me-leliao-pop {
  .ant-modal-close-x {
    color: #fff;
  }
}
// .vipcontent {
//   .ant-modal-close {
//      left: 0 !important;
//   }
// }
</style>
