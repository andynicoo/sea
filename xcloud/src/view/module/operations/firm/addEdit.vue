<template>
  <div class="app-container">
    <div class="header-container">
      <el-link :underline="false" type="info" @click="goBack" style="padding-bottom: 24px"><i class="el-icon-arrow-left"></i> 查看详情 </el-link>
      <el-form :model="editForm" ref="editFormRef" :inline="true" :rules="ruleValidate" label-width="130px">
        <div class="title-font">
          <el-divider direction="vertical"></el-divider>
          <span class="text-info">基础信息</span>
        </div>

        <el-form-item label="企业名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入企业名称" />
        </el-form-item>

        <el-form-item label="纳税人类型" prop="taxpayerType">
          <el-select v-model="editForm.taxpayerType">
            <el-option label="一般纳税人" value="GENERAL"></el-option>
            <el-option label="小规模纳税人" value="SMALL"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile" placeholder="请输入手机号" maxlength="11" />
        </el-form-item>

        <el-form-item label="编码" prop="code">
          <el-input v-model="editForm.code" placeholder="请输入编码" />
          <!-- <span class="item-tip"></span> -->
        </el-form-item>

        <el-form-item label="年应税销售额" prop="taxSaleYear">
          <el-input type="number" v-model="editForm.taxSaleYear" placeholder="请输入年应税销售额" @blur="changeYear">
            <template slot="append">万元</template>
          </el-input>
        </el-form-item>

        <el-form-item label="企业信息抬头" prop="smsSigName">
          <el-input v-model="editForm.smsSigName" placeholder="请输入企业信息抬头" />
        </el-form-item>

        <el-form-item label="法人">
          <el-input v-model="editForm.legalPerson" placeholder="请输入法人名称" />
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="editForm.contactPerson" placeholder="请输入联系人" />
        </el-form-item>

        <!-- <el-form-item label="短信提示码">
          <el-input
            v-model="editForm.dingCorpId"
            placeholder="请输入短信提示码"
            style="width: 346px"
            size="small"
          />
        </el-form-item> -->

        <el-form-item label="状态">
          <el-select v-model="editForm.status">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0" v-if="editForm.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="editForm.remark" type="textarea" :rows="4" placeholder="请输入内容" resize="none" maxlength="500"></el-input>
        </el-form-item>

        <el-form-item label="对应品牌" prop="brandId">
          <el-select v-model="editForm.brandId">
            <el-option v-for="(li, index) of brandList" :key="index" :value="li.key" :label="li.value">
              {{ li.value }}
            </el-option>
          </el-select>
        </el-form-item>

        <div class="title-font">
          <el-divider direction="vertical"></el-divider>
          <span class="text-info">配置信息</span>
        </div>

        <el-form-item label="钉钉CorpId">
          <el-input v-model="editForm.dingCorpId" placeholder="请输入钉钉CorpId" />
        </el-form-item>

        <el-form-item label="客户端域名">
          <el-input v-model="editForm.clientDomainName" placeholder="请输入客户端域名" />
        </el-form-item>

        <el-form-item label="公众号ID">
          <el-input v-model="editForm.publicIdNumber" placeholder="请输入公众号ID" />
        </el-form-item>

        <div class="btn-wrap">
          <el-form-item>
            <el-button type="primary" @click="handleSubmit" v-show="hasAuthority('A1_4')">确定</el-button>
            <el-button @click="goBack">取消</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { addFirm, getBrandList } from '@/api/newApi/operations/firm.js';

