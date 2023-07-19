<template>
  <div class="main">
    <div class="productListTable">
      <div style="background: #fff1dd; margin-bottom: 14px">
        <div style="display: flex">
          <p class="beizhu" style="padding-right: 0; margin-bottom: 0">
            <img src="@/assets/images/compliance/beizhu.svg" />
            温馨提示：
          </p>
          <div>
            <p class="beizhu" style="padding: 10px 3px 3px; margin-bottom: 0">
              1、请填写公司名下的产品信息，可自行插入或删减数量
            </p>
            <p class="beizhu" style="padding: 3px 3px; margin-bottom: 0">
              2、所填写的每一个产品都需要提供对应产品的检测报告和证书（产品名、型号和所提供的报告、证书保持一致），否则审核不通过
            </p>
            <p class="beizhu" style="padding: 3px 3px 10px 3px; margin-bottom: 0">
              3、若同一产品包括多个认证文件，可在最右侧“其他产品文件”处补充上传
            </p>
          </div>
        </div>
      </div>
      <p style="font-size: 14px; margin-bottom: 14px">
        <img src="@/assets/images/common/searchImg.png" alt="" width="16" style="position: relative; top: 3px" />
        <span style="color: #16ade9; cursor: pointer" @click="proClassModal = true">
          请点击查看详细的不接单产品类别
        </span>
      </p>
      <Table border :columns="columns" :data="productList">
        <template slot="ceCertificat" slot-scope="{ row }">
          <Upload
            :before-upload="beforeUploadHandler"
            :on-format-error="formatErrorHandler"
            :on-success="
              (res, file, fileList) => {
                successHandler(res, file, fileList, 'ceCertificat', row, 'CE证书');
              }
            "
            :on-remove="
              (file, fileList) => {
                removeHandler(file, fileList, 'ceCertificat', row);
              }
            "
            :action="ImgUrl"
            :data="{ prefix: '' }"
            :show-upload-list="true"
            :format="['jpg', 'jpeg', 'png', 'pdf', 'zip', 'rar']"
            :max-size="102400"
            :on-exceeded-size="handleMaxSize"
            :on-preview="openFile"
            :default-file-list="productList[row._index].ceCertificat"
            v-if="!disabled"
          >
            <div class="inner1" @click="beforType(row, 'ceCertificat')">
              <span class="uplad-word" :class="{ isDetails: isDetails }">
                <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                点击上传
              </span>
            </div>
          </Upload>
          <span v-else>
            <div class="out-img-box" v-if="productList[row._index].ceCertificat.length">
              <div
                class="img-box"
                v-for="(item, index) in productList[row._index].ceCertificat"
                :key="item.fileUrl"
                style="padding-right: 15px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis"
              >
                <a :href="item.url.replace('http:', 'https:')" target="_blank" class="show-pdf">CE证书</a>
              </div>
            </div>
            <div v-else>-</div>
          </span>
        </template>
        <template slot="productTestReportCertificat" slot-scope="{ row }">
          <Upload
            :before-upload="beforeUploadHandler"
            :on-format-error="formatErrorHandler"
            :on-success="
              (res, file, fileList) => {
                successHandler(res, file, fileList, 'productTestReportCertificat', row, '产品检测报告');
              }
            "
            :on-remove="
              (file, fileList) => {
                removeHandler(file, fileList, 'productTestReportCertificat', row);
              }
            "
            :action="ImgUrl"
            :data="{ prefix: '' }"
            :show-upload-list="true"
            :format="['jpg', 'jpeg', 'png', 'pdf', 'zip', 'rar']"
            :max-size="102400"
            :on-exceeded-size="handleMaxSize"
            :on-preview="openFile"
            :default-file-list="productList[row._index].productTestReportCertificat"
            v-if="!disabled"
          >
            <div class="inner1" @click="beforType(row, 'productTestReportCertificat')">
              <span class="uplad-word" :class="{ isDetails: isDetails }">
                <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                点击上传
              </span>
            </div>
          </Upload>
          <span v-else>
            <div class="out-img-box" v-if="productList[row._index].productTestReportCertificat.length">
              <div
                class="img-box"
                v-for="(item, index) in productList[row._index].productTestReportCertificat"
                :key="item.fileUrl"
                style="padding-right: 15px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis"
              >
                <a :href="item.url.replace('http:', 'https:')" target="_blank" class="show-pdf">产品检测报告</a>
              </div>
            </div>
            <div v-else>-</div>
          </span>
        </template>
        <template slot="ukcaCertificat" slot-scope="{ row }">
          <Upload
            :before-upload="beforeUploadHandler"
            :on-format-error="formatErrorHandler"
            :on-success="
              (res, file, fileList) => {
                successHandler(res, file, fileList, 'ukcaCertificat', row, 'UKCA证书');
              }
            "
            :on-remove="
              (file, fileList) => {
                removeHandler(file, fileList, 'ukcaCertificat', row);
              }
            "
            :action="ImgUrl"
            :data="{ prefix: '' }"
            :show-upload-list="true"
            :format="['jpg', 'jpeg', 'png', 'pdf', 'zip', 'rar']"
            :max-size="102400"
            :on-exceeded-size="handleMaxSize"
            :on-preview="openFile"
            :default-file-list="productList[row._index].ukcaCertificat"
            v-if="!disabled"
          >
            <div class="inner1" @click="beforType(row, 'ukcaCertificat')">
              <span class="uplad-word" :class="{ isDetails: isDetails }">
                <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                点击上传
              </span>
            </div>
          </Upload>

          <span v-else>
            <div class="out-img-box" v-if="productList[row._index].ukcaCertificat.length">
              <div
                class="img-box"
                v-for="(item, index) in productList[row._index].ukcaCertificat"
                :key="item.fileUrl"
                style="padding-right: 15px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis"
              >
                <a :href="item.url.replace('http:', 'https:')" target="_blank" class="show-pdf">UKCA证书</a>
              </div>
            </div>
            <div v-else>-</div>
          </span>
        </template>
        <template slot="productCertificat" slot-scope="{ row }">
          <Upload
            :on-format-error="formatErrorHandler"
            :on-success="
              (res, file, fileList) => {
                successHandler(res, file, fileList, 'productCertificat', row, '其他产品文件');
              }
            "
            :on-remove="
              (file, fileList) => {
                removeHandler(file, fileList, 'productCertificat', row);
              }
            "
            :action="ImgUrl"
            :data="{ prefix: '' }"
            :show-upload-list="true"
            :format="['jpg', 'jpeg', 'png', 'pdf', 'zip', 'rar']"
            :max-size="102400"
            :on-exceeded-size="handleMaxSize"
            :on-preview="openFile"
            :default-file-list="productList[row._index].productCertificat"
            v-if="!disabled"
          >
            <div class="inner1" @click="beforType(row, 'productCertificat')">
              <span class="uplad-word" :class="{ isDetails: isDetails }">
                <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                点击上传
              </span>
            </div>
          </Upload>
          <span v-else>
            <div class="out-img-box" v-if="productList[row._index].productCertificat.length">
              <div
                class="img-box"
                v-for="(item, index) in productList[row._index].productCertificat"
                :key="item.fileUrl"
                style="padding-right: 15px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis"
              >
                <a :href="item.url.replace('http:', 'https:')" target="_blank" class="show-pdf">其他产品文件</a>
              </div>
            </div>
            <div v-else>-</div>
          </span>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Tooltip placement="top" content="添加信息栏" v-if="!disabled && !isDetails">
            <img
              src="@/assets/images/compliance/add.svg"
              style="margin-right: 5px; cursor: pointer"
              @click="addProduct"
            />
          </Tooltip>
          <Tooltip placement="top" content="删除信息栏" transfer v-if="!disabled && !isDetails">
            <img
              src="@/assets/images/compliance/cut.svg"
              @click="remove(index)"
              style="cursor: pointer"
              v-if="index != 0"
            />
          </Tooltip>
        </template>
      </Table>
      <Modal v-model="proClassModal" width="780">
        <div class="tipsModal-title">不接单产品类别</div>
        <Divider style="margin: 16px 0" />
        <div style="margin-bottom: 21px">
          <img src="@/assets/images/common/class.png" width="740" alt="" />
        </div>
        <div slot="footer" style="padding-bottom: 20px">
          <Button type="primary" @click="proClassModal = false" style="width: 90px">确认</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import { log } from 'mathjs';
