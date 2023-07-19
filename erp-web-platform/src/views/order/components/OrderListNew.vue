<template>
  <div class="order-list-wrap">
    <div class="me-selected-data-num" v-if="orderList.length > 0">
      <span
        >已选择{{
          this.orderList.filter((item) => item.check).length
        }}条数据，此页共{{ orderList.length }}条数据</span
      >
    </div>
    <!--    <span @click='appealOrder'>oik</span>-->
    <div class="list-header-box">
      <!-- <div class="all-checkbox"></div> -->
      <div class="list-header-order">
        <a-checkbox
          :checked="isCheckAll"
          :indeterminate="indeterminate"
          @change="(e) => checkAllChange(e.target.checked)"
          class="me-mr-1"
        ></a-checkbox>
        <a-dropdown>
          <!-- 11<a-icon type="down" style="color:#979797" /> -->
          <span class="ant-dropdown-link">
            <b v-if="checkedChangeFlag == 0">{{ $t('order.all') }}</b
            ><b v-if="checkedChangeFlag == 1">{{ $t('order.mainland') }}</b
            ><b v-if="checkedChangeFlag == 2">{{ $t('order.crossBorder') }}</b
            ><a-icon type="down" />
          </span>
          <a-menu slot="overlay" @click="checkedChange">
            <a-menu-item :key="0">
              {{ $t('order.all') }}
            </a-menu-item>
            <a-menu-item :key="1">
              {{ $t('order.mainland') }}
            </a-menu-item>
            <a-menu-item :key="2">
              {{ $t('order.crossBorder') }}
            </a-menu-item>
          </a-menu>
        </a-dropdown>
        <div class="list-order-text">{{ $t('order.goodsInfo') }}</div>
      </div>
      <div class="list-header-p list-header-content">
        {{ $t('order.orderAmount') }}
      </div>
      <div class="list-header-buy-m list-header-content">
        {{ $t('order.buyInfo') }}
      </div>
      <div class="list-header-logistics-m list-header-content">
        {{ $t('order.logisticsInfo') }}
      </div>
      <div class="list-header-store list-header-content">
        {{ $t('order.purchaseOrPack') }}
      </div>
    </div>
    <div class="list-section">
      <a-spin :spinning="spinning">
        <template v-if="orderList.length > 0">
          <div
            class="list me-mb-3"
            v-for="item in orderList"
            :key="item.ordersn"
          >
            <!-- 订单项操作 -->
            <div class="order-item-action">
              <a-checkbox
                class="order-checnkbox"
                :checked="item.check"
                @change="(e) => checkChange(e.target.checked, item)"
              ></a-checkbox>
              <div class="button-group">
                <!-- 同步订单 -->
                <a-button size="small" @click="syncOrder(item)"
                  >{{ $t('order.syncOrder') }}
                </a-button>
                <div
                  v-if="
                    checkStatus(
                      ['READY_TO_SHIP', 'PROCESSED', 'RETRY_SHIP', 'SHIPPED'],
                      item
                    )
                  "
                >
                  <!-- 代打包下单 -->
                  <a-button
                    @click="handlePackge(item)"
                    size="small"
                    v-if="behalfPackages(item)"
                  >
                    {{ $t('order.behalfPackages') }}
                  </a-button>
                  <!-- 发货预报 -->
                  <a-button
                    size="small"
                    @click="batchLogisticsForecast(item)"
                    v-if="
                      checkStatus(
                        ['READY_TO_SHIP', 'RETRY_SHIP', 'PROCESSED'],
                        item
                      ) && item.storeType == 2
                    "
                  >
                    {{
                      getfmNo(item.orderShopeeOrderPackageDTOS)
                        ? '已发货预报'
                        : $t('order.logisticsForecast')
                    }}
                  </a-button>

                  <!-- v-auth="'goods:edit:sku'" -->
                  <a-button
                    v-auth="'order.page.overseas-warehouse'"
                    size="small"
                    @click="overseasWarehouse(item)"
                    v-if="
                      item.storeType == 1 &&
                        item.seaStatusDTO &&
                        (!item.seaStatusDTO.flag ||
                          !item.seaStatusDTO.successFlag)
                    "
                  >
                    海外仓发货
                  </a-button>
                </div>
                <div
                  v-if="
                    item.orderShopeeOrderPackageDTOS &&
                      !item.orderShopeeOrderPackageDTOS.filter(
                        (item) => item.trackingNo
                      ).length &&
                      checkStatus(['READY_TO_SHIP', 'RETRY_SHIP'], item) &&
                      item.storeType == 2
                  "
                >
                  <a-button
                    v-if="
                      item.orderShopeeOrderPackageDTOS &&
                        item.orderShopeeOrderPackageDTOS.length > 1
                    "
                    @click="orderUnSplitOrder(item.ordersn)"
                    size="small"
                    >取消拆单</a-button
                  >
                  <a-button
                    v-else-if="item.items && item.items.length > 1"
                    @click="
                      $router.push({
                        path:
                          $route.path == '/oms/order/page'
                            ? '/oms/order/split-order'
                            : '/order/split-order',
                        query: { id: item.ordersn }
                      })
                    "
                    size="small"
                    >拆分订单</a-button
                  >
                </div>
                <a-button
                  v-if="
                    checkStatus(
                      ['UNPAID', 'READY_TO_SHIP', 'RETRY_SHIP', 'PROCESSED'],
                      item
                    )
                  "
                  @click="cancelOrder(item)"
                  size="small"
                  >取消订单</a-button
                >
                <template v-if="checkStatus(['TO_RETURN', 'IN_CANCEL'], item)">
                  <a-button size="small"
                    ><router-link
                      :to="{
                        path:
                          $route.path == '/oms/order/page'
                            ? '/oms/order/after-sale-details'
                            : '/order/after-sale-details',
                        query: {
                          sn: item.ordersn,
                          price: item.totalAmount,
                          source: $route.path,
                          country: item.currency
                        }
                      }"
                      >同意</router-link
                    ></a-button
                  >
                  <a-button size="small"
                    ><router-link
                      :to="{
                        path:
                          $route.path == '/oms/order/page'
                            ? '/oms/order/after-sale-details'
                            : '/order/after-sale-details',
                        query: {
                          sn: item.ordersn,
                          price: item.totalAmount,
                          source: $route.path,
                          country: item.currency
                        }
                      }"
                      >拒绝</router-link
                    ></a-button
                  >
                  <a-button size="small"
                    ><router-link
                      :to="{
                        path:
                          $route.path == '/oms/order/page'
                            ? '/oms/order/after-sale-details'
                            : '/order/after-sale-details',
                        query: {
                          sn: item.ordersn,
                          price: item.totalAmount,
                          source: $route.path,
                          country: item.currency
                        }
                      }"
                      >查看退款/退货详情</router-link
                    ></a-button
                  >
                  <!-- <span class="me-return-tips"
                  ><i class="iconfont icondingshifabu1"></i>倒计时
                  {{ item.remainingTime }}，超时未处理买家申请将被自动接受</span
                > -->
                </template>
                <template
                  v-if="
                    checkStatus(['CANCELLED'], item) &&
                      item.cancelBy != 'system'
                  "
                >
                  <a-button size="small"
                    ><router-link
                      :to="{
                        path:
                          $route.path == '/oms/order/page'
                            ? '/oms/order/after-sale-details'
                            : '/order/after-sale-details',
                        query: {
                          sn: item.ordersn,
                          price: item.totalAmount,
                          source: $route.path,
                          country: item.currency,
                          cancel: true
                        }
                      }"
                      >查看退款/退货详情</router-link
                    ></a-button
                  >
                </template>
              </div>
            </div>
            <div class="list-title-box">
              <div class="order-status" :style="formatStatus(item.orderCode)">
                {{ item.orderStatus }}
              </div>
              <div
                v-if="
                  checkStatus(
                    ['READY_TO_SHIP', 'RETRY_SHIP', 'PROCESSED'],
                    item
                  )
                "
              >
                <span class="label">截止发货时间：</span>
                <span class="value">{{ item.shipByDate }}</span>
              </div>
              <div class="order-number me-cur">
                <span class="label">{{ $t('order.orderNum') }}：</span>
                <span
                  @click="openPage(item.shopeeSellerUrl, '_blank')"
                  class="me-link-h"
                  >{{ item.ordersn }} </span
                ><i
                  v-copy="item.ordersn"
                  title="复制"
                  class="iconfont iconjuxing1 me-copy-icon"
                ></i>
              </div>
              <div>
                <!-- <span class="label">{{ $t('order.orderCreateTime') }}：</span> -->
                <a-select v-model="listTimeSel" size="small" class="me-f12">
                  <a-select-option :value="1">
                    {{ $t('order.orderCreateTime') }}
                  </a-select-option>
                  <a-select-option :value="2">
                    {{ $t('order.payTime') }}
                  </a-select-option>
                </a-select>
                <span class="value me-list-time" v-if="listTimeSel == 1"
                  >:{{ item.orderCreateTime }}</span
                >
                <span class="value me-list-time" v-else
                  >:{{ item.payTime }}</span
                >
              </div>
              <!-- <div>
              <span class="label">{{ $t('order.payTime') }}：</span>
              <span class="value">{{ item.payTime }}</span>
            </div> -->
              <div>
                <span class="label">{{ $t('order.shop') }}：</span>
                <div class="shop-type-tag">
                  {{ STORE_TYPE[item.storeType] }}
                </div>
                <span class="value me-storeName" :title="item.storeName"
                  >{{ item.storeCountry }}/{{
                    item.storeAlias || item.storeName
                  }}</span
                >
              </div>
              <div v-if="item.seaStatusDTO && item.seaStatusDTO.flag">
                <span class="value">已海外仓发货</span>
                <a-tooltip
                  class="me-fail"
                  v-if="!item.seaStatusDTO.successFlag"
                >
                  <template slot="title">
                    {{ item.seaStatusDTO.failureReason }}
                  </template>
                  失败<a-icon type="question-circle" />
                </a-tooltip>
                <span v-else>：{{ item.seaStatusDTO.orderStatusDesc }}</span>
              </div>
            </div>
            <!-- 商品信息 -->
            <div
              v-if="
                item.orderShopeeOrderPackageDTOS &&
                  item.orderShopeeOrderPackageDTOS.length > 1
              "
            >
              <div
                class="item-box"
                v-for="(pack, index) in item.orderShopeeOrderPackageDTOS"
                :key="pack.packageNumber"
              >
                <div class="me-pack-check">
                  <a-checkbox
                    :disabled="!!pack.forwarderExpressPackages"
                    v-model="pack.check"
                    @change="packCheck(item.orderShopeeOrderPackageDTOS, index)"
                  ></a-checkbox>
                </div>
                <div class="item-order-box">
                  <div
                    class="goods-item"
                    v-for="(goodsItem, k) in pack.list"
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
                    <!-- 商品信息 -->
                    <div class="order-goods-info">
                      <div class="order-left">
                        <!-- <w-img :src="goodsItem.mainImage" style="width:60px;heigh"></w-img> -->
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
                          <span
                            class="breakAll me-link-h"
                            :title="goodsItem.itemName"
                            @click="openPage(goodsItem.shopeeItemUrl, '_blank')"
                            >{{ goodsItem.itemName }}</span
                          >
                        </div>
                        <div class="order-price-box">
                          <div>
                            <div class="order-group break-only-line">
                              <span class="order-conten"
                                >{{ $t('common.goodsCode') }}：</span
                              >
                              <a-tooltip placement="topLeft">
                                <template slot="title">
                                  {{ goodsItem.itemSku }}
                                </template>
                                <span class="order-c-text">{{
                                  goodsItem.itemSku
                                }}</span>
                              </a-tooltip>
                            </div>
                            <div class="order-groupB">
                              <span class="order-conten"
                                >{{ $t('common.unitPrice') }}：</span
                              >
                              <span class="order-c-text">
                                {{ goodsItem.variationOriginalPrice }}
                              </span>
                            </div>
                            <div class="order-groupB">
                              <span class="order-conten">折扣价：</span>
                              <span class="order-c-text">
                                {{
                                  goodsItem.variationDiscountedPrice ==
                                  goodsItem.variationOriginalPrice
                                    ? '-'
                                    : goodsItem.variationDiscountedPrice
                                }}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div class="order-group break-only-line">
                              <span class="order-conten"
                                >{{ $t('edit.specName') }}：</span
                              >
                              <a-tooltip placement="topLeft">
                                <template slot="title">
                                  {{ goodsItem.variationName }}
                                </template>
                                <span class="order-c-text">
                                  {{ goodsItem.variationName }}
                                </span>
                              </a-tooltip>
                            </div>

                            <div class="order-group">
                              <span class="order-conten"
                                >{{ $t('common.producNum') }}：</span
                              >
                              x<span class="order-c-text me-order-quantity">
                                {{ goodsItem.variationQuantityPurchased }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- 商品操作 -->
                    <div class="order-goods-action">
                      <span
                        v-if="
                          checkStatus(
                            ['READY_TO_SHIP', 'PROCESSED', 'RETRY_SHIP'],
                            item
                          ) && !goodsItem.purchaseDetail
                        "
                      >
                        <a-button
                          class="action-button me-cancel-rel"
                          size="small"
                          @click="
                            oneClickOrder(
                              item,
                              goodsItem.variationId,
                              true,
                              goodsItem
                            )
                          "
                          ><i class="iconfont iconcaigoujihua"></i
                          >{{ $t('order.procurement') }}
                        </a-button>
                      </span>
                      <a-button
                        v-if="
                          checkStatus(
                            ['READY_TO_SHIP', 'PROCESSED', 'RETRY_SHIP'],
                            item
                          ) &&
                            !goodsItem.purchaseDetail &&
                            behalfFlag(pack.forwarderExpressPackages)
                        "
                        class="action-button me-cancel-rel me-ml-2"
                        size="small"
                        @click="
                          oneClickOrder(
                            item,
                            goodsItem.variationId,
                            false,
                            goodsItem
                          )
                        "
                      >
                        <i class="iconfont iconbaoguo me-pet1"></i
                        >{{ $t('order.associatedPackages') }}
                      </a-button>
                    </div>
                  </div>
                  <!-- <div v-if="pack.list && pack.list.length > 2" class="expand">
                    <p @click="handleExpand(item)" class="me-cp">
                      <span v-if="!item.expand"
                        >展开剩余{{ item.items.length - 2 }}条</span
                      >
                      <span v-else>收起</span>
                      <a-icon
                        class="expand-icon me-ml-1"
                        :class="{ 'expand-icon-expand': item.expand }"
                        type="down"
                      />
                    </p>
                  </div> -->
                </div>
                <div class="item-p-box">
                  <div class="item-p">
                    <span class="p-content">
                      {{ $t('order.totalPrice') }}({{ item.currency }})： </span
                    ><br />
                    <span class="p-text item-text">{{ item.totalAmount }}</span>
                  </div>
                  <div class="item-p me-pt-1">
                    <span class="p-content">
                      {{ $t('common.freight') }} ({{ item.currency }})： </span
                    ><br />
                    <span class="p-text item-text">{{
                      item.estimatedShippingFee
                    }}</span>
                  </div>
                  <div class="item-p me-pt-1">
                    <span class="p-content">
                      {{ $t('order.actualFreight') }}({{
                        item.currency
                      }})： </span
                    ><br />
                    <span class="p-text item-text">{{
                      item.actualShippingCost
                    }}</span>
                  </div>
                </div>
                <!-- 买家信息 -->
                <div class="item-buy-m-box">
                  <div class="buyer-box">
                    <div class="item-content">{{ $t('order.buyers') }}</div>
                    <div class="item-text breakword">
                      {{ item.buyerUsername }}
                    </div>
                  </div>
                  <div class="buyer-box">
                    <div class="item-content">{{ $t('order.consignee') }}</div>
                    <div class="info-text">{{ item.orderAddress.name }}</div>
                  </div>
                  <div class="buyer-box">
                    <div class="item-content">
                      {{ $t('order.receivingAddress') }}
                    </div>
                    <a-tooltip>
                      <template slot="title">
                        {{ item.orderAddress.fullAddress }}
                      </template>
                      <div class="info-text receivingAddress">
                        {{ item.orderAddress.fullAddress }}
                      </div>
                    </a-tooltip>
                  </div>
                </div>
                <!-- 物流 -->
                <div class="item-logistics-m-box">
                  <div class="assign-logistics-box">
                    <span class="item-content"
                      >{{ $t('order.buyerLogistics') }}：</span
                    ><br />
                    <span>{{ item.shippingCarrier }}</span>
                  </div>
                  <div class="logistics-n-box">
                    <span class="item-content"
                      >{{ $t('order.logisticsNo') }}：</span
                    ><br />
                    <span
                      @click="showLogisticsMessage(pack)"
                      class="aitem-content me-link-h"
                    >
                      {{ pack.trackingNo }}
                    </span>
                  </div>
                  <div v-if="!pack.trackingNo">
                    <i class="iconfont icontianjia"></i>
                    <a-button
                      type="link"
                      size="small"
                      class="action"
                      :loading="item._shenqing"
                      @click="appealOrder(item, '', pack.packageNumber)"
                      >{{ $t('order.applicationWaybillNumber') }}
                    </a-button>
                  </div>
                  <div v-if="pack.trackingNo">
                    <!-- {{ item.isSplitUp }} --{{ pack.packageNumber }} -->
                    <i class="iconfont icondayinmiandan"></i>
                    <a-button
                      type="link"
                      size="small"
                      class="action"
                      :loading="pack.printLoading"
                      @click="printOrder(item, '', pack)"
                      >{{ pack.isPrintDetailsList ? '已' : ''
                      }}{{ $t('order.printFaceSheet') }}
                    </a-button>
                  </div>
                  <div class="logistics-n-box" v-if="pack.fmNo">
                    <span class="item-text"
                      >{{ $t('order.domesticLogistics') }}：</span
                    >{{ pack.fmNo }}（{{ pack.fmLogisticName }}）
                  </div>
                </div>
                <div class="item-store-box">
                  <div class="switch-button">
                    <div
                      :class="{ active: !item.active }"
                      @click="activeChange(item)"
                    >
                      {{ $t('order.purchaseOrderStatus') }}
                    </div>
                    <div
                      :class="{ active: item.active }"
                      @click="activeChange(item)"
                    >
                      {{ $t('order.generationPackagingState') }}
                    </div>
                  </div>
                  <ul class="me-one-order" v-if="item.active">
                    <li>
                      <dl
                        class="me-purchaseDetail"
                        v-if="
                          item.active &&
                            pack.forwarderExpressPackages &&
                            pack.forwarderExpressPackages.length
                        "
                      >
                        <dd class="c909">
                          货代商 ：<br /><span class="c303">{{
                            pack.forwarderExpressPackages[0].forwarderName
                          }}</span>
                        </dd>
                        <dd class="c909">
                          国内物流状态 ：<br /><span
                            class="me-status-primary"
                            >{{
                              packgaeStatus[
                                pack.forwarderExpressPackages[0]
                                  .packageStatus || 0
                              ]
                            }}</span
                          >
                        </dd>

                        <dd class="c909">
                          <template
                            v-if="
                              pack.forwarderExpressPackages[0].packageType === 1
                            "
                          >
                            国内快递单号 ：<br />
                            <span
                              class="me-link-h"
                              @click="
                                queryLogistics(
                                  pack.forwarderExpressPackages[0].expressNo
                                )
                              "
                            >
                              {{ pack.forwarderExpressPackages[0].expressNo }}
                            </span>
                          </template>

                          <template v-else>
                            库存备货 ：<br />
                            <span>
                              {{ pack.forwarderExpressPackages[0].goodsSku }} *
                              {{ pack.forwarderExpressPackages[0].outStockNum }}
                            </span>
                          </template>
                        </dd>

                        <!-- 查看或编辑包裹详情 -->
                        <dd
                          class="me-logistics"
                          @click="
                            openPage(
                              `/package/list?platformOrderNo=${item.ordersn}`
                            )
                          "
                        >
                          {{ $t('order.lookOrEditParcel') }}
                        </dd>
                      </dl>
                      <dl
                        class="empty"
                        v-else-if="
                          item.active && !pack.forwarderExpressPackages
                        "
                      >
                        {{ $t('order.empty') }}
                      </dl>
                    </li>
                  </ul>
                  <ul class="me-one-order" v-else>
                    <li v-for="(goodsItem, k) in pack.list" :key="k">
                      <!-- 采购单状态 -->
                      <dl
                        class="me-purchaseDetail"
                        v-if="
                          !item.active &&
                            goodsItem.purchaseDetail &&
                            goodsItem.purchaseDetail.relationType
                        "
                      >
                        <dd>
                          <p>{{ $t('order.correlationTime') }} ：</p>
                          {{ goodsItem.purchaseDetail.relationTime }}
                        </dd>
                        <dd>
                          <p>{{ $t('order.logisticsCompany') }} ：</p>
                          {{ goodsItem.purchaseDetail.purchaseLogisticsName }}
                        </dd>
                        <dd>
                          <p>{{ $t('order.logisticsNo') }} ：</p>
                          <span
                            class="me-link-h"
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
                            checkStatus(
                              ['RETRY_SHIP', 'READY_TO_SHIP', 'PROCESSED'],
                              item
                            )
                          "
                        >
                          <a-button
                            class="me-cancel-rel"
                            size="small"
                            @click="quitRelation(goodsItem.purchaseDetail)"
                            >{{ $t('order.disassociate') }}
                          </a-button>
                        </dd>
                      </dl>
                      <dl
                        class="me-purchaseDetail"
                        v-else-if="!item.active && goodsItem.purchaseDetail"
                      >
                        <dd>
                          <p>{{ $t('order.purchasingStatus') }}：</p>
                          {{
                            orderStatus(goodsItem.purchaseDetail.purchaseStatus)
                          }}
                        </dd>
                        <dd>
                          <p>
                            {{ goodsItem.purchaseDetail.purchasePlatform
                            }}{{ $t('order.orderNum') }} ：
                          </p>
                          {{ goodsItem.purchaseDetail.purchaseOrderno }}
                        </dd>
                        <a-popover>
                          <template #content>
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
                              {{ $t('order.orderAccount') }} ：
                              <a-button
                                v-if="goodsItem.purchaseDetail.purchaseAccount"
                                type="link"
                                :loading="item._refreshAccount_"
                                class="me-refreshAccount"
                                @click="onRefreshOrderStatus(goodsItem)"
                              >
                                {{ goodsItem.purchaseDetail.purchaseAccount }}
                                <template v-if="!item._refreshAccount_">
                                  <a-icon
                                    v-if="item.syncFlag"
                                    type="redo"
                                  /><a-icon v-else type="loading" />
                                </template>
                              </a-button>
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
                                orderStatus(
                                  goodsItem.purchaseDetail.purchaseStatus
                                )
                              }}
                            </dd>
                            <dd
                              v-if="
                                goodsItem.purchaseDetail.purchaseLogisticsno
                              "
                            >
                              {{ $t('order.logisticsNo') }} ：
                              <span
                                class="me-link-h"
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
                          </template>
                          <span class="me-status-link me-cp">
                            {{ $t('order.more') }}
                          </span>
                        </a-popover>
                        <dd
                          v-if="
                            getLoginStatus(
                              goodsItem.purchaseDetail.purchasePlatform
                            )
                          "
                        >
                          {{ goodsItem.purchaseDetail.purchasePlatform }}
                          {{ $t('order.orderAccount') }}
                          <span class="cA07">{{
                            goodsItem.purchaseDetail.purchaseAccount
                          }}</span>
                          {{ $t('order.notLogged') }}
                          <span
                            class="me-status-link"
                            @click="goLogin(goodsItem)"
                            >{{ $t('login.login') }}
                          </span>
                          {{ goodsItem.purchaseDetail.purchasePlatform }}，{{
                            $t('order.pageAgain')
                          }}
                        </dd>
                        <dd
                          v-if="
                            checkStatus(
                              ['RETRY_SHIP', 'READY_TO_SHIP', 'PROCESSED'],
                              item
                            )
                          "
                        >
                          <a-button
                            @click="quitRelation(goodsItem.purchaseDetail)"
                            size="small"
                            class="me-cancel-rel"
                            >{{ $t('order.disassociate') }}
                          </a-button>
                        </dd>
                      </dl>
                      <dl
                        class="empty"
                        v-if="!item.active && !goodsItem.purchaseDetail"
                      >
                        {{ $t('order.empty') }}
                      </dl>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="item-box" v-else>
              <div class="item-order-box">
                <div
                  class="goods-item"
                  v-for="(goodsItem, k) in formatGoods(item.items, item.expand)"
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
                  <!-- 商品信息 -->
                  <div class="order-goods-info">
                    <div class="order-left">
                      <!-- <w-img :src="goodsItem.mainImage" style="width:60px;heigh"></w-img> -->
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
                        <span
                          class="breakAll me-link-h"
                          :title="goodsItem.itemName"
                          @click="openPage(goodsItem.shopeeItemUrl, '_blank')"
                          >{{ goodsItem.itemName }}</span
                        >
                      </div>
                      <div class="order-price-box">
                        <div>
                          <div class="order-group break-only-line">
                            <span class="order-conten"
                              >{{ $t('common.goodsCode') }}：</span
                            >
                            <a-tooltip placement="topLeft">
                              <template slot="title">
                                {{ goodsItem.itemSku }}
                              </template>
                              <span class="order-c-text">{{
                                goodsItem.itemSku
                              }}</span>
                            </a-tooltip>
                          </div>
                          <div class="order-groupB">
                            <span class="order-conten"
                              >{{ $t('common.unitPrice') }}：</span
                            >
                            <span class="order-c-text">
                              {{ goodsItem.variationOriginalPrice }}
                            </span>
                          </div>
                          <div class="order-groupB">
                            <span class="order-conten">折扣价：</span>
                            <span class="order-c-text">
                              {{
                                goodsItem.variationDiscountedPrice ==
                                goodsItem.variationOriginalPrice
                                  ? '-'
                                  : goodsItem.variationDiscountedPrice
                              }}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div class="order-group break-only-line">
                            <span class="order-conten"
                              >{{ $t('edit.specName') }}：</span
                            >
                            <a-tooltip placement="topLeft">
                              <template slot="title">
                                {{ goodsItem.variationName }}
                              </template>
                              <span class="order-c-text">
                                {{ goodsItem.variationName }}
                              </span>
                            </a-tooltip>
                          </div>

                          <div class="order-group">
                            <span class="order-conten"
                              >{{ $t('common.producNum') }}：</span
                            >
                            x<span class="order-c-text me-order-quantity">
                              {{ goodsItem.variationQuantityPurchased }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- 商品操作 -->
                  <div class="order-goods-action">
                    <span
                      v-if="
                        checkStatus(
                          ['READY_TO_SHIP', 'PROCESSED', 'RETRY_SHIP'],
                          item
                        ) && !goodsItem.purchaseDetail
                      "
                    >
                      <a-button
                        class="action-button me-cancel-rel"
                        size="small"
                        @click="
                          oneClickOrder(
                            item,
                            goodsItem.variationId,
                            true,
                            goodsItem
                          )
                        "
                        ><i class="iconfont iconcaigoujihua"></i
                        >{{ $t('order.procurement') }}
                      </a-button>
                    </span>
                    <a-button
                      v-if="
                        checkStatus(
                          ['READY_TO_SHIP', 'PROCESSED', 'RETRY_SHIP'],
                          item
                        ) &&
                          !goodsItem.purchaseDetail &&
                          behalfFlag(item.forwarderExpressPackages)
                      "
                      class="action-button me-cancel-rel me-ml-2"
                      size="small"
                      @click="
                        oneClickOrder(
                          item,
                          goodsItem.variationId,
                          false,
                          goodsItem
                        )
                      "
                    >
                      <i class="iconfont iconbaoguo me-pet1"></i
                      >{{ $t('order.associatedPackages') }}
                    </a-button>
                  </div>
                </div>
                <div v-if="item.items && item.items.length > 2" class="expand">
                  <p @click="handleExpand(item)" class="me-cp">
                    <span v-if="!item.expand"
                      >展开剩余{{ item.items.length - 2 }}条</span
                    >
                    <span v-else>收起</span>
                    <a-icon
                      class="expand-icon me-ml-1"
                      :class="{ 'expand-icon-expand': item.expand }"
                      type="down"
                    />
                  </p>
                </div>
              </div>
              <div class="item-p-box">
                <div class="item-p">
                  <span class="p-content">
                    {{ $t('order.totalPrice') }}({{ item.currency }})： </span
                  ><br />
                  <span class="p-text item-text">{{ item.totalAmount }}</span>
                </div>
                <div class="item-p me-pt-1">
                  <span class="p-content">
                    {{ $t('common.freight') }} ({{ item.currency }})： </span
                  ><br />
                  <span class="p-text item-text">{{
                    item.estimatedShippingFee
                  }}</span>
                </div>
                <div class="item-p me-pt-1">
                  <span class="p-content">
                    {{ $t('order.actualFreight') }}({{
                      item.currency
                    }})： </span
                  ><br />
                  <span class="p-text item-text">{{
                    item.actualShippingCost
                  }}</span>
                </div>
              </div>
              <!-- 买家信息 -->
              <div class="item-buy-m-box">
                <div class="buyer-box">
                  <div class="item-content">{{ $t('order.buyers') }}</div>
                  <div class="item-text breakword">
                    {{ item.buyerUsername }}
                  </div>
                </div>
                <div class="buyer-box">
                  <div class="item-content">{{ $t('order.consignee') }}</div>
                  <div class="info-text">{{ item.orderAddress.name }}</div>
                </div>
                <div class="buyer-box">
                  <div class="item-content">
                    {{ $t('order.receivingAddress') }}
                  </div>
                  <a-tooltip>
                    <template slot="title">
                      {{ item.orderAddress.fullAddress }}
                    </template>
                    <div class="info-text receivingAddress">
                      {{ item.orderAddress.fullAddress }}
                    </div>
                  </a-tooltip>
                </div>
              </div>
              <!-- 物流 -->
              <div class="item-logistics-m-box">
                <div class="assign-logistics-box">
                  <span class="item-content"
                    >{{ $t('order.buyerLogistics') }}：</span
                  ><br />
                  <span>{{ item.shippingCarrier }}</span>
                </div>
                <div class="logistics-n-box">
                  <span class="item-content"
                    >{{ $t('order.logisticsNo') }}：</span
                  ><br />
                  <span
                    @click="showLogisticsMessage(item)"
                    class="aitem-content me-link-h"
                  >
                    {{ item.trackingNo }}
                  </span>
                </div>
                <div v-if="!item.trackingNo">
                  <i class="iconfont icontianjia"></i>
                  <a-button
                    v-if="
                      item.orderShopeeOrderPackageDTOS &&
                        item.orderShopeeOrderPackageDTOS.length > 0
                    "
                    type="link"
                    size="small"
                    class="action"
                    :loading="item._shenqing"
                    @click="
                      appealOrder(
                        item,
                        '',
                        item.orderShopeeOrderPackageDTOS[0].packageNumber
                      )
                    "
                    >{{ $t('order.applicationWaybillNumber') }}
                  </a-button>
                </div>
                <div
                  v-if="
                    item.trackingNo &&
                      item.orderShopeeOrderPackageDTOS &&
                      item.orderShopeeOrderPackageDTOS.length > 0
                  "
                >
                  <!-- {{ item.isSplitUp }} -->
                  <i class="iconfont icondayinmiandan"></i>
                  <a-button
                    type="link"
                    size="small"
                    class="action"
                    :loading="item.orderShopeeOrderPackageDTOS[0].printLoading"
                    @click="
                      printOrder(item, '', item.orderShopeeOrderPackageDTOS[0])
                    "
                    >{{ item.isPrintDetailsList ? '已' : ''
                    }}{{ $t('order.printFaceSheet') }}
                  </a-button>
                </div>
                <div
                  class="logistics-n-box"
                  v-if="
                    item.orderShopeeOrderPackageDTOS &&
                      item.orderShopeeOrderPackageDTOS[0].fmNo
                  "
                >
                  <span class="item-text"
                    >{{ $t('order.domesticLogistics') }}：</span
                  >{{ item.orderShopeeOrderPackageDTOS[0].fmNo }}（{{
                    item.orderShopeeOrderPackageDTOS[0].fmLogisticName
                  }}）
                </div>
              </div>
              <div class="item-store-box">
                <div class="switch-button">
                  <div
                    :class="{ active: !item.active }"
                    @click="activeChange(item)"
                  >
                    {{ $t('order.purchaseOrderStatus') }}
                  </div>
                  <div
                    :class="{ active: item.active }"
                    @click="activeChange(item)"
                  >
                    {{ $t('order.generationPackagingState') }}
                  </div>
                </div>
                <ul class="me-one-order" v-if="item.active">
                  <li>
                    <dl
                      class="me-purchaseDetail"
                      v-if="
                        item.active &&
                          item.forwarderExpressPackages &&
                          item.forwarderExpressPackages.length
                      "
                    >
                      <dd class="c909">
                        货代商 ：<br /><span class="c303">{{
                          item.forwarderExpressPackages[0].forwarderName
                        }}</span>
                      </dd>
                      <dd class="c909">
                        国内物流状态 ：<br /><span class="me-status-primary">{{
                          packgaeStatus[
                            item.forwarderExpressPackages[0].packageStatus || 0
                          ]
                        }}</span>
                      </dd>

                      <dd class="c909">
                        <template
                          v-if="
                            item.forwarderExpressPackages[0].packageType === 1
                          "
                        >
                          国内快递单号 ：<br />
                          <span
                            class="me-link-h"
                            @click="
                              queryLogistics(
                                item.forwarderExpressPackages[0].expressNo
                              )
                            "
                          >
                            {{ item.forwarderExpressPackages[0].expressNo }}
                          </span>
                        </template>

                        <template v-else>
                          库存备货 ：<br />
                          <span>
                            {{ item.forwarderExpressPackages[0].goodsSku }} *
                            {{ item.forwarderExpressPackages[0].outStockNum }}
                          </span>
                        </template>
                      </dd>

                      <!-- 查看或编辑包裹详情 -->
                      <dd
                        class="me-logistics"
                        @click="
                          openPage(
                            `/package/list?platformOrderNo=${item.ordersn}`
                          )
                        "
                      >
                        {{ $t('order.lookOrEditParcel') }}
                      </dd>
                    </dl>
                    <dl
                      class="empty"
                      v-else-if="item.active && !item.forwarderExpressPackages"
                    >
                      {{ $t('order.empty') }}
                    </dl>
                  </li>
                </ul>
                <ul class="me-one-order" v-else>
                  <li
                    v-for="(goodsItem, k) in formatGoods(
                      item.items,
                      item.expand
                    )"
                    :key="k"
                  >
                    <!-- 采购单状态 -->
                    <dl
                      class="me-purchaseDetail"
                      v-if="
                        !item.active &&
                          goodsItem.purchaseDetail &&
                          goodsItem.purchaseDetail.relationType
                      "
                    >
                      <dd>
                        <p>{{ $t('order.correlationTime') }} ：</p>
                        {{ goodsItem.purchaseDetail.relationTime }}
                      </dd>
                      <dd>
                        <p>{{ $t('order.logisticsCompany') }} ：</p>
                        {{ goodsItem.purchaseDetail.purchaseLogisticsName }}
                      </dd>
                      <dd>
                        <p>{{ $t('order.logisticsNo') }} ：</p>
                        <span
                          class="me-link-h"
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
                          checkStatus(
                            ['RETRY_SHIP', 'READY_TO_SHIP', 'PROCESSED'],
                            item
                          )
                        "
                      >
                        <a-button
                          class="me-cancel-rel"
                          size="small"
                          @click="quitRelation(goodsItem.purchaseDetail)"
                          >{{ $t('order.disassociate') }}
                        </a-button>
                      </dd>
                    </dl>
                    <dl
                      class="me-purchaseDetail"
                      v-else-if="!item.active && goodsItem.purchaseDetail"
                    >
                      <dd>
                        <p>{{ $t('order.purchasingStatus') }}：</p>
                        {{
                          orderStatus(goodsItem.purchaseDetail.purchaseStatus)
                        }}
                      </dd>
                      <dd>
                        <p>
                          {{ goodsItem.purchaseDetail.purchasePlatform
                          }}{{ $t('order.orderNum') }} ：
                        </p>
                        {{ goodsItem.purchaseDetail.purchaseOrderno }}
                      </dd>
                      <a-popover>
                        <template #content>
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
                            {{ $t('order.orderAccount') }} ：
                            <a-button
                              v-if="goodsItem.purchaseDetail.purchaseAccount"
                              type="link"
                              :loading="item._refreshAccount_"
                              class="me-refreshAccount"
                              @click="onRefreshOrderStatus(goodsItem)"
                            >
                              {{ goodsItem.purchaseDetail.purchaseAccount }}
                              <template v-if="!item._refreshAccount_">
                                <a-icon
                                  v-if="item.syncFlag"
                                  type="redo"
                                /><a-icon v-else type="loading" />
                              </template>
                            </a-button>
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
                              orderStatus(
                                goodsItem.purchaseDetail.purchaseStatus
                              )
                            }}
                          </dd>
                          <dd
                            v-if="goodsItem.purchaseDetail.purchaseLogisticsno"
                          >
                            {{ $t('order.logisticsNo') }} ：
                            <span
                              class="me-link-h"
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
                        </template>
                        <span class="me-status-link me-cp">
                          {{ $t('order.more') }}
                        </span>
                      </a-popover>
                      <dd
                        v-if="
                          getLoginStatus(
                            goodsItem.purchaseDetail.purchasePlatform
                          )
                        "
                      >
                        {{ goodsItem.purchaseDetail.purchasePlatform }}
                        {{ $t('order.orderAccount') }}
                        <span class="cA07">{{
                          goodsItem.purchaseDetail.purchaseAccount
                        }}</span>
                        {{ $t('order.notLogged') }}
                        <span class="me-status-link" @click="goLogin(goodsItem)"
                          >{{ $t('login.login') }}
                        </span>
                        {{ goodsItem.purchaseDetail.purchasePlatform }}，{{
                          $t('order.pageAgain')
                        }}
                      </dd>
                      <dd
                        v-if="
                          checkStatus(
                            ['RETRY_SHIP', 'READY_TO_SHIP', 'PROCESSED'],
                            item
                          )
                        "
                      >
                        <a-button
                          @click="quitRelation(goodsItem.purchaseDetail)"
                          size="small"
                          class="me-cancel-rel"
                          >{{ $t('order.disassociate') }}
                        </a-button>
                      </dd>
                    </dl>
                    <dl
                      class="empty"
                      v-if="!item.active && !goodsItem.purchaseDetail"
                    >
                      {{ $t('order.empty') }}
                    </dl>
                  </li>
                </ul>
              </div>
            </div>
            <div class="footer-wrap">
              <div class="me-flex-shrink">
                <div class="label-box">
                  <span
                    class="edit"
                    @click="
                      labelModalInfo.visible = true
                      labelModalInfo.current = item
                      labelModalInfo.ordersn = item.ordersn
                    "
                  >
                    <!-- <span class="mdi mdi-eyedropper-variant"></span> -->
                    <a-icon class="me-form-ic" type="form" />
                    <span class="me-em1 me-w50 me-mr-1"
                      >{{ $t('common.tag') }}
                    </span>
                  </span>
                  <template v-if="item.orderLabels">
                    <a-tooltip
                      v-for="it in item.orderLabels3"
                      :key="it"
                      :title="filterColorTags(it)"
                      placement="bottom"
                      class="me-mr-1 me-em1 me-w50"
                    >
                      <a-tag :color="`#${it}`" class="me-order-tag"></a-tag>
                      {{ filterColorTags(it) }}
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
                      >更多</span
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
                  placeholder="请输入备注"
                  class="me-orderRemark"
                />
              </div>
              <span>更新时间：{{ item.orderUpdateTime }}</span>
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
        </template>
        <NoData v-else></NoData>
      </a-spin>
    </div>
    <!-- 物流信息弹窗 -->
    <LogisticsModal
      v-model="showLogisticsMessageVisible"
      :data.sync="current"
    ></LogisticsModal>

    <ChangePackStateModal
      :showModal="showStateModal"
      :content="content"
      :order-sn="orderSn"
      :orderPackageNumber="orderPackageNumber"
      @close="closeStateModal"
      @submitWaybillNum="syncOrder"
      :modal-title="$t('order.Shipment')"
    ></ChangePackStateModal>
    <a-modal
      :visible="oneClickOrderVisible"
      @cancel="oneClickOrderCancel"
      @ok="oneClickOrderOk"
      :okText="$t('order.nowBuy')"
      width="700px"
      :maskClosable="false"
      :destroyOnClose="true"
    >
      <template slot="title">
        {{
          isOneClick ? $t('order.procurement') : $t('order.associatedPackages')
        }}
        <span v-if="!hasInstallPlug" class="me-oneclick-tit"
          >检测到当前未安装马六甲插件，下载插件后才能下单<a-button
            type="link"
            @click="openPage(systemConfig.plugDownloadUrl, '_blank')"
            >下载插件</a-button
          ></span
        >
      </template>
      <OneClickOrder
        ref="oneClickPop"
        :rowData="rowData"
        :getOrderList="getOrderList"
        :oneClickOrderCancel="oneClickOrderCancel"
        :plugPopShow="plugPopShow"
      />
    </a-modal>
    <!-- 安装插件提示 -->
    <a-modal
      :visible="plugPopVisible"
      @cancel="plugPopVisible = false"
      width="400px"
      :footer="false"
      :maskClosable="false"
    >
      <div class="me-plug-pop">
        <img class="me-mt-4" :src="plugImg" />
        <h2 class="me-mt-4">系统检测到您当前未安装插件</h2>
        <p class="me-mt-1">
          请先安装马六甲插件后再下单，安装<br />成功后请刷新页面
        </p>
        <a-button
          class="me-mt-2"
          type="primary"
          @click="openPage(systemConfig.plugDownloadUrl, '_blank')"
          >下载插件
        </a-button>
        <p class="me-mt-2">不用了，我在其它渠道采购</p>
        <a-button class="me-f12" type="link" @click="manualRelation"
          >手动关联
        </a-button>
      </div>
    </a-modal>

    <!-- 代打包下单 -->
    <AddPackageOrder
      ref="AddPackageOrder"
      :records="records"
      :packageInfo="packageInfo"
      @submit="getOrderList"
    />
    <a-modal
      title="代打包下单"
      :visible="createPackageVisible"
      @cancel="createPackageVisible = false"
      @ok="createPackageOk"
      width="800px"
      :maskClosable="false"
      :destroyOnClose="true"
      :confirm-loading="confirmLoading"
    >
      <CreatePackageOrder
        ref="createPackage"
        :packageOrdersn="packageOrdersn"
        :packageOrderData="packageOrderData"
      />
    </a-modal>

    <OverseasWarehouseModel
      ref="OverseasWarehouseModel"
      :ordersnsArr="ordersnsArr"
      @submitDeliver="submitDeliver"
    />

    <!-- 打印面单和物品清单:printSheet="printSheet"
       -->
    <PrintItemList
      ref="PrintItemList"
      :translateChinese="translateChinese"
      v-show="false"
    />

    <!-- 取消订单弹窗 -->
    <CancelOrder
      v-if="cancelOrderFlag"
      :selectedOrdersn="selectedOrdersn"
      @getOrderList="getOrderList"
      @cancelFalse="cancelOrderFlag = false"
    ></CancelOrder>

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

    <!-- 打印拣货单 -->
    <a-modal
      title="打印拣货单"
      :visible="printPickingVisible"
      @ok="printPickingOk"
      @cancel="printPickingVisible = false"
      destroyOnClose
      :confirmLoading="printPickingLoading"
      okText="打印"
    >
      <a-radio default-checked>
        打印拣货单
      </a-radio>
      <a-checkbox v-model="translateChinese">
        物品清单翻译为中文
      </a-checkbox>
    </a-modal>
  </div>
