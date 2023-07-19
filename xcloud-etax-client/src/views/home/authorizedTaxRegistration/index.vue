<template>
  <div class="container">
    <div class="topTaxBoxContainer">
      <span class="title"> 待授权税号 </span>
      <span class="country">
        <!-- 1 税号注册 2、税务申报 3、税务补缴 4、转代理 5、注册+申报 6、注销税号 7、税务稽查 -->
        （{{ countryNameZh
        }}{{
          productFunctionCode == "1"
            ? "税号注册"
            : productFunctionCode == "2"
            ? "转代理+申报"
            : productFunctionCode == "3"
            ? "税务补缴"
            : productFunctionCode == "4"
            ? "转代理"
            : productFunctionCode == "5"
            ? "注册+申报"
            : productFunctionCode == "6"
            ? "注销税号"
            : productFunctionCode == "7"
            ? "税务稽查"
            : ""
        }}）
      </span>
    </div>
    <div class="subInfo">
      <img
        src="@/assets/images/common/gantanhao.png"
        style="width: 15px; margin-right: 5px; margin-bottom: 2px"
        alt=""
      />
      <p v-if="countryCode == 'AE'">
        阿联酋特别说明：根据阿联酋税局要求，合规进行VAT税号注册及申报服务，需要卖家提供授权书及flowchat；
      </p>
      <p v-if="countryCode == 'SA'">
        沙特特别说明：根据沙特局要求，合规进行VAT税号注册及申报服务，需要卖家提供授权书及flowchat；
      </p>
      <p v-if="countryCode == 'NL'">
        荷兰特别说明：根据荷兰税局要求，合规进行VAT税号注册及申报服务，需要卖家提供授权书给税务代理；
      </p>
      <p v-if="countryCode == 'IT' && productFunctionCode == '2'">
        意大利特别说明：根据意大利税局要求，合规进行VAT服务，需要卖家提供授权书；
      </p>
      <p v-if="countryCode == 'IT' && productFunctionCode == '5'">
        意大利特别说明：根据意大利税局要求，合规进行VAT税号注册及申报服务，需要卖家提供授权书给税务代理；
      </p>
      <p v-if="countryCode == 'FR' && productFunctionCode == '2'">
        法国特别说明：根据法国税局要求，合规进行VAT服务，需要卖家提供授权书；
      </p>
      <p v-if="countryCode == 'FR' && productFunctionCode == '5'">
        法国特别说明：根据法国税局要求，合规进行VAT税号注册及申报服务，需要卖家提供授权书给税务代理；
      </p>
      <p v-if="countryCode == 'ES'">
        西班牙特别说明：根据西班牙海关要求，合理进行VAT税号注册及申报服务（包括海牙认证），需要卖家提供真实有效的相关证明；
      </p>
    </div>
    <div class="content">
      <p class="red-tip">备注：以下资料下载打印后需要进行法人签名及盖章，再进行上传即可；</p>
      <Form ref="formLeft">
        <Row>
          <Col :span="8">
            <FormItem
              :label="$route.query.supplierId == 61 ? '代表授权书ECO TAX' :$route.query.supplierId == 96 ? '授权书(TVA)':$route.query.supplierId == 97 ? '授权书(UNI)':'授权书'"
              v-if="countryCode !== 'AE' && countryCode !== 'SA'"
              style="margin-bottom: 15px"
              class="flex-direction requiredItem"
            >
              <Upload
                :before-upload="beforeUploadHandler"
                :on-success="
                  (res, file, fileList) => {
                    successHandler(res, file, fileList, 'regAuthorizationFile');
                  }
                "
                :on-remove="
                  (file, fileList) => {
                    removeHandler(file, fileList, 'regAuthorizationFile');
                  }
                "
                :action="ImgUrl"
                :data="{ prefix: '' }"
                :show-upload-list="false"
                :max-size="102400"
                :on-exceeded-size="handleMaxSize"
              >
                <div class="inner" @click="beforType('regAuthorizationFile')">
                  <img class="uplad-symbol" src="@/assets/images/common/uploadIcon1.png" alt="" />
                  <span class="uplad-word">点击上传</span>
                </div>
              </Upload>
              <div
                class="out-img-box"
                v-if="formLeft.regAuthorizationFile !== '' && showLeft.regAuthorizationFile != ''"
              >
                <div class="inner img-box">
                  <a :href="showLeft.regAuthorizationFile" target="_blank" class="show-pdf">
                    {{ supplierId == 61 ? "代表授权书ECO TAX" : "授权书" }}
                  </a>
                  <Button class="deletBtn">
                    <img
                      @click="removeHandler(1, 1, 'regAuthorizationFile')"
                      class="closeImg"
                      src="@/assets/images/common/activeCloseImg.png"
                      alt=""
                    />
                  </Button>
                </div>
              </div>
              <div class="upload-tip" v-if="countryCode == 'NL'">
                <a href="http://file.itaxs.com/dev/20210225/76691a74961b43cf8fb6ee26cea246b4.jpg" target="_blank">
                  <img src="@/assets/images/common/searchImg.png" alt="" />
                  查看示例
                </a>
              </div>

              <div class="upload-tip" v-if="countryCode == 'FR'">
                <a
                  v-if="$route.query.supplierId == 52"
                  href="https://file.itaxs.com/dev/20210610/2dbc29749ad84b3480ba87983752c01d.pdf"
                  target="_blank"
                >
                  <img src="@/assets/images/common/searchImg.png" alt="" />
                  查看示例
                </a>
                <!-- 陈氏的 授权书 -->
                <a
                  v-else-if="$route.query.supplierId == 42"
                  href="https://file.itaxs.com/pro/20210727/8abe3e7a97bf4b4d935af042d93a9bf0.pdf"
                  target="_blank"
                >
                  <img src="@/assets/images/common/searchImg.png" alt="" />
                  查看示例
                </a>
                <!-- eco的 代表授权书ECO TAX -->
                <a
                  v-else-if="$route.query.supplierId == 61"
                  href="https://file.itaxs.com/pro/20210727/f4812624f223421a9a3ec68eb0f97365.pdf "
                  target="_blank"
                >
                  <img src="@/assets/images/common/searchImg.png" alt="" />
                  查看示例
                </a>
              <!-- VERICO授权书查看示例 -->
                <a
                  v-else-if="$route.query.supplierId == 96"
                  href="http://file.itaxs.com/dev/20210923/94ba9b8201e541d5a3e00f0119f4d7aa.pdf"
                  target="_blank"
                >
                  <img src="@/assets/images/common/searchImg.png" alt="" />
                  查看示例
                </a>
              <!-- AWA授权书查看示例 -->
                <!-- <a
                  v-else-if="$route.query.supplierId == 97"
                  href="http://file.itaxs.com/dev/20210923/c2f4caf2160a4f2f94a7352e95dc9ba9.pdf"
                  target="_blank"
                >
                  <img src="@/assets/images/common/searchImg.png" alt="" />
                  查看示例
                </a> -->
                <a
                  v-else-if="$route.query.supplierId == 97"
                >
                  本授权书无需签字盖章，核对无误后重新上传即可
                </a>

                <a
                  v-else
                  href="https://file.itaxs.com/dev/20210325/f10c882230e34e7db840d3d611affb3d.pdf"
                  target="_blank"
                >
                  <img src="@/assets/images/common/searchImg.png" alt="" />
                  查看示例
                </a>
              </div>

              <div class="upload-tip" v-if="countryCode == 'ES'">
                <a
                  href="https://pre-fdfs.itaxs.com/group1/M00/00/CD/rBLKLV_R1ZiAbdA4AAsuRQ2eESA296.pdf"
                  target="_blank"
                >
                  <img src="@/assets/images/common/searchImg.png" alt="" />
                  查看示例
                </a>
              </div>
              <div class="upload-tip" v-if="countryCode == 'NL'" style="margin-left: 10px">
                <a href="javascript:;" @click="uploadAuthorizationTep" style="color: #ed3e3e">
                  <img src="@/assets/images/common/downloadImg.svg" alt="" />
                  下载授权书
                </a>
              </div>
              <div class="upload-tip" v-if="countryCode == 'ES'" style="margin-left: 10px">
                <a href="javascript:;" @click="esDownLoad('1')" style="color: #ed3e3e">
                  <img src="@/assets/images/common/downloadImg.svg" alt="" />
                  点击下载
                </a>
              </div>
              <div class="upload-tip" v-if="countryCode == 'FR'" style="margin-left: 10px">
                <a
                  href="javascript:;"
                  v-if="supplierId == 61"
                  @click="uploadAuthorizationTep(5)"
                  style="color: #ed3e3e"
                >
                  <img src="@/assets/images/common/downloadImg.svg" alt="" />
                  点击下载
                </a>
                <a
                  href="javascript:;"
                  v-else-if="supplierId == 42"
                  @click="uploadAuthorizationTep(2)"
                  style="color: #ed3e3e"
                >
                  <img src="@/assets/images/common/downloadImg.svg" alt="" />
                  点击下载
                </a>
                <a v-else href="javascript:;" @click="uploadAuthorizationTep" style="color: #ed3e3e">
                  <img src="@/assets/images/common/downloadImg.svg" alt="" />
                  点击下载
                </a>
              </div>
              <div class="upload-tip" v-if="countryCode == 'IT'" style="margin-left: 10px">
                <a href="javascript:;" @click="uploadAuthorizationTep" style="color: #ed3e3e">
                  <img src="@/assets/images/common/downloadImg.svg" alt="" />
                  点击下载
                </a>
              </div>
            </FormItem>
          </Col>
          <!-- naoki add -->
          <Col :span="8"  v-if="countryCode == 'FR' && ($route.query.supplierId == 96 || $route.query.supplierId == 97)">
            <FormItem
              :label="$route.query.supplierId == 61 ? '代表授权书ECO TAX' :$route.query.supplierId == 96 ? '授权书(REMBOURSEMENT)':$route.query.supplierId == 97 ? '授权书(TVA)':'授权书'"
              v-if="countryCode !== 'AE' && countryCode !== 'SA'"
              style="margin-bottom: 15px"
              class="flex-direction requiredItem"
            >
              <Upload
                :before-upload="beforeUploadHandler"
                :on-success="
                  (res, file, fileList) => {
                    successHandler(res, file, fileList, 'regAuthorizationFile1');
                  }
                "
                :on-remove="
                  (file, fileList) => {
                    removeHandler(file, fileList, 'regAuthorizationFile1');
                  }
                "
                :action="ImgUrl"
                :data="{ prefix: '' }"
                :show-upload-list="false"
                :max-size="102400"
                :on-exceeded-size="handleMaxSize"
              >
                <div class="inner" @click="beforType('regAuthorizationFile1')">
                  <img class="uplad-symbol" src="@/assets/images/common/uploadIcon1.png" alt="" />
                  <span class="uplad-word">点击上传</span>
                </div>
              </Upload>
              <div
                class="out-img-box"
                v-if="formLeft.regAuthorizationFile1 !== '' && showLeft.regAuthorizationFile1 != ''"
              >
                <div class="inner img-box">
                  <a :href="showLeft.regAuthorizationFile1" target="_blank" class="show-pdf">
                    {{ supplierId == 61 ? "代表授权书ECO TAX" : "授权书" }}
                  </a>
                  <Button class="deletBtn">
                    <img
                      @click="removeHandler(1, 1, 'regAuthorizationFile1')"
                      class="closeImg"
                      src="@/assets/images/common/activeCloseImg.png"
                      alt=""
                    />
                  </Button>
                </div>
              </div>
              <div class="upload-tip" v-if="countryCode == 'NL'">
                <a href="http://file.itaxs.com/dev/20210225/76691a74961b43cf8fb6ee26cea246b4.jpg" target="_blank">
                  <img src="@/assets/images/common/searchImg.png" alt="" />
                  查看示例
                </a>
              </div>

              <div class="upload-tip" v-if="countryCode == 'FR'">
                <a
                  v-if="$route.query.supplierId == 52"
                  href="https://file.itaxs.com/dev/20210610/2dbc29749ad84b3480ba87983752c01d.pdf"
                  target="_blank"
                >
                  <img src="@/assets/images/common/searchImg.png" alt="" />
                  查看示例
                </a>
                <!-- 陈氏的 授权书 -->
                <a
                  v-else-if="$route.query.supplierId == 42"
                  href="https://file.itaxs.com/pro/20210727/8abe3e7a97bf4b4d935af042d93a9bf0.pdf"
                  target="_blank"
                >
                  <img src="@/assets/images/common/searchImg.png" alt="" />
                  查看示例
                </a>
                <!-- eco的 代表授权书ECO TAX -->
                <a
                  v-else-if="$route.query.supplierId == 61"
                  href="https://file.itaxs.com/pro/20210727/f4812624f223421a9a3ec68eb0f97365.pdf "
                  target="_blank"
                >
                  <img src="@/assets/images/common/searchImg.png" alt="" />
                  查看示例
                </a>
              <!-- VERICO授权书查看示例 -->
                <a
                v-else-if="$route.query.supplierId == 96"
                  href="http://file.itaxs.com/dev/20210923/8b60ffee913341e49aa3e45289a9e544.pdf"
                  target="_blank"
                >
                  <img src="@/assets/images/common/searchImg.png" alt="" />
                  查看示例
                </a>
              <!-- AWA授权书查看示例 -->
                <a
                  v-else-if="$route.query.supplierId == 97"
                  href="http://file.itaxs.com/dev/20210923/c2f4caf2160a4f2f94a7352e95dc9ba9.pdf"
                  target="_blank"
                >
                  <img src="@/assets/images/common/searchImg.png" alt="" />
                  查看示例
                </a>

                <a
                  v-else
                  href="https://file.itaxs.com/dev/20210325/f10c882230e34e7db840d3d611affb3d.pdf"
                  target="_blank"
                >
                  <img src="@/assets/images/common/searchImg.png" alt="" />
                  查看示例
                </a>
              </div>

              <div class="upload-tip" v-if="countryCode == 'ES'">
                <a
                  href="https://pre-fdfs.itaxs.com/group1/M00/00/CD/rBLKLV_R1ZiAbdA4AAsuRQ2eESA296.pdf"
                  target="_blank"
                >
                  <img src="@/assets/images/common/searchImg.png" alt="" />
                  查看示例
                </a>
              </div>
              <div class="upload-tip" v-if="countryCode == 'NL'" style="margin-left: 10px">
                <a href="javascript:;" @click="uploadAuthorizationTep" style="color: #ed3e3e">
                  <img src="@/assets/images/common/downloadImg.svg" alt="" />
                  下载授权书
                </a>
              </div>
              <div class="upload-tip" v-if="countryCode == 'ES'" style="margin-left: 10px">
                <a href="javascript:;" @click="esDownLoad('1')" style="color: #ed3e3e">
                  <img src="@/assets/images/common/downloadImg.svg" alt="" />
                  点击下载
                </a>
              </div>
              <div class="upload-tip" v-if="countryCode == 'FR'" style="margin-left: 10px">
                <a
                  href="javascript:;"
                  v-if="supplierId == 61"
                  @click="uploadAuthorizationTep(5)"
                  style="color: #ed3e3e"
                >
                  <img src="@/assets/images/common/downloadImg.svg" alt="" />
                  点击下载
                </a>
                <a
                  href="javascript:;"
                  v-else-if="supplierId == 42"
                  @click="uploadAuthorizationTep(2)"
                  style="color: #ed3e3e"
                >
                  <img src="@/assets/images/common/downloadImg.svg" alt="" />
                  点击下载
                </a>
                <a
                  href="javascript:;"
                  v-else-if="supplierId == 96 || supplierId == 97"
                  @click="uploadAuthorizationTep(9)"
                  style="color: #ed3e3e"
                >
                  <img src="@/assets/images/common/downloadImg.svg" alt="" />
                  点击下载
                </a>
                <a v-else href="javascript:;" @click="uploadAuthorizationTep" style="color: #ed3e3e">
                  <img src="@/assets/images/common/downloadImg.svg" alt="" />
                  点击下载
                </a>
              </div>
              <div class="upload-tip" v-if="countryCode == 'IT'" style="margin-left: 10px">
                <a href="javascript:;" @click="uploadAuthorizationTep" style="color: #ed3e3e">
                  <img src="@/assets/images/common/downloadImg.svg" alt="" />
                  点击下载
                </a>
              </div>
            </FormItem>
          </Col>
          <Col :span="8" v-if="supplierId == 61">
            <FormItem label="欧洲公司授权税务代理书" style="margin-bottom: 15px" class="flex-direction requiredItem">
              <Upload
                :before-upload="beforeUploadHandler"
                :on-success="
                  (res, file, fileList) => {
                    successHandler(res, file, fileList, 'regAuthorizationFile1');
                  }
                "
                :on-remove="
                  (file, fileList) => {
                    removeHandler(file, fileList, 'regAuthorizationFile1');
                  }
                "
                :action="ImgUrl"
                :data="{ prefix: '' }"
                :show-upload-list="false"
                :max-size="102400"
                :on-exceeded-size="handleMaxSize"
              >
                <div class="inner" @click="beforType('regAuthorizationFile1')">
                  <img class="uplad-symbol" src="@/assets/images/common/uploadIcon1.png" alt="" />
                  <span class="uplad-word">点击上传</span>
                </div>
              </Upload>
              <div
                class="out-img-box"
                v-if="formLeft.regAuthorizationFile1 !== '' && showLeft.regAuthorizationFile1 != ''"
              >
                <div class="inner img-box">
                  <a :href="showLeft.regAuthorizationFile1" target="_blank" class="show-pdf">
                    欧洲公司授权税务代理书
                  </a>
                  <Button class="deletBtn">
                    <img
                      @click="removeHandler(1, 1, 'regAuthorizationFile1')"
                      class="closeImg"
                      src="@/assets/images/common/activeCloseImg.png"
                      alt=""
                    />
                  </Button>
                </div>
              </div>
              <div class="upload-tip">
                <a href="https://file.itaxs.com/pro/20210727/b06bf08a761f42adaf546f20c1a27c09.pdf" target="_blank">
                  <img src="@/assets/images/common/searchImg.png" alt="" />
                  查看示例
                </a>
              </div>
              <div class="upload-tip" style="margin-left: 10px">
                <a href="javascript:;" @click="uploadAuthorizationTep(6)" style="color: #ed3e3e">
                  <img src="@/assets/images/common/downloadImg.svg" alt="" />
                  点击下载
                </a>
              </div>
            </FormItem>
          </Col>
          <Col :span="8" v-if="countryCode == 'FR' && supplierId == 42">
            <FormItem label="前税代终止授权书" style="margin-bottom: 15px" class="flex-direction requiredItem">
              <Upload
                :before-upload="beforeUploadHandler"
                :on-success="
                  (res, file, fileList) => {
                    successHandler(res, file, fileList, 'formerAgentTerminationAuthorizationLetter');
                  }
                "
                :on-remove="
                  (file, fileList) => {
                    removeHandler(file, fileList, 'formerAgentTerminationAuthorizationLetter');
                  }
                "
                :action="ImgUrl"
                :data="{ prefix: '' }"
                :show-upload-list="false"
                :max-size="102400"
                :on-exceeded-size="handleMaxSize"
              >
                <div class="inner" @click="beforType('formerAgentTerminationAuthorizationLetter')">
                  <img class="uplad-symbol" src="@/assets/images/common/uploadIcon1.png" alt="" />
                  <span class="uplad-word">点击上传</span>
                </div>
              </Upload>
              <div
                class="out-img-box"
                v-if="
                  formLeft.formerAgentTerminationAuthorizationLetter !== '' &&
                  showLeft.formerAgentTerminationAuthorizationLetter != ''
                "
              >
                <div class="inner img-box">
                  <a :href="showLeft.formerAgentTerminationAuthorizationLetter" target="_blank" class="show-pdf">
                    前税代终止授权书
                  </a>
                  <Button class="deletBtn">
                    <img
                      @click="removeHandler(1, 1, 'formerAgentTerminationAuthorizationLetter')"
                      class="closeImg"
                      src="@/assets/images/common/activeCloseImg.png"
                      alt=""
                    />
                  </Button>
                </div>
              </div>
              <div class="upload-tip" v-if="countryCode == 'FR'">
                <a href="https://file.itaxs.com/pro/20210727/3fede3aac88d4868bb10b828bec4cfa2.pdf" target="_blank">
                  <img src="@/assets/images/common/searchImg.png" alt="" />
                  查看示例
                </a>
              </div>
              <div class="upload-tip" v-if="countryCode == 'FR'" style="margin-left: 10px">
                <a href="javascript:;" @click="uploadFormerAgentTerminationAuthorizationLetter" style="color: #ed3e3e">
                  <img src="@/assets/images/common/downloadImg.svg" alt="" />
                  点击下载
                </a>
              </div>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem
              label="授权书"
              v-if="countryCode == 'AE' || countryCode == 'SA'"
              style="margin-bottom: 15px"
              class="flex-direction requiredItem"
            >
              <Upload
                :before-upload="beforeUploadHandler"
                :on-success="
                  (res, file, fileList) => {
                    successHandler(res, file, fileList, 'taxRegisterLetter');
                  }
                "
                :on-remove="
                  (file, fileList) => {
                    removeHandler(file, fileList, 'taxRegisterLetter');
                  }
                "
                :action="ImgUrl"
                :data="{ prefix: '' }"
                :show-upload-list="false"
                :max-size="102400"
                :on-exceeded-size="handleMaxSize"
              >
                <div class="inner" @click="beforType('taxRegisterLetter')">
                  <img class="uplad-symbol" src="@/assets/images/common/uploadIcon1.png" alt="" />
                  <span class="uplad-word">点击上传</span>
                </div>
              </Upload>
              <div class="out-img-box" v-if="formLeft.taxRegisterLetter !== '' && showLeft.taxRegisterLetter != ''">
                <div class="inner img-box">
                  <a :href="showLeft.taxRegisterLetter" target="_blank" class="show-pdf"> 授权书 </a>
                  <Button class="deletBtn">
                    <img
                      @click="removeHandler(1, 1, 'taxRegisterLetter')"
                      class="closeImg"
                      src="@/assets/images/common/activeCloseImg.png"
                      alt=""
                    />
                  </Button>
                </div>
              </div>
              <div class="upload-tip" v-if="countryCode == 'NL'">
                <a
                  href="https://pre-fdfs.itaxs.com/group1/M00/00/C8/rBLKLV_LXAyAfw7CAARCTLIO3po984.pdf"
                  target="_blank"
                >
                  <img src="@/assets/images/common/searchImg.png" alt="" />
                  查看示例
                </a>
              </div>
              <div class="upload-tip" v-if="countryCode == 'AE' || countryCode == 'SA'" style="margin-left: 10px">
                <a href="javascript:;" @click="uploadAuthorizationTep" style="color: #ed3e3e">
                  <img src="@/assets/images/common/downloadImg.svg" alt="" />
                  下载授权书
                </a>
              </div>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem
              label="flowchartFile"
              v-if="countryCode == 'AE' || countryCode == 'SA'"
              style="margin-bottom: 15px"
              class="flex-direction requiredItem"
            >
              <Upload
                :before-upload="beforeUploadHandler"
                :on-success="
                  (res, file, fileList) => {
                    successHandler(res, file, fileList, 'flowchartFile');
                  }
                "
                :on-remove="
                  (file, fileList) => {
                    removeHandler(file, fileList, 'flowchartFile');
                  }
                "
                :action="ImgUrl"
                :data="{ prefix: '' }"
                :show-upload-list="false"
                :max-size="102400"
                :on-exceeded-size="handleMaxSize"
              >
                <div class="inner" @click="beforType('flowchartFile')">
                  <img class="uplad-symbol" src="@/assets/images/common/uploadIcon1.png" alt="" />
                  <span class="uplad-word">点击上传</span>
                </div>
              </Upload>
              <div class="out-img-box" v-if="formLeft.flowchartFile !== '' && showLeft.flowchartFile != ''">
                <div class="inner img-box">
                  <a :href="showLeft.flowchartFile" target="_blank" class="show-pdf"> flowchartFile </a>
                  <Button class="deletBtn">
                    <img
                      @click="removeHandler(1, 1, 'flowchartFile')"
                      class="closeImg"
                      src="@/assets/images/common/activeCloseImg.png"
                      alt=""
                    />
                  </Button>
                </div>
              </div>
              <div class="upload-tip" v-if="countryCode == 'AE' || countryCode == 'SA'" style="margin-left: 10px">
                <a href="javascript:;" @click="downLoad" style="color: #ed3e3e">
                  <img src="@/assets/images/common/downloadImg.svg" alt="" />
                  下载flowchat
                </a>
              </div>
            </FormItem>
          </Col>

          <!-- 西班牙授权 -->
          <Col :span="8">
            <FormItem
              label="海牙中西语授权书："
              v-if="countryCode == 'ES'"
              style="margin-bottom: 15px"
              class="flex-direction requiredItem"
            >
              <Upload
                :before-upload="beforeUploadHandler"
                :on-success="
                  (res, file, fileList) => {
                    successHandler(res, file, fileList, 'regAuthorizationFileZh');
                  }
                "
                :on-remove="
                  (file, fileList) => {
                    removeHandler(file, fileList, 'regAuthorizationFileZh');
                  }
                "
                :action="ImgUrl"
                :data="{ prefix: '' }"
                :show-upload-list="false"
                :max-size="102400"
                :on-exceeded-size="handleMaxSize"
              >
                <div class="inner" @click="beforType('regAuthorizationFileZh')">
                  <img class="uplad-symbol" src="@/assets/images/common/uploadIcon1.png" alt="" />
                  <span class="uplad-word">点击上传</span>
                </div>
              </Upload>
              <div
                class="out-img-box"
                v-if="formLeft.regAuthorizationFileZh !== '' && showLeft.regAuthorizationFileZh != ''"
              >
                <div class="inner img-box">
                  <a :href="showLeft.regAuthorizationFileZh" target="_blank" class="show-pdf"> 海牙中西语授权书 </a>
                  <Button class="deletBtn">
                    <img
                      @click="removeHandler(1, 1, 'regAuthorizationFileZh')"
                      class="closeImg"
                      src="@/assets/images/common/activeCloseImg.png"
                      alt=""
                    />
                  </Button>
                </div>
              </div>
              <div class="upload-tip">
                <a
                  href="https://pre-fdfs.itaxs.com/group1/M00/00/CD/rBLKLV_R1cmAP8yUAA46SnMkOwE525.pdf"
                  target="_blank"
                >
                  <img src="@/assets/images/common/searchImg.png" alt="" />
                  查看示例
                </a>
              </div>
              <div class="upload-tip" style="margin-left: 10px">
                <a href="javascript:;" @click="esDownLoad('2')" style="color: #ed3e3e">
                  <img src="@/assets/images/common/downloadImg.svg" alt="" />
                  点击下载
                </a>
              </div>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem
              label="OtorgaApodera_es_es 中文版："
              v-if="countryCode == 'ES'"
              style="margin-bottom: 15px"
              class="flex-direction requiredItem"
            >
              <Upload
                :before-upload="beforeUploadHandler"
                :on-success="
                  (res, file, fileList) => {
                    successHandler(res, file, fileList, 'otorgaApoderaEs');
                  }
                "
                :on-remove="
                  (file, fileList) => {
                    removeHandler(file, fileList, 'otorgaApoderaEs');
                  }
                "
                :action="ImgUrl"
                :data="{ prefix: '' }"
                :show-upload-list="false"
                :max-size="102400"
                :on-exceeded-size="handleMaxSize"
              >
                <div class="inner" @click="beforType('otorgaApoderaEs')">
                  <img class="uplad-symbol" src="@/assets/images/common/uploadIcon1.png" alt="" />
                  <span class="uplad-word">点击上传</span>
                </div>
              </Upload>
              <div class="out-img-box" v-if="formLeft.otorgaApoderaEs !== '' && showLeft.otorgaApoderaEs != ''">
                <div class="inner img-box">
                  <a :href="showLeft.otorgaApoderaEs" target="_blank" class="show-pdf"> OtorgaApodera_es_es 中文版 </a>
                  <Button class="deletBtn">
                    <img
                      @click="removeHandler(1, 1, 'otorgaApoderaEs')"
                      class="closeImg"
                      src="@/assets/images/common/activeCloseImg.png"
                      alt=""
                    />
                  </Button>
                </div>
              </div>
              <div class="upload-tip">
                <a
                  href="https://pre-fdfs.itaxs.com/group1/M00/00/CD/rBLKLV_R1eaAUNtyAAS_eQxSV9E201.pdf"
                  target="_blank"
                >
                  <img src="@/assets/images/common/searchImg.png" alt="" />
                  查看示例
                </a>
              </div>
              <div class="upload-tip" style="margin-left: 10px">
                <a href="javascript:;" @click="esDownLoad('3')" style="color: #ed3e3e">
                  <img src="@/assets/images/common/downloadImg.svg" alt="" />
                  点击下载
                </a>
              </div>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="8">
            <FormItem
              label="OtorgaApodera_es_es 西语版："
              v-if="countryCode == 'ES'"
              style="margin-bottom: 15px"
              class="flex-direction requiredItem"
            >
              <Upload
                :before-upload="beforeUploadHandler"
                :on-success="
                  (res, file, fileList) => {
                    successHandler(res, file, fileList, 'otorgaApoderaZh');
                  }
                "
                :on-remove="
                  (file, fileList) => {
                    removeHandler(file, fileList, 'otorgaApoderaZh');
                  }
                "
                :action="ImgUrl"
                :data="{ prefix: '' }"
                :show-upload-list="false"
                :max-size="102400"
                :on-exceeded-size="handleMaxSize"
              >
                <div class="inner" @click="beforType('otorgaApoderaZh')">
                  <img class="uplad-symbol" src="@/assets/images/common/uploadIcon1.png" alt="" />
                  <span class="uplad-word">点击上传</span>
                </div>
              </Upload>
              <div class="out-img-box" v-if="formLeft.otorgaApoderaZh !== '' && showLeft.otorgaApoderaZh != ''">
                <div class="inner img-box">
                  <a :href="showLeft.otorgaApoderaZh" target="_blank" class="show-pdf"> OtorgaApodera_es_es 西语版 </a>
                  <Button class="deletBtn">
                    <img
                      @click="removeHandler(1, 1, 'otorgaApoderaZh')"
                      class="closeImg"
                      src="@/assets/images/common/activeCloseImg.png"
                      alt=""
                    />
                  </Button>
                </div>
              </div>
              <div class="upload-tip">
                <a
                  href="https://pre-fdfs.itaxs.com/group1/M00/00/CD/rBLKLV_R1g6AW77_AAJ9-6Djk6Y416.pdf"
                  target="_blank"
                >
                  <img src="@/assets/images/common/searchImg.png" alt="" />
                  查看示例
                </a>
              </div>
              <div class="upload-tip" style="margin-left: 10px">
                <a href="javascript:;" @click="esDownLoad('4')" style="color: #ed3e3e">
                  <img src="@/assets/images/common/downloadImg.svg" alt="" />
                  点击下载
                </a>
              </div>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
    <p style="text-align: center">
      <Button type="primary" style="width: 100px" @click="sureEnterHaugeInfo">提交</Button>
    </p>
    <Spin size="large" fix v-if="spinShow">
      <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
      <div class="loadingText">{{ operateText }}</div>
    </Spin>
  </div>
