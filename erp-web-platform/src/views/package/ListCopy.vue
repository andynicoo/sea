<template>
  <div class="me-ma-2">
    <a-page-header class="me-page-header" :title="title"> </a-page-header>
    <a-layout class="me-page-layout">
      <div class="me-page-search">
        <a-form class="me-search-form" layout="inline">
          <a-form-item :label="$t('packages.packageNo')">
            <a-input
              v-model="packageNo"
              allowClear
              style="width:190px"
            ></a-input>
          </a-form-item>
          <a-form-item :label="$t('packages.orderNo')">
            <a-input
              v-model="platformOrderNo"
              allowClear
              style="width:190px"
            ></a-input>
          </a-form-item>
          <a-form-item :label="$t('packages.expressNo')">
            <a-input
              v-model="expressNo"
              style="width:190px"
              allowClear
            ></a-input>
          </a-form-item>
          <!-- <a-form-item :label="$t('packages.packageStatus')">
            <a-select
              v-model="selectStatus"
              style="width:190px"
              option-label-prop="label"
              allowClear
            >
              <a-select-option
                v-for="item in packageArry"
                :key="item.value"
                :value="item.value"
                :label="item.text"
                >{{ item.text }}</a-select-option
              >
            </a-select>
          </a-form-item> -->
          <a-form-item :label="$t('packages.ownStatus')">
            <a-select
              v-model="selectAccount"
              style="width:190px"
              option-label-prop="label"
              allowClear
            >
              <a-select-option
                v-for="item in accountArry"
                :key="item.value"
                :value="item.value"
                :label="item.text"
              >
                {{ item.text }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :label="$t('order.orderCreateTime')">
            <a-range-picker
              v-model="createTime"
              :placeholder="[$t('order.startTime'), $t('order.endTime')]"
              format="YYYY-MM-DD"
              valueFormat="YYYY-MM-DD"
              style="width:190px"
              @change="handleChangeOrderDateRange"
              allowClear
            />
          </a-form-item>
          <a-form-item>
            <a-button depressed type="primary" @click="search">
              {{ $t('common.searchit') }}
            </a-button>
            <a-button @click="reset" class="me-ml-2">{{
              $t('common.reset')
            }}</a-button>
          </a-form-item>
        </a-form>
      </div>
    </a-layout>

    <TabStatus
      v-if="$route.path != '/order/out'"
      :order-status-type-opts="orderStatusTypeOpts"
      @changeStatus="changeStatus"
    >
      <template #export>
        <a-button class="me-mr-2" @click="exportData">
          <div>{{ $t('packages.exportData') }}</div>
        </a-button>
      </template>
    </TabStatus>

    <div class="list-box">
      <div class="list-header-box">
        <div class="list-header-order list-header-content">
          <div class="list-order-text">{{ $t('packages.productInfo') }}</div>
        </div>
        <div class="list-header-buy-m list-header-content">
          {{ $t('packages.buyerInfo') }}
        </div>
        <div class="list-header-buy-m list-header-content">
          {{ $t('packages.logisticsTitle') }}
        </div>
        <div class="list-header-buy-m list-header-content">
          {{ $t('packages.packageInfo') }}
        </div>
        <div class="list-header-logistics-m list-header-content">
          {{ $t('packages.expressInfo') }}
        </div>
      </div>
      <!-- 订单列表部分 -->
      <PackageList
        :orderList="orderList"
        @detailsOper="detailsOper"
        @viewImg="viewImger"
        @addRemark="addRemark"
        @addCost="addCost"
        @deleteRecord="deleteRecord"
        @refuseRecord="refuseRecord"
        @setListData="setListData"
        @addExpress="addExpress"
        @updataList="getOrderList"
      ></PackageList>
      <div class="no-dataText" v-show="!orderList.length">
        <img style="margin-top: 56px" src="@/assets/images/no-data.png" />
        <p>{{ $t('common.noData') }}</p>
      </div>
    </div>
    <div class="pagination" v-show="orderList.length">
      <a-pagination
        v-if="pagination.total > 10"
        v-bind="pagination"
        @change="changePage"
        @showSizeChange="showSizeChange"
      ></a-pagination>
    </div>
    <!-- 货代备注弹窗 -->
    <DialogRemark
      :dialogRemark="dialogRemark"
      @cancle="cancleRemark"
      @setRemark="setRemark"
    ></DialogRemark>
    <!-- 添加附加费的弹窗 -->
    <DialogCost
      :dialogCost="dialogCost"
      @refuse="refuse"
      @receive="receive"
      @cancle="cancleCost"
      :costInfo="costInfo"
      @viewImg="viewImger"
    ></DialogCost>
    <!-- 操作详情的弹窗 -->
    <DialogDetials
      :dialogDetials="dialogDetials"
      @cancel="cancelDetails()"
      :detialsList="detialsList"
    />
    <!-- 图片放大的弹窗 -->
    <!-- <ViewImg
      :imgUrl="imgUrl"
      :dialogImg="dialogImg"
      @cancle="cancleView"
    ></ViewImg> -->
  </div>
</template>

<script>
import Order from '@/api/order'
import Package from '@/api/package'
import DialogRemark from './components/DialogRemark'
import DialogCost from './components/DialogCost'
import DialogDetials from './components/DialogDetials'
import PackageList from './components/PackageList'
import TabStatus from './components/TabStatus'
import { downloadFile } from '@/util/index'
import { mapState } from 'vuex'

const initPatination = {
  current: 1,
  pageSize: 10,
  showQuickJumper: true,
  showSizeChanger: true,
  total: 0
}
export default {
  components: {
    DialogRemark,
    DialogDetials,
    DialogCost,
    PackageList,
    TabStatus
  },

  data() {
    return {
      orderStatusTypeOpts: [],
      imgUrl: '',
      dialogImg: '',
      isEdit: true,
      // date: new Date().toISOString().substr(0, 10),
      date: '',
      menu2: false,
      dialogDetials: false,
      dialogCost: false,
      remark: '',
      dialogRemark: false,
      foucusActive: false,
      packageState: '',
      createTime: [],
      pagination: {
        ...initPatination,
        showTotal: (total) =>
          `${this.$t('order.total')}${total}${this.$t('order.data')}`
      },
      orderList: [],
      packageArry: [
        {
          text: this.$t('packages.all'),
          value: ''
        },
        {
          text: this.$t('packages.package1'),
          value: 0
        },
        {
          text: this.$t('packages.package2'),
          value: 1
        },
        {
          text: this.$t('packages.package3'),
          value: 2
        },
        {
          text: this.$t('packages.package4'),
          value: 3
        },
        {
          text: this.$t('packages.package5'),
          value: 4
        }
      ],
      accountState: '',
      accountArry: [
        {
          text: this.$t('packages.all'),
          value: ''
        },
        {
          text: this.$t('packages.package6'),
          value: 0
        },
        {
          text: this.$t('packages.package7'),
          value: 1
        }
      ],
      switch1: true,
      editIndex: 0,
      expressIndex: 0,
      remarkIndex: 0,
      costIndex: 0,
      costInfo: {},
      detialsList: [],
      packageNo: '',
      expressNo: '',
      platformOrderNo: '',
      startTitle: this.$t('packages.startTitle'),
      endTitle: this.$t('packages.endTitle'),
      startTime: '',
      endTime: '',
      selectStatus: null,
      selectAccount: null,
      vtabIndex: 0
    }
  },
  computed: {
    ...mapState({
      title: (state) => state.vars?.menuName
    })
  },
  created() {
    this.platformOrderNo = this.$route.query.platformOrderNo
    this.expressNo = this.$route.query.expressNo
  },
  mounted() {
    // 获取订单列表
    if (this.$route.query.id) {
      this.platformOrderNo = this.$route.query.id
    }

    //出库页面只展示已出库订单
    if (this.$route.path === '/order/out') {
      this.selectStatus = 3
    } else if (this.$route.path === '/order/recorded') {
      this.getOrderStatusType()
      this.selectStatus = 0
    } else {
      this.getOrderStatusType()
    }
    this.getOrderList()
  },
  methods: {
    exportData() {
      let params = {
        packageNo: this.packageNo,
        expressNo: this.expressNo,
        platformOrderNo: this.platformOrderNo,
        packageStatus: this.selectStatus,
        creditStatus: this.selectAccount,
        startTime: this.startTime,
        endTime: this.endTime
      }
      console.log(params)
      Package.packageExport(params).then((res) => {
        console.log(res)
        downloadFile(res, '包裹列表')
      })
    },
    /**
     * 包裹切换状态
     * @param item
     */
    changeStatus(item) {
      this.selectStatus = item.packageStatus
      this.getOrderList()
    },

    /**
     * 获取订单类型
     */
    getOrderStatusType() {
      Package.getPackageStatusType({}).then(({ data }) => {
        if (this.type == 0) {
          data.splice(0, 0, {
            count: data.reduce((prev, curr) => {
              return curr.count + prev
            }, 0),
            requestParam: '',
            type: this.$t('common.all')
          })
        }
        this.orderStatusTypeOpts = data
      })
    },

    changePage(page, pageSize) {
      this.pagination.current = page
      this.pagination.pageSize = pageSize
      this.getOrderList()
    },

    //
    search() {
      this.getOrderList()
    },
    // 获取订单列表
    getOrderList() {
      const { current, pageSize: size } = this.pagination

      let params = {
        packageNo: this.packageNo,
        expressNo: this.expressNo,
        platformOrderNo: this.platformOrderNo,
        packageStatus: this.selectStatus,
        creditStatus: this.selectAccount,
        startTime: this.startTime,
        endTime: this.endTime,
        size: size,
        current: current
      }
      Package.getList(params).then((res) => {
        //console.log(res);
        if (res.code == 0) {
          let ordersnArry = []
          this.orderList = res.data.records
          res.data.records.forEach((item) => {
            ordersnArry.push(item.ordersn)
          })
          this.ordersnArry = ordersnArry
          this.pagination.total = res.data?.total ?? 0
        }
      })
    },
    foucusInput() {
      this.foucusActive = true
    },
    blurInput() {
      this.foucusActive = false
    },
    reset() {
      this.packageNo = ''
      this.platformOrderNo = ''
      this.expressNo = ''
      this.selectAccount = ''
      this.startTime = ''
      this.endTime = ''
      this.createTime = []
      this.getOrderList()
      //this.$refs.form.reset()
    },

    handleChangeOrderDateRange(date) {
      this.startTime = date[0] + ' 00:00:00'
      this.endTime = date[1] + ' 23:59:59'
    },

    showSizeChange(current, size) {
      this.pagination.pageSize = size
      this.getOrderList()
    },

    // 取消操作详情
    cancelDetails() {
      console.log('close')
      this.dialogDetials = false
      this.detialsList = []
    },

    // 操作详情
    detailsOper(index) {
      let packageId = this.orderList[index].packageInfo.id
      this.getDetails(packageId)
      this.dialogDetials = true
    },
    // 获取操作记录
    getDetails(packageId) {
      let params = {
        packageId: packageId
      }
      Package.getDetailsList(params).then((res) => {
        if (res.code == 0) {
          this.detialsList = res.data
        }
      })
    },
    // 添加货代备注
    addRemark(index) {
      this.dialogRemark = true
      this.remarkIndex = index
    },
    // 设置备注
    setRemark(remark) {
      let params = {
        packageId: this.orderList[this.remarkIndex].packageInfo.id,
        sellerNotes: remark
      }
      Package.setRemark(params).then((res) => {
        if (res.code == 0) {
          this.dialogRemark = false
          this.getOrderList()
        }
      })
    },
    // 取消货代备注弹窗
    cancleRemark() {
      this.dialogRemark = false
    },
    // 取消附加费弹窗
    cancleCost() {
      this.costInfo = {}
      this.dialogCost = false
    },
    // 添加附加费
    addCost(index) {
      console.log(index)
      this.costInfo = this.orderList[index].feeApply
      this.dialogCost = !this.dialogCost
      this.costIndex = index
      console.log(this.costInfo)
    },
    // 拒绝附加费
    refuse() {
      let params = {
        feeApplyId: this.orderList[this.costIndex].feeApply.id,
        feeApplyNo: this.orderList[this.costIndex].feeApply.feeApplyNo,
        packageId: this.orderList[this.costIndex].packageInfo.id
      }
      Package.refuse(params).then((res) => {
        if (res.code == 0) {
          this.dialogCost = false
          this.successAlert(this.$t('packages.succeAlert'))
          this.getOrderList()
        }
      })
    },
    // 接受附加费
    receive() {
      let params = {
        feeApplyId: this.orderList[this.costIndex].feeApply.id,
        feeApplyNo: this.orderList[this.costIndex].feeApply.feeApplyNo,
        packageId: this.orderList[this.costIndex].packageInfo.id
      }
      Package.agree(params).then((res) => {
        if (res.code == 0) {
          this.dialogCost = false
          this.getOrderList()
        }
      })
    },
    //图片放大取消
    cancleView() {
      this.dialogImg = false
    },
    isCanEdit() {
      this.isEdit = !this.isEdit
    },
    viewImger(src) {
      if (!src) return false
      this.dialogImg = true
      this.imgUrl = src
    },
    deleteRecord(data, bool = false) {
      this.editIndex = data.editIndex
      this.expressIndex = data.expressIndex
      if (bool) {
        this.sureDetele()
        return false
      }

      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('common.deleteConfirm'),
        onOk: async () => {
          this.sureDetele()
        }
      })
    },
    //拒收
    refuseRecord(data) {
      this.confirmModal(
        this.$t('common.refuseConfirm1') +
          data.expressNo +
          this.$t('common.refuseConfirm2'),
        this,
        () => {
          this.refuseSubmit({
            packageId: data.packageId,
            epackageId: data.epackageId
          })
        }
      )
    },
    // 确认拒收物流
    refuseSubmit(params) {
      Package.refuseExpress(params).then((res) => {
        this.successAlert(this.$t('common.handlerSuccess'))
        this.getOrderList()
      })
    },
    // 确认删除
    sureDetele() {
      let epackageId = this.orderList[this.editIndex].packageInfo.epackageList[
        this.expressIndex
      ].epackageId
      let params = {
        epackageId: epackageId,
        expressNo: this.orderList[this.editIndex].packageInfo.epackageList[
          this.expressIndex
        ].expressNo,
        packageId: this.orderList[this.editIndex].packageInfo.id
      }
      if (epackageId) {
        this.deleteExpressData(params)
      } else {
        this.orderList[this.editIndex].packageInfo.epackageList.splice(
          this.expressIndex,
          1
        )
      }
    },
    cancleDetele() {
      this.dialogData.show = false
    },
    setListData(item, bool = false) {
      this.orderList[item.index].packageInfo.epackageList[
        item.editIndex
      ].add = false
      if (bool) {
        this.deleteRecord(
          { editIndex: item.index, expressIndex: item.editIndex },
          bool
        )
        return false
      }
      let isAdd = false
      let packageArry = this.orderList[item.index].packageInfo.epackageList
      if (
        item.value ==
        this.orderList[item.index].packageInfo.epackageList[item.editIndex]
          .expressNo
      )
        return false
      for (let i in packageArry) {
        if (item.value == packageArry[i].expressNo && item.value != '') {
          isAdd = true
        }
      }
      if (isAdd) {
        this.errorAlert(this.$t('packages.orderNoIsHad'))
        return false
      }
      this.orderList[item.index].packageInfo.epackageList[
        item.editIndex
      ].expressNo = item.value
      let id = this.orderList[item.index].packageInfo.epackageList[
        item.editIndex
      ].epackageId
      if (id) {
        this.setExpressData(item)
      } else {
        this.addExpressData(item)
      }
    },
    // 修改快递单号
    setExpressData(item) {
      let params = {
        epackageId: this.orderList[item.index].packageInfo.epackageList[
          item.editIndex
        ].epackageId,
        expressNo: item.value,
        packageId: this.orderList[item.index].packageInfo.id
      }
      Package.setExpressData(params).then((res) => {
        if (res.code == 0) {
          this.getOrderList()
        }
      })
    },
    addExpress(index) {
      this.orderList[index].packageInfo.epackageList.push({
        expressNo: '',
        epackageReceiveStatus: 0,
        add: true
      })
    },
    // 增加快递单号的提交
    addExpressData(item) {
      let params = {
        expressNo: item.value,
        packageId: this.orderList[item.index].packageInfo.id
      }
      Package.addExpressData(params).then((res) => {
        if (res.code == 0) {
          this.getOrderList()
        }
      })
    },
    // 删除快递单号
    deleteExpressData(params) {
      Package.deleteExpressData(params).then((res) => {
        if (res.code == 0) {
          this.orderList[this.editIndex].packageInfo.epackageList.splice(
            this.expressIndex,
            1
          )
          this.getOrderList()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: flex-end;
  background: #fff;
  margin-top: 20px;
  padding: 20px;
}
.search-content {
  background: #fff;
  border-radius: 2px;
  button {
    margin-right: 20px;
  }
  .scan-content {
    .input-item {
      border: 2px solid;
      border-radius: 4px;
      height: 52px;
      background: none !important;
      .v-input__slot {
        box-shadow: none !important;
      }
    }
    .justify-item {
      display: flex;
      .input-item {
        width: 500px;
        margin: 0 10px;
      }
    }
  }
}
.list-box {
  border-radius: 5px;
  .list-header-box {
    margin-top: 10px;
    display: flex;
    background-color: #fff;
    height: 42px;
    border-bottom: 1px solid #ebebeb;
    line-height: 42px;
    .list-header-content {
      // padding-left: 20px;
      font-size: 13px;
      font-weight: bold;
    }
    .list-header-order {
      display: flex;
      width: 30%;
      .list-order-text {
        flex: 1;
        text-align: center;
      }
      .v-input--selection-controls {
        margin-top: 3px;
      }
    }
    .list-header-p {
      text-align: center;
      width: 15%;
    }
    .list-header-buy-m {
      text-align: center;
      width: 15%;
    }
    .list-header-logistics-m {
      text-align: center;
      width: 25%;
    }
  }

  .no-dataText {
    height: 500px;
    background: #fff;
    text-align: center;
    color: #999;
    font-size: 14px;
  }
}
</style>

<style lang="scss">
.package-list {
  .v-input__prepend-outer {
    margin-top: 8px;
  }
}
</style>
