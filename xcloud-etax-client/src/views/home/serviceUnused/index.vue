<template>
  <div class="container">
    <div class="headContent">
      <div class="top">
        <!-- <Breadcrumb>
          <BreadcrumbItem>
            <span class="flink">工作台</span>
          </BreadcrumbItem>
          <BreadcrumbItem to="">
            <span class="clink">待使用</span>
          </BreadcrumbItem>
        </Breadcrumb> -->
      </div>
      <div class="bottom">
        待使用
      </div>
    </div>
    <div class="bodyContent">
      <div class="content">
        <div class="topContent">
          <div class="title">
            累计{{unusedOrderServicesTotal}}个VAT服务未使用
          </div>
          <div>
            <Form :model="taxForm"
                  label-position="left"
                  inline
                  ref="taxForm">
              <FormItem label="服务国家："
                        prop="countryCode">
                <Select v-model="taxForm.countryCode"
                        style="width:170px;"
                        clearable
                        @on-change="changeCountry"
                        placeholder="选择国家">
                  <Option :value="v.countryCode"
                          v-for="(v,i) in countryList"
                          :key="i">{{v.countryNameZh}}</Option>
                </Select>
              </FormItem>
            </Form>
          </div>
        </div>
        <div class="inTheServiceList"
             v-if="unusedOrderServicesList.length > 0">
          <div v-for="(item, index) in unusedOrderServicesList"
               :key="index">
            <vat-card :data="item"
                      :countryList="countryList">
              <div slot="statusBtn"
                   class="flex statusBtnContent">
                <span v-if="item.countryCode === 'GB' && (item.progressBar === 21) ">
                  <Button type="text"
                          @click.stop="authorization(item)"
                          class="btF flex-center">
                    提交申报数据
                  </Button>
                </span>
                <span v-else>
                  <Button @click.stop="toRegister(item.progressBar,item)"
                          class="btF flex-center"
                          type="text"
                          v-if="item.progressBar!=1&&item.progressBar!=3&&item.progressBar!=4&&item.progressBar!=6&&item.progressBar!=37&&item.progressBar!=19&&item.progressBar!=18&&item.progressBar!=20&&item.progressBar!=23&&item.progressBar!=27&&item.progressBar!=26&&item.progressBar!=25&&item.progressBar!=29&&item.progressBar!=31&&item.progressBar!=33&&item.progressBar!=52&&item.progressBar!=53&&item.progressBar!=54&&item.status!=0&&item.status!=2&&item.progressBar!=5&&item.progressBar!=36&item.productFunctionCode!=7">
                    {{item.progressBar==0?'上传资料':item.progressBar==5?'寄送资料':item.progressBar==7?'上传授权书':item.progressBar==38?'上传授权书':item.progressBar==36?'寄送资料':item.progressBar==8?'查看驳回原因':item.progressBar==21?'提交申报数据':item.progressBar==22?'上传缴税凭证':item.progressBar==24?'提交申报数据':item.progressBar==28?'上传转代理资料':item.progressBar==32?'修改转代理资料':item.progressBar==34?'重新上传缴税凭证':item.progressBar==35?'待上传零申报凭证':item.progressBar==51?'上传资料':item.progressBar==55?'重新上传资料':item.progressBar==56?'重新上传资料':''}}
                  </Button>
                  <Button @click.stop="toRegister(item.progressBar,item)"
                          class="btF flex-center"
                          type="text"
                          v-if="(item.progressBar==5||item.progressBar==36)&&item.supplierId=='43'">
                    {{item.progressBar==0?'上传资料':item.progressBar==5?'寄送资料':item.progressBar==7?'上传授权书':item.progressBar==38?'上传授权书':item.progressBar==36?'寄送资料':item.progressBar==8?'查看驳回原因':item.progressBar==21?'提交申报数据':item.progressBar==22?'上传缴税凭证':item.progressBar==28?'上传转代理资料':item.progressBar==32?'修改转代理资料':item.progressBar==34?'重新上传缴税凭证':item.progressBar==35?'待上传零申报凭证':item.progressBar==51?'上传资料':item.progressBar==55?'重新上传资料':item.progressBar==56?'重新上传资料':''}}
                  </Button>
                  <Button @click.stop="toRegister(item.progressBar,item)"
                          class="btF flex-center"
                          type="text"
                          v-if="(item.progressBar==5||item.progressBar==36)&&item.supplierId=='44'">
                    {{item.progressBar==0?'上传资料':item.progressBar==5?'寄送资料':item.progressBar==7?'上传授权书':item.progressBar==38?'上传授权书':item.progressBar==36?'寄送资料':item.progressBar==8?'查看驳回原因':item.progressBar==21?'提交申报数据':item.progressBar==22?'上传缴税凭证':item.progressBar==28?'上传转代理资料':item.progressBar==32?'修改转代理资料':item.progressBar==34?'重新上传缴税凭证':item.progressBar==35?'待上传零申报凭证':item.progressBar==51?'上传资料':item.progressBar==55?'重新上传资料':item.progressBar==56?'重新上传资料':''}}
                  </Button>
                </span>
                <Button class="btF upload-btn"
                        type="text"
                        v-if="(item.progressBar==7 || item.progressBar==38) && (item.countryCode == 'FR'|| item.countryCode == 'IT'|| item.countryCode == 'SA')"
                        @click="uploadAuthorizationTep(item)">
                  下载授权书
                </Button>
                <Button class="btF upload-btn"
                        type="text"
                        v-if="item.progressBar==22 && item.countryCode !== 'GB'"
                        @click="uploadTaxBill(item)">
                  下载税金单
                </Button>
                <Button @click.stop="toRegister(item.status, item)"
                        v-if="item.status==2&&item.productFunctionCode==1"
                        class="btF"
                        type="text">
                  购买注册税号
                </Button>
                <Button @click.stop="toRegister(item.status, item)"
                        v-if="item.status==2 "
                        class="btF red-button"
                        type="text">
                  购买报税服务
                </Button>
                <Button @click.stop="toRegister(item.status, item)"
                        v-if="item.status==-1"
                        class="btF red-button"
                        type="text">
                  立即续费
                </Button>
                <!-- 注册申报详情 非英国-->
                <span v-if="item.countryCode != 'GB'||item.progressBar!=21">
                  <Button v-if="item.status!==0 &&item.status!==2 &&item.progressBar!=0&&item.progressBar!=8&&item.progressBar!=51&&item.progressBar!=55&&item.progressBar!=56&&(item.productFunctionCode==1||item.productFunctionCode==5||item.productFunctionCode==6)"
                          type="text"
                          @click.stop="registerInfo(item)">
                    详情
                  </Button>
                </span>
                <Button v-if="item.countryCode == 'GB'&&item.progressBar==21"
                        type="text"
                        @click.stop="authorization(item)">
                  详情
                </Button>
                <!-- 转代理详情 -->
                <Button v-if="item.status!==0 &&item.productFunctionCode==2 &&item.progressBar!=28 &&(item.countryCode != 'GB'||item.progressBar!=21)"
                        type="text"
                        @click.stop="registerInfo(item)">
                  详情
                </Button>
                <Button @click.stop="toRegister(item.status, item)"
                        v-if="item.productFunctionCode == 7&& item.progressBar === 71 "
                        class="btF flex-center"
                        type="text">
                  上传稽查资料
                </Button>
              </div>
            </vat-card>
          </div>
          <div class="pageSetion">
            <Page class="pagination"
                  :current="taxForm.page"
                  :total="unusedOrderServicesTotal"
                  @on-change="registerChangePageHandler"
                  :page-size="taxForm.limit" />
          </div>
        </div>
        <div v-else
             class="inTheServiceList"
             style="padding: 100px 24px;text-align: center;">
          <img src="@/assets/images/common/emptyUnsed.svg"
               alt="">
        </div>

      </div>
      <!-- 税务问题 -->
      <div class="taxProblemsContent">
        <!-- banner -->
        <div class="bannerContent"
             v-if="advertiseList.length > 0">
          <Carousel loop
                    style="height: 204px;">
            <CarouselItem v-for="(item, index) in advertiseList"
                          :key="index">
              <a :href="item.advertiseUrl"
                 target="_blank">
                <img :src="item.advertiseBannerPicture"
                     alt="">
              </a>
            </CarouselItem>
          </Carousel>
        </div>
        <div class="taxProblems">
          <div class="title">
            税务问题
          </div>
          <div v-for="(item, index) in bulletinsList"
               :key="index">
            <div class="item"
                 @click="goTaxProblems(index)">
              【VAT知识】{{item.bulletinTitle}}
            </div>
          </div>
          <div class="viewMore"
               v-if="bulletinsList.length == 8">
            <router-link to="/taxProblems"> 查看更多
              <img src="@/assets/images/common/rightArrow.svg"
                   alt="">
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vatCard from "@/views/common/vatCard";
import { unusedOrderServices, bulletinsHomeList, advertise } from "@/api/home/home";
import { baseInfo } from "@/api/shoppingCar/shoppingCar";
export default {
  data() {
    return {
      unusedOrderServicesList: [],
      taxForm: {
        limit: 10,
        page: 1,
        countryCode: "",
      },
      unusedOrderServicesTotal: 0,
      countryList: [],
      bulletinsList: [],
      advertiseList: [],
    }
  },
  components: {
    vatCard
  },
  created() {
    this.getCountry()
  },
  mounted() {
    this.getUnusedOrderServicesList()
    // this.getBulletinsHomeList()
    // this.getAdvertise()
  },
  methods: {
    //获取国家
    getCountry() {
      baseInfo().then(res => {
        if (res.code === 0) {
          this.countryList = res.data;
        }
      });
    },
    // 分页获取未使用服务列表
    getUnusedOrderServicesList() {
      let data = { ...this.taxForm }
      unusedOrderServices(data).then(res => {
        if (res.code === 0) {
          this.unusedOrderServicesList = res.data.records
          this.unusedOrderServicesTotal = res.data.total - 0
        }
      })
    },
    registerChangePageHandler(page) {
      this.taxForm.page = page;
      this.getUnusedOrderServicesList();
    },
    changeCountry(val) {
      if (val === undefined) {
        this.taxForm.countryCode = ''
        this.taxForm.page = 1
      } else {
        this.taxForm.countryCode = val
      }
      this.getUnusedOrderServicesList();
    },
    // 不同报税状态对应不同的操作
    toRegister(status, row) {
      let self = this;
      this.status = status
      // 续费
      //西班牙跳转到发送文件 老服务商
      if ((status === 5 || status === 36) && row.countryCode == "ES" && row.supplierId == '43') {
        self.$router.push({
          path: "/sendFileES",
          query: {
            servicesId: row.id,
            productFunctionCode: row.productFunctionCode,
            supplierId: row.supplierId
          }
        })
        return
      }
      //西班牙跳转到发送文件 新服务商
      if ((status === 5 || status === 36) && row.countryCode == "ES" && row.supplierId == '44') {
        this.$router.push({
          path: "/sendFileES",
          query: {
            servicesId: row.id,
            productFunctionCode: row.productFunctionCode,
            supplierId: row.supplierId
          }
        })
        return
      }
      //奥地利 捷克 重新提交申报
      if (status === 24 && (row.countryCode == "AT" || row.countryCode == 'CZ')) {
        this.$router.push({
          path: "/taxDetails",
          query: {
            workNumber: row.vatTaxNumber,
            serviceId: row.id,
            servicesId: row.id,
            countryCode: row.countryCode,
            companyNameZh: row.companyName,
            status: row.progressBar,
            countryNameZh: row.countryNameZh
          }
        });
        return
      }
      // supplierId
      //法国、意大利 沙特 阿联酋 荷兰上传授权书
      if ((status === 7 || status === 36 || status === 38) && (row.countryCode == "FR" || row.countryCode == "IT" || row.countryCode == "SA" || row.countryCode == "AE" || row.countryCode == "NL")) {
        this.sendServiceId = row.id
        if (status == 7) { this.sendType = 1 }
        else if (status == 38 || status === 36) { this.sendType = 2 }
        // this.FRsendFile = true
        this.$router.push({
          path: "/authorizedRegistration",
          query: {
            countryCode: row.countryCode,
            serviceId: row.id,
            productFunctionCode: row.productFunctionCode,
            countryNameZh: row.countryNameZh
          }
        });
        return
      }
      //待缴纳税金
      if (status == 22 || status == 34 || status == 35) {
        if (row.countryCode === 'GB') {
          self.workId = row.vatTaxNumber;
          self.orderId = row.id;
          self.countryCode = row.countryCode;
          // self.showTaxDetails = true;
          this.$router.push({
            path: "/taxDetails",
            query: {
              workNumber: row.vatTaxNumber,
              serviceId: row.id,
              servicesId: row.id,
              countryCode: row.countryCode,
              companyNameZh: row.companyName,
              status: row.progressBar,
              countryNameZh: row.countryNameZh

            }
          });
        }
        return
      }
      //跳转到转代理上传资料页面
      if (status == 28 || status == 32) {
        this.$router.push({
          path: "/turnToAgent",
          query: {
            servicesId: row.id,
            companyNameZh: row.companyName,
            status: row.progressBar,
            countryCode: row.countryCode,
            countryNameZh: row.countryNameZh
          }
        });
      }
      //注销税号上传资料
      if (status == 51 || status == 55 || status == 56) {
        this.$router.push({
          path: "/cancelTaxNum",
          query: {
            servicesId: row.id,
            companyNameZh: row.companyName,
            status: row.progressBar,
            countryCode: row.countryCode
          }
        });
      }
      if (row) {
        // 税务稽查
        if (row.productFunctionCode === 7) {
          self.$router.push({
            path: "/taxInspection",
            query: {
              servicesId: row.id,
              countryNameZh: row.countryNameZh,
              countryCode: row.countryCode
            }
          })
          return
        }
        //待提交申报，跳去提交申报数据页面
        if (status === 21) {
          self.workId = row.vatTaxNumber;
          self.orderId = row.id;
          self.countryCode = row.countryCode;
          // self.showTaxDetails = true;
          this.$router.push({
            path: "/taxDetails",
            query: {
              workNumber: row.vatTaxNumber,
              serviceId: row.id,
              servicesId: row.id,
              countryCode: row.countryCode,
              companyNameZh: row.companyName,
              status: row.progressBar,
              countryNameZh: row.countryNameZh

            }
          });
          return
        }
        if (row.productFunctionCode == 1 || row.productFunctionCode == 5) {
          self.$router.push({
            path: "/registerInfo",
            query: {
              servicesId: row.id,
              companyNameZh: row.companyName,
              status: row.progressBar,
              countryCode: row.countryCode,
              countryNameZh: row.countryNameZh
            }
          });
        }
      }
    },
    // 客户端资讯列表
    getBulletinsHomeList() {
      bulletinsHomeList({
        limit: 5,
        page: 1,
        bulletinType: 8
      }).then(res => {
        if (res.code === 0) {
          this.bulletinsList = res.data.records
        }
      })
    },
    //客户端banner
    getAdvertise() {
      advertise({
        advertiseType: 9
      }).then(res => {
        if (res.code === 0) {
          this.advertiseList = res.data
        }
      })

    },
  }
}
</script>

