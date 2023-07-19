<template>
  <div>
    <HeaderTemp v-if="navList && navList.length" :nav-list="navList" :webInfo="webInfo" :blackKbyHead="true" />
    <div class="trademarkdetails-center">
      <i class="trademarkdetails-center-bg"></i>
      <div class="center ksy-w1320">
        <a-breadcrumb separator="">
          <a-breadcrumb-item
            ><span style="cursor: pointer" @click="$router.push('/classificationquery')">
              查分类
            </span></a-breadcrumb-item
          >
          <a-breadcrumb-separator />
          <a-breadcrumb-item class="crumb-current"> 分类搜索结果 </a-breadcrumb-item>
        </a-breadcrumb>
        <SearchBoxNew
          :searchText="searchText"
          @goSearch="getTradeList"
          @setSearchVal="setSearchVal"
          @btnClick="searchBtnClick"
          placeholder="请输入产品关键词中文或者英文进行查询"
          page="classificationdetails"
          ref="searchbox"
          style="margin: 22px 0 24px"
          :exampleList="['computers', 'bags', 'shoes']"
        />
        <a-spin :spinning="spinning">
        <filter-risk-type
          style="margin-bottom: 16px"
          ref="risk"
          :riskList.sync="trademarkCategoryData"
          :target="true"
          :targetNum="targetNum"
          v-if="filterRiskShow"
        ></filter-risk-type>

        <a-row :gutter="[16, 16]">
          <a-col :span="6">
            <dl class="trademark-card trademarkCategoryData-card">
              <dt>商标类别</dt>
              <dd class="trademarkCategory-box">
                <div
                  v-for="item in filterNumData(trademarkCategoryData)"
                  :key="item.id"
                  class="classification-item"
                  @click.stop="trademarkCategoryChange(item)"
                  :class="{ 'classification-current': trademarkCategoryCurr == item.categoryNum }"
                >
                  <a-checkbox @click.stop="() => false" v-model="item.check"></a-checkbox
                  >{{ item.categoryNum < 10 ? "0" : "" }}{{ item.categoryNum }} {{ item.categoryName
                  }}<span>（{{ item.tradeMarkCateGorytotal }}条）</span>
                </div>
              </dd>
            </dl>
          </a-col>
          <a-col :span="18">
            <dl class="trademark-card">
              <dt v-if="this.trademarkCategoryData.length">
                第{{ trademarkCategoryCurrInfo.categoryNum }}类：{{ trademarkCategoryCurrInfo.categoryName }}
              </dt>
              <dd>
                <div>
                  {{ trademarkCategoryCurrInfo.describe }}
                </div>
                <a-table
                  row-key="id"
                  class="classificationdetails-table"
                  :columns="columns"
                  :data-source="trademarkCategoryTwoData"
                  :pagination="pagesPagination"
                  @change="handleTableChange"
                  :loading="loading"
                >
                  <template slot="categoryName" slot-scope="categoryName">
                    <span v-html="keywordRed(searchText, categoryName)"></span>
                  </template>
                  <template slot="categoryNameEn" slot-scope="categoryNameEn">
                    <span v-html="keywordRed(searchText, categoryNameEn)"></span>
                  </template>
                </a-table>
              </dd>
            </dl>
          </a-col>
        </a-row>
        </a-spin>
      </div>
    </div>
    <div class="classificationdetails-btn">
      <div class="center ksy-w1320 flex flex-s-b">
        <div class="classificationdetails-btn-left">已选条件：</div>
        <div class="classificationdetails-btn-content flex1">
          <div v-if="chooseDatas.length" class="content-wrap flex flex-s-b">
            <div class="tag-wrap flex1">
              <a-tag
                v-for="(chos, chosIndex) in chooseDatas"
                :key="chosIndex"
                closable
                @close="(e) => removeItem(e, chos)"
              >
                <!-- @change="removeItem(chos,chosIndex)" -->
                {{ +chos.categoryNum > 9 ? chos.categoryNum : `0${chos.categoryNum}` }}类 {{ chos.categoryName }}
              </a-tag>
            </div>
            <a @click="reset" class="reset" href="javascript:void(0);">重置筛选</a>
          </div>
          <span v-else class="default-text">暂无</span>
        </div>
        <a-button type="primary" @click="trademarkSearch"> 根据已选商标分类检索 </a-button>
      </div>
    </div>
    <a-modal
      :visible="visible"
      @ok="searchOk"
      @cancel="visible = false"
      ok-text="立即检索"
      centered
      :closable="false"
      wrapClassName="classification-modal"
    >
      <div class="classification-modal-title">
        直连美国、欧盟、日本、英国商标局<br />数据及时更新，智能大数据检索分析，秒出结果
      </div>
      <div class="classification-modal-content">
        <p>输入商标名称</p>
        <a-textarea
          v-model="trademarkText"
          placeholder="请输入商标名查询，如需查询多个，请用分号隔开，如：aaa；bbb"
          :auto-size="{ minRows: 5, maxRows: 8 }"
        />
      </div>
    </a-modal>
    <!-- 全局登录框 -->
    <LoginPop v-if="showLoginPop" />
  </div>
