<template>
  <div class="help-edit wrapper">
    <div class="title">{{ title }}</div>
    <SearchForm
      ref="searchForm"
      :form-item="formItem"
      :form-model="formModel"
      @submit="submit"
    >
      <template #coverUrl>
        <UploadImg @change="hanldeChange" />
      </template>
      <template #content>
        <div id="wangEditor" />
      </template>
      <template #submit>
        <div class="button-group">
          <a-button type="primary" @click="handleClick">提交</a-button>
        </div>
      </template>
    </SearchForm>
  </div>
</template>

<script>
import SearchForm from '@/components/searchForm'
import UploadImg from '@/components/uploadImg'
import E from 'wangeditor'
import { uploadImg } from '@/api/uploadImgUrl'
import { helpAdd, helpEdit, helpDetail, classifySelect } from '@/api/website'
const initFormModel = {
  imgs: '',
  status: false
}
export default {
  name: 'UsingHelpEdit',
  components: {
    SearchForm,
    UploadImg
  },
  data() {
    return {
      title: '新增教程',
      formModel: { ...initFormModel },
      classifyList: [],
      mainType: 1
    }
  },
  computed: {
    formItem({ classifyList }) {
      return [
        {
          label: '教程标题',
          itemType: 'input',
          required: true,
          span: 24,
          key: 'title',
          itemProp: {
            style: 'width:230px'
          }
        },
        {
          label: '教程分类',
          itemType: 'select',
          required: true,
          itemData: classifyList,
          itemProp: {
            style: 'width:230px'
          },
          span: 24,
          key: 'type'
        },
        {
          label: '正文内容',
          key: 'content',
          span: 24,
          rules: [{ required: true, message: '请输入正文内容' }],
          slotName: 'content'
        },
        {
          label: '访问数据',
          span: 24,
          render: (h, { text }) => <span>{text | 0}</span>
        },
        {
          label: '启用状态',
          itemType: 'switch',
          key: 'status',
          span: 24
        },
        {
          slotName: 'submit',
          span: 24
        }
      ]
    }
  },
  created() {
    if (this.$route.params.id) {
      this.title = '编辑教程'
      this.getHelpDetail()
    }
    this.getClassifySelect()
  },
  mounted() {
    this.initEditor()
  },
  methods: {
    initFormModel(data = {}) {
      this.formModel = {
        id: data.id,
        title: data.title,
        content: data.content,
        imgs: data.imgs,
        preview: data.preview,
        status: !!data.status,
        type: data.type ? Number(data.type) : undefined,
        reading: data.reading
      }
      this.editor.txt.html(data.content)
      this.filesList = [{ url: data.imgs }]
    },
    initEditor() {
      const editor = new E('#wangEditor')
      this.editor = editor
      editor.config.onchange = this.onchange
      editor.config.focus = false
      editor.config.zIndex = 0
      editor.config.uploadFileName = 'file'
      editor.config.customUploadImg = this.uploadImg
      editor.create()
    },
    async getClassifySelect() {
      try {
        const { data = [] } = await classifySelect({ mainType: this.mainType })
        this.classifyList = data && data.map(item => ({ label: item.typeName, value: item.id }))
      } catch (error) {
        console.error(error)
      }
    },
    async uploadImg(resultFiles, insertImgFn) {
      try {
        const params = new FormData()
        params.append('file', resultFiles[0])
        const { data = [] } = await uploadImg(params)
        insertImgFn(data && data.join())
      } catch (error) {
        console.error(error)
      }
    },
    async getHelpDetail() {
      try {
        const { data = {}} = await helpDetail(this.$route.params.id)
        this.initFormModel(data)
      } catch (error) {
        console.error(error)
      }
    },
    hanldeChange(list = []) {
      console.log(list)
    },
    onchange(newHhtml) {
      this.formModel.content = newHhtml
    },
    handleClick() {
      this.$refs.searchForm.validate()
    },
    async submit(val) {
      const params = {
        mainType: this.mainType,
        ...val,
        status: val.status
      }
      try {
        if (this.$route.params.id) {
          await helpEdit(params)
        } else {
          await helpAdd(params)
        }
        this.$message.success(`${this.$route.params.id ? '编辑' : '添加'}成功`)
        this.$router.push({ path: '/website/using-help/index' })
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.help-edit {
  background-color: #fff;
  height: 100%;
  padding: 0 16px;
  .title {
    height: 59px;
    line-height: 59px;
    margin: 0 -16px;
    margin-bottom: 24px;
    padding: 0 16px;
    border-bottom: 1px solid #e9e9e9;
  }
  .button-group{
    width:100%;
    display:flex;
    justify-content: flex-end;
  }
}
</style>
