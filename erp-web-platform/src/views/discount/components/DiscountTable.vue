<template>
  <div style="background-color: #fff" class="commodity-list">
    <a-table
      :loading="loading"
      :columns="columns"
      :data-source="dataSourceHandle"
      :rowSelection="rowSelection"
      :pagination="pagination"
      @change="changePage"
      :rowKey="rowKey"
    >
      <template slot="followPrizeName" slot-scope="text, record">
        {{ record.followPrizeName }}
      </template>
      <template slot="rewardType" slot-scope="text, record">
        <div v-if="record.rewardType === 1">
          店铺优惠券
          <div>现金券</div>
        </div>
        <div v-if="record.rewardType === 2">
          商品优惠券
          <div>百分比折扣券</div>
        </div>
        <div v-if="record.rewardType === 3">
          商品优惠券
          <div>虾皮币返还</div>
        </div>
        <div v-if="record.promotionType === 0">
          加购折扣
        </div>
        <div v-if="record.promotionType === 1">
          赠品满最低消费
        </div>
      </template>
      <template slot="usageQuantity" slot-scope="text, record">
        {{ record.currentUsage }} / {{ record.usageQuantity }}
      </template>
      <template slot="stock" slot-scope="text, record">
        <div
          v-if="
            record.variants &&
              record.variants.length &&
              tabstatus === 'addtionaddpro2'
          "
          :class="{ 'me-show': record._viewflag_ }"
          class="me-spec-all"
        >
          <div
            v-for="vars in record.variants"
            :key="vars.variationId"
            style="height:24px"
          >
            {{ vars.stock ? vars.stock : 0 }}
          </div>
        </div>
        <div v-else>{{ record.stock ? record.stock : 0 }}</div>
      </template>

      <template slot="startTime" slot-scope="text, record">
        {{ record.startTime }}
        <div>-</div>
        {{ record.endTime }}
      </template>
      <template slot="product_info" slot-scope="text, record, index">
        <div class="product-info">
          <a-popover :placement="index < 5 ? 'rightTop' : 'rightBottom'">
            <template slot="content">
              <img
                v-lazy="record.mainImage"
                style="width: 280px; height: 280px; border-radius: 2px"
              />
            </template>
            <img
              v-lazy="record.mainImage"
              style="width: 70px; height: 70px; border-radius: 2px"
            />
          </a-popover>

          <div class="info-text">
            <a class="name"> {{ record.name }}</a>
            <!-- <p>
              <span class="me-mr-5 me-status-primary">
                规格:{{ record.countryCode }}
              </span>
            </p> -->
          </div>
        </div>
      </template>

      <!-- <template slot="originalPrice" slot-scope="text, record">
        {{ record.currency }}
        {{ record.originalPrice ? record.originalPrice : '-' }}
      </template> -->
      <template slot="price" slot-scope="text, record">
        {{ record.currency }} {{ getPrice(record) }}
      </template>
      <!-- 列表的时候有status传入，显示阶段； 加购优惠编辑页要这个 -->
      <template slot="status" slot-scope="text, record, index">
        <span v-if="record.status === 'ongoing'">进行中的活动</span>
        <span v-if="record.status === 'upcoming'">接下来的活动</span>
        <span v-if="record.status === 'expired'">已结束</span>
        <div
          v-if="
            tabstatus === 'addtionaddpro1' || tabstatus === 'addtionaddpro2'
          "
        >
          <!-- 优惠套餐-添加套餐优惠产品，有变体variants的时候展示变体，否则展示本体，加购价格，加购折扣，购买限制，状态也是 -->
          <a-switch
            :checked-children="$t('common.open1')"
            :un-checked-children="$t('common.close1')"
            :checked="record.status === 1 ? true : false"
            @change="(e) => defaultTopChange(e, index)"
            v-if="tabstatus === 'addtionaddpro1'"
          />
          <div
            v-if="
              record.variants &&
                tabstatus === 'addtionaddpro2' &&
                record.variants.length
            "
            :class="{ 'me-show': record._viewflag_ }"
            class="me-spec-all"
          >
            <div
              v-for="(vars, its) in record.variants"
              :key="vars.variationId"
              style="height:24px"
            >
              <a-switch
                :checked-children="$t('common.open1')"
                :un-checked-children="$t('common.close1')"
                :checked="vars.status === 1 ? true : false"
                @change="(e) => defaultTopChange(e, index, its)"
              />
            </div>
          </div>
        </div>
      </template>

      <!-- 加购价格 -->
      <template slot="countryCode" slot-scope="text, record, index">
        <div
          v-if="record.variants && record.variants.length"
          :class="{ 'me-show': record._viewflag_ }"
          class="me-spec-all"
        >
          <div v-for="(vars, its) in record.variants" :key="vars.variationId">
            {{ record.currency }}
            <a-input-number
              size="small"
              v-model="vars.subItemInputPrice"
              :min="0"
              :max="vars.price"
              @change="(e) => priceTopChange(e, index, its)"
            />
          </div>
        </div>
      </template>
      <!-- 折扣 -->
      <template slot="definiteTime" slot-scope="text, record, index">
        <div
          v-if="record.variants && record.variants.length"
          :class="{ 'me-show': record._viewflag_ }"
          class="me-spec-all"
        >
          <div v-for="(vars, its) in record.variants" :key="vars.variationId">
            <a-input-number
              size="small"
              v-model="vars.itemDiscount"
              :min="1"
              :max="100"
              @change="(e) => discountTopChange(e, index, its)"
            />
            %折扣
          </div>
        </div>
      </template>
      <!-- 购买限制 -->
      <template slot="description" slot-scope="text, record">
        <div
          v-if="record.variants && record.variants.length"
          :class="{ 'me-show': record._viewflag_ }"
          class="me-spec-all"
        >
          <div v-for="vars in record.variants" :key="vars.variationId">
            <a-input-number
              size="small"
              v-model="vars.subItemLimit"
              :min="1"
              :max="100000"
            />个
          </div>
        </div>
      </template>
      <template slot="actions" slot-scope="text, record, index">
        <slot name="actions" :source="{ text, record, index }"></slot>
      </template>
    </a-table>
  </div>
