<template>
  <div>
    <h2 class="me-sub-title">
      {{ $t('cate.baseInfo') }}
    </h2>
    <a-form :form="form" :label-col="{ span: 9 }" :wrapper-col="{ span: 12 }">
      <a-row>
        <a-col :span="12">
          <a-form-item :label="$t('cate.name')">
            <a-input v-decorator="['name', { rules: [rules.required] }]" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="$t('cate.chooseStore')">
            <a-select
              :disabled="type === 'edit'"
              @change="onStoreChange"
              v-decorator="['storeId', { rules: [rules.required] }]"
            >
              <a-select-option
                v-for="store in storeList"
                :key="store.storeId"
                :value="store.storeId"
                :label="store.storeName"
              >
                {{ store.storeName }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="$t('cate.categorySort')">
            <a-input
              v-decorator="[
                'sortWeight',
                { rules: [rules.required, rules.positiveNumber] }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="$t('cate.isEnable')">
            <a-radio-group v-decorator="['status', { initialValue: 1 }]">
              <a-radio :value="1">{{ $t('common.yes') }}</a-radio>
              <a-radio :value="0">{{ $t('common.no') }}</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

    <div>
      <a-button type="link" class="me-fr" @click="onPush">
        {{ $t('cate.appendProduct') }}
      </a-button>
      <h2 class="me-sub-title">{{ $t('cate.productInfo') }}</h2>
    </div>

    <a-table
      rowKey="id"
      :columns="columns"
      :data-source="productList"
      :pagination="false"
    >
      <span slot="nameSlot" slot-scope="text, record">
        <div style="display: flex; align-items: center">
          <img
            style="width: 60px; height: 60px"
            class="me-mr-2"
            v-lazy="record.mainImage"
          />
          <p>{{ record.name }}</p>
        </div>
      </span>

      <span slot="operate" slot-scope="text, record, index">
        <a-button type="link" @click="removeProduct(index)" class="me-error">
          {{ $t('common.delete') }}
        </a-button>
      </span>
      <template #price="text,record">
        <div>{{ record.currency }}:</div>
        {{ getPrice(record) }}
      </template>
    </a-table>

    <a-modal
      :title="$t('cate.chooseProduct')"
      :visible="pushVisible"
      @ok="onPushSubmit"
      @cancel="onPushCancel"
      :maskClosable="false"
      destroyOnClose
      width="1200px"
    >
      <ProductList
        ref="product-list"
        :storeId="storeId"
        :sources="productList"
      />
    </a-modal>
  </div>
</template>

<script>
import { POSITIVE_NUMBER } from '@/util/regex'
import Store from '@/api/store'
import ProductList from './ProductList'
import Goods from '@/api/goods'
import { getPrice } from './common'
export default {
  components: { ProductList },
  props: {
    type: String,
    source: Object
  },
  data() {
    return {
      storeId: null,
      productList: [],
      storeList: [],
      pushVisible: false,
      form: this.$form.createForm(this),
      rules: {
        required: { required: true, message: this.$t('cate.notEmpty') },
        positiveNumber: {
          pattern: POSITIVE_NUMBER,
          message: this.$t('cate.numberValid')
        }
      },

      columns: [
        {
          title: this.$t('cate.tableName'),
          dataIndex: 'name',
          key: 'name',
          scopedSlots: { customRender: 'nameSlot' }
        },
        {
          title: this.$t('cate.price'),
          dataIndex: 'price',
          key: 'price',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: this.$t('cate.itemSku'),
          dataIndex: 'itemSku',
          key: 'itemSku'
        },
        {
          title: this.$t('cate.operate'),
          dataIndex: 'operate',
          key: 'operate',
          scopedSlots: { customRender: 'operate' }
        }
      ]
    }
  },
  mounted() {
    Store.getAllStore().then(({ data }) => {
      this.$data.storeList = data
    })

    if (this.$props.source) {
      const { shopCategoryId } = this.$props.source
      let params = { shopCategoryId }
      Goods.getCateDetail(params).then(({ data }) => {
        const { goodsList, name, storeId, sortWeight, status } = data
        this.$data.productList = goodsList
        this.$data.form.setFieldsValue({ name, storeId, sortWeight, status })
      })
    }
  },
  methods: {
    getPrice,
    onPush() {
      const { form } = this.$data
      const storeId = form.getFieldValue('storeId')
      if (!storeId) {
        this.$message.error(this.$t('cate.pushError'))
        return
      }
      this.$data.storeId = storeId
      this.$data.pushVisible = true
    },
    /**
     * 添加商品提交
     */
    onPushSubmit() {
      const rows = this.$refs['product-list'].getRows()
      this.$data.productList = rows
      this.$data.pushVisible = false
    },
    /**
     * 添加商品取消
     */
    onPushCancel() {
      this.$data.pushVisible = false
    },
    /**
     * 店铺选择事件
     */
    onStoreChange() {
      this.$data.productList = []
    },
    /**
     * 移除商品
     */
    removeProduct(index) {
      const { productList } = this.$data
      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('common.deleteConfirm'),
        onOk: () => {
          this.$delete(productList, index)
          this.$message.success(this.$t('common.handlerSuccess'))
        }
      })
    },
    /**
     * 提交
     */
    submit() {
      return new Promise((resolve, reject) => {
        const { type, source } = this.$props
        this.$data.form
          .validateFields()
          .then(async (data) => {
            data.itemId = this.$data.productList.map(({ itemId }) => itemId)
            let res
            if (type === 'append') {
              res = await Goods.handleAddCate(data)
            } else {
              data.shopCategoryId = source.shopCategoryId
              res = await Goods.handleEditCate(data)
            }
            resolve(res)
          })
          .catch((error) => {
            console.error(error)
            reject()
          })
      })
    }
  }
}
</script>
