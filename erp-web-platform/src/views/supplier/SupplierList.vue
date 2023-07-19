<template>
  <div class="pa-2">
    <v-card>
      <v-card-text>
        <v-row>
          <v-col md="2" xl="1">
            <v-select
              :items="statusItems"
              label="状态"
              v-model="status"
            ></v-select>
          </v-col>
          <v-col md="2" xl="1">
            <v-select
              :items="paymentModelItems"
              label="付款方式"
              v-model="paymentMethod"
            ></v-select>
          </v-col>

          <v-col md="3" xl="2" offset-xl="7" offset-md="4">
            <v-text-field
              label="关键字"
              hint="供应商名称、采购员"
              persistent-hint
              v-model="name"
            >
              <template v-slot:append-outer>
                <v-btn @click="loadData" small color="primary">搜索</v-btn>
              </template>
            </v-text-field>
          </v-col>
          <v-col md="1" xl="1" align-self="center">
            <v-btn
              @click="$router.push('/supplier/add-edit-supplier')"
              block
              small
              color="success"
            >
              添加供应商
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card class="mt-2">
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="desserts"
          hide-default-footer
          disable-sort
          item-key="id"
          :items-per-page="paginationData.size"
        >
          <template v-slot:[`item.purchaseNamePaymentMethod`]="{ item }">
            {{ item.purchaseName }},{{
              getPaymentMethod(item.paymentMethod).text
            }}
          </template>

          <template v-slot:[`item.purchaseCount`]="{ item }">
            {{ item.skuCount }},{{ item.purchaseCount }}
          </template>

          <template v-slot:[`item.namePhone`]="{ item }">
            {{ item.name }}/{{ item.mobile }}
          </template>

          <template v-slot:[`item.status`]="{ item }">
            <span v-if="item.status" class="success--text"> 启用 </span>
            <span v-else class="error--text"> 停用 </span>
          </template>

          <template v-slot:[`item.options`]="{ item }">
            <div>
              <template v-if="item.status">
                <v-btn
                  @click="switchStatus(item, 0)"
                  text
                  small
                  color="primary"
                >
                  停用
                </v-btn>
              </template>
              <template v-else>
                <v-btn
                  @click="switchStatus(item, 1)"
                  text
                  small
                  color="primary"
                >
                  启用
                </v-btn>
              </template>
              <v-btn
                @click="
                  $router.push(`/supplier/add-edit-supplier?id=${item.id}`)
                "
                text
                small
                color="primary"
              >
                编辑
              </v-btn>
              <v-btn @click="onDelete(item)" text small color="error">
                删除
              </v-btn>
            </div>
            <div>
              <v-btn text small color="primary">关联商品</v-btn>
              <v-btn text small color="primary">关联商品采购</v-btn>
            </div>
          </template>
        </v-data-table>

        <Pagination
          :paginationData="paginationData"
          @change="changePage"
        ></Pagination>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import Supplier from '@/api/supplier'
import tableMixins from '@/mixins/tableMixins'
import {
  paymentMethodItems,
  collectionMethodItems,
  statusItems
} from './AddEditSupplier'
export default {
  mixins: [tableMixins],
  data() {
    return {
      status: null,
      paymentMethod: null,
      name: null,

      statusItems: [{ text: '全部', value: null }, ...statusItems],

      paymentModelItems: [{ text: '全部', value: null }, ...paymentMethodItems],

      headers: [
        { text: '供应商', value: 'supplierName' },
        { text: '1688供应商/链接', value: 'supplierUrl' },
        { text: '采购员,付款方式', value: 'purchaseNamePaymentMethod' },
        { text: '联系人/联系电话', value: 'namePhone' },
        { text: '地址', value: 'address' },
        { text: '关联SKU数量,采购次数', value: 'purchaseCount' },
        { text: '创建时间,最近采购时间', value: 'createTime' },
        { text: '备注', value: 'remark' },
        { text: '状态', value: 'status' },
        { text: '操作', value: 'options', align: 'center' }
      ]
    }
  },
  methods: {
    getTableData() {
      const { paginationData, status, paymentMethod, name } = this.$data
      return Supplier.getSupplierList({
        ...paginationData,
        status,
        paymentMethod,
        name
      })
    },
    switchStatus(ele, status) {
      Supplier.editSupplierStatus({ id: ele.id, status }).then(
        ({ code, message }) => {
          this.loadData()
        }
      )
    },
    getPaymentMethod(item) {
      return paymentMethodItems.filter(({ value }) => value === item)[0]
    },
    onDelete({ id }) {
      this.$Modal.confirm({
        title: '提示',
        content: '确定要删除供应商吗',
        okText: '确认',
        onOk: async () => {
          const { code, message } = await Supplier.delSupplier(id)
          if (code === 0) {
            this.$Message({ type: 'success', content: '请求成功' })
          } else {
            this.$Message({ type: 'error', content: `请求失败:${message}` })
          }
          this.onReload()
        },
        onCancel: () => {}
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.col {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
