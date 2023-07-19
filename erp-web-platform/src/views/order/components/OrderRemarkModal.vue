<template>
  <a-modal
    title='备注'
    :visible="value"
    @cancel="$emit('input', false)"
    @ok="ok"
    :afterClose="afterClose"
  >
    <SearchForm
      :form-model="param"
      :form-item="formItem"
      form-class="order-form"
    />
  </a-modal>
</template>

<script>
import SearchForm from '@/components/searchForm'
export default {
  name: 'OrderLogisticsModal',
  components: {
    SearchForm
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    formItem() {
      return [
        {
          itemType: 'textarea',
          label: this.$t('common.remarks'),
          span: 24,
          key: 'orderRemark',
          itemProp: {
            showCount: true,
            maxLength: 40
          }
        }
      ]
    }
  },
  watch: {
    value(newVal) {
      if (newVal) {
        this.init()
      }
    }
  },
  data() {
    return {
      param: {}
    }
  },
  methods: {
    init() {
      const { ordersn, orderRemark } = this.data
      this.param = {
        ordersn,
        orderRemark
      }
    },
    afterClose() {
      this.$emit('update:data', {})
      this.param = {}
    },
    ok() {
      this.$emit('ok', this.param)
      this.$emit('input', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.order-form {
  ::v-deep .ant-form-item-label {
    min-width: auto;
  }
}
</style>
