<template>
  <div>
    <!-- 绑定订单tabs-->
    <a-tabs :activeKey="tabsModel" type="card" @change="tabsChange">
      <a-tab-pane key="1" tab="绑定"> </a-tab-pane>
      <a-tab-pane key="2" tab="解绑"> </a-tab-pane>
    </a-tabs>
    <!-- 搜索块 -->
    <TableFilter
      :colItem="colItem"
      :formModel="searchParams"
      @selectSearch="selectSearch"
      @selectBlur="selectBlur"
      @submit="reLoadData"
      @reset="resetSearch"
    />

    <!-- 操作栏 -->
    <div class="me-mt-4 me-mb-2" v-if="tabsModel == '1'">
      <a-button type="primary" class="me-mr-2" @click="bindOrder"
        >绑定 {{ selectedRowKeys.length }} 个包裹 >></a-button
      ><span class="me-tip12"
        >注意：此页面显示已安排出货且尚未进行发货预报绑定的包裹。</span
      >
    </div>
    <div class="me-mt-4 me-mb-2" v-else>
      <a-button type="primary" @click="unBindOrder"
        >解绑 {{ selectedRowKeys.length }} 个包裹 >></a-button
      >
    </div>

    <!-- 首公里订单列表 -->
    <a-table
      v-if="tabsModel == '1'"
      :columns="columns"
      :data-source="dataSource"
      rowKey="packageNumber"
      :pagination="getPagination"
      @change="changePage"
      :loading="tableLoading"
      :row-selection="rowSelection"
    >
      <span slot="customTitle"
        >订单号
        <a-button type="primary" @click="syncShop" size="small" class="me-ml-1">
          同步订单
        </a-button></span
      >
      <template slot="ordersn" slot-scope="text, record">
        <p class="me-mb-4">{{ text }}</p>
        <dl
          class="me-item-info"
          v-for="item in record.items"
          :key="item.variationId"
        >
          <dt>
            <a-popover placement="right">
              <template slot="content">
                <img
                  style="width: 220px; height: 220px"
                  v-lazy="item.imageUrl"
                /> </template
              ><img :src="item.imageUrl"
            /></a-popover>
          </dt>
          <dd class="me-em2">
            <a-popover placement="topLeft">
              <template slot="content"> {{ item.itemName }} </template
              >{{ item.itemName }}</a-popover
            >
          </dd>
        </dl>
      </template>
      <template slot="trackingNo" slot-scope="text, record">
        <p class="me-mb-4">{{ text }}</p>
        <ul>
          <li
            class="me-specifications"
            v-for="item in record.items"
            :key="item.variationId"
          >
            <div>
              规格：<a-popover placement="topLeft">
                <template slot="content"> {{ item.variationName }} </template>
                <p class="me-em2">{{ item.variationName }}</p></a-popover
              >
            </div>
            <div>
              单价：
              <p>{{ item.variationOriginalPrice }}</p>
            </div>
            <div>
              数量：
              <p>{{ item.variationQuantityPurchased }}</p>
            </div>
          </li>
        </ul>
      </template>
    </a-table>
    <a-table
      v-else
      :columns="columnsUnBind"
      :data-source="dataSource"
      rowKey="packageNumber"
      :pagination="getPagination"
      @change="changePage"
      :loading="tableLoading"
      :row-selection="rowSelection"
      ><span slot="customTitle"
        >订单号
        <a-button type="primary" @click="syncShop" size="small" class="me-ml-1">
          同步订单
        </a-button></span
      >
      <template slot="ordersn" slot-scope="text, record">
        <p class="me-mb-4">{{ text }}</p>
        <dl
          class="me-item-info"
          v-for="item in record.items"
          :key="item.variationId"
        >
          <dt>
            <a-popover placement="right">
              <template slot="content">
                <img
                  style="width: 220px; height: 220px"
                  v-lazy="item.imageUrl"
                /> </template
              ><img :src="item.imageUrl"
            /></a-popover>
          </dt>
          <dd class="me-em2">
            <a-popover placement="topLeft">
              <template slot="content"> {{ item.itemName }} </template
              >{{ item.itemName }}</a-popover
            >
          </dd>
        </dl>
      </template>
      <template slot="trackingNo" slot-scope="text, record">
        <p class="me-mb-4">{{ text }}</p>
        <ul>
          <li
            class="me-specifications"
            v-for="item in record.items"
            :key="item.variationId"
          >
            <div>
              规格：<a-popover placement="topLeft">
                <template slot="content"> {{ item.variationName }} </template>
                <p class="me-em2">{{ item.variationName }}</p></a-popover
              >
            </div>
            <div class="me-w75">
              单价：
              <p class="me-w75">{{ item.variationOriginalPrice }}</p>
            </div>
            <div class="me-w75">
              数量：
              <p class="me-w75">{{ item.variationQuantityPurchased }}</p>
            </div>
          </li>
        </ul>
      </template>
    </a-table>

    <!--绑定订单-->
    <a-modal
      :visible="bindVisible"
      @cancel="bindCancel('bindVisible')"
      @ok="bindOrderOk"
      destroyOnClose
      :maskClosable="false"
      :confirmLoading="confirmLoading"
      wrapClassName="me-custom-modal-footer"
      width="500px"
    >
      <template slot="title">
        绑定
        <span class="me-tip12"
          >您将同时绑定
          <span class="me-cff4">{{ selectedRowKeys.length }}</span> 个包裹</span
        >
      </template>
      <BindOrderPopup
        ref="bindOrder"
        :storeIds="storeIds"
        :selectedOrder="ordersnArr"
      />
    </a-modal>
    <!-- 同步在线订单 -->
    <SyncStoreInfo
      ref="syncOrderAssembly"
      v-if="syncModalVisible"
      @handleStore="syncOrder"
      @cancelSync="syncModalVisible = false"
      @syncComplete="syncComplete"
    >
    </SyncStoreInfo>
  </div>
