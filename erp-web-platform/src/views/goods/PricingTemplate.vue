<template>
  <div class="me-pa-2">
    <a-page-header class="me-page-header" title="定价模板"> </a-page-header>
    <a-layout class="me-page-layout">
      <div>
        <a-button
          type="primary"
          @click="$router.push('./create-pricing-template')"
        >
          创建定价模板
        </a-button>
      </div>
      <!-- 价格模板列表 -->
      <a-table
        class="me-mt-3"
        :columns="columns"
        :data-source="dataSource"
        rowKey="id"
        :pagination="getPagination"
        @change="changePage"
        :loading="tableLoading"
      >
        <template slot="site" slot-scope="text">
          {{ calcSite.filter((item) => item.key == text)[0].langName }}
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-button type="link" @click="editPT(record.id)">编辑</a-button>
          <a-button class="me-error" type="link" @click="delPT(record.id)"
            >删除</a-button
          >
        </template>
      </a-table>
    </a-layout>
  </div>
</template>

<script>
const CALC_SITE = [
  { key: 'SG', lang: 'xjp', currency: 'SGD', langName: '新加坡' },
  { key: 'PH', lang: 'flb', currency: 'PHP', langName: '菲律宾' },
  { key: 'MY', lang: 'mlxy', currency: 'MYR', langName: '马来西亚' },
  { key: 'ID', lang: 'ydnxy', currency: 'IDR', langName: '印度尼西亚' },
  { key: 'TH', lang: 'tg', currency: 'THB', langName: '泰国' },
  { key: 'VN', lang: 'yn', currency: 'VND', langName: '越南' },
  { key: 'BR', lang: 'bx', currency: 'BRL', langName: '巴西' },
  { key: 'TW', lang: 'tw', currency: 'TWD', langName: '台湾' },
  { key: 'MX', lang: 'mxg', currency: 'MXN', langName: '墨西哥' },
  { key: 'CL', lang: 'zl', currency: 'CLP', langName: '智利' },
  { key: 'CO', lang: 'glby', currency: 'COP', langName: '哥伦比亚' },
  { key: 'CNSC', lang: 'cnsc', currency: 'CNY', langName: '全球店铺(CNSC)' }
]
import Goods from '@/api/goods'
import tableMixins from '@/mixins/tableMixins'
export default {
  mixins: [tableMixins],
  components: {},
  mounted() {},
  data() {
    return {
      calcSite: CALC_SITE,
      columns: [
        {
          title: '模板名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '站点',
          dataIndex: 'site',
          key: 'site',
          scopedSlots: { customRender: 'site' }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ]
      // params: {},
      // batchPublishLoading: false,
      // batchTimePublishLoading: false,
      // componentsType: 2,
      // batchEditVisible: false,
      // quickSetVisible: false,
      // quickSetLoading: false,
    }
  },
  methods: {
    // loadTable() {
    //   this.loadData()
    // },
    getTableData() {
      const { size, current } = this.$data.paginationData
      return Goods.getPriductPriceTemplateListPage({
        current,
        size: size || 10,
        site: '115751'
      })
    },
    //编辑定价模板
    editPT(id) {
      this.$router.push({
        path: './create-pricing-template',
        query: {
          id,
          title: '编辑模板'
        }
      })
    },
    //删除定价模板
    delPT(id) {
      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('common.deleteConfirm'),
        onOk: async () => {
          await Goods.delPriductPriceTemplate(id)
          this.$message.success(this.$t('common.handlerSuccess'))
          this.reLoadData('delete')
        }
      })
    }
    // // 快速设置 翻译
    // quickSetTran() {
    //   const { dataSource, selectedRowKeys } = this.$data
    //   console.log(selectedRowKeys)
    //   if (selectedRowKeys.length === 0) {
    //     this.$message.error(this.$t('common.handlerLimit'))
    //     return
    //   }
    //   let data = cloneDeep(
    //     dataSource.filter(({ id }) => selectedRowKeys.includes(id))
    //   )
    //   data.forEach((element) => {
    //     element.images = JSON.parse(element.images)
    //   })
    //   this.$data.quickSetGoods = data
    //   this.$data.siteName = data[0].siteName
    //   data.map((ele) => {
    //     if (ele.siteName == this.$data.siteName)
    //       this.$data.curSiteNameGoods += 1
    //   })
    //   this.$data.quickSetVisible = true
    // },
    // quickSetOk() {},
    // onVisibleChange(visible) {
    //   const { selectedRows } = this.$data
    //   if (!selectedRows.length) {
    //     this.$message.error(this.$t('common.handlerLimit'))
    //     this.$data.batchEditVisible = false
    //     return
    //   }
    //   // 勾选商品有cscn产品时，过滤掉cscn,不能进行旧批量编辑
    //   // if (selectedRows.some((item) => item.merchantId)) {
    //   //   this.$message.error('CNSC产品不支持批量编辑')
    //   //   this.$data.selectedRowKeys = []
    //   //   this.$data.selectedRows = this.$data.selectedRows.map((item) => {
    //   //     if (!item.merchantId) {
    //   //       this.$data.selectedRowKeys.push(item.id)
    //   //       return item
    //   //     }
    //   //   })
    //   //   this.$data.selectedRows = compact(this.$data.selectedRows)
    //   //   if (!this.$data.selectedRowKeys.length) {
    //   //     return
    //   //   }
    //   // }
    //   this.$data.batchEditVisible = visible
    // },
    // handleCancel(visible) {
    //   this.$data[visible] = false
    // },
    // getCountNum() {
    //   this.$nextTick(() => {
    //     bus.$emit('updateCount')
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
// .me-custorm-date-picker {
//   &.ant-calendar-picker {
//     min-width: auto !important;
//   }
// }
// .dynamic-title-dialog {
//   color: #40a9ff;
//   margin: 0 10px;
// }
</style>
