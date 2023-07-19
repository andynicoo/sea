<!--addroder -->
<template>
  <div>
    <div class="order-table-header" v-if="tableData.length > 0">
      <span class="header" v-for="(item, index) in tableData" :key="index" :style="item.style ? item.style : ''">
        {{ item.label }}
      </span>
      <span class="header">操作</span>
    </div>

    <el-form :model="orderTableDataListform" ref="orderTableDataListform">
      <div class="item" v-for="(item, index) in orderTableDataListform.orderTableDataList" :key="index">
        <el-row :style="custiomWidth ? custiomWidth : ''" v-if="type == 2" class="input-list">
          <el-col class="pd-right-1" :span="3">
            <el-form-item :prop="'orderTableDataList.' + index + '.picUrl'">
              <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false" :on-success="(filelist) => uploadSuccess(filelist, item)" :on-error="(filelist) => onUploadError(filelist, item)" :on-remove="(filelist) => onUploadRemove(filelist, item)">
                <img v-if="item.picUrl" :src="item.picUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col class="pd-right-1" :span="4">
            <el-form-item :prop="'orderTableDataList.' + index + '.platformName'" :rules="[{ required: true, message: '请填写平台名称', trigger: 'blur' }]">
              <el-input v-model="item.platformName" placeholder="请输入平台名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="pd-right-1" :span="4">
            <el-form-item :prop="'orderTableDataList.' + index + '.info'" :rules="[{ required: true, message: '请输入描述', trigger: 'blur' }]">
              <el-input v-model="item.info" placeholder="请输入描述"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :prop="'orderTableDataList.' + index + '.url'" :rules="[{ required: true, validator: rules.validaHttps, trigger: 'blur' }]">
              <el-input v-model="item.url" placeholder="请输入http或者https开头的完整链接"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item :prop="'orderTableDataList.' + index + '.sort'">
              <center><el-input-number v-model="item.sort" label="排序"></el-input-number></center>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :style="custiomWidth ? custiomWidth : ''" v-else class="input-list">
          <el-col :span="4" :style="type != 1 ? (tableData ? tableData[0].style : '') : ''">
            <el-form-item :prop="'orderTableDataList.' + index + '.countryCode'" :rules="[{ required: true, message: '请选择国家', trigger: 'blur' }]">
              <el-select class="input-list-width-130" @change="(val) => getproductList(val, item, index)" v-model="item.countryCode" filterable placeholder="请选择">
                <el-option v-for="item in options.countryList" clearable filterable :key="item.id" :label="item.countryNameZh" :value="item.countryCode"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :style="type != 1 ? (tableData ? tableData[1].style : '') : ''">
            <el-form-item :prop="'orderTableDataList.' + index + '.productId'" :rules="[{ required: true, message: '请选择服务商品', trigger: 'blur' }]">
              <el-select filterable class="input-list-width-265" @change="(val) => setProduct(val, index, item)" v-model="item.productId" placeholder="请选择">
                <el-option v-for="item in item.productList" :key="item.id" :label="item.productName" :value="item.id"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="4" :style="type != 1 ? (tableData ? tableData[2].style : '') : ''">
            <el-form-item :prop="'orderTableDataList.' + index + '.sort'">
              <el-input-number v-model="item.sort" label="排序"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col v-if="type == 1" :span="2">
            <el-form-item :prop="'orderTableDataList.' + index + '.status'">
              <center>
                <el-switch v-model="item.status" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
              </center>
            </el-form-item>
          </el-col>
          <el-col :span="4" :style="type != 1 ? (tableData ? tableData[3].style : '') : ''">
            <el-form-item :prop="'orderTableDataList.' + index + '.label'" :rules="[{ required: true, message: '请选择标签', trigger: 'blur' }]">
              <el-select class="input-list-width-130" v-model="item.label" placeholder="请选择">
                <el-option v-for="item in options.sign" :key="item.value" clearable filterable :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div>
          <el-link type="primary" @click="emptyItem(index)">清空</el-link>
          <el-link type="primary" @click="delectItem(index)">移除</el-link>
        </div>
      </div>

      <el-link type="primary" :disabled="addOrderDisabled" @click="clickAddOrderItem">{{ addItemBtnName }}</el-link>
    </el-form>
  </div>
