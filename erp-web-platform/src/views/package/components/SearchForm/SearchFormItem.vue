<template>
  <a-form-item :label='formItem.label'
               :prop='formItem.dataIndex'
  >
     <template  v-if="formItem.type === 'input' || typeof formItem.type === 'undefined'">
       <a-input
         v-model='formData[formItem.dataIndex]'
         :placeholder="'请输入'+formItem.label"
       />
     </template>
    <template   v-if="formItem.type === 'a-select'" v-model:value='formData[formItem.dataIndex]'>
      <a-select
                @change='formItem.change'>
        <a-select-option v-for='(selectItem, index) of formItem.data' :key='index' v-model='selectItem.id'>
          {{ selectItem.name }}
        </a-select-option>
      </a-select>
    </template>
  </a-form-item>
</template>

<script>
export default {
  name: 'SearchFormItem',
  props: {
    formItem: {
      type: Object,
      default: () => ({})
    },
    formData: {
      type: Object,
      default: () => ({})
    }
  }


}
</script>

<style scoped>

</style>