<template>
  <div class="app-container">
    <div class="header-container">
      <header>
        <BackHerader @back="goBack" :title="edit ? '编辑' : '新增'" class="backHerder" style="padding-left: 17px; padding-top: 20px"></BackHerader>
        <div class="item">
          <Title class="title" titieName="基础信息"></Title>
          <el-form :model="editForm" ref="editFormRef" class="message pd-lf-20" label-width="100px">
            <el-form-item label="企业主体" prop="enterpriseId" :rules="[{ required: true, message: '请选择企业主体', trigger: 'change' }]">
              <el-select v-model="editForm.enterpriseId" placeholder="选择企业主体" clearable filterable default-first-option style="width: 300px" :disabled="isEdit">
                <el-option :value="item.id" :label="item.name" v-for="item in firmList" :key="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="平台" prop="platform" :rules="[{ required: true, message: '请选择企业平台', trigger: 'change' }]">
              <el-select v-model="editForm.platform" placeholder="选择活动平台" clearable filterable default-first-option :disabled="isEdit">
                <el-option label="PC端" value="pc"></el-option>
                <el-option label="微信小程序" value="applets"></el-option>
                <el-option label="H5" value="h5"></el-option>
                <el-option label="线下" value="offline"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </header>
      <div class="message pd-lf-20">
        <Title class="title" titieName="链接信息"></Title>
        <div class="add">
          <div class="link-box item">
            <el-form :model="editForm" class="conten" label-width="100px">
              <div class="link-box-info">
                <el-form-item label="链接名称：" prop="linkName" :rules="[{ required: true, message: '请输入链接名称', trigger: 'blur' }]">
                  <el-input v-model="editForm.linkName" clearable style="width: 300px" size="small" placeholder="请输入链接名称" :disabled="isEdit" :maxlength="20"/>
                </el-form-item>
                <el-form-item label="链接地址：" prop="linkUrl" :rules="[{ required: true, message: '请输入链接地址', trigger: 'blur' }]" v-if="editForm.platform != 'offline'">
                  <el-input v-model="editForm.linkUrl" clearable style="width: 300px" size="small" placeholder="请输入链接地址" :disabled="isEdit" />
                </el-form-item>
                <el-form-item label="链接地址：" prop="linkUrl" v-else>
                  <el-input v-model="editForm.linkUrl" clearable style="width: 300px" size="small" placeholder="请输入链接地址" :disabled="isEdit"/>
                </el-form-item>
                <el-form-item label="是否支持生成专属链接: " prop="flagPersonal" size="small">
                  <el-radio-group v-model="editForm.flagPersonal">
                    <el-radio :label="true"> 是</el-radio>
                    <el-radio :label="false"> 否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
      </div>
      <footer>
        <el-button type="primary" size="small" @click="handleSubmit">确定</el-button>
        <el-button size="small" @click="goBack">取消</el-button>
      </footer>
    </div>
  </div>
