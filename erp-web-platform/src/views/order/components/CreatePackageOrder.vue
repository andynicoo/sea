<template>
  <div class="me-create-package-warp">
    <a-form layout="inline" :form="form" class="me-package-form">
      <div>
        <a-form-item :label="$t('packages.platformOrderNo')">
          <span class="ant-form-text">
            {{ packageOrdersn }}
          </span>
        </a-form-item>
      </div>
      <div class="me-line-two">
        <a-form-item :label="$t('packages.forwarderName')" key="hd">
          <a-select
            class="me-select"
            @change="packageChange"
            :placeholder="$t('packages.inputForwarderName')"
            v-decorator="[
              'forwarderId',
              {
                rules: [
                  { required: true, message: $t('packages.inputForwarderName') }
                ]
              }
            ]"
          >
            <a-select-option
              :value="item.value"
              v-for="item in packageArry"
              :key="item.value"
            >
              {{ item.text }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item key="hd3">
          <a-select
            class="me-select me-mr-2"
            :placeholder="$t('packages.selectStore')"
            v-decorator="[
              'warehouseId',
              {
                rules: [
                  { required: true, message: $t('packages.inputForwarderName') }
                ]
              }
            ]"
            @change="warehouseListChange"
            :disabled="!form.getFieldValue('forwarderId')"
          >
            <a-select-option
              :value="item.id"
              v-for="item in warehouseList"
              :key="item.id"
              :disabled="item.disabled"
              :title="
                item.warehouseName +
                  (item.disabled
                    ? '(不揽收' +
                      packageOrderData.storeCountry +
                      (packageOrderData.storeType == 2 ? '跨境' : '本土') +
                      '包裹)'
                    : '')
              "
            >
              {{ item.warehouseName
              }}<span v-if="item.disabled"
                >(不揽收{{ packageOrderData.storeCountry
                }}{{
                  packageOrderData.storeType == 2 ? '跨境' : '本土'
                }}包裹)</span
              >
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-checkbox
            v-decorator="['warehouseFlag', { valuePropName: 'checked' }]"
            >{{ $t('packages.setDefaultStore') }}</a-checkbox
          >
        </a-form-item>
      </div>
      <div v-if="customAddress">
        <a-form-item label=" " class="me-unlabel">
          <p class="me-address-detail">
            <span class="me-wechat" v-if="customAddress.warehouseWechatUrl">
              <a-popover placement="right">
                <template slot="content">
                  <img
                    style="width: 220px; height: 220px"
                    v-lazy="customAddress.warehouseWechatUrl"
                  />
                </template>
                <img
                  style="width: 60px; height: 60px"
                  v-lazy="customAddress.warehouseWechatUrl"
                />
              </a-popover>
              <br />
              咨询答疑
            </span>
            {{ $t('packages.expressAddress') }}：<br />{{
              customAddress.warehouseReceiver
            }}{{ userNo }}
            <span class="me-pl-2 me-pr-2">{{
              customAddress.warehouseTelphone
            }}</span>
            {{ customAddress.province }}{{ customAddress.city
            }}{{ customAddress.region }}{{ customAddress.warehouseAddress }}
          </p>
        </a-form-item>
      </div>
      <!-- <div>
        <a-form-item
          label=" "
          class="me-unlabel"
          v-show="invitationType == 0 || isBinding == false"
        >
          <a-button
            v-show="bindBtn == true"
            type="primary"
            @click="bindingPackage"
            class="binding-btn"
            >{{ $t('packages.string3') }}
            >
          </a-button>
        </a-form-item>
      </div> -->
      <div>
        <a-form-item :label="$t('packages.baoguoRemark')" class="me-expressNo">
          <a-textarea v-decorator="['sellerNotes']" placeholder="" :rows="3" />
        </a-form-item>
      </div>
      <div v-for="(item, index) in expressNoList" :key="index">
        <a-form-item :label="$t('packages.expressNo')" class="me-expressNo">
          <a-input
            v-decorator="[
              `name[${index}]`,
              {
                rules: [
                  {
                    required: true,
                    validator: valiExpressNo
                  }
                ]
              }
            ]"
            :placeholder="$t('packages.inputExpressNo')"
          /><a-icon
            @click="plusExpressNo"
            type="plus-circle"
            v-if="index == expressNoList.length - 1"
          /><a-icon
            v-if="expressNoList.length > 1"
            @click="minusExpressNo(index)"
            type="minus-circle"
          />
        </a-form-item>
      </div>
      <div>
        <a-form-item :label="$t('packages.productList')">
          <span class="ant-form-text">
            {{ $t('packages.count') }}{{ productListPop.length }}个商品
          </span>
          <div class="item-order-goods">
            <div
              class="goods-item goods-item-border"
              v-for="(goodsItem, k) in productListPop"
              :key="k"
            >
              <div class="order-left">
                <a-popover placement="right">
                  <template slot="content">
                    <img
                      style="width: 220px; height: 220px"
                      v-lazy="goodsItem.imageUrl"
                    />
                  </template>
                  <img
                    style="width: 60px; height: 60px"
                    v-lazy="goodsItem.imageUrl"
                  />
                </a-popover>
              </div>
              <div class="order-right">
                <div class="order-t-box me-minh33">
                  <span class="me-go-goods me-em2 me-f14 me-cp">{{
                    goodsItem.itemName
                  }}</span>
                </div>
                <p class="c909 me-f12">
                  sku：{{ goodsItem.itemSku
                  }}<span class="me-pl-2 me-pr-2"
                    >{{ $t('common.goodsCode') }}：{{
                      goodsItem.variationSku
                    }}</span
                  >
                  {{ $t('common.producNum') }}：{{
                    goodsItem.variationQuantityPurchased
                  }}
                </p>
              </div>
            </div>
          </div>
        </a-form-item>
      </div>
    </a-form>
    <!-- <div>
      <a-button>取消</a-button><a-button @click="submitPackage" type='primary'>提交</a-button>
    </div> -->
  </div>
