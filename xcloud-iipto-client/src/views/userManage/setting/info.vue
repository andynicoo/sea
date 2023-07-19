<template>
  <div class="mainContent">
    <div class="user-info">
      <div class="top-card my-card" :style="contentStyleObj">
        <p class="title clearfix">
          <img src="@/assets/images/setting/settingIcon.svg" alt="" v-if="PROCESS_ENV.NODE_PLA==='kby'"/>
          <img src="@/assets/images/setting/settingIconwg.svg" alt="" v-if="PROCESS_ENV.NODE_PLA==='wg'" />
           个人信息
          <Button @click="modalInfo = true" type="text" class="fr">
            <img :src="imgSrclist.info" alt="" style="vertical-align: text-bottom" />
            修改资料
          </Button>
        </p>
        <div class="user-info">
          <div class="flex">
            <ul class="left">
              <li>昵称</li>
              <li>登录账号</li>
              <li>企业名称</li>
              <li>所在地</li>
            </ul>
            <ul class="right">
              <li>
                <span v-if="infos.nickname != ''">{{ infos.nickname }}</span>
                <span v-else class="no-info">未填写</span>
              </li>
              <li>
                <span v-if="infos.mobile != ''">{{ infos.mobile }}</span>
                <span v-else class="no-info">未填写</span>
                <!-- <span class="changeMobile"
                      @click="editPhoneModal=true">
                  <img :src="imgSrclist.mobile"
                       alt=""
                       style="vertical-align: middle;"> 修改
                </span> -->
              </li>
              <li>
                <span v-if="infos.companyName != ''">{{ infos.companyName }}</span>
                <span v-else class="no-info">未填写</span>
              </li>
              <li>{{ defaultCity }}</li>
            </ul>
          </div>
        </div>
      </div>
      <Modal v-model="modalInfo" title="修改资料" :mask-closable="false" :footer-hide="true">
        <Form ref="formInfo" :model="formInfo" :rules="ruleInfo" :label-width="100">
          <FormItem label="昵称:" prop="nickname">
            <Input type="text" v-model="formInfo.nickname" placeholder="昵称" :maxlength="20"></Input>
          </FormItem>
          <FormItem label="登录账号:">
            <Input type="text" :value="formInfo.mobile" disabled></Input>
          </FormItem>
          <FormItem label="企业名称:">
            <Input type="text" v-model="userInfo.companyName"></Input>
          </FormItem>
          <FormItem label="所在地:">
            <Cascader :placeholder="defaultCity" :data="dataArea" @on-change="getArea"></Cascader>
          </FormItem>
          <Divider />
          <FormItem>
            <Button class="bt" type="primary" @click="updateInfo">保存</Button>
          </FormItem>
        </Form>
      </Modal>
      <Modal v-model="modalPass" title="修改密码" :mask-closable="false" :footer-hide="true">
        <Form ref="formpass" :model="formpass" :rules="rulePass" :label-width="100">
          <FormItem style="height: 30px" label="当前密码:" prop="oldPassword">
            <Input type="password" v-model="formpass.oldPassword"></Input>
          </FormItem>
          <FormItem style="height: 30px" label="新密码:" prop="newPassword">
            <Input type="password" v-model="formpass.newPassword"></Input>
          </FormItem>
          <FormItem style="height: 30px" label="确认密码:" prop="newPass">
            <Input type="password" v-model="formpass.newPass"></Input>
          </FormItem>
          <FormItem>
            <Button class="bt" type="primary" :loading="updateLoading" @click="updatePass('formpass')">确认修改</Button>
          </FormItem>
        </Form>
      </Modal>
      <Modal v-model="editPhoneModal" @on-visible-change="setPhone" title="修改手机号" width="500" class-name="editModal" :mask-closable="false" :footer-hide="true">
        <div class="editContent">
          <p v-if="needChangeNum">为保障您的账号安全，修改手机号前需验证身份</p>
          <p v-else>新手机号</p>
          <Form ref="formPhone" :model="formPhone" :rules="rulePhone" :label-width="0">
            <FormItem label prop="mobile" v-if="needChangeNum">
              <Input type="text" v-model="formPhone.mobile" placeholder="请输入您的手机号" prefix="user-phonenum" disabled="disabled" />
            </FormItem>
            <FormItem label prop="newMobile" v-else>
              <Input type="text" v-model="formPhone.newMobile" placeholder="请输入需要更换的手机号" prefix="user-phonenum" />
            </FormItem>
            <Row style="margin-bottom: 16px">
              <Col span="16">
                <Input type="text" prefix="space" v-model="imgCode" placeholder="请输入图片验证码" :maxlength="4" class="imgCode-box" />
              </Col>
              <Col span="7" offset="1">
                <img :src="imgCodeSrc" alt="" @click="getImgCodeFun" style="cursor: pointer" />
              </Col>
            </Row>
            <Row>
              <Col span="16">
                <Input type="text" prefix="space" v-model="smsCode" placeholder="请输入验证码" :maxlength="6" class="imgCode-box" />
              </Col>
              <Col span="7" offset="1">
                <Button class="primary" v-if="needChangeNum" @click="getVerificationCode('formPhone', 5)">{{ btLogin }}</Button>
                <Button class="primary" v-else @click="getVerificationCode('formPhone', 6)">{{ btLogin }}</Button>
              </Col>
            </Row>
            <Row>
              <Button type="primary" style="margin-top: 30px" long @click="nextStep(1)" v-if="needChangeNum">下一步</Button>
              <Button type="primary" style="margin-top: 30px" long @click="nextStep(2)" v-else>完成</Button>
            </Row>
          </Form>
        </div>
      </Modal>
    </div>
  </div>
