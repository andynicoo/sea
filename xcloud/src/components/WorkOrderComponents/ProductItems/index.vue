<template>
  <div>
    <el-form :model="form" :rules="rules" ref="form" id="form" :disabled="disabled">
      <el-table
        border
        :data="form.productInfo"
        style="margin: 20px 0"
        highlight-current-row
      >
        <el-table-column min-width="150px" align="center" label="* Product Name/中文名称" prop="productName">
          <template slot-scope="scope">
            <el-form-item :prop="'productInfo.'+scope.$index + '.productName'" :rules="baseRule">
              <el-input
                v-model="scope.row.productName"
                clearable
                size="small"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column min-width="150px" align="center" label="* Brand" prop="brand">
          <template slot-scope="scope">
            <el-form-item :prop="'productInfo.'+scope.$index + '.brand'" :rules="baseRule">
              <el-input
                v-model="scope.row.brand"
                clearable
                size="small"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column min-width="150px" align="center" label="* Models" prop="models">
          <template slot-scope="scope">
            <el-form-item :prop="'productInfo.'+scope.$index + '.models'" :rules="baseRule">
              <el-input
                v-model="scope.row.models"
                clearable
                size="small"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column min-width="150px" align="center" label="* Classification" prop="classification">
          <template slot-scope="scope">
            <el-form-item :prop="'productInfo.'+scope.$index + '.classification'" :rules="baseRule">
              <el-input
                v-model="scope.row.classification"
                clearable
                size="small"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column min-width="150px" align="center" label="CE证书" prop="ceCertificat">
          <template slot-scope="scope">
            <UploadFile
              :fileList.sync="scope.row.ceCertificat"
              fileClass
              uploadText="点击上传"
              :showTip="false"
              v-if="!showOnly"
            ></UploadFile>
            <span v-else>
              <span v-if="scope.row.ceCertificat.length">
                <el-link type="primary" target="_blank" v-for="(file, i) in scope.row.ceCertificat" :key="i" :href="file.url" style="margin-left: 0">CE证书</el-link>
              </span>
              <span v-else>-</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column min-width="150px" align="center" label="产品检测报告" prop="productTestReportCertificat">
          <template slot-scope="scope">
            <UploadFile
              :fileList.sync="scope.row.productTestReportCertificat"
              fileClass
              uploadText="点击上传"
              :showTip="false"
              v-if="!showOnly"
            ></UploadFile>
            <span v-else>
              <span v-if="scope.row.productTestReportCertificat.length">
                <el-link type="primary" target="_blank" v-for="(file, i) in scope.row.productTestReportCertificat" :key="i" :href="file.url" style="margin-left: 0">产品检测报告</el-link>
              </span>
              <span v-else>-</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column min-width="150px" align="center" label="UKCA证书" prop="ukcaCertificat">
          <template slot-scope="scope">
            <UploadFile
              :fileList.sync="scope.row.ukcaCertificat"
              fileClass
              uploadText="点击上传"
              :showTip="false"
              v-if="!showOnly"
            ></UploadFile>
            <span v-else>
              <span v-if="scope.row.ukcaCertificat.length">
                <el-link type="primary" target="_blank" v-for="(file, i) in scope.row.ukcaCertificat" :key="i" :href="file.url" style="margin-left: 0">UKCA证书</el-link>
              </span>
              <span v-else>-</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column min-width="150px" align="center" label="其他产品文件" prop="productCertificat">
          <template slot-scope="scope">
            <UploadFile
              :fileList.sync="scope.row.productCertificat"
              fileClass
              uploadText="点击上传"
              :showTip="false"
              :limit="Infinity"
              v-if="!showOnly"
            ></UploadFile>
            <span v-else>
              <span v-if="scope.row.productCertificat.length">
                <el-link type="primary" target="_blank" v-for="(file, i) in scope.row.productCertificat" :key="i" :href="file.url" style="margin-left: 0">其他产品文件</el-link>
              </span>
              <span v-else>-</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="100px" fixed="right" v-if="!showOnly">
          <template slot-scope="scope">
            <el-link type="primary" @click="addItem(scope.$index)" :disabled="disabled">添加</el-link>
            <el-link type="primary" @click="delItem(scope.$index)" :disabled="disabled" v-if="form.productInfo.length>1">删除</el-link>
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
        brand: '',
        models: '',
        classification: '',
        ceCertificat: [],
        productTestReportCertificat: [],
        ukcaCertificat: [],
        productCertificat: []
      },
      form: {
        productInfo: []
      },
      baseRule: {required: true, message: '请输入', trigger: 'blur'},
      rules: {
        productName: [this.baseRule],
        brand: [this.baseRule],
        models: [this.baseRule],
        classification: [this.baseRule]
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
          this.form.productInfo = val.map(item =>({
            productName: item.productName,
            brand: item.brand,
            models: item.models,
            classification: item.classification,
            ceCertificat: this.reviewFile(item.ceCertificat, 'CE证书'),
            productTestReportCertificat: this.reviewFile(item.productTestReportCertificat, '产品检测报告'),
            ukcaCertificat: this.reviewFile(item.ukcaCertificat, 'UKCA证书'),
            productCertificat: this.reviewFile(item.productCertificat, '其他产品文件')
          }))
        }
      },
      immediate: true
    },
    'form.productInfo': {
      handler() {
        if(!this.form.productInfo.length) {
          this.addItem()
        }
        for(let i=0; i<this.form.productInfo.length; i++) {
          let item = this.form.productInfo[i]
          for(let j in item) {
            if(item[j] === '') {
              this.$emit('input', [])
              return
            }
          }
        }
        let data = this.form.productInfo.map(item => ({
          ...item,
          ceCertificat: this.dealFile(item.ceCertificat),
          productTestReportCertificat: this.dealFile(item.productTestReportCertificat),
          ukcaCertificat: this.dealFile(item.ukcaCertificat),
          productCertificat: this.dealFile(item.productCertificat)
        }))
        this.$emit('input', data)
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    dealFile(file) {
      return file.length?file.map(i => i.url).join(','):''
    },
    reviewFile(url, name) {
      let urlList = url?url.split(','):[]
      return urlList.map(item => ({
        url: item,
        name
      }))
    },
    addItem(index=0) {
      this.form.productInfo.splice(index+1, 0, {...this.item})
      this.$set(this.form, 'productInfo', this.form.productInfo)
    },
    delItem(index) {
      this.form.productInfo.splice(index, 1)
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