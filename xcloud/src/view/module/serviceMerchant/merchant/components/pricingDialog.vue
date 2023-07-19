<template>
  <el-dialog title="录入竞品价格" :visible.sync="dialogvisible" width="800px" center @close="reset" destroy-on-close>
    <div>
      <h5 style="margin-bottom:10px">服务名称：{{ rowData.productName }}</h5>
      <el-table border :data="rowData.productSkuVOList" :max-height="600" class="table">
        <el-table-column align="center" label="服务项目" prop="skuName">
          <template slot-scope="scope">
            <span>{{ scope.row.skuName || rowData.productName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="销售价" prop="price"></el-table-column>
        <el-table-column align="left" label="竞品价格" width="400">
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.productInfoSkuCompetitions" :key="index">
              <el-input
                v-model="item.companyName"
                placeholder="请输入公司名称"
                size="mini"
                style="width:150px;margin-right:5px"
              ></el-input>
              <el-input
                v-model="item.competitionPrice"
                placeholder="请输入竞品价格"
                type="number"
                size="mini"
                :min="0"
                maxlength="11"
                style="width:170px"
              >
                <template slot="append">元</template>
              </el-input>
              <el-button
                type="text"
                icon="el-icon-circle-plus"
                @click="addCompetitor(scope.row)"
                style="margin-left:10px;color: green;"
              ></el-button>
              <el-button
                v-if="index !== 0"
                type="text"
                icon="el-icon-remove"
                @click="removeCompetitor(scope.row, index)"
                style="color:red"
              ></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addProductInfoSkuCompetitionApi } from '@/api/newApi/servicemerchant/serviceMerchant.js'
export default {
  props: {
    pricingDialog: Boolean,
    rowData: {
      type: Object,
      default: () => {
        return {
          productSkuVOList: []
        }
      }
    }
  },
  data () {
    return {}
  },
  computed: {
    dialogvisible: {
      get () {
        return this.pricingDialog
      },
      set (val) {
        this.$emit('update:pricingDialog', val)
      }
    }
  },
  created () {},
  watch: {
    pricingDialog (val) {
      if (val) {
        this.rowData.productSkuVOList.map(item => {
          item.skuName = item.skuName.replace(';', '')
          if (item.productInfoSkuCompetitions.length === 0) {
            item.productInfoSkuCompetitions = [
              {
                companyName: '',
                competitionPrice: undefined,
                productSkuId: item.skuId
              }
            ]
          }
        })
      }
    }
  },
  methods: {
    reset () {
      if (this.$refs.pricingDialog) {
        this.$refs.pricingDialog.resetFields()
      }
    },
    addCompetitor (row) {
      row.productInfoSkuCompetitions.push({
        companyName: '',
        competitionPrice: undefined,
        productSkuId: row.skuId
      })
    },
    removeCompetitor (row, index) {
      row.productInfoSkuCompetitions.splice(index, 1)
    },
    submit () {
      let productInfoSkuList = this.rowData.productSkuVOList.map(item => {
        return item.productInfoSkuCompetitions.map(item => {
          return {
            companyName: item.companyName,
            competitionPrice: Number(item.competitionPrice),
            productSkuId: item.productSkuId
          }
        })
      })
      let params = {
        productId: this.rowData.productId,
        productInfoSkuCompetitionDTOList: [...productInfoSkuList.flat(1)]
      }
      this.addProductInfoSkuCompetition(params)
    },
    addProductInfoSkuCompetition (data) {
      addProductInfoSkuCompetitionApi(data).then(res => {
        if (res.code === 0) {
          this.dialogvisible = false,
          this.$emit('refresh')
          this.$message.success('添加成功')
        } else {
          this.$message.error(res.message)
        }
      })
    }
  }
}
</script>

<style></style>
