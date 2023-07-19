<template>
  <div class="me-page-search">
    <div
      v-for="item of colItem"
      :key="item.key"
      class="me-search-item"
      :class="{ 'me-search-txt': item.itemType2 == 'inputSearch' }"
    >
      <!-- 使用默认具名插槽 -->
      <span class="me-search-label">{{ item.label }}：</span>
      <slot
        v-if="!item.render"
        :name="item.slotName"
        :data="item"
        :itemData="item.itemData"
      >
        <!--平铺-->
        <template v-if="item.itemType === 'tile'">
          <div class="me-tile-box">
            <span
              v-for="it in item.itemData"
              :key="it.value"
              class="me-tile-item me-tile-radio"
              :class="{ active: formModel[item.key] == it.value }"
              @click="tileChange(it, formModel, item.key)"
            >
              {{ it.label }}
            </span>
          </div>
        </template>
        <!--checkout平铺-->
        <template v-if="item.itemType === 'tileCheck'">
          <div class="me-tile-box">
            <a-checkbox
              v-for="it in item.itemData"
              :key="it.value"
              v-model="it.check"
              @change="(e) => tileCheckChange(e, it, item, formModel)"
            >
              {{ it.label }}
            </a-checkbox>
          </div>
        </template>
        <!--日期平铺-->
        <template v-if="item.itemType === 'tileDate'">
          <span
            v-for="it in item.itemData"
            :key="it.value"
            class="me-tile-item me-tile-radio"
            :class="{ active: formModel[item.key2] == it.value }"
            @click="tileDateChange(it, formModel, item)"
          >
            <span>{{ it.label }}</span>
          </span>
          <a-range-picker
            v-if="formModel[item.key2] == '9'"
            v-model="formModel[item.key]"
            v-bind="item.itemProp2 && item.itemProp2"
            class="me-date-picker"
            @change="(d1, d2) => pickerChange(d1, d2, formModel, item.key)"
          />
        </template>
        <!-- 输入框 -->
        <template v-if="item.itemType === 'input'">
          <a-input
            v-model.trim="formModel[item.key]"
            :placeholder="
              (item.itemProp && item.itemProp.placeholder) || '请输入'
            "
            allow-clear
            :style="item.itemProp && item.itemProp.style"
            v-bind="item.itemProp && item.itemProp"
            class="me-w190"
            @pressEnter="$emit('submit')"
          />
        </template>
        <!-- 数字框 -->
        <template v-if="item.itemType === 'number'">
          <a-input-number
            v-model="formModel[item.key]"
            allow-clear
            v-bind="item.itemProp"
            placeholder="请输入"
            class="me-w190"
          />
        </template>
        <!-- 选择框 -->
        <template v-if="item.itemType === 'select'">
          <a-select
            v-model="formModel[item.key]"
            :get-popup-container="(node) => node.parentNode"
            placeholder="请选择"
            :filter-option="selectFilter"
            v-bind="item.itemProp"
            class="me-w190"
            v-on="item.itemProp"
            @change="$emit('submit', formModel)"
          >
            <a-select-option
              v-for="it in item.itemData"
              :key="it.value"
              :value="it.value"
            >
              {{ it.label }}
            </a-select-option>
          </a-select>
        </template>
        <!-- 时间选择 -->
        <template v-if="item.itemType === 'rengePicker'">
          <a-range-picker
            v-model="formModel[item.key]"
            v-bind="item.itemProp"
            dropdown-class-name="date-dropdown"
            :get-calendar-container="(node) => node.parentNode"
            :value-format="
              (item.itemProp && item.itemProp.valueFormat) || 'YYYY-MM-DD'
            "
            class="me-w190"
          />
        </template>
        <!-- 联级选择器 -->
        <template v-if="item.itemType === 'cascader'">
          <a-cascader
            v-model="formModel[item.key]"
            placeholder="请选择"
            :show-search="{ cascaderFilter }"
            v-bind="item.itemProp"
            :change-on-select="item.itemProp.onSelect"
            class="me-w190"
            v-on="item.itemProp"
          />
        </template>
        <!-- 输入框组合 -->
        <template v-if="item.itemType === 'inputGroup'">
          <a-input-group compact>
            <a-select
              v-model="formModel[item.key]"
              v-bind="item.itemProp"
              placeholder="请选择"
            >
              <a-select-option
                v-for="it in item.itemData"
                :key="it.value"
                :value="it.value"
              >
                {{ it.label }}
              </a-select-option>
            </a-select>
            <a-input
              v-if="item.itemType2 === 'input'"
              v-model.trim="formModel[item.key2]"
              placeholder="请输入"
              allow-clear
              :style="item.itemProp2 && item.itemProp2.style"
              v-bind="item.itemProp2 && item.itemProp2"
              @pressEnter="$emit('submit')"
            />
            <a-select
              v-if="item.itemType2 === 'select'"
              v-model="formModel[item.key2]"
              :style="item.itemProp2 && item.itemProp2.style"
              v-bind="item.itemProp2 && item.itemProp2"
              placeholder="请选择"
            >
              <a-select-option
                v-for="it in item.itemData2"
                :key="it.value"
                :value="it.value"
              >
                {{ it.label }}
              </a-select-option>
            </a-select>
            <a-range-picker
              v-if="item.itemType2 === 'rengePicker'"
              v-model="formModel[item.key2]"
              v-bind="item.itemProp2"
              dropdown-class-name="date-dropdown"
              :get-calendar-container="(node) => node.parentNode"
              :value-format="
                (item.itemProp2 && item.itemProp2.valueFormat) || 'YYYY-MM-DD'
              "
            />
            <a-input-search
              v-if="item.itemType2 === 'inputSearch'"
              v-model.trim="formModel[item.key2]"
              placeholder="请输入"
              :style="item.itemProp2 && item.itemProp2.style"
              v-bind="item.itemProp2 && item.itemProp2"
              class="me-w190"
              enter-button="搜索"
              allow-clear
              @pressEnter="$emit('submit')"
              @search="$emit('submit', formModel)"
            />
            <!-- @search="onSearch" -->
          </a-input-group>
        </template>
      </slot>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