</template>

<script>
import Package from '@/api/package'
import Order from '@/api/order'
import { mapState } from 'vuex'
export default {
  props: {
    packageOrdersn: {
      type: String
    },
    packageOrderData: {
      type: Object
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.auth.userInfo
    })
    // bindBtn() {
    //   let isBind = false
    //   if (this.isBinding == false && this.thirdPartyCode != null) {
    //     isBind = true
    //   }
    //   if (this.isBinding == true && this.thirdPartyCode != null) {
    //     isBind = null
    //   }
    //   return isBind
    // }
  },
  components: {},
  data() {
    return {
      form: this.$form.createForm(this),
      packageArry: [],
      warehouseList: [],
      customAddress: '',
      memberId: '',
      // isBinding: false,
      // thirdPartyCode: null,
      // settleStyle: '',
      productListPop: [],
      expressNoList: [{ lable: 'eNo1' }],
      // invitationType: '',
      userNo: ''
    }
  },

  mounted() {
    this.$data.userNo = this.userInfo.memberNO
    this.memberId = this.userInfo.memberId
    this.getOrderInfo(this.$props.packageOrdersn)
    //this.isBindForwarder()
    this.bindForwarderList()
  },

  methods: {
    //获取订单信息
    async getOrderInfo(id) {
      if (!id) return false
      let params = {
        orderNO: id
      }
      let { data } = await Order.getOrderInfo(params)
      this.productListPop = data ? data.items : []
    },
    //获取可选的货代商列表（包含默认）
    bindForwarderList() {
      Package.bindForwarderList({}).then((res) => {
        if (res.code == 0 && res.data) {
          this.packageArry = []
          for (let item of res.data || []) {
            this.packageArry.push({
              text: item.forwarderName,
              value: item.forwarderInfoId,
              warehouseDataList: item.warehouseDataList || []
            })
            //找默认仓库
            for (let li of item.warehouseDataList || []) {
              if (li.isDefault == 1) {
                this.$data.form.setFieldsValue({
                  forwarderId: li.forwarderInfoId
                })
                this.packageChange(li.forwarderInfoId)
              }
            }
          }
        }
      })
    },
    //切换货代商列表
    packageChange(val) {
      this.$data.customAddress = ''
      this.$data.form.setFieldsValue({
        warehouseId: ''
      })
      const currentObj = this.packageArry.find((v) => {
        return v.value == val
      })
      const data = currentObj.warehouseDataList || []
      this.$data.warehouseList = this.filterWarehouse(data)
      if (this.$data.warehouseList.length) {
        this.$data.warehouseList.forEach((item) => {
          if (item.isDefault == 1 && !item.disabled) {
            this.$data.form.setFieldsValue({
              warehouseId: item.id
            })
            this.$data.customAddress = item
          }
        })
      }
    },
    //过滤仓库
    filterWarehouse(data) {
      let { storeType, currency } = this.$props.packageOrderData
      let warehouse = []
      data.forEach((item) => {
        if (storeType == 2) {
          let site = item.warehouseSupportSiteList.filter(
            (site) => site.code == 'KJ'
          )
          // console.log(site)
          if (site.length) {
            this.$set(item, 'disabled', false)
            warehouse.unshift(item)
          } else {
            this.$set(item, 'disabled', true)
            warehouse.push(item)
          }
        } else if (storeType == 1) {
          let site = item.warehouseSupportSiteList.filter(
            (site) => site.code == currency
          )
          if (site.length) {
            this.$set(item, 'disabled', false)
            warehouse.unshift(item)
          } else {
            this.$set(item, 'disabled', true)
            warehouse.push(item)
          }
        }
      })
      return warehouse
    },
    //快递单号校验
    valiExpressNo(rule, value, callback) {
      var reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
      if (value && reg.test(value)) {
        callback(this.$t('packages.tipLogistics'))
      } else if (!value) {
        callback(this.$t('packages.inputExpressNo'))
      } else {
        callback()
      }
    },
    //切换仓库
    warehouseListChange(val) {
      this.$data.customAddress = this.$data.warehouseList.find(
        (item) => item.id == val
      )
    },
    //添加快递单号
    plusExpressNo() {
      this.$data.expressNoList.push({ lable: 'eNo1' })
    },
    //删除快递单号
    minusExpressNo(index) {
      let expNo = this.$data.form.getFieldValue('name')
      if (this.$data.expressNoList.length > 1) {
        expNo.splice(index, 1)
        this.$data.form.setFieldsValue({ name: expNo })
        this.$data.expressNoList.splice(index, 1)
      }
    },
    //提交
    submitPackage() {
      return new Promise((resolve, reject) => {
        this.$data.form.validateFields(async (err, values) => {
          if (!err) {
            // if (this.thirdPartyCode != null) {
            // if (this.isBinding == false) {
            //   resolve(true)
            //   this.errorAlert(this.$t('packages.string4'))
            //   return false
            // }
            // }
            let epackageList = []
            let names = []
            values.name.forEach((item) => {
              let exN = item.replace(/\s+/g, '')
              names.push(exN)
              epackageList.push(exN)
            })
            if (new Set(names).size !== names.length) {
              resolve(true)
              this.errorAlert('快递单号不能重复')
              return false
            }
            this.disabledSubmit = true
            if (values.warehouseFlag) {
              await Package.changeDefaultWarehouse({
                warehouseId: values.warehouseId,
                forwarderId: values.forwarderId
              })
            }
            values.platformOrderNo = this.$props.packageOrdersn

            values.expressNos = epackageList
            try {
              await Package.submitPackage(values)
              this.successAlert(this.$t('common.handlerSuccess'))
              resolve(false)
            } catch {
              resolve(true)
            }
          } else {
            resolve(true)
          }
        })
      })
    },

    //获取仓库是否有绑定仓库-------------
    isBindForwarder() {
      Package.isBindForwarderNew({}).then((res) => {
        if (res.code == 0) {
          if (res.data.isDisuse == 0 || res.data.invitationType == 1) {
            let item = res.data.forwarderInfoErpVO
            // if (res.data.isDisuse == 0) {
            //   this.isBinding = true
            // }
            this.forwarderKey = item.forwarderKey
            this.packageArry = [
              {
                text: item.forwarderName,
                value: item.id,
                settleStyle: item.settleStyle
              }
            ]
            // this.id = item.id
            this.$data.form.setFieldsValue({
              forwarderId: item.id
            })
            this.forwarderName = item.forwarderName
            // this.thirdPartyCode = item.thirdPartyCode
            this.settleStyle = item.settleStyle
            // this.invitationType = res.data.invitationType
            this.getWarehouse(item.id)
          } else {
            this.getPackageList()
          }
        }
      })
    },
    //获取货代商列表-------------
    async getPackageList() {
      this.packageArry = []
      let { data } = await Package.getPackageList()
      data.forEach((item) => {
        this.packageArry.push({
          text: item.forwarderName,
          value: item.id,
          settleStyle: item.settleStyle,
          thirdPartyCode: item.thirdPartyCode
        })
      })
    },
    //切换货代商列表-------------
    packageChangecopy(val) {
      this.$data.customAddress = ''
      this.getWarehouse(val)

      this.packageArry.forEach((item) => {
        if (val == item.value) {
          this.settleStyle = item.settleStyle
          this.thirdPartyCode = item.thirdPartyCode
        }
      })
    },
    //获取仓库-----------
    async getWarehousecopy(id) {
      let params = {
        forwarderId: id
      }
      this.$data.form.setFieldsValue({
        warehouseId: ''
      })
      let { data } = await Package.getWarehouse(params)
      this.$data.warehouseList = this.filterWarehouse(data)
      if (this.$data.warehouseList.length) {
        this.$data.warehouseList.forEach((item) => {
          if (item.isDefault == 1 && !item.disabled) {
            this.$data.form.setFieldsValue({
              warehouseId: item.id
            })
            this.$data.customAddress = item
          }
        })
      }
    },
    //绑定货代商--------
    bindingPackage() {
      this.$router.push('/package/addforwarder')
    }
  },
  beforeDestroy() {}
}
</script>

