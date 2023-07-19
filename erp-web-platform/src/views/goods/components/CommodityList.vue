<template>
  <div style="background-color: #fff" class="commodity-list">
    <a-table
      :loading="loading"
      :columns="columns"
      :data-source="dataSource"
      :rowSelection="rowSelection"
      :pagination="pagination"
      @change="changePage"
      rowKey="id"
    >
      <span slot="publishShopsTitle">
        <a-popover>
          <template slot="content">
            <p class="me-publish-status">
              <span class="publish-status-point" style="background: #67C23A" />
              发布店铺成功
            </p>
            <p class="me-publish-status">
              <span class="publish-status-point" style="background: #F73F2F" />
              发布店铺失败
            </p>
            <p class="me-publish-status">
              <span class="publish-status-point" style="background: #FFA666" />
              发布中
            </p>
            <p class="me-publish-status">
              <span class="publish-status-point" style="background: #a8a8b3" />
              未发布
            </p>
          </template>
          {{ $t('commodityList.publishedSite')
          }}<a-icon type="question-circle" />
        </a-popover>
      </span>
      <template slot="product_info" slot-scope="text, record, index">
        <div class="product-info">
          <div>
            <a-popover :placement="index < 5 ? 'rightTop' : 'rightBottom'">
              <template slot="content">
                <img
                  v-lazy="record.mainImage"
                  style="width: 280px; height: 280px; border-radius: 2px"
                />
              </template>
              <img
                v-lazy="record.mainImage"
                style="width: 80px; height: 80px; border-radius: 2px"
              />
            </a-popover>

            <div
              v-if="$props.type === 1 && record.localStatus == 5"
              class="me-fs12 me-status-skip me-mt-2"
            >
              正在更新中...
            </div>
            <div
              v-if="$props.type === 1 && record.localStatus == 4"
              class="me-fs12 me-status-error me-mt-2"
            >
              更新失败
              <a-popover>
                <template slot="content">
                  <p>{{ record.reasons }}</p>
                </template>
                <a-icon type="exclamation-circle" />
              </a-popover>
            </div>
          </div>

          <div class="info-text">
            <a
              target="__blank"
              :href="$props.type === 1 ? record.itemUrl : record.sourceUrl"
              class="name"
            >
              <i
                v-if="$props.type === 1 && record.isPreOrder"
                class="shop-type-tag iconfont iconyu1"
              />
              <i
                v-if="$props.type === 1 && record.discountId"
                class="shop-type-tag2 iconfont iconxingzhuangjiehe"
              />
              {{ record.name }}
            </a>
            <span
              style="color: rgba(0, 0, 0, 0.54)"
              v-copy="record.name"
              class="iconfont iconjuxing1 hand copy-icon"
              v-if="$props.type === 1"
            ></span>
            <p :class="{ 'me-mt-2 me-pt-1': $route.path != '/goods/on-sale' }">
              <span class="me-mr-3 me-fs12 me-status-skip">
                {{ $t('commodityList.collectionSource') }}：<span>
                  <a
                    :href="record.sourceUrl"
                    target="blank"
                    class="me-fs12 me-status-skip"
                    >{{ record.sourceName | stringSlice(12) }}
                  </a>
                </span>
              </span>
              <a-dropdown
                :trigger="['click']"
                v-if="
                  record.shopeeProductExtDTO &&
                    record.shopeeProductExtDTO.length
                "
              >
                <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
                  <a-icon type="down" />
                </a>
                <a-menu slot="overlay">
                  <a-menu-item
                    v-for="(item, index) in record.shopeeProductExtDTO"
                    :key="index"
                  >
                    <a-space>
                      其他来源:
                      <h2
                        @click="editRemarks(item, record.id)"
                        style="width: 165px; display: inline-block"
                        class="originlink"
                        :title="item.remarks"
                      >
                        {{ item.remarks }}
                      </h2>

                      <span style="width: 15px; display: block">
                        <a
                          v-if="validateUrl(item.remarks)"
                          :href="item.remarks"
                          target="_blank"
                        >
                          <a-icon type="link" />
                        </a>
                        <!-- <a-icon type="link" class="me-disable" v-else /> -->
                      </span>
                      <a-icon type="delete" @click="deleteRemarks(item)" />
                    </a-space>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
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

            <!-- <p v-if="$props.type === 1 && !record.merchantId"> -->
            <p v-if="$props.type === 1">
              <span class="me-mr-5 me-fs12 me-status-skip">
                <span
                  @click="addRemarks(record.id)"
                  class="hand me-status-link"
                  v-if="record.shopeeProductExtDTO.length !== 4"
                >
                  {{ $t('commodityList.addCollectionSource') }}
                </span>
              </span>
            </p>

            <p class="me-pt-1 iconarr" v-if="$props.type === 1">
              <a-space>
                <a-tooltip bottom v-for="(val, key) in attachInfo" :key="key">
                  <template slot="title">
                    <span>
                      {{ attachInfo[key].name }} {{ Math.ceil(record[key]) }}
                    </span>
                  </template>
                  <span
                    class="iconfont hand iconsize"
                    :class="attachInfo[key].icon"
                  >
                    {{ handleNum(Math.ceil(record[key])) }}
                  </span>
                </a-tooltip>
              </a-space>
            </p>
          </div>
        </div>
      </template>

      <template slot="product_category" slot-scope="text, record">
        <a-popover v-if="record.categoryNames && record.categoryNames.length">
          <template slot="content">
            {{ reverseCategory(record.categoryNames) }}
          </template>
          <div class="edit-product-category">
            <p class="me-em1 me-status-skip">
              {{ returnCategory(record.categoryNames) }}
            </p>
            <template v-if="showListEdit">
              <a-icon type="edit" @click="onChangeCategory(record)" />
            </template>
          </div>
        </a-popover>
        <template v-else>
          <div class="edit-product-category">
            <p class="me-em1 me-status-skip">-</p>
            <template v-if="showListEdit">
              <a-icon type="edit" @click="onChangeCategory(record)" />
            </template>
          </div>
        </template>
      </template>

      <template slot="product_price" slot-scope="text, record">
        <a-spin :spinning="!!record._price_spinning_">
          <div>
            {{ record.currency }}: {{ getPrice(record) }}
            <template v-if="showListEdit">
              <a-icon type="edit" @click="onChangePrice(record)" />
            </template>
          </div>
        </a-spin>
      </template>

      <template slot="product_rmb_price" slot-scope="text, record">
        <div>RMB:</div>
        {{ getRmbPrice(record) }}
      </template>

      <template slot="product_stock" slot-scope="text, record">
        {{ getStock(record) }}
      </template>

      <template slot="variants" slot-scope="text, record">
        {{ record.variants ? record.variants.length : '--' }}
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
          <span class="me-status me-status-error me-em2">
            {{ record.reasons }}
          </span>
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
                  />
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
                <a-popover v-if="item.success == 'failed'">
                  <template slot="content">
                    <p>{{ item.reason }}</p>
                  </template>
                  <span
                    class="publish-status-point"
                    :style="{
                      background: '#F73F2F'
                    }"
                  />
                </a-popover>
                <span
                  v-if="item.success == 'success'"
                  class="publish-status-point"
                  :style="{
                    background: '#67C23A'
                  }"
                />
                <span
                  v-if="item.success == 'processing'"
                  class="publish-status-point"
                  :style="{
                    background: '#FFA666'
                  }"
                />
                <span
                  v-if="item.success == 'not_published'"
                  class="publish-status-point"
                  :style="{
                    background: '#a8a8b3'
                  }"
                />
                {{ item.region }}
              </li>
            </ul>
          </a-popover>
        </div>

        <div v-else>--</div>
      </template>

      <template slot="actions" slot-scope="text, record">
        <slot name="actions" :source="record"></slot>
      </template>
    </a-table>

    <a-modal
      v-model="remarksVisible"
      title=""
      :footer="null"
      destroyOnClose
      centered
    >
      <h3 class="remarktit">
        <span v-if="remarksType === 'edit'">编辑商品来源</span>
        <span v-else>添加商品来源</span>
      </h3>
      <a-textarea
        v-model="remarksContent"
        placeholder="请输入采集链接"
        :auto-size="{ minRows: 4, maxRows: 6 }"
      />
      <div class="me-text-center me-mt-3">
        <a-space>
          <a-button @click="remarksVisible = false">取消</a-button>
          <a-button type="primary" @click="submitRemarks" :loading="submiting">
            确定
          </a-button>
        </a-space>
      </div>
    </a-modal>

    <!-- 单个修改价格 -->
    <a-modal
      :visible="!!updatePrice"
      @cancel="updatePrice = null"
      :width="800"
      destroyOnClose
    >
      <template slot="title">
        <span>修改售价</span>
        <a-button
          class="me-fr me-mr-5"
          size="small"
          @click="batchUpdatePrice = true"
        >
          <template v-if="updatePrice && updatePrice.hasVariation">
            批量
          </template>
          设置售价
        </a-button>
      </template>
      <template v-if="updatePrice">
        <template v-if="updatePrice.hasVariation">
          <a-table
            :pagination="false"
            :columns="priceColumns"
            :data-source="updatePrice.variants"
            :scroll="{ y: 500 }"
            rowKey="variationSku"
          >
            <!-- 规格 -->
            <template
              v-for="(item, index) in updatePrice.specs"
              :slot="`spec_${index}`"
              slot-scope="text, record"
            >
              {{ record.name.split(',')[index] }}
            </template>
            <!-- 来源价格 -->
            <template slot="originalPrice" slot-scope="text, record">
              <p>{{ updatePrice.countryCode }}: {{ record.price }}</p>
              <p>RMB: {{ record.rmbPrice }}</p>
            </template>
            <!-- 售价 -->
            <template slot="price" slot-scope="text, record">
              <a-input
                :addon-before="updatePrice.countryCode"
                v-model="record.price"
                @change="onPriceChangeEvent($event, record)"
              />
            </template>
          </a-table>
        </template>
        <template v-else>
          <a-space>
            <a-input
              type="number"
              :disabled="!!updatePrice.discountId"
              v-model="updatePrice.price"
              :suffix="updatePrice.countryCode"
              :placeholder="$t('edit.price')"
              @change="onPriceChangeEvent($event)"
            />
            <a-input
              readOnly
              prefix="￥"
              suffix="RMB"
              v-model="updatePrice.rmbPrice"
              :placeholder="$t('edit.RMB')"
            />
          </a-space>
        </template>
      </template>

      <template slot="footer">
        <a-button
          type="primary"
          @click="onUpdatePriceSubmit"
          :loading="savePriceLoading"
        >
          保存修改
        </a-button>
      </template>
    </a-modal>

    <!-- 定价模版 -->
    <a-modal
      :visible="batchUpdatePrice"
      title="设置售价"
      @cancel="batchUpdatePrice = false"
      @ok="onBatchUpdatePrice"
      destroyOnClose
    >
      <SetPriceTemplate ref="setPriceTemplate" :list="[updatePrice]" />
    </a-modal>
  </div>