// import RenderExpand from './render'
import { compact } from 'lodash'
export default {
  components: {
    // RenderExpand
  },
  props: {
    colItem: {
      type: Array,
      default: () => []
    },
    formModel: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      moment,
      // 自定义日期
      customDate: ''
    }
  },
  methods: {
    // 平铺checkbox
    tileCheckChange(e, it, item, formModel) {
      // console.log(it, item)
      it.check = e.target.checked
      if (it.value === 'all') {
        item.itemData.forEach((store) => {
          store.check = it.check
        })
      } else {
        let checkLen = 0
        item.itemData.forEach((store, index) => {
          if (index > 0 && store.check) {
            checkLen += 1
          }
        })
        if (checkLen === item.itemData.length - 1) {
          item.itemData[0].check = true
        } else {
          item.itemData[0].check = false
        }
      }

      formModel[item.key] = compact(
        item.itemData.map((store) => {
          if (store.check) {
            return store.value
          }
        })
      )
      this.$emit('submit', formModel)
    },
    // 平铺切换选项
    tileChange(it, formModel, key) {
      formModel[key] = it.value
      this.$emit('submit', formModel)
    },
    // 日期平铺切换选项
    tileDateChange(it, formModel, item) {
      formModel[item.key2] = it.value
      switch (it.value) {
        case 1:
          formModel[item.key] = moment().format('YYYY-MM-DD')
          break
        case 2:
          formModel[item.key] = moment()
            .subtract(1, 'days')
            .format('YYYY-MM-DD')
          break
        case 3:
          formModel[item.key] = [
            moment().subtract(6, 'days').format('YYYY-MM-DD'),
            moment().format('YYYY-MM-DD')
          ]
          break
        case 4:
          formModel[item.key] = [
            moment().subtract(29, 'days').format('YYYY-MM-DD'),
            moment().format('YYYY-MM-DD')
          ]
          break
        case 7:
          formModel[item.key] = this.getCurrMonthDays()
          break
        case 8:
          formModel[item.key] = this.getLastMonthDays()
          break
        default:
          formModel[item.key] = []
      }
      if (it.value < 9) this.$emit('submit', formModel)
    },
    // 自定义日期
    pickerChange(d1, d2, formModel, key) {
      formModel[key] = d2
      this.$emit('submit', formModel)
    },
    // 联级选中器搜索配置
    cascaderFilter(inputValue, path) {
      return path.some(
        (option) =>
          option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
      )
    },
    // 下拉框搜索配置
    selectFilter(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    // 获取上一个月的开始结束时间
    getLastMonthDays() {
      let date = []
      let start = moment().subtract('month', 1).format('YYYY-MM') + '-01'
      let end = moment(start)
        .subtract('month', -1)
        .add('days', -1)
        .format('YYYY-MM-DD')
      date.push(start)
      date.push(end)
      return date
    },
    // 获取当前月的开始结束时间
    getCurrMonthDays() {
      let date = []
      let start = moment().add('month', 0).format('YYYY-MM') + '-01'
      let end = moment().format('YYYY-MM-DD')
      date.push(start)
      date.push(end)
      if (moment(end).diff(start, 'day') < 7) {
        date = [
          moment().subtract(6, 'days').format('YYYY-MM-DD'),
          moment().format('YYYY-MM-DD')
        ]
      }
      // console.log(moment(end).diff(start, 'day'))
      return date
    }
  }
}
</script>

