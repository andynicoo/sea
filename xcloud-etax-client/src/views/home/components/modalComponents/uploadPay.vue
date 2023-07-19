<template>
  <div>
    <Modal v-model="modalShow" :mask-closable="false" @on-visible-change="changeState" ok-text="提交" :width="616">
      <p class="modal-title">
        {{
          status == 13
            ? '上传缴税凭证'
            : status == 19
            ? '重新上传缴税凭证'
            : status == 16 || status == 16
            ? '修改零申报凭证'
            : ''
        }}
      </p>
      <div v-if="status == 19" class="reject-reason">
        <span class="icon">!</span>申报被驳回（原因： <span class="reason">{{ taxDetailInfo.taxRejectReason }}</span> ）
      </div>
      <div v-if="JSON.stringify(detailData) != '{}'">
        <template v-if="whereKey == 'filingManagement' && (countryCode == 'GB' || europeanUnion)">
          <Row>
            <Col span="12">
              <span class="tax-info-name">VAT税号</span>
              <span class="tax-info-value">{{ detailData.vatTaxNumber }}</span>
            </Col>
            <Col span="12">
              <span class="tax-info-name">报税周期</span>
              <span class="tax-info-value">
                {{ detailData.beginTime && detailData.beginTime.slice(0, 7) }}至{{
                  detailData.endTime && detailData.endTime.slice(0, 7)
                }}
              </span>
            </Col>
          </Row>

          <Row>
            <Col span="12">
              <span class="tax-info-name">最终应缴税金</span>
              <span class="tax-info-value">{{ getUnit }} &nbsp; {{ detailData.allTaxPrice | formatQianFenWei }}</span>
            </Col>
          </Row>
        </template>

        <template v-else-if="countryCode == 'IOSS'">
          <Row>
            <Col span="12">
              <span class="tax-info-name">IOSS税号</span>
              <span class="tax-info-value">{{ detailData.vatTaxNumber }}</span>
            </Col>
            <Col span="12">
              <span class="tax-info-name">含税销售额总和</span>
              <span class="tax-info-value">{{ detailData.includTaxPrice }}</span>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <span class="tax-info-name">报税区间</span>
              <span class="tax-info-value">
                {{ detailData.beginTime && detailData.beginTime.slice(0, 7) }}至{{
                  detailData.endTime && detailData.endTime.slice(0, 7)
                }}
              </span>
            </Col>
            <Col span="12">
              <span class="tax-info-name">净销售额总和</span>
              <span class="tax-info-value">{{ detailData.excludeTaxPrice }}</span>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <span class="tax-info-name">最终缴纳税金</span>
              <span class="tax-info-value">{{ detailData.taxTotal }}</span>
            </Col>
          </Row>
        </template>
        <template v-else>
          <Row>
            <Col span="12">
              <span class="tax-info-name">VAT税号</span>
              <span class="tax-info-value">{{ detailData.vatTaxNumber }}</span>
            </Col>
            <Col span="12">
              <span class="tax-info-name">含税销售额</span>
              <span class="tax-info-value">{{ detailData.includeTaxPrice }}</span>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <span class="tax-info-name">报税区间</span>
              <span class="tax-info-value">
                {{ detailData.beginTime && detailData.beginTime.slice(0, 7) }}至{{
                  detailData.endTime && detailData.endTime.slice(0, 7)
                }}
              </span>
            </Col>
            <Col span="12">
              <span class="tax-info-name">不含税销售额</span>
              <span class="tax-info-value">{{ detailData.excludeTaxPrice }}</span>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <span class="tax-info-name">抵扣总金额</span>
              <span class="tax-info-value">{{ detailData.deductionPrice }}</span>
            </Col>
            <Col span="12">
              <span class="tax-info-name">销项税金</span>
              <span class="tax-info-value">{{ detailData.taxAmtTotal }}</span>
            </Col>
          </Row>
        </template>
      </div>
      <Divider />
      <Upload
        :action="fileUpload"
        class="uploadBox"
        :format="['jpg', 'jpeg', 'png', 'pdf']"
        :on-success="
          (res, file, fileList) => {
            handleSuccess(res, file, fileList);
          }
        "
        :on-remove="
          (file, fileList) => {
            handleRemoveFile(file, fileList);
          }
        "
        :before-upload="handleBeforeUpload"
        :on-format-error="handleFormatError"
      >
        <div style="padding: 34px 0">
          <img src="@/assets/images/common/upload1.png" alt="" />
          <p style="color: #666">点击或将文件拖拽到这里上传</p>
          <p class="fileType-tip">支持扩展名：.jpeg .png .pdf .jpg...</p>
        </div>
      </Upload>
      <Divider />
      <div slot="footer">
        <Button type="primary" @click="submit">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { certificate, taxLogDetail, updateZero } from '@/api/taxModule';
