<template>
  <a-modal
    :visible="value"
    :after-close="afterClose"
    :closable="false"
    @ok="$refs.searchForm.validate()"
    @cancel="$emit('input', false)"
  >
    <search-form
      ref="searchForm"
      :form-item="formItem"
      :form-model="formModel"
      @submit="submit"
    />
  </a-modal>
</template>

<script>
import searchForm from '@/components/searchForm'
import { adoptOpinion } from '@/api/contentManage'
export default {
  components: {
    searchForm
  },
  props: {
    currentObj: {
      type: Object,
      default: () => ({})
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formModel: {

      }
    }
  },
  computed: {
    formItem() {
      return [
        {
          label: '卖家账号',
          key: 'maAccount',
          span: 24,
          render: () => {
            return (<span>{this.currentObj.maAccount}</span>)
          }
        },
        {
          label: '旺币',
          span: 24,
          key: 'giveAmount',
          itemType: 'number',
          itemProp: {
            min: 0,
            style: { width: '150px' }
          }
        }
      ]
    }
  },
  methods: {
    afterClose() {

    },
    async submit(val) {
      const params = {
        feedBackId: this.currentObj.feedBackId,
        giveAmount: val.giveAmount
      }
      try {
        await adoptOpinion(params)
        this.$message.success('采纳成功')
        this.$emit('input', false)
        this.$emit('ok')
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style></style>
