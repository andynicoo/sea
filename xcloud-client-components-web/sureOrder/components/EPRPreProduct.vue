<template>
  <div>
    <span v-if="isDEWeee" class="primary-color" @click="onOpen">
      【查看{{year}}年产品信息】
    </span>
    <a-modal v-model="dialog" :title="year+'年产品信息'" :width="1000" class="online-pay-modal" :footer="null" >
      <div class="product-title ">WEEEE产品信息</div>
      <a-table :columns="columns" :data-source="tableData" :no-data-text="'暂无数据'" :loading="loading"  bordered :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"> </a-table>
    </a-modal>
  </div>
</template>

<script>
import { getEprHistoryInfo } from '../../api/eprManage'
import moment from 'moment'
export default {
  props: {
    item: Object,
  },
  data() {
    return {
      dialog: false,
      columns: [
        { title: '产品类别', dataIndex: 'productCategory', width: 170 },
        { title: '产品名称(中/英文)', dataIndex: 'productName', width: 170 },
        { title: '对应的品牌LOGO', dataIndex: 'productLogo', width: 170 },
        { title: '单边最大尺寸/cm', dataIndex: 'sideMaxSize', width: 100 },
        { title: '预计当年销售总重量(KG)', dataIndex: 'saleWeight', width: 100 },
      ],
      tableData: [],
      loading: false
    };
  },
  computed: {
    year(){
      return moment(this.item.renewLastTime).subtract(1, 'year').format('YYYY')
    },
    isDEWeee() {
      return this.item.productFunctionCode === 3108 && this.item.countryCode === 'DE'
    }
  },
  async created(){
    if(!this.isDEWeee) return
    this.loading = true
    const res = await getEprHistoryInfo({serviceId: this.item.serviceId, year: this.year}).finally(()=>{
      this.loading = false
    })
    this.tableData = res.data
  },
  methods: {
    onOpen() {
      this.dialog = true
    },
    hideModal(){
      this.dialog = false
    }
  },
};
</script>

<style lang="less" scoped>
.product-title {
  margin-bottom: 20px;
  font-weight: 700;
}
.primary-color {
  color: @primary-color;
  cursor: pointer;
}



















</style>