</template>

<script>
import Cookies from "js-cookie";
import common from "@/apis/common";
import trademark from "@/apis/trademark";
import { uniq, sumBy, orderBy, cloneDeep } from "lodash";
import moment from "moment";
import { mapMutations, mapState } from "vuex";
// 官网模块列表权限 是否显示
import modulesAuth from "@/mixins/modules-auth";
export default {
  head() {
    return {
      title: `国际商标查询-免费商标检索-跨标云商标查询系统`,
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
        navList: Array.isArray(navList) ? navList : [], // 导航列表
        footerList: Array.isArray(footerList) ? footerList.slice(0, 32) : [], // 导航列表
        webInfo, // 网站信息
        urlText: "",
      };
    } catch (error) {
      console.log(error);
    }
  },
  mixins: [modulesAuth], // 官网模块列表权限 是否显示
  data() {
    return {
      spinning: false,
      searchText: "computers", // 搜索值
      searchedText: "", // 搜过的值
      countryCode: "US",

      trademarkText: "",
      showTips: false,
      loading: false,
      visible: false,
      trademarkCategoryCurr: "1",
      trademarkCategoryCurrInfo: {},
      trademarkCategoryData: [],
      trademarkCategoryTwoData: [],
      pagesPagination: {
        current: 1,
        total: 0,
      },
      columns: [
        {
          title: "编号",
          dataIndex: "categoryNum",
        },
        {
          title: "参考翻译",
          dataIndex: "categoryName",
          scopedSlots: { customRender: "categoryName" },
        },
        {
          title: "外文",
          dataIndex: "categoryNameEn",
          scopedSlots: { customRender: "categoryNameEn" },
        },
      ],
      categoryDescribe: [
        "用于工业、科学、摄影、农业、园艺和林业的化学品；未加工人造合成树脂，未加工塑料物质；灭火和防火用合成物；淬火和焊接用制剂；鞣制动物皮毛用物质；工业用粘合剂；油灰及其他膏状填料；堆肥，肥料，化肥；工业和科学用生物制剂。",
        "颜料，清漆，漆；防锈剂和木材防腐剂；着色剂，染料；印刷、标记和雕刻用油墨；未加工的天然树脂；绘画、装饰、印刷和艺术用金属箔及金属粉。",
        "不含药物的化妆品和梳洗用制剂；不含药物的牙膏；香料，香精油；洗衣用漂白剂及其他物料；清洁、擦亮、去渍及研磨用制剂。",
        "工业用油和油脂，蜡；润滑剂；吸收、润湿和粘结灰尘用合成物；燃料和照明材料；照明用蜡烛和灯芯。 ",
        "药品，医用和兽医用制剂；医用卫生制剂；医用或兽医用营养食物和物质，婴儿食品；人用和动物用膳食补充剂；膏药，绷敷材料；填塞牙孔用料，牙科用蜡；消毒剂；消灭有害动物制剂；杀真菌剂，除莠剂。 ",
        "普通金属及其合金，金属矿石；金属建筑材料；可移动金属建筑物；普通金属制非电气用缆线；金属小五金具；存储和运输用金属容器；保险箱。 ",
        "机器，机床，电动工具；马达和引擎（陆地车辆用的除外）；机器联结器和传动机件（陆地车辆用的除外）；除手动手工具以外的农业器具；孵化器；自动售货机。 ",
        "手工具和器具（手动的）；刀、叉和匙餐具；除火器外的随身武器；剃刀。 ",
        "科学、研究、导航、测量、摄影、电影、视听、光学、衡具、量具、信号、侦测、测试、检验、救生和教学用装置及仪器；处理、开关、转换、积累、调节或控制电的配送或使用的装置和仪器；录制、传送、重放或处理声音、影像或数据的装置和仪器；已录制和可下载的媒体，计算机软件，录制和存储用空白的数字或模拟介质；投币启动设备用机械装置；收银机，计算设备；计算机和计算机外围设备；潜水服，潜水面罩，潜水用耳塞，潜水和游泳用鼻夹，潜水。员手套，潜水呼吸器；灭火设备。",
        "外科、医疗、牙科和兽医用仪器及器械；假肢，假眼和假牙；矫形用物品；缝合材料；残疾人专用治疗装置；按摩器械；婴儿护理用器械、器具及用品；性生活用器械、器具及用品。 ",
        "照明、加热、冷却、蒸汽发生、烹饪、干燥、通风、供水以及卫生用装置和设备。",
        "运载工具；陆、空、海用运载装置。",
        "火器；军火及弹药；炸药；焰火。 ",
        "贵金属及其合金; 首饰，宝石和半宝石;钟表和计时仪器。",
        "乐器；乐谱架和乐器架；指挥棒。 ",
        "纸和纸板；印刷品；书籍装订材料；照片；文具和办公用品（家具除外）；文具用或家庭用粘合剂；绘画材料和艺术家用材料；画笔；教育或教学用品；包装和打包用塑料纸、塑料膜和塑料袋；印刷铅字，印版。 ",
        "未加工和半加工的橡胶、古塔胶、树胶、石棉、云母及这些材料的代用品；生产用成型塑料和树脂制品；包装、填充和绝缘用材料；非金属软管和非金属柔性管。",
        "皮革和人造皮革;动物皮; 行李箱和背包;雨伞和阳伞;手杖; 鞭，马具和鞍具；动物用项圈、皮带和衣服。 ",
        "非金属的建筑材料；建筑用非金属硬管；柏油，沥青；可移动非金属建筑物；非金属纪念碑。 ",
        "家具，镜子，相框; 未加工或半加工的骨、角、鲸骨或珍珠母;贝壳;海泡石;黄琥珀；存储或运输用非金属容器。 ",
        "家用或厨房用器具和容器;梳子和海绵;刷子(画笔除外);制刷原料;清洁用具;未加工或半加工玻璃(建筑用玻璃除外);玻璃器皿、瓷器和陶器；烹饪用具和餐具（刀、叉、匙除外）。 ",
        "绳索和细绳；网；帐篷和防水遮布；纺织品或合成材料制遮篷；帆；运输和贮存散装物用麻袋；衬垫和填充材料（纸或纸板、橡胶、塑料制除外）；纺织用纤维原料及其替代品。",
        "纺织用纱和线、毛线。 ",
        "织物及其替代品；家庭日用纺织品；纺织品制或塑料制帘。 ",
        "服装，鞋，帽、手套、围巾、纱巾 。",
        "花边，编带和刺绣品，缝纫用饰带和蝴蝶结；纽扣，领钩扣，饰针和缝针；人造花；发饰；假发。 ",
        "地毯，地席，亚麻油地毡及其他铺在已建成地板上的材料；非纺织品制壁挂。 ",
        "游戏器具和玩具;；视频游戏装置；体育和运动用品;圣诞树用装饰品。 ",
        "肉，鱼，家禽和野味;肉汁;腌渍、冷冻、干制及煮熟的水果和蔬菜;果冻，果酱，蜜饯;蛋;奶，奶酪，黄油，酸奶和其他奶制品;食用油和油脂。 ",
        "咖啡、茶、可可及其代用品；米，意式面食，面条；食用淀粉和西米；面粉和谷类制品；面包、糕点和甜食；巧克力；冰淇淋，果汁刨冰和其他食用冰；糖，蜂蜜，糖浆；鲜酵母，发酵粉；食盐，调味料，香辛料，腌制香草；醋，调味酱汁和其他调味品；冰（冻结的水）。 ",
        "未加工的农业、水产养殖业、园艺、林业产品；未加工的谷物和种子；新鲜水果和蔬菜，新鲜芳香草本植物；草木和花卉；种植用球茎、幼苗和种子；活动物；动物的饮食；麦芽。 ",
        "啤酒；无酒精饮料；矿泉水和汽水；水果饮料及果汁；糖浆及其他用于制作无酒精饮料的制剂。 ",
        "酒精饮料（啤酒除外）；制饮料用酒精制剂。 ",
        "烟草和烟草代用品；香烟和雪茄；电子香烟和吸烟者用口腔雾化器；烟具；火柴。",
        "广告；商业经营、组织和管理；办公事务。 ",
        "金融，货币和银行服务；保险服务；不动产事务。 ",
        "建筑服务；安装和修理服务；采矿，石油和天然气钻探。 ",
        "电信服务，主要包括至少能使二人之间通过感觉方式进行通讯的服务。",
        "运输；商品包装和贮藏；旅行安排。 ",
        "材料处理；废物和垃圾的回收利用；空气净化和水处理；印刷服务；食物和饮料的防腐处理。 ",
        "教育；提供培训；娱乐；文体活动。 ",
        "科学技术服务和与之相关的研究与设计服务；工业分析、工业研究和工业品外观设计服务；质量控制和质量认证服务；计算机硬件与软件的设计与开发。 ",
        "为消费者提供餐饮及临时住所的服务。 ",
        "医疗服务；兽医服务；人或动物的卫生和美容服务；农业、水产养殖、园艺和林业服务 。",
        "法律服务；为有形财产和个人提供实体保护的安全服务；由他人提供的为满足个人需要的私人和社会服务。 ",
      ],
      trademarkCategoryDataCurr: "",
      trademarkBigCategoryCurr: "",
      countryData: {
        US: "美国",
        EU: "欧盟",
        GB: "英国",
        JP: "日本",
      },
      categoryTotal: 0,
      // 默认不显示
      filterRiskShow: false,
    };
  },
  computed: {
    ...mapState("trademark", ["pagesTradeStatus"]),
    ...mapState({
      showLoginPop: (state) => state.showLoginPop,
    }),
    targetNum() {
      return [0, 0];
    },
    chooseDatas() {
      if (this.trademarkCategoryData.length) {
        return this.trademarkCategoryData.filter((item) => item.check);
      } else {
        return [];
      }
    },
  },
  mounted() {
    if (this.$route.query.categoryId) {
      this.trademarkBigCategoryCurr = this.$route.query.categoryId;
    }
    if (this.pagesTradeStatus.typeSearch) {
      this.filterRiskShow = true;
    }
    this.getTradeList();
  },
  destroyed() {
    this.setPagesTradeStatus({ typeSearch: false });
  },
  methods: {
    ...mapMutations("trademark", ["setRiskList", "setPagesTradeStatus"]),
    searchBtnClick() {
      this.setPagesTradeStatus({ typeSearch: false });
      this.filterRiskShow = true;
    },
    preventDefault(e) {
      e.preventDefault();
    },
    removeItem(e, item) {
      e.preventDefault();
      const { categoryNum } = item;
      let list = this.trademarkCategoryData;
      const index = list.findIndex((child) => child.categoryNum === categoryNum);
      list[index].check = false;
      this.trademarkCategoryData = [...list];
    },
    reset() {
      let list = this.trademarkCategoryData;
      list.map((item) => {
        item.check = false;
        return item;
      });
      this.trademarkCategoryData = [...list];
    },
    // 过滤为0的数据
    filterNumData(array) {
      if (array.length) {
        return array.filter((item) => +item.tradeMarkCateGorytotal > 0);
      } else {
        return [];
      }
    },
    //大类切换
    trademarkCategoryChange(item) {
      this.trademarkCategoryCurr = item.categoryNum;
      this.trademarkCategoryCurrInfo = item;
      this.pagesPagination.current = 1;
      this.getTrademarkCategoryTwo();
    },
    //表格信息改边
    handleTableChange(pagination, filters, sorter) {
      this.pagesPagination.current = pagination.current;
      //获取小类
      this.getTrademarkCategoryTwo();
    },

    searchOk() {
      if (!this.trademarkText) {
        return this.$message.warning("请输入商标名称!");
      } else {
        const trademarkRegExp = /；/g;
        const replaceWith = ";";

        let trademarkTextTemp = cloneDeep(this.trademarkText).replace(trademarkRegExp, replaceWith);
        Cookies.set("countryList", [this.countryData[this.countryCode]]);
        Cookies.set("trade", trademarkTextTemp);
        Cookies.set(
          "category",
          this.trademarkCategoryDataCurr.map((item) => item.categoryNum)
        );
        this.$router.push("/fastResult/brandLike");
        this.visible = false;
        this.setRiskList(this.trademarkCategoryDataCurr.map((item) => item.categoryNum));
      }
    },
    //设置搜索数据
    setSearchVal(data) {
      this.searchText = data.cruTrade;
    },
    // 商标分页查询
    async getTradeList(data) {
      if (data) {
        this.searchText = data.cruTrade;
        Cookies.set("trade", data.cruTrade);
      }
      let params = {
        limit: 50,
        page: 1,
        countryCode: this.countryCode,
        categoryName: Cookies.get("searchtext") || this.searchText,
      };
      this.spinning = true
      let trademarkCategoryOne = await this.$axiosApi(
        trademark.categoryOneList.url,
        trademark.categoryOneList.methods,
        params
      );
      trademarkCategoryOne.data.forEach((ele, index) => {
        this.$set(ele, "check", false);
        this.$set(ele, "describe", this.categoryDescribe[index]);
      });
      this.trademarkCategoryData = this.filterNumData([...trademarkCategoryOne.data])
      this.trademarkCategoryData = orderBy(this.trademarkCategoryData, "categorySort", "asc");
      this.trademarkCategoryCurr = this.trademarkBigCategoryCurr
        ? this.trademarkBigCategoryCurr
        : (this.trademarkCategoryData[0] || {}).categoryNum;
      this.categoryTotal = sumBy(this.trademarkCategoryData, "tradeMarkCateGorytotal");
      this.trademarkCategoryCurrInfo = this.trademarkCategoryData[0] || {};
      this.$nextTick(() => {
        let currIndex = 0;
        this.trademarkCategoryData.forEach((item, index) => {
          if (item.categoryNum == this.trademarkBigCategoryCurr) {
            this.trademarkCategoryCurrInfo = item;
            currIndex = index;
          }
        });
        document.querySelector(".trademarkCategory-box").scrollTop = this.trademarkBigCategoryCurr ? currIndex * 72 : 0;
        this.trademarkBigCategoryCurr = "";
      });

      //获取小类
      this.getTrademarkCategoryTwo();
      let historySearchText = [];
      if (this.$store.state.historySearchText) {
        historySearchText = this.$store.state.historySearchText;
      }
      if (Cookies.get("searchtext") || this.searchText) {
        historySearchText.push(Cookies.get("searchtext") || this.searchText);
      }
      historySearchText = uniq(historySearchText).slice(-6);
      this.$store.commit("setHistorySearchText", historySearchText);

      Cookies.remove("searchtext");
      Cookies.remove("searchvalue");
      Cookies.remove("showValue");
      this.spinning = false
    },
    //获取商标小类
    async getTrademarkCategoryTwo() {
      let params2 = {
        limit: 10,
        page: this.pagesPagination.current,
        countryCode: this.countryCode,
        oneCategoryNum: this.trademarkCategoryCurr || (this.trademarkCategoryData[0] || {}).categoryNum,
        categoryName: Cookies.get("searchtext") || this.searchText,
        status: 1,
      };
      this.loading = true;
      let trademarkCategoryTwo = await this.$axiosApi(
        trademark.categoryTwoList.url,
        trademark.categoryTwoList.methods,
        params2
      );
      this.loading = false;
      this.pagesPagination.total = Number(trademarkCategoryTwo.data.total);
      this.pagesPagination.current = Number(trademarkCategoryTwo.data.current);
      this.trademarkCategoryTwoData = trademarkCategoryTwo.data.records;
    },
    //商标分类检索
    trademarkSearch() {
      this.trademarkCategoryDataCurr = this.trademarkCategoryData.filter((item) => item.check);
      let isLogin = false;
      let token = Cookies.get("token");
      let sid = Cookies.get("sessionId");
      if (token && sid) {
        isLogin = true;
      }
      if (this.trademarkCategoryDataCurr.length) {
        if (!isLogin) {
          if (localStorage.searchTime) {
            if (moment(new Date()) - moment(localStorage.searchTime) > 86400000) {
              localStorage.searchTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
              localStorage.searchSum = 1;
            } else {
              if (localStorage.searchSum < 3) {
                localStorage.searchSum = 1 + parseInt(localStorage.searchSum);
                this.visible = true;
              } else {
                this.$store.commit("setLoginPopData", { show: true });
                this.$nextTick(() => {
                  this.$bus.$emit("loginVisiable", { type: 4 });
                });
              }
            }
          } else {
            localStorage.searchTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            localStorage.searchSum = 1;
            this.visible = true;
          }
        } else {
          this.visible = true;
        }
      } else {
        this.showTips = true;
      }
    },
    // 关键字高亮
    keywordRed(keyword, text) {
      if (keyword && keyword !== "") {
        text = text.split(keyword).join("<span style='color:#FAAD14;'>" + keyword + "</span>");
      }
      return text;
    },
  },
};
</script>

