<template>
  <el-dialog
    title="交付时效"
    :visible.sync="dialogvisible"
    width="494px"
    center
  >
    <div class="content">
      <div v-for="(item, index) in remarkList" :key="index" class="content-block">
        <div class="block-item">
          <div class="block-item-title">内容：</div>
          <div>{{item.operation}}</div>
        </div>
        <div class="block-item">
          <div class="block-item-title">创建时间：</div>
          <div>{{item.createTime}}</div>
        </div>
        <div class="block-item">
          <div class="block-item-title">操作人：</div>
          <div>{{item.createName}}</div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogvisible = false" size="small">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {logList} from '@/api/newApi/limitData/deliverConfig'
export default {
  props: {
    detailDialog: Boolean,
    id: String,
  },
  data() {
    return {
      remarkList: []
    }
  },
  computed: {
    dialogvisible: {
      get() {
        return this.detailDialog;
      },
      set(val) {
        this.$emit("update:detailDialog", val);
      },
    },
  },
  watch: {
    dialogvisible(newVal) {
      if(newVal) {
        this.getLogList()
      }
    }
  },
  methods: {
    getLogList() {
      logList({
        entityId: this.id,
        logType: 'DURATION_CONFIG'
      }).then(res => {
        if(res.code === 0) {
          let data = res.data
          data.forEach(item => {
            try {
              item.createTime = item.createTime.substr(0, 16)
            } catch (error) {}
          })
          this.remarkList = res.data
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  max-height: 500px;
  overflow-y: auto;
  padding: 0 35px;
  .content-block {
    padding: 20px;
    border: 1px solid #EEEEEE;
    margin-bottom: 20px;
    .block-item {
      display: flex;
      margin-bottom: 10px;
      .block-item-title {
        color: #999;
        width: 70px;
        flex: 0 0 70px;
        white-space: nowrap;
      }
    }
  }
}
</style>
