<template>
  <a-modal
    :visible="value"
    :width="800"
    title="旺币分配"
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
      <template #maAccount>
        <a-input
          v-model.trim="formModel.maAccount"
          allow-clear
          placeholder="请输入请求中文名"
          @change="changeGetAccBalance"
        />
      </template>

      <template #accountType>
        <a-select
          v-model.trim="formModel.accountType"
          @change="changeGetAccBalance"
        >
          <a-select-option :value="1">ERP用户</a-select-option>
          <a-select-option :value="2">货代用户</a-select-option>
        </a-select>
      </template>

      <template #accBalance>
        <p v-if="accBalance == -1" style="color:#ccc">
          请输入正确用户账号后显示当前余额
        </p>
        <p v-else style="color: #f7622f">{{ accBalance }}元</p>
      </template>
      <template #upload>
        <UploadImg :files-list="fileList" @change="handleChange" />
      </template>
    </SearchForm>
  </a-modal>
</template>

<script>
import SearchForm from '@/components/searchForm'
import UploadImg from '@/components/uploadImg'
import { addFinanceRecord, getFinanceAccAmount } from '@/api/cashmange'
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
      formModel: {},
      fileList: [],
      previewImg: '',
      previewVisible: false,
      uploadUrl: '',
      overSeasStoresList: [],
      accBalance: -1,
      flag: true
    }
  },
  computed: {
    formItem() {
      const arr = [
        {
          slotName: 'maAccount',
          label: '用户账号',
          key: 'maAccount',
          span: 18,
          required: true
        },
        {
          slotName: 'accountType',
          label: '',
          key: 'accountType',
          span: 6,
          required: true
        },
        {
          slotName: 'accBalance',
          label: '用户余额',
          key: 'accBalance',
          span: 24
        },
        {
          itemType: 'radio',
          label: '状态',
          key: 'finStatus',
          span: 24,
          required: true,
          itemData: [
            {
              label: '入账',
              value: 1
            },
            {
              label: '出账',
              value: 2
            }
          ]
        },
        {
          label: '业务类型',
          itemType: 'select',
          key: 'finType',
          span: 24,
          required: true,
          itemData: [
            // {
            //   label: '充值',
            //   value: 0
            // },
            // {
            //   label: '代发货',
            //   value: 1
            // },
            // {
            //   label: '任务',
            //   value: 2
            // },
            // {
            //   label: '赠送',
            //   value: 3
            // },
            // {
            //   label: '提现',
            //   value: 4
            // },
            // {
            //   label: '预付提现',
            //   value: 5
            // },
            {
              label: '活动运营',
              value: 6
            },
            {
              label: '系统对账',
              value: 7
            },
            {
              label: '系统退款',
              value: 8
            }
          ]
        },
        {
          itemType: 'number',
          key: 'finAmount',
          label: '分配金额',
          span: 24,
          required: true,
          itemProp: {
            min: 0,
            max: 999999,
            precision: 2,
            style: {
              width: '200px'
            }
          }
        },
        {
          slotName: 'upload',
          label: '附件上传',
          key: 'attAddress',
          span: 12
        },
        {
          itemType: 'textarea',
          label: '分配备注',
          span: 24,
          key: 'remark'
        },
        {
          itemType: 'date',
          key: 'tradeTime',
          label: '交易时间',
          span: 24,
          itemProp: {
            valueFormat: 'YYYY-MM-DD 00:00:00'
          }
        }
      ]
      return arr
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          this.formModel = {
            maAccount: '',
            finStatus: 1,
            accountType: 1
          }
          this.accBalance = -1
        }
      }
    }
  },
  methods: {
    changeGetAccBalance() {
      if (this.formModel.maAccount.length < 4) {
        return false
      }
      if (!this.flag) {
        return false
      }
      this.flag = false
      setTimeout(() => {
        this.flag = true
        this.getFinanceAccAmount()
      }, 500)
    },
    async getFinanceAccAmount() {
      try {
        const res = await getFinanceAccAmount({
          maAccount: this.formModel.maAccount,
          accountType: this.formModel.accountType
        })
        this.accBalance = res?.data ? res?.data?.accBalance : -1
      } catch (error) {
        console.error(error)
      }
    },
    async submit(val) {
      const params = Object.assign({}, val)
      try {
        await addFinanceRecord(params)
        this.$message.success('操作成功')
        this.$emit('input', false)
        this.$emit('ok')
      } catch (error) {
        console.error(error)
      }
    },
    afterClose() {
      this.fileList = []
      this.$refs.searchForm.resetForm()
    },
    handleOk() {
      this.$refs.searchForm.validate()
    },
    handleChange(list) {
      this.formModel.attAddress = this.getImgUrl(list)
    },
    getImgUrl(list = []) {
      const arr = (list && list.map((item) => item.url)) || []
      return arr.join()
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
  padding: 0 40px;
  /deep/.ant-form-item-label {
    min-width: 110px;
  }
}
</style>
