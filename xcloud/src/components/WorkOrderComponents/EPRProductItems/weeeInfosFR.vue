<template>
  <div>
    <el-form :model="form" ref="form" id="form" :disabled="disabled">
      <el-table border :data="form.productInfos" style="margin: 20px 0" highlight-current-row>
        <el-table-column label="注册WEEE产品信息" align="center">
          <el-table-column min-width="120px" align="center" label="* 设备用途" prop="deviceUse">
            <template slot-scope="scope">
              <el-form-item :prop="'productInfos.' + scope.$index + '. deviceUse'">
                <!-- <el-input v-model="scope.row.companyName" clearable size="small" /> -->
                <el-select v-model="scope.row.deviceUse" clearable filterable>
                  <el-option v-for="item in deviceUseOptions" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column min-width="120px" align="center" label="* 设备大类" prop=" firstClass">
            <template slot-scope="scope">
              <el-form-item :prop="'productInfos.' + scope.$index + '. firstClass'" :rules="baseRule">
                <el-select v-model="scope.row.firstClass" clearable filterable @change="(e) => selectChange(scope.$index)">
                  <el-option v-for="item in selectOptions" :key="item.value" :label="item.value" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column min-width="120px" align="center" label="* 设备小类" prop="secondaryClass">
            <template slot-scope="scope">
              <el-form-item :prop="'productInfos.' + scope.$index + '.secondaryClass'" :rules="baseRule">
                <!-- <el-input v-model="scope.row.secondaryClass" clearable size="small" /> -->
                <el-select v-model="scope.row.secondaryClass" clearable filterable>
                  <el-option v-for="item in getSecondOptions(scope.$index)" :key="item.value" :label="item.value" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column min-width="120px" align="center" label="* 设备重量（千克）" prop="weight">
            <template slot-scope="scope">
              <el-form-item :prop="'productInfos.' + scope.$index + '.weight'" :rules="baseRule">
                <el-input v-model="scope.row.weight" clearable size="small" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column min-width="120px" align="center" label="* 产品名称" prop="prodName">
            <template slot-scope="scope">
              <el-form-item :prop="'productInfos.' + scope.$index + '.prodName'">
                <el-input v-model="scope.row.prodName" clearable size="small" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column min-width="120px" align="center" label="* 产品链接" prop="prodLink">
            <template slot-scope="scope">
              <el-form-item :prop="'productInfos.' + scope.$index + '.prodLink'">
                <el-input v-model="scope.row.prodLink" clearable size="small" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="100px" fixed="right" v-if="!showOnly">
            <template slot-scope="scope">
              <el-link type="primary" @click="addItem(scope.$index)" :disabled="disabled">添加</el-link>
              <el-link type="primary" @click="delItem(scope.$index)" :disabled="disabled" v-if="form.productInfos.length > 1"> 删除 </el-link>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
import UploadFile from '@/components/UploadFile/index';
export default {
  props: {
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    disabled: {
      type: Boolean,
      default: true,
    },
    showOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      item: {
        deviceUse: '',
        firstClass: '',
        secondaryClass: '',
        weight: '',
        prodName: '',
        prodLink: '',
      },
      form: {
        productInfos: [],
      },
      baseRule: { required: true, message: '请输入', trigger: 'blur' },
      deviceUseOptions: ['家用类电子电器 Household EEE', '专业类电子电器 Professional EEE'],
      selectOptions: [
        {
          value: '热交换器',
          secondOptions: [{ value: '冰箱及冰柜' }, { value: '整体式热交换设备，包括除湿器、空调、热力热水器' }, { value: '分体式热泵和其他分体式温度交换设备（C&F），包括除湿器、空调、热水（可移动热力单体空调）' }],
        },
        {
          value: '屏幕、显示器和设备，包括表面大于 100 cm² 的屏幕',
          secondOptions: [{ value: '显示器' }, { value: '笔记本电脑' }, { value: '平板电脑' }, { value: '电视机' }],
        },
        {
          value: '大型设备（任何外形尺寸大于50cm）',
          secondOptions: [{ value: '洗衣机' }, { value: '洗碗机' }, { value: '烤箱/炉灶/组合洗衣机/干衣机' }, { value: '热水器/锅炉 ' }, { value: '电油汀' }, { value: '可移动大型设备:电动自行车/三轮车/电动轮椅' }, { value: '其他大型设备' }],
        },
        {
          value: '小型设备（外形尺寸不超过50cm）',
          secondOptions: [{ value: '咖啡机/水壶/茶壶' }, { value: '吸尘器' }, { value: '电钻/螺丝刀' }, { value: '便携式游戏机' }, { value: '电视游戏机' }, { value: '微波炉' }, { value: '带连接器的电缆' }, { value: '其他小型设备（包括照明设备）' }],
        },
        {
          value: '小型计算机和电信设备（所有外形尺寸小于或等于50cm）',
          secondOptions: [{ value: 'GSM电话及智能手机' }, { value: '台式机' }, { value: '打印机' }, { value: '打印墨盒' }, { value: '配备连接器的电缆' }, { value: '其他小型计算机和电信设备' }],
        },
      ],
    };
  },
  components: {
    UploadFile,
  },
  watch: {
    value: {
      handler(val) {
        if (val && val.length) {
          this.form.productInfos = val;
        }
      },
      immediate: true,
    },
    'form.productInfos': {
      handler() {
        for (let i = 0; i < this.form.productInfos.length; i++) {
          let item = this.form.productInfos[i];
          let requiredKeys = ['deviceUse', 'firstClass', 'secondaryClass', 'weight', 'prodName', 'prodLink'];
          if (requiredKeys.some((key) => item[key] === '')) {
            this.$emit('input', []);
            return;
          }
        }
        let data = this.form.productInfos.map((item) => ({
          ...item,
        }));
        console.log(111, data);
        this.$emit('input', data);
      },
      deep: true,
      immediate: true,
    },
  },

  methods: {
    addItem(index) {
      this.form.productInfos.splice(index + 1, 0, { ...this.item });
      this.$set(this.form, 'productInfos', this.form.productInfos);
    },
    delItem(index) {
      this.form.productInfos.splice(index, 1);
    },
    selectChange(index) {
      this.form.productInfos[index].secondaryClass = '';
    },
    getSecondOptions(index) {
      let temp = this.selectOptions.find((item) => item.value === this.form.productInfos[index].firstClass);
      return temp ? temp.secondOptions : [];
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-input {
  width: 120px !important;
}
::v-deep .el-input__inner {
  width: 120px !important;
}
::v-deep .el-upload__text {
  white-space: nowrap;
}
</style>
