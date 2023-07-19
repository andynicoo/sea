<template>
  <div class="me-pa-2" style="min-width:1100px;">
    <a-page-header class="me-page-header" title="货代商管理"></a-page-header>
    <div class="me-card ">
      <div class="table-content">
        <a-table
          :columns="columns"
          :data-source="forwardingBusinesses"
          :pagination="getPagination"
          :loading="tableLoading"
          @change="changePage"
        >
          <template slot="isBindSlot" slot-scope="text, item">
            <div>
              {{
                item.isBind == 0
                  ? $t('packages.bingding')
                  : $t('packages.unbingding')
              }}
            </div>
          </template>
          <template slot="warehouseSlot" slot-scope="text, item">
            <div
              v-for="(warehouseItem, warehouseIndex) in item.warehouseDataList"
              :key="warehouseIndex"
            >
              {{ warehouseIndex + 1 }} .{{ warehouseItem.warehouseName }} -
              {{ $t('packages.SupportReceiving') }}:
              <span
                v-for="(supportItem,
                supportIndex) in warehouseItem.warehouseSupportSiteList"
                :key="supportIndex"
              >
                <a-tag>
                  {{ supportItem.name }}
                </a-tag>
              </span>
              <a-button
                v-if="warehouseItem.isDefault"
                type="link"
                class="me-error"
                @click="changDefault(item, warehouseIndex)"
              >
                {{ $t('packages.CancelTheDefault') }}
              </a-button>
              <a-button
                v-else
                type="link"
                @click="changDefault(item, warehouseIndex)"
              >
                {{ $t('packages.SetTheDefault') }}
              </a-button>
            </div>
          </template>
          <template slot="operationSlot" slot-scope="text, item">
            <div class="oper-box">
              <a-button
                @click="cancleBinding(item)"
                v-show="item.isBind == 0"
                type="link"
                class="me-error"
                >{{ $t('packages.unbuning') }}</a-button
              >
              <a-button
                @click="binding(item)"
                v-show="item.isBind == 1 && !otherBinding"
                type="link"
                >{{ $t('packages.buning') }}</a-button
              >
              <a-button
                @click="bindingAlert(item)"
                v-show="item.isBind == 1 && otherBinding"
                type="link"
                >{{ $t('packages.buning') }}</a-button
              >
              <a-button
                @click="linkRegister"
                type="link"
                v-show="item.thirdPartyCode != null"
                >{{ $t('packages.register') }}</a-button
              >
            </div>
          </template>
        </a-table>
      </div>
    </div>
    <!-- 绑定的弹窗 -->
    <DialogAccount
      :params="bindForwarderParams"
      @finish="loadData"
    ></DialogAccount>
  </div>
</template>
<script>
import Package from '@/api/package'
import DialogAccount from './components/DialogAccount'
import tableMixins from '@/mixins/tableMixins'

