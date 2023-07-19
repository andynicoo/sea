<template>
  <div class="stepH stepAE">
    <div class="title">公司信息</div>
    <Form :model="formLeft"
          class="formstyle inputHFlex"
          ref="formLeft"
          :rules="ruleForm">
      <div class="item-content">
        <Row>
          <Col :span="8">
          <FormItem label="开店主体"
                    class="requiredItem"
                    style="width:300px"
                    prop="shopNature">
            <RadioGroup v-model="formLeft.shopNature">
              <Radio :disabled="notChange"
                     label="1">公司主体（含个体工商户）</Radio>
            </RadioGroup>
          </FormItem>
          </Col>
          <Col :span="8">
          <FormItem label="公司类型"
                    v-if="formLeft.shopNature === '1'"
                    style="width:300px"
                    class="requiredItem"
                    prop="companyType">
            <RadioGroup v-model="formLeft.companyType">
              <Radio :disabled="notChange"
                     label="1">大陆公司</Radio>
              <Radio :disabled="notChange"
                     label="2">香港公司</Radio>
            </RadioGroup>
          </FormItem>
          </Col>

        </Row>
        <Row>
          <Col :span="8">
          <FormItem v-if="formLeft.shopNature === '1'&&formLeft.companyType==='1'"
                    label="营业执照扫描件："
                    style="margin-bottom:15px;width:300px"
                    class="flex-direction requiredItem"
                    prop="companyBusinessLicense">
            <Upload :before-upload="beforeUploadHandler"
                    :on-format-error="formatErrorHandler"
                    :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessLicense')}"
                    :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyBusinessLicense')}"
                    :action="ImgUrl"
                    :max-size="102400"
                    :class="{'notChange': notChange}"
                    :on-exceeded-size="handleMaxSize"
                    :data="{prefix:''}"
                    :show-upload-list="false"
                    :format="['jpg','jpeg','png','pdf']"
                    :disabled="notChange">
              <div class="inner"
                   @click="beforType('companyBusinessLicense')">
                <img class="uplad-symbol"
                     src="@/assets/images/common/uploadIcon1.png"
                     alt="">
                <span class="uplad-word">点击上传</span>
              </div>
            </Upload>
            <div class="out-img-box"
                 v-if="formLeft.companyBusinessLicense !==''">
              <div class="inner img-box">
                <a :href="formLeft.companyBusinessLicense"
                   target="_blank"
                   class="show-pdf">
                  营业执照扫描件
                </a>
                <Button class="deletBtn">
                  <img @click="removeHandler(1,1,'companyBusinessLicense')"
                       class="closeImg"
                       v-if="!notChange"
                       src="@/assets/images/common/activeCloseImg.png"
                       alt="">
                </Button>
              </div>
            </div>
            <p style="font-size: 14px;font-weight: 400;color: #FBB73C;">注：支持JPG、JPEG、PNG、PDF格式上传</p>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="8">
          <FormItem label="商业登记证BR"
                    v-if="formLeft.shopNature === '1'&&formLeft.companyType==='2'"
                    style="margin-bottom:15px;width:300px"
                    class="flex-direction requiredItem"
                    prop="companyBusinessRegistrationBr">
            <Upload :before-upload="beforeUploadHandler"
                    :on-format-error="formatErrorHandler"
                    :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessRegistrationBr')}"
                    :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyBusinessRegistrationBr')}"
                    :action="ImgUrl"
                    :data="{prefix:''}"
                    :class="{'notChange': notChange}"
                    :show-upload-list="false"
                    :format="['jpg','jpeg','png','pdf']"
                    :max-size="102400"
                    :on-exceeded-size="handleMaxSize"
                    :disabled="notChange">
              <div class="inner"
                   @click="beforType('companyBusinessRegistrationBr')">
                <img class="uplad-symbol"
                     src="@/assets/images/common/uploadIcon1.png"
                     alt="">
                <span class="uplad-word">点击上传</span>
              </div>
            </Upload>
            <div class="out-img-box"
                 v-if="formLeft.companyBusinessRegistrationBr !==''">
              <div class="inner img-box">
                <a :href="formLeft.companyBusinessRegistrationBr"
                   target="_blank"
                   class="show-pdf">
                  商业登记证BR
                </a>
                <Button class="deletBtn">
                  <img @click="removeHandler(1,1,'companyBusinessRegistrationBr')"
                       class="closeImg"
                       v-if="!notChange"
                       src="@/assets/images/common/activeCloseImg.png"
                       alt="">
                </Button>
              </div>
            </div>
            <div class="upload-tip">
              <a href="https://fdfs.itaxs.com/group1/M00/00/26/rBLKNV60_dOACF2FAALt-Hjd_Jk072.png"
                 target="_blank">
                <img src="@/assets/images/common/searchImg.png"
                     alt="">
                查看示例
              </a>
            </div>
            <p style="font-size: 14px;font-weight: 400;color: #FBB73C;">注：支持JPG、JPEG、PNG、PDF格式上传</p>
          </FormItem>
          </Col>
          <Col :span="8">
          <FormItem label="公司注册证明书CI"
                    v-if="formLeft.shopNature === '1'&&formLeft.companyType==='2'"
                    style="margin-bottom:15px;width:300px"
                    class="flex-direction requiredItem"
                    prop="companyRegistrationCi">
            <Upload :before-upload="beforeUploadHandler"
                    :on-format-error="formatErrorHandler"
                    :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyRegistrationCi')}"
                    :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyRegistrationCi')}"
                    :action="ImgUrl"
                    :data="{prefix:''}"
                    :class="{'notChange': notChange}"
                    :show-upload-list="false"
                    :format="['jpg','jpeg','png','pdf']"
                    :max-size="102400"
                    :on-exceeded-size="handleMaxSize"
                    :disabled="notChange">
              <div class="inner"
                   @click="beforType('companyRegistrationCi')">
                <img class="uplad-symbol"
                     src="@/assets/images/common/uploadIcon1.png"
                     alt="">
                <span class="uplad-word">点击上传</span>
              </div>
            </Upload>
            <div class="out-img-box"
                 v-if="formLeft.companyRegistrationCi !==''">
              <div class="inner img-box">
                <a :href="formLeft.companyRegistrationCi"
                   target="_blank"
                   class="show-pdf">
                  公司注册证明书CI
                </a>
                <Button class="deletBtn">
                  <img @click="removeHandler(1,1,'companyRegistrationCi')"
                       class="closeImg"
                       v-if="!notChange"
                       src="@/assets/images/common/activeCloseImg.png"
                       alt="">
                </Button>
              </div>
            </div>
            <div class="upload-tip">
              <a href="https://fdfs.itaxs.com/group1/M00/00/26/rBLKNV60_kyADlfrAAJWob8GDgQ847.png"
                 target="_blank">
                <img src="@/assets/images/common/searchImg.png"
                     alt="">
                查看示例
              </a>
            </div>
            <p style="font-size: 14px;font-weight: 400;color: #FBB73C;">注：支持JPG、JPEG、PNG、PDF格式上传</p>
          </FormItem>
          </Col>
          <Col :span="8">
          <FormItem label="法团成立表格NNC1"
                    v-if="formLeft.shopNature === '1'&&formLeft.companyType==='2'"
                    style="margin-bottom:15px;width:300px"
                    class="flex-direction requiredItem"
                    prop="companyCorporateFoundingNnc1">
            <Upload :before-upload="beforeUploadHandler"
                    :on-format-error="formatErrorHandler"
                    :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyCorporateFoundingNnc1')}"
                    :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyCorporateFoundingNnc1')}"
                    :action="ImgUrl"
                    :data="{prefix:''}"
                    :class="{'notChange': notChange}"
                    :show-upload-list="false"
                    :format="['jpg','jpeg','png','pdf']"
                    :max-size="102400"
                    :on-exceeded-size="handleMaxSize"
                    :disabled="notChange">
              <div class="inner"
                   @click="beforType('companyCorporateFoundingNnc1')">
                <img class="uplad-symbol"
                     src="@/assets/images/common/uploadIcon1.png"
                     alt="">
                <span class="uplad-word">点击上传</span>
              </div>
            </Upload>
            <div class="out-img-box"
                 v-if="formLeft.companyCorporateFoundingNnc1 !==''">
              <div class="inner img-box">
                <a :href="formLeft.companyCorporateFoundingNnc1"
                   target="_blank"
                   class="show-pdf">
                  法团成立表格NNC1
                </a>
                <Button class="deletBtn">
                  <img @click="removeHandler(1,1,'companyCorporateFoundingNnc1')"
                       class="closeImg"
                       v-if="!notChange"
                       src="@/assets/images/common/activeCloseImg.png"
                       alt="">
                </Button>
              </div>
            </div>
            <div class="upload-tip">
              <a href="https://fdfs.itaxs.com/group1/M00/00/26/rBLKNV61AOOAaaUDAAMDXiZXCZo609.png"
                 target="_blank">
                <img src="@/assets/images/common/searchImg.png"
                     alt="">
                查看示例
              </a>
            </div>
            <p style="font-size: 14px;font-weight: 400;color: #FBB73C;">注：支持JPG、JPEG、PNG、PDF格式上传</p>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="8">
          <FormItem label="公司中文名称："
                    class="requiredItem requiredItem"
                    prop="companyNameZh"
                    style="width:300px">
            <AutoComplete v-model="formLeft.companyNameZh"
                          :data="lenovoSearchList"
                          @on-select="selectCompany"
                          placeholder="请输入公司中文名称"
                          :disabled="notChange">
            </AutoComplete>
          </FormItem>
          </Col>
          <Col :span="8">
          <FormItem label="社会统一信用代码："
                    class="requiredItem"
                    prop="companyCreditCode"
                    style="width:300px">
            <Input v-model="formLeft.companyCreditCode"
                   placeholder="请填写社会统一信用代码"
                   :disabled="notChange"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="8">
          <FormItem label="其它股东护照/身份证（选填）"
                    style="margin-bottom:15px;width:300px"
                    prop="companyShareholderPassportCard"
                    class="flex-direction">
            <Upload :before-upload="beforeUploadHandler"
                    :on-format-error="formatErrorHandler"
                    :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyShareholderPassportCard')}"
                    :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyShareholderPassportCard')}"
                    :action="ImgUrl"
                    :data="{prefix:''}"
                    :class="{'notChange': notChange}"
                    :show-upload-list="false"
                    :format="['jpg','jpeg','png','pdf']"
                    :max-size="102400"
                    :on-exceeded-size="handleMaxSize"
                    :disabled="notChange">
              <div class="inner"
                   @click="beforType('companyShareholderPassportCard')">
                <img class="uplad-symbol"
                     src="@/assets/images/common/uploadIcon1.png"
                     alt="">
                <span class="uplad-word">点击上传</span>
              </div>
            </Upload>
            <div class="out-img-box"
                 v-if="formLeft.companyShareholderPassportCard !==''">
              <div class="inner img-box">
                <a :href="formLeft.companyShareholderPassportCard"
                   target="_blank"
                   class="show-pdf">
                  其它股东护照/身份证
                </a>
                <Button class="deletBtn">
                  <img @click="removeHandler(1,1,'companyShareholderPassportCard')"
                       class="closeImg"
                       v-if="!notChange"
                       src="@/assets/images/common/activeCloseImg.png"
                       alt="">
                </Button>
              </div>
            </div>
            <p style="font-size: 14px;font-weight: 400;color: #FBB73C;">注：如有多个股东，则全部需要提供</p>
          </FormItem>
          </Col>
          <Col :span="8">
          <FormItem label="公司章程："
                    style="margin-bottom:15px;width:300px"
                    class="flex-direction requiredItem"
                    prop="articlesOfAssociationFile">
            <Upload :before-upload="beforeUploadHandler"
                    :on-format-error="formatErrorHandler"
                    :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'articlesOfAssociationFile')}"
                    :on-remove="(file,fileList)=>{removeHandler (file,fileList,'articlesOfAssociationFile')}"
                    :action="ImgUrl"
                    :data="{prefix:''}"
                    :class="{'notChange': notChange}"
                    :max-size="102400"
                    :on-exceeded-size="handleMaxSize"
                    :show-upload-list="false"
                    :format="['jpg','jpeg','png','pdf']"
                    :disabled="notChange">
              <div class="inner"
                   @click="beforType('articlesOfAssociationFile')">
                <img class="uplad-symbol"
                     src="@/assets/images/common/uploadIcon1.png"
                     alt="">
                <span class="uplad-word">点击上传</span>
              </div>
            </Upload>
            <div class="out-img-box"
                 v-if="formLeft.articlesOfAssociationFile !==''">
              <div class="inner img-box">
                <a :href="formLeft.articlesOfAssociationFile"
                   target="_blank"
                   class="show-pdf">
                  公司章程
                </a>
                <Button class="deletBtn">
                  <img @click="removeHandler(1,1,'articlesOfAssociationFile')"
                       class="closeImg"
                       v-if="!notChange"
                       src="@/assets/images/common/activeCloseImg.png"
                       alt="">
                </Button>
              </div>
            </div>
            <span class="upload-tip">
              <a href="https://fdfs.itaxs.com/group1/M00/00/D9/rBLKNV76uDyAKHiMABP9OydONxQ380.pdf"
                 target="_blank"><img class="uplad-symbol"
                     src="@/assets/images/common/searchImg.png"
                     alt=""> 查看示例
              </a>
            </span>
            <p style="font-size: 14px;font-weight: 400;color: #FBB73C;">注：支持JPG、JPEG、PNG、PDF格式上传</p>
          </FormItem>

          </Col>

        </Row>
      </div>
      <div class="title">公司股份情况</div>
      <div class="item-content">
        <Row>
          <Col :span="24">
          <FormItem label=""
                    prop="companyStockCondition"
                    class="requiredItem companyShare"
                    style="width:100%;">
            <div class="sharesContainer">
              <div class="shares-box"
                   v-for="(item,index) in sharesList"
                   :key="index">
                <Form :model="item"
                      style="">
                  <FormItem label="股东姓名："
                            prop="shareholderZhName">
                    <Input v-model="item.shareholderZhName"
                           placeholder="中文名"
                           :disabled="notChange"
                           style="width:45%;"></Input>
                    <Input v-model="item.shareholderEnName"
                           placeholder="英文名"
                           :disabled="notChange"
                           style="width:45%;margin-left:10px;"></Input>
                  </FormItem>
                  <FormItem label="占股百分比："
                            prop="stockProportion">
                    <Input v-model.number="item.stockProportion"
                           placeholder="占股百分比"
                           :disabled="notChange"
                           style="min-width:294px;"
                           type="number"
                           step="0.1">
                    <span slot="append">%</span>
                    </Input>
                  </FormItem>
                  <FormItem label="分红比例："
                            prop="shareholderBonusScale">
                    <Input v-model="item.shareholderBonusScale"
                           placeholder="分红比例"
                           :disabled="notChange"
                           style="min-width:294px;"
                           type="number"
                           step="0.1">
                    <span slot="append">%</span>
                    </Input>
                  </FormItem>
                  <Button v-if="index>0&&!notChange"
                          style="color: #57a3f3;background-color: #fff;border-color: #57a3f3;margin-top:15px;"
                          @click="removeShares(index)">删除</Button>

                </Form>
              </div>
            </div>
            <p class="shares-tips">温馨提示：请详细填写完整的公司股份占比信息；</p>
            <Button style="color: #57a3f3;background-color: #fff;border-color: #57a3f3;margin-left:20px;"
                    @click="addShares">+添加</Button>
          </FormItem>
          </Col>
        </Row>
      </div>
      <div class="title">法人信息</div>
      <div class="item-content">
        <Row>
          <Col :span="8">
          <FormItem label="证件类型"
                    style="width:300px"
                    class="requiredItem">
            <RadioGroup v-model="formLeft.certificateType">
              <Radio :disabled="notChange"
                     label="2">护照</Radio>
            </RadioGroup>
          </FormItem>
          </Col>
          <Col :span="8">
          <FormItem label="法人护照扫描件"
                    style="margin-bottom:15px;width:300px"
                    class="flex-direction requiredItem"
                    prop="companyLegalPersonCardPassport">
            <Upload :before-upload="beforeUploadHandler"
                    :on-format-error="formatErrorHandler"
                    :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyLegalPersonCardPassport')}"
                    :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyLegalPersonCardPassport')}"
                    :action="ImgUrl"
                    :data="{prefix:''}"
                    :show-upload-list="false"
                    :class="{'notChange': notChange}"
                    :format="['jpg','jpeg','png','pdf']"
                    :max-size="102400"
                    :on-exceeded-size="handleMaxSize"
                    :disabled="notChange">
              <div class="inner"
                   @click="beforType('companyLegalPersonCardPassport')">
                <img class="uplad-symbol"
                     src="@/assets/images/common/uploadIcon1.png"
                     alt="">
                <span class="uplad-word">点击上传</span>
              </div>
            </Upload>
            <div class="out-img-box"
                 v-if="formLeft.companyLegalPersonCardPassport !==''">
              <div class="inner img-box">
                <a :href="formLeft.companyLegalPersonCardPassport"
                   target="_blank"
                   class="show-pdf">
                  法人护照扫描件
                </a>
                <Button class="deletBtn">
                  <img @click="removeHandler(1,1,'companyLegalPersonCardPassport')"
                       class="closeImg"
                       v-if="!notChange"
                       src="@/assets/images/common/activeCloseImg.png"
                       alt="">
                </Button>
              </div>
            </div>
            <p style="font-size: 14px;font-weight: 400;color: #FBB73C;">注：支持JPG、JPEG、PNG、PDF格式上传</p>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="8">
          <FormItem label="法人中文姓名"
                    class="requiredItem"
                    prop="companyLegalPersonZh"
                    style="width:300px">
            <Input v-model="formLeft.companyLegalPersonZh"
                   placeholder="请填写法人中文姓名"
                   :disabled="notChange"></Input>
          </FormItem>
          </Col>
          <Col :span="8">
          <FormItem label="法人英文姓名"
                    class="requiredItem"
                    style="width:300px"
                    prop="companyLegalPersonEn">
            <Input v-model="formLeft.companyLegalPersonEn"
                   placeholder="请用拼音输入"
                   :disabled="notChange"></Input>
            <p style="font-size: 14px;font-weight: 400;color: #FBB73C;line-height: 18px;margin-top: 10px;">注：法人英文名称必须与护照上的英文名称填写一致 </p>
          </FormItem>
          </Col>
          <Col :span="8">
          <FormItem label="法人出生日期"
                    class="requiredItem"
                    style="width:300px"
                    prop="companyLegalPersonBirthday">
            <DatePicker type="date"
                        placeholder="请选择法人出生日期"
                        v-model="formLeft.companyLegalPersonBirthday"
                        format="yyyy-MM-dd"
                        class="tax-date"
                        :options="optionsDate"
                        :disabled="notChange"></DatePicker>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="8">
          <FormItem label="法人联系电话："
                    prop="companyLegalPersonMobile"
                    style="width:300px">
            <Input v-model="formLeft.companyLegalPersonMobile"
                   placeholder="请输入常用联系手机号"
                   :disabled="notChange"></Input>
          </FormItem>
          </Col>
          <Col :span="8">
          <FormItem label="法人联系邮箱："
                    prop="companyLegalPersonEmail"
                    style="width:300px">
            <Input v-model="formLeft.companyLegalPersonEmail"
                   placeholder="请输入常用联系邮箱"
                   :disabled="notChange"></Input>
          </FormItem>
          </Col>
          <Col :span="8">
          <FormItem label="法人身份证英文地址："
                    prop="companyLegalPersonCardAddress"
                    style="width:300px">
            <Input v-model="formLeft.companyLegalPersonCardAddress"
                   placeholder="请输入法人身份证英文地址"
                   type="textarea"
                   :disabled="notChange"></Input>
            <p style="font-size: 14px;font-weight: 400;color: #FBB73C;line-height: 18px;margin-top: 10px;">注：请用拼音/英语输入身份证地址</p>
          </FormItem>
          </Col>
        </Row>
      </div>
      <div class="title">店铺信息</div>
      <div class="item-content">
        <Row>
          <Col :span="8">
          <FormItem label="是否已有店铺:"
                    prop="isThereShop"
                    style="width:300px"
                    class="requiredItem">
            <RadioGroup v-model="formLeft.isThereShop">
              <Radio label="1"
                     :disabled="notChange">已有店铺</Radio>
              <Radio label="2"
                     :disabled="notChange">无店铺</Radio>
            </RadioGroup>
          </FormItem>
          </Col>
          <Col :span="8">
          <FormItem label="税号生效日期:"
                    prop="shopTaxEffectiveData"
                    style="width:300px">
            <DatePicker type="date"
                        placeholder="请选择税号生效日期"
                        v-model="formLeft.shopTaxEffectiveData"
                        class="tax-date"
                        :disabled="notChange"></DatePicker>
          </FormItem>
          </Col>
          <Col :span="8">
          <FormItem label="预计/实际第一笔订单时间:"
                    prop="firstOrderTime"
                    style="width:300px">
            <DatePicker type="date"
                        placeholder="请选择预计/实际第一笔订单时间"
                        v-model="formLeft.firstOrderTime"
                        class="tax-date"
                        :disabled="notChange"></DatePicker>
            </Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="8">
          <FormItem label="公司英文名称"
                    class="requiredItem"
                    prop="companyNameEn"
                    style="width:300px">
            <Input v-model="formLeft.companyNameEn"
                   placeholder="请输入公司英文名称"
                   :disabled="notChange"></Input>
          </FormItem>
          <p style="font-size: 14px;font-weight: 400;width:300px;color: #FBB73C;line-height: 18px;margin-top: 10px;">注：请根据您的店铺后台英文公司名称进行填写（需保持一致）</p>
          </Col>
          <Col :span="8">
          <FormItem label="公司邮编号码"
                    class="requiredItem"
                    prop="companyPostCode"
                    style="width:300px">
            <Input v-model="formLeft.companyPostCode"
                   placeholder="请输入公司邮编号码"
                   :disabled="notChange"></Input>
          </FormItem>
          </Col>
          <Col :span="8">
          <FormItem label="公司英文地址"
                    class="requiredItem"
                    prop="companyAddressEn"
                    style="width:300px">
            <div style="display:inline-block;">
              <Input type="text"
                     placeholder="国家 如：China"
                     v-model="formLeft.companyAddressEnCountry"
                     :disabled="notChange"
                     style="width:114px;margin-right:8px;margin-left:0px;" />
              <Input type="text"
                     placeholder="城市加省份 如: shenzhenshi guangdong"
                     v-model="formLeft.companyAddressEnCity"
                     :disabled="notChange"
                     style="width:143px;margin-left:0px;" />
            </div>
            <Input v-model="formLeft.companyAddressEn"
                   type="textarea"
                   placeholder="请直接复制后台英文地址"
                   :disabled="notChange"
                   :rows="4"
                   style="margin-top:10px;display:block;" />
            <p style="font-size: 14px;font-weight: 400;color: #FBB73C;line-height: 18px;margin-top: 10px;">注：请根据您的店铺后台英文地址进行填写（需保持一致）</p>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="8">
          <FormItem label="预计未来30天销售额:"
                    prop="future30Sale"
                    style="width:300px"
                    class="requiredItem">
            <Input v-model="formLeft.future30Sale"
                   placeholder=" 请输入预计未来30天销售额"
                   type="number"
                   :disabled="notChange">
            <span slot="append">SAR</span>
            </Input>
          </FormItem>
          <p style="font-size: 14px;width:300px;font-weight: 400;color: #FBB73C;line-height: 18px;margin-top: 10px;">注：预计销售额不低于2000</p>
          </Col>
          <Col :span="8">
          <FormItem label="销售/零销售证明："
                    v-if="formLeft.isThereShop === '1'"
                    style="margin-bottom:15px;width:300px"
                    class="flex-direction requiredItem"
                    prop="salesEvidenceFile">
            <Upload :before-upload="beforeUploadHandler"
                    :on-format-error="formatErrorHandler"
                    :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'salesEvidenceFile')}"
                    :on-remove="(file,fileList)=>{removeHandler (file,fileList,'salesEvidenceFile')}"
                    :action="ImgUrl"
                    :max-size="102400"
                    :class="{'notChange': notChange}"
                    :on-exceeded-size="handleMaxSize"
                    :data="{prefix:''}"
                    :show-upload-list="false"
                    :format="['jpg','jpeg','png','pdf']"
                    :disabled="notChange">
              <div class="inner"
                   @click="beforType('salesEvidenceFile')">
                <img class="uplad-symbol"
                     src="@/assets/images/common/uploadIcon1.png"
                     alt="">
                <span class="uplad-word">点击上传</span>
              </div>
            </Upload>
            <div class="out-img-box"
                 v-if="formLeft.salesEvidenceFile !==''">
              <div class="inner img-box">
                <a :href="formLeft.salesEvidenceFile"
                   target="_blank"
                   class="show-pdf">
                  销售/零销售证明
                </a>
                <Button class="deletBtn">
                  <img @click="removeHandler(1,1,'salesEvidenceFile')"
                       class="closeImg"
                       v-if="!notChange"
                       src="@/assets/images/common/activeCloseImg.png"
                       alt="">
                </Button>
              </div>
            </div>
            <div class="upload-tip">
              <a href="https://pre-fdfs.itaxs.com/group1/M00/00/C2/rBLKLV_CFeaAVDrGAAJNVL5-wow725.pdf"
                 target="_blank">
                <img src="@/assets/images/common/searchImg.png"
                     alt="">
                查看示例
              </a>
            </div>
            <p style="font-size: 14px;font-weight: 400;color: #FBB73C;">注：订单截图/summary报告</p>
          </FormItem>
          </Col>
          <Col :span="8">
          <FormItem label="电商平台协议合同（选填）："
                    style="margin-bottom:15px;width:300px"
                    class="flex-direction">
            <Upload :before-upload="beforeUploadHandler"
                    :on-format-error="formatErrorHandler"
                    :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'shopSalePlatformContract')}"
                    :on-remove="(file,fileList)=>{removeHandler (file,fileList,'shopSalePlatformContract')}"
                    :action="ImgUrl"
                    :max-size="102400"
                    :class="{'notChange': notChange}"
                    :on-exceeded-size="handleMaxSize"
                    :data="{prefix:''}"
                    :show-upload-list="false"
                    :format="['jpg','jpeg','png','pdf']"
                    :disabled="notChange">
              <div class="inner"
                   @click="beforType('shopSalePlatformContract')">
                <img class="uplad-symbol"
                     src="@/assets/images/common/uploadIcon1.png"
                     alt="">
                <span class="uplad-word">点击上传</span>
              </div>
            </Upload>
            <div class="out-img-box"
                 v-if="formLeft.shopSalePlatformContract !==''">
              <div class="inner img-box">
                <a :href="formLeft.shopSalePlatformContract"
                   target="_blank"
                   class="show-pdf">
                  电商平台协议合同
                </a>
                <Button class="deletBtn">
                  <img @click="removeHandler(1,1,'shopSalePlatformContract')"
                       class="closeImg"
                       v-if="!notChange"
                       src="@/assets/images/common/activeCloseImg.png"
                       alt="">
                </Button>
              </div>
            </div>
            <p style="font-size: 14px;font-weight: 400;color: #FBB73C;">注：如平台入驻协议</p>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="8">
          <FormItem label="其它中东国家税号文件（选填）："
                    style="margin-bottom:15px;width:300px"
                    class="flex-direction">
            <Upload :before-upload="beforeUploadHandler"
                    :on-format-error="formatErrorHandler"
                    :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'vatTaxEuFile')}"
                    :on-remove="(file,fileList)=>{removeHandler (file,fileList,'vatTaxEuFile')}"
                    :action="ImgUrl"
                    :max-size="102400"
                    :class="{'notChange': notChange}"
                    :on-exceeded-size="handleMaxSize"
                    :data="{prefix:''}"
                    :show-upload-list="false"
                    :format="['jpg','jpeg','png','pdf']"
                    :disabled="notChange">
              <div class="inner"
                   @click="beforType('vatTaxEuFile')">
                <img class="uplad-symbol"
                     src="@/assets/images/common/uploadIcon1.png"
                     alt="">
                <span class="uplad-word">点击上传</span>
              </div>
            </Upload>
            <div class="out-img-box"
                 v-if="formLeft.vatTaxEuFile !==''">
              <div class="inner img-box">
                <a :href="formLeft.vatTaxEuFile"
                   target="_blank"
                   class="show-pdf">
                  其它中东国家税号文件
                </a>
                <Button class="deletBtn">
                  <img @click="removeHandler(1,1,'vatTaxEuFile')"
                       class="closeImg"
                       v-if="!notChange"
                       src="@/assets/images/common/activeCloseImg.png"
                       alt="">
                </Button>
              </div>
            </div>
            <p style="font-size: 14px;font-weight: 400;color: #FBB73C;">注：如有，则需提供</p>
          </FormItem>
          </Col>
          <Col :span="8">
          <FormItem label="后台店铺截图："
                    v-if="formLeft.isThereShop === '1'"
                    style="margin-bottom:15px;width:300px"
                    class="flex-direction requiredItem"
                    prop="shopConsoleScreenshot">
            <Upload :before-upload="beforeUploadHandler"
                    :on-format-error="formatErrorHandler"
                    :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'shopConsoleScreenshot')}"
                    :on-remove="(file,fileList)=>{removeHandler (file,fileList,'shopConsoleScreenshot')}"
                    :action="ImgUrl"
                    :max-size="102400"
                    :class="{'notChange': notChange}"
                    :on-exceeded-size="handleMaxSize"
                    :data="{prefix:''}"
                    :show-upload-list="false"
                    :format="['jpg','jpeg','png','pdf']"
                    :disabled="notChange">
              <div class="inner"
                   @click="beforType('shopConsoleScreenshot')">
                <img class="uplad-symbol"
                     src="@/assets/images/common/uploadIcon1.png"
                     alt="">
                <span class="uplad-word">点击上传</span>
              </div>
            </Upload>
            <div class="out-img-box"
                 v-if="formLeft.shopConsoleScreenshot !==''">
              <div class="inner img-box">
                <a :href="formLeft.shopConsoleScreenshot"
                   target="_blank"
                   class="show-pdf">
                  后台店铺截图
                </a>
                <Button class="deletBtn">
                  <img @click="removeHandler(1,1,'shopConsoleScreenshot')"
                       class="closeImg"
                       v-if="!notChange"
                       src="@/assets/images/common/activeCloseImg.png"
                       alt="">
                </Button>
              </div>
            </div>
            <div class="upload-tip">
              <a href="https://pre-fdfs.itaxs.com/group1/M00/00/A5/rBLKLV9zJeCAcR1pAAJFNspxF-o641.png"
                 target="_blank">
                <img src="@/assets/images/common/searchImg.png"
                     alt="">
                查看示例
              </a>
            </div>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="8">
          <FormItem label="店铺所在电商平台:"
                    prop="shopSalePlatformName"
                    class="requiredItem"
                    v-if="formLeft.isThereShop==1">
            <RadioGroup v-model="formLeft.shopSalePlatformName">
              <Radio label="Amazon"
                     :disabled="notChange">Amazon</Radio>
              <Radio label="Noon"
                     :disabled="notChange">Noon</Radio>
              <Radio label="Jollychic"
                     :disabled="notChange">Jollychic</Radio>
              <Radio label="其它"
                     :disabled="notChange">其它</Radio>
            </RadioGroup>
          </FormItem>
          </Col>
          <Col :span="8">
          <FormItem label="是否已有销售:"
                    prop="isThereSale"
                    class="requiredItem"
                    style="width:300px"
                    v-if="formLeft.isThereShop==1">
            <RadioGroup v-model="formLeft.isThereSale">
              <Radio label="1"
                     :disabled="notChange">是</Radio>
              <Radio label="2"
                     :disabled="notChange">否</Radio>
              <!-- <Radio label="3"
                       :disabled="notChange">未知</Radio> -->
            </RadioGroup>
          </FormItem>
          </Col>
          <Col :span="8">
          <FormItem label="店铺后台链接："
                    prop="shopHref"
                    style="width:300px"
                    v-if="formLeft.isThereShop==1">
            <Input v-model="formLeft.shopHref"
                   placeholder=" 请输入店铺后台链接"
                   :disabled="notChange"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="8">
          <FormItem label="电商平台账号完整名称："
                    prop="shopSalePlatformAccount"
                    style="width:300px"
                    v-if="formLeft.isThereShop==1">
            <Input v-model="formLeft.shopSalePlatformAccount"
                   placeholder=" 请输入电商平台账号完整名称"
                   :disabled="notChange"></Input>
          </FormItem>
          </Col>
          <Col :span="8">
          <FormItem label="在沙特前12个月的销售额:"
                    
                    style="width:300px"
                    v-if="formLeft.isThereShop==1">
            <Input v-model="formLeft.shopSaleBefore"
                   placeholder=" 请输入在沙特前12个月的销售额"
                   type="number"
                   :disabled="notChange">
            <span slot="append">SAR</span>
            </Input>
          </FormItem>
          </Col>
          <Col :span="8">

          </Col>
        </Row>

      </div>
      <div class="title">银行信息</div>
      <div class="item-content">
        <Row>
          <Col :span="8">
          <FormItem label="银行账户名称："
                    prop="bankAccountName"
                    style="width:300px">
            <Input v-model="formLeft.bankAccountName"
                   placeholder="请输入对公账户名称/法人个人账户名称"
                   :disabled="notChange"></Input>
             <p style="color: #ed3e3e;">注：需要是公账账户</p>
          </FormItem>
          </Col>
          <Col :span="8">
          <FormItem label="银行英文名称："
                    prop="bankName"
                    style="width:300px">
            <Input v-model="formLeft.bankName"
                   placeholder="请输入银行英文名称"
                   :disabled="notChange"></Input>
            <p style="color:#F59A23;">注：请填写银行官方英文名称</p>
          </FormItem>
          </Col>
          <Col :span="8">
          <FormItem label="支行英文名称："
                    prop="bankSubBranchName"
                    style="width:300px">
            <Input v-model="formLeft.bankSubBranchName"
                   placeholder="请输入支行英文名称"
                   :disabled="notChange"></Input>
            <p style="color:#F59A23;">注：请填写支行英文名称</p>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="8">
          <FormItem label="支行英文地址："
                    prop="bankAddress"
                    style="width:300px">
            <Input v-model="formLeft.bankAddress"
                   placeholder="请输入支行英文地址"
                   :disabled="notChange"></Input>
            <p style="color:#F59A23;">注：请填写支行英文地址（可询问银行）</p>
          </FormItem>
          </Col>
          <Col :span="8">
          <FormItem label="IBAN/银行账户："
                    prop="bankAccount"
                    style="width:300px">
            <Input v-model="formLeft.bankAccount"
                   placeholder="请输入IBAN/银行账户"
                   :disabled="notChange"></Input>
            <p style="color:#F59A23;">备注：接收可能产生的退税</p>
          </FormItem>
          </Col>
          <Col :span="8">
          <FormItem label="Swift / BIC："
                    prop="swiftBic"
                    style="width:300px">
            <Input v-model="formLeft.swiftBic"
                   placeholder="请输入Swift / BIC"
                   :disabled="notChange"></Input>
            <p style="color:#F59A23;">备注：银行编码，通常为一串大写字母</p>
          </FormItem>
          </Col>
        </Row>
      </div>

    </Form>
  </div>
