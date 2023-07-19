<template>
  <div class="list-section" v-show="orderList.length">
    <div class="list" v-for="(item, index) in orderList" :key="item.ordersn">
      <div class="list-title-box">
        <div class="order-status">
          <span
            :class="{
              errorStatus: item.packageInfo.packageStatus == 5,
              'label-red': item.packageInfo.packageStatus == 10
            }"
          >
            {{ item.packageInfo.packageStatusDisplay }}
          </span>

          <a-popover
            placement="top"
            v-if="item.packageInfo.packageStatus == 10"
          >
            <template slot="content">
              <span
                v-for="(li, index) of item.packageInfo.forwarderNoteTypeList ||
                  []"
                :key="index"
              >
                {{ O_ErrorRemarkType[li] || '-' }}、
              </span>
            </template>
            <font style="margin-left: 10px; color: red; cursor: pointer">
              查看原因？
            </font>
          </a-popover>

          <span
            v-if="item.memberInfo && item.memberInfo.subChannelName"
            class="label-channel"
            :style="{
              marginLeft: '10px',
              color: item.memberInfo.subChannelColor,
              border: '1px solid ' + item.memberInfo.subChannelColor
            }"
          >
            {{ item.memberInfo.subChannelName }}
          </span>

          <span
            v-if="item.packageInfo && item.packageInfo.reminders === 1"
            class="errorStatus"
            style="margin-left:10px"
          >
            {{ $t('packages.reminders') }}
          </span>
        </div>
        <div class="order-number">{{ item.orderInfo.ordersn }}</div>
        <div class="store-type" v-if="item.storeInfo">
          <template v-if="item.storeInfo.countryCode === 'TH'">{{
            $t('packages.TH')
          }}</template>
          <template v-if="item.storeInfo.countryCode === 'MY'">{{
            $t('packages.MY')
          }}</template>
          <template v-if="item.storeInfo.countryCode === 'TW'">{{
            $t('packages.TW')
          }}</template>
          <template v-if="item.storeInfo.countryCode === 'PH'">{{
            $t('packages.PH')
          }}</template>
          <template v-if="item.storeInfo.countryCode === 'ID'">{{
            $t('packages.ID')
          }}</template>
          <template v-if="item.storeInfo.countryCode === 'VN'">{{
            $t('packages.VN')
          }}</template>
          <template v-if="item.storeInfo.countryCode === 'SG'">{{
            $t('packages.SG')
          }}</template>
          <template v-if="item.storeInfo.countryCode === 'BR'">{{
            $t('packages.BR')
          }}</template>
          <span>{{ filterStoreType(item.storeInfo.storeType) }}</span>
        </div>
        <!-- 订单状态 -->
        <div v-if="item.orderInfo.orderStatus" style="padding:0 10px">
          {{ $t('packages.xiapiStatusName') }}:
          <span>{{ orderType[item.orderInfo.orderStatus] }}</span>
        </div>
        <!-- 包裹单号 -->

        <!-- 创建时间 -->
        <div class="shelve-status">
          {{ $t('packages.creatTime') }}: {{ item.orderInfo.orderCreateTime }}
        </div>

        <div class="right-opt">
          <!-- 订单金额，支付 -->
          <div class="total-fee" v-if="item.fee.totalFee > 0">
            <span :title="fileFeeStr(item.fee.details || [])">
              {{ $t('packages.totalFee') }}：{{ item.fee.totalFee
              }}{{ $t('packages.rmb') }}
            </span>
            <template v-if="item.feeApply">
              <span
                v-show="(item.feeApply ? item.feeApply.applyStatus : 4) == 1"
                style="color:#555555"
              >
                {{ $t('packages.sucPlay') }}
              </span>
              <span
                v-show="(item.feeApply ? item.feeApply.applyStatus : 4) == 2"
                style="color:#D9001B"
              >
                {{ $t('packages.jujuefujia') }}
              </span>
              <div class="add-red" @click="addCost(index)">
                <a-icon
                  type="exclamation-circle"
                  v-show="(item.feeApply ? item.feeApply.applyStatus : 4) == 0"
                />
                <span
                  v-show="(item.feeApply ? item.feeApply.applyStatus : 4) == 0"
                  >{{ $t('packages.fujiafei') }}</span
                >
              </div>
            </template>
          </div>
          <div
            class="reminders-opt"
            v-if="
              item.packageInfo && item.packageInfo.enableShowReminders === 1
            "
          >
            <span @click="reminders(item.packageInfo.id)">
              {{ $t('packages.reminders') }}
            </span>
          </div>
        </div>
      </div>
      <div class="item-box">
        <div class="item-order-box">
          <div
            class="goods-item"
            v-for="(goodsItem, j) in item.orderInfo.items"
            :key="j"
          >
            <div class="order-left">
              <w-img :src="goodsItem.imageUrl || goodsItem.mainImage"></w-img>
            </div>
            <div class="order-right">
              <div class="order-t-box">
                <div>{{ goodsItem.itemName }}</div>
              </div>
              <div class="order-price-box">
                <div class="order-color">
                  <span class="order-c-text">SKU：</span>
                  <span class="order-conten">{{ goodsItem.variationSku }}</span>
                </div>
                <div class="order-price">
                  <span class="order-c-text">{{ $t('packages.danjia') }}</span>
                  <span class="order-conten">{{
                    goodsItem.variationOriginalPrice
                  }}</span>
                </div>
                <div class="order-price">
                  <span class="order-c-text">{{
                    $t('packages.shuliang')
                  }}</span>
                  <span class="order-conten">{{
                    goodsItem.variationQuantityPurchased
                  }}</span>
                </div>
              </div>
              <div class="order-coding-box">
                <span class="order-c-text"
                  >SKU{{ $t('packages.bianma') }}：</span
                >
                <span class="order-conten" style="word-break: break-all;">{{
                  goodsItem.itemSku
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="item-buy-m-box flex-buy-m-box">
          <div class="buyer-box">
            <div>
              <template v-if="item.orderInfo.orderAddress">
                <span class="item-content">
                  {{ item.orderInfo.orderAddress.city }},
                  {{ item.orderInfo.orderAddress.country }}
                </span>
              </template>
              <span class="message-to-seller">{{
                $t('packages.maijialiuyan')
              }}</span>
            </div>
            <div
              class="message-to-seller max-height"
              :title="item.packageInfo.messageToSeller"
            >
              {{ item.orderInfo.messageToSeller }}
            </div>
          </div>
          <div class="buyer-box">
            <div class="message-to-seller mess-flex">
              {{ $t('packages.sellerNotes') }}
              <a-icon type="edit" @click="addRemark(index)" />
            </div>
            <div class="max-height" :title="item.packageInfo.sellerNotes">
              {{ item.packageInfo.sellerNotes }}
            </div>
            <!-- <div class="item-content" @click="addRemark(index)">
              <span style="color:#409eff">{{$t('common.MjRemarks')}}</span>
            </div> -->
          </div>
        </div>

        <div class="item-logistics-p-box">
          <div class="item-p">
            <span class="item-content"
              >{{ $t('packages.logisticsTitle') }}:</span
            >
            <span class="item-text">{{
              item.orderInfo.shippingCarrier || '-'
            }}</span>
          </div>
          <div class="item-p breakword">
            <span class="item-content">{{ $t('packages.logisticsNum') }}:</span>
            <span
              class="item-text logistics-details"
              @click="showLogisticsMessage(item)"
              >{{ item.orderInfo.trackingNo || '-' }}</span
            >
          </div>
        </div>

        <div class="item-p-box">
          <!-- 货代商 -->
          <div class="item-p">
            <span class="item-content"
              >{{ $t('packages.forwarderName') }}:</span
            >
            <span class="item-text">{{ item.forwarder.forwarderName }}</span>
          </div>
          <!-- 创建时间 -->
          <div class="item-p">
            <span class="item-content">{{ $t('packages.createTime') }}:</span>
            <span class="item-text">{{ item.packageInfo.createTime }}</span>
          </div>
          <div class="item-p">
            <span class="p-text item-content"
              >{{ $t('packages.receiveTime') }}:</span
            >
            <span class="item-text">{{ item.packageInfo.receiveTime }}</span>
          </div>
          <div class="item-p">
            <span class="p-text item-content"
              >{{ $t('packages.deliveredTime') }}:</span
            >
            <span class="item-text">{{ item.packageInfo.deliveredTime }}</span>
          </div>
          <!-- 货代商备注 -->
          <div class="item-p">
            <span class="p-text item-content"
              >{{ $t('packages.forwarderNotes') }}:</span
            >
            <span class="item-text" style="color:red">{{
              item.packageInfo.forwarderNotes
            }}</span>
          </div>
        </div>

        <div class="item-logistics-m-box">
          <div class="logistics-n-box">
            <div>
              <span class="item-text">{{ $t('packages.GnExpressNo') }}:</span>
              <a-icon
                type="plus"
                @click="addExpress(item, index)"
                v-if="
                  item.packageInfo.packageStatus != 3 &&
                    item.packageInfo.packageStatus != 5
                "
              />
              <span
                style="float:right;margin-right: 20px;cursor: pointer;"
                @click="detailsOper(index)"
                >{{ $t('packages.caozuoxiang') }}</span
              >
            </div>
            <div class="item-content logistics-details">
              <div
                class="edit"
                v-for="(list, k) in item.packageInfo.epackageList"
                :key="k"
              >
                <div
                  class="edit-input white-no-warp"
                  v-show="
                    (isEdit && list.add != true) ||
                      (!isEdit && currentIndex != index && list.add != true) ||
                      (!isEdit &&
                        editIndex != k &&
                        currentIndex == index &&
                        list.add != true)
                  "
                >
                  <span
                    style="color:rgba(0, 0, 0, 0.87)"
                    :title="list.expressNo"
                    >{{ list.expressNo }}</span
                  >
                </div>
                <div
                  class="edit-input"
                  v-show="
                    (!isEdit &&
                      editIndex == k &&
                      currentIndex == index &&
                      list.add != true) ||
                      list.add == true
                  "
                >
                  <a-input
                    :value="list.expressNo"
                    label=""
                    autofocus
                    @blur="cancleEdit(index, k)"
                    @focus="onFoucs(list.expressNo)"
                    @keyup.enter.native="cancleEdit(index, k)"
                    v-model="editValue"
                  ></a-input>
                </div>
                <div
                  class="order-state"
                  :class="{
                    receiveRed:
                      list.epackageReceiveStatus == 2 ||
                      list.epackageReceiveStatus == 3,
                    receiveBlack: list.epackageReceiveStatus == 1
                  }"
                >
                  ({{
                    filterEpackageReceiveStatus(list.epackageReceiveStatus)
                  }})
                </div>
                <div class="list-img-wrap">
                  <div
                    class="li"
                    v-for="(li, index) of list.imgUrlList"
                    :key="index"
                  >
                    <w-img :src="li"></w-img>
                  </div>
                </div>
                <div
                  class="oper-box breakword"
                  v-if="
                    item.packageInfo.packageStatus != 3 &&
                      item.packageInfo.packageStatus != 9
                  "
                >
                  <span
                    class="item"
                    @click="isCanEdit(index, k)"
                    v-if="list.epackageReceiveStatus == 0"
                    >{{ $t('packages.edit') }}</span
                  >
                  <span
                    class="item"
                    @click="refuseRecord(item, list)"
                    v-if="list.epackageReceiveStatus == 0"
                    >{{ $t('packages.jushou') }}</span
                  >
                  <span
                    class="item"
                    @click="handleReturnGoodsClick(list)"
                    v-if="list.epackageReceiveStatus == 1"
                    >{{ $t('packages.return') }}</span
                  >
                  <span
                    class="item del"
                    @click="deleteRecord(index, k)"
                    v-if="
                      list.epackageReceiveStatus == 0 ||
                        list.epackageReceiveStatus == 1
                    "
                    >{{ $t('packages.del') }}</span
                  >
                </div>
              </div>
            </div>
          </div>
          <div v-show="!item.forwarder.thirdPartyCode">
            <span class="item-content">{{ $t('packages.jianhuojia') }}：</span>
            <span
              class="item-text logistics-details"
              v-for="(list, k) in item.packageInfo.epackageList"
              :key="k"
            >
              <template v-if="list.epackagePosition"
                >{{ list.epackagePosition }} 、</template
              >
            </span>
          </div>
          <div class="assign-logistics-box">
            <span class="item-content">{{ $t('packages.zongZhong') }}</span>
            <span class="item-text" v-if="item.packageInfo.packageAfterWeight"
              >{{ item.packageInfo.packageAfterWeight }}Kg</span
            >
          </div>
          <div class="assign-logistics-box">
            <span class="item-content">{{ $t('packages.tiJi') }}</span>
            <span
              class="item-text"
              v-if="
                item.packageInfo.packageAfterLength &&
                  item.packageInfo.packageAfterWidth &&
                  item.packageInfo.packageAfterHigh
              "
            >
              {{ item.packageInfo.packageAfterLength }}
              * {{ item.packageInfo.packageAfterWidth }} *
              {{ item.packageInfo.packageAfterHigh }}
            </span>
          </div>
        </div>
      </div>
      <div class="item-footer">
        <a-row>
          <a-col cols="12" sm="6" md="3" class="info-item">
            <div class="text">{{ $t('packages.shouhuoren') }}:</div>
            <template v-if="item.orderInfo.orderAddress">
              <div class="info-text">
                {{ item.orderInfo.orderAddress.name }}
              </div>
            </template>
          </a-col>
          <a-col cols="12" sm="6" md="9" class="info-item">
            <div class="text">{{ $t('packages.shouhuodi') }}:</div>
            <template v-if="item.orderInfo.orderAddress">
              <div class="info-text">
                {{ item.orderInfo.orderAddress.fullAddress }}
              </div>
            </template>
          </a-col>
        </a-row>
      </div>
    </div>
    <dialog-return-address
      :dialogShow.sync="visible"
      :info="returnGoodsInfo"
      v-if="visible"
      @success="handleSuccess"
    />
    <a-modal
      v-model="showLogisticsMessageVisible"
      title="物流信息"
      :footer="null"
      width="700px"
      @cancel="
        current = null
        showLogisticsMessageVisible = false
      "
    >
      <OrderLogisticsMessage
        :current="current"
        v-if="showLogisticsMessageVisible"
      />
    </a-modal>
  </div>
</template>

<script>
import Package from '@/api/package'
import DialogReturnAddress from './DialogReturnAddress.vue'
import OrderLogisticsMessage from '@/views/order/components/OrderLogisticsMessage'
export default {
  props: {
    orderList: {
      default: []
    }
  },
  components: { DialogReturnAddress, OrderLogisticsMessage },
  data() {
    return {
      currentIndex: 0,
      isEdit: true,
      editIndex: 0,
      editValue: '',
      orderType: {
        UNPAID: this.$t('packages.weifukuan'),
        READY_TO_SHIP: this.$t('packages.daichuhuo'),
        RETRY_SHIP: this.$t('packages.chongxinfa'),
        SHIPPED: this.$t('packages.xunsong'),
        TO_CONFIRM_RECEIVE: this.$t('packages.quedingzhong'),
        IN_CANCEL: this.$t('packages.quxiaozhong'),
        CANCELLED: this.$t('packages.yiquxiao'),
        TO_RETURN: this.$t('packages.tuikuan'),
        COMPLETED: this.$t('packages.yiwancheng'),
        PROCESSED: this.$t('packages.daiwuliunahuo')
      },
      visible: false,
      returnGoodsInfo: {},
      showLogisticsMessageVisible: false,
      current: null,
      O_ErrorRemarkType: {
        morePiece: '多件',
        lessPiece: '少件',
        SuperStuff: '超材',
        spoil: '损坏',
        errorStyle: '货不对款',
        otherError: '其他异常'
      }
    }
  },
  filters: {},
  methods: {
    //催单
    reminders(id) {
      this.$confirm({
        title: this.$t('common.message'),
        content: this.$t('packages.confirmReminders'),
        onOk: async () => {
          await Package.settingReminders({ id: id })
          this.$message.success(this.$t('common.handlerSuccess'))
          this.$emit('updataList')
        }
      })
    },
    fileFeeStr(arr) {
      let str = ''
      for (const li of arr) {
        str +=
          li.feeTypeDisplay +
          ':' +
          li.feeValue +
          this.$t('packages.wangbi') +
          '\n'
      }
      return str
    },
    filterStoreType(val) {
      switch (val) {
        case 0:
          return this.$t('packages.QT') // 其他
        case 1:
          return this.$t('packages.BT') // 本土
        case 2:
          return this.$t('packages.KJ') // 跨境
        default:
          return this.$t('packages.QT')
      }
    },
    filterEpackageReceiveStatus(val) {
      switch (val) {
        case 0:
          return this.$t('packages.weishou')
        case 1:
          return this.$t('packages.yishou')
        case 2:
          return this.$t('packages.tuihuozhong')
        case 3:
          return this.$t('packages.yituihuo')
        case 4:
          return this.$t('packages.jushou')
        default:
          return this.$t('packages.weishou')
      }
    },
    onFoucs(value) {
      this.editValue = value
    },
    cancleEdit(index, k) {
      this.editValue = this.editValue.replace(/(^\s*)|(\s*$)/g, '')
      var reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
      if (reg.test(this.editValue)) {
        this.errorAlert(this.$t('packages.tipLogistics'))
        return false
      }
      if (this.editValue === '') {
        this.errorAlert(this.$t('packages.pleaseInputRecNo'))
        this.isEdit = true
        this.$emit('setListData', { index, editIndex: k }, true)
        return false
      }
      this.isEdit = true
      console.log('{}')
      let data = {
        index: index,
        editIndex: k,
        value: this.editValue
      }
      this.$emit('setListData', data)
    },
    isCanEdit(index, k) {
      this.isEdit = !this.isEdit
      this.editIndex = k
      this.currentIndex = index
    },
    viewImg(img) {
      this.$emit('viewImg', img)
    },
    // 操作详情
    detailsOper(index) {
      this.$emit('detailsOper', index)
    },
    // 添加货代备注
    addRemark(index) {
      this.$emit('addRemark', index)
    },
    // 添加附加费
    addCost(index) {
      this.$emit('addCost', index)
    },
    handleSuccess() {
      this.$emit('updataList')
    },
    deleteRecord(index, k) {
      let data = {
        editIndex: index,
        expressIndex: k
      }
      this.$emit('deleteRecord', data)
    },
    //拒收
    refuseRecord(item, list) {
      let data = {
        expressNo: list.expressNo,
        packageId: item.packageInfo.id,
        epackageId: list.epackageId
      }
      this.$emit('refuseRecord', data)
    },
    // 退货
    handleReturnGoodsClick(row) {
      console.log({ row })
      this.visible = true
      const { epackageId } = row
      this.returnGoodsInfo = { epackageId }
    },
    // 打印面单
    printOrder(item) {
      let params = {
        packageId: item.packageInfo.id
      }
      Package.printOrder(params).then((res) => {
        if (res.code == 0) {
          this.successAlert(this.$t('packages.dayinchenggong'))
          this.openPage(res.data, '_blank')
        }
      })
    },
    // 快速打印
    printQuick(item) {
      let params = {
        packageId: item.packageInfo.id
      }
      Package.printQuick(params).then((res) => {
        if (res.code == 0) {
          this.quickPrint(res.data)
        }
      })
    },
    quickPrint(data) {
      let socket
      let ishttps = 'https:' == document.location.protocol ? true : false
      if (ishttps) {
        socket = new WebSocket('wss://localhost:13529')
      } else {
        socket = new WebSocket('ws://localhost:13528')
      }
      socket.onopen = function() {
        // 监听消息
        socket.send(JSON.stringify(data))
        socket.onmessage = function() {
          // console.log( 'Client received a message' ,event);
        }
        // 监听Socket的关闭
        socket.onclose = function() {
          // console.log( 'Client notified socket has closed' ,event);
        }
      }
    },
    // 申请搁置
    appelShelve(item) {
      let params = {
        packageId: item.packageInfo.id
      }
      Package.appelShelve(params).then((res) => {
        if (res.code == 0) {
          this.$emit('updataList')
        }
      })
    },
    addExpress(item, index) {
      if (
        item.packageInfo.packageStatusDisplay == this.$t('packages.package2')
      ) {
        this.errorAlert(this.$t('packages.string7'))
        return false
      }
      this.$emit('addExpress', index)
    },
    showLogisticsMessage(item) {
      this.showLogisticsMessageVisible = true
      this.current = item.orderInfo
    }
  }
}
</script>

<style lang="scss" scoped>
.list {
  .list-img-wrap {
    .li {
      width: 30px;
      height: 30px;
      .w-img-wrap {
        width: 30px !important;
        height: 30px !important;
      }
      img {
        width: 100%;
        float: left;
      }
    }
  }
  margin-top: 20px;
  border: 1px solid #ebebeb;
  background: #fff;
  .list-title-box {
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    font-size: 14px;
    display: flex;
    border-bottom: 1px solid #ebebeb;
    position: relative;
    .order-number {
      // color: #409eff;
      color: rgb(85, 85, 85);
      padding: 0 5px;
    }
    .store-type {
      padding: 0px 8px;
    }
    .order-status {
      // padding: 0 20px;
      span {
        padding: 3px 8px;
        color: #409eff;
        border: 1px solid #409eff;
        border-radius: 6px;
      }
      .errorStatus {
        color: #d9001b;
        border: 1px solid #d9001b;
      }
      .label-red {
        color: red;
        border: 1px solid red;
      }
    }
    .order-time {
      margin-left: 20px;
    }
    .shelve-status {
      margin: 0 10px;
    }
    .right-opt {
      position: absolute;
      right: 30px;
      display: flex;
      .reminders-opt {
        margin-left: 15px;
        span {
          padding: 3px 8px;
          color: #666;
          border: 1px solid #666;
          border-radius: 6px;
          cursor: pointer;
        }
      }
      .total-fee {
        .add-red {
          display: inline-block;
          margin-left: 10px;
          color: #d9001b;
          cursor: pointer;
          i {
            color: #d9001b;
          }
        }
      }
    }

    .lable-box,
    .remark-box {
      .mdi {
        cursor: pointer;
        font-size: 16px;
      }
      margin-left: 20px;
    }
    .operation {
      position: absolute;
      right: 0;
      top: 0;
      display: flex;
      .text {
        color: #409eff;
        margin-right: 30px;
        cursor: pointer;
      }
      .more {
        color: #409eff;
      }
    }
  }
  .packages-oper {
    overflow: hidden;
    background: #fff;
    border-bottom: 1px solid #ebebeb;
    .total {
      float: left;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.87);
      margin-left: 20px;
      line-height: 40px;
    }
    .total-spend {
      font-size: 14px;
      margin-left: 200px;
      color: #409eff;
      line-height: 40px;
      float: left;
      cursor: pointer;
    }
    .add-cost {
      padding-top: 9px;
      float: right;
      margin-right: 20px;
      color: #409eff;
      font-size: 14px;
      cursor: pointer;
    }
    .add-red {
      i {
        color: red;
      }
      span {
        color: red;
      }
    }
    .pack-remark {
      padding-top: 9px;
      float: right;
      margin-right: 20px;
      color: #409eff;
      font-size: 14px;
      cursor: pointer;
    }
  }
  .item-box {
    font-size: 14px;
    display: flex;
    .item-content {
      color: #909099;
    }
    .item-order-box {
      width: 30%;
      border-right: 1px solid rgb(239, 239, 239);
      padding: 12px;
      .goods-item {
        display: flex;
        margin: 8px;
        .order-left {
          flex: 0 0 80px;
          height: 80px;
          img {
            width: 100%;
            height: 100%;
            cursor: pointer;
          }
        }
        .order-right {
          padding-left: 12px;
          .order-t-box {
            .order-text {
              color: rgba(0, 0, 0, 0.38);
              padding-right: 15px;
            }
          }
          .order-price-box {
            color: #909099;
            .order-price {
              margin: 5px 0;
            }
            .order-color {
              margin: 5px 0;
            }
          }
          .order-coding-box {
            color: #909099;
          }
        }
      }
    }
    .item-p-box {
      width: 15%;
      border-right: 1px solid rgb(239, 239, 239);
      padding: 12px;
      .item-p {
        margin: 8px 0px;
        .p-content {
          color: rgba(0, 0, 0, 0.38);
        }
        .max-height {
          // max-height: 100px;
          overflow-y: auto;
          display: inline-block;
        }
        .max-height::-webkit-scrollbar,
        .max-height::-webkit-scrollbar,
        .max-height::-webkit-scrollbar {
          width: 6px;
          height: 4px;
        }
        .max-height::-webkit-scrollbar-thumb,
        .max-height::-webkit-scrollbar-thumb,
        .max-height::-webkit-scrollbar-thumb {
          border-radius: 10px;
          background: #ccc;
          position: absolute;
          right: 0;
        }
      }
      .details-ope {
        margin-top: 30px;
        font-size: 14px;
        color: #409eff;
        cursor: pointer;
      }
    }
    .flex-buy-m-box {
      display: flex;
      flex-direction: column;
    }
    .item-logistics-p-box {
      width: 15%;
      border-right: 1px solid rgb(239, 239, 239);
      padding: 12px;
      .item-p {
        margin: 8px 0px;
        .logistics-details {
          color: #409eff;
        }
      }
    }
    .item-buy-m-box {
      width: 15%;
      border-right: 1px solid rgb(239, 239, 239);
      padding: 12px;
      .buyer-box,
      .buyer-m-box {
        margin-top: 8px;
        flex: 1;
        height: 50%;
        display: flex;
        flex-direction: column;
      }
      .mess-flex {
        display: flex;
        align-items: center;
      }
      .message-to-seller {
        color: #444;
        .remake-icon {
          font-size: 17px;
          color: #409eff;
          cursor: pointer;
          margin-left: 4px;
        }
      }
      .max-height {
        // max-height: 100px;
        overflow-y: auto;
        display: inline-block;
      }
      .max-height::-webkit-scrollbar,
      .max-height::-webkit-scrollbar,
      .max-height::-webkit-scrollbar {
        width: 6px;
        height: 4px;
      }
      .max-height::-webkit-scrollbar-thumb,
      .max-height::-webkit-scrollbar-thumb,
      .max-height::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: #ccc;
        position: absolute;
        right: 0;
      }
    }
    .item-logistics-m-box {
      padding: 12px;
      width: 25%;
      border-right: 1px solid rgb(239, 239, 239);
      .logistics-details {
        color: #409eff;
        .edit {
          display: flex;
          position: relative;
          margin: 8px 0;
          .order-state {
            // padding-top: 20px;
            margin-right: 0px;
          }
          .prolem {
            color: orange;
            width: 52px;
          }
          .white-no-warp {
            max-width: 40%;
            overflow: hidden; //超出的文本隐藏
            text-overflow: ellipsis; //溢出用省略号显示
            white-space: nowrap; //溢出不换行
            color: rgba(0, 0, 0, 0.87);
            cursor: pointer;
          }
          .oper-box {
            position: absolute;
            right: 10px;
            cursor: pointer;
            .item {
              color: #444;
              padding: 0 8px;
            }
            .del {
              color: #d9001b;
            }
          }
          .receiveRed {
            color: #d9001b;
          }
          .receiveBlack {
            color: #444;
          }
        }
        button {
          // margin-top: 17px !important;
          width: 24px;
          height: 24px;
          font-size: 17px;
        }
        i {
          cursor: pointer;
          // margin-top: 17px !important;
          width: 24px;
          height: 24px;
          font-size: 17px;
        }
      }
      .logistics-n-box {
        margin-top: 8px;
      }
      .assign-logistics-box {
        margin: 8px 0;
      }
    }
  }
  .item-footer {
    border-top: 1px solid #ebebeb;
    .info-item {
      display: flex;
      padding-top: 0;
      padding-bottom: 0;
      .text {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.87);
        padding-left: 20px;
        line-height: 54px;
        padding-right: 5px;
      }
      .info-text {
        font-size: 14px;
        color: #909099;
        line-height: 54px;
      }
      .item-input {
        height: 50px;
      }
    }
  }
}
</style>
