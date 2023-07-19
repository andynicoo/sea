<template>
  <div class="app-container">
    <div class="header-container">
      <!-- <div class="header-info">
        <div class="left">
          <div>公司中文名称：{{ serviceInfo.companyNameZh }}</div>
          <div>公司英文名称：{{ serviceInfo.companyNameEn }}</div>
        </div>
        <div class="right">税号：{{ vatInfo.vatTaxNumber }}</div>
      </div>

      <h2>计算税金</h2>
      <el-divider></el-divider> -->
      <!-- <div class="text-info">申报信息</div> -->
      <el-form :model="form" ref="formRef" :rules="rule" label-width="170px">
        <!-- <el-form-item label="国家：" prop="countryCode">
          <el-select placeholder="请选择" style="width: 168px" clearable v-model="form.countryCode" disabled filterable>
            <el-option v-for="(item, index) in countrySelectList" :key="index" :label="item.countryNameZh" :value="item.countryCode"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="报税方式：" prop="declareRule">
          <el-radio-group v-model="form.declareRule">
            <el-radio-button :label="1">有数据</el-radio-button>
            <el-radio-button :label="0">零申报</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <div v-if="form.declareRule == 1">
          <el-form-item label="税率：" prop="taxRate" v-if="!isIOSS">
            <el-select placeholder="请选择" style="width: 168px" clearable filterable v-model="form.taxRate">
              <el-option v-for="(item, index) in declareTax" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="周期类型：" prop="periodType" required>
            <el-select placeholder="请选择" style="width: 168px" clearable v-model="form.periodType" disabled>
              <el-option v-for="(item, index) in cycleList" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申报周期" required>{{ beginTime }}~{{ endTime }}</el-form-item>

          <el-form-item label="公司注册所在地国家/地区：" prop="registerCountryCode" v-if="showRegisterCountryCode && form.declareRule == 1">
            <el-select placeholder="请选择" style="width: 168px" clearable v-model="form.registerCountryCode" filterable>
              <el-option v-for="(item, index) in countrySelectList" :key="index" :label="item.countryNameZh" :value="item.countryCode"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="选择销售平台：" prop="salePlatformType" required>
            <!-- <el-radio-group v-model="form.salePlatformType">
              <el-radio :label="0">亚马逊</el-radio>
              <el-radio :label="1">其他平台</el-radio>
            </el-radio-group> -->

            <el-checkbox-group v-model="form.salePlatformType">
              <el-checkbox-button :label="0" v-if="!isIOSS">亚马逊</el-checkbox-button>
              <el-checkbox-button :label="1">其他平台</el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>

          <template v-if="form.salePlatformType.includes(0)">
            <el-form-item v-if="!isIOSS" prop="filePath" :rules="{ required: true, message: '请上传亚马逊销售数据', trigger: 'blur' }">
              <div class="data-block">
                <div class="text-info">上传亚马逊销售数据</div>
                <UploadFile hiddenDrag :flag="true" :showTip="false" :maxSize="200" fileFlag :fileList.sync="form.filePath">
                  <el-button class="el-icon-plus" type="primary"> 上传文件 </el-button>
                </UploadFile>
                <p v-if="taxData.isPullSellFile && form.filePath.length > 0 && form.filePath[0].name === '销售额文件'" style="color: red">提示：当前申报区间销售报告已系统生成，请确认后提交</p>
              </div>
            </el-form-item>
          </template>
          <template v-if="form.salePlatformType.includes(1)">
            <el-form-item v-if="isIOSS">
              <div class="data-block">
                <div class="text-info">上传其他平台销售数据</div>
                <!-- 其他平台含税销售额/ioss -->
                <el-table border :data="otherOmCountryList" style="margin: 20px 0" highlight-current-row max-height="500px">
                  <el-table-column align="center" label="欧盟国家" prop="countryName"></el-table-column>
                  <el-table-column align="center" label="简称" prop="countryCode"></el-table-column>
                  <el-table-column align="center" label="含税销售额" prop="sales">
                    <template slot-scope="scope">
                      <el-input-number v-model="scope.row.sales" controls-position="right" :min="0" :precision="2"></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="币种单位" prop="currency"></el-table-column>
                </el-table>
                <el-form-item label="其他平台含税销售额文件" prop="handIncludeTaxSalesFilePath">
                  <UploadFile :showTip="false" accept=".jpg,.jpeg,.png,.pdf,.zip,.rar.xls,.xlsx" :maxSize="100" fileClass :fileList.sync="form.handIncludeTaxSalesFilePath"></UploadFile>
                </el-form-item>
                <div>
                  <el-tag style="margin-right: 15px" v-for="tag in form.otherPlatformSaleDto" :key="tag.countryCode" closable type="success" @close="handleIossClose(tag)"> {{ tag.countryName }}{{ tag.sales }}{{ tag.currency }} </el-tag>
                  <el-tag closable :disable-transitions="false" @close="closeFile" v-if="otherSaleFileUrl">
                    <el-link target="_blank" :underline="false" type="primary" :href="otherSaleFileUrl"> 其它平台含税销售额文件 </el-link>
                  </el-tag>
                </div>
              </div>
            </el-form-item>
            <el-form-item v-else>
              <div class="data-block">
                <div class="text-info">上传其他平台销售数据</div>
                <p class="promptBg" v-if="form.countryCode != 'GB'">温馨提示： 如有其它平台需要VAT申报，请在此处填写含税销售额，含税销售额的计算方式可联系客服！(注意：填写的销售额币种为您需要申报的币种)</p>

                <p v-if="form.countryCode == 'GB'" class="promptBg">
                  <span>温馨提示：</span>
                  如有其他平台需要VAT申报，请在此处填写数据。不含税销售额=含税销售额/（1+税率）
                </p>

                <!-- <el-form :model="form" ref="ruleForm" label-width="180px"> -->
                <el-form-item label="含税销售额" prop="handIncludeTaxSales" v-if="['AE', 'SA'].includes(form.countryCode)" :rules="{ required: 'true', message: '请输入含税销售额', trigger: 'change' }">
                  <el-input v-model="form.handIncludeTaxSales" placeholder="请输入含税销售额" clearable style="width: 300px" />
                </el-form-item>

                <el-form-item v-if="isEUCountries || ['GB'].includes(form.countryCode)" label="未代扣代缴不含税销售额" prop="handExIncludeTaxSales" :rules="{ required: 'true', message: '请输入其他平台未代扣代缴不含税销售额', trigger: 'change' }">
                  <el-input v-model="form.handExIncludeTaxSales" placeholder="请输入未代扣代缴不含税销售额" clearable style="width: 300px" />
                  <span> &nbsp;&nbsp; {{ getUnit }} </span>
                </el-form-item>

                <el-form-item
                  :label="['AE', 'SA'].includes(form.countryCode) ? '含税销售文件' : '销售文件'"
                  prop="handIncludeTaxSalesFilePath"
                  :rules="{
                    required: 'true',
                    message: ['AE', 'SA'].includes(form.countryCode) ? '请上传含税销售文件' : '请上传销售文件',
                    trigger: 'change',
                  }"
                >
                  <UploadFile :showTip="false" fileClass accept=".jpg,.jpeg,.png,.pdf,.zip,.rar,.xls,.xlsx" :maxSize="100" :fileList.sync="form.handIncludeTaxSalesFilePath"></UploadFile>
                </el-form-item>
                <template v-if="isEUCountries || ['GB'].includes(form.countryCode)">
                  <!-- <el-form-item label="其他平台平台代扣代缴金额" prop="handPlatformWithHoldandRemitTax">
                    <el-input v-model="form.handPlatformWithHoldandRemitTax" placeholder="请输入其他平台平台代扣代缴金额" clearable style="width: 300px" />
                  </el-form-item> -->

                  <el-form-item label="已代扣代缴不含税销售额" prop="handExPlatformWithHoldandRemitTax" :rules="{ required: 'true', message: '请输入已代扣代缴不含税销售额', trigger: 'blur' }">
                    <el-input v-model="form.handExPlatformWithHoldandRemitTax" placeholder="请输入已代扣代缴不含税销售额" clearable style="width: 300px" />
                    <span> &nbsp;&nbsp; {{ getUnit }} </span>
                  </el-form-item>

                  <el-form-item label="出口不含税销售额" prop="otherExIncludeTaxAmt" :rules="{ required: 'true', message: '请输入出口不含税销售额', trigger: 'blur' }">
                    <el-input v-model="form.otherExIncludeTaxAmt" placeholder="请输入出口不含税销售额" clearable style="width: 300px" />
                    <span> &nbsp;&nbsp; {{ getUnit }} </span>
                  </el-form-item>
                </template>
                <el-form-item v-if="isEUCountries" label="跨境B2B不含税销售额" prop="eurOtherB2bExcludeTaxSales" :rules="{ required: 'true', message: '请输入出口不含税销售额', trigger: 'blur' }">
                  <el-input v-model="form.eurOtherB2bExcludeTaxSales" placeholder="请输入跨境B2B不含税销售额" clearable style="width: 300px" />
                  <span> &nbsp;&nbsp; {{ getUnit }} </span>
                </el-form-item>
                <!-- </el-form> -->
                <div>
                  <!-- <el-tag closable style="margin-right: 10px" type="success" :disable-transitions="false" v-if="handIncludeTaxSales" @close="handleClose">
                    {{ handIncludeTaxSales }}
                  </el-tag>
                  <el-tag closable :disable-transitions="false" v-if="otherSaleFileUrl" @close="closeFile">
                    <el-link target="_blank" :underline="false" type="primary" :href="otherSaleFileUrl"> 含税销售额文件 </el-link>
                  </el-tag> -->

                  <!-- <el-tag
                style="margin-right:10px"
                v-for="item in tag"
                :key="item"
                closable
                type="success"
                :disable-transitions="false"
                @close="handleClose(item)"
              >
                <a :href="item" target="_blank" v-if="item.indexOf('http') >= 0">其它平台含税销售额文件</a>
                <span v-else>{{ item }}</span>
              </el-tag> -->
                </div>
              </div>
            </el-form-item>
          </template>
          <el-form-item label="销售数据明细表: " v-if="isIOSS && serviceInfo.isDongDong" prop="salesDataFile">
            <UploadFileUrl :drag="false" :showTip="false" :maxSize="100" accept=".xls,.xlsx" fileFlag :fileList.sync="form.salesDataFile">
              <el-button class="el-icon-plus" type="primary"> 上传销售数据明细表 </el-button>
            </UploadFileUrl>
            <el-link type="primary" href="https://file.itaxs.com/dev/20230209/2624d700916a486e9ea219a334aa3864.xlsx" target="_blank">下载模板</el-link>
          </el-form-item>
          <template v-if="!['GB', 'SA', 'AE'].includes(form.countryCode) && !isIOSS">
            <el-form-item label="OSS税号：" prop="oss">
              <el-radio-group v-model="form.oss">
                <el-radio :label="true">有</el-radio>
                <el-radio :label="false">无</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="IOSS税号：" prop="ioss">
              <el-radio-group v-model="form.ioss">
                <el-radio :label="true">有</el-radio>
                <el-radio :label="false">无</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="VAT国家(已注册)：" prop="tfnCountryCode" id="medicalAdviceRef">
              <el-select placeholder="请选择" style="width: 168px" multiple filterable v-model="form.tfnCountryCode">
                <el-option v-for="(item, index) in otherOmCountryList" :key="index" :label="item.countryName" :value="item.countryCode" :disabled="item.countryCode === countryCode"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否有法国递延：" prop="frenchDeferredFlag" v-if="form.countryCode == 'FR'">
              <el-radio-group v-model="form.frenchDeferredFlag">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <template v-if="form.countryCode == 'FR' && form.frenchDeferredFlag == 1">
              <el-form-item label="法国海关号：" prop="frenchDeferredDTO.customsNumber">
                <el-input v-model="form.frenchDeferredDTO.customsNumber" placeholder="请输入法国海关号" clearable style="width: 250px" />
              </el-form-item>

              <el-form-item label="进口递延开始日期：" prop="frenchDeferredDTO.startDate">
                <el-date-picker v-model="form.frenchDeferredDTO.startDate" type="date" align="right" size="small" clearable unlink-panels placeholder="请选择日期" value-format="yyyy-MM-dd HH:mm:ss" style="width: 250px"> </el-date-picker>
              </el-form-item>

              <el-form-item prop="frenchDeferredDTO.taxableAmount">
                <span slot="label">
                  <span>进口递延应税金额：</span><br />
                  <span style="color: rgb(237, 62, 62)">(填写整数)</span>
                </span>

                <el-input-number controls-position="right" placeholder="请填写整数金额" :min="0.0" :precision="0" v-model="form.frenchDeferredDTO.taxableAmount" style="width: 250px">
                  <template slot="append">EUR</template>
                </el-input-number>
              </el-form-item>

              <el-form-item label="进口递延文件: " prop="frenchDeferredDTO.deferredFileList">
                <UploadFile :fileClass="true" :maxSize="100" initTip="支持文件格式：ZIP、RAR TXT、DOCX、DOC、EXCEL,数量：1，大小：100M" :accept="'.pdf,.zip, xls, .xlsx, .csv,.txt,.rar,.doc,.docx'" :fileList.sync="form.frenchDeferredDTO.deferredFileList"> </UploadFile>
              </el-form-item>
            </template>

            <el-form-item label="欧盟内免税收购项金额：" prop="ecAcqPrice" v-if="form.countryCode == 'DE'">
              <el-input-number controls-position="right" placeholder="请四舍五入填写整数金额" :min="0.0" :precision="0" v-model="form.ecAcqPrice" style="width: 250px">
                <template slot="append">EUR</template>
              </el-input-number>
              <span> （递延清关金额）</span>
            </el-form-item>
            <el-form-item label="欧盟内免税收购项文件：" prop="ecAcqFilePath" v-if="form.countryCode == 'DE'">
              <UploadFile :drag="false" :fileType2="true" :maxSize="100" :showTip="false" :fileList.sync="form.ecAcqFilePath">
                <el-tooltip class="item" effect="dark" content="请上传应税19%的欧盟内收购（递延清关），文件支持JPG/JPEF/PNG/压缩包" placement="right">
                  <el-button class="el-icon-plus" type="primary"> 上传欧盟内免税收购项文件 </el-button>
                </el-tooltip>
              </UploadFile>
              <span></span>
            </el-form-item>
            <el-form-item label="欧盟内免税采购项金额：" prop="freePurchasePrice" v-if="form.countryCode == 'DE'">
              <el-input-number controls-position="right" placeholder="请四舍五入填写整数金额" :min="0.0" :precision="0" v-model="form.freePurchasePrice" style="width: 250px">
                <template slot="append">EUR</template>
              </el-input-number>
            </el-form-item>

            <el-form-item label="欧盟内免税采购项文件：" prop="freePurchaseFile" v-if="form.countryCode == 'DE'">
              <UploadFile :drag="false" :fileType2="true" :maxSize="100" :showTip="false" :fileList.sync="form.freePurchaseFile">
                <el-tooltip class="item" effect="dark" content="文件支持JPG/JPEF/PNG/压缩包" placement="right">
                  <el-button class="el-icon-plus" type="primary"> 上传欧盟内免税采购项文件 </el-button>
                </el-tooltip>
              </UploadFile>
            </el-form-item>

            <el-form-item label="ECL申报：" prop="ecl" v-if="form.countryCode == 'ES'">
              <el-radio-group v-model="form.ecl">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <div v-if="form.ecl == true">
              <el-form-item>
                <el-button @click="saleDialog = true">添加销售项</el-button>
                <span style="margin-left: 20px; display: inline-block"> ECL销售项金额：{{ eclSalePriceTotal | formatQianFenWei }}欧元 </span>
              </el-form-item>
              <el-form-item>
                <el-button @click="purchaseDialog = true">添加采购项</el-button>
                <span style="margin-left: 20px; display: inline-block"> ECL采购项金额：{{ eclPurchasePriceTotal | formatQianFenWei }}欧元 </span>
              </el-form-item>
            </div>
          </template>
          <template v-if="!isIOSS">
            <div class="add-title">
              <div class="text-info">抵扣项</div>
              <el-button class="el-icon-plus" size="small" type="primary" @click="addItem">添加</el-button>
            </div>
            <el-table border :data="form.taxDeductionDtos" style="margin: 20px 0" highlight-current-row>
              <el-table-column width="50px" align="center" label="序号">
                <template slot-scope="scope">{{ scope.$index + 1 }}</template>
              </el-table-column>
              <el-table-column min-width="180px" align="center" label="抵扣类型" prop="deductionType">
                <template slot-scope="scope">
                  <el-select placeholder="请选择" size="small" style="width: 158px" clearable filterable v-model="scope.row.deductionType">
                    <el-option v-for="(item, index) in typeList" :key="index" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column min-width="190px" align="center" label="单据日期">
                <template slot-scope="scope">
                  <el-date-picker v-model="scope.row.billDate" type="date" align="right" size="small" clearable unlink-panels placeholder="请选择日期" value-format="yyyy-MM-dd HH:mm:ss" style="width: 168px"></el-date-picker>
                </template>
              </el-table-column>
              <el-table-column min-width="160px" align="center" label="抵扣金额">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.deductionAmt" controls-position="right" width="100px" :min="0.0" :precision="2"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column min-width="150px" align="center" label="凭证">
                <template slot-scope="scope">
                  <UploadFile :drag="false" :showTip="false" :maxSize="100" :fileList.sync="scope.row.deductionFile">
                    <el-button class="el-icon-plus" type="primary"> 上传抵扣项凭证 </el-button>
                  </UploadFile>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" min-width="50px" fixed="right">
                <template slot-scope="scope">
                  <el-link @click="delItem(scope.$index)">删除</el-link>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>
        <div v-else>
          <el-form-item label="是否有法国递延：" prop="frenchDeferredFlag" v-if="form.countryCode == 'FR'">
            <el-radio-group v-model="form.frenchDeferredFlag">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="form.countryCode == 'FR' && form.frenchDeferredFlag == 1">
            <el-form-item label="法国海关号：" prop="frenchDeferredDTO.customsNumber">
              <el-input v-model="form.frenchDeferredDTO.customsNumber" placeholder="请输入法国海关号" clearable style="width: 250px" />
            </el-form-item>

            <el-form-item label="进口递延开始日期：" prop="frenchDeferredDTO.startDate">
              <el-date-picker v-model="form.frenchDeferredDTO.startDate" type="date" align="right" size="small" clearable unlink-panels placeholder="请选择日期" value-format="yyyy-MM-dd HH:mm:ss" style="width: 250px"> </el-date-picker>
            </el-form-item>

            <el-form-item prop="frenchDeferredDTO.taxableAmount">
              <span slot="label">
                <span>进口递延应税金额：</span><br />
                <span style="color: rgb(237, 62, 62)">(填写整数)</span>
              </span>
              <el-input-number controls-position="right" placeholder="请填写整数金额" :min="0.0" :precision="0" v-model="form.frenchDeferredDTO.taxableAmount" style="width: 250px">
                <template slot="append">EUR</template>
              </el-input-number>
            </el-form-item>

            <el-form-item label="进口递延文件: " prop="frenchDeferredDTO.deferredFileList">
              <UploadFile :fileClass="true" :maxSize="100" initTip="支持文件格式：ZIP、RAR TXT、DOCX、DOC、EXCEL,数量：1，大小：100M" :accept="'.pdf,.zip, xls, .xlsx, .csv,.txt,.rar,.doc,.docx'" :fileList.sync="form.frenchDeferredDTO.deferredFileList"> </UploadFile>
            </el-form-item>
          </template>

          <el-form-item label="零申报凭证：" key="sellFile" prop="sellFile">
            <UploadFile hiddenDrag :showTip="false" :fileList.sync="form.sellFile">
              <el-button class="el-icon-plus" type="primary"> 上传店铺销售额截图 </el-button>
            </UploadFile>
          </el-form-item>

          <el-form-item label="ECL申报：" prop="ecl" v-if="form.countryCode == 'ES'">
            <el-radio-group v-model="form.ecl">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <div v-if="form.ecl == true">
            <el-form-item>
              <el-button @click="saleDialog = true">添加销售项</el-button>
              <span style="margin-left: 20px; display: inline-block"> ECL销售项金额：{{ eclSalePriceTotal | formatQianFenWei }}欧元 </span>
            </el-form-item>
            <el-form-item>
              <el-button @click="purchaseDialog = true">添加采购项</el-button>
              <span style="margin-left: 20px; display: inline-block"> ECL采购项金额：{{ eclPurchasePriceTotal | formatQianFenWei }}欧元 </span>
            </el-form-item>
          </div>

          <el-form-item label="是否有德国递延或欧盟内免税采购项？" prop="ecl" v-if="form.countryCode == 'DE'">
            <el-radio-group v-model="form.deDeferFlag">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <template v-if="form.countryCode == 'DE' && form.deDeferFlag">
            <el-form-item label="欧盟内免税收购项金额：" prop="ecAcqPrice">
              <el-input-number controls-position="right" placeholder="请四舍五入填写整数金额" :min="0.0" :precision="0" v-model="form.ecAcqPrice" style="width: 250px">
                <template slot="append">EUR</template>
              </el-input-number>
              <span> （递延清关金额）</span>
            </el-form-item>
            <el-form-item label="欧盟内免税收购项文件：" prop="ecAcqFilePath">
              <UploadFile :drag="false" :fileType2="true" :maxSize="100" :showTip="false" :fileList.sync="form.ecAcqFilePath">
                <el-tooltip class="item" effect="dark" content="请上传应税19%的欧盟内收购（递延清关），文件支持JPG/JPEF/PNG/压缩包" placement="right">
                  <el-button class="el-icon-plus" type="primary"> 上传欧盟内免税收购项文件 </el-button>
                </el-tooltip>
              </UploadFile>
              <span></span>
            </el-form-item>
            <el-form-item label="欧盟内免税采购项金额：" prop="freePurchasePrice">
              <el-input-number controls-position="right" placeholder="请四舍五入填写整数金额" :min="0.0" :precision="0" v-model="form.freePurchasePrice" style="width: 250px">
                <template slot="append">EUR</template>
              </el-input-number>
            </el-form-item>

            <el-form-item label="欧盟内免税采购项文件：" prop="freePurchaseFile">
              <UploadFile :drag="false" :fileType2="true" :maxSize="100" :showTip="false" :fileList.sync="form.freePurchaseFile">
                <el-tooltip class="item" effect="dark" content="文件支持JPG/JPEF/PNG/压缩包" placement="right">
                  <el-button class="el-icon-plus" type="primary"> 上传欧盟内免税采购项文件 </el-button>
                </el-tooltip>
              </UploadFile>
            </el-form-item>
          </template>
        </div>
      </el-form>
    </div>
    <div class="fixed-btn">
      <el-button type="warning" @click="saveSnapshoot">保存草稿</el-button>
      <!-- <el-button type="primary" @click="submitBtn" v-if="form.declareRule == 0" v-show="hasAuthority('M1_20')">提交申报</el-button> -->
      <el-button type="primary" @click="computeBtn" v-if="form.declareRule == 1" v-show="hasAuthority('M1_19')" :loading="computeLoading">计算税金</el-button>
      <el-button type="primary" @click="calculateResultDialog = true" :disabled="!isCheckTax">查看算税结果</el-button>
    </div>
    <el-dialog title="计算结果" :visible.sync="calculateResultDialog" width="860px" center>
      <div class="calculate-result-wrapper">
        <div class="text-info">税金计算结果</div>

        <el-descriptions :column="1" style="padding: 20px" v-if="['AE', 'SA'].includes(form.countryCode) || isIOSS">
          <el-descriptions-item label="含税销售总额">
            {{ resultData.includeTaxSales | formatQianFenWei }}
          </el-descriptions-item>
          <el-descriptions-item label="不含税销售总额">
            {{ resultData.excludeTaxSales | formatQianFenWei }}
          </el-descriptions-item>
          <template v-if="['AE', 'SA'].includes(form.countryCode)">
            <el-descriptions-item label="抵扣金额" v-if="!isIOSS">
              {{ resultData.discountAmount | formatQianFenWei }}
            </el-descriptions-item>
            <el-descriptions-item label="销项税额" v-if="!isIOSS">
              {{ resultData.outputTax | formatQianFenWei }}
            </el-descriptions-item>
          </template>
          <el-descriptions-item label="最终缴纳税金">{{ resultData.tax | formatQianFenWei }}</el-descriptions-item>
        </el-descriptions>

        <el-descriptions :column="1" style="padding: 20px" v-else>
          <el-descriptions-item label="平台未代扣代缴不含税销售额"> {{ resultData.currencySign }}{{ (form.countryCode == 'GB' ? resultData.handExcludeTaxSales : resultData.noPayExcludeTaxSales) | formatQianFenWei }} </el-descriptions-item>
          <el-descriptions-item label="销项税金"> {{ resultData.currencySign }}{{ resultData.outputTax | formatQianFenWei }} </el-descriptions-item>
          <el-descriptions-item label="进项税金"> {{ resultData.currencySign }}{{ resultData.inputTax | formatQianFenWei }} </el-descriptions-item>
          <el-descriptions-item label="平台已代扣代缴不含税销售额"> {{ resultData.currencySign }}{{ resultData.excludeTaxSales | formatQianFenWei }} </el-descriptions-item>
          <el-descriptions-item label="出口不含税销售额"> {{ resultData.currencySign }}{{ resultData.exportExclTaxAmount | formatQianFenWei }} </el-descriptions-item>
          <!-- 意大利、荷兰、西班牙、法国 -->
          <el-descriptions-item label="本国B2B0税率供应不含税销售额" v-if="['IT', 'NL', 'ES', 'FR'].includes(form.countryCode)"> {{ resultData.currencySign }}{{ resultData.homeCountryB2bSupplySalesExcludeTaxAmount | formatQianFenWei }} </el-descriptions-item>
          <!-- 欧盟 -->
          <el-descriptions-item label="欧盟内跨境B2B不含税销售额" v-if="isEUCountries"> {{ resultData.currencySign }}{{ resultData.eurB2bExcludeTaxSales | formatQianFenWei }} </el-descriptions-item>
          <!-- 德国 -->
          <template v-if="['DE'].includes(form.countryCode)">
            <el-descriptions-item label="欧盟内免税收购项金额"> {{ resultData.currencySign }}{{ resultData.otherEcAcqPrice | formatQianFenWei }} </el-descriptions-item>
            <el-descriptions-item label="欧盟内免税采购项金额"> {{ resultData.currencySign }}{{ resultData.freePurchasePrice | formatQianFenWei }} </el-descriptions-item>
          </template>
          <!-- 西班牙 -->
          <template v-if="['ES'].includes(form.countryCode)">
            <el-descriptions-item label="ECL销售项金额"> {{ resultData.currencySign }}{{ resultData.eclSales | formatQianFenWei }} </el-descriptions-item>
            <el-descriptions-item label="ECL采购项金额"> {{ resultData.currencySign }}{{ resultData.eclPurchaseAmount | formatQianFenWei }} </el-descriptions-item>
          </template>
          <!-- 法国 -->
          <el-descriptions-item v-if="['FR'].includes(form.countryCode)" label="进口递延应税金额"> {{ resultData.currencySign }}{{ resultData.defTaxableAmount | formatQianFenWei }} </el-descriptions-item>
          <!-- 英国 -->
          <template v-if="['GB'].includes(form.countryCode)">
            <el-descriptions-item label="0税率供应不含税销售额"> {{ resultData.currencySign }}{{ resultData.supplySalesExcludeTaxAmount | formatQianFenWei }} </el-descriptions-item>
            <el-descriptions-item label="PVA金额"> {{ resultData.currencySign }}{{ resultData.discountAmount | formatQianFenWei }} </el-descriptions-item>
          </template>
          <el-descriptions-item label="最终应缴税金"> {{ resultData.currencySign }}{{ resultData.tax | formatQianFenWei }} </el-descriptions-item>
        </el-descriptions>

        <template v-if="!isIOSS">
          <div class="text-info">税金明细</div>
          <el-table border :data="taxPriceDetailDtos" class="table" height="300" highlight-current-row>
            <template v-if="form.countryCode != 'SA'">
              <el-table-column align="center" label="销售月份">
                <template slot-scope="scope">{{ scope.row.month }}</template>
              </el-table-column>
              <el-table-column align="center" label="发出国" prop="deptCountryName"></el-table-column>
              <el-table-column align="center" label="到货国" prop="arriCountryName"></el-table-column>
              <el-table-column align="center" label="币种">
                <template slot-scope="scope">{{ scope.row.currency }}</template>
              </el-table-column>
              <el-table-column width="150px" show-overflow-tooltip align="center" label="汇率">
                <template slot-scope="scope">{{ scope.row.rate || '-' }}</template>
              </el-table-column>
              <el-table-column align="center" label="含税销售额">
                <template slot-scope="scope">{{ scope.row.includTaxPrice | formatQianFenWei }}</template>
              </el-table-column>
            </template>
            <template v-else>
              <el-table-column align="center" label="日期">
                <template slot-scope="scope">{{ scope.row.month }}</template>
              </el-table-column>
              <el-table-column align="center" label="收货人">
                <template slot-scope="scope">{{ scope.row.consignee }}</template>
              </el-table-column>
              <el-table-column align="center" label="辖区">
                <template slot-scope="scope">{{ scope.row.area }}</template>
              </el-table-column>
              <el-table-column align="center" label="含税销售额">
                <template slot-scope="scope">{{ scope.row.includTaxPrice | formatQianFenWei }}</template>
              </el-table-column>
              <el-table-column align="center" label="不含税销售额">
                <template slot-scope="scope">{{ scope.row.notIncludTaxPrice }}</template>
              </el-table-column>
              <el-table-column align="center" label="税率">
                <template slot-scope="scope">{{ scope.row.rate || '-' }}</template>
              </el-table-column>
              <el-table-column align="center" label="应缴税金">
                <template slot-scope="scope">{{ scope.row.currencySign }}{{ scope.row.taxPayablePrice | formatQianFenWei }}</template>
              </el-table-column>
            </template>
          </el-table>
        </template>

        <template v-if="isIOSS">
          <h2>各国税金</h2>
          <el-table border :data="declareIossDetailDTOS" class="table" highlight-current-row>
            <el-table-column align="center" type="index" width="50" label="序号"> </el-table-column>
            <el-table-column align="center" label="国家">
              <template slot-scope="scope">{{ scope.row.country }}</template>
            </el-table-column>

            <el-table-column align="center" label="含税销售额(€)">
              <template slot-scope="scope">{{ scope.row.includeTaxSales }}</template>
            </el-table-column>

            <el-table-column align="center" label="税率">
              <template slot-scope="scope">{{ scope.row.taxRate }}</template>
            </el-table-column>

            <el-table-column align="center" label="应缴税金(€)">
              <template slot-scope="scope">{{ scope.row.tax }}</template>
            </el-table-column>
          </el-table>
        </template>

        <div class="fixed-btn">
          <!-- 下载税金确认单 支持的国家：英国，德国，法国，意大利，西班牙，捷克，这几个国家才会出现此按钮，其他国家申报时不出现 -->
          <el-button type="primary" @click="getTaxConfirmFunc" v-if="form.countryCode == 'GB' || form.countryCode == 'DE' || form.countryCode == 'IT' || form.countryCode == 'FR' || form.countryCode == 'ES' || form.countryCode == 'CZ'" v-show="hasAuthority('M1_30')" :disabled="!isCheckTax"
            >下载税金确认单</el-button
          >
          <el-button type="primary" @click="submitFn" v-show="hasAuthority('M1_12')" :disabled="!isCheckTax">提交申报</el-button>
          <!-- <el-button type="primary" @click="submitDeclar" v-if="form.declareRule != 0" v-show="hasAuthority('M1_21')" :disabled="!isCheckTax">{{ buttonText }}</el-button> -->
        </div>
      </div>
    </el-dialog>
    <!-- 添加销售项 -->
    <el-dialog title="手动添加销售项" :visible.sync="saleDialog" width="600px" center>
      <el-table border :data="form.eclSaleItems" style="margin: 20px 0" highlight-current-row>
        <el-table-column align="center" label="对方税号">
          <template slot-scope="scope">
            <el-input v-model="scope.row.taxNumber" placeholder="请输入对方税号"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" label="销售金额（欧元）">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.taxAmt" controls-position="right" :min="0.0" :precision="2"></el-input-number>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" fixed="right" width="100px">
          <template slot-scope="scope">
            <span class="el-icon-circle-plus" @click="addSale"></span>
            <span class="el-icon-remove" v-if="form.eclSaleItems.length > 1" @click="deleteSale(scope.$index)"></span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="saleDialog = false">取消</el-button>
        <el-button type="primary" @click="computedSale">确认</el-button>
      </span>
    </el-dialog>
    <!-- ECL采购项 -->
    <el-dialog title="手动添加采购项" :visible.sync="purchaseDialog" width="600px" center>
      <el-table border :data="form.eclPurchaseItems" style="margin: 20px 0" highlight-current-row>
        <el-table-column align="center" label="对方税号">
          <template slot-scope="scope">
            <el-input v-model="scope.row.taxNumber" placeholder="请输入对方税号"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" label="销售金额（欧元）">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.taxAmt" controls-position="right" :min="0.0" :precision="2"></el-input-number>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" label="购买时间
