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
      <template slot="stock" slot-scope="text, record">
        <div v-if="record.variants.length && tabstatus === 'addtionaddpro2'">
          <div v-for="vars in record.variants" :key="vars.variationId">
            {{ vars.stock ? vars.stock : 0 }}
          </div>
        </div>
        <div v-else>{{ record.stock ? record.stock : 0 }}</div>
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

      <template slot="originalPrice" slot-scope="text, record">
        {{ record.currency }} {{ record.originalPrice }}
      </template>
      <template slot="price" slot-scope="text, record">
        {{ record.currency }} {{ record.price }}
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
          <div v-if="tabstatus === 'addtionaddpro2' && record.variants.length">
            <div v-for="(vars, its) in record.variants" :key="vars.variationId">
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

      <template slot="actions" slot-scope="text, record, index">
        <slot name="actions" :source="{ text, record, index }"></slot>
      </template>
    </a-table>
  </div>
</template>

<script>
import { compact } from 'lodash'

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
        {
          dataIndex: 'product_info',
          key: 'product_info',
          scopedSlots: { customRender: 'product_info' },
          title: '商品名称',
          width: 350
        },
        {
          dataIndex: 'price',
          key: 'price',
          scopedSlots: { customRender: 'price' },
          title: '售价',
          sorter: (a, b) => a.price - b.price
        },
        {
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' },
          title: '状态'
        },
        {
          dataIndex: 'stock',
          key: 'stock',
          scopedSlots: { customRender: 'stock' },
          title: '库存'
          // sorter: (a, b) => a.stock - b.stock
        },

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
