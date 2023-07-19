<template>
  <a-form-model
    ref="productInfoForm"
    :model="product"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <!-- <a-form-model-item
      :selfUpdate="true"
      :label="$t('edit.productName')"
      prop="name"
    >
      <template slot="help">
        <p class="me-warn-text">
          {{ getWarnKeywordWarn(illegalWord, product.name) }}
        </p>
      </template>
      <a-input
        v-input-text-count="{ max: storeLimit.title, required: true }"
        v-model="product.name"
      />
    </a-form-model-item> -->
    <a-form-model-item
      :selfUpdate="true"
      :label="$t('edit.productName')"
      prop="name"
      class="xxx"
    >
      <template slot="help">
        <p class="me-warn-text">
          {{ getWarnKeywordWarn(illegalWord, product.name) }}
        </p>
      </template>
      <!-- {{ product.countryCode }}--{{ editType }}--{{ product.cnsc }}- -->
      <!-- disabledEmoji-- 待发布中是菲律宾的店铺,或者是cnsc产品，禁用emoji -->
      <Emoji
        v-model="product.name"
        ids="id1"
        :maxLength="itemNameLimit.max_limit"
        v-input-text-count="{
          min: itemNameLimit.min_limit,
          max: itemNameLimit.max_limit,
          required: true,
          right: '49px',
          calcByteLen: isCnscStore
        }"
        :disabledEmoji="
          (product.countryCode == 'PH' || product.cnsc == 1) && editType == 2
        "
      ></Emoji>
      <template slot="extra">
        <a-button class="me-word-btn" @click="returnWord">
          {{ $t('edit.capitalize') }}
        </a-button>
        <p
          v-if="
            (product.countryCode == 'PH' || product.cnsc == 1) && editType == 2
          "
        >
          菲律宾站点,cnsc商品标题不可添加表情
        </p>
      </template>
    </a-form-model-item>

    <!-- <template v-if="editType == 0">
      <a-form-model-item label="全球货号" prop="productItemSku">
        <a-input v-model="product.productItemSku" />
      </a-form-model-item>
    </template> -->
    <template>
      <a-form-model-item :label="$t('edit.productCode')" prop="itemSku">
        <a-input v-model="product.itemSku" />
      </a-form-model-item>
    </template>

    <!-- <a-form-model-item
      v-auth="'goods:edit:sku'"
      :label="$t('edit.masterSKU')"
      prop="productItemSku"
    >
      <a-input v-model="product.productItemSku" />
    </a-form-model-item> -->

    <!-- <a-form-model-item :label="$t('edit.productDesc')" prop="description">
      <a-textarea
        v-input-text-count="{ max: storeLimit.dec, required: true }"
        :rows="8"
        v-model="product.description"
      />
      <template slot="help">
        <p class="me-warn-text">
          {{ getWarnKeywordWarn(illegalWord, product.description) }}
        </p>
      </template>
    </a-form-model-item> -->

    <a-form-model-item :label="$t('edit.productDesc')" prop="description">
      <EmojiArea
        v-model="product.description"
        ids="id2"
        :maxLength="itemDecLimit.max_limit"
        v-input-text-count="{
          max: itemDecLimit.max_limit,
          required: true,
          extraSite: 'itself',
          extraTop: '-16px',
          calcByteLen: isCnscStore
        }"
        :disabledEmoji="
          (product.countryCode != 'PH' && editType == 2) || editType != 2
        "
      ></EmojiArea>
      <template slot="help">
        <p class="me-warn-text">
          {{ getWarnKeywordWarn(illegalWord, product.description) }}
        </p>
      </template>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import { getWarnKeywordWarn, urlParamsToObject } from '@/util/handle'
import { mapState } from 'vuex'
import Emoji from '@/components/Emoji'
import EmojiArea from '@/components/EmojiArea'
import { getByteLen } from '@/util'

