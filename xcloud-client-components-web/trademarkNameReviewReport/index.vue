<!-- 商标核名报告 -->
<template>
  <div class="report" ref="pdfScreen">
    <a-spin :spinning="loading">
      <div class="content">
        <!-- 顶部 -->
        <header>
          <div
            :class="{
              logo: true,
              flex: true,
              'space-btm': report.userConfirmStatus === 'WAIT_CONFIRM',
              hidden: enterpriseId !== '30',
            }"
          >
            <a href=""><img src="../assets/images/trademark/logo.png" height="30"/></a>
            <span>注册商标，上跨标云，助力跨境电商卖家开启全球品牌之路</span>
          </div>
          <div class="name">国际商标核名报告</div>
          <div class="info flex">
            <div class="result">
              <div v-if="report.userConfirmStatus !== 'WAIT_CONFIRM'">
                您的商标核名报告确认结果为:<span :class="confirmMap[report.userConfirmStatus].style">{{
                  confirmMap[report.userConfirmStatus].result
                }}</span>
              </div>
              <p>
                <span v-if="report.userConfirmStatus !== 'WAIT_CONFIRM'"
                  >确认时间：{{ report.userConfirmDate || '--' }}</span
                >
                <span>报告生成时间：{{ report.createLink || '--' }}</span>
              </p>
            </div>
            <div class="operate not-to-pdf" v-if="!isPreview">
              <a-select @change="handleChangeHistory" class="select" placeholder="查看历史报告">
                <a-select-option v-for="(item, index) in historyCheckReportList" :key="index" :value="index"
                  >{{ item.createTime }}{{ `(${item.type ? '最新' : '历史'})` }}</a-select-option
                >
              </a-select>
              <a-tooltip placement="top">
                <template #title>
                  <span>生成PDF</span>
                </template>
                <a class="btn pdf-btn" @click="downloadPdf"></a>
              </a-tooltip>

              <template v-if="report.userConfirmStatus === 'WAIT_CONFIRM'">
                <a-button class="btn" @click="handleUserConfirm('DISCARD')"
                  ><img src="../assets/images/trademark/quit.svg" />{{ confirmMap['DISCARD'].result }}</a-button
                >
                <template v-if="report.checkResult !== notRecommended">
                  <a-button
                    class="btn"
                    v-if="report.checkPassRate === '小于50%' || report.checkPassRate === '不建议'"
                    @click="handleUserConfirm('PERSIST')"
                    ><img src="../assets/images/trademark/insist.svg" />{{ confirmMap['PERSIST'].result }}</a-button
                  >
                  <a-button class="btn" v-else @click="handleUserConfirm('CONFIRM')"
                    ><img src="../assets/images/trademark/r.svg" />{{ confirmMap['CONFIRM'].result }}</a-button
                  >
                </template>
              </template>
            </div>
          </div>
        </header>
        <!-- 内容 -->
        <div class="body">
          <!-- 结果 -->
          <div class="result section">
            <div class="title-lv1">
              <strong>01 核名结果</strong>
              <p>Retrieved result</p>
            </div>
            <div class="title-lv2 flex">
              <em class="dot"></em>
              <strong>1.1 核名结果概述</strong>
              <span>/Summary of search results</span>
            </div>

            <!-- 核名结果 -->
            <div class="box">
              <div class="overview">
                <div class="box-item">
                  <span>核名结果</span>
                  <div>
                    {{ trademarkSearchRecord.trademarkName }}注册的通过率{{ report.checkPassRate }}，{{
                      report.checkResult
                    }}。
                  </div>
                </div>
                <div class="box-item">
                  <span>核名结果概述</span>
                  <div>
                    <pre><strong>商标含义：</strong><br />{{ report.meaningCheckResult }}<br /><strong>近似商标：</strong><br />{{ report.likeCheckResult }}
                  </pre>
                  </div>
                </div>
                <div class="box-item">
                  <span>修改建议</span>
                  <div>
                    <pre>{{ report.editSuggest || '--' }}</pre>
                  </div>
                </div>
              </div>
            </div>

            <!-- 商标信息  -->
            <div class="title-lv2 flex">
              <em class="dot"></em>
              <strong>1.2 商标信息</strong>
              <span>/Trademark information</span>
            </div>
            <ul class="trademark-info">
              <li>
                <strong>检索商标</strong><span>{{ trademarkSearchRecord.trademarkName || '--' }}</span>
              </li>
              <li>
                <strong>商标分类</strong><span>{{ report.categoryNum || '--' }}</span>
              </li>
              <li>
                <strong>商标国家</strong><span>{{ countryName || '--' }}</span>
              </li>
              <li>
                <strong>商标含义</strong><span>{{ trademarkSearchRecord.trademarkMeaning || '--' }}</span>
              </li>
            </ul>

            <!-- 风险提示 -->
            <div class="title-lv2 flex">
              <em class="dot"></em>
              <strong>1.3 风险提示</strong>
              <span>/Risk warning</span>
            </div>
            <div class="risk">
              1、商标注册有风险，请不相信任何业内人士 “100%注册成功”的说法！<br />
              2、商标检索查询结果和成功率预估，仅有参考价值，不具有法律效力，不可作为判断注册的唯一标准。<br />
              3、需要知悉，因各国商标局数据更新具有一定的滞后性，故商标检索结果会有一定的”盲期”。<br />
              4、我们会尽可能提供完整的查询结果，并提供公正、客观的分析，请您慎重考虑，自行决定是否注册。<br />
              <p class="tips">*以上为检索整体结果，详细情况可参考下方各部分检索详情</p>
            </div>
          </div>
          <!-- 详情 -->
          <div class="detail section">
            <div class="title-lv1">
              <strong>02 检索详情</strong>
              <p>Search details</p>
            </div>

            <!-- 商标含义 -->
            <div class="title-lv2">
              <em class="dot"></em>
              <strong>2.1 商标含义</strong>
              <span>/Approximate trademark case</span>
            </div>
            <div class="box case">
              <div class="box-item">
                <strong><img src="../assets/images/trademark/search.svg" width="24" />商标含义检索结果</strong>
                <div>
                  <pre>{{ report.meaningCheckResult || '--' }}</pre>
                </div>
              </div>
            </div>

            <!-- 图片附件-->
            <div class="img-list" v-if="meaningCheckUrlArr.length">
              <img
                v-for="(item, index) in meaningCheckUrlArr"
                :key="index"
                :src="`data:image/jpeg;base64,${item}`"
                width="100%"
              />
              <!-- <img-base64 v-for="(item, index) in meaningCheckUrlArr" :key="index" :src="item" /> -->
            </div>

            <!-- 近似商标情况 -->
            <div class="title-lv2">
              <em class="dot"></em>
              <strong>2.2 近似商标情况</strong>
              <span>/Approximate trademark case</span>
            </div>
            <div class="box case">
              <div class="box-item">
                <strong><img src="../assets/images/trademark/search.svg" width="24" />近似检索结果</strong>
                <div>
                  <pre>{{ report.likeCheckResult || '--' }}</pre>
                </div>
              </div>
            </div>

            <!-- 美标 -->
            <template v-if="trademarkSearchRecord.country === 'US'">
              <p class="tips">*具体情况，可参考下方两个表格</p>
              <!-- 近似检索详情列表 -->
              <approximate-search-list :dataInfo="dataInfo" />
            </template>

            <!-- 非美标 -->
            <template v-else>
              <not-standard-list :dataInfo="dataInfo" />
            </template>
          </div>
        </div>

        <!-- 底部按钮  -->
        <footer v-if="!isPreview">
          <div class="operate">
            <!-- 移动端暂时隐藏生成pdf -->
            <!-- <template>
            <a-button type="primary" class="btn large-btn" ghost v-if="report.userConfirmStatus !== 'WAIT_CONFIRM'"
              ><img src="../assets/images/trademark/pdf.svg" width="18" />生成PDF</a-button
            >
            <span class="btn text-btn" @click="downloadPdf"
              ><img src="../assets/images/trademark/pdf_gray.svg" width="18" /> 生成PDF</span
            >
          </template> -->
            <template v-if="report.userConfirmStatus === 'WAIT_CONFIRM'">
              <a-button type="primary" ghost class="btn quit-btn" @click="handleUserConfirm('DISCARD')">{{
                confirmMap['DISCARD'].result
              }}</a-button>
              <template v-if="report.checkResult !== notRecommended">
                <a-button
                  type="primary"
                  class="btn"
                  @click="handleUserConfirm('PERSIST')"
                  v-if="report.checkPassRate === '小于50%' || report.checkPassRate === '不建议'"
                  >{{ confirmMap['PERSIST'].result }}</a-button
                >
                <a-button type="primary" class="btn" v-else @click="handleUserConfirm('CONFIRM')">{{
                  confirmMap['CONFIRM'].result
                }}</a-button>
              </template>
            </template>
          </div>
        </footer>

        <!-- 返回顶部 -->
        <a-back-top>
          <div class="back-top"></div>
        </a-back-top>
      </div>
    </a-spin>
    <!-- 移动端历史报告样式 -->
    <div class="mobi-reports" v-if="!isPreview">
      <a @click="handleShowHistory"><img src="../assets/images/trademark/report.svg"/></a>
      <ul v-show="showHistory">
        <li
          v-for="(item, index) in historyCheckReportList"
          :key="index"
          :class="reportIndex === index ? 'active' : ''"
          @click="handleChangeHistory(index)"
        >
          {{ item.createTime }}{{ `(${item.type ? '最新' : '历史'})` }}
        </li>
      </ul>
    </div>

    <!-- 登录弹窗 -->
    <login-modal
      :visible="!isLogin && !isPreview"
      :userMobile="trademarkSearchRecord.userMobile"
      :maskStyle="maskStyle"
    />

    <!-- 无权限提示框 -->
    <a-modal
      title="暂无权限"
      :visible="authVisible"
      :footer="null"
      :maskClosable="false"
      :keyboard="false"
      :closable="false"
      :maskStyle="maskStyle"
      width="410px"
    >
      <div class="auth">
        请使用授权账号查看报告
        <p><a-button type="primary" @click="logout(), (authVisible = false)">知道了</a-button></p>
      </div>
    </a-modal>
  </div>
