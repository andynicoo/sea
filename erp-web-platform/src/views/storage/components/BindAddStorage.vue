<template>
  <a-spin :spinning="spinning">
    <a-form :form="form">
      <a-form-item>
        <a-checkbox-group v-decorator="['storageIds']" :options="dataList" />
      </a-form-item>
    </a-form>
  </a-spin>
</template>

<script>
/**
 * 本地SKU添加仓库
 */
import Storage from '@/api/storage'
export default {
  props: {
    current: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      spinning: false,
      dataList: [],
      form: this.$form.createForm(this)
    }
  },
  mounted() {
    this.$data.spinning = true
    Storage.getStorage({ current: 1, size: 10000 })
      .then(({ data }) => {
        data.records = data.records.map(({ storageId, storageName }) => ({
          label: storageName,
          value: storageId
        }))
        this.$data.dataList = data.records
        this.$data.form.setFieldsValue({ storageIds: this.$props.current })
      })
      .finally(() => {
        this.$data.spinning = false
      })
  },
  methods: {
    async submit() {
      const { dataList, form } = this.$data
      const { storageIds } = await form.validateFields()
      const storages = dataList.filter((ele) => storageIds.includes(ele.value))
      return storages
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