</template>

<script>
const columns = [
  {
    dataIndex: 'ordersn',
    key: 'ordersn',
    slots: { title: 'customTitle' },
    scopedSlots: { customRender: 'ordersn' },
    width: '33%'
  },
  {
    title: '运单号',
    dataIndex: 'trackingNo',
    key: 'trackingNo',
    scopedSlots: { customRender: 'trackingNo' }
  },
  {
    title: '包裹号',
    dataIndex: 'packageNumber',
    key: 'packageNumber',
    scopedSlots: { customRender: 'packageNumber' }
  },
  {
    title: '店铺名称',
    dataIndex: 'storeName',
    key: 'storeName'
  },
  {
    title: '订单创建时间',
    dataIndex: 'orderCreateTime',
    key: 'orderCreateTime'
  }
]
const columnsUnBind = [
  //解绑
  {
    dataIndex: 'ordersn',
    key: 'ordersn',
    slots: { title: 'customTitle' },
    scopedSlots: { customRender: 'ordersn' },
    width: '23%'
  },
  {
    title: '运单号',
    dataIndex: 'trackingNo',
    key: 'trackingNo',
    scopedSlots: { customRender: 'trackingNo' },
    width: '250px'
  },
  {
    title: '包裹号',
    dataIndex: 'packageNumber',
    key: 'packageNumber',
    scopedSlots: { customRender: 'packageNumber' }
  },
  {
    title: '批次号/快递单号',
    dataIndex: 'fmNo',
    key: 'fmNo'
  },
  {
    title: '店铺名称',
    dataIndex: 'storeName',
    key: 'storeName'
  },
  {
    title: '物流商',
    dataIndex: 'fmLogisticName',
    key: 'fmLogisticName'
  },
  {
    title: '绑定时间',
    dataIndex: 'bindTime',
    key: 'bindTime'
  },
  {
    title: '首公里时间',
    dataIndex: 'declateDate',
    key: 'declateDate'
  },
  {
    title: '订单创建时间',
    dataIndex: 'orderCreateTime',
    key: 'orderCreateTime'
  }
]
import Order from '@/api/order'
import tableMixins from '@/mixins/tableMixins'
import fmMixins from './mixins'
import TableFilter from '@/components/tableFilter'
import BindOrderPopup from './BindOrderPopup'
import SyncStoreInfo from '@/components/syncStoreInfo'
import moment from 'moment'
import { cloneDeep } from 'lodash'
export default {
  mixins: [tableMixins, fmMixins],
  components: {
    TableFilter,
    BindOrderPopup,
    SyncStoreInfo
  },
  data() {
    return {
      tabsModel: '1', //tabs选中值
      storeIds: '', //选中店铺id
      searchParams: {
        //绑定订单搜索参数
        storeId: null,
        fmNo: null,
        ordersn: null
      },
      confirmLoading: false, //弹窗loading开关
      bindVisible: false, //绑定弹窗开关
      shippingMethodList: [
        //寄送方式
        { label: '非快递寄送（包括：免费/付费揽收，集货点）', value: 1 },
        { label: '快递寄送（不包括：货拉拉类卖家，自送仓库）', value: 2 }
      ],
      logisticsListSource: [], //物流商列表数据源
      logisticsList: [], //物流商下拉列表
      fmParams: [], //解绑参数
      fmIndex: 0, //解绑索引
      columns,
      columnsUnBind,
      syncModalVisible: false, //同步订单
      asyncOrderConfirmLoading: false,
      asyncOrdersVisible: false,
      asyncOrdersIds: [],
      sTime: '', //同步订单开始时间
      eTime: '', //同步订单结束时间
      ordersnArr: []
    }
  },
  computed: {
    colItem({ storeListSize }) {
      let col
      if (this.tabsModel == '1') {
        col = [
          //绑定订单搜索条件配置
          {
            itemType: 'rengePicker',
            label: '订单创建时间',
            key: 'createTime',
            itemProp: {
              disabledDate: this.disabledDate
            }
          },
          {
            itemType: 'cascader',
            label: this.$t('order.shop'),
            key: 'storeId',
            itemProp: {
              options: storeListSize
            }
          },
          {
            itemType: 'input',
            label: '订单编号',
            key: 'ordersn',
            itemProp: {
              style: 'width:190px',
              placeholder: '多个订单号以；隔开'
            }
          }
        ]
      } else {
        col = [
          //绑定订单搜索条件配置
          {
            itemType: 'rengePicker',
            label: '订单创建时间',
            key: 'createTime',
            itemProp: {
              disabledDate: this.disabledDate
            }
          },
          {
            itemType: 'cascader',
            label: this.$t('order.shop'),
            key: 'storeId',
            itemProp: {
              options: storeListSize
            }
          },
          {
            itemType: 'input',
            label: '批次号/快递单号',
            key: 'fmNo',
            itemProp: {
              style: 'width:190px'
            }
          },
          {
            itemType: 'input',
            label: '订单编号',
            key: 'ordersn',
            itemProp: {
              style: 'width:190px',
              placeholder: '多个订单号以；隔开'
            }
          }
        ]
      }
      return col
    }
  },
  async created() {
    if (this.$route.query.sn) {
      this.$data.searchParams.ordersn = this.$route.query.sn
    }

    this.$data.sTime = moment(
      new Date(new Date().getTime() - 29 * 24 * 3600 * 1000)
    ).format('YYYY-MM-DD')
    this.$data.eTime = moment(new Date()).format('YYYY-MM-DD')
  },
  methods: {
    //时间限制
    disabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().endOf('day')
    },
    // 同步店铺弹窗开启
    syncShop() {
      this.syncModalVisible = !this.syncModalVisible
    },
    //同步订单方法
    async syncOrder(storeIds) {
      let params = {
        storeIds: storeIds,
        updateTimeFrom: this.$data.sTime,
        updateTimeTo: this.$data.eTime,
        synType: 1
      }
      await Order.syncOrderAll(params)
      this.syncComplete()
    },
    //同步完成
    syncComplete() {
      this.$message.success('同步完成')
      this.syncShop()
      this.reLoadData()
    },

    //获取批次号列表
    getTableData() {
      let { storeId, fmNo, ordersn, createTime } = this.$data.searchParams
      let ordersnList = null
      let startTime = null
      let endTime = null
      if (ordersn) {
        ordersnList = ordersn.replace(/；/g, ';')
        ordersnList = ordersnList.replace(/\s/g, '').split(';')
      }
      if (createTime) {
        startTime = createTime[0] + ' 00:00:00'
        endTime = createTime[1] + ' 23:59:59'
      }
      if (this.$data.tabsModel == 1) {
        return Order.listShopeeFirstMileBind({
          bindType: '2',
          storeId: storeId ? storeId[1] : null,
          fmNo,
          ordersnList,
          startTime,
          endTime,
          ...this.$data.paginationData
        })
      } else {
        return Order.listShopeeFirstMileBind({
          bindType: '1',
          storeId: storeId ? storeId[1] : null,
          fmNo,
          ordersnList,
          startTime,
          endTime,
          ...this.$data.paginationData
        })
      }
    },
    //tabs切换
    tabsChange(index) {
      this.$data.tabsModel = index
      this.resetSearch()
    },
    //重置搜索
    resetSearch() {
      this.$data.searchParams = {
        //绑定记录搜索参数
        storeId: null,
        fmNo: null,
        ordersn: this.$route.query.sn ? this.$route.query.sn : null //单个订单发货预报
      }
      this.$data.paginationData = {
        size: '10',
        current: 1,
        total: 0
      }
      this.reLoadData()
    },
    //关闭绑定弹窗
    bindCancel(visible) {
      this.$data[visible] = false
    },
    //绑定订单
    bindOrder() {
      console.log(this.$data.selectedRows)
      if (this.$data.selectedRowKeys.length) {
        this.$data.storeIds = this.$data.selectedRows[0].storeId
        this.$data.ordersnArr = this.$data.selectedRows
        this.$data.bindVisible = true
      } else {
        this.$message.warning('请选择订单')
      }
    },
    //确定绑定订单
    async bindOrderOk() {
      this.$data.confirmLoading = true
      let flag = await this.$refs.bindOrder.saveLogisticsForecast()
      this.$data.confirmLoading = false
      if (flag) {
        this.bindCancel('bindVisible')
        this.loadData()
      }
    },
    //解绑订单
    unBindOrder() {
      if (this.$data.selectedRowKeys.length) {
        console.log(this.$data.selectedRowKeys)
        let _this = this
        this.$confirm({
          title: '提示',
          content: (
            <div>
              <p class="me-unbind-tip">
                您将同时解绑 {_this.$data.selectedRowKeys.length} 个包裹
              </p>
              <p>解除绑定的订单将关闭首公里预报，是否继续？</p>
            </div>
          ),
          okText: '解除',
          cancelText: '取消',
          onOk: () => {
            this.$data.fmParams = []
            let rows = cloneDeep(this.$data.selectedRows)
            this.assembleFm(rows)
            console.log(this.$data.fmParams)
            Order.unbindFirstMileTrackingNumber(this.$data.fmParams).then(
              (res) => {
                this.$message.success(this.$t('common.handlerSuccess'))
                this.reLoadData()
              }
            )
          }
        })
      } else {
        this.$message.warning('请选择订单')
      }
    },
    //组装绑定参数
    assembleFm(rows) {
      let temp = []
      this.$data.fmParams.push({
        fmNo: rows[0].fmNo,
        storeId: rows[0].storeId,
        // ordersns: [rows[0].ordersn]
        packages: [
          { orderSn: rows[0].ordersn, packageNumber: rows[0].packageNumber }
        ]
      })
      for (let i = 1; i < rows.length; i++) {
        if (rows[0].fmNo == rows[i].fmNo) {
          this.$data.fmParams[this.$data.fmIndex].packages.push({
            orderSn: rows[i].ordersn,
            packageNumber: rows[i].packageNumber
          })
        } else {
          temp.push(rows[i])
        }
      }
      if (temp.length > 0) {
        this.$data.fmIndex += 1
        this.assembleFm(temp)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/mixins.scss';
.me-em2 {
  @include ellipsisMultiline(2);
}
.me-unbind-tip {
  font-size: 13px;
  color: #999;
  margin: 20px 0 10px;
}
.me-tip12 {
  font-size: 12px;
  color: #999;
}
.me-cff4 {
  color: #ff4a4a;
}
.me-item-info {
  min-height: 60px;
  dt {
    float: left;
    margin-right: 10px;
    img {
      max-height: 50px;
      max-width: 50px;
    }
  }
  dd {
    overflow: hidden;
    max-width: 80%;
  }
}
.me-specifications {
  min-height: 60px;
  color: #909099;
  div {
    float: left;
    width: 100px;
  }
  p {
    width: 100px;
    padding-right: 20px;
    color: #282828;
    line-height: 14px;
  }
  .me-w75 {
    width: 55px;
  }
}
</style>
