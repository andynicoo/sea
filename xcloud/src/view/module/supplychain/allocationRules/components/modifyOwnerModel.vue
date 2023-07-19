<template>
  <el-dialog title="修改归属人" :visible.sync="dialogvisible" width="460px" center @close="reset">
    <el-form ref="registerFundForm" label-width="100px" :model="follwForm" :rules="rules">
      <el-form-item label="归属人" prop="affiliationCreateId">
        <el-select
          style="width: 100%"
          clearable
          placeholder="归属人"
          size="small"
          filterable
          :multiple="isMultiple"
          v-model="follwForm.affiliationCreateId"
        >
          <el-option-group>
            <li class="option_title" style="background: #f6f8fa">
              <span>姓名</span>
              <span>手机号</span>
              <span>部门</span>
            </li>
            <el-option
              v-for="item in followList"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
              class="option_title"
            >
              <span>{{ item.nickName }}</span>
              &nbsp;
              <span>{{ item.mobile }}</span>
              &nbsp;
              <span>{{ item.departmentName }}</span>
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="small" @click="updatefollowFun">确 定</el-button>
      <el-button @click="dialogvisible = false" size="small">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  changeAllotRuleInAffiliationCreateApi,
  changeAttorneyAffiliationCreateApi,
  changeSupplierAffiliationCreateApi
} from '@/api/newApi/supplyChain/allocationRules.js'
import { userList } from '@/api/newApi/common.js'
export default {
  props: {
    changeModifyOwnerDialog: Boolean,
    serviceIdColl: Array,
    isMultiple: {
      type: Boolean,
      default: false
    },
    fromWhere: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      follwForm: {
        affiliationCreateId: null
      },
      rules: {
        affiliationCreateId: [{ required: true, message: '请选择订单归属人', trigger: 'blur' }]
      },
      followList: []
    }
  },
  computed: {
    dialogvisible: {
      get () {
        return this.changeModifyOwnerDialog
      },
      set (val) {
        this.$emit('update:changeModifyOwnerDialog', val)
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    /**
     *归属人下拉列表
     */
    getUserList () {
      userList({
        page: 1,
        limit: 100
      }).then(res => {
        if (res.code == 0) {
          this.followList = res.data
        } else {
          this.$message({
            type: 'error',
            message: res.message
          })
        }
      })
    },

    /** 修改归属人保存 */
    updatefollowFun () {
      this.$refs.registerFundForm.validate(valid => {
        if (valid) {
          let nickName = []
          let affiliationCreateId = []
          if (this.isMultiple) {
            affiliationCreateId = this.follwForm.affiliationCreateId
          } else {
            affiliationCreateId = [this.follwForm.affiliationCreateId]
          }
          this.followList.forEach(item => {
            affiliationCreateId.forEach(userId => {
              if (item.userId == userId) {
                nickName.push(item.nickName)
              }
            })
          })
          let data = {
            ids: this.serviceIdColl,
            affiliationCreateId: affiliationCreateId.join(','),
            affiliationCreateName: nickName.join(';')
          }
          this.changeAffiliationCreate(data)
        }
      })
    },
    changeAffiliationCreate (data) {
      if (this.fromWhere == 'allocationRules') changeAllotRuleInAffiliationCreateApi(data).then(res => this.success(res))
      if (this.fromWhere == 'lawyerManage') changeAttorneyAffiliationCreateApi(data).then(res => this.success(res))
      if (this.fromWhere == 'serviceproviderManage') changeSupplierAffiliationCreateApi(data).then(res => this.success(res))
    },
    success (res) {
      if (res.code == 0) {
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        this.dialogvisible = false
        this.$emit('reset')
      }
    },
    reset () {
      if (this.$refs.registerFundForm) {
        this.$refs.registerFundForm.resetFields()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  margin: 0 0px 10px 0px;
  font-size: 14px;
  color: black;
  &.bold {
    font-weight: bold;
    margin-bottom: 30px;
  }
}

.option_title {
  padding: 10px 0;
  display: flex;
  text-align: center;
  span {
    flex: 3;
  }
}
</style>
