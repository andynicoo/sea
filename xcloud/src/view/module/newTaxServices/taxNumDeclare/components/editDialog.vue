<template>
  <el-dialog
    title="编辑补申报"
    :visible.sync="dialogvisible"
    width="460px"
    center
  >
    <el-form
      :model="form"
      ref="ruleForm"
    >
      <el-form-item label="补申报订单号：" prop="num">
        000000000000000
      </el-form-item>
      <el-form-item label="周期类型：" prop="num">
        <el-select
          placeholder="请选择"
          size="small"
          style="width: 168px"
          clearable
          filterable
          v-model="form.type"
        >
          <el-option
            v-for="(item, index) in countrySelectList"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="下一次申报周期：" prop="file">
        <el-date-picker
          v-model="createTime"
          type="daterange"
          align="right"
          size="small"
          clearable
          unlink-panels
          start-placeholder="起始月份"
          end-placeholder="结束月份"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 250px"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="补申报周期：" prop="file">
        <el-input
          v-model="form.searchContent"
          clearable
          type="textarea"
          disabled
          style="width: 350px"
          size="small"
        />
        <div style="color: #E6A23C">
          <p>注：补申报周期即为要补申报的每个周期。</p>
          <p>结合周期类型和补申报总区间，自动得出补申报周期。</p>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small"
        >取消</el-button
      >
      <el-button
        type="primary"
        size="small"
        @click="submit"
        >保存</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import UploadFile from "@/components/UploadFile/index";
export default {
  props: {
    editDialog: Boolean,
    id: Number,
  },
  data() {
    return {
      formLabelWidth: "120px",
      form: {
        num: "",
        file: '',
      },
      createTime: [],
      countrySelectList: []
    };
  },
  components: {
    UploadFile
  },
  computed: {
    dialogvisible: {
      get() {
        return this.editDialog;
      },
      set(val) {
        this.$emit("update:editDialog", val);
      },
    },
  },
  created() {},
  methods: {
    submit() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.dialogvisible = false;
          this.confirm();
        } else {
          return false;
        }
      });
    },
    confirm() {
      // refundAudit({
      //   ...this.form,
      //   id: this.id,
      // }).then((res) => {
      //   if (res.code === 0) {
      //     this.$message({
      //       type: "success",
      //       message: "审核成功",
      //       duration: 2000,
      //     });
      //     this.$emit("refresh");
      //   } else {
      //     this.$message({
      //       type: "fail",
      //       message: "审核失败",
      //       duration: 2000,
      //     });
      //   }
      // });
    },
  },
};
</script>

<style></style>