<style lang="less" scoped>
.me-search-item {
  display: flex;
  align-items: flex-start;
  padding-bottom: 15px;
}
.me-search-label {
  min-width: 100px;
}
.me-tile-box {
  display: flex;
  flex-wrap: wrap;
  ::v-deep .ant-checkbox-wrapper {
    margin-bottom: 5px !important;
  }
}
.me-tile-item {
  font-size: 14px;
  margin-right: 20px;
  display: inline-block;
  cursor: pointer;
}
.active {
  // font-weight: bold;
  // color: #ff6b38;
}

/deep/ .ant-calendar-picker .ant-input {
  background-color: #fff;
}
// /deep/ .ant-select {
//   min-width: 190px;
// }
/deep/.ant-calendar-picker {
  width: 240px;
}
/deep/.ant-tag-blue {
  border-color: @primary-color;
  color: @primary-color;
  background-color: rgba(255, 114, 13, 0.1);
}
/deep/.ant-select-dropdown-menu {
  padding-left: 0;
}
.reset {
  margin-left: 12px;
}
.me-w190 {
  width: 190px;
}
.me-w290 {
  width: 290px;
}
.me-page-search {
  padding: 10px 20px 24px;
  ::v-deep .ant-form-item {
    label {
      min-width: 70px;
      display: inline-block;
    }
  }
}
.me-search-txt {
  border-top: 1px solid #e8eaec;
  padding-top: 16px;
}
.me-tile-box {
  /deep/.ant-checkbox-wrapper + .ant-checkbox-wrapper {
    margin: 0;
    margin-right: 8px;
  }
}
.me-tile-radio {
  position: relative;
  &::before {
    content: '';
    display: inline-block;
    width: 16px;
    height: 16px;
    background-color: #fff;
    border: 1px solid #d9d9d9;
    border-radius: 50%;
    top: 3px;
    position: relative;
    margin-right: 8px;
  }
  &:hover {
    &::before {
      border-color: #ff6b38;
    }
  }
}
.me-tile-radio.active {
  &::before {
    border-color: #ff6b38;
  }
  &::after {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: #fff;
    background: #ff6b38;
    border-radius: 50%;
    top: 7px;
    left: 4px;
    position: absolute;
    margin-right: 8px;
  }
}
.me-date-picker {
  position: relative;
  top: -5px;
  left: -10px;
}
</style>
