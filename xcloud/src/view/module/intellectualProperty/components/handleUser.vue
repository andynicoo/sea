<template>
  <div>
    <!-- 修改处理人 -->
    <el-dialog :visible.sync="handlerTypeModal" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" width="382px" title="修改处理人">
      <el-form :model="formCodeItem" label-width="120px" ref="formCodeItem">
        <el-form-item label="处理人类型：" prop="handleType">
          <el-select v-model="formCodeItem.handleType" @change="changeAssessmentType" placeholder="请选择处理人类型">
            <el-option v-for="(item, index) in handlerList" :value="item.type" :label="item.typeName" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="指定处理人：">
          <el-select v-model="formCodeItem.handlerUserId" filterable @change="changeUser" placeholder="请选择处理人">
            <el-option v-for="(item, index) in userList" :value="item.userId" :label="item.nickName" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <p class="dialogFooter">
          <el-button type="primary" ghost style="margin-right: 20px" @click="handleCancel(false)">取消</el-button>
          <el-button type="primary" @click="sureFilingCode('formCodeItem')">确认</el-button>
        </p>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="handlerModal" :before-close="cancelUserFunc" :title="formCodeItem.handleType == 2 ? '指派律师' : '指派处理人'">
      <span v-if="formCodeItem.handleType == 2">律师简称：</span>
      <el-select v-if="formCodeItem.handleType == 2" v-model="staffInfo.userId" filterable @change="changeLaywyer">
        <el-option v-for="(item, index) in lawyerList" :value="item.id" :label="item.attorneyAbbreviation" :key="index"></el-option>
      </el-select>
      <div v-else>
        <el-form :model="staffInfo" class="form-box" label-width="80px">
          <el-form-item label="部门名称:">
            <el-select v-model="staffInfo.departmentId" @change="changeDepartment" filterable placeholder="部门名称">
              <el-option :value="item.departmentId" :label="item.departmentName" v-for="(item, index) in departmentList" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="员工姓名:">
            <el-select v-model="staffInfo.userId" @change="changeStaffFunc" filterable placeholder="员工姓名">
              <el-option :value="item.userId" :label="item.nickName" v-for="(item, index) in staffList" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <p slot="footer">
        <el-button type="primary" ghost style="margin-right: 20px" @click="cancelUserFunc()">取消</el-button>
        <el-button type="primary" @click="sureUserFunc()">确定</el-button>
      </p>
    </el-dialog>
  </div>
</template>
<script>
import { userList } from '@/api/newApi/common.js';
import * as API from '@/api/newApi/intellectualProperty/handleUser';
export default {
  props: ['rowInfo', 'serviceIds', 'type'],
  data() {
    return {
      handlerTypeModal: true,
      formCodeItem: {},
      handlerList: [],
      handlerModal: false,
      staffInfo: {
        realName: '',
      },
      userList: [],
      departmentList: [],
      staffList: [],
      lawyerList: [],
    };
  },
  created() {
    this.getDataFunc();
  },
  methods: {
    checkHandlerFunc() {
      if (this.formCodeItem.handleType == '') {
        this.$Message.info('请先选择处理人类型');
        return;
      }
    },
    getDataFunc() {
      API.handlerUserTypeAPI({ productFunctionCode: this.type }).then((res) => {
        if (res.code == 0) {
          this.handlerList = res.data;
        }
      });
      userList().then((res) => {
        if (res.code == 0) {
          this.userList = res.data;
        }
      });
    },
    getLawyerListFunc() {
      let data = {
        limit: 500,
        page: 1,
        isOpen: '1',
      };
      lawyerListApi(data).then((res) => {
        if (res.code === 0) {
          this.lawyerList = res.data.records;
        }
      });
    },
    changeAssessmentType(val) {
      if (val != undefined) {
        this.handlerList.map((item) => {
          if (item.type == val) {
            this.formCodeItem.handleTypeName = item.typeName;
          }
        });
      }
    },
    changeUser(val) {
      if (val != undefined) {
        this.userList.map((item) => {
          if (item.userId == val) {
            this.formCodeItem.handlerUserName = item.nickName;
          }
        });
      }
    },
    changeLaywyer(val) {
      if (val != undefined) {
        this.staffInfo.realName = val.label;
        this.staffInfo.userId = val.value;
      }
    },
    changeDepartment(val) {
      if (val != undefined) {
        this.departmentList.map((item) => {
          if (val.value == item.departmentId) {
            this.staffList = item.children;
          }
        });
        this.staffInfo.department = val.label;
      }
    },
    changeStaffFunc(val) {
      if (val != undefined) {
        this.staffInfo.realName = val.label;
      }
    },
    cancelUserFunc() {
      this.handlerModal = false;
      this.formCodeItem.handleType = '';
      this.staffInfo = {
        departmentId: '',
        realName: '',
        userId: '',
      };
    },
    sureUserFunc() {
      this.handlerModal = false;
    },
    sureFilingCode() {
      console.log(this.formCodeItem);
      if (this.formCodeItem.handleType == '') {
        this.$Message.info('请先选择处理人类型');
        return;
      }
      // if (this.staffInfo.realName == '') {
      //     this.$Message.info('请先指派处理人')
      //     return
      // }
      console.log('this.serviceIds', this.serviceIds);
      let data = { ...this.formCodeItem };
      data.serviceIds = this.serviceIds;
      data.serviceType = this.type;
      API.updateHandlerUserTypeAPI(data).then((res) => {
        if (res.code == 0) {
          this.$Message.success('操作成功');
          this.staffInfo.realName = '';
          this.formCodeItem.handleType = '';
          this.handleCancel(true);
        }
      });
    },
    handleCancel(va) {
      this.$emit('cancelFunc', va);
    },
  },
};
</script>
<style lang="less" scoped>
.dialogFooter {
  width: 315px;
  display: flex;
  justify-content: right;
  margin-top: 50px;
}
</style>
