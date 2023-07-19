<template>
  <div class="me-pa-2">
    <a-breadcrumb class="me-pt-2 me-pb-2">
      <a-breadcrumb-item>营销中心</a-breadcrumb-item>
      <a-breadcrumb-item>Shopee折扣</a-breadcrumb-item>
      <a-breadcrumb-item>{{ breadcrumbName }}</a-breadcrumb-item>
      <a-breadcrumb-item>基本资料</a-breadcrumb-item>
    </a-breadcrumb>

    <div class="discount-detail">
      <a-page-header class="me-page-header" :title="$t('discount.basicInfo')">
      </a-page-header>

      <table class="me-ml-3">
        <tr>
          <td style="text-align: right; color: #666666">
            {{ $t('discount.belongStore') }}：
          </td>
          <td>{{ discountInfo.storeName }}</td>
        </tr>
        <tr>
          <td style="text-align: right; color: #666666">
            {{ $t('discount.actName') }}：
          </td>
          <td>
            <div class="me-discount-name">{{ discountInfo.discountName }}</div>
          </td>
        </tr>
        <tr>
          <td style="text-align: right; color: #666666">
            {{ $t('discount.actTime') }}：
          </td>
          <td>{{ discountInfo.startTime }} ~ {{ discountInfo.endTime }}</td>
        </tr>
      </table>
    </div>

    <div class="me-card">
      <h1 class="me-detail-title me-mb-2">
        {{ $t('discount.actGoods') }}
      </h1>
      <!-- <a-table :pagination="false" :columns="columns" :data-source="dataSource">
      </a-table> -->
      <a-table
        :loading="tableLoading"
        :columns="columns"
        :data-source="dataSource"
        :pagination="getPagination"
        :rowSelection="rowSelection"
        @change="changePage"
        rowKey="itemId"
        v-if="dataSource.length"
      >
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
              <p>
                <span class="me-mr-5 me-status-primary">
                  {{ record.countryCode }}
                </span>
              </p>
            </div>
          </div>
        </template>
        <template slot="variantsName" slot-scope="text, record">
          <template v-if="record.variants && record.variants.length">
            <div class="me-spec-all" :class="{ 'me-show': record._viewflag_ }">
              <template v-for="(item, index) in record.variants">
                <p
                  :key="item.variationId"
                  class="me-em1"
                  :title="item.name"
                  v-if="record._open_ || index <= 3"
                >
                  {{ item.name }}
                </p>
              </template>
            </div>
          </template>
          <template v-else>-</template>
        </template>
        <!-- 折扣价/促销价 -->
        <template slot="variants" slot-scope="text, record">
          <!-- 有变体，在变体里设置折扣价或折扣，无变体，在外层设置折扣价或变体 -->
          <template v-if="record.variants && record.variants.length">
            <div class="me-spec-all" :class="{ 'me-show': record._viewflag_ }">
              <template v-for="(item, index) in record.variants">
                <p :key="item.variationId" v-if="record._open_ || index <= 3">
                  <span>价格{{ item.discountedPrice }}</span>
                  <span>或</span>
                  <span>
                    {{ item.percent }}
                    折
                  </span>
                </p>
              </template>
            </div>
          </template>
          <template v-else>
            <span>价格{{ record.discountedPrice }} </span>
            <span>或</span>
            <span>
              {{ record.percent }}
              折
            </span>
          </template>
        </template>
        <template slot="price" slot-scope="text, record">
          <template v-if="record.variants && record.variants.length">
            <div class="me-spec-all" :class="{ 'me-show': record._viewflag_ }">
              <template v-for="(item, index) in record.variants">
                <p :key="item.variationId" v-if="record._open_ || index <= 3">
                  {{ item.price }}
                </p>
              </template>
            </div>
          </template>
          <template v-else>
            {{ record.price }}
          </template>
        </template>
        <!-- 库存 -->
        <template slot="normalStock" slot-scope="text, record">
          <template v-if="record.variants && record.variants.length">
            <div class="me-spec-all" :class="{ 'me-show': record._viewflag_ }">
              <template v-for="(item, index) in record.variants">
                <p :key="item.variationId" v-if="record._open_ || index <= 3">
                  {{ item.normalStock }}
                </p>
              </template>
            </div>
          </template>
          <template v-else> {{ record.normalStock }} </template>
        </template>
        <!-- 库存限制 -->
        <template slot="promotionStock" slot-scope="text, record">
          <template v-if="record.variants && record.variants.length">
            <div class="me-spec-all" :class="{ 'me-show': record._viewflag_ }">
              <template v-for="(item, index) in record.variants">
                <p v-if="record._open_ || index <= 3" :key="item.variationId">
                  {{ item.stockNumLimit == 1 ? '无限制' : item.promotionStock }}
                </p>
              </template>
            </div>
          </template>
          <template v-else>
            {{ record.stockNumLimit == 1 ? '无限制' : record.promotionStock }}
          </template>
        </template>
        <!-- 购买限制 -->
        <template slot="buyNumLimit" slot-scope="text, record">
          <template>
            {{ record.buyNumLimit == 1 ? '无限制' : record.purchaseLimit }}
          </template>
        </template>
        <template slot="reasons" slot-scope="text, record">
          <!-- 是否启用 -->
          <template v-if="record.variants && record.variants.length">
            <div class="me-spec-all" :class="{ 'me-show': record._viewflag_ }">
              <template v-for="(item, index) in record.variants">
                <p v-if="record._open_ || index <= 3" :key="item.variationId">
                  <!-- {{ item.isOpen }} -->
                  {{ item.isOpen ? '启用' : '停用' }}
                </p>
              </template>
            </div>
          </template>
          <template v-else>-</template>
        </template>
        <template slot="actions" slot-scope="text, record">
          <template v-if="record._open_">
            <a-button type="link" @click="onOpen(record, false)">收起</a-button>
          </template>
          <template v-else>
            <a-button type="link" @click="onOpen(record, true)">展开</a-button>
          </template>
        </template>
      </a-table>
    </div>
    <div>
      <a-button @click="$router.go(-1)">返回</a-button>
    </div>
  </div>
