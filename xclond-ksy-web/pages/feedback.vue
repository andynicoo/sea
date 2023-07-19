<template>
  <div class="layout">
    <div class="header header-change">
      <div class="center ksy-w1320">
        <div class="ksy-ib">
          <nuxt-link to="/"><img :src="webInfo.lightColourLogo" alt="logo" class="logo" /></nuxt-link>
        </div>
        <span class="goback hand" @click="goBack">
          <img src="~/assets/images/toleft.svg" alt="返回上一级" style="margin-top: -1px" />
          返回上一级
        </span>
        <div class="ksy-ib ksy-fr"><UserInfo :bgChange="true" /></div>
      </div>
    </div>
    <div class="ksy-pr titbg">
      <div class="center ksy-w1320 t1" v-if="NODE_PLA === 'kby'">跨标云致力于为您提供更智能的国际知识产权平台</div>
      <div class="center ksy-w1320 t1" v-if="NODE_PLA === 'ksy'">跨税云致力于为您提供更智能的税务合规服务平台</div>
      <div class="center ksy-w1320 t1" v-if="NODE_PLA === 'wg'">
        辰知云致力于为您提供更便捷高效的国际外观专利注册服务
      </div>
      <div class="center ksy-w1320 t2">
        如果您遇到系统使用问题/有好的系统优化建议，欢迎您在此提出。我们将持续完善~
        （目前仅上线系统功能建议，更多反馈类型加急完善中。购买咨询或服务问题反馈请联系专属客户经理）
      </div>
    </div>
    <div class="opinion center ksy-w1320">
      <div class="from">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="反馈类型" prop="resource">
            <div class="feedbtn">系统功能建议</div>
          </a-form-model-item>

          <a-form-model-item label="功能模块" prop="functionalModule">
            <a-select v-model="form.functionalModule" placeholder="please select your zone">
              <a-select-option value="官网"> 官网 </a-select-option>
              <a-select-option value="产品服务"> 产品服务 </a-select-option>
              <a-select-option value="外观专利"> 外观专利 </a-select-option>
              <a-select-option value="工具箱"> 工具箱 </a-select-option>
              <a-select-option value="订单管理"> 订单管理 </a-select-option>
              <a-select-option value="账户管理"> 账户管理 </a-select-option>
              <a-select-option value="其他"> 其他 </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item ref="title" label="标题" prop="title">
            <a-input
              v-model="form.title"
              @blur="
                () => {
                  $refs.title.onFieldBlur();
                }
              "
              placeholder="请准确概况要反馈的问题"
            />
          </a-form-model-item>
          <a-form-model-item label="描述" prop="description">
            <a-input
              v-model="form.description"
              type="textarea"
              :autoSize="{ minRows: 3, maxRows: 6 }"
              placeholder="Hi~我们正在倾听，请提供详细使用场景描述，帮助我们理解~感谢配合~"
            />
          </a-form-model-item>
          <!-- <a-button> <a-icon type="upload" /> 上传图片 </a-button> -->
          <a-form-model-item label="描述" prop="filePath">
            <a-upload
              :action="uplodPath"
              list-type="picture-card"
              @change="(value) => handleChange2(value, 'defaultFileList')"
              :file-list="defaultFileList"
              accept=".jpg,.png,pdf"
            >
              <div v-if="defaultFileList.length < 6">
                <a-icon :type="loading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">上传</div>
                <p class="uptips">jpg、png、pdf</p>
              </div>
            </a-upload>
          </a-form-model-item>
          <a-form-model-item :wrapper-col="{ span: 6, offset: 16 }">
            <a-button type="primary" @click="onSubmit" :loading="subminting" class="ksy-mr-1"> 提交 </a-button>
            <a-button style="margin-left: 10px" @click="goBack"> 取消 </a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
    </div>
    <FooterTemp v-if="footerList && footerList.length" :list="footerList" :webInfo="webInfo" :showBanner="false" />

    <a-modal v-model="visible" :title="null" :footer="null" centered :maskClosable="false" :closable="false">
      <div class="codealert">
        <p class="tit">已收到，我们会认真考虑并积极改进，感谢您帮助{{ planame }}成长</p>
        <div class="mid" v-if="NODE_PLA !== 'wg'">
          <div class="box ksy-fl" v-show="webInfo.gzhQrCode">
            <img :src="webInfo.gzhQrCode" alt="公众号" />
          </div>
          <div class="box2 ksy-fl">
            <p class="t1">扫码关注{{ planame }}公众号</p>
            <p v-if="NODE_PLA === 'kby'">实时接收商标提醒，掌握最新信息</p>
            <p v-if="NODE_PLA === 'ksy'">实时接收税务信息</p>
            <p v-if="NODE_PLA === 'ksy'">实时接收税务信息</p>
          </div>
        </div>
        <p class="ksy-tc">
          <a-button type="primary" size="large" @click="goBack" class="backbtn">返回上一级</a-button>
        </p>
      </div>
    </a-modal>
  </div>
</template>

<script>
import aboutComputedMix from "@/mixins/about-computed";
import common from "@/apis/common";
import { mapState } from "vuex";
const NODE_PLA = process.env.NODE_PLA;
import config from "../static/config";

