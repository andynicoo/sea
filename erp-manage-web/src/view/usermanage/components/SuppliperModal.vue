<template>
  <a-modal
    :visible="value"
    :width="800"
    :title="title"
    :after-close="afterClose"
    :body-style="{ height: '650px', overflow: 'auto' }"
    @cancel="$emit('input', false)"
    @ok="handleOk"
  >
    <SearchForm
      ref="searchForm"
      :form-item="formItem"
      :form-model="formModel"
      form-class="forwarder-form"
      @submit="submit"
    >
      <template #upload>
        <UploadImg
          :files-list="fileList"
          @change="handleChange"
        />
      </template>
    </SearchForm>
  </a-modal>
</template>

<script>
import SearchForm from '@/components/searchForm'
import UploadImg from '@/components/uploadImg'
import { forwarderAdd, erpSupplierEdit } from '@/api/usermanage'
import { cloneDeep } from 'lodash'

const initParams = {
  maAccount: '',
  forwarderName: '',
  contacts: '',
  contactTelephone: '',
  settlementRate: '',
  settleRate: 0,
  accountStatus: 0,
  isAutoDeduct: 0,
  isInternalTest: 0,
  withdrawalFee: '',
  isSplitCalc: false, // 预留默认为true
  remark: '',
  agreementUrl: '',
  settleStyle: 0,
  receiveBank: '',
  receiveSubbranch: '',
  receiveBankCard: '',
  receivePayee: '',
  id: '',
  receiveBankType: 0
  //   forwarderId: initParams.id
}
export default {
  components: {
    SearchForm,
    UploadImg
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    currentObj: {
      type: Object,
      default: () => {}
    },
    actionType: {
      type: String,
      default: 'edit'
    }
  },
  data() {
    return {
      formModel: {
        // isSplitCalc: 1
        ...initParams
      },
      fileList: [],
      previewImg: '',
      previewVisible: false,
      uploadUrl: ''
    }
  },
  computed: {
    title() {
      return `${this.actionType === 'edit' ? '编辑' : '新增'}供应商`
    },
    formItem() {
      const arr = [
        {
          title: '基础信息',
          span: 24
        },
        {
          itemType: 'input',
          label: '供应商名称',
          key: 'forwarderName',
          span: 12,
          rules: [{ required: true, message: '请输入供应商名称' }]
        },
        {
          itemType: 'input',
          label: '联系人',
          key: 'contacts',
          span: 12,
          required: true
        },
        {
          itemType: 'input',
          label: '联系方式',
          key: 'contactTelephone',
          span: 12,
          required: true
        },
        {
          itemType: 'input',
          label: '结算手续费',
          key: 'settlementRate',
          rules: [
            {
              required: true,
              pattern: /^[0-9]*$/,
              message: '请输入数字'
            }
          ],
          span: 12,
          required: true
        },
        {
          itemType: 'input',
          label: '分润比例',
          key: 'settleRate',
          rules: [
            {
              required: true,
              pattern: /^[0-9]*$/,
              message: '请输入0-100的数字'
            }
          ],
          suffix: '%',
          span: 12,
          required: true
        },
        {
          itemType: 'input',
          label: '提现单比手续费(元)',
          key: 'withdrawalFee',
          rules: [
            {
              required: true,
              pattern: /^[0-9]*$/,
              message: '请输入数字'
            }
          ],
          span: 12,
          required: true
        },
        {
          itemType: 'radio',
          label: '是否内测',
          key: 'isInternalTest',
          span: 12,
          itemData: [
            {
              label: '是',
              value: 1
            },
            {
              label: '否',
              value: 0
            }
          ]
        },
        {
          itemType: 'radio',
          label: '账号状态',
          key: 'accountStatus',
          span: 12,
          itemData: [
            {
              label: '正常',
              value: 1
            },
            {
              label: '冻结',
              value: 0
            }
          ]
        },
        {
          itemType: 'radio',
          label: '服务费自动取',
          key: 'isAutoDeduct',
          span: 12,
          itemData: [
            {
              label: '是',
              value: 1
            },
            {
              label: '否',
              value: 0
            }
          ]
        },
        {
          title: '基础信息 ',
          span: 24
        },
        {
          slotName: 'upload',
          label: '合同',
          key: 'agreementUrl',
          span: 24
        },
        {
          title: '结算信息',
          span: 24
        },
        {
          itemType: 'input',
          label: '银行',
          key: 'receiveBank',
          required: true,
          span: 12
        },
        {
          itemType: 'input',
          label: '开户行',
          key: 'receiveSubbranch',
          required: true,
          span: 12
        },
        {
          itemType: 'input',
          label: '卡号',
          key: 'receiveBankCard',
          rules: [
            { required: true, message: '请输入卡号' },
            { pattern: /^[1-9]\d{9,29}$/, message: '请输入正确的卡号' }
          ],
          span: 12
        },
        {
          itemType: 'input',
          label: '开户人',
          key: 'receivePayee',
          required: true,
          span: 12
        },
        {
          itemType: 'radio',
          label: '开户类型',
          key: 'receiveBankType',
          span: 12,
          required: true,
          itemData: [
            {
              label: '企业',
              value: 0
            },
            {
              label: '个人',
              value: 1
            }
          ]
        }
      ]
      return arr
    }
  },
  watch: {
    currentObj: {
      handler(val) {
        console.log(val)
        this.setFormModel(val)
      },
      deep: true
    }
  },
  methods: {
    setFormModel() {
      var val = cloneDeep(this.currentObj)
      val.settleRate = val.settleRate * 100
      val.isAutoDeduct ? (val.isAutoDeduct = 1) : (val.isAutoDeduct = 0)
      console.log(this.currentObj)
      const obj = {}
      if (this.actionType === 'edit') {
        Object.entries(initParams).forEach(([key, value]) => {
          obj[key] = val[key] ?? value
        })
        // obj[]
        this.formModel = obj
        this.fileList = val.agreementUrl
          ? [
              {
                uid: val.id,
                url: val.agreementUrl,
                name: 'image.png',
                status: 'done'
              }
            ]
          : []
      }
    },
    afterClose() {
      this.fileList = []
      this.$emit('update:currentObj', {})
      this.$refs.searchForm.resetForm()
    },
    handleOk() {
      this.$refs.searchForm.validate()
    },
    getImgUrl(list = []) {
      const arr = (list && list.map((item) => item.url)) || []
      return arr.join()
    },
    async submit(val) {
      const params = Object.assign({}, val, {
        // isAutoDeduct: !!val.isAutoDeduct,
        // isSplitCalc: !!val.isAutoDeduct,
        forwarderId: val.id
      })
      if (params.settleRate < 0 || params.settleRate > 100) {
        this.$message.error('分润比例请输入0-100的数字')
        return
      }
      params.settleRate = params.settleRate / 100
      console.log(params)

      // return
      try {
        await erpSupplierEdit(params)
        this.$message.success(
          `${this.actionType === 'edit' ? '修改' : '新增'}成功`
        )
        this.$emit('input', false)
        this.$emit('ok')
      } catch (error) {
        console.error(error)
      }
    },
    handleChange(list) {
      this.formModel.agreementUrl = this.getImgUrl(list)
    }
  }
}
</script>

<style lang="less" scoped>
.img-box {
  display: flex;
  width: 100%;
  max-height: 600px;
  align-items: center;
  justify-content: center;
}

.forwarder-form {
  /deep/ .ant-form-item-label {
    min-width: 90px;
  }
}
</style>
