<template>
  <el-dialog title="子渠道配置" :visible.sync="dialogvisible" width="500px" center>
    <el-transfer filterable filter-placeholder="请输入用户手机号" v-model="value" :data="data" @mouseover.native="addTitle"></el-transfer>
    <div class="dialog-footer">
      <el-button size="mini" type="primary" @click="submitConfirm">保存</el-button>
      <el-button size="mini" @click="dialogvisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getList, saveChildRel, childUserRel } from '@/api/newApi/customer/channel.js';
export default {
  props: {
    visible: Boolean,
    id: String,
  },
  data() {
    return {
      data: [],
      value: [],
      list: [],
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
  },
  async created() {
    const { code, data } = await getList({ size: -1, pageIndex: 1, pageSize: 99999 });
    this.list = data.records.filter(({ userId }) => userId != this.id);
    this.data = this.generateData();
    this.getChaildUserRel();
  },
  methods: {
    addTitle(e) {
      let dom = e.target;
      if (dom.title) return;
      dom.title = dom.innerText;
    },
    generateData() {
      const data = [];
      for (let i = 0; i <= this.list.length - 1; i++) {
        const element = this.list[i];
        data.push({
          label: ` ${element.userMobile || element.mobile}(${element.nickname}) `,
          key: element.userId,
          ...element,
        });
      }
      return data;
    },
    async submitConfirm() {
      // if (this.value.length > 0) {

      // } else {
      //   this.dialogvisible = false;
      //   // this.$message.warning('请选择需要操作的用户');
      // }
      const { code, message } = await saveChildRel({ parentUserId: this.id, childUserIdList: this.value });
      if (code == 0) {
        this.$message.success('操作成功');
        setTimeout(() => this.getChaildUserRel());
        this.dialogvisible = false;
      } else {
        this.$message.error(message);
      }
    },

    async getChaildUserRel() {
      let { code, data } = await childUserRel(this.id);
      this.value = data.map((item) => item.userId);
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  padding-top: 20px;
  text-align: right;
}
</style>
