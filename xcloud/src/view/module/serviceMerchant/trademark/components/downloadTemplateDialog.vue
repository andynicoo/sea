<template>
  <Modal v-model="show" width="300" :title="title">
    <p style="margin-bottom: 10px; font-size: 16px">选择模板对应的国家</p>
    <Select v-model="country" style="width: 200px" filterable>
      <Option v-for="(item, index) in countrySelect" :value="item.countryName" :key="`c_${index}`">{{ item.countryName }}</Option>
    </Select>
    <template #footer>
      <div style="display: flex; justify-content: center">
        <a class="ivu-btn ivu-btn-primary" :href="downLoadUrl !== '' ? downLoadUrl : 'javascript:;'" @click="handleClickDown">下载模板</a>
      </div>
    </template>
  </Modal>
</template>
<script>
import { getCountrySelectList } from '@/api/newApi/common.js';
export default {
  name: 'DownloadTemplateDialog',
  data() {
    return {
      show: false,
      title: '下载模板',
      country: '',
      countrySelect: [],
    };
  },
  props: {
    countryList: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    downLoadUrl() {
      const { country, countrySelect } = this;
      if (country !== '' && countrySelect.length) {
        const current = countrySelect.filter((v) => v.countryName === country)[0];
        return current.templateUrl;
      } else {
        return '';
      }
    },
  },
  methods: {
    modalShow() {
      this.show = true;
    },
    handleClickDown() {
      if (this.downLoadUrl !== '') {
        this.show = false;
      } else {
        this.$Message.error('请选择国家');
      }
    },
  },
  mounted() {
    getCountrySelectList()
      .then((res) => {
        const list = res.data;
        const { countryList } = this;
        let arr1 = [];
        let arr2 = [];
        if (countryList.length) {
          arr2 = countryList.map((v) => v.countryName);
        }
        if (list.length) {
          arr1 = list.map((v) => {
            let temp = {};
            if (!arr2.includes(v)) {
              temp = {
                countryName: v.countryNameZh,
                templateUrl: 'https://file.itaxs.com/pro/20220818/b912272da730461f9d5e59cf1d21b57c.xlsx',
              };
              return temp;
            }
          });
        }
        this.countrySelect = countryList.concat(arr1);
      })
      .catch((err) => {
        this.$message.error(err.message);
      });
  },
};
</script>
<style lang="less" scoped>
.ivu-btn:link,
.ivu-btn:visited,
.ivu-btn:hover,
.ivu-btn:active {
  color: #fff !important;
}
</style>
