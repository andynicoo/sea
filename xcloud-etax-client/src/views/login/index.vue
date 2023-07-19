<template>
  <div class="login-all">
    <div class="login-login">
      <div class="banner-swiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <div class="link4 banner-link"></div>
          </div>
          <div class="swiper-slide">
            <div class="link3 banner-link"></div>
          </div>
          <div class="swiper-slide">
            <a href="/aboutComputed" target="_blank" class="link1 banner-link"></a>
          </div>
          <div class="swiper-slide">
            <div class="link2 banner-link"></div>
          </div>
        </div>
        <!-- <div class="login-box" v-if="!getLoginStatus">
          <div class="loginCommon loginRight">
            <div class="login-input">
              <p v-if="!isLogin" class="login-way">
                <span @click="changePass(1)" :class="payIndex==1?'active':''">{{$t('login.accountLogin')}}</span>
                <span @click="changeYzm" :class="payIndex==2?'active':''">{{$t('login.verLogin')}}</span>
              </p>
              <Form
                v-if="!isLogin"
                ref="formLogin"
                :model="formLogin"
                :rules="ruleLogin"
                :label-width="0"
              >
                <div v-if="!ifpass">
                  <Form ref="formPhone" :model="formPhone" :rules="rulePhone" :label-width="0">
                    <FormItem label prop="mobile">
                      <Input
                        type="text"
                        v-model="formPhone.mobile"
                        placeholder="请输入您的手机号"
                        @on-change="selectPhone"
                        prefix="user-phonenum"
                      />
                    </FormItem>
                  </Form>
                  <FormItem>
                    <Row>
                      <Col span="12">
                        <Input type="text" prefix="space" v-model="imgCode" placeholder="请输入图片验证码" :maxlength="4" class="imgCode-box"/>
                      </Col>
                      <Col span="10" offset="1">
                        <img :src="imgCodeSrc" alt="" @click="getImgCodeFun" style="cursor:pointer">
                      </Col>
                    </Row>
                  </FormItem>
                  <FormItem label prop="code">
                    <Row>
                      <Col span="15">
                        <Input type="text" prefix="space" v-model="formLogin.code" placeholder="请输入验证码" :maxlength="6" />
                      </Col>
                      <Col span="8" offset="1">
                        <Button
                          class="verification-btn"
                          :class="ifClick==true?'diD':''"
                          type="primary"
                          @click.stop="getVerificationCode('formPhone',2)"
                          :disabled="ifClick"
                        >{{btLogin}}</Button>
                      </Col>
                    </Row>
                  </FormItem>
                  <FormItem class="loginBottom">
                    <Button
                      class="login-btn"
                      type="primary"
                      @click.stop="handleLogin('formLogin',1)"
                    >{{$t('login.login')}}</Button>
                  </FormItem>
                </div>
                <div v-else-if='ifpass' >
                  <FormItem v-if="ifEmail==0" label prop="mobile">
                    <Input type="text" prefix="user-account" v-model="formLogin.mobile" placeholder="请输入您的账号" autocomplete="off" />
                  </FormItem>
                  <FormItem label prop="password" :class="ifEmail==0?'mhd':''">
                    <Input type="password" prefix="user-ps" v-model="formLogin.password" placeholder="请输入密码" />
                  </FormItem>
                  <FormItem>
                    <Row>
                      <Col span="12">
                        <Input type="text" prefix="space" v-model="imgCode" placeholder="请输入图片验证码" :maxlength="4" class="imgCode-box"/>
                      </Col>
                      <Col span="10" offset="1">
                        <img :src="imgCodeSrc" alt="" @click="getImgCodeFun" style="cursor:pointer">
                      </Col>
                    </Row>
                  </FormItem>
                  <FormItem class="loginBottom" v-show="ifEmail==0">
                    <Button
                      class="login-btn"
                      type="primary"
                      @click.stop="handleLogin('formLogin',2)"
                    >{{$t('login.login')}}</Button>
                  </FormItem>
                </div>
                <p class="changeState clearfix">
                  <span class="fl" @click="changeRegi">
                    {{$t('login.goRegister')}}
                  </span>
                  <span class="forgetW fr" @click="getPass">{{$t('login.resetPassword')}}</span>
                </p>
              </Form>
              <Form
                v-if="isLogin"
                class="form-outside"
                ref="formRegister"
                :model="formRegister"
                :rules="ruleRegister"
                :label-width="0"
              >
                <div>
                  <Form ref="formPhone" :model="formPhone" :rules="rulePhone" :label-width="0">
                    <FormItem label prop="mobile">
                      <Input
                        type="text"
                        v-model="formPhone.mobile"
                        placeholder="请输入您的手机号"
                        @on-change="selectPhone"
                        prefix="user-phonenum"
                      />
                    </FormItem>
                  </Form>
                  <FormItem>
                    <Row>
                      <Col span="12">
                        <Input type="text" prefix="space" v-model="imgCode" placeholder="请输入图片验证码" :maxlength="4" class="imgCode-box"/>
                      </Col>
                      <Col span="10" offset="1">
                        <img :src="imgCodeSrc" alt="" @click="getImgCodeFun" style="cursor:pointer">
                      </Col>
                    </Row>
                  </FormItem>
                  <FormItem label prop="code">
                    <Row>
                      <Col span="15">
                        <Input prefix="space" type="text" v-model="formRegister.code" placeholder="请输入验证码" />
                      </Col>
                      <Col span="8" offset="1">
                        <Button
                          class="login-btn"
                          :class="ifClick==true?'diD':''"
                          type="primary"
                          @click.stop="getVerificationCode('formPhone',1)"
                          v-if="!ifforget&&!ifbind"
                          :disabled="ifClick"
                        >{{btLogin}}</Button>
                        <Button
                          class="login-btn"
                          :class="ifClick==true?'diD':''"
                          type="primary"
                          @click.stop="getVerificationCode('formPhone',3)"
                          v-if="ifforget"
                          :disabled="ifClick"
                        >{{btLogin}}</Button>
                        <Button
                          class="login-btn"
                          :class="ifClick==true?'diD':''"
                          type="primary"
                          @click.stop="getVerificationCode('formPhone',4)"
                          v-if="!ifforget&&ifbind"
                          :disabled="ifClick"
                        >{{btLogin}}</Button>
                      </Col>
                    </Row>
                  </FormItem>

                  <FormItem label prop="password">
                    <Input type="password" prefix="user-ps" autocomplete="new-password" v-model="formRegister.password" placeholder="请设置密码" />
                  </FormItem>
                  <FormItem>
                    <Button
                      v-if="!ifforget&&!ifbind"
                      class="login-btn"
                      type="primary"
                      @click.stop="handleRegister('formRegister')"
                    >{{$t('login.register')}}</Button>
                    <Button
                      v-if="!ifforget&&ifbind"
                      class="login-btn"
                      type="primary"
                      @click.stop="handleBind('formRegister')"
                    >绑定</Button>
                    <Button
                      v-if="ifforget"
                      class="login-btn"
                      type="primary"
                      @click.stop="handleForget('formRegister')"
                    >完成</Button>
                  </FormItem>
                </div>
                <p class="changeState">
                  <Row>
                    <Col style="text-align:right" span="12" offset="12">
                      <span @click="isLogin=false">
                        已有账号?
                        <span style="color:#16ADE9">去登录</span>
                      </span>
                    </Col>
                  </Row>
                </p>
              </Form>
            </div>
          </div>
        </div> -->
      </div>
      <div class="service">
        <div class="company-advantage flex-around">
          <div class="advantage-item">
            <div class="icon">
              <img src="@/assets/images/aboutHome/advantage1.png" alt="跨税云，VAT注册，VAT申报" />
            </div>
            <div class="type">
              <div class="top-title">
                {{ $t("subBanner.Efficiency") }}
              </div>
              <div class="bottom-title">智能算税 自主申报</div>
            </div>
          </div>
          <div class="advantage-item">
            <div class="icon">
              <img src="@/assets/images/aboutHome/advantage2.png" alt="跨税云，VAT注册，VAT申报" />
            </div>
            <div class="type">
              <div class="top-title">
                {{ $t("subBanner.Professional") }}
              </div>
              <div class="bottom-title">直连税局 系统算法</div>
            </div>
          </div>
          <div class="advantage-item">
            <div class="icon">
              <img src="@/assets/images/aboutHome/advantage3.png" alt="跨税云，VAT注册，VAT申报" />
            </div>
            <div class="type">
              <div class="top-title">
                {{ $t("subBanner.Progress") }}
              </div>
              <div class="bottom-title">线上操作 实时进度</div>
            </div>
          </div>
          <div class="advantage-item">
            <div class="icon">
              <img src="@/assets/images/aboutHome/advantage4.png" alt="跨税云，VAT注册，VAT申报" />
            </div>
            <div class="type">
              <div class="top-title">
                {{ $t("subBanner.security") }}
              </div>
              <div class="bottom-title">双重加密 大卖首选</div>
            </div>
          </div>
        </div>
        <p class="title">{{ $t("weCan.title") }}</p>
        <p class="titleInfo">{{ $t("weCan.subtitle") }}</p>
        <div class="tab-box content-width">
          <ul class="">
            <li
              class="country"
              :class="{ 'border-active': index == currentTab }"
              v-for="(item, index) in lists"
              :key="index"
              @click="tabToSwitch(index)"
            >
              <img :src="item.img" alt="跨税云，vat申报，vat注册" />
              <p v-if="index == 0">{{ $t("weCan.EnglandVAT") }}</p>
              <p v-else-if="index == 1">{{ $t("weCan.GermanyVAT") }}</p>
              <p v-else-if="index == 2">{{ $t("weCan.ItalyVAT") }}</p>
              <p v-else-if="index == 3">{{ $t("weCan.FranceVAT") }}</p>
              <p v-else-if="index == 4">{{ $t("weCan.SpainVAT") }}</p>
              <div class="card" :class="{ 'tab-active': index == currentTab }">
                <declare-card
                  v-for="(i, ind) in item.info"
                  :key="ind"
                  :data="i"
                  :index="index"
                  :dIndex="ind"
                ></declare-card>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="service-process">
        <div class="content">
          <div class="title">
            {{ $t("serviciesBox.title") }}
          </div>
          <div class="registration-and-declaration flex-center">
            <div class="registration" @click="showProcess(1)">
              <div class="box flex-center" :class="{ 'box-active': processTab === 1 }">
                <img src="../../assets/images/aboutHome/registered.png" alt="跨税云，vat申报服务，vat注册服务" />
              </div>
              <div class="info">
                {{ $t("serviciesBox.vatRegister") }}
              </div>
            </div>
            <div class="declaration" @click="showProcess(2)">
              <div class="box flex-center" :class="{ 'box-active': processTab === 2 }">
                <img src="../../assets/images/aboutHome/declare.png" alt="跨税云，vat注册" />
              </div>
              <div class="info">
                {{ $t("serviciesBox.vatDeclara") }}
              </div>
            </div>
          </div>
          <div class="process flex-center" v-show="processTab === 1">
            <div class="steps">
              <img src="../../assets/images/aboutHome/step1.png" alt="跨税云，vat注册" />
              <div class="name">
                {{ $t("serviciesBox.buyVatRegist") }}
              </div>
              <div class="info">
                {{ $t("serviciesBox.uploadRegist") }}
              </div>
            </div>
            <div class="arrow">
              <img src="../../assets/images/aboutHome/arrow.png" alt="跨税云，vat注册流程" />
            </div>
            <div class="steps">
              <img src="../../assets/images/aboutHome/step2.png" alt="跨税云，vat注册平台" />
              <div class="name">
                {{ $t("serviciesBox.submitInformationReg") }}
              </div>
              <div class="info">
                {{ $t("serviciesBox.getVatNumber") }}
              </div>
            </div>
            <div class="arrow">
              <img src="../../assets/images/aboutHome/arrow.png" alt="跨税云，vat注册流程" />
            </div>
            <div class="steps">
              <img src="../../assets/images/aboutHome/step3.png" alt="跨税云，vat注册完成" />
              <div class="name">
                {{ $t("serviciesBox.regComplete") }}
              </div>
              <div class="info"></div>
            </div>
          </div>
          <div class="process flex-center" v-show="processTab === 2">
            <div class="steps">
              <img src="../../assets/images/aboutHome/step1.png" alt="跨税云，vat申报流程" />
              <div class="name">
                {{ $t("serviciesBox.buyVatDec") }}
              </div>
              <div class="info">
                {{ $t("serviciesBox.subagentInformation") }}
              </div>
            </div>
            <div class="arrow">
              <img src="../../assets/images/aboutHome/arrow.png" alt="跨税云，vat申报需要什么资料" />
            </div>
            <div class="steps">
              <img src="../../assets/images/aboutHome/step2.png" alt="跨税云，vat申报需要什么资料" />
              <div class="name">
                {{ $t("serviciesBox.uploadDec") }}
              </div>
              <div class="info">
                {{ $t("serviciesBox.sureTax") }}
              </div>
            </div>
            <div class="arrow">
              <img src="../../assets/images/aboutHome/arrow.png" alt="跨税云，vat申报流程" />
            </div>
            <div class="steps">
              <img src="../../assets/images/aboutHome/step4.png" alt="跨税云，vat申报步骤" />
              <div class="name">
                {{ $t("serviciesBox.submitInformationDec") }}
              </div>
              <div class="info">
                {{ $t("serviciesBox.downloadTax") }}
              </div>
            </div>
            <div class="arrow">
              <img src="../../assets/images/aboutHome/arrow.png" alt="跨税云，vat申报流程" />
            </div>
            <div class="steps">
              <img src="../../assets/images/aboutHome/step3.png" alt="跨税云，vat申报完成" />
              <div class="name">
                {{ $t("serviciesBox.vatDeclare") }}
              </div>
              <div class="info"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="specialBox">
        <div class="content">
          <p class="title">{{ $t("specialTax.title") }}</p>
          <div class="expert-team">
            <div class="expert">
              <img src="@/assets/images/aboutHome/kevin.jpg" alt="跨税云，vat申报，vat注册" />
              <p class="name">Kevin</p>
              <p class="leavl">{{ $t("specialTax.Kposition") }}</p>
              <p class="introduct">{{ $t("specialTax.Kintroduce") }}</p>
            </div>
            <div class="expert">
              <img src="@/assets/images/aboutHome/riboli.jpg" alt="跨税云，vat申报，vat注册" />
              <p class="name">Giordano Riboli</p>
              <p class="leavl">{{ $t("specialTax.Gposition") }}</p>
              <p class="introduct">{{ $t("specialTax.Gintroduce") }}</p>
            </div>
            <div class="expert">
              <img src="@/assets/images/aboutHome/feinanduo.jpg" alt="跨税云，vat申报，vat注册" />
              <p class="name">Fernando</p>
              <p class="leavl">{{ $t("specialTax.Fposition") }}</p>
              <p class="introduct">{{ $t("specialTax.Fintroduce") }}</p>
            </div>
          </div>
        </div>
        <div class="expert-bgline"></div>
        <div class="expert-bg-semicircle"></div>
      </div>
      <computed v-if="showComputed" @changeState="closeComputed"></computed>
    </div>
    <Footer></Footer>
  </div>
