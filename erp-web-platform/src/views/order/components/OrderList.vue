<template>
  <div class="order-list-wrap-yile">
    <!--    <span @click='appealOrder'>oik</span>-->
    <div class="list-header-box">
      <a-checkbox
        v-model="isCheckAll"
        :indeterminate="indeterminate"
        @change="(e) => checkAllChange(e.target.checked)"
        style="margin-left: 10px"
      ></a-checkbox>
      <div class="list-header-order list-header-content">
        <div class="list-order-text">{{ $t('order.orderInfo') }}</div>
      </div>
      <div class="list-header-p list-header-content">
        {{ $t('common.amount') }}
      </div>
      <div class="list-header-buy-m list-header-content">
        {{ $t('order.buyInfo') }}
      </div>
      <div class="list-header-logistics-m list-header-content">
        {{ $t('order.logisticsInfo') }}
      </div>
      <div class="list-header-store list-header-content">
        {{ $t('order.externalOrder') }}
      </div>
    </div>
    <div class="list-section">
      <template v-if="orderList.length > 0">
        <div class="list me-mb-2" v-for="item in orderList" :key="item.ordersn">
          <div class="list-title-box">
            <a-checkbox
              :checked="item.check"
              @change="(e) => checkChange(e.target.checked, item)"
            ></a-checkbox>
            <div>
              <span
                class="order-number me-cur"
                @click="goOrder(item.shopeeSellerUrl)"
                >{{ item.ordersn }}</span
              ><i
                v-copy="item.ordersn"
                title="复制"
                class="iconfont iconjuxing1 me-copy-icon"
              ></i>
            </div>
            <div class="order-status">{{ item.orderStatus }}</div>
            <div class="order-time">
              {{ $t('order.orderCreateTime') }}：{{ item.orderCreateTime }}
            </div>
            <div class="order-time">
              {{ $t('order.payTime') }}：{{ item.payTime }}
            </div>
            <div class="label-box">
              <span
                class="edit"
                @click="
                  labelModalInfo.visible = true
                  labelModalInfo.current = item
                  labelModalInfo.ordersn = item.ordersn
                "
              >
                <a-icon class="me-form-ic" type="form" />
                <span class="me-em1 me-w50 me-mr-1"
                  >{{ $t('common.tag') }}
                </span>
              </span>
              <template v-if="item.orderLabels">
                <a-tooltip
                  v-for="it in item.orderLabels"
                  :key="it"
                  :title="filterColorTags(it)"
                  placement="bottom"
                  class=""
                >
                  <a-tag :color="`#${it}`">{{ filterColorTags(it) }}</a-tag>
                </a-tooltip>
              </template>
              <a-popover>
                <template slot="content">
                  <a-tooltip
                    v-for="it in item.orderLabels"
                    :key="it"
                    placement="bottom"
                    class="me-mr-1"
                  >
                    <a-tag :color="`#${it}`" class="me-order-tag"></a-tag
                    ><span class="me-f12">{{ filterColorTags(it) }}</span
                    ><br />
                  </a-tooltip>
                </template>
                <span
                  class="me-cp"
                  v-if="item.orderLabels && item.orderLabels.length > 3"
                  >{{ $t('order.more') }}</span
                >
              </a-popover>
            </div>
            <div class="remark break-only-line">
              <span class="edit" @click="editRemark(item)">
                <!-- <span class="mdi mdi-eyedropper-variant"></span>  -->
                <a-icon type="form" class="me-ml-5" />
                <span>{{ $t('common.remarks') }} </span>
              </span>

              <span
                v-if="!item.remarkVisible"
                class="me-em1"
                :title="item.orderRemark"
                >{{ item.orderRemark }}</span
              >
            </div>
            <a-input
              :maxLength="40"
              ref="remark"
              @blur="handleChangeRemark(item)"
              v-if="item.remarkVisible"
              v-model="orderRemark"
              :placeholder="$t('common.remarks')"
              class="me-orderRemark"
            />
            {{ item.fmNo }}
            <a-tag
              color="green"
              class="me-forecast-tag"
              v-if="item.fmNo && item.storeType === 2"
            >
              {{ $t('order.logisticsForecast') }}
            </a-tag>
            <div class="operation">
              <a class="option-link me-syncOrder" @click="syncOrder(item)"
                >{{ $t('order.syncOrder') }}
              </a>

              <a-popover
                title="点击文字可复制"
                trigger="click"
                v-if="
                  searchParams.status == 'READY_TO_SHIP' ||
                    searchParams.status == 'READY_TO_SHIP2' ||
                    searchParams.status == 'RETRY_SHIP'
                "
              >
                <template slot="content">
                  <p v-copy="checkAddressText" style="width:300px">
                    {{ checkAddressText }}
                  </p>
                </template>
                <a class="text" @click="handleCheckAddress(item)">
                  {{ $t('order.checkAddress') }}
                </a>
              </a-popover>

              <template
                v-if="
                  searchParams.status == 'READY_TO_SHIP' ||
                    searchParams.status == 'READY_TO_SHIP2' ||
                    searchParams.status == 'RETRY_SHIP'
                "
              >
                <div class="text">
                  <a-button @click="handlePackge(item)" type="primary">
                    {{
                      item.fwPackageId
                        ? $t('order.viewPackages')
                        : $t('order.behalfPackages')
                    }}
                  </a-button>
                </div>
                <div
                  class="text"
                  @click="
                    appealOrder(
                      item,
                      '',
                      item.orderShopeeOrderPackageDTOS[0].packageNumber
                    )
                  "
                >
                  {{ $t('order.applicationWaybillNumber') }}
                </div>
                <div class="text" @click="printOrder(item)">
                  {{ $t('order.printFaceSheet') }}
                </div>
              </template>
              <template v-if="item.storeType == 2">
                <!-- 代打包下单状态 -->
                <div class="text" @click="batchLogisticsForecast(item)">
                  {{ item.fmNo ? '已发货预报' : $t('order.logisticsForecast') }}
                </div>
              </template>
              <!-- <div
                class="text"
                v-if="item.items.length > 1"
                @click="
                  $router.push({
                    path: '/order/split-order',
                    query: { id: item.ordersn }
                  })
                "
              >
                订单拆分
              </div> -->
              <template v-if="searchParams.status == 'SHIPPED'">
                <div class="text">
                  <a-button @click="handlePackge(item)" type="primary">
                    {{
                      item.fwPackageId
                        ? $t('order.viewPackages')
                        : $t('order.behalfPackages')
                    }}
                  </a-button>
                </div>
              </template>
            </div>
          </div>
          <div class="item-box">
            <div class="item-order-box">
              <div
                class="goods-item"
                v-for="(goodsItem, k) in item.items"
                :key="k"
                :class="{
                  'me-is-purchase2':
                    goodsItem.purchaseDetail &&
                    !goodsItem.purchaseDetail.relationType,
                  'me-is-purchase': getLoginStatus(
                    goodsItem.purchaseDetail
                      ? goodsItem.purchaseDetail.purchasePlatform
                      : ''
                  )
                }"
              >
                <!-- <v-checkbox v-model="checkbox"></v-checkbox> -->
                <div class="order-left">
                  <w-img :src="goodsItem.imageUrl"></w-img>
                </div>
                <div class="order-right">
                  <div class="order-t-box">
                    <div class="mark-wrap">
                      <!-- <span class="mark-item" v-if="!goodsItem.isMainItem">
                        赠
                      </span> -->
                      <i
                        v-if="item.daysToShip > 2"
                        class="mark-item iconfont iconyu1"
                      ></i>
                    </div>
                    <a
                      class="link-text-color breakAll"
                      @click="goGoods(goodsItem.shopeeItemUrl)"
                      >{{ goodsItem.itemName }}</a
                    >
                  </div>
                  <div class="order-price-box">
                    <div class="order-color">
                      <span class="order-conten"
                        >{{ $t('edit.specName') }}：</span
                      >
                      <span class="order-c-text">
                        {{ goodsItem.variationName }}
                      </span>
                    </div>
                    <div class="order-price">
                      <span class="order-conten"
                        >{{ $t('common.unitPrice') }}：</span
                      >
                      <span class="order-c-text">
                        {{ goodsItem.variationOriginalPrice }}
                      </span>
                    </div>
                    <div class="order-price">
                      <span class="order-conten"
                        >{{ $t('common.producNum') }}：</span
                      >
                      <span class="order-c-text">
                        {{ goodsItem.variationQuantityPurchased }}
                      </span>
                    </div>
                  </div>
                  <div class="order-coding-box">
                    <span class="order-conten"
                      >{{ $t('common.goodsCode') }}：</span
                    >
                    <span class="order-c-text">{{ goodsItem.itemSku }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="item-p-box">
              <div class="item-p">
                <span class="p-content">
                  {{ $t('order.totalPrice') }}({{ item.currency }})：
                </span>
                <span class="p-text item-text">{{ item.totalAmount }}</span>
              </div>
              <div class="item-p">
                <span class="p-content">
                  {{ $t('common.freight') }} ({{ item.currency }})：
                </span>
                <span class="p-text item-text">{{
                  item.estimatedShippingFee
                }}</span>
              </div>
              <div class="item-p">
                <span class="p-content">
                  {{ $t('order.actualFreight') }}({{ item.currency }})：
                </span>
                <span class="p-text item-text">{{
                  item.actualShippingCost
                }}</span>
              </div>
            </div>
            <div class="item-buy-m-box">
              <div class="buyer-box">
                <span class="item-content">{{ $t('order.buyers') }}：</span>
                <span class="item-text">{{ item.buyerUsername }}</span>
              </div>
            </div>
            <div class="item-logistics-m-box">
              <div class="assign-logistics-box">
                <span class="item-text"
                  >{{ $t('order.buyerLogistics') }}：</span
                >
                <span class="item-content">{{ item.shippingCarrier }}</span>
              </div>
              <div class="logistics-n-box">
                <span class="item-text">{{ $t('order.logisticsNo') }}：</span>
                <a
                  @click="showLogisticsMessage(item)"
                  class="aitem-content logistics-details"
                >
                  {{ item.trackingNo }}
                </a>
              </div>
              <div class="logistics-n-box" v-if="item.fmNo">
                <span class="item-text"
                  >{{ $t('order.domesticLogistics') }}：</span
                >{{ item.fmNo }}（{{ item.fmLogisticName }}）
              </div>
            </div>
            <div class="item-store-box">
              <div
                v-if="
                  $route.path == '/order/page-packing' ||
                    $route.path == '/oms/order/page-packing'
                "
              >
                <a-button
                  class="me-mb-2 me-b"
                  type="primary"
                  @click="
                    appealOrder(
                      item,
                      '',
                      item.orderShopeeOrderPackageDTOS[0].packageNumber
                    )
                  "
                  v-if="!item.trackingNo"
                >
                  {{ $t('order.applicationWaybillNumber') }}
                </a-button>
                <a-button @click="handlePackge(item)" type="primary">
                  {{
                    item.fwPackageId
                      ? $t('order.viewPackages')
                      : $t('order.behalfPackages')
                  }}
                </a-button>
              </div>
              <!-- <ul
                v-if="
                  searchParams.status !== 'UNPAID' &&
                    $route.path !== '/order/page-packing' &&
                      $route.path !== '/oms/order/page-packing'
                "
                class="me-one-order"
              >
                <li v-for="(goodsItem, k) in item.items" :key="k">
                  <div
                    v-if="
                      !goodsItem.purchaseDetail &&
                        (searchParams.status == 'READY_TO_SHIP' ||
                          searchParams.status == 'READY_TO_SHIP2')
                    "
                  >
                    <a-button
                      @click="oneClickOrder(item, k, true, goodsItem)"
                      type="primary"
                      class="dbm"
                      >{{ $t('order.oneClickOrder') }}
                    </a-button>
                    <a-button
                      @click="oneClickOrder(item, k, false, goodsItem)"
                      type="primary"
                      class="me-mt-2 dbm"
                    >
                      {{ $t('order.manualAssociation') }}
                    </a-button>
                  </div>
                  <dl
                    class="me-purchaseDetail me-mt-2"
                    v-else-if="
                      goodsItem.purchaseDetail &&
                        goodsItem.purchaseDetail.relationType
                    "
                  >
                    <dd>
                      {{ $t('order.correlationTime') }} ：{{
                        goodsItem.purchaseDetail.relationTime
                      }}
                    </dd>
                    <dd>
                      {{ $t('order.logisticsCompany') }} ：{{
                        goodsItem.purchaseDetail.purchaseLogisticsName
                      }}
                    </dd>
                    <dd>
                      {{ $t('order.logisticsNo') }} ：
                      <span
                        class="me-logistics"
                        @click="
                          queryLogistics(
                            goodsItem.purchaseDetail.purchaseLogisticsno
                          )
                        "
                        >{{
                          goodsItem.purchaseDetail.purchaseLogisticsno
                        }}</span
                      >
                    </dd>
                    <dd
                      class="me-tc"
                      v-if="
                        searchParams.status == 'RETRY_SHIP' ||
                          searchParams.status == 'READY_TO_SHIP' ||
                          searchParams.status == 'READY_TO_SHIP2'
                      "
                    >
                      <a-button
                        @click="quitRelation(goodsItem.purchaseDetail)"
                        type="primary"
                        >{{ $t('order.disassociate') }}
                      </a-button>
                    </dd>
                  </dl>
                  <dl
                    class="me-purchaseDetail"
                    v-else-if="goodsItem.purchaseDetail"
                  >
                    <dd>
                      {{ $t('order.sycnTime') }}：
                      {{ goodsItem.purchaseDetail.syncTime }}
                    </dd>

                    <dd>
                      {{ $t('order.singlePlatform') }} ：{{
                        goodsItem.purchaseDetail.purchasePlatform
                      }}
                    </dd>

                    <dd>
                      {{ $t('order.orderAccount') }} ：{{
                        goodsItem.purchaseDetail.purchaseAccount
                      }}
                    </dd>

                    <dd>
                      {{ goodsItem.purchaseDetail.purchasePlatform
                      }}{{ $t('order.orderNum') }} ：{{
                        goodsItem.purchaseDetail.purchaseOrderno
                      }}
                    </dd>

                    

                    <dd>
                      {{ $t('order.orderTime') }} ：
                      {{ goodsItem.purchaseDetail.purchaseTime }}
                    </dd>

                    <dd>
                      {{ goodsItem.purchaseDetail.purchasePlatform
                      }}{{ $t('order.orderStatus') }} ：{{
                        orderStatus(goodsItem.purchaseDetail.purchaseStatus)
                      }}
                    </dd>

                    <dd v-if="goodsItem.purchaseDetail.purchaseLogisticsName">
                      {{ $t('order.logisticsInfo') }} ：{{
                        goodsItem.purchaseDetail.purchaseLogisticsName
                      }}
                      <span
                        class="me-logistics"
                        @click="
                          queryLogistics(
                            goodsItem.purchaseDetail.purchaseLogisticsno
                          )
                        "
                        >{{
                          goodsItem.purchaseDetail.purchaseLogisticsno
                        }}</span
                      >
                    </dd>
                    <dd
                      v-if="
                        getLoginStatus(
                          goodsItem.purchaseDetail.purchasePlatform
                        )
                      "
                    >
                      {{ goodsItem.purchaseDetail.purchasePlatform }}
                      {{ $t('order.orderAccount') }}
                      {{ goodsItem.purchaseDetail.purchaseAccount }}
                      {{ $t('order.notLogged') }}
                      <a-button @click="goLogin(goodsItem)" type="link"
                        >{{ $t('login.login') }}
                      </a-button>
                      {{ goodsItem.purchaseDetail.purchasePlatform }}，{{
                        $t('order.pageAgain')
                      }}
                    </dd>
                    <dd
                      class="me-tc"
                      v-if="
                        searchParams.status == 'RETRY_SHIP' ||
                          searchParams.status == 'READY_TO_SHIP' ||
                          searchParams.status == 'READY_TO_SHIP2'
                      "
                    >
                      <a-button
                        @click="quitRelation(goodsItem.purchaseDetail)"
                        type="primary"
                        >{{ $t('order.disassociate') }}
                      </a-button>
                    </dd>
                  </dl>
                </li>
              </ul> -->
            </div>
          </div>
          <div class="footer-wrap">
            <div class="footer-item">
              <span class="text">{{ $t('order.consignee') }}:</span>
              <span class="info-text">{{ item.orderAddress.name }}</span>
            </div>
            <div class="footer-item">
              <span class="text">{{ $t('order.receivingAddress') }}:</span>
              <span class="info-text">{{ item.orderAddress.fullAddress }}</span>
            </div>
            <div class="footer-item me-shop">
              <span class="text">{{ $t('order.shop') }}:</span>
              <span class="info-text">{{ item.storeName }}</span>
            </div>
            <div
              class="me-purchase-detail"
              v-if="item && item.items && item.items[0].purchaseDetail"
            >
              <div class="footer-item">
                <span class="text"
                  >{{ $t('order.forwarderInformation') }}：</span
                >
                <span class="info-text"
                  >{{ item.items[0].purchaseDetail.contacts }}
                  {{ item.items[0].purchaseDetail.phone }}
                  {{ item.items[0].purchaseDetail.fullAddress }}
                </span>
                <span v-if="item.items[0].purchaseDetail.isEnableAutoPackage"
                  ><b
                    class="me-trackingNo"
                    v-if="!item.items[0].purchaseDetail.packageInfo"
                    >（ {{ $t('order.AutoPackaging') }}）</b
                  ><b class="me-trackingNo" v-else
                    >（ {{ $t('order.AutoPackagingAfter') }} ）</b
                  ></span
                >
                <a-select v-else default-value="1" style="width: 220px">
                  <a-select-option value="1">
                    （ {{ $t('order.unAutoPackaging') }}
                    ）
                  </a-select-option>
                  <a-select-option value="2">
                    （ {{ $t('order.initiatedForwarder') }}）
                  </a-select-option>
                </a-select>
              </div>
            </div>
          </div>
        </div>
        <div class="pagination">
          <a-pagination
            v-if="pagination.total > 10"
            v-bind="pagination"
            @change="changePage"
            @showSizeChange="showSizeChange"
          ></a-pagination>
        </div>

        <!-- 标签 -->
        <TagModal
          v-model="labelModalInfo.visible"
          :data.sync="labelModalInfo.current"
          @ok="getOrderList"
          @change="onLabelChange"
        ></TagModal>
        <!-- 查看发货预报弹窗-->
        <a-modal
          :title="$t('order.logisticsForecast')"
          :visible="forecastDetailsVisible"
          :footer="null"
          width="900px"
          destroyOnClose
          @cancel="forecastCancel()"
          :maskClosable="false"
        >
          <LogisticsForecastDetails
            :currOderId="currOderId"
            :getOrderList="getOrderList"
            :forecastCancel="forecastCancel"
            :reBind="reBind"
          />
        </a-modal>
        <!-- 发货预报弹窗-->
        <a-modal
          :title="$t('order.logisticsForecast')"
          :visible="forecastVisible"
          :footer="null"
          width="900px"
          destroyOnClose
          @cancel="forecastCancel()"
          :maskClosable="false"
        >
          <LogisticsForecast
            :currOderId="currOderId"
            :getOrderList="getOrderList"
            :forecastCancel="forecastCancel"
          />
        </a-modal>
      </template>
      <template v-else>
        <div
          style="
          height: 500px;
          background: #fff;
          text-align: center;
          color: #999;
          "
        >
          <img style="margin-top: 56px;" src="@/assets/images/no-data.png" />
          <p>{{ $t('common.noData') }}</p>
        </div>
      </template>
    </div>

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

    <ChangePackStateModal
      :showModal="showStateModal"
      :content="content"
      :order-sn="orderSn"
      @close="closeStateModal"
      @submitWaybillNum="syncOrder"
      :modal-title="$t('order.Shipment')"
    ></ChangePackStateModal>
    <a-modal
      :title="
        isOneClick ? $t('order.oneClickOrder') : $t('order.manualAssociation')
      "
      :visible="oneClickOrderVisible"
      @cancel="oneClickOrderCancel"
      width="1000px"
      :footer="false"
      :maskClosable="false"
      :destroyOnClose="true"
    >
      <!--  :rowData="rowData" -->
      <OneClickOrder
        ref="oneClickPop"
        :rowData="rowData"
        :getOrderList="getOrderList"
        :oneClickOrderCancel="oneClickOrderCancel"
      />
    </a-modal>
    <a-modal
      :visible="trackVisible"
      width="90%"
      :footer="null"
      title="打印面单"
      @cancel="trackVisible = false"
    >
      <iframe
        width="100%"
        height="500px"
        frameborder="0"
        :src="currentTrackLink"
      ></iframe>
    </a-modal>

    <!-- 代打包下单 -->
    <AddPackageOrder
      ref="AddPackageOrder"
      :records="records"
      @submit="getOrderList"
    />

    <!-- 简化版发货预报 -->
    <BatchLogisticsForecast
      ref="batchLogisticsForecast"
      :selectedRows="selectedRows"
      @submit="getOrderList()"
    />
    <!-- 批量代打包弹窗 -->
    <BatchPackage
      ref="BatchPackage"
      :selectedRows="selectedRows"
      @submit="getOrderList()"
    />
  </div>
</template>

<script>
import TagModal from '@/components/TagModal'

import OrderLogisticsMessage from './OrderLogisticsMessage'
import LogisticsForecast from './LogisticsForecast'
import LogisticsForecastDetails from './LogisticsForecastDetails'
import CreatePackageOrder from './CreatePackageOrder'
import OneClickOrder from './OneClickOrder.vue'
import Order from '@/api/order'
import Package from '@/api/package'
import bus from '@/bus'
import ChangePackStateModal from './ChangePackStateModal'
import AddPackageOrder from './AddPackageOrder.vue'
import BatchLogisticsForecast from './BatchLogisticsForecast'
import BatchPackage from './BatchPackage'
const initPatination = {
  current: 1,
  pageSize: 10,
  showQuickJumper: true,
  showSizeChanger: true,
  total: 0
}
export default {
  components: {
    TagModal,
    OrderLogisticsMessage,
    LogisticsForecast,
    LogisticsForecastDetails,
    OneClickOrder,
    ChangePackStateModal,
    AddPackageOrder,
    BatchLogisticsForecast,
    BatchPackage
  },
  props: {
    searchParams: Object
  },

  data() {
    return {
      selectedRows: [], //选中的订单
      currentTrackLink: '',
      trackVisible: false,
      paginationData: {
        current: 1,
        pages: 1,
        size: 10
      },
      pagination: {
        ...initPatination,
        showTotal: (total) =>
          `${this.$t('order.total')}${total}${this.$t('order.data')}`
      },
      orderList: [],
      labelModalInfo: {
        visible: false,
        current: null
      },
      isCheckAll: false,
      checkAddressText: null,
      colorTags: [],
      showLogisticsMessageVisible: false,
      current: null,
      forecastVisible: false,
      forecastDetailsVisible: false,
      currOderId: '',
      oneClickOrderVisible: false,
      isOneClick: true,
      rowData: {},
      vtabIndex: '',
      ptstatus: [
        {
          id: 1,
          label: this.$t('order.bePaid')
        },
        {
          id: 2,
          label: this.$t('order.beDelivered')
        },
        {
          id: 3,
          label: this.$t('order.beReceived')
        },
        {
          id: 4,
          label: this.$t('order.successfulTrade')
        },
        {
          id: 5,
          label: this.$t('order.dealFailed')
        },
        {
          id: 6,
          label: this.$t('order.refundIn')
        },
        {
          id: 7,
          label: this.$t('order.closure')
        },
        {
          id: 10,
          label: this.$t('order.otherStatus')
        }
      ],
      showStateModal: false,
      orderSn: '',
      content: [],
      all: [
        {
          img: require('@/assets/images/order/shipment.png'),
          title: this.$t('order.shipmentTitle'),
          content: this.$t('order.shipmentContent'),
          color: '#f65cbb',
          key: 'dropoff'
        },
        {
          img: require('@/assets/images/order/ship.png'),
          title: this.$t('order.shipTitle'),
          content: this.$t('order.shipContent'),
          color: '#409eff',
          key: 'pickup'
        }
      ],
      orderRemark: null,
      indeterminate: false,
      records: null
    }
  },
  computed: {
    filterColorTags() {
      return (item) => {
        const { colorTags } = this.$data
        const _ = colorTags.filter(({ colorCode }) => colorCode === item)[0]
        if (!_) return null
        return _.tagsContent
      }
    },
    filterLabels() {
      return (item) => {
        let { orderLabels } = item
        return orderLabels ? orderLabels.filter((el) => el.checked) : null
      }
    }
  },
  watch: {
    isCheckAll: {
      handler(newVal) {
        if (newVal) {
          this.orderList.map((el) => (el.check = true))
        } else {
          this.orderList.map((el) => (el.check = false))
        }
      }
    }
  },

  async mounted() {
    this.getOrderList()
    // 监听SearchForm的批量操作
    bus.$on('batch-action', this.observer)

    let { data } = await Order.getOrderColorTags()

    data = data.map((e) => {
      if (!e.tagsContent) e.tagsContent = this.$t('common.noDescription')

      return e
    })

    this.$data.colorTags = data
  },
  methods: {
    closeStateModal() {
      this.showStateModal = false
      // this.getOrderList()
    },
    //订单状态
    orderStatus(val) {
      if (!val) {
        return
      }
      let status = this.$data.ptstatus.find((item) => item.id == val)
      return status ? status.label : '--'
    },
    //一键下单
    oneClickOrder(row, index, oneClick, goodsItem) {
      row.index = index
      row.oneClick = oneClick
      this.$data.rowData = row
      this.oneClickOrderVisible = true
      this.$data.isOneClick = oneClick
      // sessionStorage[goodsItem.variationId] = goodsItem.sourceUrl?goodsItem.sourceUrl:''
    },
    //取消一键下单
    oneClickOrderCancel() {
      sessionStorage.oneClickData = JSON.stringify(
        this.$refs.oneClickPop.saveFormData(
          this.$refs.oneClickPop.form.getFieldsValue()
        )
      )
      sessionStorage[
        this.$refs.oneClickPop.variationIdcur
      ] = this.$refs.oneClickPop.form.getFieldValue('purchaseUrl')
        ? this.$refs.oneClickPop.form.getFieldValue('purchaseUrl')
        : ''
      this.oneClickOrderVisible = false
    },
    //批量发货预报弹窗
    batchLogisticsForecast(row) {
      if (row) {
        this.selectedRows = [row]
      }
      if (this.$route.path == '/oms/order/page-unpackaged') {
        //未打包页面oms嵌套处理
        let selectList = []
        this.selectedRows.forEach((order) => {
          if (order.orderShopeeOrderPackageDTOS.length > 1) {
            order.orderShopeeOrderPackageDTOS.forEach(
              ({ ordersn, packageNumber }) => {
                selectList.push({
                  platformOrderNo: ordersn,
                  platformPackageNumber: packageNumber
                })
              }
            )
          } else {
            selectList.push({
              platformOrderNo: order.ordersn,
              platformPackageNumber:
                order.packageNumber ||
                order.orderShopeeOrderPackageDTOS[0].packageNumber
            })
          }
        })
        window.parent.postMessage(
          {
            operation: 'deliveryForecast',
            selectList
          },
          '*'
        )
      } else {
        this.$refs.batchLogisticsForecast['showModal'] = true
      }
    },
    //批量代打包弹窗
    batchPackage() {
      this.$refs.BatchPackage['showModal'] = true
    },
    //重新绑定
    reBind() {
      this.$data.forecastDetailsVisible = false
      this.$data.forecastVisible = true
    },
    //关闭发货预报弹窗
    forecastCancel() {
      this.$data.forecastDetailsVisible = false
      this.$data.forecastVisible = false
    },

    // 2 打印面单 3 申请运单号 4 同步所有订单 5 同步选中订单 7发货预报
    observer(type) {
      let selectedList = this.orderList.filter((item) => item.check)
      let selectedIds = selectedList.map((el) => el.ordersn)
      if (selectedIds.length == 0) {
        this.errorAlert(this.$t('order.selectOrder'))
        return
      }
      switch (type) {
        case 2:
          this.printOrder(null, selectedIds)
          break
        case 3:
          this.appealOrder(null, selectedList)
          break
        case 4:
          this.syncOrder(null, selectedIds)
          break
        case 7:
          this.selectedRows = selectedList
          this.batchLogisticsForecast()
          break
        case 8:
          this.selectedRows = selectedList
          this.batchPackage()
          break
      }
    },
    //全选
    checkAllChange(checked) {
      this.isCheckAll = checked
      this.orderList = this.orderList.map((item) => {
        item.check = checked
        return item
      })
      this.indeterminate = false
    },

    // 单项选中
    checkChange(checked, item) {
      this.$set(item, 'check', checked)
      this.isCheckAll = this.orderList.every((item) => item.check)
      this.indeterminate =
        this.orderList.some((item) => item.check) && !this.isCheckAll
    },
    //编辑备注
    editRemark(item) {
      this.$set(item, 'remarkVisible', true)
      this.$data.current = item
      this.$data.orderRemark = item.orderRemark
      this.$nextTick(() => {
        this.$refs.remark[0].focus()
      })
    },

    changePage(page, pageSize) {
      this.pagination.current = page
      this.pagination.pageSize = pageSize
      this.getOrderList(true)
    },

    showSizeChange(current, size) {
      this.pagination.pageSize = size
      this.getOrderList()
    },
    // 申请运单号
    appealOrder(item, rows, packageNumber) {
      if (item == null) {
        let params = []
        rows.forEach((items) => {
          items.orderShopeeOrderPackageDTOS.forEach((pack) => {
            if (!pack.trackingNo) {
              params.push({
                orderSn: pack.ordersn,
                packageNumber: pack.packageNumber || items.packageNumber
              })
            }
          })
        })
        if (!params.length)
          return this.$message.warning('选中的订单已经申请运单号！')
        Order.batchApplyWaybillNumber(params).then((res) => {
          if (res.code == 0) {
            this.isCheckAll = false
            this.successAlert(this.$t('order.waybillNumberSuccess'))
            this.getOrderList()
          }
        })
      } else {
        Order.batchApplyWaybillNumber([
          {
            orderSn: item.ordersn,
            packageNumber: packageNumber || item.packageNumber
          }
        ]).then((res) => {
          if (res.code == 0) {
            this.isCheckAll = false
            this.successAlert(this.$t('order.waybillNumberSuccess'))
            this.getOrderList()
          }
        })
      }
    },
    // 申请运单号
    // appealOrder(item, ids) {
    //   //之前APi
    //   console.log('申请运单号')
    //   // if (item == null) {
    //   //   let params = {
    //   //     ordersn: ids || [item.ordersn]
    //   //   }
    //   //   const url =
    //   //     'http://47.106.161.44:18000/get_invoice?ordersn=' +
    //   //     ids +
    //   //     '&platform=7-11'
    //   //   this.this.trackVisible = true
    //   //   this.currentTrackLink = url
    //   //   // Order.appealOrder(params).then((res) => {
    //   //   //   if (res.code == 0) {
    //   //   //     this.isCheckAll = false
    //   //   //     this.successAlert(this.$t('order.waybillNumberSuccess'))
    //   //   //     this.getOrderList()
    //   //   //   }
    //   //   // })
    //   // } else {
    //   //   this.orderSn = ids || item.ordersn
    //   //   // this.$nextTick(function() {
    //   //   //
    //   //   //
    //   //   //
    //   //   // })
    //   //   this.getOrderSendType()
    //   // }
    // },
    /**
     *  获取出货类型
     */
    // async getOrderSendType() {
    //   let that = this
    //   Package.getPickupType({ ordersn: this.orderSn }).then((res) => {
    //     const temp = []
    //     if (res.data.dropoff) {
    //       temp.push(this.all[0])
    //     }

    //     if (res.data.pickup) {
    //       temp.push(this.all[1])
    //     }
    //     that.content = temp
    //     that.showStateModal = true
    //   })
    // },

    // 同步订单 按订单同步
    syncOrder(item, ids) {
      let params = {
        ordersn: ids || [item.ordersn]
      }
      Order.syncOrder(params).then((res) => {
        if (res.code == 0) {
          this.isCheckAll = false
          this.successAlert(this.$t('order.syncSuccess'))
          this.getOrderList()
        }
      })
    },

    // 打印面单
    printOrder(item, ids) {
      let params = {
        ordersn: ids || [item.ordersn]
      }
      Order.printOrder(params).then((res) => {
        if (res.code == 0) {
          this.isCheckAll = false
          this.successAlert(this.$t('order.printFaceSheetSucc'))
          if (res.data != '') {
            this.openPage(res.data[0], '_blank')
          }
        }
      })
    },

    // 获取订单列表 //changePage时flag=true
    getOrderList(flag = false) {
      const { current, pageSize: size } = this.pagination

      let params = Object.assign({ current, size }, {})
      params = Object.assign(this.$props.searchParams, params)
      if (!flag) {
        params.current = 1
      }
      if (!params.status) {
        if (this.$route.query.status) {
          params.status = this.$route.query.status
        }
      }
      bus.$on('vtab-index', (data) => {
        this.$data.vtabIndex = data
      })

      if (!this.$props.searchParams.status && this.$data.vtabIndex !== 0) {
        if (this.$route.path == '/order/page-ready') {
          params.status = 'READY_TO_SHIP'
        } else if (this.$route.path == '/order/page-retry') {
          params.status = 'READY_TO_SHIP2'
        }
      }
      if (
        this.$route.path == '/order/page-packing' ||
        this.$route.path == '/oms/order/page-packing'
      ) {
        params.type = 2
      }
      // else if(this.$route.path == '/order/page-packaged') {
      //   params.type = 1
      // }
      Order.getOrderList(params).then(({ data }) => {
        bus.$emit('reload-page')
        data.records.map((el) => {
          el.menuVisible = false
          el.check = false
        }) //用于备注的菜单组件显示
        this.orderList = data.records
        // 通过插件侧同步订单状态
        if (params.status == 'READY_TO_SHIP2' && this.orderList.length > 0) {
          this.handleBatchSyncOrderStatus()
        }
        this.pagination.total = data?.total ?? 0

        // this.paginationData = this.getPageFromRespNum(data)
      })
    },

    //修改备注
    handleChangeRemark(item) {
      let params = {
        ordersn: item.ordersn || this.labelModalInfo.ordersn,
        remark: this.$data.orderRemark
      }
      item.orderRemark = this.$data.orderRemark
      item.remarkVisible = false

      Order.setOrderRemark(params).then((res) => {
        if (res.code == 0) {
          this.successAlert(this.$t('common.handlerSuccess'))
          this.getOrderList()
        }
      })
    },

    //核对地址
    handleCheckAddress(item) {
      let { name, fullAddress } = item.orderAddress
      this.checkAddressText = `Dear buyer: ${name},please check your shipping address: ${fullAddress}~`
    },
    //待打包弹窗 入口
    handlePackge(item) {
      this.records = item
      this.$refs.AddPackageOrder['showModal'] = true
    },
    //代打包下单old-------------------
    handlePackgeOld(item) {
      let id = item.ordersn
      if (item.fwPackageId) {
        this.openPage(`/order/page-packaged?id=${id}`)
      } else {
        this.createPackagePop(id, item)
        // let url =
        //   this.$route.path == '/oms/order/page-packing'
        //     ? '/oms/package/create'
        //     : '/package/create'
        // this.$router.push(
        //   `${url}?id=${id}&storeType=${item.storeType}&currency=${item.currency}&storeCountry=${item.storeCountry}`
        // )
      }
    },
    //代打包下单弹窗
    createPackagePop(id, item) {
      this.$data.packageOrdersn = id
      this.$data.packageOrderData = item
      this.$data.createPackageVisible = true
    },
    //保存打包信息
    async createPackageOk() {
      this.$data.confirmLoading = true
      let flag = await this.$refs.createPackage.submitPackage()
      this.$data.confirmLoading = false
      if (!flag) {
        this.$data.createPackageVisible = flag
        this.getOrderList()
      }
    },
    /**
     * 标签改变事件
     */
    onLabelChange({ colorCode, tagsContent }) {
      bus.$emit('order-color-tags-change', { colorCode, tagsContent })
      this.$data.colorTags = this.$data.colorTags.map((ele) => {
        if (ele.colorCode === colorCode)
          ele.tagsContent = tagsContent || this.$t('common.noDescription')

        return ele
      })
    },
    /**
     * 获取选中的订单
     */
    getSelected() {
      return this.$data.orderList.filter(({ check }) => check)
    },
    showLogisticsMessage(item) {
      this.$data.showLogisticsMessageVisible = true
      this.$data.current = item
    },
    //取消关联
    quitRelation(row) {
      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('order.toDisassociate'),
        onOk: async () => {
          let res = await Order.quitRelation({
            ordersn: row.ordersn,
            purchaseVariationsId: row.purchaseVariationsId
          })
          if (res.code === 0) {
            this.$Message({
              type: 'success',
              content: this.$t('common.handlerSuccess')
            })
            this.getOrderList()
          } else {
            this.$Message({ type: 'error', content: `${res.message}` })
          }
        }
      })
    },
    //查询物流
    queryLogistics(sn) {
      this.openPage('https://www.baidu.com/s?wd=' + sn, '_blank')
    },
    //获取登入状态
    getLoginStatus(purchasePlatform) {
      const domId = 'emalacca-chrome-extension-purchas-auth'
      const dom = document.getElementById(domId)
      if (!dom) return false //this.$message.error(this.$t('order.pluginsErrpr'))
      const ispddlogin = dom.getAttribute('ispddlogin')
      const is1688login = dom.getAttribute('is1688login')
      const purchasePlatformObj = {
        拼多多: ispddlogin,
        1688: is1688login
      }
      if (purchasePlatformObj[purchasePlatform] === 'false') {
        return true
      } else {
        return false
      }
    },
    //跳转shopee订单
    goOrder(url) {
      if (url) {
        this.openPage(url, '_blank')
      }
    },
    //跳转shopee商品
    goGoods(url) {
      if (url) {
        this.openPage(url, '_blank')
      }
    },
    //去登入
    goLogin(order) {
      let { purchasePlatform, purchaseAccount, orderno } = order.purchaseDetail
      const purchasePlatformUrl = {
        拼多多: 'https://mobile.yangkeduo.com/login.html',
        1688: 'https://login.1688.com/member/signin.htm'
      }
      console.log(order)
      this.openPage(purchasePlatformUrl[purchasePlatform], '_blank')
    },

    // 刷新订单状态
    async onRefreshOrderStatus(order) {
      console.log(order)
    },

    // 通过插件侧同步订单信息
    handleBatchSyncOrderStatus() {
      // 取出当前订单列表中的有订单号的
      let purchasList = []
      this.orderList.map((el) =>
        el.items.map((purchas) => {
          // 上次同步时间距当前时间超过3分钟
          let { syncTime } = purchas.purchaseDetail
          let condition = Date.parse(new Date()) - Date.parse(syncTime) > 180000
          if (condition || syncTime == null) {
            purchasList = purchasList.concat({
              ...purchas.purchaseDetail,
              itemName: purchas.purchaseDetail.orderno
            })
          }
        })
      )
      if (purchasList.length > 0) {
        this.$notification.open({
          message: this.$t('common.message'),
          duration: 6,
          type: 'info',
          description: this.$t('order.beginSyncOrderInfo')
        })
        window.postMessage(
          {
            action: 'batch-sync-purchas-order-detail',
            params: {
              purchasList: purchasList //这里必须是数组
            }
          },
          '*'
        )
        let self = this
        window.addEventListener('message', self.erpMessageHandler, false)
      }
    },
    // 监听来自插件侧的消息
    async erpMessageHandler(e) {
      if (
        e.data &&
        e.data.action == 'resolve-purchas-order-detail' &&
        e.data.code == 0
      ) {
        let { itemName, isFinish } = e.data.result
        let params = e.data.result
        Order.handleUpdateExpressInfo(params).then((res) => {
          if (res.code == 0) {
            this.$notification.open({
              message: this.$t('common.message'),
              type: 'success',
              description: `【${itemName}】${this.$t('order.syncSuccess')}`
            })
          }

          if (isFinish) {
            this.getOrderList()
          }
        })
      }
    }
  },
  beforeDestroy() {
    bus.$off('batch-action', this.observer)
    window.removeEventListener('message', null)
  }
}
</script>

