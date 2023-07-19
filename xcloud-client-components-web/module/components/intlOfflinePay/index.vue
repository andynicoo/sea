<template>
  <a-modal
    :visible="visible"
    title="国际支付-线下打款"
    @cancel="$emit('cancel')"
    width="720px"
    :footer="null"
    :zIndex="2000"
  >
    <div class="content">
      <a-alert message="请确保打款公司和签约主体公司保持一致" type="error" />
      <ul class="plat">
        <li>
          <span>打款账户：</span>
          <a-select @change="handleChangePlat" class="select" :default-value="list[0].plat" :dropdownStyle="{ zIndex:10000 }">
            <a-select-option v-for="(item, index) in list" :key="index" :value="item.plat">{{ item.plat }}</a-select-option>
          </a-select>
          <a-select @change="handleChangeCurrency" class="select" :value="currency" :dropdownStyle="{ zIndex:10000 }">
            <a-select-option v-for="(item, index) in currencyList" :key="index" :value="item.currency">{{ item.currencyLabel }}</a-select-option>
          </a-select>
        </li>
        <li class="amount">
          <span>应付金额：</span>
          <div>¥ {{ payInfo.amount }}</div>
        </li>
        <li class="foreign">
          <span>币种/金额：</span>
          <div><strong>{{ account.currencySymbol }}</strong><a-input-number class="input" v-model="currencyPayAmount" /></div>
        </li>
      </ul>
      <div class="account-info">{{ accountTmp }}</div>
      <a-upload-dragger
        name="file"
        :action="uploadUrl"
        accept="image/png,image/jpeg,image/jpg"
        :file-list="fileList"
        :before-upload="beforeUploadHandler"
        @change="handleChangeUpload"
      >
        <p class="ant-upload-drag-icon"><a-icon type="inbox" /></p>
        <p class="ant-upload-text">点击上传凭证</p>
        <p class="ant-upload-hint">请选择对应的支付账户进行线下打款，打款成功后请上传凭证截图，预计1-3个工作日审核完成。<br/>
只能上传jpg/png格式文件，文件不能超过10MB</p>
      </a-upload-dragger>
      <div class="footer">
        <a-button type="primary" @click="submit">提交</a-button>
        <a-button @click="$emit('cancel')">取消</a-button>
      </div>
    </div>
  </a-modal>
