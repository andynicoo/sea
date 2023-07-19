<template>
  <a-modal
    title="支付渠道编辑"
    :visible="value"
    :after-close="afterClose"
    :closable="false"
    @ok="ok"
    @cancel="$emit('input', false)"
  >
    <SearchForm
      ref="searchForm"
      form-class="money-form"
      :form-item="formItem"
      :form-model="formModel"
      @submit="submit"
    >
      <template #applyPort>
        <a-checkbox-group v-model="formModel.applyPort">
          <a-checkbox
            v-for="(li, index) of applyPortList"
            :key="index"
            :value="li.code"
          >
            {{ li.name }}
          </a-checkbox>
        </a-checkbox-group>
      </template>
    </SearchForm>
  </a-modal>
</template>

<script>
import SearchForm from '@/components/searchForm'
import { editPayConfig } from '@/api/payManage'

export default {
  components: {
    SearchForm
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formModel: {},
      applyPortList: [
        {
          code: 'pc',
          name: 'PC端'
        },
        {
          code: 'H5',
          name: 'H5'
        },
        {
          code: 'official_account',
          name: '公众号'
        },
        {
          code: 'applet',
          name: '小程序'
        },
        {
          code: 'app',
          name: 'app'
        }
      ],
      optionalChannelList: [
        {
          value: 'aliPay',
          label: '阿里支付'
        },
        {
          value: 'wxPay',
          label: '微信'
        },
        {
          value: 'xsPay',
          label: '新生支付'
        },
        {
          value: 'mideaPay',
          label: '美的支付'
        }
      ]
    }
  },
  computed: {
    formItem({ data }) {
      let arr = [
        {
          key: 'name',
          label: '支付方式名称',
          span: 24,
          render: (h, { text }) => {
            return <span>{text}</span>
          }
        },
        {
          itemType: 'textarea',
          key: 'introduce',
          label: '介绍',
          span: 24,
          required: true,
          itemProp: {
            showCount: true,
            maxLength: 50
          }
        },
        // {
        //   itemType: 'input',
        //   key: 'introduce',
        //   label: '介绍',
        //   span: 24
        // },
        {
          label: '支付渠道',
          itemType: 'select',
          key: 'channel',
          itemProp: {
            style: 'width:383px'
          },
          required: true,
          itemData: this.optionalChannelList.filter((li) => {
            return (data.optionalChannel || '').indexOf(li.value) !== -1
          })
        },
        {
          slotName: 'applyPort',
          label: '适用端口',
          key: 'applyPort',
          span: 24,
          required: true
        },
        {
          itemType: 'radio',
          label: '是否启用',
          key: 'status',
          span: 24,
          required: true,
          itemData: [
            {
              label: '启用',
              value: 1
            },
            {
              label: '停用',
              value: 0
            }
          ]
        },
        {
          itemType: 'number',
          key: 'sort',
          label: '排序',
          itemProp: {
            style: 'width:383px'
          },
          span: 24
        }
      ]

      return arr
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val) this.setFormModel()
      }
    }
  },
  created() {},
  methods: {
    async ok() {
      this.$refs.searchForm.validate()
    },
    setFormModel() {
      this.formModel = JSON.parse(JSON.stringify(this.data))
      this.formModel.applyPort = this.formModel.applyPort
        ? this.formModel.applyPort.split(',')
        : []
    },
    afterClose() {
      this.formModel = {}
      this.$refs.searchForm.resetForm()
    },
    async submit(val) {
      try {
        let params = JSON.parse(JSON.stringify(this.formModel))
        params.applyPort = params.applyPort.join(',')
        console.log(params)
        await editPayConfig(params)
        this.$emit('input', false)
        this.$message.success('操作成功')
        this.$emit('ok')
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.money-form {
  /deep/.ant-form-item-label {
    min-width: 80px;
  }
}
</style>
