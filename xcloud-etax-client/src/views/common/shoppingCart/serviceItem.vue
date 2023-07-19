<template>
  <div
    v-sensors="{
      type: 'VATServeView',
      event: 'click',
      getParams: () => ({
        VAT_current_price: info.basePrice,
        VAT_serve_name: info.productName,
        VAT_serve_country: info.countryInfo.countryNameZh,
      }),
    }"
    class="serviceItem"
    :class="{ notShelves: info.status === 2 }"
  >
    <div class="left">
      <!-- <img :src="JSON.parse(info.pcProductImgUrl)[0].imgUrl" @click="toShoppingDetail(info)" alt="" width="100%" /> -->
      <img :src="info.productImagePc" @click="toShoppingDetail(info)" alt="" width="100%" />
      <img class="zero-label" src="@/assets/images/activity/zeroLabel.png" alt="" v-if="info.activityType === 1" />
    </div>
    <div class="right">
      <div class="productName">
        {{ info.productName }}
      </div>
      <div class="flex-start">
        <!-- <div class="priceTitle"></div> -->
        <div class="price">
          <span class="sign">{{ info.currency }}</span>
          <span>{{ servicePriceHandle(info, 'servicePrice') }}</span>
          <!-- <span class="sign">
            /{{
              info.unit === 1 ? '年' : info.unit === 2 ? '个' : info.unit === 3 ? '次' : info.unit === 4 ? '类' : '个'
            }}
          </span> -->
          <span class="yuanprice">
            {{ servicePriceHandle(info, 'originalPrice') }}
          </span>
        </div>
        <!-- <div class="price" v-else>敬请期待</div> -->
      </div>
      <!-- <div class="buy" v-if="activityStatus.showBuy">
        <button :disabled="info.status === 2" class="addCartBtn" @click.stop="add(info.productId)">
          <img src="@/assets/images/common/addtocar.svg" class="menu-icon" />
        </button>
        <a-button
          type="primary"
          v-sensors="{
            type: 'ClickVATServeNowBuy',
            event: 'click',
            getParams: () => ({
              page_name: '服务列表',
              VAT_current_price: info.basePrice,
              VAT_serve_name: info.productName,
              VAT_serve_country: info.countryNameZh,
            }),
          }"
          :disabled="info.status === 2"
          class="buyNowBtn"
          @click.stop="buyNow(info.id, info)"
        >
          立即购买
        </a-button>
      </div>
      <div class="zero-show" v-else>{{ activityStatus.text }}</div> -->
    </div>
    <div v-if="tipsModal">
      <Modal v-model="tipsModal" footer-hide width="410">
        <div class="showGBModal">
          <p class="showGBModal-title">
            <img src="@/assets/images/shoppingCar/Shape.svg" />
            温馨提示
          </p>
          <p class="showGBModal-content">
            注销税号服务目前仅支持在跨税云办理过VAT业务的用户，购买前建议联系客服咨询，如果不便之处敬请谅解！
          </p>
          <div class="showGBModal-footer">
            <Button @click="tipsModalSure" type="primary">确认</Button>
          </div>
        </div>
      </Modal>
    </div>
    <div v-if="buyRefundModal">
      <Modal v-model="buyRefundModal" footer-hide width="410">
        <div class="showGBModal">
          <p class="showGBModal-title">
            <img src="@/assets/images/shoppingCar/Shape.svg" />
            温馨提示
          </p>
          <p class="showGBModal-content">
            英国VAT退税服务目前仅支持在跨税云办理过VAT业务的用户，购买前建议联系客服咨询，如有不便之处敬请谅解！
          </p>
          <div class="showGBModal-footer">
            <Button @click="buyRefundModalSure" type="primary">确认</Button>
          </div>
        </div>
      </Modal>
    </div>
    <div v-if="showGBModal">
      <Modal v-model="showGBModal" footer-hide width="410">
        <div class="showGBModal">
          <p class="showGBModal-title">
            <img src="@/assets/images/shoppingCar/Shape.svg" />
            购前通知
          </p>
          <p class="showGBModal-content">
            由于英国税务政策限制因素影响，3月1日起我司不接受没有gateway账号密码且收不到验证码的英国VAT税号转代理业务，如给您带来不便敬请谅解。
          </p>
          <div class="showGBModal-footer">
            <Button @click="showGBModal = false" class="cancel">{{ type == 0 ? '取消加入购物车' : '取消购买' }}</Button>
            <Button @click="buyNow(info.id, info)" type="primary" v-if="type != 0">继续购买</Button>
            <Button @click="add(info.id)" type="primary" v-if="type == 0">继续加入购物车</Button>
          </div>
        </div>
      </Modal>
    </div>
    <div v-if="showDERegisterModal">
      <Modal v-model="showDERegisterModal" footer-hide width="410">
        <div class="showGBModal">
          <p class="showGBModal-title">
            <img src="@/assets/images/shoppingCar/Shape.svg" />
            购前通知
          </p>
          <p class="showGBModal-content" style="margin-bottom: 15px">
            老账户注册德国VAT税号会涉及补税+罚款，且注册最快也需要6个月才能下税号。因此，我司暂不接受老账户注册德国VAT税号的服务；
          </p>
          <p class="showGBModal-content" style="margin-bottom: 7px">老帐号定义：</p>
          <p class="showGBModal-content" style="margin-bottom: 7px">
            1、 使用过德国当地仓储并产生销售，且首笔销售记录产生于德国税号申请之前的时间;
          </p>
          <p class="showGBModal-content" style="margin-bottom: 7px">
            2、 在欧盟内德国的远程销售超过100.000欧元的店铺；
          </p>
          <p class="showGBModal-content" style="margin-bottom: 7px; color: #f79728">
            注：除大陆和香港公司外，暂不接受其它国家公司注册德国税号
          </p>
          <div class="showGBModal-footer">
            <Button @click="showDERegisterModal = false" class="cancel">
              {{ type == 0 ? '取消加入购物车' : '取消购买' }}
            </Button>
            <Button @click="buyNow(info.id, info)" type="primary" v-if="type != 0">继续购买</Button>
            <Button @click="add(info.id)" type="primary" v-if="type == 0">继续加入购物车</Button>
          </div>
        </div>
      </Modal>
    </div>
    <div v-if="showDETurnToAgentModal">
      <Modal v-model="showDETurnToAgentModal" footer-hide width="410">
        <div class="showGBModal">
          <p class="showGBModal-title">
            <img src="@/assets/images/shoppingCar/Shape.svg" />
            购前通知
          </p>
          <p class="showGBModal-content">除大陆和香港公司外，暂不接受其它国家公司的德国转代理服务申请</p>
          <div class="showGBModal-footer">
            <Button @click="showDETurnToAgentModal = false" class="cancel">
              {{ type == 0 ? '取消加入购物车' : '取消购买' }}
            </Button>
            <Button @click="buyNow(info.id, info)" type="primary" v-if="type != 0">继续购买</Button>
            <Button @click="add(info.id)" type="primary" v-if="type == 0">继续加入购物车</Button>
          </div>
        </div>
      </Modal>
    </div>
    <div v-if="buShenBaoModal">
      <Modal v-model="buShenBaoModal" footer-hide width="510">
        <div class="showGBModal" style="padding-left: 15px">
          <p class="showGBModal-title" style="font-size: 16px">{{ info.countryNameZh }}补申报</p>
          <div class="buShenBaoModal-serviceContent">
            <div class="left">服务内容：</div>
            <div class="right">
              <p style="margin-bottom: 14px">
                <span style="margin-right: 32px">
                  <img src="@/assets/images/common/gouxuan.svg" alt="" />
                  补申报
                </span>
                <span style="margin-left: 14px">
                  <img src="@/assets/images/common/gouxuan.svg" alt="" />
                  税局信件接收
                </span>
              </p>
              <p style="margin-bottom: 22px">
                <span style="margin-right: 32px">
                  <img src="@/assets/images/common/gouxuan.svg" alt="" />
                  线上客服
                </span>
                <span>
                  <img src="@/assets/images/common/gouxuan.svg" alt="" />
                  PC/小程序双平台管理
                </span>
              </p>
            </div>
          </div>
          <Form :model="buShenBaoForm" :rules="buShenBaoRuleForm" ref="buShenBaoForm">
            <FormItem>
              <div style="display: flex">
                <span style="margin-right: 10px" class="requiredItem">服务公司:</span>
                <FormItem prop="companyNameZh">
                  <AutoComplete
                    v-model="buShenBaoForm.companyNameZh"
                    @on-change="handleSearch"
                    placeholder="请填写VAT补申报的公司名称"
                    style="width: 247px"
                  >
                    <Option v-for="(item, index) in companyList" :value="item.companyNameZh" :key="index">
                      {{ item.companyNameZh }}
                    </Option>
                  </AutoComplete>
                </FormItem>
              </div>
            </FormItem>
            <FormItem>
              <div style="display: flex">
                <span style="margin-right: 10px" class="requiredItem">沟通客服ID:</span>
                <FormItem prop="customerServiceId">
                  <Input
                    v-model="buShenBaoForm.customerServiceId"
                    placeholder="请填写客服ID"
                    style="width: 231px"
                  ></Input>
                </FormItem>
              </div>
            </FormItem>
            <FormItem>
              <div style="display: flex">
                <span style="margin-right: 10px" class="requiredItem">补申报区间:</span>
                <FormItem prop="beginTime">
                  <DatePicker
                    type="month"
                    v-model="buShenBaoForm.beginTime"
                    placeholder="开始月份"
                    style="width: 100px"
                  ></DatePicker>
                </FormItem>
                <span style="margin-left: 8px; margin-right: 8px">—</span>
                <FormItem prop="endTime">
                  <DatePicker
                    type="month"
                    v-model="buShenBaoForm.endTime"
                    placeholder="结束月份"
                    style="width: 100px"
                  ></DatePicker>
                </FormItem>
              </div>
            </FormItem>
            <FormItem>
              <div style="display: flex">
                <span style="margin-right: 10px" class="requiredItem">购买数量:</span>
                <div class="changeNum">
                  <span @click="minus">-</span>
                  <input type="text" v-model="buShenBaoForm.num" />
                  <span class="add" @click="addNum">+</span>
                </div>
              </div>
            </FormItem>
            <div class="flex-start" style="margin-bottom: 6px">
              <div class="priceTitle">服务费用：</div>
              <div class="price" v-if="info.status === 0">
                <span class="sign">¥</span>
                <span>{{ info.price }}</span>
                <span class="sign">
                  /{{
                    info.unit === 1
                      ? '年'
                      : info.unit === 2
                      ? '个'
                      : info.unit === 3
                      ? '次'
                      : info.unit === 4
                      ? '季度'
                      : '个'
                  }}
                </span>
              </div>
              <div class="price" v-else>敬请期待</div>
            </div>
            <FormItem>
              <div class="purchaseInformation">
                购买须知：
                <span @click="showUser = true" style="cursor: pointer">《用户协议》</span>
              </div>
            </FormItem>
          </Form>
          <p class="showGBModal-title">
            <img src="@/assets/images/shoppingCar/Shape.svg" style="width: 18px; top: 4px; margin-right: 3px" />
            重要提示：
          </p>
          <p
            class="showGBModal-content"
            style="margin-bottom: 0px; margin-top: 7px; padding-left: 24px; font-size: 12px; color: #666"
          >
            1、补申报服务仅支持在跨税云购买了转代理+申报服务，且转代理已完成的服务。
          </p>
          <p
            class="showGBModal-content"
            style="margin-bottom: 0px; margin-top: 0px; padding-left: 24px; font-size: 12px; color: #666"
          >
            2、购买补申报服务前需跟客服确认补申报的区间及购买的数量。
          </p>
          <p
            class="showGBModal-content"
            style="margin-bottom: 20px; margin-top: 0px; padding-left: 24px; font-size: 12px; color: #666"
          >
            3、补申报区间确认后，与您对接的客服会告知其ID，购买时需填写，平台将进行验证。
          </p>
          <div class="buShenBaoModal-footer">
            <Button @click="buShenBaoModal = false" class="cancel">取消服务</Button>
            <Button @click="buyNow(info.id, info)" type="primary" v-if="type != 0">立即购买</Button>
            <Button @click="add(info.id)" type="primary" v-if="type == 0">加入购物车</Button>
          </div>
        </div>
      </Modal>
    </div>
    <userAgreement @changeState="changeStates" v-if="showUser" :functionCode="info.functionCode"></userAgreement>
  </div>
