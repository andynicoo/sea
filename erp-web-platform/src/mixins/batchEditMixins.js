import Goods from '@/api/goods'
import Basic from '@/api/basic'
import Store from '@/api/store'
import { uniq } from 'lodash'

/**cross_border: 跨境, mainland: 本土 */
/**storeType: 2:跨境、1:本土、0:其他 */
const validField = {
  1: 'mainland',
  2: 'cross_border'
}

export default {
  props: {
    rowKeys: {
      type: Array,
      default: () => []
    },
    storeId: Number
  },
  data() {
    return {
      columns: [],
      basicColumns: [
        {
          title: this.$t('batchEditOption.productInfo'),
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          width: '400px'
        },
        {
          title: this.$t('batchEditOption.site'),
          dataIndex: 'sourceName',
          scopedSlots: { customRender: 'source' }
        },
        {
          title: this.$t('batchEditOption.before'),
          dataIndex: 'before',
          scopedSlots: { customRender: 'before' }
        },
        {
          title: this.$t('batchEditOption.after'),
          dataIndex: 'after',
          scopedSlots: { customRender: 'after' }
        }
      ],
      size: 10,
      current: 1,
      total: 10,
      dataSource: [],
      tableLoading: false,
      selectedRowKeys: [],
      selectedRows: [],
      isValid: false,
      validData: {},
      validField,
      params: {},
      status: null
    }
  },
  computed: {
    getPagination() {
      const { size, current, total, selectedRowKeys } = this.$data
      return {
        pageSize: Number(size),
        current,
        total,
        pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
        showSizeChanger: true,
        defaultPageSize: 10,
        showTotal: (total) => {
          return (
            this.$t('common.selected') +
            ' ' +
            selectedRowKeys.length +
            ' ' +
            this.$t('common.dataRow') +
            '，' +
            this.$t(`common.pageTotalText`, { total })
          )
        }
      }
    },
    getColumns() {
      const { columns, basicColumns } = this.$data
      return [...basicColumns, ...columns]
    },
    rowSelection() {
      return {
        selectedRowKeys: this.$data.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  created() {
    this.$data.status = this.$attrs.status
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    async getTableData() {
      if (this.getTableDataBefor) await this.getTableDataBefor()
      this.$data.tableLoading = true
      const { isValid, params, status } = this.$data
      const { rowKeys, storeId } = this.$props
      let data = []
      if (storeId) {
        const res = await Goods.getProductList({
          size: 3000,
          current: 1,
          type: 1,
          storeId,
          status: status,
          ...params
        })
        data = res.data.records
      } else {
        const res = await Goods.getEarlyProductBatchDetail(rowKeys)
        data = res.data
      }
      console.log(data)
      data = data.map((item) => {
        item.countryCode = item.countryCode ? item.countryCode : 'CNSC'
        item.storeType = item.storeType ? item.storeType : '2'
        return item
      })
      /**storeType: 2:跨境、1:本土、0:其他 */
      /**countryCode: 站点 */
      this.$data.tableLoading = false
      this.$data.current = 1
      this.$data.total = data.length
      this.$data.dataSource = data
      if (this.getTableDataAfter) await this.getTableDataAfter()
      let hashValue = location.hash
      if (hashValue != '#/goods/on-sale') {
        const selectedRowKeys = data.map(({ id }) => id)
        this.onSelectChange(selectedRowKeys, data)
      }
      if (!isValid) return
      Store.getAllStoreInfoLimit().then(({ data }) => {
        this.$data.validData = data
      })

      let storeInfo = uniq(data.map((el) => el.currency))
      this.$store.dispatch('setTargetLangList', {
        currency: storeInfo[0]
      })
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.$data.selectedRowKeys = selectedRowKeys
      this.$data.selectedRows = selectedRows
    },
    onChange({ current, pageSize }) {
      this.$data.current = current
      this.$data.size = pageSize
    },
    /**翻译 */
    async handlerTranslate(field, lang) {
      const { dataSource } = this.$data
      let list = dataSource.map((ele, index) => ({
        //翻译成英语时传空
        countryCode:
          ele.countryCode == 'CNSC'
            ? ele.countryCode
            : lang == 'EN'
            ? ''
            : ele.countryCode,
        source: ele[field],
        target: '',
        translateId: 10 + index
      }))
      if (!list.some(({ source }) => Boolean(source))) {
        this.$message.error(this.$t('batchEditOption.translateErrorMsg'))
        return Promise.reject()
      }
      let params = { list }
      if (dataSource.find((ele) => ele.countryCode == 'CNSC')) {
        params.to = lang == 'EN' ? 'en' : 'zh'
      }
      const { data } = await Basic.batchTranslate(params)
      // 批量翻译接口返回的数据的顺序不一定前后相同,需要将拿到的数据根据translateId排个序
      data.list.sort((a, b) => a.translateId - b.translateId)
      data.list.forEach(({ target }, index) => {
        this.$set(dataSource, index, {
          ...dataSource[index],
          [field]: this.cutOutStr(target, field, dataSource[index]) || target
        })
      })
      return data
    },
    /**翻译截取超长字符 */
    cutOutStr(target, name, row) {
      let _target_
      if (name == '_name_') {
        _target_ = target.slice(0, row._titLen_)
      } else if (name == '_description_') {
        _target_ = target.slice(0, row._desLen_)
      }
      return _target_
    },
    /**提示 */
    showMessage(data) {
      const messages = data.map(({ result, message, good }) => {
        if (!result) {
          return `${good.name} ${this.$t('batchEdit.saveFaild')}，${message}`
        } else {
          return `${good.name}${this.$t('batchEdit.saveSuccess')}`
        }
      })

      this.$notification.open({
        message: this.$t('common.message'),
        description: (h) => (
          <div>
            {messages.map((msg) => (
              <p>{msg}</p>
            ))}
          </div>
        )
      })
    },
    onCancel() {
      this.$emit('cancel')
    },
    /**是否改变 */
    whetherChange() {
      const { dataSource } = this.$data
      return dataSource.map(({ _change_ }) => !!_change_).every(Boolean)
    }
  }
}
