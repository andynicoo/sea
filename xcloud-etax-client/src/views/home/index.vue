<template>
  <div class="work">
    <div v-if="nochange && ifLogin">
      <div class="container">
        <IndexBanner :adKey="'workbench_top_banner'" v-if="envpla !== 'kqy'" />
        <div class="content">
          <a-row>
            <a-col :span="18">
              <div class="left-content">
                <!-- 待办工单 -->
                <WorkOrder></WorkOrder>
                <!-- 进度列表 -->
                <Progress></Progress>
              </div>
            </a-col>
            <a-col :span="6">
              <div class="right-content">
                <div class="notice-content">
                  <div class="notice-header clearfix">
                    <h3>最新公告</h3>
                    <span @click="viewMore">更多</span>
                  </div>
                  <ul>
                    <li v-for="(item, index) in noticeList" :key="index">
                      <div class="text">{{ item.title }}</div>
                      <div class="time">{{ item.createTime }}</div>
                    </li>
                  </ul>
                </div>
                <div class="quick-content">
                  <h3>快捷入口</h3>
                  <a-row :gutter="16">
                    <a-col class="gutter-row" :span="12" v-for="(item, index) in enterServiceList" :key="index">
                      <div class="gutter-box" @click="enterServicePath(item.path)">
                        <img :src="item.img" alt />
                        <div>{{ item.name }}</div>
                      </div>
                    </a-col>
                  </a-row>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import IndexBanner from '@/components/IndexBanner/index';
import Progress from './workComponents/progress';
import WorkOrder from './workComponents/workOrder';
import { workTodo, unMessage, workOrderTodoNum } from '@/api/home/home';
import { baseInfo } from '@/api/shoppingCar/shoppingCar';
import { stationLetterList } from '@/api/stationLetter/stationLetter.js';
import { renewalStatistical, renewalBefore } from '@comp/api/renewal/index.js';
import RenewalReminder from './../common/renewalReminder';
import moment from 'moment';
export default {
  components: {
    IndexBanner,
    WorkOrder,
    Progress,
    RenewalReminder,
  },
  props: {},
  watch: {
    $route(to, from) {
      if (to.path == '/') {
        this.$store.dispatch('changeStatus', true);
        this.nochange = this.$store.getters.orderStatue;
      } else {
        // this.nochange = false;
        this.$store.dispatch('changeStatus', false);
        this.nochange = this.$store.getters.orderStatue;
      }
    },
    nochange: {
      handler(newVal, old) {},
    },
  },
  data() {
    return {
      expirationTimeLen: 0,
      nochange: this.$store.getters.orderStatue,
      ifLogin: true,
      noticeList: [],
      needtoDoList: [
        { path: '', img: require('@/assets/images/survey/gongdan.png'), name: '待办工单', num: 0 },
        { path: '/orderList', img: require('@/assets/images/survey/dingdan.png'), name: '待支付订单', num: 0 },
        { path: '/renewal', img: require('@/assets/images/survey/xufei.png'), name: '产品续费(30天内)', num: 0 },
        { path: '/stationLetter', img: require('@/assets/images/survey/xiaoxi.png'), name: '未读消息', num: 0 },
      ],
      enterServiceList: [
        { path: '/serviceList', img: require('@/assets/images/survey/quick1.png'), name: '购买服务' },
        { path: '/computedTax', img: require('@/assets/images/survey/quick2.png'), name: '一键算税' },
        { path: '/orderList', img: require('@/assets/images/survey/quick3.png'), name: '我的订单' },
        { path: '/varletters', img: require('@/assets/images/survey/quick4.png'), name: 'VAT信件' },
      ],
      renewalBeforeData: {},
    };
  },
  created() {
    if (this.envpla === 'kqy') {
      this.$router.push({ path: '/orderList', query: { form: 'login' } });
    }
  },
  mounted() {
    this.getLetterList();
    this.getNoticeList();
    this.nochange = this.$store.getters.orderStatue;
  },
  methods: {
    // 获取未读消息
    getLetterList() {
      unMessage({}).then((res) => {
        if (res.code == 0) {
          this.needtoDoList[3].num = Number(res.data);
        }
      });
    },
    // 获取最新的公告
    getNoticeList() {
      let params = { limit: 10, page: 1, type: 2 };
      stationLetterList(params).then((res) => {
        if (res.code == 0) {
          this.noticeList = res.data.records.splice(0, 3);
        }
      });
    },
    // 查看更多信息
    viewMore() {
      this.$router.push({ path: '/stationLetter' });
    },
    // 进入服务路径
    enterServicePath(path) {
      if (path) {
        if (path === '/renewal') {
          this.$router.push({ path: path, query: { type: 'THIRTY_DAY_WITHIN' } });
        } else {
          this.$router.push({ path: path });
        }
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    if (from.name == 'login') {
      location.reload();
    }
    next();
  },
};
</script>
<style lang="less" scoped>
.work {
  background-color: whitesmoke;
}
.container {
  padding: 15px 20px 15px 20px;
  .content {
    margin-top: 24px;
    .left-content {
      .remain {
        background: #ffffff;
        padding: 0 24px 16px;
        h3 {
          font-size: 16px;
          line-height: 56px;
        }
        .gutter-box {
          background: #fafafa;
          height: 80px;
          display: flex;
          padding: 0 24px;
          cursor: pointer;
          img {
            width: 32px;
            height: 32px;
            margin-top: 24px;
          }
          .gutter {
            flex: 1;
            .num {
              margin-top: 13px;
              font-size: 24px;
              font-weight: 500;
              color: #303132;
              line-height: 32px;
              text-align: right;
            }
            .text {
              font-size: 12px;
              color: #303132;
              line-height: 20px;
              text-align: right;
            }
          }
        }
      }
    }
    .right-content {
      padding-left: 24px;
      .notice-content {
        background: #ffffff;
        padding: 0 22px;
        overflow: hidden;
        .notice-header {
          line-height: 56px;
          h3 {
            float: left;
            font-size: 16px;
            margin-bottom: 0;
          }
          span {
            font-size: 12px;
            float: right;
            color: #919498;
            cursor: pointer;
          }
        }
        ul {
          margin-bottom: 13px;
          li {
            border-top: 1px solid #f0f0f0;
            padding-top: 8px;
            .text {
              font-size: 12px;
              line-height: 20px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2; // 2行
            }
            .time {
              font-size: 12px;
              color: #919498;
              line-height: 32px;
            }
          }
        }
      }
      .quick-content {
        background: #ffffff;
        padding: 0 24px;
        margin-top: 24px;
        h3 {
          font-size: 16px;
          line-height: 60px;
          margin-bottom: 0;
        }
        .gutter-box {
          background: #fafafa;
          border-radius: 2px;
          padding-top: 24px;
          padding-bottom: 18px;
          margin-bottom: 16px;
          cursor: pointer;
          img {
            display: block;
            width: 42px;
            height: 42px;
            margin: 0 auto;
          }
          div {
            margin-top: 13px;
            font-size: 14px;
            text-align: center;
          }
        }
      }
    }
  }
}
.remain-gutter-box {
  position: relative;
}
.renew-immediately-tips {
  border-radius: 2px;
  background: #f0f6ff;
  border: 1px solid #cce1ff;
  margin-top: 24px;
  padding: 10px;
  overflow: hidden;
  line-height: 32px;
  .ant-btn {
    float: right;
  }
}
</style>
