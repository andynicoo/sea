<template>
  <div class="list white-tips" ref="page">
    <a-spin :spinning="loading">
      <template v-if="tradeList.length">
      <div class="item flex-b" v-for="item in tradeList" :key="item.id">
        <div class="img-wrap">
          <!-- <img v-lazy="item.ossImageUrl" :alt="item.similarRemark" v-if="item.ossImageUrl" /> -->
          <template v-if="item.ossImageUrl">
            <a-popover :title="null" placement="bottom" trigger="click">
              <template slot="content">
                <img :src="item.ossImageUrl" style="width: 200px" />
              </template>
              <img v-lazy="item.ossImageUrl" :alt="item.similarRemark" class="hand" />
            </a-popover>
          </template>
          <div v-else class="titbox">
            <div class="inner">
              {{ item.similarRemark }}
            </div>
          </div>
        </div>
        <div class="bigbox flex1">
          <div class="newitem">
            <div class="flex flex-c-b" style="margin-bottom: 16px">
              <h3 :title="item.similarRemark" class="flex1 flex flex-c">
                <span class="tit">
                  <span v-html="changeTit(item.similarRemark)"></span>
                </span>
                <a-tooltip v-if="item.oneStatusName" :getPopupContainer="() => $refs.page">
                  <template slot="title">
                    <a
                      :href="
                        '/trademarkdetails?countryCode=' +
                        item.resultOrigin +
                        '&id=' +
                        item.remarkNumber +
                        '&anchor=box7'
                      "
                      target="_blank"
                      >查看商标状态文件</a
                    ></template
                  >
                  <div class="tag s1">{{ item.oneStatusName }}</div>
                </a-tooltip>
                <a-tooltip :getPopupContainer="() => $refs.page">
                  <template slot="title">
                    <a :href="`https://www.amazon.com/s?k=${item.similarRemark}&language=en_US`" target="_blank"
                      >亚马逊搜索</a
                    >
                  </template>
                  <a :href="`https://www.amazon.com/s?k=${item.similarRemark}&language=en_US`" target="_blank">
                    <img src="~/assets/images/kby/amazon.svg" class="sicon" />
                  </a>
                </a-tooltip>
                <a-tooltip :getPopupContainer="() => $refs.page">
                  <template slot="title">
                    <a :href="`https://www.whois.com/whois/${item.similarRemark}.com`" target="_blank">whois查域名</a>
                  </template>
                  <a :href="`https://www.whois.com/whois/${item.similarRemark}.com`" target="_blank">
                    <img src="~/assets/images/kby/whois.svg" class="sicon" />
                  </a>
                </a-tooltip>
              </h3>
              <!-- 暂时隐藏其他国家注册状态 -->
              <!-- <div class="view-status" @mouseenter="getTrademarksCountryStatus(item)">
                <a-tooltip :getPopupContainer="() => $refs.page" :overlayStyle="{ 'max-width': '560px' }">
                  <template slot="title">
                    <div class="view-status-box">
                      <div class="view-status-title">其他国家注册状态</div>
                      <div class="view-status-text">
                        商标：{{ item.allSimilarRemark }} ； {{ item.trademarkCategoryList[0]?.categoryNum }}类
                        {{ item.trademarkCategoryList[0]?.categoryName }} ；
                      </div>
                      <div>
                        <dl v-for="(oVal, oKey) in otherCountryStatus" :key="oKey" class="flex flex-c">
                          <dt>{{ oKey }}</dt>
                          <dd>
                            <span v-for="(oi, oIndex) in oVal" :key="oIndex">{{ oi.counrtyName }}；</span>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </template>
                  <div class="flex flex-c">其他国家注册状态<i class="icon-file"></i></div>
                </a-tooltip>
              </div> -->
            </div>
            <div class="bottom">
              <a-row>
                <template v-if="category === '查商标状态'">
                  <a-col :span="8">
                    <div class="des flex flex-c-b">
                      <span class="des-label">商标状态：</span>
                      <div v-if="item.oneStatusName" class="des-content flex1 ellipsis" style="width: 0">
                        <span
                          v-clipboard:copy="item.oneStatusName"
                          v-clipboard:success="onCopy"
                          v-clipboard:error="onError"
                          class="hoverPrimary"
                          >{{ item.oneStatusName }}</span
                        >
                      </div>
                      <div v-else class="flex1" style="width: 0">--</div>
                    </div>
                  </a-col>
                  <a-col :span="8">
                    <div class="des flex flex-c-b">
                      <span class="des-label">状态日期：</span>
                      <div v-if="item.statusDate" class="des-content flex1 ellipsis" style="width: 0">
                        <span
                          v-clipboard:copy="item.statusDate"
                          v-clipboard:success="onCopy"
                          v-clipboard:error="onError"
                          class="hoverPrimary"
                          >{{ item.statusDate }}</span
                        >
                      </div>
                      <div v-else class="flex1" style="width: 0">--</div>
                    </div>
                  </a-col>
                  <a-col :span="8">
                    <div class="des flex flex-c-b">
                      <span class="des-label">状态文件：</span>
                      <div v-if="item.remarkNumber" class="des-content flex1">
                        <a
                          :href="
                            '/trademarkdetails?countryCode=' + item.resultOrigin + '&id=' + item.remarkNumber + '#box7'
                          "
                          class="ksy-status-primary"
                          target="_blank"
                          >查看</a
                        >
                      </div>

                      <div v-else class="flex1" style="width: 0">--</div>
                    </div>
                  </a-col>
                </template>
                <a-col :span="8">
                  <div class="des flex flex-c-b">
                    <!-- /classificationdetails?categoryId=2 -->
                    <span class="des-label">大类:</span>
                    <div v-if="item.trademarkCategoryList[0]?.['categoryNum']" class="flex1" style="width: 0">
                      <a-tooltip placement="top" :getPopupContainer="() => $refs.page">
                        <template slot="title"
                          ><a
                            @click="toSearchType(item.trademarkCategoryList[0]?.['categoryNum'])"
                            href="javascript:void();"
                            >查询分类</a
                          ></template
                        >
                        <span class="hoverPrimary">
                          {{ item.trademarkCategoryList[0]?.["categoryNum"] }}类
                          <span
                            v-clipboard:copy="item.trademarkCategoryList[0]?.['categoryName']"
                            v-clipboard:success="onCopy"
                            v-clipboard:error="onError"
                            >{{ item.trademarkCategoryList[0]?.["categoryName"] }}</span
                          >
                        </span>
                      </a-tooltip>
                    </div>
                    <div v-else class="flex1" style="width: 0">--</div>
                  </div>
                </a-col>
                <a-col :span="8">
                  <div class="des flex flex-c-b" :title="item.ownerName">
                    <span class="des-label">申请人：</span>
                    <div class="des-content flex1 flex flex-c-b">
                      <a-tooltip v-if="item.organizedFlag" :getPopupContainer="() => $refs.page">
                        <template slot="title">{{ item.organizedZh }}</template>
                        <img
                          v-lazy="item.organizedFlag"
                          :alt="item.organizedZh"
                          v-if="item.organizedFlag"
                          style="width: 24px; height: auto; margin-right: 8px; max-height: 16px"
                        />
                      </a-tooltip>
                      <a-tooltip v-if="item.ownerName" :getPopupContainer="() => $refs.page">
                        <template slot="title"
                          ><nuxt-link
                            :to="{ path: '/fastResult/brandPersonnel', query: { name: item.ownerName } }"
                            target="_blank"
                            >查看申请人所有商标</nuxt-link
                          ></template
                        >
                        <span
                          v-clipboard:copy="item.ownerName"
                          v-clipboard:success="onCopy"
                          v-clipboard:error="onError"
                          class="flex1 ellipsis hoverPrimary"
                          style="width: 0"
                          :style="{ color: category === '查申请人' ? '#FAAD14' : 'inherit' }"
                          >{{ item.ownerName }}</span
                        >
                      </a-tooltip>
                      <div v-else class="flex1" style="width: 0">--</div>
                    </div>
                  </div>
                </a-col>
                <a-col :span="8">
                  <div class="des flex flex-c-b">
                    <span class="des-label">代理律师:</span>
                    <div class="des-content flex1 flex flex-c-b">
                      <a-tooltip v-if="item.attorneyName" :getPopupContainer="() => $refs.page">
                        <template slot="title"
                          ><nuxt-link
                            :to="{ path: '/fastResult/brandLawyer', query: { name: item.attorneyName } }"
                            target="_blank"
                            >查看律师代理所有商标</nuxt-link
                          ></template
                        >
                        <span
                          v-clipboard:copy="item.attorneyName"
                          v-clipboard:success="onCopy"
                          v-clipboard:error="onError"
                          class="flex1 ellipsis hoverPrimary"
                          style="width: 0"
                          :style="{ color: category === '查申请人' ? '#FAAD14' : 'inherit' }"
                          >{{ item.attorneyName }}</span
                        >
                      </a-tooltip>
                      <div v-else class="flex1" style="width: 0">--</div>
                    </div>
                  </div>
                </a-col>
                <template v-if="category === '查申请人'">
                  <a-col :span="8">
                    <div class="des flex flex-c-b">
                      <span style="width: auto" class="des-label">申请人地址：</span>
                      <a-tooltip
                        v-if="item.ownerAddress"
                        :getPopupContainer="() => $refs.page"
                        :overlayStyle="{ 'max-width': '560px' }"
                      >
                        <template slot="title">
                          {{ item.ownerAddress }}
                        </template>
                        <div class="des-content flex1 ellipsis" style="width: 0">{{ item.ownerAddress }}</div>
                      </a-tooltip>
                      <div v-else class="flex1" style="width: 0">--</div>
                    </div>
                  </a-col>
                  <a-col :span="8">
                    <div class="des flex flex-c-b">
                      <span class="des-label">法人类型：</span>
                      <div v-if="item.legalType" class="des-content flex1 ellipsis" style="width: 0">
                        <span
                          v-clipboard:copy="item.legalType"
                          v-clipboard:success="onCopy"
                          v-clipboard:error="onError"
                          class="hoverPrimary"
                          >{{ item.legalType }}</span
                        >
                      </div>
                      <div v-else class="flex1" style="width: 0">--</div>
                    </div>
                  </a-col>
                  <a-col :span="8">
                    <div class="des flex flex-c-b">
                      <span class="des-label">申请地区：</span>
                      <div v-if="item.organizedZh" class="des-content flex1 ellipsis" style="width: 0">
                        <span
                          v-clipboard:copy="item.organizedZh"
                          v-clipboard:success="onCopy"
                          v-clipboard:error="onError"
                          class="hoverPrimary flex1"
                          >{{ item.organizedZh }}</span
                        >
                      </div>
                      <div v-else class="flex1" style="width: 0">--</div>
                    </div>
                  </a-col>
                </template>
                <template v-if="category === '查代理律师'">
                  <a-col :span="8">
                    <div class="des flex flex-c-b">
                      <span class="des-label">案卷编号：</span>
                      <div v-if="item.attorneyNumber" class="des-content flex1 ellipsis" style="width: 0">
                        <span
                          v-clipboard:copy="item.attorneyNumber"
                          v-clipboard:success="onCopy"
                          v-clipboard:error="onError"
                          class="hoverPrimary"
                          >{{ item.attorneyNumber }}</span
                        >
                      </div>
                      <div v-else class="flex1" style="width: 0">--</div>
                    </div>
                  </a-col>
                  <a-col :span="8">
                    <div class="des flex flex-c-b">
                      <span class="des-label">律师邮箱：</span>
                      <a-tooltip
                        v-if="item.attorneyEmail"
                        :getPopupContainer="() => $refs.page"
                        :overlayStyle="{ 'max-width': '560px' }"
                      >
                        <template slot="title">
                          {{ item.attorneyEmail }}
                        </template>
                        <div class="des-content flex1 ellipsis" style="width: 0">{{ item.attorneyEmail }}</div>
                      </a-tooltip>
                      <div v-else class="flex1" style="width: 0">--</div>
                    </div>
                  </a-col>
                  <a-col :span="8">
                    <div class="des flex flex-c-b">
                      <span class="des-label">联系电话：</span>
                      <div v-if="item.phone" class="des-content flex1 ellipsis" style="width: 0">
                        <span
                          v-clipboard:copy="item.phone"
                          v-clipboard:success="onCopy"
                          v-clipboard:error="onError"
                          class="hoverPrimary"
                          >{{ item.phone }}</span
                        >
                      </div>
                      <div v-else class="flex1" style="width: 0">--</div>
                    </div>
                  </a-col>
                  <a-col :span="24">
                    <div class="des flex flex-s-b">
                      <span class="des-label">联系方式：</span>
                      <a-tooltip
                        v-if="item.correspondentName"
                        :getPopupContainer="() => $refs.page"
                        :overlayStyle="{ 'max-width': '560px' }"
                      >
                        <template slot="title">
                          {{ item.correspondentName }}
                        </template>
                        <div class="des-content flex1 ellipsis" style="width: 0">{{ item.correspondentName }}</div>
                      </a-tooltip>
                      <div v-else class="flex1" style="width: 0">--</div>
                    </div>
                  </a-col>
                </template>
                <a-col :span="8">
                  <div class="des flex flex-c-b">
                    <span class="des-label">申请号:</span>
                    <div v-if="item.remarkNumber" class="des-content flex1 ellipsis" style="width: 0">
                      <span
                        v-clipboard:copy="item.remarkNumber"
                        v-clipboard:success="onCopy"
                        v-clipboard:error="onError"
                        class="hoverPrimary"
                        >{{ item.remarkNumber }}</span
                      >
                    </div>
                    <div v-else class="flex1" style="width: 0">--</div>
                  </div>
                </a-col>
                <a-col :span="16">
                  <div class="des flex flex-c-b">
                    <span class="des-label">申请日期:</span>
                    <div v-if="item.applyDate" class="des-content flex1 ellipsis" style="width: 0">
                      <span
                        v-clipboard:copy="item.applyDate"
                        v-clipboard:success="onCopy"
                        v-clipboard:error="onError"
                        class="hoverPrimary"
                        >{{ item.applyDate }}</span
                      >
                    </div>
                    <div v-else class="flex1" style="width: 0">--</div>
                  </div>
                </a-col>
                <a-col :span="8">
                  <div class="des flex flex-c-b">
                    <span class="des-label">注册号:</span>
                    <div v-if="item.registrationNumber" class="des-content flex1 ellipsis" style="width: 0">
                      <span
                        v-clipboard:copy="item.registrationNumber"
                        v-clipboard:success="onCopy"
                        v-clipboard:error="onError"
                        class="hoverPrimary"
                        >{{ item.registrationNumber }}</span
                      >
                    </div>
                    <div v-else class="flex1" style="width: 0">--</div>
                  </div>
                </a-col>
                <a-col :span="16">
                  <div class="des flex flex-c-b">
                    <span class="des-label">注册日期:</span>
                    <div v-if="item.registrationDate" class="des-content flex1 ellipsis" style="width: 0">
                      <span
                        v-clipboard:copy="item.registrationDate"
                        v-clipboard:success="onCopy"
                        v-clipboard:error="onError"
                        class="hoverPrimary"
                        >{{ item.registrationDate }}</span
                      >
                    </div>
                    <div v-else class="flex1" style="width: 0">--</div>
                  </div>
                </a-col>

                <a-col v-if="category === '查使用证据'" :span="24">
                  <div class="des flex flex-c-b">
                    <span class="des-label" style="width: auto">使用证据/注册文件：</span>
                    <a
                      v-if="item.evidenceFile"
                      :href="item.evidenceFile"
                      class="des-content flex1 ellipsis"
                      style="width: 0"
                      target="_blank"
                      >{{ item.evidenceFile }}</a
                    >
                    <div v-else class="flex1" style="width: 0">--</div>
                  </div>
                </a-col>
                <a-col :span="24" v-if="item.remarkSmallCategory">
                  <div @mouseenter="viewTranslate(item)" class="des flex flex-c-b">
                    <span class="des-label">小类:</span>
                    <a-tooltip
                      v-if="item.remarkSmallCategory.length"
                      :getPopupContainer="() => $refs.page"
                      :overlayStyle="{ 'max-width': '560px' }"
                    >
                      <template slot="title">
                        <div class="translate-box">
                          <div class="translate-box-top">{{ item.remarkSmallCategory.join("，") }}</div>
                          <div class="translate-box-bottom">
                            参考翻译：<span v-for="(trans, tIndex) in translateArr" :key="tIndex">{{
                              tIndex === translateArr.length - 1 ? trans.val : trans.val + "；"
                            }}</span>
                          </div>
                        </div>
                      </template>
                      <div class="des-content flex1 ellipsis" style="width: 0">
                        {{ item.remarkSmallCategory.join("，") }}
                      </div>
                    </a-tooltip>
                    <div v-else class="des-content flex1">--</div>
                  </div>
                </a-col>
                <template v-if="category === '查宣誓时间'">
                  <a-col :span="8">
                    <div class="des flex flex-s-b">
                      <span class="des-label">宣誓日期：</span>
                      <div v-if="item.remarkSwornDate" class="des-content flex1 ellipsis" style="width: 0">
                        <span
                          v-if="item.remarkSwornDate"
                          v-clipboard:copy="item.remarkSwornDate"
                          v-clipboard:success="onCopy"
                          v-clipboard:error="onError"
                          class="hoverPrimary"
                          >{{ item.remarkSwornDate }}</span
                        >
                      </div>
                      <div v-else class="flex1" style="width: 0">--</div>
                    </div>
                  </a-col>
                  <a-col :span="16">
                    <div class="des flex flex-s-b">
                      <span class="des-label" style="width: auto">额外付费宣誓日期：</span>
                      <div v-if="item.remarkPaySwornDate" class="des-content flex1 ellipsis" style="width: 0">
                        <span
                          v-if="item.remarkPaySwornDate"
                          v-clipboard:copy="item.remarkPaySwornDate"
                          v-clipboard:success="onCopy"
                          v-clipboard:error="onError"
                          class="hoverPrimary"
                          >{{ item.remarkPaySwornDate }}</span
                        >
                      </div>
                      <div v-else class="flex1" style="width: 0">--</div>
                    </div>
                  </a-col>
                </template>
              </a-row>
            </div>
          </div>
          <div class="btn">
            <a-tooltip>
              <template slot="title"> 监测后，可在我的商标监测查看商标动态 </template>
              <a-button
                :loading="item.loading"
                @click="changeMonit(item)"
                :class="{ primary0: item.monitStatus === 0, primary1: item.monitStatus === 1 }"
              >
                <span v-if="item.monitStatus === 0">监测商标</span>
                <span v-if="item.monitStatus === 1">取消监测</span>
              </a-button>
            </a-tooltip>
            <a
              :href="'/trademarkdetails?countryCode=' + item.resultOrigin + '&id=' + item.remarkNumber + '&anchor=box1'"
              target="_blank"
            >
              <a-button type="link" class="ksy-mt-2" style="color: #3a7fff">查看详情</a-button>
            </a>
          </div>
        </div>
      </div>
      </template>
      <div v-else class="trademarklist-nodata">
        <NoData :type="type" v-if="loading !== null"></NoData>
      </div>
    </a-spin>
  </div>
