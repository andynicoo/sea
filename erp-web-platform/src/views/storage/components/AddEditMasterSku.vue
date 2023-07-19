<template>
  <div>
    <a-spin :spinning="spinning">
      <!-- 基本信息 start -->
      <template>
        <h2 class="me-sub-title">{{ $t('masterSku.baseInfo') }}</h2>
        <a-form
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :form="baseInfoForm"
        >
          <a-form-item :label="$t('masterSku.masterSku')">
            <a-input
              :disabled="!!masterSku"
              v-decorator="[
                'itemSku',
                {
                  rules: [
                    rules.required,
                    { pattern: /^.{1,60}$/, message: '不能超过60位字符' }
                  ]
                }
              ]"
            />
          </a-form-item>
          <a-form-item label="商品名称">
            <a-input
              v-decorator="[
                'itemName',
                {
                  rules: [
                    rules.required,
                    { pattern: /^.{1,60}$/, message: '不能超过60位字符' }
                  ]
                }
              ]"
            />
          </a-form-item>
          <a-form-item :label="$t('masterSku.productCategory')">
            <a-row>
              <a-col :span="16">
                <a-form-item>
                  <a-cascader
                    v-decorator="['catalogIds']"
                    :options="catalogListOptions"
                    :load-data="loadData"
                    :fieldNames="{
                      label: '_name',
                      value: 'catalogId',
                      children: 'children'
                    }"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="4" v-if="masterSku">
                <a-form-item class="me-text-center">
                  <a-button
                    :loading="catalogApplayLoading"
                    @click="onApply(1)"
                    type="link"
                  >
                    <p
                      class="ellipsis nowrap"
                      style="width: 105px"
                      :title="$t('masterSku.applyToInventorySKU')"
                    >
                      {{ $t('masterSku.applyToInventorySKU') }}
                    </p>
                  </a-button>
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item class="me-text-center">
                  <a-button @click="catalogMmanageVisible = true" type="link">
                    <p
                      class="ellipsis nowrap"
                      style="width: 170px"
                      :title="$t('masterSku.catalogMmanage')"
                    >
                      {{ $t('masterSku.catalogMmanage') }}
                    </p>
                  </a-button>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form-item>

          <a-form-item :label="$t('masterSku.masterSkuPicture')">
            <a-upload
              action="/api/basic/config/platform/uploadImage"
              list-type="picture-card"
              :file-list="fileList"
              multiple
              @preview="onPreview"
              @change="onChange"
            >
              <div v-if="fileList.length < 9">
                <a-icon type="plus" />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
          </a-form-item>

          <a-form-item :label="$t('masterSku.remark')">
            <a-textarea
              rows="6"
              v-decorator="[
                'remark',
                {
                  rules: [
                    { pattern: /^.{1,500}$/, message: '不能超过500位字符' }
                  ]
                }
              ]"
            />
          </a-form-item>
        </a-form>
      </template>
      <!-- 基本信息 end -->

      <!-- 本地SKU start -->
      <template v-if="masterSku">
        <div>
          <a-button @click="onAppendLocalSku" class="me-fr" type="link">
            添加本地SKU
          </a-button>
          <h2 class="me-sub-title">本地SKU</h2>
        </div>
        <a-table
          :columns="columns"
          :data-source="productVariations"
          :pagination="false"
          class="me-mb-4"
        >
          <span slot="images" slot-scope="text, record">
            <img
              v-lazy="record.images && record.images[0]"
              style="width: 40px; height: 40px"
            />
          </span>
          <span slot="status" slot-scope="text">
            {{ text ? '正常销售' : '停止销售' }}
          </span>
          <span slot="actions" slot-scope="text, record, index">
            <a-button type="link" @click="onDeleteLocalSku(index)">
              删除
            </a-button>
          </span>
        </a-table>
      </template>
      <!-- 本地SKU end -->

      <!-- 辅助信息 start -->
      <template>
        <div>
          <a-button
            v-if="masterSku"
            :loading="assistInfoApplayLoading"
            @click="onApply(2)"
            class="me-fr"
            type="link"
          >
            {{ $t('masterSku.applyToInventorySKU') }}
          </a-button>
          <h2 class="me-sub-title">{{ $t('masterSku.assistInfo') }}</h2>
        </div>

        <a-form
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :form="assistInfoForm"
        >
          <a-form-item :label="$t('masterSku.size')">
            <a-row>
              <a-col :span="4">
                <a-form-item class="me-mr-2 em-custorm-input">
                  <a-input
                    :prefix="$t('masterSku.length')"
                    suffix="CM"
                    v-decorator="['packageLength', { rules: [rules.size] }]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item class="me-mr-2 em-custorm-input">
                  <a-input
                    :prefix="$t('masterSku.width')"
                    suffix="CM"
                    v-decorator="['packageWidth', { rules: [rules.size] }]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item class="me-mr-2 em-custorm-input">
                  <a-input
                    :prefix="$t('masterSku.height')"
                    suffix="CM"
                    v-decorator="['packageHeight', { rules: [rules.size] }]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item>
                  {{ $t('masterSku.bulk') }}: {{ getBulk() }}cm³
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="重量"
                  :labelCol="{ span: 6 }"
                  :wrapperCol="{ span: 18 }"
                >
                  <a-input
                    suffix="KG"
                    v-decorator="[
                      'weight',
                      { rules: [rules.required, rules.size] }
                    ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form-item>

          <a-form-item :label="$t('masterSku.packaging')">
            <a-form-item class="me-ib" style="width: 30%">
              <a-select v-decorator="['materialId']" allowClear>
                <a-select-option
                  v-for="item in packageListOptions"
                  :value="item.materialId"
                  :key="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item class="me-ib me-text-center" style="width: 15%">
              <a-button type="link" @click="packageMmanageVisible = true">
                <p
                  class="ellipsis nowrap"
                  style="width: 80px"
                  :title="$t('masterSku.packagingMmanage')"
                >
                  {{ $t('masterSku.packagingMmanage') }}
                </p>
              </a-button>
            </a-form-item>
            <a-form-item
              :label-col="{ span: 5 }"
              :wrapper-col="{ span: 19 }"
              class="me-ib"
              style="width: 55%"
              :label="$t('masterSku.packagingCount')"
            >
              <a-input
                v-decorator="[
                  'materialNum',
                  {
                    rules: [
                      {
                        pattern: /^\+?[1-9][0-9]*$/,
                        message: '请输入大于0的正整数'
                      }
                    ]
                  }
                ]"
                class="me-ib me-ml-2"
              />
            </a-form-item>

            <a-form-item>
              <a-checkbox-group
                v-decorator="['sensitiveWords']"
                :options="sensitiveWordOptions"
              />
            </a-form-item>
          </a-form-item>
        </a-form>
      </template>
      <!-- 辅助信息 end -->
    </a-spin>

    <a-modal
      :maskClosable="false"
      :visible="previewVisible"
      destroyOnClose
      :footer="null"
      @cancel="onPreviewCancel"
    >
      <img style="width: 100%" v-lazy="previewImage" />
    </a-modal>

    <a-modal
      :title="$t('masterSku.catalogMmanage')"
      :maskClosable="false"
      :visible="catalogMmanageVisible"
      width="1200px"
      destroyOnClose
      :footer="null"
      @cancel="catalogMmanageVisible = false"
    >
      <ProductCatalog @change="onCatalogChange" />
    </a-modal>

    <a-modal
      :title="$t('masterSku.packagingManager')"
      :maskClosable="false"
      :visible="packageMmanageVisible"
      width="1200px"
      destroyOnClose
      :footer="null"
      @cancel="packageMmanageVisible = false"
    >
      <ProductMaterial @change="onMaterialChange" />
    </a-modal>

    <a-modal
      title="添加本地SKU"
      :maskClosable="false"
      :visible="appendSkuVisible"
      destroyOnClose
      :footer="null"
      @cancel="appendSkuVisible = false"
      width="1000px"
    >
      <ChooseLocalSku v-model="productVariations" />
    </a-modal>
  </div>
