<template>
  <div class="namescheme">
    <HeaderTemp v-if="navList && navList.length" :nav-list="navList" :webInfo="webInfo" :blackKbyHead="true" />

    <div class="midbox">
      <div class="selectbox">
        <div class="center ksy-w1320">
          <div class="size14 color6">
            <nuxt-link tag="span" to="/trademarkname" style="cursor: pointer">商标取名</nuxt-link> /
            <span class="color9">取名方案</span>
          </div>
          <a-space class="ksy-pt-4 color9">
            关键词 <a-input class="w140" v-model="form.inputName" :maxLength="30" />
            <a-radio-group v-model="form.compareRule" @change="onChange" class="p40">
              <a-radio-button :value="1"> 在开头 </a-radio-button>
              <a-radio-button :value="2"> 在末尾 </a-radio-button>
              <a-radio-button :value="0"> 不限 </a-radio-button>
            </a-radio-group>
            <span class="p40">商标分类</span>
            <TradeClass />
            <a-button class="m40 borderbtn" @click="reGetName()" id="trademarkname_result_button001">重新取名</a-button>
            <a-button @click="toClient('trademarkCollect')" type="link" class="color9 hoverPrimary">我的收藏</a-button>
          </a-space>
        </div>
      </div>
      <div class="center ksy-w1320 xx">
        <!-- 提示语 -->
        <TradeTips class="ksy-mt-3 flex" />

        <!-- 结果卡片 -->
        <TradeCards
          class="ksy-mt-3"
          :formData="form"
          ref="tradeCards"
          :sort="form.compareRule"
          :sortKey="form.inputName"
        />
        <!-- 商标风险图 -->
        <TardeRiskCard class="ksy-mt-3" :inputName="form.inputName" ref="riskCard" v-if="showRiskCard" />
      </div>
    </div>

    <!-- 专家取名 弹窗 -->
    <ExpertslVer />

    <FooterTemp v-if="footerList && footerList.length" :list="footerList" :webInfo="webInfo" />
  </div>
</template>
<script>
// 官网模块列表权限 是否显示
import modulesAuth from "@/mixins/modules-auth";
import common from "@/apis/common";
import IndexMixin from "@/mixins";

export default {
  head() {
    return {
      title: `国际商标取名`,
      meta: [
        {
          hid: "keywords",
          name: "keywords",
          content: `${
            process.env.NODE_PLA === "kby"
              ? "美国商标查询,欧盟商标查询,日本商标查询,英国商标查询,"
              : "跨税云,跨税云官网,跨税云平台，跨税云VAT"
          }`,
        },
        {
          hid: "description",
          name: "description",
          content: `${
            process.env.NODE_PLA === "kby"
              ? "国际商标查询就上跨标云,100+美国本土律师,500+资深专业团队,免费商标检索,降低注册驳回风险!报价透明化,快速办理！"
              : "跨税云(itaxs.com)—智能税务平台，直连海外税局。itaxs代表intelligent tax system，连接多家跨境电商平台及多国税务系统，帮助卖家快速注册VAT税号，精准算税，一键申报，打造跨境人自己的VAT系统，助力跨境卖家开拓海外市场，已为50000+卖家提供服务。"
          }`,
        },
      ],
    };
  },
  async asyncData(context) {
    try {
      let [{ data: navList }, { data: footerList }, { data: webInfo }] = await Promise.all([
        context.$axiosApi(common.newslist.url, common.newslist.methods),
        context.$axiosApi(common.getPartnerList.url, common.getPartnerList.methods, { linkType: 0 }),
        context.$axiosApi(common.getWebsitInfo.url, common.getWebsitInfo.methods),
      ]);
      return {
        navList: Array.isArray(navList) ? navList : [],
        footerList: Array.isArray(footerList) ? footerList.slice(0, 32) : [],
        webInfo,
        urlText: "",
      };
    } catch (error) {
      console.log(error);
    }
  },
  mixins: [modulesAuth, IndexMixin],
  data() {
    return {
      value: "",
      form: {
        inputName: "", // 名称
        description: "",
        randomLevel: "", // 随机等级 低:low 中:mid 高:high
        styleType: "",
        compareRule: 0, // 默认不限
      },
      showRiskCard: false, // 获取inputName后展示 风险图
    };
  },
  mounted() {
    let namePreferForm = sessionStorage.getItem("namePreferForm")
      ? JSON.parse(sessionStorage.getItem("namePreferForm"))
      : {};
    this.form.inputName = namePreferForm.inputName;
    this.showRiskCard = true;
  },
  methods: {
    onChange(e) {
      console.log(`checked = ${e.target.value}`);
    },
    // 重新取名
    async reGetName() {
      // 风险图 更新
      if (this.form.inputName === "") {
        return this.$message.error("请输入关键字！");
      }
      await this.searchTest(this.form.inputName);
      this.$refs.riskCard.getAdviseList();
      this.$refs.tradeCards.reGetName();
    },
  },
};
</script>
<style lang="less" scoped>
.namescheme {
  background: #f5f7fa;
  .midbox {
    margin-top: 64px;
    .selectbox {
      height: 122px;
      background: #ffffff;
      opacity: 1;
      border-top: 1px solid #efefef;
      padding: 17px 0px;
      .w140 {
        width: 140px;
      }
      .p40 {
        padding-left: 40px;
      }
      .m40 {
        margin-left: 40px;
      }
    }
  }
}
</style>
