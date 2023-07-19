<template>
  <div>
    <HeaderTemp v-if="navList && navList.length" :nav-list="navList" :webInfo="webInfo" />
    <div class="computed">
      <div class="logtip" v-show="logtip">
        <div class="content">
          <a-icon type="info-circle" style="color: #FFAC0A" />
          非注册用户每天可以免费获得一次算税次数，注册用户不限制算税次数。
          <a-button type="link" @click="handleClickLink('login?loginType=3')">免费注册</a-button>
          已有账号?
          <a-button type="link" @click="handleClickLink()">前往登录</a-button>
        </div>
      </div>
      <!-- <a-carousel v-if="bigBanner && bigBanner.length" class="ksy-mb-2">
        <div
          v-for="(item, index) in bigBanner"
          :key="`b_${index}`"
          v-sensorsDire="{
            type: 'BannerClick',
            event: 'click',
            getParams: () => ({
              B_banner_id: item.adId,
              page_name: '一键算税',
            }),
          }"
        >
          <a :href="item.url" v-if="item.url">
            <img :src="item.picPath" :alt="item.name" />
          </a>
          <img v-else :src="item.picPath" :alt="item.name" />
        </div>
      </a-carousel> -->
      <div class="ksy-mb-2">
        <IndexBanner :list="bigBanner" v-if="bigBanner && bigBanner.length" :showData="false" :height="396" />
      </div>
      <div class="content ksy-mb-2 ksy-w1320">
        <div
          class="mid-banner"
          v-if="middleBanner && middleBanner.length"
          v-sensorsDire="{
            type: 'BannerClick',
            event: 'click',
            getParams: () => ({
              B_banner_id: middleBanner[0].adId,
              page_name: '一键算税',
            }),
          }"
        >
          <a v-if="middleBanner[0].url" :href="middleBanner[0].url" target="_blank">
            <img v-lazy="middleBanner[0].picPath" :alt="middleBanner[0].name" class="ksy-mt-1 ksy-mb-4 ksy-w1320" />
          </a>
          <img
            v-else
            v-lazy="middleBanner[0].picPath"
            :alt="middleBanner[0].name"
            class="ksy-mt-1 ksy-mb-4 ksy-w1320"
          />
        </div>
        <div style="display: none">
          form:{{ form }}
          <hr />
          {{ otherPlat }}--{{ form.countryCode === "GB" }}
        </div>
        <a-alert
          message="PVA为postpone VAT account，即进口VAT递延，清关时走递延流程，不需当场交进口VAT，清关后6个月内需要做PVA申报，申报需要上传的文件为做了递延的C88文件，或者进入对应的CDS账户，下载对应的PVA statement。"
          type="info"
          show-icon
          class="ksy-mt-4 ksy-mb-4"
          v-if="form.countryCode === 'GB'"
        />
        <a-spin :spinning="spinning">
          <a-form-model
            ref="ruleForm"
            :rules="rules"
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 21 }"
            :model="form"
            labelAlign="left"
          >
            <a-form-model-item ref="countryNameZh" label="国家" prop="countryNameZh">
              <span v-for="tag in countryList" :key="tag.countryNameZh">
                <a-checkable-tag
                  :checked="tag.countryNameZh === form.countryNameZh"
                  @change="(checked) => countryChange(tag, checked)"
                >
                  {{ tag.countryNameZh }}
                </a-checkable-tag>
              </span>
            </a-form-model-item>
            <a-form-model-item label="税率" prop="taxRate">
              <span v-for="tag in taxList" :key="tag">
                <a-checkable-tag :checked="tag === form.taxRate" @change="(checked) => taxChange(tag, checked)">
                  {{ tag }}
                </a-checkable-tag>
              </span>
            </a-form-model-item>
            <a-form-model-item label="报税周期" prop="periodType">
              <span v-for="item in declareList" :key="item.status">
                <a-checkable-tag
                  :checked="item.type === form.selectSeason"
                  @change="(checked) => seasonChange(item, checked)"
                >
                  {{ item.type }}
                </a-checkable-tag>
              </span>
            </a-form-model-item>
            <!-- 欧盟国家有vat -->
            <a-form-model-item label="已注册VAT国家" v-show="vatCount.includes(form.countryCode)">
              <a-checkbox-group @change="onVatChange" v-model="form.tfnCountryCode">
                <a-checkbox
                  v-for="vat in tfnCountryCode"
                  :key="vat.value"
                  :value="vat.value"
                  :disabled="vat.value === vatDisableCountry"
                >
                  {{ vat.label }}
                </a-checkbox>
              </a-checkbox-group>
            </a-form-model-item>
            <div class="line ksy-mt-4 ksy-mb-4"></div>
            <!-- {{ defaultFileList }} -->
            <a-form-model-item label="Amazon销售额文件" prop="salePlatformType">
              <a-radio-group name="radioGroup" v-model="form.salePlatformType">
                <div class="uploadbox">
                  <!-- <a-checkable-tag :checked="true"> Amazon </a-checkable-tag> -->
                  <!-- <a-radio :value="1">Amazon</a-radio> -->
                  <div style="display: inline-grid">
                    <a-upload
                      :action="uplodPath"
                      @change="(value) => handleChange(value, 'form', 'filePath', 'defaultFileList')"
                      :data="{ prefix: '' }"
                      :file-list="defaultFileList"
                      accept=".xlsx,.xls,xlsx,.csv,.txt"
                    >
                      <a-button> <a-icon type="upload" /> 上传文件 </a-button>
                    </a-upload>
                    支持xlsx、xls、csv、txt
                  </div>
                  <span class="datalink" @click="downloadVisible = true">如何获取?</span>
                </div>
              </a-radio-group>
            </a-form-model-item>
            <!-- {{ otherPlat.handIncludeTaxSales===null }} -->
            <a-form-model-item label="其他平台含税销售额" class="ksy-mt-3 uploadbox">
              <a-button @click="otherVisible = !otherVisible" style="height: 32px" icon="edit">
                <!-- <AliIcon type="tianxie" :size="15" /> -->
                {{ otherPlat.handIncludeTaxSales === null ? "点击填写" : "点击修改" }}
              </a-button>
            </a-form-model-item>
            <div class="line ksy-mb-4 ksy-mt-4" v-if="form.countryCode === 'ES'"></div>
            <a-form-model-item class="ksy-mt-4" prop="ecl" v-if="form.countryCode === 'ES'">
              <span slot="label">
                ECL申报
                <a-tooltip
                  title="请确认欧盟税号是否生效，如生效请确认是否完成ECL（B2B）申报，若不申报，则会产生罚金且有税号注销风险，ECL申报为数据上报，不影响税金。"
                >
                  <a-icon type="question-circle-o" />
                </a-tooltip>
              </span>
              <span v-for="item in eclOption" :key="item.label">
                <a-checkable-tag :checked="item.value === form.ecl" @change="(checked) => eclChange(item, checked)">
                  {{ item.label }}
                </a-checkable-tag>
              </span>
              <div class="eclbox uploadbox" v-show="form.ecl === true">
                <a-space>
                  <span class="tit">ECL销售项金额：{{ eclSaleItemsCount }} 欧元</span>
                  <a-button
                    @click="
                      eclModal = 1;
                      eclVisible = !eclVisible;
                    "
                    style="height: 32px"
                  >
                    <AliIcon type="tianxie" :size="15" /> 添加销售项
                  </a-button>
                </a-space>
                <a-space>
                  <span class="tit">ECL采购项金额：{{ eclPurchaseItemsCount }} 欧元</span>
                  <a-button
                    @click="
                      eclModal = 2;
                      eclVisible = !eclVisible;
                    "
                    style="height: 32px"
                  >
                    <AliIcon type="tianxie" :size="15" /> 添加采购项
                  </a-button>
                </a-space>
              </div>
              <!-- <a-radio-group name="radioGroup" v-model="form.ecl">
              <a-radio :value="true">是</a-radio>
              <a-radio :value="false">否</a-radio>
              <div class="uploadbox" v-show="form.ecl">
                <div class="ksy-mt-2">
                  <span class="ksy-ib ksy-w200">ECL销售项金额:123</span> <a-button>添加销售项</a-button>
                </div>
                <div class="ksy-mt-2">
                  <span class="ksy-ib ksy-w200">ECL采购项金额:123</span> <a-button>添加采购项</a-button>
                </div>
              </div>
            </a-radio-group> -->
            </a-form-model-item>
            <div
              class="line ksy-mb-4 ksy-mt-4"
              v-if="form.countryCode !== 'AE' && form.countryCode !== 'SA' && form.countryCode !== 'GB'"
            ></div>
            <a-form-model-item
              label="OSS税号"
              prop="oss"
              v-if="form.countryCode !== 'AE' && form.countryCode !== 'SA' && form.countryCode !== 'GB'"
            >
              <span v-for="oss in OssOption" :key="oss.value">
                <a-checkable-tag :checked="oss.value === form.oss" @change="(checked) => ossChange(oss, checked)">
                  {{ oss.label }}
                </a-checkable-tag>
              </span>
            </a-form-model-item>
            <a-form-model-item
              label="IOSS税号"
              prop="ioss"
              v-if="form.countryCode !== 'AE' && form.countryCode !== 'SA' && form.countryCode !== 'GB'"
            >
              <span v-for="ioss in IossOption" :key="ioss.value">
                <a-checkable-tag :checked="ioss.value === form.ioss" @change="(checked) => iossChange(ioss, checked)">
                  {{ ioss.label }}
                </a-checkable-tag>
              </span>
            </a-form-model-item>
            <div class="line ksy-mb-4 ksy-mt-4" v-show="form.countryCode === 'DE'"></div>
            <!-- 欧盟选项，只有德国才有 -->
            <div v-show="form.countryCode === 'DE'">
              <a-form-model-item :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" label="欧盟内免税收购项金额">
                <a-input
                  class="ksy-w320"
                  v-model="europeanItem.ecAcqPrice"
                  placeholder="请输入"
                  v-enterIntNumber
                  :suffix="countryIcon"
                />
              </a-form-model-item>
              <a-form-model-item :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" label="欧盟内免税收购项文件">
                <div style="display: inline-grid" class="uploadbox">
                  <a-upload
                    :action="uplodPath"
                    @change="(value) => handleChange(value, 'europeanItem', 'ecAcqFilePath', 'europeanFileList1')"
                    :data="{ prefix: '' }"
                    :file-list="europeanFileList1"
                    accept=".jpg,jpeg,.png,.gif,.rar,.zip,.pdf"
                  >
                    <a-button> <a-icon type="upload" /> 上传文件 </a-button>
                  </a-upload>
                  <span class="tips">请上传应税19%的欧盟内收购（递延清关），支持JPG、JPEG、PNG、压缩包</span>
                </div>
              </a-form-model-item>
              <a-form-model-item :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" label="欧盟内免税收购项金额">
                <a-input
                  class="ksy-w320"
                  v-model="europeanItem.freePurchasePrice"
                  placeholder="请输入"
                  v-enterIntNumber
                  :suffix="countryIcon"
                />
              </a-form-model-item>
              <a-form-model-item :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" label="欧盟内免税收购项文件">
                <div style="display: inline-grid" class="uploadbox">
                  <a-upload
                    :action="uplodPath"
                    @change="(value) => handleChange(value, 'europeanItem', 'freePurchaseFile', 'europeanFileList2')"
                    :data="{ prefix: '' }"
                    :file-list="europeanFileList2"
                    accept=".jpg,jpeg,.png,.gif,.rar,.zip,.pdf"
                  >
                    <a-button> <a-icon type="upload" /> 上传文件 </a-button>
                  </a-upload>
                  <span class="tips">支持JPG、JPEG、PNG、压缩包</span>
                </div>
              </a-form-model-item>
            </div>
            <div class="line ksy-mt-4 ksy-mb-2"></div>
            <a-form-model-item label="抵扣项">
              <template slot="extra"> 如有抵扣项，可进行上传 </template>
              <DeductionItem
                ref="deductionItem"
                @retrunItems="retrunItems"
                :countryCode="form.countryCode"
                :countryIcon="countryIcon"
              />
            </a-form-model-item>
          </a-form-model>
        </a-spin>
      </div>
    </div>
    <div class="computed bottombtn">
      <div class="">
        <a-form-model :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" labelAlign="left">
          <a-form-model-item label=" ">
            <div class="content ksy-mt-3">
              <a-button
                type="primary"
                class="ksy-mr-2"
                @click="onSubmit"
                :loading="submiting"
                v-sensorsDire="{
                  type: 'ClickAccounTax',
                  event: 'click',
                  getParams: () => ({
                    tax_rate_country: form.countryNameZh,
                    tax_return_cycle: form.selectSeason,
                    VAT_registration_country: this.getCountryByCode,
                    sales_document: 'Amazon',
                  }),
                }"
                >核算税金</a-button
              >
              <a-button @click="resetForm">重置</a-button>
            </div>
          </a-form-model-item>
        </a-form-model>

        <!-- <a-button @click="resultVisible = !resultVisible">结果</a-button> -->
      </div>
    </div>
    <!-- 销售额文件-其他弹窗 -->
    <a-modal :visible="otherVisible" @cancel="handleCancel" :maskClosable="false" :footer="null" width="540px">
      <OtherPlat
        @getOtherData="getOtherData"
        :countryCode="form.countryCode"
        :countryIcon="countryIcon"
        ref="otherPlat"
      />
    </a-modal>
    <!-- 核算税金结果 弹窗 -->
    <a-modal
      :visible="resultVisible"
      @cancel="resultVisible = false"
      :maskClosable="false"
      :footer="null"
      width="980px"
      :destroyOnClose="true"
    >
      <ResultDemo
        :resultData="resultData"
        :formData="form"
        :countryCode="form.countryCode"
        @closeResult="closeResult"
      />
    </a-modal>

    <!-- 如何获取 店铺销售文件 -->
    <a-modal :visible="downloadVisible" @cancel="downloadVisible = false" :footer="null" width="600px">
      <img src="~/assets/images/downloadsaledata.png" class="downppng" alt="如何获取" />
    </a-modal>

    <!-- ecl相关选项 -->

    <a-modal
      :visible="eclVisible"
      @cancel="eclVisible = false"
      :footer="null"
      :destroyOnClose="true"
      :maskClosable="false"
      width="550px"
    >
      <SalesItem
        :eclModal="eclModal"
        @retrunElcItems="retrunElcItems"
        :eclSaleItems="eclSaleItems"
        :eclPurchaseItems="eclPurchaseItems"
      />
    </a-modal>
    <FooterTemp v-if="footerList && footerList.length" :list="footerList" :webInfo="webInfo" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { divide } from "lodash";
