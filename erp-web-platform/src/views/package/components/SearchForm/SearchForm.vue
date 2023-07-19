<template>
  <div id='components-form-demo-advanced-search'>
    <a-row class='ant-advanced-search-form'>
      <a-col :span='18'>
        <a-form @submit='handleSearch' :label-col='{ span: 8 }' :wrapper-col='{ span: 8 }' :model='form'>
          <a-row :gutter='24'>
            <a-col
              v-for='(formItem,index) in formItemList'
              :key='index'
              :span='formItem.span===undefined?8:formItem.span'
              :style="{ display: index < count ? 'block' : 'none' }"
            >
              <a-form-item :label='formItem.label'
                           :prop='formItem.dataIndex'
              >
                <template  v-if="formItem.type === 'input' || typeof formItem.type === 'undefined'">
                  <a-input
                    v-model='form[formItem.dataIndex]'
                    :placeholder="'请输入'+formItem.label"
                  />
                </template>

                <template   v-if="formItem.type === 'a-select'" >
                  <a-select
                    @change='formItem.change'   v-model:value='form[formItem.dataIndex]'>
                    <a-select-option v-for='(selectItem, selectIndex) of formItem.data' :key='selectItem.id' v-model='selectItem.id'>
                      {{ selectItem.name }}
                    </a-select-option>
                  </a-select>
                </template>
              </a-form-item>

            </a-col>
          </a-row>
        </a-form>
      </a-col>

      <a-col :span='6' class='submit'>
        <a-button type='primary' html-type='submit' @click='submit'>
          搜索
        </a-button>
        <a-button :style="{ marginLeft: '8px' }" @click='handleReset'>
          重置
        </a-button>
        <a :style="{ marginLeft: '8px', fontSize: '12px' }" @click='toggle'>
          {{ expand ? '收起' : '展示' }}
          <a-icon :type="expand ? 'up' : 'down'" />
        </a>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import SearchFormItem from './SearchFormItem'

export default {
  components: { SearchFormItem },
  props: {
    formItemList: {
      type: Array,
      default: []
    },
   initData:{
      type:Object,
      default: {}
   },
    form:{
      type:Object,
      default:{}
    }

  },
  watch: {
    initData(newVal, oldVal) {
      const temp = { ...newVal}
      this.form = temp
    }
  },

  data() {
    return {
      expand: false,
      // form: {},
    }
  },
  computed: {
    count() {
      return this.expand ? 11 : 4
    },
    getLogistics() {

    }
  },
  beforeCreate() {


  },
  updated() {
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

      this.$emit('handleReset', this.form)
      // this.form.resetFields()
    },
    submit() {
      this.$emit('submit', this.form)
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