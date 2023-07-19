<template>
  <div class="me-contract">
    <div class="me-card">
      <a-space>
        <a-input-search
          :placeholder="$t('purchase.tempName')"
          :enter-button="$t('common.search')"
          v-model="input"
          allowClear
          @search="searchTableData"
        />
      </a-space>
      <a-space class="me-fr">
        <a-button type="primary" @click="openTemp(0)">
          {{ $t('purchase.addTemp') }}
        </a-button>
      </a-space>
    </div>
    <div class="me-card">
      <!-- {{ relationData }}-- -->
      <a-table
        :columns="columns"
        :pagination="getPagination"
        :data-source="dataSource"
        :loading="tableLoading"
        rowKey="contractId"
        @change="changePage"
      >
        <template slot="relationCount" slot-scope="text, record">
          <a-button type="link" @click="relationed(record)">
            {{ record.relationCount }}
          </a-button>
        </template>
        <template slot="isMain" slot-scope="text, record">
          <!-- <a-button type="link" @click="isMain(record)">
            {{ record.isMain }}
          </a-button> -->
          <a-checkbox
            :checked="record.isMain == 1"
            @change="changeIsMain(record)"
          >
          </a-checkbox>
        </template>
        <template slot="createBy" slot-scope="text, record">
          {{ record.createBy }}/ {{ record.createTime }}
        </template>
        <template slot="updateBy" slot-scope="text, record">
          {{ record.updateBy }}/ {{ record.updateTime }}
        </template>
        <!-- <a slot="name" slot-scope="text">{{ text }}</a> -->
        <template slot="operation" slot-scope="text, record">
          <a-button type="link" class="me-pa-1" @click="openTemp(record.contractId)">
            {{ $t('common.edit') }}
          </a-button>
          <a-divider type="vertical" />
          <a-button type="link" class="me-pa-1 me-error" @click="deleteOne(record)">
            {{ $t('common.delete') }}
          </a-button>
          <a-divider type="vertical" />
          <a-button type="link" class="me-pa-1" @click="relation(record)">
            {{ $t('purchase.relatedSuppliers') }}
          </a-button>
        </template>
      </a-table>
    </div>

    <a-modal
      v-model="deleteVisible"
      centered
      :title="$t('common.deleteConfirm')"
      @ok="goDelete"
    >
      <p>{{ $t('purchase.sureDeleteTemp') }}</p>
      <p>{{ $t('purchase.relatedTempNoDelete') }}</p>
    </a-modal>

    <a-modal
      v-model="relationedVisible"
      centered
      :title="$t('purchase.relatedSuppliers2')"
      @ok="goRelation"
    >
      <div class="me-contract--relation">
        <template v-for="tag in relationedData">
          <a-tag
            :key="tag.supplierId"
            closable
            @close="() => handleCloseTag(tag)"
          >
            {{ tag.supplierName }}
          </a-tag>
          <!-- <span :key="tag.supplierId">{{ tag.supplierName }}<a-icon type="close" @click="remove(tag,index)"></a-icon></span> -->
        </template>
        <template v-if="relationedData.length == 0">{{
          this.$t('purchase.noRelatedSupplierNow')
        }}</template>
      </div>
      <!-- <p>sdf</p> -->
    </a-modal>

    <a-modal
      v-model="relationVisible"
      centered
      :title="$t('purchase.relatedSuppliers')"
      @ok="goRelationGsy"
      destroyOnClose
      :maskClosable="false"
    >
      <div class="me-contract--relationed">
        <!-- default-value:{{relationData}};
        select:{{relationData2}}.... -->
        <!-- {{relationData.length}}
        :default-value="relationData" -->
        <a-select
          mode="multiple"
          style="width: 100%"
          :placeholder="$t('purchase.relatedSuppliers')"
          show-search
          option-filter-prop="children"
          @change="handleChange22"
        >
          <a-select-option
            v-for="item in allRelation"
            :key="item.supplierId"
            :disabled="relationData.includes(item.supplierId)"
          >
            {{ item.supplierName }}
          </a-select-option>
        </a-select>
      </div>
    </a-modal>

    <!-- 新增、编辑弹窗 -->
    <a-modal
      :title="$t('purchase.contractConfig')"
      v-model="visible"
      :width="900"
      :maskClosable="false"
      destroyOnClose
    >
      <template slot="footer">
        <a-button key="back" @click="handleEditCancel">
          {{ $t('common.cancel') }}
        </a-button>
        <a-button key="submit" @click="handleEditOk" type="primary" :loading="confirmLoading">
          {{ $t('common.ok') }}
        </a-button>
        <a-button type="link" @click="goPreview">
          {{ $t('purchase.scanContractConfig') }}
        </a-button>
      </template>
      <EditContract
        :currentId="currentId"
        :updataList="updataList"
        :handleCancel="handleCancel"
        destroyOnClose
        ref="AddEditContract"
      ></EditContract>
    </a-modal>
  </div>
</template>

