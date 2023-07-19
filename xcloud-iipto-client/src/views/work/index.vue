<template>
  <div class="workContent">
    <div class="content">
      <a-row>
        <a-col :span="24">
          <div class="left-content">
            <div class="remain">
              <h3>待办事项</h3>
              <a-row :gutter="16">
                <a-col class="gutter-row" :span="5" v-for="(item, index) in needtoDoList" :key="index">
                  <div class="gutter-box" @click="enterServicePath(item.path)">
                    <img :src="item.img" alt />
                    <div class="gutter">
                      <div class="num">{{ item.name == '未支付订单' ? num + num1 : item.num }}</div>
                      <div class="text">{{ item.name }}</div>
                    </div>
                  </div>
                </a-col>
              </a-row>
            </div>
            <!-- 待办工单 -->
            <WorkOrder :open="open" @close="close"></WorkOrder>
            <!-- 进度列表 -->
            <Progress></Progress>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script>
import WorkOrder from './components/workOrder';
import Progress from './components/progress';
import { workTodoNum } from '@/api/work/index';
import { getOrderList } from '@/api/myOrder';

export default {
  components: {
    WorkOrder,
    Progress,
  },
  data() {
    return {
      needtoDoList: [
        { path: '', img: require('@/assets/images/common/gongdan.png'), name: '待办工单', num: 0 },
        // { path: '/myBrand', img: require('@/assets/images/common/gongdan.png'), name: '商标注册工单', num: 0 },
        { path: '/myOrder', img: require('@/assets/images/common/dingdan.png'), name: '未支付订单', num: 0 },
      ],
      open: false,
      num: 0,
      num1: 0,
    };
  },
  mounted() {
    this.getWorkTodo();
    this.getUnOrderList();
  },
  methods: {
    //获未支付订单
    getUnOrderList() {
      getOrderList({ orderStatus: 'WAIT_PAY' }).then((res) => {
        if (res.code === 0) {
          if (res.data.total) {
            this.num = Number(res.data.total);
          }
        }
      });
      getOrderList({ orderStatus: 'PART_PAID' }).then((res) => {
        if (res.code === 0) {
          if (res.data.total) {
            this.num1 = Number(res.data.total);
          }
        }
      });
    },
    //获取待办事项
    getWorkTodo() {
      workTodoNum().then((res) => {
        if (res.code === 0) {
          if (res.data.backlogWorkOrderNum) {
            this.needtoDoList[0].num = res.data.backlogWorkOrderNum;
          }
        }
      });
    },
    // 进入服务路径
    enterServicePath(path) {
      if (path) {
        this.$router.push({ path: path });
      } else {
        this.open = true;
      }
    },
    close() {
      this.open = false;
    },
  },
};
</script>
<style lang="less" scoped>
.workContent {
  display: inline-block;
  width: 946px;
  vertical-align: top;
  // box-shadow: 0px 2px 6px 0px rgba(0, 21, 41, 0.06);
  .content {
    .left-content {
      .remain {
        background: #ffffff;
        padding: 0 24px 16px;
        h3 {
          font-size: 16px;
          line-height: 56px;
          margin-bottom: 0;
        }
        .gutter-box {
          background: #fafafa;
          height: 80px;
          display: flex;
          padding: 0 32px;
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
  }
}
</style>
