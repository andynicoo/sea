export default {
  data: function () {
    return {
      current: null,
      autoLoad: true,
      paginationData: {
        size: '10',
        current: 1,
        total: 0
      },
      tableLoading: false,
      columns: [],
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: [],
      clearSelectedRows: true
    }
  },
  computed: {
    rowSelection: function () {
      return {
        selectedRowKeys: this.$data.selectedRowKeys,
        onChange: this.onSelectChange,
        getCheckboxProps: this.getCheckboxProps,
        onSelect: this.selectedChange,
        columnWidth: 20
      }
    },
    /**
     * 分页数据
     */
    getPagination() {
      const { size, current, total } = this.$data.paginationData
      return {
        pageSize: Number(size),
        current,
        total,
        pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
        showSizeChanger: true,
        showQuickJumper: true,
        defaultPageSize: 10,
        showTotal: (total) => {
          return `共有${total}条数据`
        }
      }
    }
  },
  mounted: function () {
    if (this.$data.autoLoad) {
      this.loadData()
    }
  },
  methods: {
    /**
     * 加载初始化数据
     */
    async loadData(flag) {
      this.$data.tableLoading = true
      if (flag === 'delete') {
        if (this.$data.dataSource.length === 1) {
          this.$data.paginationData.current -= 1
        }
      }
      if (this.getTableDataBefore) await this.getTableDataBefore()
      try {
        console.log(888)
        let { data } = await this.getTableData()
        console.log(data, 999)
        this.$data.dataSource = data.records
        this.$data.paginationData = {
          ...this.$data.paginationData,
          ...this.getPageFromResp(data)
        }
        if (this.getTableDataAfter) await this.getTableDataAfter()

        // 如果有统计数，刷新统计数
        this.getCountNum()
      } catch (error) {
        console.error(error)
      } finally {
        this.$data.tableLoading = false
        if (this.$data.clearSelectedRows) {
          this.$data.selectedRowKeys = []
          this.$data.selectedRows = []
        }
      }
    },
    // 列表售价排序
    changeType(data) {
      this.$data.params = {
        ...this.$data.params,
        sort: data ? 7 : null,
        sortType: data ? (data === 'ascend' ? 1 : 0) : null
      }
    },
    getCountNum() {},
    /**
     * 从第一页加载
     */
    reLoadData() {
      this.$set(this.$data.paginationData, 'current', 1)
      this.loadData()
    },
    /**
     * 分页改变
     */
    changePage({ pageSize, current }) {
      this.$data.paginationData = {
        ...this.$data.paginationData,
        size: pageSize,
        current
      }
      this.loadData()
    },
    /**
     * 行选择事件
     */
    onSelectChange(selectedRowKeys, selectedRows) {
      this.$data.selectedRowKeys = selectedRowKeys
      this.$data.selectedRows = selectedRows
    },
    // 行选择取消事件
    selectedChange(record, selected, selectedRows, nativeEvent) {
      // console.log(record, selected, selectedRows, nativeEvent)
    },
    /**
     * 把接口的分页信息交给paginationData
     */
    getPageFromResp(source) {
      let { current, size, total } = source
      return {
        current,
        size: String(size) || 10,
        total
      }
    },
    /**
     * table checkbox
     */
    getCheckboxProps(record) {
      return {
        props: {
          disabled: record.disabled, // Column configuration not to be checked
          name: record.name
        }
      }
    }
  }
}
