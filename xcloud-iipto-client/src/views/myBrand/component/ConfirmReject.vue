<template>
  <div>
    <div class="container">
      <div class="sure-proof-box">
        <p class="tip">
          * 您购买的
          使用证据补正信息已经制作完成，请认查看使用证据信息，并点击下方的按钮【确认证据无误】或【证据有误，重做】
        </p>
        <div class="sure-wrong">
          <span class="sure-box" @click="sureReject(5)">
            <Button type="primary" class="sure">确认证据无误</Button>
            <span class="down-time">{{ countDown }}</span>
          </span>
          <Button type="primary" class="wrong-box" @click="rejectModal = true">证据有误，重做</Button>
        </div>
      </div>
      <!-- 商标注册信息 -->
      <!-- <div class="details-box">
        <div>
          <div class="box-title">商标注册信息</div>
          <div class="box-bottom">
            <row>
              <Col :span="12">
              <p>
                <span class="left-item">受理号： </span><span class="right-item"> {{this.serciveInfo.acceptNum ||　'暂无数据'}}</span>
              </p>
              </Col>

              <Col :span="12">
              <p>
                <span class="left-item">备案验证码：</span><span class="right-item"> {{this.serciveInfo.verificationCode ||　'暂无数据'}} </span>
              </p>
              </Col>

              <Col :span="24">
              <p><span class="left-item">注册号：</span><span class="right-item">{{this.serciveInfo.registerNo ||　'暂无数据'}}</span>
              </p>
              </Col>
            </row>
          </div>
        </div>
      </div> -->

      <!-- <div class="details-box" v-for="(item,index) in workflowColumns" :key="index"> -->

      <!-- <div >

          <div class="box-title">商标分类</div>
          <div class="box-bottom" v-for="(categoryItem,categoryIndex) in trademarkCategoryCorrection" :key="categoryIndex">
            <p>
              <span class="left-item">商标分类：</span>
              <span class="right-item">{{categoryItem.category1Num}}&nbsp;{{categoryItem.category1Name}}</span>
            </p>
            <p>
              <span class="left-item">商标小类名称：</span>
            </p>
            <div class="info-table">
              <table style="width: 100%;text-align: center" cellpadding="0" cellspacing="0">
                <tr class="header">
                  <th style="width:68px;">序号</th>
                  <th style="width:206px;" v-show="!showCNItem(categoryItem.listTrademarkCategory2)">商标小类（中文）</th>
                  <th style="width:428px;">商标小类（英文） </th>
                  <th style="width:428px;" v-if="serciveInfo.countryCode=='JP'">商标小类（日文）</th>
                  <th style="width:428px;" v-if="serciveInfo.countryCode=='JP'">类似群组</th>
                  <th style="width:166px;border-right:none;" v-if="serciveInfo.countryCode=='US'">指定关键词</th>
                </tr>
                <tr v-show=" !(item.category2NameEn == '' || ( item.category2Name && item.category2Name == ''  ) )" v-for="(item,index) in categoryItem.listTrademarkCategory2" :key="index">
                  <td style="width:68px;">{{index+1}}</td>
                  <td style="width:206px;" v-show="item.category2Name">{{item.category2Name}}</td>
                  <td style="width:428px;">{{item.category2NameEn }}</td>
                  <td style="width:428px;" v-if="serciveInfo.countryCode=='JP'">{{item.categoryNameJp || "--"}}</td>
                  <td style="width:428px;" v-if="serciveInfo.countryCode=='JP'">{{item.categoryNameJp || "--"}}</td>
                  <td style="width:166px;border-right:none;" v-if="serciveInfo.countryCode=='US'">
                    <span v-if="item.keyword">{{item.keyword[0]}}</span>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div> -->

      <!-- 客户修正后选择保留的小类信息 -->
      <div class="details-box">
        <div class="box-title">商标分类</div>
        <div
          class="box-bottom"
          v-for="(trademarkCategoryItem, trademarkCategoryIndex) in trademarkCategoryCorrection"
          :key="trademarkCategoryIndex"
        >
          <p>
            <span class="left-item">商标分类：</span>
            <span class="right-item"
              >{{ trademarkCategoryItem.category1Num }}&nbsp;{{ trademarkCategoryItem.category1Name }}</span
            >
          </p>
          <p style="margin-top: 10px">
            <span class="left-item">商标小类名称：</span>
          </p>
          <div class="info-table">
            <table style="width: 100%; text-align: center" cellpadding="0" cellspacing="0">
              <tr class="header">
                <th style="width: 68px">序号</th>
                <th style="width: 206px">商标小类（中文）</th>
                <th style="width: 428px">商标小类（英文）</th>
                <th style="width: 166px;">指定关键词</th>
              </tr>
              <tr v-for="(item, index) in trademarkCategoryItem.listTrademarkCategory2" :key="index">
                <td style="width: 68px">{{ index + 1 }}</td>
                <td style="width: 206px">{{ item.category2Name }}</td>
                <td style="width: 428px">{{ item.category2NameEn }}</td>
                <td style="width: 166px;">
                  <span v-if="item.keyword">{{ item.keyword[0] }}</span>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <div class="details-box">
        <div>
          <div class="box-title">商标使用证据</div>
          <div class="box-bottom">
            <Row>
              <Col :span="12">
                <p>
                  <span class="left-item">首次使用日期：</span>
                  <span class="right-item item-box">
                    {{ serciveInfo.firstUseDate }}
                  </span>
                  <!-- <span class="right-item item-box" >
                    <a :href="aa" target="_blank" style="color:#666;" v-for="(aa,cc) in JSON.parse(vv.keyNameValue)" :key="cc">
                      <img src="@/assets/images/infoDetail/bainji-gary.svg" alt="">{{vv.keyLabel}}
                    </a>
                  </span>

                  <span class="right-item">{{ 436 }}</span> -->
                </p>
              </Col>

              <Col :span="12">
                <p>
                  <span class="left-item"> 首次在商业上使用的日期：</span>
                  <span class="right-item item-box">
                    {{ serciveInfo.firstBusinessUseDate }}
                  </span>
                </p>
              </Col>

              <!-- <Col :span="12">
                <p>
                  <span class="left-item">首次使用日期：</span>
                  <span class="right-item item-box" >
                    {{111}}
                  </span>

                </p>
                </Col> -->
              <!-- <Col :key="ii" :span="24" v-if="vv.keyName=='companyLegalPersonSign'">
                <div v-if="vv.keyName=='companyLegalPersonSign'">
                  <p>
                    <span class="left-item">{{vv.keyLabel}}：</span>
                  </p>
                  <img :src="vv.keyNameValue" alt="" style="width:300px;height:200px;">
                </div>
                </Col> -->
              <!-- <Col :key="ii" :span="24" v-if="vv.keyName=='marketHref'"> -->
              <div>
                <p>
                  <span class="left-item">销售链接：</span>
                </p>
                <div class="info-table">
                  <table style="width: 100%;text-align: center" cellpadding="0" cellspacing="0">
                    <tr class="header">
                      <th style="width:68px;">序号</th>
                      <th style="width:402px;">销售链接</th>
                      <th style="width:400px;border-right:none;">指定商标小类</th>
                    </tr>
                    <tr v-for="(item, index) in marketHrefList2" :key="index">
                      <td style="width:68px;">{{ index + 1 }}</td>
                      <td style="width:402px;">
                        <p>{{ item.marketHref }}</p>
                      </td>
                      <td style="width:400px;border-right:none;">
                        <p>
                          {{ item.category2NameEn }}
                        </p>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>

              <Col :span="12">
                <p>
                  <span class="left-item">上传产品图：</span>

                  <span class="right-item item-box">
                    <a
                      :href="aa.fileUrl"
                      target="_blank"
                      style="color:#666;"
                      v-for="(aa, cc) in JSON.parse(serciveInfo.useProductImg)"
                      :key="cc"
                    >
                      <img src="@/assets/images/infoDetail/bainji-gary.svg" alt="" />{{ aa.fileName }}
                    </a>
                  </span>
                </p>
              </Col>

              <Col :span="12">
                <p>
                  <span class="left-item">上传订单详情截图：</span>

                  <span class="right-item item-box">
                    <a
                      :href="aa.fileUrl"
                      target="_blank"
                      style="color:#666;"
                      v-for="(aa, cc) in JSON.parse(serciveInfo.useEvidence)"
                      :key="cc"
                    >
                      <img src="@/assets/images/infoDetail/bainji-gary.svg" alt="" />{{ aa.fileName }}
                    </a>
                  </span>
                </p>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
    <Modal v-model="rejectModal">
      <div class="tipsModal-title">驳回原因</div>
      <div class="modal-contnet">
        <Select
          v-model="evidenceCustomerconfirm.trademarkWorkOrderStatus"
          style="height:34px;"
          placeholder="请选择驳回原因"
        >
          <Option value="使用证据错误，商标信息无误">使用证据错误，商标信息无误</Option>
          <Option value="商标名称、logo图错误/申请人错误/其他">商标名称、logo图错误/申请人错误/其他</Option>
        </Select>
        <Input
          v-model="evidenceCustomerconfirm.evidenceCustomerRejectInfo"
          type="textarea"
          :maxlength="500"
          :rows="8"
          style="margin-top:20px;"
          placeholder="输入详细内容
            参考示例：
            1、首次使用日期应该是2021年05月01日；
            2、产品图与注册的商标类目不符；"
        ></Input>
      </div>
      <div slot="footer" class="reject-fotter">
        <Button class="footer-cancel-btn" @click="rejectModal = false">取消</Button>
        <Button type="primary" class="footer-sure-btn" @click="sureReject()">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { updateNodeAPI } from '@/api/trademarkRegister/myBread';

