<template>
  <div class="case-edit wrapper">
    <div class="title">{{ title }}</div>
    <SearchForm
      ref="searchForm"
      :form-item="formItem"
      :form-model="formModel"
      form-class="case-form"
      @submit="submit"
    >
      <template #coverUrl>
        <UploadImg :files-list="filesList" tips="建议380*180px" @change="hanldeChange" />
      </template>
      <template #content>
        <WangEditor v-model.trim="formModel.content" />
      </template>
      <template #submit>
        <div class="button-group">
          <a-button type="primary" @click="handleClick">确认</a-button>
        </div>
      </template>
    </SearchForm>
  </div>
</template>

<script>
import SearchForm from '@/components/searchForm'
import UploadImg from '@/components/uploadImg'
import WangEditor from '@/components/wangEditor'
import { classifySelect, newsOrCashAdd, getNewsOrCashDetail, newsOrCashEdit } from '@/api/website'
import { mainType } from './mainType'
const initFormModel = {
  status: true,
  imgs: '',
  content: ''
}
export default {
  name: 'Edit',
  components: {
    SearchForm,
    UploadImg,
    WangEditor
  },
  data() {
    return {
      title: '新增案例',
      formModel: { ...initFormModel },
      classifyList: [],
      filesList: [],
      mainType
    }
  },
  computed: {
    formItem({ classifyList }) {
      return [
        {
          label: '案例名称',
          itemType: 'input',
          required: true,
          span: 24,
          itemProp: {
            style: 'width:230px'
          },
          key: 'title'
        },
        {
          label: '案例分类',
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
          label: '标签',
          itemType: 'select',
          key: 'tags',
          itemProp: {
            style: 'width:230px',
            mode: 'tags',
            maxTagTextLength: 8
          },
          required: true,
          span: 24
        },
        {
          label: '预览内容',
          itemType: 'textarea',
          required: true,
          itemProp: {
            maxLength: 400,
            showCount: true
          },
          span: 24,
          key: 'preview'
        },
        {
          label: '正文内容',
          itemType: 'editor',
          key: 'content',
          span: 24,
          rules: [{ required: true, message: '请输入正文内容' }],
          slotName: 'content'
        },
        {
          label: '上传封面图',
          span: 24,
          required: true,
          key: 'imgs',
          slotName: 'coverUrl'
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
  beforeRouteEnter(to, from, next) {
    if (to.params.id) {
      to.meta.title = '编辑案例'
    } else {
      to.meta.title = '新增案例'
    }
    next()
  },
  created() {
    if (this.$route.params.id) {
      this.title = '编辑案例'
      this.getCaseDetail()
    }
    this.getClassifySelect()
  },
  mounted() {
  },
  methods: {
    selectChange(val) {
      console.log(val)
    },
    initFormModel(data = {}) {
      this.formModel = {
        id: data.id,
        title: data.title,
        content: data.content,
        imgs: data.imgs,
        preview: data.preview,
        status: !!data.status,
        type: data.type ? Number(data.type) : undefined,
        reading: data.reading,
        tags: data.tags ? data.tags.split(',') : []
      }
      this.filesList = [{ url: data.imgs }]
    },
    async getClassifySelect() {
      try {
        const { data = [] } = await classifySelect({ mainType: this.mainType })
        this.classifyList = data && data.map(item => ({ label: item.typeName, value: item.id }))
      } catch (error) {
        console.error(error)
      }
    },
    async getCaseDetail() {
      try {
        const { data = {}} = await getNewsOrCashDetail(this.$route.params.id)
        this.initFormModel(data)
      } catch (error) {
        console.error(error)
      }
    },
    hanldeChange(list = []) {
      this.formModel.imgs = list && list.map(item => item.url).join()
    },
    handleClick() {
      this.$refs.searchForm.validate()
    },
    async submit(val) {
      const params = {
        mainType: this.mainType,
        ...val,
        status: val.status,
        tags: val.tags ? val.tags.join() : ''
      }
      try {
        if (this.$route.params.id) {
          await newsOrCashEdit(params)
        } else {
          await newsOrCashAdd(params)
        }
        this.$message.success(`${this.$route.params.id ? '编辑' : '添加'}成功`)
        this.$router.push({ path: '/website/case/index' })
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.case-edit {
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
    display: flex;
    justify-content: flex-end;
  }
}
.case-form{
  /deep/.ant-form-item-label{
    min-width: 94px;
  }
}
</style>
