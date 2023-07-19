<template>
  <div class="country-select">
    <a-dropdown :trigger="['click']">
      <a-tooltip placement="top">
        <template slot="title">
          <span>{{ checkedCountry.label }}</span>
        </template>
        <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
          <span class="limit-text">{{ checkedCountry.label }}</span>
          <a-icon type="down" />
        </a>
      </a-tooltip>
      <a-menu slot="overlay">
        <a-menu-item
          v-for="item in country"
          :key="item.code"
          @click="handleCheckCountry(item)"
        >
          <a href="javascript:;">{{ item.label }}+{{ item.code }}</a>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    <span class="right-line">+{{ checkedCountry.code }}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checkedCountry: {
        label: this.$t('common.CN'),
        code: '86'
      },
      country: [
        { label: this.$t('common.CN'), code: '86' },
        { label: this.$t('common.TW'), code: '886' },
        { label: this.$t('common.MY'), code: '60' },
        { label: this.$t('common.ID'), code: '62' },
        { label: this.$t('common.TH'), code: '66' },
        { label: this.$t('common.PH'), code: '63' },
        { label: this.$t('common.VN'), code: '84' },
        { label: this.$t('common.SG'), code: '65' },
        { label: this.$t('common.BR'), code: '55' }
      ]
    }
  },
  methods: {
    handleCheckCountry(item) {
      this.checkedCountry = item
      this.$emit('input', this.checkedCountry)
    }
  }
}
</script>

<style lang="scss" scoped>
.country-select {
  position: absolute;
  top: 0;
  left: 0;
  width: auto;
  line-height: 40px;
  display: flex;
  align-items: center;
  height: 46px;
  .right-line {
    position: relative;
    display: block;
    margin: 0 18px;
    &::after {
      content: '';
      position: absolute;
      width: 1px;
      height: 15px;
      background: #dfdfdf;
      right: -20px;
      top: 13px;
      margin-right: 10px;
    }
  }
  .ant-dropdown-link {
    width: 80px;
    display: flex;
    align-items: center;
    position: relative;
    color: #303133;
    justify-content: space-between;
    &::after {
      content: '';
      position: absolute;
      width: 1px;
      height: 15px;
      background: #dfdfdf;
      right: -20px;
      top: 13px;
      margin-right: 10px;
    }
    .limit-text {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }
  }
}
</style>
