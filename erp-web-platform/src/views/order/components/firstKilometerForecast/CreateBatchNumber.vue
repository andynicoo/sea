<template>
  <div>
    <!-- 生成揽货批次号-->
    <dl class="me-createBatchNum-item me-bgf8 me-pt-2 me-pb-1">
      <!-- <dt>选择店铺</dt> -->
      <dd><span class="me-label">平台:</span>Shopee</dd>
      <dd class="me-w70">
        <span class="me-label">站点:</span>
        <div class="me-site-item">
          <a-checkbox
            :indeterminate="siteIndeterminate"
            :checked="siteCheckAll"
            @change="siteCheckAllChange"
          >
            全选
          </a-checkbox>
          <a-checkbox-group
            v-model="siteCheckedList"
            :options="siteOptions"
            @change="siteChange"
          >
            <span
              class="me-em1"
              slot="label"
              :title="option.name + '(' + option.value + ')'"
              slot-scope="option"
              >{{ option.name + '(' + option.value + ')' }}</span
            >
          </a-checkbox-group>
        </div>
      </dd>
      <dd class="me-w70">
        <span class="me-label">店铺:</span>
        <div class="me-tip12" v-if="!shopOptions.length">请选择站点</div>
        <div class="me-shop-item" :class="{ 'me-open': openClose }" v-else>
          <a-checkbox
            :indeterminate="shopIndeterminate"
            :checked="shopCheckAll"
            @change="shopCheckAllChange"
          >
            全选
          </a-checkbox>
          <a-checkbox-group
            v-model="shopCheckedList"
            :options="shopOptions"
            @change="shopChange"
          >
            <span slot="label" slot-scope="option">
              <a-tooltip placement="topLeft">
                <template slot="title">
                  {{ option.name }}
                </template>
                <span class="me-em1">{{ option.name }}</span>
              </a-tooltip>
            </span>
          </a-checkbox-group>
          <span
            v-if="shopOptions.length"
            class="me-open-close me-status-link me-cp"
            @click="shopOpenClose"
          >
            <span v-if="openClose">收起<a-icon type="up"/></span>
            <span v-else>展开<a-icon type="down"/></span>
          </span>
        </div>
      </dd>
    </dl>
    <div class="me-createBatchNum me-bgf8 me-pb-2">
      <dl class="me-createBatchNum-item">
        <dd>
          <span class="me-label me-pt-1">取货日期:</span
          ><a-date-picker
            :disabled-date="disabledDate"
            @change="pickDateChange"
            :format="dateFormat"
          />
        </dd>
        <dd>
          <span class="me-label me-pt-1">批次号数量/天:</span
          ><a-input-number
            placeholder="请输入"
            v-model="quantity"
            :min="1"
            :max="20"
            :precision="0"
            class="me-num-text"
          />
          <a-tooltip>
            <template slot="title"> 日均批次号数量需要不大于20 </template>
            <a-icon type="question-circle" class="me-ml-1" />
          </a-tooltip>
        </dd>
        <dd>
          <span class="me-label me-pt-1"></span
          ><a-button @click="createBatchNumberOk" type="primary"
            >生成批次号</a-button
          >
        </dd>
      </dl>
      <dl class="me-createBatchNum-item me-ml-10">
        <!-- <dt>揽货地址（首公里）</dt> -->
        <dd>
          <span class="me-label me-pt-1">揽货地址（首公里）:</span>
          <div class="me-address" v-if="selectedAddress">
            <p>
              <span
                class="me-status-link me-fr me-cp me-ml-2 me-f12"
                @click="addAddress('addressChangeVisible')"
                >更改</span
              >{{ selectedAddress.name }} {{ selectedAddress.phone }}
              <a-tag color="green">默认</a-tag>
            </p>
            <p class="me-address-txt">
              {{ selectedAddress.fullAddress }}<br />
              {{ selectedAddress.country }} {{ selectedAddress.zipcode }}
            </p>
          </div>
          <div class="me-address-btn me-mt-1">
            <span
              class="me-status-link me-cp"
              @click="addAddress('addressVisible')"
              >新增地址</span
            >
          </div>
        </dd>
      </dl>
    </div>
    <!-- 揽货批次号生成历史 -->
    <h2 class="me-fm-title me-mt-5">
      揽货批次号生成历史
      <p>您可在此处查看已生成的揽货批次号</p>
    </h2>
    <div class="me-unbg">
      <TableFilter
        :colItem="colItem"
        :formModel="searchParams"
        @submit="handleSearch"
        @reset="resetSearch"
      />
      <a-table
        :columns="columns"
        :data-source="dataSource"
        rowKey="trackingNumber"
        :pagination="getPagination"
        @change="changePage"
        :loading="tableLoading"
        class="me-mt-2"
      >
        <template slot="index" slot-scope="text, record, index">
          {{ index + 1 }}
        </template>
        <template slot="handler" slot-scope="text, record">
          <a-button
            type="link"
            class="me-pa-1 me-error"
            @click="printOK(record)"
          >
            打印
          </a-button>
        </template>
      </a-table>
    </div>

    <!-- 新增地址-->
    <a-modal
      title="添加新地址"
      :visible="addressVisible"
      @cancel="addressCancel('addressVisible')"
      @ok="addressOk"
      destroyOnClose
      :maskClosable="false"
      wrapClassName="me-custom-modal-footer"
      :confirmLoading="confirmLoading"
    >
      <AddAddress ref="addAddress" />
    </a-modal>

    <!-- 更改地址-->
    <a-modal
      title="更改地址"
      :visible="addressChangeVisible"
      @cancel="addressCancel('addressChangeVisible')"
      @ok="changeAddressOk"
      destroyOnClose
      :maskClosable="false"
      wrapClassName="me-custom-modal-footer"
      :confirmLoading="confirmLoading"
      width="600px"
    >
      <ChangeAddress ref="changeAddress" :currentAddress="selectedAddress" />
    </a-modal>
    <!-- 打印批次号面单 -->
    <PrintBatchFace ref="PrintBatchFace" v-show="false" />
  </div>
