<template>
  <a-form-model
    class="me-custom-model"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 18 }"
    :model="form"
    :rules="rules"
  >
    <!-- 定价模板 start -->
    <a-form-model-item prop="template">
      <template slot="label">
        <a-radio :checked="form.type === 1" @change="onChange(1)">
          使用定价模板
        </a-radio>
      </template>
      <a-select
        :disabled="form.type !== 1"
        placeholder="请选择"
        v-model="form.template"
      >
        <div slot="dropdownRender" slot-scope="menu">
          <a class="action" @click="toUrl('/goods/create-pricing-template')">
            <a-icon type="plus" />
            创建模版
          </a>
          <a class="action" @click="toUrl('/goods/pricing-template')">
            <a-icon type="unordered-list" />
            管理模版
          </a>
          <a-divider style="margin: 4px 0" />
          <v-nodes :vnodes="menu" />
        </div>
        <a-select-option
          v-for="template in templates"
          :key="template.id"
          :value="template.json"
        >
          {{ template.name }}
        </a-select-option>
      </a-select>
    </a-form-model-item>
    <!-- 定价模板 end -->

    <!-- 统一价 start -->
    <a-form-model-item prop="price">
      <template slot="label">
        <a-radio :checked="form.type === 2" @change="onChange(2)">
          使用统一价
        </a-radio>
      </template>
      <a-input
        type="number"
        v-model="form.price"
        :addon-before="site.currency"
        :disabled="form.type !== 2"
      />
    </a-form-model-item>
    <!-- 统一价 end -->

    <!-- 公式 start -->
    <a-form-model-item>
      <template slot="label">
        <a-radio :checked="form.type === 3" @change="onChange(3)">
          使用公式
        </a-radio>
      </template>

      <a-form-model-item
        label="当前售价"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 19 }"
      >
        <span>x</span>
        <a-input
          type="number"
          class="min-inpit"
          suffix="%"
          v-model="form.multiplyNum"
          :disabled="form.type !== 3"
        />
        <span>+</span>
        <a-input
          type="number"
          class="min-inpit"
          v-model="form.addNum"
          :disabled="form.type !== 3"
        />
        <span>-</span>
        <a-input
          type="number"
          class="min-inpit"
          v-model="form.subtractNum"
          :disabled="form.type !== 3"
        />
      </a-form-model-item>

      <a-form-model-item
        label="价格取整"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 19 }"
      >
        <a-radio-group :disabled="form.type !== 3" v-model="form.integerType">
          <a-radio :value="1">四舍五入</a-radio>
          <a-radio :value="2">向上取整</a-radio>
          <a-radio :value="3">向下取整</a-radio>
        </a-radio-group>
      </a-form-model-item>

      <a-form-model-item
        label="保留小数"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 19 }"
      >
        <a-radio-group :disabled="form.type !== 3" v-model="form.integerType">
          <a-radio :value="4">保留1位小数</a-radio>
          <a-radio :value="5">保留2位小数</a-radio>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model-item>
    <!-- 公式 end -->
  </a-form-model>
</template>

<script>
import Goods from '@/api/goods'
import router from '@/router'

export default {
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  props: {
    site: Object
  },
  data() {
    return {
      form: {
        type: 1,
        multiplyNum: 100
      },
      rules: {},
      templates: []
    }
  },
  mounted() {
    const { countryCode } = this.$props.site
    Goods.getPriductPriceTemplateList(countryCode).then(({ data }) => {
      this.$data.templates = data.map((ele) => ({
        ...ele,
        json: JSON.stringify(ele)
      }))
    })
  },
  methods: {
    onChange(value) {
      this.$data.form.type = value
    },
    toUrl(url) {
      router.push(url)
      this.$emit('destroy')
    },
    getForm() {
      let { template, addNum, multiplyNum, subtractNum, price } = this.form
      if (template) template = JSON.parse(template)
      if (!Number.isNaN(Number(addNum))) addNum = Number(addNum)
      if (!Number.isNaN(Number(multiplyNum))) multiplyNum = Number(multiplyNum)
      if (!Number.isNaN(Number(subtractNum))) subtractNum = Number(subtractNum)
      if (!Number.isNaN(Number(price))) price = Number(price)
      return {
        ...this.form,
        template,
        addNum,
        multiplyNum,
        subtractNum,
        price
      }
    }
  }
}
</script>

<style lang="less" scoped>
.action {
  display: block;
  padding: 4px 10px;
  cursor: pointer;
  color: #ff4a4a;

  &:first-child {
    color: #f86a3b;
    margin-top: 5px;
  }
}

.min-inpit {
  width: 75px;
  margin: 0 5px;
}
</style>

<style lang="less">
.me-custom-model {
  .ant-form-item {
    margin-bottom: 0;

    .ant-form-item-label {
      text-align: left;

      .ant-radio-wrapper {
        margin-right: 0;
      }
    }
  }
}
</style>