</template>

<script>
import { addToCart, totalShoppingCart, getSuccessTransProxyCompanyList } from '@/api/shoppingCar/shoppingCar';
import userAgreement from '@/views/common/userAgreement';
export default {
  props: {
    info: {},
  },
  data() {
    return {
      carouselVal: 0,
      setting: {
        loop: true,
        autoplay: false,
        autoplaySpeed: 3500,
        dots: 'none',
        radiusDot: false,
        trigger: 'click',
        arrow: 'never',
      },
      showGBModal: false,
      buShenBaoModal: false,
      type: 0,
      showUser: false,
      tipsModal: false,
      buyRefundModal: false,
      id: '',
      showDERegisterModal: false,
      showDETurnToAgentModal: false,
      buShenBaoForm: {
        customerServiceId: '',
        companyNameZh: '',
        endTime: '',
        beginTime: '',
        num: 1,
        checkedSkuId: '',
      },
      buShenBaoRuleForm: {
        companyNameZh: [{ required: true, trigger: 'change', message: '请填写VAT补申报的公司名称' }],
        customerServiceId: [{ required: true, trigger: 'blur', message: '请填写客服ID' }],
        beginTime: [{ required: true, trigger: 'change', message: '请选择开始月份', type: 'date' }],
        endTime: [{ required: true, trigger: 'change', message: '请选择结束月份', type: 'date' }],
      },
      companyList: [],
      infoList: [],
    };
  },
  components: {
    userAgreement,
  },
  created() {},
  methods: {
    //价格
    servicePriceHandle(goods, price) {
      let servicePrice = 0;
      if (goods.productInfoDTOList.length) {
        servicePrice = goods.productInfoDTOList[0].productSpecsDTOList[0][price];
      } else {
        servicePrice = goods.productSpecsDTOList[0][price];
      }
      return servicePrice;
    },
    changeStates(val) {
      this.showUser = val;
    },
    minus() {
      this.buShenBaoForm.num--;
      if (this.buShenBaoForm.num < 1) {
        this.buShenBaoForm.num = 1;
      }
    },
    addNum() {
      this.buShenBaoForm.num++;
    },
    handleSearch() {
      this.companyList = this.infoList.filter(
        (item) => item.companyNameZh.indexOf(this.buShenBaoForm.companyNameZh) != -1
      );
    },
    getCompanyList() {
      getSuccessTransProxyCompanyList({ countryCode: this.info.countryCode, status: '30' }).then((res) => {
        if (res.code == 0) {
          this.infoList = res.data;
          this.companyList = this.infoList;
        }
      });
    },
    add(id) {
      if (this.info.functionCode == 2 && this.info.countryCode == 'GB' && !this.showGBModal) {
        this.showGBModal = true;
        this.type = 0;
        return;
      }
      if (this.info.functionCode == 5 && this.info.countryCode == 'DE' && !this.showDERegisterModal) {
        this.showDERegisterModal = true;
        this.type = 0;
        return;
      }
      if (this.info.functionCode == 2 && this.info.countryCode == 'DE' && !this.showDETurnToAgentModal) {
        this.showDETurnToAgentModal = true;
        this.type = 0;
        return;
      }
      if (this.info.functionCode == 17 && !this.buShenBaoModal) {
        this.buShenBaoModal = true;
        this.getCompanyList();
        this.type = 0;
        return;
      }
      if (
        this.info.productSkuVOList.length >= 1 &&
        this.info.productSkuVOList[0].productAttributeRelationDtoList.length > 0
      ) {
        this.$Message.info('请先选择完整商品属性');
        return;
      }

      if (this.info.functionCode == 17) {
        this.$refs['buShenBaoForm'].validate((valid) => {
          if (valid) {
            if (this.buShenBaoForm.customerServiceId != 'CSR0008') {
              this.$Message.error('请填写正确的沟通客服ID');
              return;
            }
            let arr = this.companyList.filter((item) => item.companyNameZh == this.buShenBaoForm.companyNameZh);
            if (arr.length == 0) {
              this.$Message.error('请填写正确的服务公司');
              return;
            }
            this.buShenBaoForm.beginTime = this.formatDate(this.buShenBaoForm.beginTime, 'month');
            this.buShenBaoForm.endTime = this.formatDate(this.buShenBaoForm.endTime, 'month');
            let date1 = new Date(this.buShenBaoForm.beginTime);
            let date2 = new Date(this.buShenBaoForm.endTime);
            if (date2.getTime() < date1.getTime()) {
              this.$Message.error('结束月份不能在开始月份之前');
              this.buShenBaoForm.beginTime = new Date(this.buShenBaoForm.beginTime);
              this.buShenBaoForm.endTime = new Date(this.buShenBaoForm.endTime);
              return;
            }
            addToCart({
              count: this.buShenBaoForm.num,
              productId: id,
              productSkuId: productSkuIds,
              companyName: this.buShenBaoForm.companyNameZh,
              functionCode: this.info.functionCode,
              suppleDeclStartTime: this.buShenBaoForm.beginTime,
              suppleDeclEndTime: this.buShenBaoForm.endTime,
            }).then((res) => {
              if (res.code === 0) {
                this.$Message.success('已加入购物车');
                this.showGBModal = false;
                this.showDERegisterModal = false;
                this.showDETurnToAgentModal = false;
                this.buShenBaoModal = false;
                this.buShenBaoForm.beginTime = new Date(this.buShenBaoForm.beginTime);
                this.buShenBaoForm.endTime = new Date(this.buShenBaoForm.endTime);
                totalShoppingCart().then((res) => {
                  this.$store.commit('saveCarNumStatue', res.data);
                });
              } else {
                this.$Message.error('加入购车车失败');
              }
            });
          } else {
            this.$Message.error('请填完整信息');
            return;
          }
        });
      } else {
        this.buShenBaoForm.checkedSkuId = this.info.productSkuVOList[0].skuId;
        addToCart({
          count: 1,
          productId: id,
          productSkuId: this.buShenBaoForm.checkedSkuId,
        }).then((res) => {
          if (res.code === 0) {
            this.$Message.success('已加入购物车');
            this.showGBModal = false;
            this.showDERegisterModal = false;
            this.showDETurnToAgentModal = false;
            this.buShenBaoModal = false;
            totalShoppingCart().then((res) => {
              this.$store.commit('saveCarNumStatue', res.data);
            });
          } else {
            this.$Message.error('加入购物车失败');
          }
        });
      }
    },
    formatDate(date, type) {
      if (typeof date === 'object' && date) {
        const y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        let d = date.getDate();
        d = d < 10 ? '0' + d : d;
        if (type == 'month') {
          return y + '-' + m;
        } else if (type == 'date') return y + '-' + m + '-' + d + ' 00:00:00';
      } else {
        return date;
      }
    },
    push(href) {
      this.$router.push('shoppingCart');
    },
    toShoppingDetail(info) {
      console.log(info);
      if (this.activityStatus.showBuy) this.$router.push({ path: '/serviceDetail', query: { id: info.productId } });
    },
    buyNow(id, info) {
      if (
        this.info.productSkuVOList.length >= 1 &&
        this.info.productSkuVOList[0].productAttributeRelationDtoList.length > 0
      ) {
        this.$Message.info('请先选择完整商品属性');
        return;
      }
      if (info.functionCode == 2 && info.countryCode == 'GB' && !this.showGBModal) {
        this.showGBModal = true;
        this.type = 1;
        return;
      }
      if (info.functionCode == 5 && info.countryCode == 'DE' && !this.showDERegisterModal) {
        this.showDERegisterModal = true;
        this.type = 1;
        return;
      }
      if (info.functionCode == 2 && info.countryCode == 'DE' && !this.showDETurnToAgentModal) {
        this.showDETurnToAgentModal = true;
        this.type = 1;
        return;
      }
      // 英国退税服务购买弹框提示
      if (info.functionCode == 24 && info.countryCode == 'GB') {
        this.buyRefundModal = true;
        this.id = id;
        return;
      }
      if (this.info.functionCode == 17 && !this.buShenBaoModal) {
        this.buShenBaoModal = true;
        this.getCompanyList();
        this.type = 1;
        return;
      }
      if (this.info.functionCode == 17) {
        this.$refs['buShenBaoForm'].validate((valid) => {
          if (valid) {
            if (this.buShenBaoForm.customerServiceId != 'CSR0008') {
              this.$Message.error('请填写正确的沟通客服ID');
              return;
            }
            let arr = this.companyList.filter((item) => item.companyNameZh == this.buShenBaoForm.companyNameZh);
            if (arr.length == 0) {
              this.$Message.error('请填写正确的服务公司');
              return;
            }
            this.buShenBaoForm.beginTime = this.formatDate(this.buShenBaoForm.beginTime, 'month');
            this.buShenBaoForm.endTime = this.formatDate(this.buShenBaoForm.endTime, 'month');
            let date1 = new Date(this.buShenBaoForm.beginTime);
            let date2 = new Date(this.buShenBaoForm.endTime);
            if (date2.getTime() < date1.getTime()) {
              this.$Message.error('结束月份不能在开始月份之前');
              this.buShenBaoForm.beginTime = new Date(this.buShenBaoForm.beginTime);
              this.buShenBaoForm.endTime = new Date(this.buShenBaoForm.endTime);
              return;
            }
            this.$router.push({
              path: '/sureOrder',
              query: {
                id: id,
                from: 'list',
                count: this.buShenBaoForm.num,
                companyName: this.buShenBaoForm.companyNameZh,
                functionCode: this.info.functionCode,
                serviceType: this.info.functionCode,
                suppleDeclStartTime: this.buShenBaoForm.beginTime,
                suppleDeclEndTime: this.buShenBaoForm.endTime,
                customId: this.buShenBaoForm.customerServiceId,
                skuId: this.info.productSkuVOList[0].skuId,
              },
            });
          } else {
            this.$Message.error('请填完整信息');
            return;
          }
        });
      } else {
        let buyProduct = { ...this.info };
        buyProduct.price = this.info.basePrice;
        buyProduct.productInfoAttributeGroupVOList = this.checkedProductSku;
        buyProduct.productImgUrl = JSON.parse(this.info.pcProductImgUrl)[0].imgUrl;
        buyProduct.countryName = this.info.countryInfo.countryNameZh;
        buyProduct.productAmount = this.buShenBaoForm.num;
        buyProduct.skuId = this.info.productSkuVOList[0].skuId;
        localStorage.setItem('productInfo', JSON.stringify(buyProduct));

        if (info.functionCode == 6) {
          this.tipsModal = true;
        } else {
          this.$router.push({
            path: '/sureOrder',
            query: { id: id, from: 'list', count: 1, skuId: buyProduct.skuId },
          });
        }
        this.id = id;
      }
    },
    buyRefundModalSure() {
      let buyProduct = { ...this.info };
      buyProduct.price = this.info.basePrice;
      buyProduct.productInfoAttributeGroupVOList = this.checkedProductSku;
      buyProduct.productImgUrl = JSON.parse(this.info.pcProductImgUrl)[0].imgUrl;
      buyProduct.countryName = this.info.countryInfo.countryNameZh;
      buyProduct.productAmount = this.buShenBaoForm.num;
      buyProduct.skuId = this.info.productSkuVOList[0].skuId;
      localStorage.setItem('productInfo', JSON.stringify(buyProduct));
      this.$router.push({
        path: '/sureOrder',
        query: { id: this.id, from: 'list', count: 1, skuId: this.info.productSkuVOList[0].skuId },
      });
    },
    tipsModalSure() {
      let buyProduct = { ...this.info };
      buyProduct.price = this.info.basePrice;
      buyProduct.productInfoAttributeGroupVOList = this.checkedProductSku;
      buyProduct.productImgUrl = JSON.parse(this.info.pcProductImgUrl)[0].imgUrl;
      buyProduct.countryName = this.info.countryInfo.countryNameZh;
      buyProduct.productAmount = this.buShenBaoForm.num;
      buyProduct.skuId = this.info.productSkuVOList[0].skuId;
      localStorage.setItem('productInfo', JSON.stringify(buyProduct));
      this.$router.push({
        path: '/sureOrder',
        query: { id: this.id, from: 'list', count: 1, skuId: this.info.productSkuVOList[0].skuId },
      });
    },
  },
  computed: {
    activityStatus() {
      let obj = { showBuy: false };
      if (this.info.limit && this.info.empty) {
        obj.text = '已售罄';
      } else if (this.info.buy) {
        obj.text = '您已购买过';
      } else if (this.info.isBuyZero) {
        obj.text = '无购买0元商品资格';
      } else {
        obj.text = '新用户专享';
      }
      // 不是0元购活动商品、新用户没买过并且有库存
      if (this.info.activityType !== 1) {
        obj.showBuy = true;
      } else if (!this.info.oldUser && !this.info.buy && !this.info.empty && !this.info.isBuyZero) {
        obj.showBuy = true;
      }
      return obj;
    },
  },
  filters: {
    getImgUrl: function(value) {
      let arr = [];
      if (!value.length) {
        return '';
      } else {
        arr = JSON.parse(value);
        arr.length ? (arr = arr[0].imgUrl) : '';
      }
      return arr;
    },
  },
};
</script>