</template>
<script>
import ApproximateSearchList from './components/approximateSearchList.vue';
import NotStandardList from './components/notStandardList.vue';
import LoginModal from '../loginModal';
import ImgBase64 from './components/imgBase64.vue';
import { message, Modal } from 'ant-design-vue';
import { getTrademarkCheckReport, handleCheckReportUserConfirm } from '../api/report';
import { logout } from '../api/login';
import { createPDF } from '../utils/pdf';

export default {
  components: {
    ApproximateSearchList,
    LoginModal,
    ImgBase64,
    NotStandardList,
  },
  data() {
    return {
      enterpriseId: this.enterpriseId,
      loading: false,
      countryName: '',
      historyCheckReportList: [],
      linkId: this.$route.query.linkId,
      // notRecommended: '不建议注册(极高风险)',
      notRecommended: '不建议注册，商标名为敏感词（商标重名、著名品牌、宗教、人名、地名等）',
      // WAIT_CONFIRM 待确认, CONFIRM 确认注册,  PERSIST 坚持注册,  DISCARD 放弃注册
      report: {
        checkPassRate: '',
        userConfirmStatus: 'WAIT_CONFIRM',
        checkResult: '',
      },
      showHistory: false,
      reportIndex: null,
      trademarkSearchRecord: {},
      confirmMap: {
        CONFIRM: {
          style: 'green',
          result: '确认注册',
          tips: '您是否确认要使用该商标名？',
        },
        PERSIST: {
          style: 'orange',
          result: '坚持注册',
          tips: '该商标名风险较大，您是否确认要坚持使用该商标名？',
        },
        DISCARD: {
          style: 'gray',
          result: '放弃，换个商标',
          tips: '您是否确认要放弃该商标名？',
        },
        undefined: {}, // 兼容异常数据
        '': {}, // 兼容异常数据
      },
      dataInfo: {
        data: [],
      },
      authVisible: false,
      maskStyle: {
        background: '#aaa',
      },
    };
  },
  computed: {
    // 商标含义图片附件
    meaningCheckUrlArr() {
      let { meaningCheckUrlBase64 } = this.report;
      return meaningCheckUrlBase64 ? meaningCheckUrlBase64.split(',') : [];
    },
    // 非美标图片链接
    likeCheckUrlArr() {
      let { likeCheckUrlBase64 } = this.report;
      return likeCheckUrlBase64 ? likeCheckUrlBase64.split(',') : [];
    },
    // 是否登录
    isLogin() {
      return this.$store.state.login.isLogin;
    },
    // 是否是预览
    isPreview() {
      return this.$route.query.type === 'preview';
    },
  },
  created() {
    this.getReprotDetail();
  },
  methods: {
    // 历史报告显示/隐藏
    handleShowHistory() {
      this.showHistory = this.showHistory ? false : true;
    },
    // 改变历史报告
    handleChangeHistory(index) {
      this.showHistory = false;
      this.reportIndex = index;
      this.report = this.historyCheckReportList[index];
      if (this.report.likeCheckJson) {
        this.dataInfo = JSON.parse(this.report.likeCheckJson);
      }
    },
    // 获取报告详情
    getReprotDetail() {
      this.loading = true;
      const { linkId, recordId } = this.$route.query;
      getTrademarkCheckReport({
        linkId: this.isPreview ? undefined : linkId,
        recordId,
      }).then((res) => {
        if (res.code === 0) {
          // isPreview 预览报告
          if (this.isPreview) {
            this.report = res.data.lastCheckReport;
          } else {
            // 链接报告
            this.report = res.data.linkCheckReport;
            // 历史报告
            this.historyCheckReportList = [
              { ...res.data.linkCheckReport, type: 'new' },
              ...res.data.historyCheckReportList,
            ];
          }
          // 商标信息
          this.trademarkSearchRecord = res.data.trademarkSearchRecord;
          // 表格json数据
          if (this.report.likeCheckJson) {
            this.dataInfo = JSON.parse(this.report.likeCheckJson);
          }
          this.countryName = res.data.countryName;
          this.checkAuth();
          this.loading = false;
        }
      });
    },
    // 确认提示
    handleUserConfirm(type) {
      let params = {
        id: this.linkId,
        userConfirmStatus: type,
      };
      Modal.confirm({
        content: this.confirmMap[type].tips,
        onOk: () => {
          handleCheckReportUserConfirm(params).then((res) => {
            if (res.code === 0) {
              this.getReprotDetail();
              message.success('操作成功');
            }
          });
        },
        okText: '确定',
        onCancel() {},
        cancelText: '取消',
      });
    },
    downloadPdf() {
      createPDF(this.$refs.pdfScreen, {
        fileName: '核名报告.pdf', // 导出文件名
        scale: 2, // 导出文件清晰度，值越大清晰度越高，文件体积越大（默认值为设备dpr*2）
      });
    },
    //校验权限
    checkAuth() {
      if (this.isLogin && !this.isPreview) {
        let { userMobile } =
          JSON.parse(localStorage.getItem('userInfo')) || JSON.parse(localStorage.getItem('objInfo'));
        if (this.trademarkSearchRecord.userMobile !== userMobile) {
          this.authVisible = true;
        }
      }
    },

    // 退出登录
    logout() {
      logout().then((res) => {
        if (res.code === 0) {
          localStorage.removeItem('token');
          localStorage.removeItem('sessionId');
          Cookies.remove('token');
          Cookies.remove('sessionId');
          this.$store.commit('saveLogin', false);
          this.$store.commit('saveLeft', false);
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
@import url(./index.less);
</style>