import common from "@/apis/common";
import OtherPlat from "../components/computed/OtherPlat.vue";
import ResultDemo from "../components/computed/ResultDemo.vue";
import aboutComputed from "@/apis/aboutComputed";
import aboutComputedMix from "@/mixins/about-computed";

export default {
  head() {
    return {
      title: `VAT申报_一键算税_${process.env.NODE_PLA === "kby" ? "跨标云" : "跨税云"}`,
      meta: [
        {
          hid: "description",
          name: "description",
          content: `${
            process.env.NODE_PLA === "kby" ? "跨标云" : "跨税云"
          }-英德税局官方认证VAT智能申报平台,卖家可自主进行VAT精准算税，一键申报，秒下回执;推动跨境电商税务合规化、标准化、智能化。`,
        },
        {
          hid: "keywords",
          name: "keywords",
          content: "VAT申报,VAT算税,VAT算税工具",
        },
      ],
    };
  },
  mixins: [aboutComputedMix],
  async asyncData(context) {
    try {
      // CalculateTaxes_top_banner CalculateTaxes_middle_banner
      let [{ data: webInfo }, { data: bigBanner }, { data: middleBanner }, { data: navList }, { data: footerList }] =
        await Promise.all([
          context.$axiosApi(common.getWebsitInfo.url, common.getWebsitInfo.methods),
          context.$axiosApi(common.getAdByAdPositionKey.url, common.getAdByAdPositionKey.methods, {
            adKey: "CalculateTaxes_top_banner",
          }),
          context.$axiosApi(common.getAdByAdPositionKey.url, common.getAdByAdPositionKey.methods, {
            adKey: "CalculateTaxes_middle_banner",
          }),
          context.$axiosApi(common.newslist.url, common.newslist.methods),
          context.$axiosApi(common.getPartnerList.url, common.getPartnerList.methods, { linkType: 0 }),
        ]);
      return {
        webInfo, // 网站信息
        bigBanner: bigBanner, // 顶部banner
        middleBanner: middleBanner, // 腰部banner
        navList: Array.isArray(navList) ? navList : [], // 导航列表
        footerList: Array.isArray(footerList) ? footerList.slice(0, 32) : [], // 导航列表
      };
    } catch (error) {
      console.log(error);
      return {
        bigBanner: [], // 顶部banner
        middleBanner: [], // 腰部banner
      };
    }
  },
  data() {
    return {
      // country,
      logtip: false,
      spinning: false,
      countryList: [], // 所有国家数据动态
      vatCount: ["AT", "CY", "CZ", "DE", "ES", "EU", "FR", "GB", "IT", "NL", "PL", "SE"], // 所有有vat选项的国家code 欧盟国家
      declareList: [], // 报税周期待选项，根据国家选择，动态
      taxList: [], // 每个国家的待选税率
      rules: {
        countryNameZh: [{ required: true, message: "请选择国家", trigger: "blur" }],
        taxRate: [{ required: true, message: "请选择税率", trigger: "blur" }],
        periodType: [{ required: true, message: "请选择报税周期", trigger: "blur" }],
        oss: [{ required: true, message: "请选择OSS税号", trigger: "blur" }],
        ioss: [{ required: true, message: "请选择IOSS税号", trigger: "blur" }],
        ecl: [{ required: true, message: "请选择ecl", trigger: "blur" }],
        salePlatformType: [
          { required: true, message: "请选择平台", trigger: "blur" },
          { validator: this.checkSalesFile },
        ],
      },
      europeanFileList1: [],
      europeanFileList2: [],
      form: {},
      // 销售额文件-其他平台 数据从form剥离
      otherPlat: {
        handIncludeTaxSales: null, // 其他平台-含税销售额
        handIncludeTaxSalesFilePath: "", // 其他平台-销售文件路径
        handPlatformWithHoldandRemitTax: null, // 其他平台-代扣代缴金额  沙特 阿联酋的时候，没这个值
      },
      // 欧盟相关选项
      europeanItem: {
        ecAcqPrice: null,
        ecAcqFilePath: "",
        freePurchasePrice: null,
        freePurchaseFile: "",
      },
      taxDeductionDtos: [], // 抵扣项，可加减数量
      submiting: false,
      tfnCountryCode: [
        { label: "英国", value: "GB" },
        { label: "德国", value: "DE" },
        { label: "法国", value: "FR" },
        { label: "意大利", value: "IT" },
        { label: "西班牙", value: "ES" },
        { label: "捷克", value: "CZ" },
        { label: "波兰", value: "PL" },
        { label: "荷兰", value: "NL" },
        { label: "奥地利", value: "AT" },
      ],
      OssOption: [
        { label: "有OSS税号", value: true },
        { label: "无OSS税号", value: false },
      ],
      IossOption: [
        { label: "有IOSS税号", value: true },
        { label: "无IOSS税号", value: false },
      ],
      saleOption: [
        { label: "Amazon", value: 1 },
        { label: "其他平台", value: 2 },
      ],
      eclOption: [
        { label: "是", value: true },
        { label: "否", value: false },
      ],
      vatDisableCountry: "",
      otherVisible: false, // 其他销售额文件 modal
      resultVisible: false, // 税金计算结果 modal
      downloadVisible: false,
      resultData: {}, // 计算结果

      eclVisible: false,
      eclSaleItems: [], // ecl销售项金额 {taxNumber: "111", taxAmt: 222}...
      eclPurchaseItems: [], // ECL采购项金额 {taxNumber: "111", taxAmt: 222}...
      eclSaleItemsCount: 0,
      eclPurchaseItemsCount: 0, // ecl 相关计算总和
      eclModal: 1, // 1销售项弹窗，2采购项弹窗
    };
  },
  computed: {
    ...mapState({
      isLogined: (state) => state.isLogined,
    }),
    countryIcon() {
      // 沙特阿拉伯：SR
      // 阿联酋：AED
      // 波兰：PLN
      // 英国：GBP
      // 捷克：CZK
      var icon = "";
      switch (this.form.countryCode) {
        case "SA":
          icon = "SAR";
          break;
        case "AE":
          icon = "AED";
          break;
        case "PL":
          icon = "zł";
          break;
        case "GB":
          icon = "GBP";
          break;
        case "CZ":
          icon = "CZK";
          break;

        default:
          icon = "EUR";
          break;
      }
      return icon;
    },
  },
  async mounted() {
    await this.getAllCountry();
    await this.setInitInfo();
  },
  methods: {
    async getAllCountry() {
      let { code, data, message } = await this.$axiosApi(
        common.getAllCountry.url,
        common.getAllCountry.methods,
        null,
        true
      );
      if (code === 0) {
        this.countryList = data;
      } else {
        this.$message.warning(message);
      }
    },
    async setInitInfo() {
      // this.form = {
      //   ...this.initForm,
      // };
      let firstItem = this.countryList[0];
      this.form = Object.assign({}, firstItem);
      // 根据code查报税周期
      this.getDeclareByCode();
      // this.$set(this.form, "season", firstItem.season);
      // this.$set(this.form, "selectSeason", firstItem.season[0]);
      // this.$set(this.form, "periodType", 1);

      this.$set(this.form, "oss", true);
      this.$set(this.form, "ioss", true);
      this.$set(this.form, "salePlatformType", 1);
      this.getTaxList();
      // this.$set(this.form, "ecl", true);
    },
    // 根据国家code获取报税周期
    async getDeclareByCode() {
      this.declareList = [];
      let res = await this.$axiosApi(common.getCycle.url, common.getCycle.methods, {
        countryCode: this.form.countryCode,
      });
      if (res.code === 0) {
        if (res.data.monthPeriod === 0) this.declareList.push({ type: "月报", status: "0" });
        if (res.data.quarterPeriod === 0) this.declareList.push({ type: "季报", status: "1" });
        if (res.data.yearPeriod === 0) this.declareList.push({ type: "年报", status: "2" });
        if (this.declareList.length) {
          this.$set(this.form, "selectSeason", this.declareList[0].type);
          this.$set(this.form, "periodType", this.declareList[0].status);
        }
      } else {
        this.$message.warning(res.message);
      }
    },
    // 根据当前国家的declareTax，抽出税率可选项
    getTaxList() {
      if (this.form.declareTax !== "") {
        this.taxList = this.form.declareTax.split(",");
        this.$set(this.form, "taxRate", this.taxList[0]);
      } else {
        this.taxList = [];
        this.$set(this.form, "taxRate", 0);
      }
    },
    async countryChange(tag, checked) {
      let file = this.form.filePath;
      this.form = tag;
      this.spinning = true;
      await this.getDeclareByCode();
      this.spinning = false;

      if (this.declareList.length) {
        this.$set(this.form, "selectSeason", this.declareList[0].type);
        this.$set(this.form, "periodType", this.declareList[0].status);
      } else {
        this.$set(this.form, "selectSeason", "");
        this.$set(this.form, "periodType", "");
      }
      let code = this.tfnCountryCode.filter((ele) => ele.label === tag.countryNameZh);
      this.vatDisableCountry = code.length ? code[0].value : "";
      this.$set(this.form, "tfnCountryCode", [this.vatDisableCountry]);
      // 切换国家，清空抵扣项目
      this.$refs.deductionItem.resetItems();
      // 固定亚马逊
      this.$set(this.form, "salePlatformType", 1);
      this.$set(this.form, "filePath", file);
      this.$set(this.form, "ecl", true);
      this.getTaxList();
      this.$set(this.form, "oss", true);
      this.$set(this.form, "ioss", true);
    },
    taxChange(item, checked) {
      this.$set(this.form, "taxRate", item);
    },
    seasonChange(item, checked) {
      console.log(item, checked);
      this.$set(this.form, "periodType", item.status);
      this.$set(this.form, "selectSeason", item.type);
    },
    eclChange(item, checked) {
      this.$set(this.form, "ecl", item.value);
    },
    // 国家 报税周期 更改，调整申报周期类型
    // changePeriod(item) {
    //   if (item === "月报") {
    //     this.$set(this.form, "periodType", 0);
    //   } else if (item === "季报") {
    //     this.$set(this.form, "periodType", 1);
    //   } else {
    //     this.$set(this.form, "periodType", 2);
    //   }
    // },
    ossChange(item, checked) {
      this.$set(this.form, "oss", item.value);
    },
    iossChange(item, checked) {
      this.$set(this.form, "ioss", item.value);
    },
    onVatChange(e) {
      console.log(e);
    },
    retrunItems(data) {
      this.$set(this.form, "discountItem", data);
      // console.log(data)
    },
    // 销售额文件-其他 数据获取
    getOtherData(data) {
      console.log(data);
      Object.keys(this.otherPlat).map((key, item) => {
        this.otherPlat[key] = data[key];
      });
      this.otherVisible = false;
    },
    handleOk() {},
    handleCancel() {
      this.otherVisible = false;
    },
    // 获取ecl相关数据array
    retrunElcItems(data) {
      console.log(data);
      // eclModal 1销售项，2采购项
      let { eclModal, count, items, close } = data;
      if (close) {
        this.eclVisible = false;
        return;
      }

      if (eclModal === 1) {
        this.eclSaleItemsCount = count;
        this.eclSaleItems = items;
      } else {
        this.eclPurchaseItemsCount = count;
        this.eclPurchaseItems = items;
      }
      this.eclVisible = false;
    },
    // 销售额文件校验
    checkSalesFile(rule, value, callback) {
      //
      let { form, otherPlat } = this.$data;
      if (!form.salePlatformType || form.salePlatformType.length === 0) {
        callback("至少填写一项");
      }
      // 勾选亚马逊，要上传亚马逊文件
      if (form.salePlatformType === 1 && (!form.filePath || form.filePath === "")) {
        callback("请上传亚马逊文件");
      }

      callback();
    },
    // 根据勾选的vat国家code，给神策，国家名称 array
    getCountryByCode() {
      let { tfnCountryCode, form } = this.$data;
      let countryCode = form.tfnCountryCode || [];
      let country = [];
      countryCode.map((ele) => {
        let name = tfnCountryCode.filter((item) => item.value === ele);
        if (name.length) {
          country.push(name[0].label);
        }
      });
      return country;
    },
    onSubmit() {
      // let today = moment(new Date()).format("YYYY-MM-DD");
      // let todayCount = Cookies.get(today);
      // if (todayCount) {
      //   this.logtip = true;
      //   window.scrollTo({
      //     top: 0,
      //   });
      //   return false;
      // }
      const iscomputed = window.localStorage.getItem('iscomputed')
      if(iscomputed) {
        window.open(`${this.$store.state.host.server_url}/computedTax`)
      }else {
        this.$refs.ruleForm.validate(async (valid) => {
          if (valid) {
            this.submiting = true;
            let params = {
              ...this.form,
              ...this.otherPlat, // 其他平台
              ...this.europeanItem, // 欧盟选项
              eclSaleItems: this.eclSaleItems,
              eclPurchaseItems: this.eclPurchaseItems,
            };
            params.taxRate = divide(Number(params.taxRate.replace("%", "")), 100);

            // 西班牙时，添加ecl
            // if(this.form.countryCode==='ES'){}

            let tranArray = [
              "ecAcqPrice",
              "taxAmt",
              "handIncludeTaxSales",
              "handPlatformWithHoldandRemitTax",
              "freePurchasePrice",
            ];
            Object.keys(params).forEach((key) => {
              if (tranArray.includes(key)) {
                params[key] === null ? (params[key] = 0) : (params[key] = Number(params[key]));
              }
            });

            if (this.form.countryCode === "AE" || this.form.countryCode === "SA") {
              params.handPlatformWithHoldandRemitTax = 0;
            }

            try {
              let { code, data, message } = await this.$axiosApi(
                aboutComputed.getCaluTax.url,
                aboutComputed.getCaluTax.methods,
                params
              );
              if (code === 0) {
                this.resultData = data;
                this.resultVisible = true;
                // 成功后记录次数
                window.localStorage.setItem('iscomputed', true)
                // if (!todayCount) {
                //   Cookies.set(today, 1);
                // }
              } else {
                this.$message.warning(message);
              }
              this.submiting = false;
            } catch (error) {
              console.log(error);
              this.$message.warning("系统繁忙请重试");
              this.submiting = false;
            }
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    resetForm() {
      // this.$refs.ruleForm.resetFields();
      this.setInitInfo();
      this.europeanItem = {
        ecAcqPrice: null,
        ecAcqFilePath: null,
        freePurchasePrice: null,
        freePurchaseFile: null,
      };
      this.$refs.deductionItem.resetItems();
      this.eclSaleItems = [];
      this.eclPurchaseItems = [];
      this.defaultFileList = [];
      this.otherPlat = {
        handIncludeTaxSales: null,
        handIncludeTaxSalesFilePath: "",
        handPlatformWithHoldandRemitTax: null,
      };
      this.$refs.otherPlat.resetForm();
    },
    closeResult() {
      this.resultVisible = false;
    },
    handleClickLink(link = "login") {
      const host = `${this.$store.state.host.server_url}/${link}`;
      window.open(host);
    },
  },
  components: { OtherPlat, ResultDemo },
};
</script>

<style lang="less" scoped>
.computed {
  background: #fff;
  // padding-top: 20px;
  .content {
    margin: 0 auto;
  }
}
.eclbox {
  width: 422px;
  height: 120px;
  background: #f6f7f9;
  border-radius: 2px 2px 2px 2px;
  margin-bottom: 20px;
  padding-top: 20px;
  padding-left: 23px;
}
.bottombtn {
  height: 72px;
  line-height: 72px;
  background: #ffffff;
  box-shadow: 0px -2px 6px 1px rgba(0, 0, 0, 0.06);
}

.ant-form-item {
  margin-bottom: 1px;
}
.line {
  height: 1px;
  border-bottom: 1px solid #e3e3e3;
}

.uploadbox {
  .ant-btn {
    color: @primaryColor;
    border-color: @primaryColor;
  }
  .tips {
    color: @textColor6;
  }
}
.ksy-w320 {
  width: 320px;
}
.datalink {
  color: @textColor6;
  cursor: pointer;
}
.downppng {
  max-width: 550px;
}
.logtip {
  width: 100%;
  height: 48px;
  background: #fef3e6;
  border-radius: 0px 0px 0px 0px;
  line-height: 48px;
  color: @textColor;
}
</style>

<style lang="less">
.computed {
  .ant-upload-list-item-card-actions {
    right: -7px;
  }
}
</style>