</template>
<script>
import { saveLinkAddress, linkAddressUpdateLinkAddress } from '@/api/newApi/extension/promotionExtend.js';
import BackHerader from '@/components/backHerader';
import Title from '@/components/title/index';
import { getFirm } from '@/api/newApi/common.js';
export default {
  components: {
    BackHerader,
    Title,
  },
  data() {
    return {
      editForm: {
        flagPersonal: true,
      },
      listChannelPage: [{}],
      selectlist: [],
      firmList: [],
      edit: false,
      linkAddressId: this.$route.query.linkAddressId,
      isEdit: this.$route.query.status ? true : false
    };
  },
  created() {
    try {
      let editObj = JSON.parse(window.sessionStorage.getItem('staffEditObj'));
      if (editObj) {
        let { linkName, flagPersonal, linkUrl, enterpriseId, platform } = editObj;
        let editForm = { linkName, flagPersonal, linkUrl, enterpriseId, platform };
        this.editForm = editForm;
        this.edit = true;
      }
    } catch (error) {}
   
    this.getfirmList();
  },
  methods: {
    /**
     * 提交新增/编辑
     */
    handleSubmit() {
      this.$refs.editFormRef.validate(async (valid) => {
        let { linkName, linkUrl } = this.editForm;
        if(this.editForm.platform != 'offline') {
          if (!(linkName && linkUrl)) {
            this.$message.warning('链接名称链接地址必填');
            return;
          } 
        } else {
          if (!(linkName)) {
            this.$message.warning('链接名称必填');
            return;
          } 
        }
        if (valid) {
          if (!Boolean(this.edit)) {
            saveLinkAddress({ ...this.editForm }).then((res) => {
              if (res.code == 0) {
                this.$message({
                  type: 'success',
                  message: '添加成功',
                });
                this.goBack();
              } else {
                this.$message({
                  type: 'error',
                  message: res.message,
                });
              }
            });
          } else {
            let { code } = await linkAddressUpdateLinkAddress({ ...this.editForm, linkAddressId: this.linkAddressId });
            if (code == 0) {
              this.$message.success('修改成功');
              this.goBack();
            } else {
              this.$message.error({
                message: res.message,
              });
            }
          }
        }
      });
    },
    /**
     * 获取企业列表
     */
    getfirmList() {
      getFirm().then((res) => {
        if (res.code == 0) {
          this.firmList = res.data;
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          });
        }
      });
    },

    /**返回 */
    goBack() {
      sessionStorage.removeItem('staffEditObj');
      this.$router.push({ path: '/extension/promotionExtend/index' });
    },
    /**动态新建链接 */
    addLink() {
      this.editForm.listChannelPage.push({
        linkName: '',
        linkUrl: '',
        platform: 1,
      });
    },

    /**删除链接 */
    delteLink(item, key) {
      this.editForm.listChannelPage.splice(key, 1);
    },
  },
};
</script>
<style scoped lang="scss">
.header-container {
  // padding-bottom: ;
  background: none;
  padding: 0px 5px 0px 0px;
  .message {
    background-color: #fff;
    margin-top: 20px;
    .title {
      padding-top: 30px;
    }
    .add-btn {
      margin: 30px 0px 20px 0px;
    }
    .add {
      display: grid;
      grid-template-columns: repeat(3, 33.3%);
      padding-bottom: 200px;
      margin-top: 30px;
      .link-box {
        padding: 20px;
        width: 450px;
        margin-bottom: 20px;
        box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1);
        .item {
          .header {
            width: 100%;
            // text-align: center;
            height: 40px;
            border-bottom: 1px solid #dcdfe6;
            margin-bottom: 23px;
            display: flex;
            justify-content: space-between;
            .delect {
              border: none !important;
              .colseBtn {
                width: 14px;
              }
            }
          }
          .conten {
            display: flex;
            justify-content: center;
          }
        }
      }
    }
  }
  header {
    background-color: #fff;
    .backHerder {
      padding: 30px 0px 30px 0px;
    }
    > .item {
      // border: 1px solid #eeeeee;
      padding-left: 20px;
      // padding-top: 15px;
      // box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1);
      .message {
        display: grid;
        padding: 0px;
        // grid-template-columns: repeat(4, 25%);
        // padding-top: 30px;
      }
    }
  }

  footer {
    height: 96px;
    border: 1px solid rgba(240, 241, 243, 1);
    display: flex;
    justify-content: center;
    align-items: center;
    // margin-top: 200px;
    background-color: #fff;
  }
}
.pd-lf-20 {
  padding-left: 20px;
}
.option_title {
  padding: 10px 0;
  display: flex;
  text-align: center;
  span {
    flex: 3;
  }
}

.orderInfoTable {
  width: 100%;
  text-align: center;
  padding: 0;
  border: 1px solid #ddd;
  border-collapse: collapse;
  margin-bottom: 20px;
  td {
    border: 1px solid #ddd;
    height: 48px;
    line-height: 48px;
  }
}
</style>