</template>

<script>
import Product from '@/api/product'
import { v4 as uuidv4 } from 'uuid'
import { PRICE } from '@/util/regex'

import ProductCatalog from '../ProductCatalog'
import ProductMaterial from '../ProductMaterial'
import ChooseLocalSku from './ChooseLocalSku'

const getFileSuffix = (fileName) => {
  return fileName.substring(fileName.lastIndexOf('.') + 1)
}

const renderImageObj = (url) => {
  return {
    uid: uuidv4(),
    name: `${uuidv4()}.${getFileSuffix(url)}`,
    thumbUrl: url,
    status: 'done',
    percent: 100
  }
}

export default {
  components: {
    ProductCatalog,
    ProductMaterial,
    ChooseLocalSku
  },
  props: {
    masterSku: Object
  },
  data() {
    return {
      baseInfoForm: this.$form.createForm(this, { name: 'baseInfoForm' }),
      assistInfoForm: this.$form.createForm(this, { name: 'assistInfoForm' }),
      fileList: [],
      previewVisible: false,
      previewImage: null,

      catalogMmanageVisible: false,
      packageMmanageVisible: false,

      labelCol: { span: 3 },
      wrapperCol: { span: 19 },

      bulk: 0,

      spinning: false,

      rules: {
        required: { required: true, message: this.$t('masterSku.required') },
        numbers: { pattern: PRICE, message: this.$t('masterSku.numberValid') },
        weight: { pattern: PRICE, message: '请输入正确的重量' },
        size: {
          pattern: PRICE,
          message: '请输入大于0，且小数位小于等于2位的数字'
        }
      },

      sensitiveWordOptions: [
        '带电池',
        '侵权',
        '带磁',
        '非液体(化妆品)',
        '液体(化妆品)',
        '液体(非化妆品)',
        '粉末'
      ],
      catalogListOptions: [],
      packageListOptions: [],

      itemId: null,

      catalogApplayLoading: false,
      assistInfoApplayLoading: false,

      appendSkuVisible: false,

      productVariations: [], // 已选择的本地SKU
      columns: [
        {
          title: '主图',
          dataIndex: 'images',
          key: 'images',
          scopedSlots: { customRender: 'images' }
        },
        {
          title: '本地SKU',
          dataIndex: 'variationSku',
          key: 'variationSku'
        },
        {
          title: '商品名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' }
        }
        // {
        //   title: '操作',
        //   dataIndex: 'actions',
        //   key: 'actions',
        //   scopedSlots: { customRender: 'actions' }
        // }
      ]
    }
  },

  async mounted() {
    this.$data.spinning = true
    if (this.$props.masterSku) {
      await this.initData()
    }
    this.loadPackage()
    this.loadCatalogTree()
    this.$data.spinning = false
  },
  methods: {
    /**
     * 包材列表
     */
    async loadPackage() {
      const materialData = await Product.listProductMaterialList()
      this.$data.packageListOptions = materialData.data
    },
    /**
     * 目录树
     */
    loadCatalogTree() {
      const { baseInfoForm } = this.$data
      const catalogIds = baseInfoForm.getFieldValue('catalogIds')
      let _catalogIds = [null, ...(catalogIds || [null])]

      const find = (id) => {
        const { catalogListOptions } = this.$data
        if (!id) return null
        return catalogListOptions.find(({ catalogId }) => catalogId == id)
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
          this.$data.catalogListOptions = data.records
        } else {
          const old = find(prev)
          this.$set(old, 'children', data.records)
        }
        return curr
      })
    },
    async initData() {
      /**
       * 编辑时初始化数据
       */
      const { itemId } = this.$props.masterSku

      const { baseInfoForm, assistInfoForm } = this.$data

      const { data } = await Product.getMasterSkuProductItem({ itemId })
      if (data.variations) {
        data.variations = data.variations.map((ele) => {
          if (ele.detailImgUrl) {
            try {
              ele.detailImgUrl = JSON.parse(ele.detailImgUrl)
            } catch (error) {
              console.error(error)
            }
          } else {
            ele.detailImgUrl = []
          }
          if (ele.images) {
            try {
              ele.images = JSON.parse(ele.images)
            } catch (error) {
              console.error(error)
            }
          } else {
            ele.images = []
          }
          return ele
        })
        this.$data.productVariations = data.variations
      }
      this.$data.itemId = data.itemId
      let {
        itemSku,
        itemName,
        catalogPid,
        catalogId,
        remark,
        packageLength,
        packageWidth,
        packageHeight,
        materialId,
        materialNum,
        sensitiveWords,
        weight
      } = data
      if (sensitiveWords) {
        sensitiveWords = JSON.parse(sensitiveWords)
      }
      if (data.images) {
        let images = JSON.parse(data.images)
        images = images.map((url) => renderImageObj(url))
        this.$data.fileList = images
      }

      baseInfoForm.setFieldsValue({
        itemSku,
        itemName,
        catalogIds: [catalogPid, catalogId],
        remark
      })

      assistInfoForm.setFieldsValue({
        packageLength,
        packageWidth,
        packageHeight,
        materialId,
        materialNum,
        sensitiveWords,
        weight
      })
      return data
    },
    /**
     * 应用到本地SKU
     */
    async onApply(type) {
      const {
        baseInfoForm,
        assistInfoForm,
        itemId,
        catalogListOptions
      } = this.$data
      const ids = baseInfoForm.getFieldValue('catalogIds')

      const params = { itemId }

      let catalogPid
      let catalogId
      let code
      if (ids && Array.isArray(ids)) {
        catalogPid = ids[0]
        catalogId = ids[1]

        const findP = catalogListOptions.find(
          ({ catalogId }) => catalogPid == catalogId
        )
        if (findP && findP.children && Array.isArray(findP.children)) {
          const findC = findP.children.find(
            ({ catalogId }) => catalogId == catalogId
          )
          if (findC) {
            code = findC.code
          }
        }
      }
      if (type === 1) {
        if (!catalogPid && !catalogId) {
          return this.$message.error(this.$t('masterSku.validCatalog'))
        }
        this.$data.catalogApplayLoading = true
        params.catalogPid = catalogPid
        params.catalogId = catalogId
        params.code = code
      }

      if (type === 2) {
        this.$data.assistInfoApplayLoading = true

        params.materialId = assistInfoForm.getFieldValue('materialId')
        params.materialNum = assistInfoForm.getFieldValue('materialNum')
        params.packageHeight = assistInfoForm.getFieldValue('packageHeight')
        params.packageLength = assistInfoForm.getFieldValue('packageLength')
        params.packageWidth = assistInfoForm.getFieldValue('packageWidth')
        let sensitiveWords = assistInfoForm.getFieldValue('sensitiveWords')
        if (sensitiveWords && Array.isArray(sensitiveWords))
          params.sensitiveWords = JSON.stringify(sensitiveWords)
      }

      let res = {}
      if (type === 1) {
        // 商品类别
        try {
          res = await Product.applicationStockSkuByCatalog(params)
        } catch (error) {
          console.error(error)
          this.$message.error(this.$t('common.handlerFail'))
        }
      } else {
        // 辅助信息
        try {
          res = await Product.applicationStockSkuAssist(params)
        } catch (error) {
          console.error(error)
          this.$message.error(this.$t('common.handlerFail'))
        }
      }
      const { data } = res
      if (type === 1) this.$data.catalogApplayLoading = false
      if (type === 2) this.$data.assistInfoApplayLoading = false
      if (data) {
        this.$message.success(this.$t('masterSku.applaySuccess'))
      } else {
        this.$message.error(this.$t('masterSku.applayFail'))
      }
    },
    /**
     * 获取体积
     */
    getBulk() {
      const { assistInfoForm } = this.$data
      const length = assistInfoForm.getFieldValue('packageLength')
      const width = assistInfoForm.getFieldValue('packageWidth')
      const height = assistInfoForm.getFieldValue('packageHeight')
      if (!length || !width || !height) {
        return 0
      }
      return Number(length * width * height).toFixed(2)
    },
    /**
     * 预览
     */
    onPreview(file) {
      this.previewImage = file.thumbUrl
      this.previewVisible = true
    },
    /**
     * 改变事件
     */
    onChange({ fileList }) {
      fileList = fileList.slice(0, 9)
      fileList = fileList.map((element) => {
        if (element.response && element.response.data.length) {
          const [url] = element.response.data
          element.thumbUrl = url
        }
        return element
      })
      this.$data.fileList = fileList
    },
    /**
     * 取消预览
     */
    onPreviewCancel() {
      this.previewImage = null
      this.previewVisible = false
    },
    /**
     * 动态加载子级
     */
    loadData(selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      this.$set(targetOption, 'loading', true)
      const { catalogId } = targetOption
      Product.getProductCatalog({
        current: 1,
        size: 10000,
        parentId: catalogId
      }).then(({ data }) => {
        data.records = data.records.map((element) => {
          element._name = `${element.enName}(${element.cnName})`
          element.isLeaf = !element.hasList
          return element
        })
        this.$set(targetOption, 'loading', false)
        this.$set(targetOption, 'children', data.records)
        this.$data.catalogListOptions = [...this.$data.catalogListOptions]
      })
    },
    /**
     * 表单校验提交
     */
    async submit() {
      const { productVariations } = this.$data
      const data = await this.validFields()
      data.productVariationsIds = productVariations.map(({ variationsId }) => {
        return variationsId
      })
      let res
      if (this.$props.masterSku) {
        res = await Product.editMasterSkuProduct(data)
      } else {
        res = await Product.addMasterSkuProduct(data)
      }
      return Promise.resolve(res)
    },
    async validFields() {
      const { baseInfoForm, assistInfoForm, fileList, itemId } = this.$data
      let baseValid = await baseInfoForm.validateFields()
      let assistValid = await assistInfoForm.validateFields()
      let images = fileList.map(({ thumbUrl }) => thumbUrl)
      let catalogPid
      let catalogId
      images = JSON.stringify(images)
      if (assistValid.sensitiveWords) {
        assistValid.sensitiveWords = JSON.stringify(assistValid.sensitiveWords)
      }
      if (baseValid.catalogIds && Array.isArray(baseValid.catalogIds)) {
        const [_catalogPid, _catalogId] = baseValid.catalogIds
        catalogPid = _catalogPid || null
        catalogId = _catalogId || null
      }
      return {
        ...baseValid,
        ...assistValid,
        itemId,
        images,
        catalogPid,
        catalogId
      }
    },
    /**
     * 商品目录管理
     */
    onCatalogChange() {
      this.$data.baseInfoForm.setFieldsValue({ catalogIds: [null, null] })
      this.loadCatalogTree()
    },
    /**
     * 包材管理
     */
    onMaterialChange() {
      this.$data.assistInfoForm.setFieldsValue({ materialId: null })
      this.loadPackage()
    },
    /**
     * 添加本地SKU
     */
    onAppendLocalSku() {
      this.$data.appendSkuVisible = true
    },
    /**
     * 删除本地SKU
     */
    onDeleteLocalSku(index) {
      this.$delete(this.$data.productVariations, index)
    }
  }
}
</script>

<style lang="scss" scoped></style>
