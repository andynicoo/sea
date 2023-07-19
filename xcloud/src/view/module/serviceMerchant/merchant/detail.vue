<template>
  <div id="merchantDetailContent" class="app-container">
    <div class="header-container">
      <el-row class="header">
        <el-link :underline="false" type="info" @click="goBack">
          <i class="el-icon-arrow-left"></i>
          <!-- <span class="state">{{ getStatus(publishFormData.baseForm.state) }}</span> -->
          <span class="type">{{ publishFormData.baseForm.type }}</span>
        </el-link>
      </el-row>
      <el-row class="imgContent">
        <el-col :lg="5" :xl="3">
          <img v-if="pcimg && h5img" class="merchantIMG" :src="activeName == 'first' ? pcimg : h5img" alt="" />
          <img v-else class="merchantIMG" :src="default_img" alt="" />
        </el-col>
        <el-col :span="18" class="detail">
          <el-row>
            <span class="title">{{ publishFormData.baseForm.name }}</span>
          </el-row>
          <el-row>
            <span class="subtitle">服务内容：</span>
            <span class="subtitle" v-for="item in publishFormData.baseForm.content" :key="item">
              <i class="el-icon-circle-check check"></i>
              <span>{{ item }}</span>
            </span>
          </el-row>
          <!-- <el-row v-for="item in publishFormData.baseForm.content" :key="item">
          <el-col class="offset">
            <i class="el-icon-circle-check check"></i>
            <span>{{ item }}</span>
          </el-col>
        </el-row> -->

          <div v-if="publishFormData.baseForm.item.length == 0">
            <el-row>
              <span class="subtitle">服务价格</span>
            </el-row>
            <el-row>
              <el-col class="offset" :span="2">
                <span>服务价格：</span>
              </el-col>
              <el-col :span="6">
                <span class="price">￥{{ publishFormData.baseForm.signalSalePrice }}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="offset" :span="2">
                <span>原价：</span>
              </el-col>
              <el-col :span="6">
                <span>￥{{ publishFormData.baseForm.signalOriginalPrice }}</span>
              </el-col>
            </el-row>
          </div>
          <div v-else>
            <el-row>
              <span class="subtitle">服务项目与价格：</span>
            </el-row>
            <el-row>
              <el-col class="offset">
                <!-- <table border="1" cellspacing="0" :style="{ 'border-color': 'white' }">
                  <tr>
                    <th>商品项目</th>
                    <th>商品价格</th>
                    <th>原价</th>
                    <th>单位</th>
                    <th>关联商品商品</th>
                  </tr>
                  <tr v-for="item in publishFormData.baseForm.price" :key="item.id">
                    <td>{{ item.fullname || item.name }}</td>
                    <td class="price">￥{{ item.sale }}</td>
                    <td>￥{{ item.original }}</td>
                    <td>{{ publishFormData.baseForm.unit }}</td>
                    <td>{{ item.skuName }}</td>
                  </tr>
                </table> -->
                <el-table
                  border
                  :data="publishFormData.baseForm.price"
                  :max-height="260"
                  class="table"
                  style="width: 70%;"
                >
                  <el-table-column align="center" label="商品项目">
                    <template slot-scope="scope">
                      {{ scope.row.fullname || scope.name }}
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="商品价格" width="120">
                    <template slot-scope="scope">{{ publishFormData.baseForm.currency || '￥' }}{{ scope.row.sale }}</template>
                  </el-table-column>
                  <el-table-column align="center" label="原价" width="120">
                    <template slot-scope="scope">{{ publishFormData.baseForm.currency || '￥' }}{{ scope.row.original }}</template>
                  </el-table-column>
                  <el-table-column align="center" label="单位" width="120">
                    {{ publishFormData.baseForm.unit }}
                  </el-table-column>
                  <el-table-column align="center" label="关联商品商品">
                    <template slot-scope="scope">{{ scope.row.skuName }}</template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </div>
          <el-row class="info">
            <el-col :span="6">
              <span>服务类型：</span>
              <span>{{ publishFormData.baseForm.type }}</span>
            </el-col>
            <el-col :span="6">
              <span>国家：</span>
              <span>{{ publishFormData.baseForm.country }}</span>
            </el-col>
            <el-col :span="6">
              <span>已发布销售端：</span>
              <span>{{ publishFormData.baseForm.target }}</span>
            </el-col>
          </el-row>
          <el-row class="info">
            <el-col :span="6">
              <span>发布人：</span>
              <span>{{ publishFormData.createName }}</span>
            </el-col>
            <el-col :span="6">
              <span>发布时间：</span>
              <span>{{ publishFormData.createTime }}</span>
            </el-col>
            <el-col :span="6">
              <span>修改人：</span>
              <span>{{ publishFormData.modifyName }}</span>
            </el-col>
            <el-col :span="6">
              <span>修改时间：</span>
              <span>{{ publishFormData.updateTime }}</span>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-tabs v-model="activeName">
            <el-tab-pane label="PC详情" name="first">
              <img
                v-if="$util.isImage(publishFormData.pcForm.mutilText)"
                class="detailimg"
                :src="publishFormData.pcForm.mutilText"
                alt=""
              />
              <span v-else-if="publishFormData.pcForm.mutilText">{{ publishFormData.pcForm.mutilText }}</span>
              <div v-else class="mutilText">暂无数据</div>
            </el-tab-pane>
            <el-tab-pane label="H5详情" name="second">
              <img
                v-if="$util.isImage(publishFormData.h5Form.mutilText)"
                class="detailimg"
                :src="publishFormData.h5Form.mutilText"
                alt=""
              />
              <span v-else-if="publishFormData.h5Form.mutilText">{{ publishFormData.h5Form.mutilText }}</span>
              <div v-else class="mutilText">暂无数据</div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import default_img from "@/assets/images/infoDetail/detailimg.png";
