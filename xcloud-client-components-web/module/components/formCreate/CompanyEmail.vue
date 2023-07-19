<template>
  <div>
    <a-auto-complete
      :value="emailVal"
      :data-source="dataSource"
      style="width: 300px"
      :placeholder="formItem.placeHolder"
      @change="handleChange"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: { type: String },
    formItem: { type: Object },
    fApi: { type: Object },
  },
  data() {
    return {
      emailVal: '',
      dataSource: [],
    };
  },
  mounted() {
    this.emailVal = this.value;
  },
  methods: {
    handleChange(value) {
      this.dataSource =
        !value || value.indexOf('@') >= 0
          ? []
          : [
              `${value}@163.com`,
              `${value}@qq.com`,
              `${value}@gmail.com`,
              `${value}@hotmail.com`,
              `${value}@aliyun.com`,
              `${value}@outlook.com`,
              `${value}@yahoo.com`,
              `${value}@sina.com`,
              `${value}@126.com`,
              `${value}@yeah.net`,
              `${value}@foxmail.com`,
              `${value}@msn.com`,
            ];
      this.emailVal = value;
      this.$emit('input', this.emailVal);
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
    border: 1px solid rgba(0, 0, 0, 0.2);
    background: #f9f9f9;
    text-align: center;
    margin-right: 10px;
    cursor: pointer;
    padding: 12px 0 0;
    line-height: 16px;
    img {
      width: 110px;
      height: 82px;
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
      margin-right: 2px;
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
