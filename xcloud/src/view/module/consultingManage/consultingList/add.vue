<template>
  <div class="app-container">
    <div class="header-container">
      <el-link :underline="false" style="margin-bottom: 30px" @click="back"><i class="el-icon-arrow-left" style="margin-right: 6px"></i>返回列表</el-link>
      <div class="fixed-wrapper">
        <h3 style="margin-bottom: 40px; font-size: 14px; color: #333">发布文章</h3>
        <el-form :model="form" ref="formRef" :rules="ruleValidate" label-width="80px">
          <el-form-item label="资讯分类" prop="categoryId">
            <el-select style="width: 300px" size="small" v-model="form.categoryId">
              <el-option :value="item.id" :label="item.categoryName" v-for="item in categoryList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文章标题" prop="title">
            <el-input v-model="form.title" clearable maxlength="50" show-word-limit placeholder="请输入" style="width: 300px" size="small" />
          </el-form-item>
          <el-form-item label="作者" prop="author">
            <el-input v-model="form.author" clearable style="width: 300px" placeholder="请输入" size="small" maxlength="30" />
          </el-form-item>
          <el-form-item label="seo标题" prop="seoTitle">
            <el-input v-model="form.seoTitle" clearable placeholder="请输入" size="small" />
          </el-form-item>
          <el-form-item label="标签" prop="labelList">
            <el-tag v-for="item in form.labelList" :key="item.id" class="zt-mr-2">{{ item.labelName }}</el-tag>
            <el-button type="primary" @click="goEditTag">编辑标签</el-button>
          </el-form-item>
          <el-form-item label="摘要" prop="summary">
            <el-input v-model="form.summary" placeholder="请输入" type="textarea" :autosize="{ minRows: 5, maxRows: 10 }" />
          </el-form-item>
          <el-form-item label="主图" prop="mainPicUrl">
            <UploadImage ref="uploadImageRef" :imageUrl="form.mainPicUrl" :imgType="1" :imgMaxSize="5" :onSuccess="onSuccess" :on-remove="onRemove"> </UploadImage>
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <Editor :value.sync="form.content"></Editor>
          </el-form-item>
        </el-form>
      </div>
      <div class="btn-group">
        <el-button type="primary" size="small" @click="submit(1)" v-show="hasAuthority('H2_10')">保存</el-button>
        <el-button type="primary" size="small" @click="submit(0)" v-show="hasAuthority('H2_11')">立即发布</el-button>
      </div>
      <SetAttrWord ref="setattrword" @returnWords="returnWords" types="tag" :giveValue="form.labelList" />
    </div>
  </div>
</template>

<script>
import UploadImage from '@/components/UploadImage/index';
import Editor from '@/components/quillEditor/index';
import { mapMutations } from 'vuex';
import { getCategoryByModuleType } from '@/api/newApi/consultingCenter/classifiManage';
import { getNewsDocumentInfo, addNewsDocument, updateNewsDocument } from '@/api/newApi/consultingCenter/consultingManage';
import { formatEditorContent } from '@/components/quillEditor/formatEditorContent';
import SetAttrWord from '@/components/setattrword/index.vue';

export default {
  data() {
    return {
      id: this.$route.query.id || 0,
      categoryList: [],
      form: {
        author: '',
        categoryId: '',
        content: '',
        mainPicUrl: '',
        summary: '',
        title: '',
        labelList: [],
      },
      ruleValidate: {
        categoryId: [{ required: true, message: '请选择资讯分类', trigger: 'blur' }],
        title: [{ required: true, message: '请输入文字标题', trigger: 'blur' }],
        mainPicUrl: [{ required: true, message: '请上传主图', trigger: 'blur' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
        summary: [{ required: true, message: '请输入摘要', trigger: 'blur' }],
      },
    };
  },
  components: {
    UploadImage,
    Editor,
    SetAttrWord,
  },
  created() {
    this.init();
  },
  mounted() {
    document.querySelector('.ql-container').style.height = '600px';
    document.querySelector('.ql-editor').style.height = '600px';
  },
  methods: {
    goEditTag() {
      this.$refs.setattrword.dialogVisible = true;
    },
    returnWords(data) {
      this.form.labelList = data;
    },
    async init() {
      await this._getCategory();
      if (this.id) {
        this.getInfo();
      }
    },
    _getCategory() {
      // 资讯和案例发布共用一个页面，route name判定是案例发布，参数是3，否则2
      var typeNum = 2;
      if (this.$route.name === 'caseListAdd') {
        typeNum = 3;
      }
      getCategoryByModuleType(typeNum).then((res) => {
        this.categoryList = res.data;
      });
    },
    getInfo() {
      getNewsDocumentInfo(this.id).then((res) => {
        res.data.content = this.$Base64.decode(res.data.content);
        this.form = res.data;
      });
    },
    onSuccess(filelist) {
      this.form.mainPicUrl = filelist.url;
    },
    onRemove(filelist) {
      this.form.mainPicUrl = [];
    },
    submit(enabled) {
      this.$refs.formRef.validate((vaild) => {
        if (vaild) {
          let data = {
            ...this.form,
            enabled,
            content: formatEditorContent(this.form.content),
            // 资讯与案例共用页面，逻辑相同，提交的newsType参数不同
            newsType: this.$route.name === 'consultingListAdd' ? 'INFORMATION' : 'CASE',
          };
          if (!this.id) {
            // 新增
            this._addNewsDocument(data);
          } else {
            // 编辑
            this._updateNewsDocument(data);
          }
        }
      });
    },
    _addNewsDocument(data) {
      addNewsDocument(data).then((res) => {
        this.$message.success('操作成功');
        this.back();
      });
    },
    _updateNewsDocument(data) {
      updateNewsDocument({
        ...data,
        id: this.id,
      }).then((res) => {
        this.$message.success('操作成功');
        this.back();
      });
    },
    ...mapMutations(['closeTag']),
    back() {
      // this.closeTag(this.$route);
      let { name } = this.$route;
      if (name === 'consultingListAdd') {
        this.$router.push({
          path: '/consultingManage/consultingList/index',
        });
      } else {
        this.$router.push({
          path: '/consultingManage/caseList/index',
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.fixed-wrapper {
  height: calc(100vh - 295px);
  overflow-y: auto;
}
.btn-group {
  text-align: center;
  padding: 30px;
  border-top: 1px solid #f0f1f3;
}
</style>
