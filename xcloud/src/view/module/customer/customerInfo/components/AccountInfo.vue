<template>
  <div>
    <div class="tip-box">
      <p>请提交客户信息，审核通过后可获取打款账号，客户可通过打款账号进行线下支付</p>
      <p>1，提交客户基本信息申请打款账号</p>
      <p>2，开通成功后可获取线下打款账号</p>
      <p>3，在销售订单中复制付款链接让客户选择“线下转账"方式进行打款</p>
      <p>注：一个手机号+公司主体只能申请一个打款账号</p>
    </div>
    <p class="fail-font" v-if="openFailReason && status == 'FAIL'">{{ openFailReason }}</p>
    <el-form label-width="110px" ref="userInfo" :model="userInfo" v-if="status != 'NORMAL'">
      <el-form-item label="状态："> {{ status | filterStatus }} </el-form-item>
     
      <el-form-item label="开户类型：" prop="accountType" :rules="[{ required: true, message: '请选择开户类型', trigger: 'change' }]">
        <el-select style="width: 300px" size="small" v-model="userInfo.accountType" clearable :disabled="canEdit">
          <el-option value="ENTERPRISE" label="企业">企业</el-option>
          <!-- <el-option value="PERSONAL" label="个人">个人</el-option> -->
        </el-select>

      </el-form-item>
      
      <el-form-item label="客户名称：" prop="userName" :rules="[{ required: true, message: '请输入客户名称', trigger: 'blur' }, { max: 128, message: '不能超过128个字符', trigger: 'blur' }]">
        <el-input v-model="userInfo.userName" style="width: 300px" :disabled="canEdit"></el-input>
      </el-form-item>
      <el-form-item label="证件类型：" prop="documentType" :rules="[{ required: true, message: '请选择证件类型', trigger: 'change' }]">
        <el-select style="width: 300px" size="small" v-model="userInfo.documentType" clearable :disabled="canEdit"> 
          <el-option v-if="userInfo.accountType == 'PERSONAL'" value="ID_CARD" label="身份证">身份证</el-option>
          <el-option v-if="userInfo.accountType == 'ENTERPRISE'" value="CREDIT_CODE" label="统一社会信用代码">统一社会信用代码</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="证件号码：" prop="documentNumber" :rules="[{ required: true, message: '请输入证件号码', trigger: 'blur' }, {
            pattern: /^[0-9A-Za-z]+$/,
            message: '只能输入数字和英文字母',
            trigger: 'blur',
          },
          { max: 20, message: '不能超过20个字符', trigger: 'blur' }]"> 
        <el-input v-model="userInfo.documentNumber" style="width: 300px" :disabled="canEdit"></el-input> 
      </el-form-item>
   
      

      <el-form-item>
        <el-button type="primary" @click="handleSubmit" v-show="hasAuthority('C1_21')" v-if="showSubmit" >提交申请</el-button>
        <el-button type="primary" @click="modify" v-show="hasAuthority('C1_22')" v-if="showModify">修改</el-button>
        <el-button @click="goBack">取消</el-button>
      </el-form-item>
    </el-form>
    <el-form label-width="110px" :model="userInfo" v-else>
      <el-form-item label="状态："> {{ status | filterStatus }} </el-form-item>
     
      <el-form-item label="开户类型：" prop="accountType">
        {{userInfo.accountType == 'PERSONAL' ? '个人' : userInfo.accountType == 'ENTERPRISE' ? '企业' : ''}}
      </el-form-item>
      
      <el-form-item label="客户名称：" prop="userName">
        {{userInfo.userName}}
      </el-form-item>
      <el-form-item label="证件类型：" prop="documentType" >
        {{userInfo.documentType == 'ID_CARD' ? '身份证' : userInfo.documentType == 'CREDIT_CODE' ? '统一社会信用代码' : ''}}
      </el-form-item>
      <el-form-item label="证件号码：" prop="documentNumber"> 
        {{userInfo.documentNumber}}
      </el-form-item>
      <el-form-item label="收款公司："> 
        {{userInfo.companyName}} <Button label="small" class="copyCompanyName btnCp" data-clipboard-action="copy" :data-clipboard-text="userInfo.companyName" @click="copyLink('.copyCompanyName')">复制</Button>
      </el-form-item>
      <el-form-item label="收款账号：" > 
        {{userInfo.accountNumber}}  <Button label="small" class="copyAccountNumber btnCp" data-clipboard-action="copy" :data-clipboard-text="userInfo.accountNumber" @click="copyLink('.copyAccountNumber')">复制</Button>
      </el-form-item>
      <el-form-item label="开户行名称："> 
        {{userInfo.bankName}} <Button label="small" class="copyBankName btnCp" data-clipboard-action="copy" :data-clipboard-text="userInfo.bankName" @click="copyLink('.copyBankName')">复制</Button>
      </el-form-item>

      <el-form-item label="联行行号："> 
        {{userInfo.bankNumber}} <Button label="small" class="copybankNumber btnCp" data-clipboard-action="copy" :data-clipboard-text="userInfo.bankNumber" @click="copyLink('.copybankNumber')">复制</Button>
      </el-form-item>
   
      
  
      
    </el-form>


    <!--开票弹窗 -->
    <el-dialog title="确认提交" :visible.sync="confirmInfoDialog" width="450px" >

      <div class="tip-wrap">
         提示：注意核算手机号和主体信息
      </div>
      <el-descriptions :column="1" :labelStyle="{ color: '#666666' }" :contentStyle="{ color: '#333333' }">
        <el-descriptions-item label="客户手机号">{{ $route.query.mobile }}</el-descriptions-item>
        <el-descriptions-item label="所属主体">{{ $util.getLocalStorage('enterpriseName') }}</el-descriptions-item>
        <el-descriptions-item label="开户类型">{{userInfo.accountType == 'PERSONAL' ? '个人' : userInfo.accountType == 'ENTERPRISE' ? '企业' : ''}}</el-descriptions-item>
        <el-descriptions-item label="客户名称">{{ userInfo.userName }}</el-descriptions-item>
        <el-descriptions-item label="证件类型">{{userInfo.documentType == 'ID_CARD' ? '身份证' : userInfo.documentType == 'CREDIT_CODE' ? '统一社会信用代码' : ''}}</el-descriptions-item>
        <el-descriptions-item label="证件号码">{{ userInfo.documentNumber }}</el-descriptions-item>

      </el-descriptions>

      <div class="dialog-footer-wrap">
        <span class="dialog-footer">
          <el-button type="primary" size="small" @click="confirmSubmit" :loading="isLoading">提交开户申请</el-button>
          <el-button @click="confirmInfoDialog = false" size="small">取 消</el-button>
        </span>
      </div>
    </el-dialog>
  </div>