</template>

<script>
import moment from 'moment'
import Order from '@/api/order'
import tableMixins from '@/mixins/tableMixins'
import fmMixins from './mixins'
import TableFilter from '@/components/tableFilter'
import AddAddress from './AddAddress'
import ChangeAddress from './ChangeAddress'
import PrintBatchFace from './PrintBatchFace'

export default {
  mixins: [tableMixins, fmMixins],
  props: {},
  components: {
    AddAddress,
    ChangeAddress,
    TableFilter,
    PrintBatchFace
  },
  data() {
    return {
      moment,
      shopId: '', //店铺id
      pickDate: '', //取货日期
      dateFormat: 'YYYY-MM-DD', //取货日期格式
      quantity: '', //批次号数量
      siteCheckedList: [], //Shopee站点相关
      siteIndeterminate: false,
      siteCheckAll: false,
      shopCheckedList: [], //Shopee店铺相关
      shopIndeterminate: false,
      shopCheckAll: false,
      shopOptions: [],
      siteInShop: [],
      addressVisible: false, //添加地址弹窗开关
      addressChangeVisible: false, //修改地址弹窗开关
      confirmLoading: false, //弹窗loading开关
      selectedAddress: '', //已选地址
      columns: [
        //揽货批次号生成历史表头
        {
          title: '编号',
          dataIndex: 'index',
          key: 'index',
          scopedSlots: { customRender: 'index' }
        },
        {
          title: '取货日期',
          dataIndex: 'declateDate',
          key: 'declateDate'
        },
        {
          title: '揽货批次号',
          dataIndex: 'trackingNumber',
          key: 'trackingNumber'
        },
        {
          title: this.$t('common.handler'),
          dataIndex: 'handler',
          scopedSlots: { customRender: 'handler' }
        }
      ],
      searchParams: {
        //揽货批次号生成历史搜索参数
        pickupTime: null,
        storeId: []
      },
      currentAddress: '', //选择的地址
      openClose: false //店铺展开收起开关
    }
  },
  computed: {
    colItem({ storeListSize }) {
      return [
        //揽货批次号生成历史搜索配置
        {
          itemType: 'rengePicker',
          label: '取货时间',
          key: 'pickupTime',
          itemProp: {
            style: 'width:190px'
          }
        },
        {
          itemType: 'cascader',
          label: this.$t('order.shop'),
          key: 'storeId',
          itemProp: {
            options: storeListSize
          }
        }
      ]
    },
    siteOptions() {
      //获取站点
      let site = []
      Object.keys(this.$store.getters.site).forEach((ele) => {
        site.push({ value: ele, name: this.$store.getters.site[ele] })
      })
      return site
    }
  },
  created() {
    //获取地址
    this.getFmAddressList()
  },

  methods: {
    //展开收起店铺
    shopOpenClose() {
      this.$data.openClose = !this.$data.openClose
    },
    //获取首公里地址列表
    async getFmAddressList() {
      let { data } = await Order.listFirstMileAddress({
        size: '10',
        current: 1,
        total: 0
      })
      if (
        localStorage.fmAddress &&
        data.records.length &&
        data.records.filter(
          (item) =>
            item.addressId == JSON.parse(localStorage.fmAddress).addressId
        ).length
      ) {
        this.selectedAddress = JSON.parse(localStorage.fmAddress)
      } else {
        this.selectedAddress = data.records.length ? data.records[0] : ''
        if (data.records.length)
          localStorage.fmAddress = JSON.stringify(data.records[0])
      }
    },
    //勾选站点
    siteChange(checkedList) {
      this.getSiteInshop(checkedList)
      this.siteIndeterminate =
        checkedList.length && checkedList.length < this.siteOptions.length
      this.siteCheckAll = checkedList.length === this.siteOptions.length
      this.$data.shopIndeterminate = false
      this.$data.shopCheckAll = false
      this.$data.shopCheckedList = []
    },
    //全选站点
    siteCheckAllChange(e) {
      this.$data.shopIndeterminate = false
      this.$data.shopCheckAll = false
      this.$data.shopCheckedList = []
      Object.assign(this, {
        siteCheckedList: e.target.checked
          ? Object.keys(this.$store.getters.site)
          : [],
        siteIndeterminate: false,
        siteCheckAll: e.target.checked
      })
      this.getSiteInshop(
        e.target.checked ? Object.keys(this.$store.getters.site) : []
      )
    },
    //勾选店铺
    shopChange(checkedList) {
      this.shopIndeterminate =
        !!checkedList.length &&
        checkedList.length < this.$data.shopOptions.length
      this.shopCheckAll = checkedList.length === this.$data.shopOptions.length
    },
    //全选店铺
    shopCheckAllChange(e) {
      Object.assign(this, {
        shopCheckedList: e.target.checked ? this.$data.siteInShop : [],
        shopIndeterminate: false,
        shopCheckAll: e.target.checked
      })
    },
    //勾选站点下的店铺
    getSiteInshop(site) {
      if (site.length) {
        this.$data.shopOptions = []
        site.forEach((ele) => {
          this.$data.storeListBatchNum.forEach((ele2) => {
            if (ele2.code == ele) {
              this.$data.shopOptions.push(ele2)
              this.$data.siteInShop.push(ele2.value)
            }
          })
        })
      } else {
        this.$data.shopOptions = []
        this.$data.siteInShop = []
      }
    },
    //获取批次号列表
    getTableData() {
      return Order.listGenerateTrackingNumber({ ...this.$data.paginationData })
    },

    //选择取货日期
    pickDateChange(date, dateString) {
      console.log(date, dateString)
      this.$data.pickDate = dateString
    },
    //禁止选择过去的日期
    disabledDate(current) {
      // Can not select days before today and today
      return current && current < moment().startOf('day')
    },
    //创建批次号
    async createBatchNumberOk() {
      let { quantity, pickDate, selectedAddress, shopCheckedList } = this.$data
      if (!shopCheckedList.length) return this.$message.warning('请选择取店铺')
      if (!pickDate.length) return this.$message.warning('请选择取货日期')
      if (!quantity) return this.$message.warning('请填写批次号数量/天')
      if (!selectedAddress) return this.$message.warning('请选择揽货地址')
      let params = {
        quantity,
        storeIds: shopCheckedList,
        startDeclareDate: pickDate,
        endDeclareDate: pickDate,
        addressId: selectedAddress.addressId,
        sellerInfo: {
          address: selectedAddress.fullAddress,
          name: selectedAddress.name,
          phone: selectedAddress.phone,
          region: this.$data.countryMap[
            selectedAddress.region == 7
              ? selectedAddress.region
              : selectedAddress.region
          ],
          zipcode: selectedAddress.zipcode
        }
      }
      await Order.generateFirstMileTrackingNumber(params)
      this.$message.success('批次号创建成功')
      this.reLoadData()
    },
    //修改地址
    //添加地址信息
    addAddress(visible) {
      this.$data[visible] = true
    },
    //关闭添加地址弹窗
    addressCancel(visible) {
      this.$data[visible] = false
      this.getFmAddressList()
    },
    //确认添加地址
    async addressOk() {
      this.$data.confirmLoading = true
      let flag = await this.$refs.addAddress.addressOk()
      console.log(flag)
      this.$data.confirmLoading = false
      if (flag) {
        this.addressCancel('addressVisible')
        if (!this.selectedAddress) {
          this.getFmAddressList()
        }
      }
    },
    //确认修改地址
    async changeAddressOk() {
      this.$data.confirmLoading = true
      let address = await this.$refs.changeAddress.addressOk()
      console.log(address)
      this.$data.confirmLoading = false
      if (address) {
        localStorage.fmAddress = JSON.stringify(address[0])
        this.$data.selectedAddress = address[0]
        this.addressCancel('addressChangeVisible')
      }
    },
    //获取时间
    getTime() {
      let storeId = this.$data.searchParams.storeId
      const [startDeclareDate, endDeclareDate] =
        this.searchParams.pickupTime ?? []
      return {
        storeId: storeId.length ? storeId[1] : null,
        startDeclareDate: startDeclareDate
          ? startDeclareDate + ' 00:00:00'
          : '',
        endDeclareDate: endDeclareDate ? endDeclareDate + ' 23:59:59' : ''
      }
    },
    //搜索操作
    handleSearch() {
      this.$data.paginationData = {
        ...this.$data.paginationData,
        ...this.getTime()
      }
      this.reLoadData()
    },
    //重置搜索
    resetSearch() {
      this.searchParams.storeId = []
      this.searchParams.pickupTime = []
      this.$data.paginationData = {
        size: '10',
        current: 1,
        total: 0
      }
      this.reLoadData()
    },
    //打印批次号面单
    printOK(row) {
      this.$refs.PrintBatchFace.printFaceList(row)
    }
  }
}
</script>

