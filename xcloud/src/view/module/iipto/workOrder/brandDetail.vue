<template>
  <div class="container" v-if="JSON.stringify(formInfo) != '{}'">
    <p class="title">
      商标详情
      <Button type="primary" style="float: right" @click="editor" v-if="status == 1 || status == 2 || status == 4">修改资料</Button>
      <Button type="primary" style="float: right; margin-right: 10px" @click="handlerTypeModal = true" v-show="hasAuthority('task_list_20')">修改处理人</Button>
    </p>
    <div class="tab-box">
      <span class="tab-span" @click="tabs = 1" :class="tabs == 1 ? 'tab-active' : ''">商标信息</span>
      <span class="tab-span" @click="tabs = 2" :class="tabs == 2 ? 'tab-active' : ''">官方文件</span>
      <span class="tab-span" @click="tabs = 3" :class="tabs == 3 ? 'tab-active' : ''">客户上传的材料</span>
      <div style="float: right" v-show="tabs == 2">
        <!-- <Button size="small"
              type="default"
              style="margin-right:10px;">抓取官方文件</Button> -->
        <span v-show="hasAuthority('task_list17')">
          <Button
            size="small"
            type="default"
            v-show="acceptNum != '' && acceptTime != ''"
            @click="
              uploadModal = true;
              fileModalTitle = '上传官方文件';
            "
            >上传官方文件</Button
          >
        </span>
      </div>
    </div>
    <div v-if="tabs == 1">
      <div class="details-box">
        <div class="box-title">商标信息</div>
        <div class="box-bottom">
          <Row>
            <Col :span="12">
              <p>
                <span class="left-item">商标类型：</span>
                <span class="right-item">{{ formInfo.trademarkType == 1 ? '纯文字' : formInfo.trademarkType == 2 ? '纯图形' : formInfo.trademarkType == 3 ? '图形+文字' : '' }}</span>
              </p>
            </Col>
            <Col :span="12" v-if="formInfo.trademarkType == 1 || formInfo.trademarkType == 3">
              <p>
                <span class="left-item">商标名称：</span>
                <span class="right-item" v-html="formInfo.trademarkNameEn"></span>
              </p>
            </Col>
            <Col :span="12">
              <p v-if="formInfo.trademarkType == 2 || formInfo.trademarkType == 3">
                <span class="left-item">商标LOGO：</span>
                <a :href="formInfo.trademarkLogo" target="_blank" style="color: #00a3ff; font-size: 14px"><img src="@/assets/images/infoDetail/bianji.png" alt="" style="vertical-align: middle" />查看商标LOGO</a>
              </p>
            </Col>
            <Col :span="12" v-if="formInfo.trademarkDescribe != '' && formInfo.countryCode == 'US'">
              <p>
                <span class="left-item">设计商标描述：</span>
                <span class="right-item" v-html="formInfo.trademarkDescribe"></span>
              </p>
            </Col>
            <Col :span="12" v-if="formInfo.countryCode == 'GB'">
              <p>
                <span class="left-item">是否注册过欧盟商标：</span>
                <span class="right-item">{{ formInfo.isRegisterEuTrademark == 1 ? '否' : formInfo.isRegisterEuTrademark == 2 ? '是' : '' }}</span>
              </p>
            </Col>
            <Col :span="12" v-if="formInfo.countryCode == 'GB' && formInfo.isRegisterEuTrademark == 2">
              <p>
                <span class="left-item">欧盟商标的受理号：</span>
                <span class="right-item">{{ formInfo.euAcceptNum }}</span>
              </p>
            </Col>
            <Col :span="12" v-if="formInfo.countryCode == 'GB' && formInfo.isRegisterEuTrademark == 2">
              <p>
                <span class="left-item">欧盟商标的申请日期：</span>
                <span class="right-item">{{ formInfo.euAcceptTime.slice(0, 10) }}</span>
              </p>
            </Col>
          </Row>
        </div>
      </div>
      <div class="details-box">
        <div class="box-title">商品或服务分类信息</div>
        <div class="box-bottom" v-for="(categoryItem, categoryIndex) in trademarkCategoryList" :key="categoryIndex">
          <p>
            <span class="left-item">商标分类：</span>
            <span class="right-item">{{ categoryItem.category1Num }}&nbsp;{{ categoryItem.category1Name }}</span>
          </p>
          <p>
            <span class="left-item">商标小类名称：</span>
          </p>
          <div class="info-table">
            <table style="width: 100%; text-align: center" cellpadding="0" cellspacing="0">
              <tr class="header">
                <th style="width: 68px">序号</th>
                <th style="width: 206px" v-if="serviceTemplatetype == 1">商标小类（中文）</th>
                <th style="width: 428px">商标小类（英文）</th>
                <th style="width: 166px; border-right: none" v-if="formInfo.countryCode == 'US'">指定关键词</th>
              </tr>
              <tr v-for="(item, index) in categoryItem.listTrademarkCategory2" :key="index">
                <td style="width: 68px">{{ index + 1 }}</td>
                <td style="width: 206px" v-if="serviceTemplatetype == 1">{{ item.category2Name }}</td>
                <td style="width: 428px">{{ item.category2NameEn }}</td>
                <td style="width: 166px; border-right: none" v-if="formInfo.countryCode == 'US'">
                  <span v-if="item.keyword">{{ item.keyword[0] }}</span>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <!-- 美国商标使用证据 -->
      <div class="details-box" v-if="formInfo.countryCode == 'US' && formInfo.firstUseDate != ''">
        <div class="box-title">商标使用证据</div>
        <div class="box-bottom">
          <Row>
            <Col :span="12">
              <p>
                <span class="left-item">首次使用日期：</span>
                <span class="right-item">{{ formInfo.firstUseDate.slice(0, 10) }}</span>
              </p>
            </Col>
            <Col :span="12">
              <p>
                <span class="left-item">首次在商业上的使用日期：</span>
                <span class="right-item">{{ formInfo.firstBusinessUseDate.slice(0, 10) }}</span>
              </p>
            </Col>
          </Row>
          <Row>
            <Col :span="12">
              <div>
                <span class="left-item">产品图：</span>
                <div class="evidence-box">
                  <p class="evidence" v-for="(item, index) in usrProductImgList" :key="index">
                    <a :href="item.fileUrl" target="_blank">
                      <!-- <img src="@/assets/images/infoDetail/bainji-gary.svg"
                         alt=""> -->
                      {{ item.fileName }}
                    </a>
                  </p>
                </div>
              </div>
            </Col>
            <Col :span="12">
              <div>
                <span class="left-item">订单详情截图：</span>
                <div class="evidence-box">
                  <p class="evidence" v-for="(item, index) in useEvidenceList" :key="index">
                    <a :href="item.fileUrl" target="_blank">
                      <!-- <img src="@/assets/images/infoDetail/bainji-gary.svg"
                         alt=""> -->
                      {{ item.fileName }}
                    </a>
                  </p>
                </div>
              </div>
            </Col>
          </Row>
          <p>
            <span class="left-item">销售链接：</span>
          </p>
          <div class="info-table">
            <table style="width: 100%; text-align: center" cellpadding="0" cellspacing="0">
              <tr class="header">
                <th style="width: 68px">序号</th>
                <th style="width: 402px">销售链接</th>
                <th style="width: 400px; border-right: none">指定商标小类</th>
              </tr>
              <tr v-for="(item, index) in marketHrefList" :key="index">
                <td style="width: 68px">{{ index + 1 }}</td>
                <td style="width: 402px">
                  <p>{{ item.marketHref }}</p>
                </td>
                <td style="width: 400px; border-right: none">
                  <p>
                    {{ item.category2NameEn }}
                  </p>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="details-box" v-if="formInfo.otherSmallLanguagesFiles != ''">
        <div class="box-title">使用证据或其他文件</div>
        <div class="box-bottom">
          <Row>
            <Col :span="12">
              <p>
                <span class="left-item"></span>
                <span class="right-item item-box">
                  <p v-for="(item, index) in otherFileList" :key="index">
                    <a :href="item" target="_blank" style="color: #666"><img src="@/assets/images/infoDetail/bainji-gary.svg" alt="" />其他文件{{ index + 1 }}</a>
                  </p>
                </span>
              </p>
            </Col>
          </Row>
        </div>
      </div>
      <div class="details-box">
        <div class="box-title">申请人信息</div>
        <div class="box-bottom">
          <Row>
            <Col :span="12">
              <p>
                <span class="left-item">申请人类型：</span>
                <span class="right-item">{{ formInfo.applyType == 0 ? '个人' : formInfo.applyType == 1 ? '企业' : '' }}</span>
              </p>
            </Col>
            <Col :span="12">
              <p v-if="formInfo.applyType == 0">
                <span class="left-item">姓名：</span>
                <span class="right-item" v-if="formInfo.countryCode != 'JP'">{{ formInfo.applyLastNameEn }},&nbsp;{{ formInfo.applyNameEn }}</span>
                <span class="right-item" v-else>{{ formInfo.applyLastNameEn }}{{ formInfo.applyNameEn }}</span>
              </p>
            </Col>
            <Col :span="12">
              <p v-if="formInfo.applyType == 0">
                <span class="left-item">身份证人像面：</span>
                <span class="right-item item-box">
                  <a :href="formInfo.identityCardFront" target="_blank" style="color: #666"><img src="@/assets/images/infoDetail/bainji-gary.svg" alt="" />身份证人像面</a>
                </span>
              </p>
            </Col>
            <Col :span="12">
              <p v-if="formInfo.applyType == 0">
                <span class="left-item">身份证国徽面：</span>
                <span class="right-item item-box">
                  <a :href="formInfo.identityCardReverse" target="_blank" style="color: #666"><img src="@/assets/images/infoDetail/bainji-gary.svg" alt="" />身份证国徽面</a>
                </span>
              </p>
            </Col>
            <Col :span="12">
              <p v-if="formInfo.applyType == 1">
                <span class="left-item">公司名称：</span>
                <span class="right-item">{{ formInfo.applyCompanyEn }}</span>
              </p>
            </Col>
            <Col :span="12">
              <p v-if="formInfo.applyType == 1">
                <span class="left-item">公司营业执照：</span>
                <span class="right-item item-box">
                  <a :href="formInfo.businessLicense" target="_blank" style="color: #666"><img src="@/assets/images/infoDetail/bainji-gary.svg" alt="" />公司营业执照</a>
                </span>
              </p>
            </Col>
            <Col :span="12">
              <p>
                <span class="left-item">国家：</span>
                <span class="right-item" v-if="formInfo.countryCode != 'JP'">{{ formInfo.applyCountryEn }}</span>
                <span class="right-item" v-else>{{ formInfo.applyCountryZh }}</span>
              </p>
            </Col>
            <Col :span="12" v-if="formInfo.countryCode != 'JP'">
              <p>
                <span class="left-item">城市：</span>
                <span class="right-item">{{ formInfo.applyCityEn }},&nbsp;{{ formInfo.applyProvinceEn }}</span>
              </p>
            </Col>
            <Col :span="12" v-if="formInfo.countryCode == 'US' || formInfo.countryCode == 'GB'">
              <p>
                <span class="left-item">街道地址：</span>
                <span class="right-item">{{ formInfo.applyStreetEn }}</span>
              </p>
            </Col>
            <Col :span="12">
              <p>
                <span class="left-item">详细地址：</span>
                <span class="right-item">{{ formInfo.applyAddresEn }}</span>
              </p>
            </Col>
          </Row>
          <Row v-if="formInfo.countryCode == 'US'">
            <Col :span="12">
              <p>
                <span class="left-item">邮政编码：</span>
                <span class="right-item">{{ formInfo.applyPostNum }}</span>
              </p>
            </Col>
            <Col :span="12">
              <p>
                <span class="left-item">申请人邮箱：</span>
                <span class="right-item">{{ formInfo.applyEmail }}</span>
              </p>
            </Col>
          </Row>
        </div>
      </div>
      <div class="details-box">
        <div class="box-title">申请人签名</div>
        <div class="box-bottom">
          <p>
            <img v-if="formInfo.signature !== '' && formInfo.signature !== undefined" :src="formInfo.signature" alt="" style="width: 300px; height: 200px" />
          </p>
        </div>
      </div>
      <div class="button-box">
        <Button @click="goBack" class="back-button">返回</Button>
      </div>
    </div>
    <div v-if="tabs == 2">
      <div class="details-box">
        <div class="box-title">
          商标文件
          <Poptip trigger="hover" style="float: right" title="" content="官方日期：指商标局官网公布该文件的日期。法限日期：指必须在该日期内答复商标局；因律师处理案件需要预留15天，故客户必须在距离法限日期还有15天含以上的时间段内提供答复的材料。">
            <Icon type="ios-help-circle" style="font-size: 24px" />
          </Poptip>
        </div>
        <div class="info-table" style="margin: 24px" v-if="fileList.length > 0">
          <table style="width: 100%; text-align: center" cellpadding="0" cellspacing="0">
            <tr class="header">
              <th style="width: 50px">序号</th>
              <th style="width: 210px">文件</th>
              <th style="width: 200px">备注</th>
              <th style="width: 170px">官方日期</th>
              <th style="width: 170px">法限日期</th>
              <th style="width: 140px; border-right: none">操作</th>
            </tr>
            <tr v-for="(item, index) in fileList" :key="index">
              <td style="width: 50px">{{ index + 1 }}</td>
              <td style="width: 210px">
                <a :href="item.fileUrl" target="_blank" style="color: #00a3ff">{{ initFileNameFunc(item.fileUrl) }}（可点击查看）</a>
              </td>
              <td style="width: 200px">{{ item.fileRemark || '无' }}</td>
              <td style="width: 170px">{{ item.officeDate.slice(0, 10) || '无' }}</td>
              <td style="width: 170px">{{ item.lastDealDate.slice(0, 10) || '无' }}</td>
              <td style="width: 140px; border-right: none" class="operation-td">
                <div @click="clickTranslateFunc(item)" v-if="item.status == 21 || item.status == 22 || item.status == 23">
                  <span v-show="hasAuthority('task_list12')">翻译OA</span>
                </div>
                <div
                  @click="
                    lookTranslateModal = true;
                    translateInfo = item;
                  "
                  v-if="item.status != 21 && item.status != 20 && item.status != 40 && item.status != 41"
                >
                  <span v-show="hasAuthority('task_list13')">查看</span>
                </div>
                <div
                  v-if="item.status == 40 || item.status == 41"
                  @click="
                    stopLetterModal = true;
                    oaFileId = item.id;
                    stopLetterInfo.interpretFileContent = item.interpretFileContent;
                    stopLetterInfo.operateMethod = item.operateMethod;
                  "
                >
                  <span v-show="hasAuthority('task_list19')">翻译暂停信</span>
                </div>
                <div v-if="item.status == 41" @click="handleCancleStopLetter(item)">
                  <span v-show="hasAuthority('task_list20')">取消暂停</span>
                </div>
                <div @click="changeFile(item)" v-show="hasAuthority('task_list17')">修改</div>
                <div @click="deleteFileFunc(item)" v-show="hasAuthority('task_list18')">删除</div>
                <p class="table-tip" v-if="item.overdue" style="word-break: keep-all">超过法限日期未处理</p>
              </td>
            </tr>
          </table>
        </div>
        <div class="table-bottom-tips" v-if="fileList.length > 0">
          <span>说明：</span>商标注册过程中，脚本会一直抓取各阶段公布的官方文件；默认是脚本自动执行，爬取官方文件和官方日期后，回传到系统指定商标的官方文件。 因某些客观因素，脚本未抓取到文件，可在系统点击【抓取官方文件】按钮，触发脚本代码，实现官方文件抓取，并回传到系统指定商标的官方文件。
          如脚本抓取异常，可点击【上传官方文件】上传指定文件。
        </div>
        <div class="null-file" v-else>
          <img src="@/assets/images/infoDetail/no-file.svg" alt="" />
          <p class="first-p">暂无文件</p>
          <p>请先上传后再查看</p>
        </div>
      </div>
    </div>
    <div v-if="tabs == 3">
      <div class="info-table" style="margin-top: 24px" v-if="answerFileList.length > 0" :key="answerFileListKey">
        <table style="width: 100%; text-align: center" cellpadding="0" cellspacing="0">
          <tr class="header">
            <th style="width: 68px">序号</th>
            <th style="width: 310px">文件</th>
            <th style="width: 200px">备注</th>
            <th style="width: 170px">上传时间</th>
            <th style="width: 140px; border-right: none">操作</th>
          </tr>
          <tr v-for="(item, index) in answerFileList" :key="index">
            <td style="width: 68px">{{ index + 1 }}</td>
            <td style="width: 310px">
              <a :href="item.answerFile" target="_blank" style="color: #00a3ff">{{ initFileNameFunc(item.answerFile) }}（可点击查看）</a>
            </td>
            <td style="width: 200px">{{ item.remark || '答复审核意见 ' }}</td>
            <td style="width: 170px">{{ item.answerDate || '无' }}</td>
            <td style="width: 140px; border-right: none" class="operation-td">
              <div
                @click="
                  answerInfo = item;
                  auditModal = true;
                "
              >
                {{ item.status == 24 ? '平台审核' : item.status == 25 ? '律师审核' : '' }}
              </div>
            </td>
          </tr>
        </table>
      </div>
      <div class="null-file" v-else>
        <img src="@/assets/images/infoDetail/no-file.svg" alt="" />
        <p class="first-p">暂无文件</p>
        <p>暂无文件</p>
      </div>
    </div>
    <!-- 翻译OA -->
    <Modal v-model="OAtranslateModal" title="翻译OA">
      <Form :model="formTrans" label-position="left" :label-width="110">
        <FormItem label="" :label-width="0">
          <p class="ivu-form-item-label">翻译OA：</p>
          <Input v-model="formTrans.interpretFileContent" :maxlength="10000" :rows="6" show-word-limit type="textarea" placeholder="请输入OA翻译" />
        </FormItem>
        <FormItem label="是否需要付费：" style="margin-bottom: 0px">
          <RadioGroup v-model="formTrans.isNeedPay">
            <Radio :label="2" :disabled="formTrans.orderNo != ''">需要付费</Radio>
            <Radio :label="1" :disabled="formTrans.orderNo != ''">不需要</Radio>
          </RadioGroup>
        </FormItem>
        <p style="margin-bottom: 8px">付费类型，金额一旦确认后，将不能再修改</p>
        <FormItem prop="productMoney" :label-width="0" :rules="{ required: true, message: '请输入金额', trigger: 'blur', type: 'number' }" v-if="formTrans.isNeedPay == 2">
          <p class="label-title">付费金额：</p>
          <p>客户在法限日期内，答复OA，需购买指定付费服务</p>
          <Input v-model="formTrans.productMoney" type="text" number :disabled="formTrans.orderNo != ''" placeholder="金额最多两位小数，且＞0" />
        </FormItem>
        <FormItem label="" :label-width="0">
          <p class="label-title">帮助文档（选填）：</p>
          <p>帮助文档将展示给客户，用于指引他答复OA需要提供哪些材料</p>
          <Upload
            :format="['jpg', 'pdf', 'doc', 'docx', 'xls', 'xlsx']"
            :action="workOrderFile"
            :default-file-list="helpFileList"
            :before-upload="beforeUploadAccept"
            :on-format-error="formatErrorHandler"
            :max-size="2048"
            ref="upload"
            :on-success="
              (res, file, fileList) => {
                successHandlerAccept(res, file, fileList);
              }
            "
            :on-remove="
              (file, fileList) => {
                removeHandlerAccept(file, fileList);
              }
            "
            style="accept-upload"
          >
            <Button icon="ios-cloud-upload-outline">上传文件</Button>
          </Upload>
          <p>支持扩展名： .doc .docx .pdf .jpg .xls .xlsx ，每个文件大小2M内，最多5个文件</p>
        </FormItem>
      </Form>
      <p slot="footer">
        <Button type="primary" ghost style="margin-right: 20px" @click="OAtranslateModal = false">取消</Button>
        <Button type="primary" @click="saveTranslate">确认</Button>
      </p>
    </Modal>
    <!-- 查看OA翻译 -->
    <Modal v-model="lookTranslateModal" title="查看OA翻译">
      <Form :model="formTrans" label-position="left" :label-width="110" class="formTranslate">
        <FormItem label="" :label-width="0">
          <p class="ivu-form-item-label">翻译OA：</p>
          <p>{{ translateInfo.interpretFileContent }}</p>
        </FormItem>
        <FormItem label="是否需要付费：">
          {{ translateInfo.isNeedPay == 2 ? '需要付费' : translateInfo.isNeedPay == 1 ? '不需要付费' : '' }}
        </FormItem>
        <FormItem label="" :label-width="0" v-if="translateInfo.isNeedPay == 2">
          <p class="label-title">付费金额：{{ translateInfo.productMoney }}</p>
        </FormItem>
      </Form>
      <p slot="footer"></p>
    </Modal>
    <!-- 上传文件 -->
    <Modal
      v-model="uploadModal"
      @on-cancel="
        nowFileInfo = {};
        formFile.officialDate = '';
      "
      :title="fileModalTitle"
    >
      <Form :model="formFile" class="formTrans" ref="formFile" :rules="ruleFormFile" label-position="left" :label-width="100">
        <FormItem label="文件类型：" prop="fileType" v-if="JSON.stringify(nowFileInfo) == '{}'">
          <Select v-model="formFile.fileType" placeholder="请选择文件类型" style="width: 300px">
            <Option :value="1">受理回执</Option>
            <Option :value="2">受理书</Option>
            <Option :value="3">审查意见（OA）</Option>
            <Option :value="4">审查意见的答复函（OA）</Option>
            <Option :value="7">暂停信</Option>
          </Select>
        </FormItem>
        <FormItem label="文件类型：" v-else>
          <span>{{ nowFileInfo.fileType == 1 ? '受理回执' : nowFileInfo.fileType == 2 ? '受理书' : nowFileInfo.fileType == 3 ? '审查意见(OA)' : nowFileInfo.fileType == 4 ? '审查意见的答复函（OA）' : nowFileInfo.fileType == 7 ? '暂停信' : '' }}</span>
        </FormItem>
        <FormItem label="上传文件：" prop="fileUrl">
          <Upload
            :format="['jpg', 'pdf']"
            :max-size="5 * 1024"
            :action="workOrderFile"
            :default-file-list="defaultFileList"
            :before-upload="beforeUploadAccept1"
            :on-format-error="formatErrorHandler1"
            :on-success="
              (res, file, fileList) => {
                successHandlerAccept1(res, file, fileList);
              }
            "
            :on-remove="
              (file, fileList) => {
                removeHandlerAccept1(file, fileList);
              }
            "
            style="accept-upload"
          >
            <Button icon="ios-cloud-upload-outline">上传文件</Button>
          </Upload>
          <p class="">文件限制：文件大小不超过5M</p>
        </FormItem>
        <FormItem label="官方日期：" prop="officialDate">
          <DatePicker type="date" v-model="formFile.officialDate" placeholder="2020/01/01" style="width: 300px"></DatePicker>
        </FormItem>
      </Form>
      <p slot="footer">
        <Button
          type="primary"
          ghost
          style="margin-right: 20px"
          @click="
            uploadModal = false;
            formFile.officialDate = '';
          "
          >取消</Button
        >
        <Button type="primary" @click="sureUload">确认</Button>
      </p>
    </Modal>
    <!-- 翻译暂停信 -->
    <Modal v-model="stopLetterModal" title="翻译暂停信">
      <p class="ivu-form-item-label">翻译暂停信：</p>
      <Input v-model="stopLetterInfo.interpretFileContent" :maxlength="10000" :rows="6" show-word-limit type="textarea" placeholder="请输入暂停信翻译" />
      <p class="ivu-form-item-label" style="margin-top: 16px">操作方案：</p>
      <Input v-model="stopLetterInfo.operateMethod" :maxlength="10000" :rows="6" show-word-limit type="textarea" placeholder="请输入操作方案" />
      <p slot="footer">
        <Button type="primary" ghost style="margin-right: 20px" @click="stopLetterModal = false">取消</Button>
        <Button type="primary" @click="saveTranslateStopLetter">确认</Button>
      </p>
    </Modal>
    <!-- 审核 -->
    <Modal v-model="auditModal" :title="answerInfo.status == 24 ? '平台审核' : answerInfo.status == 25 ? '律师审核' : ''">
      <div v-if="answerInfo.status == 24">
        <p style="font-weight: 700">注意：审核以客户上传的最新材料为准</p>
        <p>审核通过后，将由律师审核；资料不对，被驳回的，客户需按照要求修改资料</p>
      </div>
      <p v-if="answerInfo.status == 25">律师审核通过，即已撰写官文回复商标局；资料不对，则驳回，填写驳回原因，客户需按照要求修改资料</p>
      <RadioGroup v-model="auditType" style="margin: 20px 0">
        <Radio label="0">审核通过</Radio>
        <Radio label="1">资料不对，驳回</Radio>
      </RadioGroup>
      <div v-if="auditType == 1">
        <p>驳回原因：</p>
        <Input v-model="rejectAnswerReason" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" placeholder="请输入驳回原因"></Input>
      </div>
      <p slot="footer">
        <Button type="primary" ghost style="margin-right: 20px" @click="auditModal = false">取消</Button>
        <Button type="primary" @click="auditFunc">确认</Button>
      </p>
    </Modal>
    <!-- 修改处理人 -->
    <Modal v-model="handlerTypeModal" title="修改处理人">
      <Form :model="formCodeItem" :label-width="100" ref="formCodeItem">
        <FormItem label="处理人类型：" prop="assessmentType">
          <Select v-model="formCodeItem.assessmentType" @on-change="changeAssessmentType" label-in-value placeholder="请选择处理人类型">
            <Option v-for="(item, index) in handlerList" :value="item.value" :key="index">{{ item.roleType }}</Option>
          </Select>
        </FormItem>
        <FormItem label="指定处理人：">
          <span style="cursor: pointer" @click="checkHandlerFunc"
            >{{ staffInfo.realName || '选择处理人' }}
            <Icon type="ios-create-outline" size="18" />
          </span>
        </FormItem>
      </Form>
      <p slot="footer">
        <Button type="primary" ghost style="margin-right: 20px" @click="handlerTypeModal = false">取消</Button>
        <Button type="primary" @click="sureFilingCode('formCodeItem')">确认</Button>
      </p>
    </Modal>
    <Modal v-model="handlerModal" @on-cancel="cancelUserFunc" :title="formCodeItem.assessmentType == 2 ? '指派律师' : '指派处理人'">
      <Select v-if="formCodeItem.assessmentType == 2" v-model="staffInfo.userId" label-in-value @on-change="changeLaywyer">
        <Option v-for="(item, index) in lawyerList" :value="item.id" :key="index">{{ item.attorneyName }}</Option>
      </Select>
      <div v-else>
        <Form :model="staffInfo" class="form-box" :label-width="80">
          <FormItem label="部门名称:">
            <Select v-model="staffInfo.departmentId" label-in-value @on-change="changeDepartment" placeholder="部门名称">
              <Option :value="item.departmentId" v-for="(item, index) in departmentList" :key="index">{{ item.departmentName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="员工姓名:">
            <Select v-model="staffInfo.userId" label-in-value @on-change="changeStaffFunc" placeholder="员工姓名">
              <Option :value="item.userId" v-for="(item, index) in staffList" :key="index">{{ item.nickName }}</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
      <p slot="footer">
        <Button type="primary" ghost style="margin-right: 20px" @click="cancelUserFunc()">取消</Button>
        <Button type="primary" @click="sureUserFunc()">确定</Button>
      </p>
    </Modal>
  </div>
</template>
<script>
import { trademarkDetailApi, fileOaListApi, addFileOaApi, updateFileOaApi, delFileOaApi, translateOaApi, translatStopLettereApi, cancelStopLettereApi, rejectAnswerApi, passAnswerApi } from '@/api/iipto/breadInfoDetail';
import { formatDate } from '@/libs/tools.js';
import { iiptoFileType } from '@/libs/iipto.js';
import { UpdateApproveUserApi } from '@/api/iipto/workOrder';
import { getAllUserAndDepartmentApi } from '@/api/iipto/deliveryData';
import { lawyerListApi } from '@/api/iipto/lawyer.js';
export default {
  props: ['orderId'],
  data() {
    return {
      formInfo: {},
      useEvidenceList: [],
      usrProductImgList: [],
      marketHrefList: [],
      status: '',
      marketColumns: [
        {
          type: 'index',
          width: 60,
          align: 'center',
        },
        {
          align: 'center',
          title: '销售链接',
          key: 'marketHref',
        },
        {
          align: 'center',
          title: '指定商标小类',
          key: 'category2NameEn',
        },
      ],
      tabs: 1,
      fileList: [],
      trademarkCategoryList: [],
      OAtranslateModal: false,
      lookTranslateModal: false,
      uploadModal: false,
      stopLetterModal: false,
      formTrans: {},
      helpFileList: [],
      answerFileListKey: 0,
      formFile: {
        fileType: '',
        fileUrl: '',
        officialDate: '',
      },
      ruleFormFile: {
        fileType: [{ required: true, trigger: 'change', message: '请选择文件类型', type: 'number' }],
        fileUrl: [{ required: true, trigger: 'change', message: '请选择上传文件' }],
        officialDate: [{ required: true, trigger: 'change', message: '请选择官方日期', type: 'date' }],
      },
      fileModalTitle: '上传官方文件',
      acceptNum: '',
      acceptTime: '',
      nowFileInfo: {},
      oaFileId: '',
      defaultFileList: [],
      serverNo: '',
      translateInfo: {},
      stopLetterInfo: {
        interpretFileContent: '',
        operateMethod: '',
      },
      answerFileList: [],
      answerInfo: {},
      auditModal: false,
      auditType: '0',
      rejectAnswerReason: '',
      handlerTypeModal: false,
      formCodeItem: {
        assessmentType: '',
      },
      handlerList: [
        {
          roleType: '初审处理人',
          value: '1',
        },
        {
          roleType: '律师',
          value: '2',
        },
        {
          roleType: '注册处理人',
          value: '3',
        },
        {
          roleType: '审查意见处理人',
          value: '4',
        },
      ],
      handlerModal: false,
      staffInfo: {
        realName: '',
      },
      departmentList: [],
      staffList: [],
      lawyerList: [],
      otherFileList: [],
      serviceTemplatetype: '',
    };
  },
  watch: {
    'formTrans.productMoney': function (newVal, oldVal) {
      //限制数字类型
      if (isNaN(newVal)) {
        this.$Message.error('请输入数字');
        return;
      }
    },
  },
  methods: {
    //获取工单资料
    getDetailFun() {
      let data = {
        servicesId: this.orderId,
      };
      trademarkDetailApi(data).then((res) => {
        if (res.code == 0) {
          if (JSON.stringify(res.data.trademarkWorkOrder) != '{}') {
            this.formInfo = { ...res.data.trademarkWorkOrder };
            if (res.data.trademarkWorkOrder.useEvidence != '') {
              this.useEvidenceList = JSON.parse(res.data.trademarkWorkOrder.useEvidence);
            }
            if (res.data.trademarkWorkOrder.useProductImg != '') {
              this.usrProductImgList = JSON.parse(res.data.trademarkWorkOrder.useProductImg);
            }
            if (res.data.trademarkWorkOrder.marketHref != '') {
              this.marketHrefList = JSON.parse(res.data.trademarkWorkOrder.marketHref);
            }
            this.formInfo.trademarkCategory1Str = '';
            this.formInfo.trademarkCategory2Str = [];
            if (this.formInfo.trademarkCategory !== '') {
              this.trademarkCategoryList = JSON.parse(this.formInfo.trademarkCategory);
            }
          }
          if (JSON.stringify(res.data.services) != '{}') {
            this.acceptNum = res.data.services.acceptNum;
            this.acceptTime = res.data.services.acceptTime;
            this.serverNo = res.data.services.serverNo;
          }
          if (this.formInfo.otherSmallLanguagesFiles != '') {
            if (this.formInfo.otherSmallLanguagesFiles.indexOf(',')) {
              this.otherFileList = this.formInfo.otherSmallLanguagesFiles.split(',');
            } else {
              this.otherFileList.push(this.formInfo.otherSmallLanguagesFiles);
            }
          }
          this.status = res.data.services.progressBar;
          this.serviceTemplatetype = res.data.serviceTemplatetype;
        }
      });
    },
    editor() {
      this.$emit('changeInfo', true);
    },
    goBack() {
      this.$emit('backPage', true);
    },
    clickTranslateFunc(item) {
      this.OAtranslateModal = true;
      this.oaFileId = item.id;
      this.formTrans = {
        interpretFileContent: item.interpretFileContent,
        isNeedPay: item.isNeedPay,
        productMoney: item.productMoney,
        orderNo: item.orderNo,
      };
      this.helpFileList = [];
      if (item.hlepDocument != '[]' && item.hlepDocument != '') {
        let helpDocument = JSON.parse(item.hlepDocument);

        helpDocument.map((i) => {
          let obj = {
            name: i.oldFileName,
            url: i.fileUrl,
          };
          this.helpFileList.push(obj);
        });
      }
    },
    saveTranslate() {
      if (this.formTrans.interpretFileContent == '' || this.formTrans.interpretFileContent == undefined) {
        this.$Message.error('请填写翻译资料');
        return;
      }
      if (this.formTrans.isNeedPay == '' || this.formTrans.isNeedPay == undefined) {
        this.$Message.error('请选择是否需要付费');
        return;
      }
      if (isNaN(this.formTrans.productMoney)) {
        this.$Message.error('请输入正确付费金额');
        return;
      }
      this.$Modal.confirm({
        title: '',
        content: '请确认录入的信息是否无误？',
        onOk: () => {
          let data = { ...this.formTrans };
          data.oaFileId = this.oaFileId;
          let helpData = [];
          this.helpFileList.map((item) => {
            let obj = {
              oldFileName: item.name,
              fileUrl: item.url,
            };
            helpData.push(obj);
          });
          data.hlepDocument = JSON.stringify(helpData);
          translateOaApi(data).then((res) => {
            if (res.code == 0) {
              this.$Message.success('操作成功');
              this.getFileFunc();
              this.OAtranslateModal = false;
            }
          });
        },
        onCancel: () => {},
      });
    },
    beforeUploadAccept(file) {
      const check = this.helpFileList.length < 5;
      const self = this;
      if (!check) {
        self.$Notice.warning({
          title: '最多只可上传5个文件',
        });
        return check;
      } else if (file.size > 2097152) {
        self.$Notice.warning({
          title: '文件大小超过2M',
        });
        return false;
      }
    },
    formatErrorHandler() {
      this.$Notice.warning({
        title: '文件格式错误',
        desc: '文件格式不正确, 请上传指定格式的文件',
      });
    },
    successHandlerAccept(res, file, fileList) {
      let self = this;
      if (res.code !== 0) {
        self.$Notice.warning({
          title: '警告',
          desc: '请尝试再次上传',
        });
        return false;
      }
      let obj = {
        name: file.name,
        url: file.response.data.fileUrl,
      };
      this.helpFileList.push(obj);
    },
    removeHandlerAccept(file, fileList) {
      this.helpFileList = [...fileList];
    },
    //获取官方文件
    getFileFunc() {
      fileOaListApi({ servicesId: this.orderId }).then((res) => {
        if (res.code == 0) {
          this.fileList = [];
          this.answerFileList = [];
          res.data.map((item) => {
            let obj = { ...item };
            obj.overdue = false;
            if (new Date(item.lastDealDate) < new Date()) {
              obj.overdue = true;
            }
            this.fileList.push(obj);
            if (item.answerFile != '') {
              this.answerFileList.push(item);
            }
          });
        }
      });
    },
    beforeUploadAccept1(file) {
      const check = this.formFile.fileUrl;
      let self = this;
      if (check != '') {
        self.$Notice.warning({
          title: '最多只可上传1个文件',
        });
        return false;
      } else if (file.size > 5242880) {
        self.$Notice.warning({
          title: '文件大小超过5M',
        });
        return false;
      }
    },
    formatErrorHandler1() {
      this.$Notice.warning({
        title: '文件格式错误',
        desc: '文件格式不正确, 请上传jpg,pdf格式的文件',
      });
    },
    successHandlerAccept1(res, file, fileList) {
      let self = this;
      if (res.code !== 0) {
        self.$Notice.warning({
          title: '警告',
          desc: '请尝试再次上传',
        });
        return false;
      }
      this.formFile.fileUrl = res.data.fileUrl;
    },
    removeHandlerAccept1() {
      this.formFile.fileUrl = '';
    },
    sureUload() {
      this.$refs['formFile'].validate((valid) => {
        if (valid) {
          let data = { ...this.formFile };
          data.officialDate = formatDate(this.formFile.officialDate, 'date');
          data.serviceId = this.orderId;
          if (JSON.stringify(this.nowFileInfo) != '{}') {
            data.oaFileId = this.oaFileId;
          }
          let comfirmDate = data.officialDate.slice(0, 10);
          this.$Modal.confirm({
            title: '请确认录入的文件是否正确？',
            content: `<p>服务编号：${this.serverNo}</p>
            <p>服务：${this.formInfo.countryNameZh}商标注册</p>
            <p>商标名称：${this.formInfo.trademarkNameEn}</p>
            <p style="margin-top:14px;">文件类型：${iiptoFileType(this.formFile.fileType)}</p>
            <p>文件：${this.initFileNameFunc(this.formFile.fileUrl)}</p>
            <p>官方日期：${comfirmDate}</p>`,
            okText: '继续上传',
            cancleText: '暂不上传',
            onOk: () => {
              if (this.fileModalTitle == '上传官方文件') {
                addFileOaApi(data).then((res) => {
                  if (res.code == 0) {
                    this.$Message.info('操作成功');
                    this.uploadModal = false;
                    this.nowFileInfo = {};
                    this.formFile = {
                      fileType: '',
                      fileUrl: '',
                      officialDate: '',
                    };
                    this.defaultFileList = [];
                    this.getFileFunc();
                  }
                });
              } else {
                updateFileOaApi(data).then((res) => {
                  if (res.code == 0) {
                    this.$Message.info('操作成功');
                    this.uploadModal = false;
                    this.nowFileInfo = {};
                    this.formFile = {
                      fileType: '',
                      fileUrl: '',
                      officialDate: '',
                    };
                    this.defaultFileList = [];
                    this.getFileFunc();
                  }
                });
              }
            },
            onCancel: () => {},
          });
        } else {
          this.$Message.error('请先填写完整资料');
        }
      });
    },
    changeFile(item) {
      this.uploadModal = true;
      this.fileModalTitle = '修改官方文件';
      this.nowFileInfo = item;
      this.oaFileId = item.id;
      this.formFile = {
        fileType: item.fileType,
        fileUrl: item.fileUrl,
        officialDate: item.officeDate,
      };
      this.defaultFileList = [];
      let file = {
        name: this.initFileNameFunc(item.fileUrl),
        url: item.fileUrl,
      };
      this.defaultFileList.push(file);
    },
    initFileNameFunc(fileName) {
      return fileName.slice(fileName.length - 36, fileName.length);
    },
    deleteFileFunc(item) {
      this.$Modal.confirm({
        title: '删除文件',
        content: `<p>确认删除${iiptoFileType(item.fileType)}吗？</p>`,
        onOk: () => {
          delFileOaApi({ oaFileId: item.id }).then((res) => {
            if (res.code == 0) {
              this.$Message.info('操作成功');
              this.getFileFunc();
            }
          });
        },
        onCancel: () => {},
      });
    },
    saveTranslateStopLetter() {
      this.$Modal.confirm({
        title: '',
        content: '请确认录入的信息是否无误？',
        onOk: () => {
          let data = { ...this.stopLetterInfo };
          data.oaFileId = this.oaFileId;
          translatStopLettereApi(data).then((res) => {
            if (res.code == 0) {
              this.$Message.success('操作成功');
              this.getFileFunc();
              this.stopLetterModal = false;
            }
          });
        },
        onCancel: () => {},
      });
    },
    handleCancleStopLetter(item) {
      this.$Modal.confirm({
        title: '',
        content: '取消暂停，商标将恢复正常审查状态。你确定吗？',
        okText: '取消暂停',
        cancelText: '保留暂停',
        onOk: () => {
          cancelStopLettereApi({ oaFileId: item.id }).then((res) => {
            if (res.code == 0) {
              this.$Message.success('操作成功');
              this.getFileFunc();
            }
          });
        },
        onCancel: () => {},
      });
    },
    auditFunc() {
      if (this.auditType == 0) {
        let data = {
          oaFileId: this.answerInfo.id,
          operationType: this.answerInfo.status == 24 ? '2' : this.answerInfo.status == 25 ? '4' : '',
        };
        passAnswerApi(data).then((res) => {
          if (res.code == 0) {
            this.auditModal = false;
            this.$Message.success('操作成功');
            this.getFileFunc();
          }
        });
      } else if (this.auditType == 1) {
        if (this.rejectAnswerReason == '') {
          this.$Message.info('请填写驳回原因');
          return;
        }
        let data = {
          oaFileId: this.answerInfo.id,
          operationType: this.answerInfo.status == 24 ? '1' : this.answerInfo.status == 25 ? '3' : '',
          reason: this.rejectAnswerReason,
        };
        rejectAnswerApi(data).then((res) => {
          if (res.code == 0) {
            this.auditModal = false;
            this.$Message.success('操作成功');
            this.getFileFunc();
            this.answerFileListKey = new Date().getTime();
          }
        });
      }
    },
    //修改处理人
    checkHandlerFunc() {
      if (this.formCodeItem.assessmentType == '') {
        this.$Message.info('请先选择处理人类型');
        return;
      }
      if (this.formCodeItem.assessmentType == 2) {
        this.getLawyerListFunc();
      } else {
        this.getUserAPi();
      }
      this.handlerModal = true;
    },
    getUserAPi() {
      getAllUserAndDepartmentApi().then((res) => {
        if (res.code == 0) {
          if (res.data) {
            this.departmentList = res.data;
          }
        }
      });
    },
    getLawyerListFunc() {
      let data = {
        limit: 20,
        page: 1,
        isOpen: '1',
        countryCode: this.formInfo.countryCode,
      };
      lawyerListApi(data).then((res) => {
        if (res.code === 0) {
          this.lawyerList = res.data.records;
        }
      });
    },
    changeAssessmentType(val) {
      if (val != undefined) {
        this.formCodeItem.assessmentName = val.label;
      }
      this.staffInfo.realName = '';
    },
    changeLaywyer(val) {
      if (val != undefined) {
        this.staffInfo.realName = val.label;
        this.staffInfo.userId = val.value;
      }
    },
    changeDepartment(val) {
      this.departmentList.map((item) => {
        if (val.value == item.departmentId) {
          this.staffList = item.children;
        }
      });
      this.staffInfo.department = val.label;
    },
    changeStaffFunc(val) {
      this.staffInfo.realName = val.label;
    },
    cancelUserFunc() {
      this.handlerModal = false;
      this.formCodeItem.assessmentType = '';
      this.staffInfo = {
        departmentId: '',
        realName: '',
        userId: '',
      };
    },
    sureUserFunc() {
      this.handlerModal = false;
    },
    sureFilingCode() {
      if (this.formCodeItem.assessmentType == '') {
        this.$Message.info('请先选择处理人类型');
        return;
      }
      if (this.staffInfo.realName == '') {
        this.$Message.info('请先指派处理人');
        return;
      }
      let data = { ...this.staffInfo };
      data.serviceIds = this.orderId;
      data.assessmentType = this.formCodeItem.assessmentType;
      this.$Modal.confirm({
        title: '',
        content: `所选工单的${this.formCodeItem.assessmentName}将改为${this.staffInfo.realName}。你确定要修改吗？`,
        okText: '确认修改',
        cancelText: '取消',
        onOk: () => {
          UpdateApproveUserApi(data).then((res) => {
            if (res.code == 0) {
              this.staffInfo.realName = '';
              this.formCodeItem.assessmentType = '';
              this.handlerTypeModal = false;
              this.$Message.success('操作成功');
            }
          });
        },
      });
    },
  },
  mounted() {
    this.getDetailFun();
    this.getFileFunc();
  },
};
</script>
<style lang="less" scoped>
.container {
  background-color: #fff;
  padding: 24px;
  .title {
    font-size: 20px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    height: 44px;
    img {
      vertical-align: middle;
    }
  }
  p {
    line-height: 30px;
  }
  .details-box {
    margin-top: 24px;
    border: 1px solid #e9e9e9;
    .box-title {
      padding: 11px 24px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      background-color: #fafafa;
      border-bottom: 1px solid #e9e9e9;
    }
    .box-bottom {
      padding: 16px 24px;
    }
    .left-item {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: rgba(0, 0, 0, 0.85);
      line-height: 22px;
    }
    .right-item {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 500;
      color: #666666;
      line-height: 22px;
      max-width: 75%;
      word-break: break-all;
    }
    .ellipsis {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      display: inline-block;
      vertical-align: sub;
    }

    .evidence-box {
      display: inline-block;
      vertical-align: top;
      width: 100%;
      p {
        word-break: break-word;
        padding-right: 20px;
      }
      p:hover a {
        color: #00a3ff;
      }
    }
    .evidence {
      img {
        vertical-align: middle;
      }
      a {
        color: #666666;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
      }
    }
  }
  .button-box {
    border-top: 1px solid #ebebeb;
    padding-top: 32px;
  }
  .back-button {
    width: 60px;
    height: 32px;
    background: #ffffff;
    border: 1px solid #00a3ff;
    color: #00a3ff;
    margin-left: 15px;
  }
  .bread-logo {
    width: 106px;
    height: 106px;
    vertical-align: text-top;
  }
  .info-table {
    margin-top: 6px;
    // width: 100%;
    border: 1px solid rgba(0, 0, 0, 0.15);
    font-size: 14px;
    box-sizing: border-box;
    tr {
      td {
        border-top: 1px solid rgba(0, 0, 0, 0.06);
        border-right: 1px solid rgba(0, 0, 0, 0.06);
        word-break: break-word;
      }
    }
    .header {
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      th {
        padding: 8px 0;
        border-right: 1px solid rgba(0, 0, 0, 0.06);
      }
    }
    td {
      padding: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
    }
  }
  .tab-box {
    border-bottom: 1px solid #ebebeb;
    padding-bottom: 10px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    span {
      margin-right: 32px;
      cursor: pointer;
    }
    span.tab-active {
      color: #00a3ff;
      border-bottom: 2px solid #00a3ff;
      padding-bottom: 10px;
    }
  }
  .null-file {
    text-align: center;
    margin-top: 16px;
    margin-bottom: 240px;
    .first-p {
      font-size: 16px;
      color: #333;
      margin: 10px 0 8px 0;
    }
    p {
      font-size: 14px;
      color: #666;
    }
  }
  .operation-td {
    div {
      cursor: pointer;
      color: #00a3ff;
      min-width: 60px;
    }
  }
  .table-bottom-tips {
    margin: 24px;
    span {
      color: #333;
      font-size: 700;
    }
  }
  /deep/ .ivu-poptip-inner {
    white-space: break-spaces;
  }
  /deep/ .ivu-poptip-body {
    margin-top: -20px;
  }
  /deep/ .ivu-poptip-popper {
    min-width: 315px;
    font-size: 14px;
  }
}
/deep/ .ivu-form-item-label {
  color: #333;
  font-size: 14px;
  padding: 10px 12px 8px 0;
}
/deep/ .formTranslate .ivu-form-item {
  margin-bottom: 10px;
}
.formTranslate p {
  word-break: break-all;
}
.label-title {
  color: #333;
  margin-bottom: -12px;
}
</style>
