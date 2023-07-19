<template>
  <div class="app-container">
    <el-form label-width="110px" :model="userInfo" ref="userFrom">
      <el-form-item label="昵称："> {{ userInfo.nickname }} </el-form-item>
      <el-form-item label="登录账号："> {{ userInfo.mobile }} </el-form-item>
      <el-form-item label="手机号："> {{ userInfo.mobile }} </el-form-item>
      <el-form-item label="联系人：" prop="contactPerson" :rules="[{ required: true, message: '请输入联系人', trigger: 'blur' }]">
        <el-input v-model="userInfo.contactPerson" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="联系地址：" prop="contactAddress" :rules="[{ required: true, message: '请输入联系地址', trigger: 'blur' }]">
        <el-input v-model="userInfo.contactAddress" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="联系方式：" prop="contactPhone" :rules="[{ required: true, message: '请输入联系方式', trigger: 'blur' }]">
        <el-input v-model="userInfo.contactPhone" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="是否会员："> {{ isMember(userInfo) }} </el-form-item>
      <el-form-item label="邮箱："> {{ userInfo.email }} </el-form-item>
      <el-form-item label="所属企业："> {{ enterpriseName }} </el-form-item>
      <el-form-item label="用户来源："> {{ userInfo.source | filterState }}</el-form-item>
      <el-form-item label="积分">
        <div style="width: 300px">
          {{ !isNaN(integral) ? integral : '-' }}积分
          <!-- {{ userInfo.integral }} 积分 -->
          <el-button size="mini" style="float: right" @click="memberConfigVisible = true">调整积分</el-button>
        </div>
      </el-form-item>
      <el-form-item label="跟进人：">
        <el-select style="width: 300px" v-model="editForm.followUserId" @change="selectName" clearable filterable :filter-method="dataFilter">
          <el-option-group>
            <li class="option_title" style="background: #f6f8fa">
              <span>姓名</span>
              <span>手机号</span>
              <span>部门</span>
            </li>

            <el-option v-for="item in followList" :key="item.userId" :label="toStr(item.nickName, item.mobile)" :value="item.userId" class="option_title">
              <span>{{ item.nickName }} </span>&nbsp; <span>{{ item.mobile }} </span>&nbsp;
              <span>{{ item.departmentName }}</span>
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select style="width: 300px" v-model="editForm.status">
          <el-option label="禁用" :value="0"></el-option>
          <el-option label="启用" :value="1"></el-option>
          <el-option label="锁定" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="邀请人：">
        <el-select style="width: 300px" v-model="editForm.inviteUserId" @change="selectInviteName" clearable filterable :filter-method="dataFilter">
          <el-option-group>
            <li class="option_title" style="background: #f6f8fa">
              <span>姓名</span>
              <span>手机号</span>
              <span>部门</span>
            </li>

            <el-option v-for="item in followList" :key="item.userId" :label="toStr(item.nickName, item.mobile)" :value="item.userId" class="option_title">
              <span>{{ item.nickName }} </span>&nbsp; <span>{{ item.mobile }} </span>&nbsp;
              <span>{{ item.departmentName }}</span>
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label="邀请来源：">
        <el-select style="width: 300px" v-model="editForm.inviteType">
          <el-option label="自然流量" :value="1"></el-option>
          <el-option label="客户端邀请" :value="2"></el-option>
          <el-option label="后台业务员邀请" :value="3"></el-option>
          <el-option label="渠道推广" :value="4"></el-option>
          <el-option label="销售易" :value="6"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input type="textarea" :rows="4" placeholder="请输入内容" style="width: 300px" resize="none" v-model="editForm.remark" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit" v-show="hasAuthority('C1_4')">确定</el-button>
        <el-button @click="goBack">取消</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="调整积分" :visible.sync="memberConfigVisible" destroy-on-close width="500px">
      <MemberConfig :integral="integral" :sumIntegral="sumIntegral" :ids="userInfo.mobile" @resetPage="resetPage" />
    </el-dialog>
  </div>
