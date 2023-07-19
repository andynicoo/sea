<template>
  <div class="app-container">
    <BackHerader @back="goback" title="创建会员卡"></BackHerader>
    <!-- 表单 -->
    <div class="form-container">
      <el-form label-width="140px" ref="formRef" :model="form" :rules="formRules">
        <el-form-item label="会员卡名称：" prop="membershipCardName">
          <el-input v-model="form.membershipCardName" placeholder="请输入活动名称" clearable style="width: 360px" :disabled="isEdit" maxlength="8" />
        </el-form-item>
        <el-form-item label="会员卡封面：">
          <el-radio-group v-model="form.cover">
            <el-radio :label="item.label" v-for="(item, index) in coverImg" :key="index">
              <el-image style="width: 170px; height: 40px; margin-right: 10px" :src="item.label">
                <div slot="error" class="image-slot">
                  <img src="@/assets/images/infoDetail/default.png" alt="" style="width: 170px; height: 40px" />
                </div>
              </el-image>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="会员卡图标：" prop="icon">
          <UploadImage ref="uploadImageRef" :imageUrl="form.icon" :imgType="1" :on-success="(v) => (form.icon = v.file.fileUrl)" upload-tips="添加图片" :imgMaxSize="3" :accept="'.png, .jpg'" :ruleType="['image/jpeg', 'image/jpg', 'image/png']"></UploadImage>
          <div class="subTips">建议尺寸：800*800</div>
        </el-form-item>
        <el-form-item label="购买方式：">
          <el-radio-group v-model="form.buyType" disabled>
            <el-radio label="0">一次性购买</el-radio>
            <el-radio label="1">连续购买</el-radio>
          </el-radio-group>
          <div v-if="form.buyType == 0" style="padding-top: 10px">
            <el-table style="width: 760px" :data="form.activityProductList" ref="table" v-if="form.activityProductList && form.activityProductList.length > 0">
              <Empty slot="empty" />
              <el-table-column align="center" label="卡类型" width="100px" prop="cardType"> </el-table-column>
              <el-table-column align="center" label="有效期" width="300px">
                <template slot-scope="scope">
                  购买后
                  <el-input-number v-model="scope.row.validTime" controls-position="right" placeholder="" style="width: 90px; margin: 0 10px" clearable :min="0" :max="maxNum[scope.row.validTimeUnit]" :disabled="isEdit || form.status" size="small" v-if="scope.row.validTimeUnit != 'permanent'" />
                  <el-select placeholder="请选择" style="width: 90px" v-model="scope.row.validTimeUnit" :disabled="isEdit || form.status">
                    <el-option label="年" value="year"></el-option>
                    <el-option label="月" value="month"></el-option>
                    <el-option label="日" value="day"></el-option>
                    <el-option label="永久" value="permanent"></el-option>
                  </el-select>
                  内有效
                </template>
              </el-table-column>
              <el-table-column align="center" label="划线价" width="180px">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.crossedPrice" :min="0.01" :active-change="false" :precision="2" controls-position="right" clearable size="small" :disabled="isEdit || form.status"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column align="center" label="价格" width="180px">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.price" :min="0.01" :max="Number(scope.row.crossedPrice)" :active-change="false" :precision="2" controls-position="right" clearable size="small" :disabled="isEdit || form.status"></el-input-number>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
        <el-form-item label="会员服务协议：" prop="serviceAgreement">
          <Editor :value.sync="form.serviceAgreement" style="width: 1000px" :disabled="isEdit" v-if="!isEdit"></Editor>
          <div v-html="form.serviceAgreement" style="word-break: break-all" v-else></div>
        </el-form-item>
        <el-form-item label="权益设置：" prop="checkAll">
          <el-checkbox-group v-model="form.checkAll" :disabled="isEdit">
            <div v-for="(item, index) in equityList" :key="index">
              <el-checkbox :label="item.memberBenefitId">
                {{ item.benefitName }}
                <el-input-number v-if="item.benefitCode == 'give_integral'" v-model="point" controls-position="right" placeholder="" style="width: 90px; margin: 0 10px" clearable :min="0" :max="999" :disabled="isEdit" size="small" /><span v-if="item.benefitCode == 'give_integral'">个</span>
                <el-input-number v-if="item.benefitCode == 'integral_repay_rate'" v-model="rate" controls-position="right" placeholder="" style="width: 90px; margin: 0 10px" clearable :min="0" :max="999" :disabled="isEdit" size="small" /><span v-if="item.benefitCode == 'integral_repay_rate'"
                  >倍</span
                >
              </el-checkbox>
              <el-button style="margin-left: 20px" @click="dialogVisible = true" :disabled="isEdit" v-if="item.benefitCode == 'give_coupon' && !couponSelection.length">选择优惠券</el-button>
              <div v-if="item.benefitCode == 'give_coupon' && couponSelection.length" style="margin: 10px 0">
                <el-table :data="couponSelection" stripe style="width: 700px">
                  <el-table-column prop="couponName" label="优惠券名称" width="180"> </el-table-column>
                  <el-table-column prop="couponContent" label="优惠内容" width="180"> </el-table-column>
                  <el-table-column align="center" label="赠劵数" width="180px">
                    <template slot-scope="scope">
                      <el-input-number v-model="num" controls-position="right" placeholder="" clearable :min="0" :max="scope.row.surplusNum > -1 ? scope.row.surplusNum : 9999" :disabled="isEdit" size="small" />
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="120">
                    <template>
                      <el-button type="text" size="small" @click="dialogVisible = true" :disabled="isEdit"> 修改 </el-button>
                      <el-button type="text" size="small" @click="deleteCouponSelection" :disabled="isEdit"> 删除 </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input-number v-model="form.sort" placeholder="" clearable :min="0" :max="9999" :disabled="isEdit" size="small" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="handleSubmit" v-show="hasAuthority('E2_13')" v-if="!isEdit"> 保存 </el-button>
          <el-button @click="goback()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="1200" center destroy-on-close :append-to-body="true">
      <Coupon ref="coupon" @getCouponSelection="getCouponSelection" :couponSelectionProp="couponSelection" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="couponSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import BackHerader from '@/components/backHerader';