<style lang="less" scoped>
.trademarkdetails-center {
  margin-top: 64px;
  padding-top: 16px;
  background: #f5f7fa;
  position: relative;

  .trademarkdetails-center-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 168px;
    .bg-image-png("searchbox-bg");
    background-size: cover;
    border-radius: 0px 0px 0px 0px;
    opacity: 1;
  }

  .center {
    position: relative;
  }
}

.trademarkdetails-head {
  margin-top: 20px;
  margin-bottom: 34px;
  position: relative;

  dt {
    width: 88px;
    height: 88px;
    float: left;
    background: #fff;
    margin-right: 20px;
  }

  img {
    max-width: 100%;
  }

  dd {
    color: rgba(0, 0, 0, 0.6);
    display: inline-block;
  }

  h2 {
    font-size: 20px;
    font-weight: bold;
    margin: 10px 0 15px;
  }
}

.trademark-card {
  background: #fff;
  padding: 24px;
  width: 100%;
  min-height: 300px;
  margin-bottom: 70px;

  dt {
    color: rgba(0, 0, 0, 0.9);
    font-size: 16px;
    margin-bottom: 20px;
  }
}

.trademark-table {
  width: 100%;
  border: 1px solid #e8eefb;

  td {
    border: 1px solid #e8eefb;
    padding: 12px;
  }

  .trademark-table-label {
    background: rgba(178, 201, 255, 0.2);
    width: 130px;
  }

  .trademark-table-content {
    width: 400px;
  }
}