export default {
  props: ['value', 'countryNameZh', 'disabled', 'isDetails'],
  data() {
    return {
      proClassModal: false,
      columns: [
        {
          renderHeader: (h, params) => {
            return h('div', [
              h('p', [
                h(
                  'span',
                  {
                    style: {
                      color: 'red',
                      marginRight: '3px',
                      fontWeight: '600',
                    },
                  },
                  '*'
                ),
                h(
                  'span',
                  {
                    style: {
                      color: '#333',
                      fontWeight: '600',
                    },
                  },
                  'Product Name/产品中文'
                ),
              ]),
              h(
                'p',
                {
                  style: {
                    color: '#F13D23',
                    fontSize: '12px',
                    fontWeight: '500',
                  },
                },
                '如：SolarLight/太阳能灯'
              ),
              h(
                'p',
                {
                  style: {
                    color: '#F13D23',
                    fontSize: '12px',
                    fontWeight: '500',
                  },
                },
                '注：产品英文名与产品证书上的产品英文名保持一致'
              ),
            ]);
          },
          render: (h, params) => {
            if (this.isDetails) {
              return h('span', params.row.productName);
            }
            return h('Input', {
              props: {
                value: params.row.productName,
                // size: 'small',
                placeholder: '如：SolarLight/太阳能灯',
                maxlength: 100,
                disabled: this.disabled,
              },
              on: {
                input: (val) => {
                  this.productList[params.index].productName = val;
                },
              },
            });
          },
          align: 'center',
          minWidth: 100,
        },
        {
          renderHeader: (h, params) => {
            return h('div', [
              h('p', [
                h(
                  'span',
                  {
                    style: {
                      color: 'red',
                      marginRight: '3px',
                      fontWeight: '600',
                    },
                  },
                  '*'
                ),
                h(
                  'span',
                  {
                    style: {
                      color: '#333',
                      fontWeight: '600',
                    },
                  },
                  'Brand'
                ),
              ]),
              h(
                'p',
                {
                  style: {
                    color: '#F13D23',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '500',
                  },
                },
                '填已注册备案的品牌，若未注册，可填写正在使用的品牌名'
              ),
            ]);
          },
          render: (h, params) => {
            if (this.isDetails) {
              return h('span', params.row.brand);
            }
            return h('Input', {
              props: {
                value: params.row.brand,
                // size: 'small',
                placeholder: '填已注册备案的品牌，若未注册，可填写正在使用的品牌名',
                maxlength: 100,
                disabled: this.disabled,
              },
              on: {
                input: (val) => {
                  this.productList[params.index].brand = val;
                },
              },
            });
          },
          align: 'center',
          minWidth: 100,
        },
        {
          renderHeader: (h, params) => {
            return h('div', [
              h('p', [
                h(
                  'span',
                  {
                    style: {
                      color: 'red',
                      marginRight: '3px',
                      fontWeight: '600',
                    },
                  },
                  '*'
                ),
                h(
                  'span',
                  {
                    style: {
                      color: '#333',
                      fontWeight: '600',
                    },
                  },
                  'Models'
                ),
              ]),
              h(
                'p',
                {
                  style: {
                    color: '#F13D23',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '500',
                  },
                },
                '产品型号需与证书上的型号保持一致，无型号则写无'
              ),
            ]);
          },
          render: (h, params) => {
            if (this.isDetails) {
              return h('span', params.row.models);
            }
            return h('Input', {
              props: {
                value: params.row.models,
                // size: 'small',
                placeholder: '产品型号需与证书上的型号保持一致，无型号则写无',
                maxlength: 500,
                disabled: this.disabled,
              },
              on: {
                input: (val) => {
                  this.productList[params.index].models = val;
                },
              },
            });
          },
          align: 'center',
          minWidth: 100,
        },
        {
          renderHeader: (h, params) => {
            return h('div', [
              h('p', [
                h(
                  'span',
                  {
                    style: {
                      color: 'red',
                      marginRight: '3px',
                      fontWeight: '600',
                    },
                  },
                  '*'
                ),
                h(
                  'span',
                  {
                    style: {
                      color: '#333',
                      fontWeight: '600',
                    },
                  },
                  'Classification'
                ),
              ]),
              h(
                'p',
                {
                  style: {
                    color: '#F13D23',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '500',
                  },
                },
                '分类需要与电商平台上产品的大类目一致'
              ),
            ]);
          },
          render: (h, params) => {
            if (this.isDetails) {
              return h('span', params.row.classification);
            }
            return h('Input', {
              props: {
                value: params.row.classification,
                // size: 'small',
                placeholder: '分类需要与电商平台上产品的大类目一致',
                maxlength: 100,
                disabled: this.disabled,
              },
              on: {
                input: (val) => {
                  this.productList[params.index].classification = val;
                },
              },
            });
          },
          align: 'center',
          minWidth: 100,
        },
        {
          title: 'CE证书',
          slot: 'ceCertificat',
          align: 'center',
          minWidth: 100,
        },
        {
          title: '产品检测报告',
          slot: 'productTestReportCertificat',
          align: 'center',
          minWidth: 100,
        },
        {
          title: 'UKCA证书',
          slot: 'ukcaCertificat',
          align: 'center',
          minWidth: 100,
        },
        {
          title: '其他产品文件',
          slot: 'productCertificat',
          align: 'center',
          minWidth: 100,
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          width: 100,
        },
      ],
      productList: [],
      base64URI: '',
      shouquanForm: {
        serviceProvidersAgreementBySigned: '',
        serviceProvidersCertificateBySigned: '',
      },
      showShouquanForm: {
        serviceProvidersAgreementBySigned: '',
        serviceProvidersCertificateBySigned: '',
      },
      rowData: {},
    };
  },
  watch: {
    value: {
      handler(val) {
        console.log(val, 'val');
        if (val && val.length) {
          // this.productList = val;
          this.productList = val.map((item) => ({
            productName: item.productName,
            brand: item.brand,
            models: item.models,
            classification: item.classification,
            ceCertificat: this.reviewFile(item.ceCertificat, 'CE证书'),
            productTestReportCertificat: this.reviewFile(item.productTestReportCertificat, '产品检测报告'),
            ukcaCertificat: this.reviewFile(item.ukcaCertificat, 'UKCA证书'),
            productCertificat: this.reviewFile(item.productCertificat, '其他产品文件'),
          }));
        }
      },
      immediate: true,
    },
    productList: {
      handler() {
        if (!this.productList.length) {
          this.addProduct();
        }
        for (let i = 0; i < this.productList.length; i++) {
          let item = this.productList[i];
          let requiredList = ['productName', 'brand', 'models', 'classification'];
          for (let j in item) {
            if (requiredList.includes(j) && item[j] === '') {
              this.$emit('input', []);
              return;
            }
          }
        }
        let data = this.productList.map((item) => ({
          ...item,
          ceCertificat: this.dealFile(item.ceCertificat),
          productTestReportCertificat: this.dealFile(item.productTestReportCertificat),
          ukcaCertificat: this.dealFile(item.ukcaCertificat),
          productCertificat: this.dealFile(item.productCertificat),
        }));
        if (!this.isDetails) {
          this.$emit('input', data);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    dealFile(file) {
      return file && file.length ? file.map((i) => i.url).join(',') : '';
    },
    reviewFile(url, name) {
      let urlList = url ? url.split(',') : [];
      return urlList.map((item) => ({
        url: item,
        name,
      }));
    },
    remove(index) {
      if (this.disabled) return;
      this.productList.splice(index, 1);
    },
    addProduct() {
      if (this.disabled) return;
      this.productList.push({
        productName: '',
        brand: '',
        models: '',
        classification: '',
        manufacturer: '',
        ceCertificat: '',
        productTestReportCertificat: '',
        ukcaCertificat: '',
        productCertificat: '',
      });
    },
    openFile(file) {
      window.open(this.replaceHttps(file.url));
    },
    successHandler(res, file, fileList, item, row, name) {
      let self = this;
      if (res.code !== 0) {
        self.$Notice.warning({
          title: '警告',
          desc: '请尝试再次上传',
        });
        return false;
      }
      this.productList[row._index][item] = fileList.map((item) => ({
        url: item.response && item.response.data ? item.response.data.fileUrl : item.url.replace('http:', 'https:'),
        name,
      }));
    },
    formatErrorHandler() {
      this.$Notice.warning({
        title: '文件格式错误',
        desc: '文件格式不正确, 请上传jpg, jpeg, png, gif,pdf格式的文件',
      });
    },
    beforeUploadHandler(file) {
      this.base64URI = '';
      const reader = new FileReader();
      //将文件读取为 DataURL 以data:开头的字符串
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        // 读取到的图片base64 数据编码 将此编码字符串传给后台即可
        const code = e.target.result;
        this.base64URI = code.replace('data:image/jpeg;base64,', '');
      };
      let self = this;
      const check = self.productList[self.rowData._index][self.nowFile].length;
      if (check) {
        self.$Notice.warning({
          title: '最多只可上传1个文件',
        });
      }
      return !check;
    },
    beforType(row, item) {
      this.rowData = row;
      this.nowFile = item;
    },
    removeHandler(file, fileList, item, row, index) {
      this.productList[row._index][item] = fileList;
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: '超过文件大小限制',
        desc: '上传文件不超过100M',
      });
    },
  },
  created() {
    if (this.countryNameZh == '欧盟') {
      this.columns.splice(6, 1);
    }
  },
};
</script>

