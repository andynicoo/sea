<template>
  <div
    style="background-color: #fff"
    class="commodity-list"
    :class="{ 'lazada-commodity-list': !listType }"
  >
    <a-table
      :loading="loading"
      :columns="columns"
      :data-source="dataSourceHandle"
      :rowSelection="rowSelection"
      :pagination="pagination"
      @change="changePage"
      :rowKey="rowKey"
    >
      <template slot="product_info" slot-scope="text, record, index">
        <div class="product-info">
          <a-popover :placement="index < 5 ? 'rightTop' : 'rightBottom'">
            <template slot="content">
              <img
                v-lazy="mainImgUrl(record)"
                style="width: 280px; height: 280px; border-radius: 2px"
              />
            </template>
            <img
              v-lazy="mainImgUrl(record)"
              style="width: 80px; height: 80px; border-radius: 2px"
            />
          </a-popover>

          <div class="info-text">
            <a
              target="__blank"
              :href="
                $props.type === 1 ? recordItemUrl(record) : record.sourceUrl
              "
              class="name"
            >
              <div
                class="shop-type-tag"
                v-if="$props.type === 1 && record.discountId"
              >
                促销
              </div>
              {{ record.name }}</a
            >
            <span
              style="color: rgba(0, 0, 0, 0.54)"
              v-copy="record.name"
              class="iconfont iconjuxing1 hand copy-icon"
              v-if="$props.type === 1"
            ></span>
            <!-- <p>产品ID:{{ record.itemId }}</p> -->
            <p class="">
              <span class="me-mr-5 me-fs12 me-status-skip"
                >采集来源：<span>
                  <a
                    :href="record.sourceUrl"
                    target="blank"
                    class="me-fs12 me-status-skip"
                    >{{ record.sourceName | stringSlice(12) }}
                  </a>
                </span></span
              >
              <!-- <a
                class="action-item hand"
                :href="comb1688ImageLink(record)"
                target="blank"
              >
                <span class="me-tab me-fr me-fs12">
                  <i class="iconfont iconsousuo"></i> 1688搜图
                </span>
              </a> -->
            </p>

            <p v-if="$props.type === 1 && !record.merchantId">
              <span class="me-mr-5 me-fs12 me-status-skip">
                <span>添加采集来源：</span>
                <a-icon
                  type="plus"
                  class="hand me-status-primary"
                  v-if="
                    (record.remarks == null || record.remarks == '') &&
                      record.editRmarking != true
                  "
                  @click="editRemark(record)"
                />
                <a-input
                  size="small"
                  :autofocus="true"
                  v-model="record.remarks"
                  v-if="record.editRmarking"
                  ref="remark"
                  placeholder="采集来源"
                  @blur="blurRmark(record)"
                  style="width:220px"
                />
                <!-- <span  class="hand" @click="goEditRmark(record)">{{record.rmark | stringSlice(17)}}</span> -->
                <a-tooltip bottom v-else>
                  <template slot="title">
                    <a
                      :href="record.remarks"
                      target="_blank"
                      v-if="validateUrl(record.remarks)"
                      >{{ record.remarks }}
                    </a>
                    <span v-else>{{ record.remarks }} </span>
                  </template>
                  <span class="hand" @click="goEditRmark(record)">{{
                    record.remarks | stringSlice(20)
                  }}</span>
                </a-tooltip>
                <a-icon
                  type="delete"
                  class="hand me-status-skip me-fr me-pt-1"
                  v-if="
                    record.remarks != null &&
                      record.remarks != '' &&
                      record.editRmarking != true
                  "
                  @click="deleteRemark(record)"
                />
              </span>
            </p>

            <!-- <p class="me-pt-1 iconarr" v-if="$props.type === 1">
              <a-space>
                <a-tooltip bottom v-for="(val, key) in attachInfo" :key="key">
                  <template slot="title">
                    <span
                      >{{ attachInfo[key].name }} {{ Math.ceil(record[key]) }}
                    </span>
                  </template>
                  <span
                    class="iconfont hand iconsize"
                    :class="attachInfo[key].icon"
                    >{{ handleNum(Math.ceil(record[key])) }}</span
                  >
                </a-tooltip>
              </a-space>
            </p> -->
          </div>
        </div>
      </template>

      <template slot="product_category" slot-scope="text, record">
        <a-popover
          v-if="record.categoryIdNames && record.categoryIdNames.length"
        >
          <template slot="content">
            <p>
              {{ reverseCategory(record.categoryIdNames) }}
            </p>
          </template>
          <p class="me-em1 me-status-skip">
            {{ returnCategory(record.categoryIdNames) }}
            <!-- {{ record.categoryNames.join('>') }} -->
          </p>
        </a-popover>
        <template v-else>
          <p class="me-em1 me-status-skip">-</p>
        </template>
      </template>

      <template slot="product_SKU" slot-scope="text, record">
        <div :class="{ 'me-mainSku': !listType }">{{ record.itemSku }}</div>
        <div class="me-sku-more" v-if="!listType">
          <p
            v-for="ele in record.expandSku
              ? record.recordVOS
              : record.recordVOS.slice(0, 3)"
            :key="ele.id"
            class="me-em1"
          >
            <a-popover>
              <template slot="content">
                {{ ele.shopSku }}
              </template>
              {{ ele.shopSku }}
            </a-popover>
          </p>
        </div>
      </template>
      <template slot="product_price" slot-scope="text, record">
        <div :class="{ 'me-mainSku': !listType }">
          <div>{{ record.currency }}:</div>
          {{ getPrice(record) }}
        </div>
        <div class="me-sku-more" v-if="!listType">
          <p
            v-for="ele in record.expandSku
              ? record.recordVOS
              : record.recordVOS.slice(0, 3)"
            :key="ele.id"
          >
            {{ record.currency }}:{{ ele.price }}
          </p>
        </div>
      </template>

      <template slot="stock" slot-scope="text, record">
        <div :class="{ 'me-mainSku': !listType }">
          {{ record.recordVOS ? computeStock(record.recordVOS) : '--' }}
        </div>
        <div class="me-sku-more" v-if="!listType">
          <p
            v-for="ele in record.expandSku
              ? record.recordVOS
              : record.recordVOS.slice(0, 3)"
            :key="ele.id"
          >
            {{ ele.stock }}
          </p>
        </div>
      </template>
      <template slot="recordVOS" slot-scope="text, record">
        <div :class="{ 'me-mainSku': !listType }">
          {{ record.recordVOS ? record.recordVOS.length : '--' }}
        </div>
        <div class="me-sku-more" v-if="!listType">
          <p
            v-for="ele in record.expandSku
              ? record.recordVOS
              : record.recordVOS.slice(0, 3)"
            :key="ele.id"
            class="me-em1"
          >
            <a-popover>
              <template slot="content">
                {{ ele.variationsSku }}
              </template>
              {{ ele.variationsSku }}
            </a-popover>
          </p>
          <div
            v-if="record.recordVOS.length > 3"
            @click="expandSkuChange(record)"
          >
            <span v-if="!record.expandSku" class="me-status-link me-cp">
              展开 {{ record.recordVOS.length - 3 }} 个规格
              <a-icon type="down" />
            </span>
            <span v-if="record.expandSku" class="me-status-link me-cp">
              收起 {{ record.recordVOS.length - 3 }} 个规格
              <a-icon type="up" />
            </span>
          </div>
        </div>
      </template>

      <template slot="store" slot-scope="text, record">
        <!-- 普通店铺显示店铺名称，cnsc显示商户名称 -->
        <div>
          <span v-if="record.merchantId" class="cnsc-icon">CNSC</span>
          {{
            record.storeName == null ? record.merchantName : record.storeName
          }}
        </div>
      </template>

      <template slot="reasons" slot-scope="text, record">
        <a-popover>
          <template slot="content">
            <p>
              {{ record.reasons }}
            </p>
          </template>
          <span class="me-status me-status-error me-em2">{{
            record.reasons
          }}</span>
        </a-popover>
      </template>

      <!-- cnsc已发布店铺列表 -->
      <template slot="publishShops" slot-scope="text, record">
        <div v-if="record.publishShops">
          <a-popover
            :visible="record.showShopVisible"
            placement="topLeft"
            @visibleChange="($event) => handleHoverChange($event, record)"
          >
            <template slot="content">
              <div v-for="item in record.publishShops" :key="item.region">
                <p
                  v-if="item.success == 'success'"
                  class="popoverSkip"
                  @click="onCnscEdit(record, item)"
                >
                  <span
                    class="publish-status-point"
                    :style="{
                      background:
                        item.success == 'success' ? '#67C23A' : '#a8a8b3'
                    }"
                  ></span>
                  {{ item.storeName }}
                </p>
              </div>
            </template>
            <ul>
              <li
                v-for="item in record.publishShops"
                :key="item.region"
                class="publish-store-item"
              >
                <span
                  class="publish-status-point"
                  :style="{
                    background:
                      item.success == 'success' ? '#67C23A' : '#a8a8b3'
                  }"
                ></span>
                {{ item.region }}
              </li>
            </ul>
          </a-popover>
        </div>

        <div v-else>
          --
        </div>
      </template>

      <template slot="actions" slot-scope="text, record">
        <slot name="actions" :source="record"></slot>
      </template>
    </a-table>
  </div>