</template>

<script>
import TagModal from '@/components/TagModal'
import { mapState } from 'vuex'
import OneClickOrder from './OneClickOrder.vue'
import Order from '@/api/order'
import LogisticsModal from './OrderLogisticsModal'
import bus from '@/bus'
import ChangePackStateModal from './ChangePackStateModal'
import { checkStatus, colorMap } from './js/common'
import orderMixins from './js/orderMixins'
import CreatePackageOrder from './CreatePackageOrder'
import OverseasWarehouseModel from './OverseasWarehouseModel'
import PrintItemList from './PrintItemList'
import NoData from '@/components/NoData'
import CancelOrder from './orderList/CancelOrder'
import moment from 'moment'
import Package from '@/api/package'
import AddPackageOrder from './AddPackageOrder.vue'
import { downloadFile } from '@/util/index'
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
  mixins: [orderMixins],
  components: {
    OneClickOrder,
    ChangePackStateModal,
    TagModal,
    LogisticsModal,
    CreatePackageOrder,
    OverseasWarehouseModel,
    PrintItemList,
    NoData,
    CancelOrder,
    AddPackageOrder,
    BatchLogisticsForecast,
    BatchPackage
  },
  props: {
    searchParams: Object
  },
  data() {
    return {
      moment,
      currentTrackLink: '',
      // trackVisible: false,
      pagination: {
        ...initPatination,
        showTotal: (total) =>
          `${this.$t('order.total')}${total}${this.$t('order.data')}`
      },
      paginationData: {
        current: 1,
        pages: 1,
        size: 10
      },
      orderList: [],
      labelModalInfo: {
        visible: false,
        current: null
      },
      isCheckAll: false,
      indeterminate: false,
      checkAddressText: null,
      colorTags: [],
      showLogisticsMessageVisible: false,
      current: {},
      forecastVisible: false,
      forecastDetailsVisible: false,
      currOderId: '',
      oneClickOrderVisible: false,
      isOneClick: true,
      rowData: '',
      // vtabIndex: '',
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
      installPlug: false, //是否已经安装插件
      plugPopVisible: false,
      plugImg: require('@/assets/images/plugin-icon2.png'),
      createPackageVisible: false,
      packageOrdersn: '',
      confirmLoading: false,
      remarkVisible: false,
      colorMap,
      STORE_TYPE: {
        1: this.$t('order.mainland'),
        2: this.$t('order.crossBorder')
      },
      checkedChangeFlag: 0,
      packgaeStatus: {
        0: '待收货',
        1: '待打包',
        2: '已签收', // 已打包>>> 已签收
        3: '已出库',
        4: '已至平台仓库',
        5: '已取消', // 已拒签>>> 已取消
        6: '退货中',
        7: '部分退货',
        8: '已退货'
      },
      orderRemark: '',
      timeInter: '',
      timeInterAfterSale: '',
      packageOrderData: '',

      ordersnsArr: [],

      printData: '',
      orderRow: '',
      cnPrintRequestDTO: '',
      listTimeSel: 1, //列表展示的时间类型
      cancelOrderFlag: false, //取消订单弹窗开关
      selectedOrdersn: '', //当前选中的订单
      spinning: false, //pageLoading
      records: null,
      orderPackageNumber: '', //选中的包裹
      packageInfo: '', //代打包选择包裹信息
      selectedRows: [], //选中的订单
      translateChinese: false, //物品清单翻译中午
      printPickingLoading: false,
      printPickingVisible: false
    }
  },
  computed: {
    ...mapState({
      systemConfig: (state) => state.app.systemConfig
    }),
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
    },
    //非全选
    // indeterminate() {
    //   let len = this.orderList.filter((item) => !item.check).length
    //   return len > 0 && len < this.orderList.length
    // },
    formatStatus() {
      return (status) => {
        const obj = {
          CANCELLED: '#909399',
          COMPLETED: '#67C23A'
        }
        return {
          background: colorMap[status],
          color: obj[status] ?? '#fff'
        }
      }
    },
    getImg() {
      return this.currentTrackLink
    },
    hasInstallPlug() {
      const plug = document.getElementById(
        'emalacca-chrome-extension-installed'
      )
      return !!plug
    }
  },
  created() {
    if (!this.$route.query.as) {
      this.getOrderList()
    }
  },
  async mounted() {
    this.timeInter = setInterval(() => {
      this.getOrderList()
    }, 180000)
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
    //打印拣货单
    printPickingOk() {
      this.printPickingVisible = false
      this.$store.commit('SET_BATCH_PRINT_LOAD', true)
      this.$refs.PrintItemList.printFaceList(this.selectedRows)
      this.$refs.PrintItemList.getTimeNow()
    },
    //是否已代打包-关联包裹显示隐藏
    behalfFlag(item) {
      if (item && item.length) {
        return false
      } else {
        return true
      }
    },
    //代打包下单按钮显示隐藏
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
    //选中包裹
    packCheck(packs, keys) {
      packs.forEach((item, index) => {
        if (keys != index) {
          item.check = false
        }
      })
    },
    //包裹是否全部发货预报
    getfmNo(pack) {
      pack = pack ? pack : []
      let fnNoLen = pack.filter((item) => item.fmNo)
      if (fnNoLen.length == pack.length) {
        return true
      }
      return false
    },
    //取消订单拆分
    orderUnSplitOrder(sn) {
      this.$confirm({
        title: '提示',
        content: '你是否确认取消拆单？',
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          await Order.orderUnSplitOrder({ order_sn: sn })
          this.$message.success('操作成功')
          this.getOrderList()
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    },
    //倒计时
    countDown() {
      this.$data.orderList.forEach((item) => {
        if (item.orderCreateTime) {
          let addTime = 172800000
          let today =
            moment(item.orderCreateTime).format('YYYY-MM-DD') + ' 23:59:59'
          today =
            moment(today).format('x') - moment(item.orderCreateTime).format('x')
          if (item.country == 'VN') {
            addTime = today
          } else if (item.country == 'ID') {
            addTime = 86400000
          }
          let d = 0
          let nowTime = parseInt(moment(new Date()).format('x'))
          let lastTime =
            parseInt(moment(item.orderCreateTime).format('x')) + addTime
          if (lastTime - nowTime > 0) {
            d = moment.duration((lastTime - nowTime) / 1000, 'seconds')
            item.remainingTime = `${Math.floor(
              d.asDays()
            )}天${d.hours()}时${d.minutes()}分${d.seconds()}秒`
          } else {
            item.remainingTime = `0天0时0分0秒`
          }
        }
      })
    },
    //取消订单
    cancelOrder(row) {
      this.$data.selectedOrdersn = row.ordersn
      this.$data.cancelOrderFlag = true
    },
    //保存海外仓发货刷新列表
    submitDeliver() {
      this.getOrderList()
    },
    //海外仓发货
    overseasWarehouse(item, batch) {
      if (batch) {
        this.ordersnsArr = item
      } else {
        this.ordersnsArr = [item.ordersn]
      }
      this.$refs.OverseasWarehouseModel.showModal = true
    },
    // orderLabels3(orderLabels) {
    //   if (orderLabels && orderLabels.length) {
    //     // console.log(orderLabels.splice(0,3))
    //     this.$data.orderLabelsMin3 = orderLabels.splice(0,3)
    //     // return ["d6336c", "c0392b"] // orderLabels.splice(0,3)
    //   }
    // },
    //编辑备注
    editRemark(item) {
      this.$set(item, 'remarkVisible', true)
      this.$data.current = item
      this.$data.orderRemark = item.orderRemark
      this.$nextTick(() => {
        this.$refs.remark[0].focus()
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
          // this.successAlert(this.$t('common.handlerSuccess'))
        }
      })
    },

    checkStatus,
    closeStateModal() {
      this.showStateModal = false
    },
    //订单状态
    orderStatus(val) {
      if (!val) {
        return
      }
      let status = this.$data.ptstatus.find((item) => item.id == val)
      return status ? status.label : '--'
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
    //代打包下单弹窗
    createPackagePop(id, item) {
      this.$data.packageOrdersn = id
      this.$data.packageOrderData = item
      this.$data.createPackageVisible = true
    },
    //显示下载插件弹窗
    plugPopShow() {
      this.oneClickOrderCancel()
      this.$data.plugPopVisible = true
    },
    //下载插件弹窗点手动关联
    manualRelation() {
      this.$data.isOneClick = false
      this.$data.rowData.oneClick = false
      this.$data.plugPopVisible = false
      this.$data.oneClickOrderVisible = true
    },
    //一键下单
    oneClickOrder(row, variationId, oneClick) {
      if (!this.$data.installPlug) {
        const domId = 'emalacca-chrome-extension-purchas-auth'
        const dom = document.getElementById(domId)
        // console.log(dom)
        if (dom) {
          this.$data.installPlug = true
        } else {
          this.$data.installPlug = false
        }
        if (/^\/oms/.test(this.$route.path)) {
          if (!(this.$route.query.hasPlugin === '1')) {
            this.$data.installPlug = false
          }
        }
      }
      row.index = variationId
      row.oneClick = oneClick
      this.$data.rowData = row
      this.$data.oneClickOrderVisible = true
      this.$data.isOneClick = oneClick
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
    //一键下单确定
    oneClickOrderOk() {
      this.$refs.oneClickPop.purchaseFn()
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

    // 2 打印面单 3 申请运单号 4 同步所有订单 5 同步选中订单 6导出选中订单 7发货预报 8批量代打包 9打印拣货单
    observer(type) {
      let selectedList = this.orderList.filter((item) => item.check)
      let selectedIds = selectedList.map((el) => el.ordersn)
      let seaStatusDTO = []
      let storeTypeList = []
      let _this = this
      if (selectedIds.length == 0) {
        this.$store.commit('SET_BATCH_PRINT_LOAD', false)
        this.errorAlert(this.$t('order.selectOrder'))
        return
      }
      if (type == 2) {
        let localOrdersnList = selectedList.filter(
          (item) => item.storeType == 1
        )
        let crossOrdersnList = selectedList.filter(
          (item) => item.storeType == 2
        )
        let unTrackingNo = []
        // selectedList.forEach((order) => {
        //   unTrackingNo = order.orderShopeeOrderPackageDTOS.filter(
        //     (item) => !item.trackingNo
        //   )
        // })
        // console.log(
        //   crossOrdersnList.length,
        //   localOrdersnList.length == selectedList.length
        // )
        if (localOrdersnList.length == selectedList.length) {
          this.$store.commit('SET_BATCH_PRINT_LOAD', false)
          this.$message.warning('暂不支持本土店铺类型批量打印')
          return
        } else if (unTrackingNo.length) {
          this.$store.commit('SET_BATCH_PRINT_LOAD', false)
          this.$message.warning('申请运单号之后才可以打印面单')
          return
        } else if (localOrdersnList.length) {
          this.$warning({
            closable: true,
            width: 650,
            title: '提示',
            content: (
              <div>
                <p>
                  由于您在<b>【打印面单设置】</b>
                  中选择了打印shopee面单的同时打印订单清单，
                  <b>本土店暂不支持订单批量打印功能，需要您单独打印。</b>
                </p>
                <p>
                  您可以<b>继续打印</b>，我们将跳过本土店类型订单:
                </p>
                <p>{localOrdersnList.map((el) => el.ordersn).join('，')}；</p>
                <p>只打印其中你选中的跨境店铺类型订单。</p>
              </div>
            ),
            okText: '继续打印',
            onOk() {
              _this.printOrder(null, crossOrdersnList)
            }
          })
          return
        } else {
          _this.printOrder(null, crossOrdersnList)
        }
      }
      switch (type) {
        // case 2:
        //   this.printOrder(null, selectedIds)
        //   break
        case 3:
          this.appealOrder(null, selectedList)
          break
        case 4:
          this.syncOrder(null, selectedIds)
          break
        case 5:
          //批量海外仓发货
          selectedList.forEach((ele) => {
            if (ele.seaStatusDTO.flag && ele.seaStatusDTO.flag) {
              seaStatusDTO.push(ele.ordersn)
            }
            if (ele.storeType == 2) {
              storeTypeList.push(ele.ordersn)
            }
          })
          if (seaStatusDTO.length) {
            this.$warning({
              width: 650,
              title: '提示',
              content: `以下订单已海外仓发货${seaStatusDTO}，请取消勾选`
            })
            break
          } else if (storeTypeList.length) {
            this.$warning({
              width: 650,
              title: '提示',
              content: `以下跨境订单不支持海外仓发货${storeTypeList}，请取消勾选`
            })
            break
          }
          this.overseasWarehouse(selectedIds, true)
          break
        case 6:
          this.exportOrder(selectedIds)
          break
        case 7:
          this.selectedRows = selectedList
          this.batchLogisticsForecast()
          break
        case 8:
          this.selectedRows = selectedList
          this.batchPackage()
          break
        case 9:
          this.selectedRows = selectedList
          this.printPickingVisible = true
          break
      }
    },
    changePage(page, pageSize) {
      this.pagination.current = page
      this.pagination.pageSize = pageSize
      this.getOrderList()
    },
    showSizeChange(current, size) {
      this.pagination.pageSize = size
      this.getOrderList()
    },
    resetPagintion() {
      this.pagination = {
        ...this.initPatination,
        ...initPatination
      }
    },
    //导出选中订单
    async exportOrder(ids) {
      Order.orderExportExcel({ orders: ids }).then((res) => {
        downloadFile(res, '订单列表')
      })
    },
    // 申请运单号
    async appealOrder(item, rows, packageNumber) {
      item ? this.$set(item, '_shenqing', true) : ''
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
        await Order.batchApplyWaybillNumber(params)
          .then((res) => {
            if (res.code == 0) {
              this.isCheckAll = false
              this.successAlert(this.$t('order.waybillNumberSuccess'))
              this.getOrderList()
            }
          })
          .catch(() => {
            item ? this.$set(item, '_shenqing', false) : ''
          })
      } else {
        await Order.batchApplyWaybillNumber([
          {
            orderSn: item.ordersn,
            packageNumber: packageNumber || item.packageNumber
          }
        ])
          .then((res) => {
            if (res.code == 0) {
              this.isCheckAll = false
              this.successAlert(this.$t('order.waybillNumberSuccess'))
              this.getOrderList()
            }
          })
          .catch(() => {
            item ? this.$set(item, '_shenqing', false) : ''
          })
      }
      item ? this.$set(item, '_shenqing', false) : ''
    },
    //获取出货类型
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

    // 打印面单items整行数据
    async printOrder(item, rows, packages) {
      if (rows) {
        // let { data } = await Order.getOrderPrintCfg()
        // if (!data.id) {
        //   //未设置
        //   this.sheetSettingTip()
        //   return
        // }
        // //批量打印面单
        // this.$data.printSheet = data.printSheet
        // console.log(item, rows, packages)
        // this.$refs.PrintFaceList.printFaceList(rows)
        console.log('批量打印面单')
        for (let i = 1; i < rows.length; i++) {
          if (rows[i].shopId != rows[0].shopId) {
            return this.$message.warning('批量打印面单必须是同一个店铺的订单！')
          }
        }
        let sns = []
        rows.forEach((items) => {
          items.orderShopeeOrderPackageDTOS.forEach((pack) => {
            if (pack?.trackingNo) {
              sns.push({
                order_sn: pack.ordersn,
                tracking_number: pack.trackingNo,
                package_number: items.isSplitUp ? pack.packageNumber : null
              })
            }
          })
        })
        if (!sns.length) {
          this.$store.commit('SET_BATCH_PRINT_LOAD', false)
          return this.$message.warning('申请运单号之后才可以打印面单')
        } else {
          this.printPdf({ order_list: sns, shop_id: rows[0].shopId })
        }
      } else if (
        item &&
        (item.shippingCarrier === '全家' ||
          item.shippingCarrier === '7-11' ||
          item.shippingCarrier === '萊爾富' ||
          item.shippingCarrier === 'OK Mart')
      ) {
        //单个面单打印
        if (item.crawlerFileUrl) {
          this.openPage(item.crawlerFileUrl, '_blank')
        } else {
          const url = `http://47.106.161.44:18080/get_invoice?ordersn=${[
            item.ordersn
          ]}&platform=${item.shippingCarrier}`
          this.openPage(url, '_blank')
        }
      } else {
        // let { data } = await Order.getOrderPrintCfg()
        // if (!data.id) {
        //   //未设置
        //   this.sheetSettingTip()
        //   return
        // }
        // this.$data.printSheet = data.printSheet
        // if (item.storeType == 1) {
        //   //本土店直接调虾皮面单接口
        //   Order.printOrder({ ordersn: [item.ordersn] }).then((res) => {
        //     if (res.code == 0) {
        //       this.isCheckAll = false
        //       this.successAlert(this.$t('order.printFaceSheetSucc'))
        //       if (res.data != '') {
        //         this.openPage(res.data[0], '_blank')
        //       }
        //     }
        //   })
        // } else {
        console.log('单个打印', item, packages)
        packages.isSplitUp = item.isSplitUp
        this.printPdf(
          {
            order_list: [
              {
                order_sn: packages.ordersn,
                tracking_number: packages.trackingNo
              }
            ],
            shop_id: item.shopId
          },
          packages
        )
        //打印面单和物品清单
        // this.$refs.PrintFaceList.printFaceList([item], packages)
        // }
      }
    },
    //设置面单提示
    sheetSettingTip() {
      this.$store.commit('SET_BATCH_PRINT_LOAD', false)
      this.$info({
        title: '提示',
        okText: '进入打印面单设置',
        closable: true,
        content:
          '您需要先设置一下打印面单的选项设置，后续如果你想变更设置也可以更改设置',
        onOk() {
          bus.$emit('print-sheet-setting')
        }
      })
    },
    // 获取订单列表
    getOrderList() {
      const { current, pageSize: size } = this.pagination
      const params = Object.assign(this.$props.searchParams, { current, size })
      if (!params.status) {
        if (this.$route.query.status) {
          params.status = this.$route.query.status
        }
      }
      if (this.$route.path == '/order/page-ready') {
        //待发货全部
        if (!params.status) {
          params.statusList = 'READY_TO_SHIP,PROCESSED,RETRY_SHIP,TO_RETURN'
        }
      }
      if (this.$route.path == '/oms/order/page-unpackaged') {
        //未代打包页面
        params.statusList = Array.isArray(params.statusList)
          ? params.statusList.join()
          : params.statusList
      }
      if (
        !params.status ||
        ['RETRY_SHIP', 'READY_TO_SHIP'].includes(params.status)
      ) {
        params.noStayPackaged = localStorage
          ? localStorage.noStayPackaged
          : null
        params.delayed = localStorage ? localStorage.delayed : null
        params.nonDelayed = localStorage ? localStorage.nonDelayed : null
      }

      this.$data.spinning = true
      Order.getOrderList(params).then(({ data }) => {
        bus.$emit('reload-page')
        data &&
          data.records.map((el) => {
            el.menuVisible = false
            el.check = false
            this.$set(el, 'syncFlag', true)
            el.orderShopeeOrderPackageDTOS?.map((pack) => {
              this.$set(pack, 'printLoading', false)
              this.$set(pack, 'check', false)
            })
            this.$set(el, 'remainingTime', '')
            this.$set(
              el,
              'expand',
              this.$route.path == '/order/page-ready' ? true : false
            )

            if (el.orderLabels) {
              this.$set(el, 'orderLabels3', el.orderLabels.slice(0, 3))
            }
            if (!el.orderShopeeOrderPackageDTOS) {
              el.orderShopeeOrderPackageDTOS = [el]
            }
          }) //用于备注的菜单组件显示
        if (data && data.records) {
          this.handlePackage(data.records)
        }
        this.orderList = data?.records ?? []
        this.$data.spinning = false
        // 通过插件侧同步订单状态params.status == 'READY_TO_SHIP2' &&
        if (
          (params.status == 'READY_TO_SHIP' ||
            params.status == 'RETRY_SHIP' ||
            params.status == 'PROCESSED') &&
          this.orderList.length > 0
        ) {
          this.handleBatchSyncOrderStatus()
        }
        // clearInterval(this.timeInterAfterSale) //售后倒计时
        // this.countDown()
        // this.timeInterAfterSale = setInterval(() => this.countDown(), 1000)
        this.pagination.total = data?.total ?? 0
      })
    },

    //核对地址
    handleCheckAddress(item) {
      let { name, fullAddress } = item.orderAddress
      this.checkAddressText = `Dear buyer: ${name},please check your shipping address: ${fullAddress}~`
    },
    //待打包弹窗 入口
    handlePackge(item) {
      this.packageInfo = ''
      if (item.orderShopeeOrderPackageDTOS.length > 1) {
        if (
          !item.orderShopeeOrderPackageDTOS.filter((item) => item.check).length
        ) {
          return this.$message.warning('请选择需要代打包的订单包裹！')
        } else {
          this.packageInfo = item.orderShopeeOrderPackageDTOS.filter(
            (item) => item.check
          )[0]
        }
      } else if (item.orderShopeeOrderPackageDTOS) {
        this.packageInfo = item.orderShopeeOrderPackageDTOS[0]
      }
      this.records = item
      if (this.$route.path === '/oms/order/page-unpackaged') {
        //未打包页面oms嵌套处理
        window.parent.postMessage(
          {
            operation: 'open',
            orderRecord: this.records,
            packageNumber: this.packageInfo.packageNumber
          },
          '*'
        )
      } else {
        this.$refs.AddPackageOrder['showModal'] = true
      }
    },
    //待打包入口  旧版  废弃
    handlePackgeOld(item) {
      let id = item.ordersn
      if (item.fwPackageId) {
        this.openPage(`/order/page-packaged?id=${id}`)
      } else {
        this.createPackagePop(id, item)
        // this.$router.push(`/package/create?id=${id}`)
      }
    },
    //标签改变事件
    onLabelChange({ colorCode, tagsContent }) {
      bus.$emit('order-color-tags-change', { colorCode, tagsContent })
      this.$data.colorTags = this.$data.colorTags.map((ele) => {
        if (ele.colorCode === colorCode)
          ele.tagsContent = tagsContent || this.$t('common.noDescription')

        return ele
      })
    },
    //获取选中的订单
    getSelected() {
      return this.$data.orderList.filter(({ check }) => check)
    },
    //查看物流详情
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
    //去登入
    goLogin(order) {
      let { purchasePlatform } = order.purchaseDetail
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
      let { purchasePlatform, purchaseAccount } = order.purchaseDetail
      console.log(order)
      // purchasePlatform = '1688'
      const domId = 'emalacca-chrome-extension-purchas-auth'
      const dom = document.getElementById(domId)

      if (!dom) return this.$message.error(this.$t('order.pluginsErrpr'))
      const ispddlogin = dom.getAttribute('ispddlogin')
      const is1688login = dom.getAttribute('is1688login')

      console.log(ispddlogin)
      console.log(is1688login)

      const loginConfirm = (url, text) => {
        this.$warning({
          title: this.$t('common.message'),
          content: text,
          closable: true,
          okText: this.$t('order.toLogin'),
          onOk: () => {
            this.openPage(url, '_blank')
          }
        })
      }

      const purchasePlatformObj = {
        拼多多: ispddlogin,
        1688: is1688login
      }

      const purchasePlatformUrl = {
        拼多多: 'https://mobile.yangkeduo.com/login.html',
        1688: 'https://login.1688.com/member/signin.htm'
      }

      if (purchasePlatformObj[purchasePlatform] === 'false') {
        loginConfirm(
          purchasePlatformUrl[purchasePlatform],
          this.$t('order.loginMessage', {
            purchasePlatform,
            purchaseAccount
          })
        )
        return
      }
      this.$store.commit('SET_ORDER_F5', true)
      this.handleBatchSyncOrderStatus(order)
    },

    // 通过插件侧同步订单信息
    handleBatchSyncOrderStatus(purchas) {
      // 取出当前订单列表中的有订单号的
      let purchasList = []
      if (purchas) {
        // [item].map((purchas) => {
        // 上次同步时间距当前时间超过3分钟
        console.log(purchas)
        let { syncTime } = purchas.purchaseDetail || {}
        let condition = Date.parse(new Date()) - Date.parse(syncTime) > 180000
        if (condition || syncTime == null) {
          if (
            purchas.purchaseDetail &&
            purchas.purchaseDetail.purchaseOrderno
          ) {
            purchasList = purchasList.concat({
              ...purchas.purchaseDetail,
              itemName: purchas.purchaseDetail.orderno
            })
          }
        }
        // })
      } else {
        this.orderList?.map((el) =>
          el.items?.map((purchas) => {
            // 上次同步时间距当前时间超过3分钟
            // console.log(purchas.purchaseDetail)
            let { syncTime } = purchas.purchaseDetail || {}
            let condition =
              Date.parse(new Date()) - Date.parse(syncTime) > 180000
            if (condition || syncTime == null) {
              if (
                purchas.purchaseDetail &&
                purchas.purchaseDetail.purchaseOrderno
              ) {
                purchasList = purchasList.concat({
                  ...purchas.purchaseDetail,
                  itemName: purchas.purchaseDetail.orderno
                })
              }
            }
          })
        )
      }
      //console.log(this.$store.getters.orderF5, purchasList.length)
      if (purchasList.length > 0) {
        if (this.$store.getters.orderF5) {
          this.$notification.open({
            message: this.$t('common.message'),
            duration: 6,
            type: 'info',
            description: this.$t('order.beginSyncOrderInfo')
          })
        }
        this.$store.commit('SET_ORDER_F5', false)
        console.log(purchasList)
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
              description: `采购单【${itemName}】${this.$t(
                'order.syncSuccess'
              )}`
            })
          }

          if (isFinish) {
            this.getOrderList()
          }
        })
      }
    },
    formatGoods(list = [], isExpand) {
      if (isExpand) {
        return list
      }
      return list?.slice(0, 2)
    },
    handleExpand(item) {
      item.expand = !item.expand
      // this.$set(item, 'expand', !item.expand)
    },
    checkChange(checked, item) {
      this.$set(item, 'check', checked)
      this.isCheckAll = this.orderList.every((item) => item.check)
      this.indeterminate =
        this.orderList.some((item) => item.check) && !this.isCheckAll
    },
    checkAllChange(checked) {
      this.isCheckAll = checked
      this.orderList = this.orderList.map((item) => {
        item.check = checked
        return item
      })
      this.indeterminate = false
    },
    checkedChange(item) {
      console.log(item)
      this.checkedChangeFlag = item.key
      bus.$emit('storeType-change', item.key)
      bus.$emit('handle-search')
    },
    activeChange(item) {
      this.$set(item, 'active', !item.active)
    }
  },
  beforeDestroy() {
    clearInterval(this.timeInter)
    clearInterval(this.timeInterAfterSale)
    bus.$off('batch-action', this.observer)
    window.removeEventListener('message', this.erpMessageHandler)
  }
}
</script>

<style lang="scss" scoped>
@import './scss/orderlist.scss';
</style>
