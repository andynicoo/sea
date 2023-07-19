<template>
  <a-form class="me-search-form" layout="inline" :form="form">
    <a-form-item :label="$t('searchForm.productTitle')" v-if="type == 3">
      <a-input v-decorator="['title']" style="width: 190px" />
    </a-form-item>
    <a-form-item :label="$t('searchForm.SKU')" v-if="type == 3">
      <a-input v-decorator="['itemSku']" style="width: 190px" />
    </a-form-item>
    <a-form-item :label="$t('searchForm.collectionSource')" v-if="type == 3">
      <a-select v-decorator="['sourceName']" style="width: 190px">
        <a-select-option
          v-for="source in generalSourceList"
          :key="source"
          :value="source"
        >
          {{ source }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item :label="$t('searchForm.store')">
      <a-select v-decorator="['storeId']" style="width: 190px">
        <a-select-option
          v-for="store in storeList"
          :key="store.storeId"
          :value="store.storeId"
        >
          {{ store.storeName }}
        </a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item :label="$t('searchForm.sort')" v-if="type == 3">
      <a-select v-decorator="['sort']" style="width: 190px">
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

    <div class="me-fr">
      <a-form-item :label="$t('searchForm.titleorSku')" v-if="type != 3">
        <a-input v-decorator="['titleorSku']" style="width: 190px" />
      </a-form-item>
      <a-form-item>
        <a-button @click="validateFields" type="primary">
          {{ $t('common.search') }}
        </a-button>
      </a-form-item>
      <a-form-item>
        <a-button @click="resetFields">{{ $t('common.reset') }}</a-button>
      </a-form-item>
    </div>
    <!-- {{ type }} -->
  </a-form>
</template>

<script>
import Product from '@/api/product'
import Store from '@/api/store'
export default {
  components: {},
  data() {
    return {
      form: this.$form.createForm(this),
      generalSourceList: [],
      storeList: [],
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
      ]
    }
  },
  props: {
    type: {
      default: null,
      type: Number
    }
  },
  mounted() {
    /**
     * 采集源
     */
    Product.getGeneralSourceList().then(({ data }) => {
      this.$data.generalSourceList = data
    })

    /**
     * 店铺
     */
    Store.getAllStore().then(({ data }) => {
      this.$data.storeList = data
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
        .then(({ titleorSku, title, itemSku, sourceName, storeId, sort }) => {
          if (sort) sort = JSON.parse(sort)
          else sort = {}

          this.$emit('search', {
            titleorSku,
            storeId,
            title,
            itemSku,
            sourceName,
            sort: sort.sort,
            sortType: sort.sortType
          })

          this.$emit('getnum', {
            titleorSku,
            storeId,
            title,
            itemSku,
            sourceName,
            sort: sort.sort,
            sortType: sort.sortType
          })
        })
    }
  }
}
</script>

<style lang="scss"></style>