export default {
  props: ['workflowColumns', 'trademarkCategoryList', 'serciveInfo', 'marketHrefList'],
  data() {
    return {
      countDownTime: false,
      countDown: '',
      marketHrefList2: [],
      evidenceCustomerconfirm: {
        trademarkWorkOrderStatus: '',
        evidenceCustomerRejectInfo: '',
      },
      rejectModal: false,
      trademarkCategoryCorrection: [],
    };
  },
  computed: {},
  watch: {
    serciveInfo: {
      handler(val) {
        console.log(val, this.workflowColumns);
        if (val) {
          if (val.trademarkCategoryCorrection) {
            this.trademarkCategoryCorrection = JSON.parse(val.trademarkCategoryCorrection);
          }
          if (val.marketHref) {
            console.log(val.marketHref);
            this.marketHrefList2 = JSON.parse(val.marketHref);
            console.log(this.marketHrefList2);
          }
          console.log(this.trademarkCategoryCorrection);
          this.firstCountFun();
          this.countDownFun();
        }
      },
    },
  },
  methods: {
    //使用证据操作
    sureReject(status) {
      if (!status && this.evidenceCustomerconfirm.trademarkWorkOrderStatus == '') {
        this.$Message.error('请选择驳回原因');
        return;
      }
      if (!status && this.evidenceCustomerconfirm.evidenceCustomerRejectInfo == '') {
        this.$Message.error('输入详细内容');
        return;
      }
      let operateLogoperateReason =
        this.evidenceCustomerconfirm.trademarkWorkOrderStatus +
        ';' +
        this.evidenceCustomerconfirm.evidenceCustomerRejectInfo;
      let paramsData = {
        json: { operateLogoperateReason },
        serviceId: this.$route.query.servicesId,
        nodeCode: this.$route.query.cureentNodeCode,
        path: true,
      };
      if (!status) {
        paramsData.path = false;
      } else {
        paramsData.json = { operateLogoperateReason: '' };
      }
      // console.log(paramsData);
      updateNodeAPI(paramsData).then((res) => {
        this.$Message.success('操作成功');
        this.countDownTime = false;
        this.rejectModal = false;
        this.getDetailFun();
        this.$router.push('/myBrand');
      });
    },
    // select回显
    selectReturnFunc(data) {
      let text = '',
        optionList = JSON.parse(data.info.replace(/\'/g, '"')).groups,
        selecd = optionList.filter((item) => {
          // console.log("console.log(item);", item);
          return item.value == data.keyNameValue;
        });
      if (selecd.length > 0) text = selecd[0].label;
      return text;
    },
    showCNItem(list) {
      // console.log("list", list);
      // console.log(list.findIndex(item => item.category2Name), list.findIndex(item => item.category2Name) == -1 ? true : false);
      return list.findIndex((item) => item.category2Name) == -1 ? true : false;
    },
    /**
     * 修复申请人证件bug
     * 重新转json数组
     */
    setColumns(data) {
      // console.log("==>", data);
      data.forEach((element) => {
        let keyName = element.keyName,
          keyNameValue = element.keyNameValue,
          inputType = element.inputType;
        if (keyName == 'useEvidence' || keyName == 'useProductImg') {
          if (!this.isJson(keyNameValue)) {
            element.keyNameValue = JSON.stringify(keyNameValue);
          }
        } else if (inputType == '4' && keyNameValue != '' && keyName != 'trademarkCategory') {
          if (this.isJson(keyNameValue)) {
            if (!Array.isArray(JSON.parse(keyNameValue)))
              element.keyNameValue = JSON.stringify([JSON.parse(keyNameValue)]);
          } else if (typeof keyNameValue == 'string') {
            if (keyNameValue.substr(0, 5) == 'http:') {
              element.keyNameValue = JSON.stringify([keyNameValue]);
            }
          } else {
          }
        }
      });
      return data;
    },
    /*
     判断 是不是json格式
    */
    isJson(data) {
      try {
        JSON.parse(data);
        return true;
      } catch (e) {
        return false;
      }
    },
    //证据确认倒计时
    firstCountFun() {
      console.log('???');
      let startTime = Date.parse(new Date()),
        endTime = Date.parse(this.serciveInfo.evidenceSubmitDate) + 1000 * 60 * 60 * 24,
        downTime = Math.floor(endTime - startTime);
      if (downTime > 0) {
        this.countDownTime = true;
        var hours = Math.floor(downTime / (3600 * 1000));
        //计算相差分钟数
        var leave2 = downTime % (3600 * 1000); //计算小时数后剩余的毫秒数
        var minutes = Math.floor(leave2 / (60 * 1000));
        this.countDown = hours + ' : ' + minutes;
        console.log(this.countDown);
      }
    },
    countDownFun() {
      let that = this;
      let clearTime = setInterval(() => {
        let startTime = Date.parse(new Date()),
          endTime = Date.parse(that.serciveInfo.evidenceSubmitDate) + 1000 * 60 * 60 * 24,
          downTime = Math.floor(endTime - startTime);
        if (downTime > 0) {
          that.countDownTime = true;
          var hours = Math.floor(downTime / (3600 * 1000));
          //计算相差分钟数
          var leave2 = downTime % (3600 * 1000); //计算小时数后剩余的毫秒数
          var minutes = Math.floor(leave2 / (60 * 1000));
          that.countDown = hours + ' : ' + minutes;
        } else {
          clearInterval(clearTime);
          that.countDownTime = false;
        }
      }, 1000 * 60);
    },
  },
};
</script>

<style lang="less" scoped>
@import './detail.less';
</style>
