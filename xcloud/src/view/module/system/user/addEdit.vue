<template>
  <div class="app-container">
    <div class="header-container">
      <el-link :underline="false" @click="goBack">
        <i class="el-icon-arrow-left" style="margin-right: 6px;cursor: pointer"></i>
        返回列表
      </el-link>
      <p class="title">基本信息</p>
      <div class="editBox">
        <el-form :model="formItem" ref="formRef" :rules="ruleValidate" label-width="100px">
          <el-form-item label="工号" prop="workNum">
            <el-input v-model="formItem.workNum" placeholder="请输入工号" style="width: 200px" size="small" />
          </el-form-item>
          <el-form-item label="姓名" prop="nickName">
            <el-input v-model="formItem.nickName" placeholder="请输入姓名" style="width: 200px" size="small" />
          </el-form-item>
          <el-form-item label="登录账号" prop="userName">
            <el-input v-model="formItem.userName" placeholder="请输入登录账号" style="width: 200px" size="small" />
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="formItem.mobile" placeholder="请输入手机号码" style="width: 200px" size="small" />
          </el-form-item>
          <template v-if="!userId">
            <el-form-item label="密码" prop="password">
              <el-input
                autocomplete="new-password"
                v-model="formItem.password"
                placeholder="请输入密码"
                v-if="showPasswordInput"
                :type="passwordType"
                style="width: 200px"
                size="small"
              />
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <el-input
                autocomplete="new-password"
                v-model="formItem.checkPass"
                placeholder="请确认密码"
                v-if="showRePasswordInput"
                :type="rePasswordType"
                style="width: 200px"
                size="small"
              />
            </el-form-item>
          </template>
          <el-form-item label="所属企业" prop="companyId">
            <el-select style="width: 200px" filterable v-model="formItem.companyId">
              <el-option v-for="item in firmList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属部门" prop="departmentId">
            <!-- <el-select style="width: 200px" filterable v-model="formItem.departmentId"> -->
              <!-- <el-option
                v-for="item in departmentList"
                :key="item.departmentId"
                :label="item.departmentName"
                :value="item.departmentId"
              ></el-option> -->
              <el-cascader
                size="small"
                ref="departmentTree"
                :options="departmentList"
                :props="{ multiple: false, label: 'departmentName', value: 'departmentId', children: 'childXcloudOrgDepartmentListVO', emitPath: false, checkStrictly: true }"
                collapse-tags
                filterable
                v-model="formItem.departmentId">
              </el-cascader>
            <!-- </el-select> -->
          </el-form-item>
          <!-- TODO 角色 -->
          <!-- <el-form-item label="角色" prop="grantRoles">
            <el-select style="width: 200px" filterable v-model="formItem.grantRoles">
              <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleName"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="上级" prop="parentUserId">
            <el-select style="width: 200px" filterable v-model="formItem.parentUserId">
              <el-option
                v-for="item in userList"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职位" prop="workPosition">
            <el-input v-model="formItem.workPosition" placeholder="请输入职位" style="width: 200px" size="small" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="formItem.email" placeholder="请输入邮箱" style="width: 200px" size="small" />
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="formItem.status">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="0">禁用</el-radio>
              <el-radio :label="2">锁定</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="text" @click="moreFlag = true" v-if="!moreFlag">
              添加更多信息>>
            </el-button>
          </el-form-item>
          <div class="moreInfo" v-show="moreFlag">
            <p class="moreTittle">更多信息</p>
            <el-form-item label="QQ" prop="qqNum">
              <el-input v-model="formItem.qqNum" placeholder="请输入QQ" style="width: 200px" size="small" />
            </el-form-item>
            <el-form-item label="微信号" prop="wxNum">
              <el-input v-model="formItem.wxNum" placeholder="请输入微信号" style="width: 200px" size="small" />
            </el-form-item>
            <el-form-item label="性别：" prop="sex">
              <el-radio-group v-model="formItem.sex">
                <el-radio :label="0">男</el-radio>
                <el-radio :label="1">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="头像：">
              <UploadImage
                ref="uploadImageRef"
                :imageUrl="formItem.avatar"
                :on-success="uploadSuccess"
                :on-remove="uploadRemove"
                upload-tips="修改头像"
              ></UploadImage>
            </el-form-item>
            <el-form-item label="客户二维码：">
              <UploadImage
                ref="uploadImageRef2"
                :imageUrl="formItem.userQrCode"
                :on-success="uploadSuccess2"
                :on-remove="uploadRemove2"
                upload-tips="客户二维码"
                :imgType="1"
                style="min-width: 158px; margin-top:5px"
              ></UploadImage>
            </el-form-item>
          </div>
          <el-form-item>
            <el-button type="primary" size="small" @click="submit">确定</el-button>
            <el-button @click="goBack" size="small">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import UploadImage from '@/components/UploadImage/index.vue'
