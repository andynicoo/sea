<template>
  <div class="card-right">
    <div class="card-1">
      <div class="user center">
        <img src="@/assets/images/trademark/v230401/bg-kf-user.png" alt="" />
      </div>
      <a @click="goManualVal" href="JavaScript:void(0);">限时免费人工核名</a>
      <p>{{ string[0] }}</p>
    </div>
    <entrance-box />
    <trade-box style="margin-top: 14px" />
    <!-- 人工审核弹窗 -->
    <ManualVer />
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      string: {
        0: "所有市面上的检索数据都来自技术上对近似商标近似度的算法分析，不代表商标局审查律师的最终人为审判，为了更好的逼近商标局审查律师的判断，推荐与我们的资深核名专家（超过3000个小时工作经验和1000个以上成功案例） 一对一沟通，获得更准确的 意见参考。",
        1: "为什么要注册美国商标： <br />1、只有成功注册并拿到商标证书（R标）才 能在Amazon备案 <br />2、商标具有地域性，注册美国商标才可以在 美国亚马逊备案 <br />3、只有亚马逊品牌备案成功才可以做A+页面 <br />4、品牌备案后，可保护自主品牌，有效防止 跟卖 <br />5、品牌备案后，上传listing无需UPC，可申 请产品加锁，防止产品资料被改 <br />6、避免商标被他人在美国抢先注册，陷入被 动局面",
      },
    };
  },
  computed: {
    ...mapState({
      auth: (state) => state.auth,
    }),
  },
  methods: {
    goManualVal() {
      if (this.auth.userId) {
        this.$bus.$emit("changeManualVer", { show: true });
      } else {
        this.$store.commit("setLoginPopData", { show: true });
        this.$nextTick(() => {
          this.$bus.$emit("loginVisiable", { type: 4 });
        });
      }
    },
    goClient() {
      const host = `${this.$store.state.host.server_url}/trademarkMonitoring`;
      window.location = host;
    },
  },
};
</script>
<style lang="less" scoped>
.card-right {
  width: 204px;
  p {
    margin-bottom: 0;
  }
  > div {
    background: white;
  }
  .card {
    &-1 {
      font-size: 12px;
      color: #919498;
      line-height: 20px;
      padding: 15px 24px;
      margin-bottom: 8px;
      .user {
        width: 138px;
        img {
          display: block;
          width: 100%;
        }
      }
      a {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 160px;
        height: 36px;
        margin-top: 8px;
        margin-bottom: 10px;
        color: #fff;
        background: linear-gradient(270deg, #3370ff 0%, #33c2ff 100%);
        border-radius: 2px;
        &:hover {
          color: #fff !important;
        }
        &::before {
          content: "";
          position: absolute;
          width: 94px;
          height: 30px;
          right: 0;
          top: -28px;
          background: url(@/assets/images/trademark/v230401/bg-kf.png) no-repeat left top / cover;
        }
      }
    }
    &-2 {
      margin: 8px auto 24px;
      padding: 16px 16px 24px;
      font-size: 12px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.6);
      line-height: 20px;
      p {
        margin-bottom: 0;
      }
      ol {
        margin-top: 16px;
        color: rgba(0, 0, 0, 0.4);
        li {
          list-style: disc;
          margin-left: 16px;
        }
      }
    }
    &-3 {
      padding: 16px 21px 24px;
      h3 {
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.9);
        line-height: 22px;
        margin-bottom: 24px;
      }
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        height: 32px;
        padding: 0 16px;
        background: rgba(178, 201, 255, 0.2);
        border-radius: 2px 2px 2px 2px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.6);
        cursor: pointer;
        &:last-child {
          margin-bottom: 0;
        }
        &:hover {
          color: @primaryHover;
        }
      }
    }
  }
}
</style>