（TRANSACTION_COMPLETE_DATE">
          <template slot-scope="scope">
            <el-date-picker
                v-model="scope.row.purchaseTime"
                align="right"
                clearable
                unlink-panels
                placeholder="请选择购买时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 340px"
              ></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column align="center" label="对方姓名
（BUYER_NAME）">
          <template slot-scope="scope">
            <el-input v-model="scope.row.purchaser" placeholder="对方姓名"></el-input>
          </template>
        </el-table-column> -->
        <el-table-column align="center" label="操作" fixed="right" width="100px">
          <template slot-scope="scope">
            <span class="el-icon-circle-plus" @click="addPurchase"></span>
            <span class="el-icon-remove" v-if="form.eclPurchaseItems.length > 1" @click="deletePurchase(scope.$index)"></span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="purchaseDialog = false">取消</el-button>
        <el-button type="primary" @click="computedPurchase">确认</el-button>
      </span>
    </el-dialog>

    <SubmitConfirmDialog :submitConfirmDialog.sync="submitConfirmDialog" :id="id" :companyName="serviceInfo.companyNameZh" :countryName="serviceInfo.countryNameZh" :beginTime="beginTime" :endTime="endTime" :submitTime="submitTime" @refresh="refresh" />
    <ShowTipDialog :showTipDialog.sync="showTipDialog" :tipMessage="tipMessage" />
  </div>