export default {
  props: {
    workId: '',
    serviceId: '',
    status: '',
    countryCode: '',
    whereKey: '',
    detailData: {},
  },
  data() {
    return {
      modalShow: true,
      fileUpload: this.ImgUrl,
      fileList: [],
      taxDetailInfo: {},
    };
  },
  mounted() {
    this.getInfo();
  },
  computed: {
    europeanUnion() {
      return [
        'AT',
        'BE',
        'BG',
        'CY',
        'CZ',
        'DE',
        'DK',
        'EE',
        'GR',
        'ES',
        'FI',
        'FR',
        'HR',
        'HU',
        'IE',
        'IT',
        'LT',
        'LU',
        'LV',
        'MT',
        'NL',
        'PL',
        'PT',
        'RO',
        'SE',
        'SI',
        'SK',
      ].includes(this.countryCode);
    },

    getUnit() {
      if (this.europeanUnion || this.countryCode == 'GB') {
        if (this.countryCode == 'CZ') {
          return 'Kč';
        } else if (this.countryCode == 'PL') {
          return 'zł';
        } else if (this.countryCode == 'SE') {
          return 'kr';
        } else if (this.countryCode == 'GB') {
          return '£';
        } else {
          return '€';
        }
      }
      return '';
    },
  },
  methods: {
    getInfo() {
      taxLogDetail(this.serviceId).then((res) => {
        if (res.code === 0) {
          if (this.workId == undefined) {
            this.taxDetailInfo = res.data[0];
          } else {
            res.data.map((item, index) => {
              if (this.workId == item.id) {
                this.taxDetailInfo = item;
              }
            });
          }
        }
      });
    },
    changeState(val) {
      let obj = {
        state: val,
        refresh: true,
      };
      this.$emit('changeState', obj);
    },
    handleSuccess(res, file, fileList) {
      this.fileList = fileList;
    },
    handleBeforeUpload() {
      const check = this.fileList.length == 0;
      // console.log(this.AmzFileList)
      if (!check) {
        this.$Notice.warning({
          title: '最多上传一个文件',
        });
      }
      return check;
    },
    handleRemoveFile(file, fileList) {
      this.fileList = fileList;
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: '文件类型错误',
        desc: '只支持jpg、jpeg、png、pdf',
      });
    },
    submit() {
      const self = this;
      let certificateUrl = '';
      this.fileList.map((v, i) => {
        if (i != self.fileList.length - 1) {
          certificateUrl += v.response.data.fileUrl + ';';
        } else {
          certificateUrl += v.response.data.fileUrl;
        }
      });
      if (this.status == 16) {
        //修改零申报凭证
        let obj = {
          certificateUrl: certificateUrl,
          workOrderId: this.workId,
        };
        updateZero(obj).then((res) => {
          if (res.code == 0) {
            this.$Message.success('修改成功');
            // location.reload();
            this.changeState(false);
          }
        });
      } else {
        this.otherSubmit(certificateUrl);
      }
    },
    otherSubmit(certificateUrl) {
      const self = this;
      if (this.fileList.length == 0) {
        this.$Message.error('请先上传缴费凭证');
        return;
      }
      let obj = {
        id: this.workId,
        taxCertificate: certificateUrl,
      };
      certificate(obj).then((res) => {
        if (res.code === 0) {
          this.$Message.success('提交成功');
          // location.reload();
          this.changeState(false);
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.uploadBox /deep/ .ivu-upload.ivu-upload-select {
  border: 1px dashed #dcdee2;
  text-align: center;
  margin-bottom: 10px;
  width: 380px;
  height: 195px;
  margin-left: 102px;
}
/deep/ .ivu-upload-list {
  width: 380px;
  margin-left: 102px;
}

.modal-title {
  font-size: 14px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: rgba(51, 51, 51, 1);
  line-height: 14px;
  margin-bottom: 24px;
}
/deep/ .ivu-modal-header {
  display: none;
}
.fileType-tip {
  font-size: 12px;
  color: #999999;
  margin-top: 4px;
}
.tax-info-name {
  display: inline-block;
  min-width: 98px;
  font-size: 16px;
  font-family: PingFangSC;
  color: rgba(102, 102, 102, 1);
  line-height: 26px;
  text-align: right;
  margin-right: 16px;
}
.tax-info-value {
  font-size: 16px;
  font-family: 'PingFangSC-Medium,PingFang SC';
  font-weight: 500;
  color: #333333;
  line-height: 26px;
  a {
    color: #16ade9;
  }
  img {
    vertical-align: middle;
    margin-right: 5px;
  }
}
.baseInfo {
  margin: 22px 0 12px 0;
}
.reject-reason {
  padding: 4px 16px;
  background-color: #fff1dd;
  font-size: 20px;
  margin-bottom: 18px;
  span.icon {
    font-size: 20px;
    width: 20px;
    height: 20px;
    background-color: #d72323;
    color: #fff;
    display: inline-block;
    border-radius: 50%;
    text-align: center;
    line-height: 20px;
    font-weight: 600px;
    margin-right: 6px;
  }
  span.reason {
    color: #d72323;
  }
}
</style>
