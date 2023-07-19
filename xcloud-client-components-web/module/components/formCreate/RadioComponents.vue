<template>
  <ul class="form-radio" v-if="formItem.infoJson">
    <li
      @click="changeValue(item.value)"
      v-for="(item, index) in formItem.infoJson.groups"
      :key="item.value"
      :class="{ current: currentVal === item.value }"
    >
      <div class="form-radio-img">
        <img :src="require(`@comp/images/dynamicForm/${formItem.keyName}${index}.png`)" />
        <img class="current-img" :src="require(`@comp/images/dynamicForm/current/${formItem.keyName}${index}.png`)" />
      </div>
      <div class="form-radio-label"><b></b>{{ item.label }}</div>
    </li>
  </ul>
</template>

<script>
import {
  companyInformation,
  legalPersonInformation,
  storeInformation,
} from '@comp/module/itaxs/DynamicForm/staticList.js';
export default {
  props: {
    value: { type: String },
    formItem: { type: Object },
    fApi: { type: Object },
    isReject: Boolean,
  },
  data() {
    return {
      currentVal: '1',
      //公司信息自动识别字段
      companyInformation,
      //法人信息自动识别字段
      legalPersonInformation,
      //店铺信息自动识别字段
      storeInformation,
    };
  },
  created() {},
  watch: {
    value: {
      immediate: true, // 这是为了第一次拿到值的时候就对sd进行监听
      handler(val) {
        this.currentVal = val;
        console.log(this.currentVal, this.formItem.keyName);
        if (this.formItem.keyName === 'shopSalePlatformName' && !this.currentVal) {
          this.currentVal = 'Amazon';
          this.fApi.setValue({ shopLogisticsCompanyName: 'Amazon' });
          this.$emit('input', this.currentVal);
        }
        if (this.currentVal === '1') {
          if (this.formItem.keyName === 'certificateType') {
            this.$nextTick(() => {
              this.fApi.display(false, this.legalPersonInformation);
            });
          } else if (this.formItem.keyName === 'companyType') {
            this.$nextTick(() => {
              this.fApi.display(false, this.companyInformation);
            });
          }
        } else {
          if (this.formItem.keyName === 'certificateType') {
            this.$nextTick(() => {
              this.fApi.display(true, this.legalPersonInformation);
            });
          } else if (this.formItem.keyName === 'companyType') {
            this.$nextTick(() => {
              this.fApi.display(true, this.companyInformation);
            });
          }
        }
        if (this.currentVal === 'Amazon') {
          if (this.formItem.keyName === 'shopSalePlatformName') {
            this.fApi.setValue({ shopLogisticsCompanyName: 'Amazon' });
            this.$bus.$emit('intelligentFlagChange', true);
            if (!this.fApi.getValue('shopHref')) {
              this.$nextTick(() => {
                this.fApi.display(false, this.storeInformation);
              });
            }
          }
        } else {
          if (this.formItem.keyName === 'shopSalePlatformName') {
            this.fApi.setValue({ shopLogisticsCompanyName: '' });
            this.$bus.$emit('intelligentFlagChange', false);
            this.$nextTick(() => {
              if (!this.isReject) {
                this.fApi.display(true, this.storeInformation);
              }
              this.fApi.validateField('shopHref');
            });
          }
        }
      },
    },
  },
  methods: {
    changeValue(val) {
      if (this.currentVal !== val) {
        this.$confirm({
          title: `切换${this.formItem.keyLabel}，可能会丢失原有已填写/已自动识别的资料信息，确定切换吗？`,
          centered: true,
          onOk: () => {
            this.currentVal = val;
            this.$emit('input', this.currentVal);
          },
          onCancel: () => {},
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.form-radio {
  display: flex;
  margin: 0;
  li {
    min-width: 154px;
    min-height: 134px;
    border-radius: 8px;
    border: 1px solid #fff;
    background: #f9f9f9;
    text-align: center;
    margin-right: 24px;
    cursor: pointer;
    padding: 12px 0 0;
    line-height: 16px;
    .form-radio-img {
      width: 110px;
      height: 82px;
      background: #f0f0f0;
      margin: 0 auto;
      padding-top: 20px;
      img {
        height: 45px;
        margin: 0px auto;
      }
      .current-img {
        display: none;
      }
    }
    .form-radio-label {
      margin-top: 10px;
    }
    b {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 1px solid #ddd;
      padding: 2px;
      position: relative;
      top: 1px;
      margin-right: 8px;
      &::before {
        content: '';
        display: block;
        width: 6px;
        height: 6px;
        background: #ddd;
        border-radius: 50%;
      }
    }
    &.current {
      border-color: #549bff;
      background: #fff;
      .form-radio-img {
        background: #f0f6ff;
        img {
          display: none;
        }
        .current-img {
          display: block;
        }
      }
      b {
        border-color: #549bff;
      }
      b::before {
        background: #549bff;
      }
    }
  }
}
</style>
