<!--  -->
<template>
  <div>
    <el-table border :data="filtersList" style="margin-bottom:20px;" @cell-click="tableDbEdit" :empty-text="eleTips">
      <div v-if="type==1">
        <el-table-column align="center" label="服务" prop="evidenceComboName">
        </el-table-column>
        <el-table-column align="center" label="国家" prop="oaCountry">
        </el-table-column>
        <el-table-column align="center" label="售价">
          <template slot-scope="scope">
            <el-form :model="scope.row">
              <el-form-item size="mini">
                <el-input type="number" :controls="false" :precision="2" :min="0" @change="(e)=>oninputFun(e,scope.row,scope.$index)" v-focus @blur="blurInput(scope.row,scope.$index)" v-if="showInput == scope.row.productSkuId" v-model.number="scope.row.oaPrice">
                </el-input>
                <div v-else>
                  <span>{{ scope.row.oaPrice }}</span>
                  <i class="el-icon-edit"></i>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
      </div>
      <div v-if="type==2">
        <el-table-column align="center" label="服务" prop="evidenceComboName">
        </el-table-column>
        <el-table-column align="center" label="国家" prop="otherCountry">
        </el-table-column>
        <el-table-column align="center" label="售价">
          <template slot-scope="scope">
            <el-form :model="scope.row">
              <el-form-item size="mini">
                <el-input type="number" :controls="false" :precision="2" :min="0" @change="(e)=>oninputFun(e,scope.row,scope.$index)" v-focus @blur="blurInput(scope.row,scope.$index)" v-if="showInput == scope.row.productSkuId" v-model.number="scope.row.otherPrice">
                </el-input>
                <div v-else>
                  <span>{{ scope.row.otherPrice }}</span>
                  <i class="el-icon-edit"></i>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
      </div>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'OaTable',

  props: {
    list: {
      type: Array,
      default: () => [],
    },
    type: Number,
  },

  data() {
    return {
      showInput: '',
      oldData: {},
    };
  },

  directives: {
    // 通过自定义指令实现的表单自动获得光标的操作
    focus: {
      inserted: function (el, binding) {
        if (el.getElementsByTagName('input')) {
          el.getElementsByTagName('input')[0].focus();
        }
      },
    },
  },

  components: {},

  computed: {
    filtersList() {
      return this.list.filter((item) => Object.keys(item).length > 0);
    },
    eleTips() {
      return this.type == 1 ? '无需OA付费' : '无需其他服务付费';
    },
  },

  methods: {
    oninputFun(num, row, index) {
      // console.log('row', num, row);
      if (!(/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(num))) {
        this.$message({ type: 'warning', message: '请输入大于等于0的整数并只保留两位小数' });
        if ('oaPrice' in row) {
          this.list[index].oaPrice = 0;
        } else {
          this.list[index].otherPrice = 0;
        }
      } else {
        return num;
      }

      // var str = num;
      // var len1 = str.substr(0, 1);
      // var len2 = str.substr(1, 1);
      // //如果第一位是0，第二位不是点，就用数字把点替换掉
      // if (str.length > 1 && len1 == 0 && len2 != '.') {
      //   str = str.substr(1, 1);
      // }
      // //第一位不能是.
      // if (len1 == '.') {
      //   str = '';
      // }
      // //限制只能输入一个小数点
      // if (str.indexOf('.') != -1) {
      //   var str_ = str.substr(str.indexOf('.') + 1);
      //   if (str_.indexOf('.') != -1) {
      //     str = str.substr(0, str.indexOf('.') + str_.indexOf('.') + 1);
      //   }
      // }
      // //正则替换
      // str = str.replace(/[^\d^\.]+/g, ''); // 保留数字和小数点
      // str = str.replace(/\.\d\d\d$/, ''); // 小数点后只能输两位
      return '';
    },

    async blurInput(value, key) {
      // console.log('失去交单', value);
      this.$emit('updatePlanInfo', { value, key });
      this.showInput = '';
    },

    tableDbEdit(row, column, cell, event) {
      this.showInput = row.productSkuId;
    },
  },
};
</script>
<style lang='scss' scoped>
</style>