</template>

<script>
import Discount from '@/api/discount'
import tableMixins from '@/mixins/tableMixins'
export default {
  mixins: [tableMixins],
  data() {
    return {
      discountInfo: {},
      dataSource: [],
      columns: [
        {
          dataIndex: 'product_info',
          key: 'product_info',
          scopedSlots: { customRender: 'product_info' },
          title: '商品名称',
          width: 350
        },
        {
          title: '规格名称',
          key: 'variantsName',
          dataIndex: 'variantsName',
          scopedSlots: { customRender: 'variantsName' },
          width: 170
        },
        {
          title: '促销价/ 折扣',
          key: 'variants',
          dataIndex: 'variants',
          scopedSlots: { customRender: 'variants' },
          width: 320
        },
        {
          title: '价格',
          key: 'price',
          scopedSlots: { customRender: 'price' },
          dataIndex: 'price',
          width: 100
        },
        {
          title: '库存',
          key: 'normalStock',
          scopedSlots: { customRender: 'normalStock' },
          dataIndex: 'normalStock',
          width: 100
        },
        {
          title: '库存限制',
          key: 'promotionStock',
          scopedSlots: { customRender: 'promotionStock' },
          dataIndex: 'promotionStock',
          width: 100
        },
        // {
        //   title: '购买限制',
        //   key: 'buyNumLimit',
        //   dataIndex: 'buyNumLimit',
        //   scopedSlots: { customRender: 'buyNumLimit' },
        //   width: 50
        // },
        {
          title: '启用/停用',
          key: 'reasons',
          dataIndex: 'reasons',
          scopedSlots: { customRender: 'reasons' },
          width: 100
        },
        {
          title: '操作',
          key: 'actions',
          dataIndex: 'actions',
          scopedSlots: { customRender: 'actions' },
          width: 100
        }
      ]
    }
  },
  computed: {
    breadcrumbName() {
      if (this.$route.query.key === 'expired') {
        return '已结束'
      } else {
        return ''
      }
    }
  },
  mounted() {
    const discountId = this.$route.query.id
    Discount.getDiscountDetail({ discountId }).then(({ data }) => {
      this.$data.discountInfo = data
      this.$data.dataSource = data.items.map((item) => {
        item.variants = item.variants.map((variant) => {
          const { discountedPrice, price } = variant
          variant.percent = Number((discountedPrice / price) * 10).toFixed(2)
          return variant
        })
        return item
      })
    })
  },
  methods: {
    async loadData(flag) {},
    getTableData() {
      var data = { records: [] }
      return data
    },
    onOpen(record, open) {
      this.$set(record, '_open_', open)
    }
  }
}
</script>

<style lang="scss">
@import '@/theme/mixins.scss';
.me-em1 {
  @include ellipsisMultiline(1);
}
.discount-detail {
  background: #fff;
  table {
    tr {
      td {
        height: 30px;
      }
    }
  }
}
.me-discount-name {
  max-width: 500px;
}
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
</style>