.trademark-process {
  margin-top: 75px;
  height: 15px;

  /deep/.ant-steps-item-container {
    position: relative;

    .ant-steps-item-content {
      position: relative;
      top: -65px;

      .ant-steps-item-title {
        font-size: 14px;
      }

      .ant-steps-item-description {
        color: rgba(0, 0, 0, 0.4);
        font-size: 12px;
      }
    }
  }

  /deep/.ant-steps-item-tail::after {
    height: 1px;
    margin-top: 1px;
  }
}

.trademark-knowledge {
  p {
    color: rgba(0, 0, 0, 0.4);
    position: relative;
    margin-bottom: 0;
    padding-left: 15px;

    &::before {
      content: "";
      position: absolute;
      width: 5px;
      height: 5px;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 50%;
      top: 9px;
      left: 3px;
    }
  }
}

.search-result {
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 13px;
}

.trademarkdetails-tips {
  background: #fffbe6;
  border-radius: 2px 2px 2px 2px;
  border: 1px solid #ffe58f;
  margin: 16px 0 13px;
  line-height: 23px;
  padding-bottom: 4px;

  color: rgba(0, 0, 0, 0.9);

  /deep/ .anticon-close {
    float: right;
    position: relative;
    top: 4px;
    cursor: pointer;
  }

  /deep/.ant-alert-icon {
    color: #faad14;
    font-size: 14px;
  }
}

