<template>
  <div class="pagination text-center">
    <v-pagination
      v-model.number="page.current"
      :length="page.pages"
      :total-visible="page.pages > 7 ? 7 : page.pages"
      @input="getPageSizeData"
    ></v-pagination>

    <span style="width: 130px" v-if="isShowPageSize">
      <v-select
        :items="items"
        v-model="page.size"
        item-text="name"
        item-value="type"
        class="pageSize"
        dense
        solo
        @change="changePageSize"
      ></v-select>
    </span>
    <span style="margin-left: 10px">{{$t('common.altogether')}}{{ paginationData.total }}{{$t('common.strip')}}， {{$t('common.go')}}</span>
    <input
      type="number"
      class="ip-number"
      v-model="pageIndex"
      @input.prevent="inputVerification()"
      @change="changePageIndex()"
    />
    <span>{{$t('common.page')}}</span>
  </div>
</template>
<script>
export default {
  props: {
    paginationData: {
      type: Object,
      default: () => {
        return {
          current: 1,
          pages: 1,
          total: 1 // 数据总条数
        }
      }
    },
    mini: {
      type: Boolean,
      default: false
    },
    // 是否显示每页条数
    isShowPageSize: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      pageIndex: 1,
      page: {
        current: 1,
        pages: 1,
        size: 20
      },
      items: [
        { type: 10, name: this.$t('common.page10') },
        { type: 20, name: this.$t('common.page20') },
        { type: 50, name: this.$t('common.page50') },
        { type: 100, name: this.$t('common.page100') }
      ]
    }
  },

  watch: {
    paginationData: {
      handler(payload) {
        if (payload) {
          Object.keys(this.page).forEach((key) => {
            this.page[key] = Number(payload[key]) || 1
          })
        }
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    inputVerification() {
      var num = this.pageIndex
      var re = /^\d*$/
      if (!re.test(num)) {
        this.pageIndex = ''
      }
    },

    changePageIndex() {
      if (this.pageIndex > this.page.pages) {
        this.pageIndex = this.page.current
        this.page.current = Number(this.pageIndex)
      }
      if (this.pageIndex <= 0) {
        this.pageIndex = 1
        this.page.current = this.pageIndex
      }
      if (0 < this.pageIndex <= this.page.current) {
        this.page.current = Number(this.pageIndex)
      }
      this.$emit('change', { current: this.pageIndex, size: this.page.size })
    },
    getPageSizeData() {
      this.pageIndex = this.page.current
      this.$emit('change', { current: this.pageIndex, size: this.page.size })
    },
    changePageSize(size) {
      this.$emit('change', { current: 1, size: size })
    }
  }
}
</script>

<style lang="scss" scoped>
.pageSize {
  transform: translateY(12px);
  width: 100%;
}
</style>

<style lang="scss">
.pagination {
  &.text-center {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    margin-top: 12px;
    padding: 10px 0;

    .ip-number {
      border: 1px solid #ebebeb;
      width: 40px;
      margin: 0 10px;
      height: 30px;
      text-align: center;
    }
  }

  button,
  .v-input__slot {
    box-shadow: none !important;
    border: 1px solid #d9d9d9;
    height: 35px !important;
  }
}
.goods-list-wrap {
  .pagination {
    .v-input__slot {
      margin-bottom: 0 !important;
      margin-top: -2px !important;
    }
  }
}
</style>