import FormTitle from '@/components/WorkOrderComponents/FormTitle';
import Editor from '@/components/quillEditor/index';
import Coupon from '../integral/couponPage/index.vue';
import { cardAdd, cardEdit, cardDetails, cardEquityList } from '@/api/newApi/extension/activity.js';
import UploadImage from '@/components/UploadImage/index.vue';
import { couponInfo } from '@/api/newApi/extension/coupon.js';
export default {
  components: {
    BackHerader,
    FormTitle,
    Editor,
    UploadImage,
    Coupon,
  },
  data() {
    return {
      form: {
        membershipCardName: '',
        buyType: '0',
        icon: '',
        cover: 'https://file.itaxs.com/dev/20221208/9feb29d82b9a47a1a632f40415d92c86.png',
        checkAll: [],
        serviceAgreement: '',
        enterpriseId: Number(localStorage.getItem('enterpriseId')),
        activityProductList: [
          {
            cardType: '购买后生效',
            validTime: '',
            validTimeUnit: 'year',
            price: '',
            crossedPrice: '',
          },
        ],
        sort: '0',
      },
      equityList: [],
      couponSelection: [],
      couponSelectionTemp: [],
      num: 1,
      point: '',
      rate: '',
      formRules: {
        membershipCardName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        serviceAgreement: [{ required: true, message: '请输入活动规则', trigger: 'blur' }],
        icon: [{ required: true, message: '请添加商品封面', trigger: 'change' }],
        checkAll: [{ required: true, message: '请选择适权益设置', trigger: 'change' }],
        sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
      },
      submitting: false,
      fromWhere: this.$route.query.key,
      dialogVisible: false,
      maxNum: {
        year: 10,
        month: 24,
        day: 730,
      },
      coverImg: [
        {
          label: 'https://file.itaxs.com/dev/20221208/9feb29d82b9a47a1a632f40415d92c86.png',
          value: 'VIP',
        },
        {
          label: 'https://file.itaxs.com/dev/20221208/efd5cdc1fb104c4ba63afa4d94cdc463.png',
          value: 'VIP2',
        },
        {
          label: 'https://file.itaxs.com/dev/20221208/c2ce8fd9d42d427d8bc985c00971d122.png',
          value: 'SVIP',
        },
      ],
    };
  },
  mounted() {
    if (this.fromWhere == 'edit' || this.fromWhere == 'copy' || this.fromWhere == 'view') this.getActivity();
    this.getCardEquityList();
  },
  computed: {
    isEdit() {
      return this.$route.query.key == 'view';
    },
  },
  methods: {
    // 保存
    handleSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          let data = {
            membershipCard: {
              membershipCardName: this.form.membershipCardName,
              buyType: this.form.buyType,
              cover: this.form.cover,
              icon: this.form.icon,
              price: this.form.activityProductList[0].price,
              crossedPrice: this.form.activityProductList[0].crossedPrice,
              serviceAgreement: this.form.serviceAgreement,
              validTime: this.form.activityProductList[0].validTimeUnit == 'permanent' ? '' : this.form.activityProductList[0].validTime,
              validTimeUnit: this.form.activityProductList[0].validTimeUnit,
              sort: this.form.sort,
            },
            memberBenefitsDataDTOList: [],
          };
          let isSelect = true;
          let isPoint = true;
          let isRate = true;
          this.equityList.forEach((item) => {
            let checkAll = this.form.checkAll;
            if (checkAll.indexOf(item.memberBenefitId) > -1) {
              let json = {
                extendData: '',
                id: Number(item.memberBenefitId),
              };
              if (item.benefitCode == 'give_coupon') {
                if (this.couponSelection.length > 0) {
                  let arry = [];
                  for (let i = 0; i < this.num; i++) {
                    arry.push(this.couponSelection[0].marketingCouponActivityId);
                  }
                  json.extendData = arry.join(',');
                } else {
                  isSelect = false;
                }
              } else if (item.benefitCode == 'give_integral') {
                if (this.point == '') {
                  isPoint = false;
                }
                json.extendData = this.point;
              } else if (item.benefitCode == 'integral_repay_rate') {
                if (this.rate == '') {
                  isRate = false;
                }
                json.extendData = this.rate;
              }
              data.memberBenefitsDataDTOList.push(json);
            }
          });
          if (!isSelect) {
            this.$message.warning('请选择优惠券!');
            return false;
          }
          if (!isPoint) {
            this.$message.warning('请填写积分');
            return false;
          }
          if (!isRate) {
            this.$message.warning('请填写倍数');
            return false;
          }
          if (this.fromWhere == 'edit') {
            this.editCard(data);
          } else {
            this.createCard(data);
          }
        } else {
          return false;
        }
      });
    },

    getCardEquityList() {
      cardEquityList({ page: 1, size: 100 })
        .then((res) => {
          if (res.code === 0) {
            this.equityList = res.data.records;
          }
        })
        .finally(() => {
          this.listLoading = false;
        });
    },

    // 获取一个活动
    getActivity() {
      cardDetails({ id: this.$route.query.id }).then((res) => {
        if (res.code == 0) {
          let dataCard = res.data;
          let arry = [];
          dataCard.membershipLkBenefitsVoS.forEach((item) => {
            arry.push(item.memberBenefitId);
            if (item.memberBenefits.benefitCode == 'give_coupon') {
              item.extendData = item.extendData.split(',');
              this.getCouponInfo(item.extendData[0]);
              this.num = item.extendData.length;
            } else if (item.memberBenefits.benefitCode == 'give_integral') {
              this.point = item.extendData;
            } else if (item.memberBenefits.benefitCode == 'integral_repay_rate') {
              this.rate = item.extendData;
            }
          });
          this.form = {
            membershipCardName: dataCard.membershipCardName,
            buyType: dataCard.buyType + '',
            icon: dataCard.icon,
            status: dataCard.status,
            sort: dataCard.sort,
            cover: dataCard.cover,
            membershipCardId: dataCard.membershipCardId,
            serviceAgreement: this.$Base64.decode(dataCard.serviceAgreementEncryption),
            activityProductList: [
              {
                cardType: '购买后生效',
                price: dataCard.price,
                crossedPrice: dataCard.crossedPrice,
                validTime: dataCard.validTime,
                validTimeUnit: dataCard.validTimeUnit,
              },
            ],
            checkAll: arry,
          };
        } else {
          this.$message.error(res.message);
        }
      });
    },
    //获取优惠券详情
    getCouponInfo(id) {
      couponInfo({ couponId: id, enterpriseId: window.localStorage.getItem('enterpriseId') })
        .then((res) => {
          if (res.code == 0) {
            this.$set(this.couponSelection, 0, { couponName: res.data.couponName, couponContent: res.data.couponContent, marketingCouponActivityId: res.data.marketingCouponActivityId });
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {});
    },
    // 会员卡编辑
    editCard(data) {
      this.submitting = true;
      data.membershipCard.membershipCardId = this.$route.query.id;
      cardEdit(data)
        .then((res) => {
          if (res.code == 0) {
            this.$message.success('编辑成功');
            this.$router.push('/extension/activityManagement/card/index');
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.submitting = false;
        });
    },
    // 新增会员卡
    createCard(data) {
      this.submitting = true;
      cardAdd(data)
        .then((res) => {
          if (res.code == 0) {
            this.$message.success('新增成功');
            this.$router.push('/extension/activityManagement/card/index');
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.submitting = false;
        });
    },

    // 返回列表
    goback() {
      this.$router.push('/extension/activityManagement/card/index');
    },
    getCouponSelection(data) {
      this.couponSelectionTemp = data;
    },
    couponSure() {
      this.$refs.coupon.getCouponSelection();
      let couponLength = this.couponSelectionTemp.length;
      if (couponLength && couponLength > 1) {
        this.$message({
          type: 'error',
          message: '只能选择一个优惠券',
        });
      }
      if (!couponLength || couponLength === 1) {
        this.couponSelection = this.couponSelectionTemp;
        this.dialogVisible = false;
      }
    },
    deleteCouponSelection() {
      this.couponSelection = [];
    },
  },
};
</script>
<style lang="less" scoped>
.app-container {
  position: relative;
  background: #fff;
  padding: 0px 30px 30px;
  .el-page-header {
    padding: 20px 0px 30px 0px;
    .el-page-header__left {
      display: flex;
      align-items: baseline;
    }
  }
  .form-container {
    background: #fff;
    border-radius: 4px;
    .titleStyle {
      margin-bottom: 20px;
    }
  }
  .setting {
    color: #cccccc;
    font-size: 12px;
    line-height: 20px;
    padding-left: 22px;
  }
}
.tooltip-box {
  width: 150px;
  .grid-content {
    height: 50px;
    background: #cccccc;
    text-align: center;
    line-height: 48px;
    margin: 2px;
  }
  .tooltip-text {
    text-align: center;
    margin-top: 10px;
  }
}
</style>
