<template>
  <div class="alert">
    <ul>
      <li>
        VAT申报服务支持续费的条件：服务时间剩余90天内；
      </li>
      <li>
        产品合规服务支持续费的条件：服务时间剩余120天内；
      </li>
    </ul>
    <div class="tips">
      <h2>
        <a-icon type="info-circle" class="tian" />
        温馨提示
      </h2>
      <p>
        当您的申报服务未能及时续费且服务状态变为已失效时，不能直接续费原 服务，若需继续服务，请联系您的专属客户经理。
      </p>
      <p class="imgs">
        <img :src="managerCode.qrCode" alt="客户经理"/>
      </p>
    </div>
  </div>
</template>

<script>
import { getEmployeeCode } from '@/api/account';
export default {
  data() {
    return {
      managerCode: {},
    };
  },
  async mounted() {
    this.getManagerCode();
  },
  methods: {
    // 专属客户经理信息
    getManagerCode() {
      getEmployeeCode().then(
        (res) => {
          if (res.code === 0) {
            this.managerCode = res.data;
          } else {
            that.$Message.error(res.message);
          }
        },
        (err) => {
          that.$Message.error(err.message);
        }
      );
    },
  },
};
</script>
<style lang="less" scoped>
.alert {
  ul {
    padding: 0px 24px;
  }
  li {
    height: 22px;
    font-size: 14px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.6);
    line-height: 22px;
    margin-bottom: 8px;
    list-style-type: disc;
  }
  .tips {
    background: #f0f6ff;
    border-radius: 2px 2px 2px 2px;
    opacity: 1;
    border: 1px solid #cce1ff;
    padding: 16px 19px;
    h2 {
      font-size: 14px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #303132;
      .tian {
        color: #1890ff;
      }
    }
    p {
      padding-left: 20px;
      img{
        text-align: center;
        margin-top: 20px;
        width: 100px;
      }
    }
    .imgs{
        text-align: center;
    }
  }
}
</style>
