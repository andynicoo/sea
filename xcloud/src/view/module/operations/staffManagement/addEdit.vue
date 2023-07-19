<template>
  <div class="app-container">
    <div class="header-container">
      <p class="title">基本信息</p>
      <div class="editBox">
        <el-form
          :model="editForm"
          ref="editFormRef"
          :rules="ruleValidate"
          label-width="100px"
        >
          <el-form-item label="工号" prop="name">
            <el-input
              v-model="editForm.name"
              placeholder="请输入工号"
              style="width: 200px"
              size="small"
            />
          </el-form-item>
          <el-form-item label="姓名">
            <el-input
              v-model="editForm.code"
              placeholder="请输入姓名"
              style="width: 200px"
              size="small"
            />
          </el-form-item>
          <el-form-item label="账号" prop="account">
            <el-input
              v-model="editForm.legalPerson"
              placeholder="请输入账号"
              style="width: 200px"
              size="small"
            />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="editForm.contacts"
              placeholder="请输入手机号"
              style="width: 200px"
              size="small"
            />
          </el-form-item>
          <el-form-item label="密码">
            <el-input
              v-model="editForm.phone"
              placeholder="请输入密码"
              style="width: 200px"
              size="small"
            />
          </el-form-item>
          <el-form-item label="确认密码">
            <el-input
              v-model="editForm.corpId"
              placeholder="请输入确认密码"
              style="width: 200px"
              size="small"
            />
          </el-form-item>
          <el-form-item label="所属部门" v-model="editForm.status">
            <el-select style="width: 200px" size="small">
              <el-option label="启用" value="1"></el-option>
              <el-option label="禁用" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色" v-model="editForm.status">
            <el-select style="width: 200px" size="small">
              <el-option label="启用" value="1"></el-option>
              <el-option label="禁用" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职位">
            <el-input
              v-model="editForm.corpId"
              placeholder="请输入职位"
              style="width: 200px"
              size="small"
            />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input
              v-model="editForm.corpId"
              placeholder="请输入邮箱"
              style="width: 200px"
              size="small"
            />
          </el-form-item>
          <el-form-item label="状态" v-model="editForm.status">
            <el-select style="width: 200px" size="small">
              <el-option label="启用" value="1"></el-option>
              <el-option label="禁用" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-button type="text" @click="moreFlag = true" v-if="!moreFlag">
            添加更多信息>>
          </el-button>
          <div class="moreInfo" v-show="moreFlag">
            <p class="moreTittle">更多信息</p>
            <el-form-item label="QQ">
              <el-input
                v-model="editForm.corpId"
                placeholder="请输入QQ"
                style="width: 200px"
                size="small"
              />
            </el-form-item>
            <el-form-item label="微信号">
              <el-input
                v-model="editForm.corpId"
                placeholder="请输入微信号"
                style="width: 200px"
                size="small"
              />
            </el-form-item>
            <el-form-item label="微信ID">
              <el-input
                v-model="editForm.corpId"
                placeholder="请输入微信ID"
                style="width: 200px"
                size="small"
              />
            </el-form-item>
            <el-form-item label="性别：">
              <el-radio-group v-model="editForm.gender">
                <el-radio label="1">男</el-radio>
                <el-radio label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="头像：">
              <UploadImage
                ref="uploadImageRef"
                :imageUrl="editForm.imageUrl"
                :on-success="uploadSuccess"
                :on-error="onUploadError"
                :on-remove="onUploadRemove"
                upload-tips="修改头像"
              >
              </UploadImage>
            </el-form-item>
          </div>
          <el-form-item>
            <el-button type="primary" size="small">确定</el-button>
            <el-button @click="goBack()" size="small">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import UploadImage from "@/components/UploadImage/index.vue";
export default {
  components: { UploadImage },
  props: {
    editData: {
      type: Object,
    },
  },
  data() {
    return {
      uploadUrl: this.baseUrl + "/file/oss/upload", //上传图片接口
      editForm: {
        name: "",
        id: "",
        desc: "",
        code: "",
        legalPerson: "",
        contacts: "",
        phone: "",
        corpId: "",
        status: "",
        imageUrl: "",
        gender: "",
      },
      moreFlag: false, //更多信息
      //校验
      ruleValidate: {
        name: [
          {
            required: true,
            message: "不允许为空",
            trigger: "blur",
          },
          {
            required: true,
            pattern: /^[A-Za-z0-9\-]+$/,
            message: "工号为字母或者数字组合",
            trigger: "blur",
          },
        ],
        account: [
          {
            required: true,
            message: "不允许为空",
            trigger: "blur",
          },
        ],
        phone: [
          {
            required: true,
            message: "不允许为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    if (this.$route.params) {
      this.editForm = {
        id: this.$route.params.id,
        code: this.$route.params.code,
        legalPerson: this.$route.params.legalPerson,
        contacts: this.$route.params.contacts,
        corpId: this.$route.params.corpId,
        phone: this.$route.params.phone,
        corpId: this.$route.params.corpId,
        status: this.$route.params.status,
      };
    }
  },
  methods: {
    goBack() {
      this.$router.push({
        path: "/operations/staffManagement/index",
      });
    },

    /**
     * 修改头像
     */
    uploadSuccess(file) {
      console.log(file);
      this.editForm.imageUrl = file.response.data.fileUrl;
    },
    // 上传失败
    onUploadError(file) {},
    // 上传移除
    onUploadRemove(file) {
      this.editForm.imageUrl = "";
    },
  },
};
</script>
<style scoped lang="less">
.app-container {
  .title {
    font-size: 16px;
    font-weight: bold;
    padding: 10px 0;
  }
  .editBox {
    .moreInfo {
      .moreTittle {
        padding: 14px 16px;
        font-size: 14px;
        color: #17233d;
        font-weight: bold;
      }
      .blue {
        color: #2d8cf0;
        cursor: pointer;
        font-size: 14px;
      }
    }
  }
}
</style>
