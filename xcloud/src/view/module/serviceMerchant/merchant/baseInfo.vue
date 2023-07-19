<template>
  <div v-loading="loading">
    <el-form label-position="right" label-width="150px" :rules="formRule" :model="baseForm" ref="addmerchantform">
      <template>
        <div class="cardHeader">商品信息</div>
        <el-form-item label="商品分类" prop="type">
          <el-cascader
            style="width: 300px"
            clearable
            v-model="baseForm.type"
            :options="baseInfo.type"
            :props="{ expandTrigger: 'hover' }"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="服务名称" prop="name">
          <el-input v-model="baseForm.name" placeholder="服务名称" clearable style="width: 300px" />
        </el-form-item>
        <el-form-item label="描述" prop="productDescribe">
          <el-input
            maxlength="30"
            v-model="baseForm.productDescribe"
            placeholder="请输入描述"
            clearable
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item label="服务国家" prop="country">
          <el-select style="width: 300px" v-model="baseForm.country" filterable @change="onCountryChange">
            <el-option
              v-for="item in baseInfo.country"
              :key="item.id"
              :label="item.countryNameZh"
              :value="item.countryCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务时效" prop="serviceTimeliness">
          <el-input
            maxlength="30"
            v-model="baseForm.serviceTimeliness"
            placeholder="请输入服务时效，例如：VAT注册4-8周"
            clearable
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item label="服务内容">
          <el-checkbox-group v-model="noSkuItemForm" @change="noskuitemChange()" style="width: 450px">
            <el-checkbox v-for="t in noSkuList" :key="t.id" :label="`${t.id}-${t.attibuteTypeId}`">
              {{ t.attributeName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <div style="display: inline-block" ref="serviceCategory">
          <div v-for="(item, index) in skuTypeList" :key="index">
            <el-form-item label="服务属性">
              <el-select
                style="width: 300px"
                v-model="item.attributeTypeName"
                @change="selectService(item, index)"
                filterable
              >
                <el-option
                  v-for="pro in skuList"
                  :key="pro.id"
                  :label="pro.attributeTypeName"
                  :value="pro.attributeTypeName"
                ></el-option>
              </el-select>
              <span>
                <el-button type="success" @click="addServiceAttribute" style="margin-left: 15px">
                  <i class="icon icon-adds"></i>
                  新增服务属性
                </el-button>
                <el-button
                  icon="el-icon-delete"
                  type="danger"
                  @click.prevent="removeServivce(item, index)"
                  v-if="skuTypeList.length > 1"
                >
                  删除
                </el-button>
                <el-tooltip effect="dark" content="拖动可调整服务属性在客户端的显示顺序" placement="top">
                  <span class="service-sort">
                    <span>{{ index + 1 }}</span>
                    <i class="el-icon-sort"></i>
                  </span>
                </el-tooltip>
              </span>
              <el-checkbox-group v-model="skuItemForm[index]" @change="itemChange()">
                <el-checkbox
                  v-for="(t, key) in item.productAttributeVoList"
                  :key="key"
                  :label="`${t.attributeName}-${t.id}-${item.id}`"
                >
                  {{ t.attributeName }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </div>

        <div v-if="allCombine.length != 0">
          <el-form-item label="销售价">
            <table border="1" cellspacing="0" :style="{ 'border-color': 'white' }">
              <tr>
                <th>服务项目</th>
                <th>服务价格(元)</th>
                <th>原价</th>
                <th>最低售价(元)</th>
                <th>目标毛利率(%)</th>
                <th>指导价格区间</th>
                <th>关联商品</th>
                <th>续费商品</th>
              </tr>
              <tr v-for="(item, index) in baseForm.price" :key="index">
                <td>{{ item.fullname }}</td>
                <td>
                  <el-input-number v-model="item.sale" :step="0.1" :min="0" size="small"></el-input-number>
                </td>
                <td>
                  <el-input-number v-model="item.original" :step="0.1" :min="0" size="small"></el-input-number>
                </td>
                <td>
                  <el-input-number
                    v-model="item.minPrice"
                    :step="0.1"
                    :min="0"
                    @change="minPriceChange(item, index)"
                    size="small"
                  ></el-input-number>
                </td>
                <td>
                  <el-input-number
                    v-model="item.gpmRate"
                    :step="0.1"
                    @change="gpmRateChange(item, index)"
                    size="small"
                  ></el-input-number>
                </td>
                <td>
                  <el-input-number
                    v-model="item.rangeMinPrice"
                    :step="0.1"
                    @change="rangeMinPriceChange(item, index)"
                    size="small"
                    placeholder="最低价"
                  ></el-input-number>
                  -
                  <el-input-number
                    v-model="item.rangeMaxPrice"
                    :step="0.1"
                    @change="rangeMaxPriceChange(item, index)"
                    size="small"
                    placeholder="最高价"
                  ></el-input-number>
                </td>
                <td>
                  <el-cascader
                    clearable
                    filterable
                    v-model="item.SkuIds"
                    :options="productList"
                    :props="specify"
                    @change="productChange($event, index)"
                  ></el-cascader>
                </td>
                <td>
                  <el-cascader
                    clearable
                    filterable
                    v-model="item.renewSkuId"
                    :options="productList"
                    :props="specify"
                    @change="renewProductChange($event, index)"
                  ></el-cascader>
                </td>
              </tr>
            </table>
          </el-form-item>
        </div>

        <div v-else>
          <el-form-item label="原价">
            <el-input-number
              style="width: 300px"
              v-model="baseForm.signalOriginalPrice"
              :step="0.1"
              :min="0"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="销售价">
            <el-input-number
              style="width: 300px"
              v-model="baseForm.signalSalePrice"
              :step="0.1"
              :min="0"
            ></el-input-number>
            <div class="signalSalePrice" v-if="cateGoryItem.functionCode == 65 && enableRTrade">
              扣除：平台服务费
              <span>{{ transFeeScale }}%</span>
              ,转让费用
              <span>{{ transFeeAmount }}元</span>
              、客户所得
              <span>
                ￥{{ baseForm.signalSalePrice - (transFeeAmount + (baseForm.signalSalePrice * transFeeScale) / 100) }}元
              </span>
            </div>
          </el-form-item>
          <el-form-item label="最低售价">
            <el-input-number
              style="width: 300px"
              v-model="baseForm.baseMinPrice"
              :step="0.1"
              :min="0"
              @change="baseMinPriceChange"
            ></el-input-number>
            <span style="margin-left: 10px">
              <i class="el-icon-warning text-warning"></i>
              <span class="item-tip tips">注：手工录单时，售价不能低于此处设置的最低售价</span>
            </span>
          </el-form-item>
          <el-form-item label="指导价格区间">
            <el-input-number
              style="width: 140px"
              v-model="baseForm.baseRangeMinPrice"
              :step="0.1"
              :max="baseForm.baseRangeMaxPrice ? baseForm.baseRangeMaxPrice : Infinity"
              :controls="false"
              @change="baseRangeMinPriceChange"
              placeholder="请输入最低价"
            ></el-input-number>
            —
            <el-input-number
              style="width: 140px"
              v-model="baseForm.baseRangeMaxPrice"
              :step="0.1"
              :controls="false"
              @change="baseRangeMaxPriceChange"
              placeholder="请输入最高价"
            ></el-input-number>
            <span style="margin-left: 10px">
              <i class="el-icon-warning text-warning"></i>
              <span class="item-tip tips">注：手工录单时，提示销售可录入的价格区间</span>
            </span>
          </el-form-item>
          <el-form-item label="目标毛利率">
            <el-input-number
              style="width: 300px"
              v-model="baseForm.baseGpmRate"
              :step="0.1"
              @change="baseGpmRateChange"
            ></el-input-number>
            <span style="margin-left: 10px">%</span>
          </el-form-item>
          <el-form-item label="关联商品">
            <el-cascader
              style="width: 300px"
              clearable
              filterable
              v-model="baseJoinSkuIds"
              :options="productList"
              :props="specify"
              @change="productHandleChange"
            ></el-cascader>
            <span style="margin-left: 10px">
              <i class="el-icon-warning text-warning"></i>
              <span class="item-tip tips">注：关联选择 使用证据和海牙认证</span>
            </span>
          </el-form-item>
          <el-form-item label="续费商品">
            <el-cascader
              style="width: 300px"
              clearable
              filterable
              v-model="renewSkuIds"
              :options="productList"
              :props="specify"
              @change="renewProductHandleChange"
            ></el-cascader>
            <!-- <span style="margin-left:10px">
              <i class="el-icon-warning text-warning"></i>
              <span class="tips">注：关联选择 使用证据和海牙认证</span></span> -->
          </el-form-item>
        </div>

        <el-form-item label="排序">
          <el-input-number
            style="width: 300px"
            v-model="baseForm.order"
            :step="1"
            :step-strictly="true"
            :min="0"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="单位" prop="unit">
          <el-select style="width: 300px" v-model="baseForm.unit" clearable filterable>
            <el-option v-for="item in baseInfo.unit" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="币别" prop="currency">
          <el-select style="width: 300px" v-model="baseForm.currency" clearable filterable>
            <el-option v-for="(item,index) in baseInfo.currency" :key="index" :label="`${item.label}(${item.value})`" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="销售端" prop="target">
          <el-checkbox-group v-model="baseForm.target">
            <el-checkbox v-for="item in baseInfo.target" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="状态" prop="state">
          <el-select style="width: 300px" v-model="baseForm.state" clearable filterable>
            <el-option v-for="item in baseInfo.state" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </template>

      <!-- R标专有 -->
      <template v-if="cateGoryItem.functionCode == 65">
        <!-- <template> -->
        <!-- 商标资料 -->
        <template>
          <div class="cardHeader">商标资料</div>
          <el-form-item label="商标结构" prop="trademarkInfo.trademarkStructure">
            <el-radio-group v-model="baseForm.trademarkInfo.trademarkStructure">
              <el-radio :label="1">纯文字</el-radio>
              <el-radio :label="2">黑白图形</el-radio>
              <el-radio :label="3">彩色图形</el-radio>
              <el-radio :label="4">文字+黑白图形</el-radio>
              <el-radio :label="5">文字+彩色图形</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="[2, 3].indexOf(baseForm.trademarkInfo.trademarkStructure) < 0"
            label="商标名称"
            prop="trademarkInfo.trademarkName"
          >
            <el-input
              v-model="baseForm.trademarkInfo.trademarkName"
              placeholder="请输入商标名称"
              maxlength="70"
              show-word-limit
              clearable
              style="width: 300px"
            />
            <div class="subTips">注意：注册范围以及商标名称近似，官方将视为同一商标进行转出，且类别无法单独售卖</div>
          </el-form-item>
          <el-form-item label="商标样图" prop="trademarkInfo.trademarkImage">
            <UploadImage
              ref="uploadImageRef"
              :imageUrl="baseForm.trademarkInfo.trademarkImage"
              :imgType="1"
              :on-success="(v) => (baseForm.trademarkInfo.trademarkImage = v.file.fileUrl)"
              upload-tips="上传图片"
              :imgMaxSize="3"
              :accept="'.jpg'"
              :ruleType="['image/jpeg', 'image/jpg']"
            ></UploadImage>
            <div class="subTips">建议尺寸: 700*656像素,支持JPG格式，大小不可超过3MB</div>
          </el-form-item>
          <el-form-item label="商标注册号" prop="trademarkInfo.trademarkRegisteredNo">
            <el-input
              v-model="baseForm.trademarkInfo.trademarkRegisteredNo"
              placeholder="请输入商标注册号"
              maxlength="70"
              show-word-limit
              clearable
              style="width: 300px"
            />
          </el-form-item>
          <el-form-item label="注册人信息" prop="trademarkInfo.trademarkRegisterInfo">
            <el-input
              v-model="baseForm.trademarkInfo.trademarkRegisterInfo"
              placeholder="请输入商标注册人或主体名称"
              maxlength="70"
              show-word-limit
              clearable
              style="width: 300px"
            />
          </el-form-item>
          <el-form-item label="商标类别" prop="trademarkInfo.categoryIds">
            <el-select style="width: 300px" v-model="baseForm.trademarkInfo.categoryIds" multiple filterable>
              <el-option
                v-for="item in tradeMarkCateGories"
                :key="item.id"
                :label="item.categoryName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商标有效期" prop="effectTime">
            <el-date-picker
              v-model="time"
              type="daterange"
              align="right"
              size="small"
              clearable
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              style="width: 300px"
              :default-time="['00:00:00', '23:59:59']"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="证书注册种类" prop="trademarkInfo.certificateRegType">
            <el-input
              v-model="baseForm.trademarkInfo.certificateRegType"
              type="textarea"
              style="width: 80%"
              :rows="2"
              maxlength="999"
              show-word-limit
              placeholder="请输入证书原件注册范围（限999字符）"
            ></el-input>
          </el-form-item>
          <el-form-item label="参考用途" prop="trademarkInfo.referenceUse">
            <el-input
              v-model="baseForm.trademarkInfo.referenceUse"
              type="textarea"
              style="width: 80%"
              :rows="2"
              maxlength="999"
              show-word-limit
              placeholder="请输入证书原件注册范围中文转译（限999字符）"
            ></el-input>
            <div>
              推荐使用翻译工具
              <a style="color: #2977fe" href="https://fanyi.sogou.com/" target="_blank">https://fanyi.sogou.com/</a>
            </div>
          </el-form-item>
        </template>
        <!-- 商标基本情况 -->
        <template>
          <div class="cardHeader">商标基本情况</div>
          <el-form-item label="亚马逊备案史" prop="trademarkInfo.amazoneFilingHis">
            <el-radio-group v-model="baseForm.trademarkInfo.amazoneFilingHis">
              <el-radio :label="1">有备案史</el-radio>
              <el-radio :label="0">无备案史</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="其他电商平台备案史" prop="trademarkInfo.platformFilingHis">
            <el-radio-group v-model="baseForm.trademarkInfo.platformFilingHis">
              <el-radio :label="1">有备案史</el-radio>
              <el-radio :label="0">无备案史</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="授权他人使用" prop="trademarkInfo.authOtherUseHis">
            <el-radio-group v-model="baseForm.trademarkInfo.authOtherUseHis">
              <el-radio :label="1">无授权记录</el-radio>
              <el-radio :label="0">有授权记录</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
        <!-- 其他内容 -->
        <template>
          <div class="cardHeader">其他内容</div>
          <el-form-item label="品牌释意" prop="trademarkInfo.brandInterpretation">
            <el-input
              v-model="baseForm.trademarkInfo.brandInterpretation"
              type="textarea"
              style="width: 80%"
              :rows="2"
              maxlength="250"
              show-word-limit
              placeholder="为更快帮您找到满意买家，可以进行商标设计的构想说明哦~（限制250字符）"
            ></el-input>
          </el-form-item>
          <el-form-item label="注册国家优势" prop="trademarkInfo.regNationalAdvantages">
            <el-input
              v-model="baseForm.trademarkInfo.regNationalAdvantages"
              type="textarea"
              style="width: 80%"
              :rows="2"
              maxlength="250"
              show-word-limit
              placeholder="为更快帮您找到满意买家，可以简单描述商标在该国的优势哦~（限制250字符）"
            ></el-input>
          </el-form-item>
        </template>
        <!-- 卖家资料信息 -->
        <template>
          <div class="cardHeader">卖家资料信息</div>
          <el-form-item label="">
            <el-table :data="users" style="width: 80%; marginbottom: 10px">
              <el-table-column label="用户信息">
                <template slot-scope="scope">
                  <el-input v-model="baseForm.sellerInfo.sellerMobile" clearable placeholder="">
                    <span slot="append" class="searchBtn" size="mini" @click="searchUser()">查找</span>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="mobile" label="用户手机号"></el-table-column>
              <el-table-column prop="nickname" label="用户昵称"></el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="转让人类型" prop="sellerInfo.transferorType">
            <el-radio-group v-model="baseForm.sellerInfo.transferorType">
              <el-radio :label="1">公司</el-radio>
              <el-radio :label="2">个人</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="baseForm.sellerInfo.transferorType == 1">
            <!-- 公司 -->
            <el-form-item label="公司名称" prop="sellerInfo.companyName" key="1.1">
              <el-input
                v-model="baseForm.sellerInfo.companyName"
                placeholder="请输入公司名称"
                clearable
                style="width: 300px"
              />
            </el-form-item>
            <el-form-item label="法定代表人" prop="sellerInfo.companyLegalPerson" key="1.2">
              <el-input
                v-model="baseForm.sellerInfo.companyLegalPerson"
                placeholder="请输入法定代表人"
                clearable
                style="width: 300px"
              />
            </el-form-item>
            <el-form-item label="国家" prop="sellerInfo.countryCode" key="1.3">
              <el-select style="width: 300px" v-model="baseForm.sellerInfo.countryCode" filterable>
                <el-option
                  v-for="item in baseInfo.country"
                  :key="item.id"
                  :label="item.countryNameZh"
                  :value="item.countryCode"
                ></el-option>
              </el-select>
            </el-form-item>
            <template v-if="baseForm.sellerInfo.countryCode == 'CN'">
              <el-form-item label="联系地址" key="2.4" prop="provinceName">
                <div class="one-line-item">
                  <el-select
                    style="width: 168px; margin-right: 10px"
                    v-model="companyInfo.provinceName"
                    placeholder="省"
                    filterable
                    @change="provinceChange"
                  >
                    <el-option
                      :value="province.id"
                      :label="province.name"
                      v-for="province in provinceList"
                      :key="province.id"
                    ></el-option>
                  </el-select>
                  <el-select
                    style="width: 168px; margin-right: 10px"
                    v-model="companyInfo.cityName"
                    placeholder="市"
                    filterable
                    @change="cityChange"
                  >
                    <el-option :value="city.id" :label="city.name" v-for="city in cityList" :key="city.id"></el-option>
                  </el-select>
                  <!-- <el-select
                    style="width: 168px"
                    v-model="companyInfo.areaName"
                    placeholder="区县"
                    filterable
                  >
                    <el-option :value="area.id" :label="area.name" v-for="area in areaList" :key="area.id"></el-option>
                  </el-select> -->
                </div>
                <div>
                  <el-input
                    v-model="baseForm.sellerInfo.addressDetail"
                    style="width: 525px; margin-top: 10px"
                    placeholder="请输出详细地址"
                  />
                </div>
              </el-form-item>
            </template>
            <template v-if="baseForm.sellerInfo.countryCode != 'CN'">
              <el-form-item label="联系地址" prop="sellerInfo.trademarkName" key="1.4">
                <el-input
                  v-model="baseForm.sellerInfo.stateAreaInfo"
                  placeholder="请输入州市信息"
                  clearable
                  style="width: 300px"
                />
                <el-input
                  v-model="baseForm.sellerInfo.addressDetail"
                  placeholder="请输入详细地址"
                  clearable
                  style="width: 300px"
                />
              </el-form-item>
            </template>
            <el-form-item label="邮箱/微信" prop="sellerInfo.emailWechat" key="1.5">
              <el-input
                v-model="baseForm.sellerInfo.emailWechat"
                placeholder="请输入联系邮箱或微信号"
                clearable
                style="width: 300px"
              />
            </el-form-item>
            <el-form-item label="公司营业执照" prop="sellerInfo.companyLicense" key="1.6">
              <UploadImage
                ref="uploadImageRef"
                :imageUrl="baseForm.sellerInfo.companyLicense"
                :imgType="1"
                :on-success="(v) => (baseForm.sellerInfo.companyLicense = v.file.fileUrl)"
                upload-tips="上传图片"
                :imgMaxSize="20"
                :accept="'.jpg, .png, .bmp'"
                :ruleType="['image/png', 'image/jpg', 'image/jpeg', 'image/bmp']"
              ></UploadImage>
              <div class="subTips">请保证执照信息清晰可见，文件小于20M，支持jpg、png或bmp格式的图片</div>
            </el-form-item>
          </template>
          <template v-if="baseForm.sellerInfo.transferorType == 2">
            <!-- 个人 -->
            <el-form-item label="姓名" prop="sellerInfo.transferorName" key="2.1">
              <el-input
                v-model="baseForm.sellerInfo.transferorName"
                placeholder="请输入姓名"
                clearable
                style="width: 300px"
              />
            </el-form-item>
            <el-form-item label="身份证号码" prop="sellerInfo.identityNumber" key="2.2">
              <el-input
                v-model="baseForm.sellerInfo.identityNumber"
                placeholder="请输入身份证号码"
                clearable
                style="width: 300px"
              />
            </el-form-item>
            <el-form-item label="国家" prop="countryName" key="2.3">
              <!-- <el-select style="width: 300px"  v-model="countryCode" filterable>
                <el-option
                  v-for="item in baseInfo.country"
                  :key="item.id"
                  :label="item.countryNameZh"
                  :value="item.countryCode"
                ></el-option>
              </el-select> -->
              <el-select
                style="width: 168px; margin-right: 10px"
                v-model="companyInfo.countryName"
                placeholder="请选择"
                filterable
                @change="countryChange"
              >
                <el-option
                  :value="country.id"
                  :label="country.name"
                  v-for="country in countryList"
                  :key="country.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <template v-if="companyInfo.countryName == 1">
              <el-form-item label="联系地址" key="2.4" prop="provinceName">
                <div class="one-line-item">
                  <el-select
                    style="width: 168px; margin-right: 10px"
                    v-model="companyInfo.provinceName"
                    placeholder="省"
                    filterable
                    @change="provinceChange"
                  >
                    <el-option
                      :value="province.id"
                      :label="province.name"
                      v-for="province in provinceList"
                      :key="province.id"
                    ></el-option>
                  </el-select>
                  <el-select
                    style="width: 168px; margin-right: 10px"
                    v-model="companyInfo.cityName"
                    placeholder="市"
                    filterable
                    @change="cityChange"
                  >
                    <el-option :value="city.id" :label="city.name" v-for="city in cityList" :key="city.id"></el-option>
                  </el-select>
                  <!-- <el-select
                    style="width: 168px"
                    v-model="companyInfo.areaName"
                    placeholder="区县"
                    filterable
                  >
                    <el-option :value="area.id" :label="area.name" v-for="area in areaList" :key="area.id"></el-option>
                  </el-select> -->
                </div>
                <div>
                  <el-input
                    v-model="baseForm.sellerInfo.addressDetail"
                    style="width: 525px; margin-top: 10px"
                    placeholder="请输出详细地址"
                  />
                </div>
              </el-form-item>
            </template>
            <template v-if="companyInfo.countryName != 1">
              <el-form-item label="联系地址" prop="sellerInfo.trademarkName" key="1.4">
                <el-input
                  v-model="baseForm.sellerInfo.stateAreaInfo"
                  placeholder="请输入州市信息"
                  clearable
                  style="width: 300px"
                />
                <el-input
                  v-model="baseForm.sellerInfo.addressDetail"
                  placeholder="请输入详细地址"
                  clearable
                  style="width: 300px"
                />
              </el-form-item>
            </template>
            <el-form-item label="邮箱/微信" prop="sellerInfo.emailWechat" key="1.5">
              <el-input
                v-model="baseForm.sellerInfo.emailWechat"
                placeholder="请输入联系邮箱或微信号"
                clearable
                style="width: 300px"
              />
            </el-form-item>
            <div class="imgbox">
              <div class="userImgs">
                <el-form-item label="身份证人像面" prop="sellerInfo.identityCardFront" key="2.5">
                  <UploadImage
                    ref="uploadImageRef"
                    :imageUrl="baseForm.sellerInfo.identityCardFront"
                    :imgType="1"
                    :on-success="(v) => (baseForm.sellerInfo.identityCardFront = v.file.fileUrl)"
                    upload-tips="上传图片"
                    :imgMaxSize="20"
                    :accept="'.jpg, .png, .bmp'"
                    :ruleType="['image/png', 'image/jpg', 'image/jpeg', 'image/bmp']"
                  ></UploadImage>
                </el-form-item>
                <el-form-item label="身份证国徽面" prop="sellerInfo.identityCardReverse" key="2.6">
                  <UploadImage
                    ref="uploadImageRef"
                    :imageUrl="baseForm.sellerInfo.identityCardReverse"
                    :imgType="1"
                    :on-success="(v) => (baseForm.sellerInfo.identityCardReverse = v.file.fileUrl)"
                    upload-tips="上传图片"
                    :imgMaxSize="20"
                    :accept="'.jpg, .png, .bmp'"
                    :ruleType="['image/png', 'image/jpg', 'image/jpeg', 'image/bmp']"
                  ></UploadImage>
                </el-form-item>
              </div>
              <div class="subTips" style="marginleft: 150px; margintop: -10px; marginbottom: 20px">
                请保持身份证上文字信息清晰，文件小于20M，支持jpg、png或bmp格式的图片
              </div>
            </div>
          </template>
        </template>
      </template>

      <!-- 操作 -->
      <el-form-item>
        <el-button type="primary" @click="commitNextStep(baseInfo.to)" v-show="hasAuthority('D1_7')">
          {{ baseInfo.to == 3 ? '提交' : '下一步' }}
        </el-button>
        <el-button type="cancel" @click="commitNextStep(baseInfo.from)"> 取消 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Sortable from 'sortablejs';
import { getList } from '@/api/newApi/customer/customerInfo.js';
import { getTradeMarkCateGory } from '@/api/newApi/servicemerchant/trademark.js';
import UploadImage from '@/components/UploadImage/index.vue';
import { getcategoryAndValue, relationProduct } from '@/api/newApi/servicemerchant/serviceMerchant.js';
import { getWorldCountryListByLevel, getWorldCountryListByPid } from '@/api/newApi/customer/companyInfo';

export default {
  props: {
    baseForm: {
      type: Object,
    },
    baseInfo: {
      type: Object,
    },
    skuListIds: {
      type: Array,
    },
    skuItemList: {
      type: Array,
    },
    allCateGories: {
      type: Array,
    },
  },
  components: {
    UploadImage,
  },
  data() {
    return {
      companyInfo: {
        countryName: '',
        provinceName: '',
        cityName: '',
        // areaName: '',
        addressDetail: '',
      },
      transferorType: 2,
      tableData: [{ id: 1 }],
      functionCode: 65,
      baseJoinSkuIds: null,
      renewSkuIds: null,
      specify: {
        expandTrigger: 'hover',
        emitPath: false,
      },
      time: '',
      tradeMarkCateGories: [], //商标分类
      cateGoryItem: {}, //所选择的分类项
      users: [{ id: 1 }], //查询到的用户
      formRule: {
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        unit: [{ required: true, message: '请选择单位', trigger: 'blur' }],
        currency: [{ required: true, message: '请选择币别', trigger: 'blur' }],
        target: [{ required: true, message: '请选择销售端', trigger: 'blur' }],
        state: [{ required: true, message: '请选择状态', trigger: 'blur' }],
        country: [{ required: true, message: '请选择国家', trigger: 'change' }],
        // R标信息
        'trademarkInfo.trademarkStructure': [{ required: true, message: '请选择商标资料', trigger: 'change' }],
        'trademarkInfo.trademarkName': [{ required: true, message: '请填写商标名称', trigger: 'blur' }],
        'trademarkInfo.trademarkRegisteredNo': [{ required: true, message: '请填写商标注册号', trigger: 'blur' }],
        'trademarkInfo.trademarkImage': [{ required: true, message: '请上传商标样图', trigger: 'change' }],
        'trademarkInfo.trademarkRegisterInfo': [{ required: true, message: '请填写注册人信息', trigger: 'blur' }],
        'trademarkInfo.categoryIds': [{ required: true, message: '请选择商标类别', trigger: 'change' }],
        effectTime: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.baseForm.trademarkInfo.trademarkEffectTime && this.baseForm.trademarkInfo.trademarkInvalidTime) {
                callback();
              } else {
                callback(new Error('请选择商标有效期'));
              }
            },
            trigger: 'change',
          },
        ],
        'trademarkInfo.certificateRegType': [{ required: true, message: '请填写证书注册种类', trigger: 'blur' }],
        'trademarkInfo.referenceUse': [{ required: true, message: '请填写参考用途', trigger: 'blur' }],
        'trademarkInfo.amazoneFilingHis': [{ required: true, message: '请选择亚马逊备案史', trigger: 'change' }],
        'trademarkInfo.platformFilingHis': [{ required: true, message: '请选择其他电商平台备案史', trigger: 'change' }],
        'trademarkInfo.authOtherUseHis': [{ required: true, message: '请选择授权他人使用', trigger: 'change' }],
        // 卖家信息
        'sellerInfo.transferorType': [{ required: true, message: '请选择转让人类型', trigger: 'change' }],
        'sellerInfo.authOtherUseHis': [{ required: true, message: '请选择授权他人使用', trigger: 'change' }],
        'sellerInfo.companyName': [{ required: true, message: '请填写公司名称', trigger: 'change' }],
        'sellerInfo.companyLegalPerson': [{ required: true, message: '请填写法定代表人', trigger: 'change' }],
        'sellerInfo.countryCode': [{ required: true, message: '请选择国家', trigger: 'change' }],
        'sellerInfo.trademarkName': [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.baseForm.sellerInfo.stateAreaInfo && this.baseForm.sellerInfo.addressDetail) {
                callback();
              } else {
                callback(new Error('请输入联系地址'));
              }
            },
            trigger: 'change',
          },
        ],
        'sellerInfo.stateAreaInfo': [{ required: true, message: '请输入州市信息', trigger: 'change' }],
        'sellerInfo.addressDetail': [{ required: true, message: '请输入详细地址', trigger: 'change' }],
        'sellerInfo.transferorName': [{ required: true, message: '请输入姓名', trigger: 'change' }],
        countryName: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.companyInfo.countryName) {
                callback();
              } else {
                callback(new Error('请选择国家'));
              }
            },
            trigger: 'change',
          },
        ],
        provinceName: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (
                this.companyInfo.provinceName &&
                this.companyInfo.cityName &&
                this.baseForm.sellerInfo.addressDetail
              ) {
                callback();
              } else {
                callback(new Error('请选择省市地址及详细地址'));
              }
            },
            trigger: 'change',
          },
        ],
      },

      noSkuList: [],
      noSkuItemForm: [],
      skuList: [],
      skuTypeList: [
        {
          attributeTypeName: '',
          productAttributeVoList: [],
        },
      ],
      skuItemForm: [],
      allCombine: [],
      loading: false,
      servicelist: [],
      productList: [],
      // 国家省市区县
      countryList: [],
      provinceList: [],
      cityList: [],
      areaList: [],
      enableRTrade: 0,
      transFeeScale: "",
      transFeeAmount: "",
    };
  },
  watch: {
    "baseForm.target": function (newval) {
      if (newval.length == 1 && newval.indexOf(2) != -1) {
        this.baseInfo.to = 2;
      } else if (newval.length == 1 && newval.indexOf(3) != -1) {
        this.baseInfo.to = 3;
      } else {
        this.baseInfo.to = 1;
      }
    },
    "baseForm.sellerInfo.countryCode": function (val) {
      if (val == "CN") {
        this.countryChange(1);
      }
    },
    "baseForm.sellerInfo.transferorType": function (val) {
      this.companyInfo.provinceName = "";
      this.companyInfo.cityName = "";
      this.baseForm.sellerInfo.stateAreaInfo = "";
      this.baseForm.sellerInfo.addressDetail = "";
      this.baseForm.sellerInfo.countryCode = "";
      this.companyInfo.countryName = "";
      this.baseForm.sellerInfo.emailWechat = "";
    },
    time(val) {
      [this.baseForm.trademarkInfo.trademarkEffectTime, this.baseForm.trademarkInfo.trademarkInvalidTime] =
        val && val.length ? val : ["", ""];
    },
  },
  mounted() {
    // 获取商标分类
    this.getTradeMarkCateGoryList();
    this.getCountryList();
    //编辑时回调
    if (this.baseForm.id != '') {
      // 回显处理
      this.fileinfo();
      this._getcategoryAndValue();
    }
    if (this.baseForm.target.length == 1 && this.baseForm.target.indexOf(2) != -1) {
      this.baseInfo.to = 2;
    } else if (this.baseForm.target.length == 1 && this.baseForm.target.indexOf(3) != -1) {
      this.baseInfo.to = 3;
    } else {
      this.baseInfo.to = 1;
    }
    this.getRelationProduct();
    this.initServiceSkuSort();
  },
  methods: {
    initServiceSkuSort() {
      Sortable.create(this.$refs.serviceCategory, {
        handle: '.service-sort',
        onEnd: ({ oldIndex, newIndex }) => {
          if (newIndex > this.skuItemForm.length - 1 || oldIndex > this.skuItemForm.length) {
            return;
          }
          let skuItem = this.skuItemForm.splice(oldIndex, 1)[0];
          this.skuItemForm.splice(newIndex, 0, skuItem);
          let skuType = this.skuTypeList.splice(oldIndex, 1)[0];
          this.skuTypeList.splice(newIndex, 0, skuType);
          let temp = [...this.skuTypeList];
          this.skuTypeList = [];
          this.$nextTick(() => {
            this.skuTypeList = [...temp];
          });
          this.itemChange();
        },
      });
    },
    onCountryChange(e) {
      let list = this.baseInfo.country;
      let countryItem = list.filter((item) => item.countryCode == e)[0];
      if (countryItem && countryItem.enableRTrade) {
        this.enableRTrade = countryItem.enableRTrade;
        this.transFeeScale = countryItem.transFeeScale;
        this.transFeeAmount = countryItem.transFeeAmount;
      } else {
        if (this.cateGoryItem.functionCode == 65) {
          this.enableRTrade = countryItem.enableRTrade;
          this.$message.warning('该国家暂未开启R标交易,请先进行配置！');
        }
      }
    },
    async dealCPArea() {
      await this.getCountryList();
      // 回填国家
      await this.filCPAreaInfo(this.baseForm.sellerInfo.countryId, 'province');
      // 回填省
      await this.filCPAreaInfo(this.baseForm.sellerInfo.provinceId, 'city');
      // 回填市
      await this.filCPAreaInfo(this.baseForm.sellerInfo.cityId, 'area');
    },
    filCPAreaInfo(pid, type) {
      // 获取省市列表
      return new Promise((resolve) => {
        getWorldCountryListByPid({
          pid,
        }).then((res) => {
          if (type === 'province') {
            this.provinceList = res.data;
            this.baseForm.sellerInfo.countryId = pid;
            this.companyInfo.countryName = this.countryList.filter((item) => item.id == pid)[0].name;
          } else if (type === 'city') {
            this.cityList = res.data;
            this.baseForm.sellerInfo.provinceId = pid;
            this.companyInfo.provinceName = this.provinceList.filter((item) => item.id == pid)[0].name;
          } else {
            this.areaList = res.data;
            this.baseForm.sellerInfo.cityId = pid;
            this.companyInfo.cityName = this.cityList.filter((item) => item.id == pid)[0].name;
          }
          resolve(res.data);
        });
      });
    },
    fileinfo() {
      // 类型筛出R标表单 functionCode == 65
      this.dealCateGory(this.baseForm.type, this.allCateGories);
      // 国家筛出手续费用
      this.onCountryChange(this.baseForm.country);
      // 回显国家省市信息
      if (this.baseForm.sellerInfo && this.baseForm.sellerInfo.countryId) {
        this.dealCPArea();
      }
    },
    getTradeMarkCateGoryList() {
      getTradeMarkCateGory({
        limit: 999,
        page: 1,
      }).then((res) => {
        this.tradeMarkCateGories = res.data.records;
      });
    },
    getUser(mobile) {
      getList({
        pageIndex: 1,
        pageSize: 999,
        type: 0,
        mobile,
        status: 1,
        needsMenuid: true,
      }).then((res) => {
        if (res.data.records && res.data.records.length) {
          this.users = res.data.records;
          this.baseForm.sellerInfo.userId = res.data.records[0].userId;
        } else {
          this.$message.warning('暂未查询到用户');
        }
      });
    },
    //获取关联商品
    getRelationProduct() {
      relationProduct()
        .then((res) => {
          if (res.code == 0) {
            this.productList = this.getCategory(res.data);
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    /**
     * 递归格式化所有商品类目和属性
     */

    getCategory(arr) {
      let options = [];
      arr.map((item) => {
        let parentObj = {
          children: [],
        };
        const t = item.productSkuVOList;
        parentObj.label = item.productName;
        //普通sku属性
        if (t.length == 1 && t[0].skuName == '') {
          parentObj.children = undefined;
          parentObj.value = t[0].skuId;
        } else {
          item.productSkuVOList.map((pro) => {
            parentObj.children.push({
              label: pro.skuName,
              value: pro.skuId,
            });
          });
        }
        options.push(parentObj);
      });
      return options;
    },
    // 普通sku关联商品时 处理格式
    productHandleChange(value) {
      if (value) {
        this.baseForm.baseJoinSkuIds = [value];
      } else {
        this.baseForm.baseJoinSkuIds = [];
      }
    },
    //sku关联商品格式处理
    productChange(value, index) {
      if (value) {
        this.baseForm.price[index].joinSkuIds = [value];
      } else {
        this.baseForm.price[index].joinSkuIds = [];
      }
    },
    // 普通sku续费商品时 处理格式
    renewProductHandleChange(value) {
      if (value) {
        this.baseForm.renewSkuId = value;
      } else {
        this.baseForm.renewSkuId = '';
      }
    },
    // sku续费商品格式处理
    renewProductChange(value, index) {
      if (value) {
        this.baseForm.price[index].renewSkuId = value;
      } else {
        this.baseForm.price[index].renewSkuId = '';
      }
    },
    //点击商品分类获取类目
    handleChange(value) {
      if (value) {
        const { allCateGories } = this;
        this.dealCateGory(value, allCateGories);
      }
      this._getcategoryAndValue(value);
    },
    dealCateGory(value, allCateGories) {
      if (!value.length) {
        this.cateGoryItem = {};
        this.baseForm.functionCode = "";
      } else {
        this.cateGoryItem = allCateGories
          .filter((item) => item.id === value[0])[0]
          .childrenProductCategoryVo.filter((it) => it.id == value[1])[0];
        this.baseForm.functionCode = this.cateGoryItem.functionCode;
      }
      if (this.baseForm.country) {
        this.onCountryChange(this.baseForm.country);
      }
    },
    //动态添加服务属性
    addServiceAttribute() {
      this.skuTypeList.push({
        attributeTypeName: '',
        productAttributeVoList: [],
      });
    },
    //动态删除服务属性
    removeServivce(item, index) {
      if (index !== -1) {
        this.skuTypeList.splice(index, 1);
        this.skuItemForm.splice(index, 1);
        if (!this.skuItemForm.length) {
          this.skuItemForm = [[]];
        }
      }
      this.itemChange();
    },
    selectService(item, index) {
      // this.$set(this.skuItemForm, index, []);
      this.skuItemForm[index] = [];
      this.itemChange();
      this.servicelist.map((pro) => {
        if (pro.attributeTypeName == item.attributeTypeName) {
          item.productAttributeVoList = pro.productAttributeVoList;
          item.id = pro.id;
        }
      });
    },
    _getcategoryAndValue(vv) {
      this.noSkuList = [];
      this.skuList = [];
      this.loading = true;
      let params = {
        productCategoryId: this.baseForm.type[this.baseForm.type.length - 1],
      };
      getcategoryAndValue(params)
        .then((res) => {
          if (res.code == 0) {
            this.servicelist = res.data;
            res.data.forEach((item) => {
              if (item.attributeType == 1) {
                //普通属性
                // this.noSkuList.unshift({
                //   attributeTypeName: item.attributeTypeName,
                //   id: item.id,
                //   productAttributeVoList: item.productAttributeVoList
                // });
                item.productAttributeVoList.map((pro) => {
                  this.noSkuList.unshift(pro);
                });
              } else if (item.attributeType == 2) {
                //sku属性
                this.skuList.push({
                  attributeTypeName: item.attributeTypeName,
                  id: item.id,
                  productAttributeVoList: item.productAttributeVoList,
                });
              }
            });
            this.$nextTick(() => {
              this.skuItemForm = this.skuItemList;
            });
          }
          //初始化每个属性族的v-model数组
          if (!this.baseForm.id) {
            //新增 注意sku属性是二维的 非sku是一维的
            this.skuItemForm = this.skuTypeList.map(() => {
              return [];
            });
          } else {
            //修改
            this.noSkuItemForm = vv ? [] : this.baseForm.content;
            this.noskuitemChange();
            if (this.baseForm.item[0] != '') {
              this.skuItemForm = [this.baseForm.item];
              this.showproduct(); //sku列表回显
            } else {
              try {
                this.baseForm.price[0].joinSkuIds != '' ? JSON.parse(this.baseForm.price[0].joinSkuIds)[0] : [];
              } catch (error) {}
            }
            const newList = [];
            if (this.baseForm.list.length > 0) {
              if (this.baseForm.list[0] == '') {
                this.baseJoinSkuIds = JSON.parse(this.baseForm.price[0].joinSkuIds)[0];
                this.renewSkuIds = this.baseForm.price[0].renewSkuId;
                this.baseForm.baseJoinSkuIds = JSON.parse(this.baseForm.price[0].joinSkuIds);
                this.baseForm.renewSkuId = this.baseForm.price[0].renewSkuId;
              }

              this.baseForm.list.length &&
                this.baseForm.list[0].forEach((item) => {
                  let service = this.servicelist.find((pro) => pro.id === item.productAttributeCategoryId);
                  if (service) {
                    newList.push({
                      productAttributeVoList: service.productAttributeVoList,
                      attributeTypeName: service.attributeTypeName,
                      id: service.id,
                    });
                  }
                });
              for (var i = 0; i < newList.length; i++) {
                for (var j = newList.length - 1; j > 0; j--) {
                  if (newList[i].id == newList[j].id && i != j) {
                    newList.splice(j, 1);
                  }
                }
              }
              this.$nextTick(() => {
                this.skuTypeList = newList;
              });
            }

            //传过来的数据和返回给后端的数据格式不一样 这里调一下函数整理一下给后端的数据格式
          }
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },

    showproduct() {
      this.allCombine = this.getAllCombine();
      let priceList = [];
      this.baseForm.price.map((item) => {
        let newlist = [];
        item.list.map((p) => {
          newlist.push({
            productAttributeCategoryId: p.productAttributeCategoryId,
            productAttributeId: p.productAttributeId,
          });
        });
        let skuName = item.fullname
          .map((name) => {
            return name;
          })
          .join('-');
        priceList.push({
          original: item.original,
          sale: item.sale,
          fullname: skuName,
          list: newlist,
          skuId: item.skuId,
          joinSkuIds: JSON.parse(item.joinSkuIds),
          SkuIds: JSON.parse(item.joinSkuIds)[0],
          renewSkuId: item.renewSkuId,
          gpmRate: item.gpmRate,
          minPrice: item.minPrice,
          rangeMaxPrice: item.rangeMaxPrice,
          rangeMinPrice: item.rangeMinPrice,
        });
      });
      this.baseForm.price = priceList;
    },

    /****
     * 递归获取商品属性名和id (理论上sku属性和非sku属性都要做 暂时只取sku)
     * itemnameArr是当层数足够深时获取整个链路的名称或者id 暂时不用
     * 因为可能会无线扩展才递归获取 后端数据暂时只做了一层*/
    getTypeList(arr, /*itemnameArr,*/ itemArr) {
      arr.map((res) => {
        if (itemArr.length == 0) {
          this.skuTypeList.push({
            id: res.id,
            attributeTypeName: res.attributeTypeName,
            productAttributeVoList: [],
          });
        }
        // itemnameArr.push(res.name);
        itemArr.push({
          id: res.id,
          attributeName: res.attributeName,
        });

        if (!res.productAttributeVoList || res.productAttributeVoList.length == 0) {
          // const typeFullName = [].concat(itemnameArr);
          const typeData = Object.assign({}, itemArr[itemArr.length - 1]);
          this.skuTypeList[this.skuTypeList.length - 1].productAttributeVoList.push(typeData);
          // itemnameArr.pop();
          itemArr.pop();
        } else {
          this.getTypeList(res.productAttributeVoList, /*itemnameArr,*/ itemArr);
        }
      });
      // itemnameArr.pop();
      itemArr.pop();
    },

    //获取sku选中后所有的组合
    getAllCombine() {
      // if (chunks.length > 1) {
      //   chunks = chunks.filter(item => item.length);
      // }
      let chunks = [...this.skuItemForm];
      if (chunks.some((item) => !item || (item && !item.length))) {
        return [];
      }
      let res = [];
      let helper = function (chunkIndex, prev) {
        let chunk = chunks[chunkIndex];
        let isLast = chunkIndex === chunks.length - 1;
        for (let val of chunk) {
          const str = val.replace(/,/g, '-');
          const valArr = String.prototype.split.call(str, '-');
          let cur = prev.concat({
            name: valArr[0],
            productAttributeId: valArr[1],
            productAttributeCategoryId: valArr[2],
          });
          if (isLast) {
            // 如果已经处理到数组的最后一项了 则把拼接的结果放入返回值中
            res.push(cur);
          } else {
            helper(chunkIndex + 1, cur);
          }
        }
      };

      // 从属性数组下标为 0 开始处理
      // 并且此时的 prev 是个空数组
      helper(0, []);

      return res;
    },
    // 普通属性
    noskuitemChange() {
      let initNoSkuItem = this.noSkuItemForm.map((val) => {
        const valArr = String.prototype.split.call(val, '-');
        return {
          productAttributeId: valArr[0],
          productAttributeCategoryId: valArr[1],
        };
      });
      let newArr = [];
      this.noSkuList.map((item) => {
        initNoSkuItem.map((val) => {
          if (item.attibuteTypeId == val.productAttributeCategoryId && item.id == val.productAttributeId) {
            newArr.push(val);
          }
        });
      });
      this.baseForm.content = [...newArr];
    },
    //sku属性选中后获取当前的组合
    itemChange() {
      this.allCombine = this.getAllCombine();
      const temp = this.baseForm.price;
      let priceList = [];
      for (let res of this.allCombine) {
        let fullname = res
          .map((item) => {
            return item.name;
          })
          .join('-');
        let newlist = [];
        res.map((item) => {
          newlist.push({
            productAttributeCategoryId: item.productAttributeCategoryId,
            productAttributeId: item.productAttributeId,
          });
        });
        let idStr = newlist
          .map((item) => item.productAttributeId)
          .sort()
          .join(',');
        let t = temp.find((i) => {
          let _idStr = i.list
            .map((item) => item.productAttributeId)
            .sort()
            .join(',');
          return _idStr === idStr;
        });
        // let t = temp.find(i => i.fullname === fullname);
        if (t) {
          priceList.push({
            original: t.original,
            sale: t.sale,
            fullname: fullname,
            list: newlist,
            skuId: t.skuId,
            joinSkuIds: t.joinSkuIds,
            SkuIds: t.SkuIds,
            renewSkuId: t.renewSkuId,
            gpmRate: t.gpmRate,
            minPrice: t.minPrice,
            rangeMaxPrice: t.rangeMaxPrice,
            rangeMinPrice: t.rangeMinPrice,
          });
        } else {
          priceList.push({
            original: 0,
            sale: 0,
            fullname: fullname,
            list: newlist,
            skuId: '',
            joinSkuIds: [],
            SkuIds: [],
            renewSkuId: '',
            gpmRate: undefined,
            minPrice: undefined,
            rangeMaxPrice: undefined,
            rangeMinPrice: undefined,
          });
        }
        this.baseForm.price = priceList;
      }
    },
    commitNextStep(step) {
      if (step == -1) {
        this.$router.push('/serviceMerchant/merchant/index');
      }
      // if (step == 1) {
      this.$refs['addmerchantform'].validate((valid) => {
        if (valid) {
          if (this.allCombine.length == 0) {
            this.baseForm.price = [];
          }
          if (this.noSkuItemForm.length == 0) {
            this.$message.warning('请选择服务内容');
            return;
          }
          // 若最低售价和指导价格区间对应的3个值，只要输入任何一个值时，其余2个值都为必填
          let verifyPrice = {
            baseMinPrice: this.baseForm.baseMinPrice,
            baseRangeMaxPrice: this.baseForm.baseRangeMaxPrice,
            baseRangeMinPrice: this.baseForm.baseRangeMinPrice,
          };
          let validate = this.verifyPriceInsert(verifyPrice);
          if (!validate.flag && !validate.isEmpty) {
            this.$message.warning('请完整输入最低售价和指导价格！');
            return false;
          }
          let priceEmptyFlag = false;
          this.baseForm.price.map((item) => {
            if (item.minPrice || item.rangeMaxPrice || item.rangeMinPrice) {
              if (item.minPrice == undefined || item.rangeMaxPrice == undefined || item.rangeMinPrice == undefined) {
                this.$message.warning('请完整输入最低售价和指导价格！');
                priceEmptyFlag = true;
                return false;
              }
            }
          });
          if (priceEmptyFlag) return;
          this.$emit('update:baseForm', this.baseForm);
          this.$emit('nextStep', step);
        }
      });
    },
    verifyPriceInsert(obj) {
      let arr = Object.values(obj);
      let flag = arr.every(function (item) {
        return item === '' || item === undefined;
      });
      let isEmpty = arr.every(function (item) {
        return item !== '' && item !== undefined;
      });
      let params = {
        flag,
        isEmpty,
      };
      return params;
    },
    // R标卖家资料信息表格搜索用户信息
    searchUser() {
      if (this.baseForm.sellerInfo.sellerMobile) {
        // 获取用户列表
        this.getUser(this.baseForm.sellerInfo.sellerMobile);
      } else {
        this.$message.warning('请输入用户手机号');
      }
    },
    // 获取国家列表
    getCountryList() {
      return new Promise((resolve) => {
        getWorldCountryListByLevel({
          level: 1,
        }).then((res) => {
          this.countryList = res.data;
          resolve(res);
        });
      });
    },
    // 获取省市列表
    getProvinceOrCityList(pid, type) {
      getWorldCountryListByPid({
        pid,
      }).then((res) => {
        if (type === 'province') {
          this.provinceList = res.data;
        } else if (type === 'city') {
          this.cityList = res.data;
        } else {
          this.areaList = res.data;
        }
      });
    },
    // 更改国家
    countryChange(id) {
      this.baseForm.sellerInfo.countryId = id;
      this.getProvinceOrCityList(id, 'province');
      this.cityList = [];
      this.baseForm.sellerInfo.provinceId = '';
      this.baseForm.sellerInfo.cityId = '';
      this.companyInfo.provinceName = '';
      // this.companyInfo.areaName = ""
    },
    // 更改省
    provinceChange(id, isInit) {
      this.baseForm.sellerInfo.provinceId = id;
      this.getProvinceOrCityList(id, 'city');
      this.baseForm.sellerInfo.cityId = '';
      this.companyInfo.cityName = '';
      // this.companyInfo.areaName = ""
    },
    // 更改市
    cityChange(id, isInit) {
      this.baseForm.sellerInfo.cityId = id;
      this.getProvinceOrCityList(id, 'area');
      // this.companyInfo.areaName = ""
    },
    uploadSuccess(v) {},
    baseMinPriceChange(v) {
      if (v > this.baseForm.signalSalePrice) {
        this.$message.warning('最低售价不能大于销售价');
        this.$nextTick(() => {
          this.baseForm.baseMinPrice = this.baseForm.signalSalePrice;
        });
      }
      this.baseRangeMinPriceChange(v);
    },
    baseRangeMinPriceChange(v) {
      if (v <= this.baseForm.baseMinPrice && this.baseForm.baseMinPrice !== 0) {
        this.$message.warning('指导价格最低价需大于最低售价！');
        this.$nextTick(() => {
          this.baseForm.baseRangeMinPrice = this.baseForm.baseMinPrice + 1;
          if (this.baseForm.baseRangeMaxPrice < this.baseForm.baseRangeMinPrice) {
            this.baseForm.baseRangeMaxPrice = undefined;
          }
        });
      }
      this.baseRangeMaxPriceChange(v);
    },
    baseRangeMaxPriceChange(v) {
      if (v > this.baseForm.signalOriginalPrice) {
        this.$message.warning('指导价格最高价不能大于原价！');
        this.$nextTick(() => {
          this.baseForm.baseRangeMaxPrice = this.baseForm.signalOriginalPrice - 1;
        });
      }
      if (this.baseForm.baseRangeMaxPrice <= this.baseForm.baseRangeMinPrice && this.baseForm.baseRangeMinPrice !== 0) {
        this.$message.warning('指导价格最高价需大于最低价！');
        this.$nextTick(() => {
          this.baseForm.baseRangeMinPrice = undefined;
        });
      }
    },

    baseGpmRateChange(v) {
      if (v > 99.99 || v < 0) {
        if (v > 99.99) {
          this.$nextTick(() => {
            this.baseForm.baseGpmRate = 99.9;
          });
        }
        if (v < 0) {
          this.$nextTick(() => {
            this.baseForm.baseGpmRate = 0;
          });
        }
        this.$message.warning('目标毛利率范围为0-99.9！');
      }
    },
    minPriceChange(v, index) {
      if (v.minPrice > this.baseForm.price[index].sale) {
        this.$message.warning('最低售价不能大于销售价！');
        this.$nextTick(() => {
          this.baseForm.price[index].minPrice = this.baseForm.price[index].sale;
        });
      }
      this.rangeMinPriceChange(v, index);
    },

    gpmRateChange(v, index) {
      if (v.gpmRate > 99.99 || v.gpmRate < 0) {
        if (v.gpmRate > 99.99) {
          this.$nextTick(() => {
            this.baseForm.price[index].gpmRate = 99.9;
          });
        }
        if (v.gpmRate < 0) {
          this.$nextTick(() => {
            this.baseForm.price[index].gpmRate = 0;
          });
        }
        this.$message.warning('目标毛利率范围为0-99.9！');
      }
    },
    rangeMinPriceChange(v, index) {
      if (v.rangeMinPrice <= this.baseForm.price[index].minPrice && this.baseForm.price[index].minPrice !== 0) {
        this.$message.warning('指导价格最低价需大于最低售价！');
        this.$nextTick(() => {
          this.baseForm.price[index].rangeMinPrice = this.baseForm.price[index].minPrice + 1;
          if (this.baseForm.price[index].rangeMinPrice > this.baseForm.price[index].rangeMaxPrice) {
            this.baseForm.price[index].rangeMaxPrice = undefined;
          }
        });
      }
      this.rangeMaxPriceChange(v, index);
    },
    rangeMaxPriceChange(v, index) {
      if (v.rangeMaxPrice > this.baseForm.price[index].original) {
        this.$message.warning('指导价格最高价不能大于原价！');
        this.$nextTick(() => {
          this.baseForm.price[index].rangeMaxPrice = this.baseForm.price[index].original - 1;
        });
      }
      if (
        this.baseForm.price[index].rangeMinPrice >= this.baseForm.price[index].rangeMaxPrice &&
        this.baseForm.price[index].rangeMinPrice !== 0
      ) {
        this.$message.warning('指导价格最高价不能小于最低价！');
        this.$nextTick(() => {
          this.baseForm.price[index].rangeMinPrice = undefined;
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
td,
th {
  padding: 3px 10px 3px 10px;
}
.tips {
  margin-left: 10px;
}
.cardHeader {
  display: inline-block;
  background: #f2f2f2;
  width: 100%;
  height: 40px;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 17px;
  font-weight: 600;
  line-height: 20px;
  color: #000;
}
.signalSalePrice > span {
  color: red;
}
.searchBtn {
  color: #00a9f2;
  cursor: pointer;
}
.imgbox {
  display: flex;
  flex-direction: column;
  .userImgs {
    display: flex;
  }
}
/deep/ .el-table {
  border: 1px solid rgb(235, 235, 235);
}
.subTips {
  font-size: 12px;
  color: rgb(150, 150, 150);
}
.service-sort {
  margin-left: 20px;
  cursor: move;
}
</style>