</template>

<script>
import { max, min, compact, cloneDeep } from 'lodash'

export default {
  props: {
    loading: Boolean,
    dataSource: {
      type: Array,
      default: () => []
    },
    rowSelection: Object,
    pagination: Object,
    tableType: {
      type: String,
      default: ''
    },
    listType: {
      type: Boolean,
      default: true
    },
    rowKey: {
      type: String,
      default: 'id'
    },
    tabstatus: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      columns: compact([
        this.$props.tableType === 'follow'
          ? {
              dataIndex: 'followPrizeName',
              key: 'followPrizeName',
              scopedSlots: { customRender: 'followPrizeName' },
              title: '关注礼名称',
              width: 300
            }
          : null,
        this.$props.tableType === 'coupon'
          ? {
              dataIndex: 'voucherName',
              key: 'voucherName',
              scopedSlots: { customRender: 'voucherName' },
              title: '优惠券名称',
              width: 250
            }
          : null,
        this.$props.tableType === 'setmeal'
          ? {
              dataIndex: 'name',
              key: 'name',
              scopedSlots: { customRender: 'name' },
              title: '活动名称',
              width: 250
            }
          : null,
        this.$props.tableType === 'additional'
          ? {
              dataIndex: 'addOnDealName',
              key: 'addOnDealName',
              scopedSlots: { customRender: 'addOnDealName' },
              title: '活动名称',
              width: 250
            }
          : null,

        this.$props.tableType === 'couponaddpro' ||
        this.$props.tableType === 'addtionaddpro1' ||
        this.$props.tableType === 'addtionaddpro2'
          ? {
              dataIndex: 'product_info',
              key: 'product_info',
              scopedSlots: { customRender: 'product_info' },
              title: '商品名称',
              width: 350
            }
          : null,
        this.$props.tableType === 'couponaddpro'
          ? {
              dataIndex: 'sales',
              key: 'sales',
              scopedSlots: { customRender: 'sales' },
              title: '销量',
              sorter: (a, b) => a.sales - b.sales
            }
          : null,
        this.$props.tableType === 'couponaddpro' ||
        this.$props.tableType === 'addtionaddpro1' ||
        this.$props.tableType === 'addtionaddpro2'
          ? {
              dataIndex: 'price',
              key: 'price',
              scopedSlots: { customRender: 'price' },
              title: '售价'
              // sorter: (a, b) => a.price - b.price
            }
          : null,
        // this.$props.tableType === 'couponaddpro'
        //   ? {
        //       dataIndex: 'originalPrice',
        //       key: 'originalPrice',
        //       scopedSlots: { customRender: 'originalPrice' },
        //       title: '原价',
        //       sorter: (a, b) => a.originalPrice - b.originalPrice
        //     }
        //   : null,
        this.$props.tableType === 'follow' ||
        this.$props.tableType === 'coupon' ||
        this.$props.tableType === 'setmeal' ||
        this.$props.tableType === 'additional'
          ? {
              dataIndex: 'storeName',
              key: 'storeName',
              scopedSlots: { customRender: 'storeName' },
              title: '店铺'
            }
          : null,
        this.$props.tableType === 'follow' ||
        this.$props.tableType === 'coupon' ||
        this.$props.tableType === 'additional'
          ? {
              dataIndex: 'rewardType',
              key: 'rewardType',
              scopedSlots: { customRender: 'rewardType' },
              title: '优惠券类型'
            }
          : null,
        this.$props.tableType === 'addtionaddpro2'
          ? {
              dataIndex: 'countryCode',
              key: 'countryCode',
              scopedSlots: { customRender: 'countryCode' },
              title: '加购价格'
            }
          : null,
        this.$props.tableType === 'addtionaddpro2'
          ? {
              dataIndex: 'definiteTime',
              key: 'definiteTime',
              scopedSlots: { customRender: 'definiteTime' },
              title: '加购折扣'
            }
          : null,
        this.$props.tableType === 'addtionaddpro2'
          ? {
              dataIndex: 'description',
              key: 'description',
              scopedSlots: { customRender: 'description' },
              title: '购买限制'
            }
          : null,
        this.$props.tableType === 'follow' ||
        this.$props.tableType === 'coupon' ||
        this.$props.tableType === 'setmeal' ||
        this.$props.tableType === 'additional' ||
        this.$props.tableType === 'addtionaddpro1' ||
        this.$props.tableType === 'addtionaddpro2'
          ? {
              dataIndex: 'status',
              key: 'status',
              scopedSlots: { customRender: 'status' },
              title: '状态'
            }
          : null,
        this.$props.tableType === 'follow' || this.$props.tableType === 'coupon'
          ? {
              dataIndex: 'usageQuantity',
              key: 'usageQuantity',
              scopedSlots: { customRender: 'usageQuantity' },
              title: '已使用/总数量'
            }
          : null,
        this.$props.tableType === 'follow' ||
        this.$props.tableType === 'coupon' ||
        this.$props.tableType === 'setmeal' ||
        this.$props.tableType === 'additional'
          ? {
              dataIndex: 'startTime',
              key: 'startTime',
              scopedSlots: { customRender: 'startTime' },
              title: '领取期限',
              width: 250
            }
          : null,
        // this.$props.tableType === 'coupon' ||
        // this.$props.tableType === 'setmeal' ||
        // this.$props.tableType === 'additional'
        //   ? {
        //       dataIndex: 'createTime',
        //       key: 'createTime',
        //       scopedSlots: { customRender: 'createTime' },
        //       title: '创建时间'
        //     }
        //   : null,
        this.$props.tableType === 'addtionaddpro1' ||
        this.$props.tableType === 'addtionaddpro2'
          ? {
              dataIndex: 'stock',
              key: 'stock',
              scopedSlots: { customRender: 'stock' },
              title: '库存'
              // sorter: (a, b) => a.stock - b.stock
            }
          : null,
        // this.$props.tableType === 'addtionaddpro1'
        //   ? {
        //       dataIndex: 'stock',
        //       key: 'stock',
        //       scopedSlots: { customRender: 'stock' },
        //       title: '物流方式'
        //     }
        //   : null,
        {
          dataIndex: 'actions',
          key: 'actions',
          // fixed: 'right',
          scopedSlots: { customRender: 'actions' },
          title: '操作',
          width: 200
        }
      ]),
      remarkVisible: false
    }
  },
  created() {},
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
     * 获取售价
     */
    getPrice() {
      return (item) => {
        if (item.hasVariation && item.variants) {
          const variantsPrices = item.variants.map(({ price }) => price)
          const _min = min(variantsPrices)
          const _max = max(variantsPrices)
          if (_max === _min) return `${_max}(变体价格相同)`
          return `${_min} ~ ${_max}(变体价格区间)`
        } else {
          return `${item.price}(无变体)`
        }
      }
    }
  },
  methods: {
    changePage(pagination, filters, sorter) {
      const { order } = sorter
      this.$emit('changeType', order)
      this.$emit('change', pagination)
    },
    // 状态开关
    defaultTopChange(e, index, its = null) {
      this.$emit('changeStatus', {
        table: this.tabstatus, // 主商品还是加购商品的状态切换
        index: index,
        status: e,
        its: its
      })
    },
    // 调整折扣
    discountTopChange(e, index, its) {
      console.log(e, index, its)
      this.$emit('changeDiscount', {
        vals: e,
        index: index,
        its: its
      })
    },
    // 调整价格
    priceTopChange(e, index, its) {
      console.log(e, index, its)
      this.$emit('changePrice', {
        vals: e,
        index: index,
        its: its
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/mixins.scss';
.me-em1 {
  @include ellipsisMultiline(1);
}
@import './table.scss';
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

.me-spec-all {
  height: 48px;
  overflow: hidden;
}
.me-show {
  height: auto;
}
</style>