<style lang="scss">
.order-list-wrap-yile {
  border-radius: 2px;
  // .v-input__slot {
  //   margin-top: -6px !important;//分页没有对齐所以注释了这行代码
  // }
  .list-header-box {
    margin-top: 10px;
    display: flex;
    background-color: #fff;
    height: 42px;
    border: 1px solid #ebebeb;
    line-height: 42px;

    .v-input__slot {
      margin-top: -6px !important;
    }

    .list-header-content {
      padding-left: 20px;
    }

    .list-header-order {
      display: flex;
      width: calc(40% - 40px);
      border-right: 1px solid rgb(239, 239, 239);

      .list-order-text {
        flex: 1;
        text-align: center;
      }

      .v-input--selection-controls {
        margin-top: 3px;
      }
    }
    .me-orderRemark {
      width: 200px;
      display: inline-block;
    }
    .list-header-p {
      width: 12%;
      border-right: 1px solid rgb(239, 239, 239);
    }

    .list-header-buy-m {
      width: 18%;
      border-right: 1px solid rgb(239, 239, 239);
    }

    .list-header-logistics-m {
      width: 18%;
      border-right: 1px solid rgb(239, 239, 239);
    }

    .list-header-store {
      width: 15%;
    }
  }

  //备注
  .remarks-wrap {
    width: 400px;
    z-index: 10;
    background: #fff;
    padding: 12px;

    .bottom-action {
      display: flex;
      justify-content: flex-end;
      font-size: 14px;
    }
  }

  .me-orderRemark {
    width: 200px;
    display: inline-block;
  }
  .list-section {
    margin-top: 8px;
    border: 1px solid #ebebeb;

    .list {
      background: #fff;
    }

    .list-title-box {
      div,
      label {
        float: left;
      }
      // checkbox层
      label {
        margin-left: -10px;
        margin-right: 20px;
      }

      .eidt {
        cursor: pointer;
      }

      // height: 40px;
      overflow: hidden;
      line-height: 40px;
      padding-left: 20px;
      font-size: 14px;
      // display: flex;
      border-bottom: 1px solid #ebebeb;
      position: relative;

      .order-number {
        color: #409eff;
      }

      .order-status {
        margin-left: 20px;
      }

      .order-time {
        margin-left: 20px;
      }

      .operation {
        float: right;

        & > * {
          float: left;
        }

        // position: absolute;
        // right: 0;
        // top: 0;
        // display: flex;
        .text {
          color: $primaryColor;
          margin-right: 28px;
          cursor: pointer;
        }
      }
    }

    .item-box {
      font-size: 14px;
      display: flex;

      .item-content {
        color: #909099;
      }

      .item-order-box {
        width: 40%;
        border-right: 1px solid rgb(239, 239, 239);
        display: flex;
        flex-wrap: wrap;
        // padding: 0 12px;

        .goods-item {
          display: flex;
          margin: 10px;
          min-height: 90px;

          .order-left {
            flex: 0 0 80px;
            height: 80px;

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

            .order-price-box {
              display: flex;
              color: #909099;

              .order-price {
                padding-left: 30px;
              }
            }

            .order-coding-box {
              color: #909099;
            }
          }
        }

        .me-is-purchase2 {
          min-height: 150px;
        }

        //已经登入
        .me-is-purchase {
          min-height: 220px;
        }
      }

      .item-p-box {
        padding-left: 40px;
        width: 12%;
        border-right: 1px solid rgb(239, 239, 239);
        padding: 12px;

        .item-p {
          .p-content {
            color: #909099;
          }
        }
      }

      .item-buy-m-box {
        width: 18%;
        border-right: 1px solid rgb(239, 239, 239);
        padding: 12px;

        .buyer-box,
        .buyer-m-box {
          margin-left: 5px;
        }
      }

      .item-logistics-m-box {
        padding: 12px;
        width: 18%;
        border-right: 1px solid rgb(239, 239, 239);

        .logistics-details {
          color: #409eff;
        }

        .logistics-n-box {
          margin-top: 20px;
        }
      }

      .item-store-box {
        width: 15%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .footer-wrap {
      border-top: 1px solid #ebebeb;
      display: block !important;
      overflow: hidden;

      .footer-item {
        display: inline-block !important;
        padding-top: 0;
        padding-bottom: 0;

        .text {
          font-size: 14px;
          color: #727272;
          padding-left: 20px;
          line-height: 54px;
          padding-right: 5px;
        }

        .info-text {
          font-size: 14px;
          color: #303031;
          line-height: 54px;
        }

        .v-text-field {
          margin-top: 0;
        }

        .item-input {
          height: 50px;
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.order-c-text {
  color: #303031;
}

.me-forecast-tag {
  height: 22px;
  margin-top: 9px;
  margin-left: 10px;
}

.me-shop {
  float: right;
  margin-right: 20px;
}

.me-purchaseDetail {
  li {
    padding: 5px;
  }
}

.me-logistics {
  color: #409eff;
  cursor: pointer;
}

.me-purchase-detail {
  width: 100%;
}

.me-trackingNo {
  font-weight: normal;
}

.me-one-order {
  height: 100%;
  display: table;
  width: 100%;
  padding: 0;

  li {
    display: table-row;

    div {
      padding: 5px;
      display: table-cell;
      border-top: 1px solid #efefef;
      vertical-align: middle;
      text-align: center;
      height: 110px;
    }

    dl {
      padding: 5px;
      border-top: 1px solid #efefef;
    }
  }

  li:first-child {
    div,
    dl {
      border: none;
    }
  }
}

.dbm {
  display: block;
  margin: 0 auto;
}

.me-cur {
  cursor: pointer;
}

.me-syncOrder {
  font-size: 14px;
  margin-right: 20px;
}
.pagination {
  display: flex;
  justify-content: flex-end;
  background: #fff;
  padding: 20px;
}
.me-copy-icon {
  color: rgba(0, 0, 0, 0.54);
  height: 0px;
  position: relative;
  top: 1px;
}
</style>
