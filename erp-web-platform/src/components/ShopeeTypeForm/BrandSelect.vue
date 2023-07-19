<template>
  <a-select
    v-model="val"
    placeholder="请选择"
    show-search
    :filter-option="false"
    @popupScroll="onPopupScroll($event)"
    @select="handleSelect"
    @search="handleSearch"
    @focus="onFocus"
    @change="change"
  >
    <a-select-option
      v-for="item in renderedOptions"
      :key="item[fieldNames.key]"
      :value="item[fieldNames.value]"
      >{{ item[fieldNames.label] }}</a-select-option
    >
  </a-select>
</template>

<script>
import { debounce } from 'lodash'
const LOAD_NUM = 30
export default {
  props: {
    fieldNames: {
      type: Object,
      default: () => ({
        label: 'display_name',
        key: 'brand_id',
        value: 'brand_id'
      })
    },
    value: {
      type: [String, Number]
    },
    brandList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      renderedOptions: [],
      filterDataList: [],
      searchVal: ''
    }
  },
  computed: {
    val: {
      get() {
        return this.value ?? undefined
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  mounted() {
    this.renderedOptions = this.brandList.slice(0, LOAD_NUM)
    if (this.value) this.handleSelect(this.value, true)
  },
  methods: {
    // 重置下拉数据为前LOAD_NUM条
    onFocus() {
      this.renderedOptions = this.brandList.slice(0, LOAD_NUM)
    },
    handleSearch(val) {
      this.searchVal = val
      let filterList = []
      if (val) {
        filterList = this.brandList.filter(
          (item) =>
            item.display_name.toUpperCase().indexOf(val.toUpperCase()) > -1
        )
      } else {
        filterList = this.brandList
      }
      this.filterDataList = filterList
      this.renderedOptions =
        filterList.length < LOAD_NUM
          ? filterList
          : filterList.slice(0, LOAD_NUM)
    },
    handleSelect(val, set) {
      if (this.searchVal || set) {
        const selectedArr = this.brandList.filter(
          (item) => item.brand_id === val
        ) // 从数据源中过滤出下拉框选中的值，并返回一个数组
        console.log(selectedArr)
        const restList = this.brandList.filter((item) => item.brand_id !== val) // 从数据源中过滤出其他的值，返回一个数组
        const newList = selectedArr.concat(restList).slice(0, LOAD_NUM) // 将选中的元素放到下拉列表的第一位
        this.renderedOptions = newList // 更新已渲染的下拉列表
        const brandList = selectedArr.concat(restList) // 更新数据源
        this.$emit('update:brandList', brandList)
        this.searchVal = '' // 因为触发handleSelect函数时，会自动清空用户输入的内容。因此，searchVal需要重置。
      }
    },
    // 加载更多数据到select框
    loadMoreData(dataList) {
      const renderedLen = this.renderedOptions.length // 已渲染的下拉列表长度
      const totalLen = dataList.length // 当前数据源的长度
      let addList = []
      if (renderedLen < totalLen) {
        if (renderedLen + LOAD_NUM <= totalLen) {
          addList = dataList.slice(renderedLen, renderedLen + LOAD_NUM)
        } else {
          addList = dataList.slice(
            renderedLen,
            renderedLen + (totalLen % LOAD_NUM)
          )
        }
        this.renderedOptions = this.renderedOptions.concat(addList)
      }
    },
    change(val) {
      this.$emit('change', val)
    },
    onPopupScroll: debounce(function(e) {
      const { target } = e
      const scrollHeight = target.scrollHeight - target.scrollTop
      const clientHeight = target.clientHeight
      if (scrollHeight - clientHeight <= 50) {
        if (this.searchVal === '') {
          this.loadMoreData(this.brandList)
        } else {
          this.loadMoreData(this.filterDataList)
        }
      }
    }, 200)
  }
}
</script>

<style></style>
