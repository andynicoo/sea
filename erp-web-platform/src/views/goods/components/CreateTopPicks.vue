<template>
  <div class="me-create-top">
    <a-form
      class="me-search-form"
      labelAlign="left"
      :form="form"
      :label-col="{ span: 2 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-form-item :label="$t('goodsCollection.topName')">
        <a-input
          v-decorator="[
            'name',
            {
              rules: [
                {
                  required: true,
                  message:
                    $t('goodsCollection.pleaseInput') +
                    $t('goodsCollection.topName')
                }
              ]
            }
          ]"
        />
      </a-form-item>
      <a-form-item :label="$t('goodsCollection.claimSettingTitle8')">
        <!-- <a-select @change="storeChange" v-decorator="['storeId',{ rules: [{ required: true, message: $t('goodsCollection.autoPublishSet32') }] }]" :disabled="afferentStoreId?true:false">
          <a-select-option
            v-for="store in storeList"
            :key="store.storeId"
            :value="store.storeId"
          >
            {{ store.storeName }}
          </a-select-option>
        </a-select> -->
        <a-cascader
          :placeholder="$t('store.choseStore')"
          v-decorator="[
            'storeId',
            {
              rules: [
                {
                  required: true,
                  message: $t('goodsCollection.autoPublishSet32')
                }
              ]
            }
          ]"
          :options="storeListSize"
          :disabled="afferentStoreId ? true : false"
          :show-search="{ filter }"
          @change="storeChange"
        />
      </a-form-item>
    </a-form>

    <div class="me-select-Goods">
      <a-button @click="clearSelectedRow" class="me-clear-data">{{
        $t('goodsCollection.oneClickClea')
      }}</a-button>
      <a-tabs :activeKey="tabsGoodsModel" type="card" @change="tabsGoodsChange">
        <a-tab-pane key="1" :tab="$t('goodsCollection.chooseProducts')">
          <div class="me-search-bar">
            <a-input-group compact class="me-compact me-mr-2">
              <a-select v-model="sType1" class="me-w110">
                <a-select-option value="title">
                  {{ $t('goodsCollection.columnTitle') }}
                </a-select-option>
                <a-select-option value="itemSku">
                  {{ $t('commodityList.skuCode') }}
                </a-select-option>
              </a-select>
              <a-input v-model="searTxt1" class="me-w200 me-mr-2" />
            </a-input-group>
            <a-input-group compact class="me-compact me-mr-2">
              <a-select v-model="sType2" class="me-w110">
                <a-select-option value="sales">
                  {{ $t('goodsCollection.salesD') }}
                </a-select-option>
                <a-select-option value="views">
                  {{ $t('goodsCollection.viewsD') }}
                </a-select-option>
                <a-select-option value="likes">
                  {{ $t('goodsCollection.collectionD') }}
                </a-select-option>
                <!-- <a-select-option value="likes">
                {{$t('goodsCollection.priceD')}}
              </a-select-option> -->
              </a-select>
              <a-input-number
                v-model="searTxt2"
                :min="0"
                :max="99999"
                :precision="0"
              />
            </a-input-group>
            <a-button type="primary" class="me-mr-2" @click="searchGoodsForm">{{
              $t('common.searchit')
            }}</a-button>
            <a-button @click="resetGoodsForm">{{
              $t('common.reset')
            }}</a-button>
          </div>
          <a-table
            :columns="columns"
            :loading="tableLoading"
            rowKey="id"
            :data-source="dataSource"
            :pagination="getPagination"
            :row-selection="rowSelection"
            @change="changePage"
            :scroll="{ y: 300 }"
            class="me-topPicks-table"
          >
            <template slot="name" slot-scope="text, record">
              <div class="me-product-info">
                <a-popover :title="null" placement="right">
                  <template slot="content">
                    <img
                      v-lazy="record.mainImage"
                      style="width: 300px; height: 300px"
                    />
                  </template>
                  <img
                    v-lazy="record.mainImage"
                    style="width: 60px; height: 60px"
                  />
                </a-popover>

                <div class="me-ml-2">
                  <a
                    :href="record.itemUrl || record.sourceUrl"
                    target="blank"
                    class="link-text-color checked-word"
                    :title="record.name"
                  >
                    {{ record.name }}
                  </a>
                  <div class="attach-item">
                    <span class="product-content"
                      >{{ $t('commodityList.skuCode') }}：{{
                        record.itemSku
                      }}</span
                    >
                  </div>
                </div>
              </div>
            </template>
            <template slot="currency" slot-scope="text, record">
              {{ record.currency }}：<span
                class="product-text"
                v-html="formatPrice(record)"
              ></span>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane
          key="2"
          :tab="
            $t('goodsCollection.selectedProducts') +
              ' (' +
              selectedRowsCur.length +
              ')'
          "
        >
          <a-table
            :columns="columns2"
            :loading="tableLoading"
            rowKey="id"
            :data-source="selectedRowsCur"
            :scroll="{ y: 300 }"
          >
            <template slot="name" slot-scope="text, record">
              <div class="me-product-info">
                <a-popover :title="null" placement="right">
                  <template slot="content">
                    <img
                      v-lazy="record.mainImage"
                      style="width: 300px; height: 300px"
                    />
                  </template>
                  <img
                    v-lazy="record.mainImage"
                    style="width: 60px; height: 60px"
                  />
                </a-popover>

                <div class="me-ml-2">
                  <a
                    :href="record.itemUrl || record.sourceUrl"
                    target="blank"
                    class="link-text-color checked-word"
                    :title="record.name"
                  >
                    {{ record.name }}
                  </a>
                  <div class="attach-item">
                    <span class="product-content"
                      >{{ $t('commodityList.skuCode') }}：{{
                        record.itemSku
                      }}</span
                    >
                  </div>
                </div>
              </div>
            </template>
            <template slot="currency" slot-scope="text, record">
              {{ record.currency }}：<span
                class="product-text"
                v-html="formatPrice(record)"
              ></span>
            </template>
            <template slot="handler" slot-scope="text, record, index">
              <a-button type="link" @click="delData(record, index)">{{
                $t('common.delete')
              }}</a-button>
              <a-button type="link" @click="moveUp(index)"
                >{{ $t('goodsCollection.moveUp') }}
              </a-button>
              <a-button type="link" @click="moveDown(index)"
                >{{ $t('goodsCollection.moveDown') }}
              </a-button>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="3" :tab="$t('goodsCollection.s48')" disabled>
        </a-tab-pane>
      </a-tabs>
      <p>
        {{ $t('goodsCollection.selected') }}
        <span class="me-handler-red">{{ selectedRowsCur.length }}</span
        >{{ $t('goodsCollection.productsMax') }}
        <span class="me-handler-red">8</span
        >{{ $t('goodsCollection.individual') }})
      </p>
    </div>
  </div>
