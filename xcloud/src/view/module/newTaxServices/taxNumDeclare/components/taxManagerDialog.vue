<template>
  <el-dialog
    title="修改申报专员"
    :visible.sync="dialogvisible"
    center
    width="400px"
    @close="closeModel('taxManagerForm')"
  >
    <el-form ref="taxManagerForm" :rules="taxManagerForm" :model="taxManager" label-width="135px">
      <el-form-item label="修改申报专员：" prop="declareUserId">
        <el-select v-model="taxManager.declareUserId" filterable>
          <el-option
            v-for="(item, key) in taxManagerList"
            :key="key"
            :value="item.userId"
            :label="item.nickName"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" style="text-align: center">
      <el-button style="width: 65px" type="default" @click="dialogvisible = false">取消</el-button>
      <el-button style="width: 65px" type="primary" @click="claimManager">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { declareHandler } from "@/api/newApi/taxServices/taxNumDeclare.js";
export default {
  props: {
    taxManagerModel: { type: Boolean },
    taxManagerList: { type: Array },
    serviceIdColl: { type: Array },
    queryData: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      taxManager: {},
      taxManagerForm: {
        declareUserId: [{ required: true, message: "请选择申报专员", trigger: "change" }]
      }
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.taxManagerModel;
      },
      set(val) {
        this.$emit("update:taxManagerModel", val);
      }
    }
  },
  created() {},
  methods: {
    /** 批量修改税务经理 */
    claimManager() {
      this.$refs.taxManagerForm.validate(valid => {
        if (valid) {
          declareHandler({
            declareUserId: this.taxManager.declareUserId,
            serviceIds: this.serviceIdColl
          })
            .then(res => {
              if (res.code === 0) {
                this.$message.success("修改成功");
                this.dialogvisible = false;
                this.queryData();
              }
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        }
      });
    },
    /** 关闭弹窗时清除数据 */
    closeModel(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style></style>
