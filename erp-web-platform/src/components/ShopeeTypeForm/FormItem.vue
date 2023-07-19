<template>
  <a-form-model-item
    :key="item.key"
    class="shopee-search-form-item"
    :class="suffix"
    :label="item.label"
    :rules="checkRules(item, formModel[item.key])"
    :prop="item.key"
    :colon="colon"
  >
    <!-- 下拉(可能有组合性) -->
    <template
      v-if="
        includesType(item.inputType, [
          'COMBO_BOX',
          'DROP_DOWN',
          'MULTIPLE_SELECT_COMBO_BOX',
          'MULTIPLE_SELECT'
        ])
      "
    >
      <SelectAdd
        v-model="formModel[item.key]"
        :multiple="
          includesType(item.inputType, [
            'MULTIPLE_SELECT_COMBO_BOX',
            'MULTIPLE_SELECT'
          ])
        "
        :showUnit="showUnit(item)"
        :allArr="item.optionsList"
        :disabled="!!item.disabled"
        :custom="
          includesType(item.inputType, [
            'COMBO_BOX',
            'MULTIPLE_SELECT_COMBO_BOX'
          ])
        "
        placeholder="请选择"
        :unitList="item.attributeUnit"
        :inputValidationType="item.inputValidationType"
        :fieldNames="{
          label: 'displayValueName',
          value: 'valueId',
          key: 'key'
        }"
      ></SelectAdd>
    </template>
    <!-- 输入框(可能有单位) -->
    <template
      v-if="
        item.inputType === 'TEXT_FILED' && item.attributeType != 'DATE_TYPE'
      "
    >
      <CustomInput
        v-model="formModel[item.key]"
        :unitList="item.attributeUnit"
        :inputValidationType="item.inputValidationType"
        :sourceData="item"
        :disabled="item.disabled"
        placeholder="请输入"
      />
    </template>
    <!-- 时间 -->
    <template
      v-if="item.inputType == 'TEXT_FILED' && item.attributeType == 'DATE_TYPE'"
    >
      <DateSelect
        v-model="formModel[item.key]"
        :disabled="item.disabled"
        :item="item"
      ></DateSelect>
    </template>
  </a-form-model-item>
</template>

<script>
import SelectAdd from './SelectAdded.vue'
import CustomInput from './CustomInput.vue'
import DateSelect from './DateSelect.vue'
export default {
  components: {
    SelectAdd,
    CustomInput,
    DateSelect
  },
  props: {
    item: {
      type: Object,
      defautl: () => ({})
    },
    itemInfo: {
      type: Object,
      default: () => ({})
    },
    formModel: {
      type: Object,
      default: () => ({})
    },
    colon: {
      type: Boolean,
      default: true
    },
    layout: {
      type: String
    }
  },
  data() {
    return {
      editType: this.$route?.query.edit
    }
  },
  computed: {
    suffix({ layout }) {
      return layout !== 'vertical' ? 'shopee-search-form-item-right' : ''
    }
  },
  methods: {
    checkRules(item, value) {
      const arr = ['TEXT_FILED']
      const flag = arr.some(
        (it) => item.inputType === it || item.attributeType === 'DATE_TYPE'
      )
      if (item.isMandatory) {
        return [
          {
            required: true,
            message: `${flag ? '请输入' : '请选择'}${item.label}`
          }
        ]
      }
    },
    includesType(type, arr = []) {
      return arr.some((item) => item === type)
    },
    showUnit(item) {
      let flag = this.includesType(item.inputType, ['DROP_DOWN'])
      return flag && item.formatType === 'QUANTITATIVE'
    }
  }
}
</script>

<style lang="scss">
.shopee-search-form-item {
  width: 100%;
  &-right {
    .ant-form-item-label {
      justify-content: flex-end;
    }
  }
  .ant-form-item-label {
    display: flex;
    align-items: center;
    // justify-content: flex-end;
    // flex-wrap: wrap;
    line-height: 20px;
    padding-right: 8px;
    height: 40px;
    & > label {
      white-space: break-spaces;
      text-align: right;
      &::after {
        margin-right: 0;
      }
    }
  }
}
// .search-form-item {
//   width: 100%;
//   display: flex;
//   margin-bottom: 24px;
//   ::v-deep.ant-form-item-label {
//     flex: none;
//     min-width: 70px;
//   }
//   ::v-deep.ant-form-item-control-wrapper {
//     // flex: 1;
//     // padding-right: 6px;
//     .ant-form-explain {
//       position: absolute;
//     }
//   }
//   .textarea-count {
//     position: absolute;
//     right: 0;
//     bottom: -15px;
//     line-height: 1;
//     color: rgba(0, 0, 0, 0.45);
//   }
// }
</style>
