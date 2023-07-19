<template>
  <div class="container">
    <div class="title">{{ title }}</div>
    <div class="table">
      <a-table
        :rowKey="
          (record, index) => {
            return index;
          }
        "
        :data-source="dataSource"
        :columns="columns"
        :loading="loading"
        bordered
        :pagination="false"
      >
        <template slot="similarTm" slot-scope="text, record">
          {{ text }}
          <br />
          <a v-if="record.isLast" @click="handleMoreTable(record)" class="more-btn">更多>></a>
        </template>
      </a-table>
    </div>

    <!-- 更多弹窗 -->
    <table-more-modal v-if="more.visible" :title="title" :columns="columns" :data="more.data" @close="more.visible = false" />
  </div>
</template>

<script>
import TableMoreModal from './tableMoreModal.vue';
export default {
  props: {
    dataSource: {
      type: Array,
    },
    columns: {
      type: Array,
    },
    title: {
      type: String,
    },
    loading: {
      type: Boolean,
    },
  },
  components: {
    TableMoreModal,
  },
  data() {
    return {
      // 更多
      more: {
        visible: false,
        columns: [],
        data: [],
      },
    };
  },
  async created() {},
  methods: {
    // 更多弹窗
    handleMoreTable(record) {
      const { dimensionName, typeName, queryItem } = record;
      this.more.visible = true;
      this.more.data = this.dataSource.filter((item) => item.dimensionName === dimensionName && item.typeName === typeName && item.queryItem === queryItem);
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  overflow-x: auto;
  .table {
    width: 1088px;
    .more-btn {
      font-size: 12px;
      color: #aaa;
    }
  }
  .title {
    line-height: 40px;
    border: solid 1px #e8e8e8;
    border-bottom: none;
    text-align: center;
  }
  /deep/.ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
    background: #fff;
  }
}
</style>