<style lang="scss" scoped>
.me-em1 {
  width: 100px;
  display: inline-block;
  overflow: hidden;
  vertical-align: top;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.me-createBatchNum {
  display: flex;
  flex-direction: row;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
  // margin:30px 0;
}
.me-createBatchNum-item {
  ::v-deep {
    .ant-checkbox-group-item {
      margin-top: 6px;
    }
  }
  dt {
    font-size: 14px;
    padding: 11px 16px 10px;
  }
  .me-w70 {
    max-width: 1300px;
  }
  dd {
    padding: 6px 16px 10px;
    .me-label {
      min-width: 110px;
      float: left;
      text-align: right;
      padding-right: 16px;
    }
  }
}
.me-address {
  overflow: hidden;
  padding: 6px 16px 10px;
  margin-top: 0px;
  background: #fff;
  border: 1px solid #d9d9d9;
  color: #333;
  min-width: 300px;
}
.me-site-item {
  overflow: hidden;
  > label {
    display: block;
  }
}
.me-shop-item {
  position: relative;
  overflow: hidden;
  max-height: 75px;
  // transition: max-height .1s;
  > label {
    display: block;
  }
  .me-open-close {
    position: absolute;
    right: 0px;
    bottom: 0px;
  }
}
.me-open {
  max-height: 500px;
  overflow-y: auto;
}
.me-fm-title {
  font-size: 14px;
  padding: 6px 0 16px;
  color: #333;
  font-weight: bold;
  p {
    font-size: 12px;
    color: #999;
    font-weight: normal;
  }
}

.me-address-txt {
  font-size: 12px;
  color: #999;
}
.me-num-text {
  width: 180px;
}
.me-bgf8 {
  background-color: #f8f9fa;
}
.me-unbg {
  .me-page-search {
    padding: 0;
    background: none;
    min-height: auto;
  }
}
.me-f12 {
  font-size: 12px;
}
.me-ml-10 {
  margin-left: 190px;
}
.me-tip12 {
  color: #999;
}
.me-address-btn {
  margin-left: 147px;
}
</style>