<style lang="scss" scoped>
@import '@/theme/mixins.scss';
.me-em2 {
  @include ellipsisMultiline(2);
  line-height: 16px;
}
.c909 {
  color: #909099;
}
.me-w190 {
  width: 190px !important;
}
.me-f12 {
  font-size: 12px !important;
  line-height: 14px;
}
.me-minh33 {
  min-height: 33px;
  margin: 4px 0 5px;
}
.me-package-form {
  ::v-deep .ant-form-item > .ant-form-item-label {
    width: 160px;
    margin-right: 5px;
    overflow: hidden;
  }
  ::v-deep .ant-form-item > .ant-form-item-control-wrapper {
    width: 500px;
  }
  .me-line-two {
    ::v-deep .ant-form-item-control-wrapper {
      width: auto;
    }
  }
  ::v-deep .ant-form-item {
    margin-bottom: 0 !important;
    margin-right: 5px;
  }
  .me-courier {
    ::v-deep .ant-form-item-label {
      width: auto;
    }
  }
}
.me-unlabel {
  ::v-deep .ant-form-item-label label:after {
    display: none;
  }
}
.me-select {
  width: 185px;
}
.me-expressNo {
  ::v-deep .ant-input {
    width: 375px;
  }
  .anticon {
    font-size: 18px;
    color: #ccc;
    position: relative;
    top: 3px;
    margin-left: 15px;
    cursor: pointer;
  }
  .anticon:hover {
    color: #4c86ff;
  }
}
.me-address-detail {
  background: #f7f7f7;
  margin-top: 3px;
  padding: 10px;
  font-size: 12px;
  line-height: 14px;
  overflow: hidden;
  margin-bottom: 10px;
}
.item-order-goods {
  .goods-item {
    display: flex;
    margin-bottom: 18px;
    .order-left {
      flex: 0 0 40px;
      img {
        width: 100%;
        height: 100%;
        cursor: pointer;
      }
    }
    .v-input {
      margin-top: 23px;
    }
    .order-right {
      padding-left: 12px;
      .order-t-box {
        .mark-wrap {
          width: auto;
          color: rgba(0, 0, 0, 0.38);
          padding-right: 15px;
          float: left;
          .mark-item {
            color: #1abc9c;
            font-size: 16px;
            margin-right: 6px;
            &:last-child {
              margin-right: 0;
            }
          }
        }
      }
    }
  }
}
.me-wechat {
  float: right;
  text-align: center;
  font-size: 12px;
}
.me-create-package-warp {
  max-height: 400px;
  overflow-y: auto;
}
</style>
