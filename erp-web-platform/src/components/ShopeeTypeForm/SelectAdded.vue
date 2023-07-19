<template>
  <a-input-group
    compact
    class="me-select-input"
    :class="{ readonly: disabled }"
    ref="selectinput"
  >
    <a-popover
      placement="bottomLeft"
      trigger="click"
      v-model="visible"
      :overlayStyle="calcSelectWidth"
      :getPopupContainer="(target) => target.parentNode"
      @visibleChange="onVisibleChange"
    >
      <div slot="content" :class="{ 'disabled-event': disabled }">
        <div class="open">
          <a-input
            :placeholder="searchText || '请输入'"
            v-model.trim="searchVal"
            :allowClear="true"
            @input="goSearch"
            ref="selectadded"
          >
            <a-icon slot="prefix" type="search" />
          </a-input>
        </div>
        <div
          ref="selectContent"
          class="allval me-pt-2 outer1"
          @scroll="onPopupScroll"
        >
          <ul
            v-if="selectList.length"
            class="scrollbar"
            @scroll="$emit('onScroll')"
          >
            <li
              ref="selectItem"
              v-for="item in selectList"
              :key="item[fieldNames.key]"
              :class="{ active: isActive(item) }"
              @click="addOrRemoveItem(isActive(item), item)"
            >
              <span v-html="highlightText(item[fieldNames.label])"></span>
              <a-icon
                slot="prefix"
                class="me-fr"
                type="check"
                v-if="isActive(item)"
              />
            </li>
          </ul>
          <div v-else class="me-pb-2 me-pt-2 empty-text">
            {{ emptyText }}
          </div>
        </div>
        <div v-if="custom" class="additem">
          <h3 class="hand" @click="addtemping = !addtemping">
            <a-icon type="plus" class="me-status-link" />
            {{ addItemButtonText }}
          </h3>
          <div class="addinput me-pr-2" v-if="addtemping">
            <a-input-group compact>
              <a-input
                :placeholder="addItemText"
                v-model="addtemp"
                :allowClear="true"
                :style="calcWidth"
                @change="inputChange"
              >
              </a-input>
              <a-select
                v-if="unitList.length"
                :disabled="disabled"
                placeholder="请选择"
                style="width: 30%"
                @change="onChange"
                :getPopupContainer="
                  (target) => target.parentNode.parentNode.parentNode
                "
                v-model="unit"
              >
                <a-select-option v-for="item in unitList" :key="item">
                  {{ item }}
                </a-select-option>
              </a-select>
              <div class="action-icon">
                <a-icon type="check" class="hand" @click="() => pushTemp()" />
                <a-icon
                  type="close"
                  class="hand"
                  @click="
                    addtemp = ''
                    addtemping = false
                  "
                />
              </div>
            </a-input-group>
          </div>
          <!-- <div v-if="tempValue.length != 0" class="me-pt-2">
            <ul>
              <li
                v-for="item in tempValue"
                :key="item[fieldNames.value]"
                :class="{
                  active: isActive(item)
                }"
                @click="addOrRemoveItem(isActive(item), item)"
              >
                {{ item[fieldNames.label] }}
                <a-icon
                  slot="prefix"
                  class="me-fr"
                  type="check"
                  v-if="isActive(item)"
                />
              </li>
            </ul>
          </div> -->
        </div>
      </div>
      <div
        ref="input"
        tabIndex="0"
        class="input"
        :class="{ 'disabled-event': disabled, 'input-focued': visible }"
        :style="calcSelectWidth"
        @click.self="openDialog"
      >
        <div class="input-value">
          <span v-show="showPlaceholder()" class="placeholder-select">{{
            placeholder
          }}</span>
          <span class="span" v-if="!multiple">
            {{ formatValue(selectValue) }}
          </span>
          <ul v-else>
            <li v-for="item in selectValue" :key="item[fieldNames.key]">
              <div>
                <span class="me-pr-1 value-tag">
                  {{ formatValue(item) }}
                </span>
                <a-icon
                  type="close"
                  class="hand me-status-skip me-fr me-pt-1"
                  @click.stop="addOrRemoveItem(true, item)"
                />
              </div>
            </li>
          </ul>
        </div>
        <div class="input-suffix">
          <div v-if="limitCount && multiple" class="input-limit">
            <span>{{ selectValue.length }}</span>
            /
            <span>{{ limitCount }}</span>
          </div>
          <a-icon
            v-if="!multiple"
            type="down"
            :class="{ 'icon-down': visible }"
          />
        </div>
      </div>
    </a-popover>
    <a-select
      v-if="showUnit"
      :disabled="disabled"
      placeholder="请选择"
      style="width: 30%"
      @change="onChange"
      :getPopupContainer="(target) => target.parentNode"
      v-model="unit"
    >
      <a-select-option v-for="item in unitList" :key="item">
        {{ item }}
      </a-select-option>
    </a-select>
  </a-input-group>
