<template>
  <div>
    <a-form layout="inline" :form="form" class="me-one-click-form">
      <div class="me-pl80">
        <a-form-item>
          <a-radio-group
            v-decorator="[
              'isSysFw',
              {
                initialValue: true
              }
            ]"
            @change="addressTypeChange"
            :disabled="disabledForwarder"
          >
            <a-radio :value="true">
              {{ $t('order.useSystemForwarder') }}
            </a-radio>
            <a-radio :value="false">
              {{ $t('order.customAddress') }}
            </a-radio>
          </a-radio-group>
        </a-form-item>
      </div>
      <div v-if="isSystem">
        <!-- <a-form-item :label="$t('order.selectForwarding')" key="hd">
          <a-select
            class="me-select me-w241"
            @change="packageChange"
            :placeholder="$t('packages.inputForwarderName')"
            v-decorator="[
              'fwId',
              {
                rules: [
                  { required: true, message: $t('packages.inputForwarderName') }
                ]
              }
            ]"
            :disabled="disabledForwarder"
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
            class="me-select me-mr-2 me-w241"
            :placeholder="$t('packages.selectStore')"
            v-decorator="['fwStorageId']"
            @change="warehouseListChange"
            :disabled="disabledForwarder || !form.getFieldValue('fwId')"
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
                      rowData.storeCountry +
                      (rowData.storeType == 2 ? '跨境' : '本土') +
                      '包裹)'
                    : '')
              "
            >
              {{ item.warehouseName
              }}<span v-if="item.disabled"
                >(不揽收{{ rowData.storeCountry
                }}{{ rowData.storeType == 2 ? '跨境' : '本土' }}包裹)</span
              >
            </a-select-option>
          </a-select>
        </a-form-item> -->

        <a-form-item :label="$t('order.selectForwarding')" key="hd2">
          <a-select
            class="me-select me-mr-2 me-w380"
            v-decorator="[
              'fwStorageId',
              {
                rules: [
                  { required: true, message: $t('packages.inputForwarderName') }
                ]
              }
            ]"
            :placeholder="$t('packages.inputForwarderName')"
            @change="changeForwarderWarehouse"
            :disabled="disabledForwarder"
          >
            <a-select-option
              v-for="(li, index) in forwarderWarehouseList"
              :value="li.id"
              :key="index"
              :disabled="li.disabled"
            >
              【{{ li.forwarderName || '-' }}】{{ li.warehouseName || '-' }}
              {{ li.tips || '' }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label=" " class="me-unlabel" v-if="customAddress">
          <p class="me-address-detail">
            {{ $t('order.forwardingAddress') }}：{{
              customAddress.warehouseReceiver
            }}{{ userNo }}
            <span class="me-pl-2 me-pr-2">{{
              customAddress.warehouseTelphone
            }}</span>
            {{ customAddress.province }}{{ customAddress.city
            }}{{ customAddress.region }}{{ customAddress.warehouseAddress }}
          </p>
          <!-- <a-checkbox
            v-decorator="[
              'isEnableAutoPackage',
              {
                valuePropName: 'checked',
                initialValue: true
              }
            ]"
            class="me-auto-package"
            :disabled="disabledForwarder"
          >
            {{ $t('order.usingSystemFF') }}<br />{{
              $t('order.usingSystemFF2')
            }}
          </a-checkbox> -->
        </a-form-item>
        <div v-show="invitationType == 0 || isBinding == false">
          <a-form-item v-show="bindBtn == true" label=" " class="me-unlabel">
            <a-button type="primary" @click="bindingPackage" class="binding-btn"
              >{{ $t('packages.string3') }}
              >
            </a-button>
          </a-form-item>
        </div>
      </div>
      <div v-else>
        <a-form-item :label="$t('order.selectForwarding')" key="hd2">
          <a-select
            class="me-select me-mr-2 me-w380"
            v-decorator="[
              'forwarding',
              {
                rules: [
                  { required: true, message: $t('packages.inputForwarderName') }
                ]
              }
            ]"
            :placeholder="$t('packages.inputForwarderName')"
            @change="customAddressChange"
            :disabled="disabledForwarder"
          >
            <a-select-option
              :value="item.addressId"
              v-for="item in addressList"
              :key="item.addressId"
            >
              {{ item.contacts }} {{ item.phone }} {{ item.province
              }}{{ item.city }}{{ item.region }}{{ item.street
              }}{{ item.detailedAddress }}
            </a-select-option> </a-select
          ><a-button
            type="link"
            @click="addressManageBtn"
            v-if="!disabledForwarder"
          >
            {{ $t('order.addressManage') }}
          </a-button>
          <p class="me-address-detail" v-if="customAddress">
            {{ $t('order.forwardingAddress') }}：{{ customAddress.contacts
            }}{{ userNo }}
            <span class="me-pl-2 me-pr-2">{{ customAddress.phone }}</span
            >{{ customAddress.province }}{{ customAddress.city
            }}{{ customAddress.region }}{{ customAddress.street
            }}{{ customAddress.detailedAddress }}
          </p>
        </a-form-item>
      </div>
      <div class="me-mt-3">
        <a-form-item :label="$t('order.relatedProducts')">
          <div class="me-goods-img-wrap">
            <a-checkbox
              v-for="(goods, key) in rowData.items"
              :key="key"
              v-model="goods.checkFlag"
              :disabled="goods.disFlag"
              ><img v-lazy="goods.imageUrl" class="me-goods-img"
            /></a-checkbox>
          </div>
        </a-form-item>
      </div>
      <div v-if="rowData.oneClick">
        <a-form-item :label="$t('order.orderLink')">
          <a-input
            autocomplete="off"
            class="me-input-link"
            @change="updateTime"
            placeholder="当前仅支持1688、拼多多商品链接的采购"
            @focus="getCollectionSource"
            @blur="purchaseUrlBlur"
            v-decorator="[
              'purchaseUrl',
              {
                rules: [
                  { required: true, message: '' },
                  { validator: checkLink }
                ]
              }
            ]"
          />
          <ul class="me-source-ul" v-show="collectionSourceList.length">
            <li
              v-for="(source, key) in collectionSourceList"
              :key="key"
              @click="handerSourceList(source)"
              :title="source.remarks"
            >
              {{ source.remarks }}
            </li>
          </ul>
          <!-- <a-button
            @click="purchaseFn"
            type="primary"
            class="me-mr-2"
            :loading="confirmLoading"
            >{{ $t('order.nowBuy') }} </a-button
          ><span v-if="isEditLink && form.getFieldValue('purchaseUrl')"
            >{{ lastTime }} {{ $t('common.modify') }}</span
          ><span v-if="!isEditLink && form.getFieldValue('purchaseUrl')"
            >{{ lastTime }} {{ $t('common.add') }}</span
          > -->
        </a-form-item>
      </div>
      <!-- <div v-if="rowData.oneClick">
        <a-form-item class="me-unlabel" label=" ">
          <p>{{ $t('order.zcPlatform') }}：1688、{{ $t('order.pinduoduo') }}</p>
        </a-form-item>
      </div> -->
      <div v-if="!rowData.oneClick">
        <div>
          <a-form-item :label="$t('order.orderChannel')">
            <a-radio
              v-decorator="[
                'offline',
                {
                  valuePropName: 'checked',
                  initialValue: true
                }
              ]"
              >{{ $t('order.offlineOther') }}</a-radio
            >
          </a-form-item>
        </div>
        <div>
          <a-form-item :label="$t('order.logisticsCompany')">
            <a-input
              class="me-w198"
              :maxLength="50"
              v-decorator="[
                'purchaseLogisticsName',
                {
                  rules: [
                    {
                      required: true,
                      message:
                        $t('order.pleaseInput') + $t('order.logisticsCompany')
                    }
                  ]
                }
              ]"
              :placeholder="
                $t('order.pleaseInput') + $t('order.logisticsCompany')
              "
            />
          </a-form-item>
          <a-form-item class="me-courier" :label="$t('order.courierNumber')">
            <a-input
              class="me-w198"
              :maxLength="50"
              v-decorator="[
                'purchaseLogisticsno',
                {
                  rules: [
                    {
                      required: true,
                      message:
                        $t('order.pleaseInput') + $t('order.courierNumber')
                    }
                  ]
                }
              ]"
              :placeholder="$t('order.pleaseInput') + $t('order.courierNumber')"
            />
          </a-form-item>
          <!-- <div class="me-one-click-footer">
            <a-button
              type="primary"
              class="me-mr-4"
              :loading="confirmLoading"
              @click="purchaseFn"
            >
              {{ $t('common.ok') }}
            </a-button>
            <a-button @click="oneClickOrderCancel()">{{
              $t('common.cancel')
            }}</a-button>
          </div> -->
        </div>
      </div>
    </a-form>
    <a-modal
      :title="$t('order.addressManage')"
      :visible="addressManageVisible"
      @cancel="cancelAddressPop"
      width="900px"
      :footer="false"
      :maskClosable="false"
    >
      <AddressManage />
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment'
import AddressManage from './AddressManage'
import Package from '@/api/package'
import Order from '@/api/order'
import { mapState } from 'vuex'
export default {
  props: {
    rowData: {
      type: Object
    },
    oneClickOrderCancel: {
      type: Function
    },
    getOrderList: {
      type: Function
    },
    plugPopShow: {
      type: Function
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.auth.userInfo
    }),
    bindBtn() {
      let isBind = false
      console.log(this.thirdPartyCode)
      if (this.isBinding == false && this.thirdPartyCode != null) {
        isBind = true
      }
      if (this.isBinding == true && this.thirdPartyCode != null) {
        isBind = null
      }
      return isBind
    }
  },
  components: {
    AddressManage
  },
  data() {
    return {
      moment,
      currData: '',
      form: this.$form.createForm(this),
      value: '',
      List: {},
      packageArry: [],
      warehouseList: [],
      companyList: [],
      lastTime: '',
      addressManageVisible: false,
      addressList: [],
      customAddress: '',
      confirmLoading: false,
      formData: {},
      editLinkLen: 1,
      isEditLink: false,
      disabledForwarder: false,
      isSystem: true,
      variationIdcur: '',
      userNo: '',
      isBinding: false,
      invitationType: '',
      thirdPartyCode: null,
      settleStyle: '',
      forwarderWarehouseList: [], //货代商仓库列表
      currItemId: '', //一键采购商品itemId
      collectionSourceList: []
    }
  },
  created() {
    //回显货代方式
    this.$nextTick(() => {
      let rowData = this.$props.rowData
      let currPurchaseDetail = rowData.items[rowData.index]?.purchaseDetail
      if (currPurchaseDetail) {
        this.$data.isSystem = currPurchaseDetail.isSysFw
        this.$data.form.setFieldsValue({
          isSysFw: currPurchaseDetail.isSysFw
        })
      } else if (sessionStorage.oneClickData) {
        let oneClickData = JSON.parse(sessionStorage.oneClickData)
        this.$data.isSystem = oneClickData['isSysFw']
        this.$data.form.setFieldsValue({
          isSysFw: oneClickData['isSysFw']
        })
      }
    })
  },
  async mounted() {
    this.$data.collectionSourceList = []
    this.$data.userNo = this.userInfo.memberNO
    let rowData = this.$props.rowData
    let params = {}
    // let res = await Package.getPackageList(params)
    // if (res.code == 0) {
    //   let packageArry = []
    //   let list = res.data
    //   list.forEach((item) => {
    //     packageArry.push({
    //       text: item.forwarderName,
    //       id: item.id
    //     })
    //   })
    //   this.packageArry = packageArry
    // }
    //this.isBindForwarder()
    this.getPackageWarehouseList() //获取货代商仓库

    let { data } = await Order.memberAddressList()
    this.$data.addressList = data
    let currPurchaseDetail = ''
    for (let i = 0; i < rowData.items.length; i++) {
      if (rowData.items[i].purchaseDetail) {
        //已经有一个商品有采购信息,不能改变货代信息
        this.$data.disabledForwarder = true
        currPurchaseDetail = rowData.items[i].purchaseDetail
        break
      }
    }

    //初始化选中数据
    rowData.items.forEach((item, index) => {
      // console.log(rowData.index, item.variationId)
      if (rowData.index == item.variationId) {
        //默认商品勾选不能取消

        this.$data.currItemId = item.itemId
        this.$data.variationIdcur = item.variationId
        // console.log(item.variationId, item.itemId, 999)
        this.$set(item, 'disFlag', true)
        this.$set(item, 'checkFlag', true)
        if (sessionStorage[this.$data.variationIdcur]) {
          this.$data.form.setFieldsValue({
            purchaseUrl: sessionStorage[this.$data.variationIdcur]
          })
        } else if (item.sourceUrl) {
          this.$data.form.setFieldsValue({
            purchaseUrl: item.sourceUrl
          })
        }
      } else {
        if (item.purchaseDetail) {
          //已经采购的不能勾选
          this.$set(item, 'disFlag', true)
        } else {
          this.$set(item, 'disFlag', false)
        }
        this.$set(item, 'checkFlag', false)
      }
    })

    //回显仓库
    if (currPurchaseDetail) {
      this.echoData(currPurchaseDetail, rowData)
    } else if (sessionStorage.oneClickData) {
      //临时保存填写的数据
      let oneClickData = JSON.parse(sessionStorage.oneClickData)
      this.echoData(oneClickData, rowData)
    }
  },

  methods: {
    purchaseUrlBlur() {
      setTimeout(() => {
        this.collectionSourceList = []
      }, 200)
    },
    //选择来源
    handerSourceList(item) {
      console.log(item.remarks)
      this.form.setFieldsValue({ purchaseUrl: item.remarks })
    },
    //获取采集来源
    async getCollectionSource(e) {
      if (!this.collectionSourceList.length && this.currItemId) {
        let { data } = await Order.shopeeProductExt(this.currItemId)
        this.collectionSourceList = data
      }
    },
    //获取货代商仓库列表
    getPackageWarehouseList() {
      Package.getPackageWarehouseList({
        ordersn: this.$props.rowData.ordersn
      }).then((res) => {
        const storeType = this.rowData.storeType //( 1 本土  2跨境  )
        let currency = this.rowData.currency // 站点
        const storeCountry = this.rowData.storeCountry //站点名称
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
        this.$data.forwarderWarehouseList = warehouseArry.concat(
          warehouseArryTemp
        )
        if (
          this.$data.forwarderWarehouseList.length > 0 &&
          !this.$data.forwarderWarehouseList[0].disabled
        )
          this.changeForwarderWarehouse(this.$data.forwarderWarehouseList[0].id)
      })
    },
    //改变货代商仓库
    changeForwarderWarehouse(val) {
      this.$data.customAddress = this.$data.forwarderWarehouseList.find(
        (item) => item.id == val
      )
      this.$data.form.setFieldsValue({
        fwStorageId: val.toString()
      })
    },
    //获取仓库是否有绑定仓库
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
            // this.id = item.id
            this.$data.form.setFieldsValue({
              forwarderId: item.id
            })
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
    //回显数据
    echoData(obj, rowData) {
      setTimeout(() => {
        let echoObj = {}
        if (obj.isSysFw) {
          //系统货代
          echoObj.fwId = obj['fwId']
          echoObj.isEnableAutoPackage = obj['isEnableAutoPackage']
          this.$data.thirdPartyCode = obj.thirdPartyCode
        } else {
          //自定义货代
          echoObj.forwarding = obj['forwarding']
            ? obj['forwarding']
            : obj['fwId']
          this.customAddressChange(echoObj.forwarding)
        }
        if (!rowData.oneClick) {
          //手动关联
          echoObj.purchaseLogisticsName = obj['purchaseLogisticsName']
          echoObj.purchaseLogisticsno = obj['purchaseLogisticsno']
        }
        // echoObj.purchaseUrl = obj['purchaseUrl']

        this.$data.form.setFieldsValue(echoObj)

        // if (obj['fwId']) {
        //   //获取仓库
        //   this.getWarehouse(obj['fwId'], obj['fwStorageId'])
        // }
        if (obj['fwStorageId']) {
          //获取仓库
          this.changeForwarderWarehouse(obj['fwStorageId'])
        }
      }, 200)
    },
    //切换类型
    addressTypeChange(e) {
      this.$data.isSystem = e.target.value
      this.$data.customAddress = ''
    },
    //自定义地址切换
    customAddressChange(val) {
      this.$data.customAddress = this.$data.addressList.find(
        (item) => item.addressId == val
      )
    },
    //获取地址列表
    async getAddressList() {
      let { data } = await Order.memberAddressList()
      this.$data.addressList = data
    },
    //1688,拼多多地址校验
    checkLink(rule, value, callback) {
      if (!value) {
        callback(this.$t('order.enterOrderLink'))
      } else {
        if (value.includes('1688.com') || value.includes('yangkeduo.com')) {
          callback()
        } else {
          callback(this.$t('order.enterOrderLink'))
        }
      }
      // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应 测试
    },
    //绑定货代商
    bindingPackage() {
      this.$router.push('/package/addforwarder')
    },
    //获取货代商列表
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
    //切换货代商列表
    packageChange(val) {
      this.$data.customAddress = ''
      this.getWarehouse(val)
      this.packageArry.forEach((item) => {
        if (val == item.value) {
          this.settleStyle = item.settleStyle
          this.thirdPartyCode = item.thirdPartyCode
        }
      })
    },
    //过滤仓库
    filterWarehouse(data) {
      let { storeType, currency } = this.$props.rowData
      let warehouse = []
      data.forEach((item) => {
        if (storeType == 2) {
          let site = item.warehouseSupportSiteList.filter(
            (site) => site.code == 'KJ'
          )
          console.log(site)
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
      console.log(warehouse)
      return warehouse
    },
    //获取仓库
    async getWarehouse(id, wid) {
      let params = {
        forwarderId: id
      }
      this.$data.form.setFieldsValue({
        fwStorageId: ''
      })

      let { data } = await Package.getWarehouse(params)
      this.$data.warehouseList = this.filterWarehouse(data)
      console.log(this.$data.warehouseList)
      if (this.$data.warehouseList.length) {
        this.$data.warehouseList.forEach((item) => {
          if (item.isDefault == 1 && !item.disabled) {
            this.$data.form.setFieldsValue({
              fwStorageId: item.id
            })
            this.$data.customAddress = item
          } else if (!item.disabled && wid == item.id) {
            this.$data.form.setFieldsValue({
              fwStorageId: item.id
            })
            this.$data.customAddress = item
          }
        })
      }
    },
    // //获取仓库
    // async getWarehouse(id, wid) {
    //   let params = {
    //     forwarderId: id
    //   }
    //   let res = await Package.getWarehouse(params)
    //   if (res.code == 0) {
    //     this.$data.warehouseList = res.data
    //     if (this.$data.warehouseList.length) {
    //       this.$data.form.setFieldsValue({
    //         fwStorageId: wid ? wid : this.$data.warehouseList[0].id
    //       })
    //       this.$data.customAddress = wid
    //         ? this.$data.warehouseList.find((item) => item.id == wid)
    //         : this.$data.warehouseList[0]
    //       console.log(this.$data.customAddress)
    //     }
    //   }
    // },

    //切换仓库
    warehouseListChange(val) {
      this.$data.customAddress = this.$data.warehouseList.find(
        (item) => item.id == val
      )
    },
    //更新时间
    updateTime() {
      this.$data.lastTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      if (this.$data.form.getFieldValue('purchaseUrl')) {
        this.$data.editLinkLen++
      }
      if (this.$data.editLinkLen > 1) {
        this.$data.isEditLink = true
      }
    },
    //地址管理弹窗
    addressManageBtn() {
      this.$data.addressManageVisible = true
    },
    //关闭地址管理
    cancelAddressPop() {
      this.$data.addressManageVisible = false
      this.getAddressList()
    },
    //保存数据
    saveFormData(values) {
      let { formData, customAddress } = this.$data
      console.log(formData, customAddress)
      formData = values
      // formData.invitationType = this.invitationType
      formData.thirdPartyCode = this.thirdPartyCode
      if (customAddress) {
        formData.fwId = customAddress.forwarderInfoId //货代商id
        formData.fwStorageId = customAddress.id //仓库id
        formData.street = customAddress.street
        formData.streetCode = customAddress.streetCode
        formData.province = customAddress.province
        formData.provinceCode = customAddress.provinceCode
        formData.city = customAddress.city
        formData.cityCode = customAddress.cityCode
        formData.region = customAddress.region
        formData.regionCode = customAddress.regionCode
        formData.detailedAddress = customAddress.detailedAddress
          ? customAddress.detailedAddress
          : customAddress.warehouseAddress
        formData.contacts = customAddress.contacts
          ? customAddress.contacts
          : customAddress.warehouseReceiver
        formData.phone = customAddress.phone
          ? customAddress.phone
          : customAddress.warehouseTelphone
        formData.fullAddress =
          customAddress.province +
          customAddress.city +
          (customAddress.region ? customAddress.region : '') +
          (customAddress.detailedAddress
            ? customAddress.detailedAddress
            : customAddress.warehouseAddress)
      }
      if (!formData.isSysFw) {
        formData.isEnableAutoPackage = false
        formData.fwId = values.forwarding
      } else {
        formData.isEnableAutoPackage = true
      }
      formData.ordersn = this.rowData.ordersn
      formData.storeId = this.rowData.storeId

      formData.orderPurchaseVariationsVO = []
      this.rowData.items.forEach((item, index) => {
        if (item.checkFlag) {
          formData.orderPurchaseVariationsVO.push({
            variationsId: item.variationId,
            mainGoods: this.$props.rowData.index == index ? true : false,
            ...item
          })
        }
      })

      if (!this.$props.rowData.oneClick) {
        //手动关联
        formData.relationType = 1
      }
      return formData
    },
    //去下单
    purchaseFn() {
      const show = () => {
        const PluginNode = document.querySelector(
          '#emalacca-chrome-extension-installed'
        )
        if (this.$props.rowData.oneClick && !PluginNode) {
          // this.$Message({ type: 'error', content: '请安装马六甲采集插件' })
          this.$props.plugPopShow()
          return false
        }
        if (
          this.$props.rowData.oneClick &&
          PluginNode.getAttribute('version').replace(/\./g, '') < 145
        ) {
          this.$Message({ type: 'error', content: '插件版本过低，请升级' })
          return false
        }
        return true
      }
      // hasPlugin=1
      if (/^\/oms/.test(this.$route.path)) {
        if (!(this.$route.query.hasPlugin === '1')) {
          return show()
        }
      } else {
        if (!show()) {
          return
        }
      }
      let _this = this
      this.$data.form.validateFields(async (err, values) => {
        if (!err) {
          let formData = this.saveFormData(values)
          if (this.thirdPartyCode != null && formData.isSysFw) {
            if (this.isBinding == false) {
              this.errorAlert(this.$t('packages.string4'))
              return false
            }
          }
          this.$data.confirmLoading = true
          let res = await Order.orderPurchasePlace(formData)
          this.confirmLoading = false
          if (res.code == 0) {
            if (!formData.relationType) {
              _this.rowData.items = formData.orderPurchaseVariationsVO
              this.handlePurchas(Object.assign(res.data, _this.rowData))
            }
            if (!this.$props.rowData.oneClick) {
              this.$Message({
                type: 'success',
                content: '关联成功'
              })
            }
            this.getOrderList()
            this.oneClickOrderCancel()
          }
        }
      })
    },
    /**
     * 采购下单，与插件强关联，需要判断是否安装插件及插件版本必须高于1.3.3
     */
    handlePurchas(orderInfo) {
      // const PluginNode = document.querySelector(
      //   '#emalacca-chrome-extension-installed'
      // )
      // if (!PluginNode) {
      //   this.$Message({ type: 'error', content: '请安装马六甲采集插件' })
      // }
      // if (PluginNode.getAttribute('version').replace(/\./g, '') < 132) {
      //   this.$Message({ type: 'error', content: '插件版本过低，请升级' })
      // }
      if (/^\/oms/.test(this.$route.path)) {
        window.parent.postMessage(
          {
            action: 'init-purchas-order',
            params: {
              orderInfo: orderInfo,
              purchasLink: orderInfo.purchaseUrl
            }
          },
          '*'
        )
      } else {
        window.postMessage(
          {
            action: 'init-purchas-order',
            params: {
              orderInfo: orderInfo,
              purchasLink: orderInfo.purchaseUrl
            }
          },
          '*'
        )
      }
    }
  },
  beforeDestroy() {}
}
</script>

<style lang="scss" scoped>
.me-input-link {
  width: 486px;
  margin-right: 10px;
}
.me-select {
  width: 200px;
}
.me-goods-img-wrap {
  display: inline-block;
  width: 510px;
  ::v-deep .ant-checkbox-wrapper {
    margin: 0 10px 5px 0;
  }
}

.me-goods-img {
  width: 80px;
  height: 80px;
  margin-right: 5px;
}
.me-address-detail {
  background: #f7f7f7;
  margin-top: 3px;
  padding: 10px;
  font-size: 12px;
  line-height: 14px;
  width: 487px;
}
.me-auto-package {
  line-height: 16px;
  ::v-deep .ant-checkbox + span {
    display: inline-block;
    vertical-align: top;
    font-size: 12px;
  }
}
.me-one-click-form {
  ::v-deep .ant-form-item > .ant-form-item-label {
    width: 130px;
    margin-right: 5px;
    overflow: hidden;
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
.me-pl205 {
  padding-left: 205px;
}
.me-pl80 {
  padding: 10px 0 10px 135px;
}
.me-one-click-footer {
  text-align: center;
  margin-top: 20px;
}
.me-w198 {
  width: 198px;
}
.me-w241 {
  width: 241px;
}

.me-w380 {
  width: 380px;
}

.me-source-ul {
  width: 485px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
  max-height: 300px;
  overflow-y: auto;
  position: absolute;
  top: 28px;
  left: 0px;
  z-index: 2;
  li {
    line-height: 36px;
    padding: 0px 10px;
    height: 36px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
    cursor: pointer;
    &:hover {
      background-color: #fff6f0;
    }
  }
}
</style>
