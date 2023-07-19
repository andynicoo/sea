<template>
  <div class="mainContent">
    <div class="commontitle">
      我的信息
    </div>
    <div class="headContent">
      <div class="tabTitle">
        <span :class="{ 'active-tab': type == 1 }" @click="type = 1">基本信息</span>
        <span :class="{ 'active-tab': type == 2 }" @click="type = 2">修改密码</span>
        <span :class="{ 'active-tab': type == 3 }" @click="type = 3" v-show="envpla === 'ksy'">授权管理</span>
      </div>
    </div>
    <div v-if="type === 1">
      <div class="userInfoContent">
        <div class="top-card my-card">
          <p class="title clearfix">
            <span>基本信息</span>
            <Button @click="modalDestory = true" type="text">
              <img :src="imgSrclist.warning" alt="" style="vertical-align: text-bottom" />
              注销账号
            </Button>
            <Button @click="modalInfo = true" type="text">
              <img :src="imgSrclist.info" alt="" style="vertical-align: text-bottom" />
              修改资料
            </Button>
          </p>
          <div class="user-info">
            <Form label-position="right" :label-width="120">
              <FormItem label="昵称">
                <span v-if="infos.nickname">{{ infos.nickname }}</span>
                <span v-else class="no-info">未填写</span>
              </FormItem>
              <FormItem label="登录账号">
                <span v-if="infos.userMobile">{{ infos.userMobile }}</span>
                <span v-else class="no-info">未填写</span>
              </FormItem>
              <FormItem label="会员等级">
                <span>{{ vipName }}</span>
              </FormItem>
              <FormItem label="企业名称">
                <span v-if="infos.companyName">{{ infos.companyName }}</span>
                <span v-else class="no-info">未填写</span>
              </FormItem>
              <FormItem label="所在地">
                <span v-if="infos.province">{{ infos.province }}/{{ infos.city }}</span>
                <span class="no-info" v-else>未填写</span>
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    </div>
    <div v-if="type === 2">
      <div class="userInfoContent">
        <div class="top-card my-card">
          <p class="title clearfix">
            <span>修改密码</span>
          </p>
          <div class="passWordContent">
            <get-pass-by-code v-if="getPassBoolean" :phone="infos.userMobile" />
            <Form v-else ref="formpass" :model="formpass" :rules="rulePass" :label-width="100">
              <div style="display: flex;align-items: center;margin-bottom: 24px;">
                <FormItem style="height: 30px; width: 344px;margin-bottom: 0;" label="当前密码:" prop="oldPassword">
                  <Input type="password" v-model="formpass.oldPassword"></Input>
                </FormItem>
                <span
                  @click="getPassBoolean = true"
                  style="cursor: pointer;display: inline-block;color: #57a3f3;margin-left: 10px;"
                  >忘记密码</span
                >
              </div>
              <div>
                <FormItem style="height: 30px; width: 344px" label="新密码:" prop="newPassword">
                  <Input type="password" v-model="formpass.newPassword"></Input>
                </FormItem>
              </div>
              <FormItem style="height: 30px; width: 344px" label="确认密码:" prop="newPass">
                <Input type="password" v-model="formpass.newPass"></Input>
              </FormItem>
              <FormItem>
                <Button class="bt" type="primary" :loading="updateLoading" @click="updatePass('formpass')">
                  确认修改
                </Button>
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    </div>
    <div v-if="type === 3">
      <div class="userInfoContent">
        <div class="top-card my-card">
          <p class="title clearfix">
            <span>已获得授权</span>
          </p>
          <div class="table-wrap">
            <Table border :columns="columnsAuth" :data="dataAuth">
              <template #name="{ row, index }">
                <span>{{ index + 1 }}</span>
              </template>

              <template #plat="{ row }">
                <span>{{
                  row.authPlatform === 'AIRWALLEX'
                    ? '空中云汇'
                    : row.authPlatform === 'LIANLIANGLOBAL'
                    ? '连连国际'
                    : ''
                }}</span>
              </template>

              <template #radio="{ row }">
                <Radio v-model="row.checked"></Radio>
                <div class="radio-wrap" @click="radioChange(row)"></div>
              </template>
              <template #action="{ row, index }">
                <template v-if="row.checked && dataAuth.length != 1">
                  <!-- <Tooltip content="请先调整默认账户" placement="top"> -->
                  <img src="@/assets/images/user/disableCancel.svg" alt="" title="请先调整默认账户" />
                  <!-- </Tooltip> -->
                </template>
                <span @click="unbindCheck(row)" v-else class="cancel-auth-btn">解除授权</span>
              </template>
            </Table>
          </div>

          <div class="pageSetion clearfix">
            <Page
              class="pagination"
              :current="authListCurrent"
              :total="authListTotal"
              @on-change="changePageHandler"
              @on-page-size-change="pageSizeChangeHandler"
              :page-size="authListSize"
            />
          </div>
        </div>
      </div>
    </div>
    <Modal v-model="modalInfo" title="修改资料" :mask-closable="false" :footer-hide="true">
      <Form ref="formInfo" :model="formInfo" :rules="ruleInfo" :label-width="100">
        <FormItem label="昵称:" prop="nickname">
          <Input type="text" v-model="formInfo.nickname" placeholder="昵称" :maxlength="20"></Input>
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
    <Modal
      v-model="editPhoneModal"
      @on-visible-change="setPhone"
      title="修改手机号"
      width="500"
      class-name="editModal"
      :mask-closable="false"
      :footer-hide="true"
    >
      <div class="editContent">
        <p v-if="needChangeNum">为保障您的账号安全，修改手机号前需验证身份</p>
        <p v-else>新手机号</p>
        <Form ref="formPhone" :model="formPhone" :rules="rulePhone" :label-width="0">
          <FormItem label prop="mobile" v-if="needChangeNum">
            <Input
              type="text"
              v-model="formPhone.mobile"
              placeholder="请输入您的手机号"
              prefix="user-phonenum"
              disabled="disabled"
            />
          </FormItem>
          <FormItem label prop="newMobile" v-else>
            <Input
              type="text"
              v-model="formPhone.newMobile"
              placeholder="请输入需要更换的手机号"
              prefix="user-phonenum"
            />
          </FormItem>
          <Row style="margin-bottom: 16px">
            <Col span="16">
              <Input
                type="text"
                prefix="space"
                v-model="imgCode"
                placeholder="请输入图片验证码"
                :maxlength="4"
                class="imgCode-box"
              />
            </Col>
            <Col span="7" offset="1">
              <img :src="imgCodeSrc" alt="" @click="getImgCodeFun" style="cursor: pointer" />
            </Col>
          </Row>
          <Row>
            <Col span="16">
              <Input
                type="text"
                prefix="space"
                v-model="smsCode"
                placeholder="请输入验证码"
                :maxlength="6"
                class="imgCode-box"
              />
            </Col>
            <Col span="7" offset="1">
              <Button class="primary" v-if="needChangeNum" @click="getVerificationCode('formPhone', 5)">
                {{ btLogin }}
              </Button>
              <Button class="primary" v-else @click="getVerificationCode('formPhone', 6)">{{ btLogin }}</Button>
            </Col>
          </Row>
          <Row>
            <Button type="primary" style="margin-top: 30px" long @click="nextStep(1)" v-if="needChangeNum">
              下一步
            </Button>
            <Button type="primary" style="margin-top: 30px" long @click="nextStep(2)" v-else>完成</Button>
          </Row>
        </Form>
      </div>
    </Modal>
    <Modal v-model="inviteBox" :mask-closable="false" footer-hide :width="640" class-name="vertical-center-modal">
      <p class="invit-title" slot="header">快速邀请朋友，一键报税！</p>
      <div class="invit-content">
        <p class="invit-input fl">{{ shareLink }}</p>
        <p class="link-btn cobyOrderSn" data-clipboard-action="copy" :data-clipboard-text="shareLink" @click="copyLink">
          复制链接
        </p>
      </div>
    </Modal>
    <div class="destory-error" v-if="modalDestory">
      <div class="error">
        <Alert type="error" show-icon closable @on-close="modalDestory = false">
          预警提示！
          <span slot="desc">
            注销账户后手机号账户不可登录，同时清空帐号下所有数据，请谨慎操作！
            <p class="tips">
              <strong>请问是否确认注销帐号！</strong>
              <a @click="handleDestroyAccount">确认</a>
              <a @click="modalDestory = false">取消</a>
            </p>
          </span>
        </Alert>
      </div>
    </div>
  </div>
