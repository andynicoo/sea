<template>
  <div class="table-filter">
    <a-form-model
      ref="form"
      layout="inline"
      @submit="handleSubmit"
    >
      <!-- 当只有一个输入框不能回车提交刷新网页 -->
      <input
        type="text"
        style="display: none"
      >
      <template v-for="item of colItem">
        <a-form-model-item
          :key="item.key"
          :label="item.label"
          :prop="item.key"
          :rules="item.rules"
          :style="item.itemProp && item.itemProp.modelitem"
        >
          <!-- 使用默认具名插槽 -->
          <slot
            :name="item.slotName"
            :data="item"
            :itemData="item.itemData"
          >
            <!-- 输入框 -->
            <template v-if="item.itemType === 'input'">
              <a-input
                v-model.trim="formModel[item.key]"
                allow-clear
                :style="item.itemProp && item.itemProp.style"
                :placeholder="item.placeholder || `请输入${item.label}`"
                @pressEnter="$emit('submit')"
              />
            </template>
            <!-- 数字框 -->
            <template v-if="item.itemType === 'number'">
              <a-input-number
                v-model="formModel[item.key]"
                allow-clear
                v-bind="item.itemProp"
                :placeholder="item.placeholder || `请输入${item.label}`"
              />
            </template>
            <!-- 选择框 -->
            <template v-if="item.itemType === 'select'">
              <a-select
                v-model="formModel[item.key]"
                allow-clear
                show-search
                :filter-option="
                  (input, option) =>
                    option.componentOptions.children[0].text
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                "
                :get-popup-container="(node) => node.parentNode"
                :placeholder="item.placeholder || `请选择${item.label}`"
                :style="item.itemProp && item.itemProp.style"
              >
                <a-select-option
                  v-for="it in item.itemData"
                  :key="it.value"
                  :value="it.value"
                >{{ it.label }}</a-select-option>
              </a-select>
            </template>
            <!-- 时间选择 -->
            <template v-if="item.itemType === 'rangePicker'">
              <a-range-picker
                v-model="formModel[item.key]"
                dropdown-class-name="date-dropdown"
                :get-calendar-container="(node) => node.parentNode"
                :show-time="
                  (item.itemProp && item.itemProp['showTime']) || {
                    hideDisabledOptions: true,
                    defaultValue: [
                      moment('00:00:00', 'HH:mm:ss'),
                      moment('23:59:59', 'HH:mm:ss')
                    ]
                  }
                "
                :value-format="
                  (item.itemProp && item.itemProp.valueFormat) ||
                    'YYYY-MM-DD HH:mm:ss'
                "
                v-bind="item.itemProp"
                :ranges="
                  (item.itemProp && item.itemProp.ranges) || {
                    最近1天: [moment().subtract(1, 'day'), moment()],
                    最近3天: [moment().subtract(3, 'day'), moment()],
                    最近7天: [moment().subtract(1, 'week'), moment()]
                  }
                "
              />
            </template>
            <!-- 时间选择 -->
            <template v-if="item.itemType === 'rangePickerMonth'">
              <a-month-picker
                v-model="formModel[item.key]"
                placeholder="选择年月"
                format="YYYY-MM"
                class="me-range-month"
              />
              <a-select
                v-model="formModel[item.key2]"
                class="me-range-select"
                allow-clear
                :get-popup-container="(node) => node.parentNode"
                :placeholder="item.placeholder || `请选择${item.label}`"
              >
                <a-select-option
                  v-for="it in item.itemData2"
                  :key="it.value"
                  :value="it.value"
                >{{ it.label }}</a-select-option>
              </a-select>
            </template>
            <!-- 数字范围 -->
            <template v-if="item.itemType === 'numberRange'">
              <a-input
                v-model.trim="formModel[item.key]"
                v-enterIntNumber
                allow-clear
                :style="item.itemProp && item.itemProp.style"
                :placeholder="item.itemProp.placeholder || `请输入${item.label}`"
              />~
              <a-input
                v-model.trim="formModel[item.key2]"
                v-enterIntNumber
                allow-clear
                :style="item.itemProp && item.itemProp.style"
                :placeholder="item.itemProp2.placeholder || `请输入${item.label}`"
              />
            </template>
          </slot>
        </a-form-model-item>
      </template>
      <a-form-model-item style="margin-left: 10px">
        <slot name="button">
          <a-button
            type="primary"
            @click="$emit('submit')"
          >查询</a-button>
          <a-button
            class="reset"
            @click="handleReset"
          >重置</a-button>
        </slot>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import moment from 'moment'
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
      moment
    }
  },
  mounted() {
    // console.log(this.formModel, 111)
  },
  methods: {
    handleSubmit() {
      console.log('提交成功')
    },
    validate() {
      this.$refs.form.validate((val) => {
        if (val) {
          this.$emit('submit')
        }
      })
    },
    handleReset() {
      this.$emit('reset')
    }
  }
}
</script>

<style lang="less" scoped>
.table-filter {
  /deep/ .ant-select {
    min-width: 200px;
  }
  // /deep/.ant-form-item-control-wrapper {
  //   min-width: 200px;
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
}
.me-range-month {
  width: 100px !important;
}
.me-range-select {
  width: 100px !important;
  min-width: 100px !important;
}
</style>
