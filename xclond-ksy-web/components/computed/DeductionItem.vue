<template>
  <div class="deduction">
    <!-- {{ items }}
    <hr />
    {{ countryCode }} -->
    <div class="list" v-show="items.length">
      <div class="item" v-for="(item, index) in items" :key="item.deductionType + index">
        <!-- <a-space> -->
        <a-select v-model="items[index].deductionType" class="ksy-w200" placeholder="请选择">
          <a-select-option v-for="dedu in discountTypeList" :key="dedu.label" :value="dedu.label">
            {{ dedu.val }}
          </a-select-option>
        </a-select>
        <a-date-picker valueFormat="YYYY-MM-DD" v-model="items[index].billDate" placeholder="请选择单据日期" />
        <a-input
          v-model="items[index].deductionAmt"
          placeholder="请填写抵扣金额"
          v-positiveNumber="{ fixedNum: 2, maxNum: 1000000000, minNum: 0 }"
          :suffix="countryIcon"
          class="ksy-w200"
        />
        <a-upload
          :action="uplodPath"
          @change="(value) => handleChangeIndex(value, index, 'ecAcqFilePath', 'fileList')"
          :data="{ prefix: '' }"
          :file-list="item.fileList"
          accept=".jpg,jpeg,.png,.gif,.rar,.zip,.pdf"
          class="ksy-w160 ksy-dig"
        >
          <a-button> <a-icon type="upload" /> 上传抵扣凭证 </a-button>
        </a-upload>
        <AliIcon type="cha" :size="15" @click.native="clearItem(index)" />
        <!-- </a-space> -->
      </div>
    </div>
    <p class="addtext hand">
      <AliIcon type="tianjia1" :size="20" @click.native="addItem" class="adddd" />
      <span class="ksy-ml-2" @click="addItem">添加抵扣项</span>
    </p>
  </div>
</template>

<script>
import aboutComputedMix from "@/mixins/about-computed";
export default {
  mixins: [aboutComputedMix],
  data() {
    return {
      item: {
        deductionType: "", // 抵扣类型1、进口增值税抵扣2、发票抵扣3、其它;4、B2B;5:PVB;中东国家：6:平台佣金; 7:运费; 8:仓储费; 9:推广费
        billDate: "", // 单据日期
        deductionAmt: "", // 抵扣金额
        deductionFile: "", // 文件上传地址
        fileOriginalName: "", // 文件原始名称
        fileList: [], // 每个item的文件上传list
      },
      items: [],
      discountTypeList: [], // 下拉选项
      listA: [
        {
          val: "C79/88",
          label: 1,
        },
        {
          val: "发票抵扣",
          label: 2,
        },
        {
          val: "B2B发票",
          label: 4,
        },
        {
          val: "其它",
          label: 3,
        },
      ],
      listB: [
        {
          val: "C79/88",
          label: 1,
        },
        {
          val: "发票抵扣",
          label: 2,
        },
      ],
      listC: [
        {
          val: "C79/88",
          label: 1,
        },
        {
          val: "发票抵扣",
          label: 2,
        },
        {
          val: "PVA",
          label: 5,
        },
        {
          val: "其它",
          label: 3,
        },
      ],
      listD: [
        {
          val: "平台佣金",
          label: 6,
        },
        {
          val: "运费",
          label: 7,
        },
        {
          val: "仓储费",
          label: 8,
        },
        {
          val: "推广费",
          label: 9,
        },
        {
          val: "其它",
          label: 3,
        },
      ],
    };
  },
  props: {
    // discountTypeList: {
    //   type: Array,
    //   default: () => [],
    // },
    countryCode: {
      type: String,
      default: "",
    },
    countryIcon: {
      type: String,
      default: "",
    },
  },
  computed: {},
  watch: {
    items: {
      handler(newVal, oldVal) {
        // console.log(newVal);
        this.retrunItems();
      },
      deep: true,
    },
    countryCode: {
      handler(newVal, oldVal) {
        // 几个国家的抵扣类型不同外，其他的默认listA,添加抵扣项时赋值
        let typeA = ["AT", "CZ", "ES", "FR", "IT", "NL", "PL"];
        let typeB = ["DE"];
        let typeC = ["GB"];
        let typeD = ["AE", "SA"];
        if (typeD.includes(newVal)) {
          this.discountTypeList = this.listD;
        } else if (typeB.includes(newVal)) {
          this.discountTypeList = this.listB;
        } else if (typeC.includes(newVal)) {
          this.discountTypeList = this.listC;
        } else {
          this.discountTypeList = this.listA;
        }
      },
      deep: true,
    },
  },
  mounted() {},
  methods: {
    addItem() {
      if (this.countryCode === "AE" || this.countryCode === "SA") {
        this.items.push({
          deductionType: 6,
          billDate: "",
          deductionAmt: "",
          deductionFile: "",
          fileOriginalName: "",
          fileList: [],
        });
      } else {
        this.items.push({
          deductionType: 1,
          billDate: "",
          deductionAmt: "",
          deductionFile: "",
          fileOriginalName: "",
          fileList: [],
        });
      }
    },
    clearItem(index) {
      console.log(index);
      this.$data.items.splice(index, 1);
    },
    retrunItems() {
      const { items } = this.$data;
      this.$emit("retrunItems", items);
    },
    resetItems() {
      this.$data.items = [];
    },
    handleChangeIndex({ file, fileList }, index, val) {
      console.log(file, fileList);
      let { items } = this.$data;

      let fileListCopy = fileList;
      fileListCopy = fileListCopy.slice(-1);

      fileListCopy = fileListCopy.map((file) => {
        if (file.response) {
          file.url = file.response.url;
        }
        return file;
      });

      this.$data.items[index].fileList = fileListCopy;

      if (file.status === "done") {
        let { response } = file;
        if (response && response.code === 0) {
          // this.$set(this.$data.items, val, response.data.fileUrl);
          this.items[index].deductionFile = response.data.fileUrl;
          this.items[index].fileOriginalName = response.data.origFileName;
        } else {
          this.$message.warning("系统繁忙请重试");
        }
      } else if (file.status === "removed") {
        this.items[index].deductionFile = "";
        this.items[index].fileOriginalName = "";
      }
    },
  },
};
</script>

<style lang="less" scoped>
.deduction {
  margin-top: 20px;
  .list {
    width: 924px;
    background: #f6f7f9;
    border-radius: 2px 2px 2px 2px;
    padding: 16px 24px;
    margin-bottom: 12px;
  }
  .addtext {
    color: @primaryColor;
    font-size: 14px;
    height: 30px;
    line-height: 30px;
    display: flex;
    .plus-circle {
      font-size: 16px;
    }
  }
  .ant-btn {
    color: @primaryColor;
    border-color: @primaryColor;
    background-color: #f6f7f9;
  }
  .ant-upload-list-item {
    margin-top: 0px;
  }
  .ksy-dig {
    display: inline-grid;
  }
}
.adddd {
  padding-top: 2px;
}
</style>
