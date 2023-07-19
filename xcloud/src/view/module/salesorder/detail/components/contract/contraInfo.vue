<!-- 详情-合同信息 -->
<template>
  <div class="main">
    <!-- <div class="tittle">
      <el-divider direction="vertical"></el-divider>
      <span class="text-info">合同信息</span>
    </div> -->
    <el-table border :data="tableData.length == 0 ? [{}] : tableData" :max-height="260" class="table">
      <el-table-column prop="contractName" label="合同名称">
        <template slot-scope="scope">
          {{ tableData.length > 0 ? scope.row.contractName : '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="contractStatus" label="签署状态">
        <template slot-scope="scope">
          {{ tableData.length > 0 ? contractStatusText(scope.row.contractStatus) : '未签署' }}
        </template>
      </el-table-column>
      <el-table-column prop="bestContractId" label="合同编号"> </el-table-column>
      <el-table-column prop="contractSubjectType" label="签订主体">
        <template slot-scope="scope" v-if="tableData.length > 0"> {{ scope.row.contractSubjectType == SUBJECTEM.PERSON ? '个人' : '企业' }}签订 </template>
      </el-table-column>
      <el-table-column label="主体信息">
        <template slot-scope="scope" v-if="tableData.length > 0">
          <el-row v-if="scope.row.contractSubjectType === 'ENTERPRISE'">公司名称:{{ scope.row.companyName }} </el-row>
          <el-row>联系人:{{ scope.row.contactPerson }} </el-row>
          <el-row>联系方式：{{ scope.row.contactPhone }} </el-row>
          <el-row>联系地址：{{ scope.row.contactAddress }} </el-row>
        </template>
      </el-table-column>
      <el-table-column prop="sendTime" label="合同发送时间"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span>
            <el-link v-if="[CONTRACTSTATUS.SIGNED, CONTRACTSTATUS.OFFLINE_SIGNED].includes(scope.row.contractStatus)" v-show="hasAuthority('C2_41')" type="primary" :href="scope.row.contractUrl + '?response-content-type=application/octet-stream'">下载合同</el-link>
            <template v-if="scope.row.isShowBtn && tableData.length > 0">
              <template v-if="scope.row.contractStatus === CONTRACTSTATUS.SIGNING">
                <el-link type="primary" v-show="hasAuthority('C2_32')" v-if="scope.row.contractSignLink" data-clipboard-action="copy" class="cp-btn" :data-clipboard-text="scope.row.contractSignLink" @click="copyLink('.cp-btn')">复制合同链接</el-link>
                <el-link type="primary" v-show="hasAuthority('C2_33')" v-if="!scope.row.invalidStatus" @click="cliRkrevokeContract">撤销合同</el-link>
              </template>
              <el-link type="primary" v-show="hasAuthority('C2_34')" v-if="[CONTRACTSTATUS.SIGNED, CONTRACTSTATUS.SPECIAL_NO_SIGN, CONTRACTSTATUS.OFFLINE_SIGNED].includes(scope.row.contractStatus)" @click="clickOfflineInvalid(scope.row)">作废合同</el-link>
              <el-link type="primary" v-show="hasAuthority('C2_35')" v-if="[CONTRACTSTATUS.REVOKED, CONTRACTSTATUS.INVALID].includes(scope.row.contractStatus)" @click="signedModel = true">签署新合同</el-link>
            </template>
            <template v-if="tableData.length === 0">
              <el-link v-show="hasAuthority('C2_36')" type="primary" @click="signedModel = true">签署合同</el-link>
            </template>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="作废线下合同" :visible.sync="nullify" width="460px">
      <el-row class="title bold">
        <el-col :span="12">订单号：{{ detailInfo.orderNo || '' }}</el-col>
        <el-col :span="12">已付金额：{{ detailInfo.amountMoney | formatQianFenWei }}元</el-col>
      </el-row>
      <el-form ref="offlineInvalidForm" label-width="100px" :model="offlineInvalidForm" :rules="offlineInvalidFormRules">
        <el-form-item label="签订方式：">
          {{ signStr || '' }}
        </el-form-item>
        <el-form-item label="作废申明：" prop="contractUrl">
          <UploadFileUrl :showTip="false" :fileList.sync="offlineInvalidForm.contractUrl" :maxSize="20"> </UploadFileUrl>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="nullify = false">取消</el-button>
        <el-button type="primary" @click="submitOfflineInvalid">确认</el-button>
      </div>
    </el-dialog>
    <Contract v-if="signedModel" :signedModel.sync="signedModel" :detailInfo="detailInfo" />
  </div>
</template>

<script>
import { getContractInfo, contractsInvalidApi, revokeContractApi, offlineInvalid } from '@/api/newApi/orderManage/salesorder';
import { CONTRACTEM } from '@/libs/contractEM.js';
import UploadFileUrl from '@/components/UploadFileUrl/index';
import Contract from './index';
export default {
  name: 'ContractInfo',
  props: {
    detailInfo: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    UploadFileUrl,
    Contract,
  },
  computed: {
    contractStatusText() {
      return (type) => CONTRACTEM.CONTRACTSTATUSTEXTEM[type];
    },
    tableList() {
      let { tableData, defaultSingList } = this;
      return tableData.length == 0 ? defaultSingList : tableData;
    },
    signStr() {
      return CONTRACTEM.SIGNEM_DESC[this.row.signType];
    },
  },
  data() {
    return {
      CONTRACTSTATUS: CONTRACTEM.CONTRACTSTATUS,
      SUBJECTEM: CONTRACTEM.SUBJECTEM,
      tableData: [],
      id: this.$route.query.id,
      nullify: false,
      row: {},
      offlineInvalidForm: {
        contractUrl: '',
      },
      offlineInvalidFormRules: {
        contractUrl: [{ required: true, message: '请上传作废说明', trigger: 'blur' }],
      },
      defaultSingList: [{}],
      signedModel: false,
      orderContractList: [],
      invoiceContractList: [],
    };
  },

  mounted() {
    this.init();
  },
  methods: {
    async init() {
      let { data } = await getContractInfo(this.id);
      this.orderContractList = data.filter((item) => item.contractType === 0);
      this.invoiceContractList = data.filter((item) => item.contractType === 1);
      this.tableData =
        data.map((item) => ({
          ...item,
          isShowBtn: this.showContractBtn(item),
        })) || [];
    },

    /**合同作废 */
    clickOfflineInvalid(row) {
      let { signType, contractType } = row;
      if (signType === CONTRACTEM.SIGNEM.OFFLINE) {
        this.nullify = true;
        this.row = row;
      } else {
        const callback = async () => {
          let { code } = await contractsInvalidApi({ orderId: this.id, contractType });
          if (code === 0) {
            this.nullify = false;
            this.refresh('作废成功');
          }
        };
        confirm(this, '是否确认作废此订单合同', callback);
      }
    },
    /**线下合同作废 */
    submitOfflineInvalid() {
      this.$refs.offlineInvalidForm.validate((valid) => {
        if (valid) {
          offlineInvalid({
            ...this.offlineInvalidForm,
            invalidContractId: this.row.id,
            orderId: this.detailInfo.orderId,
          }).then((res) => {
            if (res.code === 0) {
              this.nullify = false;
              this.refresh('作废成功');
            }
          });
        }
      });
    },

    /**合同撤销 */
    cliRkrevokeContract() {
      confirm(this, '是否撤销此订单合同', async () => {
        let { code } = await revokeContractApi({ orderId: this.id });
        code == 0 && this.refresh('撤销成功');
      });
    },

    //复制链接
    copyLink(className) {
      let _this = this;
      let clipboard = new this.clipboard(className);
      clipboard.on('success', function (e) {
        _this.$Message.success('复制成功');
      });
      clipboard.on('error', function () {
        _this.$Message.info('复制失败');
      });
      setTimeout(() => {
        clipboard.destroy();
      }, 1000);
    },
    /**
     * 同类型合同中，最新的合同如果是 非作废合同，则直接根据改合同类型展示按钮，该类型其他合同不需要任何按钮
     * 同类型合同中，最新的合同如果是 作废合同，则直接根据该作废合同展示按钮
     *     如果该作废合同是已签署，择同类型第二个合同 根据其合同状态展示按钮
     *     如果该作废合同签署中，展示复制链接，其他同类型合同不展示任何按钮
     */
    showContractBtn(item) {
      let data = item.contractType === 0 ? this.orderContractList : this.invoiceContractList;
      if (data.length) {
        if (!data[0].invalidStatus) {
          // 最新的合同是非作废合同
          return data[0].id === item.id;
        } else {
          // 最新的合同是作废合同
          if (data[0].contractStatus === this.CONTRACTSTATUS.SIGNED) {
            // 最新合同的状态是已签署
            return data[1].id === item.id;
          } else {
            // 最新合同的状态是签署中（非已签署）
            return data[0].id === item.id;
          }
        }
      }
    },
    refresh(msg) {
      setTimeout(() => {
        this.init();
      }, 1000);
      this.$message.success(msg);
    },
  },
};

function confirm(self, title, callback) {
  self
    .$confirm(title, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(() => {
      callback();
    })
    .catch(() => {
      self.$message.info('已取消操作');
    });
}
</script>

<style lang="scss" scoped>
::v-deep .el-table .el-table__header th {
  background: #f6f6f6 !important;
}
.main {
  .title {
    margin: 0 0px 10px 0px;
    font-size: 14px;
    color: black;
    &.bold {
      font-weight: bold;
      margin-bottom: 30px;
    }
  }
  .table {
    margin: 0px 20px;
    width: auto;
  }
}
.dialog-footer {
  text-align: center;
}
.tittle {
  font-size: 16px;
  font-weight: bold;
}
</style>
