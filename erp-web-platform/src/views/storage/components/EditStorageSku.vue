<template>
  <div>
    <a-spin :spinning="loading">
      <a-form-model
        ref="form-main"
        :rules="rules"
        :model="stockSkuDesc"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <!-- 基本信息 start -->
        <template>
          <h2 class="me-sub-title">{{ $t('storageSku.basicInfo') }}</h2>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-model-item label="本地SKU" prop="variationSku">
                <a-input v-model="stockSkuDesc.variationSku" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item
                :label="$t('storageSku.masterSku')"
                prop="itemSku"
              >
                <a-input
                  :disabled="!!stockSku"
                  v-model="stockSkuDesc.itemSku"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="默认采购价" prop="purchasePrice">
                <a-input suffix="RMB" v-model="stockSkuDesc.purchasePrice" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item :label="$t('storageSku.status')" prop="status">
                <a-select v-model="stockSkuDesc.status">
                  <a-select-option
                    v-for="status in statusOptions"
                    :value="status.value"
                    :key="status.value"
                  >
                    {{ status.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>

            <a-col :span="24">
              <a-form-model-item
                :label-col="{ span: 3 }"
                :wrapper-col="{ span: 18 }"
                :label="$t('storageSku.productName')"
                prop="name"
              >
                <a-input v-model="stockSkuDesc.name" />
              </a-form-model-item>
            </a-col>

            <template v-if="!!stockSku">
              <a-col :span="24">
                <a-form-model-item
                  :label-col="{ span: 3 }"
                  :wrapper-col="{ span: 18 }"
                  label="SKU别名"
                  prop="alias"
                >
                  <a-input
                    class="me-ib"
                    style="width: 500px"
                    v-model="localSkuAlias"
                    @keydown.enter="onPushAlias"
                    :maxLength="60"
                  />
                  <a-button class="me-ml-4" @click="onPushAlias" type="primary">
                    添加
                  </a-button>
                  <br />
                  <a-tag
                    v-for="(alias, index) in stockSkuDesc.skuAlias"
                    closable
                    :key="index"
                    @close="onCloseAlias($event, index)"
                  >
                    {{ alias }}
                  </a-tag>
                </a-form-model-item>
              </a-col>
            </template>

            <a-col :span="12">
              <a-form-model-item
                :label="$t('storageSku.stockCount')"
                prop="stock"
              >
                <a-input readOnly v-model="stockSkuDesc.stock" />
              </a-form-model-item>
            </a-col>

            <a-col :span="12">
              <a-form-model-item
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 18 }"
                :label="$t('storageSku.productBrand')"
              >
                <a-select
                  class="me-ib"
                  style="width: calc(100% - 200px)"
                  v-model="stockSkuDesc.brandId"
                >
                  <a-select-option
                    v-for="brand in brandList"
                    :value="brand.brandId"
                    :key="brand.brandId"
                  >
                    {{ brand.brandName }}
                  </a-select-option>
                </a-select>
                <a-button
                  @click="brandManagerVisible = true"
                  class="me-ib me-fr"
                  type="link"
                  style="width: 200px"
                >
                  {{ $t('storageSku.brandManager') }}
                </a-button>
              </a-form-model-item>
            </a-col>

            <a-col :span="24">
              <a-form-model-item
                :label-col="{ span: 3 }"
                :wrapper-col="{ span: 18 }"
                :label="$t('storageSku.productCatalogue')"
              >
                <a-cascader
                  class="me-ib"
                  style="width: calc(100% - 200px)"
                  :fieldNames="{
                    label: '_name',
                    value: 'catalogId',
                    children: 'children'
                  }"
                  :options="catalogList"
                  :load-data="loadData"
                  placeholder="Please select"
                  v-model="stockSkuDesc.catalogIds"
                  @change="onCatalogChange"
                />
                <a-button
                  @click="productCatalogManagerVisible = true"
                  class="me-ib me-fr"
                  type="link"
                  style="width: 200px"
                >
                  {{ $t('storageSku.catalogManagement') }}
                </a-button>
              </a-form-model-item>
            </a-col>

            <a-col :span="24">
              <a-form-model-item
                :label-col="{ span: 3 }"
                :wrapper-col="{ span: 18 }"
                :label="$t('storageSku.productDetailImages')"
              >
                <a-upload
                  action="/api/acc/basic/config/platform/uploadImage"
                  list-type="picture-card"
                  :file-list="stockSkuDesc.images"
                  multiple
                  @preview="onPreview"
                  @change="onChange($event, 'images')"
                  :headers="{ Authorization: token }"
                >
                  <div>
                    <a-icon type="plus" />
                    <div class="ant-upload-text">Upload</div>
                  </div>
                </a-upload>
              </a-form-model-item>
            </a-col>

            <a-col :span="24">
              <a-form-model-item
                :label-col="{ span: 3 }"
                :wrapper-col="{ span: 14 }"
                label="商品描述"
                prop="description"
              >
                <a-textarea :rows="6" v-model="stockSkuDesc.description" />
              </a-form-model-item>
            </a-col>
          </a-row>
        </template>
        <!-- 基本信息 end -->

        <!-- 辅助信息 start -->
        <template>
          <h1 class="me-sub-title">{{ $t('storageSku.suppleInfo') }}</h1>
          <a-row :gutter="24">
            <a-col :span="24">
              <a-form-model-item
                :label="$t('storageSku.size')"
                :label-col="{ span: 3 }"
                :wrapper-col="{ span: 21 }"
                class="me-ma-0"
              >
                <a-form-model-item
                  prop="packageLength"
                  class="me-ib me-mr-2"
                  style="width: calc(15% - 10px)"
                >
                  <a-input
                    :prefix="$t('storageSku.length')"
                    suffix="CM"
                    class="me-mr-2 me-ib"
                    v-model="stockSkuDesc.packageLength"
                  />
                </a-form-model-item>
                <a-form-model-item
                  prop="packageWidth"
                  class="me-ib me-mr-2"
                  style="width: calc(15% - 10px)"
                >
                  <a-input
                    :prefix="$t('storageSku.width')"
                    suffix="CM"
                    class="me-mr-2 me-ib"
                    v-model="stockSkuDesc.packageWidth"
                  />
                </a-form-model-item>
                <a-form-model-item
                  prop="packageHeight"
                  class="me-ib me-mr-2"
                  style="width: calc(15% - 10px)"
                >
                  <a-input
                    :prefix="$t('storageSku.height')"
                    suffix="CM"
                    class="me-mr-2 me-ib"
                    v-model="stockSkuDesc.packageHeight"
                  />
                </a-form-model-item>
                <a-form-model-item
                  class="me-ib"
                  style="width: calc(15% - 10px)"
                >
                  <span>{{ $t('storageSku.bulk') }}: {{ bulk }}cm³</span>
                </a-form-model-item>
                <a-form-model-item
                  label="重量"
                  prop="weight"
                  class="me-ib"
                  :label-col="{ span: 8 }"
                  :wrapper-col="{ span: 16 }"
                >
                  <a-input suffix="KG" v-model="stockSkuDesc.weight" />
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item :label="$t('storageSku.package')">
                <a-select
                  class="me-mr-2 me-ib"
                  style="width: calc(100% - 100px)"
                  v-model="stockSkuDesc.materialId"
                  allowClear
                >
                  <a-select-option
                    v-for="packageItem in packageList"
                    :value="packageItem.materialId"
                    :key="packageItem.materialId"
                  >
                    {{ packageItem.name }}
                  </a-select-option>
                </a-select>
                <a-button
                  @click="packageManagerVisible = true"
                  style="width: calc(100px - 10px)"
                  type="link"
                >
                  {{ $t('storageSku.packageManager') }}
                </a-button>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="可包材个数" prop="materialNum">
                <a-input v-model="stockSkuDesc.materialNum" />
              </a-form-model-item>
            </a-col>
            <a-col :span="21" :offset="3" style="padding-left: 5px">
              <a-form-model-item>
                <a-checkbox-group
                  v-model="stockSkuDesc.declareSensitiveWords"
                  :options="declareSensitiveWordsOptions"
                />
              </a-form-model-item>
            </a-col>
            <!-- <a-col :span="12">
              <a-form-model-item :label="$t('storageSku.quality')">
                <a-input v-model="stockSkuDesc.productMaterial" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item :label="$t('storageSku.commodityUse')">
                <a-input v-model="stockSkuDesc.productPurpose" />
              </a-form-model-item>
            </a-col> -->
          </a-row>
        </template>
        <!-- 辅助信息 end -->

        <!-- 仓库信息 start -->
        <!-- <template v-if="stockSku">
          <h1 class="me-sub-title">
            {{ $t('storageSku.storageInfo') }}
          </h1>
          <a-table
            :columns="storageColumns"
            :data-source="stockSkuDesc.productStorage"
          >
          </a-table>
        </template> -->
        <!-- 仓库信息 end -->

        <!-- 平台信息 start -->
        <!-- <template v-if="stockSku">
          <div>
            <h1 class="me-sub-title">
              平台信息
              <router-link to="/storage/online-goods">
                <a class="me-fr me-link"> 跳转到在线商品匹配 </a>
              </router-link>
            </h1>
          </div>
          <a-table
            :columns="platformSkuInfosColumns"
            :data-source="stockSkuDesc.platformSkuInfos"
          >
          </a-table>
        </template> -->
        <!-- 平台信息 end -->

        <!-- 申报信息 start -->
        <template>
          <h2 class="me-sub-title">{{ $t('storageSku.reportInformation') }}</h2>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-model-item
                :label="$t('storageSku.declaredProductNameByEn')"
                prop="declareEnName"
              >
                <a-input v-model="stockSkuDesc.declareEnName" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item
                :label="$t('storageSku.declaredProductNameByCn')"
                prop="declareCnName"
              >
                <a-input v-model="stockSkuDesc.declareCnName" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item
                :label="$t('storageSku.declaredValue')"
                prop="declarePrice"
              >
                <a-input suffix="USD" v-model="stockSkuDesc.declarePrice" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item
                :label="$t('storageSku.productWeight')"
                prop="declareWeight"
              >
                <a-input v-model="stockSkuDesc.declareWeight" suffix="g" />
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item
                :label-col="{ span: 3 }"
                :wrapper-col="{ span: 18 }"
                :label="$t('storageSku.declareCode')"
                prop="declareCode"
              >
                <a-input readOnly v-model="stockSkuDesc.declareCode" />
              </a-form-model-item>
            </a-col>
          </a-row>
        </template>
        <!-- 申报信息 end -->

        <!-- 供应商信息 start -->
        <!-- <template>
          <a-button
            type="link"
            class="me-fr"
            @click="bindSupplierVisible = true"
          >
            {{ $t('storageSku.addAssociatedSupplier') }}
          </a-button>
          <a-button
            @click="supplierManagerVisible = true"
            type="link"
            class="me-fr"
          >
            {{ $t('storageSku.supplierManager') }}
          </a-button>
          <h1 class="me-sub-title">
            {{ $t('storageSku.supplierInfo') }}
          </h1>
          <a-table
            rowKey="supplierId"
            :columns="supplierInfoColumns"
            :data-source="stockSkuDesc.supplierInfo"
            :pagination="false"
            size="small"
            bordered
          >
            <span slot="url" slot-scope="text, record">
              <a-form-model
                :ref="`form-supplier-${record.supplierId}`"
                :model="record"
                :rules="rules"
                class="me-mt-4"
              >
                <a-form-model-item prop="url">
                  <a-input v-model="record.url" />
                </a-form-model-item>
              </a-form-model>
            </span>
            <span slot="isDefault" slot-scope="text, record, index">
              <a-radio
                @change="onBindSupplierDefaultChange(index)"
                :checked="text"
              />
            </span>
            <span slot="option" slot-scope="text, record, index">
              <a-button
                type="link"
                class="me-error"
                @click="onDeleteSuppllerBind(record, index)"
              >
                {{ $t('common.delete') }}
              </a-button>
            </span>
          </a-table>
        </template> -->
        <!-- 供应商信息 end -->
      </a-form-model>
    </a-spin>

    <a-modal :visible="previewVisible" :footer="null" @cancel="onPreviewCancel">
      <img style="width: 100%" v-lazy="previewImage" />
    </a-modal>

    <a-modal
      :maskClosable="false"
      :title="$t('storageSku.addStorage')"
      :visible="onPushStockVisible"
      destroyOnClose
      @ok="onPushStockOk"
      @cancel="onPushStockVisible = false"
      width="900px"
    >
      <BindAddStorage ref="BindAddStorage" :current="currentStorage" />
    </a-modal>

    <a-modal
      :maskClosable="false"
      :title="$t('storageSku.brandManager')"
      :visible="brandManagerVisible"
      :footer="null"
      destroyOnClose
      @cancel="brandManagerVisible = false"
      width="1200px"
    >
      <ProductBrand @change="onBrandManagerChange" />
    </a-modal>

    <a-modal
      :maskClosable="false"
      :title="$t('storageSku.catalogManagement')"
      :visible="productCatalogManagerVisible"
      destroyOnClose
      :footer="null"
      @cancel="productCatalogManagerVisible = false"
      width="1200px"
    >
      <ProductCatalog @change="onProductCatalogManagerChange" />
    </a-modal>

    <a-modal
      :maskClosable="false"
      :title="$t('storageSku.packageManager')"
      :visible="packageManagerVisible"
      destroyOnClose
      :footer="null"
      @cancel="packageManagerVisible = false"
      width="1200px"
    >
      <ProductMaterial @change="onPackageManagerChange" />
    </a-modal>

    <a-modal
      :maskClosable="false"
      :title="$t('storageSku.storageManager')"
      :visible="storageManagerVisible"
      destroyOnClose
      :footer="null"
      @cancel="storageManagerVisible = false"
      width="1200px"
    >
      <StorageList />
    </a-modal>

    <a-modal
      :maskClosable="false"
      :title="$t('storageSku.supplierManager')"
      :visible="supplierManagerVisible"
      destroyOnClose
      :footer="null"
      @cancel="supplierManagerVisible = false"
      width="1200px"
    >
      <Supplier @delete="onSupplierDelete" />
    </a-modal>

    <a-modal
      :maskClosable="false"
      :title="$t('storageSku.addAssociatedSupplier')"
      :visible="bindSupplierVisible"
      destroyOnClose
      @cancel="bindSupplierVisible = false"
      width="1200px"
      :footer="null"
    >
      <AddBindSupplier :suppliers="suppliers" @push="onBindSupplierPush" />
    </a-modal>
  </div>
