<template>
  <div>
    <!-- 英国退税 -->
    <div>
      <div class="statusItem">
        <!-- 步骤1 -->
        <div class="item active">
          <div class="itemLeft">
            <div class="top">1</div>
            <div class="bottom">提交资料</div>
          </div>
          <div class="itemRight">
            <div class="itemLine">
              <i></i>
            </div>
            <div class="rejectedOperateTime" v-if="processInfo.progressBar == 2">被驳回</div>
            <!-- <div class="operateTime">提交时间：{{ processInfo.updateTime }}</div> -->
          </div>
        </div>
        <!-- 步骤2 -->
        <div
          class="item"
          :class="{
            active: [currentCodeEnum.NODE3, currentCodeEnum.NODE7, currentCodeEnum.NODE8].includes(processInfo.status),
          }"
        >
          <div class="itemLeft">
            <div class="top">2</div>
            <div class="bottom">待审核</div>
          </div>
          <div class="itemRight">
            <div class="itemLine">
              <i></i>
            </div>
            <!-- <div class="operateTime" v-if="[currentCodeEnum.NODE3,currentCodeEnum.NODE7].includes(processInfo.status) &&processInfo.progressBar != 2">
              审核通过时间：{{ processInfo.updateTime }}
            </div> -->
          </div>
        </div>
        <!-- 步骤3 -->
        <div
          class="item"
          :class="{ active: [currentCodeEnum.NODE7, currentCodeEnum.NODE8].includes(processInfo.status) }"
        >
          <div class="itemLeft">
            <div class="top">3</div>
            <div class="bottom">退税中</div>
          </div>
          <div class="itemRight">
            <div class="itemLine">
              <i></i>
            </div>
            <div
              class="requireOperateTime"
              v-if="[currentCodeEnum.NODE7, currentCodeEnum.NODE8].includes(processInfo.status)"
            >
              {{ processInfo.checkPassTime }}前，如您未收到退税金额，请联系客服
            </div>
            <!-- <div class="operateTime" v-if="processInfo.status == currentCodeEnum.NODE8">
              完成时间：{{ processInfo.updateTime }}
            </div> -->
          </div>
        </div>
        <!-- 步骤4 -->
        <div class="item" :class="{ active: processInfo.status == currentCodeEnum.NODE8 }">
          <div class="itemLeft">
            <!-- 完成的状态 -->
            <div class="top" v-if="processInfo.status == currentCodeEnum.NODE8">
              <img src="@/assets/images/common/gou.svg" alt="" />
            </div>
            <!-- 即将完成 -->
            <div class="top" v-else>4</div>
            <div class="bottom">退税完成</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { currentCodeEnum } from '@/views/userManage/setting/staticList.js';
export default {
  props: { processInfo: { type: Object, default: () => {} } },
  data() {
    return {
      currentCodeEnum,
    };
  },
};
</script>

<style lang="less" scoped>
.statusItem {
  display: flex;
  width: 100%;
  margin: 20px 0px 0px;
  .item {
    width: 100%;
    display: flex;
    align-items: center;
    .itemLeft {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 100px;
      .top {
        width: 30px;
        height: 30px;
        background: #ffffff;
        border-radius: 50%;
        text-align: center;
        line-height: 29px;
        color: rgba(0, 0, 0, 0.45);
        border: 1px solid rgba(0, 0, 0, 0.45);
        font-size: 14px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .bottom {
        font-size: 14px;
        font-weight: 500;
        color: #333333;
      }
    }
    .itemRight {
      position: relative;
      width: 100%;
      .itemLine {
        width: 100%;
        padding: 0 10px;
        position: absolute;
        left: 0px;
        top: -15px;
        & > i {
          display: inline-block;
          width: 100%;
          height: 1px;
          vertical-align: top;
          background: #e8eaec;
          border-radius: 1px;
          position: relative;
        }
      }
      .operateTime {
        font-size: 12px;
        color: #666666;
        line-height: 17px;
        text-align: center;
        position: absolute;
        width: 100%;
        top: -5px;
      }
      .rejectedOperateTime {
        font-size: 12px;
        color: #ff8900ff;
        line-height: 17px;
        text-align: center;
        position: absolute;
        width: 100%;
        top: -37px;
      }
      .requireOperateTime {
        font-size: 12px;
        color: rgb(255, 17, 0);
        line-height: 17px;
        text-align: center;
        position: absolute;
        width: 100%;
        top: -47px;
      }
    }
  }
  .statusItem .active,
  .rejected {
    .itemLeft {
      .top {
        background: #1890ffff;
        color: #ffffff;
        border: none;
        line-height: 30px;
      }
    }
    .itemRight {
      .itemLine {
        i {
          background: #1890ffff;
        }
      }
    }
  }
  .statusItem .rejected {
    .itemRight {
      .itemLine {
        i {
          background: #ff8900ff;
        }
      }
    }
  }
  .rejectedLine {
    .itemLeft {
      .top {
        background: #1890ffff;
        color: #ffffff;
        border: none;
        line-height: 30px;
      }
    }
    .itemRight {
      .itemLine {
        i {
          background: #e8eaec;
        }
      }
    }
  }
  .item:last-child {
    margin-right: -20%;
  }
}
.info {
  margin: 14px 0px 0px;
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 14px;
  .left {
    display: flex;
    font-weight: 500;
    color: #16ade9;
    line-height: 20px;
    margin-right: 10px;
    img {
      margin-right: 5px;
    }
  }
  .timeout {
    color: #ed3e3eff;
  }
  .right {
    span {
      color: #16ade9ff;
    }
  }
}
.start {
  text-align: center;
  font-size: 12px;
  color: #666666;
  line-height: 17px;
  margin-top: 10px;
}
</style>