export default {
  data() {
    var validateSaleYear = (rule, value, callback) => {
      if (this.editForm.taxpayerType === 'SMALL' && value === '') {
        callback(new Error('请输入年应税销售额'));
      } else if (this.editForm.taxpayerType === 'SMALL' && Number(value) > 999999) {
        callback(new Error('年应税销售额应小于7位数'));
      } else if (value && Number(value) <= 0) {
        callback(new Error('年应税销售额应大于0'));
      } else {
        callback();
      }
    };

    return {
      brandList: [],
      editForm: {
        name: '',
        id: '',
        remark: '',
        code: '',
        contactPerson: '',
        dingCorpId: '',
        legalPerson: '',
        mobile: '',
        status: 1,
        smsSigName: '',
        domainName: '',
        publicIdNumber: '',
        taxSaleYear: 0,
        taxpayerType: '',
        clientDomainName: '',
        brandId: '',
      },
      //校验
      ruleValidate: {
        name: [
          {
            required: true,
            message: '不允许为空',
            trigger: 'blur',
          },
        ],
        // code: [
        //   {
        //     required: true,
        //     message: "不允许为空",
        //     trigger: "blur",
        //   },
        // ],
        mobile: [
          {
            required: true,
            message: '不允许为空',
            trigger: 'blur',
          },
        ],
        smsSigName: [
          {
            required: true,
            message: '不允许为空',
            trigger: 'blur',
          },
        ],
        domainName: [
          {
            required: true,
            message: '不允许为空',
            trigger: 'blur',
          },
        ],
        taxpayerType: [
          {
            required: true,
            message: '不允许为空',
            trigger: 'change',
          },
        ],
        taxSaleYear: [{ validator: validateSaleYear, trigger: 'blur' }],
        brandId: [
          {
            required: true,
            message: '不允许为空',
            trigger: 'change',
          },
        ],
      },
    };
  },
  created() {
    let params = JSON.parse(window.localStorage.getItem('firmEdit'));
    if (params) {
      this.editForm = {
        ...params,
      };
    }
    this.getBrandList();
  },
  mounted() {},
  methods: {
    /**
     * 提交表单
     */
    handleSubmit() {
      this.$refs.editFormRef.validate((valid) => {
        if (valid) {
          if (this.editForm.mobile != '') {
            if (!/^[1-9][0-9]{10}$/.test(this.editForm.mobile)) {
              this.$message({
                message: '手机号码格式错误',
                type: 'error',
              });
              return;
            }
          }
          if (this.editForm.clientDomainName != '') {
            if (!/^http(s)?:\/\/([a-zA-Z\d][a-zA-Z\d-_]+\.)+[a-zA-Z\d-_][^ ]*$/.test(this.editForm.clientDomainName)) {
              this.$message({
                message: '域名格式错误',
                type: 'error',
              });
              return;
            }
          }
          addFirm({
            ...this.editForm,
            createId: this.editForm.createId ? Number(this.editForm.createId) : null,
          }).then((res) => {
            if (res.code == 0) {
              this.$message({
                message: '添加成功',
                type: 'success',
              });
              this.goBack();
            } else {
              this.$message({
                message: res.message,
                type: 'error',
              });
            }
          });
        } else {
          return false;
        }
      });
    },

    /**取消返回列表页 */
    goBack() {
      this.$router.push({ path: '/operations/firm/index' });
    },
    changeYear() {
      console.log(this.editForm.taxSaleYear);
    },
    getBrandList() {
      getBrandList().then((res) => {
        if (res.code == 0) {
          this.brandList = res.data || [];
        }
      });
    },
  },
};
</script>
<style scoped lang="less">
.addEdit {
  .editBox {
    width: 600px;
    overflow: hidden;
    .footerBox {
      float: right;
      el-button {
        margin-right: 10px;
      }
    }
  }
}
.item-tip {
  padding: 0 20px;
  color: #999;
}

.title-font {
  font-size: 16px;
  margin-bottom: 20px;
  margin-left: 5px;
  font-weight: 800;
}

.btn-wrap {
  margin-top: 20px;
  text-align: center;
}

/deep/ .el-form-item--small.el-form-item {
  width: 30%;
}

/deep/ .el-form-item__content {
  width: calc(100% - 160px);
  /deep/ .el-input {
    width: 100%;
  }
}

/deep/ .el-select {
  width: 100%;
}
</style>
