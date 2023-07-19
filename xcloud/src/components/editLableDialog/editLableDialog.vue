<template>
  <el-dialog title="批量修改" :visible.sync="dialogvisible" width="300px" center :before-close="handleClose">
    <div>将批量修改为</div>
    <el-select v-model="newLabel" filterable placeholder="请选择">
      <el-option v-for="item in list" :label="item.labelName" :value="item.id" :key="item.id"></el-option>
    </el-select>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">确认提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { batchEditLabel, getAllLable } from '@/api/home/service.js';

export default {
  props: {
    visible: Boolean,
    selectList: {
      type: Array,
      default: () => [],
    },
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
  data() {
    return {
      list: [],
      newLabel: '',
    };
  },
  async created() {
    try {
      const {
        code,
        data: { records },
      } = await getAllLable({ size: -1 });
      this.list = code == 0 && records;
    } catch (error) {
      this.list = [];
    }
  },
  methods: {
    async submit() {
      let { code } = await batchEditLabel({ labelId: this.newLabel, workNos: this.selectList.map(({ workNo }) => workNo).filter((item) => !!item) });
      if (code == 0) {
        this.handleClose();
        this.$message.success('修改成功');
        this.$emit('update');
      }
    },

    handleClose() {
      this.$emit('update:visible', false);
    },
  },
};
</script>

<style lang="scss" scoped></style>
