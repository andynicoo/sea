<template>
  <div>
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="seo标题" prop="seoTitle">
        <el-input v-model="ruleForm.seoTitle" placeholder="请输入标题名称"></el-input>
        <p class="tip">
          <i class="el-icon-warning"></i>显示于页面meat title
        </p>
      </el-form-item>
      <el-form-item label="关键词" prop="keyword">
        <el-input v-model="ruleForm.keyword" placeholder="请输入关键词"></el-input>
        <p class="tip">
          <i class="el-icon-warning"></i>显示于页面meat keywords
        </p>
        <p>
          请使用英文逗号","分割
        </p>
      </el-form-item>
      <el-form-item label="描述" prop="seoDescribe">
        <el-input type="textarea" v-model="ruleForm.seoDescribe" placeholder="请输入描述内容" :rows="6"></el-input>
        <p class="tip">
          <i class="el-icon-warning"></i>显示于页面meat description
        </p>
      </el-form-item>
      <el-form-item>
        <div style="text-align: right;">
          <el-button @click="resetForm('ruleForm')">取消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')" :loading="submiting">确认</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 导航管理设置seo
import { editSeo } from '@/api/newApi/siteSettings/index.js';
// 资讯管理 分类管理设置seo
import { setCategorySeo } from '@/api/newApi/consultingCenter/classifiManage'
import {
  editTagsSeo
} from '@/api/newApi/consultingCenter/consultingManage';

export default {
  data() {
    return {
      submiting: false,
      ruleForm: {
        seoTitle: '',
        keyword: '',
        seoDescribe: '',
        navId: null,
        id: null
      },
    };
  },
  props: {
    info: {
      default: () => { },
      type: Object
    },
    type: {
      default: 'nav',
      type: String
    }
  },
  mounted() {
    this.ruleForm.seoTitle = this.info.seoTitle;
    this.ruleForm.keyword = this.info.keyword;
    this.ruleForm.seoDescribe = this.info.seoDescribe;
    this.ruleForm.navId = this.info.id;
    this.ruleForm.id = this.info.id;
  },
  methods: {
    submitForm(formName) {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.submiting = true
          var status = ''
          // 3个地方使用这个组件，接口地址不同
          if (this.type === 'nav') {
            let { code } = await editSeo({ ...this.ruleForm });
            status = code
          } else if (this.type === 'product') {
            let { code } = await setCategorySeo({ ...this.ruleForm });
            status = code
          } else if (this.type === 'tags') {
            let { code } = await editTagsSeo({ ...this.ruleForm });
            status = code
          }
          if (status === 0) {
            this.submiting = false
            this.$message("SEO设置成功")
            this.resetForm()
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm() {
      this.$emit('subSeoInfo', false)
    }
  }
}
</script>

<style lang="less">
.tip {
  font-size: 12px;
}
</style>