.classificationdetails-table {
  margin-top: 24px;
}

.classificationdetails-btn {
  width: 100%;
  background: #ffffff;
  box-shadow: 0px -2px 6px 0px rgba(0, 0, 0, 0.06);
  position: fixed;
  left: 0;
  bottom: 0;
  text-align: center;
  padding: 16px 0 22px;
  z-index: 2;
  &-left {
    font-size: 16px;
    color: #303132;
    line-height: 24px;
  }
  &-content {
    text-align: left;
    font-size: 0;
    .default-text {
      font-size: 16px;
      color: #919498;
      line-height: 24px;
    }
    .content-wrap {
      .ant-tag {
        margin: 0 16px 14px 0;
        height: 32px;
        line-height: 32px;
        background: #f5f7fb;
        border: 1px solid #f5f7fb;
        border-radius: 2px;
        &:hover {
          color: @primaryColor !important;
          background: #f1f5ff;
          border: 1px solid @primaryColor;
        }
      }
      .reset {
        color: @primaryColor;
        font-size: 14px;
        color: #3a7fff;
        line-height: 22px;
        cursor: pointer;
      }
    }
  }
  button {
    margin-left: 84px;
  }
}

.trademarkCategory-box {
  max-height: 724px;
  overflow-y: auto;
}

