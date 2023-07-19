<template>
  <div>
    <div class="title">
      <img src="@/assets/images/infoDetail/jiantou-zuo.png"
           alt="">填写商标信息
      <span>注意：标 * 的为必填项，除标注用中文的选项外其他选项都用英文填写。</span>
    </div>
    <div class="step-box">
      <img src="@/assets/images/infoDetail/step1.png"
           alt=""
           v-if="steps==1">
      <img src="@/assets/images/infoDetail/step2.png"
           alt=""
           v-if="steps==2">
      <img src="@/assets/images/infoDetail/step3.png"
           alt=""
           v-if="steps==3">
    </div>
    <Form :model="formInfo"
          label-position="top"
          :rules="ruleValidate"
          ref="formInfo">
      <div class="step1-box"
           v-if="steps==1">
        <p class="info-title">商标信息</p>
        <FormItem label="商标类型"
                  prop="trademarkType">
          <Select v-model="formInfo.trademarkType"
                  placeholder="请选择商标类型"
                  :disabled="isEditor">
            <Option value="1">纯文字</Option>
            <Option value="2">纯图形</Option>
            <Option value="3">文字+图形</Option>
          </Select>
        </FormItem>
        <FormItem label="商标名称（英文）"
                  prop="trademarkNameEn"
                  v-if="formInfo.trademarkType==1||formInfo.trademarkType==3">
          <Input v-model="formInfo.trademarkNameEn"
                 placeholder="示例：ABC"
                 :maxlength="200"
                 :disabled="isEditor"></Input>
          <p class="gary-tip">最多200字符。</p>
        </FormItem>
        <FormItem label="商标图形LOGO"
                  prop="trademarkLogo"
                  v-if="formInfo.trademarkType==2||formInfo.trademarkType==3">
          <div class="bread-logo-box"
               :class="formInfo.trademarkLogo==''?'':'show-change'">
            <Upload :action="workOrderFile"
                    v-if="formInfo.trademarkLogo==''"
                    class="upload-logo"
                    :on-format-error="formatErrorHandler1"
                    :on-success="(res,file,fileList)=>{successHandler1(res,file,fileList,'trademarkLogo')}"
                    :on-remove="(file,fileList)=>{removeHandler1 (file,fileList,'trademarkLogo')}"
                    :format="['jpg','png','jpeg','svg']"
                    :show-upload-list="false"
                    :disabled="isEditor">
              <img src="@/assets/images/infoDetail/upload.png"
                   alt="">
            </Upload>
            <img :src="formInfo.trademarkLogo"
                 class="bread-logo"
                 alt=""
                 v-else>
            <Upload class="hover-box"
                    :on-format-error="formatErrorHandler1"
                    :on-success="(res,file,fileList)=>{successHandler1(res,file,fileList,'trademarkLogo')}"
                    :on-remove="(file,fileList)=>{removeHandler1 (file,fileList,'trademarkLogo')}"
                    :format="['jpg','png','jpeg','svg']"
                    :show-upload-list="false"
                    :disabled="isEditor"
                    :action="workOrderFile">
              <img src="@/assets/images/infoDetail/editor-bai.png"
                   alt="">更换图片
            </Upload>
          </div>
          <a class="example-box"
             v-if="formInfo.trademarkLogo!=''"
             :href="formInfo.trademarkLogo"
             target="_blank">
            查看原图
            <!-- <div class="example-img"><img src="@/assets/images/infoDetail/example1.png"
                     alt=""></div>
              <p @click="proofExampleModal=true">示例图<img src="@/assets/images/infoDetail/searchIcon.png"
                     alt=""></p> -->

          </a>
          <div class="tip-box">
            上传图样为彩色的，注册完成后，仅能按照该彩色图样原色使用；<br> 上传图样为黑白的，注册完成后，可以更换商标颜色使用
          </div>
        </FormItem>
        <FormItem label="设计商标描述（如申请的商标含logo，则要填写设计商标描述）"
                  prop="trademarkDescribe"
                  class="width100"
                  v-if="formInfo.trademarkType==2||formInfo.trademarkType==3">
          <Input v-model="formInfo.trademarkDescribe"
                 type="textarea"
                 :disabled="isEditor"
                 :maxlength="500"
                 style="width:398px;"></Input>
        </FormItem>
        <p class="info-title">将申请的商标分类</p>
        <div class="form-item">
          <span class="item-label red-tip">商标分类</span>
          <span class="item-upload"
                v-if="!isChooseOneClassify"
                @click="classifyModal=true">
            <img src="@/assets/images/infoDetail/jia.png"
                 alt="">添加商标分类
          </span>
          <span v-if="isChooseOneClassify"
                class="classify-box">
            <img src="@/assets/images/infoDetail/editor.png"
                 alt=""
                 v-if="!isEditor"
                 @click="classifyModal=true">
            <span v-for="(item,index) in choiceClassifyList"
                  :key="index">{{item.categoryNum}}&nbsp;{{item.categoryName}}</span>
          </span>
          <p class="tip"
             v-if="!isChooseOneClassify">请选择商标分类</p>
        </div>
        <div class="form-item">
          <div>
            <span class="item-label red-tip from">商标小类名称（英文）</span>
          </div>
          <Input v-model="model13"
                 :disabled="isEditor"
                 placeholder="输入的单词必须是有含义的"
                 style="width:398px;"
                 :maxlength="200"></Input>
          <Button class="search-subclass-btn"
                  @click="searchSubclass">搜索</Button>
          <Table border
                 v-if="model13!=''||twoClassifyList.length>0"
                 class="subclass-table"
                 :data="twoClassifyList"
                 :columns="subClassCloumns"
                 @on-selection-change="selectData"
                 @on-select-all-cancel="cancelData">
          </Table>
          <div class="check-two-category"
               v-if="!isEditor">
            <span v-for="(item,index) in checkTwoClassifyList"
                  :key="index">{{item.categoryNameEn}}<img src="@/assets/images/infoDetail/del.svg"
                   class="del-img"
                   @click="removeTowCategory(index)"
                   alt=""></span>
          </div>
        </div>
        <div class="risk-box"
             v-if="riskClassifyList.length>0">
          <p class="item-label red-tip from risk-title">含有风险小类，需指定关键词</p>
          <Table border
                 class="subclass-table"
                 :data="riskClassifyList"
                 :columns="riskClassCloumns">
          </Table>
        </div>
        <div class="line"></div>
        <p class="info-title">商标使用证据
          <span class="info-subTitle">（商标注册有风险，为提高商标注册通过率，请提供商标使用证据）</span>
        </p>
        <div class="form-item">
          <FormItem label="首次使用日期"
                    prop="firstUseDate"
                    class="first-date">
            <DatePicker type="date"
                        :disabled="isEditor"
                        v-model="formInfo.firstUseDate"
                        :options="options"
                        placeholder="年/月/日格式，示例：2020/01/01"></DatePicker>
            <div class="first-tip">
              1. 两个日期可以相同，
              <span class="orange">建议填写在亚马逊或其他电商平台上上架产品的日期
              </span><br> 2. “首次在商业上使用的日期”
              <span class="orange">必须是产品上架日期或者首次销售的日期</span><br> 3. 首次使用日期≤首次在商业上使用的日期
            </div>
          </FormItem>
          <FormItem label="首次在商业上使用的日期"
                    prop="firstBusinessUseDate">
            <DatePicker type="date"
                        :disabled="isEditor"
                        v-model="formInfo.firstBusinessUseDate"
                        :options="options"
                        placeholder="年/月/日格式，示例：2020/01/01"></DatePicker>
          </FormItem>
          <FormItem label="销售链接"
                    class="width100 red-tip from"
                    style="width:100%;">
            <div class="marketHref-list"
                 v-for="(item,index) in marketHrefList"
                 :key="index">
              <Input v-model="item.marketHref"
                     :disabled="isEditor"
                     placeholder="示例：http://或https://"
                     :maxlength="300"
                     style="width:234px;"></Input>
              <Select style="width:156px;margin-left:10px;"
                      placeholder="请选择商标小类"
                      v-model="item.category2NameEn"
                      @on-change="changeHrefClass($event,index)">
                <Option v-for="(v,i) in checkTwoClassifyList"
                        :key="i"
                        :value="v.categoryNameEn">{{v.categoryNameEn}}</Option>
              </Select>
              <img src="@/assets/images/infoDetail/add.svg"
                   alt=""
                   v-if="index==(marketHrefList.length-1)&&marketHrefList.length<20"
                   @click="addHref">
              <img src="@/assets/images/infoDetail/minus.svg"
                   alt=""
                   @click="removeHref(index)"
                   v-if="index==(marketHrefList.length-1)&&marketHrefList.length>1">
            </div>
            <p class="
                  gary-tip
                  ">销售链接内的商品需与使用证据的商品资料一致</p>
          </FormItem>
        </div>
        <div class="proof-box form-item">
          <Row>
            <Col :span="12">
            <span class="item-label
                 red-tip
                 from
                 ">上传产品图
            </span>
            <Upload class="upload-proof"
                    ref="uploadEvidence"
                    :before-upload="beforeUploadHandler"
                    :on-format-error="formatErrorHandler"
                    :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,usrProductImgList)}"
                    :action="workOrderFile"
                    :show-upload-list="false"
                    :disabled="isEditor"
                    :format="['jpg','pdf']">
              <img src="@/assets/images/infoDetail/upload-proof.svg"
                   alt="">
              <p>点击或将文件拖拽到这里上传</p>
            </Upload>
            <div class="evidence-box"
                 v-if="usrProductImgList.length>0">
              <div v-for="(item,index) in usrProductImgList"
                   :key="index">
                <p>
                  <a :href="item.fileUrl"
                     target="_blank">
                    <img src="@/assets/images/infoDetail/bianji.png"
                         alt=""> {{item.fileName}}
                  </a>
                </p>
                <img src="@/assets/images/infoDetail/del.png"
                     class="del-img"
                     v-if="!isEditor"
                     @click="removeHandler(index,usrProductImgList)"
                     alt="">
              </div>
            </div>
            </Col>
            <Col :span="12">
            <span class="item-label from">上传订单详情截图
            </span>
            <Upload class="upload-proof"
                    ref="uploadEvidence"
                    :before-upload="beforeUploadHandler"
                    :on-format-error="formatErrorHandler"
                    :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,useEvidenceList)}"
                    :action="workOrderFile"
                    :show-upload-list="false"
                    :disabled="isEditor"
                    :format="['jpg','pdf']">
              <img src="@/assets/images/infoDetail/upload-proof.svg"
                   alt="">
              <p>点击或将文件拖拽到这里上传</p>
            </Upload>
            <div class="evidence-box"
                 v-if="useEvidenceList.length>0">
              <div v-for="(item,index) in useEvidenceList"
                   :key="index">
                <p>
                  <a :href="item.fileUrl"
                     target="_blank">
                    <img src="@/assets/images/infoDetail/bianji.png"
                         alt=""> {{item.fileName}}
                  </a>
                </p>
                <img src="@/assets/images/infoDetail/del.png"
                     class="del-img"
                     v-if="!isEditor"
                     @click="removeHandler(index,useEvidenceList)"
                     alt="">
              </div>
            </div>
            </Col>
          </Row>
          <!-- <p class="item-label from">修改证据文件名称</p>
            <Row>
              <Col :span="12">
              <Input v-model="item.fileName"
                     :disabled="isEditor"
                     style="width:398px;" v-for="(item,index) in usrProductImgList" :key="index"></Input>
              </Col>
              <Col :span="12">
              <Input v-model="item.fileName"
                     :disabled="isEditor"
                     style="width:398px;" v-for="(item,index) in useEvidenceList" :key="index"></Input>
              </Col>
            </Row> -->
          <!-- <div class="tip2">
              <Row>
                <Col :span="12">
                <div class="right-box">
                  <img src="@/assets/images/infoDetail/right.png"
                       alt="">
                  <p class="right-tip">符合的图片类型：①产品实拍图，不要白底图片 ②图片清晰，产品占图片比例高 ③图片带有logo④logo位置和印制方式符合市面相同产品的印制方式</p>
                </div>
                </Col>
                <Col :span="12">
                <div class="wrong-box">
                  <img src="@/assets/images/infoDetail/wrong.png"
                       alt="">
                  <p class="right-tip">不符合的图片类型：①图片质量差，产品辨识困难 ②产品所占图片比例小，导致产品模糊 ③图片有水印 ④建模图 ⑤ps图片</p>
                </div>
                </Col>
              </Row>
              <div class="tip2-example-box"
                   @click="proofExampleModal=true">
                <img src="@/assets/images/infoDetail/searchIcon.png"
                     alt="">查看示例图<img src="@/assets/images/infoDetail/shangjiantou-you.png"
                     alt="">
              </div>
            </div>
            <p class="tip1">注意：<br> 1. 使用证据的命名应与小类名保持一致，且命名不能出现中文；<br> 2.仅支持JPG或PDF格式文件，且JPG文件不得超过5MB，PDF文件不得超过30MB。
            </p> -->
        </div>
        <div class="line"></div>
        <div class="next-button">
          <button class="blue-btn"
                  type='button'
                  @click="nexStepTwo(1)">保存并下一步</button>
        </div>
      </div>
      <div class="step2-box"
           v-if="steps==2">
        <p class="red-tip">* 若在海关有备案，请使用备案英文信息；若曾申请过国际商标，英文须保持一致。</p>
        <p class="info-title">申请人信息</p>
        <FormItem label="申请人类型"
                  class="inline-box"
                  prop="applyType">
          <RadioGroup v-model="formInfo.applyType">
            <Radio label="1"
                   :disabled="isEditor">公司</Radio>
            <Radio label="0"
                   :disabled="isEditor">个人</Radio>
          </RadioGroup>
        </FormItem>
        <div class="company-info"
             v-if="formInfo.applyType==1">
          <FormItem label="公司名称（英文）"
                    prop="applyCompanyEn"
                    class="width100">
            <Input v-model="formInfo.applyCompanyEn"
                   :disabled="isEditor"
                   :maxlength="200"
                   style="width:398px;"
                   placeholder="示例：Shenzhen Iipto Technology Co., Ltd."></Input>
            <!-- <div class="company-tip-box">
              <img src="@/assets/images/infoDetail/tip.svg"
                   alt="">
              <p>公司名称英文-参考示例：<br> ① 深圳市跨标云贸易有限公司<br> Shenzhen kuabiaoyun trading co., ltd <br> ② 深圳市跨标云科技有限公司 <br> Shenzhen kuabiaoyun technology co., ltd</p>
            </div> -->
            <p class="gary-tip">推荐使用翻译工具：
              <a href="https://fanyi.sogou.com/"
                 target="_blank">https://fanyi.sogou.com/ </a>或联系我们的
              <a onclick='easemobim.bind({configId: "ecc39d32-7372-4200-af0c-6ef7daf57f5c"})'>客服人员</a>
            </p>
            <p class="gary-tip">最多200字符。</p>
          </FormItem>
          <FormItem label="公司营业执照"
                    prop="businessLicense"
                    class="width100">
            <div class="bread-logo-box"
                 :class="formInfo.businessLicense==''?'':formInfo.businessLicense==undefined?'':'show-change'">
              <Upload :action="workOrderFile"
                      v-if="formInfo.businessLicense==''||formInfo.businessLicense==undefined"
                      class="upload-logo"
                      :on-format-error="formatErrorHandler2"
                      :on-success="(res,file,fileList)=>{successHandler1(res,file,fileList,'businessLicense')}"
                      :on-remove="(file,fileList)=>{removeHandler1 (file,fileList,'businessLicense')}"
                      :format="['jpg','png','bmp']"
                      :show-upload-list="false"
                      :disabled="isEditor">
                <img src="@/assets/images/infoDetail/upload.svg"
                     alt="">
              </Upload>
              <img :src="formInfo.businessLicense"
                   class="bread-logo"
                   alt=""
                   v-else>
              <Upload class="hover-box"
                      :on-format-error="formatErrorHandler2"
                      :on-success="(res,file,fileList)=>{successHandler1(res,file,fileList,'businessLicense')}"
                      :on-remove="(file,fileList)=>{removeHandler1 (file,fileList,'businessLicense')}"
                      :format="['jpg','png','bmp']"
                      :show-upload-list="false"
                      :disabled="isEditor"
                      :action="workOrderFile">
                <img src="@/assets/images/infoDetail/editor-bai.png"
                     alt="">更换图片
              </Upload>
            </div>
            <p class="gary-tip">请保证执照信息清晰可见<br> 文件小于20M，支持jpg、png或bmp格式的图片
            </p>
          </FormItem>
        </div>
        <div class="household-info"
             v-if="formInfo.applyType==0">
          <Row>
            <Col :span="6">
            <FormItem label="姓氏"
                      :disabled="isEditor"
                      prop="applyLastNameEn">
              <Input v-model="formInfo.applyLastNameEn"
                     placeholder="示例：Zhang"
                     style="width:195px;"></Input>
            </FormItem>
            </Col>
            <Col :span="6">
            <FormItem label="名字"
                      :disabled="isEditor"
                      prop="applyNameEn">
              <Input v-model="formInfo.applyNameEn"
                     placeholder="示例：San"
                     style="width:195px;"></Input>
            </FormItem>
            </Col>
          </Row>
          <div class="ID-file-box">
            <FormItem label="身份证人像面"
                      prop="identityCardFront"
                      class="width156">
              <div class="bread-logo-box"
                   :class="formInfo.identityCardFront==''?'':formInfo.identityCardFront==undefined?'':'show-change'">
                <Upload :action="workOrderFile"
                        v-if="formInfo.identityCardFront==''||formInfo.identityCardFront==undefined"
                        class="upload-logo"
                        :on-format-error="formatErrorHandler2"
                        :on-success="(res,file,fileList)=>{successHandler1(res,file,fileList,'identityCardFront')}"
                        :on-remove="(file,fileList)=>{removeHandler1 (file,fileList,'identityCardFront')}"
                        :format="['jpg','png','bmp']"
                        :show-upload-list="false"
                        :disabled="isEditor">
                  <img src="@/assets/images/infoDetail/upload.svg"
                       alt="">
                </Upload>
                <img :src="formInfo.identityCardFront"
                     class="bread-logo"
                     alt=""
                     v-else>
                <Upload class="hover-box"
                        :on-format-error="formatErrorHandler2"
                        :on-success="(res,file,fileList)=>{successHandler1(res,file,fileList,'identityCardFront')}"
                        :on-remove="(file,fileList)=>{removeHandler1 (file,fileList,'identityCardFront')}"
                        :format="['jpg','png','bmp']"
                        :show-upload-list="false"
                        :disabled="isEditor"
                        :action="workOrderFile">
                  <img src="@/assets/images/infoDetail/editor-bai.png"
                       alt="">更换图片
                </Upload>
              </div>
              <p class="gary-tip"
                 style="width:350px;">身份证人像面：请保证身份证姓名、身份证号码清晰可见 身份证国徽面：请保证签发机关、有效期限清晰可见 文件小于20M，支持jpg、png或bmp格式的图片
              </p>
            </FormItem>
            <FormItem label="身份证国徽面"
                      prop="identityCardReverse"
                      class="width156">
              <div class="bread-logo-box"
                   :class="formInfo.identityCardReverse==''?'':formInfo.identityCardReverse==undefined?'':'show-change'">
                <Upload :action="workOrderFile"
                        v-if="formInfo.identityCardReverse==''||formInfo.identityCardReverse==undefined"
                        class="upload-logo"
                        :on-format-error="formatErrorHandler2"
                        :on-success="(res,file,fileList)=>{successHandler1(res,file,fileList,'identityCardReverse')}"
                        :on-remove="(file,fileList)=>{removeHandler1 (file,fileList,'identityCardReverse')}"
                        :format="['jpg','png','bmp']"
                        :show-upload-list="false"
                        :disabled="isEditor">
                  <img src="@/assets/images/infoDetail/upload.svg"
                       alt="">
                </Upload>
                <img :src="formInfo.identityCardReverse"
                     class="bread-logo"
                     alt=""
                     v-else>
                <Upload class="hover-box"
                        :on-format-error="formatErrorHandler2"
                        :on-success="(res,file,fileList)=>{successHandler1(res,file,fileList,'identityCardReverse')}"
                        :on-remove="(file,fileList)=>{removeHandler1 (file,fileList,'identityCardReverse')}"
                        :format="['jpg','png','bmp']"
                        :show-upload-list="false"
                        :disabled="isEditor"
                        :action="workOrderFile">
                  <img src="@/assets/images/infoDetail/editor-bai.png"
                       alt="">更换图片
                </Upload>
              </div>
            </FormItem>
          </div>
        </div>
        <FormItem label="国家"
                  :disabled="isEditor"
                  prop="applyCountryEn">
          <Select v-model="formInfo.applyCountryEn"
                  filterable
                  label-in-value
                  @on-change="changeCountry">
            <div slot="empty">not Found data</div>
            <Option v-for="item in countryList"
                    :value="item.englishShortName"
                    :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="省/市"
                  class="red-tip from">
          <Cascader :placeholder="defaultCity"
                    :disabled="isEditor"
                    :data="dataArea"
                    @on-change="getArea"></Cascader>
        </FormItem>
        <Row>
          <Col :span="6">
          <FormItem label="省（英文）"
                    :disabled="isEditor"
                    prop="applyProvinceEn">
            <Input v-model="formInfo.applyProvinceEn"
                   style="width:150px;"></Input>
          </FormItem>
          </Col>
          <Col :span="6">
          <FormItem label="市（英文）"
                    :disabled="isEditor"
                    prop="applyCityEn">
            <Input v-model="formInfo.applyCityEn"
                   style="width:150px;"></Input>
          </FormItem>
          </Col>
        </Row>
        <FormItem label="街道地址（英文）"
                  prop="applyStreetEn"
                  class="width100">
          <Input v-model="formInfo.applyStreetEn"
                 :disabled="isEditor"
                 :maxlength="40"
                 placeholder="示例：Minzhi Street"
                 style="width:398px;"></Input>
          <p class="gary-tip">最多40字符&nbsp;&nbsp; 地理位置查询工具：
            <a href="https://fanyi.sogou.com/"
               target="_blank">https://fanyi.sogou.com</a>
          </p>
        </FormItem>
        <FormItem :label="formInfo.applyType==1?'营业执照上的详细地址（英文）':'身份证上的详细地址（英文）'"
                  prop="applyAddresEn"
                  class="width100">
          <Input v-model="formInfo.applyAddresEn"
                 style="width:398px;"
                 :disabled="isEditor"
                 :maxlength="40"
                 placeholder="示例：Room 302, Bldg. 4"></Input>
          <p class="gary-tip">最多40字符&nbsp;&nbsp; 地理位置查询工具：
            <a href="https://fanyi.sogou.com/"
               target="_blank">https://fanyi.sogou.com</a>
          </p>
        </FormItem>
        <FormItem label="邮政编码"
                  prop="applyPostNum">
          <Input v-model="formInfo.applyPostNum"
                 :disabled="isEditor"
                 :maxlength="6"
                 placeholder="示例：518000"></Input>
          <p class="gary-tip">6位数字</p>
        </FormItem>
        <FormItem label="申请人邮箱"
                  prop="applyEmail">
          <Input v-model="formInfo.applyEmail"
                 :disabled="isEditor"
                 placeholder="示例：123456@hotmail.com"></Input>
          <p class="gary-tip">填写申请人正在使用且长期使用的邮箱</p>
        </FormItem>
        <div class="legalPersonSignBox">
          <Row>
            <Col span="5">
            <p class="titleItem">法人签名:</p>
            </Col>
            <Col span="18">
            <div class="legalPersonSign">
              <img v-if="formInfo.signature !== '' && formInfo.signature !== undefined"
                   :src="formInfo.signature"
                   alt="">
            </div>
            </Col>
          </Row>
        </div>
        <div class="line"></div>
        <div class="next-button">
          <button @click="steps=1"
                  type='button'
                  class="white-btn">返回上一步</button>
          <button @click="saveInfoFun(2)"
                  v-if="!isEditor"
                  type='button'
                  class="white-btn">仅保存不提交</button>
          <button @click="submitInfoFun"
                  v-if="!isEditor"
                  type='button'
                  class="blue-btn">确认并提交</button>
        </div>
      </div>
      <div class="step3-box"
           v-if="steps==3">
        <img src="@/assets/images/infoDetail/success.png"
             alt="">
        <p class="submit-success">提交成功</p>
      </div>
    </Form>
    <Modal v-model="proofExampleModal"
           footer-hide
           title="示例图"
           class="proof-example-modal">
      <div class="examples">
        <p>符合的图片类型</p>
        <img src="https://fdfs.itaxs.com/group1/M00/04/EE/rBLKNV_QkQuAF2JiAACSFlBcrYk905.png"
             alt="">
        <img src="https://fdfs.itaxs.com/group1/M00/04/EE/rBLKNV_QkSqAfwZfAAClUBVsIrc431.png"
             alt="">
      </div>
      <div class="examples">
        <p>不符合的图片类型</p>
        <img src="https://fdfs.itaxs.com/group1/M00/04/EE/rBLKNV_QkUKAE8BbAACOuG7i62g495.png"
             alt="">
        <img src="https://fdfs.itaxs.com/group1/M00/04/EE/rBLKNV_QkVqAYciLAACc2vOyxb4242.png"
             alt="">
      </div>
      <p class="modal-tip">
        <img src="@/assets/images/infoDetail/error-icon.png"
             alt="">不符合原因：1、产品不完整 2、没有logo 3、含有中文 4、图片不清晰
      </p>
    </Modal>
    <Modal v-model="classifyModal"
           class="classify-modal"
           footer-hide>
      <div class="classify-header"
           slot="header">
        <p class="title">添加商标分类
          <span>(您一共购买了一类，最多可选择一类）</span>
        </p>
        <div class="tip">提示：不确定要选择哪个分类？可尝试搜索竞争对手的商标，然后，查看它的商标详情中申请的分类。如果仍不确定要选择哪个分类，请咨询我们的客服人员。</div>
      </div>
      <CheckboxGroup @on-change="checkAllGroupChange"
                     v-model="choiceClassify">
        <Checkbox :label="item.categoryNum"
                  v-for="(item,index) in firstClassList"
                  :key="index">{{item.categoryNum
          <10? '0'+item.categoryNum:item.categoryNum}}&nbsp;{{item.categoryName}}</Checkbox>
      </CheckboxGroup>
      <div class="classify-footer">
        <Button @click="sureOneCategory">提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getOneCategoryApi, getTwoCategoryApi, saveWorkorderApi, submitWorkorderApi, getSubclassApi } from "@/api/iipto/breadInfoDetail";
