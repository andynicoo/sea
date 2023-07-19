<template>
  <div>
    <div class="me-add-address">
      <a-button type="primary" @click="addAddressPop">{{
        $t('common.add')
      }}</a-button>
    </div>
    <a-table
      :columns="columns"
      :data-source="dataSource"
      rowKey="id"
      :pagination="false"
      :loading="tableLoading"
    >
      <template slot="address" slot-scope="text, record">
        {{ record.contacts }} {{ record.phone }} {{ record.province
        }}{{ record.city }}{{ record.region }} {{ record.street }}
        {{ record.detailedAddress }}
      </template>
      <template slot="handler" slot-scope="text, record">
        <a-button type="link" @click="delAddress(record)">
          {{ $t('common.delete') }}
        </a-button>
      </template>
    </a-table>
    <a-modal
      :title="$t('order.addressManage')"
      :visible="addAddressVisible"
      @ok="addressOk"
      @cancel="addAddressVisible = false"
      destroyOnClose
      :maskClosable="false"
      :confirm-loading="confirmLoading"
    >
      <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
        <a-form-item :label="$t('order.contacts')">
          <a-input
            placeholder="请输入"
            maxLength="100"
            v-decorator="[
              'contacts',
              {
                rules: [
                  {
                    required: true,
                    message: $t('order.pleaseInput') + $t('order.contacts')
                  }
                ]
              }
            ]"
          />
        </a-form-item>
        <a-form-item :label="$t('order.contactsPhone')">
          <a-input
            placeholder="请输入"
            maxLength="24"
            v-decorator="[
              'phone',
              {
                rules: [
                  {
                    required: true,
                    message: $t('order.pleaseInput') + $t('order.contactsPhone')
                  }
                ]
              }
            ]"
          />
        </a-form-item>
        <a-form-item :label="$t('order.area')">
          <a-cascader
            :options="options"
            :fieldNames="fieldNames"
            placeholder="请选择"
            v-decorator="[
              'area',
              {
                rules: [{ required: true, message: $t('order.selectArea') }]
              }
            ]"
            @change="areaChange"
          />
        </a-form-item>
        <a-form-item :label="$t('order.detailsAddress')">
          <a-input
            placeholder="请输入"
            maxLength="200"
            v-decorator="[
              'detailedAddress',
              {
                rules: [
                  { required: true, message: $t('order.enterDetailsAddress') }
                ]
              }
            ]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import Basic from '@/api/basic'
import Order from '@/api/order'
export default {
  props: {
    addressCancel: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      columns: [
        {
          title: this.$t('common.address'),
          dataIndex: 'address',
          key: 'address',
          scopedSlots: { customRender: 'address' }
        },
        {
          title: this.$t('common.handler'),
          dataIndex: 'handler',
          scopedSlots: { customRender: 'handler' }
        }
      ],
      dataSource: [],
      tableLoading: false,
      addAddressVisible: false,
      fieldNames: { label: 'name', value: 'code', children: 'children' },
      options: [],
      form: this.$form.createForm(this),
      areaLabel: [],
      // fieldNames:{ label: 'name', value: 'code', children: 'children' },
      // options: [],
      // form: this.$form.createForm(this),
      confirmLoading: false
    }
  },
  async created() {
    this.options = await Basic.getArea2()
    this.$data.form.resetFields()
    for (var i = 0; i < this.options.length; i++) {
      if (this.options[i].children.length == 0) {
        delete this.options[i].children //解决因为省级区域没有下级市的BUG
      }
    }

    this.getAddressList()
  },
  mounted() {},

  methods: {
    //获取地址列表
    async getAddressList() {
      this.$data.tableLoading = true
      let { data } = await Order.memberAddressList()
      this.$data.dataSource = data
      this.$data.tableLoading = false
    },
    //选择地址
    areaChange(value, selectedOptions) {
      this.$data.areaLabel = selectedOptions.map((o) => o.name)
    },
    //确定新增地址
    addressOk() {
      this.$data.form.validateFields(async (err, values) => {
        if (!err) {
          values.province = this.$data.areaLabel[0]
          values.city = this.$data.areaLabel[1]
          if (this.$data.areaLabel[2]) {
            values.region = this.$data.areaLabel[2]
          }
          values.provinceCode = values.area[0]
          values.cityCode = values.area[1]
          if (values.area[2]) {
            values.regionCode = values.area[2]
          }
          if (this.$data.areaLabel[3]) {
            values.street = this.$data.areaLabel[3]
          }
          if (values.area[3]) {
            values.streetCode = values.area[3]
          }
          this.$data.confirmLoading = true
          let res = await Order.memberAddressAdd(values)
          this.confirmLoading = false
          if (res.code == 0) {
            this.$Message({
              type: 'success',
              content: this.$t('common.addSuccess')
            })
            this.$data.addAddressVisible = false
            this.getAddressList()
          } else {
            this.$Message({ type: 'error', content: `${res.message}` })
          }
        }
      })
    },
    //新增地址
    addAddressPop() {
      this.$data.addAddressVisible = true
    },
    //删除地址
    delAddress(row) {
      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('common.deleteConfirm'),
        onOk: async () => {
          let res = await Order.memberAddressDel(row.addressId)
          if (res.code === 0) {
            this.$Message({
              type: 'success',
              content: this.$t('common.handlerSuccess')
            })
            this.getAddressList()
          } else {
            this.$Message({ type: 'error', content: `${res.message}` })
          }
        }
      })
    }
    // addressOk() {
    //   this.$data.form.validateFields(async (err, values) => {
    //     if (!err) {
    //       this.$props.addressCancel()
    //       // let res
    //       // this.$data.confirmLoading = true
    //       // res = await Storage.addStorage(values)
    //       // this.confirmLoading = false
    //       // if (res.code === 0) {
    //       //   this.$Message({
    //       //     type: 'success',
    //       //     content: this.$data.isAdd? this.$t('common.addSuccess'):this.$t('common.editSuccess')
    //       //   })
    //       //   this.$data.storageVisible = false
    //       //   this.loadData()
    //       // } else {
    //       //   this.$Message({ type: 'error', content: `${res.message}` })
    //       // }
    //     }
    //   })

    // },
  },
  beforeDestroy() {}
}
</script>

<style lang="scss" scoped>
// .color-tabs-block {
//   display: block;
//   width: 18px;
//   height: 18px;
//   margin-right: 5px;
//   border-radius: 2px;
// }
// .ant-modal-footer {
//   padding: 10px 16px 0;
// }
.me-add-address {
  text-align: right;
  margin-bottom: 10px;
}
</style>