.classification-item {
  width: 234px;
  height: 56px;
  line-height: 56px;
  background: #ffffff;
  border-radius: 2px 2px 2px 2px;
  border: 1px solid #dcdcdc;
  margin-bottom: 16px;
  color: #303132;
  cursor: pointer;

  span {
    color: #c0c4cb;
  }

  .ant-checkbox-wrapper {
    margin: 0 16px 0 24px;
  }
}

.classification-current {
  color: #3370ff;
  background: #e3f1ff;

  span {
    color: rgba(0, 0, 0, 0.4);
  }
}

.classification-modal-title {
  padding-top: 30px;
  height: 105px;
  background: url("@/assets/images/trademark/pop_bg.png") no-repeat center/cover;
  border-radius: 4px 4px 0px 0px;
  opacity: 1;
  text-align: center;
}

.classification-modal-content {
  padding: 20px;
}

.crumb-current {
  color: #303132;
}

.trademarkCategoryData-card {
  padding-right: 0px;
}

// 默认滚动条样式调整
.trademarkCategory-box::-webkit-scrollbar-thumb {
  -webkit-box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  background: #e3e3e3;
  position: absolute;
  right: 0;
}

.trademarkCategory-box::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  background: #f2f3f4;
}

.trademarkCategory-box::-webkit-scrollbar {
  width: 7px;
}
</style>
<style lang="less">
.classification-modal {
  .ant-modal .ant-modal-body {
    padding: 0;
  }
}
</style>
