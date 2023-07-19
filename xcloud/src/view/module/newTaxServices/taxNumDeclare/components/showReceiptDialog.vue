<template>
  <el-dialog title="回执" :visible.sync="dialogvisible" :modal-append-to-body="false" width="400px">
    <div class="row-title">申报回执：</div>
    <el-row type="flex">
      <el-col :span="12" v-for="(item, index) in imgList" :key="index" style="text-align: center; margin-bottom: 5px">
        <el-link :href="item.replace('http://', 'https://')" target="_blank" type="primary" :underline="false"> <i class="el-icon-search"></i>查看回执 </el-link>
      </el-col>
    </el-row>
    <div class="row-title">其他回执与通知：</div>
    <el-row type="flex" v-if="debitReceipt">
      <el-col :span="12" style="text-align: center">
        <el-link type="primary" :underline="false" @click="download"> <i class="el-icon-search"></i>下载回执 </el-link>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogvisible = false">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { downloadReceipt } from '@/api/newApi/taxServices/taxNumDeclare.js';
export default {
  props: {
    showReceiptImgModel: Boolean,
    declareReceipt: String,
    debitReceipt: String,
    id: String,
  },
  data() {
    return {};
  },
  computed: {
    dialogvisible: {
      get() {
        return this.showReceiptImgModel;
      },
      set(val) {
        this.$emit('update:showReceiptImgModel', val);
      },
    },
    imgList() {
      if (!this.declareReceipt) {
        return [];
      }
      let imgList = [];
      if (this.declareReceipt.indexOf(',') !== -1) {
        imgList = this.declareReceipt.split(',');
      } else if (this.declareReceipt.indexOf(';') !== -1) {
        imgList = this.declareReceipt.split(';');
      } else {
        imgList = [this.declareReceipt];
      }
      return imgList;
    },
  },
  methods: {
    download() {
      downloadReceipt(this.id).then((res) => {
        this.$util.exportFile(res);
      });
    },
  },
};
</script>

<style lang="less" scoped>
.row-title {
  margin: 10px 0;
}
</style>
