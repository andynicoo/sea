<template>
  <div class="news-edit wrapper">
    <div class="title">{{ title }}</div>
    <SearchForm
      ref="searchForm"
      :form-item="formItem"
      :form-model="formModel"
      form-class="news-form"
      @submit="submit"
    >
      <template #coverUrl>
        <UploadImg :files-list="filesList" tips="建议190*120px" @change="hanldeChange" />
      </template>
      <template #content>
        <!-- <div id="wangEditor" /> -->
        <WangEditor :value="formModel.content" @change="(val)=>formModel.content = val.trim()" />
      </template>
      <template #submit>
        <div class="button-group">
          <a-button type="primary" @click="$refs.searchForm.validate()">确认</a-button>
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
  imgs: '',
  status: true,
  content: ''
}
export default {
  name: 'NewsEdit',
  components: {
    SearchForm,
    UploadImg,
    WangEditor
  },
  data() {
    return {
      title: '发布动态',
      formModel: { ...initFormModel },
      uploadImgUrl: '',
      classifyList: [],
      filesList: []
    }
  },
  computed: {
    formItem({ classifyList }) {
      return [
        {
          label: '文章标题',
          itemType: 'input',
          required: true,
          span: 24,
          key: 'title',
          itemProp: {
            style: 'width:230px'
          }

        },
        {
          label: '文章分类',
          itemType: 'select',
          required: true,
          itemData: classifyList,
          span: 24,
          key: 'type',
          itemProp: {
            style: 'width:230px'
          }
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
          // required: true,
          rules: [{ required: true, message: '请输入正文内容' }],
          span: 24
          // slotName: 'content'
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
          key: 'reading',
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
          span: 24,
          slotName: 'submit'
        }
      ]
    }
  },
  created() {
    if (this.$route.params.id) {
      this.title = '编辑动态'
      this.getNewsDetail()
    }
    this.getClassifySelect()
  },
  mounted() {
    // this.initEditor()
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
      this.filesList = [{ url: data.imgs }]
    },
    async getClassifySelect() {
      try {
        const { data = [] } = await classifySelect({ mainType })
        this.classifyList = data && data.map(item => ({ label: item.typeName, value: item.id }))
      } catch (error) {
        console.error(error)
      }
    },
    async getNewsDetail() {
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
    async submit(val) {
      const params = {
        mainType,
        ...val,
        status: val.status
      }
      try {
        if (this.$route.params.id) {
          await newsOrCashEdit(params)
        } else {
          await newsOrCashAdd(params)
        }
        this.$message.success(`${this.$route.params.id ? '编辑' : '添加'}成功`)
        this.$router.push({ path: '/website/news/index' })
      } catch (error) {
        console.error(error)
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    if (to.params.id) {
      to.meta.title = '编辑动态'
    } else {
      to.meta.title = '发布动态'
    }
    next()
  }
}
</script>

<style lang="less" scoped>
.news-edit {
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
.news-form {
  /deep/ .ant-form-item-label {
    min-width: 94px;
  }
}
</style>