<style lang="less" scoped>
.container {
  min-height: calc(100vh - 60px);
  .headContent {
    height: 100px;
    background: #ffffff;
    box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 0.12);
    padding: 20px 32px;
    .top {
      margin-bottom: 14px;
      .flink,
      .clink {
        font-size: 14px;

        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
        line-height: 22px;
      }
      .clink {
        font-weight: 500;
        color: rgba(0, 0, 0, 0.65);
      }
    }
    .bottom {
      font-size: 20px;
      font-family: "Microsoft Yahei", PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 28px;
      span {
        font-size: 14px;

        font-weight: 400;
        color: rgba(0, 0, 0, 0.65);
        line-height: 22px;
      }
    }
  }
  .bodyContent {
    display: flex;
    justify-content: space-between;
    .taxProblemsContent {
      margin-top: 24px;
      margin-right: 24px;
      .bannerContent {
        width: 300px;
        height: 204px;
        background: #ffffff;
        border-radius: 4px;
        margin-bottom: 24px;
        /deep/ .ivu-carousel-item {
          height: 204px !important;
        }
        img {
          width: 100%;
          height: 100%;
        }
      }
      .taxProblems {
        width: 300px;
        background: #ffffff;
        border-radius: 4px;
        .title {
          font-size: 18px;
          font-family: "Microsoft Yahei", PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.85);
          line-height: 24px;
          border-bottom: 1px solid #e9e9e9ff;
          padding: 16px 24px;
        }
        .item {
          font-size: 12px;
          font-family: "Microsoft Yahei", PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #666666;
          line-height: 22px;
          padding: 12px 18px;
          border-bottom: 1px solid #e9e9e9ff;
          cursor: pointer;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .viewMore {
          font-size: 12px;
          font-family: "Microsoft Yahei", PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #1890ff;
          line-height: 17px;
          padding: 18px 0px;
          text-align: center;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            margin-top: 1px;
            float: right;
          }
        }
      }
    }
  }
  .content {
    width: 100%;
    padding: 24px;
    display: flex;
    align-items: center;
    min-height: calc(100vh - 160px);
    flex-direction: column;
    overflow-y: auto;
    .topContent {
      height: 107px;
      width: 100%;
      background: #ffffff;
      border-top-right-radius: 4px;
      border-top-left-radius: 4px;
      padding: 18px 24px;
      border-bottom: 1px solid #e9e9e9ff;
      .title {
        font-size: 18px;
        font-family: "Microsoft Yahei", PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        line-height: 24px;
        margin-bottom: 16px;
      }
      /deep/ .ivu-form-item {
        display: flex;
      }
      /deep/ .ivu-form-item-label {
        padding-right: 0px;
        font-size: 14px;

        font-weight: 400;
        color: rgba(0, 0, 0, 0.85);
      }
    }
    .inTheServiceList {
      width: 100%;
      background: #ffffff;
      padding: 18px 24px;
      .statusBtnContent {
        button {
          background: #16ade9;
          box-shadow: 0px 2px 6px 0px rgba(9, 80, 228, 0.12);
          border-radius: 100px;
          color: #ffffff;
        }
      }
      // /deep/ .vatContainer {
      //   @media screen and (min-width: 1920px) {
      //     padding: 16px 300px 16px 24px;
      //   }
      // }
    }
  }
}
.pageSetion {
  text-align: center;
  margin-top: 20px;
  .pagination {
    display: inline-block;
    line-height: 20px;
  }
  .totalNum {
    font-size: 14px;
    color: #9a9ca1;
  }
  &/deep/.ivu-page-simple .ivu-page-simple-pager input {
    padding: 0;
    margin: 0;
  }
  &/deep/.ivu-page-simple-pager {
    margin-right: 0;
  }
}
</style>