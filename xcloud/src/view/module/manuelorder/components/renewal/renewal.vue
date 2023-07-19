<!-- 续费 商品 -->

<template>
  <div>
    <el-form v-if="!isRenewal" inline :model="productFrom" ref="productFrom">
      <el-form-item label="国家">
        <el-select clearable style="width: 168px" @change="serviceName" v-model="productFrom.countryCode" filterable>
          <el-option v-for="(item, index) in countrySelect" :key="index" :label="item.countryNameZh" :value="item.countryCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务名称">
        <el-cascader v-model="productFrom.skuid" :key="isResouceShow" :options="serviceList" :props="{ expandTrigger: 'hover', emitPath: false }" @change="getserviceName" clearable filterable></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="addProduct">
          <i class="icon icon-adds"></i>
          新增商品
        </el-button>
      </el-form-item>
    </el-form>

    <el-table ref="renewalTable" :row-class-name="tableRowClassName" :data="tableData" height="250" border style="width: 100%" @selection-change="handleSelectionChange">
      <div slot="empty">该客户暂无可续费的商品</div>
      <el-table-column label="序号" align="center" width="70">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="商品服务图片" align="center" width="150">
        <template slot-scope="scope">
          <el-image style="width: 48px; height: 33px" :src="scope.row.productImgUrl" :preview-src-list="[scope.row.productImgUrl]">
            <div slot="error" class="image-slot">
              <img src="@/assets/images/infoDetail/default.png" alt="" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" label="服务名称" width="300">
        <template slot-scope="scope">{{ scope.row.serviceName }}</template>
      </el-table-column>
      <el-table-column align="center" label="国家" width="150">
        <template slot-scope="scope">{{ scope.row.countryNameZh }}</template>
      </el-table-column>
      <el-table-column align="center" v-if="!isRenewal" label="服务截止日期" width="150">
        <template slot-scope="scope">{{ scope.row.expirationTime }}</template>
      </el-table-column>
      <el-table-column align="center" v-if="!isRenewal" label="剩余服务时间" width="150">
        <template slot-scope="scope">{{ scope.row.expirationTime | filterRestTime }}</template>
      </el-table-column>
      <el-table-column align="center" v-if="!isRenewal" label="服务状态" width="150">
        <template slot-scope="scope">{{ scope.row.status | serviceStatus }}</template>
      </el-table-column>
      <el-table-column align="center" v-if="!isRenewal" label="优惠" width="150">
        <template slot-scope="scope">{{ scope.row.activityType | filterDiscount(scope.row.activityContent, $util.accMul) }}</template>
      </el-table-column>
      <el-table-column align="center" label="服务金额（元）" width="150">
        <template slot-scope="scope">
          <div class="old-price" v-if="scope.row.activityType">{{ scope.row.productOriginalPrice }}</div>
          <div class="new-price">{{ scope.row.productPrice }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="数量" width="100">
        <template slot-scope="scope">{{ scope.row.count }}</template>
      </el-table-column>
      <el-table-column align="center" label="实际售价（元）" width="200">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.price" :min="0" :active-change="false" :precision="2" controls-position="right" clearable size="small" @change="changeRenewalPrice($event, scope.$index)"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column align="center" v-if="!isRenewal" label="服务号" width="200">
        <template slot-scope="scope">{{ scope.row.serviceNo }}</template>
      </el-table-column>
      <el-table-column align="center" label="服务公司" width="200">
        <template slot-scope="scope">{{ scope.row.companyNameZh }}</template>
      </el-table-column>
      <el-table-column v-if="isRenewal" type="selection" :selectable="selectable" align="center" label="操作" width="100" fixed="right"> </el-table-column>
      <el-table-column v-else align="center" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-link type="primary" :underline="false" @click="handleDelet(scope.row)" v-if="!scope.row.serviceId">删除</el-link>
          <el-link type="primary" :underline="false" @click="showDelDialog(scope.row)" v-else>删除</el-link>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog class="el-dialog-del" :visible.sync="showDel" @close="delFormReset" width="504px">
      <div slot="title">
        <i class="icon icon-dialog-tip"></i>
        <span>提示</span>
      </div>
      <div class="text-tip">
        <i class="icon icon-tip"></i>
        <span>该服务项目已经生成服务工单，删除服务项目会同步取消服务工单，需要提前与交付沟通再删除</span>
      </div>
      <el-form :model="delForm" :rules="delRules" ref="delRef">
        <el-form-item label="审核凭证" prop="delAuditFile">
          <UploadFileUrl :fileList.sync="delForm.delAuditFile" fileClass :showTip="false"></UploadFileUrl>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" style="width: 65px" type="default" @click="showDel = false">取消</el-button>
        <el-button size="small" style="width: 65px" type="primary" @click="delConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listByCountryCode } from '@/api/newApi/manuelorder/addOrder.js';
import { getCountrySelectList } from '@/api/newApi/common.js';
export default {
  props: {
    isRenewal: Boolean, //是否续费
    userMobile: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      tableData: [], //表单数据
      //商品信息检验
      productFrom: {},
      showDel: false,
      countrySelect: [], //国家列表
    };
  },

  watch: {
    userMobile: function (val) {},
  },

  methods: {
    // 修改已选中行颜色
    tableRowClassName({ row, rowIndex }) {
      if (this.checkIds.includes(row.id)) {
        return 'gray-row';
      }
    },

    // 设置操作禁用
    selectable(row) {
      return !row._disabled;
    },

    // 续费商品列表
    getRenewalList() {
      renewalPage({
        userMobile: this.orderForm.userMobile,
        page: 1,
        limit: -1,
      }).then((res) => {
        if (res.code === 0) {
          res.data.records.forEach((item) => {
            item.count = 1;
            if (typeof item.productOriginalPrice !== 'number') {
              item.productOriginalPrice = 0;
              item.activityType = 0;
              item._disabled = true;
            }
            if (typeof item.productPrice !== 'number') {
              item.productPrice = item.productOriginalPrice;
              item.activityType = 0;
            }
            item.price = item.productPrice;
            item.productImgUrl = this.getImgSrc(item.pcProductImgUrl, item.mobileProductImgUrl);
          });
          this.renewalList = res.data.records;
          this.$nextTick(() => {
            this.$refs.renewalTable.doLayout();
          });
        }
      });
    },

    /**
     * 选择国家 获取服务名称
     */
    serviceName() {
      this.countrySelect.some((item) => {
        if (item.countryCode === this.productFrom.countryCode) {
          this.productFrom.countryName = item.countryNameZh;
        }
      });
      this.getService();
    },

    /**
     * 获取商品服务名称
     */
    getService() {
      listByCountryCode({
        limit: 1000,
        page: 1,
        status: 1,
        countryCode: this.productFrom.countryCode,
      })
        .then((res) => {
          if (res.code == 0) {
            this.serviceList = [];
            if (res.data.records.length > 0) {
              let data = res.data.records;
              data.forEach((item) => {
                const t = item.productSkuVOList;
                if (t.length == 1) {
                  item.productSkuVOList.forEach((pro) => {
                    pro.label = item.productName;
                    pro.value = pro.skuId;
                  });
                } else {
                  item.productSkuVOList.forEach((pro) => {
                    let i = pro.skuName.lastIndexOf(';');
                    if (i > -1) {
                      pro.label = pro.skuName.substring(0, i);
                    } else {
                      pro.label = pro.skuName;
                    }
                    pro.value = pro.skuId;
                  });
                }

                this.serviceList.push({
                  label: item.productName,
                  value: item.productId,
                  productImgUrl: this.getImgSrc(item.pcProductImgUrl, item.mobileProductImgUrl),
                  children: item.productSkuVOList,
                });
              });
            } else {
              this.serviceList = [];
            }
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },

    /**动态添加商品 */
    addProduct() {
      if (!this.productFrom.skuid || !this.productFrom.countryCode) {
        this.$message.warning('请选择国家或者服务名称');
        return;
      }
      if (!this.orderForm.invoiceType) {
        this.$message.warning('请选择开票类型');
        return;
      }
      this.tableData.push({
        productImgUrl: this.productFrom.productImgUrl, //图片
        serviceName: this.productFrom.serviceProductName, //服务名称
        countryName: this.productFrom.countryName, //国家
        productOldMoney: this.productFrom.productOldMoney, //服务金额
        count: 1,
        price: this.productFrom.productOldMoney, //实际售价-添加时默认为服务金额
        sellprice: this.productFrom.productOldMoney, //实际售价单条总和
        serviceprice: this.productFrom.productOldMoney, //服务金额单条总和
        invoiceprice: this.productFrom.productOldMoney * this.orderForm.taxPoint,
        discAmountMoney: 0,
        productSkuId: this.productFrom.skuid,
        produtId: this.productFrom.productId,
        productName: this.productFrom.productName,
        minPrice: this.productFrom.minPrice, // 最低售价
        rangeMaxPrice: this.productFrom.rangeMaxPrice, // 商品区间最大价格
        rangeMinPrice: this.productFrom.rangeMinPrice, // 商品区间最小价格
      });
      this.productFrom.skuid = ''; //添加成功后将服务 清掉，避免重复添加
      this.getServicePrice(); //计算总销售价
      this.getComputedFn(); //计算金额的方法
      this.getTaxRate();
    },

    /** 动态删除商品 */
    handleDelet(row) {
      this.$confirm('是否确认删除', '提示', {
        customClass: 'custom-confirm',
        type: 'warning',
        center: true,
      }).then(() => {
        var index = this.tableData.indexOf(row);
        if (index !== -1) {
          this.tableData.splice(index, 1);
          this.getServicePrice(); //计算总销售价
          this.getComputedFn(); //计算金额的方法
        }
      });
    },
    showDelDialog(row) {
      this.checkRow = row;
      this.showDel = true;
    },

    // 删除生成服务的商品
    delConfirm() {
      this.$refs.delRef.validate((valid) => {
        if (valid) {
          var index = this.tableData.indexOf(this.checkRow);
          if (index !== -1) {
            this.tableData.splice(index, 1);
            this.getServicePrice(); //计算总销售价
            this.getComputedFn(); //计算金额的方法
          }
          this.delAuditFile.push(this.delForm.delAuditFile);
          this.showDel = false;
        }
      });
    },

    delFormReset() {
      if (this.$refs.delRef) {
        this.$refs.delRef.resetFields();
      }
    },

    /**
     * 获取国家下拉框数据
     */
    getCountry() {
      getCountrySelectList()
        .then((res) => {
          this.countrySelect = res.data;
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
  },
};
</script>
<style lang="scss" scoped></style>
