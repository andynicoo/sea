<template>
  <div>
    <el-form :model="form" ref="form" id="form" :disabled="disabled">
      <div class="packingTable">
        <div class="body title border-top">
          <span>Material type 材料类别</span>
          <span>重量 Kg</span>
          <span>Material type 材料类别</span>
          <span>重量 Kg</span>
        </div>
        <div class="body border-bottom border-top">
          <span class="name">Papier/Pappe/Karton 纸类包装：纸张/纸板/纸箱</span>
          <span>
            <!-- <el-input v-model="form.packageInfos.papier" clearable size="small" /> -->
            {{ form.packageInfos.papier }}
          </span>
          <span class="name">Glas 玻璃</span>
          <span>
            <!-- <el-input v-model="form.packageInfos.glas" clearable size="small" /> -->
            {{ form.packageInfos.glas }}
          </span>
        </div>
        <div class="body border-bottom">
          <span class="name">Kunststoffe 塑料</span>
          <span>
            <!-- <el-input v-model="form.packageInfos.kunststoffe" clearable size="small" /> -->
            {{ form.packageInfos.kunststoffe }}
          </span>
          <span class="name">Getrankartonverpackungen 液体纸板包装</span>
          <span>
            <!-- <el-input v-model="form.packageInfos.liquidCardboard" clearable size="small" /> -->
            {{ form.packageInfos.liquidCardboard }}
          </span>
        </div>
        <div class="body border-bottom">
          <span class="name">Eisenmetalle 铁</span>
          <span>
            <!-- <el-input v-model="form.packageInfos.eisenmetalle" clearable size="small" /> -->
            {{ form.packageInfos.eisenmetalle }}
          </span>
          <span class="name">Sonstige Verbunde 其他混合包装</span>
          <span>
            <!-- <el-input v-model="form.packageInfos.sonstigeVerbunde" clearable size="small" /> -->
            {{ form.packageInfos.sonstigeVerbunde }}
          </span>
        </div>
        <div class="body">
          <span class="name">Aluminium 铝</span>
          <span>
            <!-- <el-input v-model="form.packageInfos.aluminium" clearable size="small" /> -->
            {{ form.packageInfos.aluminium }}
          </span>
          <span class="name">Sonstige Materialie 其他特殊材料（请注明）</span>
          <span>
            <!-- <el-input v-model="form.packageInfos.sonstigeMaterialie" clearable size="small" /> -->
            {{ form.packageInfos.sonstigeMaterialie }}
          </span>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default() {
        return {};
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
    showHead: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      form: {
        packageInfos: {},
      },
    };
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          this.form.packageInfos = val;
        }
      },
      immediate: true,
    },
    'form.packageInfos': {
      handler() {
        let isEmpty = this.verifyEmpty(this.form.packageInfos);
        if (isEmpty) {
          this.$emit('input', {});
          return;
        }
        this.$emit('input', this.form.packageInfos);
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    verifyEmpty(obj) {
      let arr = Object.values(obj);
      let isEmpty = arr.every((item) => item == '');
      return isEmpty;
    },
  },
};
</script>

<style lang="scss" scoped>
.packingTable {
  width: 100%;
  text-align: center;
  border: 1px solid #ebeef5;
  .heard {
    height: 60px;
    background: #ebf5ff;
  }
  .title {
    background: #ebf5ff;
    color: #333333;
    font-size: 12px;
    text-align: center;
  }
  .body {
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      .name {
        flex: 2;
      }
      flex: 1;
    }
  }
}
.border-left {
  border-left: 1px solid #ebeef5;
}
.border-top {
  border-top: 1px solid #ebeef5;
}
.border-bottom {
  border-bottom: 1px solid #ebeef5;
}
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
