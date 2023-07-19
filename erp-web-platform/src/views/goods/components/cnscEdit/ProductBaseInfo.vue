<template>
  <div>
    <a-form-model
      :model="product"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="认领商户" class="product-source-link">
        {{ product.merchantName }}
      </a-form-model-item>
      <a-form-model-item
        :label="$t('edit.productSource2')"
        class="product-source-link"
      >
        <a target="__blank" :href="product.sourceUrl" class="source-link">
          {{ product.sourceUrl }}
        </a>
        <span class="source-name">({{ product.sourceName }})</span>
      </a-form-model-item>
      <template v-if="comb1688ImageLink">
        <a-form-model-item :label="$t('edit.findProduct')">
          <a :href="comb1688ImageLink" target="black">
            {{ $t('edit.findProductBy1688') }}
          </a>
        </a-form-model-item>
      </template>
      <a-form-model-item :label="$t('edit.lastModifiedTime')">
        <span>{{ product.updateTime }}</span>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import { build1688SearchImgLink } from '@/util'
export default {
  props: {
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
  computed: {
    /**1688链接回显*/
    comb1688ImageLink() {
      const { mainImgUrl, images } = this.$props.product
      if (mainImgUrl) return build1688SearchImgLink(mainImgUrl)
      if (images) {
        let images = JSON.parse(images || '[]')
        return images.length > 0 ? build1688SearchImgLink(images[0]) : null
      }
      return null
    }
  }
}
</script>

<style lang="scss" scoped>
.product-source-link {
  .source-link {
    overflow: hidden; //超出的文本隐藏
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap; //溢出不换行
    color: #ff8859;
    max-width: calc(100% - 220px);
    display: inline-block;
    line-height: 12px;
  }
  .source-name {
    max-width: 220px;
    display: inline-block;
    line-height: 12px;
  }
}
</style>
