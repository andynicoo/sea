<template>
  <a-modal
    :visible="value"
    :width="800"
    :title="title"
    :after-close="afterClose"
    @ok="ok"
    @cancel="$emit('input', false)"
  >
    <SearchForm
      ref="searchForm"
      form-class="ad-form"
      :form-item="formItem"
      :form-model="formModel"
      @submit="submit"
    >
      <template #adImg>
        <UploadImg :files-list="filesList" @change="change" />
      </template>
    </SearchForm>
  </a-modal>
</template>

<script>
import SearchForm from '@/components/searchForm'
import UploadImg from '@/components/uploadImg'
import adKeyList from '../select'
import { adAdd, adEdit } from '@/api/website'
const initFormModel = {
  status: true
}
const type = 1
export default {
  name: 'AdModel',
  components: {
    SearchForm,
    UploadImg
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    },
    actionType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      title: '新增广告',
      formModel: { ...initFormModel },
      filesList: []
    }
  },
  computed: {
    formItem() {
      return [
        {
          label: '广告名称',
          itemType: 'input',
          itemProp: {
            style: 'width:230px'
          },
          key: 'name',
          span: 24,
          required: true
        },
        {
          label: '广告位置KEY',
          itemType: 'select',
          itemData: adKeyList,
          required: true,
          itemProp: {
            style: 'width:230px'
          },
          key: 'advertisingKey',
          span: 24
        },
        // {
        //   label: '广告位置描述',
        //   itemType: 'textarea',
        //   required: true,
        //   itemProp: {
        //     maxLength: 400
        //   },
        //   key: 'advertisingDescribe',
        //   span: 24
        // },
        {
          label: '启用状态',
          itemType: 'switch',
          key: 'status',
          span: 24
        }
      ]
    }
  },
  watch: {
    value(val) {
      if (this.actionType === 'edit' && val) {
        this.title = '编辑广告位'
        this.initFormModel()
      } else {
        this.title = '新增广告位'
      }
    }
  },
  methods: {
    initFormModel() {
      const { data } = this
      this.formModel = {
        id: data.id,
        name: data.name,
        advertisingKey: data.advertisingKey,
        advertisingDescribe: data.advertisingDescribe,
        status: !!data.status
      }
      this.filesList = [{ url: data.imgs }]
    },
    async submit(val) {
      const params = {
        ...val,
        type
      }
      try {
        if (this.actionType === 'edit') {
          await adEdit(params)
        } else {
          await adAdd(params)
        }
        this.$emit('ok')
        this.$emit('input', false)
      } catch (error) {
        console.error(error)
      }
    },
    ok() {
      this.$refs.searchForm.validate()
    },
    afterClose() {
      this.$refs.searchForm.resetForm()
      this.formModel = { ...initFormModel }
      this.filesList = []
    },
    change(list = []) {
      console.log(list)
      this.formModel.adImg = list
    }
  }
}
</script>

<style lang="less" scoped>
.ad-form {
  /deep/.ant-form-item-label {
    min-width: 108px;
  }
}
</style>
