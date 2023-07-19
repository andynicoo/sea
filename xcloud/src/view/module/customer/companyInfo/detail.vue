<template>
  <div class="saleDetail">
    <div class="header-container">
      <el-link :underline="false" type="info" @click="goBack"><i class="el-icon-arrow-left"></i> 查看详情 </el-link>
      <div class="state">
        <el-tag>{{ info.status | filterStatus }}</el-tag>
        <div class="sn">{{ info.companyName }}</div>
      </div>
      <el-descriptions :column="4" :labelStyle="{ color: '#666666' }" :contentStyle="{ color: '#333333' }">
        <el-descriptions-item label="公司英文名称">{{ info.companyNameEn }}</el-descriptions-item>
        <el-descriptions-item label="统一信用代码">{{ info.companyCreditCode }}</el-descriptions-item>
        <el-descriptions-item label="联系方式">{{ info.companyTel }}</el-descriptions-item>
        <el-descriptions-item label="公司联系邮箱">{{ info.companyEmail }}</el-descriptions-item>
      </el-descriptions>
      <div class="bottom-area">
        <el-descriptions :column="3" class="border-box" :labelStyle="{ color: '#999999' }" :contentStyle="{ color: '#666666' }">
          <span slot="title"> <el-divider direction="vertical"></el-divider>公司信息</span>
          <el-descriptions-item label="公司中文名称">{{ info.companyNameZh }}</el-descriptions-item>
          <el-descriptions-item label="公司英文名称">{{ info.companyNameEn }}</el-descriptions-item>
          <el-descriptions-item label="统一信用代码">{{ info.companyCreditCode }}</el-descriptions-item>
          <el-descriptions-item label="联系方式">{{ info.companyTel }}</el-descriptions-item>
          <el-descriptions-item label="联系人">{{ info.contactPerson }}</el-descriptions-item>
          <el-descriptions-item label="公司中文地址" :span="3">{{ info.companyAddressZh }}</el-descriptions-item>
          <el-descriptions-item label="公司英文地址" :span="3">{{ `${info.companyAddressEnCountry}${info.companyAddressEnCity}${info.companyAddressEn}` }}</el-descriptions-item>
          <el-descriptions-item label="公司邮箱">{{ info.companyEmail }}</el-descriptions-item>
          <el-descriptions-item label="公司成立日期">{{ info.companyRegisterData | filterDate }}</el-descriptions-item>
          <el-descriptions-item label="公司网址">{{ info.companySite }}</el-descriptions-item>
          <el-descriptions-item label="公司所在地区">{{ info.coRegionName }}</el-descriptions-item>
          <el-descriptions-item label="公司类型">{{ info.companyType | filterType }}</el-descriptions-item>

          <el-descriptions-item label="营业执照扫描件" :span="3">
            <template v-if="info.companyBusinessLicense">
              <el-image class="block-img" :src="url" :preview-src-list="[url]" v-for="(url, index) in formatImage(info.companyBusinessLicense)" :key="index"> </el-image>
            </template>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="3" class="border-box" :labelStyle="{ color: '#999999' }" :contentStyle="{ color: '#666666' }">
          <span slot="title"> <el-divider direction="vertical"></el-divider>法人信息</span>
          <el-descriptions-item label="法人中文名称">{{ info.companyLegalPersonZh }}</el-descriptions-item>
          <el-descriptions-item label="法人英文名称">{{ info.companyLegalPersonEn }}</el-descriptions-item>
          <el-descriptions-item label="法人联系邮箱">{{ info.companyLegalPersonEmail }}</el-descriptions-item>
          <el-descriptions-item label="法人电话">{{ info.companyLegalPersonMobile }}</el-descriptions-item>
          <el-descriptions-item label="法人出生日期">{{ info.companyLegalPersonBirthday | filterDate }}</el-descriptions-item>
          <el-descriptions-item label="法人身份证号码">{{ info.companyLegalPersonCard }}</el-descriptions-item>
          <el-descriptions-item label="法人身份证中文地址" :span="3">{{ info.companyLegalPersonCardAddressZh }}</el-descriptions-item>
          <el-descriptions-item label="法人身份证英文地址" :span="3">{{ info.companyLegalPersonCardAddressEn }}</el-descriptions-item>
          <el-descriptions-item label="法人出生地邮编号码" :span="3">{{ info.companyLegalPersonBirthPostCode }}</el-descriptions-item>
          <el-descriptions-item label="法人身份证正面扫描件">
            <template v-if="info.companyLegalPersonCardFront">
              <el-image class="block-img" :src="url" :preview-src-list="[url]" v-for="(url, index) in formatImage(info.companyLegalPersonCardFront)" :key="index"> </el-image>
            </template>
          </el-descriptions-item>
          <el-descriptions-item label="法人驾驶证">
            <template v-if="info.driverLicense">
              <el-image class="block-img" :src="url" :preview-src-list="[url]" v-for="(url, index) in formatImage(info.driverLicense)" :key="index"> </el-image>
            </template>
          </el-descriptions-item>
          <el-descriptions-item label="法人护照扫描件">
            <template v-if="info.companyLegalPersonCardPassport">
              <el-image class="block-img" :src="url" :preview-src-list="[url]" v-for="(url, index) in formatImage(info.companyLegalPersonCardPassport)" :key="index"> </el-image>
            </template>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="3" class="border-box" :labelStyle="{ color: '#999999' }" :contentStyle="{ color: '#666666' }">
          <span slot="title"> <el-divider direction="vertical"></el-divider>店铺信息</span>
          <el-descriptions-item label="店铺所在电商平台">{{ info.shopSalePlatformName }}</el-descriptions-item>
          <el-descriptions-item label="店铺后台链接">{{ info.shopHref }}</el-descriptions-item>
          <el-descriptions-item label="邮编号码">{{ info.postCode }}</el-descriptions-item>
          <el-descriptions-item label="平台店铺名称">{{ info.shopName }}</el-descriptions-item>
          <el-descriptions-item label="是否有欧盟EORI号">{{ info.needEoriNumber | filterNeedEori }}</el-descriptions-item>
          <el-descriptions-item label="税率">{{ info.shopTaxRate | filterRate }}</el-descriptions-item>
          <el-descriptions-item label="后台店铺截图" :span="3">
            <template v-if="info.shopAddressScreenshot">
              <el-image class="block-img" :src="url" :preview-src-list="[url]" v-for="(url, index) in formatImage(info.shopAddressScreenshot)" :key="index"> </el-image>
            </template>
          </el-descriptions-item>
        </el-descriptions>
        <div class="border-box">
          <div class="tittle">
            <el-divider direction="vertical"></el-divider>
            <span class="text-info">其他信息</span>
          </div>
          <div class="other-info-wrapper">
            <div class="ope-block">
              <el-avatar icon="el-icon-user-solid"></el-avatar>
              <div class="ope-info">
                <div class="ope-content">
                  创建人：<span>{{ info.createName }}</span>
                </div>
                <div class="ope-content">
                  创建时间：<span>{{ info.createTime }}</span>
                </div>
              </div>
            </div>
            <div class="ope-block">
              <el-avatar icon="el-icon-user-solid"></el-avatar>
              <div class="ope-info">
                <div class="ope-content">
                  修改人：<span>{{ info.modifyName }}</span>
                </div>
                <div class="ope-content">
                  修改时间：<span>{{ info.updateTime }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserCompanyMaterialInfo } from '@/api/newApi/customer/companyInfo';
