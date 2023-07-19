<template>
  <a-modal
    :visible="showModal"
    :title="$t('packages.PairSKU')"
    :confirm-loading="confirmLoading"
    width="700px"
    @cancel="close()"
    @ok="handleOk()"
  >
    <div>
      <a-radio-group name="radioGroup" :default-value="1" v-model="searchType">
        <a-radio :value="1">
          {{ $t('packages.SearchByProductName') }}
        </a-radio>
        <a-radio :value="2">
          {{ $t('packages.SearchByLocalSKU') }}
        </a-radio>
      </a-radio-group>

      <a-row class="marginTop">
        <a-col span="18">
          <a-input
            v-decorator="[
              'username',
              { rules: [{ required: true, message: 'Please input your name' }] }
            ]"
            placeholder="请输入"
            v-model="searchValue"
          />
        </a-col>
        <a-col span="6">
          <a-button type="primary" @click="search" class="marginLeft">
            {{ $t('packages.searchFor') }}
          </a-button>
        </a-col>
      </a-row>
    </div>

    <a-table
      class="table marginTop"
      :data-source="tableData"
      :columns="columns"
      rowKey="variationSku"
      :pagination="false"
      :loading="loading"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
        type: 'radio'
      }"
    >
      <template slot="skuName" slot-scope="text, record">
        <div style="display: flex;">
          <img class="variationImg" :src="record.image" />
          <div>
            {{ record.skuName }}
          </div>
        </div>
      </template>
    </a-table>
  </a-modal>
</template>

<script>
import Package from '@/api/package'

export default {
  name: 'OverseasTableModal',
  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    seaSystemId: {
      type: Number,
      default: 0
    }
  },
  watch: {
    showModal: {
      handler(newData) {
        if (newData) {
          this.selectedRowKeys = []
          this.searchType = 1
          this.searchValue = ''
          this.tableData = []
        }
      }
    }
  },
  data() {
    return {
      columns: [
        {
          title: this.$t('packages.CommodityInformation'),
          dataIndex: 'purchaseCost',
          scopedSlots: { customRender: 'skuName' }
        },
        {
          title: this.$t('packages.LocalSKU'),
          dataIndex: 'variationSku',
          scopedSlots: { customRender: 'variationSku' }
        }
      ],
      tableData: [],
      loading: false,
      selectedRowKeys: [], //选中的key
      searchType: 1, //搜索类型
      searchValue: '', //搜索内容
      confirmLoading: false
    }
  },
  beforeCreate() {},
  methods: {
    handleOk() {
      if (this.selectedRowKeys.length == 0) {
        this.$message.error(this.$t('packages.pleaseChoose'))
        return false
      }
      this.$emit('ok', this.selectedRowKeys[0])
    },
    close() {
      this.$emit('close')
    },
    search() {
      if (!this.searchValue) {
        return false
      }
      this.loading = true
      Package.unpairedVariationSku({
        current: 1,
        size: 9999,
        searchType: this.searchType,
        searchValue: this.searchValue,
        seaSystemId: this.seaSystemId
      })
        .then((res) => {
          this.tableData = res.data?.records
          this.loading = false
        })
        .catch((reason) => {
          this.loading = false
          console.log(reason)
        })
    },
    //复选框改变
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    }
  }
}
</script>

<style scoped lang="less">
.table {
  .variationImg {
    width: 5rem;
    height: 5rem;
  }
}

.marginTop {
  margin-top: 1rem;
}

.marginLeft {
  margin-left: 3rem;
}
</style>
