<template>
  <div>
     <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
        
        <a-form-item :label="$t('order.addressName')
        ">
          <a-input v-decorator="['name',
              {
                rules: [{ required: true, message: $t('order.enterAddressName')
                 }]
              }]" />
        </a-form-item>
        <a-form-item :label="$t('order.sender')
        ">
          <a-input v-decorator="['addresser',
              {
                rules: [{ required: true, message: $t('order.enterSender')
                 }]
              }]" />
        </a-form-item>
        <a-form-item :label="$t('order.area')
        ">
          <a-cascader :options="options" :fieldNames="fieldNames" :placeholder="$t('order.provincialCities')
          " v-decorator="[
              'region',
              {
                rules: [{ required: true, message: $t('order.selectArea')
                 }]
              }
            ]" />
        </a-form-item>
        <a-form-item :label="$t('order.detailsAddress')
        ">
          <a-input v-decorator="['addressDetails',
              {
                rules: [{ required: true, message: $t('order.enterDetailsAddress')
                 }]
              }]" />
        </a-form-item>
        <a-form-item :label="$t('login.mobile')
        ">
          <a-input v-decorator="['phone',
              {
                rules: [{ required: true, message: $t('login.enterPhoneNumber') }]
              }]" />
        </a-form-item>
        <a-form-item :label="$t('order.postalCode')
        ">
          <a-input v-decorator="['postCode',
              {
                rules: [{ required: true, message: $t('order.enterPostalCode')
                }]
              }]" />
        </a-form-item>
        <a-form-item :label="$t('login.email')">
          <a-input v-decorator="['email']" />
        </a-form-item>
      </a-form>
      <div class="ant-modal-footer">
      <a-button @click="addressCancel">{{ $t('common.cancel') }} </a-button>
      <a-button type="primary" @click="addressOk" :loading='confirmLoading'>
        {{$t('common.ok')}}
        
      </a-button>
    </div>
  </div>
</template>

<script>
import Basic from '@/api/basic'
export default {
  
  props: {
    addressCancel: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      fieldNames:{ label: 'name', value: 'code', children: 'children' },
      options: [],
      form: this.$form.createForm(this),
      confirmLoading:false
    }
  },
  async created(){
    
    this.options = await Basic.getArea();
    this.$data.form.resetFields()
    for (var i = 0; i < this.options.length; i++) {
      if (this.options[i].children.length == 0) {
        delete this.options[i].children //解决因为省级区域没有下级市的BUG
      }
    }
  },
  mounted() {
  
  },

  methods: {
    //确定新增地址
    addressOk() {
      this.$data.form.validateFields(async (err, values) => {
        if (!err) {
          this.$props.addressCancel()
          // let res
          // this.$data.confirmLoading = true
          // res = await Storage.addStorage(values)         
          // this.confirmLoading = false
          // if (res.code === 0) {
          //   this.$Message({
          //     type: 'success',
          //     content: this.$data.isAdd? this.$t('common.addSuccess'):this.$t('common.editSuccess')
          //   })
          //   this.$data.storageVisible = false
          //   this.loadData()
          // } else {
          //   this.$Message({ type: 'error', content: `${res.message}` })
          // }
        }
      })
      
    },
    
    
  },
  beforeDestroy() {
    
  }
}
</script>

<style lang="scss" scoped>
.color-tabs-block {
  display: block;
  width: 18px;
  height: 18px;
  margin-right: 5px;
  border-radius: 2px;
}
.ant-modal-footer {
  padding: 10px 16px 0;
}
</style>


