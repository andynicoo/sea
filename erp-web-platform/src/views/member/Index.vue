<template>
  <div class="me-pa-2">
    <Carouse adKey="setmeal_buy_banner" />
    <!-- <a-page-header class="me-page-header" title="订购套餐"> </a-page-header> -->
    <div class="me-page-header ant-page-header ant-page-header-ghost">
      <div class="ant-page-header-heading">
        <span class="ant-page-header-heading-title">订购套餐</span>
        <a-button type="link" @click="ruleVisible = true">
          <a-icon type="question-circle" />活动规则
        </a-button>
      </div>
    </div>
    <a-layout class="me-page-layout me-dinggoubox" v-show="isSuccess">
      <a-form-model
        :model="form"
        :label-col="{ span: 2 }"
        :wrapper-col="{ span: 10 }"
        labelAlign="left"
      >
        <a-form-model-item label="选择套餐">
          <a-space>
            <div
              class="memberlist"
              v-for="(item, index) in memberLevelList"
              :key="item.id"
              :class="{
                curmember: item.id === choseMemberLevel.id,
                curmember3: index === 3 && item.id === choseMemberLevel.id
              }"
              @click="choseMember(item)"
            >
              <div
                class="meminfo"
                :class="{
                  memlevel0: index === 0,
                  memlevel1: index === 1,
                  memlevel2: index === 2,
                  memlevel3: index === 3
                }"
              >
                <!-- 折扣图标 -->
                <div
                  v-if="item.activityType === 2"
                  class="huodong vip_discount"
                >
                  {{ (item.discount * 10).toFixed(1) }}折
                </div>
                <div v-if="item.activityType === 1" class="huodong vip_give">
                  买{{ item.purchaseQuantity }}送{{ item.giveQuantity }}
                  <span v-if="item.giveUnit === 1">月</span>
                  <span v-else>年</span>
                </div>
                <p
                  class="me-vip-amount"
                  :class="{ disabled: item.activityType === 3 }"
                >
                  <span class="yuan">
                    ￥<span class="vipnum">{{ item.amount }} </span>/
                    <span v-if="item.unit === 'YEAR'">年</span>
                    <span v-else-if="item.unit === 'HALFYEAR'">半年</span>
                    <span v-else-if="item.unit === 'SEASON'">季</span>
                    <span v-else>月</span>
                  </span>
                  <span v-if="item.activityType === 3" class="me-ml-1 maintxt">
                    <span class="vipnum">{{ item.specialPrice }} </span>/
                    <span v-if="item.unit === 'YEAR'">年</span>
                    <span v-else-if="item.unit === 'HALFYEAR'">半年</span>
                    <span v-else-if="item.unit === 'SEASON'">季</span>
                    <span v-else>月</span>
                  </span>
                </p>
              </div>
              <div class="vipcontent">
                <div v-if="index === 0">
                  <p v-for="(item, index) in vipContent" :key="index">
                    {{ item }}
                  </p>
                </div>
                <div v-if="index === 1">
                  <p v-for="(item, index) in vipContent1" :key="index">
                    {{ item }}
                  </p>
                </div>
                <div v-if="index === 2">
                  <p v-for="(item, index) in vipContent2" :key="index">
                    {{ item }}
                  </p>
                </div>
                <div v-if="index === 3">
                  <p v-for="(item, index) in vipContent3" :key="index">
                    {{ item }}
                  </p>
                </div>
              </div>
              <div
                :class="{
                  check: item.id === choseMemberLevel.id
                }"
              />
            </div>
          </a-space>
        </a-form-model-item>

        <a-form-model-item label="订购时间">
          <a-input-number
            id="inputNumber"
            v-model="form.cycle"
            :min="1"
            :max="choseMemberLevel.unit === 'YEAR' ? 1 : 3"
            @change="onChange"
            :disabled="choseMemberLevel.unit === 'YEAR'"
            class="me-mr-2"
          />
          <span v-if="choseMemberLevel.unit === 'YEAR'">年</span>
          <span v-else-if="choseMemberLevel.unit === 'HALFYEAR'">半年</span>
          <span v-else-if="choseMemberLevel.unit === 'SEASON'">季</span>
          <span v-else>月</span>
        </a-form-model-item>

        <a-form-model-item label="优惠券">
          <a-select
            allowClear
            v-model="form.memberCouponUnusedId"
            :placeholder="`您有${couponLength}张优惠券可用`"
          >
            <a-select-option
              v-for="item in coupons"
              :key="item.memberCouponUnusedId"
              :disabled="item.status === 0"
            >
              <template v-if="item.couponType === 1">
                {{ getMemberInfo(item.fieid1) }}免费{{ item.fieid2 }}天
              </template>
              <template v-if="item.couponType === 2">
                旺币 {{ item.fieid1 }}
              </template>
              <template v-if="item.couponType === 3">
                满
                <template v-if="item.fieid1 == 0"> 任意金额 </template>
                <template v-else>{{ item.fieid1 }}</template>
                减 {{ item.fieid2 }}
              </template>
              <template v-if="item.couponType === 4">
                满
                <template v-if="item.fieid1 == 0"> 任意金额 </template>
                <template v-else>{{ item.fieid1 }}</template>
                打 {{ Number(item.fieid2) * 10 }}折扣
              </template>
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <!-- <a-form-model-item label="优惠券">
          <a-radio-group v-model="form.resource">
            <a-radio value="1">
              不使用
            </a-radio>
            <a-radio value="2" disabled>
              使用
            </a-radio>
          </a-radio-group>
        </a-form-model-item> -->
        <a-form-model-item label="支付旺币">
          <template v-if="amountErrText">
            {{ amountErrText }}
          </template>
          <template v-else>
            {{ nextPayable }}
            <template v-if="form.memberCouponUnusedId">
              <span class="me-ml-1 me-old-price">
                {{ choseMemberLevel.amount }}
              </span>
              <template
                v-if="
                  choseMemberLevel.activityType === 1 ||
                    choseMemberLevel.activityType === 2 ||
                    choseMemberLevel.activityType === 3
                "
              >
                <span class="me-ml-2" style="color: #ff720d; font-size: 12px">
                  <a-icon type="exclamation-circle" />
                  优惠券与活动优惠不同时生效
                </span>
              </template>
            </template>
          </template>
        </a-form-model-item>
      </a-form-model>
      <a-space>
        <!-- :disabled="this.wangbi < this.payable" -->
        <a-button
          type="primary"
          size="large"
          class="me-submit"
          @click="submit"
          :loading="submiting"
          :disabled="this.wangbi < this.nextPayable"
        >
          立即订购
        </a-button>
        当前旺币余额 {{ wangbi }}旺币

        <!-- {{ curLevel }}--{{ choseMemberLevel }} -->
        <a-button type="link" @click="openRecharge"> 充值 </a-button>
      </a-space>
    </a-layout>
    <a-layout class="me-page-layout" v-show="isSuccess">
      <div class="tablediv">
        <div class="row">
          <h3>套餐介绍</h3>
          <p v-for="item in cloumn" :key="item">
            <span :title="item">{{ item }}</span>
          </p>
        </div>
        <div class="row" v-for="(item, index) in rebuildData" :key="item.name">
          <h3>
            {{ tableTitle.length ? tableTitle[index].name : 'ss' }}
            <span v-if="tableTitle.length && tableTitle[index].unit">
              /
              <span v-if="tableTitle[index].unit === 'YEAR'">年</span>
              <span v-else-if="tableTitle[index].unit === 'HALFYEAR'">
                半年
              </span>
              <span v-else-if="tableTitle[index].unit === 'SEASON'">季</span>
              <span v-else>月</span>
            </span>
            <a-tag
              color="orange"
              v-if="tableTitle.length && tableTitle[index] === curLevelName"
            >
              当前权益--
            </a-tag>
          </h3>
          <p v-for="it in item" :key="it.name">
            <!-- limitCount==0，是不限制 -->
            <span v-show="it.limitCount !== 0">{{ it.limitCount }}</span>
            <span v-show="it.limitCount !== 0">{{ it.unit }} </span>
            <span v-show="it.limitCount === 0">
              {{ it.name === '聊聊工具' ? '独立付费' : '不限制' }}
            </span>
            <span v-show="it.dayUnit">/{{ it.dayUnit }}</span>
          </p>
        </div>
      </div>
      <div class="tabletips">更多功能极速开发中，敬请期待…</div>
    </a-layout>
    <a-layout class="me-page-layout" v-if="!isSuccess">
      <div class="succcessdiv">
        <a-icon type="check-circle" class="iconcheck" />
        <div class="content">
          <h3 v-if="updataInfo.type === 1">订购成功！</h3>
          <h3 v-if="updataInfo.type === 2">续费成功！</h3>
          <h3 v-if="updataInfo.type === 3">恭喜您！ 升级成功！</h3>
          <!-- {{ updataInfo }} -->
          <p>
            订购套餐：<span> {{ updataInfo.name }} </span>
          </p>
          <p>
            订购数量：<span>{{ updataInfo.buyNumber }}</span>
          </p>
          <p>
            订购周期：<span>
              {{ updataInfo.startTime }} ~ {{ updataInfo.endTime }}
            </span>
          </p>
          <!-- 升级 -->
          <p v-if="updataInfo.type === 3">
            支付差价：{{ updataInfo.amount }}旺币
            <span class="me-status-skip">
              ({{ updataInfo.setMealAmount }}-{{ updataInfo.upgradeDeduction }})
            </span>
          </p>
          <p v-else>
            支付费用：<span>{{ updataInfo.amount }} 旺币</span>
          </p>
          <p>
            订单编号：<span>{{ updataInfo.orderNo }}</span>
          </p>
          <div>
            <a-button
              type="link"
              style="padding-left: 0px"
              @click="$router.push('/member/List')"
            >
              查看我的订购
            </a-button>
            <a-button type="link" @click="initPage"> 返回 </a-button>
          </div>
        </div>
      </div>
    </a-layout>
    <div class="me-page-layout me-mt-1 wxkefu" v-if="!isSuccess">
      <div class="ewm">
        <img src="../../assets/images/wxkefu.jpg" width="120px" />
      </div>
      <div class="content">
        <h3>使用过程如遇到任何问题欢迎咨询客服</h3>
        <p>微信扫码添加</p>
      </div>
    </div>
    <a-layout class="me-page-tips" v-show="!isSuccess">
      <div class="tips" v-if="updataInfo.type === 3">
        <h4>升级权益</h4>
      </div>
    </a-layout>
    <a-layout class="me-page-layout" v-if="!isSuccess && updataInfo.type === 3">
      <!-- 套餐升级的时候，显示套餐的改变,curLevelName升级前名称，choseMemberLevel.name升级到的套餐 -->
      <div>
        <Tables
          :curLevelName="curLevelName"
          :nextLevelName="choseMemberLevel.name"
        />
      </div>
    </a-layout>
    <!-- 充值弹窗 -->
    <Recharge
      :showModal="showRechargeModal"
      :playList="playList"
      :account="wangbi"
      :activeIndex="activeIndex"
      @close="showRechargeModal = false"
      @ok="completeRecharge()"
      @clickLi="clickLi"
    />

    <a-modal
      title=""
      :visible="ruleVisible"
      @cancel="ruleVisible = false"
      :destroyOnClose="true"
      :footer="false"
      :width="1200"
      :bodyStyle="{ padding: 0 }"
      :centered="true"
      dialogClass=""
    >
      <DescTableVue :memberLevelList="memberLevelList" />
    </a-modal>
  </div>
