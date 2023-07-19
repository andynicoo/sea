<template>
  <a-modal
    :visible="value"
    :width="1000"
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
      <template #forwarderLabel>
        <a-checkbox-group v-model="formModel.labels">
          <a-checkbox
            v-for="(li, index) of forwarderLabel"
            :key="index"
            :value="li.code"
          >
            {{ li.name }}
          </a-checkbox>
        </a-checkbox-group>
      </template>
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
import {
  forwarderAdd,
  forwarderEdit,
  selectForwarderLabelList
} from '@/api/usermanage'

const initParams = {
  maAccount: '',
  password: '',
  forwarderName: '',
  contacts: '',
  contactTelephone: '',
  settlementRate: '',
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
  receiveBankType: 0,
  accessLink: '',
  labels: [],
  introduction: '',
  sort: ''
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
      uploadUrl: '',
      forwarderLabel: [
        {
          code: '1',
          name: '推荐'
        },
        {
          code: '2',
          name: '热门'
        },
        {
          code: '3',
          name: 'new'
        }
      ]
    }
  },
  computed: {
    title() {
      return `${this.actionType === 'edit' ? '编辑' : '新增'}货代商`
    },
    formItem() {
      const addArr =
        this.actionType === 'add'
          ? [
              {
                itemType: 'input',
                label: '账号',
                key: 'maAccount',
                span: 12,
                required: true
              },
              {
                itemType: 'input',
                label: '初始密码',
                key: 'password',
                span: 12,
                required: true
              }
            ]
          : []
      const arr = [
        {
          title: '基础信息',
          span: 24
        },
        ...addArr,
        {
          itemType: 'input',
          label: '货代商名称',
          key: 'forwarderName',
          span: 12,
          rules: [{ required: true, message: '请输入货代商名称' }]
        },
        {
          itemType: 'input',
          label: '联系人名',
          key: 'contacts',
          span: 12,
          required: true
        },
        {
          itemType: 'radio',
          label: '账号状态',
          key: 'accountStatus',
          span: 12,
          itemData: [
            {
              label: '冻结',
              value: 0
            },
            {
              label: '正常',
              value: 1
            }
          ]
        },
        {
          itemType: 'input',
          label: '联系方式',
          key: 'contactTelephone',
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
          label: '费用扣除',
          key: 'isAutoDeduct',
          span: 12,
          itemData: [
            {
              label: '自动扣费',
              value: 1
            },
            {
              label: '手动确认',
              value: 0
            }
          ]
        },
        {
          itemType: 'textarea',
          label: '货代简介',
          span: 24,
          key: 'introduction',
          itemProp: {
            maxLength: 300,
            showCount: true,
            autoSize: {
              maxRows: 6,
              minRows: 3
            }
          }
        },
        {
          itemType: 'input',
          label: 'oms地址',
          key: 'accessLink',
          span: 12
        },
        {
          itemType: 'number',
          key: 'sort',
          label: '货代排序',
          span: 12,
          required: true,
          itemProp: {
            min: 0,
            max: 999999,
            precision: 0,
            style: {
              width: '204px'
            }
          }
        },
        {
          slotName: 'upload',
          label: '货代合同',
          key: 'agreementUrl',
          span: 12
        },
        {
          itemType: 'textarea',
          label: '货代备注',
          span: 12,
          key: 'remark',
          itemProp: {
            maxLength: 500,
            showCount: true,
            autoSize: {
              maxRows: 6,
              minRows: 3
            }
          }
        },
        {
          slotName: 'forwarderLabel',
          label: '货代标签',
          key: 'labels',
          span: 24
        },
        {
          itemType: 'radio',
          label: '结算方式',
          title: '结算信息',
          span: 12,
          key: 'settleStyle',
          itemProp: {
            disabled: this.actionType === 'edit'
            // style: {
            //   display: 'block'
            // }
          },
          itemData: [
            {
              label: '平台收款',
              value: 0
            },
            {
              label: 'api对接', //   线上收款（货代商自己收取卖家费用不经过平台）
              value: 1
            },
            {
              label: '预付收款',
              value: 2
            }
          ]
        },
        {
          itemType: 'input',
          label: '结算手续费',
          key: 'settlementRate',
          rules: [
            {
              required: true,
              pattern: /^1$|^0(?:\.[0-9]{1,4})$/,
              message: '请输入0-1的数字,支持四位小数'
            }
          ],
          span: 12,
          required: true
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
        },

        {
          itemType: 'number',
          key: 'withdrawalFee',
          label: '提现单笔费(元)',
          span: 12,
          required: true,
          itemProp: {
            min: 0,
            max: 999999,
            precision: 2,
            style: {
              width: '204px'
            }
          }
        },
        {
          itemType: 'input',
          label: '银行名称',
          key: 'receiveBank',
          required: true,
          span: 12
        },
        {
          itemType: 'input',
          label: '开户行号',
          key: 'receiveSubbranch',
          required: true,
          span: 12
        },
        {
          itemType: 'input',
          label: '银行卡号',
          key: 'receiveBankCard',
          rules: [
            { required: true, message: '请输入卡号' },
            { pattern: /^[1-9]\d{9,29}$/, message: '请输入正确的卡号' }
          ],
          span: 12
        },
        {
          itemType: 'input',
          label: '开户人名',
          key: 'receivePayee',
          required: true,
          span: 12
        }
      ]
      return arr
    }
  },
  watch: {
    currentObj: {
      handler(val) {
        this.setFormModel(val)
        // this.selectForwarderLabelList()
      },
      deep: true
    }
  },
  methods: {
    selectForwarderLabelList() {
      selectForwarderLabelList({}).then((res) => {
        console.log(res)
        this.forwarderLabel = res || []
      })
    },
    setFormModel() {
      const val = JSON.parse(JSON.stringify(this.currentObj))
      val.labels = val.labels ? val.labels.split(',') : []
      const obj = {}
      if (this.actionType === 'edit') {
        Object.entries(initParams).forEach(([key, value]) => {
          obj[key] = val[key] ?? value
        })
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
        isAutoDeduct: val.isAutoDeduct,
        isSplitCalc: val.isAutoDeduct,
        forwarderId: val.id,
        labels: val.labels.join(',')
      })
      try {
        if (this.actionType === 'edit') {
          await forwarderEdit(params)
        } else {
          await forwarderAdd(params)
        }
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
