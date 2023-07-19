<template>
  <div class="me-pa-2">
    <dl class="me-infor-card">
      <dt>买家信息</dt>
      <dd class="me-basic-ship">
        <div class="me-mr-3">
          <p class="me-title-sub">基础信息<span>New Coustomer</span></p>
          <ul class="me-card-f5f">
            <li>
              买家姓名
              <div>
                {{ orderInfo.customerLastName
                }}{{ orderInfo.customerFirstName }}
              </div>
            </li>
            <li>
              买家ID
              <div>{{ orderInfo.items[0].buyerId }}</div>
            </li>
            <li>
              成功配送订单数
              <div>
                0
                <a-tooltip>
                  <template slot="title">
                    This is the customer's first purchase in the last 30 days on
                    Lazada. Please use IM chat to contact the customer, if
                    needed.
                  </template>
                  <a-icon type="question-circle" class="me-9a9" />
                </a-tooltip>
              </div>
            </li>
            <li>
              成功配送率
              <div>
                0%
                <a-tooltip>
                  <template slot="title">
                    This is the customer's first purchase in the last 30 days on
                    Lazada. Please use IM chat to contact the customer, if
                    needed.
                  </template>
                  <a-icon type="question-circle" class="me-9a9" />
                </a-tooltip>
              </div>
            </li>
          </ul>
        </div>
        <div>
          <p class="me-title-sub">邮寄地址<span>家庭</span></p>
          <ul class="me-card-f5f">
            <li>
              具体地址
              <div>
                {{ orderInfo.addressShipping.address1
                }}{{ orderInfo.addressShipping.address2
                }}{{ orderInfo.addressShipping.address3
                }}{{ orderInfo.addressShipping.address4
                }}{{ orderInfo.addressShipping.address5 }},{{
                  orderInfo.addressShipping.country
                }}
              </div>
            </li>
            <li>
              Receive Name
              <div>{{ orderInfo.addressShipping.firstName }}</div>
            </li>
          </ul>
        </div>
      </dd>
      <dd>
        <p class="me-billing-address">
          账单地址
          <span @click="billingAddressVisible = !billingAddressVisible"
            >文档<a-icon v-if="billingAddressVisible" type="caret-up"/><a-icon
              v-else
              type="caret-down"
          /></span>
        </p>
        <transition name="slide-fade">
          <div
            class="me-card-f5f me-billing-address-details"
            v-if="billingAddressVisible"
          >
            Detail Address
            <p>
              {{ orderInfo.addressBilling.address1
              }}{{ orderInfo.addressBilling.address2
              }}{{ orderInfo.addressBilling.address3
              }}{{ orderInfo.addressBilling.address4
              }}{{ orderInfo.addressBilling.address5 }},{{
                orderInfo.addressBilling.country
              }}
            </p>
            Receiver Name
            <p>{{ orderInfo.addressBilling.firstName }}</p>
            Receiver Phone Number
            <p>{{ orderInfo.addressBilling.phone }}</p>
          </div>
        </transition>
      </dd>
    </dl>
    <div class="me-pay-infor">
      <dl class="me-infor-card me-mr-3">
        <dt>支付信息</dt>
        <dd>
          <a-alert type="warning" class="me-pay-tips">
            <template slot="message">
              <a-icon type="question-circle" /> 结算信息未更新，请等待更新后显示
            </template>
          </a-alert>
        </dd>
      </dl>
      <dl class="me-infor-card">
        <dt>消费者付款信息</dt>
        <dd class="me-payment-infor">
          <h3>含税</h3>
          <p>
            <span>Subtotal</span><span>{{ orderInfo.price }}</span>
          </p>
          <p>
            <span>Shipping Fee</span><span>{{ orderInfo.shippingFee }}</span>
          </p>
          <transition name="slide-fade">
            <div v-if="paymentInfor">
              <p class="me-visible">
                <span>Shipping Fee Original</span
                ><span>{{ orderInfo.shippingFeeOriginal }}</span>
              </p>
              <p class="me-visible">
                <span>Shipping Fee Discount</span
                ><span>-{{ shippingFeeDiscount() }} </span>
              </p>
            </div>
          </transition>
          <p>
            <span>Lazada Discount Total</span
            ><span class="me-top-line">-{{ orderInfo.voucherPlatform }}</span>
          </p>
          <p>
            <span>Seller Discount Total</span
            ><span>-{{ orderInfo.voucherSeller }}</span>
          </p>
          <p><span>Adjust amount</span><span>-0</span></p>
          <p>
            <span class="me-line"></span
            ><span class="me-payment-btn" @click="paymentInfor = !paymentInfor"
              >{{ paymentInfor ? 'Show Less' : 'Show More' }}
              <a-icon type="caret-down" v-if="!paymentInfor"/><a-icon
                type="caret-up"
                v-if="paymentInfor"
            /></span>
          </p>
          <p>
            <span class="me-mt-1">Grand Total</span
            ><span
              ><b>{{ grandTotal() }}</b></span
            >
          </p>
        </dd>
      </dl>
    </div>
    <dl class="me-infor-card">
      <dt>商品信息</dt>
      <dd>
        <a-table
          :columns="columns"
          :data-source="this.orderInfo.items"
          :pagination="false"
        >
          <template slot="goods" slot-scope="text, record">
            <dl class="me-goods-info">
              <dt>
                <a-popover placement="right">
                  <template slot="content">
                    <img
                      style="width: 220px; height: 220px"
                      v-lazy="record.productMainImage"
                    />
                  </template>
                  <img
                    style="width: 64px; height: 64px"
                    v-lazy="record.productMainImage"
                  />
                </a-popover>
              </dt>
              <dd>
                <h3 class="me-em2">
                  {{ record.name }}
                </h3>
                <div>
                  <span> sellerSku: {{ record.sku }}</span>
                </div>
              </dd>
            </dl>
          </template>
        </a-table>
      </dd>
    </dl>
  </div>
