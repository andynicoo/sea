<template>
  <a-modal
    :visible="value"
    :after-close="afterClose"
    :closable="false"
    @ok="ok"
    @cancel="$emit('input',false)"
  >
    <SearchForm
      ref="searchForm"
      :form-item="formItem"
      :form-model="formModel"
      @submit="submit"
    />
  </a-modal>

</template>

<script>
import SearchForm from '@/components/searchForm'
import { moneyRefuse } from '@/api/account'

const initFormModel = {
  id: null,
  refuseReason: ''
}
export default {
  components: {
    SearchForm
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    actionType: {
      type: String,
      default: 'edit'
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formModel: {
        ...initFormModel
      }
    }
  },
  computed: {
    formItem() {
      return [
        {
          label: '拒绝原因',
          key: 'refuseReason',
          itemType: 'textarea',
          span: 24
        }
      ]
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val) this.setFormModel()
      }
    }
  },
  methods: {
    async ok() {
      this.$refs.searchForm.validate()
    },
    setFormModel() {
      const val = this.data
      const obj = Object.create(null)
      if (this.actionType === 'edit') {
        Object.entries(this.formModel).forEach(([key, value]) => {
          obj[key] = val[key] || ''
        })
        this.formModel = {
          ...obj
        }
      }
    },
    afterClose() {
      this.formModel = { ...initFormModel }
      this.$refs.searchForm.resetForm()
    },
    async submit(val) {
      try {
        await moneyRefuse(val)
        this.$emit('input', false)
        this.$message.success('汇款拒绝成功')
        this.$emit('ok')
      } catch (error) {
        console.error(error)
      }
    }

  }

}
</script>

<style lang="less" scoped>
.money-form{
  /deep/.ant-form-item-label{
    min-width: 80px;
  }
}
</style>
