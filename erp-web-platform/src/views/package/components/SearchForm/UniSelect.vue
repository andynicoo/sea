<template>
  <a-select
    @change='select.change'   v-model:value='form[select.dataIndex]'>
    <a-select-option v-for='(selectItem, selectIndex) of select.data' :key='select.id' v-model='select.id'>
      {{ selectItem.name }}
    </a-select-option>
  </a-select>
</template>

<script>
export default {
  name: 'UniSelect',
  props:{
    select:{
      type:Object,
      default:()=>({})
    },
    form:{
      type:Object,
      default:()=>({})
    }
  }
}
</script>

<style scoped>

</style>