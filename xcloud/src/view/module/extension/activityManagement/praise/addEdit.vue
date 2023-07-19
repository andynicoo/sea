<template>
  <div class="app-container">
    <BackHerader @back="goback" title="新增活动"></BackHerader>
    <!-- 表单 -->
    <div class="form-container">
      <el-form label-width="140px" ref="formRef" :model="form" :rules="formRules">
        <FormTitle value="基础设置："></FormTitle>
        <el-form-item label="活动名称：" prop="activityName">
          <el-input v-model="form.activityName" placeholder="请输入活动名称" clearable style="width: 360px" :disabled="isEdit" />
        </el-form-item>
        <!-- <el-form-item label="活动时间：" prop="activityTime">
          <el-date-picker
            v-model="form.activityTime"
            type="datetimerange"
            align="right"
            size="small"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 360px"
            :disabled="isEdit"
          ></el-date-picker>
        </el-form-item> -->
        <el-form-item label="活动时间：" prop="activityTime">
          <el-date-picker v-model="form.activityTime" type="datetimerange" align="right" size="small" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" value-format="yyyy-MM-dd HH:mm:ss" style="width: 360px" :disabled="isEdit"></el-date-picker>
        </el-form-item>
        <el-form-item label="活动类型：" prop="type">
          <el-select v-model="form.type" placeholder="请选择活动类型" clearable style="width: 360px" :disabled="isEdit">
            <el-option label="集赞活动" value="PRAISE"></el-option>
            <el-option label="助力活动" value="HELP"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择商品：" prop="productList">
          <el-table border :data="form.productList" v-if="form.productList && form.productList.length > 0">
            <Empty slot="empty" />
            <el-table-column align="center" label="商品名称">
              <template slot-scope="scope">
                <el-input v-model="scope.row.productName" placeholder="请输入商品名称" clearable :disabled="isEdit" />
              </template>
            </el-table-column>
            <el-table-column align="center" label="商品图片" width="200px">
              <template slot-scope="scope">
                <UploadImage ref="uploadImageRef" :imageUrl="scope.row.pcProductImgUrl" :imgType="1" :on-success="(v) => (scope.row.pcProductImgUrl = v.file.fileUrl)" upload-tips="添加图片" :imgMaxSize="3" :accept="'.png, .jpg'" :ruleType="['image/jpeg', 'image/jpg', 'image/png']"></UploadImage>
              </template>
            </el-table-column>
            <el-table-column align="center" label="商品说明(选填)">
              <template slot-scope="scope">
                <el-input v-model="scope.row.productInstruction" placeholder="请输入商品说明" clearable :disabled="isEdit" />
              </template>
            </el-table-column>
            <el-table-column align="center" disabled="isEdit" label="发放数量（0表示无限）" prop="sort">
              <template slot-scope="scope"> <el-input-number v-model="scope.row.giveOutNum" :min="0" :disabled="isEdit"></el-input-number></template>
            </el-table-column>
            <el-table-column align="center" disabled="isEdit" label="集赞达标次数" prop="sort">
              <template slot-scope="scope"> <el-input-number v-model="scope.row.targetNum" :min="0" :disabled="isEdit"></el-input-number></template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="适用用户：" prop="applyUser">
          <el-checkbox v-model="checkAll" @change="handleCheckAllChange" :disabled="isEdit">全选</el-checkbox>
          <el-checkbox-group v-model="form.applyUser" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="(item, index) in userType" :label="item.label" :key="index" :disabled="isEdit">{{ item.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="活动渠道：" prop="applyChannel">
          <el-checkbox v-model="checkAllChannel" @change="handleCheckAllChangeChannel" :disabled="isEdit">全选</el-checkbox>
          <el-checkbox-group v-model="form.applyChannel" @change="handleCheckedCitiesChangeChannel">
            <el-checkbox v-for="(item, index) in applyChannel" :label="item.label" :key="index" :disabled="isEdit">{{ item.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="活动规则：" prop="activityRule">
          <Editor :value.sync="form.activityRule" style="width: 1000px" :disabled="isEdit" v-if="!isEdit"></Editor>
          <div v-html="form.activityRule" style="word-break: break-all" v-else></div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="handleSubmit" v-if="!isEdit"> 保存 </el-button>
          <el-button @click="goback()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import BackHerader from '@/components/backHerader';
import FormTitle from '@/components/WorkOrderComponents/FormTitle';
import Editor from '@/components/quillEditor/index';
import UploadImage from '@/components/UploadImage/index.vue';
import { getFirm } from '@/api/newApi/common.js';
import { activityEditApi, activityGetDetailApi, activitySaveApi } from '@/api/newApi/extension/activity.js';
import { praiseCreate, praiseEdit, praiseDetails } from '@/api/newApi/extension/activity.js';
export default {
  components: {
    BackHerader,
    FormTitle,
    Editor,
    UploadImage,
  },
  data() {
    return {
      form: {
        activityName: '',
        type: '',
        activityRule: '',
        activityTime: [],
        enterpriseId: Number(localStorage.getItem('enterpriseId')),
        applyUser: [],
        applyChannel: [],
        productList: [
          {
            giveOutNum: 0,
            pcProductImgUrl: '',
            productInstruction: '',
            productName: '',
            targetNum: 0,
          },
        ],
      },
      userType: [
        { label: 'OLD_USER', name: '老用户' },
        { label: 'NEW_USER', name: '新用户' },
      ],
      applyChannel: [
        { label: 'PC', name: 'PC' },
        { label: 'XCX', name: '小程序' },
        { label: 'H5', name: 'H5' },
      ],
      userAll: ['OLD_USER', 'NEW_USER'],
      channelAll: ['PC', 'XCX', 'H5'],
      isIndeterminate: true,
      isIndeterminateChannel: true,
      checkAll: false,
      checkAllChannel: false,
      selectList: [],
      firmList: [],
      tableData: [],
      formRules: {
        activityName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
        activityRule: [{ required: true, message: '请输入活动规则', trigger: 'blur' }],
        activityTime: [{ required: true, message: '请选择活动时间', trigger: 'blur' }],
        applyUser: [{ required: true, message: '请选择适用用户', trigger: 'change' }],
        applyChannel: [{ required: true, message: '请选择活动渠道', trigger: 'change' }],
        productList: [{ required: true, message: '请选择商品', trigger: 'blur' }],
      },
      submitting: false,
      fromWhere: this.$route.query.key,
      rowData: this.$route.params.rowData,
      checkedActivities: false,
    };
  },
  created() {},
  mounted() {
    if (this.fromWhere == 'edit' || this.fromWhere == 'copy' || this.fromWhere == 'view') this.getActivity();
  },
  computed: {
    isEdit() {
      return this.$route.query.key == 'view';
    },
  },
  methods: {
    // 保存
    handleSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          let nameFlag = false;
          let imgFlag = false;
          let giveOutNumFlag = false;
          let targetNumFlag = false;
          this.form.productList.map((item) => {
            if (item.productName === '') nameFlag = true;
            if (item.pcProductImgUrl === '') imgFlag = true;
            if (item.giveOutNum === '') giveOutNumFlag = true;
            if (item.targetNum === 0 || item.targetNum === '') targetNumFlag = true;
          });
          if (nameFlag) return this.$message.warning('请完整输入商品名称');
          if (imgFlag) return this.$message.warning('请上传图片');
          if (giveOutNumFlag) return this.$message.warning('请输入发放数量');
          if (targetNumFlag) return this.$message.warning('集赞达标次数不能为0！');
          let data = {
            ...this.form,
            finishTime: this.form.activityTime[1],
            startTime: this.form.activityTime[0],
            applyUser: this.form.applyUser.join(','),
            applyChannel: this.form.applyChannel.join(','),
          };
          if (this.fromWhere == 'edit') {
            this.editActivity(data);
          } else {
            this.createActivity(data);
          }
        } else {
          return false;
        }
      });
    },
    // 获取一个活动
    getActivity() {
      praiseDetails(this.$route.query.id).then((res) => {
        if (res.code == 0) {
          this.form = res.data;
          this.form.applyUser = this.form.applyUser.split(',');
          this.form.applyChannel = this.form.applyChannel.split(',');
          this.checkAll = this.form.applyUser.length === this.userAll.length;
          this.checkAllChannel = this.form.applyChannel.length === this.channelAll.length;
          this.$set(this.form, 'activityTime', [this.form.startTime, this.form.finishTime]);
          this.form.activityRule = this.$Base64.decode(res.data.activityRule);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 活动编辑
    editActivity(data) {
      this.submitting = true;
      praiseEdit(data)
        .then((res) => {
          if (res.code == 0) {
            this.$message.success('编辑成功');
            this.$router.push({
              path: '/extension/activityManagement/praise/index.vue',
              name: 'praise',
            });
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.submitting = false;
        });
    },
    // 创建活动
    createActivity(data) {
      this.submitting = true;
      delete data.shareActivityId;
      praiseCreate(data)
        .then((res) => {
          if (res.code == 0) {
            this.$message.success('创建成功');
            this.$router.push({
              path: '/extension/activityManagement/praise/index.vue',
              name: 'praise',
            });
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.submitting = false;
        });
    },

    // 返回列表
    goback() {
      this.$router.push({
        path: '/extension/activityManagement/praise/index.vue',
        name: 'praise',
      });
    },
    editPrize() {
      this.$router.push({
        path: '/extension/activityManagement/draw/editPrize.vue',
        name: 'draweEditPrize',
        query: {
          key: 'add',
        },
      });
    },
    handleCheckAllChange(val) {
      this.form.applyUser = val ? this.userAll : [];
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.userAll.length;
    },
    handleCheckAllChangeChannel(val) {
      this.form.applyChannel = val ? this.channelAll : [];
    },
    handleCheckedCitiesChangeChannel(value) {
      let checkedCount = value.length;
      this.checkAllChannel = checkedCount === this.channelAll.length;
    },
  },
};
</script>
<style lang="less" scoped>
.app-container {
  position: relative;
  background: #fff;
  padding: 0px 30px 30px;
  .el-page-header {
    padding: 20px 0px 30px 0px;
    .el-page-header__left {
      display: flex;
      align-items: baseline;
    }
  }
  .form-container {
    background: #fff;
    border-radius: 4px;
    .titleStyle {
      margin-bottom: 20px;
    }
  }
  .setting {
    color: #cccccc;
    font-size: 12px;
    line-height: 20px;
    padding-left: 22px;
  }
}
.tooltip-box {
  width: 150px;
  .grid-content {
    height: 50px;
    background: #cccccc;
    text-align: center;
    line-height: 48px;
    margin: 2px;
  }
  .tooltip-text {
    text-align: center;
    margin-top: 10px;
  }
}
</style>
