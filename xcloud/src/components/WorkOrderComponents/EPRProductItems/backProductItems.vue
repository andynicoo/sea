<template>
  <div>
    <el-form :model="form" :rules="rules" ref="form" id="form" :disabled="disabled">
      <el-table
        border
        :data="form.eprBacktrackingProductDtos"
        style="margin: 20px 0"
        highlight-current-row
      >
        <el-table-column min-width="150px" align="center" label="* Product Name/产品名称（注：产品名称，请中英文填写）" prop="productName">
          <template slot-scope="scope">
            <el-form-item :prop="'eprBacktrackingProductDtos.'+scope.$index + '.productName'" :rules="baseRule">
              <el-input
                v-model="scope.row.productName"
                clearable
                size="small"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column min-width="150px" align="center" label="* Unit number/回溯申报数量（注：请填写自然年的预计销售数量，单位默认为“个”）" prop="unitNumber">
          <template slot-scope="scope">
            <el-form-item :prop="'eprBacktrackingProductDtos.'+scope.$index + '.unitNumber'" :rules="baseRule">
              <el-input
                v-model="scope.row.unitNumber"
                clearable
                size="small"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column min-width="150px" align="center" label="* Net weight/单位重量（注：请填写单个产品的重量，单位默认为“KG”）" prop="netWeight">
          <template slot-scope="scope">
            <el-form-item :prop="'eprBacktrackingProductDtos.'+scope.$index + '.netWeight'" :rules="baseRule">
              <el-input
                v-model="scope.row.netWeight"
                clearable
                size="small"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column min-width="150px" align="center" label="Price code Ecologic/产品代码" prop="priceCodeEcologic">
          <template slot-scope="scope">
            <el-form-item :prop="'eprBacktrackingProductDtos.'+scope.$index + '.priceCodeEcologic'" >
              <el-input
                v-model="scope.row.priceCodeEcologic"
                clearable
                size="small"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column min-width="150px" align="center" label="unit eco-fee/单位回收费用注：单位默认“欧元”" prop="unitEcoFee">
          <template slot-scope="scope">
            <el-form-item :prop="'eprBacktrackingProductDtos.'+scope.$index + '.unitEcoFee'">
              <el-input
                v-model="scope.row.unitEcoFee"
                clearable
                size="small"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column min-width="150px" align="center" label="Total fee/合计回收费用（=申报数量*单位回收费用）" prop="totalFee">
          <template slot-scope="scope">
            <el-form-item :prop="'eprBacktrackingProductDtos.'+scope.$index + '.totalFee'">
              <el-input
                v-model="scope.row.totalFee"
                clearable
                size="small"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="100px" fixed="right" v-if="!showOnly">
          <template slot-scope="scope">
            <el-link type="primary" @click="addItem(scope.$index)" :disabled="disabled">添加</el-link>
            <el-link type="primary" @click="delItem(scope.$index)" :disabled="disabled" v-if="form.eprBacktrackingProductDtos.length>1">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
import UploadFile from "@/components/UploadFile/index";
export default {
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: true
    },
    showOnly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      item: {
        productName: '',
        unitNumber: '',
        netWeight: '',
        priceCodeEcologic: '',
        unitEcoFee: '',
        totalFee: '',
      },
      form: {
        eprBacktrackingProductDtos: []
      },
      baseRule: {required: true, message: '请输入', trigger: 'blur'},
      rules: {
        productName: [this.baseRule],
        unitNumber: [this.baseRule],
        netWeight: [this.baseRule],
        // priceCodeEcologic: [this.baseRule],
        // unitEcoFee: [this.baseRule],
        // totalFee: [this.baseRule],
      }
    }
  },
  components: {
    UploadFile
  },
  watch: {
    value: {
      handler(val) {
        if(val && val.length) {
          this.form.eprBacktrackingProductDtos = val
        }
      },
      immediate: true
    },
    'form.eprBacktrackingProductDtos': {
      handler() {
        for(let i=0; i<this.form.eprBacktrackingProductDtos.length; i++) {
          let item = this.form.eprBacktrackingProductDtos[i]
          if(item['productName'] === ''||item['unitNumber'] === ''||item['netWeight'] === '') {
            this.$emit('input', [])
            return
          }
        }
        if(!this.form.eprBacktrackingProductDtos.length) {
            this.addItem(0)
        }
        let data = this.form.eprBacktrackingProductDtos.map(item => ({
          ...item
        }))
        this.$emit('input', data)
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    addItem(index) {
      this.form.eprBacktrackingProductDtos.splice(index+1, 0, {...this.item})
      this.$set(this.form, 'eprBacktrackingProductDtos', this.form.eprBacktrackingProductDtos)
    },
    delItem(index) {
      this.form.eprBacktrackingProductDtos.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-input {
  width: 120px !important;
}
::v-deep .el-input__inner {
  width: 120px !important;
}
::v-deep .el-upload__text {
  white-space: nowrap;
}
</style>