</template>
<script>
import "@/styles/common.less";
import computed from "@/views/common/computed";
import declareCard from "@/views/common/declareCard.vue";
import Swiper from "swiper";
import "swiper/dist/css/swiper.css";
import { getList } from "@/api/information/index";
import {
  getYzm,
  register,
  loginPass,
  loginClient,
  loginYzm,
  getPass,
  // bind
  callbackSellerOS,
  bindSellerOS,
  getSellerToken,
  inviteRegister,
  getImgCodeApi,
} from "@/api/login/login";
import Footer from "@/views/common/footer";
import Cookies from "js-cookie";

export default {
  components: {
    Footer,
    computed,
    declareCard,
  },
  props: {},
  data() {
    return {
      payIndex: 2,
      value3: 0,
      value4: 0,
      bannerList: [
        {
          img: require("@/assets/images/aboutHome/banner1.png"),
          href: "/aboutComputed",
        },
        {
          img: require("@/assets/images/aboutHome/banner2.png"),
          href: "https://www.elster.de/elsterweb/softwareprodukt",
        },
      ],
      setting: {
        autoplay: false,
        autoplaySpeed: 2000,
        dots: "none",
        radiusDot: false,
        trigger: "click",
        arrow: "always",
      },
      setting1: {
        autoplay: false,
        autoplaySpeed: 2000,
        dots: "none",
        radiusDot: false,
        trigger: "click",
        arrow: "always",
      },
      showComputed: false,
      advantageList: [
        {
          icon: require("../../assets/images/aboutHome/advantage1.png"),
          name: "高效便捷",
          info: "智能算税 自主申报",
        },
        {
          icon: require("../../assets/images/aboutHome/advantage2.png"),
          name: "专业精准",
          info: "直连税局 系统算法",
        },
        {
          icon: require("../../assets/images/aboutHome/advantage3.png"),
          name: "进度透明",
          info: "线上操作 实时进度",
        },
        {
          icon: require("../../assets/images/aboutHome/advantage4.png"),
          name: "安全放心",
          info: "双重加密 大卖首选",
        },
      ],
      lists: [
        {
          img: require("../../assets/images/login/1.png"),
          name: "英国VAT",
          info: [
            {
              img: require("../../assets/images/aboutHome/registered.png"),
              type: "英国VAT税号注册+申报",
              des: "包含注册税号，信件接收，客服服务",
              price: "198元",
              unit: "/年",
              canBuy: true,
            },
            {
              img: require("../../assets/images/aboutHome/declare.png"),
              type: "英国VAT税务转代理+申报",
              des: "包含一年申报，信件接收，专属 客服指导服务",
              price: "99元",
              unit: "/年",
              canBuy: true,
            },
          ],
        },
        {
          img: require("../../assets/images/login/2.png"),
          name: "德国VAT",
          info: [
            {
              img: require("../../assets/images/aboutHome/registered.png"),
              type: "德国VAT税号注册+申报",
              des: "包含注册税号，信件接收，客服服务",
              price: "498元",
              unit: "/年",
              canBuy: true,
            },
            {
              img: require("../../assets/images/aboutHome/declare.png"),
              type: "德国VAT税务转代理+申报",
              des: "包含一年申报，信件接收，专属 客服指导服务",
              price: "399元",
              unit: "/年",
              canBuy: true,
            },
          ],
        },
        {
          img: require("../../assets/images/login/3.png"),
          name: "意大利VAT",
          info: [
            {
              img: require("../../assets/images/aboutHome/registered.png"),
              type: "意大利VAT税号注册+申报",
              des: "包含注册税号，信件接收，客服服务",
              price: "2998元",
              unit: "/年",
              canBuy: false,
            },
            {
              img: require("../../assets/images/aboutHome/declare.png"),
              type: "意大利VAT税务转代理+申报",
              des: "包含一年申报，信件接收，专属 客服指导服务",
              price: "2899元",
              unit: "/年",
              canBuy: false,
            },
          ],
        },
        {
          img: require("../../assets/images/login/4.png"),
          name: "法国VAT",
          info: [
            {
              img: require("../../assets/images/aboutHome/registered.png"),
              type: "法国VAT税号注册+申报",
              des: "包含注册税号，信件接收，客服服务",
              price: "2888元",
              unit: "/年",
              canBuy: false,
            },
            {
              img: require("../../assets/images/aboutHome/declare.png"),
              type: "法国VAT税务转代理+申报",
              des: "包含一年申报，信件接收，专属 客服指导服务",
              price: "2799元",
              unit: "/年",
              canBuy: false,
            },
          ],
        },
        {
          img: require("../../assets/images/login/5.png"),
          name: "西班牙VAT",
          info: [
            {
              img: require("../../assets/images/aboutHome/registered.png"),
              type: "西班牙VAT税号注册+申报",
              des: "包含注册税号，信件接收，客服服务",
              price: "3998元",
              unit: "/年",
              canBuy: false,
            },
            {
              img: require("../../assets/images/aboutHome/declare.png"),
              type: "西班牙VAT税务转代理+申报",
              des: "包含一年申报，信件接收，专属 客服指导服务",
              price: "3899元",
              unit: "/年",
              canBuy: false,
            },
          ],
        },
      ],
      specialList: [
        {
          picture: require("../../assets/images/aboutHome/kevin.jpg"),
          name: "Kevin",
          leavl: "英国皇家特许注册会计师",
          introduct: "资深英国税务专家，拥有ACCA，FCCA证书，拥有丰富的财税经验，擅长中小企业的财务管理及财税规划",
        },
        {
          picture: require("../../assets/images/aboutHome/riboli.jpg"),
          name: "Giordano Riboli",
          leavl: "资深税务师",
          introduct:
            "拥有30多年税务处理经验，曾参与欧盟税务政策制定，深谙欧洲各国的VAT法规，积极推动IT技术助力企业税务管理智能化",
        },
        {
          picture: require("../../assets/images/aboutHome/feinanduo.jpg"),
          name: "Fernando",
          leavl: "资深律师",
          introduct:
            "拥有多年企业法务处理经验 ，熟悉欧洲各类税务律法、认证体系，在企业经营合规化方面经验丰富，提前规避企业各类经营风险",
        },
      ],
      ourList: [
        //关于我们
        {
          title: "高效便捷",
          subtitle: "智能算税、自主申报",
          img: require("@/assets/images/login/efficiency.png"),
        },
        {
          title: "专业精准",
          subtitle: "直连税局、系统算法",
          img: require("@/assets/images/login/professional.png"),
        },
        {
          title: "进度透明",
          subtitle: "线上操作、实时进度",
          img: require("@/assets/images/login/lulency.png"),
        },
        {
          title: "安全放心",
          subtitle: "双重加密、大卖首选",
          img: require("@/assets/images/login/safety.png"),
        },
      ],
      //
      sign: "",
      uid: "",
      ifbind: false,

      ifresult: false, // 找回密码
      resultContent: "新密码设置成功", // 提示
      isLogin: false,
      ifpass: false, // 密码登录
      ifforget: false, // 忘记密码
      ifClick: true, // 是否可以点击
      ifshowEmail: true, // 是否显示企业用户登录入口
      ifshowNormal: false,
      ifEmail: 0,
      formLogin: {
        password: "",
        mobile: "",
        code: "",
      },
      ruleLogin: {
        mobile: [
          {
            required: true,
            message: "请填写正确手机号码",
            transform(value) {
              let reg = new RegExp("^[1][3-9][0-9]{9}$");
              if (!reg.test(value)) {
                return false;
              } else {
                return value;
              }
            },
          },
        ],
        password: [{ required: true, message: "不可为空", trigger: "blur" }],
        code: [{ required: true, message: "不可为空", trigger: "blur" }],
      },
      // 验证邮箱
      formEmail: {
        email: "",
      },
      // 验证手机
      formPhone: {
        mobile: "",
      },
      ruleEmail: {
        email: [
          {
            required: true,
            message: "邮箱格式错误",
            trigger: "blur",
            transform(value) {
              var regEmail = /^[A-Za-z1-9]+([-_.][A-Za-z1-9]+)*@([A-Za-z1-9]+[-.])+[A-Za-z]{2,5}$/;
              // console.log(regEmail.test(value));
              if (!regEmail.test(value)) {
                return false;
              } else {
                return value;
              }
            },
          },
        ],
      },
      rulePhone: {
        mobile: [
          {
            type: "number",
            message: "请填写正确手机号",
            trigger: "blur",
            transform(value) {
              let reg = new RegExp("^[1][3-9][0-9]{9}$");
              if (!reg.test(value)) {
                return false;
              } else {
                return Number(value);
              }
            },
          },
        ],
      },
      verificationCodeTimer: "",
      verificationCodeCount: 120, // 验证码倒计时
      // 注册表单
      formRegister: {
        mobile: "",
        code: "",
        password: "",
      },
      ruleRegister: {
        mobile: [{ required: true, message: "不可为空", trigger: "blur" }],
        code: [{ required: true, message: "不可为空", trigger: "blur" }],
        password: [{ required: true, message: "不可为空", trigger: "blur" }],
      },
      btLogin: "获取验证码",
      // btRegister:'获取验证码',
      contentTitle: "注册",
      currentTab: 0,
      processTab: 1,
      infoList: [],
      newsList: [],
      iflogin: this.$store.getters.getlogin,
      imgCode: "",
      codeKey: "",
      imgCodeSrc: "",
    };
  },
  metaInfo: {
    title: "跨税云_智能税务平台_直连海外税局_专注VAT注册_VAT申报", // set a title
    meta: [
      {
        // set meta
        name: "keyWords",
        content: "VAT注册,VAT申报,英国VAT,德国VAT,跨税云",
      },
      {
        name: "description",
        content:
          "跨税云是一家智能税务平台，直连海外税局，专注于通过一站式VAT自主申报系统为跨境卖家提供英国,德国,法国,意大利,西班牙等欧洲、中东地区VAT的注册与申报。",
      },
      {
        property: "og:title",
        content: "跨税云_智能税务平台_直连海外税局_专注VAT注册_VAT申报",
      },
      {
        property: "og:description",
        content:
          "跨税云是一家智能税务平台，直连海外税局，专注于通过一站式VAT自主申报系统为跨境卖家提供英国,德国,法国,意大利,西班牙等欧洲、中东地区VAT的注册与申报。",
      },
    ],
    link: [
      {
        // set link
        rel: "asstes",
        href: "https://www.itaxs.com",
      },
    ],
  },
  watch: {
    isLogin: function (val, oldval) {
      this.isLogin = val;
      this.verificationCodeCount = 0;
    },
  },
  methods: {
    closeComputed(val) {
      this.showComputed = val;
    },
    //立即体验
    rightExperience() {
      const { href } = this.$router.resolve({
        path: "/aboutComputed",
      });
      window.open(href, "_blank");
    },
    // 电话取得焦点
    selectPhone() {
      this.$refs.formPhone.validateField("mobile", (phoneError) => {
        // this.ifClick = false;
        if (!phoneError) {
          this.ifClick = false;
        } else {
          this.ifClick = true;
        }
      });
    },
    // 点击获取验证码
    getVerificationCode(phone, type) {
      // this.ifClick = true;
      this.$refs[phone].validate((valid) => {
        if (valid) {
          this.getGeetest(type);
        } else {
          this.ifClick = false;
        }
      });
    },
    // send code
    getGeetest(type) {
      let self = this;
      self.verificationCodeCount = 120;
      if (this.imgCode == "") {
        this.$Message.error("请先输入图形验证码");
        return;
      }
      let params = {
        mobile: self.formPhone.mobile,
        type: type,
        signSource: 1,
        imageCodeKey: this.codeKey,
        imageCodeValue: this.imgCode,
      };
      getYzm(params)
        .then(
          (res) => {
            // console.log(res);
            if (res.code == 0) {
              this.$Message.success("短信发送成功");
              self.verificationCodeTimer = setInterval(() => {
                if (self.verificationCodeCount == 0) {
                  self.btLogin = "获取验证码";
                  clearInterval(self.verificationCodeTimer);
                  self.ifClick = false;
                } else {
                  self.ifClick = true;
                  self.verificationCodeCount--;
                  self.btLogin = `${self.verificationCodeCount}秒后重新获取`;
                }
              }, 1000);
            } else {
              // this.getImgCodeFun();
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
    //密码登录限注册成功后调用
    passwordLogin() {
      let obj = {
        mobile: this.formPhone.mobile,
        password: this.formRegister.password,
      };
      loginPass(obj)
        .then(
          (res) => {
            // console.log(res);
            if (res.code == 0) {
              let datastate = {
                loginstate: true,
              };
              localStorage.setItem("token", res.data.token); // save local
              localStorage.setItem("sessionId", res.data.sessionId);

              Cookies.set('token', res.data.token);
              Cookies.set('sessionId', res.data.sessionId);              
              this.$emit("changeLogin", datastate); // pop status
              localStorage.setItem("href", "/work");
              this.$router.push({ path: "/work" });
              this.$store.commit("saveLogin", true);
              location.reload();
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
    // 注册
    handleRegister(all) {
      let self = this;
      this.$refs[all].validate((valid) => {
        if (valid) {
          let invitedCode = localStorage.getItem("invitedCode");
          let promteCode = localStorage.getItem("promteCode");
          this.inviteReg();
        }
      });
    },
    //普通注册。没有邀请码
    noInviteReg() {
      let obj = {
        code: this.formRegister.code,
        mobile: this.formPhone.mobile,
        password: this.formRegister.password,
        source: 0,
      };
      register(obj)
        .then(
          (res) => {
            // console.log(res);
            if (res.code == 0) {
              this.resultContent = "注册成功,请登录";
              this.$Message.success("注册成功");
              this.ifresult = true;
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
    //有邀请码的注册
    inviteReg() {
      let invitedCode = localStorage.getItem("invitedCode");
      let promteCode = localStorage.getItem("promteCode");

      let obj = {};
      if (promteCode == null) {
        obj = {
          mobile: this.formPhone.mobile,
          password: this.formRegister.password,
          smsCode: this.formRegister.code,
          inviteCode: invitedCode,
        };
      } else if (invitedCode == null) {
        obj = {
          mobile: this.formPhone.mobile,
          password: this.formRegister.password,
          smsCode: this.formRegister.code,
          promteCode: promteCode,
        };
      }

      inviteRegister(obj).then((res) => {
        if (res.code == 0) {
          this.resultContent = "注册成功,请登录";
          this.$Message.success("注册成功");
          this.ifresult = true;
          this.isLogin = false;
          // this.getImgCodeFun();
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    // 找回密码
    handleForget(all) {
      let self = this;
      this.$refs[all].validate((valid) => {
        if (valid) {
          // console.log(this.formRegister);
          // console.log(this.formPhone);
          let obj = {
            code: this.formRegister.code,
            mobile: this.formPhone.mobile,
            newPassword: this.formRegister.password,
          };
          getPass(obj)
            .then(
              (res) => {
                // console.log(res);
                if (res.code == 0) {
                  this.resultContent = "新密码设置成功";
                  this.$Message.success("新密码设置成功，请登录");
                  this.ifforget = false;
                  this.isLogin = false;
                  this.ifresult = true;
                } else {
                  this.$Message.error(res.message);
                }
              },
              (err) => {
                this.$Message.error(err.message);
              }
            )
            .finally(() => {});
        } else {
        }
      });
    },
    // 绑定sellerOS
    handleBind(all) {
      let self = this;
      let obj = {
        code: this.sign,
        mobileCode: this.formRegister.code,
        mobile: this.formPhone.mobile,
        password: this.formRegister.password,
        platform: 7,
      };
      // console.log(obj);
      this.$refs[all].validate((valid) => {
        if (valid) {
          // debugger;
          bindSellerOS(obj)
            .then(
              (res) => {
                // console.log(res);
                if (res.code == 0) {
                  this.$Message.success("绑定成功");
                } else {
                  this.$Message.error(res.message);
                }
              },
              (err) => {
                this.$Message.error(err.message);
              }
            )
            .finally(() => {});
        } else {
        }
      });
    },
    // 手机验证码登录
    handleLogin(all, type) {
      if (this.ifEmail == 1) {
        if (!this.formEmail.email) {
          this.$Message.warning("邮箱不可为空");
          return false;
        }
      }
      this.$refs[all].validate((valid) => {
        if (valid) {
          this.changeLogin(type);
        } else {
        }
      });
    },
    // login
    changeLogin(type) {
      // console.log(this.formLogin);
      // console.log(this.formPhone);
      let datastate = {
        loginstate: true,
      }; // login state
      let obj = {};
      if (type == 1) {
        obj = {
          code: this.formLogin.code,
          mobile: this.formPhone.mobile,
        };
        loginYzm(obj)
          .then(
            (res) => {
              // console.log(res);
              if (res.code == 0) {
                localStorage.setItem("token", res.data.token); // save local
                localStorage.setItem("sessionId", res.data.sessionId);

                Cookies.set('token', res.data.token);
                Cookies.set('sessionId', res.data.sessionId);                
                this.$emit("changeLogin", datastate); // pop status
                // location.reload()
                this.$router.push("/work");
                this.$store.commit("saveLogin", true);
                window.location.href = "/work";
              } else {
                this.$Message.error(res.message);
              }
            },
            (err) => {
              this.$Message.error(err.message);
            }
          )
          .finally(() => {});
      } else if (type == 2) {
        if (this.imgCode == "") {
          this.$Message.error("请先输入图形验证码");
          return;
        }
        obj = {
          mobile: this.formLogin.mobile,
          password: this.formLogin.password,
          imageCodeKey: this.codeKey,
          imageCodeValue: this.imgCode,
        };
        loginPass(obj)
          .then(
            (res) => {
              // console.log(res);
              if (res.code == 0) {
                localStorage.setItem("token", res.data.token); // save local
                localStorage.setItem("sessionId", res.data.sessionId);

                Cookies.set('token', res.data.token);
                Cookies.set('sessionId', res.data.sessionId);                
                this.$emit("changeLogin", datastate); // pop status
                window.location.href = "/work";
                // location.reload()
                this.$store.commit("saveLogin", true);
                this.$router.push("/work");
              } else {
                // this.getImgCodeFun();
              }
            },
            (err) => {
              // this.$Message.error(err.message);
            }
          )
          .finally(() => {});
      }
    },
    //点击密码登录
    changePass(type) {
      this.payIndex = type;
      this.ifpass = true;
      // this.getImgCodeFun();
    },
    //点击验证码登录
    changeYzm() {
      this.payIndex = 2;
      this.ifshowEmail = true;
      this.ifshowNormal = false;
      this.ifpass = false;
      this.getImgCodeFun();
    },
    // 点击忘记密码
    getPass() {
      this.isLogin = true;
      this.ifforget = true;
      this.getImgCodeFun();
    },
    // 点击注册
    changeRegi() {
      this.isLogin = true;
      this.ifforget = false;
      this.getImgCodeFun();
    },
    tabToSwitch(index) {
      this.currentTab = index;
    },
    showProcess(index) {
      this.processTab = index;
    },
    swiperFun() {
      new Swiper(".swiper-container", {
        slidesPerView: 1, //一行显示4个
        loop: true,
        autoplay: 3000,
        // 如果需要分页器
        pagination: ".swiper-pagination",
        // 如果需要前进后退按钮
        nextButton: ".swiper-button-next",
        prevButton: ".swiper-button-prev",
      });
    },
    getNewsList() {
      getList({
        limit: 150,
        page: 1,
        bulletinType: 0,
      }).then((res) => {
        if (res.code === 0) {
          const list = res.data.records;
          for (let ind = 0; ind < list.length; ind++) {
            list[ind].href = `https://www.itaxs.com/${list[ind].id}.html`;
          }
          const newArr = [];
          var s = parseInt(list.length / 4);
          var n = 0;
          for (let index = 1; index <= s; index++) {
            var star = (index - 1) * 4;
            newArr[n++] = list.slice(star, star + 4);
          }
          var y = list.length - s * 4;
          if (y > 0) {
            newArr[n++] = list.slice(s * 4);
          }
          // console.log(newArr)
          this.newsList = newArr;
        }
      });
    },
    initSwipper() {
      new Swiper(".banner-swiper", {
        autoplay: 5000, //可选选项，自动滑动
        effect: "fade",
      });
    },
    //获取图片验证码
    getImgCodeFun() {
      getImgCodeApi().then((res) => {
        if (res.code == 0) {
          this.codeKey = res.data.codeKey;
          this.imgCodeSrc = res.data.image;
        }
      });
    },
  },
  mounted() {
    this.swiperFun();
    this.initSwipper();
    // this.getImgCodeFun();
  },
  computed: {
    //这里需要把store 动态的数据放到computed里面才会同步更新 视图
    getLoginStatus() {
      return this.$store.getters.getlogin;
    },
  },
};
</script>

<style lang='less' scoped>
.login-all {
  background-color: #fff;
  position: absolute;
  margin: 0 auto;
  width: 100%;
  top: 0;
  left: 0;
  .service {
    text-align: center;
    margin: 100px auto 60px;
    position: relative;
    width: 1352px;
    .company-advantage {
      width: 1200px;
      height: 110px;
      position: absolute;
      top: -150px;
      left: 50%;
      transform: translateX(-50%);
      // background:rgba(255,255,255,1);
      // box-shadow:0px 0px 27px 2px rgba(0, 0, 0, 0.06);
      // border-radius:10px;
      z-index: 9;
      .advantage-item {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 284px;
        height: 98px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(232, 232, 232, 1);
        box-shadow: 0px 6px 19px 1px rgba(0, 0, 0, 0.06);
        border-radius: 6px;

        .icon {
          margin-right: 12px;
          img {
            width: 62px;
            height: 62px;
          }
        }
        .type {
          .top-title {
            font-size: 18px;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            text-align: left;
            margin-bottom: 5px;
          }
          .bottom-title {
            font-size: 14px;
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
            text-align: left;
          }
        }
      }
    }
    .title {
      color: #333333;
      font-size: 32px;
      font-weight: 500;
    }
    .titleInfo {
      color: #666666;
      font-size: 16px;
      margin: 20px 0 40px 0;
    }
    .tab-box {
      min-height: 420px;
      ul {
        display: flex;
        justify-content: center;
        border-bottom: 1px solid #e5eaf1;
        position: relative;
        li {
          // cursor: pointer;
          padding-bottom: 10px;
          margin: 0px 80px 0px;
          img {
            width: 43px;
            height: 43px;
          }
          p {
            font-size: 18px;
            color: #333333;
            margin-top: 10px;
          }
          .card {
            display: none;
            position: absolute;
            left: 0px;
            top: 130px;
          }
          .tab-active {
            display: flex;
          }
        }
        .border-active {
          border-bottom: 2px solid #16ade9;
        }
      }
    }
    .ivu-carousel-item {
      position: relative;
      margin-right: 30px;
      width: 216px !important;
      padding-top: 20px;
    }
    .demo-carousel {
      .carouselImg {
        width: 80px;
        position: relative;
        top: -40px;
      }
      .carouselHd {
        background-color: #f7f4f8;
        position: relative;
        padding-bottom: 20px;
        .carouselInfo {
          margin-top: -26px;
          .name {
            color: #303033;
            font-size: 20px;
            font-weight: 600;
            margin: 0 0 12px 0;
          }
          .info {
            color: #939399;
            font-size: 14px;
          }
        }
        .PriceBox {
          margin-top: 32px;
          text-align: center;
          .price {
            color: #f2504d;
            font-size: 24px;
            font-weight: 500;
          }
          .unit {
            color: #2c2c33;
            font-size: 16px;
          }
          .line {
            text-align: center;
            width: 28px;
            height: 4px;
            margin-left: 94px;
            margin-top: 46px;
            background-color: #d8d8d8;
          }
        }
      }
    }
  }
  .specialBox {
    width: 100%;
    padding: 80px 0;
    position: relative;
    overflow: hidden;
    .content {
      z-index: 1;
      position: relative;
      max-width: 1200px;
      margin: auto;
      text-align: center;
      .title {
        font-size: 32px;
        line-height: 30px;
        color: rgba(51, 51, 51, 1);
        margin-bottom: 59px;
      }
      .expert-team {
        display: flex;
        align-items: baseline;
        justify-content: center;
        .expert {
          max-width: 240px;
          img {
            width: 188px;
            border-radius: 50%;
          }
          &:nth-child(2) {
            width: 278px;
            margin: 0px 144px;
            img {
              width: 100%;
            }
          }
          .name {
            line-height: 18px;
            font-size: 24px;
            color: rgba(51, 51, 51, 1);
            margin-top: 29px;
          }
          .leavl {
            line-height: 14px;
            font-size: 14px;
            color: rgba(102, 102, 102, 1);
            margin-top: 21px;
          }
          .introduct {
            text-align: center;
            line-height: 24px;
            font-size: 14px;
            color: rgba(153, 153, 153, 1);
            margin-top: 20px;
          }
        }
      }
    }
    .expert-bgline {
      width: 100%;
      height: 98px;
      background: rgba(246, 248, 251, 1);
      position: absolute;
      top: 50%;
      transform: translateY(-80%);
    }
    .expert-bg-semicircle {
      width: 477px;
      height: 388px;
      background: linear-gradient(227deg, rgba(255, 255, 255, 1), rgba(243, 245, 248, 1));
      border-radius: 50%;
      position: absolute;
      bottom: 0%;
      left: 0px;
      transform: translateY(50%);
    }
  }
  .service-process {
    width: 100%;
    min-height: 740px;
    background: url("../../assets/images/aboutHome/process.png") no-repeat;
    background-size: 100% 100%;
    position: relative;
    .content {
      text-align: center;
      max-width: 1200px;
      margin: auto;
      padding: 120px 0px 90px;
      .title {
        color: rgba(51, 51, 51, 1);
        font-size: 32px;
        line-height: 30px;
        margin-bottom: 60px;
      }
      .registration-and-declaration {
        .registration {
          cursor: pointer;
          .box {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            margin-right: 190px;
            img {
              width: 44px;
              height: 44px;
            }
          }
          .info {
            text-align: left;
            font-size: 18px;
            color: rgba(51, 51, 51, 1);
            margin-top: 10px;
          }
          .box-active {
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 3px 15px 1px rgba(0, 0, 0, 0.07);
          }
        }
        .declaration {
          cursor: pointer;
          .box {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            img {
              width: 44px;
              height: 44px;
            }
          }
          .info {
            font-size: 18px;
            color: rgba(51, 51, 51, 1);
            margin-top: 10px;
          }
          .box-active {
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 3px 15px 1px rgba(0, 0, 0, 0.07);
          }
        }
      }
      .process {
        width: 1200px;
        height: 290px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 27px 2px rgba(0, 0, 0, 0.06);
        border-radius: 10px;
        margin-top: 40px;
        .steps {
          height: 175px;
          img {
            width: 85px;
            height: 85px;
          }
          .name {
            font-size: 18px;
            line-height: 18px;
            color: rgba(51, 51, 51, 1);
            margin-top: 30px;
          }
          .info {
            margin-top: 14px;
            font-size: 14px;
            line-height: 13px;
          }
        }
        .arrow {
          margin: 0px 80px;
          img {
            width: 40px;
            height: 20px;
          }
        }
      }
    }
  }
  .information-box {
    margin-top: 60px;
    margin-bottom: 100px;
    .content {
      max-width: 1200px;
      margin: auto;
      .title {
        color: rgba(51, 51, 51, 1);
        font-size: 32px;
        line-height: 30px;
        margin-bottom: 60px;
        text-align: center;
      }
      .info-list {
        .info-box {
          width: 520px;
          height: 220px;
          background: rgba(255, 255, 255, 1);
          border: 1px solid rgba(232, 232, 232, 1);
          border-radius: 10px;
          margin-right: 20px;
          margin-bottom: 20px;
          display: inline-block;
          padding: 20px 18px 20px 20px;
          .left-box {
            width: 176px;
            height: 105px;
            overflow: hidden;
            margin-top: 40px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .info-contnet {
            margin-left: 18px;
            position: relative;
            max-width: 281px;
            height: 180px;
            .info-title {
              font-size: 24px;
              font-family: "Noto Sans S Chinese";
              font-weight: 500;
              color: rgba(51, 51, 51, 1);
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .info-abstract {
              text-align: left;
              font-size: 14px;
              font-family: "Noto Sans S Chinese";
              font-weight: 400;
              color: rgba(153, 153, 153, 1);
              line-height: 24px;
              margin-top: 13px;
              text-overflow: -o-ellipsis-lastline;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 4;
              line-clamp: 4;
              -webkit-box-orient: vertical;
            }
            .info-time {
              position: absolute;
              bottom: 0;
              font-size: 14px;
              font-family: "Noto Sans S Chinese";
              font-weight: 400;
              color: rgba(153, 153, 153, 1);
              line-height: 24px;
            }
          }
        }
        .info-box:nth-child(2n) {
          margin-right: 0px;
        }
        .info-box:hover {
          box-shadow: 0px 1px 35px 3px rgba(0, 0, 0, 0.11);
        }
      }
      .swiper-container {
      }
      .swiper-slide {
        width: 270px;
        text-align: left;
        padding-left: 66px;
        background-color: #fff;
        border-radius: 8px;
        &:last-child {
          margin-right: 0;
        }
        .top-img {
          margin: auto;
          margin-top: 40px;
          width: 170px;
          height: 105px;
          border-radius: 50%;
          background-color: #f1f5fb;
          img {
            height: 100%;
            margin-top: 22px;
          }
        }
        .title {
          font-size: 18px;
          font-weight: 500;
          color: #303033;
          margin: 24px 0 16px 0;
        }
        .subtitle {
          font-size: 14px;
          color: #5d5d66;
        }
      }
    }
  }
  .copyright {
    background-color: #141b21;
    padding-bottom: 44px;
    color: #fff;
    height: 64px;
    line-height: 64px;
    text-align: right;
    margin-top: 80px;
  }
  .changeState {
    span {
      cursor: pointer;
    }
    .forgetW {
      color: #999999;
    }
  }
  .loginBottom {
    margin-bottom: 15px;
  }
  .verification-btn {
    height: 40px;
    color: #ababb3;
    border-color: #cccccc;
    background-color: #fff;
  }
  .login-btn {
    width: 100%;
    background-color: #16ade9;
    border: none;
    color: #ffffff;
    border-color: #cccccc !important;
    border-radius: 2px;
    font-size: 14px;
    line-height: 40px;
    height: 40px;
    padding: 0;
    // margin-bottom: 15px;
  }
  .diD {
    background-color: #e6e6e6 !important;
  }
}
.login-all {
  &/deep/.ivu-input {
    height: 40px;
    border-radius: 23px;
  }
  &/deep/.ivu-icon-user-account {
    width: 30px;
    height: 30px;
    background: url(../../assets/images/common/zhanghao.png) no-repeat 75% 76%;
    background-size: 35%;
  }
  &/deep/.ivu-icon-user-ps {
    width: 30px;
    height: 30px;
    background: url(../../assets/images/common/mima.png) no-repeat 75% 76%;
    background-size: 35%;
  }
  &/deep/.ivu-icon-user-phonenum {
    width: 30px;
    height: 30px;
    background: url(../../assets/images/common/zhanghao.png) no-repeat 75% 76%;
    background-size: 35%;
  }
  .banner-swiper {
    width: 100%;
    overflow: hidden;
    position: relative;
    height: auto;
    margin-top: 60px;
    .banner-link {
      height: 590px;
      background-position-x: -240px;
      background-position-y: -60px;
      display: block;
    }
    a.link1 {
      background-image: url("https://pre-fdfs.itaxs.com/group1/M00/00/61/rBLKLV7wI4eAP8kFAAUoivDexnI059.png");
    }
    div.link2 {
      background-image: url("https://pre-fdfs.itaxs.com/group1/M00/00/61/rBLKLV7wI5uAPkRJAAU5TFtFBLw795.png");
    }
    div.link3 {
      background-image: url("https://pre-fdfs.itaxs.com/group1/M00/00/61/rBLKLV7wI6mABn9fAAL_cGqPjGo746.png");
    }
    div.link4 {
      background-image: url("https://pre-fdfs.itaxs.com/group1/M00/00/61/rBLKLV7wI8yAWILLAAVqsghw_x0186.png");
    }
    .login-box {
      height: 500px;
      width: 1200px;
      margin: 0 auto;
      position: absolute;
      top: 60px;
      left: 50%;
      margin-left: -600px;
    }
    .loginRight {
      width: 390px;
      margin-top: 10px;
      right: 0;
      position: absolute;
      background-color: #fff;
      border-radius: 6px;
      padding: 10px 33px 50px;
      border-radius: 10px;
      top: 20px;
      z-index: 9;
      .login-input {
        .login-way {
          height: 72px;
          line-height: 72px;
          border-bottom: 1px solid #eeeeee;
          margin-bottom: 40px;
          span {
            width: 50%;
            float: left;
            text-align: center;
            color: #626266;
            font-size: 18px;
            cursor: pointer;
          }
          .active {
            color: #16ade9;
            border-bottom: 1px solid #16ade9;
          }
        }
        .form-outside {
          margin-top: 10%;
        }
        .img-logo {
          margin-bottom: 72px;
        }
        .login-btn {
          border-radius: 23px;
        }
        .ivu-form-item-content {
          &/deep/button {
            height: 48px;
          }
        }
      }
    }
  }
}
.imgCode-box /deep/ .ivu-input-with-prefix {
  padding-left: 20px;
}
</style>
