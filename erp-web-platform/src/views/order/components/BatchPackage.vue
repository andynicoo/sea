<template>
  <a-modal
    title="批量代打包"
    :visible="showModal"
    @cancel="showModal = false"
    @ok="submit"
    width="600px"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 17 }">
      <a-form-item label="可代打包">
        {{ packOrderList.length }}个订单（共选{{ selectedRows.length }}个订单）
      </a-form-item>
      <a-form-item label="选择仓库">
        <a-select
          v-decorator="[
            'warehouseId',
            {
              rules: [{ required: true, message: '请选择仓库' }]
            }
          ]"
          placeholder="请选择仓库"
          @change="changeWarehouse"
        >
          <a-select-option
            :value="item.id"
            v-for="item in warehouseList"
            :key="item.id"
          >
            {{ item.warehouseName }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="仓库可收订单">
        <div v-if="form.getFieldValue('warehouseId')">
          <span class="me-status-success"
            >{{ this.warehousingOrderList.length }}个订单</span
          >（<span class="me-status-error"
            >{{
              packOrderList.length - this.warehousingOrderList.length
            }}个订单仓库不支持，因为订单站点问题</span
          >）
        </div>
        <span v-else>选择仓库后可查看此仓库支持接收代打包订单数量</span>
      </a-form-item>
      <a-form-item
        class="me-mb-1"
        v-for="(k, index) in form.getFieldValue('keys')"
        :key="k"
        v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel"
        :label="index === 0 ? '物流单号' : ''"
        :required="false"
      >
        <a-input
          v-decorator="[
            `names[${k}]`,
            {
              validateTrigger: ['change', 'blur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请输入物流单号'
                }
              ]
            }
          ]"
          placeholder="请输入物流单号"
          style="width: 60%; margin-right: 8px"
        />
        <span
          v-if="
            form.getFieldValue('keys').length < 100 &&
              index == form.getFieldValue('keys').length - 1
          "
          class="me-status-link me-cp me-ml-2"
          @click="add"
          >添加单号</span
        >
        <span
          v-if="form.getFieldValue('keys').length > 1"
          class="me-status-error me-cp me-ml-2"
          @click="remove(k)"
          >删除</span
        >
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
let id = 2
// import fmMixins from './mixins'
import Package from '@/api/package'
export default {
  // mixins: [fmMixins],
  props: {
    selectedRows: {
      type: Array
    },
    packageInfo: {}
  },
  watch: {
    showModal(newV) {
      if (!this.warehouseList.length && newV) {
        Package.getPackageWarehouseList().then((res) => {
          this.warehouseList = res.data
        })
      }
      this.packOrderList = []
      this.selectedRows.forEach((item) => {
        if (this.behalfPackages(item)) {
          this.packOrderList.push(item)
        }
      })
    }
  },
  // computed:{
  //   warehouseListLen(){
  //     return
  //   }
  // },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'dynamic_form_item' })
    this.form.getFieldDecorator('keys', { initialValue: [1], preserve: true })
  },
  data() {
    return {
      formItemLayout: {
        labelCol: {
          span: 6
        },
        wrapperCol: { span: 17 }
      },
      formItemLayoutWithOutLabel: {
        wrapperCol: { span: 17, offset: 6 }
      },
      showModal: false,
      confirmLoading: false,
      warehouseList: [], //可用仓库
      packOrderList: [], //可打包订单
      warehousingOrderList: [], //可入库订单,
      currWarehouse: ''
    }
  },
  methods: {
    remove(k) {
      const { form } = this
      // can use data-binding to get
      const keys = form.getFieldValue('keys')
      // We need at least one passenger
      if (keys.length === 1) {
        return
      }
      form.setFieldsValue({
        keys: keys.filter((key) => key !== k)
      })
    },
    add() {
      const { form } = this
      // can use data-binding to get
      const keys = form.getFieldValue('keys')
      keys.push(id++)
      form.setFieldsValue({
        keys
      })
    },
    //订单是否可代打包下单
    behalfPackages(item) {
      let flag = true
      if (item.orderShopeeOrderPackageDTOS.length > 1) {
        let packLen = 0
        item.orderShopeeOrderPackageDTOS.forEach((item) => {
          if (item.forwarderExpressPackages) {
            packLen = packLen + 1
          }
        })
        if (packLen == item.orderShopeeOrderPackageDTOS.length) {
          flag = false
        }
      } else {
        if (item.forwarderExpressPackages) {
          flag = false
        } else {
          flag = true
        }
      }
      return flag
    },
    //修改仓库
    changeWarehouse(value) {
      this.currWarehouse = this.warehouseList.filter(
        (item) => value == item.id
      )[0]
      let supportSiteCode
      this.warehousingOrderList = []
      supportSiteCode = this.currWarehouse.supportSiteCode.split('|')
      if (supportSiteCode.includes('KJ')) {
        this.packOrderList.forEach((order) => {
          if (order.storeType == 2) {
            this.warehousingOrderList.push(order)
          }
        })
      }
      this.packOrderList.forEach((order) => {
        if (supportSiteCode.includes(order.currency) && order.storeType != 2) {
          this.warehousingOrderList.push(order)
        }
      })
    },

    //快递单号校验
    checkTracking(rule, value, callback) {
      if (
        value != undefined &&
        /^[A-Za-z0-9 ]+$/.test(value) &&
        value.length < 50
      ) {
        callback()
        return
      }
      callback('请输入正确的快递单号')
    },
    // //提交
    submit() {
      if (!this.warehousingOrderList.length)
        return this.$message.warning('仓库不支持所选订单打包')
      this.form.validateFields(async (err, values) => {
        if (!err) {
          let params = []
          let forwarderId = this.currWarehouse.forwarderInfoId
          let warehouseId = this.currWarehouse.id
          console.log(forwarderId, warehouseId)
          let expressInfoList = []
          values.names.forEach((ele) => {
            if (ele) expressInfoList.push({ expressNo: ele, packageType: 1 })
          })
          this.warehousingOrderList.forEach((order) => {
            if (order.orderShopeeOrderPackageDTOS.length > 1) {
              order.orderShopeeOrderPackageDTOS.forEach((pack) => {
                if (!pack.forwarderExpressPackages) {
                  params = params.concat(
                    this.handlerParams(
                      pack,
                      expressInfoList,
                      forwarderId,
                      warehouseId
                    )
                  )
                }
              })
            } else {
              params = params.concat(
                this.handlerParams(
                  order,
                  expressInfoList,
                  forwarderId,
                  warehouseId
                )
              )
            }
          })
          this.$confirm({
            title: '是否确定提交？',
            content: (
              <div>
                <p class="me-unbind-tip">只批量提交此仓库可接收的订单</p>
              </div>
            ),
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
              Package.addBatchPackage(params)
                .then((res) => {
                  this.confirmLoading = false
                  this.successAlert('操作成功!')
                  this.showModal = false
                  this.$emit('submit')
                })
                .catch(() => {
                  this.confirmLoading = false
                })
            }
          })
        }
      })
    },
    handlerParams(order, expressInfoList, forwarderId, warehouseId) {
      let params = []
      let itemList = []
      let items = order.items ? order.items : order.list
      items.forEach((goods) => {
        itemList.push({
          expressInfoList,
          itemId: goods.id
        })
      })
      params.push({
        forwarderId,
        warehouseId,
        itemList,
        packageNumber: order.packageNumber,
        platformOrderNo: order.ordersn
      })
      return params
    }
  }
}
</script>
<style lang="scss" scoped>
.me-w180 {
  width: 180px;
}
</style>
