<template>
  <div class="app-container">
    <div class="header-container">
      <el-link :underline="false" style="margin-bottom: 30px" @click="back"><i class="el-icon-arrow-left" style="margin-right: 6px"></i>返回列表</el-link>
      <div class="fixed-wrapper">
        <h3 style="margin-bottom: 40px;font-size: 14px; color: #333">基本信息</h3>
        <el-form
          :model="form"
          ref="formRef"
          :rules="ruleValidate"
          label-width="80px"
        >
          <el-form-item label="分类名称" prop="categoryId">
            <el-select
              style="width: 200px"
              size="small"
              v-model="form.categoryId"
            >
              <el-option :value="item.id" :label="item.categoryName" v-for="item in categoryList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="指引标题" prop="title">
            <el-input
              v-model="form.title"
              clearable
              maxlength="50"
              show-word-limit
              placeholder="请输入文章标题"
              style="width: 300px"
              size="small"
            />
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <Editor :value.sync="form.content"></Editor>
          </el-form-item>
        </el-form>
      </div>
      <div class="btn-group">
        <el-button type="primary" size="small" @click="submit(1)" v-show="hasAuthority('H2_17')">保存</el-button>
        <el-button type="primary" size="small" @click="submit(0)" v-show="hasAuthority('H2_18')">立即发布</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Editor from '@/components/quillEditor/index'
import { mapMutations } from "vuex";
import {getCategoryByModuleType} from '@/api/newApi/consultingCenter/classifiManage'
import {getOperationDocumentInfo, addOperationDocument, updateOperationDocument} from '@/api/newApi/consultingCenter/operationInstru'
import {formatEditorContent} from '@/components/quillEditor/formatEditorContent'
export default {
  data() {
    return {
      id: this.$route.query.id || 0,
      categoryList: [],
      form: {
        categoryId: '',
        content: '',
        title: ''
      },
      ruleValidate: {
        categoryId: [{required: true, message: '请选择资讯分类', trigger: 'blur'}],
        title: [{required: true, message: '请输入文字标题', trigger: 'blur'}],
        content: [{required: true, message: '请输入内容', trigger: 'blur'}],
      }
    }
  },
  components: {
    Editor
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      await this._getCategory()
      if(this.id) {
        this.getInfo()
      }
    },
    _getCategory() {
      getCategoryByModuleType(1).then(res => {
        this.categoryList = res.data
      })
    },
    getInfo() {
      getOperationDocumentInfo(this.id).then(res => {
        res.data.content = this.$Base64.decode(res.data.content)
        this.form = res.data
      })
    },
    submit(enabled) {
      this.$refs.formRef.validate(vaild => {
        if(vaild) {
          let data = {
            ...this.form,
            enabled,
            content: formatEditorContent(this.form.content)
          }
          if(!this.id) {
            // 新增
            this._addOperationDocument(data)
          } else {
            // 编辑
            this._updateOperationDocument(data)
          }
        }
      })
    },
    _addOperationDocument(data) {
      addOperationDocument(data).then(res => {
        this.$message.success('操作成功')
        this.back()
      })
    },
    _updateOperationDocument(data) {
      updateOperationDocument({
        ...data,
        id: this.id
      }).then(res => {
        this.$message.success('操作成功')
        this.back()
      })
    },
    ...mapMutations(["closeTag"]),
    back() {
      this.closeTag(this.$route)
      this.$router.push({
        path: '/consultingManage/operationInstru/index'
      })
    },
  }
}
</script>

<style lang="less" scoped>
.fixed-wrapper {
  height: calc(100vh - 295px);
  overflow-y: auto;
}
.btn-group {
  text-align: center;
  padding: 30px;
  border-top: 1px solid #F0F1F3;
}
</style>