</template>

<script>
import { build1688SearchImgLink, add, division } from '@/util'
import { max, min, compact, cloneDeep } from 'lodash'
import { positiveNumber } from '@/directive/number'
import Goods from '@/api/goods'
import Cnsc from '@/api/cnsc'
import { URL } from '@/util/regex'
import SetPriceTemplate from '@/views/goods/components/setPriceTemplate/SetPriceTemplate'

const getRmbPrice = (price, rate) => {
  if (!rate) return Number(price).toFixed(2)
  return Number(division(price, rate).toFixed(2))
}

export default {
  components: {
    SetPriceTemplate
  },
  directives: {
    positiveNumber
  },
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
        name: this.$t('commodityList.like')
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
          title: this.$t('commodityList.productInfo'),
          width: 400
        },
        {
          dataIndex: 'product_category',
          key: 'product_category',
          scopedSlots: { customRender: 'product_category' },
          title: this.$t('commodityList.productCategory'),
          width: 180
        },
        this.$props.type == 3
          ? {
              dataIndex: 'reasons',
              key: 'reasons',
              scopedSlots: { customRender: 'reasons' },
              title: this.$t('commodityList.cause'),
              width: 170
            }
          : null,
        this.$props.type == 1 || this.$props.type == 2
          ? {
              dataIndex: 'product_price',
              key: 'product_price',
              scopedSlots: { customRender: 'product_price' },
              title: this.$t('commodityList.sellingPrice'),
              width: 200
            }
          : {
              dataIndex: 'product_price',
              key: 'product_price',
              scopedSlots: { customRender: 'product_price' },
              title: this.$t('commodityList.sellingPrice'),
              width: 200
            },
        this.$props.type == 1 && {
          dataIndex: 'product_rmb_price',
          key: 'product_rmb_price',
          scopedSlots: { customRender: 'product_rmb_price' },
          title: this.$t('commodityList.rmbSellingPrice'),
          width: 150
        },
        {
          dataIndex: 'variants',
          key: 'variants',
          scopedSlots: { customRender: 'variants' },
          title: this.$t('commodityList.specNum'),
          width: 150
        },
        {
          dataIndex: 'product_stock',
          key: 'product_stock',
          scopedSlots: { customRender: 'product_stock' },
          title: this.$t('commodityList.stock'),
          width: 150
        },
        {
          dataIndex: 'store',
          key: 'store',
          scopedSlots: { customRender: 'store' },
          title: this.$t('commodityList.claimStore') + '/CNSC',
          width: 250
        },
        this.$props.type == 4
          ? {
              dataIndex: 'definiteTime',
              key: 'definiteTime',
              title: this.$t('commodityList.scheduledReleaseTime'),
              width: 170
            }
          : null,
        this.$props.type == 8
          ? {
              dataIndex: 'updateTime',
              key: 'updateTime',
              title: this.$t('commodityList.lastModifiedTime'),
              width: 170
            }
          : null,
        this.$props.type == 10
          ? {
              dataIndex: 'publishShops',
              key: 'publishShops',
              slots: { title: 'publishShopsTitle' },
              scopedSlots: { customRender: 'publishShops' },
              width: 170
            }
          : null,
        {
          dataIndex: 'actions',
          key: 'actions',
          fixed: 'right',
          scopedSlots: { customRender: 'actions' },
          title: this.$t('common.handler'),
          width: 200
        }
      ]),
      remarkVisible: false,
      remarkContent: '',

      remarksVisible: false,
      remarksContent: '',
      submiting: false,
      curProid: 0,
      curExtId: 0, //当前编辑的备注id
      remarksType: 'edit',

      updatePrice: null,
      batchUpdatePrice: false,

      savePriceLoading: false
    }
  },
  methods: {
    /**批量修改价格提交 */
    async onUpdatePriceSubmit() {
      if (!this.updatePrice) return
      if (this.updatePrice.categoryIds) {
        this.updatePrice.categoryIds.sort()
      }
      this.$data.savePriceLoading = true
      if (this.updatePrice.cnsc) {
        await Cnsc.handleEarlyUpdateProduct(this.updatePrice)
      } else {
        await Goods.getEarlyProductDetailEdit(this.updatePrice)
      }
      this.$data.savePriceLoading = false
      this.$message.success('操作成功')
      this.updatePrice = null
      this.reloadData()
    },
    /**批量修改价格提交 */
    async onBatchUpdatePrice() {
      const res = await this.$refs.setPriceTemplate.updateList()
      const errors = await this.$refs.setPriceTemplate.verifyList(res)
      if (errors) return this.$message.error(errors)
      const [product] = res
      this.updatePrice = product
      this.batchUpdatePrice = false
    },
    /**价格改变事件 */
    onPriceChangeEvent(event, record) {
      if (!this.updatePrice) return
      const value = Number(Number(event.target.value).toFixed(2))
      const { rate } = this.updatePrice
      if (this.updatePrice.hasVariation) {
        /**多规格 */
        record.rmbPrice = getRmbPrice(value, rate)
      } else {
        /**单品 */
        this.$set(this.updatePrice, 'rmbPrice', getRmbPrice(value, rate))
        this.$set(this.updatePrice, 'price', value)
      }
    },
    /**价格修改 */
    async onChangePrice(record) {
      let data
      record._price_spinning_ = true
      if (record.currency === 'CNY') {
        data = (await Cnsc.getEarlyCnscProductDetail(record.id)).data
        data.countryCode = 'CNSC'
      } else {
        data = (await Goods.getEarlyShopeeProductDetail(record.id)).data
      }
      record._price_spinning_ = false
      this.$data.updatePrice = data
    },
    /**类目修改 */
    onChangeCategory(record) {
      let { countryCode, currency } = record
      if (currency === 'CNY') countryCode = 'CNSC'
      this.$categoryChoose(countryCode).then(async (data) => {
        const { categoryIds } = data
        const categoryId = categoryIds[categoryIds.length - 1]
        const params = { ...record, ...data, categoryId }
        if (countryCode === 'CNSC') {
          await Cnsc.handleEarlyUpdateProduct(params)
        } else {
          await Goods.getEarlyProductDetailEdit(params)
        }
        this.$message.success('操作成功')
        this.reloadData()
      })
    },
    changePage(pagination, filters, sorter) {
      const { order } = sorter
      this.$emit('changeType', order)
      this.$emit('change', pagination)
    },
    // 在线商品，添加采集来源后，避免表格前后(操作部分)高度不同，刷新下页面数据，重置高度
    reloadData() {
      this.$emit('reloadPageData')
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

    editRemarks(item, id) {
      this.$data.curProid = id
      this.$data.curExtId = item.goodsShopeeProductExtId
      this.$data.remarksContent = item.remarks
      this.$data.remarksVisible = true
      this.$data.remarksType = 'edit'
    },
    async submitRemarks() {
      this.$data.submiting = true
      var params = {
        // goodsShopeeProductExtId: this.$data.curExtId,
        goodsShopeeProductId: this.$data.curProid,
        remarks: this.$data.remarksContent
      }
      var result
      if (this.$data.remarksType === 'edit') {
        let params2 = {
          goodsShopeeProductExtId: this.$data.curExtId,
          ...params
        }
        result = await Goods.updateRemarks(params2).finally(() => {
          this.$data.submiting = false
        })
      } else {
        result = await Goods.addRemarks(params).finally(() => {
          this.$data.submiting = false
        })
      }
      const { code } = result
      if (code === 0) {
        this.$data.remarksVisible = false
        this.reloadData()
      }
    },
    addRemarks(id) {
      this.$data.curProid = id
      this.$data.remarksVisible = true
      this.$data.remarksContent = null
      this.$data.remarksType = 'add'
    },
    async deleteRemarks(item) {
      let result = await Goods.deleteRemarks2(item.goodsShopeeProductExtId)
      const { code } = result
      if (code === 0) {
        this.reloadData()
      }
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
  computed: {
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
        if (item.hasVariation && item.variants) {
          const variantsPrices = item.variants.map(({ price }) => price)
          const _min = min(variantsPrices)
          const _max = max(variantsPrices)
          if (_max === _min) return `${_max}`
          return `${_min} ~ ${_max}`
        }
        return `${item.price}`
      }
    },
    /**
     * 获取售价
     */
    getRmbPrice() {
      return (item) => {
        if (item.hasVariation && item.variants) {
          const variantsPrices = item.variants.map(({ rmbPrice }) => rmbPrice)
          const _min = min(variantsPrices)
          const _max = max(variantsPrices)
          if (_max === _min) return `${_max}`
          return `${_min} ~ ${_max}`
        }
        return `${item.rmbPrice}`
      }
    },
    /**
     * 获取库存
     */
    getStock() {
      return (item) => {
        if (item.hasVariation && item.variants) {
          let num = 0
          item.variants.map(({ stock }) => {
            num = add(num, Number(stock) || 0)
          })
          return num
        }
        return `${item.stock}`
      }
    },
    /**
     * 批量修改售价表格列
     */
    priceColumns() {
      const columns = [
        {
          dataIndex: 'originalPrice',
          key: 'originalPrice',
          scopedSlots: { customRender: 'originalPrice' },
          title: '来源价格'
        },
        {
          dataIndex: 'price',
          key: 'price',
          scopedSlots: { customRender: 'price' },
          title: '售价'
        }
      ]
      const dynamicColumns = this.updatePrice?.specs.map(({ name }, index) => ({
        dataIndex: `spec_${index}`,
        key: `spec_${index}`,
        scopedSlots: { customRender: `spec_${index}` },
        title: name,
        width: 200
      }))

      return [...(dynamicColumns || []), ...columns]
    },
    /**显示列表编辑 */
    showListEdit() {
      const { type } = this.$props
      return type === 2 || type === 3 || type === 4 || type === 8
    }
  }
}
</script>

<style lang="scss" scoped>
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
        color: #ff6b38;
        font-size: 16px;
      }
      .shop-type-tag2 {
        margin-left: 3px;
        color: red;
        font-size: 16px;
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

.edit-product-category {
  display: flex;
  align-items: center;
}

.anticon-edit {
  color: #4c86ff;
  cursor: pointer;
}
.me-publish-status {
  position: relative;
  .publish-status-point {
    position: relative;
    display: inline-block;
    top: 1px;
  }
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
    display: inline-block;
    min-width: 65px;
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
.remarktit {
  font-size: 18px;
  text-align: center;
  margin-bottom: 10px;
}
.originlink {
  overflow: hidden;
  color: #000000a6;
  text-overflow: ellipsis;
  display: -webkit-box; //作为弹性伸缩盒子模型显示。
  -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
  -webkit-line-clamp: 1; //显示的行
  line-height: 12px;
}
.me-disable {
  cursor: no-drop;
}
</style>
