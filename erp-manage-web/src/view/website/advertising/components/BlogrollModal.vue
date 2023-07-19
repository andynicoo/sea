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
    />
  </a-modal>
</template>

<script>
import SearchForm from '@/components/searchForm'
import { advertisingAdd, advertisingEdit } from '@/api/website'
const initFormModel = {
  status: true
}
const type = 1
export default {
  name: 'AdModel',
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
    },
    actionType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      title: '新增友情链接',
      formModel: { ...initFormModel },
      filesList: []
    }
  },
  computed: {
    formItem() {
      return [
        {
          label: '名称',
          itemType: 'input',
          itemProp: {
            style: 'width:230px'
          },
          key: 'name',
          span: 24,
          required: true
        },
        {
          label: '跳转链接',
          itemType: 'input',
          required: true,
          rules: [
            { required: true, message: '请输入跳转链接' }
            // {
            //   pattern: /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i,
            //   message: '请输入合法的链接'
            // }
          ],
          itemProp: {
            style: 'width:230px'
          },
          key: 'link',
          span: 24
        },
        {
          label: '排序',
          itemType: 'number',
          itemProp: {
            style: 'width:230px'
          },
          key: 'sort',
          span: 24
        },
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
        this.title = '编辑友情链接'
        this.initFormModel()
      } else {
        this.title = '新增友情链接'
      }
    }
  },
  methods: {
    initFormModel() {
      const { data } = this
      this.formModel = {
        id: data.id,
        name: data.name,
        imgs: data.imgs,
        link: data.link,
        sort: data.sort,
        advertisingId: data.advertisingId,
        advertisingDescribe: data.advertisingDescribe,
        status: !!data.status
      }
    },
    async submit(val) {
      const params = {
        ...val,
        type
      }
      try {
        if (this.actionType === 'edit') {
          await advertisingEdit(params)
        } else {
          await advertisingAdd(params)
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
    }
  }
}
</script>

<style lang="less" scoped>
.ad-form {
  /deep/.ant-form-item-label {
    min-width: 80px;
  }
}
</style>
