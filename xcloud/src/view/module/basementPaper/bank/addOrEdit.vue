<template>
  <div id="bankEditContent">
    <el-form
      label-position="right"
      label-width="100px"
      :model="addFormList"
      :rules="formRule"
      ref="addbankform"
    >
      <el-form-item label="企业名称">
        <span>{{ enterpriseName }}</span>
      </el-form-item>

      <el-form-item label="银行账号" prop="bankAccount">
        <el-input
          v-model="addFormList.bankAccount"
          placeholder="银行账号"
          clearable
          style="width: 200px"
          size="small"
        />
      </el-form-item>

      <el-form-item label="账户名称" prop="accountName">
        <el-input
          v-model="addFormList.accountName"
          placeholder="账户名称"
          clearable
          style="width: 200px"
          size="small"
        />
      </el-form-item>

      <el-form-item label="开户银行" prop="bankName">
        <el-input
          v-model="addFormList.bankName"
          placeholder="开户银行"
          clearable
          style="width: 200px"
          size="small"
        />
      </el-form-item>

      <el-form-item label="账号类型" prop="accountType">
        <el-select
          style="width: 200px"
          size="small"
          v-model="addFormList.accountType"
        >
          <el-option :value="1" label="网银转账">网银转账</el-option>
          <el-option :value="2" label="微信">微信</el-option>
          <el-option :value="3" label="支付宝">支付宝</el-option>
          <el-option :value="4" label="paypal">paypal</el-option>
          <el-option :value="5" label="ebay">ebay</el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="类型" prop="type">
        <el-select style="width: 200px" size="small" v-model="addFormList.type">
          <el-option :value="1" label="公户">公户</el-option>
          <el-option :value="2" label="私户">私户</el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="是否默认" prop="isDefault">
        <el-radio v-model="addFormList.isDefault" :label="0">是</el-radio>
        <el-radio v-model="addFormList.isDefault" :label="1">否</el-radio>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select
          style="width: 200px"
          size="small"
          v-model="addFormList.status"
        >
          <el-option :value="0" label="启用">启用</el-option>
          <el-option :value="1" label="禁用">禁用</el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="small" @click="addOrUpdate">
          保存
        </el-button>
        <el-button type="cancel" size="small" @click="back()"> 取消 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  addBank,
  updateBank,
} from "@/api/newApi/basementPaper/basementPaper.js";
export default {
  data() {
    return {
      addFormList: {
        id: "",
        bankAccount: "",
        accountName: "",
        bankName: "",
        accountType: 1,
        type: 1,
        isDefault: 0,
        status: 0,
        enterpriseName: "",
      },
      formRule: {
        bankAccount: [
          { required: true, message: "请输入银行账号", trigger: "blur" },
          {
            pattern: /^-?\d+\.?\d*$/,
            message: "请输入正确数据",
            trigger: "blur",
          },
        ],
        accountName: [
          { required: true, message: "请输入账户名称", trigger: "blur" },
        ],
        bankName: [
          { required: true, message: "请输入开户银行", trigger: "blur" },
        ],
      },
      loading: false,
    };
  },
  created() {
    this.enterpriseName = this.$util.getLocalStorage("enterpriseName");
    const temp = this.$route.params.rowData;
    if (!temp) {
      console.log("新增");
    } else {
      this.addFormList = {
        id: temp.id,
        bankAccount: temp.bankAccount,
        accountName: temp.accountName,
        bankName: temp.bankName,
        accountType: temp.accountType,
        type: temp.type,
        isDefault: temp.isDefault,
        status: temp.status,
      };
    }
  },
  methods: {
    back() {
      this.$router.push({
        path: "/basementPaper/bank/bankAccount",
      });
    },
    addOrUpdate() {
      this.$refs["addbankform"].validate((valid) => {
        if (valid) {
          this.$confirm("确认操作?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.loading = true;
              if (!this.addFormList.id) {
                addBank(this.addFormList)
                  .then((res) => {
                    if (res.code == 0) {
                      this.$message({
                        type: "success",
                        message: "'操作成功'",
                      });
                      this.back();
                    }
                    this.loading = false;
                  })
                  .catch((err) => {
                    console.log(err);
                    this.loading = false;
                  });
              } else {
                updateBank(this.addFormList)
                  .then((res) => {
                    if (res.code == 0) {
                      this.$message({
                        type: "success",
                        message: "'操作成功'",
                      });
                      this.back();
                    }
                    this.loading = false;
                  })
                  .catch((err) => {
                    console.log(err);
                    this.loading = false;
                  });
              }
            })
            .catch((err) => {
              this.tableLoading = false;
              console.log(err);
            });
        } else {
          this.$message({
            message: "请检查输入的数据",
            type: "warning",
          });
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss">
#bankEditContent {
  padding: 10px;
  margin: 10px;
  background-color: #fff;
  min-height: 700px;
}
</style>