import staticList from "../staticList";
import { getOne, relationProduct } from "@/api/newApi/servicemerchant/serviceMerchant.js";
import json from "highlight.js/lib/languages/json";
import { log } from "mathjs";
export default {
  data() {
    return {
      activeName: "first",
      /*****
       * 详情页展示的表具体数据
       */
      publishFormData: {
        createName: "",
        createTime: "",
        modifyName: "",
        updateTime: "",
        baseForm: {
          id: "",
          type: "",
          classify: "",
          name: "",
          typeName: "",
          country: "",
          content: new Array(),
          item: new Array(),
          signalOriginalPrice: "",
          signalSalePrice: "",
          price: [
            {
              id: "",
              name: "",
              original: "",
              sale: ""
            }
          ],
          order: "",
          unit: "",
          target: new Array(),
          state: new Array()
        },
        pcForm: {
          flag: 0,
          imgUrl: "",
          mutilText: ""
        },
        h5Form: {
          flag: 1,
          imgUrl: "",
          mutilText: ""
        }
      },
      pcimg: "",
      h5img: "",

      unitSelect: staticList.unitArray,
      saleTargetSelect: staticList.targetArray,
      stateSelect: staticList.stateArray,
      productList: [],
      default_img
    };
  },
  created() {
    this.getDeatil();
  },
  methods: {
    goBack() {
      this.$router.push("/serviceMerchant/merchant/index");
    },
    getDeatil() {
      getOne(this.$route.query.productId)
        .then(res => {
          if (res.code == 0) {
            const row = res.data;
            this.productInfo(row);
            this.getRelationProduct();
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    productInfo(row) {
      if (!row) {
        this.back();
      } else {
        this.publishFormData = {
          createName: row.createName,
          createTime: row.createTime,
          modifyName: row.modifyName,
          updateTime: row.updateTime,
          baseForm: {
            id: row.productId,
            type:
              row.productCategoryVo && row.productCategoryVo.parentProductCategoryVo
                ? `${row.productCategoryVo.parentProductCategoryVo.categoryName}-${row.productCategoryVo.categoryName}`
                : "",
            name: row.productName,
            country: row.countryCode,
            currency: row.currency,
            //这里的非sku属性 本来是想做成二维的 checkbox绑定二维数组 但是现在决定按一维的来做 如果新增非sku属性不能填写属性的type名
            content:
              row.noSkuProductAttributeRelationVOList.length == 0
                ? []
                : row.noSkuProductAttributeRelationVOList.map(res => {
                    return res.productAttributeName;
                  }),
            item: !row.productSkuVOList
              ? []
              : row.productSkuVOList.map(res => {
                  let str = "";
                  res.productAttributeRelationDtoList.forEach(item => {
                    str = item.productAttributeName;
                  });
                  return str;
                }),
            signalOriginalPrice: row.baseStandardPrice,
            signalSalePrice: row.basePrice,
            price: row.productSkuVOList.map(res => {
              return {
                original: res.standardPrice,
                sale: res.price,
                fullname:
                  res.productAttributeRelationDtoList
                    .map(item => {
                      return item.productAttributeName;
                    })
                    .join(",") || row.productName,
                list: res.productAttributeRelationDtoList,
                joinSkuIds: res.joinSkuIds
              };
            }),

            order: row.sort,
            unit: this.getUnit(row.unit),
            target: !row.applySit ? [] : this.getSaleTarget(row.applySit),
            state: this.getStatus(row.status)
          },
          pcForm: {
            flag: 0,
            imgUrl: !row.pcProductImgUrl ? "" : JSON.parse(row.pcProductImgUrl),
            mutilText: row.pcProductDetail,
            isNeed: false
          },
          h5Form: {
            flag: 1,
            imgUrl: !row.mobileProductImgUrl ? "" : JSON.parse(row.mobileProductImgUrl),
            mutilText: row.mobileProductDetail,
            isNeed: false
          }
        };
        this.pcimg = !this.publishFormData.pcForm.imgUrl ? "" : this.publishFormData.pcForm.imgUrl[0].imgUrl;
        this.h5img = !this.publishFormData.h5Form.imgUrl ? "" : this.publishFormData.h5Form.imgUrl[0].imgUrl;
        console.log(1, this.publishFormData.pcForm.mutilText);
      }
    },
    //获取关联商品
    getRelationProduct() {
      relationProduct()
        .then(res => {
          if (res.code == 0) {
            res.data.map(item => {
              const t = item.productSkuVOList;
              t.map(v => {
                this.publishFormData.baseForm.price.map(pro => {
                  if (pro.joinSkuIds != "") {
                    if (v.skuId == JSON.parse(pro.joinSkuIds)[0]) {
                      this.$set(pro, "skuName", item.productName);
                    }
                  }
                });
              });
            });
            return this.publishFormData.baseForm.price;
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },

    getSaleTarget(val) {
      if (!val || val.length == 0) {
        return "";
      }

      return JSON.parse(val)
        .map(item => {
          let name = "";
          this.saleTargetSelect.some(t => {
            if (t.id == item) {
              name = t.name;
              return true;
            }
          });
          return name;
        })
        .join(",");
    },
    /**
     * 获取默认图片 优先pc端
     */
    // getImgSrc(pcImg, mobileImg) {
    //   if (pcImg) {
    //     return JSON.parse(pcImg)[0].imgUrl;
    //   } else if (mobileImg) {
    //     return JSON.parse(mobileImg)[0].imgUrl;
    //   }

    //   // let img1 = !pcImg || pcImg.length == 0 ? [] : JSON.parse(pcImg);
    //   // let img2 =
    //   //   !mobileImg || mobileImg.length == 0 ? [] : JSON.parse(mobileImg);
    //   // return (
    //   //   (img1.length == 0 ? false : img1[0].imgUrl) ||
    //   //   (img2.length == 0 ? "" : img2[0].imgUrl)
    //   // );
    // },
    /**
     * 根据id获取状态
     */
    getStatus(code) {
      if (!code && code != 0) {
        return "";
      }
      let name = "";
      this.stateSelect.some(res => {
        if (res.id == code) {
          name = res.name;
          return true;
        }
      });
      return name;
    },

    getUnit(code) {
      if (!code && code != 0) {
        return "";
      }
      let name = "";
      this.unitSelect.some(res => {
        if (res.id == code) {
          name = res.name;
          return true;
        }
      });
      return name;
    },

    back() {
      this.$router.push({
        path: "/serviceMerchant/merchant/index"
      });
    }
  }
};
</script>
<style lang="scss" scoped>
#merchantDetailContent {
  background: #fff;
  min-height: calc(100vh - 120px);
  .header {
    height: 40px;
    .type {
      line-height: 40px;
    }
  }
  .imgContent {
    margin-top: 10px;
    .merchantIMG {
      margin: 10px 0 0 30px;
      width: 168px;
      height: 168px;
    }
    .detail {
      padding: 10px 10px 0 14px;
      .title {
        font-weight: bold;
        color: black;
        font-size: 20px;
      }
      .subtitle {
        margin: 5px;
        color: rgb(90, 81, 81);
        font-size: 14px;
      }
      .info {
        margin: 10px 0 0 10px;
        font-size: 12px;
      }
      .check {
        color: rgb(0, 150, 236);
        font-size: 16px;
        margin-right: 3px;
      }

      .price {
        color: red;
      }
      th {
        font-size: 14px;
        text-align: center;
        padding: 7px 10px 6px 10px;
        background: #f6f6f6;
      }
      td {
        font-size: 14px;
        text-align: center;
        padding: 7px 10px 6px 10px;
      }
    }
  }
  .detailimg {
    width: 100%;
  }
}
.mutilText {
  text-align: center;
  padding-top: 200px;
}
/deep/ .el-table .el-table__header th {
  background: #f6f6f6 !important;
}
</style>