<script>
/**
 * 合同管理
 */
import Purchase from '@/api/purchase'
import tableMixins from '@/mixins/tableMixins'
import EditContract from './components/EditContract'
import { pushParams } from 'vuelidate/lib/params'
// import purchase from '~/src/api/purchase'
// const dataSource = []

export default {
  mixins: [tableMixins],
  components: {
    EditContract
  },
  data() {
    return {
      columns: [
        {
          title: this.$t('purchase.tempName'),
          dataIndex: 'contractName',
          scopedSlots: { customRender: 'contractName' },
          width: 200
        },
        {
          title: this.$t('purchase.relatedSuppliersNum'),
          dataIndex: 'relationCount',
          width: 200,
          scopedSlots: { customRender: 'relationCount' }
        },
        {
          title: this.$t('purchase.defaultContract'),
          dataIndex: 'isMain',
          scopedSlots: { customRender: 'isMain' }
        },
        {
          title:
            this.$t('purchase.creatMan') + '/' + this.$t('common.createTime'),
          dataIndex: 'createBy',
          scopedSlots: { customRender: 'createBy' }
        },
        {
          title:
            this.$t('purchase.updateMan') + '/' + this.$t('common.updateTime'),
          dataIndex: 'updateBy',
          scopedSlots: { customRender: 'updateBy' }
        },
        {
          title: this.$t('common.handler'),
          dataIndex: 'operation',
          key: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      visible: false,
      input: '',
      confirmLoading: false,
      contractForm: this.$form.createForm(this), // 合同编辑form
      currentId: '', //当前要操作的合同id
      deleteVisible: false,
      relationVisible: false, // 关联供应商弹窗
      relationedVisible: false, // 已关联供应商弹窗
      relationedData: [], // 已关联供应查询data
      deleteRelationedData: [], // 要删除的供应商ID []
      relationData: [], // 关联的供应商,查询而来
      relationData2: [], // 当前手动勾选的供应商，临时[]
      allRelation: [] //供应列表
    }
  },
  computed: {},
  mounted() {
    // this.getContractList()
  },
  methods: {
    openTemp(val) {
      // this.contractForm.resetFields()
      // this.$data.gsImg = ''
      // this.$data.dzzImg = ''
      // this.$data.visible = true
      // this.$data.currentId = 0

      this.$data.visible = true
      val == 0 ? (this.$data.currentId = 0) : (this.$data.currentId = val)
    },
    getTableData() {
      return Purchase.getContractList(
        Object.assign(this.$data.paginationData, {
          modelName: this.$data.input
        })
      )
    },
    searchTableData() {
      this.$data.paginationData = {
        current: 1
      }
      this.loadData()
    },
    //取消新增编辑
    handleCancel(visible) {
      console.log('Clicked cancel button')
      this.$data[visible] = false
    },
    updataList() {
      this.loadData()
    },
    /**
     * 编辑提交
     */
    async handleEditOk() {
      this.$data.confirmLoading = true
      this.$refs.AddEditContract.submit().then(()=>{}).finally(()=>{
        this.$data.confirmLoading = false
      })
    },
    goPreview() {
      this.$refs.AddEditContract.goPreview()
    },
    /**
     * 编辑取消
     */
    handleEditCancel() {
      this.$data.visible = false
      this.$data.confirmLoading = false
      // this.$data.editCurrent = null
    },
    changeIsMain(obj) {
      this.tableLoading = true

      // 获取所有的合同，检索是否已有默认合同，如果有，则能设置
      var contractData = []
      var hasIsMain = false
      var checkedId = 0
      Purchase.getContractList({
        size: '1000'
      }).then((res) => {
        if (res.code == 0) {
          contractData = res.data.records
          // console.log(contractData)
          contractData.map((val, index) => {
            if (val.isMain == 1) {
              hasIsMain = true
              checkedId = val.contractId
            }
          })
          // console.log(checkedId)
          if (hasIsMain) {
            // 当前选中并取消
            if (checkedId == obj.contractId) {
              // console.log('当前选中并取消')
              this.changeIsMianByPar(0, obj.contractId)
            }
            //其他选中需要取消并选中当前
            if (checkedId != obj.contractId) {
              // console.log('其他选中需要取消并选中当前')
              this.changeIsMianByPar(0, checkedId)
              this.changeIsMianByPar(1, obj.contractId)
            }
          } else {
            // 所有无选中并选中当前
            // console.log('所有无选中并选中')
            this.changeIsMianByPar(1, obj.contractId)
          }
        }
      })
    },
    // 根据参数改变contractId的是否默认状态
    changeIsMianByPar(num, id) {
      const params = {
        contractId: id,
        isMain: num
      }
      Purchase.editContract(params).then((res) => {
        if (res.code == 0) {
          this.$Message({
            type: 'success',
            content: this.$t('common.handlerSuccess')
          })
          this.loadData()
        }
        this.tableLoading = true
      })
    },
    // 删除弹窗
    deleteOne(obj) {
      this.$data.currentId = obj.contractId
      // this.$data.deleteVisible = true

      this.$confirm({
        title: this.$t('common.warn'),
         content: h => <div>{this.$t('purchase.sureDeleteTemp')}{this.$t('purchase.relatedTempNoDelete')} </div>,
        onOk: async () => {
          this.goDelete()
        }
      })      
    },
    // 确认删除
    goDelete() {
      let dataSourceLen = this.$data.dataSource.length
      Purchase.deleteContract({ contractId: this.$data.currentId }).then(
        (res) => {
          if (res.code == 0) {
            this.$Message({
              type: 'success',
              content: this.$t('common.handlerSuccess')
            })
            this.$data.deleteVisible = false
            if (dataSourceLen == 1) {
              this.$data.paginationData.current -= 1
            }
            this.loadData()
          }
        }
      )
    },
    // 关联供应商弹窗
    relation(obj) {
      this.$data.currentId = obj.contractId
      this.$data.relationVisible = true
      this.$data.relationData = []
      this.$data.relationData2 = []

      //调取所有供应商
      Purchase.getSupplierList({
        current: 1,
        size: 1000
      }).then((res) => {
        if (res.code == 0) {
          this.$data.allRelation = res.data.records
        }
      })

      // 根据contractId 调取现在的供应商
      Purchase.getSupplierByContractId({
        contractId: obj.contractId
      }).then((res) => {
        if (res.code == 0) {
          this.$nextTick(function() {
            // this.$data.relationData = res.data
            // console.log(res.data)
            const arrData = res.data
            arrData.map((cur, index) => {
              this.$data.relationData.push(cur.supplierId)
            })
            // console.log(this.$data.relationData)
          })
        }
      })
    },
    // 已关联供应商弹窗,查询供应商
    relationed(obj) {
      if (obj.relationCount > 0) {
        this.$data.currentId = obj.contractId
        this.$data.relationedVisible = true
        Purchase.getSupplierByContractId({
          contractId: obj.contractId
        }).then((res) => {
          if (res.code == 0) {
            this.$nextTick(function() {
              this.$data.relationedData = res.data
            })
          }
        })
      } else {
        this.$Message({
          type: 'info',
          content: this.$t('purchase.noRelateNow')
        })
      }
    },
    handleCloseTag(removedTag) {
      const tags = this.$data.relationedData.filter((tag) => tag !== removedTag)
      // console.log(tags);
      this.$data.relationedData = tags
      this.$data.deleteRelationedData.push(removedTag.supplierId)
      // console.log(this.$data.deleteRelationedData)
      // console.log(this.$data.relationedData)
    },
    // 提交删除关联的供应商[]
    goRelation() {
      Purchase.deleteSupplier({
        contractId: this.$data.currentId,
        supplierIs: this.$data.deleteRelationedData
      }).then((res) => {
        if (res.code == 0) {
          this.$data.relationedVisible = false
          this.$data.deleteRelationedData = []
          this.loadData()
        }
      })
    },
    // 关联新的供应商[]
    goRelationGsy() {
      Purchase.relatedSupplier({
        contractId: this.$data.currentId,
        supplierIs: this.$data.relationData2
      }).then((res) => {
        if (res.code == 0) {
          this.$data.relationVisible = false
          this.$data.relationData = []
          this.loadData()
        }
      })
    },
    handleChange22(value) {
      console.log(`selected ${value}`)
      this.$data.relationData2 = value
    }
  }
}
</script>

<style lang="scss" scoped>
.me-contract {
  padding: 10px;
  .me-contract--bar {
    background: #fff;
    padding: 10px;
    margin-bottom: 10px;
    .add {
      .me-contract--bar--add {
        background: #00cc00;
        color: #fff;
        float: right;
      }
      .me-contract--bar--add:hover,
      :focus {
        background: #00cc00;
        color: #fff;
        border-color: #00cc00;
      }
    }
  }
}
.me-contract--table {
  padding: 10px;
  background: #fff;
  .btn {
    margin: 0px 5px;
    color: #0099ff;
    &.delete {
      color: red;
    }
  }
}
.me-contract--dialog {
  h2 {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  h3 {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  span.title {
    float: right;
    padding-right: 5px;
    &.mr10 {
      margin-right: 10px;
    }
  }
}
.me-contract--dialog--line {
  height: 1px;
  margin-bottom: 10px;
  border-bottom: 1px solid #a8a7a7;
}
.ant-checkbox-group {
  .ant-checkbox-wrapper {
    margin-left: 0px !important;
  }
}
.ant-form-explain {
  padding-left: 30px !important;
}
.me-contract--relationed {
  // margin-top: 20px;
}
// .me-contract--relation span {
//   background: #f2f4f5;
//   border-radius: 3px;
//   padding: 2px;
//   border: 1px solid #dcdcdc;
//   height: 25px;
//   display: inline-block;
//   margin-right: 5px;
// }
</style>

