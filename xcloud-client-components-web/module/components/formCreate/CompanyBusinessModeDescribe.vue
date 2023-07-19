<template>
  <div class="mode-describe" :class="{ isDetails: isDetails }">
    <a-select
      :value="currentVal"
      :placeholder="formItem.placeHolder"
      mode="tags"
      style="width: 300"
      :token-separators="[',']"
      @change="changeValue"
      class="formMaxWidth"
      :disabled="isDetails"
      :getPopupContainer="
        (triggerNode) => {
          return triggerNode.parentNode;
        }
      "
    >
      <a-select-option v-for="item in formItem.infoJson.groups" :key="item.value">
        {{ item.label }}
      </a-select-option>
    </a-select>
  </div>
</template>

<script>
import { boolean } from 'mathjs';
export default {
  props: {
    value: { type: Array | String },
    formItem: { type: Object, default: () => {} },
    fApi: { type: Object },
    isDetails: { type: Boolean },
  },
  data() {
    return {
      currentVal: [],
    };
  },
  watch: {
    value: {
      immediate: true, // 这是为了第一次拿到值的时候就对sd进行监听
      handler(val) {
        if (val) {
          this.currentVal = val;
        } else {
          this.currentVal = [];
        }
        console.log(this.currentVal, 'this.currentVal');
      },
    },
  },
  mounted() {
    console.log(this.formItem);
  },
  methods: {
    changeValue(val) {
      console.log(val);
      var r = val.filter((s) => {
        return s && s.trim();
      });
      if (r.length > 3) {
        this.$message.error('店铺业务范围最多只能选3个！');
      }
      this.currentVal = r.slice(0, 3);
      this.$emit('input', this.currentVal);
    },
  },
};
</script>

<style lang="less" scoped>
.mode-describe {
  width: 300px;
}
.isDetails {
  /deep/.ant-select-disabled .ant-select-selection {
    background: none;
    border: none;
  }
}
</style>