</template>
<script>
import '@/styles/common.less';
import { updateInfo, getInfo1, inviteUser, authorizeList } from '@/api/user/userModule';
import { changePass, getImgCodeApi, getYzm, changeNext, newChangePhone, destroyAccount } from '@/api/login/login';
import { unbindCheck, changeDefault } from '@/api/taxBureauService/taxBureauService';
import getPassByCode from '../components/getPassByCode';
import Cookies from 'js-cookie';
export default {
  props: {},
  components: { getPassByCode },
  watch: {
    avatar1: {
      handler(newVal, old) {
        this.avatar1 = newVal;
      },
      deep: true,
    },
    modalInvite(val, old) {
      if (val) {
        this.getInviteList();
      }
    },
  },
  computed: {},
  data() {
    return {
      type: 1,
      currentPage: 1,
      listTotal: 0,
      perPageCount: 3,
      inviteList: [],
      authListCurrent: 1,
      authListTotal: 0,
      authListSize: 10,
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
      modalInvite: false, //邀请用户
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
      uploadImg: this.ImgUrl,
      fileNow: '',
      avatar1: '',
      contentStyleObj: {
        height: '',
      },
      imgSrclist: {
        info: require('@/assets/images/user/modifyBlue.png'),
        mobile: require('@/assets/images/user/changepsHover.png'),
        warning: require('@/assets/images/common/reason.png'),
      },
      userInfo: {},
      editPhoneModal: false,
      modalDestory: false,
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
      updateLoading: false,
      columnsAuth: [
        {
          title: '序号',
          slot: 'name',
          width: 280,
        },
        {
          title: '平台',
          slot: 'plat',
        },
        {
          title: '账户名称',
          key: 'authAccount',
        },
        {
          title: '默认账户',
          slot: 'radio',
          width: 280,
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center',
        },
      ],
      dataAuth: [],
      getPassBoolean: false,
      vipName: localStorage.getItem('vipName'),
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
    changePageHandler(page) {
      this.authListCurrent = page;
      this.getAuthorizeList();
    },
    pageSizeChangeHandler(pageSize) {
      this.authListSize = pageSize;
      this.getAuthorizeList();
    },
    // 选省市区
    getArea(value, selectedData) {
      const areaName = selectedData.map((item) => item.label);
      this.args = [...areaName];
      this.province = this.args[0];
      this.city = this.args[1];
    },
    uploadFile(res, file, fileList) {
      if (res.code == 0) {
        this.fileNow = res.data.fileUrl;
      } else {
        this.$Message.warning('上传失败');
      }
    },
    updateInfo() {
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
            this.$Message.warning(err.message);
          }
        )
        .finally(() => {});
    },
    //获取用户信息
    getUserInfo() {
      getInfo1()
        .then(
          (res) => {
            if (res.code == 0) {
              this.infos = res.data;
              localStorage.setItem('objInfo', JSON.stringify(res.data)); //save local
              this.defaultCity = this.infos.province + '/' + this.infos.city;
              this.tel = this.infos.userMobile;
              this.modalInfo = false;
              this.userInfo = res.data;
            } else {
              this.$Message.error(res.message);
            }
          },
          (err) => {
            this.$Message.error(err.message);
          }
        )
        .finally(() => {});
    },
    unbindCheck(row) {
      this.$Modal.confirm({
        title: '解除授权',
        content:
          '<p style="color: #333;font-size: 14px;">解除授权后，将不能再使用此账户的钱包余额在线支付税金，除非您再次授权。确认解除？</p>',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          unbindCheck({ thirdPaymentOauthId: row.id })
            .then((res) => {
              if (res.code == 0) {
                if (res.data) {
                  window.open(res.data);
                }
              }
            })
            .catch((err) => {
              console.log(err);
            });
        },
      });
    },
    //获取授权信息
    getAuthorizeList() {
      authorizeList({
        limit: this.authListSize,
        page: this.authListCurrent,
        userId: JSON.parse(localStorage.getItem('objInfo')).userId,
      })
        .then(
          (res) => {
            if (res.code == 0) {
              res.data.records.map((item) => {
                if (item.defaultFlag == 1) {
                  item.checked = true;
                }
              });
              this.authListTotal = Number(res.data.total);
              this.dataAuth = res.data.records;
            } else {
              this.$Message.error(res.message);
            }
          },
          (err) => {
            this.$Message.error(err.message);
          }
        )
        .finally(() => {});
    },
    registerChangePageHandler(current) {
      this.currentPage = current;
      this.getInviteList();
    },
    radioChange(row) {
      changeDefault({
        defaultFlag: 1,
        id: row.id,
        userId: JSON.parse(localStorage.getItem('objInfo')).userId,
      }).then((res) => {
        if (res.code == 0) {
          this.getAuthorizeList();
        }
      });
    },
    registerPageSizeChangeHandler(pageSize) {
      this.perPageCount = pageSize;
      this.getInviteList();
    },
    //屏幕高度
    getHeight() {
      this.contentStyleObj.height = window.screen.height - 220 + 'px';
    },
    changePage(type) {
      this.$router.push({
        path: '/' + type,
      });
    },
    changeImageSrc() {},
    copyLink() {
      let _this = this;
      let clipboard = new this.clipboard('.cobyOrderSn');
      clipboard.on('success', function() {
        _this.$Message.success('复制成功');
      });
      clipboard.on('error', function() {
        _this.$Message.info('复制失败');
      });
      setTimeout(() => {
        clipboard.destroy();
      }, 1000);
    },
    getInviteList(page) {
      let data = {
        limit: this.perPageCount,
        page: this.currentPage,
      };
      inviteUser(data).then((res) => {
        if (res.code === 0) {
          this.inviteList = res.data.records;
          this.listTotal = res.data.total - 0;
        }
      });
    },
    setPhone(obj) {
      if (obj) {
        this.formPhone.mobile = this.formInfo.mobile;
        this.needChangeNum = true;
        this.imgCode = '';
        // this.getImgCodeFun();
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
        signSource: 1,
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
              // self.getImgCodeFun();
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
              // this.getImgCodeFun();
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
    // 注销账号
    handleDestroyAccount() {
      destroyAccount().then((res) => {
        if (res.code === 0) {
          localStorage.removeItem('token');
          localStorage.removeItem('sessionId');
          localStorage.removeItem('sidebarStatus');

          Cookies.remove('token');
          Cookies.remove('sessionId');
          this.$store.commit('saveLogin', false);
          this.$store.commit('saveLeft', false);
          sessionStorage.removeItem('showGuideFromLogin');
          this.$router.push('/');
        }
      });
    },
  },
  created() {
    this.getHeight();
    this.infos = JSON.parse(localStorage.getItem('objInfo'));
    this.formInfo = this.infos;
    this.defaultCity = this.infos.province + '/' + this.infos.city;
  },
  mounted() {
    this.getUserInfo();
    this.getAuthorizeList();
    // this.getImgCodeFun();
  },
};
</script>
<style lang="less" scoped>
body {
  padding-right: 0px !important;
}
.mainContent {
  min-height: calc(100vh - 60px);
  .headContent {
    background: #ffffff;
    box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 0.12);
    padding: 10px 32px 0px;
    .top {
      margin-bottom: 14px;
      .flink,
      .clink {
        font-size: 14px;

        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
        line-height: 22px;
      }
      .clink {
        font-weight: 500;
        color: rgba(0, 0, 0, 0.65);
      }
    }
    .bottom {
      font-size: 20px;
      font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 28px;
      span {
        font-size: 14px;

        font-weight: 400;
        color: rgba(0, 0, 0, 0.65);
        line-height: 22px;
      }
    }
    .tabTitle {
      border-bottom: 1px solid #e9e9e9ff;
      margin-top: 0px;
      span {
        display: inline-block;
        font-size: 14px;
        font-weight: 500;
        font-family: 'Microsoft Yahei', PingFangSC;
        color: #333333;
        line-height: 40px;
        margin-right: 46px;
        cursor: pointer;
      }
      .active-tab {
        color: #1890ffff;
        border-bottom: 2px solid #1890ffff;
        font-weight: 500;
      }
    }
  }
  .userInfoContent {
    margin: 24px 24px 0 24px;
    background: #ffffff;
    .passWordContent {
      margin-top: 24px;
      margin-left: 14px;
      .bt {
        width: auto;
      }
    }
  }
  .inviteContent {
    margin: 24px;
    background: #ffffff;
    padding: 0px 24px 24px;
    .page-box {
      text-align: center;
      margin-top: 10px;
    }
    .topImg {
      width: 100%;
      img {
        width: 100%;
      }
    }
  }
  .my-card {
    .topImg > img {
      width: 100%;
    }
  }
  .user-info {
    padding: 24px;
    background: #ffffff;
    .content {
      position: relative;
      // width:1132px;
      height: 288px;
      background: linear-gradient(0deg, rgba(31, 137, 241, 1) 0%, rgba(22, 173, 233, 1) 100%);
      box-shadow: 0px 5px 15px 0px rgba(175, 192, 209, 0.55);
      border-radius: 8px;
      .upperLeftCorner {
        width: 257px;
        height: 165px;
        background: linear-gradient(0deg, rgba(31, 137, 241, 1) 0%, rgba(22, 173, 233, 1) 100%);
        opacity: 0.1;
        border-radius: 8px;
      }
      .lowerRightCorner {
        width: 196px;
        height: 140px;
        background: linear-gradient(0deg, rgba(31, 137, 241, 1) 0%, rgba(22, 173, 233, 1) 100%);
        border-radius: 8px;
      }
      .modifyInformation {
        position: absolute;
        right: 0px;
        top: 0px;
        z-index: 11;
        button {
          color: #ffffff;
          font-size: 12px;
          img {
            width: 11px;
            height: 13px;
            margin-top: 2px;
            margin-right: 6px;
            float: left;
          }
        }
        &/deep/ button:hover {
          background: none;
        }
      }
      .userInfo {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        position: relative;
        & > img {
          width: 83px;
          height: 83px;
        }
        .nickname {
          font-size: 24px;
          line-height: 42px;
          color: rgba(255, 255, 255, 1);
          text-align: center;
        }
        .level {
          padding: 0px 7px;
          line-height: 16px;
          height: 17px;
          background: rgba(25, 159, 236, 1);
          border: 1px solid rgba(234, 228, 101, 1);
          border-radius: 8px;
          font-size: 12px;
          color: rgba(234, 228, 101, 1);
          text-align: center;
          position: absolute;
          top: 13px;
          right: -55px;
        }
        .company {
          font-size: 14px;
          line-height: 42px;
          color: #ffffff;
        }
        .location {
          position: absolute;
          width: 459px;
          height: 58px;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.06);
          border-radius: 29px;
          bottom: 0px;
          transform: translateY(50%);
          .left,
          .right {
            width: 49%;
            text-align: center;
            span {
              font-size: 14px;
              color: rgba(102, 102, 102, 1);
              line-height: 39px;
              margin-left: 10px;
            }
            .editPhone {
              margin-left: 0px;
              font-size: 12px;
              color: #16ade9;
              cursor: pointer;
              border-bottom: 1px solid #16ade9;
            }
          }
          .left {
            img {
              width: 15px;
              height: 15px;
            }
          }
          .line {
            width: 2px;
            height: 24px;
            background: rgba(223, 223, 223, 1);
            border-radius: 1px;
          }
          .right {
            img {
              width: 11px;
              height: 17px;
            }
          }
        }
      }
    }
    // background-color: #ffff;
    // height: 284px;
    // border-radius:4px;
    // box-shadow:1px 1px 1px #e5e5e5;
    // .titleImg{
    //   position: absolute;
    //   top: -28px;
    //   margin-left: 15px;
    // }
  }
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
        color: #16ade9;
      }
    }
    .title {
      color: #626266;
      font-size: 16px;
    }
    .num {
      font-size: 44px;
      margin: 20px 0 40px 0;
      color: #16ade9;
    }
  }
  .invite {
    .num {
      color: #16ade9;
    }
    .ivu-btn {
      color: #16ade9;
      border-color: #16ade9;
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
    background: rgba(22, 173, 233, 1);
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
    color: #16ade9;
  }
  /deep/ .ivu-btn-ghost.ivu-btn-info:hover {
    color: #fff;
    background-color: #16ade9;
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
}
.ivu-btn-text:hover {
  color: #16ade9;
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
    background-color: #16ade9;
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
    font-size: 18px;
    font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    line-height: 24px;
    padding: 16px 24px;
    border-bottom: 1px solid #dddddd;
    display: flex;
    align-items: center;
    > span:first-child {
      flex: 1;
    }
  }
  .user-info {
    font-size: 16px;
    .no-info {
      color: #999;
    }
    .flex-around {
      width: 300px;
      .left {
        text-align: right;
        margin-left: 32px;
      }
      .right {
        font-weight: 600;
        margin-left: 19px;
        .changeMobile {
          color: #16ade9;
          font-size: 12px;
          font-weight: 400;
          margin-left: 22px;
          cursor: pointer;
        }
      }
      li {
        margin-top: 20px;
      }
    }
  }
}
/* 弹窗头部 */
/deep/ .ivu-modal-header {
  background: #ffffff !important;
}
.table-wrap {
  padding: 20px;

  /deep/ .ivu-table-header thead tr th {
    text-align: center;
  }

  /deep/ .ivu-table-border td {
    text-align: center;
  }
}

/deep/ .ivu-table-cell {
  position: relative;
}
.radio-wrap {
  width: 18px;
  height: 18px;
  position: absolute;
  top: 2px;
  left: calc(50% - 15px);
  z-index: 10;
  cursor: pointer;
}
.cancel-auth-btn {
  color: #1890ff;
  cursor: pointer;
}
.destory-error {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: rgba(55, 55, 55, 0.6);
  .error {
    position: absolute;
    width: 600px;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .tips {
    padding: 15px 30px 0 0;
    display: flex;
    strong {
      flex: 1;
    }
    a {
      color: #16ade9;
      margin-left: 15px;
    }
  }
  /deep/ .ivu-alert-with-desc .ivu-alert-icon {
    top: 30px;
  }
}
</style>