</template>
<script>
import { updateInfo, getUserInfo, userList, getUserInegralAccount } from '@/api/newApi/customer/customerInfo.js';
import MemberConfig from './MemberConfig.vue'; // 调整积分
export default {
  components: {
    MemberConfig,
  },
  data() {
    return {
      editForm: {
        followUserId: '', //跟进id
        followUserName: '', //跟进名称
        status: '', //状态
        inviteUserId: '', //邀请人id
        inviteUserName: '', //邀请人名称
        inviteType: '', //邀请来源
        remark: '',
      },
      enterpriseName: '',
      userInfo: {}, //基本信息
      integral: 0,
      sumIntegral: 0,
      followList: [],
      memberConfigVisible: false,
    };
  },
  async created() {
    await this.getDetail();
    await this.getUserList();
    // 用户积分查询
    await this.getUserInegralAccount();
    const enterpriseList = JSON.parse(this.$util.getLocalStorage('enterpriseList'));
    this.enterpriseName = enterpriseList.find((o) => o.id == this.$route.query.enterpriseId).name;
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
          this.editForm = {
            followUserId: this.userInfo.followUserId != 0 ? this.userInfo.followUserId : '', //跟进id
            followUserName: this.userInfo.followUserName, //跟进名称
            status: this.userInfo.status, //状态
            inviteUserId: this.userInfo.inviteUserId != 0 ? this.userInfo.inviteUserId : '', //邀请人id
            inviteUserName: this.userInfo.inviteUserName, //邀请人名称
            inviteType: this.userInfo.inviteType != 0 ? this.userInfo.inviteType : '', //邀请来源
            remark: this.userInfo.remark,
            // contactAddress: res.data.contactAddress,
            // contactPerson: res.data.contactPerson,
            // contactPhone: res.data.contactPhone,
          };
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          });
        }
      });
    },
    getUserInegralAccount() {
      getUserInegralAccount({
        enterpriseId: this.$route.query.enterpriseId,
        userId: this.$route.query.userId,
      }).then((res) => {
        if (res.code === 0) {
          this.integral = res.data.integral;
          this.sumIntegral = res.data.sumIntegral;
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          });
        }
      });
    },
    async resetPage(data) {
      this.memberConfigVisible = false;
      if (data) {
        await this.getDetail();
        await this.getUserList();
        // 用户积分查询
        await this.getUserInegralAccount();
      }
    },
    /** 修改跟进人/邀请人 过滤 */
    dataFilter(val) {
      if (val) {
        //val存在
        this.followList = this.followList.filter((item) => {
          if (!!~item.nickName.indexOf(val) || !!~item.mobile.indexOf(val) || !!~item.departmentName.toUpperCase().indexOf(val.toUpperCase())) {
            return true;
          }
        });
      } else {
        //val为空时，还原数组
        this.getUserList();
      }
    },
    //当用户昵称为空时默认
    toStr(str, mobile) {
      let data;
      if (str) {
        data = str;
      } else {
        data = mobile == '' || mobile == 'undefined' ? '暂无昵称' : mobile;
      }
      return data;
    },

    /**
     * 修改信息
     */
    handleSubmit() {
      this.$refs['userFrom'].validate((valid) => {
        if (valid) {
          updateInfo({
            enterpriseId: this.$route.query.enterpriseId,
            userId: this.$route.query.userId,
            followUserId: this.editForm.followUserId,
            followUserName: this.editForm.followUserName,
            status: this.editForm.status,
            inviteUserId: this.editForm.inviteUserId,
            inviteType: this.editForm.inviteType,
            inviteUserName: this.editForm.inviteUserName,
            contactPhone: this.userInfo.contactPhone,
            contactPerson: this.userInfo.contactPerson,
            contactAddress: this.userInfo.contactAddress,
            remark: this.editForm.remark,
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
    /**
     * 邀请人/跟进人下拉列表
     */
    getUserList() {
      userList({
        page: 1,
        limit: 100,
      }).then((res) => {
        if (res.code == 0) {
          this.followList = res.data;
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          });
        }
      });
    },
    /**获取跟进人名称 */
    selectName(vld) {
      let obj = {};
      obj = this.followList.find((item) => {
        //这里的Data就是上面遍历的数据源
        return item.userId === vld; //筛选出匹配数据
      });
      this.editForm.followUserName = obj.nickName;
    },
    /**获取跟邀请人名称 */
    selectInviteName(vld) {
      let obj = {};
      obj = this.followList.find((item) => {
        //这里的Data就是上面遍历的数据源
        return item.userId === vld; //筛选出匹配数据
      });
      this.editForm.inviteUserName = obj.nickName;
    },
    /**取消返回列表页 */
    goBack() {
      this.$router.push({ path: '/customer/customerInfo/index' });
    },
    // 是否是会员
    isMember(row) {
      let isMember = '';
      if (row.membershipCardId && row.vipEndTime == null) {
        isMember = '是';
      } else if (row.membershipCardId && row.vipEndTime) {
        if (this.judgeTime(row.vipEndTime)) {
          isMember = '是';
        } else {
          isMember = '否';
        }
      } else {
        isMember = '否';
      }
      return isMember;
    },
    judgeTime(time) {
      var strtime = time.replace('/-/g', '/'); //时间转换
      //时间
      var date1 = new Date(strtime);
      //现在时间
      var date2 = new Date();
      //判断时间是否过期
      return date1 < date2 ? false : true;
    },
  },
};
</script>
<style scoped lang="scss">
.option_title {
  padding: 10px 0;
  display: flex;
  text-align: center;
  span {
    flex: 3;
  }
}
</style>
