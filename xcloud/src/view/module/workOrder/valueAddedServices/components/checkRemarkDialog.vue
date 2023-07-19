<template>
  <el-dialog title="备注信息" :visible.sync="dialogvisible" width="494px" @close="close" center>
    <template v-if="list.length">
      <div class="content">
        <div v-for="(item, index) in list" :key="item.id" class="content-block">
          <i class="el-icon-circle-close" @click="del(item.id, index)"></i>
          <div class="block-item">
            <div class="block-item-title">备注人：</div>
            <div>{{ item.remarkBy }}</div>
          </div>
          <div class="block-item">
            <div class="block-item-title">内容：</div>
            <div>{{ item.remark }}</div>
          </div>
          <!-- <div class="block-item" v-if="item.annex">
            <div class="block-item-title">附件：</div>
            
            <a
              :href="item.annex"
              target="_blank"
              style="width:85%"
              class="text-primary"
              >
              <i class="el-icon-document"></i>
              {{ item.annexName }}
            </a>
          </div> -->
          <div class="block-item">
            <div class="block-item-title">时间：</div>
            <div>{{ item.createTime }}</div>
          </div>
        </div>
      </div>
    </template>
    <div class="text-info" v-else style="text-align: center">暂无备注</div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { seelistRemark, deleteRemark } from '@/api/newApi/taxServices/serviceManage.js';
export default {
  props: {
    checkRemarkDialog: Boolean,
    serviceNo: String,
  },
  data() {
    return {
      list: [],
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.checkRemarkDialog;
      },
      set(val) {
        this.$emit('update:checkRemarkDialog', val);
      },
    },
  },
  watch: {
    dialogvisible() {
      if (this.dialogvisible && this.serviceNo) {
        this.getList();
      }
    },
  },
  methods: {
    getList() {
      seelistRemark({ serviceNo: this.serviceNo })
        .then((res) => {
          if (res.code == 0) {
            this.list = res.data;
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    /** 删除备注 */
    del(id, index) {
      deleteRemark(id)
        .then((res) => {
          if (res.code == 0) {
            this.$message.success('删除成功');
            this.list.splice(index, 1);
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    close() {
      this.$emit('refresh');
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  max-height: 500px;
  overflow-y: auto;
  padding: 0 35px;
  .content-block {
    padding: 20px;
    border: 1px solid #eeeeee;
    margin-bottom: 20px;
    .block-item {
      display: flex;
      margin-bottom: 10px;
      .block-item-title {
        color: #999;
        width: 60px;
        flex: 0 0 60px;
        white-space: nowrap;
      }
    }
  }
}
.el-icon-circle-close {
  cursor: pointer;
  float: right;
  margin-top: -9px;
  font-size: 16px;
  color: #999;
}
.el-icon-document {
  color: #666;
}
.block {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.el-icon-close {
  cursor: pointer;
}
</style>
>
