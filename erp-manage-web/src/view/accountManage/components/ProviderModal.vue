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
      <template #warehouse>
        <a-checkbox-group v-model="formModel.overSeasStores">
          <a-checkbox
            v-for="(li, index) of overSeasStoresList"
            :key="index"
            :value="li.code"
          >{{ li.name }}</a-checkbox>
        </a-checkbox-group>
      </template>
      <template #upload>
        <UploadImg :files-list="fileList" @change="handleChange" />
      </template>
    </SearchForm>

    <a-form layout="inline">
      <a-button type="primary" size="small" @click="addKeys">添加字段</a-button>
      <a-row v-for="(li, index) of formModel.seaReqAuths || []" :key="index">
        <a-col span="10">
          <a-form-item class="search-form-item" label="请求字段名" required>
            <a-input
              v-model.trim="li.reqAuthCode"
              allow-clear
              placeholder="请输入请求字段名"
            />
          </a-form-item>
        </a-col>
        <a-col span="10">
          <a-form-item class="search-form-item" label="请求中文名" required>
            <a-input
              v-model.trim="li.reqAuthName"
              allow-clear
              placeholder="请输入请求中文名"
            />
          </a-form-item>
        </a-col>
        <a-col span="4">
          <a-button
            type="danger"
            size="small"
            style="margin-top: 8px"
            @click="deleteKeys(index)"
          >删除</a-button>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import SearchForm from '@/components/searchForm'
import UploadImg from '@/components/uploadImg'
import {
  addSeaOverseas,
  editSeaOverseas,
  getAllOverseasStore
} from '@/api/accountManage'
const initParams = {
  seaSystemId: '',
  serviceProviderName: '',
  serviceProviderAliasName: '',
  serviceProviderIntroduction: '',
  serviceProviderOmsUrl: '',
  serviceProviderContacts: '',
  serviceProviderPhone: '',
  contractExpireTime: '',
  overSeasStores: [],
  contractUrl: '',
  serviceProviderStatus: 1,
  authorizationType: 1,
  seaReqAuths: [
    {
      reqAuthCode: '',
      reqAuthName: ''
    }
  ]
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
        ...initParams
      },
      fileList: [],
      previewImg: '',
      previewVisible: false,
      uploadUrl: '',
      overSeasStoresList: []
    }
  },
  computed: {
    title() {
      return `${this.actionType === 'edit' ? '编辑' : '新增'}海外仓服务商`
    },
    formItem() {
      const arr = [
        {
          title: '基础信息',
          span: 24
        },
        {
          itemType: 'input',
          label: '服务商名称',
          key: 'serviceProviderName',
          span: 12,
          required: true
        },
        {
          itemType: 'input',
          label: '服务商别名',
          key: 'serviceProviderAliasName',
          span: 12,
          required: true
        },
        {
          itemType: 'textarea',
          label: '服务商简介',
          span: 24,
          key: 'serviceProviderIntroduction',
          required: true
        },
        {
          itemType: 'input',
          label: 'OMS登录地址',
          key: 'serviceProviderOmsUrl',
          span: 24,
          required: true
        },
        {
          itemType: 'input',
          label: '联系人',
          key: 'serviceProviderContacts',
          span: 12,
          required: true
        },
        {
          itemType: 'input',
          label: '联系电话',
          key: 'serviceProviderPhone',
          span: 12,
          required: true
        },
        {
          itemType: 'date',
          key: 'contractExpireTime',
          label: '合同到期日',
          required: true,
          span: 12,
          itemProp: {
            valueFormat: 'YYYY-MM-DD 00:00:00'
          }
        },
        {
          slotName: 'upload',
          label: '合同附件',
          key: 'contractUrl',
          span: 12,
          required: true
        },
        {
          slotName: 'warehouse',
          label: '仓库站点',
          key: 'overSeasStores',
          span: 24,
          required: true
        },
        {
          itemType: 'radio',
          label: '服务商状态',
          key: 'serviceProviderStatus',
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
          itemType: 'radio',
          label: '授权类型',
          required: true,
          key: 'authorizationType',
          span: 24,
          itemData: [
            {
              label: '接口注册+接口授权',
              value: 1
            },
            {
              label: '接口授权',
              value: 2
            },
            {
              label: '跳转页面授权',
              value: 3
            }
          ]
        },
        {
          title: '注册授权字段',
          span: 24
        }
      ]
      return arr
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          this.getOverSeasStoresList()
        }
      }
    },
    currentObj: {
      handler(val) {
        this.setFormModel(val)
      },
      deep: true
    }
  },
  methods: {
    addKeys() {
      this.formModel.seaReqAuths.push({
        reqAuthCode: '',
        reqAuthName: ''
      })
    },
    deleteKeys(index) {
      this.formModel.seaReqAuths.splice(index, 1)
    },
    setFormModel() {
      const val = JSON.parse(JSON.stringify(this.currentObj))
      const obj = {}
      if (this.actionType === 'edit') {
        Object.entries(initParams).forEach(([key, value]) => {
          obj[key] = val[key] ?? value
        })
        obj.overSeasStores = val.enableStores || []
        this.formModel = obj
        const arr = [
          {
            uid: val.id,
            url: val.contractUrl,
            name: 'image.png',
            status: 'done'
          }
        ]
        this.fileList = val.contractUrl ? arr : []
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
    async getOverSeasStoresList() {
      try {
        const res = await getAllOverseasStore({})
        this.overSeasStoresList = res?.data
      } catch (error) {
        console.error(error)
      }
    },
    async submit(val) {
      const params = Object.assign({}, val)
      try {
        if (this.actionType === 'edit') {
          await editSeaOverseas(params)
        } else {
          await addSeaOverseas(params)
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
      this.formModel.contractUrl = this.getImgUrl(list)
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
  /deep/.ant-form-item-label {
    min-width: 90px;
  }
}
</style>