<style lang="less" scoped>
/deep/ .ivu-input {
  font-size: 14px !important;
}
.productListTable {
  /deep/ .ivu-upload-select {
    width: 100px !important;
  }
}
/deep/ .ivu-input {
  display: inline-block;
  width: 130px !important;
  height: 32px;
  line-height: 1.5;
  padding: 4px 7px;
  font-size: 14px;
  border: 1px solid #dcdee2;
  border-radius: 4px;
  color: #515a6e;
  background-color: #fff;
  background-image: none;
  position: relative;
  cursor: text;
  transition: border 0.2s ease-in-out, background 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
/deep/ .ivu-table-header {
  th {
    font-weight: 600;
    color: #333;
  }
}
/deep/ .ivu-table {
  td {
    padding-top: 16px;
    padding-bottom: 16px;
  }
}
/deep/ .ivu-input {
  width: 120px;
}
/deep/ .ivu-upload {
  .inner1 {
    width: 100px;
    text-align: center;
    height: 32px;
    // background: #16ade9;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    cursor: pointer;
    .uplad-word {
      color: #02a7f0;
    }
  }
}
.out-img-box {
  .img-box {
    position: relative;
    text-align: center;
    padding-top: 8px;
    width: 100%;
    .show-pdf {
      color: #16ade9;
    }
    button {
      width: 0px;
      padding: 0px;
      border: none;
      position: absolute;
      top: 8px;
      height: 0px;
      z-index: 1;
      margin-left: 3px;
      img.closeImg {
        width: 13px;
        height: 13px;
      }
    }
  }
}
.upload-tip {
  font-size: 14px;
  color: #cccccc;
  vertical-align: bottom;
  margin-right: 16px;
  a {
    color: #16ade9;
  }
  img {
    width: 16px;
    height: 16px;
    margin-top: 9px;
    float: left;
    margin-right: 3px;
  }
  display: inline-block;
}
.red-tip {
  margin: 20px 0;

  font-size: 14px;
  font-family: 'Microsoft Yahei', 'PingFang SC', sans-serif;
  font-weight: 500;
  color: #1890ff;
  line-height: 20px;
}
.footer {
  margin-top: 20px;
  width: 100%;
  text-align: center;
}
.download {
  color: #02a7f0;
  cursor: pointer;
  margin-bottom: 20px;
  display: inline-block;
}
.isDetails {
  display: none;
}
</style>