</template>
<script>
import { sendFileRegFR, sendFileFR, esAuthorization } from "@/api/taxModule";
export default {
  data() {
    return {
      spinShow: false,
      operateText: "",
      detailModel: true,
      countryCode: this.$route.query.countryCode,
      serviceId: this.$route.query.serviceId,
      countryNameZh: this.$route.query.countryNameZh,
      supplierId: this.$route.query.supplierId,
      productFunctionCode: this.$route.query.productFunctionCode,
      nowFile: "",
      formLeft: {
        regAuthorizationFile: "",
        regAuthorizationFile1:"",
        formerAgentTerminationAuthorizationLetter: "",
        flowchartFile: "",
        taxRegisterLetter: "",
        otorgaApoderaEs: "",
        otorgaApoderaZh: "",
        regAuthorizationFileZh: "",
      },
      showLeft: {
        regAuthorizationFile: "",
        regAuthorizationFile1:"",
        formerAgentTerminationAuthorizationLetter: "",
        flowchartFile: "",
        taxRegisterLetter: "",
        otorgaApoderaEs: "",
        otorgaApoderaZh: "",
        regAuthorizationFileZh: "",
      },
    };
  },
  created() {},
  methods: {
    changeState(val) {
      this.$emit("changeSendStateFR", false);
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "超过文件大小限制",
        desc: "上传文件不超过100M",
      });
    },
    successHandler(res, file, fileList, item) {
      let self = this;
      if (res.code !== 0) {
        self.$Notice.warning({
          title: "警告",
          desc: "请尝试再次上传",
        });
        return false;
      }
      let url = res.data.fileUrl;
      if (url.slice(0, 5) == "http:") {
        this.showLeft[item] = url.slice(0, 4) + "s" + url.slice(4);
      } else {
        this.showLeft[item] = url;
      }
      this.formLeft[item] = url;
    },
    removeHandler(file, fileList, item) {
      let self = this;
      this.formLeft[item] = "";
      this.showLeft[item] = "";
    },
    beforeUploadHandler(file) {
      let self = this;
      const check = self.formLeft[this.nowFile] == "";
      if (!check) {
        self.$Notice.warning({
          title: "最多只可上传1个文件",
        });
      }
      return check;
    },
    beforType(item) {
      this.nowFile = item;
    },
    sureEnterHaugeInfo() {
      if (this.countryCode == "AE" || this.countryCode == "SA") {
        if (this.formLeft.taxRegisterLetter == "") {
          this.$Message.info("请先上传授权书");
          return;
        }
        if (this.formLeft.flowchartFile == "") {
          this.$Message.info("请先上传flowchat文件");
          return;
        }
      } else if (this.countryCode == "ES") {
        if (this.formLeft.regAuthorizationFile == "") {
          this.$Message.info("请先上传授权书");
          return;
        }
        if (this.formLeft.otorgaApoderaEs == "") {
          this.$Message.info("OtorgaApodera_es_es 中文版");
          return;
        }
        if (this.formLeft.otorgaApoderaZh == "") {
          this.$Message.info("OtorgaApodera_es_es 西语版");
          return;
        }
        if (this.formLeft.regAuthorizationFileZh == "") {
          this.$Message.info("海牙中西语授权书");
          return;
        }
      } else if (this.countryCode == "FR") {
        if (this.supplierId == 61) {
          if (this.formLeft.regAuthorizationFile == "") {
            this.$Message.info("代表授权书ECO TAX");
            return;
          }
          if (this.formLeft.regAuthorizationFile1 == "") {
            this.$Message.info("欧洲公司授权税务代理书");
            return;
          }
        } else if (this.supplierId == 42) {
          if (this.formLeft.regAuthorizationFile == "") {
            this.$Message.info("请上传授权书");
            return;
          }
          if (this.formLeft.formerAgentTerminationAuthorizationLetter == "") {
            this.$Message.info("请先上传前税代终止授权书");
            return;
          }
        } else if (this.supplierId == 96 || this.supplierId == 97) {
          if (this.formLeft.regAuthorizationFile == "") {
            this.$Message.info("请上传授权书");
            return;
          }
          if (this.formLeft.regAuthorizationFile1 == "") {
            this.$Message.info("请上授权书");
            return;
          }
        } else {
          if (this.formLeft.regAuthorizationFile == "") {
            this.$Message.info("请上传授权书");
            return;
          }
        }
      } else {
        if (this.formLeft.regAuthorizationFile == "") {
          this.$Message.info("请先上传授权书");
          return;
        }
      }
      if (this.countryCode === "ES") {
        this.RegESSenfile();
        return;
      }
      if (this.productFunctionCode == 5) {
        this.RegSenfile();
      } else if (this.productFunctionCode == 2) {
        this.Senfile();
      }
    },
    //注册上传
    RegSenfile() {
      let that = this;
      let data = {
        regAuthorizationFile: that.formLeft.regAuthorizationFile,
        flowchartFile: that.formLeft.flowchartFile,
        taxRegisterLetter: that.formLeft.taxRegisterLetter,
        serviceId: that.serviceId,
      };
      that.$Modal.confirm({
        title: "温馨提示",
        content: "<p>请确认已全部签字盖章上传</p>",
        onOk: () => {
          sendFileRegFR(data).then((res) => {
            if (res.code === 0) {
              that.$Message.success("提交资料成功");
              that.$router.replace("/work");
            }
          });
        },
      });
    },
    // 西班牙注册上传
    RegESSenfile() {
      let that = this;
      let data = {
        regAuthorizationFile: that.formLeft.regAuthorizationFile,
        otorgaApoderaEs: that.formLeft.otorgaApoderaEs,
        otorgaApoderaZh: that.formLeft.otorgaApoderaZh,
        regAuthorizationFileZh: that.formLeft.regAuthorizationFileZh,
        serviceId: that.serviceId,
      };
      that.$Modal.confirm({
        title: "温馨提示",
        content: "<p>请确认上传的资料无误</p>",
        onOk: () => {
          sendFileRegFR(data).then((res) => {
            if (res.code === 0) {
              that.$Message.success("操作成功");
              that.$router.replace("/work");
            }
          });
        },
      });
    },
    //转代理上传
    Senfile() {
      let that = this;
      let data = {
        regAuthorizationFile: that.formLeft.regAuthorizationFile,
        regAuthorizationFile1: that.formLeft.regAuthorizationFile1,
        serviceId: that.serviceId,
      };
      if (this.countryCode == "FR")
        data.formerAgentTerminationAuthorizationLetter = this.formLeft.formerAgentTerminationAuthorizationLetter;
        
      that.$Modal.confirm({
        title: "温馨提示",
        content: "<p>请确认已全部签字盖章上传</p>",
        onOk: () => {
          sendFileFR(data).then((res) => {
            if (res.code === 0) {
              that.$Message.success("操作成功");
              that.$router.replace("/work");
            }
          });
        },
      });
    },
    // 下载授权模板  根据服务ID获取授权书/申请函
    uploadAuthorizationTep(type) {
      let self = this;
      this.spinShow = true;
      this.operateText = "正在下载授权书，请稍后";
      let formData = new FormData();
      formData.append("servicesId", this.serviceId);
      // 如果是法国的，需要单独传参
      if (this.countryCode === "FR") {
        if (this.$route.query.supplierId == 96 ||this.$route.query.supplierId == 97) {
            if (type == 9) {
              formData.append("authType", 2);
            }else {
              formData.append("authType", 1);
            }
        }
        if (type && (type == 5 || type == 6)) {
          formData.append("operationType", type);
        } else {
          formData.append("operationType", 2);
        }
      }
      // 获取时间戳
      let timestamp = new Date().getTime();
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest();
      // xmlResquest.open("post", this.baseUrl + "/etax/derive/client/download/authorization", true);
      if (this.countryCode === "FR" && (this.$route.query.supplierId == 96 || this.$route.query.supplierId == 97)) {
        xmlResquest.open("post", this.baseUrl + "/etax/derive/client/download/authorization/more", true);
      }else{
        xmlResquest.open("post", this.baseUrl + "/etax/derive/client/download/authorization", true);
      }
      // 设置请求token
      xmlResquest.setRequestHeader("token", localStorage.getItem("token"));
      xmlResquest.setRequestHeader("sessionId", localStorage.getItem("sessionId"));
      xmlResquest.responseType = "blob";
      // 返回
      xmlResquest.onload = function (oEvent) {
        let content = xmlResquest.response;
        let fileName = "";
        if (xmlResquest.getResponseHeader("content-disposition")) {
          fileName = decodeURI(xmlResquest.getResponseHeader("content-disposition").split(";")[1].split("=")[1]);
          self.spinShow = false;
        } else {
          self.$Message.warning("下载出错！");
          self.spinShow = false;
          return;
        }
        // 组装a标签
        let elink = document.createElement("a");
        // 设置下载文件名
        elink.download = fileName;
        elink.style.display = "none";

        let blob = new Blob([content]);
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
      };
      xmlResquest.send(formData);
    },
    uploadFormerAgentTerminationAuthorizationLetter() {
      let self = this;
      this.spinShow = true;
      this.operateText = "正在下载前税代终止授权书，请稍后";
      let formData = new FormData();
      formData.append("servicesId", this.serviceId);
      formData.append("operationType", 4);
      // 获取时间戳
      let timestamp = new Date().getTime();
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest();
      xmlResquest.open("post", this.baseUrl + "/etax/derive/client/download/authorization", true);
      // 设置请求token
      xmlResquest.setRequestHeader("token", localStorage.getItem("token"));
      xmlResquest.setRequestHeader("sessionId", localStorage.getItem("sessionId"));
      xmlResquest.responseType = "blob";
      // 返回
      xmlResquest.onload = function (oEvent) {
        let content = xmlResquest.response;
        let fileName = "";
        if (xmlResquest.getResponseHeader("content-disposition")) {
          fileName = decodeURI(xmlResquest.getResponseHeader("content-disposition").split(";")[1].split("=")[1]);
          self.spinShow = false;
        } else {
          self.$Message.warning("下载出错！");
          self.spinShow = false;
          return;
        }
        // 组装a标签
        let elink = document.createElement("a");
        // 设置下载文件名
        elink.download = fileName;
        elink.style.display = "none";

        let blob = new Blob([content]);
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
      };
      xmlResquest.send(formData);
    },
    // 根据服务ID获取董事声明书/flowchart
    downLoad() {
      let self = this;
      this.spinShow = true;
      this.operateText = "正在下载flowchart，请稍后";
      let formData = new FormData();
      formData.append("servicesId", this.serviceId);
      // 获取时间戳
      let timestamp = new Date().getTime();
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest();
      xmlResquest.open("post", this.baseUrl + "/etax/derive/client/download/statement", true);
      // 设置请求token
      xmlResquest.setRequestHeader("token", localStorage.getItem("token"));
      xmlResquest.setRequestHeader("sessionId", localStorage.getItem("sessionId"));
      xmlResquest.responseType = "blob";
      // 返回
      xmlResquest.onload = function (oEvent) {
        let content = xmlResquest.response;
        let fileName = "";
        if (xmlResquest.getResponseHeader("content-disposition")) {
          fileName = decodeURI(xmlResquest.getResponseHeader("content-disposition").split(";")[1].split("=")[1]);
          self.spinShow = false;
        } else {
          self.$Message.warning("下载出错！");
          self.spinShow = false;
          return;
        }
        // 组装a标签
        let elink = document.createElement("a");
        // 设置下载文件名
        elink.download = fileName;
        elink.style.display = "none";

        let blob = new Blob([content]);
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
      };
      xmlResquest.send(formData);
    },
    // 下载西班牙授权资料
    esDownLoad(fileType) {
      let self = this;
      this.spinShow = true;
      this.operateText = "正在下载授权书，请稍后";
      let formData = new FormData();
      formData.append("servicesId", this.serviceId);
      formData.append("fileType", fileType);
      // 获取时间戳
      let timestamp = new Date().getTime();
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest();
      xmlResquest.open("post", this.baseUrl + "/etax/derive/client/download/authorization/es", true);
      // 设置请求token
      xmlResquest.setRequestHeader("token", localStorage.getItem("token"));
      xmlResquest.setRequestHeader("sessionId", localStorage.getItem("sessionId"));
      xmlResquest.responseType = "blob";
      // 返回
      xmlResquest.onload = function (oEvent) {
        let content = xmlResquest.response;
        let fileName = "";
        if (xmlResquest.getResponseHeader("content-disposition")) {
          fileName = decodeURI(xmlResquest.getResponseHeader("content-disposition").split(";")[1].split("=")[1]);
          self.spinShow = false;
        } else {
          self.$Message.warning("下载出错！");
          self.spinShow = false;
          return;
        }
        // 组装a标签
        let elink = document.createElement("a");
        // 设置下载文件名
        elink.download = fileName;
        elink.style.display = "none";

        let blob = new Blob([content]);
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
      };
      xmlResquest.send(formData);
    },
  },
};
</script>
<style lang="less" scoped>
.container {
  height: calc(100vh - 60px);
}
.topTaxBoxContainer {
  background: #ffffff;
  padding: 31px 31px 16px 31px;
  .title {
    font-size: 24px;
    font-family: "Microsoft Yahei", "PingFang SC", sans-serif;
    font-weight: 600;
    color: #333333;
    line-height: 22px;
  }
  .country {
    font-size: 14px;
    font-family: "Microsoft Yahei", "PingFang SC", sans-serif;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
  }
}
.subInfo {
  // width: 1104px;
  height: 40px;
  background: #fff1dd;
  font-size: 14px;
  font-family: "Microsoft Yahei", "PingFang SC", sans-serif;
  color: #333333ff;
  line-height: 14px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  padding-left: 20px;
  font-weight: 500;
  margin: 24px;
  margin-bottom: -24px;
}
.content {
  margin: 23px;
  background: #ffffff;
  padding: 24px 32px;

  .title {
    font-size: 18px;
    font-family: "Microsoft Yahei", "PingFangSC-Medium", "PingFang SC", sans-serif;
    font-weight: 500;
    color: #333333;
    line-height: 24px;
    margin-bottom: 10px;
  }
}
.flex-direction {
  display: flex;
  flex-direction: column;
  align-items: baseline;
}
/deep/ .ivu-form {
  .ivu-form-item-label {
    font-size: 16px;
    font-family: "Microsoft Yahei", "PingFangSC-Medium", "PingFang SC", sans-serif;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
    // float: none;
  }
  .ivu-form-item-content {
    width: 90%;
  }
}
.requiredItem {
  /deep/ .ivu-form-item-label::before {
    content: "*";
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: "Microsoft Yahei", "PingFang SC", sans-serif;
    font-size: 12px;
    color: #ed4014;
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
  font-size: 14px;
  color: #cccccc;
  vertical-align: bottom;
  margin-right: 16px;
  a {
    color: #16ade9;
  }
  img {
    width: 16px;
    height: 16px;
    margin-top: 9px;
    float: left;
    margin-right: 3px;
  }
  display: inline-block;
}
.red-tip {
  margin: 0px 0px 20px;

  font-size: 14px;
  font-family: "Microsoft Yahei", "PingFang SC", sans-serif;
  font-weight: 500;
  color: #1890ff;
  line-height: 20px;
}
.footer {
  margin-top: 20px;
  width: 100%;
  text-align: center;
}
.download {
  color: #02a7f0;
  cursor: pointer;
  margin-bottom: 20px;
  display: inline-block;
}
</style>
