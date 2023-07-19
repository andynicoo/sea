<template>
  <div class="app-container">
    <div class="header-container">
      <header>
        <BackHerader @back="goBack" title="新增" class="backHerder" style="padding-left:17px;padding-top:20px;"></BackHerader>
        <div class="item">
          <Title class="title" titieName="基础信息"></Title>
          <el-form :model="editForm" ref="editFormRef" class="message pd-lf-20" :rules="ruleValidate" label-width="100px">
            <el-form-item label="推广人姓名" prop="channelUserName">
              <el-select v-model="editForm.channelUserName" style="width: 250px" clearable size="small" filterable @change="getPhone">
                <el-option-group>
                  <li class="option_title" style="background: #f6f8fa">
                    <span>姓名</span>
                    <span>手机号</span>
                    <span>部门</span>
                  </li>

                  <el-option v-for="(item, index) in selectlist" :key="index" :label="item.nickName" :value="item.nickName" class="option_title">
                    <span>{{ item.nickName }}</span>
                    &nbsp;
                    <span>{{ item.mobile }}</span>
                    &nbsp;
                    <span>{{ item.dep }}</span>
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
            <el-form-item label="推广人手机号">
              {{ editForm.channelUserMobile }}
            </el-form-item>
          </el-form>
        </div>
      </header>

      <div class="message pd-lf-20">
        <Title class="title" titieName="链接信息"></Title>
        <el-button class="add-btn" type="success" @click="addLink" v-if="editForm.listChannelPage.length < 8">
          +新增推广链接
        </el-button>
        <div class="add">
          <div class="link-box item" v-for="(item, key) in editForm.listChannelPage" :key="key">
            <div class="item">
              <div class="header">
                <span>链接信息</span>
                <div class="clearfix">
                  <el-button @click="delteLink(item, key)" v-if="editForm.listChannelPage.length > 1" size="small" circle class="delect">
                    <img src="../../images/close.png" class="colseBtn" alt="">
                  </el-button>
                </div>
              </div>

              <el-form label-width="100px" class="conten">
                <div class="link-box-info">
                  <el-form-item label="链接名称：" :required="true">
                    <el-input v-model="item.pageName" clearable style="width: 200px" size="small" placeholder="请输入链接名称" />
                  </el-form-item>
                  <el-form-item label="网页链接：" :required="true">
                    <el-input v-model="item.pageUrl" clearable style="width: 200px" size="small" placeholder="请输入网页链接" />
                  </el-form-item>
                  <el-form-item label="状态" size="small">
                    <el-select style="width: 200px" v-model="item.status">
                      <el-option label="正常" :value="1"></el-option>
                      <el-option label="禁用" :value="0" v-if="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-form>
            </div>
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
import { addStaff, getUserChannel, deleteChannelPage } from "@/api/newApi/extension/promotionExtend.js";
import { getAllUsers } from "@/api/user.js";
import BackHerader from "@/components/backHerader";
import Title from "@/components/title/index";
export default {
  components: {
    BackHerader,
    Title,
  },
  data() {
    return {
      editForm: {
        channelUserId: "",
        channelUserMobile: "",
        channelUserName: "",
        enterpriseId: " ",
        id: "",
        listChannelPage: [
          {
            pageName: "",
            pageUrl: "",
            status: 1,
          },
        ],
      },
      selectlist: [],
      editObj: {},
      ruleValidate: {
        channelUserName: [
          {
            required: true,
            message: "不允许为空",
            change: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.editForm.enterpriseId = window.localStorage.getItem("enterpriseId");
    this.editObj = JSON.parse(window.localStorage.getItem("editObj"));
    this.getUserList();
    if (this.editObj) {
      this.editForm.id = this.editObj.channelId;
    }
    if (this.editForm.id) {
      this.getEditData();
    }
  },
  methods: {
    /** 编辑回显 */
    getEditData() {
      getUserChannel({
        channelId: this.editObj.channelId,
      }).then((res) => {
        if (res.code == 0) {
          this.editForm = {
            channelUserMobile: res.data.channelUserMobile,
            channelUserName: res.data.channelUserName,
            listChannelPage: res.data.channelPageList,
            id: res.data.id,
          };
        } else {
        }
      });
    },
    /**
     * 提交新增/编辑
     */
    handleSubmit() {
      this.$refs.editFormRef.validate((valid) => {
        if (valid) {
          addStaff({
            channelUserId: this.editForm.channelUserId,
            channelUserMobile: this.editForm.channelUserMobile,
            channelUserName: this.editForm.channelUserName,
            enterpriseId: this.editForm.enterpriseId,
            id: this.editForm.id,
            channelPageList: this.editForm.listChannelPage,
          }).then((res) => {
            if (res.code == 0) {
              this.$message({
                type: "success",
                message: "添加成功",
              });
              this.goBack();
            } else {
              this.$message({
                type: "error",
                message: res.message,
              });
            }
          });
        }
      });
    },
    /**
     * 员工下拉列表
     */
    getUserList() {
      getAllUsers().then((res) => {
        if (res.code == 0) {
          this.selectlist = res.data;
        } else {
          this.$message({
            type: "error",
            message: res.message,
          });
        }
      });
    },
    /**下拉获取手机号 */
    getPhone() {
      this.selectlist.map((item) => {
        if (this.editForm.channelUserName == item.nickName) {
          this.editForm.channelUserMobile = item.mobile;
          this.editForm.channelUserId = item.userId;
        }
      });
    },
    /**动态新建链接 */
    addLink() {
      this.editForm.listChannelPage.push({
        pageName: "",
        pageUrl: "",
        status: 1,
      });
    },
    /**删除链接 */
    delteLink(item, key) {
      if (item.id) {
        deleteChannelPage({
          channelPageId: item.id,
        }).then((res) => {
          if (res.code == 0) {
            this.editForm.listChannelPage.splice(key, 1);
          } else {
            this.$message({
              type: "error",
              message: res.message,
            });
          }
        });
      } else {
        this.editForm.listChannelPage.splice(key, 1);
      }
    },
    /**返回 */
    goBack() {
      this.$router.push({ path: "/extension/promotionExtend/index" });
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
</style>
