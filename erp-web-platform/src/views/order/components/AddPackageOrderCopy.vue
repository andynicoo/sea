<template>
  <a-modal
    :visible="showModal"
    @cancel="showModal = false"
    width="1200px"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <template slot="title">
      <span>{{ title }}</span>
      <template v-if="records && records.storeType == 2 && !records.isSplitUp">
        <span class="label-red" v-if="records.fmStatus == 0">未做发货预报</span>
        <span class="label-grey" v-if="records.fmStatus == 1">
          已做发货预报
        </span>
      </template>
    </template>

    <div class="modal-main-wrap">
      <div class="form-wrap">
        <a-row>
          <a-col :span="13">
            <a-select
              placeholder="请选择货代商"
              v-model="form.warehouseId"
              @change="changeWarehouse"
              style="width:100%"
            >
              <a-select-option
                v-for="(li, index) in warehouseList"
                :value="li.id"
                :key="index"
                :disabled="li.disabled"
              >
                【{{ li.forwarderName || '-' }}】{{ li.warehouseName || '-' }}
                {{ li.tips || '' }}
              </a-select-option>
            </a-select>
            <div class="address-info">
              <div class="address" v-if="warehouseAddress">
                <div class="text">
                  <p>
                    <span>收件人名:</span>
                    {{ warehouseAddress.warehouseReceiver }}
                  </p>
                  <p>
                    <span>收件电话：</span>
                    {{ warehouseAddress.warehouseTelphone }}
                  </p>
                  <p>
                    <span>收件地址：</span>
                    {{ warehouseAddress.province }}
                    {{ warehouseAddress.city }}
                    {{ warehouseAddress.region }}
                    {{ warehouseAddress.warehouseAddress }}
                  </p>
                </div>
                <div class="code" v-if="warehouseAddress">
                  <a-popover placement="right">
                    <template slot="content">
                      <img
                        style="width: 220px; height: 220px"
                        v-lazy="warehouseAddress.warehouseWechatUrl"
                      />
                    </template>
                    <img
                      style="width: 60px; height: 60px"
                      v-lazy="warehouseAddress.warehouseWechatUrl"
                    />
                  </a-popover>
                  <p>咨询答疑</p>
                </div>
              </div>
              <div v-else>
                <router-link
                  style="color:red;cursor: pointer;"
                  :to="{
                    path:
                      $route.path.indexOf('/oms/') == -1
                        ? '/package/addforwarder'
                        : '/oms/package/addforwarder'
                  }"
                >
                  需先在货代商列表选择使用仓库，去设置 >
                </router-link>
              </div>
            </div>
          </a-col>
          <a-col :offset="1" :span="10">
            <a-textarea
              v-model="form.sellerNotes"
              placeholder="请输入代打包订单备注，提醒货代商注意内容"
              :rows="6"
              style="width: 100%;height:136px"
            />
          </a-col>
        </a-row>
        <a-row style="border-top: 1px solid #ccc;margin:12px 0">
          <a-col :span="13">
            <div class="title">
              <span>商品信息</span>
              <span v-if="goodsList">
                （共 {{ goodsList.length || 0 }} 个商品）
              </span>
            </div>
            <div class="goods-list">
              <div class="li" v-for="(li, index) of goodsList" :key="index">
                <div class="img">
                  <a-popover placement="right">
                    <template slot="content">
                      <img
                        style="width: 220px; height: 220px"
                        v-lazy="li.imageUrl"
                      />
                    </template>
                    <img
                      style="width: 60px; height: 60px"
                      v-lazy="li.imageUrl"
                    />
                  </a-popover>
                </div>
                <div class="info">
                  <div class="name">{{ li.itemName || '-' }}</div>
                  <div class="tips">
                    <span
                      >数量：{{ li.variationQuantityPurchased || '-' }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </a-col>
          <a-col :offset="1" :span="10">
            <div class="title">
              <span>添加国内物流单号</span>
              <span v-if="form.expressNos">
                （共 {{ form.expressNos.length || 0 }} 个）
              </span>
            </div>
            <div class="expressNo-list">
              <a-input-search
                v-model="expressNos"
                placeholder="输入物流单号，完成点击确认，支持输入多个"
                enter-button="确认添加"
                size="large"
                @search="plusExpressNo()"
              />
              <div
                class="expressNo-li"
                v-for="(li, index) of form.expressNos"
                :key="index"
              >
                <span>单号{{ index + 1 }}：</span>
                <span>{{ li }}</span>
                <span class="delete-btn" @click="deleteExpressNo(index)">
                  <a-icon type="close-circle" />
                </span>
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>

    <template slot="footer">
      <div class="foot-tips">
        <span>客户编号：{{ financeMemberAccount.no || '-' }}</span>
        <span>账户余额：{{ financeMemberAccount.accBalance || '0' }}元</span>
      </div>
      <a-button @click="showModal = !showModal">取消</a-button>
      <!-- 订单状态码待发货、重新发货、待物流拿货 而且 运单号不为空 且 跨境 显示发货预报按钮-->
      <a-button
        v-if="
          records &&
            !records.isSplitUp &&
            records.storeType == 2 &&
            packageInfo &&
            packageInfo.trackingNo &&
            (records.orderCode == 'READY_TO_SHIP' ||
              records.orderCode == 'RETRY_SHIP' ||
              records.orderCode == 'PROCESSED')
        "
        :loading="confirmLoading"
        @click="deliveryForecast()"
      >
        发货预报
      </a-button>
      <a-button type="primary" @click="submitForm()" :loading="confirmLoading">
        提交
      </a-button>
    </template>

    <BindOrderPopupPackage
      ref="BindOrderPopupPackage"
      :records="records"
      :packageInfo="packageInfo"
    />
  </a-modal>
</template>

<script>
import Package from '@/api/package'
import BindOrderPopupPackage from './firstKilometerForecast/BindOrderPopupPackage'
export default {
  components: {
    BindOrderPopupPackage
  },
  props: {
    records: {},
    packageInfo: {}
  },
  watch: {
    showModal(val) {
      if (val) {
        this.$nextTick(() => {
          this.setTitle()
          this.getPackageWarehouseList()
          this.getFinanceMemberAccount()
          this.form = {
            platformOrderNo: this.records.ordersn,
            forwarderId: null,
            warehouseId: null,
            warehouseFlag: null,
            sellerNotes: null,
            expressNos: [],
            packageNumber: null
          }
          if (
            this.packageInfo &&
            this.packageInfo.list &&
            this.packageInfo.list.length > 0
          ) {
            this.goodsList = this.packageInfo.list || []
            this.form.packageNumber = this.packageInfo.packageNumber
          } else {
            this.goodsList = this.records.items || []
          }
        })
      } else {
        this.warehouseAddress = null
        this.expressNos = null
        this.form = {}
        this.financeMemberAccount = {}
      }
    }
  },
  data() {
    return {
      showModal: false,
      confirmLoading: false,
      title: '代打包下单',
      warehouseList: [],
      warehouseAddress: null,
      goodsList: [],
      expressNos: null,
      form: {},
      financeMemberAccount: {}
    }
  },
  methods: {
    //提交
    submitForm() {
      //console.log(this.form)
      if (!this.form.forwarderId || !this.form.warehouseId) {
        this.errorAlert('请选取货代商仓库')
        return false
      }

      if (this.form.sellerNotes && this.form.sellerNotes.length > 300) {
        this.errorAlert('备注不能大于300字')
        return false
      }

      if (this.form.expressNos.length === 0) {
        this.errorAlert('请添加物流单号')
        return false
      }
      this.confirmLoading = true
      Package.submitPackage(this.form)
        .then((res) => {
          this.confirmLoading = false
          // console.log(res)
          this.successAlert('操作成功!')
          this.showModal = false
          this.$emit('submit')
        })
        .catch(() => {
          this.confirmLoading = false
        })
    },
    //添加快递单号
    plusExpressNo() {
      if (!this.expressNos) {
        this.errorAlert('请输入快递单号')
        return false
      }
      const value = this.expressNos.replace(/^\s*|\s*$/g, '')
      const reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
      if (value && reg.test(value)) {
        this.errorAlert('物流单号不能包含中文')
        return false
      }
      if (this.form.expressNos.indexOf(value) !== -1) {
        this.errorAlert('不能重复添加物流单号')
        return false
      }
      this.form.expressNos.push(value)
      this.expressNos = null
    },
    //删除快递单号
    deleteExpressNo(index) {
      this.form.expressNos.splice(index, 1)
    },
    //获取货代商仓库列表
    getPackageWarehouseList() {
      Package.getPackageWarehouseList({
        ordersn: this.records.ordersn
      }).then((res) => {
        const storeType = this.records.storeType //( 1 本土  2跨境  )
        let currency = this.records.currency // 站点
        const storeCountry = this.records.storeCountry //站点名称
        const warehouseArry = []
        const warehouseArryTemp = []
        for (const li of res?.data) {
          if (storeType == 2) {
            currency = 'KJ'
          }
          if (
            li.supportSiteCode &&
            li.supportSiteCode.indexOf(currency) !== -1
          ) {
            li.disabled = false
            warehouseArry.push(li)
          } else {
            li.tips =
              '(不揽收' +
              storeCountry +
              (storeType === 1 ? '本土' : '跨境') +
              '包裹)'
            li.disabled = true
            warehouseArryTemp.push(li)
          }
        }
        this.warehouseList = warehouseArry.concat(warehouseArryTemp)
        if (this.warehouseList.length > 0 && !this.warehouseList[0].disabled)
          this.changeWarehouse(this.warehouseList[0].id)
      })
    },
    //改变货代商仓库
    changeWarehouse(val) {
      this.warehouseAddress = this.$data.warehouseList.find(
        (item) => item.id == val
      )
      this.form.forwarderId = this.warehouseAddress.forwarderInfoId
      this.form.warehouseId = val
    },
    //设置标题
    setTitle() {
      let resStr = '代打包下单'
      if (this.records.ordersn) {
        resStr += ' - 订单' + this.records.ordersn
      }
      if (this.records.storeCountry && this.records.storeType) {
        let shotType = this.records.storeCountry || ''
        if (this.records.storeType == 1) {
          shotType += '本土'
        }
        if (this.records.storeType == 2) {
          shotType += '跨境'
        }
        if (shotType) {
          resStr += '【' + shotType + '】'
        }
      }
      this.title = resStr
    },
    //获取显示当前用户账户余额金额
    getFinanceMemberAccount() {
      Package.getFinanceMemberAccount({}).then((res) => {
        this.financeMemberAccount = res?.data || {}
      })
    },
    //发货预报
    deliveryForecast() {
      this.$refs.BindOrderPopupPackage['showModal'] = true
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-main-wrap {
  max-height: 60vh;
  overflow-y: auto;
  .title {
    line-height: 32px;
    font-weight: bold;
    font-size: 16px;
    margin: 10px 0;
  }
  .address-info {
    width: 100%;
    height: 100px;
    background: #f7f7f7;
    padding: 10px;
    margin: 5px 0 10px 0;
    .address {
      display: flex;
      .text {
        flex: 1;
        p {
          line-height: 20px;
          font-size: 12px;
          span {
            font-weight: bold;
            font-size: 14px;
          }
        }
      }
      .code {
        width: 60px;
        margin-left: 10px;
        img {
          width: 60px;
          height: 60px;
        }
        p {
          line-height: 20px;
        }
      }
    }
  }
  .goods-list {
    width: 100%;
    min-height: 100px;
    border-right: 1px solid #ccc;
    .li {
      display: flex;
      margin: 8px 0;
      .img {
        width: 60px;
        img {
          width: 100%;
        }
      }
      .info {
        flex: 1;
        margin-left: 10px;
        .name {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 16px;
          margin-bottom: 5px;
          color: #4c86ff;
        }
        .tips {
          line-height: 14px;
          margin-bottom: 2px;
        }
      }
    }
  }
  .expressNo-list {
    .expressNo-li {
      width: 350px;
      height: 30px;
      line-height: 30px;
      background-color: rgba(254, 107, 55, 0.06);
      border-radius: 4px;
      margin: 6px 0;
      padding: 0 10px;
      position: relative;
      .delete-btn {
        position: absolute;
        right: 6px;
        top: 2px;
        bottom: 0;
        width: 20px;
        cursor: pointer;
        font-size: 16px;
        color: #999;
      }
    }
  }
}
.foot-tips {
  float: left;
  line-height: 32px;
  color: red;
  span {
    margin: 0 6px;
  }
}
.label-red {
  color: red;
  border: 1px solid red;
  border-radius: 4px;
  padding: 3px 6px;
  margin-left: 10px;
}
.label-grey {
  color: grey;
  border: 1px solid grey;
  border-radius: 4px;
  padding: 3px 6px;
  margin-left: 10px;
}
</style>