</template>

<script>
import trademark from "@/apis/trademark";
import Cookie from "js-cookie";

export default {
  data() {
    return {
      spinning: false,
      newList: [],
      translateArr: [],
      otherCountryStatus: {},
      category: Cookie.get("category") || "",
    };
  },
  props: {
    tradeList: {
      type: Array,
      default: () => {},
    },
    cruTrade: {
      type: String,
      default: "",
    },
    loading: {
      type: Boolean,
    },
    type: {
      type: Number
    }
  },
  methods: {
    // 查分类
    toSearchType(id) {
      Cookie.remove("trade");
      const host = window.location.origin + "/classificationdetails?categoryId=" + id;
      window.open(host);
    },
    onCopy: function (e) {
      this.$message.success("复制成功");
    },
    onError: function (e) {
      this.$message.error("复制失败");
    },
    // 跳转详情文书位置box7
    toDetailFile(item) {
      console.log("box7", item);
    },
    // 商标查询其他国家注册状态 getTrademarksCountryStatus
    async getTrademarksCountryStatus(item) {
      const { trademarkCategoryList: list, similarRemark } = item;
      if (list.length) {
        const params = {
          resultClassNum: list[0]?.categoryNum,
          similarRemark,
        };
        const res = await this.$axiosApi(
          trademark.getTrademarksCountryStatus.url,
          trademark.getTrademarksCountryStatus.methods,
          params
        );
        if (res.code === 0 && res.data.length) {
          let arr = null;
          let temp = {
            已注册: [],
            未注册: [],
          };
          this.otherCountryStatus = res.data.reduce((prev, cur) => {
            if (Object.keys(cur.remarkResultInfoVO).length) {
              temp["已注册"].push(cur);
            } else {
              temp["未注册"].push(cur);
            }
            prev = temp;
            return prev;
          }, {});
        }
      }
    },
    // 查看小类翻译
    async viewTranslate(item) {
      const translateArr = [];
      const { holderCountry: countryCode, remarkSmallCategory: categoryNames } = item;
      const params = { countryCode, categoryNames, status: 1 };
      const res = await this.$axiosApi(trademark.getTranslationText.url, trademark.getTranslationText.methods, params);
      if (res.code === 0) {
        if (res.data.length > 0) {
          categoryNames.forEach((v) => {
            let temp = {
              key: v,
              val: "",
            };
            const cur = res.data.filter((tras) => tras.categoryNameEn.toLowerCase() === v.toLowerCase());
            if (cur.length) {
              temp.val = cur[0]?.categoryName;
              translateArr.push(temp);
            }
          });
          this.translateArr = translateArr.filter((trans) => trans.val);
        } else {
          this.translateArr = [];
        }
      }
    },
    async changeMonit(item) {
      let data = {
        countryCode: item.resultOrigin,
        remarkNumber: item.remarkNumber,
        trademarkCategoryNum: item.resultClassNum[0],
        action: item.monitStatus,
      };
      this.$set(item, "loading", true);
      let res = await this.$axiosApi(trademark.monitTrademark.url, trademark.monitTrademark.methods, data, true);
      this.$set(item, "loading", false);
      if (res.code === 0) {
        this.$set(item, "monitStatus", item.monitStatus === 0 ? 1 : 0);
      } else {
        // this.$message.error(res.message)
        const host = `${this.$store.state.host.server_url}/login`;
        localStorage.searchFlag = "trademarkquery";
        window.location = host;
      }
      console.log(res);
    },
    changeTit(tit) {
      if (tit) {
        const reg = new RegExp(this.cruTrade.toUpperCase(), "gi"); // 动态正则表达式
        return tit.replace(reg, `<span class="highttit">${this.cruTrade.toUpperCase()}</span>`); // 使用replace替换
      }
    },
  },
  mounted() {
    this.$bus.$on("changeType", (type) => {
      this.category = type;
    });
  },
  destroyed() {
    //Cookie.remove("trade");
  },
};
</script>

