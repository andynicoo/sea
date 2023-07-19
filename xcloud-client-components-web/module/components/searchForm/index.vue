<template>
  <div class="me-page-search me-mb-0">
    <a-form-model ref="form" layout="inline" @submit="handleSubmit">
      <!-- 当只有一个输入框不能回车提交刷新网页 -->
      <input type="text" style="display: none" />
      <template v-for="item of colItem">
        <a-form-model-item v-if="item" :key="item.key" :label="item.label" :prop="item.key" :rules="item.rules">
          <!-- 使用默认具名插槽 -->
          <slot v-if="!item.render" :name="item.slotName" :data="item" :itemData="item.itemData">
            <!-- 输入框 -->
            <template v-if="item.itemType === 'input'">
              <a-input
                :placeholder="(item.itemProp && item.itemProp.placeholder) || '请输入'"
                v-model.trim="formModel[item.key]"
                allow-clear
                :style="item.itemProp && item.itemProp.style"
                v-bind="item.itemProp && item.itemProp"
                @pressEnter="$emit('submit')"
                class="me-w190"
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
                allow-clear
                :get-popup-container="(node) => node.parentNode"
                placeholder="请选择"
                :filter-option="selectFilter"
                v-bind="item.itemProp"
                v-on="item.itemProp"
                :dropdownMatchSelectWidth="false"
                class="me-w190"
              >
                <a-select-option v-for="it in item.itemData" :key="it.value" :value="it.value">
                  {{ it.label }}{{ it.sum ? ` (${it.sum})` : '' }}
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
                :value-format="(item.itemProp && item.itemProp.valueFormat) || 'YYYY-MM-DD'"
                class="me-w190"
              />
            </template>
            <!-- 联级选择器 -->
            <template v-if="item.itemType === 'cascader'">
              <a-cascader
                placeholder="请选择"
                v-model="formModel[item.key]"
                :show-search="{ cascaderFilter }"
                v-bind="item.itemProp"
                :change-on-select="item.itemProp.onSelect"
                v-on="item.itemProp"
                class="me-w190"
              />
            </template>
            <!-- 输入框组合 -->
            <template v-if="item.itemType === 'inputGroup'">
              <a-input-group compact>
                <a-select v-model="formModel[item.key]" v-bind="item.itemProp" placeholder="请选择">
                  <a-select-option v-for="it in item.itemData" :key="it.value" :value="it.value">
                    {{ it.label }}
                  </a-select-option>
                </a-select>
                <a-input
                  placeholder="请输入"
                  v-model.trim="formModel[item.key2]"
                  allow-clear
                  :style="item.itemProp2 && item.itemProp2.style"
                  v-bind="item.itemProp2 && item.itemProp2"
                  @pressEnter="$emit('submit')"
                  v-if="item.itemType2 === 'input'"
                />
                <a-select
                  v-model="formModel[item.key2]"
                  v-if="item.itemType2 === 'select'"
                  :style="item.itemProp2 && item.itemProp2.style"
                  v-bind="item.itemProp2 && item.itemProp2"
                  placeholder="请选择"
                >
                  <a-select-option v-for="it in item.itemData2" :key="it.value" :value="it.value">
                    {{ it.label }}
                  </a-select-option>
                </a-select>
                <a-range-picker
                  v-model="formModel[item.key2]"
                  v-bind="item.itemProp2"
                  dropdown-class-name="date-dropdown"
                  :get-calendar-container="(node) => node.parentNode"
                  :value-format="(item.itemProp2 && item.itemProp2.valueFormat) || 'YYYY-MM-DD'"
                  v-if="item.itemType2 === 'rengePicker'"
                />
              </a-input-group>
            </template>
          </slot>
          <RenderExpand v-if="item.render" :render="item.render" :text="formModel[item.key]" :record="item" />
        </a-form-model-item>
      </template>
      <a-form-model-item class="me-table-button">
        <slot name="button">
          <a-button type="primary" @click="$emit('submit')">查询</a-button>
          <a-button type="link" class="reset" @click="handleReset">重置</a-button>
        </slot>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import moment from 'moment';
import RenderExpand from './render';
export default {
  components: {
    RenderExpand,
  },
  props: {
    colItem: {
      type: Array,
      default: () => [],
    },
    formModel: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      moment,
    };
  },
  methods: {
    //联级选中器搜索配置
    cascaderFilter(inputValue, path) {
      return path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    },
    //下拉框搜索配置
    selectFilter(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
    handleSubmit() {
      console.log('提交成功');
    },
    validate() {
      this.$refs.form.validate((val) => {
        if (val) {
          console.log(val);
          this.$emit('submit');
        }
      });
    },
    handleReset() {
      this.$refs.form.resetFields();
      this.$emit('reset');
    },
  },
};
</script>

<style lang="less" scoped>
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
  border-color: #ff6b38;
  color: #ff6b38;
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
.me-page-search {
  ::v-deep .ant-form-item {
    label {
      min-width: 70px;
      display: inline-block;
    }
  }
}

.me-table-button {
  position: relative;
  top: -1px;
  margin-left: 8px;
}
</style>
