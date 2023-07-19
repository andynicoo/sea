<template>
  <a-row class="ant-advanced-search-form">
    <a-col :span="18">
      <a-form :form="form" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col
            v-for="i in 10"
            :key="i"
            :span="8"
            :style="{ display: i < count ? 'block' : 'none' }"
          >
            <a-form-item :label="`Field ${i}`">
              <a-input
                v-decorator="[
                  `field-${i}`,
                  {
                    rules: [
                      {
                        required: true,
                        message: 'Input something!'
                      }
                    ]
                  }
                ]"
                placeholder="placeholder"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-col>

    <a-col :span="6" class="submit">
      <a-button type="primary" html-type="submit">
        搜索
      </a-button>
      <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
        重置
      </a-button>
      <a :style="{ marginLeft: '8px', fontSize: '12px' }" @click="toggle">
        {{ expand ? '收起' : '展示' }}<a-icon :type="expand ? 'up' : 'down'" />
      </a>
    </a-col>
  </a-row>
</template>
<script>
export default {
  data() {
    return {
      expand: false,
      form: this.$form.createForm(this, { name: 'advanced_search' })
    }
  },
  computed: {
    count() {
      return this.expand ? 11 : 4
    }
  },
  updated() {
    console.log('updated')
  },
  methods: {
    handleSearch(e) {
      e.preventDefault()
      this.form.validateFields((error, values) => {
        console.log('error', error)
        console.log('Received values of form: ', values)
      })
    },
    handleReset() {
      this.form.resetFields()
    },

    toggle() {
      this.expand = !this.expand
    }
  }
}
</script>
<style>
.ant-advanced-search-form {
  padding: 24px;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  margin: 10px;
}

.ant-advanced-search-form .ant-form-item {
  display: flex;
}

.ant-advanced-search-form .ant-form-item-control-wrapper {
  flex: 1;
}
#components-form-demo-advanced-search .ant-advanced-search-form .submit {
  display: flex;
  align-content: center;
  justify-content: center;
}
#components-form-demo-advanced-search .ant-advanced-search-form .submit a {
  display: flex;
  justify-items: center;
  align-items: center;
  margin-top: 3px;
}
#components-form-demo-advanced-search .ant-form {
  max-width: none;
}
#components-form-demo-advanced-search .search-result-list {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 200px;
  text-align: center;
  padding-top: 80px;
}
</style>
