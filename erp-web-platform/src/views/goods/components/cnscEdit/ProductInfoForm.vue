<template>
  <a-form-model
    ref="productInfoForm"
    :model="product"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
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
      <Emoji
        v-model="product.name"
        ids="id1"
        :maxLength="lengthLimit.nameMax"
        v-input-text-count="{
          max: lengthLimit.nameMax,
          min: lengthLimit.nameMin,
          calcByteLen: true,
          required: true,
          right: '49px'
        }"
      ></Emoji>
      <template slot="extra">
        <a-button type="primary" class="me-word-btn" @click="returnWord">
          单词首字母大写
        </a-button>
      </template>
    </a-form-model-item>

    <a-form-model-item :label="$t('edit.productCode')" prop="itemSku">
      <template slot="help">
        <p class="me-warn-text">
          {{ getWarnKeywordWarn(illegalWord, product.itemSku) }}
        </p>
      </template>
      <a-input :disabled="!isEdit" v-model="product.itemSku" />
    </a-form-model-item>

    <a-form-model-item :label="$t('edit.productDesc')" prop="description">
      <EmojiArea
        v-model="product.description"
        ids="id2"
        :maxLength="lengthLimit.desMax"
        :disabled="!isEdit"
        v-input-text-count="{
          min: lengthLimit.desMin,
          max: lengthLimit.desMax,
          calcByteLen: true,
          extraTop: '-16px',
          extraSite: 'itself',
          required: true
        }"
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
import { getWarnKeywordWarn } from '@/util/handle'
import { mapState } from 'vuex'
import { isEmpty } from 'lodash'
import Emoji from '@/components/Emoji'
import EmojiArea from '@/components/EmojiArea'

export default {
  data() {
    return {
      getWarnKeywordWarn,
      lengthLimit: {
        nameMin: 15,
        nameMax: 120,
        desMin: 20,
        desMax: 5000
      }
    }
  },
  components: {
    Emoji,
    EmojiArea
  },
  computed: {
    ...mapState({
      illegalWord: (state) => state.product.illegalWord
    }),
    rules() {
      return {
        name: [
          { required: true, message: this.$t('edit.nameValid') },
          {
            min: this.lengthLimit.nameMin,
            message: this.$t('edit.initDataValidError4', {
              min: this.lengthLimit.nameMin,
              max: this.lengthLimit.nameMax
            })
          }
        ],
        description: [
          { required: true, message: this.$t('edit.descValid') },
          {
            min: this.lengthLimit.desMin,
            message: this.$t('edit.initDataValidError3', {
              min: this.lengthLimit.desMin,
              max: this.lengthLimit.desMax
            })
          }
        ],
        itemSku: [{ required: true, message: this.$t('edit.itemSkuValid') }]
        // productItemSku: [
        //   { required: true, message: this.$t('edit.masterSkuValid') }
        // ]
      }
    }
  },
  watch: {
    itemLimits: {
      handler: function() {
        this.initLimit()
      },
      deep: true
    }
  },
  props: {
    tabsKey: {
      type: Number,
      default: 0
    },
    itemLimits: {
      type: Object,
      default: () => ({})
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    product: {
      type: Object,
      default: () => ({})
    },
    labelCol: {
      type: Object,
      default: () => ({ span: 3 })
    },
    wrapperCol: {
      type: Object,
      default: () => ({ span: 12 })
    }
  },
  model: {
    prop: 'product',
    event: 'input'
  },
  methods: {
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.productInfoForm
          .validate()
          .then(() => resolve(true))
          .catch((error) => {
            console.log(error)
            reject(this.$t('edit.productInfoValidError'))
          })
      })
    },
    initLimit() {
      if (!isEmpty(this.itemLimits)) {
        const {
          item_name_length_limit,
          item_description_length_limit
        } = this.itemLimits
        this.lengthLimit = {
          nameMin: item_name_length_limit.min_limit,
          nameMax: item_name_length_limit.max_limit,
          desMin: item_description_length_limit.min_limit,
          desMax: item_description_length_limit.max_limit
        }
      }
    },
    returnWord() {
      this.product.name = this.capitalWord(this.product.name)
    },
    capitalWord(str) {
      return str.toLowerCase().replace(/\b([\w|‘]+)\b/g, function(word) {
        return word.replace(word.charAt(0), word.charAt(0).toUpperCase())
      })
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