export default {
  data() {
    return {
      id: this.$route.query.id || 0,
      info: {},
    };
  },
  filters: {
    filterStatus(status) {
      switch (status) {
        case 1:
          return '正常';
        case 2:
          return '失效';
      }
    },
    filterType(type) {
      switch (type) {
        case 1:
          return '大陆公司';
        case 2:
          return '香港公司';
        case 2:
          return '境外公司';
      }
    },
    filterNeedEori(isNeed) {
      switch (isNeed) {
        case 0:
          return '否';
        case 1:
          return '是';
      }
    },
    filterRate(rate) {
      switch (rate) {
        case 1:
          return '低税率';
        case 2:
          return '标准税率';
        case 2:
          return '其他';
      }
    },
    filterDate(date = '') {
      return date.split(' ')[0];
    },
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    goBack() {
      this.$router.push({
        path: '/customer/companyInfo/index',
      });
    },
    getInfo() {
      getUserCompanyMaterialInfo(this.id).then((res) => {
        this.info = res.data;
      });
    },
    formatImage(imageList) {
      let res = [];
      if (typeof imageList === 'object') {
        res = imageList;
      } else if (imageList) {
        try {
          res = JSON.parse(imageList);
        } catch (error) {
          try {
            res = imageList.split(',');
          } catch (e) {}
        }
      }
      return res;
    },
  },
};
</script>

<style lang="less" scoped>
::v-deep .el-descriptions-item__label {
  white-space: nowrap;
}
::v-deep .el-descriptions {
  padding-top: 20px;
  font-family: PingFangSC-Regular, PingFang SC;
}
::v-deep .el-descriptions__title {
  font-size: 14px;
  font-weight: 400;
  color: #666666;
  line-height: 20px;
}
.saleDetail {
  .header-container {
    padding: 30px;
    background-color: #fff;
    .state {
      display: flex;
      align-items: center;
      white-space: nowrap;
      padding-top: 20px;
      .el-tag--small {
        padding: 0 12px;
      }
      .sn {
        font-size: 14px;
        margin-left: 5px;
        font-weight: bold;
      }
    }
    .bottom-area {
      height: calc(100vh - 300px);
      overflow-y: auto;
    }
    .border-box {
      border: 1px solid #eeeeee;
      margin: 30px 0;
      padding: 20px 30px;
    }
  }
  .block-img {
    width: 135px;
    height: 65px;
    margin-right: 10px;
    cursor: zoom-in;
  }
  .table-title {
    font-size: 16px;
    margin: 20px 0;
    color: #333;
  }
  .check-btn {
    width: 100% !important;
    text-align: right !important;
    border-top: 1px solid #ccc;
  }
  .other-info-wrapper {
    display: flex;
    flex-wrap: wrap;
    font-size: 12px;
    color: #999999;
    .ope-block {
      display: flex;
      margin-right: 30px;
      margin-bottom: 50px;
      .avatar {
        flex: 0 0 40px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
      }
      .ope-info {
        width: 250px;
        margin-left: 10px;
        .ope-content {
          margin-bottom: 10px;
        }
        span {
          color: #666666;
        }
      }
    }
  }
}
.tittle {
  font-size: 14px;
  padding: 10px 0;
}
</style>
