<template>
  <div class="app-container">
    <div class="header-container">
      <div class="back" @click="navigate()">
        <Icon type="ios-arrow-back" />
        发送公告
      </div>
      <el-form :model="form" ref="formRef" :rules="ruleValidate" label-width="130px">
        <el-form-item label="公告类型" prop="type">
          <el-select style="width: 360px" size="small" v-model="form.type">
            <el-option :value="1" label="通知"></el-option>
            <el-option :value="2" label="公告"></el-option>
            <el-option :value="3" label="弹窗公告"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="接收客户" prop="customersType">
          <el-select style="width: 360px" size="small" v-model="form.customersType" :disabled="form.type !== 1">
            <el-option :value="2" label="所有客户"></el-option>
            <el-option :value="1" label="个人"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户手机号" prop="customersMobile" v-if="form.customersType === 1">
          <el-input
            v-model="form.customersMobile"
            clearable
            type="textarea"
            rows="3"
            placeholder="请输入收件用户手机号，多个可用逗号隔开"
            style="width: 360px"
            size="small"
          />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" clearable placeholder="请输入标题" style="width: 360px" size="small" />
        </el-form-item>
        <template v-if="form.type === 3">
            <el-form-item label="页面位置" prop="pagePosition">
                <el-select style="width: 360px" size="small" v-model="form.pagePosition" :disabled="form.type === 2">
                    <el-option :key="item.value" v-for="item in navList" :value="item.value" :label="item.label"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="图片" prop="files">
                <UploadImage
                ref="uploadImageRef"
                :imageUrl="form.files[0] && (form.files[0].url||form.files[0].fileUrl)"
                :imgType="1"
                :on-success="uploadSuccess"
                upload-tips="上传图片"
                >
                </UploadImage>
                推荐尺寸（UI定），不超过500KB
            </el-form-item>
            <el-form-item label="跳转链接" prop="url">
                <el-input
                    v-model="form.url"
                    clearable
                    type="textarea"
                    rows="3"
                    placeholder="请输入http或者https开头的完整链接"
                    style="width: 360px"
                    size="small"
                />
            </el-form-item>
        </template>
        <template v-else>
        <el-form-item label="内容描述" prop="content">
          <Editor :value.sync="form.content" style="width: 80%; min-width: 600px"></Editor>
        </el-form-item>
        <el-form-item label="附件" prop="files">
          <UploadFile ref="uploadImageRef" :fileList.sync="form.files" :limit="6"></UploadFile>
        </el-form-item>
        </template>
      </el-form>
      <div class="btn-group">
        <el-button type="primary" size="small" @click="submit(2)">立刻发送</el-button>
        <el-button size="small" @click="submit(1)">保存</el-button>
        <el-button size="small" @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { validaHttps } from '@/view/module/siteSettings/libs/setttingLibs.js';
import UploadImage from "@/components/UploadImage/index.vue";
import Editor from "@/components/quillEditor/index";
import UploadFile from "@/components/UploadFile/index";
import { mapMutations } from "vuex";
import { getAnnouncementInfo, addAnnouncement, updateAnnouncement } from "@/api/newApi/messageCenter/noticeManage";
import { formatEditorContent } from "@/components/quillEditor/formatEditorContent";
import { getNavigationList } from '@/api/newApi/siteSettings/index.js';
export default {
  data() {
    return {
      id: this.$route.params.id || 0,
      form: {
        content: "",
        customersMobile: "",
        customersType: "",
        files: [],
        isSend: "",
        title: "",
        type: "",
        pagePosition:'',
        url:''
      },
      ruleValidate: {
        type: [{ required: true, message: "请选择公告类型", trigger: "blur" }],
        customersType: [{ required: true, message: "请选择接收客户", trigger: "blur" }],
        customersMobile: [{ required: true, message: "请输入接收用户手机号", trigger: "blur" }],
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }],
        files: [{ required: true, message: "请上传附件/图片", trigger: "blur" }],
        pagePosition: [
          { required: true, message: "请选择页面位置", trigger: "blur" },
        ],
        url: [
          { validator: validaHttps },
        ],
        
      },
      navList:[
        {label:"首页",value:"index"},
        {label:"商标查询",value: "search"},
        {label:"产品服务",value: "productservice"},
        {label:"商标转让",value: "trademarktransfer"}
      ]
    };
  },
  components: {
    Editor,
    UploadFile,
    UploadImage
  },
  watch: {
    "form.type"() {
      if (this.form.type !== 1) {
        this.form.customersType = 2;
      }
    },
  },
  async created() {
    if (this.id) {
      this.getInfo();
    }
  },
  methods: {
    //弹窗图片
    uploadSuccess(v) {
    console.log(v,'vvv')
      this.$set(this.form,'files',[v.file]);
      console.log(this.form)
    },
    getInfo() {
      getAnnouncementInfo(this.id).then((res) => {
        let result = res.data;
        result.content = this.$Base64.decode(result.content);
        let fileNames = result.fileNames.split(",");
        let files = result.files.split(",");
        result.files = [];
        files.forEach((item, index) => {
          result.files.push({
            name: fileNames[index],
            url: item,
          });
        });
        this.form = result;
      });
    },
    submit(isSend) {
      this.$refs.formRef.validate((vaild) => {
        if (vaild) {
            console.log(this.form)
          let data = {
            ...this.form,
            isSend,
            customersMobile: this.form.customersMobile.replace(/，/g, ","),
            files: this.form.files.map((item) => item.url||item.fileUrl).join(","),
            fileNames: this.form.files.map((item) => item.name||item.origFileName).join(","),
            content: formatEditorContent(this.form.content),
          };
          if (!this.id) {
            // 新增
            this._addAnnouncement(data);
          } else {
            // 编辑
            this._updateAnnouncement(data);
          }
        }
      });
    },
    _addAnnouncement(data) {
      addAnnouncement(data).then((res) => {
        this.back();
      });
    },
    _updateAnnouncement(data) {
      updateAnnouncement({
        ...data,
        id: this.id,
      }).then((res) => {
        this.back();
      });
    },
    ...mapMutations(["closeTag"]),
    back() {
      this.$message.success("操作成功");
      this.closeTag(this.$route);
      this.navigate();
    },
    // 取消
    cancel() {
      this.$confirm(`是否确认取消！`, "提示", {
        customClass: "custom-confirm",
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning",
        center: true,
      }).then(() => {
        this.navigate();
      });
    },
    ...mapMutations(["closeTag"]),
    navigate() {
      this.closeTag(this.$route);
      this.$router.push({
        path: "/messageCenter/noticeManage/index",
      });
    },
  },
};
</script>

<style lang="less" scoped>
.item-title {
  padding: 0 12px;
}
.back {
  margin-left: 20px;
  margin-bottom: 20px;
  cursor: pointer;
}
.item-tip {
  padding: 0 12px;
  color: #999;
}
.btn-group {
  // text-align: center;
  margin-left: 80px;
  padding: 50px;
}
</style>
