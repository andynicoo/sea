<template>
  <div class="integral-mal">
    <Spin v-if="loading" fix>加载中...</Spin>
    <div class="integral-mal-main" v-else>
      <!-- header -->
      <integral-mal-header @modalShow="modalShow" :info="integralInfo" />
      <div class="integral-mal-main-content">
        <div class="integral-mal-main-content-head">
          <h2>积分商城</h2>
          <div class="integral-mal-main-content-bar">
            <span>积分兑好物</span>
            <div class="integral-mal-main-content-bar-wrap">
              <span>去兑换</span>
              <div class="code-hide">
                <div class="tip">
                  <img :src="codeUrl" alt="" />
                  <span>微信扫一扫兑换</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 分类 -->
        <div class="gate-box">
          <div
            @click="onClickGate(gate.integralProductCategoryId)"
            :class="{ active: curId === gate.integralProductCategoryId }"
            v-for="gate in gateList"
            :key="gate.integralProductCategoryId"
            class="gate-box-item"
          >
            {{ gate.categoryName }}
          </div>
        </div>
        <!-- list -->
        <div class="integral-mal-main-content-list" v-if="list.length">
          <div class="integral-mal-main-content-list-item" v-for="(item, index) in list" :key="index">
            <div>
              <div class="wrap-img">
                <img :src="item.goodsImg" alt="" />
              </div>
              <p class="line-clamp">{{ item.goodsName }}</p>
            </div>
            <div class="wrap-num">
              <b>{{ item.integralPrice }}</b
              >积分
            </div>
          </div>
        </div>
        <integral-mal-none v-else />
      </div>
    </div>
    <!-- modal-rules -->
    <integral-mal-modal-rules ref="rules" :rules="rules" />
    <!-- modal-details -->
    <integral-mal-modal-details :info="integralInfo" ref="details" />
  </div>
</template>
<script>
import IntegralMalHeader from './components/integralMalHeader';
import IntegralMalModalRules from './components/integralMalModalRules';
import IntegralMalModalDetails from './components/integralMalModalDetails';
import IntegralMalNone from './components/integralMalNone.vue';
import {
  getIntegralGoods,
  getIntegralConfigDetail,
  getUserInegralAccount,
  getIntegralGoodsCategory,
} from '@/api/user/integralMal.js';
import { Base64 } from 'js-base64';
export default {
  components: {
    IntegralMalHeader,
    IntegralMalModalRules,
    IntegralMalModalDetails,
    IntegralMalNone,
  },
  provide() {
    return {
      dialogWidth: 516,
    };
  },
  data() {
    return {
      loading: true,
      showDetail: false,
      showRules: false,
      rules: {},
      list: [],
      integralInfo: {},
      curId: '',
      gateList: [],
    };
  },
  props: {
    codeUrl: '',
  },
  methods: {
    /**
     * 积分信息
     */
    getUserInegralAccount() {
      return getUserInegralAccount().then((res) => {
        if (+res.code === 0) {
          this.integralInfo = res.data;
        }
      });
    },
    /**
     * 积分规则
     */
    getIntegralConfigDetail() {
      return getIntegralConfigDetail().then((res) => {
        if (+res.code === 0 && res.data.remark) {
          this.rules = {
            content: Base64.decode(res.data.remark).replaceAll('<img', '<img style="max-width: 100%"'),
            title: res.data.title,
          };
        }
      });
    },
    /**
     * 积分分类
     */
    getIntegralGoodsCategory() {
      return getIntegralGoodsCategory().then((res) => {
        if (+res.code === 0) {
          this.gateList = res.data;
          this.curId = this.gateList[0].integralProductCategoryId;
        }
      });
    },
    /**
     * 积分列表
     */
    getIntegralGoods(id) {
      return getIntegralGoods({
        // 跨标 跨税，客户端取企业id
        enterpriseId: JSON.parse(localStorage.getItem('objInfo')).enterpriseId || Number(localStorage.getItem('enterpriseid')),
        limit: 999,
        page: 1,
        status: 1,
        surplusStockFlag: false,
        integralProductCategoryId: id,
      })
        .then((res) => {
          this.list = res.data.records || [];
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async onClickGate(id) {
      this.curId = id;
      await this.getIntegralGoods(this.curId);
    },
    modalShow(e) {
      this.$refs[e].show();
    },
  },
  async mounted() {
    try {
      await this.getUserInegralAccount();
      await this.getIntegralConfigDetail();
      await this.getIntegralGoodsCategory();
      await this.getIntegralGoods(this.curId);
    } catch (error) {
      this.loading = false;
    }
  },
};
</script>
<style scoped lang="less">
@import './style.less';
</style>
