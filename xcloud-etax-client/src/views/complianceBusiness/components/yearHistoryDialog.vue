<!-- 发票详情页 -->
<template>
  <div>
    <Modal v-model="dialog" :width="900" footer-hide title="本年度历史申报信息" class="year-history-diag">
      <div v-if="yearHistoryList.length">
        <div v-for="item in yearHistoryList" :key="item.id" class="container">
        <div class="time-tip">（申报区间： {{ item.beginTime.split(' ')[0] }} - {{ item.endTime.split(' ')[0] }}）WEEE产品申报信息</div>
        <Table :columns="columns2" :data="JSON.parse(item.infos)" border v-if="item.infos != ''"></Table>
        <div></div>

        <Table
          :columns="columns3"
          v-if="item.summary != ''"
          :data="JSON.parse(item.summary)"
          border
        >
        </Table>

        <div style="overflow: hidden">
          <table cellspacing="0" cellpadding="0" border="0" class="ivu-table-summary ivu-table ivu-table-border" style="width: 867px">
            <tbody class="ivu-table-tbody">
              <tr class="ivu-table-row">
                <td class="ivu-table-column-center first-cell w-123">
                  <div class="ivu-table-cell"><span>累计待补缴金额</span></div>
                </td>
                <td class="ivu-table-column-center w-124">
                  <div class="ivu-table-cell"><span></span></div>
                </td>
                <td class="ivu-table-column-center w-124">
                  <div class="ivu-table-cell"><span></span></div>
                </td>
                <td class="ivu-table-column-center w-124">
                  <div class="ivu-table-cell"><span></span></div>
                </td>
                <td class="ivu-table-column-center w-124">
                  <div class="ivu-table-cell"><span></span></div>
                </td>
                <td class="ivu-table-column-center w-124">
                  <div class="ivu-table-cell" style=""><span>{{item.price}}</span></div>
                </td>
                <td class="ivu-table-column-center w-124">
                  <div class="ivu-table-cell"><span></span></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      </div>
      <a-empty v-else style="padding-top: 20px;" />
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'yearHistoryDialog',
  props: {
    yearHistoryList: Array,
    columns3: Array,
    yearHistoryDialogVisible: Boolean,
  },

  data() {
    return {
      productList: [],
      summary: [],
      // dialog: true,
      columns2: [
        {
          title: '明细数据',
          align: 'center',
          children: [
            {
              renderHeader: (h, params) => {
                return h('div', [
                  h('p', [
                    h(
                      'span',
                      {
                        style: {
                          color: '#333',
                          fontWeight: '600',
                        },
                      },
                      '产品类别'
                    ),
                  ]),
                ]);
              },
              render: (h, params) => {
                return h('span', params.row.productCategory);
              },
              align: 'center',
              minWidth: 100,
            },
            {
              renderHeader: (h, params) => {
                return h('div', [
                  h(
                    'span',
                    {
                      style: {
                        color: '#333',
                        fontWeight: '600',
                      },
                    },
                    '产品名称（中英文）'
                  ),
                ]);
              },
              render: (h, params) => {
                return h('span', params.row.productName);
              },
              align: 'center',
              minWidth: 100,
            },
            {
              renderHeader: (h, params) => {
                return h('div', [
                  h(
                    'span',
                    {
                      style: {
                        color: '#333',
                        fontWeight: '600',
                      },
                    },
                    '对应的品牌LOGO'
                  ),
                ]);
              },
              render: (h, params) => {
                return h('span', params.row.productLogo);
              },
              align: 'center',
              minWidth: 100,
            },
            {
              renderHeader: (h, params) => {
                return h('div', [
                  h(
                    'span',
                    {
                      style: {
                        color: '#333',
                        fontWeight: '600',
                      },
                    },
                    '单边最大尺寸'
                  ),
                ]);
              },
              render: (h, params) => {
                return h('span', params.row.sideMaxSize);
              },
              align: 'center',
              minWidth: 100,
            },
            {
              renderHeader: (h, params) => {
                return h('div', [
                  h(
                    'span',
                    {
                      style: {
                        color: '#333',
                        fontWeight: '600',
                      },
                    },
                    '本月实际销售总量（吨）'
                  ),
                ]);
              },
              render: (h, params) => {
                return h('span', params.row.saleWeightTon);
              },
              align: 'center',
              minWidth: 100,
            },
            {
              renderHeader: (h, params) => {
                return h('div', [
                  h(
                    'span',
                    {
                      style: {
                        color: '#333',
                        fontWeight: '600',
                      },
                    },
                    '当年实际销售总量（吨）'
                  ),
                ]);
              },
              render: (h, params) => {
                return h('span', params.row.saleTotalWeight);
              },
              align: 'center',
              minWidth: 100,
            },
            {
              renderHeader: (h, params) => {
                return h('div', [h('span', '')]);
              },
              render: (h, params) => {
                return h('span', '');
              },
              align: 'center',
              minWidth: 100,
            },
          ],
        },
      ],
    };
  },

  computed: {
    dialog: {
      get() {
        return this.yearHistoryDialogVisible;
      },
      set(val) {
        // this.$emit('input', val);
        this.$emit('update:yearHistoryDialogVisible', val);
      },
    },
  },

  mounted() {},
  methods: {
    changeStatePay(val) {
      this.$emit('update:yearHistoryDialogVisible', val);
    },
  },
};
</script>
<style lang="less" scoped>
.year-history-diag {
  /deep/ .ivu-table-body {
    height: auto !important;
  }

  /deep/ .ivu-modal-body {
    max-height: 500px;
    min-height: 200px;
    overflow: auto;
    padding-bottom: 20px !important;
  }


  .ivu-table td, .ivu-table th {
    min-width: 0;
    height: 48px;
    box-sizing: border-box;
    text-align: left;
    text-overflow: ellipsis;
    vertical-align: middle;
  }

  .ivu-table-border td, .ivu-table-border th {
    border-right: 1px solid #e8eaec;
  }

  .ivu-table-column-center {
    text-align: center;
  }

  .first-cell {
    border-left: 1px solid #e8eaec;
  }

  .ivu-table-column-center .ivu-table-cell{
    text-align: center;
  }

  .time-tip {
    width: 100%;
    text-align: center;
    padding: 8px 0;
    background: rgba(22, 173, 233, 0.2);
    border: 1px solid #e8eaec;
    border-bottom: 0;
  }

  .w-123 {
    width: 123px;
  }

  .w-124 {
    width: 124px;
  }


}






</style>