</template>
<script>
import { updateUserAccount, addUserAccount, getUserAccount } from '@/api/newApi/customer/customerInfo.js';
import { getFirm } from "@/api/newApi/common.js";

export default {
  data() {
    return {
      userInfo: {
        accountType: 'ENTERPRISE',
      },
      openFailReason: '',
      canEdit: false,
      showModify: false,
      confirmInfoDialog: false,
      isLoading: false,
      status: '',
      showSubmit: false,
      firmList: []
    };
  },
  filters: {
    filterStatus(status) {
      switch (status) {
        case 'INIT':
          return '申请中';
        case 'NORMAL':
          return '开通成功';
        case 'FAIL':
          return '开通失败';
        case 'UNOPEN':
          return '未开通';
      }
    },
    getEnterpriseName(val, firmList) {
      let firm = firmList.find((item) => item.id == val);
      return firm ? firm.name : val;
    },
  },
  created() {
    this.getDetail();
    // this.getFirmList();
  },
  methods: {
    /**
     * 获取详情
     */
    getDetail(row) {
      getUserAccount({
        userId: this.$route.query.userId,
      }).then((res) => {
        // 延迟loading关闭
        if (res.code == 0) {
          console.log(res.data)
          if (JSON.stringify(res.data) == "{}") {
            this.status = 'UNOPEN'
            this.canEdit = false
            this.showSubmit = true
          } else {
            this.status = res.data.status
            this.userInfo = res.data
            this.openFailReason = res.data.openFailReason
            if (res.data.status == 'INIT' || res.data.status == 'FAIL') {
              this.canEdit = true
              this.showSubmit = false
            }
            if (res.data.status == 'FAIL') {
              this.showModify = true
            } else {
              this.showModify = false
            }
          }
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          });
        }
      });
    },
    getFirmList() {
      getFirm().then((res) => {
        if (res.code === 0) {
          this.firmList = res.data;
        } else {
          this.$message({
            type: "error",
            message: res.message,
          });
        }
      });
    },
    //复制链接
    copyLink(cn) {
      let _this = this;
      let clipboard = new this.clipboard(cn);
      clipboard.on("success", function (e) {
        _this.$Message.success("复制成功");
      });
      clipboard.on("error", function () {
        _this.$Message.info("复制失败");
      });
      setTimeout(() => {
        clipboard.destroy();
      }, 1000);
    },
    modify() {
      this.canEdit = false
      this.showModify = false
      this.showSubmit = true
    },
    /**
     * 修改信息
     */
    handleSubmit() {
      this.$refs['userInfo'].validate((valid) => {
        if (valid) {
          this.confirmInfoDialog = true
        } else {
          return false;
        }
      });
    },
    confirmSubmit() {
      var fnName = this.status == 'UNOPEN' ? addUserAccount : this.status == 'FAIL' ? updateUserAccount : ''
      this.confirmInfoDialog = false
      this.isLoading = true
      fnName({
        enterpriseId: this.$route.query.enterpriseId,
        userId: this.$route.query.userId,
        userMobile: this.$route.query.mobile,
        ...this.userInfo
      }).then((res) => {
        this.isLoading = false
        if (res.code == 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
          });
          this.getDetail();
        }
      }).catch(() => {
        this.isLoading = false
        this.getDetail();
      })
    },
    /**取消返回列表页 */
    goBack() {
      this.$router.push({ path: '/customer/myCustomer/index' });
    },
  },
};
</script>
<style scoped>
.tip-box {
  width: 800px;
  background: #f2f2f2;
  font-size: 14px;
  color: #333;
  margin-bottom: 15px;
}

.fail-font {
  color: #f5222d;
  margin-bottom: 15px;
}

.btnCp {
  float: right;
  margin-right: calc(100% - 500px);
}

/deep/ .el-descriptions-row {
  font-size: 14px;
}

.tip-wrap {
  width: 100%;
  height: 40px;
  padding-left: 5px;
  line-height: 40px;
  background: #DFF4FD;
  margin-bottom: 15px;
}

.dialog-footer-wrap {
  text-align: right;
  margin-top: 15px;
}
</style>