</template>

<script>
import { debounce } from 'lodash'
import { pattern } from './common'
const LOAD_NUM = 100 //默认加载100条
export default {
  props: {
    // 单位
    unitList: {
      type: Array,
      default: () => []
    },
    product: {
      type: Array,
      default: () => []
    },
    allArr: {
      type: Array,
      default: () => []
    },
    multiple: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    searchText: {
      type: String,
      default: ''
    },
    searchResultText: {
      type: String,
      default: '未搜索到相关内容'
    },
    addItemButtonText: {
      type: String,
      default: '添加一个新属性值'
    },
    addItemText: {
      type: String,
      default: '添加一个新项'
    },
    emptyText: {
      type: String,
      default: '暂无数据'
    },
    // 限制最大数量
    limitCount: {
      type: [String, Number],
      default: 5
    },
    placeholder: {
      type: String,
      default: ''
    },
    // 映射的key与value
    fieldNames: {
      type: Object,
      default: () => ({
        label: 'label',
        value: 'value',
        key: 'key'
      })
    },
    value: {
      type: [Object, Array],
      default: () => []
    },
    inputValidationType: {
      type: String,
      default: 'STRING_TYPE'
    },
    // 是否显示自定义增加属性
    custom: {
      type: Boolean,
      default: true
    },
    showUnit: {
      type: Boolean,
      default: false
    }
  },
  filters: {},
  data() {
    this.goSearch = debounce(this.goSearch, 200)
    return {
      visible: false,
      items: [],
      renderOptions: [], //下拉列表
      searchResult: [], //搜索结果列表
      selectValue: [],
      searchVal: '',
      open: false,
      tempValue: [], // 添加的新属性
      addtemp: '',
      addtemping: false,
      divWidth: 0,
      mapValue: {},
      unit: undefined
    }
  },
  watch: {
    value: {
      handler() {
        // this.initVal()
      }
    }
  },
  computed: {
    calcWidth({ unitList }) {
      return {
        width: unitList.length ? 'calc(70% - 50px)' : 'calc(100% - 50px)'
      }
    },
    calcSelectWidth({ showUnit }) {
      return {
        width: showUnit ? '70%' : '100%'
      }
    },
    selectList() {
      const { renderOptions, searchVal, tempValue } = this
      const allItems = renderOptions.concat(tempValue)
      let filterList = []
      if (searchVal.trim()) {
        return this.searchResult
      } else {
        filterList = allItems
      }
      return filterList
    },
    isActive({ selectValue, fieldNames }) {
      return (item) => {
        const val = item[fieldNames.key]
        if (this.multiple) {
          return selectValue.some((it) => it[fieldNames.key] === val)
        } else {
          return selectValue?.[fieldNames.key] === val
        }
      }
    }
  },
  mounted() {
    this.reset()
    this.initVal()
    this.renderOptions = this.allArr.slice(0, LOAD_NUM)
    this.mapOptionValue([...this.allArr, ...this.tempValue])
  },
  methods: {
    // 选中的回显值
    formatValue(item) {
      if (!item) return
      const { mapValue, fieldNames } = this
      // 没有valueId表示是自定义增加的属性值
      if (!item.valueId) {
        return mapValue[item[fieldNames.key]]
      } else {
        return mapValue[item[fieldNames.key]]
      }
    },
    showPlaceholder() {
      const { selectValue, multiple } = this
      if (!selectValue) return true
      if (multiple) {
        return !selectValue.length
      } else {
        return !selectValue?.[this.fieldNames.key]
      }
    },
    initVal() {
      if (!this.value) return
      const customVal = this.value.filter((item) => item.valueId === 0)
      customVal.forEach((item) => {
        this.addtemp = item[this.fieldNames.label]
        this.pushTemp(true)
      })
      if (this.multiple) {
        this.selectValue = Array.isArray(this.value) ? this.value : []
      } else {
        const [first = {}] = this.value
        const [unit] = this.unitList
        const { valueUnit } = first
        this.selectValue = first
        this.unit = this.showUnit ? valueUnit : unit
      }
    },
    // 映射方法
    mapOptionValue(list = []) {
      const { key, label } = this.fieldNames
      this.mapValue =
        list &&
        list.reduce((acc, cur) => {
          acc[cur[key]] = cur[label]
          return acc
        }, {})
    },
    openDialog() {
      this.$data.open = !this.$data.open
    },
    addOrRemoveItem(flag, item) {
      // flag== true, remove item
      const { multiple } = this.$props
      if (multiple) {
        if (flag) {
          this.selectValue = this.selectValue.filter(
            (it) => it[this.fieldNames.key] !== item[this.fieldNames.key]
          )
        } else if (this.selectValue.length < this.limitCount) {
          this.selectValue.push(item)
        }
        // if (this.selectValue.length == this.limitCount) {
        //   this.$message.error('超过限制')
        // }
      } else {
        if (flag) {
          this.selectValue = {}
          this.unit = undefined
        } else {
          this.selectValue = item
          this.unit = item.valueUnit
          this.hidePopover()
        }
      }
      this.syncData()
    },
    goSearch() {
      const { allArr, searchVal, tempValue } = this
      const allItems = allArr.concat(tempValue)
      let filterList = []
      if (searchVal.trim()) {
        filterList = allItems.filter((item) => {
          return (
            item[this.fieldNames.label]
              .toLowerCase()
              .indexOf(searchVal.toLowerCase()) !== -1
          )
        })
      } else {
        filterList = allItems
      }
      this.searchResult = filterList
    },
    addTempInput() {
      this.$data.addtemping = true
    },
    // 添加一个新属性
    pushTemp(init) {
      let { addtemp, multiple, tempValue, unit } = this
      let displayValueName = addtemp
      if (this.unitList?.length) {
        displayValueName = addtemp + unit
      }
      if (addtemp) {
        // 下拉列表是否存在addtemp的值
        const optionsValueContain = this.selectList.some(
          (item) => item[this.fieldNames.label] === displayValueName
        )
        // 添加的列表值是否存在addtemp
        const tempValueContain = tempValue.some(
          (item) => item[this.fieldNames.label] === displayValueName
        )
        const val = {
          [this.fieldNames.value]: 0,
          [this.fieldNames.label]: displayValueName,
          originalValueName: addtemp,
          rawValue: addtemp,
          valueUnit: unit,
          key: `0${addtemp}`
        }
        // 不在可选，不在已选，不超限制长度，则加入已选
        if (
          !tempValueContain &&
          !optionsValueContain &&
          this.selectValue.length < this.limitCount
        ) {
          this.tempValue.push(val)
          this.selectValue = multiple ? [...this.selectValue, val] : val
        } else if (!tempValueContain && !optionsValueContain) {
          this.tempValue.push(val)
        }
        this.$data.addtemp = ''
        this.$data.addtemping = false
        this.mapOptionValue([...this.tempValue, ...this.allArr])
        const ele = this.$refs.selectContent
        const height = ele?.scrollHeight + 32
        setTimeout(() => {
          ele?.scrollTo({
            top: height,
            behavior: 'smooth'
          })
        })
        if (!init) this.syncData()
      }
    },
    onVisibleChange(visible) {
      if (!visible) {
        this.searchVal = ''
        this.goSearch()
      }
    },
    syncData() {
      let val = null
      if (this.multiple) {
        val = this.selectValue
      } else {
        val = [
          {
            ...this.selectValue,
            valueUnit: this.unit
          }
        ]
      }
      this.$emit('input', val)
      this.$emit('change', val)
    },
    hidePopover() {
      this.visible = false
      this.addtemping = false
    },
    onChange(val) {
      this.unit = val
      this.syncData()
    },
    onPopupScroll: debounce(function(e) {
      const { target } = e
      const scrollHeight = target?.scrollHeight - target?.scrollTop
      const clientHeight = target?.clientHeight
      // TODO暂时不支持搜索的loadMore
      if (scrollHeight - clientHeight <= 50) {
        if (this.searchVal === '') {
          this.loadMoreData(this.allArr)
        }
      }
    }, 200),
    // 加载更多数据到select框
    loadMoreData(dataList) {
      const renderedLen = this.renderOptions.length // 已渲染的下拉列表长度
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
        this.renderOptions = [...this.renderOptions, ...addList]
      }
    },
    reset() {
      this.tempValue = []
      this.renderOptions = []
      this.searchResult = []
      this.searchVal = ''
      this.unit = ''
    },
    // 高亮显示命中的搜索字段
    highlightText(val) {
      const { searchVal } = this
      if (searchVal) {
        const reg = new RegExp(searchVal, 'gi')
        val = val.replace(reg, (match) => {
          return '<span style="color:#FF6B38">' + match + '</span>'
        })
        return val
      }
      return val
    },
    inputChange(e) {
      const val = e.target.value
      const reg = pattern[this.inputValidationType]
      this.addtemp = val.replace(reg, '$1')
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .ant-popover {
  transform-origin: center top !important;
}
.me-select-input {
  position: relative;
  .input {
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    // line-height: 23px;
    cursor: pointer;
    background: #fff;
    min-height: 32px;
    padding-left: 11px;
    position: relative;
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    &-focued {
      z-index: 1;
    }
    .input-limit {
      display: inline-block;
    }
    .placeholder-select {
      color: #bfbfbf;
    }
    .input-suffix {
      padding: 0 10px;
      color: rgba(0, 0, 0, 0.25);
      flex: none;
      & > i {
        transition: all 0.3s;
        transform-origin: center;
        font-size: 12px;
      }
      .icon-down {
        transform: rotate(180deg);
      }
    }
    &:focus {
      border: 1px solid $primaryColor;
    }
    ul {
      padding-left: 0px;
      display: inline-flex;
      flex-wrap: wrap;
      margin: 0px;
      li {
        padding: 3px;
        div {
          position: relative;
          margin-right: 4px;
          max-width: 99%;
          padding: 0 10px 0 10px;
          overflow: hidden;
          color: rgba(0, 0, 0, 0.65);
          background-color: #fafafa;
          border: 1px solid #e8e8e8;
          border-radius: 2px;
          font-size: 14px;
        }
        span {
          transform: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        }
      }
    }
    .span {
      // padding-left: 10px;
      display: inline-block;
      padding-top: 3px;
      // font-size: 16px;
    }
  }
  .disabled-event {
    pointer-events: none;
    background-color: #f3f2f2;
    .input-value,
    .value-tag {
      color: rgba(0, 0, 0, 0.25);
    }
  }
}

.additem,
.searchval,
.allval {
  max-height: 250px;
  overflow-y: auto;
  // margin-right: -16px;
  width: calc(100% + 16px);
  ul {
    padding-left: 0px;
  }
  li {
    padding: 8px 5px;
    font-size: 14px;
    line-height: 16px;
    color: #333;
    word-break: break-word;
    word-wrap: break-word;
    list-style: none;
    cursor: pointer;
    margin-right: 15px;
    &:hover {
      color: #333;
      background-color: #fff6f0;
    }
    &.active {
      color: $primaryColor;
    }
  }
  .empty-text {
    text-align: center;
  }
}
.additem {
  border-top: 1px solid #e8e8e8;
  h3 {
    height: 35px;
    line-height: 35px;
    color: $linkColor;
    margin-bottom: 0px;
  }
  .action-icon {
    line-height: 32px;
    margin-left: 10px;
    & > i:first-child {
      margin-right: 10px;
    }
  }
}
.hand {
  cursor: pointer;
}
.me-pb-2 {
  padding-bottom: 10px;
}
.me-pt-2 {
  padding-top: 10px;
}
.me-pt-1 {
  padding-top: 5px;
}
.me-pr-2 {
  padding-right: 10px;
}
.me-status-skip {
  color: #a8a8b3;
  font-size: 12px;
}
.me-fr {
  float: right;
}
.readonly {
  cursor: no-drop !important;
  background: #f3f2f2 !important;
}
.readonlyclose {
  cursor: no-drop !important;
}
.scrollbar {
  margin: 0 auto;
}
</style>
