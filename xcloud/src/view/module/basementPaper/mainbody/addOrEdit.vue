<template>
  <div id="taxEditContent">
    <el-form
      label-position="right"
      label-width="100px"
      :model="addListForm"
      :rules="formRule"
      ref="addtaxform"
    >
      <el-form-item label="企业名称">
        <span>{{ enterpriseName }}</span>
      </el-form-item>

      <el-form-item label="发票类型" prop="type">
        <el-select
          style="width: 200px"
          size="small"
          v-model="addListForm.type"
          clearable
        >
          <el-option :value="1" label="普通发票">普通发票</el-option>
          <el-option :value="2" label="增值税专用发票">
            增值税专用发票
          </el-option>
          <el-option :value="3" label="不开票">不开票</el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="税率" required prop="taxRate">
        <el-input-number
          style="width: 200px"
          v-model="addListForm.taxRate"
          :step="0.1"
          :min="0"
          :max="100"
          size="small"
        ></el-input-number>
        <span class="tipText">填写示例:6%</span>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select
          style="width: 200px"
          size="small"
          v-model="addListForm.status"
        >
          <el-option :value="0" label="启用">启用</el-option>
          <el-option :value="1" label="禁用">禁用</el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="small" @click="_addOrUpdateTax"
          >保存</el-button
        >
        <el-button type="cancel" size="small" @click="back()"> 取消 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addOrUpdateTax } from "@/api/newApi/basementPaper/basementPaper.js";
export default {
  data() {
    return {
      service: "",
      addListForm: {
        id: "",
        enterpriseId: "",
        status: 0,
        taxRate: "",
        type: 3,
        enterpriseName: "",
      },
      formRule: {
        taxRate: [{ required: true, message: "请输入税率", trigger: "blur" }],
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
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
      this.addListForm = {
        id: temp.id,
        enterpriseId: temp.enterpriseId,
        status: temp.status,
        taxRate: (temp.taxRate * 1000) / 10,
        type: temp.type,
      };
    }
  },
  methods: {
    _addOrUpdateTax() {
      this.$refs["addtaxform"].validate((valid) => {
        if (valid) {
          this.$confirm("确认操作?", "提示", {
            customClass: "custom-confirm",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            center: true
          })
            .then(() => {
              this.loading = true;
              addOrUpdateTax(this.addListForm)
                .then((res) => {
                  if (res.code == 0) {
                    this.$message.success("操作成功");
                    this.back();
                  }
                  this.loading = false;
                })
                .catch((err) => {
                  console.log(err);
                  this.loading = false;
                });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.$message.warning("请检查输入的数据");
          return false;
        }
      });
    },
    back() {
      this.$router.push({
        path: "/basementPaper/tax/taxInterest",
      });
      // this.$router.back(-1);
    },
  },
};
</script>
<style lang="scss">
#taxEditContent {
  padding: 10px;
  margin: 10px;
  background-color: #fff;
  min-height: 700px;
  .tipText {
    color: gray;
    font-size: 12px;
    margin-left: 5px;
  }
}
</style>