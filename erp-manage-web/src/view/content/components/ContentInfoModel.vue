<template>
  <a-modal
    :visible="value"
    :title="title"
    :width="1150"
    :after-close="afterClose"
    :destroy-on-close="true"
    :closable="false"
    :get-container="getContainer"
    @ok="ok"
    @cancel="$emit('input', false)"
  >
    <SearchForm
      ref="searchForm"
      :form-item="formItem"
      :form-model="formModel"
      @submit="submit"
    />
  </a-modal>
</template>

<script>
import SearchForm from '@/components/searchForm'
import { contentUpdate, contentAdd } from '@/api/contentManage'
const initFormModel = {
  title: '',
  classifyId: undefined,
  sort: '',
  content: '',
  contentId: null
}
export default {
  components: {
    SearchForm
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    actionType: {
      type: String,
      default: 'edit'
    },
    data: {
      type: Object,
      default: () => ({})
    },
    title: {
      type: String,
      default: ''
    },
    classifySelectList: {
      type: Array,
      default: () => []
    },
    module: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      formModel: {
        ...initFormModel
      },
      editorEl: null,
      getContainer: () => document.querySelector('.wrapper')
    }
  },
  computed: {
    formItem() {
      return [
        {
          itemType: 'input',
          key: 'title',
          label: '标题',
          required: true,
          span: 24
        },
        {
          itemType: 'select',
          key: 'classifyId',
          label: '分类',
          span: 12,
          itemData: this.classifySelectList
        },
        {
          itemType: 'number',
          key: 'sort',
          label: '排序',
          span: 12,
          itemProp: {
            style: { width: '130px' }
          }
        },
        {
          itemType: 'editor',
          key: 'content',
          label: '内容',
          required: true,
          span: 24
          // slotName: 'content'
        }
      ]
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          this.setFormModel()
        }
      }
    }
  },
  methods: {
    async setFormModel() {
      if (this.actionType !== 'edit') return
      const obj = {}
      const val = this.data
      Object.entries(this.formModel).forEach(([key, value]) => {
        obj[key] = val[key]
      })
      this.formModel = obj
    },
    async ok() {
      this.$refs.searchForm.validate()
    },
    afterClose() {
      this.formModel = { ...initFormModel }
      this.$refs.searchForm.resetForm()
    },
    async submit(val) {
      const params = {
        ...val,
        module: this.module
      }
      try {
        if (this.actionType === 'edit') {
          await contentUpdate(params)
        } else {
          await contentAdd(params)
        }
        this.$message.success(
          `${this.actionType === 'edit' ? '修改' : '新增'}成功`
        )
        this.$emit('input', false)
        this.$emit('ok')
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
// /deep/ .ql-editor {
//   max-height: 300px;
//   overflow-y: auto;
// }
// /deep/ .ql-formats{
//     line-height: 1;
// }
// #editor-quill {
//   min-height: 300px;
//   height: auto;
// }
</style>
