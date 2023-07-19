<template>
  <a-form :form="form">
    <a-form-item>
      <a-radio-group v-model="priceType">
        <a-radio :value="1">
          {{ $t('batchEdit.priceEditValid1') }}
        </a-radio>
        <a-radio :value="2">
          {{ $t('batchEdit.priceEditValid2') }}
        </a-radio>
      </a-radio-group>
    </a-form-item>
    <template v-if="priceType === 1">
      <a-form-item>
        <a-input type="number" v-decorator="['rmbPrice']" />
      </a-form-item>
    </template>
    <template v-if="priceType === 2">
      <a-form-item>
        <a-select v-model="priceMethod">
          <a-select-option :value="1">
            {{ $t('batchEdit.priceEditValid3') }}
          </a-select-option>
          <a-select-option :value="2">
            {{ $t('batchEdit.priceEditValid4') }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item>
        <a-input
          class="custom-input"
          type="number"
          :prefix="$t('batchEdit.priceEditValid5')"
          @change="onValid"
          v-decorator="['increase', { rules: methodRules('increase') }]"
        >
          <template v-slot:suffix v-if="priceMethod === 1">
            <span class="mt-1">%</span>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          class="custom-input"
          type="number"
          :prefix="$t('batchEdit.priceEditValid6')"
          @change="onValid"
          v-decorator="['decrease', { rules: methodRules('decrease') }]"
        >
          <template v-slot:suffix v-if="priceMethod === 1">
            <span class="mt-1">%</span>
          </template>
        </a-input>
      </a-form-item>
    </template>
  </a-form>
</template>

<script>
export default {
  data() {
    return {
      form: this.$form.createForm(this),
      priceType: 1, // 修改方式
      priceMethod: 1 // 增减方式
    }
  },
  methods: {
    methodRules(field) {
      const { increase, decrease } = this.$data.form.getFieldsValue()
      if (field === 'increase') {
        return [
          {
            validator: (rule, value, callback) => {
              if (value < 0 || decrease < 0)
                callback(this.$t('batchEdit.priceEditValid7'))
              if (!value && !decrease)
                callback(this.$t('batchEdit.priceEditValid8'))
              if (value && decrease)
                callback(this.$t('batchEdit.priceEditValid9'))
              callback()
            }
          }
        ]
      }
      if (field === 'decrease') {
        return [
          {
            validator: (rule, value, callback) => {
              if (increase < 0 || value < 0)
                callback(this.$t('batchEdit.priceEditValid10'))
              if (!increase && !value)
                callback(this.$t('batchEdit.priceEditValid11'))
              if (increase && value)
                callback(this.$t('batchEdit.priceEditValid12'))
              callback()
            }
          }
        ]
      }
    },
    onValid() {
      setTimeout(this.$data.form.validateFields, 10)
    },
    onSubmit() {
      this.$data.form.validateFields().then((data) => {
        let { rmbPrice, increase, decrease } = data
        let { priceMethod, priceType } = this.$data
        priceMethod = parseInt(priceMethod) || null
        priceType = parseInt(priceType) || null
        rmbPrice = parseFloat(rmbPrice) || null
        increase = parseFloat(increase) || null
        decrease = parseFloat(decrease) || null
        const params = {
          priceMethod,
          priceType,
          rmbPrice,
          increase,
          decrease
        }
        this.$emit('submit', params)
      })
    }
  }
}
</script>

<style lang="scss">
.ant-input-affix-wrapper {
}
</style>