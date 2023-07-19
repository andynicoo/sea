<template>
  <div>
    <Modal v-model="showModal" width="1000px" title="自动获取销售报告教程" :mask-closable="false">
      <div class="wrap">
        <div class="title">步骤一：绑定店铺与关联税号</div>
        <div class="img">
          <img src="@/assets/images/store/store-tips1.png" />
        </div>
        <div class="title">
          步骤二：系统自动获取申报的销售报告 ( 提示：若发现销售报告不准确，可自行到亚马逊后台下载销售报告数据 )
        </div>
        <div class="img">
          <img src="@/assets/images/store/store-tips2.png" />
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="showModal = false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getStoreAuthUrl, getCountryList } from '@/api/store';

export default {
  data() {
    return {
      showModal: false,
      countryList: [],
      formInfo: {},
    };
  },
  watch: {
    showModal(val) {
      if (val) {
        this.countryList = [];
        this.formInfo = {
          appName: 'itaxs-sp Test',
          redirectUri: '1',
          sellingPartnerId: '',
          version: 'beta',
          nickName: '',
          countryCode: '',
        };
        this.getCountry();
      }
    },
  },
  mounted() {},
  methods: {
    submit() {
      console.log(this.formInfo);
      if (!this.formInfo.nickName) {
        this.$Message.error('请输入店铺别名');
        return false;
      }
      if (!this.formInfo.countryCode) {
        this.$Message.error('请选择站点');
        return false;
      }
      getStoreAuthUrl(this.formInfo)
        .then((res) => {
          window.open(res.data);
          this.showModal = false;
        })
        .catch((err) => console.log(err));
    },
    //获取国家
    getCountry() {
      getCountryList().then((res) => {
        if (res.code === 0) {
          this.countryList = res.data;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.wrap {
  margin: 0 20px 20px;
  height: 60vh;
  overflow-y: auto;
  .title {
    font-size: 16px;
    font-weight: bold;
    margin: 15px 0;
  }
  .img {
    margin: 10px;
    img {
      width: 100%;
    }
  }
}
</style>
