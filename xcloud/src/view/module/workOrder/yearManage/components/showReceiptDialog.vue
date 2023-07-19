<template>
  <el-dialog title="回执" :visible.sync="dialogvisible" width="400px">
    <div class="row-title">申报回执：</div>
    <el-row type="flex">
      <el-col :span="12" v-for="(item,index) in imglist" :key="index" style="text-align: center;margin-bottom: 5px">
        <el-link :href="item.replace('http://', 'https://')" target="_blank" type="primary" :underline="false">
          <i class="el-icon-search"></i>查看回执
          </el-link>
        </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  props: {
    showReceiptImgModel:Boolean,
    imglist:Array
  },
  data(){
    return{

    }
  },
  computed: {
    dialogvisible: {
      get() {
        console.log('?')
        return this.showReceiptImgModel;
      },
      set(val) {
        this.$emit("update:showReceiptImgModel", val);
      }
    }
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.row-title {
  margin: 10px 0;
}
</style>