export default {
  head() {
    return {
      title: `${config[NODE_PLA].feedbackTitle}`,
      meta: [
        {
          hid: "keywords",
          name: "keywords",
          content: `${config[NODE_PLA].feedbackWords}`,
        },
        {
          hid: "description",
          name: "description",
          content: `${config[NODE_PLA].feedbackDescription}`,
        },
      ],
    };
  },
  async asyncData(context) {
    try {
      let [{ data: footerList }, { data: webInfo }] = await Promise.all([
        context.$axiosApi(common.getPartnerList.url, common.getPartnerList.methods, { linkType: 0 }),
        context.$axiosApi(common.getWebsitInfo.url, common.getWebsitInfo.methods),
      ]);

      return {
        footerList: Array.isArray(footerList) ? footerList.slice(0, 32) : [], // 导航列表
        webInfo, // 网站信息
      };
    } catch (error) {
      console.log(error);
    }
  },
  data() {
    return {
      NODE_PLA: process.env.NODE_PLA,
      labelCol: { span: 3 },
      wrapperCol: { span: 18 },
      other: "",
      form: {
        title: "",
        resource: "1",
        functionalModule: "官网",
        mobile: "",
        description: "",
        filePath: "",
      },
      loading: false,
      rules: {
        resource: [{ required: true, message: "请选择类型", trigger: "blur" }],
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          { min: 1, max: 50, message: "请不要超过50个字符", trigger: "blur" },
        ],
        functionalModule: [{ required: true, message: "请选择模块", trigger: "blur" }],
      },
      subminting: false,
      visible: false,
    };
  },
  computed: {
    ...mapState({
      auth: (state) => state.auth,
    }),
    planame() {
      let planame = "";
      switch (this.NODE_PLA) {
        case "wg":
          planame = "辰知云";
          break;
        case "kby":
          planame = "跨标云";
          break;
        default:
          planame = "跨税云";
          break;
      }
      return planame;
    },
  },
  mixins: [aboutComputedMix],
  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          let picArr = this.defaultFileList.map((item) => {
            if (item.response.code === 0) {
              return item.response.data.fileUrl;
            }
          });
          let params = {
            ...this.form,
            mobile: this.auth.userMobile,
            screenshot: picArr.join(","),
            status: true,
            userId: this.auth.userId,
          };

          let { code, message } = await this.$axiosApi(common.sendFeedBack.url, common.sendFeedBack.methods, params);

          if (code === 0) {
            this.visible = true;
          } else {
            this.$message.error(message);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    cancal() {
      this.$emit("cancal");
    },
    goBack() {
      window.history.go(-1);
    },
  },
};
</script>

<style lang="less" scoped>
.header {
  height: 64px;
  line-height: 64px;
  background: #ffffff;
  .logo {
    // padding-left: 32px;
    padding-top: 4px;
    width: 118px;
  }
  .goback {
    color: @textColor;
    margin-left: 56px;
  }
}
.titbg {
  height: 160px;
  background: url("@/assets/images/feedbackbg.png") center no-repeat #2d375f;
  .t1 {
    height: 40px;
    font-size: 28px;
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
    color: #ffffff;
    line-height: 40px;
    padding-top: 24px;
    padding-bottom: 12px;
  }
  .t2 {
    height: 26px;
    font-size: 14px;
    color: @textColorW;
    line-height: 26px;
    margin-top: 32px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    line-height: 26px;
  }
}
.layout {
  background: #f5f7fa;
}
.opinion {
  position: relative;
  z-index: 999;
  margin-top: -35px;
  .tips {
    border: 1px solid @successColor;
    border-radius: 3px;
    padding: 10px 5px;
    background: #f6ffed;
    margin-bottom: 20px;
  }
  .from {
    background: #ffffff;
    padding-top: 44px;
    padding-bottom: 32px;
    margin-bottom: 48px;
    padding-left: 200px;
    padding-right: 200px;
    .feedbtn {
      width: 116px;
      height: 32px;
      background: #ffffff;
      border-radius: 0px 0px 0px 0px;
      opacity: 1;
      border: 1px solid @primaryColor;
      color: @primaryColor;
      line-height: 32px;
      text-align: center;
      margin-top: 5px;
    }
  }
}
.fbbg {
  background: #000;
  height: 20px;
}
.codealert {
  // padding: 32px 28px;
  .tit {
    height: 24px;
    font-size: 16px;
    font-weight: bold;
    color: @textColor;
    line-height: 24px;
  }
  .mid {
    width: 80%;
    margin: 24px auto;
    height: 90px;
    .t1 {
      height: 22px;
      font-size: 14px;
      font-weight: bold;
      color: @textColor;
      line-height: 22px;
      margin-top: 18px;
    }
  }
  .box {
    width: 88px;
    border: 1px solid #dcdcdc;
    border-radius: 2px;
    img {
      width: 88px;
    }
  }
  .box2 {
    margin-left: 32px;
  }
}
.backbtn {
  padding: 0px 30px;
}
.header-change {
  /deep/.p-kby button {
    background: @primaryColor;
    color: #ffffff;
  }
}
.from {
  /deep/.ant-form-item-control {
    margin-left: 23px;
  }
  /deep/.uptips {
    font-size: 12px;
    color: #00000040;
  }
}
</style>
