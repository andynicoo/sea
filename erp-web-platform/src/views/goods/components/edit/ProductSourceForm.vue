<template>
  <SearchForm
    :form-item="formItem"
    layout="horizontal"
    class="productForm"
  ></SearchForm>
</template>

<script>
import { build1688SearchImgLink } from '@/util'
import SearchForm from '@/components/searchForm'
import { mapState } from 'vuex'
export default {
  components: {
    SearchForm
  },
  data() {
    return {
      rules: {},
      editType: this.$route.query.edit,
      isCnscStore: !!this.$route.query.merchantId
    }
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
    },
    ...mapState({
      storeName(state) {
        const storeList = state.product.storeList
        const obj = storeList.find(
          (item) => item.storeId === this.product.storeId
        )
        return obj?.storeName
      }
    }),
    formItem({ product, $t }) {
      return [
        {
          label: $t('edit.productSource2'),
          key: 'productSource2',
          span: 24,
          render: () => {
            return (
              <div>
                <a
                  target="__blank"
                  href={product.sourceUrl}
                  class="source-link">
                  {product.sourceUrl}
                </a>
                <span class="source-name">
                  {product.sourceName ? `(${product.sourceName})` : ''}
                </span>
              </div>
            )
          }
        },
        // {
        //   label: $t('edit.findProduct'),
        //   idHide: !this.comb1688ImageLink,
        //   key: 'findProduct',
        //   span: 24,
        //   render: () => (
        //     <a href={this.comb1688ImageLink} target="black">
        //       {$t('edit.findProductBy1688')}
        //     </a>
        //   )
        // },
        {
          label: $t('edit.shop'),
          isHide:
            this.isCnscStore || this.editType === '0' || this.editType === '10',
          span: 24,
          key: 'shop',
          render: () => <span>{this.storeName}</span>
        },
        {
          label: $t('edit.merchant'),
          isHide: !this.isCnscStore,
          key: 'merchant',
          render: () => <span>{product.merchantName}</span>,
          span: 24
        },
        {
          label: $t('edit.lastModifiedTime'),
          span: 24,
          key: 'time',
          render: () => <span>{product.updateTime}</span>
        }
      ]
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
    }
  }
}
</script>

<style lang="scss" scoped>
// .product-source-link {
.source-link {
  overflow: hidden; //超出的文本隐藏
  text-overflow: ellipsis; //溢出用省略号显示
  white-space: nowrap; //溢出不换行
  color: #ff8859;
  max-width: 220px;
  display: inline-block;
  line-height: 12px;
}
.source-name {
  max-width: 220px;
  display: inline-block;
  line-height: 12px;
}
.productForm {
  ::v-deep .search-form-item {
    margin-bottom: 0px;
  }
}
// }
</style>