import { getCountryListApi } from "@/api/iipto/country.js"
export default {
  props: ['formInfo', 'isEditor', 'servicesId', 'countryCode'],
  data() {
    return {
      options: {
        disabledDate(date) {
          return (date > Date.now())
        }
      },
      dataArea: this.AREA1,
      proofExampleModal: false,
      classifyModal: false,
      isChooseOneClassify: false,
      steps: 1,
      model13: '',
      choiceClassify: [],
      choiceClassifyList: [],
      firstClassList: [],
      loading1: false,
      twoClassifyList: [],//查询返回的小类列表
      twoClassifyNameList: [],
      twoClassifyListOption: [],
      args: [],
      province: '',
      city: '',
      defaultCity: '',
      province: '',
      city: '',
      useEvidenceList: [],
      marketHrefList: [],
      usrProductImgList: [],
      checkTwoClassifyList: [],
      twoClassifyNameList: [],
      selectTwoclassify: '',
      subClassCloumns: [
        {
          title: '商标小类名',
          key: 'categoryName',
          width: 318
        },
        {
          title: '对应美标小类翻译',
          key: 'categoryNameEn',
          width: 432
        }, {
          title: '多选',
          width: '70px',
          type: 'selection',
        }
      ],
      marketHrefList: [
        {
          category2Name: '',
          category2NameEn: '',
          marketHref: ''
        }
      ],
      riskClassifyList: [],
      riskClassCloumns: [
        {
          title: '风险小类',
          align: 'center',
          key: 'categoryNameEn'
        },
        {
          title: '指定关键词',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Input', {
                props: {
                  value: params.row.keyword[0],
                  placeholder: '请输入指定关键词（最多40字符）',
                  maxlength: 40
                },
                on: {
                  input: val => {
                    this.riskClassifyList[params.row._index].keyword[0] = val
                    this.checkTwoClassifyList.map((item) => {
                      if (item.categoryNum == params.row.categoryNum) {
                        item.keyword[0] = val
                      }
                    })
                  }
                }
              })
            ])
          }
        },
      ],
      editorAddress: false,
      ruleValidate: {
        trademarkNameEn: [
          { required: true, trigger: "blur", message: "请填写商标名称（英文）" }
        ],
        trademarkType: [
          { required: true, trigger: "change", message: "请选择商标类型", }
        ],
        companyType: [
          { required: true, trigger: "change", message: "请选择公司类型", }
        ],
        firstBusinessUseDate: [
          { required: true, trigger: "change", message: "请选择首次在商业上使用的日期", type: "date" }
        ],
        firstUseDate: [
          { required: true, trigger: "change", message: "请选择首次使用日期", type: "date" }
        ],
        trademarkLogo: [
          {
            required: true,
            trigger: "change",
            message: "请上传商标图形LOGO"
          }
        ],
        applyType: [
          { required: true, trigger: "change", message: "请选择申请人信息", }
        ],
        applyCompanyEn: [
          { required: true, trigger: "blur", message: "请填写公司名称（英文）" }
        ],
        applyLastNameEn: [
          { required: true, trigger: "blur", message: "请填写姓氏（英文）" }
        ],
        applyNameEn: [
          { required: true, trigger: "blur", message: "请填写名字（英文）" }
        ],
        applyCountryEn: [
          { required: true, trigger: "blur", message: "请填写国家（英文）" }
        ],
        applyStreetEn: [
          { required: true, trigger: "blur", message: "请填写街道地址（英文）" }
        ],
        applyAddresEn: [
          { required: true, trigger: "blur", message: "请填写详细地址（英文）" }
        ],
        applyPostNum: [
          { required: true, trigger: "blur", message: "请填写邮政编码" }
        ],
        applyEmail: [
          { required: true, trigger: "blur", message: "请填写申请人邮箱" }
        ],
        marketHref: [
          { required: true, trigger: "blur", message: "请填写销售链接" }
        ],
        businessLicense: [
          {
            required: true,
            trigger: "change",
            message: "请上传公司营业执照"
          }
        ],
        identityCardFront: [
          {
            required: true,
            trigger: "change",
            message: "请上传身份证正面"
          }
        ],
        identityCardReverse: [
          {
            required: true,
            trigger: "change",
            message: "请上传身份证反面"
          }
        ],
      },
      countryList: []
    }
  },
  mounted() {
    this.initInfo()
    this.getOneCategoryFun()
    this.getCountryFunc()
  },
  methods: {
    escape2Html(str) {
      if (str == '' || str == undefined) {
        return ''
      } else {
        var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
        return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t]; });
      }
    },
    initInfo() {
      let returnData = { ...this.formInfo }
      this.formInfo.applyType = String(returnData.applyType)
      this.formInfo.trademarkType = String(returnData.trademarkType)
      this.formInfo.trademarkNameEn = this.escape2Html(returnData.trademarkNameEn)
      this.formInfo.trademarkDescribe = this.escape2Html(returnData.trademarkDescribe)
      let class1Obj = {}, class2Obj = {}
      if (returnData.trademarkCategory != '' && returnData.trademarkCategory != undefined) {
        let trademarkCategoryList = JSON.parse(returnData.trademarkCategory)
        trademarkCategoryList.map((item, index) => {
          class1Obj = {
            categoryNum: item.category1Num,
            categoryName: item.category1Name
          }
          this.choiceClassify.push(item.category1Num)
          this.choiceClassifyList.push(class1Obj)
          this.isChooseOneClassify = true
          item.listTrademarkCategory2.map((v, i) => {
            class2Obj = {
              categoryName: v.category2Name,
              categoryNameEn: v.category2NameEn,
              categoryNum: v.category2Num,
              parentCategoryNum: item.category1Num,
              keyword: v.keyword || ['']
            }
            this.checkTwoClassifyList.push(class2Obj)
            if (v.category2NameEn.indexOf('{') != -1) {
              this.riskClassifyList.push(class2Obj)
            }
          })
        })
      }
      if (returnData.marketHref != '' && returnData.marketHref != undefined) {
        this.marketHrefList = JSON.parse(returnData.marketHref)
      }
      if (returnData.useEvidence !== '' && returnData.useEvidence != undefined) {
        this.useEvidenceList = JSON.parse(returnData.useEvidence)
      }
      if (returnData.useProductImg !== '' && returnData.useProductImg != undefined) {
        this.usrProductImgList = JSON.parse(returnData.useProductImg)
      }
      this.province = returnData.applyProvinceZh
      this.city = returnData.applyCityZh
      this.defaultCity = returnData.applyProvinceZh + ' / ' + returnData.applyCityZh
    },
    //获取所有国家
    getCountryFunc() {
      getCountryListApi().then(res => {
        if (res.code == 0) {
          this.countryList = res.data
        }
      })
    },
    changeCountry(val) {
      this.formInfo.applyCountryZh = val.label
    },
    getOneCategoryFun() {
      getOneCategoryApi().then(res => {
        if (res.code == 0) {
          this.firstClassList = res.data
        }
      })
    },
    getTowCategory() {
      let data = {
        countryCode: this.countryCode,
        parentCategoryNum: this.choiceClassify[0],
      }
      getTwoCategoryApi(data).then(res => {
        this.loading1 = false
        if (res.code == 0) {
          this.twoClassifyList = res.data
        }
      })
    },
    nexStepTwo(step) {
      this.saveInfoFun()
      if (step == 1) {
        this.steps = 2
      }
    },
    checkAllGroupChange(data) {
      if (data.length > 1) {
        this.$Message.info('您最多可选择一类')
        this.choiceClassify.pop()
      }
    },
    sureOneCategory() {
      this.classifyModal = false
      this.isChooseOneClassify = true
      this.choiceClassifyList = []
      this.firstClassList.map((item, index) => {
        if (this.choiceClassify[0] == item.categoryNum) {
          this.choiceClassifyList.push(item)
        }
      })
    },
    changeTwoClassify(i) {
      this.selectTwoclassify = i
    },
    //删除二级菜单
    removeTowCategory(i) {
      this.checkTwoClassifyList.splice(i, 1)
      this.twoClassifyNameList.splice(i, 1)
      this.riskClassifyList = []
      this.checkTwoClassifyList.map((item, index) => {
        if (item.categoryNameEn.indexOf('{') != -1) {
          this.riskClassifyList.push(item)
        }
      })
    },
    remoteMethod(query) {
      if (this.choiceClassify.length != 1) {
        this.$Message.info('请先选择商标分类')
        return
      }
      if (query.length >= 3) {
        this.loading1 = true
        setTimeout(() => {
          this.loading1 = false;
          const list = this.twoClassifyList.map(item => {
            return item
          });
          this.twoClassifyListOption = list.filter(item => item.categoryName.toLowerCase().indexOf(query.toLowerCase()) > -1);
        }, 200);
      }
    },
    searchSubclass() {
      if (this.choiceClassify.length == 0) {
        this.$Message.info('请先选择商标分类')
        return
      }
      let data = {
        countryCode: this.countryCode,
        parentCategoryNum: this.choiceClassify[0],
        searchName: this.model13
      }
      getSubclassApi(data).then(res => {
        if (res.code == 0) {
          this.twoClassifyList = res.data
        }
      })
    },
    selectData(data) {
      let newArr = [...this.checkTwoClassifyList]
      let allArr = this.MergeArray(data, newArr)
      let isBreak = false, isRisk = 0
      this.riskClassifyList = []
      allArr.map((item, index) => {
        if (item.categoryNameEn.indexOf('{') != -1) {
          isRisk++
          if (this.riskClassifyList.length < 2) {
            let obj = {
              categoryName: item.categoryName,
              categoryNameEn: item.categoryNameEn,
              categoryNum: item.categoryNum,
              parentCategoryNum: item.parentCategoryNum,
              keyword: ['']
            }
            this.riskClassifyList.push(item)
          } else {
            isBreak = true
          }
        }
      })
      if (isBreak && isRisk > 2) {
        this.$Message.info('风险小类最多只能选择2个')
        return
      }
      this.checkTwoClassifyList = this.MergeArray(data, newArr)
      // console.log(this.checkTwoClassifyList)
      if (this.checkTwoClassifyList.length > 20) {
        this.$Message.info('商标小类最多只能选择20个')
        this.checkTwoClassifyList = this.checkTwoClassifyList.slice(0, 20)
      }
    },
    cancelData(data) {
      this.checkTwoClassifyList = []
      this.riskClassifyList = []
    },
    MergeArray(arr1, arr2) {
      var _arr = new Array();
      for (var i = 0; i < arr1.length; i++) {
        let obj = {
          categoryName: arr1[i].categoryName,
          categoryNameEn: arr1[i].categoryNameEn,
          categoryNum: arr1[i].categoryNum,
          parentCategoryNum: arr1[i].parentCategoryNum,
          keyword: ['']
        }
        _arr.push(obj);
      }
      for (var i = 0; i < arr2.length; i++) {
        var flag = true;
        for (var j = 0; j < arr1.length; j++) {
          if (arr2[i].categoryNum == arr1[j].categoryNum) {
            flag = false;
            break;
          }
        }
        if (flag && _arr.length < 20) {
          let obj = {
            categoryName: arr2[i].categoryName,
            categoryNameEn: arr2[i].categoryNameEn,
            categoryNum: arr2[i].categoryNum,
            parentCategoryNum: arr2[i].parentCategoryNum,
            keyword: ['']
          }
          _arr.push(arr2[i]);
        }
      }
      return _arr;
    },
    // 选省市区
    getArea(value, selectedData) {
      const areaName = selectedData.map(item => item.label);
      this.args = [...areaName];
      this.province = this.args[0];
      this.city = this.args[1];
    },
    //判断销售链接是否有重复
    isRepetition(n) {
      let flag = true;   //假设不重复 
      for (let i = 0; i < n.length - 1; i++) { //循环开始元素 
        for (let j = i + 1; j < n.length; j++) { //循环后续所有元素 
          //如果相等，则重复 
          if (n[i].marketHref == n[j].marketHref) {
            flag = false; //设置标志变量为重复 
            break;      //结束循环 
          }
        }
      }
      return flag
    },
    addHref() {
      let obj = {
        category2Name: '',
        category2NameEn: '',
        marketHref: ''
      }
      this.marketHrefList.push(obj)
    },
    changeHrefClass(data, ins) {
      this.checkTwoClassifyList.map((v, i) => {
        if (data == v.categoryNameEn) {
          this.marketHrefList[ins].category2Name = v.categoryName
        }
      })
    },
    removeHref(i) {
      if (this.marketHrefList.length > 1) {
        this.marketHrefList.splice(i, 1)
      }
    },
    beforeUploadHandler(item) {
      let self = this;
      let len = self.useEvidenceList.length + self.usrProductImgList.length
      const check = len < 20
      if (!check) {
        self.$Notice.warning({
          title: "最多只可上传20个文件"
        });
      }
      return check;
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
      let obj = {
        fileName: res.data.origFileName,
        fileUrl: res.data.fileUrl
      }
      item.push(obj)
    },
    formatErrorHandler() {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "文件格式不正确, 请上传jpg,pdf格式的文件"
      });
    },
    formatErrorHandler1() {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "文件格式不正确, 请上传jpg,png,jpeg,svg格式的文件"
      });
    },
    formatErrorHandler2() {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "文件格式不正确, 请上传jpg,png,bpm格式的文件"
      });
    },
    successHandler1(res, file, fileList, item) {
      let self = this;
      if (res.code !== 0) {
        self.$Notice.warning({
          title: "警告",
          desc: "请尝试再次上传"
        });
        return false;
      }
      this.formInfo[item] = res.data.fileUrl
    },
    removeHandler1(i, item) {
      this.formInfo[item] = ''
    },
    removeHandler(i, item) {
      item.splice(i, 1)
    },
    //保存资料
    saveInfoFun() {
      let data = { ...this.formInfo }
      data.firstBusinessUseDate = this.formatDate(this.formInfo.firstBusinessUseDate, 'date')
      data.firstUseDate = this.formatDate(this.formInfo.firstUseDate, 'date')
      data.applyProvinceZh = this.province
      data.applyCityZh = this.city
      data.servicesId = this.servicesId
      this.defaultCity = this.province + ' / ' + this.city
      data.markHrefDtoList = [...this.marketHrefList]
      // console.log(this.choiceClassifyList)
      // console.log(this.checkTwoClassifyList)
      let trademarkCategoryList = []
      this.choiceClassifyList.map((v, i) => {
        let obj = {
          category1Name: v.categoryName,
          category1Num: v.categoryNum,
          category1NameEn: v.categoryNameEn,
          listTrademarkCategory2: []
        }
        trademarkCategoryList.push(obj)
        this.checkTwoClassifyList.map((item, index) => {
          if (item.parentCategoryNum == v.categoryNum) {
            let obj2 = {
              category2Name: item.categoryName,
              category2Num: item.categoryNum,
              category2NameEn: item.categoryNameEn,
              keyword: item.keyword
            }
            trademarkCategoryList[i].listTrademarkCategory2.push(obj2)
          }
        })
      })
      data.trademarkCategoryList = [...trademarkCategoryList]
      if (this.useEvidenceList.length > 0) {
        data.useEvidenceList = [...this.useEvidenceList]
      }
      if (this.usrProductImgList.length > 0) {
        data.usrProductImgList = [...this.usrProductImgList]
      }
      saveWorkorderApi(data).then(res => {
        if (res.code == 0) {
          this.$Message.success('保存成功')
        }
      })
    },
    //提交资料
    submitInfoFun() {
      let data = { ...this.formInfo }
      data.firstBusinessUseDate = this.formatDate(this.formInfo.firstBusinessUseDate, 'date')
      data.firstUseDate = this.formatDate(this.formInfo.firstUseDate, 'date')
      data.applyProvinceZh = this.province
      data.applyCityZh = this.city
      data.servicesId = this.servicesId
      // console.log(this.choiceClassifyList)
      // console.log(this.checkTwoClassifyList)
      let isBreak = true
      if (this.riskClassifyList.length > 0) {
        this.riskClassifyList.map(item => {
          if (item.keyword[0] == '') {
            isBreak = false
          }
        })
      }
      if (!isBreak) {
        this.$Message.error('请填写风险小类关键词')
        return
      }
      data.markHrefDtoList = [...this.marketHrefList]
      let trademarkCategoryList = []
      this.choiceClassifyList.map((v, i) => {
        let obj = {
          category1Name: v.categoryName,
          category1Num: v.categoryNum,
          category1NameEn: v.categoryNameEn,
          listTrademarkCategory2: []
        }
        trademarkCategoryList.push(obj)
        this.checkTwoClassifyList.map((item, index) => {
          if (item.parentCategoryNum == v.categoryNum) {
            let obj2 = {
              category2Name: item.categoryName,
              category2Num: item.categoryNum,
              category2NameEn: item.categoryNameEn,
              keyword: item.keyword
            }
            trademarkCategoryList[i].listTrademarkCategory2.push(obj2)
          }
        })
      })
      data.trademarkCategoryList = [...trademarkCategoryList]
      if (this.isRepetition(this.marketHrefList)) {
        data.markHrefDtoList = [...this.marketHrefList]
      } else {
        this.$Message.error('销售链接重复，请修改后提交')
        return
      }
      if (this.useEvidenceList.length == 0 && this.usrProductImgList.length == 0) {
        this.$Message.error('请上传订单详情截图或产品图')
        return
      } else {
        data.useEvidenceList = [...this.useEvidenceList]
        data.usrProductImgList = [...this.usrProductImgList]
      }
      this.$refs['formInfo'].validate((valid) => {
        if (valid) {
          this.submitForm(data)
        } else {
          this.$Message.error('请先填写完整资料');
        }
      })
    },
    formatDate(date, type) {
      if (typeof date === "object") {
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
    submitForm(data) {
      this.$Modal.confirm({
        title: '',
        content: `<div class="submit-tip-box">
          <p class="submit-tip-title"><span class="imgs"><span>您提交的信息即将进入系统审核</p>
          <p class="tip-content">信息提交后，即代表您已核对过信息。 确定吗？
          </p>
        </div>`,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          submitWorkorderApi(data).then(res => {
            if (res.code == 0) {
              this.steps = 3
            }
          })
        },
        onCancel: () => {

        }
      });
    },
  },
}
</script>
<style lang="less" scoped>
.title {
  font-size: 20px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  border-bottom: 1px solid #ebebeb;
  padding-bottom: 24px;
  span {
    font-size: 14px;
    font-family: PingFangSC;
    color: #016eff;
    margin-left: 12px;
  }
  img {
    vertical-align: middle;
  }
}
.step-box {
  margin-top: 12px;
  text-align: center;
}
.step1-box {
  .example-box {
    margin-left: 10px;
    display: inline-block;
    width: 156px;
    height: 156px;
    background: #ffffff;
    border-radius: 8px;
    border: 1px solid #cfcfcf;
    vertical-align: top;
    padding: 16px 10px;
    text-align: center;
    .example-img {
      width: 85px;
      height: 52px;
      background: #d8d8d8;
    }
    p {
      margin-top: 6px;
      text-align: center;
      color: #00a3ff;
      font-size: 12px;
      cursor: pointer;
      img {
        vertical-align: middle;
        margin-left: 4px;
      }
    }
  }
  .tip-box {
    padding: 6px 8px;
    background-color: #eff9ff;
    font-size: 10px;
    font-family: PingFangSC;
    color: #00a3ff;
    line-height: 18px;
    margin-top: 6px;
    width: 364px;
  }
  .marketHref-list {
    margin-bottom: 8px;
    img {
      vertical-align: middle;
      margin-left: 6px;
      cursor: pointer;
    }
  }
  .proof-box {
    position: relative;
    .tip1 {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 22px;
      margin-top: 10px;
    }
    .tip2 {
      height: 128px;
      border-radius: 2px;
      border: 1px solid rgba(0, 0, 0, 0.15);
      margin-top: 24px;
      padding: 12px 0;
      .right-box {
        margin-left: 24px;
      }
      .right-tip {
        display: inline-block;
        width: 355px;
        margin-left: 2px;
        font-size: 14px;
        font-family: PingFangSC;
        color: #999999;
        line-height: 22px;
      }
      img {
        vertical-align: top;
        margin-top: 6px;
      }
      .tip2-example-box {
        cursor: pointer;
        padding: 9px 20px;
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #00a3ff;
        max-width: 472px;
        img {
          vertical-align: bottom;
          margin: 0 6px;
        }
      }
    }
  }
  .evidence-box {
    width: 398px;
    p {
      margin-top: 8px;
      position: relative;
      width: 366px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      display: inline-block;
      img {
        vertical-align: middle;
      }
      a {
        color: #00a3ff;
      }
    }
    .del-img {
      text-align: right;
      cursor: pointer;
      margin-left: 8px;
    }
  }
}
.red-tip {
  font-size: 14px;
  font-family: PingFangSC;
  color: #f03226;
  margin-top: 32px;
}
.step2-box {
  padding: 0 15px;
  .next-button {
    text-align: center;
  }
  .legalPersonSignBox {
    margin-top: 20px;
  }
  .legalPersonSign {
    width: 300px;
    height: 200px;
    background: #f2f2f2;
    img {
      width: 300px;
      height: 200px;
    }
  }
}
.step3-box {
  text-align: center;
  margin-top: 52px;
  .submit-success {
    font-size: 24px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    margin-top: 22px;
  }
  .sub-succcess {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    margin-top: 8px;
  }
  .bread-info-box {
    width: 735px;
    border-radius: 2px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    margin: 24px auto;
    padding: 24px 40px;
    .bread-title {
      text-align: left;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
    }
    .sub-info {
      text-align: left;
      margin-top: 20px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.85);
      margin-bottom: 12px;
      span:first-child {
        margin-right: 86px;
      }
    }
    .progress-info {
      margin-top: 10px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
      line-height: 20px;
    }
  }
}
.bread-logo-box {
  display: inline-block;
  width: 156px;
  height: 156px;
  position: relative;
  img {
    width: 100%;
    height: 100%;
  }
  .hover-box {
    width: 100%;
    height: 100%;
    background: #333333;
    opacity: 0.65;
    position: absolute;
    top: 0;
    left: 0;
    text-align: center;
    padding-top: 38px;
    font-size: 14px;
    font-family: SourceHanSansSC-Regular, SourceHanSansSC;
    font-weight: 400;
    color: #ffffff;
    display: none;
    img {
      width: 16px;
      height: 16px;
      margin-right: 4px;
      vertical-align: middle;
    }
  }
}
.show-change:hover .hover-box {
  display: block;
}
.info-title {
  margin: 24px 0 24px 0;
  font-size: 18px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  .info-subTitle {
    font-size: 14px;
    font-family: PingFangSC;
    color: #999999;
  }
}
.gary-tip {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  line-height: 22px;
  width: 398px;
  margin-top: 4px;
  a {
    color: #ff6600;
  }
}
.form-item {
  margin-bottom: 24px;
  .item-label {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    margin-right: 16px;
    span {
      font-size: 14px;
      font-family: PingFangSC;
      color: #999999;
    }
  }
  .red-tip::before {
    content: '*';
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 14px;
    color: #ed4014;
  }
  .item-upload {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #00a3ff;
    cursor: pointer;
    img {
      vertical-align: middle;
      margin-right: 2px;
    }
  }
  .tip {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ff6600;
    margin-top: 6px;
  }
  .classify-box {
    img {
      vertical-align: sub;
    }
    span {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #00a3ff;
      margin-left: 2px;
    }
  }
}
.line {
  height: 1px;
  background: #999999;
  opacity: 0.2;
  width: 100%;
  margin: 32px 0;
}
.next-button {
  text-align: center;
  button {
    padding: 5px 16px;
    background: #00a3ff;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    border: none;
    cursor: pointer;
    margin-right: 8px;
  }
  .white-btn {
    background-color: #fff;
    border: 1px solid #00a3ff;
    color: #00a3ff;
  }
}
.classify-modal {
  .classify-header {
    .title {
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #333333;
      span {
        font-size: 14px;
        font-family: PingFangSC;
        color: #ff6600;
        margin-left: 12px;
      }
    }
    .tip {
      margin-top: 6px;
      font-size: 12px;
      font-family: PingFangSC;
      color: #999999;
      line-height: 18px;
      font-weight: 400;
    }
  }
  .classify-footer {
    text-align: right;
    padding-bottom: 32px;
    button {
      width: 92px;
      height: 38px;
      background-color: #00a3ff;
      color: #fff;
    }
  }
}
.subclass-table {
  margin-top: 6px;
  max-width: 808px;
  max-height: 200px;
  overflow-y: scroll;
}
.classify-add-btn {
  width: 76px;
  height: 32px;
  background: #00a3ff;
  border-radius: 2px;
  color: #fff;
}
.check-two-category {
  span {
    color: #00a3ff;
    font-size: 14px;
    margin-right: 8px;
    display: block;
    padding: 6px 8px;
    background: #eff9ff;
    margin-top: 10px;
    img {
      margin-left: 4px;
      vertical-align: middle;
      cursor: pointer;
    }
  }
}
.risk-box {
  margin-top: 24px;
  .tip-box {
    margin: 8px 0 0 0;
    width: 832px;
    .color333 {
      color: #333;
    }
  }
  .subclass-table {
    border: 1px solid rgba(0, 0, 0, 0.15);
    margin-top: 12px;
  }
}
.proof-example-modal {
  .examples {
    p {
      font-size: 14px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #333333;
    }
    img {
      width: 270px;
      height: 164px;
      margin-top: 14px;
      margin-right: 8px;
    }
  }
  .modal-tip {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    padding-bottom: 30px;
    margin-top: 10px;
    img {
      vertical-align: middle;
      margin-right: 6px;
    }
  }
}
.search-subclass-btn {
  width: 76px;
  height: 32px;
  background: #00a3ff;
  border-radius: 2px;
  color: #fff;
}
.tip-content {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  margin-left: 38px;
}

.proof-example-modal /deep/ .ivu-modal {
  width: 610px !important;
}
/deep/ .ivu-modal-body {
  padding: 24px;
}
.classify-modal /deep/ .ivu-checkbox-group-item {
  margin-bottom: 18px;
}
.inline-box /deep/ .ivu-form-item-content {
  display: inline-block;
  vertical-align: bottom;
  margin-left: 20px;
}
.width100 /deep/ .ivu-form-item-content {
  width: 100%;
}
.width156 {
  width: 156px;
  margin-right: 12px;
  display: inline-block;
}
.width156 /deep/ .ivu-form-item-content {
  width: 156px;
}
/deep/ .ivu-table-overflowX {
  overflow-x: hidden;
}
/deep/ .ivu-table-wrapper-with-border {
  border-bottom: auto;
}
/deep/ .ivu-table:before {
  height: 0;
}
/deep/ .ivu-table-border:after {
  width: 0;
}
</style>