</template>

<script>
const columns = [
  {
    title: '商品信息',
    dataIndex: 'name',
    key: 'goods',
    width: '200px',
    scopedSlots: { customRender: 'goods' }
  },
  {
    title: 'Order Line ID ',
    dataIndex: 'orderId',
    key: 'orderId'
  },
  {
    title: '仓库类型',
    dataIndex: 'warehouseCode',
    key: 'warehouseCode'
  },
  {
    title: 'Item ID ',
    dataIndex: 'orderItemId',
    key: 'orderItemId'
  },
  {
    title: '运输方式',
    dataIndex: 'shippingProviderType',
    key: 'shippingProviderType'
  },
  {
    title: 'Refunds',
    dataIndex: 'Refunds',
    key: 'Refunds'
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: 'Total Amount',
    dataIndex: 'itemPrice',
    key: 'itemPrice'
  },
  {
    title: 'Shipping Fee',
    dataIndex: 'shippingFeeOriginal',
    key: 'shippingFeeOriginal'
  },
  {
    title: 'Shipping Fee Promo',
    dataIndex: 'shippingAmount',
    key: 'shippingAmount'
  },
  {
    title: 'Reason',
    dataIndex: 'reason',
    key: 'reason'
  },
  {
    title: 'Promotions',
    dataIndex: 'voucherAmount',
    key: 'voucherAmount'
  },
  // {
  //   title: 'Other Fees',
  //   dataIndex: 'age',
  //   key: 'age'
  // },
  {
    title: 'Delivery Time',
    dataIndex: 'updatedAt',
    key: 'updatedAt'
  }
]

import LazadaOrder from '@/api/lazadaOrder'
import { add, floatSub } from '@/util'
export default {
  components: {},
  data() {
    return {
      columns,
      paymentInfor: true,
      billingAddressVisible: false,
      searchParams: {
        ordersn: null
      },
      orderInfo: ''
    }
  },
  async created() {
    let { data } = await LazadaOrder.LazadaOrderDetails({
      orderNumber: this.$route.query.orderNumber
    })
    this.orderInfo = data
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    //运费折扣
    shippingFeeDiscount() {
      return add(
        this.orderInfo.shippingFeeDiscountPlatform,
        this.orderInfo.shippingFeeDiscountSeller
      )
    },
    //实际总价
    grandTotal() {
      let sum = add(this.orderInfo.price, this.orderInfo.shippingFee)
      sum = floatSub(sum, this.orderInfo.voucherPlatform)
      sum = floatSub(sum, this.orderInfo.voucherSeller)
      return sum
    }
  }
}
</script>
<style lang="scss" scoped>
.me-infor-card {
  min-height: 349px;
  background: #ffffff;
  border-radius: 1px;
  padding: 20px;
  margin-bottom: 20px;
  dt {
    font-weight: bold;
    font-size: 20px;
  }
}

.me-basic-ship {
  display: flex;
  > div {
    width: 50%;
  }
}
.me-card-f5f {
  background: #f5f6fa;
  border-radius: 2px;
  overflow: hidden;
  min-height: 203px;
  padding: 20px;
  color: #909099;
  li {
    width: 40%;
    margin-right: 5%;
    float: left;
    > div {
      color: #303133;
      min-height: 50px;
      margin-bottom: 10px;
      word-break: break-all;
    }
  }
}
.me-title-sub {
  margin: 15px 0 10px;
  color: #909099;
  span {
    height: 17px;
    background: #ff6b38;
    border-radius: 9px;
    color: #fff;
    padding: 0 10px;
    font-size: 12px;
    display: inline-block;
    margin-left: 10px;
  }
}
.me-goods-info {
  dt {
    float: left;
    margin-right: 5px;
  }
  dd {
    overflow: hidden;
    text-align: left;
  }
}
.me-pay-infor {
  display: flex;
  > dl {
    width: 50%;
  }
}
.me-pay-tips {
  margin-top: 10px;
  border: none;
  background: #ffede2;
  ::v-deep .ant-alert-icon,
  ::v-deep .ant-alert-message {
    color: #ff6b38;
  }
}
.me-billing-address {
  padding: 13px 0 5px;
  font-size: 12px;
  color: #909099;
  span {
    cursor: pointer;
    color: #4c86ff;
  }
}
.me-billing-address-details {
  min-height: 100px;
  p {
    color: #303133;
    margin-bottom: 10px;
  }
}
.me-payment-infor {
  h3 {
    color: #909099;
    margin-top: 15px;
  }
  p {
    text-align: right;
    display: flex;
    margin-bottom: 3px;
    span {
      padding-top: 3px;
    }
    b {
      font-size: 20px;
    }
    span:first-child {
      width: calc(100% - 125px);
      padding-right: 50px;
    }
    span:last-child {
      width: 125px;
    }
  }
}
.me-line {
  position: relative;
  &::before {
    content: '';
    width: calc(100% + 50px);
    height: 1px;
    background: #f0f0f0;
    display: block;
    margin-top: 10px;
  }
}
.me-top-line {
  border-top: 1px solid #f0f0f0;
}
.me-visible {
  color: #909099;
  font-size: 12px;
}
.me-payment-btn {
  color: #4c86ff;
  font-size: 12px;
  cursor: pointer;
}
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
.me-9a9 {
  color: #9a9ea6;
}
</style>