</template>

<script>
import { cloneDeep, debounce } from 'lodash'
import member from '@/api/member'
import Tables from './Table'
import { mapState } from 'vuex'
import Play from '@/api/play'
import Recharge from '../pay/components/Recharge'
import Carouse from '@/components/Carouse'
import DescTableVue from './DescTable.vue'
import Member from '@/api/member'

export default {
  components: { Tables, Recharge, Carouse, DescTableVue },
  data() {
    return {
      form: {
        cycle: 1,
        resource: '1',
        memberCouponUnusedId: undefined
      },
      wangbi: 0,
      originInfo: [], // 原始数据
      rebuildData: [],
      cloumn: [], // 套餐介绍列
      tableTitle: [],
      curLevelName: '', // 当前等级名
      curLevel: '', // 当前等级
      memberLevelList: [],
      choseMemberLevel: {},
      payable: 0, //应付金额
      nextPayable: null,
      amountErrText: null,
      isSuccess: true,
      submiting: false,
      updataInfo: {
        afterUpgrade: { name: '' },
        buyNumber: '',
        startTime: '',
        endTime: '',
        amount: '',
        orderNo: ''
      },
      showRechargeModal: false,
      account: '',
      playList: [],
      activeIndex: 0,
      count: '',
      ruleVisible: false,
      vipContent: [
        '适用于：个人/团队/企业网店',
        '推荐店铺数量：1-5个店',
        '推荐日均采集数量：1000个',
        '推荐日均修图数量：1000次',
        '推荐日均图片翻译量：1000张',
        '支持采集平台：17家主流电商平台',
        '客服服务：1v1客服接待',
        '买赠服务：线上运营礼包+定期福利活动/礼品+线上培训指导'
      ],
      vipContent1: [
        '适用于：个人/团队/企业网店',
        '推荐店铺数量：5-10个店',
        '推荐日均采集数量：1000个',
        '推荐日均修图数量：1000次',
        '推荐日均图片翻译量：1000张',
        '支持采集平台：17家主流电商平台',
        '客服服务：1v1客服接待',
        '买赠服务：线上运营礼包+定期福利活动/礼品+线上培训指导'
      ],
      vipContent2: [
        '适用于：个人/团队/企业/单位/培训机构',
        '推荐店铺数量：50-150个店',
        '推荐日均采集数量：2000个',
        '推荐日均修图数量：2000次',
        '推荐日均图片翻译量：2000张',
        '支持采集平台：17家主流电商平台',
        '客服服务：1v1客服接待',
        '买赠服务：线上运营礼包+shopee实战教科书+shopee运营地图+线上培训指导'
      ],
      vipContent3: [
        '适用于：个人/团队/企业/单位/培训机构',
        '推荐店铺数量：100-300个店',
        '推荐日均采集数量：2000个',
        '推荐日均修图数量：2000次',
        '推荐日均图片翻译量：2000张',
        '支持采集平台：17家主流电商平台',
        '客服服务：1v1客服接待',
        '买赠服务：线上运营礼包+shopee实战教科书+shopee运营地图+线上培训指导'
      ],
      coupons: []
    }
  },
  computed: {
    ...mapState({
      memberInfo: (state) => state.auth.memberInfo
    }),
    couponLength() {
      return this.$data.coupons.filter(({ status }) => status === 1).length
    }
  },
  // watch
  watch: {
    choseMemberLevel: {
      handler(val) {
        this.debounceHandlerGetAmount()
        console.log(val)
        if (val.unit === 'YEAR') {
          this.form.cycle = 1
        }
        this.$data.payable = this.clacPayable()
      },
      deep: true
    },
    'form.memberCouponUnusedId': {
      handler() {
        this.debounceHandlerGetAmount()
      }
    },
    'form.cycle': {
      handler(val) {
        this.debounceHandlerGetAmount()
        if (typeof val !== 'number') {
          this.form.cycle = 1
          this.onChange()
        }
      }
    }
  },
  mounted() {
    this.getAllMemberInfo()
    this.getUserInfo()
    // 充值配置项
    this.getPlayList()
    this.debounceHandlerGetAmount = debounce(this.getAmount, 500)
  },
  methods: {
    getAmount() {
      const { memberCouponUnusedId, cycle } = this.$data.form
      const id = this.$data.choseMemberLevel.id
      this.amountErrText = null
      Member.memberSetMealInfoGetSetMealAmount({
        id,
        memberCouponUnusedId,
        cycle
      })
        .then((res) => {
          const nextPayable = Number(Number(res.data.currentAmount).toFixed(2))
          this.$data.nextPayable = nextPayable
        })
        .catch((errr) => {
          this.amountErrText = errr.response.data.message
        })
    },
    getMemberInfo(value) {
      const [member] = this.memberLevelList.find(({ id }) => id === value)
      if (member) return member.name
    },
    initPage() {
      this.$router.push('/member/Index')
      this.isSuccess = !this.isSuccess
      this.getUserInfo()
    },
    // 获取当前用户信息
    async getUserInfo() {
      member.getWangbi({}).then((res) => {
        // 当前旺币 当前等级
        this.$data.wangbi = res.data.currentAmount
        this.$data.curLevelName = res.data.currentConfig.name
        this.$data.curLevel = res.data.currentConfig.level
      })

      // await this.getCurCost()
      member
        .getMemeberLevelInfo({})
        .then((res) => {
          this.$store.commit('SET_MEMBER_INFO', res.data)
          console.log(res.data.level)
        })
        .finally(() => {
          member.getMemberList({}).then((res) => {
            // 获取套餐信息
            this.$data.memberLevelList = res.data
            // this.$data.choseMemberLevel = res.data[0]
            console.log(this.memberInfo.level)
            if (this.memberInfo.level === 0) {
              this.$data.choseMemberLevel = res.data[0]
            } else {
              this.$data.choseMemberLevel = this.$data.memberLevelList.filter(
                (item) => item.level === this.memberInfo.level
              )[0]
            }
            this.getCoupon()
          })
        })
    },
    // 获取当前已付套餐费用，升级套餐的时候，支付旺币=选中升级套餐价格-已付套餐价格
    getCurCost() {
      member.getMemeberLevelInfo({}).then((res) => {
        this.$store.commit('SET_MEMBER_INFO', res.data)
        console.log(res.data.level)
      })
    },
    onChange() {
      this.$data.payable = this.clacPayable()
      this.$data.form.memberCouponUnusedId = undefined
      this.$nextTick(() => {
        this.getCoupon()
      })
    },
    // 选择套餐、选择购买周期的时候，计算应付旺币
    clacPayable() {
      // 应付
      var payable = 0
      // 应付原价
      var totalPrice = this.choseMemberLevel.amount * this.form.cycle
      // 是否是升级
      var isUpgrade =
        this.memberInfo.level !== 0 &&
        this.memberInfo.level < this.choseMemberLevel.level
      // 升级的情况,升级套餐折扣价(或一口价，不包括买几送几) - 已购买套餐支付金额 activityJoinStatus是否参加过预售

      //已参加活动 全原价
      if (this.choseMemberLevel.activityJoinStatus) {
        if (this.choseMemberLevel.activityType === 1) {
          console.log('t 买几送几')
          payable = totalPrice
        } else if (this.choseMemberLevel.activityType === 2) {
          //折扣
          console.log('t 折扣')
          payable = isUpgrade
            ? totalPrice - this.memberInfo.payAmount
            : totalPrice
        } else if (this.choseMemberLevel.activityType === 3) {
          console.log('t 一口价')
          payable = isUpgrade
            ? totalPrice - this.memberInfo.payAmount
            : totalPrice
        } else {
          console.log('t 普通')
          payable = totalPrice
        }
      } else {
        //未参加活动，使用一次折 买purchaseQuantity送giveQuantity
        if (this.choseMemberLevel.activityType === 1) {
          console.log('f 买几送几')
          payable = totalPrice - this.memberInfo.payAmount
        } else if (this.choseMemberLevel.activityType === 2) {
          console.log('f 折扣')
          payable = isUpgrade
            ? this.choseMemberLevel.amount * this.choseMemberLevel.discount +
              this.choseMemberLevel.amount * (this.form.cycle - 1) -
              this.memberInfo.payAmount
            : this.choseMemberLevel.amount * this.choseMemberLevel.discount +
              this.choseMemberLevel.amount * (this.form.cycle - 1)
        } else if (this.choseMemberLevel.activityType === 3) {
          console.log('f 一口价')
          payable = isUpgrade
            ? this.choseMemberLevel.specialPrice +
              this.choseMemberLevel.amount * (this.form.cycle - 1) -
              this.memberInfo.payAmount
            : this.choseMemberLevel.specialPrice +
              this.choseMemberLevel.amount * (this.form.cycle - 1)
        } else {
          console.log('f 普通')
          payable = totalPrice
        }
      }

      return payable.toFixed(2)
    },
    getAllMemberInfo() {
      member
        .getMemberListinfo({})
        .then((res) => {
          this.$data.originInfo = res.data
        })
        .finally(() => {
          this.rebuildDataFun()
        })
    },
    rebuildDataFun() {
      let data = cloneDeep(this.$data.originInfo)
      if (data.length) {
        let temp = data[0].configInfoList
        let pushTemp = []
        temp.map((item) => {
          pushTemp.push(item.name)
        })
        this.$data.cloumn = pushTemp
        this.rebuildData = []
        data.map((item) => {
          this.$data.rebuildData.push(item.configInfoList)
          this.$data.tableTitle.push({ name: item.name, unit: item.unit })
        })
      } else {
        this.$data.cloumn = []
      }
    },
    /**获取优惠券 */
    getCoupon() {
      const { cycle } = this.form
      const { id } = this.choseMemberLevel
      Member.memberCouponUsable({ id, cycle }).then((res) => {
        this.$data.coupons = res.data.sort((a, b) => b.status - a.status)
      })
    },
    choseMember(item) {
      console.log(item)
      let finallyPrice =
        item.amount * this.form.cycle - this.memberInfo.payAmount
      console.log(finallyPrice)
      if (this.memberInfo.level > item.level) {
        this.$message.error('当前选择套餐，不可订购！套餐不可降级购买!')
      } else if (finallyPrice < 0 && this.memberInfo.level !== item.level) {
        this.$warning({
          title: '提示',
          content:
            '升级当前套餐无法抵扣上期套餐实际支付金额，如需继续升级请联系客服处理'
        })
      } else {
        this.$data.choseMemberLevel = item
        this.$data.form.memberCouponUnusedId = undefined
        this.getCoupon()
      }
    },
    // 订购
    submit() {
      // if (this.curLevel > this.choseMemberLevel.level) {
      //   this.$message.info('请选择更高的套餐')
      //   return
      // }
      const params = {
        ...this.choseMemberLevel,
        cycle: this.form.cycle,
        amount: this.payable,
        memberCouponUnusedId: this.form.memberCouponUnusedId
      }
      this.submiting = true
      member
        .buyMemberNow(params)
        .then((res) => {
          if (Number(res.code) === 0) {
            console.log(res.data)
            this.updataInfo = res.data
            this.isSuccess = !this.isSuccess
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.submiting = false
        })
    },
    //打开充值弹窗
    openRecharge() {
      this.showRechargeModal = true
    },
    // 获取支付配置
    getPlayList() {
      let params = {}
      Play.getPlayList(params).then((res) => {
        if (res.code == 0) {
          this.playList = res.data
          this.count =
            this.playList[0].payAmount +
            '元 (' +
            this.playList[0].rechargeAmount +
            '旺币)'
        }
      })
    },
    //完成充值
    completeRecharge() {
      this.showRechargeModal = false

      this.getAllMemberInfo()
      this.getUserInfo()
      // 充值配置项
      // this.getPlayList()
    },
    //切换充值金额
    clickLi(index) {
      this.clickIndex(this.playList[index], index)
    },
    clickIndex(item, index) {
      if (this.activeIndex == index) return false
      this.activeIndex = index
      this.count = item.payAmount + '元 (' + item.rechargeAmount + '旺币)'
    }
  }
}
</script>

<style lang="scss" scoped>
@import './tablediv';
.tabletips {
  width: 90%;
  text-align: center;
  height: 36px;
  line-height: 36px;
}
.me-custorm-date-picker {
  &.ant-calendar-picker {
    min-width: auto !important;
  }
}
.dynamic-title-dialog {
  color: #40a9ff;
  margin: 0 10px;
}
.me-submit {
  width: 370px;
  height: 60px;
  background: #ed4741;
  border-radius: 4px;
  color: #fff;
  border: none;
}
.tips {
  padding: 15px 0px 15px 0px;
  line-height: 30px;
  h4 {
    font-size: 25px;
  }
  h3 {
    font-size: 22px;
    padding-bottom: 15px;
    text-align: center;
  }
  .gold {
    color: #f59a23;
  }
  .tiptable {
    td,
    th {
      padding: 5px 10px;
      border: 1px solid #ddd;
      vertical-align: middle;
    }
  }
}
.me-page-tips {
  background-color: #f5f5f5;
  border-radius: 0 0 2px 2px;
  padding: 16px;
  h2 {
    font-size: 16px;
  }
  p {
    line-height: 30px;
  }
}
.memberlist {
  position: relative;
  cursor: pointer;
  font-weight: bold;
  margin-right: 10px;
  border: 1px solid #ece8e4;
  width: 258px;
  height: 375px;
  border-radius: 7px;
  line-height: 100%;
  .me-vip-name {
    position: relative;
    z-index: 2;
    color: #222;
    font-size: 20px;
    margin: 15px 0 8px;
    font-weight: bold;
  }
  .me-vip-amount {
    position: relative;
    z-index: 2;
  }
  .disabled {
    .yuan {
      text-decoration: line-through;
    }
  }
  .maintxt {
    font-size: 14px;
    font-weight: bold;
  }
  .huodong {
    position: absolute;
    z-index: 9;
    top: -6px;
    right: -1px;
    min-width: 34px;
    height: 30px;
    line-height: 30px;
    background: #f55733;
    border-radius: 3px;
    color: #fff;
    font-size: 16px;
    padding: 0 8px;
  }
  .meminfo {
    width: 256px;
    height: 104px;
    padding-top: 61px;
    font-size: 16px;
    color: #994a12;
    padding-left: 17px;
  }
  .memlevel0 {
    background: url('../../assets/images/bg-VIP0.png') no-repeat;
  }
  .memlevel1 {
    background: url('../../assets/images/bg-VIP1.png') no-repeat;
  }
  .memlevel2 {
    background: url('../../assets/images/bg-VIP2.png') no-repeat;
  }
  .memlevel3 {
    background: url('../../assets/images/bg-VIP3.png') no-repeat;
    color: #f8dfa5;
    .huodong {
      background: #f8dfa7 !important;
      color: #994a12;
    }
  }
  .check {
    background: url('../../assets/images/check.png') no-repeat;
    width: 32px;
    height: 32px;
    position: absolute;
    bottom: 0px;
    right: 0px;
  }

  .vipnum {
    font-size: 28px;
  }
}
.curmember3 {
  border: 1px solid #362311 !important;
  .check {
    background: url('../../assets/images/check3.png') no-repeat !important;
  }
}
.curmember {
  position: relative;
  // border-color: #fff;
  border: 1px solid #f9c7c6;
  // &::after {
  //   content: '';
  //   position: absolute;
  //   display: block;
  //   top: -5px;
  //   left: -11px;
  //   width: 200px;
  //   height: 70px;
  //   background-size: cover;
  // }
  .me-vip-name {
    color: #ffef93;
    text-indent: 26px;
    letter-spacing: -1px;
  }
}
.vipcontent {
  padding: 20px 20px 20px 20px;
  width: 256px;
  height: 192px;
  p {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #606166;
    line-height: 24px;
  }
}
.succcessdiv {
  display: flex;
  margin-left: 50px;
  .content {
    margin-left: 20px;
    h3 {
      font-size: 26px;
    }
    p {
      line-height: 35px;
    }
    span {
      color: $primaryColor;
    }
  }
}
.iconcheck {
  font-size: 36px;
  color: #52c41a;
}
.me-dinggoubox {
  margin-bottom: 5px;
}
.wxkefu {
  // width: 100%;
  height: 150px;
  .ewm {
    float: left;
    width: 120px;
    margin-left: 70px;
  }
  .content {
    padding: 20px 10px;
    float: left;
    h3 {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 15px;
    }
  }
}

.me-old-price {
  font-size: 12px;
  color: #a8a8b3;
  text-decoration: line-through;
}
</style>