import { getFirm } from '@/api/newApi/common.js'
import { getAllRolesEnabled } from '@/api/role.js'
import { getBaseUserInfo, updateUser, addUser } from '@/api/user'
import { getAllUser } from '@/api/organization'
import { getDepartmentAll, getDepartmentTree } from '@/api/department'
export default {
  components: { UploadImage },
  data () {
    var validateCheckpass = (rule, value, callback) => {
      if (value !== this.formItem.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      uploadUrl: this.baseUrl + '/file/oss/upload', //上传图片接口
      userId: this.$route.query.userId || 0,
      formItem: {
        nickName: '',
        password: '',
        checkPass: '',
        status: 1,
        userName: '',
        userType: '',
        avatar: '',
        userQrCode:'',
        companyId: '',
        companyName: '',
        departmentId: '',
        departmentName: '',
        email: '',
        mobile: '',
        parentUserId: '',
        parentUserName: '',
        qqNum: '',
        sex: '',
        userDesc: '',
        workNum: '',
        workPosition: '',
        wxNum: ''
      },
      moreFlag: false,
      ruleValidate: {
        workNum: [
          { required: true, message: '请填写工号', trigger: 'blur' },
          { required: true, pattern: /^[A-Za-z0-9]+$/, message: '工号为字母或者数字组合', trigger: 'blur' }
        ],
        userName: [{ required: true, message: '请填写登录账号', trigger: 'blur' }],
        mobile: [
          { required: true, message: '请填写手机号码', trigger: 'blur' },
          { required: true, pattern: /^1[3456789]\d{9}$/, message: '手机号码格式错误', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请填写密码', trigger: 'blur' },
          {
            required: true,
            pattern: /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[. @$!%*#_~?&^{}【】\-+/|\\':;])[\da-zA-Z. @$!%*#_~?&^{}【】\-+/|\\':;]{8,}$/,
            message: '密码设置至少8个字符，且至少包含一个字母、一个数字和一个符号',
            trigger: 'blur'
          }
        ],
        checkPass: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validateCheckpass, trigger: 'blur' }
        ],
        companyId: [{ required: true, message: '请选择企业', trigger: 'blur' }],
        departmentId: [{ required: true, message: '请选择部门', trigger: 'blur' }],
        email: [
          // { required: true, message: '请填写邮箱', trigger: 'blur' },
          {
            // required: true,
            type: 'email',
            message: '邮箱格式错误',
            trigger: 'blur'
          }
        ]
      },
      userList: [],
      firmList: [],
      departmentList: [],
      roleList: [],
      showPasswordInput: true,
      showRePasswordInput: true
    }
  },
  computed: {
    passwordType () {
      return this.filterType('password', 'showPasswordInput')
    },
    rePasswordType () {
      return this.filterType('checkPass', 'showRePasswordInput')
    }
  },
  created () {
    this.init()
  },
  methods: {
    filterType (key, showKey) {
      let type = this.formItem[key] === '' ? 'text' : 'password'
      if (type === 'text') {
        this[showKey] = false
        this.$nextTick(() => {
          this[showKey] = true
        })
      }
      return type
    },
    async init () {
      await this.getfirmList()
      await this.getAllUserList()
      await this.getDepartmentAllList()
      await this.getAllRolesEnabledList()
      if (this.userId) {
        this.getInfo()
      }
    },
    getInfo () {
      getBaseUserInfo({
        userId: this.userId
      }).then(res => {
        if (res.code === 0) {
          this.formItem = res.data
        }
      })
    },
    // 获取上级列表
    getAllUserList () {
      return new Promise(resolve => {
        getAllUser().then(res => {
          if (res.code === 0) {
            this.userList = res.data
            resolve()
          }
        })
      })
    },
    // 获取企业列表
    getfirmList () {
      return new Promise(resolve => {
        getFirm().then(res => {
          if (res.code === 0) {
            res.data.forEach(item => {
              item.id = item.id + ''
            })
            this.firmList = res.data
            resolve()
          }
        })
      })
    },
    // 获取部门列表
    getDepartmentAllList () {
      return new Promise(resolve => {
        getDepartmentTree().then(res => {
          if (res.code === 0) {
            // this.departmentList = res.data
            this.departmentList = this.filterTree(res.data, 'childXcloudOrgDepartmentListVO')
            resolve()
          }
        })
      })
    },
    // 过滤为空的子列表
    filterTree(data, childrenKey) {
      data = data.filter(item => item.status === 1)
      data.forEach(item => {
        if(item[childrenKey].length) {
          item[childrenKey] = this.filterTree(item[childrenKey], childrenKey)
        } else {
          item[childrenKey] = undefined
        }
      })
      return data
    },
    // 获取角色列表
    getAllRolesEnabledList () {
      return new Promise(resolve => {
        getAllRolesEnabled().then(res => {
          if (res.code === 0) {
            this.roleList = res.data
            resolve()
          }
        })
      })
    },
    submit () {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.saving = true
          const {
            nickName,
            password,
            status,
            userName,
            userType,
            avatar,
            userQrCode,
            companyId,
            departmentId,
            email,
            mobile,
            parentUserId,
            qqNum,
            sex,
            userDesc,
            workNum,
            workPosition,
            wxNum
          } = this.formItem
          let company = this.firmList.find(item => item.id === companyId)
          let parentUser = this.userList.find(item => item.userId === parentUserId)
          // let role = this.roleList.find(item => item.roleId === parentUserId)
          let checkedNodes = this.$refs.departmentTree.getCheckedNodes()
          let departmentName = ''
          if(checkedNodes.length && checkedNodes[0]) {
            departmentName = checkedNodes[0].label
          }
          let data = {
            nickName,
            password,
            status,
            userName,
            userType,
            avatar,
            userQrCode,
            companyId,
            companyName: company ? company.name : '',
            departmentId,
            departmentName,
            email,
            mobile,
            parentUserId,
            parentUserName: parentUser ? parentUser.nickName : '',
            qqNum,
            sex,
            userDesc,
            workNum,
            workPosition,
            wxNum
          }
          if (this.userId) {
            this.updateRole(data)
          } else {
            this.addRole(data)
          }
        }
      })
    },
    updateRole (data) {
      updateUser({
        ...data,
        userId: this.userId
      })
        .then(res => {
          if (res.code === 0) {
            this.$Message.success('修改成功')
            this.goBack()
          }
        })
        .finally(() => {
          this.saving = false
        })
    },
    addRole (data) {
      addUser(data)
        .then(res => {
          if (res.code === 0) {
            this.$Message.success('添加成功')
            this.goBack()
          }
        })
        .finally(() => {
          this.saving = false
        })
    },
    goBack () {
      this.$router.push({
        path: '/system/user/index'
      })
    },
    uploadSuccess (v) {
      this.formItem.avatar = v.file.fileUrl
    },
    uploadRemove () {
      this.formItem.avatar = ''
    },
    uploadSuccess2 (v) {
      this.formItem.userQrCode = v.file.fileUrl
    },
    uploadRemove2 () {
      this.formItem.userQrCode = ''
    }
  }
}
</script>
<style scoped lang="scss">
.app-container {
    height: calc(100vh - 120px);
  overflow: hidden;
  .header-container {
    height: 100%;
    overflow-y: auto;
    .title {
      font-size: 16px;
      font-weight: bold;
      padding: 10px 0;
    }
    .editBox {
      .moreInfo {
        .moreTittle {
          padding: 14px 16px;
          font-size: 14px;
          color: #17233d;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
