<template>
  <el-form label-width="110px" ref="userInfo" :model="userInfo" style="height: calc((100vh - 255px) - 0px); overflow-y: auto">
    <el-form-item label="昵称："> {{ userInfo.nickname }} </el-form-item>
    <el-form-item label="登录账号："> {{ userInfo.username }} </el-form-item>
    <el-form-item label="手机号："> {{ userInfo.mobile }} </el-form-item>
    <el-form-item label="联系人" prop="contactPerson" :rules="[{ required: true, message: '请输入联系人', trigger: 'blur' }]">
      <el-input v-model="userInfo.contactPerson" style="width: 300px"></el-input>
    </el-form-item>
    <el-form-item label="联系地址" prop="contactAddress" :rules="[{ required: true, message: '请输入联系地址', trigger: 'blur' }]">
      <el-input v-model="userInfo.contactAddress" style="width: 300px"></el-input>
    </el-form-item>
    <el-form-item label="联系方式" prop="contactPhone" :rules="[{ required: true, message: '请输入联系方式', trigger: 'blur' }]">
      <el-input v-model="userInfo.contactPhone" style="width: 300px"></el-input>
    </el-form-item>
    <el-form-item label="邮箱："> {{ userInfo.email || '-' }} </el-form-item>
    <el-form-item label="跟进人："> {{ userInfo.followUserName }} </el-form-item>
    <el-form-item label="状态：">
      <span v-if="userInfo.status == 0">禁用</span>
      <span v-if="userInfo.status == 1">启用</span>
      <span v-if="userInfo.status == 0">禁用</span>
    </el-form-item>
    <el-form-item label="邀请人：">{{ userInfo.inviteUserName }} </el-form-item>
    <el-form-item label="用户来源：">
      {{ userInfo.source | filterState }}
    </el-form-item>
    <el-form-item label="所属企业名称：">
      {{ enterpriseName }}
    </el-form-item>
    <el-form-item label="客户名称：">
      <el-input placeholder="请输入客户名称" clearable style="width: 300px" v-model="editForm.userName" />
    </el-form-item>
    <el-form-item label="备注：">
      <el-input v-model="editForm.remark" type="textarea" :rows="4" placeholder="请输入内容" style="width: 300px" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit" v-show="hasAuthority('C1_7')">确定</el-button>
      <el-button @click="goBack">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { updateInfo, getUserInfo } from '@/api/newApi/customer/customerInfo.js';
export default {
  data() {
    return {
      userInfo: {},
      editForm: {
        remark: '',
        userName: '',
      },
      enterpriseName: '',
    };
  },
  created() {
    this.getDetail();
    this.enterpriseName = this.$util.getLocalStorage('enterpriseName');
  },
  methods: {
    /**
     * 获取详情
     */
    getDetail(row) {
      getUserInfo({
        enterpriseId: this.$route.query.enterpriseId,
        userId: this.$route.query.userId,
      }).then((res) => {
        // 延迟loading关闭
        setTimeout(() => {
          this.listLoading = false;
        }, 300);
        if (res.code == 0) {
          // 设置列表和总条数
          this.userInfo = res.data;
          this.editForm.remark = res.data.remark;
          this.editForm.userName = res.data.username;
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          });
        }
      });
    },
    /**
     * 修改信息
     */
    handleSubmit() {
      this.$refs['userInfo'].validate((valid) => {
        if (valid) {
          updateInfo({
            enterpriseId: this.$route.query.enterpriseId,
            userId: this.$route.query.userId,
            type: 0,
            followUserId: this.editForm.followUserId,
            followUserName: this.followUserName,
            status: this.editForm.status,
            inviteUserId: this.editForm.inviteUserId,
            inviteType: this.editForm.inviteType,
            inviteUserName: this.editForm.inviteUserName,
            remark: this.editForm.remark,
            userName: this.editForm.userName,
            contactAddress: this.userInfo.contactAddress,
            contactPerson: this.userInfo.contactPerson,
            contactPhone: this.userInfo.contactPhone,
          }).then((res) => {
            if (res.code == 0) {
              this.$message({
                message: '修改成功',
                type: 'success',
              });
              this.goBack();
            }
          });
        } else {
          return false;
        }
      });
    },
    /**取消返回列表页 */
    goBack() {
      this.$router.push({ path: '/customer/myCustomer/index' });
    },
  },
};
</script>
<style scoped></style>
