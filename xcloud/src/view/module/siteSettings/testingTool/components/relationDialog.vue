<template>
  <el-dialog :title="`合规项：${checkRow.complianceItem}`" :visible.sync="dialogvisible" width="900px" center @close="reset">
    <div class="dialog-title">合规项所需条件：</div>
    <el-form ref="form" :model="{ list: list }">
      <el-table class="table" :data="list" :height="400">
        <el-table-column align="center" :label="tab.label" :prop="tab.key" v-for="tab in tabs" :key="tab.value">
          <template slot-scope="{ row, $index }" v-if="answerObj[tab.value]">
            <el-form-item :prop="`list.${$index}.${tab.key}`" :rules="[{ required: true, message: '请选择', trigger: 'blur' }]">
              <el-select v-model="row[tab.key]" :disabled="!checkRow.isEdit">
                <el-option :value="item.answer" :label="item.answer" v-for="(item, index) in answerObj[tab.value].answer" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="100px" v-if="checkRow.isEdit">
          <template slot-scope="{ row, $index }">
            <el-form-item>
              <img class="operation-icon" src="@/assets/icons/add_icon.svg" alt="" @click="addItem($index)" />
              <img class="operation-icon" src="@/assets/icons/reduce_icon.svg" alt="" v-if="list.length > 1" @click="reduceItem($index)" />
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <div slot="footer" class="dialog-footer" v-if="checkRow.isEdit">
      <el-button type="primary" size="small" @click="submit" :loading="submitLoading">发布</el-button>
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { answerList, ruleList, ruleSave } from '@/api/newApi/siteSettings/testingTool';
export default {
  props: {
    relationDialog: Boolean,
    activeTab: String,
    checkRow: Object,
  },
  data() {
    return {
      tabs: [
        { label: '商品类别', value: '5', key: 'commodityCategory' },
        { label: '公司注册地', value: '1', key: 'registrationAddre' },
        { label: '仓储地', value: '3', key: 'storagePlace' },
        { label: '目标市场', value: '2', key: 'targetMarket' },
        { label: '售卖渠道', value: '4', key: 'salesChannel' },
      ],
      answerObj: {},
      baseList: [
        {
          commodityCategory: '',
          registrationAddre: '',
          storagePlace: '',
          targetMarket: '',
          salesChannel: '',
        },
      ],
      list: [],
      submitLoading: false,
      version: 0,
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.relationDialog;
      },
      set(val) {
        this.$emit('update:relationDialog', val);
      },
    },
  },
  watch: {
    dialogvisible(val) {
      if (val) {
        this.getAnswerList();
        this.getInfo();
      }
    },
  },
  methods: {
    addItem(index) {
      this.list.splice(index + 1, 0, {
        commodityCategory: '',
        registrationAddre: '',
        storagePlace: '',
        targetMarket: '',
        salesChannel: '',
      });
    },
    reduceItem(index) {
      this.list.splice(index, 1);
    },
    getInfo() {
      if (!this.checkRow.searchNo) {
        if (this.checkRow.rule && this.checkRow.rule.length) {
          this.list = this.checkRow.rule;
        } else {
          this.list = JSON.parse(JSON.stringify(this.baseList));
        }
        return;
      }
      ruleList({
        searchNo: this.checkRow.searchNo,
      }).then((res) => {
        if (res.data.length) {
          this.version = res.data[0].version;
          this.list = res.data;
        } else {
          this.list = JSON.parse(JSON.stringify(this.baseList));
        }
      });
    },
    getAnswerList() {
      answerList().then((res) => {
        this.tabs.forEach((tab) => {
          this.$set(
            this.answerObj,
            tab.value,
            res.data.find((item) => item.type === tab.value - 0)
          );
          try {
            this.answerObj[tab.value].answer = JSON.parse(this.answerObj[tab.value].answer).sort((a, b) => a - b);
          } catch (error) {
            this.answerObj[tab.value].answer = [{ answer: '' }];
          }
        });
      });
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.checkRow.searchNo) {
            this.$emit('saveRule', JSON.parse(JSON.stringify(this.list)));
            this.dialogvisible = false;
            return;
          }
          this.submitLoading = true;
          ruleSave({
            complianceRuleList: this.list.map((item) => ({
              ...item,
              searchNo: this.checkRow.searchNo,
              version: this.version,
            })),
            searchNo: this.checkRow.searchNo,
            version: this.version,
          })
            .then((res) => {
              if (res.code === 0) {
                this.$message.success('发布成功');
                this.dialogvisible = false;
              }
            })
            .finally(() => {
              this.submitLoading = false;
            });
        }
      });
    },
    reset() {},
  },
};
</script>

<style lang="less" scoped>
.dialog-title {
  margin-bottom: 10px;
}
.operation-icon:not(:last-child) {
  margin-right: 10px;
}
.table {
  .el-form-item--small {
    // margin-bottom: 0 !important;
  }
}
</style>