<style lang="less" scoped>
// /deep/.ivu-form-item-error-tip{
//   left: 83px;
// }
.purchaseInformation {
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  line-height: 20px;
  span {
    color: #16ade9;
  }
}
.priceTitle {
  font-size: 14px;
  font-weight: 500;
  font-family: 'Microsoft Yahei', 'PingFangSC-Regular', 'PingFang SC', sans-serif;
  color: #333333;
  line-height: 20px;
}
.price {
  font-size: 18px;
  font-weight: bold;
  color: rgba(237, 62, 62, 1);
  margin-bottom: 5px;
  display: flex;
  align-items: baseline;
  .sign {
    font-size: 12px;
  }
}
.yuanprice {
  font-size: 14px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.4);
  margin-left: 7px;
  text-decoration: line-through;
}
.changeNum {
  // margin-left: 60px;
  input {
    text-align: center;
    width: 40px;
    height: 21px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(204, 204, 204, 1);
    font-size: 12px;
    color: #666666;
    outline: none;
  }
  & span:nth-child(1) {
    width: 30px;
    height: 21px;
    text-align: center;
    // margin-top: 3px;
    position: relative;
    top: 2px;
    line-height: 21px;
    display: inline-block;
    background: rgba(248, 248, 248, 1);
    border: 1px solid rgba(238, 238, 238, 1);
    color: rgba(204, 204, 204, 1);
    outline: none;
    cursor: pointer;
  }
  .add {
    width: 30px;
    display: inline-block;
    text-align: center;
    height: 21px;
    position: relative;
    top: 2px;
    line-height: 21px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(204, 204, 204, 1);
    color: rgba(102, 102, 102, 1);
    outline: none;
    cursor: pointer;
  }
}
.requiredItem::before {
  content: '*';
  display: inline-block;
  margin-right: 4px;
  line-height: 1;
  font-family: SimSun;
  font-size: 12px;
  color: #ed4014;
}
.showGBModal {
  // width: 410px;
  // height: 216px;
  font-size: 14px;
  .buShenBaoModal-serviceContent {
    display: flex;
    margin-top: 24px;
    .right {
      p {
        margin-bottom: 14px;
        img {
          margin-right: 5px;
        }
      }
    }
  }
  .showGBModal-title {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #333333;
    img {
      position: relative;
      top: 7px;
      margin-right: 8px;
    }
  }
  .showGBModal-content {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    padding-left: 37px;
    margin-bottom: 31px;
    margin-top: 7px;
    line-height: 23px;
  }
  .showGBModal-footer {
    text-align: right;
    padding-right: 24px;
    // margin-bottom: 20px;
    padding-bottom: 20px;
    .cancel {
      margin-right: 12px;
      color: #999;
    }
    .cancel:hover {
      background: #16ade9;
      color: #fff;
      border-color: #16ade9;
    }
  }
  .buShenBaoModal-footer {
    text-align: center;
    padding-bottom: 20px;
    .cancel {
      margin-right: 12px;
      color: #999;
    }
    .cancel:hover {
      background: #16ade9;
      color: #fff;
      border-color: #16ade9;
    }
  }
}
.serviceItem {
  background: #ffffff;
  border-radius: 2px;
  border: 1px solid rgba(41, 56, 246, 0.1);
  display: flex;
  margin-bottom: 32px;
  flex-direction: column;
  margin-right: 18px;
  position: relative;
  padding: 10px;

  width: 262px;
  height: 324px;
  background: #ffffff;
  border-radius: 0px 0px 0px 0px;
  .left {
    height: 232px;
    width: 242px;
    img {
      width: 242px;
      height: 232px;
      cursor: pointer;
    }
    .zero-label {
      height: 100px;
      width: 100px;
      position: absolute;
      top: -20px;
      left: -16px;
      z-index: 99;
    }
  }
  .right {
    height: 100%;
    width: 100%;
    .productName {
      font-family: 'Microsoft Yahei', 'PingFangSC-Medium', 'PingFang SC', sans-serif;
      font-weight: 500;
      color: #333333;
      line-height: 20px;
      height: 20px;
      margin-bottom: 8px;

      font-size: 16px;
      font-weight: 400;
      color: #000000;
      margin-top: 12px;
      .line-clampnum(1);
    }
    .serviceTitle {
      font-size: 16px;
      font-weight: 500;
      color: rgba(22, 173, 233, 1);
      margin-bottom: 5px;
      margin-top: -3px;
      font-family: 'Microsoft Yahei', 'PingFangSC-Regular', 'PingFang SC', sans-serif;
      cursor: pointer;
    }
    .info {
      font-size: 12px;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      line-height: 18px;
      margin-bottom: 4px;
      height: 36px;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .priceTitle {
      font-size: 14px;
      font-weight: 500;
      font-family: 'Microsoft Yahei', 'PingFangSC-Regular', 'PingFang SC', sans-serif;
      color: #333333;
      line-height: 20px;
    }
    .price {
      font-size: 18px;
      font-weight: bold;
      color: rgba(237, 62, 62, 1);
      margin-bottom: 5px;
      display: flex;
      align-items: baseline;
      .sign {
        font-size: 12px;
      }
    }
    .userAgreement {
      font-size: 12px;
      font-family: 'Microsoft Yahei', 'PingFangSC-Regular', 'PingFang SC', sans-serif;
      font-weight: 400;
      color: #666666;
      line-height: 17px;
      margin: 6px 0px 12px;
      .agreement {
        color: #16ade9ff;
      }
    }
    .buy {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-top: 16px;
      .addCartBtn,
      .buyNowBtn {
        width: 50%;
        border-radius: 1px;
        height: 34px;
        width: 34px;
        font-size: 12px;
        font-weight: 400;
        line-height: 13px;
        padding: 5px 10px;
        border: none;
        outline: none;
        cursor: pointer;
      }
      .addCartBtn {
        background: #ffffff;
        // border: 1px solid #19ace8;
        // border-radius: 4px;
        // color: #19ace8;
        margin-right: 21px;
        display: flex;
        padding: 0px;
        align-items: center;
        justify-content: center;
        margin-top: 2px;
        img {
          margin-right: 2px;
          margin-bottom: 2px;
        }
      }
      .buyNowBtn {
        width: 184px;
        height: 34px;
        background: #19ace8;
      }
    }
    .zero-show {
      height: 30px;
      background: #16ade9;
      border-radius: 14px;
      opacity: 0.5;
      margin: 16px 20px 0 16px;
      text-align: center;
      color: #fff;
      line-height: 30px;
      font-size: 12px;
    }
  }
  .line {
    width: 1px;
    height: 105px;
    background: #dddddd;
    position: absolute;
    right: -30px;
    top: 7px;
  }
}
.serviceItem:hover {
  box-shadow: 0px 2px 10px 0px rgba(20, 90, 226, 0.14);
  border: 1px solid rgba(41, 56, 246, 0.1);
  cursor: pointer;
}
// @media screen and (min-width: 1920px) {
//   .serviceItem {
//     width: 262px;
//     height: 374px;
//     background: #ffffff;
//     border-radius: 0px 0px 0px 0px;
//     opacity: 1;
//     padding: 10px;
//     .left {
//       height: 232px;
//       width: 242px;
//       img {
//         width: 242px;
//         height: 232px;
//         cursor: pointer;
//         border-top-right-radius: 4px;
//         border-top-left-radius: 4px;
//       }
//     }
//     .right {
//       .productName {
//         margin-bottom: 8px;
//       }
//     }
//   }
//   .content {
//     .item-box {
//       .item {
//         margin-right: 25px;
//       }
//     }
//   }
// }
.notShelves {
  .right {
    .buy {
      .addCartBtn {
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(200, 200, 200, 1);
        color: rgba(200, 200, 200, 1);
        border-color: #c8c8c8;
      }
      .buyNowBtn {
        background: rgba(200, 200, 200, 1);
        color: rgba(255, 255, 255, 1);
        border-color: #c8c8c8;
      }
    }
  }
}
.tipsModal-title {
  font-size: 22px;
  color: #333;
  font-weight: 600;
}
.tipsModal-content {
  font-size: 16px;
  line-height: 26px;
}

// 设置文本的行数
.line-clampnum(@num: 2) {
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: @num;
  /*限制在一个块元素显示的文本的行数*/
  -webkit-box-orient: vertical;
}
</style>