export default {
  mixins: [tableMixins],
  components: {
    DialogAccount
  },
  data() {
    return {
      dialogAccount: false,
      dialogInfo: false,
      paginationData: {
        current: 1,
        size: 10,
        pages: 2
      },
      current: 1,
      columns: [
        {
          title: this.$t('packages.forwarderName'),
          dataIndex: 'forwarderName'
        },
        {
          title: this.$t('packages.isBind'),
          dataIndex: 'isBind',
          scopedSlots: { customRender: 'isBindSlot' }
        },
        {
          title: this.$t('packages.warehouse'),
          dataIndex: 'warehouse',
          scopedSlots: { customRender: 'warehouseSlot' }
        },
        {
          title: this.$t('common.handler'),
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operationSlot' }
        }
      ],
      forwardingBusinesses: [],
      // 绑定货代商参数
      bindForwarderParams: {
        visible: false,
        forwarderId: null,
        thirdPartyCode: null
      },
      isBanding: false,
      bindingForwarderName: '',
      otherBinding: false,
      thirdPartyCode: null
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    /**
     * 加载初始化数据
     */
    async loadData(flag) {
      if (flag == 'delete') {
        if (this.$data.dataSource.length == 1) {
          this.$data.paginationData.current -= 1
        }
      }
      if (this.getTableDataBefore) await this.getTableDataBefore()
      try {
        const { data } = await this.getTableData()
        this.$data.dataSource = data.records
        if (this.getTableDataAfter) await this.getTableDataAfter(data)
        this.$data.paginationData = this.getPageFromResp(data)
      } catch (error) {
        console.warn(error)
      } finally {
        this.$data.tableLoading = false
      }
    },
    //获取货代商列表
    getTableData() {
      let params = Object.assign(this.paginationData, {})
      Package.getForwarderList(params).then((res) => {
        if (res.code == 0) {
          this.isBindForwarder()
          let forwardingBusinesses = res.data.records || []
          this.forwardingBusinesses = forwardingBusinesses
          let isBanding = forwardingBusinesses.filter(
            (item) => item.isBind != 1
          )
          this.isBanding = isBanding.length > 0 ? true : false
          if (isBanding.length) {
            this.bindingForwarderName = isBanding[0].forwarderName
          }
          //设置默认仓库
          for (let li of this.forwardingBusinesses) {
            for (let obj of li.warehouseDataList || []) {
              if (obj.isDefault == 1) {
                li.warehouse = obj.id
              }
            }
          }
          this.paginationData = this.getPageFromRespNum(res.data)
        }
      })
    },
    changDefault(item, warehouseIndex) {
      const index = this.forwardingBusinesses.indexOf(item)
      const newData = [...this.forwardingBusinesses]

      const forwarderId = newData[index].id
      const warehouseId = newData[index].warehouseDataList[warehouseIndex].id
      const params = {
        forwarderId: forwarderId,
        warehouseId: warehouseId
      }
      if (newData[index].warehouseDataList[warehouseIndex].isDefault) {
        Package.cancelDefaultWarehouse(params).then((res) => {
          newData[index].warehouseDataList[warehouseIndex].isDefault = 0
          this.forwardingBusinesses = newData
        })
      } else {
        Package.setDefaultWarehouse(params).then((res) => {
          newData[index].warehouseDataList[warehouseIndex].isDefault = 1
          newData[index].warehouseDataList = newData[
            index
          ].warehouseDataList.map((item, itemIndex) => {
            if (itemIndex == warehouseIndex) {
              item.isDefault = 1
              return item
            } else {
              item.isDefault = 0
              return item
            }
          })
          this.forwardingBusinesses = newData
        })
      }
    },
    isBindForwarder() {
      Package.isBindForwarder({}).then((res) => {
        if (res.code == 0) {
          if (res.data.isDisuse == 0) {
            this.bindingForwarderName =
              res.data.forwarderInfoErpVO.forwarderName
            this.otherBinding = true
          }
        }
      })
    },
    getForwarder() {},

    // 打开货代商绑定弹框
    binding(item) {
      this.bindForwarderParams = {
        visible: true,
        forwarderId: item.id,
        thirdPartyCode: item.thirdPartyCode
      }
    },
    cancleBinding() {
      this.confirmModal(this.$t('packages.isUnbuning'), this, () => {
        this.unBindForwarder()
      })
    },
    bindingAlert() {
      this.confirmModal(
        this.$t('packages.string1') +
          `${this.bindingForwarderName}` +
          this.$t('packages.string2'),
        this,
        () => {
          this.unBindForwarder()
        }
      )
    },
    bindingCancle() {
      this.confirmModal(this.$t('packages.isUnbuning'), this, () => {
        let params = {}
        Package.unBindForwarder(params).then((res) => {
          if (res.code == 0) {
            this.loadData()
          }
        })
      })
    },
    unBindForwarder() {
      let params = {}
      Package.unBindForwarder(params).then((res) => {
        if (res.code == 0) {
          this.successAlert(this.$t('packages.succeAlert'))
          this.otherBinding = false
          this.bindingForwarderName = ''
          this.loadData()
        }
      })
    },
    linkRegister() {
      this.openPage('https://www.hpdbxt.com/login.html')
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

    //设置默认仓库
    warehouseChange(val, item) {
      let params = {
        warehouseId: val,
        forwarderId: item.id
      }
      Package.changeDefaultWarehouse(params).then((res) => {
        if (res.code == 0) {
          //console.log('成功')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.add-pages {
  .search-content {
    background: #fff;
    border-radius: 2px;
    padding: 24px;
    margin-bottom: 15px;
    button {
      margin-right: 20px;
    }
  }
  .bind-red {
    color: red;
  }
  .oper-box {
    overflow: hidden;
    .binding-btn {
      float: left;
      margin-right: 30px;
    }
    span {
      float: left;
      margin-right: 30px;
      cursor: pointer;
      line-height: 40px;
      color: #409eff;
    }
    .cancle {
      color: orangered;
    }
  }
}
</style>