</template>

<script>
import UploadImage from '@/components/UploadImages/index'; //上传图片组件
import { getCountrySelectList } from '@/api/newApi/common.js';
import { getproductInfoList, clientProductInfoList } from '@/api/newApi/servicemerchant/serviceMerchant.js';
import { validaHttps } from '@/view/module/siteSettings/libs/setttingLibs.js';
export default {
  components: { UploadImage },
  name: 'AddOrderItem',
  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Array,
      default: () => [],
    },
    serviceKey: Object,
    addItemBtnName: {
      type: String,
      default: '+添加子菜单',
    },
    custiomWidth: String,
    type: {
      //1 产品服务 2 优选服务
      type: Number,
      default: 0,
    },
  },

  model: {
    prop: 'value', // props默认是value
    event: 'change', // 事件名默认是input
  },

  watch: {
    value: {
      handler: function (val) {
        this.$emit('getOrderItem', { parentNode: this.serviceKey, value: val, from: this.orderTableDataListform });
      },
      deep: true,
      immediate: true,
    },
  },

  data() {
    return {
      uploadUrl: this.baseUrl + '/file/oss/upload',
      options: {
        sign: [
          {
            label: '不使用标签',
            value: '1',
          },
          {
            label: '热门',
            value: '2',
          },
          {
            label: '最新',
            value: '3',
          },
          {
            label: '限时秒杀',
            value: '4',
          },
        ],
        countryList: [],
      },
      from: {
        countryName: '',
        label: '不使用标签',
        productId: '',
        sort: 1,
        status: true,
        platformName: '',
        info: '',
        url: '',
        picUrl: '',
        productList: [],
      },
      addOrderDisabled: false,
      orderTableDataListform: {
        orderTableDataList: this.value,
      },
      rules: {
        validaHttps,
      },
    };
  },

  created() {
    this.getCountrySelectListAPi();
  },

  mounted() {
    if (this.value.length) {
      this.value.forEach((item, index) => {
        this.getproductList(item.countryCode, item, index, false);
      });
    }
  },
  methods: {
    /** 服务商品列表 */
    getproductList(countryCode, item, index, empty = true) {
      if (empty) item.productId = '';
      clientProductInfoList({ countryCode: countryCode, client: 'PC', size: 100, current: 1, productStatus: 'PENDED_PUBLISH' })
        .then((res) => {
          if (res.code == 0) {
            item.productList = res.data.records;
            this.$set(this.orderTableDataListform.orderTableDataList, index, item);
            this.$forceUpdate();
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },

    setProduct(val, index, item) {
      item.productId = val;
      this.$set(this.orderTableDataListform.orderTableDataList, index, item);
    },
    /**国家 api */
    async getCountrySelectListAPi() {
      let { code, data } = await getCountrySelectList();
      if (code == 0) this.options.countryList = data;
    },

    delectItem(index) {
      this.orderTableDataListform.orderTableDataList.splice(index, 1);
    },

    clickAddOrderItem() {
      // if (this.orderTableDataListform.orderTableDataList.length == 10) {
      //   this.addOrderDisabled = true;
      // } else {
        this.orderTableDataListform.orderTableDataList.push({ ...this.from });
      // }
    },

    emptyItem(index) {
      this.orderTableDataListform.orderTableDataList.splice(index, 1, { ...this.from });
    },

    uploadSuccess(filelist, item) {
      item.picUrl = filelist.data.fileUrl;
    },

    onUploadRemove(filelist) {
      item.picUrl = filelist.data.fileUrl;
    },

    sumbit(callback) {
      this.$refs['orderTableDataListform'].validate((valid) => {
        callback({ valid, ...this.orderTableDataListform });
      });
    },
  },
};
</script>
<style lang="less" scoped>
.order-table-header {
  height: 40px;
  line-height: 40px;
  width: 100%;
  background-color: rgba(244, 244, 244, 1);
  .header {
  }
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.input-list {
  padding-top: 20px;
  width: 720px;
  align-items: center;
  .input-list-width-130 {
    width: 130px;
  }

  .input-list-width-265 {
    width: 270px;
  }

  .input-list-width-55 {
    width: 55px;
  }
}
.pd-right-1 {
  padding-right: 1%;
}
</style>