</template>

<script>
import { build1688SearchImgLink } from '@/util'
import { max, min, compact, cloneDeep } from 'lodash'
import Goods from '@/api/goods'
import Lazada from '@/api/lazada'
import { URL } from '@/util/regex'

export default {
  props: {
    loading: Boolean,
    dataSource: {
      type: Array,
      default: () => []
    },
    rowSelection: Object,
    pagination: Object,
    type: {
      type: Number,
      default: 0
    },
    listType: {
      type: Boolean,
      default: true
    },
    rowKey: {
      type: String,
      default: 'productRecordId'
    }
  },

  data() {
    const AttachInfoOpts = {
      cmtCount: {
        icon: 'iconpinglun1',
        name: this.$t('commodityList.comment')
      },
      likes: {
        icon: 'icondianzan',
        name: '点赞'
      },
      views: {
        icon: 'iconliulan',
        name: this.$t('commodityList.view')
      },
      sales: {
        icon: 'iconshangpin22',
        name: this.$t('commodityList.sold')
      },
      ratingStar: {
        icon: 'iconshoucang',
        name: this.$t('commodityList.collect')
      }
    }

    return {
      attachInfo: AttachInfoOpts, //附加信息
      columns: compact([
        {
          dataIndex: 'product_info',
          key: 'product_info',
          scopedSlots: { customRender: 'product_info' },
          title: '商品信息',
          width: 400
        },
        {
          dataIndex: 'product_category',
          key: 'product_category',
          scopedSlots: { customRender: 'product_category' },
          title: '产品类目',
          width: 180
        },
        {
          dataIndex: 'SKU',
          key: 'SKU',
          scopedSlots: { customRender: 'product_SKU' },
          title: '商品编码',
          width: 180
        },
        {
          dataIndex: 'recordVOS',
          key: 'recordVOS',
          scopedSlots: { customRender: 'recordVOS' },
          title: '规格',
          width: 120
        },
        {
          dataIndex: 'product_price',
          key: 'product_price',
          scopedSlots: { customRender: 'product_price' },
          title: '售价',
          width: 150,
          sorter: (a, b) => {
            return a.price - b.price
          }
        },
        // : {
        //     dataIndex: 'product_price',
        //     key: 'product_price',
        //     scopedSlots: { customRender: 'product_price' },
        //     title: '售价',
        //     width: 150
        //   },

        // {
        //   dataIndex: 'stock',
        //   key: 'stock',
        //   title: '库存',
        //   width: 150,
        //   scopedSlots: { customRender: 'stock' }
        // },
        {
          dataIndex: 'store',
          key: 'store',
          scopedSlots: { customRender: 'store' },
          title: '认领店铺',
          width: 250
        },
        this.$props.type == 4
          ? {
              dataIndex: 'reasons',
              key: 'reasons',
              scopedSlots: { customRender: 'reasons' },
              title: '原因',
              width: 170
            }
          : null,
        this.$props.type == 40
          ? {
              dataIndex: 'definiteTime',
              key: 'definiteTime',
              title: '定时发布时间',
              width: 170
            }
          : null,
        this.$props.type == 8
          ? {
              dataIndex: 'updateTime',
              key: 'updateTime',
              title: '最后修改时间',
              width: 170
            }
          : null,
        this.$props.type == 10
          ? {
              dataIndex: 'publishShops',
              key: 'publishShops',
              scopedSlots: { customRender: 'publishShops' },
              title: '已发布站点',
              width: 170
            }
          : null,
        {
          dataIndex: 'actions',
          key: 'actions',
          fixed: 'right',
          scopedSlots: { customRender: 'actions' },
          title: '操作',
          width: 200
        }
      ]),
      remarkVisible: false
    }
  },
  methods: {
    //在线商品跳转链接处理
    recordItemUrl(row) {
      let items = row.variationsList.filter((item) => item.url)
      return items.length ? items[0].url : null
    },
    //计算库存
    computeStock(row) {
      let sum = row.reduce((prev, cur) => {
        return cur.stock + prev
      }, 0)
      return sum
    },
    mainImgUrl(row) {
      if (row.images) {
        return JSON.parse(row.images)[0]
      } else if (row.image) {
        return JSON.parse(row.image)[0]
      }
    },
    //展开收起sku
    expandSkuChange(row) {
      row.expandSku = !row.expandSku
      window.dispatchEvent(new Event('resize')) //table fixed对齐
    },

    changePage(pagination, filters, sorter) {
      const { order } = sorter
      this.$emit('changeType', order)
      this.$emit('change', pagination)
    },
    returnCategory(category) {
      var arr = cloneDeep(category)
      arr = arr.reverse()
      if (arr) {
        if (arr.length == 0) {
          return '-'
        } else if (arr.length > 1) {
          return arr[0] + '>' + arr[1] + '...'
        } else {
          return arr.join('/') + '...'
        }
      } else {
        return '-'
      }
    },
    reverseCategory(category) {
      const arr = cloneDeep(category)
      return arr.reverse().join('>')
    },
    // 数字处理
    handleNum(num) {
      if (num <= 999) return num
      else if (num > 999 && num < 10000) {
        return num.toString().substring(0, 1) + 'K'
      } else {
        return '10K+'
      }
    },
    editRemark(record) {
      this.$set(record, 'editRmarking', true)
      console.log(record.id)
      this.$nextTick(() => {
        this.$refs.remark.focus()
      })
    },
    goEditRmark(record) {
      this.$set(record, 'editRmarking', true)
    },
    blurRmark(record) {
      var params = {
        productId: record.productId,
        remarks: record.remarks
      }
      Lazada.collectionSource(params).then(({ data }) => {
        console.log(data)
      })
      this.$set(record, 'editRmarking', false)
    },
    deleteRemark(record) {
      var params = {
        productId: record.productId,
        remarks: ''
      }
      Lazada.collectionSource(params).then(({ data }) => {
        console.log(data)
      })
      record.remarks = ''
      // this.$set(record, 'rmark', null)
    },
    validateUrl(value) {
      return URL.test(value)
    },
    // 全球商品--已发布站点显示发布成功的店铺
    handleHoverChange(e, item) {
      const isShow = item.isShowShops ? e : false
      this.$set(item, 'showShopVisible', isShow)
    },
    // 全球商品---已发布站点，提示气泡窗口，跳转
    onCnscEdit(items, item) {
      const path = `/goods/cnsc-edit?id=${items.id}&productId=${item.productId}&merchantId=${items.merchantId}`
      this.$router.push({ path })
    }
  },
  created() {
    this.dataSource.forEach((item) => {
      this.$set(item, 'expandSku', false)
    })
  },
  computed: {
    dataSourceHandle() {
      this.dataSource.forEach((item) => {
        this.$set(item, 'expandSku', false)
        if (item.variationsList) {
          this.$set(item, 'recordVOS', item.variationsList)
        }
        if (item.variationsList || item.recordVOS) {
          this.$set(item, 'price', this.setPrice(item))
        }
      })
      return this.dataSource
    },
    /**
     * 1688搜图链接组合
     */
    comb1688ImageLink() {
      return (item) => {
        if (item.mainImgUrl) {
          return build1688SearchImgLink(item.mainImgUrl)
        } else if (item.images) {
          let images = JSON.parse(item.images)
          return images.length > 0 ? build1688SearchImgLink(images[0]) : null
        } else {
          return null
        }
      }
    },
    /**
     * 获取售价
     */
    getPrice() {
      return (item) => {
        if (item.recordVOS.length > 1) {
          const recordVOSPrices = item.recordVOS.map(({ price }) => price)
          const _min = min(recordVOSPrices)
          const _max = max(recordVOSPrices)
          if (_max === _min) return `${_max}`
          return `${_min} ~ ${_max}`
        }
        return `${item.recordVOS[0].price}`
      }
    },
    //设置排序售价
    setPrice() {
      return (item) => {
        if (item.recordVOS.length > 1) {
          const recordVOSPrices = item.recordVOS.map(({ price }) => price)
          const _min = min(recordVOSPrices)
          const _max = max(recordVOSPrices)
          if (_max === _min) return `${_max}`
          return `${_min}`
        }
        return `${item.recordVOS[0].price}`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/mixins.scss';
.me-em1 {
  @include ellipsisMultiline(1);
}
.commodity-list {
  .product-info {
    display: grid;
    grid-template-columns: 80px 1fr;

    .info-text {
      padding: 0 10px;
      max-width: 320px;

      .name {
        overflow: hidden;
        color: #000000a6;
        text-overflow: ellipsis;
        display: -webkit-box; //作为弹性伸缩盒子模型显示。
        -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
        -webkit-line-clamp: 2; //显示的行
        &:hover {
          color: $linkColor;
        }
      }
      .shop-type-tag {
        background: #ff6b38;
        border-radius: 3px;
        padding: 0 4px;
        font-size: 12px;
        color: #fff;
        display: inline-block;
      }
      .me-tab {
        color: #bd8863;
        border: 1px solid #ffe4c7;
        height: 21px;
        background: #fdf6ec;
        border-radius: 1px;
        line-height: 19px;
        padding: 0px 3px;
        .iconfont {
          font-size: 11px;
        }
        &:hover {
          background: #bd8863;
          color: #fff;
        }
      }
    }
  }
}
.iconarr {
  color: #cbcdd2;
  .iconsize {
    font-size: 14px;
  }
}
.me-mainSku {
  min-height: 90px;
}
.me-sku-more {
  p {
    margin-bottom: 20px;
  }
}
.me-cp {
  cursor: pointer;
}
@import '@/theme/mixins.scss';
.me-em2 {
  @include ellipsisMultiline(2);
}
.me-em1 {
  @include ellipsisMultiline(1);
}
.rmarkedit {
  width: 170px;
  @include ellipsisMultiline(1);
}
</style>

<style lang="scss">
.commodity-list {
  .ant-table-selection-column {
    padding-left: 5px;
    padding-right: 5px;
    width: 20px;
  }
  .publish-store-item {
    position: relative;
    box-sizing: border-box;
    padding-left: 20px;
  }
}
.popoverSkip {
  position: relative;
  box-sizing: border-box;
  padding-left: 20px;
  color: #4c86ff;
  cursor: pointer;
}
.publish-status-point {
  position: absolute;
  left: 0;
  top: 4px;
  width: 12px;
  height: 12px;
  border-radius: 6px;
}
.cnsc-icon {
  width: 42px;
  height: 20px;
  padding: 2px 4px;
  background: #fdf6ec;
  font-size: 12px;
  border-radius: 1px;
  border: 1px solid #ffe4c7;
  box-sizing: border-box;
  color: #dc925e;
  line-height: 20px;
}
.lazada-commodity-list {
  .ant-table-tbody > tr > td {
    vertical-align: top;
  }
}
</style>