export default {
  data() {
    return {
      getWarnKeywordWarn
    }
  },
  components: {
    Emoji,
    EmojiArea
  },
  computed: {
    ...mapState({
      storeLimit: (state) => {
        const params = urlParamsToObject(location.href.split('?')[1])
        if (params.edit == 0) {
          return {}
        }
        return state.product.storeLimit
      },
      illegalWord: (state) => state.product.illegalWord,
      shopItemLimit: (state) => state?.vars?.shopItemLimit,
      itemNameLimit(state) {
        return state?.vars?.shopItemLimit?.item_name_length_limit || {}
      },
      itemDecLimit(state) {
        return state?.vars?.shopItemLimit?.item_description_length_limit || {}
      }
    }),
    editType() {
      return this.$route.query.edit
    },
    rules() {
      let titleRule = {}
      let descRule = {}
      let codeRule = {}
      if (this.shopItemLimit) {
        const {
          item_name_length_limit: itemName = {},
          item_description_length_limit: itemDec = {}
        } = this.shopItemLimit
        titleRule = {
          min: itemName.min_limit,
          max: itemName.max_limit,
          message: this.$t('edit.initDataValidError4', {
            min: itemName.min_limit,
            max: itemName.max_limit
          })
        }
        descRule = {
          min: itemDec.min_limit,
          max: itemDec.max_limit,
          message: this.$t('edit.initDataValidError3', {
            min: itemDec.min_limit,
            max: itemDec.max_limit
          })
        }
        // codeRule = {
        //   max: Number(code),
        //   message: '商品编码不能超过' + code + '个字符'
        // }
      }
      return {
        name: [
          { required: true, message: this.$t('edit.nameValid') },
          {
            validator: (rule, value, callback) =>
              this.customCheck(rule, value, callback, 'name')
          }
          // titleRule || {}
        ],
        description: [
          { required: true, message: this.$t('edit.descValid') },
          {
            validator: (rule, value, callback) =>
              this.customCheck(rule, value, callback, 'description')
          }
          // descRule || {}
        ],
        // itemSku: [
        //   { required: true, message: this.$t('edit.itemSkuValid') },
        //   codeRule || {}
        // ],
        productItemSku: [
          { required: true, message: this.$t('edit.masterSkuValid') }
        ]
      }
    }
  },
  model: {
    prop: 'product',
    event: 'input'
  },
  props: {
    product: Object,
    labelCol: {
      type: Object,
      default: () => ({ span: 3 })
    },
    wrapperCol: {
      type: Object,
      default: () => ({ span: 12 })
    },
    isCnscStore: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.productInfoForm
          .validate()
          .then(() => resolve(true))
          .catch(() => reject(this.$t('edit.productInfoValidError')))
      })
    },
    returnWord() {
      this.product.name = this.capitalWord(this.product.name)
    },
    capitalWord(str) {
      return str.toLowerCase().replace(/\b([\w|‘]+)\b/g, function(word) {
        return word.replace(word.charAt(0), word.charAt(0).toUpperCase())
      })
    },
    customCheck(rule, value, callback, key) {
      const map = {
        name: 'item_name_length_limit',
        description: 'item_description_length_limit'
      }
      const tips = {
        name: 'edit.initDataValidError4',
        description: 'edit.initDataValidError3'
      }
      const limit = this.shopItemLimit
      if (!value) {
        callback()
      }
      if (value && limit) {
        let len = this.isCnscStore ? getByteLen(value) : value.length
        if (
          len < limit?.[map[key]].min_limit ||
          len > limit?.[map[key]].max_limit
        ) {
          callback(
            new Error(
              this.$t(tips[key], {
                min: limit?.[map[key]].min_limit,
                max: limit?.[map[key]].max_limit
              })
            )
          )
        }
      }
      callback()
    }
  }
}
</script>

<style lang="scss" scoped>
.me-word-btn {
  position: absolute;
  right: -190px;
  top: 3px;
}
</style>
<style>
.ant-form-extra {
  min-height: 0px;
}
</style>
