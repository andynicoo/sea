<template>
  <div class="me-pa-2">
    <a-page-header class="me-page-header" title="代打包"></a-page-header>
    <div class="package-create">
      <a-form class="me-search-form me-pt-4 me-pl-4" layout="inline">
        <a-form-item :label="$t('packages.platformOrderNo')">
          <a-input v-model="ordersn" style="width: 190px" />
        </a-form-item>
        <a-form-item :label="$t('packages.forwarderName')">
          <a-select
            v-model="id"
            :placeholder="$t('packages.inputForwarderName')"
            style="width:190px"
            @change="packageId"
          >
            <a-select-option
              v-for="item in packageArry"
              :key="item.value"
              :value="item.value"
              :title="item.text"
            >
              {{ item.text }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('packages.selectStore')">
          <a-select
            v-model="warehouse"
            @change="warehouseId"
            style="width:190px"
          >
            <a-select-option
              v-for="item in warehouseArry"
              :key="item.value"
              :value="item.value"
              :disabled="item.disabled"
              :title="item.text"
            >
              {{ item.text }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-checkbox v-model="warehouseFlag">
            {{ $t('packages.setDefaultStore') }}
          </a-checkbox>
        </a-form-item>
      </a-form>
      <p class="me-ml-4">{{ $t('packages.expressAddress') }}:</p>

      <div class="adress-info" v-show="id">
        <div class="item-input">
          <div class="linker">
            <span>{{ $t('packages.shoujian') }}: </span>
            <div>{{ addressInfo.consignee }} {{ userNo }}</div>
          </div>
          <div class="linker">
            <span>{{ $t('packages.shoujianTel') }}: </span>
            <div>{{ addressInfo.contactTelephone }}</div>
          </div>
          <div class="linker">
            <span>{{ $t('packages.shouhuoAddress') }}: </span>
            <div>{{ addressInfo.shippingAddress }}</div>
          </div>
          <div class="wxcode-box" v-show="addressInfo.wehcatContactImage">
            <img :src="addressInfo.wehcatContactImage" />
            <p>{{ $t('packages.wxTips') }}</p>
          </div>
        </div>
      </div>

      <p class="me-ml-4">包裹备注:</p>
      <div class="remark-wrap">
        <a-textarea v-model="remark" :maxlength="50"> </a-textarea>
      </div>

      <div class="expressnumber">
        <a-input
          placeholder="请输入快递单号"
          style="width:190px"
          v-model="orderValue"
        ></a-input>
        <a-button type="primary" class="me-ml-2" @click="sureOrder">
          {{ $t('packages.suerAddNo') }}
        </a-button>
      </div>

      <div class="add-order">
        <div class="order" v-for="(item, index) in orderArry" :key="index">
          <a-tag closable @close="deleteOrder(index)">
            {{ item.expressNo }}
          </a-tag>
        </div>
      </div>

      <div class="goods-total">
        <div class="text">{{ $t('packages.productList') }}</div>
        <span
          >({{ $t('packages.count') }}{{ desserts.length
          }}{{ $t('packages.countPro') }})</span
        >
      </div>
      <div class="table-content">
        <a-table :columns="headers" :data-source="desserts">
          <template slot="GoodsInfoSlot" slot-scope="text, item">
            <div class="goods-info">
              <div class="goods-img me-mr-2">
                <img :src="item.imageUrl" width="80" />
              </div>
              <div class="infos">
                <div>{{ item.itemName }}</div>
                <div>sku: {{ item.variationSku }}</div>
                <div>sku{{ $t('packages.bianhao') }}: {{ item.itemSku }}</div>
                <div>
                  {{ $t('packages.numbers') }}:
                  {{ item.variationQuantityPurchased }}
                </div>
              </div>
            </div>
          </template>
        </a-table>
      </div>
      <div class="footer-content">
        <a-button
          :disabled="disabledSubmit"
          type="primary"
          @click="submitPackage"
          >{{ $t('common.submit') }}</a-button
        >
      </div>
    </div>
    <!-- 包裹备注弹窗 -->
    <!-- <DialogRemark
      :dialogRemark="dialogRemark"
      @cancle="addRemark"
      @setRemark="setRemark"
    ></DialogRemark> -->
    <!-- 货代商的绑定的弹窗 -->
    <!-- <DialogBinding
      :dialogBinding="dialogBinding"
      @cancle="cancleBinding"
      @setBinding="setBinding"
      @unBinding="unBinding"
      :isBinding="isBinding"
      :forwarderName="forwarderName"
      :forwarderKey="forwarderKey"
    ></DialogBinding> -->
  </div>
</template>

<script>
import Order from '@/api/order'
import Package from '@/api/package'
// import DialogRemark from './components/DialogRemark'
// import DialogBinding from './components/DialogBinding'
import { mapState } from 'vuex'
export default {
  components: {
    //DialogRemark,
    // DialogBinding
  },
  data() {
    return {
      warehouseFlag: false, //是否设为默认仓库
      //dialogRemark: false,
      orderValue: '',
      orderArry: [],
      isEdit: true,
      ordersn: this.$route.query.id,
      packageArry: [],
      headers: [
        {
          title: this.$t('packages.productInfo'),
          dataIndex: 'info',
          scopedSlots: { customRender: 'GoodsInfoSlot' }
        }
      ],
      desserts: [],
      id: '',
      remark: '',
      userNo: '',
      memberId: '',
      addressInfo: {
        consignee: '',
        contactTelephone: '',
        shippingAddress: ''
      },
      defaultImg: require('@/assets/images/loading-img.png'),
      dialogBinding: false,
      warehouseArry: [],
      warehouse: '',
      isBinding: false,
      forwarderName: '',
      settleStyle: '',
      isDisuse: '',
      forwarderKey: '',
      invitationType: '',
      thirdPartyCode: null,
      disabledSubmit: false
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.auth.userInfo
    }),
    bindBtn() {
      let isBind = false
      if (this.isBinding == false && this.thirdPartyCode != null) {
        isBind = true
      }
      if (this.isBinding == true && this.thirdPartyCode != null) {
        isBind = null
      }
      return isBind
    }
  },
  mounted() {
    this.memberId = this.userInfo.memberId
    this.getOrderInfo(this.$route.query.id)
    this.isBindForwarder()
  },
  methods: {
    isBindForwarder() {
      Package.isBindForwarder({}).then((res) => {
        if (res.code == 0) {
          if (res.data.isDisuse == 0 || res.data.invitationType == 1) {
            let item = res.data.forwarderInfoErpVO
            if (res.data.isDisuse == 0) {
              this.isBinding = true
            }
            this.forwarderKey = item.forwarderKey
            this.packageArry = [
              {
                text: item.forwarderName,
                value: item.id,
                settleStyle: item.settleStyle
              }
            ]
            this.id = item.id
            this.forwarderName = item.forwarderName
            this.thirdPartyCode = item.thirdPartyCode
            this.settleStyle = item.settleStyle
            this.invitationType = res.data.invitationType
            this.getWarehouse(item.id)
          } else {
            this.getPackageList()
          }
        }
      })
    },
    isCanEdit() {
      this.isEdit = !this.isEdit
    },
    sureOrder() {
      let isAdd = true
      this.orderValue = this.orderValue.replace(/(^\s*)|(\s*$)/g, '')
      var reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
      if (reg.test(this.orderValue)) {
        this.errorAlert(this.$t('packages.tipLogistics'))
        return false
      }
      if (!this.orderValue) {
        this.errorAlert(this.$t('packages.inputExpressNo'))
        return false
      }
      this.orderArry.forEach((item) => {
        if (item.expressNo == this.orderValue) {
          this.errorAlert(this.$t('packages.expressNoisExit'))
          isAdd = false
        }
      })
      if (isAdd) {
        this.orderArry.push({ expressNo: this.orderValue })
      }
      this.orderValue = ''
    },

    deleteOrder(k) {
      this.orderArry.splice(k, 1)
    },
    //获取订单信息
    getOrderInfo(id) {
      if (!id) return false
      let params = {
        orderNO: id
      }
      Order.getOrderInfo(params).then((res) => {
        if (res.code == 0) {
          this.desserts = res.data?.items || []
        }
      })
    },
    //获取货代商列表
    getPackageList() {
      let params = {}
      Package.getPackageList(params).then((res) => {
        if (res.code == 0) {
          let packageArry = []
          let list = res.data
          list.forEach((item) => {
            packageArry.push({
              text: item.forwarderName,
              value: item.id,
              settleStyle: item.settleStyle,
              thirdPartyCode: item.thirdPartyCode
            })
          })
          this.packageArry = packageArry
        }
      })
    },
    packageId() {
      this.userNo = ''
      this.getWarehouse(this.id)
      this.packageArry.forEach((item) => {
        if (this.id == item.value) {
          this.addressInfo = item
          this.settleStyle = item.settleStyle
          this.thirdPartyCode = item.thirdPartyCode
        }
      })
    },

    // 提交包裹
    submitPackage() {
      let params = {
        expressNos: this.orderArry.map((ele) => {
          return ele.expressNo
        }),
        //epackageList: this.orderArry,
        forwarderId: this.id,
        sellerNotes: this.remark,
        platformOrderNo: this.ordersn,
        warehouseId: this.warehouse
      }
      if (this.orderArry.length == 0) {
        this.errorAlert(this.$t('packages.inputExpressNo'))
        return false
      }
      if (this.thirdPartyCode != null) {
        if (this.isBinding == false) {
          this.errorAlert(this.$t('packages.string4'))
          return false
        }
      }
      if (this.warehouse == '') {
        this.errorAlert(this.$t('packages.inputSelectStore'))
        return false
      }

      if (this.warehouseFlag) {
        Package.changeDefaultWarehouse({
          warehouseId: params.warehouseId,
          forwarderId: params.forwarderId
        }).then((res) => {
          if (res.code == 0) {
            //console.log('成功')
          }
        })
      }
      this.disabledSubmit = true
      // console.log(params)
      Package.submitPackage(params)
        .then((res) => {
          this.disabledSubmit = false
          if (res.code == 0) {
            this.successAlert(this.$t('common.handlerSuccess'))
            if (this.$route.path == '/oms/package/create') {
              this.$router.push('/oms/order/page-packing')
            } else {
              this.$router.push('/order/page-packing')
            }
          }
        })
        .catch(() => {
          this.disabledSubmit = false
        })
    },
    cancleBinding() {
      this.dialogBinding = false
    },
    bindingPackage() {
      //this.dialogBinding = true
      this.$router.push('./addforwarder')
    },
    setBinding(binding) {
      let params = {
        forwarderKey: binding,
        id: this.id
      }
      Package.bindForwarder(params).then((res) => {
        if (res.code == 0) {
          this.successAlert(this.$t('packages.bingdingSuccess'))
          this.isBinding = true
          let item = res.data
          this.packageArry = [
            {
              text: item.forwarderName,
              value: item.id,
              settleStyle: item.settleStyle
            }
          ]
          this.id = item.id
          this.forwarderName = item.forwarderName
          this.settleStyle = item.settleStyle
          this.getWarehouse(item.id)
        }
      })
    },
    unBinding(binding) {
      let params = {
        forwarderKey: binding,
        memberId: this.memberId
      }
      Package.unBindForwarder(params).then((res) => {
        if (res.code == 0) {
          this.successAlert(this.$t('packages.unBuningSuccess'))
          this.id = ''
          this.warehouse = ''
          this.isBinding = false
          this.warehouseArry = []
          this.forwarderName = ''
          this.getPackageList()
        }
      })
    },
    getWarehouse(id) {
      let params = {
        forwarderId: id
      }
      Package.getWarehouse(params).then((res) => {
        if (res.code == 0) {
          this.warehouseArry = res.data.map((item) => ({
            text: item.warehouseRemindNotice,
            value: item.id,
            packingCharge: item.packingCharge,
            isDefault: item.isDefault,
            consignee: item.warehouseReceiver,
            contactTelephone: item.warehouseTelphone,
            shippingAddress: item.fullAddress,
            wehcatContactImage: item.warehouseWechatUrl,
            warehouseSupportSiteList: item.warehouseSupportSiteList, //仓库支持的站点列表
            disabled: false
          }))
          //判断仓库支持站点列表 是否匹配订单站点（不匹配的仓库禁用）6666
          // this.$route.query.storeType  ( 1 本土  2跨境  )
          // this.$route.query.currency   站点
          // this.$route.query.storeCountry   名称
          const storeType = Number(this.$route.query.storeType)
          let currency = this.$route.query.currency
          const storeCountry = this.$route.query.storeCountry

          const warehouseArryTemp = []
          const warehouseArry = []
          for (const item of this.warehouseArry) {
            if (storeType === 2) {
              currency = 'KJ'
            }
            let site = item.warehouseSupportSiteList.filter(
              (site) => site.code == currency
            )
            item.disabled = site.length === 0 ? true : false
            const tips =
              '(不揽收' +
              storeCountry +
              (storeType === 1 ? '本土' : '跨境') +
              '包裹)'
            if (item.disabled) {
              item.text = item.text + tips
            }

            if (item.disabled) {
              warehouseArryTemp.push(item)
            } else {
              warehouseArry.push(item)
            }
            this.warehouseArry = warehouseArry.concat(warehouseArryTemp)
            if (item.isDefault == 1 && !item.disabled) {
              this.warehouseId(item.value)
            }
          }
        }
      })
    },
    warehouseId() {
      this.warehouseArry.forEach((item) => {
        if (this.warehouse == item.value) {
          this.addressInfo = item
        }
      })
      this.userNo = this.userInfo.memberNO
    },
    addForwarder() {
      this.$router.push('./addforwarder')
    }
  }
}
</script>

<style lang="scss" scoped>
.package-create {
  background: #fff;
  padding: 20px auto;
  .adress-info {
    width: 100%;
    display: flex;
    position: relative;
    padding: 20px;
    .linker {
      display: flex;
      justify-content: flex-start;
      line-height: 40px;
    }
    .wxcode-box {
      position: absolute;
      right: 20px;
      top: 0;
      width: 100px;
      height: 100px;
      img {
        width: 100px;
        height: 100px;
      }
      p {
        font-size: 12px;
        text-align: center;
      }
    }
  }
  .remark-wrap {
    margin-left: 80px;
    width: 600px;
  }
  .expressnumber {
    display: flex;
    margin-top: 20px;
    margin-left: 80px;
  }
  .add-order {
    overflow: hidden;
    margin-left: 80px;
    margin-top: 20px;
    .order {
      float: left;
      margin-right: 10px;
      margin-top: 10px;
    }
  }
  .goods-total {
    margin: 20px;
    display: flex;
  }
  .table-content {
    margin-top: 12px;
    .goods-info {
      display: flex;
    }
  }
  .footer-content {
    display: flex;
    padding: 20px;
    justify-content: flex-end;
  }
}
</style>