</template>

<script>
import Product from '@/api/product'
import BindAddStorage from '@/views/storage/components/BindAddStorage'
import { loadUploadImage, unloadUploadImage } from '@/util/handle'
import ProductBrand from '@/views/storage/ProductBrand'
import ProductCatalog from '@/views/storage/ProductCatalog'
import StorageList from '@/views/storage/StorageList'
import ProductMaterial from '@/views/storage/ProductMaterial'
import Supplier from '@/views/purchase/Supplier'
import AddBindSupplier from '@/views/storage/components/AddBindSupplier'
import { compact } from 'lodash'

import { POSITIVE_NUMBER, PRICE, CN_CHAR, EN_CHAR } from '@/util/regex'

const declareSensitiveWordsOptions = [
  '带电池',
  '侵权',
  '带磁',
  '非液体(化妆品)',
  '液体(化妆品)',
  '液体(非化妆品)',
  '粉末'
]

export default {
  components: {
    BindAddStorage,
    ProductBrand,
    ProductCatalog,
    StorageList,
    ProductMaterial,
    Supplier,
    AddBindSupplier
  },
  props: {
    stockSku: Object
  },
  data() {
    const statusOptions = [
      { label: '正常销售', value: 1 },
      { label: '停止销售', value: 2 }
    ]

    const positiveNumberValid = {
      pattern: POSITIVE_NUMBER,
      message: this.$t('storageSku.positiveNumberValid')
    }
    const priceValid = {
      pattern: PRICE,
      message: this.$t('storageSku.priceValid')
    }

    return {
      statusOptions,
      declareSensitiveWordsOptions,
      loading: false,
      form: this.$form.createForm(this),
      stockSkuDesc: {
        images: [],
        detailImgUrl: []
      },
      brandList: [],
      catalogList: [],
      packageList: [],
      supplierInfoColumns: [
        { title: this.$t('storageSku.supplier'), dataIndex: 'supplierName' },
        {
          title: this.$t('storageSku.url'),
          dataIndex: 'url',
          scopedSlots: { customRender: 'url' }
        },
        { title: this.$t('storageSku.lastPrice'), dataIndex: 'lastPrice' },
        { title: this.$t('storageSku.lowPrice'), dataIndex: 'lowPrice' },
        { title: this.$t('storageSku.purchaseMin'), dataIndex: 'purchaseMin' },
        {
          title: this.$t('storageSku.isDefault'),
          dataIndex: 'isDefault',
          scopedSlots: { customRender: 'isDefault' }
        },
        {
          title: this.$t('storageSku.option'),
          dataIndex: 'option',
          scopedSlots: { customRender: 'option' }
        }
      ],
      rules: {
        variationSku: [
          {
            required: true,
            message: this.$t('storageSku.skuValid'),
            trigger: 'change'
          },
          { pattern: /^.{1,60}$/, message: '不能超过60位字符' }
        ],

        itemSku: [
          {
            required: true,
            message: this.$t('storageSku.masterSkuValid'),
            trigger: 'change'
          },
          { pattern: /^.{1,60}$/, message: '不能超过60位字符' }
        ],
        status: [
          {
            required: true,
            message: this.$t('storageSku.statusValid'),
            trigger: 'change'
          }
        ],
        name: [
          {
            required: true,
            message: this.$t('storageSku.nameValid'),
            trigger: 'change'
          },
          { pattern: /^.{1,60}$/, message: '不能超过60位字符' }
        ],
        url: [],
        description: [
          {
            validator: (rule, value, callback) => {
              if (value && value.length > 25000)
                return callback('不能超过25000位字符')
              callback()
            }
          }
        ],
        declareEnName: [
          { pattern: EN_CHAR, message: this.$t('storageSku.enCharValid') }
        ],
        declareCnName: [
          { pattern: CN_CHAR, message: this.$t('storageSku.cnCharValid') }
        ],
        declareCode: [positiveNumberValid],
        packageLength: [{ pattern: PRICE, message: '请输入正确的尺寸' }],
        packageWidth: [{ pattern: PRICE, message: '请输入正确的尺寸' }],
        packageHeight: [{ pattern: PRICE, message: '请输入正确的尺寸' }],
        materialNum: [positiveNumberValid],
        purchaseDays: [positiveNumberValid],
        stockAlertDays: [positiveNumberValid],
        stockAlter: [positiveNumberValid],
        purchaseMin: [positiveNumberValid],
        purchaseMax: [positiveNumberValid],
        cost: [priceValid],
        price: [priceValid],
        declarePrice: [priceValid],
        weight: [
          { required: true, trigger: 'change', message: '重量不能为空' },
          { pattern: PRICE, message: this.$t('storageSku.widthValid') }
        ],
        declareWeight: [
          { pattern: PRICE, message: this.$t('storageSku.widthValid') }
        ],
        purchasePrice: [
          { required: true, trigger: 'change', message: '默认采购价不能为空' },
          priceValid
        ]
      },
      onPushStockVisible: false,
      brandManagerVisible: false,
      productCatalogManagerVisible: false,
      packageManagerVisible: false,
      storageManagerVisible: false,
      supplierManagerVisible: false,
      bindSupplierVisible: false,

      previewVisible: false,
      previewImage: null,

      localSkuAlias: '',

      storageColumns: [
        {
          title: '仓库',
          dataIndex: 'storageName',
          key: 'storageName'
        },
        {
          title: '仓库SKU',
          dataIndex: 'variationsSku',
          key: 'variationsSku'
        },
        {
          title: '库存数量',
          dataIndex: 'stock',
          key: 'stock'
        }
      ],
      platformSkuInfosColumns: [
        {
          title: '关联店铺SKU',
          dataIndex: 'sku',
          key: 'sku'
        },
        {
          title: '主SKU',
          dataIndex: 'masterSku',
          key: 'masterSku'
        },
        {
          title: '站点',
          dataIndex: 'site',
          key: 'site'
        },
        {
          title: '店铺',
          dataIndex: 'storeName',
          key: 'storeName'
        },
        {
          title: '售价',
          dataIndex: 'price',
          key: 'price'
        },
        {
          title: '预计利润',
          dataIndex: 'profit',
          key: 'profit'
        }
      ]
    }
  },
  computed: {
    currentStorage() {
      const { productStorage } = this.$data.stockSkuDesc
      if (!productStorage) return []
      return productStorage.map(({ storageId }) => storageId)
    },
    suppliers() {
      const { supplierInfo } = this.$data.stockSkuDesc
      if (!supplierInfo) return []
      return supplierInfo.map(({ supplierId }) => supplierId)
    },
    bulk() {
      const {
        packageLength,
        packageWidth,
        packageHeight
      } = this.$data.stockSkuDesc
      const bulk = packageLength * packageWidth * packageHeight
      return Number(bulk || 0).toFixed(2)
    },
    token() {
      return `Bearer ${this.$store.getters.getAccessToken}`
    }
  },
  async mounted() {
    this.loadBrand()
    this.loadMaterial()
    if (this.$props.stockSku) {
      await this.initData()
    }
    this.loadCatalogTree()
  },
  methods: {
    /**
     * 品牌
     */
    loadBrand() {
      Product.listProductBrand().then(({ data }) => {
        this.$data.brandList = data
      })
    },
    /**
     * 目录树
     */
    loadCatalogTree() {
      const { catalogIds } = this.$data.stockSkuDesc

      let _catalogIds = [null, ...(catalogIds || [null])]

      const find = (id) => {
        const { catalogList } = this.$data
        if (!id) return null
        return catalogList.find(({ catalogId }) => catalogId == id)
      }

      _catalogIds.reduce(async (prev, curr) => {
        prev = await prev
        let { data } = await Product.getProductCatalog({
          current: 1,
          size: 10000,
          parentId: prev
        })
        data.records = data.records.map((ele) => {
          ele._name = `${ele.enName}(${ele.cnName})`
          ele.isLeaf = !ele.hasList
          return ele
        })

        if (!prev) {
          this.$data.catalogList = data.records
        } else {
          const old = find(prev)
          this.$set(old, 'children', data.records)
        }
        return curr
      })
    },
    /**
     * 包材
     */
    loadMaterial() {
      Product.listProductMaterialList().then(({ data }) => {
        this.$data.packageList = data
      })
    },
    /**
     * 获取初始化数据
     */
    async initData() {
      const { variationsId } = this.$props.stockSku
      this.$data.loading = true
      const skuDesc = await Product.getProductStockSkuItem({ variationsId })
      if (!skuDesc.data.supplierInfo) skuDesc.data.supplierInfo = []
      skuDesc.data.images = loadUploadImage(skuDesc.data.images)
      skuDesc.data.detailImgUrl = loadUploadImage(skuDesc.data.detailImgUrl)
      if (skuDesc.data.declareSensitiveWords) {
        skuDesc.data.declareSensitiveWords = JSON.parse(
          skuDesc.data.declareSensitiveWords
        )
      } else {
        skuDesc.data.declareSensitiveWords = []
      }
      skuDesc.data.catalogIds = [
        skuDesc.data.catalogPid,
        skuDesc.data.catalogId
      ]
      if (skuDesc.data.skuAlias) {
        skuDesc.data.skuAlias = JSON.parse(skuDesc.data.skuAlias)
      }
      this.$data.stockSkuDesc = skuDesc.data
      this.$data.loading = false

      return skuDesc
    },
    async loadData(selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true

      Product.getProductCatalog({
        current: 1,
        size: 10000,
        parentId: targetOption.catalogId
      }).then(({ data }) => {
        data.records = data.records.map((ele) => {
          ele._name = `${ele.enName}(${ele.cnName})`
          ele.isLeaf = !ele.hasList
          return ele
        })
        targetOption.loading = false
        this.$set(targetOption, 'children', data.records)
        this.$data.catalogList = [...this.$data.catalogList]
      })
    },
    /**
     * 提交
     */
    async submit() {
      const getValid = () =>
        Object.keys(this.$refs)
          .filter((key) => {
            if (!/^form-/.test(key)) return false
            const refs = this.$refs[key]
            if (!refs) return false
            return true
          })
          .map((key) => {
            const refs = this.$refs[key]
            if (Array.isArray(refs)) return refs[0]
            return refs
          })
          .map((components) => {
            return components.validate()
          })

      try {
        await Promise.all(getValid())
      } catch (error) {
        this.$message.error('请检查错误项，修改后再试')
        return Promise.reject()
      }

      const { stockSkuDesc } = this.$data
      let catalogPid = null
      let catalogId = null
      let images = null
      let detailImgUrl = null
      let declareSensitiveWords = null
      let skuAlias = null
      if (stockSkuDesc.catalogIds) {
        const [_catalogPid, _catalogId] = stockSkuDesc.catalogIds
        catalogPid = _catalogPid || null
        catalogId = _catalogId || null
      }
      if (stockSkuDesc.images) {
        images = unloadUploadImage(stockSkuDesc.images)
      }
      if (stockSkuDesc.detailImgUrl) {
        detailImgUrl = unloadUploadImage(stockSkuDesc.detailImgUrl)
      }
      if (
        stockSkuDesc.declareSensitiveWords &&
        Array.isArray(stockSkuDesc.declareSensitiveWords)
      ) {
        declareSensitiveWords = JSON.stringify(
          stockSkuDesc.declareSensitiveWords
        )
      }
      if (stockSkuDesc.skuAlias) {
        skuAlias = JSON.stringify(stockSkuDesc.skuAlias)
      }
      const params = {
        ...stockSkuDesc,
        images,
        detailImgUrl,
        declareSensitiveWords,
        catalogPid,
        catalogId,
        skuAlias
      }

      let res
      if (this.$props.stockSku) {
        res = await Product.editProductStocksku(params)
      } else {
        res = await Product.addProductVariations(params)
      }
      return Promise.resolve(res)
    },
    /**
     * 添加仓库
     */
    async onPushStockOk() {
      const { productStorage, variationsId } = this.$data.stockSkuDesc
      let storages = await this.$refs.BindAddStorage.submit()
      const find = (id) => {
        if (productStorage) {
          const old = productStorage.find(({ storageId }) => storageId === id)
          if (old) return old
        }
        return {
          isAlterAuto: null,
          purchaseDays: null,
          purchaseMax: null,
          purchaseMin: null,
          stock: null,
          stockAlertDays: null,
          stockAlter: null,
          storageId: null,
          storageName: null,
          variationsId
        }
      }

      storages = storages.map((element) => {
        const { label, value } = element
        const old = find(value)
        return {
          ...old,
          storageName: label,
          storageId: value
        }
      })
      this.$set(this.$data.stockSkuDesc, 'productStorage', storages)
      this.$data.onPushStockVisible = false
    },
    /**
     * 品牌管理
     */
    onBrandManagerChange() {
      this.loadBrand()
      this.$data.stockSkuDesc.brandId = null
    },
    /**
     * 商品目录管理
     */
    onProductCatalogManagerChange() {
      this.$data.stockSkuDesc.catalogIds = [null, null]
      this.loadCatalogTree()
    },
    /**
     * 包材管理
     */
    onPackageManagerChange() {
      this.$data.stockSkuDesc.materialId = null
      this.loadMaterial()
    },
    /**
     * 供应商添加
     */
    onBindSupplierPush({ supplierId, supplierName }) {
      const { stockSkuDesc } = this.$data
      const obj = {
        supplierName,
        isDefault: false,
        lowPrice: '',
        supplierId,
        url: '',
        variationsId: stockSkuDesc.variationsId
      }
      const supplierInfo = [...(stockSkuDesc.supplierInfo || []), obj]
      this.$set(stockSkuDesc, 'supplierInfo', supplierInfo)
      this.checkSupplierInfoDefault()
    },
    /**
     * 供应商管理供应商删除事件
     */
    onSupplierDelete(supplierId) {
      let supplierInfo = this.$data.stockSkuDesc.supplierInfo
      supplierInfo = supplierInfo.map((supplier) => {
        if (supplier.supplierId === supplierId) return false
        return supplier
      })
      supplierInfo = compact(supplierInfo)
      this.$data.stockSkuDesc.supplierInfo = supplierInfo
      this.onBindSupplierDefaultChange(0)
    },
    /**
     * 删除绑定
     */
    onDeleteSuppllerBind({ isDefault }, index) {
      if (isDefault) {
        this.$message.warning(this.$t('storageSku.defaultSupplierValidWarning'))
        return
      }
      const { supplierInfo } = this.$data.stockSkuDesc
      this.$delete(supplierInfo, index)
      this.checkSupplierInfoDefault()
    },
    /**
     * 设置默认供应商
     */
    checkSupplierInfoDefault() {
      const { supplierInfo } = this.$data.stockSkuDesc
      if (!supplierInfo || !supplierInfo.length) return
      const checkDefault = supplierInfo.filter(({ isDefault }) => isDefault)
      if (!checkDefault.length) {
        this.$set(supplierInfo[0], 'isDefault', true)
      }
    },
    /**
     * 默认供应商选择事件
     */
    onBindSupplierDefaultChange(_index) {
      const { supplierInfo } = this.$data.stockSkuDesc
      supplierInfo.forEach((element, index) => {
        if (index === _index) {
          this.$set(element, 'isDefault', true)
        } else {
          this.$set(element, 'isDefault', false)
        }
      })
    },
    /**
     * 图片预览
     */
    onPreview({ thumbUrl }) {
      this.$data.previewVisible = true
      this.$data.previewImage = thumbUrl
    },
    onPreviewCancel() {
      this.$data.previewVisible = false
      this.$data.previewImage = null
    },
    /**
     * 图片改变
     */
    onChange({ fileList }, field, max) {
      if (max) fileList = fileList.slice(0, max)
      fileList = fileList.map((element) => {
        if (
          element.response &&
          element.response.data &&
          element.response.data.length
        ) {
          const [url] = element.response.data
          element.thumbUrl = url
        }
        return element
      })
      this.$set(this.$data.stockSkuDesc, field, fileList)
    },
    /**
     * 商品目录选择事件改变报关编码
     */
    onCatalogChange(value, selectedOptions) {
      let code = ''
      if (selectedOptions && selectedOptions.length) {
        code = selectedOptions[selectedOptions.length - 1].code
      }
      this.$set(this.$data.stockSkuDesc, 'declareCode', code)
    },
    /**
     * 添加别名
     */
    onPushAlias() {
      const { localSkuAlias } = this.$data
      if (!this.$data.stockSkuDesc.skuAlias) {
        this.$data.stockSkuDesc.skuAlias = []
      }
      if (this.$data.stockSkuDesc.skuAlias.includes(localSkuAlias)) {
        return this.$message.error('sku别名已经存在')
      }
      if (localSkuAlias) {
        const _arr = compact(localSkuAlias.split(/,|，/))
        this.$data.stockSkuDesc.skuAlias = [
          ...this.$data.stockSkuDesc.skuAlias,
          ..._arr
        ]
        this.$data.localSkuAlias = ''
      }
    },
    /**
     * tags关闭
     */
    onCloseAlias(event, index) {
      event.preventDefault()
      const { skuAlias } = this.$data.stockSkuDesc
      this.$delete(skuAlias, index)
    }
  }
}
</script>

<style lang="scss" scoped></style>