</template>
<script>
import { rateCalculateAmount } from '../../../api/shoppingCar';
import { uploadCertificate } from '../../../api/payment';
export default {
  props: {
    payInfo: {
      type: Object,
    },
    visible: {
      type: Boolean,
    },
  },
  // 传参
  // acceptAccountName 收款账户 string
  // acceptAccountNo 收款账号 string
  // swiftCode	String	SWIFT code
  // bankCode	String	银行号
  // bankAddress	String	银行地址
  // currency 币种 string，形如：cny/usd
  // currencyPayAmount 外币支付金额 number
  // currencySymbol 货币符号 string
  // exRate 汇率 number
  // orderId 订单ID integer(int64)
  // orderPaymentId 付款单ID integer(int64)
  // payer 付款方 string
  // paymentAmount 付款金额 number
  // paymentChannel 支付方式 string
  // paymentFile 支付凭证文件，半角逗号分隔 string
  // paymentTime 付款时间 string(date-time)
  // platformTradeNo 交易流水 string
  // remark 备注

  data() {
    const list = [{
        plat: 'Airwallex',
        accountList: [{
          acceptAccountName: 'Hengshenghe (HK) Co., Limited',
          acceptAccountNo: '8451775778',
          swiftCode: 'CMFGUS33',
          bankName: 'Community Federal Savings Bank',
          bankAddress: '89-16 Jamaica Ave',
          companyAddress: "22/FFLAT/RM 2223YAN'S TOWER25-27 WONG CHUK HANG ROADABERDEEN HK",
          currency: 'USD',
          currencySymbol: '$',
          currencyLabel: '美元',
          accountTmp: "账户名称：Hengshenghe (HK) Co., Limited \n银行账号：8451775778 \nSWIFT code：CMFGUS33 \n银行名称：Community Federal Savings Bank \n公司地址：22/FFLAT/RM 2223YAN'S TOWER25-27 WONG CHUK HANG ROADABERDEEN HK \nACH 路由号码：026073150 \nFedwire 路由号码：026073008 \n账户地点：美国 \n账户类型：Checking \n银行地址：89-16 Jamaica Ave \n城市：Woodhaven, NY \n邮编：11421"
        }, {
          acceptAccountName: 'Hengshenghe (HK) Co., Limited',
          acceptAccountNo: '47414044573',
          swiftCode: 'SCBLHKHH',
          bankName: 'Standard Chartered Bank (Hong Kong) Ltd',
          bankAddress: '32nd Floor, Standard Chartered Bank Building, 4-4A Des Voeux Road Central, HK',
          bankNo: '003 支行编号 474',
          companyAddress: "22/FFLAT/RM 2223YAN'S TOWER25-27 WONG CHUK HANG ROADABERDEEN HK",
          currency: 'HKD',
          currencySymbol: 'HK$',
          currencyLabel: '港币',
          accountTmp: "账户名称：Hengshenghe (HK) Co., Limited \n银行账号：47414044573 \nSWIFT code：SCBLHKHH \n银行名称：Standard Chartered Bank (Hong Kong) Ltd \n银行号 003 支行编号 474 \n银行地址：32nd Floor, Standard Chartered Bank Building, 4-4A Des Voeux Road Central, HK \n公司地址：22/FFLAT/RM 2223YAN'S TOWER25-27 WONG CHUK HANG ROADABERDEEN HK"
        },{
          acceptAccountName: 'Hengshenghe (HK) Co., Limited',
          acceptAccountNo: '47413368332',
          swiftCode: 'SCBLHKHHXXX',
          bankName: 'STANDARD CHARTERED BANK (HONG KONG) LTD',
          bankAddress: '32nd Floor, Standard Chartered Bank Building, 4-4A Des Voeux Road Central, HK',
          bankNo: '003 支行编号 474',
          companyAddress: "22/FFLAT/RM 2223YAN'S TOWER25-27 WONG CHUK HANG ROADABERDEEN HK",
          currency: 'CNY',
          currencySymbol: '¥',
          currencyLabel: '人民币',
          accountTmp: "账户名称：Hengshenghe (HK) Co., Limited \n银行账号：47413368332 \nSWIFT code：SCBLHKHHXXX \n银行名称：STANDARD CHARTERED BANK (HONG KONG) LTD \n银行号 003 支行编号 474 \n银行地址：32nd Floor, Standard Chartered Bank Building, 4-4A Des Voeux Road Central, HK \n公司地址：22/FFLAT/RM 2223YAN'S TOWER25-27 WONG CHUK HANG ROADABERDEEN HK"
        },{
          acceptAccountName: 'Hengshenghe (HK) Co., Limited',
          acceptAccountNo: '04600177',
          swiftCode: 'CMFGUS33',
          bankName: 'Modulr FS Limited',
          bankAddress: '58 Wood Ln',
          bankNo: '040085',
          companyAddress: "22/FFLAT/RM 2223YAN'S TOWER25-27 WONG CHUK HANG ROADABERDEEN HK",
          currency: 'GBP',
          currencySymbol: '￡',
          currencyLabel: '英镑',
          accountTmp: "账户名称：Hengshenghe (HK) Co., Limited \n银行账号：04600177 \n公司地址：22/FFLAT/RM 2223YAN'S TOWER25-27 WONG CHUK HANG ROADABERDEEN HK \n银行代码：040085 \n账户地点：英国 \nIBAN：GB17MODR04008504600177 \n银行名称：Modulr FS Limited \n银行地址：58 Wood Ln \n城市：London \n邮编：W12 7RZ"
        },{
          acceptAccountName: 'Hengshenghe (HK) Co., Limited',
          acceptAccountNo: 'EE617777000130320269',
          swiftCode: 'LHVBEE22',
          bankName: 'AS LHV PANK',
          bankAddress: 'Tartu mnt 2',
          companyAddress: "22/FFLAT/RM 2223YAN'S TOWER25-27 WONG CHUK HANG ROADABERDEEN HK",
          currency: 'EUR',
          currencySymbol: '€',
          currencyLabel: '欧元',
          accountTmp: "账户名称：Hengshenghe (HK) Co., Limited \n银行账号：EE617777000130320269 \n公司地址：22/FFLAT/RM 2223YAN'S TOWER25-27 WONG CHUK HANG ROADABERDEEN HK \nSWIFT code：LHVBEE22 \n账户地点：爱沙尼亚（欧洲） \nIBAN：EE617777000130320269 \n银行名称：AS LHV PANK \n银行地址：Tartu mnt 2 \n城市：Tallinn \n邮编：10145"
        },{
          acceptAccountName: 'ｴｱｰｳｵﾚﾂｸｽｼﾞｬﾊﾟﾝｶﾌﾞｼｷｶｲｼｬ',
          acceptAccountNo: '3354257',
          bankName: 'MUFG BANK, LTD. 三菱 UFJ 銀行',
          bankAddress: '7-1 Marunouchi 2-Chome, Chiyoda-Ku',
          bankNo: '0005',
          companyAddress: "22/FFLAT/RM 2223YAN'S TOWER25-27 WONG CHUK HANG ROADABERDEEN HK",
          currency: 'JPY',
          currencySymbol: 'Ұ',
          currencyLabel: '日元',
          accountTmp: "账户名称：ｴｱｰｳｵﾚﾂｸｽｼﾞｬﾊﾟﾝｶﾌﾞｼｷｶｲｼｬ \n银行账号：3354257 \n账户类型：Savings / Ordinary (普通) \n银行号：0005 \n分行代码：809 \n账户地点：日本 \n银行名称：MUFG BANK, LTD. 三菱 UFJ 銀行 \n支行名称：Wakatake ワカタケ \n银行地址：7-1 Marunouchi 2-Chome, Chiyoda-Ku \n城市：Tokyo \n公司地址：22/FFLAT/RM 2223YAN'S TOWER25-27 WONG CHUK HANG ROADABERDEEN HK"
        }],
      }, {
        plat: 'Lianlianpay',
        accountList: [{
          acceptAccountName: 'Hengshenghe (HK) Co., Limited',
          acceptAccountNo: '330100000021625',
          swiftCode: 'CITIHKHXXX',
          bankName: 'Citibank N.A. Hong Kong Branch',
          bankAddress: 'Citibank Tower, Citibank Plaza,3 Garden Road,Central, Hong Kong',
          companyAddress: "22/FFLAT/RM 2223YAN'S TOWER25-27 WONG CHUK HANG ROADABERDEEN HK",
          currency: 'USD',
          currencySymbol: '$',
          currencyLabel: '美元',
          accountTmp: "账户名称(Account Name)：Hengshenghe (HK) Co., Limited \n银行账号(Account Number)：330100000021625 \nSWIFT 代码(SWIFT/BIC)：CITIHKHXXX \n银行名称：Citibank N.A. Hong Kong Branch \n银行地址(Bank Address)：Citibank Tower, Citibank Plaza,3 Garden Road,Central, Hong Kong \n公司地址：22/FFLAT/RM 2223YAN'S TOWER25-27 WONG CHUK HANG ROADABERDEEN HK"
        }]
      }, {
        plat: '万里汇',
        accountList: [{
          acceptAccountName: 'Hengshenghe (HK) Co., Limited',
          acceptAccountNo: '281024150933688317802235',
          institutionName: 'World First Asia Limited',
          bankAddress: 'ROOM 3003-08, 30/F, CHUBB TOWER WINDSOR HOUSE, 311 GLOUCESTER ROAD, CAUSEWAY BAY, HONG KONG',
          companyAddress: "22/FFLAT/RM 2223YAN'S TOWER25-27 WONG CHUK HANG ROADABERDEEN HK",
          currency: 'USD',
          currencySymbol: '$',
          currencyLabel: '美元',
          accountTmp: "账户名称：Hengshenghe (HK) Co., Limited \n银行账号：281024150933688317802235 \n机构名称 Institution Name：World First Asia Limited \n银行 地址： ROOM 3003-08, 30/F, CHUBB TOWER WINDSOR HOUSE, 311 GLOUCESTER ROAD, CAUSEWAY BAY, HONG KONG \n公司地址：22/FFLAT/RM 2223YAN'S TOWER25-27 WONG CHUK HANG ROADABERDEEN HK"
        }, {
          acceptAccountName: 'Hengshenghe (HK) Co., Limited',
          acceptAccountNo: '281024150987817317082799',
          institutionName: 'World First Asia Limited',
          bankAddress: 'ROOM 3003-08, 30/F, CHUBB TOWER WINDSOR HOUSE, 311 GLOUCESTER ROAD, CAUSEWAY BAY, HONG KONG',
          companyAddress: "22/FFLAT/RM 2223YAN'S TOWER25-27 WONG CHUK HANG ROADABERDEEN HK",
          currency: 'EUR',
          currencySymbol: '€',
          currencyLabel: '欧元',
          accountTmp: "账户名称：Hengshenghe (HK) Co., Limited \n银行账号：281024150987817317082799 \n机构名称 Institution Name：World First Asia Limited \n银行 地址： ROOM 3003-08, 30/F, CHUBB TOWER WINDSOR HOUSE, 311 GLOUCESTER ROAD,CAUSEWAY BAY, HONG KONG \n公司地址：22/FFLAT/RM 2223YAN'S TOWER25-27 WONG CHUK HANG ROADABERDEEN HK"
        }, {
          acceptAccountName: 'Hengshenghe (HK) Co., Limited',
          acceptAccountNo: '281024150956266317661831',
          institutionName: 'World First Asia Limited',
          bankAddress: 'ROOM 3003-08, 30/F, CHUBB TOWER WINDSOR HOUSE, 311 GLOUCESTER ROAD, CAUSEWAY BAY, HONG KONG',
          companyAddress: "22/FFLAT/RM 2223YAN'S TOWER25-27 WONG CHUK HANG ROADABERDEEN HK",
          currency: 'CNY',
          currencySymbol: '¥',
          currencyLabel: '人民币',
          accountTmp: "账户名称：Hengshenghe (HK) Co., Limited \n银行账号：281024150956266317661831 \n机构名称 Institution Name：World First Asia Limited \n银行 地址： ROOM 3003-08, 30/F, CHUBB TOWER WINDSOR HOUSE, 311 GLOUCESTER ROAD,CAUSEWAY BAY, HONG KONG \n公司地址：22/FFLAT/RM 2223YAN'S TOWER25-27 WONG CHUK HANG ROADABERDEEN HK"
        }, {
          acceptAccountName: 'Hengshenghe (HK) Co., Limited',
          acceptAccountNo: '281024150960173318097332',
          institutionName: 'World First Asia Limited',
          bankAddress: 'ROOM 3003-08, 30/F, CHUBB TOWER WINDSOR HOUSE, 311 GLOUCESTER ROAD, CAUSEWAY BAY, HONG KONG',
          companyAddress: "22/FFLAT/RM 2223YAN'S TOWER25-27 WONG CHUK HANG ROADABERDEEN HK",
          currency: 'HKD',
          currencySymbol: 'HK$',
          currencyLabel: '港币',
          accountTmp: "账户名称：Hengshenghe (HK) Co., Limited \n银行账号：281024150960173318097332 \n机构名称 Institution Name：World First Asia Limited \n银行 地址： ROOM 3003-08, 30/F, CHUBB TOWER WINDSOR HOUSE, 311 GLOUCESTER ROAD,CAUSEWAY BAY, HONG KONG \n公司地址：22/FFLAT/RM 2223YAN'S TOWER25-27 WONG CHUK HANG ROADABERDEEN HK"
        }]
      }, {
        plat: 'Payoneer',
        accountList: [{
          acceptAccountName: 'zhangyuyan@sellergrowth.com',
          acceptAccountNo: 'LU204080000097899734',
          currency: 'EUR',
          currencySymbol: '€',
          currencyLabel: '欧元',
          accountTmp: "P卡账户名称：zhangyuyan@sellergrowth.com \n受益人姓名：HENGSHENGHE HK CO LIMITED \nIBAN：LU204080000097899734 \n银行名称：Banking Circle S.A. \n银行地址：2, Boulevard de la Foire L-1528 LUXEMBOURG \nBIC：BCIRLULL"
        }, {
          acceptAccountName: 'zhangyuyan@sellergrowth.com',
          acceptAccountNo: '4022699285261',
          currency: 'USD',
          currencySymbol: '$',
          currencyLabel: '美元',
          accountTmp: "P卡账户名称：zhangyuyan@sellergrowth.com \n受益人姓名:HENGSHENGHE HK CO LIMITED \n帐号:4022699285261 \n帐户类型:CHECKING \n银行名称:First Century Bank \n银行地址:1731 N Elm St Commerce, GA 30529 USA \n路由 ABA:061120084"
        }, {
          acceptAccountName: 'zhangyuyan@sellergrowth.com',
          acceptAccountNo: '14108493',
          currency: 'GBP',
          currencySymbol: '￡',
          currencyLabel: '英镑',
          accountTmp: "P卡账户名称：zhangyuyan@sellergrowth.com \n受益人姓名:HENGSHENGHE HK CO LIMITED \n帐号：14108493 \n银行名称:Barclays \n排序代码：231486 \n银行名称:MUFG Bank, Ltd."
        }, {
          acceptAccountName: 'zhangyuyan@sellergrowth.com',
          acceptAccountNo: '2705447',
          currency: 'JPY',
          currencySymbol: 'Ұ',
          currencyLabel: '日元',
          accountTmp: "P卡账户名称：zhangyuyan@sellergrowth.com \n受益人姓名：ﾍﾟｲｵﾆｱ ｼﾞﾔﾊﾟﾝ(ｶ \n帐号：2705447 \n银行地址：7-1 Marunouchi 2-Chome, Chiyoda-ku Tokyo, Japan \n银行代码：0005 \n分行代码：869 \n帐户类型：Savings / Futsu"
        }]
      }]
    return {
      // 支付平台信息列表
      list,
      currency: list[0].accountList[0].currency,
      currencyList: list[0].accountList,
      account:list[0].accountList[0],
      accountTmp: list[0].accountList[0].accountTmp,
      currencyPayAmount:'',
      fileList: [],
      foreign: {}
    };
  },
  watch: {
    payInfo: {
      handler(newVal) {
        if(newVal.paymentFile){
          this.fileList = [{
            uid: '1',
            name: newVal.paymentFile.split('\\').pop().split('/').pop(),
            status: 'done',
            url: newVal.paymentFile,
          }]
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created(){
    this.handleCalculate(this.currency)
  },
  computed: {
    enterpriseid() {
      return (localStorage.getItem('objInfo') && JSON.parse(localStorage.getItem('objInfo')).enterpriseId) || void 0;
    },
  },
  methods: {
    // 改变平台
    handleChangePlat(val){
      this.currencyList = this.list.find(o => o.plat === val).accountList
      this.account = this.currencyList[0]
      const { currency, accountTmp } = this.account
      this.currency = currency
      this.accountTmp = accountTmp
    },
    // 改变币种
    handleChangeCurrency(val){
      this.currency = val
      this.account = this.currencyList.find(o => o.currency === val)
      this.accountTmp = this.account.accountTmp
      this.handleCalculate(val)
    },
    // 计算金额
    handleCalculate(currency){
      rateCalculateAmount({
        afterCurrency: currency,
        amount: this.payInfo.amount,
        beforeCurrency: 'CNY',
        enterpriseId:this.enterpriseid
      }).then(res => {
        if(res.code === 0) {
          this.foreign = res.data
        }
      })
    },
    // 上传前
    beforeUploadHandler(file){
      let suffix = file.name.split('.')[1];
      if (!['jpg','png','jpeg'].includes(suffix)) {
        this.$message.error(`文件格式错误，请上传jpg,jpeg,png格式的文件`);
        this.uploadStatus = false
        return false;
      }
      if(file.size > 10 * 1000 * 1000){
        this.$message.error(`文件大小不能超过10MB`);
        this.uploadStatus = false
        return false;
      }
      this.uploadStatus = true
      this.fileList = []
    },
    // 上传
    handleChangeUpload(info){
      if(!this.uploadStatus){
        return
      }
      let fileList = [...info.fileList];
      fileList = fileList.slice(-2);
      fileList = fileList.map(file => {
        if (file.response) {
          file.url = file.response.data.fileUrl;
        }
        return file;
      });
      this.fileList = fileList;
      const status = info.file.status;
      if (status === 'done') {
        this.$message.success(`${info.file.name} 上传成功`);
      } else if (status === 'error') {
        this.$message.error(`${info.file.name} 上传失败`);
      }
    },
    // 提交
    submit(){
      if(!this.currencyPayAmount){
        this.$message.warning(`请输入金额`);
        return
      }
      if(!this.fileList.length){
        this.$message.warning(`请上传支付凭证`);
        return
      }
      const { acceptAccountName, acceptAccountNo, currency, currencySymbol, swiftCode } = this.account
      const { orderId, paymentChannel, amount} = this.payInfo
      uploadCertificate({
        acceptAccountName,
        acceptAccountNo,
        currency,
        currencySymbol,
        swiftCode,
        paymentAmount: amount,
        currencyPayAmount: this.currencyPayAmount,
        orderId,
        paymentChannel,
        paymentFile: this.fileList[0].url
      }).then(res => {
        if(res.code === 0) {
          this.$message.success(`支付凭证提交成功`);
          this.$emit('ok')
        }
      })
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  .plat{
    margin: 16px 0;
    padding: 16px;
    background: #E3F1FF;
    font-size: 14px;
    li{
      display: flex;
      align-items: center;
      span{
        width: 86px;
      }
    }
    li.foreign{
      div{
        display: flex;
        align-items: center;
        .input{
          width: 146px;
        }
        strong{
          margin-right: 5px;
        }
      }
    }
    li.amount{
      padding: 10px 0;
    }
    .select{
      width: 160px;
      margin-right: 8px;
    }
  }
  .account-info{
    white-space: pre-wrap;
    line-height: 26px;
    margin-bottom: 8px;
  }
  .ant-upload.ant-upload-drag p.ant-upload-drag-icon{
    margin-bottom: 5px;
  }
  .ant-upload.ant-upload-drag p.ant-upload-text, .ant-upload.ant-upload-drag p.ant-upload-hint{
    font-size: 12px;
  }
}
.footer { 
  margin-top: 20px;
  text-align: right;
  .ant-btn{
    margin-left: 24px;
  }
}
</style>
