<template>
  <div
    class="search-form"
    :class="[formClass]"
  >
    <a-form-model
      ref="ruleForm"
      :layout="layout"
      :model="formModel"
    >
      <!-- 当只有一个输入框不能回车提交刷新网页 -->
      <input
        type="text"
        style="display: none;"
      >
      <a-row>
        <template v-for="item in formItem">
          <!-- 头部 -->
          <a-col
            v-if="item.title"
            :key="`${item.key}${item.title}`"
            :span="item.titleSpan || 24"
          >
            <div class="form-title">
              {{ item.title }}
            </div>
          </a-col>
          <a-col
            :key="item.key"
            :span="item.span || 8"
          >
            <slot
              v-if="!item.renderFormItem"
              :name="item.slot"
              :record="item"
            >
              <FormItem
                :key="item.key"
                :item="item"
                :item-data="item.itemData || []"
                :item-prop="item.itemProp"
                :form-model="formModel"
                :layout="layout"
              >
                <template :slot="item.slotName">
                  <slot
                    :name="item.slotName"
                    :record="item"
                  />
                </template>
              </FormItem>
            </slot>
            <render-expand
              v-else-if="item.renderFormItem"
              :render="item.renderFormItem"
              :text="formModel[item.key]"
              :record="item"
            />
          </a-col>
        </template>
        <div
          v-if="$scopedSlots.button"
          class="button"
        >
          <slot name="button" />
        </div>
      </a-row>
    </a-form-model>
  </div>
</template>

<script>
import FormItem from './FormItem'
import renderExpand from '../render'
export default {
  name: 'SearchFrom',
  components: {
    FormItem,
    renderExpand
  },
  props: {
    formItem: {
      type: Array,
      default: () => ([])
    },
    formModel: {
      type: Object,
      default: () => ({})
    },
    formClass: {
      type: String,
      default: ''
    },
    layout: {
      type: String,
      default: 'inline'
    }
  },
  data() {
    return {
      form: { ...this.formModel }
    }
  },
  watch: {
    formModel: {
      handler(val) {
        this.form = { ...val }
      },
      deep: true
    }
  },
  created() {
    this.form = { ...this.formModel }
  },
  methods: {
    validate() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit('submit', this.formModel)
        }
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.search-form{
    .form-title{
        font-weight: 700;
        color: #333;
        font-size: 17px;
    }
    .button{
      display: inline-block;
      margin-top: 3px;
    }
    /deep/.ant-tag-blue {
    border-color: @primary-color;
    color: @primary-color;
    background-color: rgba(255, 114, 13, 0.1);
  }
}
</style>
