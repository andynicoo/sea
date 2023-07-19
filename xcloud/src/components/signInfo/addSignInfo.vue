<!-- 新增企业签订信息 联系人签订 -->

<template>
  <el-dialog :title="title" :visible.sync="dialogvisible" width="460px" :before-close="handleClose" destroy-on-close :append-to-body="true">
    <!-- 企业签订 -->
    <div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="企业名称" prop="companyName" v-if="type == SUBJECTEM.ENTERPRISE" :rules="[{ required: true, message: '请输入企业名称', trigger: 'blur' }]">
          <el-input class="max-w-300" :disabled="disabled || title === '查看公司'" v-model="form.companyName"></el-input>
          <div class="tips-text" v-if="!disabled && title === '查看公司'">公司名称可在"客户信息>公司信息"中修改</div>
        </el-form-item>
        <el-form-item label="联系人" prop="contactPerson" :rules="[{ required: true, message: '请输入联系人', trigger: 'blur' }]">
          <el-input class="max-w-300" :disabled="disabled" v-model="form.contactPerson"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="contactPhone" :rules="[{ required: true, message: '请输入联系方式', trigger: 'blur' }]">
          <el-input class="max-w-300" :disabled="disabled" v-model="form.contactPhone"></el-input>
        </el-form-item>
        <el-form-item :label="addressLable" prop="contactAddress" :rules="[{ required: true, message: '请输入' + addressLable, trigger: 'blur' }]">
          <el-input class="max-w-300" :disabled="disabled" v-model="form.contactAddress"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <!-- -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ disabled ? '修改' : '取消' }}</el-button>
      <el-button type="primary" @click="saveInfo">{{ disabled ? '确认无误' : '保存' }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { CONTRACTEM } from '@/libs/contractEM.js';
import { saveSignSubject, getSignSubject } from '@/api/newApi/orderManage/salesorder.js';

export default {
  props: {
    type: {
      //签订类型
      type: String,
      value: '',
    },
    title: String,
    signDto: {
      type: Object,
      default: () => {},
    },
    userMobile: '',
    visible: Boolean,
    isEdit: Boolean,
    isSee: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: '',
    },

    checkedItem: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      SUBJECTEM: CONTRACTEM.SUBJECTEM,
      form: {
        companyName: '',
        contactPerson: '',
        contactPhone: '',
        contactAddress: '',
      },
      disabled: this.isSee ? true : false,
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
    addressLable() {
      return `${this.type == this.SUBJECTEM.ENTERPRISE ? '企业' : '联系'}地址`;
    },
  },
  watch: {
    isEdit(newVal, oldVal) {
      // newVal是新值，oldVal是旧值
      this.isEdit = newVal;
    },
    checkedItem: {
      handler(val) {
        let { contractSubjectId, companyName, contactPerson, contactPhone, contactAddress } = val;
        if (contractSubjectId) {
          if (this.type === this.SUBJECTEM.ENTERPRISE) {
            this.form.companyName = companyName;
          }
          this.form.contractSubjectId = contractSubjectId;
          this.form.contactPerson = contactPerson;
          this.form.contactPhone = contactPhone;
          this.form.contactAddress = contactAddress;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.id && this.contractSubjectList();
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false);
    },
    /**保存企业 || 个人信息 */
    saveInfo() {
      let self = this;
      if (this.disabled) {
        this.dialogvisible = false;
      } else {
        this.$refs['form'].validate((vaild) => {
          if (vaild) {
            this.handleClose();
            const setEmit = async (refreshBack, callback) => {
              let { code } = await saveSignSubject(callback({ vaild, form: self.form }));
              if (code == 0) {
                self.$message.success(`${this.isEdit || self.checkedItem.contractSubjectId ? '编辑' : '新增'}${this.type == this.SUBJECTEM.ENTERPRISE ? '企业' : '联系人'}成功`);
                typeof refreshBack == 'function' &&
                  setTimeout(() => {
                    refreshBack();
                  }, 300);
              }
            };
            this.$emit('sumbit', setEmit, this.form);
          } else {
            return false;
          }
        });
      }
    },

    /** 获取 联系人企业列表*/
    async contractSubjectList() {
      let { userMobile } = this;
      let { data } = await getSignSubject({ userMobile, contractSubjectType: this.type, contractSubjectId: this.id });
      this.form = data.find((item) => item.contractSubjectId == this.id) || {};
    },

    cancel() {
      if (this.isSee) {
        this.disabled = false;
      } else {
        this.dialogvisible = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.max-w-300 {
  max-width: 300px;
}
.tips-text {
  font-size: 12px;
  color: #777;
}
</style>
