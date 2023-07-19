<template>
  <a-form-model
    :model="uniForm"
    :label-col="formModelData.labelCol"
    :wrapper-col="formModelData.wrapperCol"
  >
    <!--      -->
    <template v-for="(formItem, index) in formModelData.formItems">
      <a-form-model-item
        :key="index"
        :label="formItem.label"
        v-if="
          (formItem.isSlot == undefined ? true : formItem.isSlot) &&
            (formItem.if == undefined ? true : formItem.if)
        "
        :prop="formItem.key"
      >
        <!--   搜索框 -->
        <template v-if="formItem.type === 'select'">
          <a-select
            :disabled="
              formItem.disabled == undefined ? false : formItem.disabled
            "
            v-model="uniForm[formItem.key]"
            @change="selectChange"
            :placeholder="'请选择' + formItem.label"
          >
            <a-select-option
              v-for="(selectItem, index) in formItem.data"
              :value="selectItem.value"
              :key="index"
            >
              {{ selectItem.name }}
            </a-select-option>
          </a-select>
        </template>
        <!--  span  -->
        <template v-if="formItem.type === 'span'">
          <span> {{ formItem.data }}</span>
        </template>
        <!--p-->
        <template v-if="formItem.type === 'p'">
          <p>{{ formItem.data }}</p>
        </template>
        <!--   a-checkbox -->
        <template v-if="formItem.type === 'checkbox' && formItem.data != null">
          <a-checkbox
            default-checked
            :disabled="
              formItem.disabled == undefined ? false : formItem.disabled
            "
            v-for="(checkItem, index) in formItem.data"
            :key="index"
          >
            {{ checkItem.name }}
          </a-checkbox>
        </template>

        <!-- input-->
        <template v-if="formItem.type === 'input'">
          <a-input
            v-model="uniForm[formItem.key]"
            :disabled="
              formItem.disabled == undefined ? false : formItem.disabled
            "
            v-decorator="[formItem.key, { rules: formItem.rules }]"
          />
        </template>
      </a-form-model-item>

      <slot
        v-if="formItem.isSlot == undefined ? false : formItem.isSlot"
        :name="formItem.key"
      ></slot>
    </template>
  </a-form-model>
</template>

<script>
export default {
  name: 'UniFormModel',
  props: {
    formModelData: {
      type: Object,
      default: () => ({})
    }
  },
  watch: {
    formModelData(newVal, oldVal) {
      this.uniForm = {}
      const formItems = newVal.formItems
      this.change(formItems)
      // this.form[new]
    }
  },

  data() {
    return {
      uniForm: {},
      rules: {}
    }
  },
  mounted() {
    let that = this
    this.$nextTick(function() {
      that.change(this.formModelData.formItems)
    })
  },
  methods: {
    selectChange(value) {
      this.$emit('selectChange', value)
    },
    change(formItems) {
      const temp = {}
      formItems.map((item) => {
        if (item.type === 'input' && typeof item.data == 'string') {
          temp[item.key] = item.data
          console.log(this.uniForm)
        }
        if (item.type === 'select') {
          temp[item.key] = item.default
        }
      })
      this.uniForm = temp
    }
  }
}
</script>

<style scoped></style>