</template>

<script>
import UploadFile from '@/components/UploadFile/index';
import UploadFileUrl from '@/components/UploadFileUrl/index';
import { getCountrySelectList } from '@/api/newApi/common.js';
import { caluTax, submission, taxConfirm, taxConfirmationApi, draft, getDraft } from '@/api/newApi/taxServices/taxNumDeclare.js';
import { typeList, typeListGB, typeListSA, otherOmCountryList } from './enumObj.js';
import { serviceDetail } from '@/api/newApi/taxServices/taxNumDeclare.js';
import * as comps from './components/index';

export default {
  props: {
    id: String,
    countryCode: String,
    regFunctionCode: [String, Number],
    serviceId: String,
    taxData: Object,
    isProcess: Boolean,
    serviceInfo: Object,
  },
  data() {
    return {
      typeList: [],
      otherOmCountryList: otherOmCountryList,
      resultData: {}, // 计算结果
      taxPriceDetailDtos: [],
      declareIossDetailDTOS: [],
      eurOtherB2bExcludeTaxSales: '', // 其他平台欧盟内跨境B2B不含税销售额
      form: {
        countryCode: this.countryCode,
        productFunctionCode: this.regFunctionCode - 0,
        ecl: false,
        declareRule: 1,
        periodType: '',
        salePlatformType: [0],
        filePath: [],
        ecAcqPrice: 0,
        ecAcqFilePath: [],
        tfnCountryCode: [],
        freePurchasePrice: 0, // 欧盟内免税采购项金额
        freePurchaseFile: [], // 欧盟内免税采购项文件
        sellFile: [],
        handIncludeTaxSalesFilePath: [],
        handIncludeTaxSales: 0,
        handExIncludeTaxSales: 0,
        handPlatformWithHoldandRemitTax: 0,
        handExPlatformWithHoldandRemitTax: 0,
        otherExIncludeTaxAmt: 0,
        eurOtherB2bExcludeTaxSales: 0,
        otherPlatformSaleDto: [],
        salesDataFile: '',
        frenchDeferredFlag: '',
        frenchDeferredDTO: {
          customsNumber: '', // 法国海关号
          deferredFilePath: '', // 进口递延文件路径
          startDate: '', // 法国递延开始时间
          taxableAmount: 0, // 法国递延应税金额
          deferredFileList: [],
        },
        taxDeductionDtos: [
          // {
          //   billDate: "",
          //   deductionAmt: 0,
          //   deductionFile: [],
          //   deductionType: "",
          //   fileOriginalName:""
          // }
        ],
        eclSaleItems: [
          {
            taxAmt: '',
            taxNumber: '',
            // purchaseTime:'',
            // purchaser:''
          },
        ],
        eclPurchaseItems: [
          {
            taxAmt: '',
            taxNumber: '',
            // purchaseTime:'',
            // purchaser:''
          },
        ],
      },
      // serviceInfo: {}, // 服务信息
      vatInfo: {},
      tag: [],
      agentTaxPrice: '',
      list: [],
      declareTax: [], // 税率
      b2bNoPrice: '', // b2b不含税
      cycleList: [
        { name: '月报', value: 0 },
        { name: '季报', value: 1 },
        { name: '年报', value: 2 },
      ], // 周期列表
      countrySelectList: [],
      listItem: [],
      saleDialog: false, // 添加销售项弹窗
      purchaseDialog: false,
      addOtherForm: {},
      eclSalePriceTotal: 0, // 销售项总金额
      eclPurchasePriceTotal: 0, // 采购项总金额
      taxDetailList: [],
      beginTime: '',
      endTime: '',
      otherSaleFileUrl: '',
      handIncludeTaxSales: '',
      // 校验
      rule: {
        declareRule: [{ required: true, message: '请选择报税方式', trigger: 'change' }],
        taxRate: [{ required: true, message: '请选择税率', trigger: 'change' }],
        salePlatformType: [{ type: 'array', required: true, message: '请选择销售平台', trigger: 'change' }],
        oss: [{ required: true, message: '请选择OSS税号', trigger: 'change' }],
        ioss: [{ required: true, message: '请选择IOSS税号', trigger: 'change' }],
        ecl: [{ required: true, message: '请选择有无ECL申报', trigger: 'change' }],
        filePath: [{ required: true, message: '请上传销售文件', trigger: 'change' }],
        frenchDeferredFlag: [{ required: true, message: '请选择是否有法国递延', trigger: 'change' }],
        registerCountryCode: [{ required: true, message: '请选择公司注册所在地国家/地区', trigger: 'change' }],
        'frenchDeferredDTO.customsNumber': [
          { required: true, message: '请输入法国海关号', trigger: 'blur' },
          { max: 20, message: '不能超过20个字符', trigger: 'blur' },
        ],
        'frenchDeferredDTO.deferredFileList': [{ required: true, message: '请上传进口递延文件', trigger: 'blur' }],
        'frenchDeferredDTO.startDate': [{ required: true, message: '请选择法国递延开始时间', trigger: 'change' }],
        'frenchDeferredDTO.taxableAmount': [{ required: true, message: '请输入法国递延应税金额', trigger: 'blur' }],
        sellFile: [{ type: 'array', required: true, message: '请上传零申报凭证', trigger: 'blur' }],
        salesDataFile: [{ required: true, message: '请上传销售数据明细表', trigger: 'blur' }],
      },
      // 其他平台含税销售额弹窗
      addOtherRules: {
        handIncludeTaxSales: [{ required: true, message: '请输入含税销售额', trigger: 'blur' }],
        handIncludeTaxSalesFilePath: [{ required: true, message: '请上传其它平台含税销售文件', trigger: 'change' }],
      },
      isCheckTax: false,
      calculateResultDialog: false,
      computeLoading: false,
      submitConfirmDialog: false,
      showTipDialog: false,
      tipMessage: '',
      submitTime: '',
    };
  },
  watch: {
    form: {
      handler(val) {
        if (val) this.isCheckTax = false;
      },
      deep: true,
    },
    'form.taxDeductionDtos': {
      handler(val) {
        if (val) this.isCheckTax = false;
      },
      deep: true,
    },
  },
  components: {
    UploadFile,
    UploadFileUrl,
    ...comps,
  },
  computed: {
    buttonText() {
      let text = '';
      if (!this.isCheckTax) {
        text = '请先核算税金';
      } else {
        text = '提交申报';
      }
      return text;
    },
    isIOSS() {
      let isIOSS = this.form.productFunctionCode === 23;
      if (isIOSS) {
        this.form.salePlatformType = [1];
      }
      return isIOSS;
    },
    isEUCountries() {
      return ['AT', 'CZ', 'DE', 'ES', 'FR', 'IT', 'NL', 'PL', 'SE', 'CY'].includes(this.form.countryCode);
    },
    showRegisterCountryCode() {
      return ['AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'GR', 'ES', 'FI', 'FR', 'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK'].includes(this.form.countryCode);
    },
    getUnit() {
      if (this.showRegisterCountryCode || this.form.countryCode == 'GB') {
        if (this.form.countryCode == 'CZ') {
          return 'Kč';
        } else if (this.form.countryCode == 'PL') {
          return 'zł';
        } else if (this.form.countryCode == 'SE') {
          return 'kr';
        } else if (this.form.countryCode == 'GB') {
          return '£';
        } else {
          return '€';
        }
      }
      return '';
    },
  },
  created() {
    if (this.countryCode === 'GB') {
      this.typeList = typeListGB;
    } else if (['SA'].includes(this.countryCode)) {
      this.typeList = typeListSA;
    } else {
      this.typeList = typeList;
    }

    this.beginTime = this.taxData.beginTime.split(' ')[0];
    this.endTime = this.taxData.endTime.split(' ')[0];
    this.form.periodType = this.taxData.declarePeriod;
    this.getCountry(); // 获取国家数据
    // this.getserviceDetail();
    this.getSnapshoot();
    // this.getTaxAffirmForms()

    //如果已上传文件显示出来
    if (this.taxData.isPullSellFile) {
      this.form.filePath = [
        {
          name: '销售额文件',
          url: this.taxData.sellFile,
        },
      ];
    }
  },
  methods: {
    refresh() {
      this.$emit('refresh');
    },
    /**  零申报 提交申报 */
    submitBtn() {
      if (this.euInputCondition() == false) return;
      this.$refs.formRef &&
        this.$refs.formRef.validate((valid) => {
          if (valid) {
            const params = {
              sellFile: this.fileFormat(this.form.sellFile),
              id: this.taxData.id,
              discountAmount: this.resultData.discountAmount,
              irelandToEuExcludeSell: this.resultData.irelandToEuExcludeSell,
              euToIrelandExcludeSel: this.resultData.euToIrelandExcludeSel,
              priceOfItemsVatRatePercent: this.resultData.priceOfItemsVatRatePercent,
              freePurchasePrice: this.form.freePurchasePrice,
              eurOtherEcAcqPrice: this.form.ecAcqPrice,
              otherEcAcqPriceFile: this.fileFormat(this.form.ecAcqFilePath),
              eurOtherEcAcqFile: this.fileFormat(this.form.ecAcqFilePath),
              freePurchaseFile: this.fileFormat(this.form.freePurchaseFile),
              ecAcqPrice: this.form.ecAcqPrice,
              isEcl: this.form.ecl,
              otherExIncludeTaxAmt: this.resultData.otherExIncludeTaxAmt,
              declareRule: this.form.declareRule,
              frenchDeferredFlag: this.form.countryCode === 'FR' ? this.form.frenchDeferredFlag : '',
            };
            if (this.form.countryCode === 'FR' && this.form.frenchDeferredFlag == 1) {
              params.frenchDeferredDTO = {
                customsNumber: this.form.frenchDeferredDTO.customsNumber,
                deferredFilePath: this.fileFormat(this.form.frenchDeferredDTO.deferredFileList),
                startDate: this.form.frenchDeferredDTO.startDate,
                taxableAmount: this.form.frenchDeferredDTO.taxableAmount,
              };
            } else {
              params.frenchDeferredDTO = null;
            }

            // 西班牙有ecl申报才传 后台决定的
            if (this.form.ecl === true) {
              params.eclPurchaseItems = this.form.eclPurchaseItems;
              params.eclSaleItems = this.form.eclSaleItems;
            }

            this.submitDeclare(params);
          }
        });
    },
    submitDeclare(params) {
      submission({
        ...params,
        purchaseTime: this.resultData.purchaseDates || [...new Set(this.taxPriceDetailDtos.map((item) => item.month))],
      }).then((res) => {
        this.submitTime = this.set_time(res.timestamp);
        if (!this.isProcess && ['GB', 'DE'].includes(this.form.countryCode)) {
          this.submitConfirmDialog = true;
          return;
        }
        if (res.code === 0) {
          this.$message.success('提交成功');
          this.$emit('refresh');
        }
      });
    },
    set_time(str) {
      var n = parseInt(str);
      var D = new Date(n);
      var year = D.getFullYear(); //四位数年份

      var month = D.getMonth() + 1; //月份(0-11),0为一月份
      month = month < 10 ? '0' + month : month;

      var day = D.getDate(); //月的某一天(1-31)
      day = day < 10 ? '0' + day : day;

      var hours = D.getHours(); //小时(0-23)
      hours = hours < 10 ? '0' + hours : hours;

      var minutes = D.getMinutes(); //分钟(0-59)
      minutes = minutes < 10 ? '0' + minutes : minutes;

      var now_time = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
      return now_time;
    },

    // 工单详情
    getserviceDetail() {
      serviceDetail(this.serviceId).then((res) => {
        if (res.code === 0) {
          let { serviceInfo, vatInfo } = res.data;
          this.serviceInfo = serviceInfo; // 服务信息
          this.vatInfo = vatInfo; // 税号信息
        }
      });
    },
    // 草稿详情
    getSnapshoot() {
      getDraft(this.id).then((res) => {
        if (res.code === 0) {
          if (res.data) {
            try {
              let { form, otherOmCountryList, handIncludeTaxSales, otherSaleFileUrl, isCheckTax } = JSON.parse(res.data);
              if (typeof form.salePlatformType === 'number') {
                form.salePlatformType = [form.salePlatformType];
              }
              this.form = form;
              this.otherOmCountryList = otherOmCountryList;
              this.handIncludeTaxSales = handIncludeTaxSales;
              this.otherSaleFileUrl = otherSaleFileUrl;
              this.isCheckTax = isCheckTax;
              this.$nextTick(() => {
                if (isCheckTax) {
                  this.computeBtn();
                }
              });
            } catch (error) {}
          }
        }
      });
    },
    // 保存草稿
    saveSnapshoot() {
      draft({
        draft: JSON.stringify({
          form: this.form,
          otherOmCountryList: this.otherOmCountryList,
          handIncludeTaxSales: this.handIncludeTaxSales,
          otherSaleFileUrl: this.otherSaleFileUrl,
          isCheckTax: this.isCheckTax,
        }),
        workId: this.id,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('保存成功');
        }
      });
    },
    /**
     * 欧盟input输入框条件判断
     */
    euInputCondition() {
      if (this.form.countryCode == 'DE') {
        return this.euDEPriceJudge();
      }
    },

    euDEPriceJudge() {
      let { freePurchasePrice, freePurchaseFile, ecAcqPrice, ecAcqFilePath } = this.form;
      let emList = [
        { price: freePurchasePrice, file: freePurchaseFile, text: '欧盟内免税采购项文件' },
        { price: ecAcqPrice, file: ecAcqFilePath, text: '欧盟内免税收购项文件' },
      ];
      let val = emList.find((item) => item && item.price && item.price != 0 && item.file.length == 0);

      if (val && val.price != 0 && val.file.length == 0) {
        this.$message({ type: 'warning', message: '请上传' + val.text });
        return false;
      }
    },
    submitFn() {
      if (this.form.declareRule === 1) {
        if (!this.isCheckTax) {
          this.$message.warning('请先计算税金');
          return;
        }
        this.submitDeclar();
      } else {
        this.submitBtn();
      }
    },
    /** 提交申报 */
    submitDeclar() {
      this.$refs.formRef &&
        this.$refs.formRef.validate((valid) => {
          if (valid) {
            let { handIncludeTaxSalesFilePath, ...otherData } = this.getOtherData();
            let params = {
              id: this.taxData.id,
              declareRule: this.form.declareRule,
              otherIncludeTaxAmt: this.form.handPlatformWithHoldandRemitTax,
              handIncludeTaxSales: this.form.handIncludeTaxSales,
              ...otherData,
              otherSaleFileUrl: handIncludeTaxSalesFilePath,
              taxRate: JSON.stringify(this.resultData.taxRate) === '{}' ? 0 : this.resultData.taxRate,
              // salePlatformType: this.form.salePlatformType[0],
              salePlatformType: 0,
              sellFile: this.form.declareRule === 0 ? this.form.sellFile : this.getFilePath(),
              oss: this.form.oss ? this.form.oss : false,
              ioss: this.form.ioss ? this.form.ioss : false,
              registerCountryCode: this.form.registerCountryCode,
              tfnCountryCode: this.form.tfnCountryCode ? this.form.tfnCountryCode.toString() : '',
              otherEcAcqPrice: this.showRegisterCountryCode ? this.resultData.otherEcAcqPrice : this.resultData.purchaseAmount,
              eurOtherEcAcqPrice: this.resultData.otherEcAcqPrice,
              otherEcAcqPriceFile: this.fileFormat(this.form.ecAcqFilePath), //
              freePurchaseFile: this.fileFormat(this.form.freePurchaseFile), // 欧盟内免税采购项文件）
              freePurchasePrice: this.form.freePurchasePrice, // （欧盟内免税采购项金额）
              isEcl: this.form.ecl,
              eclSalePrice: this.resultData.eclSales,
              eclPurchasePrice: this.resultData.eclPurchaseAmount,
              includeTaxPrice: this.resultData.includeTaxSales,
              inputTax: this.resultData.inputTax,
              paidExcludeTaxSales: this.resultData.excludeTaxSales,
              excludeTaxPrice: this.form.countryCode == 'GB' ? this.resultData.handExcludeTaxSales : this.resultData.excludeTaxSales,
              inputTax: this.resultData.inputTax,
              exportExclTaxAmount: this.resultData.exportExclTaxAmount,
              enPvaAmount: this.resultData.enPvaAmount,
              awsExcludeTaxSales: this.resultData.awsExcludeTaxSales,
              awsHandExcludeTaxSales: this.showRegisterCountryCode ? this.resultData.notAwsExcludeTaxSales : this.resultData.awsHandExcludeTaxSales,
              exportExcludeTaxSales: this.resultData.exitAwsExcludeTaxSales,
              supplySalesExcludeTaxAmount: this.resultData.supplySalesExcludeTaxAmount,
              irelandToEuExcludeSell: this.resultData.irelandToEuExcludeSell,
              fcTransferArriExcludeSale: this.resultData.fcTransferArriExcludeSale,
              fcTransferSendExcludeSale: this.resultData.fcTransferSendExcludeSale,
              comminglingBuySale: this.resultData.comminglingBuySale,
              comminglingSellSale: this.resultData.comminglingSellSale,
              euToIrelandExcludeSell: this.resultData.euToIrelandExcludeSell,
              priceOfItemsVatRatePercent: this.resultData.priceOfItemsVatRatePercent,
              deductionPrice: this.resultData.discountAmount,
              taxAmtTotal: this.resultData.outputTax,
              noPayExcludeTaxSales: this.resultData.noPayExcludeTaxSales,
              exportExclTaxAmount: this.resultData.exportExclTaxAmount,
              homeCountryB2bSupplySalesExcludeTaxAmount: this.resultData.homeCountryB2bSupplySalesExcludeTaxAmount,
              eurB2bExcludeTaxSales: this.resultData.eurB2bExcludeTaxSales,
              defTaxableAmount: this.resultData.defTaxableAmount,
              agentTaxPrice: this.resultData.platformWithholdandremitTax,
              excludeTaxB2bPrice: this.b2bNoPrice,
              allTaxPrice: this.resultData.tax,
              frenchDeferredFlag: this.form.countryCode === 'FR' ? this.form.frenchDeferredFlag : 0,
              declareIossDetailDTOS: this.declareIossDetailDTOS.length > 0 ? this.declareIossDetailDTOS : [],
              eurOtherB2bExcludeTaxSales: this.form.eurOtherB2bExcludeTaxSales,
              salesDataFile: this.form.salesDataFile,
              transactionSellerVatNumber: this.resultData.transactionSellerVatNumberSet,
            };
            // 西班牙有ecl申报才传 后台决定的
            if (this.form.ecl === true) {
              params.eclPurchaseItems = this.form.eclPurchaseItems;
              params.eclSaleItems = this.form.eclSaleItems;
            }
            if (this.form.taxDeductionDtos.length > 0) {
              params.deductionItems = this.listItem;
            }

            if (this.form.countryCode === 'GB') {
              params.gbDeclareExtra = this.resultData.taxResult;
            }

            if (this.form.countryCode === 'FR' && this.form.frenchDeferredFlag == 1) {
              params.frenchDeferredDTO = {
                customsNumber: this.form.frenchDeferredDTO.customsNumber,
                deferredFilePath: this.fileFormat(this.form.frenchDeferredDTO.deferredFileList),
                startDate: this.form.frenchDeferredDTO.startDate,
                taxableAmount: this.form.frenchDeferredDTO.taxableAmount,
              };
            } else {
              params.frenchDeferredDTO = null;
            }
            this.submitDeclare(params);
          }
        });
    },

    /** 计算税金 */
    async computeBtn(options = { zeroCommit: false }) {
      if (this.euInputCondition() == false) return;
      if (!this.form.salePlatformType.length) {
        this.$message.warning('请选择销售平台');
        return;
      }
      if (this.form.salePlatformType.includes(0) && !this.form.filePath.length && !this.form.handIncludeTaxSalesFilePath.length) {
        this.$message.warning('请上传销售文件');
        return;
      }
      if (this.form.salePlatformType.includes(1)) {
        if (this.isIOSS) {
          await this.handleSubmitOtherSell();
        } else {
          this.addOtherSubmit();
        }
      }
      this.declareIossDetailDTOS = [];
      this.$refs.formRef &&
        this.$refs.formRef.validate((valid) => {
          if (valid) {
            // if (!this.form.handIncludeTaxSalesFilePath.length > 0 && !this.isIOSS && !this.form.filePath.length > 0) {
            // if (!this.form.filePath.length && !this.form.handIncludeTaxSalesFilePath.length) {
            //   this.$message.warning('请上传销售文件');
            //   return;
            // }
            this.listItem = [];
            this.form.taxDeductionDtos.map((item) => {
              this.listItem.push({
                deductionFile: item.deductionFile.map((v) => v.url).join(','),
                fileOriginalName: item.deductionFile.map((v) => v.name).join(','),
                billDate: item.billDate,
                deductionAmt: item.deductionAmt,
                deductionType: item.deductionType,
              });
            });
            let params = {
              ...options,
              ...this.form,
              salePlatformType: this.form.salePlatformType[0],
              ...this.getOtherData(),
              handPlatformWithHoldandRemitTax: this.form.handPlatformWithHoldandRemitTax ? this.form.handPlatformWithHoldandRemitTax : undefined,
              taxRate: this.form.taxRate ? this.form.taxRate.replace('%', '') / 100 : '',
              ecAcqFilePath: this.fileFormat(this.form.ecAcqFilePath),
              filePath: this.getFilePath(),
              sellFile: this.fileFormat(this.form.sellFile),
              taxDeductionDtos: this.listItem,
              iossCalu: this.isIOSS,
              eurOtherEcAcqPrice: this.form.ecAcqPrice,
              eurOtherEcAcqFile: this.fileFormat(this.form.ecAcqFilePath),
              deferredFilePath: this.form.countryCode === 'FR' && this.form.frenchDeferredFlag == 1 ? this.fileFormat(this.form.deferredFileList) : '',
              handIncludeTaxSales: this.form.handIncludeTaxSales ? this.form.handIncludeTaxSales : 0,
              workOrderId: this.id,
            };
            // if (['SA', 'AE', 'EU'].includes(this.form.countryCode)) {
            params.beginTime = this.taxData.beginTime;
            params.endTime = this.taxData.endTime;
            // }
            this.computeLoading = true;
            caluTax(params)
              .then((res) => {
                if (res.code === 0) {
                  this.$message.success('计算成功');
                  this.isCheckTax = true;
                  this.resultData = res.data;
                  this.taxPriceDetailDtos = res.data.taxPriceDetailDtos;
                  this.declareIossDetailDTOS = res.data.declareIossDetailDTOS.length > 0 ? res.data.declareIossDetailDTOS : [];
                  this.b2bNoPrice = this.resultData.b2bExcludeTaxSales + this.resultData.notVatNumberB2bExcludeTaxSales;
                  this.calculateResultDialog = true;
                }
              })
              .catch((res) => {
                if (res.code === 1001) {
                  if (res.data === 1) {
                    this.$message.closeAll();
                    this.showTipDialog = true;
                    this.tipMessage = res.message;
                  } else if (res.data === 2) {
                    this.$message.closeAll();
                    this.reconfirm({ data: res.data, message: res.message });
                  }
                }
              })
              .finally(() => {
                this.computeLoading = false;
              });
          }
        });
    },
    reconfirm({ message }) {
      this.$confirm(message, '提示', {
        customClass: 'custom-confirm',
        confirmButtonText: '确认无误，继续算税',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        this.computeBtn({ zeroCommit: true });
      });
    },
    getFilePath() {
      // 报税方式：有数据，销售平台：非亚马逊时 没有销售文件
      return this.form.declareRule === 1 && this.form.salePlatformType.includes(0) ? this.fileFormat(this.form.filePath) : '';
    },
    getOtherData() {
      // 格式化其他平台数据
      let obj = {
        handExIncludeTaxSales: this.form.handExIncludeTaxSales || 0,
        handExPlatformWithHoldandRemitTax: this.form.handExPlatformWithHoldandRemitTax || 0,
        otherExIncludeTaxAmt: this.form.otherExIncludeTaxAmt || 0,
        eurOtherB2bExcludeTaxSales: this.form.eurOtherB2bExcludeTaxSales || 0,
      };
      if (this.form.salePlatformType.includes(1)) {
        return {
          ...obj,
          handIncludeTaxSalesFilePath: this.fileFormat(this.form.handIncludeTaxSalesFilePath),
        };
      } else {
        const objArr = Object.entries(obj);
        objArr.forEach((item) => {
          item[1] = 0;
        });
        return {
          ...Object.fromEntries(objArr),
          handIncludeTaxSalesFilePath: '',
        };
      }
    },
    // ioss
    handleSubmitOtherSell() {
      return new Promise((resolve) => {
        // 校验含税销售额和文件必须上传
        if (!this.otherOmCountryList.some((item) => Number(item.sales) > 0)) {
          this.$message.warning('欧盟国家含税销售额至少填一项');
          return;
        }
        if (!this.form.handIncludeTaxSalesFilePath.length > 0) {
          this.$message.warning('其他平台含税销售文件不能为空');
          return;
        }

        // 过滤出欧盟国家中所有含税销售额大于0的
        this.form.otherPlatformSaleDto = [];
        this.otherOmCountryList.forEach((v) => {
          if (Number(v.sales) > 0) {
            this.form.otherPlatformSaleDto.push({
              ...v,
            });
          }
        });
        this.otherSaleFileUrl = this.form.handIncludeTaxSalesFilePath.map((item) => item.url).join(',');
        resolve();
      });
    },
    fileFormat(file) {
      if (file) {
        return file.map((item) => item.url).join(',');
      } else {
        return '';
      }
    },
    handleClose() {
      this.handIncludeTaxSales = '';
      this.form.handIncludeTaxSales = '';
    },
    closeFile() {
      this.otherSaleFileUrl = '';
      this.form.handIncludeTaxSalesFilePath = [];
    },
    handleIossClose(item) {
      this.form.otherPlatformSaleDto.splice(this.form.otherPlatformSaleDto.indexOf(item), 1);
      this.otherOmCountryList.forEach((country) => {
        if (country.countryCode === item.countryCode && country.countryName === item.countryName) {
          country.sales = 0;
        }
      });
    },

    /**
     * 获取国家下拉框数据
     */
    getCountry() {
      getCountrySelectList().then((res) => {
        this.countrySelectList = res.data;
        this.declareTax = this.countrySelectList.find((item) => item.countryCode === this.form.countryCode).declareTax.split(',');
      });
    },
    addOtherSubmit() {
      this.handIncludeTaxSales = this.form.handIncludeTaxSales;
      this.otherSaleFileUrl = this.form.handIncludeTaxSalesFilePath.map((item) => item.url).join(',');
    },
    // 添加抵扣项
    addItem() {
      this.form.taxDeductionDtos.push({
        billDate: '',
        deductionAmt: '',
        deductionFile: [],
        deductionType: '',
      });
    },
    // 删除抵扣项
    delItem(index) {
      this.form.taxDeductionDtos.splice(index, 1);
    },
    // 添加销售项
    addSale() {
      this.form.eclSaleItems.push({
        taxAmt: '',
        taxNumber: '',
        // purchaseTime:'',
        // purchaser:''
      });
    },
    // 删除销售项
    deleteSale(index) {
      this.form.eclSaleItems.splice(index, 1);
      this.clacuSellAmount();
    },
    // 手动添加销售项
    computedSale() {
      if (this.form.eclSaleItems.some((item) => item.taxAmt === '')) {
        this.$message.warning('销售金额不能为空！');
        return;
      }
      if (this.form.eclSaleItems.some((item) => !item.taxNumber)) {
        this.$message.warning('税号不能为空！');
        return;
      }

      this.saleDialog = false;
      this.clacuSellAmount();
    },
    // 手动添加采购项确认
    computedPurchase() {
      if (this.form.eclPurchaseItems.some((item) => item.taxAmt === '')) {
        this.$message.warning('采购金额不能为空！');
        return;
      }
      if (this.form.eclPurchaseItems.some((item) => !item.taxNumber)) {
        this.$message.warning('税号不能为空！');
        return;
      }
      this.purchaseDialog = false;
      this.purchaseAmount();
    },

    // 计算销售额
    clacuSellAmount() {
      let eclSalePrice = 0;
      this.form.eclSaleItems.forEach((v) => {
        if (v.taxAmt) {
          eclSalePrice += this.$util.toDecimalRound(v.taxAmt);
        }
      });
      this.eclSalePriceTotal = this.$util.toDecimalRound(eclSalePrice);
    },
    // 计算采购项金额
    purchaseAmount() {
      let eclPurchasePrice = 0;
      this.form.eclPurchaseItems.forEach((v) => {
        if (v.taxAmt) {
          eclPurchasePrice += this.$util.toDecimalRound(v.taxAmt);
        }
      });
      this.eclPurchasePriceTotal = this.$util.toDecimalRound(eclPurchasePrice);
    },

    // 添加采购项
    addPurchase() {
      this.form.eclPurchaseItems.push({
        taxAmt: '',
        taxNumber: '',
        // purchaseTime:'',
        // purchaser:''
      });
    },
    // 删除采购项
    deletePurchase(index) {
      this.form.eclPurchaseItems.splice(index, 1);
      this.purchaseAmount();
    },
    // 返回列表页
    goBack() {
      window.history.back();
    },
    // 获取税金确认单
    getTaxAffirmForms() {
      taxConfirm({ workId: this.id }).then((res) => {
        if (JSON.stringify(res.data) !== '{}') {
          this.form.taxAffirmForms = res.data;
        }
      });
    },
    // 下载税确
    getTaxConfirmFunc() {
      let requestData = {
        agentTaxPrice: this.form.countryCode == 'GB' ? this.resultData.handExcludeTaxSales : this.showRegisterCountryCode ? this.resultData.excludeTaxSales : this.resultData.platformWithholdandremitTax,
        allTaxPrice: this.resultData.tax,
        declareRule: this.form.declareRule,
        deductionPrice: Number(this.resultData.discountAmount) + Number(this.resultData.enPvaAmount),
        excludeTaxPrice: this.showRegisterCountryCode ? this.resultData.noPayExcludeTaxSales : this.resultData.excludeTaxSales,
        freePurchasePrice: this.form.freePurchasePrice,
        includeTaxPrice: this.resultData.includeTaxSales,
        otherEcAcqPrice: this.showRegisterCountryCode ? this.resultData.otherEcAcqPrice : this.resultData.purchaseAmount,
        taxAmtTotal: this.resultData.outputTax,
        discountAmount: this.resultData.discountAmount,
        irelandToEuExcludeSell: this.resultData.irelandToEuExcludeSell,
        euToIrelandExcludeSel: this.resultData.euToIrelandExcludeSel,
        priceOfItemsVatRatePercent: this.resultData.priceOfItemsVatRatePercent,
        otherExIncludeTaxAmt: this.resultData.otherExIncludeTaxAmt,
        inputTax: this.resultData.inputTax,
        eurB2bExcludeTaxSales: this.resultData.eurB2bExcludeTaxSales,
        supplySalesExcludeTaxAmount: this.resultData.supplySalesExcludeTaxAmount,
        awsHandExcludeTaxSales: this.resultData.awsHandExcludeTaxSales,
        awsExcludeTaxSales: this.resultData.awsExcludeTaxSales,
        exportExcludeTaxSales: this.resultData.exportExcludeTaxSales,
        euToIrelandExcludeSell: this.resultData.euToIrelandExcludeSell,
        exportExclTaxAmount: this.resultData.exportExclTaxAmount,
        taxRate: JSON.stringify(this.resultData.taxRate) === '{}' ? 0 : this.resultData.taxRate,
        workId: this.id,
      };
      this.$util.downFile(this.baseUrl + `/workorder/management/download/taxConfirmation`, undefined, undefined, 'POST', JSON.stringify(requestData));

      // taxConfirmationApi(requestData).then((res) => {
      //   if (JSON.stringify(res.data) !== "{}") {
      //     this.$util.exporDdf(res);
      //   }
      // });
    },
  },
  mounted() {
    if (!['GB', 'SA', 'AE'].includes(this.form.countryCode)) {
      this.form.tfnCountryCode.push(this.countryCode);
      this.$nextTick(() => {
        const medicalAdviceRefDom = document.getElementById('medicalAdviceRef');
        if (medicalAdviceRefDom) {
          const coloseDom = medicalAdviceRefDom.querySelector('.el-select__tags').querySelectorAll('.el-icon-close')[0];
          if (coloseDom) coloseDom.style.display = 'none';
        }
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.header-info {
  display: grid;
  grid-template-columns: repeat(2, 50%);
  padding-bottom: 20px;
  font-size: 14px;
}
.header-info > .left {
  > div {
    height: 30px;
    line-height: 30px;
  }
}
.header-info > .right {
  > div {
    height: 30px;
    line-height: 30px;
  }
}
.app-container {
  // min-width: 1200px;
  // display: flex;
  // width: 300px;
  height: 100%;
}
.header-container {
  // flex: 1;
  // height: calc(100vh - 130px);
  height: calc(100% - 60px);
  margin: 0;
  // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow-y: scroll;
  padding: 0 10px 0 0;
  position: relative;
  .add-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
.fixed-btn {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  // position: fixed;
  bottom: 20px;
  // width: calc(50% - 170px);
  height: 50px;
  background-color: #fff;
  border-top: 1px solid #eee;
  z-index: 100;
  & > el-button {
    float: right;
  }
}
.table {
  max-height: 500px;
  // overflow-y: scroll;
  margin: 20px 0;
}
.promptBg {
  background: #fff1dd;
  padding: 10px;
  margin-bottom: 15px;
}
.el-icon-circle-plus,
.el-icon-remove {
  vertical-align: middle;
  font-size: 26px;
  cursor: pointer;
}
.el-icon-circle-plus {
  color: #52c41a;
}
.el-icon-remove {
  color: #e72f23;
}
.text-info {
  font-weight: bold;
  font-size: 14px;
}
.data-block {
  background-color: #f5f5f5;
  padding: 10px;
}
</style>
