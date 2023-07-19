<template>
  <div class="main">
    <Spin size="large" fix v-if="loading"></Spin>
    <h2 style="margin-bottom: 20px;">地址管理</h2>
    <Form :model="formData" label-position="top" style="width: 500px;" ref="formAddress">
      <FormItem v-for="(form, index) in formOptions" :key="index" :prop="form.prop" :label="form.label" :rules="form.rules">
        <Input v-if="form.type==='input'" v-model="formData[form.prop]" :placeholder="form.placeholder" />
        <Cascader @on-change="cityChange" :data="city" v-if="form.type==='Cascader'" v-model="cityArr"></Cascader>
        <Checkbox v-if="form.type==='checkbox'" v-model="formData[form.prop]">
          <span>设置为默认收货地址</span>
        </Checkbox>
      </FormItem>
    </Form>
    <hr />
    <div style="margin-top: 20px;">
      <Button type="primary" @click="handleSubmit('formAddress')">保存收货地址</Button>
      <Button @click="$router.push('/address')">取消</Button>
    </div>
  </div>
</template>
<script>
import city from './city.json'
import { handleAddress } from '@/api/address/index.js'
export default {
  name: 'AddressEdit',
  data() {
    const validatePass = (rule, value, callback) => {
      if (!value.length) {
        callback(new Error('必填项'));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      cityArr: [],
      formData: {
        name: '',
        mobile: '',
        cityCodeArr: [],
        citiesCode: [],
        detailAddress: '',
        postalCode: '',
        defaultFlag: false,
      },
      formOptions: [
        {
          type: 'input',
          label: '收货人姓名',
          rules: {
            required: true,
            message: '必填项',
            trigger: 'blur'
          },
          prop: 'name',
          placeholder: '请输入收货人姓名'
        },{
          type: 'input',
          label: '手机号码',
          rules: {
            required: true,
            message: '必填项',
            trigger: 'blur'
          },
          prop: 'mobile',
          placeholder: '请输入手机号码'
        },{
          type: 'Cascader',
          label: '省份地区',
          rules: {
            required: true,
            validator: validatePass,
            trigger: 'change'
          },
          prop: 'cityCodeArr',
          placeholder: '请选择地区'
        },{
          type: 'input',
          label: '详细地址',
          rules: {
            required: true,
            message: '必填项',
            trigger: 'blur'
          },
          prop: 'detailAddress',
          placeholder: '请填写详细地址'
        },{
          type: 'input',
          label: '邮编',
          rules: {
            required: false,
          },
          prop: 'postalCode',
          placeholder: '请填写邮编'
        },{
          type: 'checkbox',
          label: '',
          rules: {
            required: false,
          },
          prop: 'defaultFlag'
        }
      ],
      city,
      addressId: this.$route.query.addressId
    }
  },
  methods: {
    getUserAddressDetail(addressId) {
      this.loading = true
      handleAddress({ addressId }, 'detail')
      .then(res=> {
        if(res.code === 0) {
          const data = res.data
          this.formData.cityCodeArr.push({
            value: data.provinceCode,
            label: data.province
          })
          this.formData.cityCodeArr.push({
            value: data.cityCode,
            label: data.city
          })
          this.formData.cityCodeArr.push({
            value: data.regionCode,
            label: data.region
          })
          this.formData = Object.assign({}, this.formData, data)
          this.formData.defaultFlag = Boolean(res.data.defaultFlag)
          data.streetCode && this.formData.cityCodeArr.push({
            value: data.streetCode,
            label: data.street
          })
          this.cityArr = this.formData.cityCodeArr.map(v=> v.value)
        }
        this.loading = false
      })
      .catch(err=> {
        console.log(err);
        this.loading = false
      })
    },
    cityChange(val, select) {
      this.cityArr = val
      this.formData.cityCodeArr = select
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let type = 'add'
          this.loading = true
          let { name, mobile, detailAddress, postalCode, defaultFlag, cityCodeArr } = this.formData
          let provinceCode = cityCodeArr?.[0]?.value || '', // 省code
              cityCode = cityCodeArr?.[1]?.value || '', // 市code
              regionCode = cityCodeArr?.[2]?.value || '',   // 区code
              streetCode = cityCodeArr?.[3]?.value || '',  // 街道code
              province = cityCodeArr?.[0]?.label || '', // 省名称
              cityName = cityCodeArr?.[1]?.label || '', // 市名称
              region = cityCodeArr?.[2]?.label || '', // 区名称
              street = cityCodeArr?.[3]?.label || ''; // 街道名称
          let send_params = {
            name,
            mobile,
            detailAddress,
            postalCode,
            defaultFlag: defaultFlag ? 1 : 0,
            provinceCode,
            cityCode,
            regionCode,
            streetCode,
            province,
            region,
            street,
            city: cityName,
          }
          if(this.addressId) {
            send_params.userAddressId = this.addressId
            type = 'update'
          }
          handleAddress({
            ...send_params
          }, type).then(res=> {
            if(res.code === 0 && res.data) {
              this.$Message.success('保存成功')
              this.$router.push('/address')
            }
            this.loading = false
          })
          .catch(err=> {
            this.$Message.error(err.message)
          })
          .finally(()=> {
            this.loading = false
          })
        } else {
          this.$Message.error('请填写完整信息~');
        }
      })
    },
  },
  mounted() {
    // 获取详情
    if(this.addressId) {
      this.getUserAddressDetail(this.addressId)
    }
  }
}
</script>
<style lang="less" scoped>
.main {
  margin: 24px;
  padding: 24px;
  background: #fff;
  position: relative;
}
</style>
