<!-- receive -->
<template>
  <div class="app-container">
    <!-- 列表 -->
    <div class="table-container">
      <div class="header-container" ref="searchBox">
        <BackHerader @back="goback" title="权益管理"></BackHerader>
      </div>
      <el-table ref="table" element-loading-spinner="icon loading" element-loading-text="拼命加载中" v-loading="listLoading" :data="list" :height="tableHeight" border highlight-current-row>
        <Empty slot="empty" />
        <el-table-column align="center" label="权益icon">
          <template slot-scope="scope">
            <el-image style="width: 48px; height: 33px" :src="scope.row.icon">
              <div slot="error" class="image-slot">
                <img src="@/assets/images/infoDetail/default.png" alt="" />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column align="center" label="权益名称" prop="benefitName"> </el-table-column>
        <el-table-column align="center" label="展示名称" prop="showName"> </el-table-column>
        <el-table-column align="center" label="权益简介" prop="benefitInfo"></el-table-column>
        <el-table-column align="center" label="权益状态">
          <template slot-scope="scope">{{ scope.row.status ? '使用中' : '未使用' }}</template>
        </el-table-column>
        <el-table-column align="center" label="排序" width="120" prop="sort"> </el-table-column>
        <el-table-column align="center" label="操作" width="250">
          <!-- (activityStatus:1未开始2进行中3已结束4已失效) -->
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top">
              <el-link type="primary" class="icon icon-edit" :underline="false" @click="toEdit(scope.row)"></el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="编辑" :visible.sync="dialogVisible" width="800px" center destroy-on-close>
        <el-form ref="editForms" inline style="margin-bottom: 10px" :rules="formRules" :model="editForm">
          <el-form-item label="权益名称" prop="benefitName">
            <el-input placeholder="请输入权益名称" clearable style="width: 260px" size="small" v-model="editForm.benefitName" maxlength="30" disabled="" />
          </el-form-item>
          <el-form-item label="展示名称" prop="showName">
            <el-input placeholder="请输入展示名称" clearable style="width: 260px" size="small" v-model="editForm.showName" maxlength="30" />
          </el-form-item>
          <el-form-item label="权益简介" prop="benefitInfo">
            <el-input placeholder="请输入展示名称" clearable style="width: 260px" size="small" v-model="editForm.benefitInfo" maxlength="30" />
          </el-form-item>
          <el-form-item label="权益排序" prop="sort">
            <el-input-number v-model="editForm.sort" controls-position="right" placeholder="请输入" style="width: 200px" clearable :min="0" :max="999" />
          </el-form-item>
          <el-form-item label="权益icon" prop="icon">
            <UploadImage ref="uploadImageRef" :imageUrl="editForm.icon" :imgType="1" :on-success="(v) => (editForm.icon = v.file.fileUrl)" upload-tips="添加图片" :imgMaxSize="3" :accept="'.png, .jpg'" :ruleType="['image/jpeg', 'image/jpg', 'image/png']"></UploadImage>
            <div class="subTips">建议上传72 x 72像素的png图片</div>
          </el-form-item>
          <el-form-item label="权益介绍：" prop="profiles">
            <Editor :value.sync="editForm.profiles" style="width: 630px"></Editor>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sure">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import BackHerader from '@/components/backHerader';
import Editor from '@/components/quillEditor/index';
import { cardEquityList, cardEquityEdit } from '@/api/newApi/extension/activity.js';
import UploadImage from '@/components/UploadImage/index.vue';
export default {
  components: {
    BackHerader,
    UploadImage,
    Editor,
  },
  data() {
    return {
      moreSerch: false, //更多查询条件
      list: [],
      listLoading: false,
      searchFlag: false,
      editForm: {},
      dialogVisible: false,
      formRules: {
        benefitName: [{ required: true, message: '请输入权益名称', trigger: 'blur' }],
        showName: [{ required: true, message: '请输入展示名称', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
        icon: [{ required: true, message: '请添加商品封面', trigger: 'change' }],
        benefitInfo: [{ required: true, message: '请输入权益简介', trigger: 'blur' }],
        profiles: [{ required: true, message: '请输入权益介绍', trigger: 'blur' }],
      },
    };
  },
  mounted() {
    this.queryData();
  },
  methods: {
    /**
     *
     * 查询列表
     */
    queryData() {
      this.listLoading = true;
      cardEquityList({ page: 1, size: 100 })
        .then((res) => {
          this.listLoading = false;
          if (res.code == 0) {
            // 设置列表和总条数
            this.list = res.data.records;
            this.listTotal = Number(res.data.total);
            if (this.searchFlag) {
              this.$message({
                message: `搜索完成，为您搜索${this.listTotal}条结果`,
                type: 'success',
                duration: 2000,
              });
              this.searchFlag = false;
            }
          } else {
            this.$message({
              type: 'error',
              message: res.message,
            });
          }
        })
        .catch((err) => {
          this.listLoading = false;
        });
    },
    // 返回列表
    goback() {
      this.$router.push('/extension/activityManagement/card/index');
    },
    toEdit(row) {
      this.editForm = {
        benefitName: row.benefitName,
        showName: row.showName,
        sort: row.sort,
        icon: row.icon,
        memberBenefitId: Number(row.memberBenefitId),
        profiles: row.profiles,
        benefitInfo: row.benefitInfo,
      };
      this.dialogVisible = true;
    },
    sure() {
      this.$refs.editForms.validate((valid) => {
        if (valid) {
          cardEquityEdit({
            memberBenefits: this.editForm,
          })
            .then((res) => {
              if (res.code == 0) {
                this.dialogVisible = false;
                this.queryData();
              } else {
                this.$message({
                  type: 'error',
                  message: res.message,
                });
              }
            })
            .catch((err) => {
              this.listLoading = false;
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style scoped lang="scss">
.test {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #67c23a;
  background: #eaffe0;
  border: 1px solid #67c23a;
}

.text-blue {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffc100;
  background: #fff8e1;
  border: 1px solid #ffc100;
}
.text-warning {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #b8b8b8;
  background: #f4f4f4;
  border: 1px solid #b8b8b8;
}
</style>
