<template>
  <div class="me-page-search">
    <a-form class="me-search-form" layout="inline" :form="form">
      <a-form-item :label="$t('searchForm.productTitle')">
        <a-input
          v-decorator="['title']"
          style="width: 190px"
          :placeholder="$t('edit.placeInput')"
        />
      </a-form-item>
      <!-- <a-form-item label="来源价格">
        <a-input v-decorator="['startPrice']" style="width: 88px" /> -
        <a-input v-decorator="['endPrice']" style="width: 88px" />
      </a-form-item> -->
      <a-form-item :label="$t('searchForm.SKU')">
        <a-input
          v-decorator="['itemSku']"
          style="width: 190px"
          :placeholder="$t('edit.placeInput')"
        />
      </a-form-item>
      <a-form-item :label="$t('searchForm.collectionSource')">
        <a-select
          v-decorator="['sourceName']"
          style="width: 190px"
          :placeholder="$t('edit.placeChoose')"
        >
          <a-select-option
            v-for="source in generalSourceList"
            :key="source"
            :value="source"
          >
            {{ source }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <slot name="site-item"></slot>
      <StoreSelect v-if="type != 10" />
      <a-form-item v-if="type == 10" :label="$t('global.merchant')">
        <a-select
          v-decorator="['merchant_id']"
          style="width:190px"
          :placeholder="$t('edit.placeChoose')"
        >
          <a-select-option
            v-for="item in cncsMerchantList"
            :key="item.merchant_id"
            :value="item.merchant_id"
            >{{ item.merchant_name }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <!-- 商品发布几种类型，不显示选择排序选项 -->
      <a-form-item
        :label="$t('searchForm.sort')"
        v-if="![2, 3, 4, 7, 8, 9, 10, 'Lazada'].includes(type)"
      >
        <a-select
          v-decorator="['sort']"
          style="width: 190px"
          :placeholder="$t('edit.placeChoose')"
        >
          <a-select-opt-group v-for="(sort, pindex) in sortItem" :key="pindex">
            <span slot="label">{{ sort.header }}</span>
            <a-select-option
              :value="JSON.stringify(item.value)"
              v-for="(item, cindex) in sort.children"
              :key="`${pindex}-${cindex}`"
            >
              {{ item.text }}
            </a-select-option>
          </a-select-opt-group>
        </a-select>
      </a-form-item>
      <slot name="form-item"></slot>

      <a-form-item class="me-mr-3">
        <a-button @click="validateFields" type="primary">
          {{ $t('common.search') }}
        </a-button>
      </a-form-item>
      <a-form-item>
        <a-button @click="resetFields">{{ $t('common.reset') }}</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import Product from '@/api/product'
import StoreSelect from '@/components/StoreSelect'
export default {
  components: {
    StoreSelect
  },
  data() {
    return {
      form: this.$form.createForm(this),
      generalSourceList: [],
      sortItem: [
        {
          header: this.$t('faild.msg1'),
          children: [
            { text: this.$t('faild.msg2'), value: { sort: 1, sortType: 1 } },
            { text: this.$t('faild.msg3'), value: { sort: 1, sortType: 0 } }
          ]
        },

        {
          header: this.$t('faild.msg4'),
          children: [
            { text: this.$t('faild.msg5'), value: { sort: 2, sortType: 1 } },
            { text: this.$t('faild.msg6'), value: { sort: 2, sortType: 0 } }
          ]
        },

        {
          header: this.$t('faild.msg7'),
          children: [
            { text: this.$t('faild.msg8'), value: { sort: 3, sortType: 1 } },
            { text: this.$t('faild.msg9'), value: { sort: 3, sortType: 0 } }
          ]
        },

        {
          header: this.$t('faild.msg10'),
          children: [
            { text: this.$t('faild.msg11'), value: { sort: 4, sortType: 1 } },
            { text: this.$t('faild.msg12'), value: { sort: 4, sortType: 0 } }
          ]
        },

        {
          header: this.$t('faild.msg13'),
          children: [
            { text: this.$t('faild.msg14'), value: { sort: 5, sortType: 1 } },
            { text: this.$t('faild.msg15'), value: { sort: 5, sortType: 0 } }
          ]
        },

        {
          header: this.$t('faild.msg16'),
          children: [
            { text: this.$t('faild.msg17'), value: { sort: 6, sortType: 1 } },
            { text: this.$t('faild.msg18'), value: { sort: 6, sortType: 0 } }
          ]
        }
        // {
        //   header: '售价',
        //   children: [
        //     { text: this.$t('faild.msg17'), value: { sort: 7, sortType: 1 } },
        //     { text: this.$t('faild.msg18'), value: { sort: 7, sortType: 0 } }
        //   ]
        // }
      ]
    }
  },
  props: {
    type: {
      type: [String, Number],
      default: 0
    },
    cncsMerchantList: {
      type: Array,
      default: () => []
    }
  },
  mounted() {
    /**
     * 采集源
     */
    Product.getGeneralSourceList().then(({ data }) => {
      this.$data.generalSourceList = data
    })
  },
  methods: {
    resetFields() {
      this.$data.form.resetFields()
      this.validateFields()
    },
    validateFields() {
      this.$data.form
        .validateFields()
        .then(
          ({
            title,
            itemSku,
            sourceName,
            storeId,
            sort,
            startPrice,
            endPrice,
            merchant_id,
            isCnsc,
            goodType
          }) => {
            if (sort) sort = JSON.parse(sort)
            else sort = {}
            console.log(storeId)
            this.$emit('search', {
              title,
              itemSku,
              sourceName,
              storeId:
                storeId == undefined ? undefined : storeId[storeId.length - 1],
              sort: sort.sort,
              sortType: sort.sortType,
              startPrice,
              endPrice,
              merchant_id,
              // isCnsc,
              goodType,
              // shopee的商品发布模块、在线商品页面，所属店铺查询条件添加CNSC选项,如果选择的cnsc店铺，isCnsc===1
              isCnsc:
                storeId == undefined ? undefined : storeId[0] === 'CNSC' ? 1 : 0
            })
          }
        )
    }
  }
}
</script>

<style lang="scss" scoped>
.me-page-search {
  ::v-deep .ant-form-item {
    label {
      min-width: 70px;
      display: inline-block;
    }
  }
}
</style>
