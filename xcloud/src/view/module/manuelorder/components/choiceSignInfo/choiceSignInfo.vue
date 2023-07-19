<template>
  <div class="d-t-caption">
    <el-select v-if="isContractSubjectType" placeholder="选择联系人" style="width: 300px" clearable filterable v-model="signPerson" @change="changeContractSubjectId">
      <el-option v-for="(item, index) in subjectLis" :key="index" :label="isContractSubjectType ? item.contactPerson : item.companyName" :value="item.contractSubjectId"></el-option>
    </el-select>
    <el-select v-else placeholder="选择公司" style="width: 300px" clearable filterable v-model="signCompany" @change="changeContractSubjectId">
      <el-option v-for="(item, index) in subjectLis" :key="index" :label="isContractSubjectType ? item.contactPerson : item.companyName" :value="item.contractSubjectId"></el-option>
    </el-select>
    <el-link v-if="!isContractSubjectType" @click="showAddSignInfo = true" style="color: blueviolet"> {{ signCompany ? '编辑' : '新增' }}公司</el-link>
    <el-link v-if="isContractSubjectType && signPerson" @click="showAddSignInfo = true" style="color: blueviolet"> 编辑联系人</el-link>
    <AddSignInfo @sumbit="saveSignSubjectAPI" v-if="showAddSignInfo" :id="contractSubjectId" :userMobile="orderForm.userMobile" :isSee.sync="seeSingInfo" :isEdit="dialogEdit" :signDto="signDto" :title="dialogTitle" :visible.sync="showAddSignInfo" :type="contractSubjectType" />
  </div>
</template>

<script>
import AddSignInfo from '@/components/signInfo/addSignInfo';
import { getSignSubject } from '@/api/newApi/orderManage/salesorder.js';
import { CONTRACTEM } from '@/libs/contractEM.js';
const REG_TEL = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;

export default {
  props: {
    value: String,
    orderForm: {
      type: Object,
      default: () => {},
    },
    signDto: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      showAddSignInfo: false,
      SUBJECTEM: CONTRACTEM.SUBJECTEM,
      subjectLis: [],
      signCompany: '',
      signPerson: '',
      dialogEdit: false,
      seeSingInfo: false,
    };
  },
  computed: {
    contractSubjectType() {
      return this.signDto.contractSubjectType;
    },
    contractSubjectId() {
      return this.isContractSubjectType ? this.signPerson : this.signCompany;
    },
    isContractSubjectType() {
      return this.signDto.contractSubjectType == this.SUBJECTEM.PERSON;
    },
    dialogTitle() {
      if (this.isContractSubjectType && this.signPerson) {
        this.dialogEdit = true;
        return this.seeSingInfo ? '查看联系人' : '编辑增联系人';
      } else if (this.signCompany) {
        this.dialogEdit = true;
        return this.seeSingInfo ? '查看公司' : '编辑公司';
      } else {
        this.dialogEdit = false;
        return '新增公司';
      }
    },
    signSubject() {
      let { contractSubjectType, userMobile } = this.orderForm;
      return { contractSubjectType, userMobile };
    },
  },

  watch: {
    signSubject(val) {
      REG_TEL.test(val.userMobile) && this.contractSubjectList('mobile');
    },
    'signDto.contractSubjectType': {
      async handler() {
        await this.contractSubjectList();
        if (this.contractSubjectId) {
          this.emitContractSubjectId(this.contractSubjectId);
        } else {
          this.$emit('changeContractSubjectId', '', '');
        }
      },
      immediate: true,
      deep: true,
    },
    'signDto.contractSubjectId': {
      handler(val) {
        if (this.isContractSubjectType) {
          this.signPerson = val;
        } else {
          this.signCompany = val;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  components: {
    AddSignInfo,
  },

  methods: {
    /** 获取 联系人企业列表*/
    async contractSubjectList(type) {
      let {
        orderForm: { userMobile },
      } = this;
      if (REG_TEL.test(userMobile)) {
        let { contractSubjectType } = this.signDto;
        try {
          let { data } = await getSignSubject({ userMobile, contractSubjectType: contractSubjectType });
          this.subjectLis = data || [];
          if (type == 'mobile') {
            this.signCompany = '';
            this.signPerson = '';
          }
          this.subjectLis.length == 0 && this.$message.warning(`无${contractSubjectType == 'PERSON' ? '联系人' : '公司'}信息可选，请先新增${contractSubjectType == 'PERSON' ? '联系人' : '公司'}信息`);
        } catch (error) {}
      }
    },

    saveSignSubjectAPI(func, form) {
      let {
        signDto: { contractSubjectType, contractSubjectId },
        orderForm: { userMobile },
      } = this;
      let parm = { userMobile, contractSubjectType };
      userMobile ? func(this.contractSubjectList, (data) => ({ ...data.form, ...parm })) : this.$message.warning('请先填写手机号!');
      this.$emit('changeName', form.companyName || form.contactPerson);
    },
    changeContractSubjectId(id) {
      this.seeSingInfo = true;
      this.showAddSignInfo = true;
      this.emitContractSubjectId(id);
    },
    emitContractSubjectId(id) {
      let subjectItem = this.subjectLis.find((item) => item.contractSubjectId === id);
      let contractName = subjectItem ? (this.isContractSubjectType ? subjectItem.contactPerson : subjectItem.companyName) : '';
      this.$emit('changeContractSubjectId', id, contractName);
    },
  },
};
</script>

<style lang="less" scoped></style>
