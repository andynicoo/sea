<template>
  <el-dialog title="备注信息" :visible.sync="dialogvisible" width="495px">
    <template v-if="listRemark.length > 0">
      <div class="remarlist">
          <div class="content" v-for="(item, index) in listRemark" :key="index">
            <p>
              <span class="text-desc"> 备注人：</span> {{ item.remarkBy }}
              <i class="el-icon-circle-close text-desc" @click="delet(item, index)"></i>
            </p>
            <p>
              <span class="text-desc">备注内容：</span>{{ item.remarkComment }}</p>
            <p>
             <span class="text-desc"> 附件：</span>
              <a :href="item.annex"  :underline="false" target="_blank" class="text-primary file">{{ item.annex }}</a>
            </p>
            <p><span class="text-desc">备注时间：</span>{{ item.createTime }}</p>
          </div>
        </div>
    </template>
    <div class="text-info" v-else style="text-align: center">暂无备注</div>
    <div slot="footer" style="text-align: center">
      <el-button style="width: 65px" type="primary" @click="dialogvisible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { seelistRemark, deleteRemark } from "@/api/newApi/taxServices/serviceManage.js";
export default {
  props: {
    checkRemarkDialog: Boolean,
    serviceNo: String,
    queryData: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      listRemark: [],
      formLabelWidth: "120px"
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.checkRemarkDialog;
      },
      set(val) {
        this.$emit("update:checkRemarkDialog", val);
      }
    }
  },
  watch:{
    dialogvisible:{
       handler(newVal, oldVal) {
        if (newVal) {
            this.seeRemark();
        }
      }
    }
  },
  created() {
  },
  methods: {
    //获取备注列表
    seeRemark() {
      console.log(111111111111);
      seelistRemark({ serviceNo: this.serviceNo })
        .then(res => {
          if (res.code == 0) {
            this.listRemark = res.data;
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    /** 删除备注 */
    delet(item, index) {
      deleteRemark(item.id)
        .then(res => {
          if (res.code == 0) {
            this.$message.success("删除成功");
            this.listRemark.splice(index, 1);
            this.queryData();
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    }
  }
};
</script>

<style scoped lang="scss">
.el-icon-circle-close  {
  font-size: 24px;
  cursor: pointer;
  float: right;
}
.remarlist{
 max-height:440px;
 overflow: auto;
  .content{
    width: 375px;
    margin: 0 auto 15px;
    border: 1px solid #EEEEEE;
    padding: 20px;
    p{
     line-height: 28px;
    }
    .file{
      width:200px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
     display: inline-block;
     vertical-align: middle;
    }
  }
}
</style>
