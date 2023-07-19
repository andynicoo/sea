<template>
  <div>
    <Modal v-model="showModal" title="添加店铺" :mask-closable="false">
      <Form ref="formInfo" :model="formInfo" :label-width="100">
        <FormItem label="店铺别名:" required>
          <Input type="text" v-model="formInfo.nickName" placeholder="店铺别名" :maxlength="20"></Input>
        </FormItem>
        <FormItem label="站点:" required>
          <Select v-model="formInfo.countryCode">
            <Option v-for="(li, index) of countryList" :key="index" :value="li.key">
              {{ li.value }}
            </Option>
          </Select>
        </FormItem>
        <p class="tips">
          注：在选择站点授权后到亚马逊的授权确认页面请勿切换站点（商城）。如果切换可能会导致授权的店铺信息错误影响后续的操作。
        </p>
      </Form>
      <div slot="footer">
        <Button type="text" @click="showModal = false">取消</Button>
        <Button type="primary" @click="submit()">确认</Button>
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
.tips {
  color: red;
  padding: 10px 20px 30px;
}
</style>
