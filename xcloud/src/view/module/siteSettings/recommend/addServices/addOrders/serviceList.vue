<!-- 网站首页-编辑-服务列表 -->
<template>
  <div>
    <div class="template-form">
      <el-form :model="form" ref="form" label-width="130px">
        <el-form-item
          label="分类名称:"
          prop="categoryTitle"
          :rules="[{ required: true, message: '请输入分类名称', trigger: 'blur' }]"
        >
          <el-input v-model="form.categoryTitle" maxlength="12" placeholder="请输入分类名称（限制12个字符）"></el-input>
        </el-form-item>
        <el-form-item
          label="查看更多链接:"
          prop="moreLinks"
          :rules="[{ required: true, validator: rules.validaHttps, trigger: 'blur' }]"
        >
          <el-input v-model="form.moreLinks" placeholder="请输入http或者https开头的完整链接"></el-input>
        </el-form-item>
        <el-form-item label="排序:">
          <el-tooltip class="item" effect="dark" content="数值越大，越靠前" placement="top">
            <el-input-number v-model="form.sort" :min="0"></el-input-number>
          </el-tooltip>
        </el-form-item>
        <el-form-item
          label="背景图:"
          prop="backgroundImg"
          :rules="[{ required: true, message: '请上传背景图', trigger: 'blur' }]"
        >
          <UploadImage
            ref="uploadImageRef"
            :imageUrl="form.backgroundImg"
            :on-success="uploadSuccess"
            :on-error="onUploadError"
            :on-remove="onUploadRemove"
            :num="1"
            style="min-width: 168px"
          ></UploadImage>
        </el-form-item>
        <el-form-item label="是否启用:">
          <el-switch v-model="form.status"></el-switch>
        </el-form-item>
      </el-form>
    </div>

    <span class="footer">
      <el-button size="small" @click="close">取消</el-button>
      <el-button type="primary" size="small" @click="serviceSumbit">确认</el-button>
    </span>
  </div>
</template>

<script>
import UploadImage from '@/components/UploadImages/index'; //上传图片组件
import { addIndexRemcommend, getIndexRemcommendById, editIndexRemcommend } from '@/api/newApi/siteSettings/index.js';
import { validaHttps } from '@/view/module/siteSettings/libs/setttingLibs.js';
export default {
  inject: ['highest', 'closeService'],
  data() {
    return {
      form: {
        categoryTitle: '',
        moreLinks: '',
        sort: 0,
        backgroundImg: [],
        status: true,
        enterpriseId: Number(localStorage.getItem('enterpriseId')),
      },

      rules: {
        validaHttps,
      },
    };
  },

  components: {
    UploadImage,
  },

  created() {
    this.isEdit();
  },

  methods: {
    isEdit() {
      !this.highest.isAdd && this.getIndexRemcommendByIdAPI();
    },

    async getIndexRemcommendByIdAPI() {
      let { code, data } = await getIndexRemcommendById({ id: this.highest.editId });
      data = data.map((item) => {
        item.status = item.status = 1 ? true : false;
        return item;
      })[0];

      if (code == 0) this.form = data;
    },

    uploadSuccess(filelist) {
      this.form.backgroundImg = filelist;
    },
    // 上传失败
    onUploadError(file) {},
    // 上传移除
    onUploadRemove(filelist) {
      this.form.backgroundImg = filelist;
    },

    /***添加 服务 */
    async addIndexRemcommendAPI(params) {
      let { code } = await addIndexRemcommend(params);
      if (code == 0) {
        this.$message.success('添加成功');
        this.close();
      }
    },

    /**编辑 服务 */
    async editIndexRemcommendAPI(params) {
      let { code } = await editIndexRemcommend(params);
      if (code == 0) {
        this.$message.success('修改成功');
        this.close();
      }
    },

    serviceSumbit() {
    
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.form));
          params.status = params.status == true ? 1 : 2;

          this.highest.isAdd ? this.addIndexRemcommendAPI(params) : this.editIndexRemcommendAPI(params);
        }
      });
    },

    close() {
      this.closeService();

      this.highest.getList();
    },
  },
};
</script>
<style lang="less" scoped>
.template-form {
  width: 380px;
}
.footer {
  float: right;
}
</style>