</template>

<script>
import Goods from '@/api/goods'
import tableMixins from '@/mixins/tableMixins'
import { cloneDeep, concat, uniq, uniqWith, isEqual } from 'lodash'
import { mapState } from 'vuex'
export default {
  mixins: [tableMixins],
  props: {
    afferentStoreId: {
      type: Number
    }
  },
  computed: {
    ...mapState({
      storeListSize: (state) => state.auth.storeListSize,
      storeList: (state) => state.auth.storeList
    })
  },
  data() {
    return {
      tabsGoodsModel: '1',
      sType1: 'title',
      searTxt1: '',
      sType2: 'sales',
      searTxt2: '',
      storeId: '',
      form: this.$form.createForm(this),
      selectedRowKeysCur: [],
      selectedRowsCur: [],
      columns: [
        {
          title: this.$t('goodsCollection.productsInfo'),
          dataIndex: 'name',
          key: 'name',
          scopedSlots: { customRender: 'name' },
          width: '380px'
        },
        {
          title: this.$t('goodsCollection.productsPrice'),
          dataIndex: 'currency',
          key: 'currency',
          scopedSlots: { customRender: 'currency' },
          width: '200px',
          sorter: (a, b) => {
            let s = a.hasVariation
              ? a.variants.map((el) => el.price).sort((a, b) => a - b)[0]
              : a.price
            let e = b.hasVariation
              ? b.variants.map((el) => el.price).sort((a, b) => a - b)[0]
              : b.price
            return s - e
          }
        },
        {
          title: this.$t('goodsCollection.productsSales'),
          dataIndex: 'sales',
          key: 'sales',
          sorter: (a, b) => a.sales - b.sales
        },
        {
          title: this.$t('goodsCollection.productsViews'),
          dataIndex: 'views',
          key: 'views',
          sorter: (a, b) => a.views - b.views
        },
        {
          title: this.$t('goodsCollection.productsCollections'),
          dataIndex: 'ratingStar',
          key: 'ratingStar',
          sorter: (a, b) => a.ratingStar - b.ratingStar
        },
        {
          title: this.$t('common.createTime'),
          dataIndex: 'createTime',
          key: 'createTime',
          width: '110px'
        }
      ],
      columns2: [
        {
          title: this.$t('goodsCollection.productsInfo'),
          dataIndex: 'name',
          key: 'name',
          scopedSlots: { customRender: 'name' },
          width: '400px'
        },
        {
          title: this.$t('goodsCollection.productsPrice'),
          dataIndex: 'currency',
          key: 'currency',
          scopedSlots: { customRender: 'currency' },
          width: '200px'
        },
        {
          title: this.$t('goodsCollection.productsSales'),
          dataIndex: 'sales',
          key: 'sales'
        },
        {
          title: this.$t('goodsCollection.productsViews'),
          dataIndex: 'views',
          key: 'views'
        },
        {
          title: this.$t('goodsCollection.productsCollections'),
          dataIndex: 'ratingStar',
          key: 'ratingStar'
        },
        {
          title: this.$t('common.createTime'),
          dataIndex: 'createTime',
          key: 'createTime',
          width: '110px'
        },
        {
          title: this.$t('common.handler'),
          dataIndex: 'handler',
          key: 'handler',
          scopedSlots: { customRender: 'handler' }
        }
      ]
    }
  },
  mounted() {
    if (this.$props.afferentStoreId) {
      this.$data.storeId = this.$props.afferentStoreId
      const storeData = this.storeList.find(
        (item) => item.storeId === this.afferentStoreId
      )
      this.$data.form.setFieldsValue({
        storeId: [storeData.countryCode, this.afferentStoreId]
      })
      this.reLoadData()
    }
  },
  methods: {
    //去掉取消选中项
    selectedChange(record, selected) {
      if (!selected) {
        this.$data.selectedRowsCur = this.$data.selectedRowsCur.filter(
          (item) => {
            return item.id != record.id
          }
        )
        this.$data.selectedRowKeysCur = this.$data.selectedRowKeysCur.filter(
          (item) => {
            return item != record.id
          }
        )
      }
    },
    //table选择change
    onSelectChange(selectedRowKeys, selectedRows) {
      this.$data.selectedRowKeys = selectedRowKeys
      this.$data.selectedRows = selectedRows
      if (this.$data.selectedRowKeysCur.length) {
        let key = concat(this.$data.selectedRowKeysCur, selectedRowKeys)
        this.$data.selectedRowKeysCur = uniq(key)
      } else {
        this.$data.selectedRowKeysCur = cloneDeep(selectedRowKeys)
      }

      if (this.$data.selectedRowsCur.length) {
        let row = concat(this.$data.selectedRowsCur, selectedRows)
        this.$data.selectedRowsCur = uniqWith(row, isEqual)
      } else {
        this.$data.selectedRowsCur = cloneDeep(selectedRows)
      }
    },
    //获取列表之后
    getTableDataAfter() {
      this.$data.clearSelectedRows = false
      this.$data.selectedRowKeys = this.$data.selectedRowKeysCur
      this.$data.selectedRows = this.$data.selectedRowsCur
    },
    //上移
    moveUp(index) {
      if (index) {
        let row = this.selectedRowsCur.splice(index, 1)
        this.selectedRowsCur.splice(index - 1, 0, row[0])
      }
    },
    //下移
    moveDown(index) {
      if (index !== this.selectedRowsCur.length) {
        let row = this.selectedRowsCur.splice(index, 1)
        this.selectedRowsCur.splice(index + 1, 0, row[0])
      }
    },
    //删除选中
    delData(record, index) {
      let row = this.selectedRowsCur.splice(index, 1)
      this.$data.selectedRowKeysCur = this.$data.selectedRowKeysCur.filter(
        (item) => item != row[0].id
      )

      this.getTableDataAfter()
    },
    //清空选中
    clearSelectedRow() {
      this.$data.selectedRowKeys = []
      this.$data.selectedRows = []
      this.$data.selectedRowKeysCur = []
      this.$data.selectedRowsCur = []
    },
    //选择店铺
    storeChange(e) {
      this.$data.storeId = e[1]
      this.clearSelectedRow()
      this.reLoadData()
    },

    //重置商品搜索
    resetGoodsForm() {
      this.$data.searTxt1 = null
      this.$data.searTxt2 = null
      this.reLoadData()
    },
    /**搜索 */
    searchGoodsForm(data) {
      this.reLoadData()
    },
    //获取商品列表
    getTableData() {
      let { storeId } = this.$data
      if (storeId) {
        const { size, current } = this.$data.paginationData
        const { storeId, sType1, sType2, searTxt1, searTxt2 } = this.$data
        let params = {
          size,
          current,
          type: 1,
          status: 1,
          calculationType: 2,
          storeId
        }
        params[sType1] = searTxt1
        params[sType2] = searTxt2
        return Goods.getProductList(params)
      } else {
        return { data: { records: [], current: 1, size: 10, total: 0 } }
      }
    },
    //选择商品切换
    tabsGoodsChange(index) {
      this.$data.tabsGoodsModel = index
    },
    /**
     * 单品显示价格price .变体显示列表的最低价和最高价
     */
    formatPrice(item) {
      if (!item.hasVariation) {
        return item.price
      } else {
        let priceArr = item.variants.map((el) => el.price).sort((a, b) => a - b)
        return priceArr.length > 0
          ? `${priceArr[0]} ~ ${priceArr[priceArr.length - 1]}`
          : '0'
      }
    },
    //提交精选
    submitTopPicks() {
      // let flag = true
      return new Promise((resolve) => {
        this.form.validateFields(async (err, values) => {
          console.log(values, 'values')
          if (!err) {
            if (
              this.$data.selectedRowsCur.length > 3 &&
              this.$data.selectedRowsCur.length < 9
            ) {
              let { countryCode } = this.$data.selectedRowsCur[0]
              let images = [],
                itemIds = []
              this.$data.selectedRowsCur.forEach((item) => {
                images.push(item.mainImage)
                itemIds.push(item.itemId)
              })

              let params = {
                countryCode,
                images,
                itemIds,
                platform: 1,
                platformId: this.storeList.find(
                  (item) => item.storeId == values.storeId[1]
                ).platformId,
                name: values.name,
                storeId: values.storeId[1]
              }

              let res = await Goods.handpickAdd({ ...params })
              if (res.data) {
                this.$Message({
                  type: 'success',
                  content: this.$t('common.addSuccess')
                })
              } else {
                if (res.message == 'has no permission for top-picks') {
                  this.$Message({
                    type: 'error',
                    content: `该店铺不支持热门精选操作，可前往shopee卖家后台查看该功能是否被禁止`
                  })
                } else {
                  this.$Message({ type: 'error', content: `${res.message}` })
                }
              }
              this.$emit('updateList')
              resolve(false)
            } else {
              this.$message.error(this.$t('goodsCollection.s48'))
              resolve(true)
            }
          } else {
            resolve(true)
          }
        })
      })
      // return flag
    },
    filter(inputValue, path) {
      return path.some(
        (option) =>
          option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
      )
    }
  },
  beforeDestroy() {}
}
</script>

<style lang="scss" scoped>
.me-product-info {
  display: flex;
}
.me-w200 {
  width: 200px;
}
.me-compact {
  width: auto;
  display: inline-block;
  vertical-align: top;
}
.me-search-bar {
  background: #f6f6f6;
  padding: 4px;
  margin: 0px 0 16px;
}
.me-w65 {
  width: 65%;
}
.me-select-Goods {
  position: relative;
  .me-clear-data {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 999;
  }
}
.checked-word {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.me-w110 {
  min-width: 110px;
}
.me-topPicks-table {
  ::v-deep .ant-table-thead {
    .ant-checkbox {
      display: none;
    }
  }
}
</style>
<style lang="scss">
.me-create-top {
  .ant-tabs-tab-disabled {
    background: #fff !important;
    border-color: #fff !important;
    border-bottom-color: #e8e8e8 !important;
    border-left-color: #e8e8e8 !important;
    cursor: default !important;
  }
}
</style>
