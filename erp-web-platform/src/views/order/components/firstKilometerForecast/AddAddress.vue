<template>
  <div>
    <!-- 新增地址表单 -->
    <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
      <a-form-item label="姓名">
        <a-input
          placeholder="请输入"
          v-decorator="[
            'name',
            {
              rules: [{ required: true, message: '请输入姓名' }]
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="国家/地区">
        <a-select
          placeholder="请选择"
          show-search
          :filter-option="filterOption"
          @change="countryChange"
          label-in-value
          v-decorator="[
            'countryFull',
            {
              rules: [{ required: true, message: '请选择国家/地区' }],
              initialValue: countryCode
            }
          ]"
        >
          <a-select-option v-for="item in countryList" :key="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="手机号码">
        <a-input
          placeholder="请输入"
          :addon-before="areaCode"
          :maxLength="20"
          v-decorator="[
            'phone',
            {
              rules: [{ required: true, message: '请输入手机号码' }]
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="城市/行政区" v-if="cityList.length">
        <a-cascader
          :options="cityList"
          :fieldNames="fieldNames"
          placeholder="请选择"
          @change="cityChange"
          v-decorator="[
            'city',
            {
              rules: [{ required: true, message: '请选择城市' }]
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="邮编" v-if="cityList.length">
        <a-input
          placeholder="请输入"
          :maxLength="20"
          v-decorator="[
            'zipcode',
            {
              rules: [{ required: true, message: '请输入邮编' }]
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="详细地址">
        <a-textarea
          placeholder="例如：林荫大街88号等更详细地址"
          :rows="4"
          v-decorator="[
            'address',
            {
              rules: [
                { required: true, message: $t('order.enterDetailsAddress') }
              ]
            }
          ]"
        />
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import Basic from '@/api/basic'
import Order from '@/api/order'
// import globalAddressJson from '@/util/globalAddressJson.js'
import areaCodeJson from '@/util/areaCode.js'
import { cloneDeep } from 'lodash'
export default {
  data() {
    return {
      fieldNames: { label: 'name', value: 'code', children: 'children' }, //联级选择器属性转换
      countryList: [
        {
          id: '7',
          pid: '1',
          path: ',1,7,',
          level: '2',
          name: '中国大陆',
          name_en: 'China',
          name_pinyin: 'zhongguo',
          code: 'CN'
        }
      ], //国家列表
      cityList: [], //省城市区列表
      form: this.$form.createForm(this), //表单实例
      regionLabel: '', //区域文本
      areaCode: '+86', //手机区号
      countryCode: { key: '7', label: '中国大陆' }
    }
  },
  async created() {
    //地区数据处理
    this.cityList = await Basic.getArea()
    this.$data.form.resetFields()
    for (var i = 0; i < this.cityList.length; i++) {
      if (this.cityList[i].children.length == 0) {
        delete this.cityList[i].children //解决因为省级区域没有下级市的BUG
      }
    }
    // this.options = globalAddressJson
    // this.options.forEach((ele) => {
    //   this.countryList.push(...ele.childrens)
    // })
    //重置表单
    this.$data.form.resetFields()
  },

  methods: {
    //省市改变
    cityChange(value, selectedOptions) {
      console.log(value, selectedOptions)
      if (!value.length) return
      selectedOptions.forEach((ele) => {
        this.$data.regionLabel += ele.name
      })
    },
    //国家下拉搜索配置
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    //选择国家
    countryChange(val) {
      console.log(val)
      let areaCodeItem = areaCodeJson.find((item) =>
        val.label.includes(item.city)
      )
      this.$data.areaCode = areaCodeItem ? areaCodeItem.code : ''
      let sourceCityList = this.countryList.find((item) => item.id == val.key)
      console.log(sourceCityList)
      if (sourceCityList.childrens) {
        for (var i = 0; i < sourceCityList.childrens.length; i++) {
          if (
            sourceCityList.childrens[i].childrens &&
            sourceCityList.childrens[i].childrens.length == 0
          ) {
            delete sourceCityList.childrens[i].childrens //解决因为省级区域没有下级市的BUG
          }
        }
        this.cityList = sourceCityList.childrens
      } else {
        this.cityList = []
      }
    },
    //确定新增地址
    addressOk() {
      return new Promise((resolve) => {
        this.$data.form.validateFields(async (err, values) => {
          if (!err) {
            let formValue = cloneDeep(values)
            formValue.fullAddress = this.$data.regionLabel + values.address
            formValue.country = values.countryFull.label
            formValue.region = values.countryFull.key
            formValue.city = values.city.join()
            delete formValue.countryFull
            try {
              await Order.addFirstMileAddress(formValue)
              this.$Message({
                type: 'success',
                content: this.$t('common.handlerSuccess')
              })
              resolve(true)
            } catch (err) {
              resolve(false)
            }
            resolve(true)
          } else {
            resolve(false)
          }
        })
      })
    }
  },
  beforeDestroy() {}
}
</script>