</template>
<script>
import Cookies from 'js-cookie';
import '@/assets/style/common.less';
import { updateInfo, getInfo1, personalCenterIndex } from '@/api/user/userModule';
import { getInfo, changePass, getImgCodeApi, getYzm, changeNext, newChangePhone } from '@/api/login/login';
export default {
  props: {},
  watch: {
    avatar1: {
      handler(newVal, old) {
        this.avatar1 = newVal;
      },
      deep: true,
    },
  },
  computed: {},
  data() {
    return {
      currentPage: 1,
      listTotal: 0,
      perPageCount: 3,
      inviteList: [],
      shareLink: '',
      columns1: [
        {
          title: '序号',
          align: 'center',
          type: 'index',
        },
        {
          title: '用户昵称',
          align: 'center',
          render(h, params) {
            let userNickname = params.row.userNickname;
            if (userNickname == '') {
              return h('span', '未填写');
            } else {
              return h('span', userNickname);
            }
          },
        },
        {
          title: '手机号',
          align: 'center',
          render(h, params) {
            let mobile = params.row.userMobile;
            return h('span', mobile.slice(0, 7) + '****');
          },
        },
        {
          title: '注册时间',
          align: 'center',
          key: 'createTime',
        },
      ],
      companyName: '',
      modalInfo: false, //修改资料
      modalPass: false, //修改密码
      inviteBox: false, //去邀请
      formpass: {},
      rulePass: {
        newPassword: [{ required: true, message: '不可为空', trigger: 'blur' }],
        oldPassword: [{ required: true, message: '不可为空', trigger: 'blur' }],
      },
      //
      dataArea: this.AREA1, // 省市数据，和客户管理系统一致
      formInfo: {},
      ruleInfo: {},
      infos: {},
      tel: '',
      defaultCity: '',
      province: '',
      city: '',
      uploadImg: this.uploadUrl,
      fileNow: '',
      avatar1: '',
      contentStyleObj: {
        height: '',
      },
      updateLoading: false,
      haveServicesCount: 0, //拥有的服务
      haveCouponCount: 0, //拥有的优惠券
      inviteUserCount: 0, //邀请的用户
      imgSrclist: {
        info: require('@/assets/images/user/modifyBlue.png'),
        mobile: require('@/assets/images/user/changepsHover.png'),
      },
      userInfo: {},
      editPhoneModal: false,
      formPhone: {
        mobile: '',
        newMobile: '',
      },
      rulePhone: {
        mobile: [
          {
            type: 'number',
            message: '请填写正确手机号',
            trigger: 'change',
            transform(value) {
              let reg = new RegExp('^[1][3-9][0-9]{9}$');
              if (!reg.test(value)) {
                return false;
              } else {
                return Number(value);
              }
            },
          },
        ],
        newMobile: [
          {
            type: 'number',
            message: '请填写正确手机号',
            trigger: 'change',
            transform(value) {
              let reg = new RegExp('^[1][3-9][0-9]{9}$');
              if (!reg.test(value)) {
                return false;
              } else {
                return Number(value);
              }
            },
          },
        ],
      },
      imgCode: '',
      codeKey: '',
      imgCodeSrc: '',
      smsCode: '',
      btLogin: '获取验证码',
      needChangeNum: true,
      ifClick: false,
    };
  },
  methods: {
    // edit pass
    updatePass(all) {
      // console.log(this.formpass);
      this.$refs[all].validate((valid) => {
        if (valid) {
          if (this.formpass.newPassword !== this.formpass.newPass) {
            this.$Message.error('新密码两次输入不一致，请重新输入');
          } else {
            let obj = {
              newPassword: this.formpass.newPassword,
              oldPassword: this.formpass.oldPassword,
            };
            changePass(obj)
              .then(
                (res) => {
                  if (res.code === 0) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('sessionId');

                    Cookies.remove('token');
                    Cookies.remove('sessionId');
                    this.$Modal.success({
                      title: '修改成功',
                      content: '密码修改成功，请重新登录！',
                      onOk: function() {
                        location.reload();
                      },
                    });
                  } else {
                    this.$Message.error(res.message);
                  }
                },
                (err) => {
                  this.$Message.error(err.message);
                }
              )
              .finally(() => {});
          }
        } else {
        }
      });
    },
    // 选省市区
    getArea(value, selectedData) {
      const areaName = selectedData.map((item) => item.label);
      this.args = [...areaName];
      this.province = this.args[0];
      this.city = this.args[1];
      console.log(this.province);
      console.log(this.city);
    },
    uploadFile(res, file, fileList) {
      // console.log(res);
      if (res.code == 0) {
        this.fileNow = res.data.fileUrl;
      } else {
        this.$Message.warning('上传失败');
      }
    },
    updateInfo() {
      // console.log(this.fileNow);
      // console.log(this.formInfo);
      // debugger;

      this.updateLoading = true;
      let obj = {
        nickname: this.formInfo.nickname,
        avatar: this.formInfo.avatar,
        province: this.province,
        city: this.city,
        country: this.formInfo.country,
        companyName: this.userInfo.companyName,
      };
      updateInfo(obj)
        .then(
          (res) => {
            // console.log(res);
            this.updateLoading = false;
            if (res.code == 0) {
              this.$Message.success('修改成功');
              this.modalInfo = false;
              this.getUserInfo();
            } else {
              this.$Message.error(res.message);
            }
          },
          (err) => {
            // console.log(err);
            this.$Message.warning(err.message);
          }
        )
        .finally(() => {});
    },
    //获取用户信息
    getUserInfo() {
      let self = this;
      // debugger;
      getInfo1()
        .then(
          (res) => {
            // console.log(res);
            if (res.code == 0) {
              localStorage.setItem('objInfo', JSON.stringify(res.data)); //save local
              this.infos = res.data;
              this.defaultCity = this.infos.province + '/' + this.infos.city;
              this.tel = this.infos.mobile;
              this.modalInfo = false;
            } else {
              this.$Message.error(res.message);
            }
          },
          (err) => {
            this.$Message.error(err.message);
          }
        )
        .finally(() => {});
      this.getUserService();
    },
    getUserService() {
      personalCenterIndex().then((res) => {
        if (res.code === 0) {
          this.haveServicesCount = res.data.haveServicesCount;
          this.haveCouponCount = res.data.haveCouponCount;
          this.inviteUserCount = res.data.inviteUserCount;
          this.userInfo = res.data;
          // localStorage.setItem('invitedCode',res.data.invitedCode)
          let host = '',
            url = window.location.href;
          let regex = /.*\:\/\/([^\/]*).*/;
          let match = url.match(regex);
          host = match[1];
          this.shareLink = this.homePageUrl + '?invitedCode=' + res.data.invitedCode;
        }
      });
    },
    //屏幕高度
    getHeight() {
      this.contentStyleObj.height = window.screen.height - 220 + 'px';
    },
    setPhone(obj) {
      if (obj) {
        this.formPhone.mobile = this.formInfo.mobile;
        this.needChangeNum = true;
        this.imgCode = '';
        this.getImgCodeFun();
      }
    },
    // 点击获取验证码
    getVerificationCode(phone, type) {
      this.$refs[phone].validate((valid) => {
        if (valid) {
          this.getGeetest(type);
        }
      });
    },
    // send code
    getGeetest(type) {
      let self = this;
      if (self.ifClick) return;
      self.verificationCodeCount = 120;
      if (this.imgCode == '') {
        this.$Message.error('请先输入图形验证码');
        return;
      }
      let mobileNum = '';
      if (this.needChangeNum) {
        mobileNum = self.formPhone.mobile;
      } else {
        mobileNum = self.formPhone.newMobile;
      }
      let params = {
        mobile: mobileNum,
        type: type,
        signSource: 2,
        imageCodeKey: this.codeKey,
        imageCodeValue: this.imgCode,
      };
      getYzm(params)
        .then(
          (res) => {
            if (res.code == 0) {
              this.$Message.success('短信发送成功');
              self.verificationCodeTimer = setInterval(() => {
                if (self.verificationCodeCount == 0) {
                  self.btLogin = '获取验证码';
                  clearInterval(self.verificationCodeTimer);
                  self.ifClick = false;
                } else {
                  self.ifClick = true;
                  self.verificationCodeCount--;
                  self.btLogin = `${self.verificationCodeCount}秒后重新获取`;
                }
              }, 1000);
            } else {
              self.getImgCodeFun();
              self.ifClick = false;
            }
          },
          (err) => {
            // this.$Message.error(err.message);
            self.ifClick = false;
          }
        )
        .finally(() => {
          self.ifClick = false;
        });
    },
    //获取图片验证码
    getImgCodeFun() {
      getImgCodeApi().then((res) => {
        if (res.code == 0) {
          this.$nextTick(() => {
            this.codeKey = res.data.codeKey;
            this.imgCodeSrc = res.data.image;
          });
        }
      });
    },
    // 下一步
    nextStep(type) {
      let self = this;
      if (self.ifClick && self.smsCode === '') return;
      if (type === 1) {
        changeNext({
          code: self.smsCode,
        })
          .then((res) => {
            if (res.code === 0) {
              self.imgCode = '';
              self.needChangeNum = false;
              self.smsCode = '';
              self.verificationCodeCount = 0;
              self.ifClick = false;
              this.getImgCodeFun();
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        newChangePhone({
          newMobile: self.formPhone.newMobile,
          code: self.smsCode,
        })
          .then((res) => {
            if (res.code === 0) {
              localStorage.removeItem('token');
              localStorage.removeItem('sessionId');

              Cookies.remove('token');
              Cookies.remove('sessionId');
              self.$Modal.success({
                title: '手机绑定成功',
                content: '更换绑定手机，请重新登录！',
                onOk: function() {
                  location.reload();
                },
              });
            } else {
              this.$Message.error(res.message);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
  },
  created() {
    this.getHeight();
    this.infos = JSON.parse(localStorage.getItem('objInfo'));
    this.formInfo = this.infos;
    this.defaultCity = this.infos.province + '/' + this.infos.city;
  },
  mounted() {
    this.getUserService();
    this.getImgCodeFun();
  },
};
</script>
<style lang="less" scoped>
.mainContent {
  display: inline-block;
  width: 946px;
  vertical-align: top;
  box-shadow: 0px 2px 6px 0px rgba(0, 21, 41, 0.06);
  .tb {
    // width: 400px;
    cursor: pointer;
    padding-left: 41px;
    margin-top: 20px;
    color: #303033;
    .login-btn {
      margin-bottom: 180px;
    }
    .label {
      padding-right: 38px;
      display: inline-block;
      text-align: right;
      width: 100px;
      color: #626266;
      margin-bottom: 20px;
    }
  }
  .service,
  .invite {
    background-color: #fff;
    margin-top: 20px;
    width: 32%;
    text-align: center;
    height: 320px;
    border-radius: 4px;
    box-shadow: 1px 1px 1px #e5e5e5;
    margin-right: 1%;
    .left {
      .leftImg1 {
        width: 61px;
        height: 69px;
        &:nth-child(2) {
          display: none;
        }
      }
      .leftImg2 {
        width: 77px;
        height: 65px;
        &:nth-child(2) {
          display: none;
        }
      }
      .leftImg3 {
        width: 82px;
        height: 57px;
        &:nth-child(2) {
          display: none;
        }
      }
      .title {
        font-size: 16px;
        color: #333333;
        margin-top: 20px;
      }
    }
    .right {
      .num {
        font-size: 84px;
        color: #00a3ff;
      }
    }
    .title {
      color: #626266;
      font-size: 16px;
    }
    .num {
      font-size: 44px;
      margin: 20px 0 40px 0;
      color: #00a3ff;
    }
  }
  .invite {
    .num {
      color: #00a3ff;
    }
    .ivu-btn {
      color: #00a3ff;
      border-color: #00a3ff;
    }
  }
  .commonBox {
    width: 350px;
    height: 215px;
    // background:rgba(22,173,233,1);
    border-radius: 8px;
    &/deep/ .ivu-tabs {
      .ivu-tabs-bar {
        margin: 0px;
        border-bottom: 2px solid #f9f7fa;
        .ivu-tabs-nav-right {
          margin-top: 15px;
          margin-right: 15px;
          img {
            width: 9px;
          }
          img:nth-child(2) {
            display: none;
          }
        }
      }
      .ivu-tabs-tab {
        font-weight: normal;
        color: #999999 !important;
      }
      .ivu-tabs-content {
        height: 172px;
      }
    }
    &:nth-child(2) {
      margin: 20px 36px 0px;
    }
  }
  .commonBox:hover {
    cursor: pointer;
    background: #00a3ff;
    &/deep/ .ivu-tabs {
      .ivu-tabs-bar {
        border-color: #65beee;
        .ivu-tabs-nav-right {
          img:nth-child(1) {
            display: none;
          }
          img:nth-child(2) {
            display: block;
          }
        }
      }
      .ivu-tabs-tab {
        transition: none;
        color: #ffffff !important;
      }
      .ivu-tabs-content {
        .left {
          img:nth-child(1) {
            display: none;
          }
          img:nth-child(2) {
            display: block;
          }
          .title {
            color: #ffffff;
          }
        }
        .right {
          .num {
            color: #ffffff;
          }
        }
      }
    }
  }
  &/deep/ .ivu-form-item {
    margin-bottom: 24px;
    &/deep/ .ivu-form-item-content {
      line-height: 30px;
      &/deep/ .ivu-input {
        height: 30px;
      }
    }
  }
  /deep/ .ivu-btn-ghost.ivu-btn-info {
    color: #00a3ff;
  }
  /deep/ .ivu-btn-ghost.ivu-btn-info:hover {
    color: #fff;
    background-color: #00a3ff;
  }
  .ivu-upload-select {
    .ava-setion {
      position: relative;
      width: 96px;
      height: 96px;
      border-radius: 50%;
      background-color: rgba(215, 215, 215, 1);
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
      .subtitle {
        position: absolute;
        bottom: -2px;
        left: 0;
        right: 0;
        margin: 0 auto;
        color: #fff;
        background: rgba(0, 0, 0, 0.6);
        width: 90px;
        height: 32px;
        text-align: center;
        border-bottom-right-radius: 30px;
        border-bottom-left-radius: 32px;
        display: none;
        color: #fff;
        cursor: pointer;
      }
      &:hover .subtitle {
        display: block;
      }
    }
  }
  .middlehd {
    &/deep/.ivu-form-item-label {
      padding-top: 42px;
    }
  }
}
&/deep/.ivu-tabs-ink-bar {
  display: none;
}
.bt {
  margin-bottom: 20px;
  width: 80%;
}
&/deep/ .ivu-table:before {
  height: 0;
}
.pageSetion {
  text-align: right;
  padding: 20px 0;
  .pagination {
    display: inline-block;
    line-height: 20px;
  }
  .totalNum {
    font-size: 14px;
    color: #9a9ca1;
  }
  &/deep/.ivu-page-simple .ivu-page-simple-pager input {
    padding: 0;
    margin: 0;
  }
  &/deep/.ivu-page-simple-pager {
    margin-right: 0;
  }
}
.tb-common {
  padding-top: 0;
  &/deep/ .ivu-table-cell {
    padding: 0 !important;
  }
  &/deep/ .ivu-table-row {
    margin-bottom: 20px;
    .rowSum {
      height: 58px;
      &/deep/ .ivu-btn {
        height: 22px;
      }
    }
  }

  & .title {
    line-height: 58px;
    background: #f7f7f7;
    display: flex;
    border: 1px solid #e6e6e6;
    margin-bottom: 20px;
    margin-top: 13px;
    & .img {
      width: 30px;
    }
    & .wrapper {
      flex: 1;
      display: flex;
      height: 44px;
      & .title-item {
        flex: 1;
        color: #626466;
        font-size: 14px;
        line-height: 44px;
        flex-grow: 1;
      }
    }
  }

  .tbList {
    // border-bottom: 1px solid #e6e6e6;
    .listOrder {
      margin-bottom: 20px;
      border-top: 1px solid #e6e6e6;
      border-bottom: 1px solid #e6e6e6;
      .title {
        margin-bottom: 0px;
        margin-top: 0px;
        border-top: none;
        span {
          padding-right: 27px;
          line-height: 44px;
          color: #626266;
        }
      }
    }
  }
  & .content1 {
    display: flex;
    border: 1px solid #e6e6e6;
    border-bottom: none;
    border-top: none;
    & .img {
      width: 30px;
      text-align: center;
      box-sizing: border-box;
      padding: 15px 18px;
      border-bottom: 1px solid #e6e6e6;

      border-radius: 4px;
      & img {
        width: 100%;
        background: #ccc;
        max-height: 120px;
        border-radius: 4px;
      }
    }
    & .wrapper {
      flex: 1;
      display: flex;
      & .content-item {
        height: 95px;
        line-height: 95px;
        flex: 1;
        border-bottom: 1px solid #e6e6e6;
        text-align: center;
        flex-grow: 1;
        & .main-name {
          color: rgba(34, 34, 34, 1);
        }
        & .sub-name {
          color: #999999;
        }
        & .type {
          padding-top: 5px;
          color: #222222;
          font-size: 14px;
        }
        & .price {
          display: inline-block;
          margin-right: 3px;
          padding-top: 5px;
          color: #222222;
        }
        & .origin-price {
          color: #9a9ca1;
          position: relative;
        }
        & .origin-price::after {
          content: '__________';
          position: absolute;
          left: 0;
        }
        & .count {
          padding-top: 5px;
          display: inline-block;
        }
        &/deep/ .ivu-input-wrapper {
          padding-right: 20px;
        }
        &/deep/ .ivu-input {
          border-radius: 0px;
          // padding-right: 10px;
        }
        .statusInfo {
          line-height: 40px;
          padding-top: 10%;
        }
        &/deep/ .bt-pay {
          background-color: #fc6054;
          margin-right: 1%;
          border: none;
        }
      }
      .lineR {
        border-right: 1px solid #e6e6e6;
      }
      .noBorder {
        border-bottom: none;
      }
    }
  }
  &/deep/.ivu-page {
    text-align: center;
    padding-bottom: 20px;
  }
}
&/deep/ .ivu-tabs-tab {
  font-weight: bold;
  margin-top: 5px;
}
&/deep/ .ivu-btn-text {
  padding-left: 5px;
  margin-top: 5px;
}
.ivu-btn-text:hover {
  color: #00a3ff;
}
.invit-title {
  font-size: 20px;
  font-weight: 500;
  color: #303033;
  text-align: center;
  margin-top: 22px;
}
.invit-content {
  margin-left: 20px;
  margin-top: 20px;
  padding-bottom: 30px;
  .invit-input {
    width: 480px;
    display: inline-block;
    height: 40px;
    line-height: 40px;
    padding-left: 14px;
    background-color: #f0f0f0;
  }
  /deep/ .ivu-input {
    height: 40px;
    border-radius: 0;
    padding: 11px 14px;
  }
  .link-btn {
    display: inline-block;
    width: 88px;
    height: 40px;
    color: #fff;
    line-height: 40px;
    text-align: center;
    background-color: #00a3ff;
    font-size: 14px;
    cursor: pointer;
  }
  .active-rule {
    width: 568px;
    margin-top: 15px;
    background-color: #faf7f8;
    padding: 18px 10px;
    color: #303033;
    .rule-title {
      font-size: 14px;
      font-size: 500;
      margin-top: 8px;
    }
    .rule-content {
      font-size: 12px;
      line-height: 24px;
    }
  }
}
/deep/ .vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
  }
}
/deep/ .editContent {
  p {
    padding: 5px;
    font-size: 14px;
    margin-bottom: 10px;
  }
  img {
    width: 100%;
    height: 32px;
  }
  .ivu-input-with-prefix {
    padding-left: 10px !important;
  }
}
/deep/ .editModal {
  .ivu-modal-body {
    padding: 30px;
    padding-bottom: 30px !important;
  }
}

.top-card {
  font-family: 'SourceHanSansSC-Medium,SourceHanSansSC';
  color: rgba(51, 51, 51, 1);
  .title {
    padding-bottom: 22px;
    font-size: 20px;
    font-weight: 500;
    border-bottom: 1px solid #ebebeb;
    font-family: PingFangSC-Medium, PingFang SC;
    img {
      vertical-align: middle;
    }
    .fr {
      color: #00a3ff;
      font-size: 14px;
    }
  }
  .user-info {
    font-size: 16px;
    .flex {
      .left {
        text-align: right;
        min-width: 70px;
      }
      .right {
        margin-left: 20px;
        font-weight: 600;
        .changeMobile {
          color: #00a3ff;
          font-size: 12px;
          font-weight: 400;
          margin-left: 22px;
          cursor: pointer;
        }
      }
      li {
        margin-top: 20px;
        .no-info {
          color: #999;
        }
      }
    }
  }
}
/* 弹窗头部 */
/deep/ .ivu-modal-header {
  background: #ffffff !important;
}
</style>
