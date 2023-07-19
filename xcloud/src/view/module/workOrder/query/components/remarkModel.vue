<template>
     <!-- 查看备注 -->
    <el-dialog title="备注信息" :visible.sync="dialogvisible" width="495px">
      <template v-if="listRemark.length > 0">
        <div class="remarlist">
          <div class="content" v-for="(item, index) in listRemark" :key="index">
            <p>
              <span class="text-desc"> 备注人：</span> {{ item.remarkBy }}
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
      <div slot="footer" >
        <el-button style="width: 65px" type="primary" @click="dialogvisible = false">关闭</el-button>
      </div>
    </el-dialog>
</template>

<script>

export default {
  props: {
    seeRemarkModel: Boolean,
    listRemark: Array
  },
  data() {
    return {
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.seeRemarkModel;
      },
      set(val) {
        this.$emit("update:seeRemarkModel", val);
      },
    },
  },
  created() {},
  methods: {
  },
};
</script>

<style lang="scss" scoped>
.el-textarea {
  width: 300px;
}

/deep/ .el-dialog__footer {
  border-top: 1px solid #eee;
  padding-top: 20px;
  p {
    text-align: left;
  }
}

.timeline-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
  color: #666;
}
</style>