<style lang="less" scoped>
.list {
  width: 100%;
  background: #ffffff;
  padding: 0px 24px;
  .item {
    border-bottom: 1px solid #e3e3e3;
    min-height: 164px;
    padding: 24px 0px;
    display: flex;
    .img-wrap {
      width: 108px;
      height: 108px;
      border-radius: 2px 2px 2px 2px;
      opacity: 1;
      border: 1px solid #d9d9d9;
      .titbox {
        width: 106px;
        height: 106px;
        background: #ffffff;
        border-radius: 0px 0px 0px 0px;
        opacity: 1;
        .inner {
          width: 106px;
          height: 106px;
          border-radius: 0px 0px 0px 0px;
          opacity: 1;
          text-align: center;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          .line-clamp(1);
          line-height: 117px;
        }
      }
      .titbox:hover {
        background: #f8f8f8;
        .inner {
          background: #f8f8f8;
        }
      }
    }
    img {
      width: 106px;
      height: 106px;
      transition: all 0.4s ease 0s;
    }
    .sicon {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
    // &:hover {
    //   img {
    //     transition: all 0.4s ease 0s;
    //     -webkit-transform: scale(1.1);
    //   }
    // }
    .bigbox {
      display: flex;
      width: 0;
      .newitem {
        margin-left: 25px;
        flex: 1;
        // min-width: 690px;
        margin-right: 36px;
        h3 {
          width: 0;
          height: 32px;
          line-height: 32px;
          font-size: 24px;
          font-weight: bold;
          color: @textColor;
          line-height: 32px;
          margin-bottom: 0;
          .tit {
            .line-clamp(1);
            max-width: 76%;
            margin-right: 15px;
          }
          .tag {
            font-size: 12px;
            margin-right: 10px;
            width: 52px;
            border-radius: 3px 3px 3px 3px;
            height: 24px;
            line-height: 24px;
            text-align: center;
          }
          .s1 {
            background: #e3f1ff;
            color: #549bff;
          }
          .s2 {
            background: #fff1f0;
            color: #ff5f61;
          }
          .s3 {
            background: #fef3e6;
            color: @warningColor;
          }
        }
        .view-status {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 8px;
          margin-left: 20px;
          font-size: 12px;
          color: #606266;
          line-height: 20px;
          width: 136px;
          background: linear-gradient(270deg, #f3f5fa 0%, rgba(250, 250, 250, 0) 100%);
          border-radius: 1px;
          i {
            color: @primaryColor;
            margin-left: 8px;
            font-size: 16px;
            cursor: pointer;
          }
        }
        .bottom {
          .des {
            padding-right: 8px;
            &-label {
              display: inline-block;
              width: 70px;
              color: #919498;
            }
            color: #606266;
            .ellipsis;
            height: 28px;
            line-height: 28px;
            .ksy-status-primary {
              color: @primaryColor !important;
            }
          }
        }
      }
      .btn {
        width: 100px;
        margin-top: 28px;
        .primary0 {
          color: #5c92ff;
          border-color: #5c92ff;
        }
        .primary0:hover {
          color: #fff;
          border-color: #5c92ff;
          background: #5c92ff;
        }
        .primary1 {
          border-color: #d9d9d9 !important;
          color: #919498 !important;
        }
        .primary1:hover {
          color: red !important;
          border-color: #d9d9d9;
        }
      }
    }
  }
  .tips {
    font-size: 12px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
    height: 36px;
    line-height: 36px;
  }
  .translate {
    &-box {
      font-size: 12px;
      line-height: 20px;
      &-top {
        //.line-clamp(2);
        color: #303132;
      }
      &-bottom {
        border-top: 1px solid #f0f0f0;
        margin-top: 8px;
        color: #606266;
        //.line-clamp(2);
        padding-top: 8px;
      }
    }
  }
  .view-status {
    &-title {
      font-size: 16px;
      font-weight: 500;
      color: #303132;
      line-height: 24px;
    }
    &-text {
      width: 220px;
      // height: 26px;
      line-height: 26px;
      padding: 0 0 0 8px;
      //.ellipsis;
      background: #f5f5f5;
      border-radius: 1px;
      margin: 16px 0;
    }
    &-box {
      dl {
        font-size: 12px;
        color: #606266;
        line-height: 20px;
        margin-bottom: 0;
        &:first-child {
          margin-bottom: 8px;
          dt {
            background: #e3f1ff;
            color: @primaryColor;
          }
        }
        dt {
          width: 52px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          background: #f5f5f5;
          border-radius: 1px;
          margin-right: 16px;
          font-size: 12px;
          color: #919498;
        }
        dd {
          margin: 0;
        }
      }
    }
  }
}
</style>