</template>
<script>
import { getMaterialSubmit, getRegTaxDetail, getMaterialSave, getAllServiceCompanies, getCompanyInformation, getCompanyLegalPersonSign } from "@/api/registerInfo/registerInfo";
import { legalpersonCountry, taxInfo, identifyBusinessLicense, identifyIdCard } from "@/api/taxModule"
import { Throttle } from "@/libs/throttle.js"
export default {
  props: ['notChange', 'leftFrom', 'status', 'servicesId'],
  data() {
    const validateNumber = (rule, value, callback) => {
      if (value == '') {
        return callback(new Error('请输入后台店铺邮编号码'));
      }
      // 模拟异步验证效果
      setTimeout(() => {
        if (!Number.isInteger(value - 0)) {
          callback(new Error('请输入正确的邮编号码'));
        } else {
          callback();
        }
      }, 500);
    };
    const onlyNumber = (rule, value, callback) => {
      if (value == '') {
        return callback(new Error('请填写销售额'));
      }
      // 模拟异步验证效果
      setTimeout(() => {
        if (isNaN(value)) {
          callback(new Error('请填写销售额'));
        } else {
          callback();
        }
      }, 500);
    };
    return {
      formLeft: {
        shopNature: '1',
        companyType: '1',
        certificateType: '2',
        companyNameZh: '',
        isThereShop: '1',
        vatTaxNumber: "",
        declarePeriod: "",
        companyNameEn: "",
        companyAddressEnCountry: "",
        companyAddressEnCity: "",
        companyAddressEn: "",
        companyLegalPersonZh: "",
        companyLegalPersonEn: "",
        companyEmail: "",
        companyTel: "",
        companyBusinessModeDescribe: "",
        articlesOfAssociationFile: '',
        companyLegalPersonSign: '',
        taxEffectiveDate: "",
        upBeginTime: "",
        upEndTime: "",
        companyBusinessLicense: "",
        legalPersonPapers: "",
        vatCertificate: "",
        lastDeclareReceipt: "",
        lastPayCertificate: "",
        gatewayId: "",
        gatewayPassword: "",
        postCode: "",
        vatTaxLocalFile: "",
        vatTaxEuFile: "",
        vatTaxFileCopy: "",
        shopSalePlatformContract: '',
        //意大利新增字段
        companyLegalPersonCard: '',
        companyLegalPersonCardAddress: '',
        companyLegalPersonBirthday: '',
        shopHref: '',
        vatTaxNumberFile: '',
        registrationAuthorization: '',
        companyLegalPersonBirthplace: '',
        companyRegisteredCapital: '',
        companyRegisterData: '',
        legalPersonMaritalStatus: '',
        legalPersonBirthplaceProvinceZh: '',
        legalPersonBirthplaceProvinceEn: '',
        legalPersonBirthplaceCityZh: '',
        legalPersonBirthplaceCityEn: '',
        companyLegalPersonCardAddressZh: '',
        shippingProcess: '',
        useEntrepot: '',
        dredgeEuronext: '',
        shopOtherEuTaxNumber: '',
        companyBusinessRegistrationBr: '',
        companyRegistrationCi: '',
        companyCorporateFoundingNnc1: '',
        companyRegisteredCityZh: '',
        companyRegisteredCityEn: '',
        localBankAccountInfo: '',
        companyCreditReport: '',
        companyLegalPersonCardFront: '',
        companyLegalPersonCardPassport: '',
        shopConsoleScreenshot: '',
        customsClearanceReport: '',
        auditReport: '',
        servicesId: this.servicesId,
        companyShareholderPassportCard: '',
        shopAddressScreenshot: '',
        salesEvidenceFile: '',
        bankSubBranchName: '',
        companyCreditCode: '',
        companyPostCode: '',
        companyLegalPersonMobile: '',
        companyLegalPersonEmail: '',
        shopTaxEffectiveData: '',
        firstOrderTime: '',
        future30Sale: '',
        shopSalePlatformName: 'Amazon',
        isThereSale: '',
        shopSalePlatformAccount: '',
        shopSaleBefore: '',
        bankAccountName: '',
        bankName: '',
        bankAddress: '',
        bankAccount: '',
        swiftBic: ''
      },
      sharesList: [
        {
          shareholderZhName: '',
          shareholderEnName: '',
          shareholderBonusScale: '',
          stockProportion: '',
        }
      ],
      ruleForm: {
        isThereSale: [
          { required: true, trigger: "blur", message: "请选择是否已有销售" }
        ],
        shopSalePlatformName: [
          { required: true, trigger: "blur", message: "请选择店铺所在电商平台" }
        ],
        future30Sale: [
          { required: true, trigger: "blur", validator: onlyNumber, message: "请填写预计未来30天销售额" }
        ],
        companyPostCode: [
          { required: true, trigger: "blur", message: "请填写公司所在地邮编号码" }
        ],
        swiftBic: [
          { required: true, trigger: "blur", message: "请填写Swift / BIC" }
        ],
        bankAccount: [
          { required: true, trigger: "blur", message: "请填写IBAN/银行账户" }
        ],
        bankSubBranchName: [
          { required: true, trigger: "blur", message: "请填写支行英文名称" }
        ],
        bankAddress: [
          { required: true, trigger: "blur", message: "请填写支行英文地址" }
        ],
        bankName: [
          { required: true, trigger: "blur", message: "请填写银行名称" }
        ],
        bankAccountName: [
          { required: true, trigger: "blur", message: "请填写账户名称" }
        ],
        shopSaleBefore: [
          { required: true, trigger: "blur", message: "请填写阿拉伯数字", validator: onlyNumber }
        ],
        shopSalePlan: [
          { required: true, trigger: "blur", message: "请填写阿拉伯数字", validator: onlyNumber }
        ],
        profession: [
          { required: true, trigger: "blur", message: "请填写职业" }
        ],
        shopSalePlatformAccount: [
          { required: true, trigger: "blur", message: "请填写电商平台账号完整名称" }
        ],
        companyLegalPersonEmail: [
          { required: true, trigger: "blur", message: "请填写常用联系邮箱" },
          { type: "email", message: "请填写正确邮箱", trigger: "blur" }
        ],
        companyLegalPersonMobile: [
          { required: true, trigger: "blur", message: "请填写常用联系手机号" }
        ],
        localBankAccountInfo: [
          { required: true, trigger: "blur", message: "请填写西班牙本地银行信息" }
        ],
        companyRegisteredCityZh: [
          { required: true, trigger: "blur", message: "请填公司营业执照注册城市" }
        ],
        vatTaxNumber: [
          { required: true, trigger: "blur", message: "请填写VAT税号" }
        ],
        declarePeriod: [
          { required: true, trigger: "change", message: "请选择报税周期" }
        ],
        companyNameZh: [
          { required: true, trigger: "blur", message: "请填写公司中文名" }
        ],
        companyLegalPersonZh: [
          { required: true, trigger: "blur", message: "请填写法人中文名" }
        ],
        companyLegalPersonEn: [
          { required: true, trigger: "blur", message: "请填写法人英文名" }
        ],
        companyNameEn: [
          { required: true, trigger: "blur", message: "请填写公司英文名" }
        ],
        companyLegalPersonBirthplace: [
          { required: true, trigger: "blur", message: "请填写法人出生地" }
        ],
        companyLegalPersonSign: [
          { required: true, trigger: "blur", message: "请填写上传法人签名" }
        ],
        companyLegalPersonCardAddress: [
          { required: true, trigger: "blur", message: "请填写法人身份证英文地址" }
        ],
        companyLegalPersonCard: [
          { required: true, trigger: "blur", message: "请填写法人身份证/护照号码" }
        ],
        companyLegalPersonBirthday: [
          { required: true, trigger: "change", message: "请选择法人出生日期", type: "date" }
        ],
        legalPersonMaritalStatus: [
          { required: true, trigger: "change", message: "请选择法人婚姻状态" }
        ],
        legalPersonSex: [
          { required: true, trigger: "change", message: "请选择法人性别" }
        ],
        useEntrepot: [
          { required: true, trigger: "change", message: "请选择是否使用任何西班牙仓库" }
        ],
        dredgeEuronext: [
          { required: true, trigger: "change", message: "请选择是否开通泛欧" }
        ],
        shopHref: [
          { required: true, trigger: "blur", message: "请填写店铺链接" }
        ],
        shippingProcess: [
          { required: true, trigger: "blur", message: "请填写货物进口及配送流程" }
        ],
        companyAddressEnCountry: [
          { required: true, trigger: "blur", message: "请填写公司英文地址" }
        ],
        companyAddressEn: [
          { required: true, trigger: "blur", message: "请填写公司英文地址" }
        ],
        companyCreditCode: [
          { required: true, trigger: "blur", message: "请填写统一社会信用代码" }
        ],
        legalPersonBirthplaceProvinceZh: [
          { required: true, trigger: "blur", message: "请填写法人的出生省份中文" }
        ],
        legalPersonBirthplaceProvinceEn: [
          { required: true, trigger: "blur", message: "请填写法人的出生省份英文" }
        ],
        legalPersonBirthplaceCityZh: [
          { required: true, trigger: "blur", message: "请填写法人的出生城市中文" }
        ],
        legalPersonBirthplaceCityEn: [
          { required: true, trigger: "blur", message: "请填写法人的出生城市英文" }
        ],
        companyLegalPersonCardAddressZh: [
          { required: true, trigger: "blur", message: "请填写法人身份证中文地址" }
        ],
        companyRegisteredCapital: [
          { required: true, trigger: "blur", message: "请输入公司注册资本（万元）", type: "number" }
        ],
        companyRegisterData: [
          {
            required: true,
            trigger: "change",
            message: "请选择公司成立日期",
            type: "date"
          }
        ],
        companyEmail: [
          { required: true, trigger: "blur", message: "请填写公司邮箱" },
          { type: "email", message: "请填写正确邮箱", trigger: "blur" }
        ],
        companyTel: [
          { required: true, trigger: "blur", message: "请填写公司电话" }
        ],
        companyBusinessModeDescribe: [
          { required: true, trigger: "blur", message: "请填写公司经营内容" }
        ],
        shopTaxEffectiveData: [
          {
            required: true,
            trigger: "change",
            message: "选择税号生效日期",
            type: "date"
          }
        ],
        firstOrderTime: [
          {
            required: true,
            trigger: "change",
            message: "选择预计/实际第一笔订单时间",
            type: "date"
          }
        ],
        upBeginTime: [
          {
            required: true,
            trigger: "change",
            message: "请选择开始时间",
            type: "date"
          }
        ],
        companyShareholderPassportCard: [
          {
            required: true,
            trigger: "change",
            message: "其它股东护照/身份证"
          }
        ],
        companyLegalPersonCardPassport: [
          { required: true, trigger: "change", message: "请上传护照扫描件" }
        ],
        vatCertificate: [
          { required: true, trigger: "change", message: "请上传VAT证书" }
        ],
        companyCreditReport: [
          {
            required: true,
            trigger: "change",
            message: "请上传公司信用报告"
          }
        ],
        lastDeclareReceipt: [
          {
            required: true,
            trigger: "change",
            message: "请上传最后一次申报回执"
          }
        ],
        lastPayCertificate: [
          {
            required: true,
            trigger: "change",
            message: "请上传支付凭证"
          }
        ],
        postCode: [
          { required: true, validator: validateNumber }
        ],
        vatTaxLocalFile: [
          { required: true, trigger: "change", message: "请上传本地税号文件" }
        ],
        salesEvidenceFile: [
          { required: true, trigger: "change", message: "请上传销售/零销售证明" }
        ],
        shopAddressScreenshot: [
          { required: true, trigger: "change", message: "请上传店铺地址截图" }
        ],
        shopConsoleScreenshot: [
          { required: true, trigger: "change", message: "请上传后台店铺截图" }
        ],
        vatTaxFileCopy: [
          { required: true, trigger: "change", message: "请上传税务副本" }
        ],
        upEndTime: [
          {
            required: true,
            trigger: "change",
            message: "请选择结束时间",
            type: "date"
          }
        ],
        vatTaxEuFile: [
          {
            required: true,
            trigger: "change",
            message: "请上传其它中东国家税号文件"
          }
        ],
        articlesOfAssociationFile: [
          {
            required: true,
            trigger: "change",
            message: "公司章程"
          }
        ],
        vatTaxNumberFile: [
          {
            required: true,
            trigger: "change",
            message: "请上传税号文件"
          }
        ],
        companyBusinessLicense: [
          {
            required: true,
            trigger: "change",
            message: "请上传营业执照扫描件"
          }
        ],
      },
      lenovoSearchList: [], //联想列表
      positionList: [
        {
          value: 'CEO(首席执行官)'
        },
        {
          value: 'COO(运营总监)'
        },
        {
          value: 'CFO(财务总监)'
        },
        {
          value: 'GM(总经理)'
        },
        {
          value: 'CTO(Technical Director)技术总监'
        },
        {
          value: 'HRD(人力资源总监)'
        },
        {
          value: 'MD(市场总监)'
        },
        {
          value: 'sales director(销售总监)'
        },
        {
          value: 'Production Manager(生产经理)'
        },
        {
          value: 'project manager(项目经理)'
        },
        {
          value: 'other(其它)'
        },
      ],
      birthplaceList: [],
      fileType: {
        companyBusinessLicense: "",
        companyLegalPersonCardPassport: "",
        vatCertificate: "",
        lastDeclareReceipt: "",
        lastPayCertificate: "",
        vatTaxLocalFile: "",
        vatTaxEuFile: "",
        vatTaxFileCopy: "",
        companyBusinessRegistrationBr: '',
        companyRegistrationCi: '',
        companyCorporateFoundingNnc1: '',
        shopConsoleScreenshot: '',
        vatTaxNumberFile: '',
        companyLegalPersonCardFront: '',
        companyCreditReport: '',
        customsClearanceReport: '',
        auditReport: '',
        articlesOfAssociationFile: '',
        companyShareholderPassportCard: '',
        shopAddressScreenshot: '',
        salesEvidenceFile: ''
      },
      optionsDate: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now() - 24 * 60 * 60 * 1000;;
        }
      },
      base64URI: ''
    }
  },
  methods: {
    selectCompany: Throttle(function (obj) {
      let that = this
      getCompanyInformation({
        companyName: obj,
      }).then(res => {
        if (res.code === 0) {
          if (JSON.stringify(res.data) !== "{}") {
            for (const key in res.data) {
              if (res.data.hasOwnProperty(key) && that.formLeft.hasOwnProperty(key)) {
                that.formLeft[key] = res.data[key]
              }
            }
          }
        }
      }).catch(error => {
        console.log(error)
      })
    }),
    // 公司资料信息自动填充
    automaticInformationFilling() {
      getAllServiceCompanies().then(res => {
        if (res.code === 0) {
          this.lenovoSearchList = res.data
        }
      }).catch(error => {
        console.log(error)
      })
    },
    addShares() {
      let obj = {
        shareholderZhName: '',
        shareholderEnName: '',
        shareholderBonusScale: '',
        stockProportion: ''
      }
      this.sharesList.push(obj)
    },
    removeShares(i) {
      this.sharesList.splice(i, 1)
    },
    getLegalpersonCountry() {
      legalpersonCountry().then(res => {
        if (res.code === 0) {
          this.birthplaceList = res.data
        }
      })
    },
    changeVatDate(date, item) {
      // this.formLeft[item] = date;
    },
    successHandler(res, file, fileList, item) {
      let self = this;
      if (res.code !== 0) {
        self.$Notice.warning({
          title: "警告",
          desc: "请尝试再次上传"
        });
        return false;
      }
      this.formLeft[item] = res.data.fileUrl;
      this.fileType[item] = res.data.suffix;
      if (res.size > 4096) {
        return
      }
      this.identifyFun(item, res.data.fileUrl)
    },
    identifyFun(item, fileUrl) {
      let that = this
      if (item === 'companyBusinessLicense') {
        identifyBusinessLicense({
          image: fileUrl,
          servicesId: this.servicesId
        }).then(res => {
          if (res.code === 0) {
            that.traverseResult(res.data, that)
          }
        }).catch(err => {
          console.log(err)
        })
      }
      if (item === 'companyLegalPersonCardFront') {
        identifyIdCard({
          image: fileUrl,
          servicesId: this.servicesId,
          side: 'front'
        }).then(res => {
          that.traverseResult(res.data, that)
        }).catch(err => {
          console.log(err)
        })
      }
      if (item === 'companyLegalPersonCardReverse') {
        identifyIdCard({
          image: fileUrl,
          servicesId: this.servicesId,
          side: 'back'
        }).then(res => {
          that.traverseResult(res.data, that)
        }).catch(err => {
          console.log(err)
        })
      }
    },
    traverseResult(resData, that) {
      if (JSON.stringify(resData) !== "{}") {
        for (const key in resData) {
          if (resData.hasOwnProperty(key) && that.formLeft.hasOwnProperty(key)) {
            if (resData[key] !== '无' && that.formLeft[key] === '') {
              that.formLeft[key] = resData[key]
            }
          }
          if (that.formLeft.hasOwnProperty(key) === false) {
            if (resData[key] !== '无' && that.formLeft[key] === '') {
              that.formLeft[key] = resData[key]
            }
          }
        }
      }
    },
    formatErrorHandler() {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "文件格式不正确, 请上传jpg, jpeg, png, gif,pdf格式的文件"
      });
    },
    formatErrorHandlerzip() {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "文件格式不正确, 请上传jpg, jpeg, png, gif,pdf,zip,rar格式的文件"
      });
    },
    removeHandler(file, fileList, item) {
      let self = this;
      this.formLeft[item] = "";
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: '超过文件大小限制',
        desc: '上传文件不超过100M'
      });
    },
    beforeUploadHandler(file) {
      this.base64URI = ''
      const reader = new FileReader();
      //将文件读取为 DataURL 以data:开头的字符串
      reader.readAsDataURL(file);
      reader.onload = e => {
        // 读取到的图片base64 数据编码 将此编码字符串传给后台即可
        const code = e.target.result;
        this.base64URI = code.replace('data:image/jpeg;base64,', '')
      }
      let self = this;
      const check = self.formLeft[this.nowFile] == "";
      if (!check) {
        self.$Notice.warning({
          title: "最多只可上传1个文件"
        });
      }
      return check;
    },
    beforType(item) {
      this.nowFile = item;
    },
    saveData() {
      if (this.formLeft.shopSaleBefore < 0) {
        this.$Message.error('请输入正确的前12个月销售额')
        return
      }
      if (this.formLeft.future30Sale < 0) {
        this.$Message.error('请输入正确的未来30天销售额')
        return
      }
      // if(isNaN(this.formLeft.shopSaleBefore)){
      //   this.$Message.error('过去12个月在阿联酋的营业额请填写阿拉伯数字')
      //   return
      // }
      let data = { ...this.formLeft }
      this.translateDate(data)
      delete data.sharesList
      data.companyStockCondition = JSON.stringify(this.sharesList)
      getMaterialSave(data).then(
        res => {
          if (res.code == 0) {
            this.$Message.success('保存成功')
            window.scroll(0, 0);
          } else {
            // self.$Message.warning(res.message);
          }
        },
        err => {
          // self.$Message.warning(err.message);
        })
        .catch(e => { })
        .finally(() => { });
    },
    submitData() {
      if (this.formLeft.shopSaleBefore < 0) {
        this.$Message.error('请输入正确的前12个月销售额')
        return
      }
      if (this.formLeft.future30Sale < 0) {
        this.$Message.error('请输入正确的未来30天销售额')
        return
      }
      if(isNaN(this.formLeft.shopSaleBefore)){
        this.$Message.error('过去12个月在阿联酋的营业额请填写阿拉伯数字')
        return
      }
      this.$refs['formLeft'].validate((valid) => {
        if (valid) {
          let data = { ...this.formLeft }
          this.translateDate(data)
          data.companyStockCondition = JSON.stringify(this.sharesList)
          getMaterialSubmit(data)
            .then(
              res => {
                if (res.code == 0) {
                  this.$Message.success('提交成功')
                  this.$emit('submitSuccess', res.timestamp)
                }else{
                  this.$Message.error('资料填写有误')
                }
              },
              err => { })
            .catch(e => { })
            .finally(() => {
            })
        } else {
          this.$Message.error('请完善资料后进行提交')
        }
      })
    },
    //转换日期
    translateDate(data) {
      data.companyLegalPersonBirthday = this.formatDate(this.formLeft.companyLegalPersonBirthday, 'date')
      data.shopTaxEffectiveData = this.formatDate(this.formLeft.shopTaxEffectiveData, 'date')
      data.firstOrderTime = this.formatDate(this.formLeft.firstOrderTime, 'date')
      data.companyRegisterData = this.formatDate(this.formLeft.companyRegisterData, 'date')
      this.sharesList.map((item, index) => {
        item.shareholderBirthday = this.formatDate(item.shareholderBirthday, 'date')
      })
    },
    formatDate(date, type) {
      if (typeof date === "object" && date) {
        const y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        let d = date.getDate();
        d = d < 10 ? "0" + d : d;
        if (type == "month") {
          return y + "-" + m;
        } else if (type == "date") return y + "-" + m + "-" + d + ' 00:00:00';
      } else {
        return date;
      }
    },
  },
  watch: {
    leftFrom: {
      immediate: true,  // 这是为了第一次拿到值的时候就对sd进行监听
      handler(val, oldval) {
        if (JSON.stringify(val) != '{}') {
          this.formLeft = val
          this.formLeft.isThereShop = String(val.isThereShop)
          this.formLeft.isThereSale = String(val.isThereSale)
          this.formLeft.shopNature = String(val.shopNature)
          this.formLeft.shopTaxRate = String(val.shopTaxRate)
          this.formLeft.isShopConsoleScreenshot = String(val.isShopConsoleScreenshot)
          this.formLeft.companyType = String(val.companyType)
          this.formLeft.certificateType = String(val.certificateType)
          this.formLeft.needEoriNumber = String(val.needEoriNumber)
          this.formLeft.isThereEoriNumber = String(val.isThereEoriNumber)
          if (val.companyStockCondition != undefined) {
            if ((val.companyStockCondition) != '') {
              let sharesList = JSON.parse(val.companyStockCondition)
              this.sharesList = [...sharesList]
              delete this.formLeft.companyStockCondition
            }
          }
        }
      }
    }
  },
  mounted() {
    this.getLegalpersonCountry()
    let val = this.leftFrom
    this.automaticInformationFilling()
  },
}
</script>
<style scoped lang="less">
/deep/ .ivu-row {
  width: 100%;
  margin-left: 0px;
}
.flex-direction {
  display: flex;
  flex-direction: column;
  align-items: baseline;
}
.stepH {
  .tips-icon {
    width: 17px;
    height: 17px;
    border-radius: 50%;
    display: inline-block;
    line-height: 17px;
    text-align: center;
    color: #ed3e3e;
    cursor: pointer;
    img {
      width: 100%;
      margin-top: 7px;
    }
  }
}
.container {
  .stepAE {
    width: 100% !important;
    padding: 0px;
    /deep/ .ivu-radio-group {
      margin-top: 4px;
    }
    /deep/ .ivu-form {
      .ivu-form-item-label {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.85);
        line-height: 22px;
        // float: none;
      }
      .ivu-form-item-content {
        width: 90%;
      }
    }
    /deep/ .ivu-input-wrapper {
      width: 100%;
    }
    /deep/ .ivu-select {
      width: 100%;
    }
    /deep/ .ivu-tooltip-popper {
      width: 200px;
    }
    /deep/ .ivu-date-picker {
      width: 100%;
    }
    /deep/ .ivu-form-item {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    /deep/ textarea.ivu-input {
      margin-left: 0px;
    }
    .title {
      width: 100%;
      height: 40px;
      background: #d6e8fd;
      padding-left: 32px;
      font-size: 18px;
      height: 55px;
      line-height: 55px;
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: bold;
      color: #333333;
    }
    .line {
      background: #f6f5f8;
      height: 24px;
      width: 100%;
    }
    .item-content {
      width: 100%;
      background: #ffffff;
      padding: 24px 32px;
    }
    .companyShare {
      /deep/ .ivu-form-item-content {
        width: 100%;
        .sharesContainer {
          display: flex;
          flex-wrap: wrap;
        }
        .shares-box {
          width: calc(33.3% - 20px);
          padding: 24px;
          background: #f4f7fc;
          margin-right: 20px;
        }
        .shares-tips {
          font-size: 14px;
          color: #ed3e3e;
          padding-left: 20px;
          margin: 10px 0px;
        }
        .shares-box:nth-child(n + 4) {
          margin-top: 20px;
        }
      }
    }
    /deep/ .ivu-upload {
      width: 100%;
      cursor: pointer;
      .inner {
        width: 100%;
        height: 32px;
        background: #16ade9;
        border-radius: 2px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        img {
          width: 20px;
          height: 20px;
          margin-top: 0px;
        }
        .uplad-word {
          color: #ffffff;
        }
      }
    }
    .notChange {
      .inner {
        background: #9999991f;
        .uplad-word {
          color: #666666;
        }
        img {
          display: none;
        }
      }
    }
    .out-img-box {
      .img-box {
        position: relative;
        text-align: center;
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
      font-size: 12px;
      color: #cccccc;
      vertical-align: bottom;
      a {
        color: #16ade9;
      }
      img {
        width: 14px;
        height: 14px;
        margin-top: 9px;
        float: left;
      }
    }
  }
}
.requiredItem {
  /deep/ .ivu-form-item-label::before {
    content: "*";
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #ed4014;
  }
}
</style>

