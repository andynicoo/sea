<template>
  <div class="container">
    <!-- 类目 -->
    <div class="info">
      <div
        v-sensors="{ type: 'BuyVatServeClick', event: 'click' }"
        class="item"
        @click.stop="toRegister('serviceList')"
      >
        <img src="@/assets/images/common/taxDeclaration.svg" alt="" />
      </div>
      <div class="item" @click.stop="toRegister('computedTax')">
        <img src="@/assets/images/common/computedTax.svg" alt="" />
      </div>
      <div class="item" @click.stop="toRegister('orderList')">
        <img src="@/assets/images/common/orderManagement.svg" alt="" />
      </div>
    </div>

    <!-- 腰部广告位 -->
    <a :href="advertisement.url" v-if="advertisement.url">
      <img v-if="advertisement" :src="advertisement.picPath" width="100%" />
    </a>
    <img v-else :src="advertisement.picPath" width="100%" />

    <div style="background: #fff1dd; padding: 10px 20px; color: #ba772a">
      温馨提示：若您要进行申报，请由左侧工具栏进入[VAT申报]界面，查找相应的公司、税号、国家及申报周期进行报税
    </div>
    <!-- 我的服务 -->
    <div class="content">
      <!-- VAT服务列表 -->
      <div class="infoTb">
        <div class="clearfix title_wait">
          <div class="tax_title">我的VAT服务</div>
          <div class="flex tax_content">
            <Form :model="taxForm" :label-width="0" style="width: 100%" label-position="left" inline ref="taxForm">
              <FormItem label="VAT税号/公司名称" :label-width="132" prop="likeName">
                <Input
                  v-model="taxForm.searchContent"
                  style="width: 200px; border-radius: 5px"
                  clearable
                  placeholder="请输入公司名称/VAT税号"
                ></Input>
              </FormItem>
              <FormItem label="报税国家" style="border-radius: 5px" :label-width="70" prop="countryCode">
                <Select
                  v-model="taxForm.countryCode"
                  clearable
                  filterable
                  style="width: 170px"
                  placeholder="请选择报税国家"
                >
                  <Option :value="v.countryCode" v-for="(v, i) in countryList" :key="i">{{ v.countryNameZh }}</Option>
                </Select>
              </FormItem>
              <FormItem label="服务名称" :label-width="70" style="border-radius: 5px" prop="functionCode">
                <Select
                  v-model="taxForm.functionCodes"
                  multiple
                  :max-tag-count="1"
                  clearable
                  style="width: 170px"
                  placeholder="请选择服务名称"
                >
                  <Option value="1">税号注册</Option>
                  <Option value="2">转代理+申报</Option>

                  <Option value="5">注册＋申报</Option>
                  <Option value="6">注销税号</Option>
                  <Option value="7">税务稽查</Option>
                  <Option value="13">海牙认证</Option>
                  <Option value="23">IOSS注册+申报</Option>
                  <Option value="24">VAT退税</Option>
                </Select>
              </FormItem>
              <FormItem>
                <Button
                  type="primary"
                  icon="ios-search"
                  @click="searchBtn()"
                  style="border-radius: 4px; margin-right: 10px; font-size: 12px"
                  class="searchBtn"
                >
                  搜索
                </Button>
                <Button @click="handleReset('taxForm')" icon="ios-refresh" class="resetBtn">重置</Button>
              </FormItem>
              <FormItem label="服务状态" :label-width="80" style="display: block; margin-top: 15px">
                <RadioGroup v-model="taxForm.status" @on-change="handClick">
                  <Radio
                    v-for="(item, index) in statusList"
                    :label="item.value"
                    class="statusStyle"
                    :key="index"
                    border
                  >
                    {{ item.label }}
                  </Radio>
                </RadioGroup>
              </FormItem>
            </Form>
          </div>
        </div>
        <Tabs v-model="activeName" @on-click="handClick">
          <TabPane label="全部" name="-1"></TabPane>
          <TabPane v-for="(item, index) in tabList" :label="item.label" :key="index" :name="item.value"></TabPane>
        </Tabs>

        <div class="tbNull">
          <Table
            style="min-height: 184px"
            :no-data-text="nodatas"
            :columns="columns1"
            :loading="tableLoading"
            :data="registerList"
          >
            <template slot="right" slot-scope="{ row }">
              <span :class="row.status == 1 ? '' : 'red'">
                {{
                  row.status == -1
                    ? '正常使用'
                    : row.status == 0
                    ? '未付款'
                    : row.status == 1
                    ? '正常使用'
                    : row.status == 2
                    ? '待续费'
                    : row.status == 3
                    ? '税号注销'
                    : row.status == 9
                    ? '已取消'
                    : row.status == 11
                    ? '取消中'
                    : ''
                }}
              </span>
            </template>
            <template slot="remark" slot-scope="{ row }">
              <div>
                <Tooltip
                  :content="row.remarkRecordsClient"
                  placement="top"
                  v-if="row.remarkRecordsClient.trim() != ''"
                  style="cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
                >
                  {{ row.remarkRecordsClient }}
                </Tooltip>

                <img
                  class="remarkEditor"
                  src="@/assets/images/survey/edit.png"
                  @click="
                    editorModal = true;
                    formEditor = { ...row };
                  "
                  alt
                />
              </div>
            </template>
            <template slot="cureentNodeCode" slot-scope="{ row }">{{ row.cureentNodeCode | filterNodeCode }}</template>
            <template slot="operate" slot-scope="{ row }">
              <!-- 转代理 -->
              <span v-show="false">{{ row.status }}</span>
              <div class="operate" v-if="row.status != 2 && row.status != 9">
                <div v-if="row.productFunctionCode == 2">
                  <span
                    @click.stop="toSubAgent(row.productFunctionCode, row)"
                    class="btF upload-btn"
                    v-if="row.cureentNodeCode == 'NODE0015' && row.progressBar != 2"
                  >
                    <Icon type="ios-cloud-upload-outline" />
                    上传转代理资料
                  </span>
                  <span
                    v-if="['NODE0016', 'NODE0019'].includes(row.cureentNodeCode)"
                    @click.stop="toSubAgent(row.productFunctionCode, row)"
                    style="color: #515b6e"
                  >
                    <Icon type="ios-list-box-outline" />
                    查看进度
                  </span>
                  <span
                    @click.stop="toSubAgent(row.productFunctionCode, row)"
                    class="btF upload-btn"
                    v-if="row.cureentNodeCode == 'NODE0017'"
                  >
                    <Icon type="ios-cloud-upload-outline" />
                    上传授权书
                  </span>
                  <span
                    class="btF text-blue"
                    v-if="row.cureentNodeCode == 'NODE0017'"
                    @click.stop="toSubAgent(row.productFunctionCode, row)"
                  >
                    <Icon type="ios-cloud-download-outline" />
                    下载授权书
                  </span>
                  <span
                    v-if="['NODE0018', 'NODE0020'].includes(row.cureentNodeCode)"
                    @click.stop="toSubAgent(row.productFunctionCode, row)"
                    style="color: #515b6e"
                  >
                    <Icon type="ios-list-box-outline" />
                    详情
                  </span>
                  <span
                    @click.stop="toSubAgent(row.productFunctionCode, row)"
                    class="btF upload-btn"
                    style="color: #ed3e3e"
                    v-if="row.progressBar == 2"
                  >
                    <Icon type="ios-list-box-outline" />
                    查看驳回原因
                  </span>
                </div>
                <!-- 税号注册 -->
                <div v-if="row.productFunctionCode == 5 || row.productFunctionCode == 23">
                  <span
                    @click.stop="toSubAgent(row.productFunctionCode, row)"
                    class="btF upload-btn"
                    v-if="row.cureentNodeCode == 'NODE001'"
                  >
                    <Icon type="ios-cloud-upload-outline" />
                    上传注册资料
                  </span>
                  <template v-if="row.countryCode === 'GB'">
                    <span
                      v-if="['NODE006', 'NODE005', 'NODE002'].includes(row.cureentNodeCode)"
                      @click.stop="toSubAgent(row.productFunctionCode, row, 'questionnaire')"
                      style="color: #515b6e"
                    >
                      英国调查问卷
                    </span>
                    <span
                      v-if="['NODE006', 'NODE005', 'NODE002'].includes(row.cureentNodeCode)"
                      @click.stop="toSubAgent(row.productFunctionCode, row, 'ppob')"
                      style="color: #515b6e"
                    >
                      PPOB
                    </span>
                  </template>
                  <span
                    v-if="['NODE006', 'NODE005', 'NODE002'].includes(row.cureentNodeCode)"
                    @click.stop="toSubAgent(row.productFunctionCode, row)"
                    style="color: #515b6e"
                  >
                    <Icon type="ios-list-box-outline" />
                    查看进度
                  </span>
                  <span
                    @click.stop="toSubAgent(row.productFunctionCode, row)"
                    class="btF upload-btn"
                    v-if="row.cureentNodeCode == 'NODE003'"
                  >
                    <Icon type="ios-cloud-upload-outline" />
                    上传授权书
                  </span>
                  <span
                    class="btF text-blue"
                    v-if="row.cureentNodeCode == 'NODE003'"
                    @click.stop="toSubAgent(row.productFunctionCode, row)"
                  >
                    <Icon type="ios-cloud-download-outline" />
                    下载授权书
                  </span>
                  <span
                    v-if="row.cureentNodeCode == 'NODE007'"
                    @click.stop="toSubAgent(row.productFunctionCode, row)"
                    style="color: #16ade9"
                  >
                    <Icon type="ios-list-box-outline" />
                    查看税号
                  </span>
                  <span
                    @click.stop="toSubAgent(row.productFunctionCode, row)"
                    class="btF upload-btn"
                    style="color: #ed3e3e"
                    v-if="row.progressBar == 2"
                  >
                    <Icon type="ios-list-box-outline" />
                    查看驳回原因
                  </span>
                </div>

                <!-- 税务稽查 -->
                <div v-if="row.productFunctionCode == 7">
                  <span
                    @click.stop="toSubAgent(row.productFunctionCode, row)"
                    class="btF upload-btn"
                    v-if="row.cureentNodeCode == 'NODE1156' && row.progressBar != 2"
                  >
                    <Icon type="ios-cloud-upload-outline" />
                    上传稽查资料
                  </span>
                  <span
                    v-if="['NODE1157', 'NODE1158'].includes(row.cureentNodeCode)"
                    @click.stop="toSubAgent(row.productFunctionCode, row)"
                    style="color: #515b6e"
                  >
                    <Icon type="ios-list-box-outline" />
                    查看进度
                  </span>
                  <span
                    v-if="['NODE1159'].includes(row.cureentNodeCode)"
                    @click.stop="toSubAgent(row.productFunctionCode, row)"
                    style="color: #515b6e"
                  >
                    <Icon type="ios-list-box-outline" />
                    详情
                  </span>
                  <span
                    @click.stop="toSubAgent(row.productFunctionCode, row)"
                    class="btF upload-btn"
                    style="color: #ed3e3e"
                    v-if="row.progressBar == 2"
                  >
                    <Icon type="ios-list-box-outline" />
                    查看驳回原因
                  </span>
                </div>

                <!-- 税号注销 -->
                <div v-if="row.productFunctionCode == 6">
                  <span
                    @click.stop="toSubAgent(row.productFunctionCode, row)"
                    class="btF upload-btn"
                    v-if="row.cureentNodeCode == 'NODE0052' && row.progressBar != 2"
                  >
                    <Icon type="ios-cloud-upload-outline" />
                    上传资料
                  </span>
                  <span
                    v-if="['NODE0053', 'NODE0054', 'NODE0055', 'NODE0056'].includes(row.cureentNodeCode)"
                    @click.stop="toSubAgent(row.productFunctionCode, row)"
                    style="color: #515b6e"
                  >
                    <Icon type="ios-list-box-outline" />
                    查看进度
                  </span>
                  <span
                    v-if="['NODE0056'].includes(row.cureentNodeCode)"
                    @click.stop="toSubAgent(row.productFunctionCode, row)"
                    style="color: #515b6e"
                  >
                    <Icon type="ios-list-box-outline" />
                    详情
                  </span>
                  <span
                    v-if="row.progressBar == 2"
                    @click.stop="toSubAgent(row.productFunctionCode, row)"
                    style="color: #ed3e3e"
                    class="btF flex-center"
                  >
                    <Icon type="ios-list-box-outline" />
                    查看驳回原因
                  </span>
                </div>
                <!-- VAT退税节点 -->
                <div v-if="row.productFunctionCode == 24">
                  <span v-if="row.cureentNodeCode == 'NODE0067'" @click.stop="toTaxRefund(row)" class="btF upload-btn">
                    <Icon type="ios-cloud-upload-outline" />
                    上传退税资料
                  </span>
                  <span
                    v-if="row.cureentNodeCode == 'NODE0069'"
                    @click.stop="handleFinishRefund(row)"
                    class="btF upload-btn"
                    style="color: #f79728"
                  >
                    <Icon type="ios-list-box-outline" />
                    退税完成
                  </span>
                  <span
                    v-if="['NODE0069', 'NODE0068'].includes(row.cureentNodeCode)"
                    @click.stop="toTaxRefund(row)"
                    class="btF upload-btn"
                    style="color: #515b6e"
                  >
                    <Icon type="ios-list-box-outline" />
                    查看进度
                  </span>
                  <span
                    v-if="['NODE0070'].includes(row.cureentNodeCode)"
                    @click.stop="toTaxRefund(row)"
                    class="btF upload-btn"
                    style="color: #515b6e"
                  >
                    <Icon type="ios-list-box-outline" />
                    详情
                  </span>
                  <span
                    v-if="row.progressBar == 2"
                    @click.stop="toTaxRefund(row)"
                    class="btF upload-btn"
                    style="color: #ed3e3e"
                  >
                    <Icon type="ios-list-box-outline" />
                    查看驳回原因
                  </span>
                </div>
                <!-- 海牙认证 -->
                <div v-if="row.productFunctionCode == 13">
                  <span
                    @click.stop="toHagueRegister(row.progressBar, row)"
                    class="btF upload-btn"
                    v-if="row.cureentNodeCode == 'NODE0028' && row.progressBar != 2"
                  >
                    <Icon type="ios-cloud-upload-outline" />
                    完善海牙信息
                  </span>
                  <span
                    v-if="['NODE0029', 'NODE0030', 'NODE0031', 'NODE0032'].includes(row.cureentNodeCode)"
                    @click.stop="toHagueRegister(row.progressBar, row)"
                    style="color: #515b6e"
                  >
                    <Icon type="ios-list-box-outline" />
                    详情
                  </span>
                  <span
                    @click.stop="toHagueRegister(row.progressBar, row)"
                    class="btF upload-btn"
                    style="color: #ed3e3e"
                    v-if="row.progressBar == 2"
                  >
                    <Icon type="ios-list-box-outline" />
                    查看驳回原因
                  </span>
                </div>
              </div>
              <div
                class="operate"
                v-else-if="
                  row.status == 9 &&
                  row.cureentNodeCode != 'NODE0052' &&
                  row.cureentNodeCode != 'NODE0015' &&
                  row.cureentNodeCode != 'NODE001' &&
                  row.cureentNodeCode != 'NODE1156' &&
                  row.cureentNodeCode != 'NODE0067' &&
                  row.cureentNodeCode != 'NODE0028'
                "
              >
                <!-- 税号注销 -->
                <div v-if="row.productFunctionCode == 6">
                  <span @click.stop="toSubAgent(row.productFunctionCode, row)" style="color: #515b6e">
                    <Icon type="ios-list-box-outline" />
                    查看
                  </span>
                </div>
                <!-- VAT退税节点 -->
                <div v-else-if="row.productFunctionCode == 24">
                  <span @click.stop="toTaxRefund(row)" class="btF upload-btn" style="color: #515b6e">
                    <Icon type="ios-list-box-outline" />
                    查看
                  </span>
                </div>
                <!-- 海牙认证 -->
                <div v-else-if="row.productFunctionCode == 13">
                  <span @click.stop="toHagueRegister(row.progressBar, row)" style="color: #515b6e">
                    <Icon type="ios-list-box-outline" />
                    查看
                  </span>
                </div>
                <!-- 税务稽查 -->
                <div v-else>
                  <span @click.stop="toSubAgent(row.productFunctionCode, row)" style="color: #515b6e">
                    <Icon type="ios-list-box-outline" />
                    查看
                  </span>
                </div>
              </div>
              <div class="operate" v-if="row.status == 2">
                <span
                  @click.stop="toSubAgent(row.productFunctionCode, row)"
                  class="btF upload-btn"
                  style="color: #515b6e"
                >
                  <img
                    src="@/assets/images/survey/detail.svg"
                    alt
                    style="width: 20px; position: relative; top: 7px; margin-right: 2px"
                  />
                  详情
                </span>
              </div>

              <div class="operate" v-if="row.status != 2">
                <!-- 德国等待报税中 -->

                <!-- 已失效的续费服务 -->
                <template v-if="row.progressBar == 82">
                  <!-- 未提交申报数据的跳转到注册详情 -->
                  <span
                    v-if="row.beginTime"
                    @click.stop="registerInfo(row)"
                    class="btF upload-btn"
                    style="color: #515b6e"
                  >
                    <img
                      src="@/assets/images/survey/detail.svg"
                      alt
                      style="width: 20px; position: relative; top: 7px; margin-right: 2px"
                    />
                    详情
                  </span>
                  <!-- 提交申报数据的跳转税号信息 -->
                  <span
                    v-if="!row.beginTime"
                    @click.stop="registerInfo(row)"
                    class="btF upload-btn"
                    style="color: #515b6e"
                  >
                    <img
                      src="@/assets/images/survey/detail.svg"
                      alt
                      style="width: 20px; position: relative; top: 7px; margin-right: 2px"
                    />
                    详情
                  </span>
                </template>
              </div>
            </template>
          </Table>
        </div>
        <div class="pageSetion clearfix">
          <Page
            class="pagination"
            :current="taxForm.page"
            :total="registerListTotal"
            @on-change="registerChangePageHandler"
            @on-page-size-change="registerPageSizeChangeHandler"
            :page-size="taxForm.limit"
          />
        </div>
      </div>
    </div>
    <!-- 申报统计 -->
    <div class="shenbao">
      <div class="shenbao-title">
        <p class="left">缴税统计</p>
        <p class="right">
          <span
            style="margin-right: 16px; cursor: pointer"
            :class="{ active: staticNum == '1' }"
            @click="staticNumChange('1')"
          >
            <Icon type="ios-podium" style="font-size: 18px; margin-right: 3px" />
            图形统计
          </span>
          <span :class="{ active: staticNum == '2' }" @click="staticNumChange('2')" style="cursor: pointer">
            <Icon type="ios-list-box-outline" style="font-size: 18px; margin-right: 3px" />
            列表统计
          </span>
        </p>
      </div>
      <div class="shenbao-content">
        <div class="conten-form">
          <Form :model="viewForm" :label-width="0" style="width: 100%" label-position="left" inline ref="taxForm">
            <FormItem label="VAT税号/公司名称" :label-width="130" prop="likeName">
              <Input
                v-model="viewForm.searchContent"
                clearable
                style="width: 208px"
                placeholder="请输入公司名称/VAT税号"
              ></Input>
            </FormItem>
            <FormItem label="申报国家" style="margin-left: 10px" :label-width="70" prop="countryCode">
              <Select
                v-model="viewForm.countryCode"
                clearable
                on-change="countryCodeChange"
                style="width: 180px"
                placeholder="全部国家"
              >
                <Option :value="v.countryCode" v-for="(v, i) in countryList" :key="i">{{ v.countryNameZh }}</Option>
              </Select>
            </FormItem>
            <FormItem label="缴税时间" :label-width="70" style="margin-left: 10px" prop="year">
              <DatePicker
                type="year"
                v-model="viewForm.year"
                @on-change="operatDateChange"
                placeholder="请选择年份"
                style="width: 114px; margin-right: 10px"
              ></DatePicker>
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                icon="ios-search"
                @click="viewSearchBtn()"
                style="border-radius: 4px; margin-right: 10px; font-size: 12px"
                class="searchBtn"
              >
                搜索
              </Button>
              <Button @click="handleResetView" icon="ios-refresh" class="resetBtn">重置</Button>
            </FormItem>
          </Form>
        </div>
        <div class="myEchars" v-show="staticNum == '1'">
          <div id="myEchars" :style="{ width: '100%', height: '300px' }"></div>
        </div>
        <div class="tbNull" style="margin: 24px 0 0 0" v-show="staticNum == '2'">
          <Table :columns="columns2" :data="shenbaoList">
            <template slot="caozuo" slot-scope="{ row }">
              <div style="cursor: pointer" @click="showMingxi(row)">
                <span style="color: #16ade9; font-size: 14px">查看明细</span>
              </div>
            </template>
          </Table>
        </div>
        <div class="pageSetion clearfix" v-show="staticNum == '2'">
          <Page
            class="pagination"
            :current="viewForm.page"
            :total="shenbaoTableTotal"
            @on-change="shenbaoPageChange"
            :page-size="viewForm.limit"
            show-total
          />
        </div>
      </div>
    </div>

    <Modal v-model="inviteBox111" title="邀请送好礼" footer-hide :width="640">
      <p class="invit-title">邀请用户，免费注册英国税号</p>
      <div class="invit-content">
        <p class="invit-input fl">{{ shareLink }}</p>
        <p class="link-btn cobyOrderSn" data-clipboard-action="copy" :data-clipboard-text="shareLink" @click="copyLink">
          复制链接
        </p>
        <div class="active-rule">
          <p class="rule-title">活动规则</p>
          <p class="rule-content">
            一：邀请三个用户成功注册跨税云账号，即可免费注册一个英国税号；
            <br />
            二：优惠券仅限本账号使用，不能转让；
            <br />
            三：优惠券有效期限：30天；
            <br />
            四：活动有效期：2020.3.19-2020.4.19；
          </p>
        </div>
      </div>
    </Modal>
    <Modal v-model="editorModal" title="服务备注信息" @on-ok="remarkFun">
      <Form :model="formEditor" :label-width="120">
        <FormItem label="公司名称：">
          {{ formEditor.companyNameZh }}
        </FormItem>
        <FormItem label="备注：">
          <Input
            v-model="formEditor.remarkRecordsClient"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 5 }"
            placeholder="最多可输入15个字符"
            :maxlength="15"
            style="width: 350px"
          ></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="isShowMingxi" :width="667" scrollable footer-hide>
      <div class="mingxi-modal">
        <div class="mingxi-title">
          <p class="title-head">缴税明细</p>
          <p class="title-content">
            <span class="title-left">公司名称：</span>
            <span class="title-right">{{ mingxiCompanyNameZh }}</span>
            <span class="title-left">缴税国家：</span>
            <span class="title-right">{{ mingxiCountryName }}</span>
          </p>
          <p class="title-content">
            <span class="title-left">累计缴税金额：</span>
            <span class="title-right" style="color: #ed3e3e">{{ mingxiTaxPrice }} {{ currencySign }}</span>
          </p>
        </div>
        <div class="mingxi-content" v-for="(item, index) in mingxiList" :key="index">
          <p class="time">{{ item.beginTime || '0' }} 至 {{ item.endTime || '0' }}</p>
          <p class="price">
            <span>含税销售额：{{ item.includTaxPrice || '0' }} {{ currencySign }}</span>
            <span>不含税销售额：{{ item.excludeTaxPrice || '0' }} {{ currencySign }}</span>
            <span style="margin-right: 0">销项税金：{{ item.taxAmtTotal || '0' }} {{ currencySign }}</span>
          </p>
          <p class="price" style="padding-bottom: 24px">
            <span>抵扣金额：{{ item.deductionPrice || '0' }} {{ currencySign }}</span>
            <span>最终缴纳税金：{{ item.allTaxPrice || '0' }} {{ currencySign }}</span>
            <span style="color: #16ade9; font-weight: 500; margin-right: 0">
              缴税时间：{{ item.submitTaxCertificateTime || '暂无' }}
            </span>
          </p>
        </div>
      </div>
    </Modal>
    <Modal v-model="showDeclareReceipt" title="申报回执">
      <p v-for="(item, index) in declareReceiptList" :key="index" style="margin-top: 5px; margin-left: 32px">
        <a :href="item" target="_blank" style="color: #16ade9">
          <img style="position: relative; top: 3px" src="@/assets/images/survey/uploadBlue.png" alt />
          查看回执
        </a>
      </p>
      <p slot="footer">
        <Button type="primary" @click="showDeclareReceipt = false">确认</Button>
      </p>
    </Modal>
    <StartModal v-if="modalStart" @changeState="getModelStartState" :serviceInfo="serviceInfo"></StartModal>
    <UploadModal
      v-if="modalPay"
      @changeState="getModelPayState"
      :serviceId="serviceInfo.id"
      :countryCode="countryCode"
      :status="status"
    ></UploadModal>
    <BuyDeclareModal v-if="modalBuyd" @changeState="getModelBuyState" :sendType="buyType"></BuyDeclareModal>
    <GBtaxDetails
      v-if="showGbTaxDetails"
      @changeState="getTaxModelBuyTax"
      :workNumber="workId"
      :serviceId="orderId"
      :vatTaxNumber="workId"
    ></GBtaxDetails>
    <TaxDetails
      v-if="showTaxDetails"
      @changeState="getTaxModelBuyTax"
      @needVatObligations="needVatObligations"
      :workNumber="workId"
      :serviceId="orderId"
      :countryCode="countryCode"
    ></TaxDetails>
    <RegTaxDetails v-if="showRegTax" @changeState="getRegTaxModelBuyTax" :workId="workId"></RegTaxDetails>
    <submitDeclareEntry
      v-if="showDeclareEntry"
      :DeclareInfo="DeclareInfoGB"
      @changeState="getShowDeclareEntryState"
    ></submitDeclareEntry>
    <SendFileFR
      :type="sendType"
      :serviceId="sendServiceId"
      :serviceInfo="serviceInfo"
      v-if="FRsendFile"
      @changeSendStateFR="changeSendStateFR"
    ></SendFileFR>
    <Modal class="ActiviPop" v-model="showMoudel" :closable="false" :mask-closable="false" footer-hide>
      <img
        style="cursor: pointer"
        @click="$router.push('/activity')"
        src="@/assets/images/activity/indexActiPop.png"
        alt=""
      />
      <div class="closeBox">
        <img src="@/assets/images/activity/close.png" alt="" width="50px;" @click="showMoudel = false" class="close" />
      </div>
    </Modal>
    <div
      class="ActiIcon"
      style="cursor: pointer"
      v-if="
        Number(new Date(this.ActiveConfig.iconTimeStart)) <= Number(new Date()) &&
        Number(new Date(this.ActiveConfig.iconTimeEnd)) >= Number(new Date())
      "
    >
      <img @click="$router.push('/activity')" src="@/assets/images/activity/indexActiIcon.png" alt="" />
    </div>
  </div>
</template>
<script>
const echarts = require('echarts');
import { mapGetters } from 'vuex';
import StartModal from './modalComponents/startDeclare';
import UploadModal from './modalComponents/uploadPay';
import BuyDeclareModal from './modalComponents/buyDeclare';
import submitDeclareEntry from './modalComponents/submitDeclareEntry';
import TaxDetails from './modalComponents/taxDetails';
import GBtaxDetails from './modalComponents/GBtaxDetails';
import RegTaxDetails from './modalComponents/regTaxDetail';
import SendFileFR from './modalComponents/sendFileFR';
import { unusedOrderServices, bulletinsHomeList, advertise, shenbaoBar, shenbaoTable } from '@/api/home/home';
import { taxManageList, getTaxBill, showTaxLogDetail, orderStatistic, remarkEditAPI } from '@/api/taxModule';
import { advertisementGetById } from '@/api/advertisement';
import { personalCenterIndex } from '@/api/user/userModule';
import {
  isAuthorized,
  taxBureauGetWay,
  authorizeCallback,
  retrievalVAT,
  forms,
} from '@/api/taxBureauService/taxBureauService';
import { baseInfo } from '@/api/shoppingCar/shoppingCar';
import { productInfo } from '@/api/shoppingCar/shoppingCar';
import vatCard from '@/views/common/vatCard';
import { finishRefund } from '@/api/taxRefund/gbRefund';
import { codeList, statusList, tabList } from './staticList';
import { fristin, hasPoped } from '@/api/activity/index';
export default {
  name: 'Survey',
  components: {
    StartModal,
    UploadModal,
    BuyDeclareModal,
    TaxDetails,
    GBtaxDetails,
    RegTaxDetails,
    submitDeclareEntry,
    SendFileFR,
    vatCard,
  },
  data() {
    return {
      canpopShow: false,
      showMoudel: false,
      tabList: tabList, //tab切换
      statusList: statusList,
      activeName: '-1',
      tableLoading: true,
      currencySign: '',
      declareReceiptList: [],
      showDeclareReceipt: false,
      mingxiCompanyNameZh: '',
      mingxiCountryName: '',
      mingxiTaxPrice: '',
      mingxiList: [],
      carouselVal: 0,
      setting: {
        autoplay: false,
        autoplaySpeed: 5000,
        dots: 'none',
        radiusDot: false,
        trigger: 'click',
        arrow: 'never',
      },
      isShowMingxi: false,
      shenbaoTableTotal: 0,
      staticNum: '1',
      buyType: 'declare', //购买类型，tax注册，declare申报
      modalStart: false, //开始报税弹窗
      modalPay: false, //凭证
      modalBuyd: false, //我要报税
      modalBuyt: false, //注册新税号
      showTaxDetails: false, //报税详情
      showGbTaxDetails: false, //英国税局详情
      showRegTax: false, //注册详情
      inviteBox: false,
      inviteBox111: false,
      shareLink: '',
      contentStyleObj: {
        height: '',
      },
      workId: '',
      orderId: '',
      countryCode: '',
      serviceInfo: {},
      taxForm: {
        limit: 8,
        page: 1,
        countryCode: '',
        functionCodes: [], //"2", "5", "6", "7", "13", "23"
        searchContent: '',
        tabNodeCode: '',
      },
      viewForm: {
        searchContent: '',
        countryCode: '',
        year: '',
        page: 1,
        limit: 8,
        startTime: '',
        overTime: '',
      },
      xTitle: [],
      currentYear: (function (params) {
        let oDay = new Date();
        let year = oDay.getFullYear(); //当前年份
        return year.toString();
      })(),
      nodatas: '暂无处理事项',
      ifLogin: false,
      survey: {}, // 概况数据
      declareCurrentPage: 1,
      registerCurrentPage: 1,
      declareListTotal: 0,
      registerListTotal: 0,
      perPageCount: 3,
      declareList: [],
      registerList: [],
      taxApplication: {},
      registerTax: {},
      columns1: [
        {
          title: '服务号',
          key: 'serviceNo',
          width: 147,
        },
        {
          title: '公司名称',
          key: 'companyNameZh',
          width: 180,
          render(h, params) {
            let type = '暂未填写';
            if (params.row.companyNameZh != '') {
              type = params.row.companyNameZh;
              return h(
                'Tooltip',
                {
                  props: {
                    placement: 'top',
                    content: type,
                    maxWidth: '200px',
                  },
                  style: {
                    cursor: 'pointer',
                    'white-space': 'nowrap',
                    overflow: 'hidden',
                    'text-overflow': 'ellipsis',
                    '-webkit-box-orient': 'vertical',
                  },
                },
                type
              );
            } else {
              return h(
                'span',
                {
                  style: {
                    color: '#999999',
                  },
                },
                type
              );
            }
          },
        },
        {
          title: '国家',
          key: 'countryNameEn',
          width: 80,
          render(h, params) {
            let productFunctionCode = params.row.productFunctionCode;
            let text = '';
            if (productFunctionCode == 23) {
              text = 'IOSS';
            } else {
              text = params.row.countryNameEn;
            }
            return h('span', text);
          },
        },
        {
          title: '服务名称',
          key: 'productFunctionCode',
          minWidth: 90,
          render(h, params) {
            let productFunctionCode = params.row.productFunctionCode;

            let productName = '';
            switch (productFunctionCode) {
              case 1:
                productName = '税号注册';
                break;
              case 2:
                productName = '转代理+申报';
                break;
              case 3:
                productName = '税务补缴';
                break;
              case 4:
                productName = '转代理';
                break;
              case 5:
                productName = '注册＋申报';
                break;
              case 6:
                productName = '注销税号';
                break;
              case 7:
                productName = '税务稽查';
                break;
              case 13:
                productName = '海牙认证';
                break;
              case 23:
                productName = 'IOSS注册+申报';
                break;
              case 24:
                productName = 'VAT退税';
                break;
            }
            return h('span', productName);
          },
        },
        {
          title: 'VAT/IOSS税号',
          key: 'vatTaxNumber',
          minWidth: 120,
          render(h, params) {
            let type = '暂无';
            if (params.row.countryCode != 'IOSS') {
              if (params.row.vatTaxNumber != '') {
                type = params.row.vatTaxNumber;
                return h('span', type);
              } else {
                return h(
                  'span',
                  {
                    style: {
                      color: '#999999',
                    },
                  },
                  type
                );
              }
            } else {
              if (params.row.iossNumber != '') {
                type = params.row.iossNumber;
                return h('span', type);
              } else {
                return h(
                  'span',
                  {
                    style: {
                      color: '#999999',
                    },
                  },
                  type
                );
              }
            }
          },
        },
        {
          title: '申报周期',
          key: 'declarePeriod',
          minWidth: 120,
          render(h, params) {
            let declarePeriod = params.row.declarePeriod,
              type = '暂无';

            if (declarePeriod == 1) {
              type = '季报';
            } else if (declarePeriod == 0) {
              type = '月报';
            } else if (declarePeriod == 2) {
              type = '年报';
            }
            if (type == '暂无') {
              return h(
                'span',
                {
                  style: {
                    color: '#999999',
                  },
                },
                type
              );
            } else {
              return h('span', type);
            }
          },
        },
        {
          title: 'VAT服务进度',

          slot: 'cureentNodeCode',
          minWidth: 120,
        },
        {
          title: '服务截止日期',
          key: 'expirationTime',
          render(h, params) {
            let expirationTime = (params.row.expirationTime || '').slice(0, 10);
            return h('span', expirationTime);
          },
          width: 126,
        },
        {
          renderHeader: (h, params) => {
            let title = `备注`;
            return h(
              'Tooltip',
              {
                style: {
                  cursor: 'pointer',
                },
                props: {
                  content: `备注说明：您可以备注您的店铺名称/其它信息，方便查询管理。`,
                  placement: 'right',
                  'max-width': '300',
                },
              },
              title
            );
          },
          width: 200,
          slot: 'remark',
        },

        {
          title: '操作',
          slot: 'operate',
          width: 240,
          fixed: 'right',
        },
      ],
      columns2: [
        {
          title: '公司名称',
          key: 'companyNameZh',
          width: 182,
        },
        {
          title: '国家',
          key: 'countryNameZh',
          width: 244,
        },
        {
          title: '税号',
          key: 'vatTaxNumber',
        },
        {
          title: '申报周期',
          key: 'declarePeriod',
          minWidth: 120,
          render(h, params) {
            let periodType = params.row.declarePeriod,
              type = '暂无';

            if (periodType == 1) {
              type = '季报';
            } else if (periodType == 0) {
              type = '月报';
            } else if (periodType == 2) {
              type = '年报';
            }
            if (type == '暂无') {
              return h(
                'span',
                {
                  style: {
                    color: '#999999',
                  },
                },
                type
              );
            } else {
              return h('span', type);
            }
          },
        },
        {
          title: '累计缴税金额',
          key: 'taxAmtTotals',
          render(h, params) {
            let type = params.row.taxAmtTotals + ' ' + params.row.currencySign;
            return h('span', type);
          },
        },
        {
          title: '操作',
          slot: 'caozuo',
        },
      ],
      shenbaoList: [],
      countryList: [],
      suspendAdvertisement: true,
      showDeclareEntry: false,
      timer: null,
      DeclareInfoGB: [],
      showAuthorization: false,
      status: '',
      FRsendFile: false,
      sendType: 0,
      sendServiceId: '',
      taxListStatics: {},
      statusIndex: 'undefined',
      editorModal: false,
      formEditor: {},
      unusedOrderServicesList: [],
      unusedOrderServicesListTotal: 0,
      unusedOrderServicesListNew: [],
      companyOrderServicesList: [],
      companyOrderServicesRenewalList: [],
      bulletinsList: [],
      advertiseList: [],
      tabIndex: 1,
      noRemind: false,
      showGuide: false,
      barList: {},
      barTotalList: [],
      guiteStep: 1,
      progressStatus: {
        0: '待上传资料',
        1: '待审核资料',
        2: '待续费',
        3: '注册中',
        4: '注册完成',
        5: '待授权海牙认证',
        6: '海牙认证中',
        7: '待授权注册税号',
        8: '资料驳回',
        28: '待上传资料(转代理)',
        29: '转代理中',
        19: '未开始',
        20: '未开始',
        21: '待提交报税资料',
        18: '申报中',
        22: '待缴纳税金',
        23: '待审核申报',
        24: '申报驳回',
        25: '申报完成',
        26: '申报失败',
        27: '申报完成',
        31: '转代理资料待审核',
        32: '转代理资料驳回',
        33: '税金待审核',
        34: '缴税凭证被驳回',
        35: '待上传零申报凭证',
      },
      advertisement: {},
    };
  },
  computed: {
    ...mapGetters({
      token: 'gettoken',
      sessionId: 'getsessionid',
      declareNumbuer: 'declareNumbuer',
    }),
  },
  filters: {
    filterNodeCode(status) {
      let result = codeList.find((item) => item.value === status);
      return result ? result.label : '';
    },
  },
  created() {
    let self = this;
    // 概况
    if (this.$store.getters.getlogin == false) {
      self.ifLogin = false;
    } else {
      self.ifLogin = true;
    }
    let showGuideFromLogin = JSON.parse(sessionStorage.getItem('showGuideFromLogin'));
    let showGuide = false;
    try {
      showGuide = JSON.parse(localStorage.getItem('showGuide'));
      if (showGuide === null) {
        showGuide = true;
      }
    } catch (error) {
      showGuide = true;
    }
    if (showGuideFromLogin && showGuide) {
      this.showGuide = true;
      let unUsed = [
        {
          countryHeadImage: 'https://fdfs.itaxs.com/group1/M00/05/63/rBLKNV_h5VGAJ5_PAAAIv2eOMvA613.png',
          vatTaxNumber: '123456789',
          serverNo: '1234567',
          productFunctionCode: '5',
          expirationTime: '授权申报后计时',
          progressBar: '3',
          countryCode: 'DE',
        },
      ];
      let list = [
        {
          companyName: '测试公司',
          orderServicesList: [
            {
              countryHeadImage: 'https://fdfs.itaxs.com/group1/M00/05/63/rBLKNV_h5VGAJ5_PAAAIv2eOMvA613.png',
              vatTaxNumber: '123456789',
              serverNo: '1234567',
              productFunctionCode: '5',
              expirationTime: '授权申报后计时',
              progressBar: '3',
              countryCode: 'DE',
            },
          ],
        },
      ];
      this.unusedOrderServicesListNew = unUsed;
      this.companyOrderServicesList = list;
    } else {
      this.getOrderServicesList(1);
    }
    this.getUserService();
    this.getHeight();
    this.getCountry();
    this.authorizedCallBack();
    this.statisticsfun();

    this.getTaxManageList();
    this.getIsFristIn();
    this.PopshowTime();
    this.advertisementGetByIdAPi();
  },
  mounted() {
    this.getEachars();
  },
  methods: {
    /**获取广告 */
    async advertisementGetByIdAPi() {
      let { code, data } = await advertisementGetById({ adKey: 'Workbench_middle_banner' });
      if (code == 0) this.advertisement = data[0] || {};
    },

    PopshowTime() {
      let canpopShow = false;
      let nowTime = Number(new Date());
      if (
        Number(new Date(this.ActiveConfig.popStartTime1)) <= nowTime &&
        Number(new Date(this.ActiveConfig.popEndTime1)) >= nowTime
      ) {
        canpopShow = true;
      } else if (
        Number(new Date(this.ActiveConfig.popStartTime2)) <= nowTime &&
        Number(new Date(this.ActiveConfig.popEndTime2)) >= nowTime
      ) {
        canpopShow = true;
      } else if (
        Number(new Date(this.ActiveConfig.popStartTime3)) <= nowTime &&
        Number(new Date(this.ActiveConfig.popEndTime3)) >= nowTime
      ) {
        canpopShow = true;
      } else {
        canpopShow = false;
      }
      return canpopShow;
    },

    getIsFristIn() {
      let canpopShow = this.PopshowTime();
      fristin().then((res) => {
        if (res.code == 0 && res.data && canpopShow) {
          this.showMoudel = true;
          hasPoped().then((res) => {});
        }
      });
    },
    /** 列表操作跳转/
     * 转代理-2
     * 税号注册-5
     * 税务稽查-7
     * 税号注销-6
     *  */

    toSubAgent(functionCode, row, GBQuestionnaire) {
      if (functionCode == 2) {
        this.$router.push({
          path: '/turnToAgent',
          query: {
            serviceId: row.serviceId,
            serviceNo: row.serviceNo,
            countryCode: row.countryCode,
            countryNameZh: row.countryNameZh,
            cureentNodeCode: row.cureentNodeCode,
          },
        });
      } else if (functionCode == 5 || functionCode == 23) {
        this.$router.push({
          path: '/registerInfo',
          query: {
            serviceId: row.serviceId,
            serviceNo: row.serviceNo,
            countryCode: row.countryCode,
            countryNameZh: row.countryNameZh,
            GBQuestionnaire,
          },
        });
      } else if (functionCode == 7) {
        this.$router.push({
          path: '/taxInspection',
          query: {
            serviceId: row.serviceId,
            serviceNo: row.serviceNo,
            countryNameZh: row.countryNameZh,
            countryCode: row.countryCode,
          },
        });
      } else if (functionCode == 6) {
        this.$router.push({
          path: '/cancelTaxNum',
          query: {
            serviceId: row.serviceId,
            serviceNo: row.serviceNo,
            companyNameZh: row.companyName,
            status: row.progressBar,
            countryCode: row.countryCode,
          },
        });
      }
    },
    /**
     * 到退税资料页面（包含提交资料和查看详情）
     */
    toTaxRefund(row) {
      this.$router.push({
        path: '/taxRefund',
        query: {
          serviceId: row.serviceId,
          countryCode: row.countryCode,
          cureentNodeCode: row.cureentNodeCode,
          progressBar: row.progressBar,
        },
      });
    },

    showMingxi(row) {
      this.isShowMingxi = true;
      this.mingxiCompanyNameZh = row.companyNameZh;
      this.mingxiCountryName = row.countryNameZh;
      this.mingxiTaxPrice = row.taxAmtTotals;
      this.currencySign = row.currencySign;
      let data = {
        servicesId: row.orderServicesId,
        startTime: this.viewForm.startTime,
        overTime: this.viewForm.overTime,
      };
      showTaxLogDetail(data).then((res) => {
        if (res.code == 0) {
          this.mingxiList = res.data;
          if (this.mingxiList.length > 0) {
            for (let i = 0; i < this.mingxiList.length; i++) {
              this.mingxiList[i].beginTime = this.mingxiList[i].beginTime.split(' ')[0];
              this.mingxiList[i].endTime = this.mingxiList[i].endTime.split(' ')[0];
            }
          }
        }
      });
    },
    shenbaoPageChange(page) {
      this.viewForm.page = page;
    },
    handleResetView() {
      this.viewForm = {
        likeName: '',
        countryCode: '',
        year: '',
        page: 1,
        limit: 8,
        startTime: '',
        overTime: '',
      };
    },
    getShenbaoTable(page) {
      if (page) {
        this.viewForm.page = page;
      } else {
        this.viewForm.page = 1;
      }
      shenbaoTable(this.viewForm).then((res) => {
        if (res.code == 0) {
          this.shenbaoList = res.data.records;
          this.shenbaoTableTotal = res.data.total - 0;
        }
      });
    },
    viewSearchBtn() {
      if (this.viewForm.countryCode == 'undefined') this.viewForm.countryCode = '';

      if (this.staticNum == '1') {
        // this.getShenbaoBar();
      } else if (this.staticNum == '2') {
        this.viewForm.page = 1;
        this.viewForm.limit = 8;
        // this.getShenbaoTable();
      }
    },
    operatDateChange(year) {
      if (year == '') {
        this.viewForm.startTime = '';
        this.viewForm.overTime = '';
      } else {
        this.viewForm.startTime = year + '-01-01';
        this.viewForm.overTime = year + '-12-31';
      }
    },
    staticNumChange(type) {
      this.staticNum = type;
      if (type == '1') {
        // this.getShenbaoBar();
      } else if (type == '2') {
        // this.getShenbaoTable();
      }
    },
    getShenbaoBar() {
      shenbaoBar(this.viewForm).then((res) => {
        if (res.code == 0) {
          this.barList = res.data.data;
          this.barTotalList = res.data.total;
          this.xTitle = res.data.title;
          this.getEachars();
        }
      });
    },
    getEachars() {
      let that = this;
      var myChart = echarts.init(document.getElementById('myEchars'));
      myChart.setOption({
        grid: {
          left: '5%',
          right: '5%',
        },
        color: '#1890FF',
        tooltip: {
          padding: 10,
          backgroundColor: '#222',
          borderColor: '#777',
          borderWidth: 1,
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
            axis: 'x',
            show: true,
          },
          formatter: function (obj) {
            let ind = obj[0].dataIndex;
            let text = ` <div style="padding:0px 10px;color:#fff">
                    <div>缴税金额</div>`;
            for (let key in that.barList) {
              let price = '';
              let cate = '';
              if (key == 'EUR') {
                price = '欧元：';
                cate = '€';
              }
              if (key == 'GBP') {
                price = '英镑：';
                cate = '£';
              }
              if (key == 'SAR') {
                price = '沙特币：';
                cate = 'SAR';
              }
              if (key == 'AED') {
                price = '阿联酋：';
                cate = 'AED';
              }
              if (key == 'PLN') {
                price = '波兰币：';
                cate = 'PLN';
              }
              if (key == 'CZK') {
                price = '捷克币：';
                cate = 'CZK';
              }
              let arr = that.barList[key];
              text += `<div>${price} ${arr[ind]} ${cate}</div>`;
            }
            text += `</div>`;
            return text;
          },
        },
        xAxis: {
          data: this.xTitle,
        },
        yAxis: {},
        series: [
          {
            name: '申报金额',
            type: 'bar',
            data: this.barTotalList,
            barWidth: 24,
          },
        ],
      });
    },
    handelXiangqing(row) {
      if (
        row.productFunctionCode == 2 &&
        (row.progressBar != 28 || row.progressBar != 29 || row.progressBar != 31 || row.progressBar != 32)
      ) {
        this.$router.push({
          path: '/turnToAgent',
          query: {
            servicesId: row.id,
            companyNameZh: row.companyName,
            supplierId: row.supplierId,
            status: row.progressBar,
            countryCode: row.countryCode,
            countryNameZh: row.countryNameZh,
            cureentNodeCode: row.cureentNodeCode,
          },
        });
      } else {
        this.$router.push({
          path: '/registerInfo',
          query: {
            servicesId: row.id,
            companyNameZh: row.companyName,
            supplierId: row.supplierId,
            status: row.progressBar,
            countryCode: row.countryCode,
            countryNameZh: row.countryNameZh,
            hyFlag: row.hyFlag ? row.hyFlag : '',
          },
        });
      }
    },
    // 详情跳转
    registerInfo(row) {
      this.workId = row.vatTaxNumber;
      this.orderId = row.id;
      this.countryCode = row.countryCode;
      this.hyFlag = row.hyFlag;

      if ((row.progressBar === 25 || row.progressBar === 27) && row.countryCode === 'GB') {
        // this.showTaxDetails = true;
        this.$router.push({
          path: '/taxDetails',
          query: {
            workNumber: row.vatTaxNumber,
            serviceId: row.id,
            servicesId: row.id,
            countryCode: row.countryCode,
            companyNameZh: row.companyName,
            status: row.progressBar,
            countryNameZh: row.countryNameZh,
          },
        });
        return;
      }
      //  已失效续费的跳转
      if (row.progressBar == 82) {
        if (row.beginTime) {
          // 有申报区间的 跳转到税号信息
          this.$router.push({
            path: '/taxDetails',
            query: {
              workNumber: row.vatTaxNumber,
              serviceId: row.id,
              servicesId: row.id,
              countryCode: row.countryCode,
              companyNameZh: row.companyName,
              status: row.progressBar,
              countryNameZh: row.countryNameZh,
            },
          });
        } else {
          // 没有申报区间的 跳转到注册详情
          this.$router.push({
            path: '/registerInfo',
            query: {
              servicesId: row.id,
              companyNameZh: row.companyName,
              status: row.progressBar,
              countryCode: row.countryCode,
              supplierId: row.supplierId,
              supplierId: row.supplierId,
              countryNameZh: row.countryNameZh,
              hyFlag: row.hyFlag ? row.hyFlag : '',
            },
          });
        }
        return;
      }
      if (
        (row.productFunctionCode == 2 || row.productFunctionCode == 5 || row.productFunctionCode == 23) &&
        row.progressBar > 8 &&
        row.progressBar != 28 &&
        row.progressBar != 29 &&
        row.progressBar != 31 &&
        row.progressBar != 32 &&
        row.progressBar != 38
      ) {
        // this.showTaxDetails = true;
        this.$router.push({
          path: '/taxDetails',
          query: {
            workNumber: row.vatTaxNumber,
            serviceId: row.id,
            servicesId: row.id,
            countryCode: row.countryCode,
            supplierId: row.supplierId,
            companyNameZh: row.companyName,
            status: row.progressBar,
          },
        });
      } else if (
        row.productFunctionCode == 1 ||
        row.productFunctionCode == 5 ||
        (row.productFunctionCode == 23 && (row.progressBar != 25 || row.progressBar != 27))
      ) {
        this.$router.push({
          path: '/registerInfo',
          query: {
            servicesId: row.id,
            companyNameZh: row.companyName,
            status: row.progressBar,
            countryCode: row.countryCode,
            supplierId: row.supplierId,
            countryNameZh: row.countryNameZh,
            hyFlag: row.hyFlag ? row.hyFlag : '',
          },
        });
      } else if (row.productFunctionCode == 2 && ['NODE0015', 'NODE0019', 'NODE0016'].includes(row.cureentNodeCode)) {
        this.$router.push({
          path: '/turnToAgent',
          query: {
            serviceId: row.serviceId,
            productId: row.productId,
            companyNameZh: row.companyNameZh, //
            status: row.cureentNodeCode,
            // supplierId: row.supplierId,
            countryCode: row.countryCode,
            countryNameZh: row.countryNameZh,
            cureentNodeCode: row.cureentNodeCode,
          },
        });
      } else if (row.productFunctionCode == 6) {
        this.$router.push({
          path: '/cancelTaxNum',
          query: {
            servicesId: row.id,
            companyNameZh: row.companyName,
            status: row.progressBar,
            countryCode: row.countryCode,
          },
        });
      }
    },
    // 开始报税弹窗
    getModelStartState(obj) {
      this.modalStart = obj.state;
      if (obj.refresh) {
        this.getOrderServicesList(1);
      }
    },
    getModelPayState(obj) {
      this.modalPay = obj.state;
      if (obj.refresh) {
        this.getOrderServicesList(1);
      }
    },
    getModelBuyState(obj) {
      this.modalBuyd = obj.state;
      if (obj.refresh) {
        this.getOrderServicesList(1);
      }
    },
    changeSendStateFR() {
      this.FRsendFile = false;
      this.getOrderServicesList();
    },
    getModelBuyInfoState(obj) {
      this.modalBuyInfo = obj.state;
    },
    getShowDeclareEntryState(obj) {
      this.showDeclareEntry = obj;
    },
    //屏幕高度
    getHeight() {
      // debugger;
      this.contentStyleObj.height = window.screen.height + 'px';
    },

    getProductInfo(countryCode, functionCode, productId, serviceId) {
      const self = this;
      productInfo({ productType: 1 }).then((res) => {
        if (res.code === 0) {
          let list = [];
          if (functionCode == 5) {
            list = res.data.filter((item) => {
              return item.functionCode == 2 && item.countryCode == countryCode;
            });
          } else {
            list = res.data.filter((item) => {
              return item.id === productId;
            });
          }
          if (list.length > 0) {
            this.$router.push({
              path: '/sureOrder',
              query: {
                from: 'list',
                type: 'renew',
                id: list[0].id,
                count: 1,
                serviceId: serviceId,
              },
            });
            window.localStorage.setItem('productInfo', JSON.stringify(list));
          }
        }
      });
    },
    toHagueRegister(s, row) {
      this.$router.push({
        path: '/hagueInformation',
        query: {
          status: s,
          serviceId: row.serviceId,
          serviceNo: row.serviceNo,
          productFunctionCode: row.productFunctionCode,
          supplierId: row.supplierId,
        },
      });
    },
    /**
     * 完成退税
     */
    handleFinishRefund(row) {
      this.$Modal.confirm({
        title: '退税完成提醒',
        content: '确定要编辑退税完成吗？',
        onOk: () => {
          finishRefund({ serviceId: row.serviceId }).then((res) => {
            if (res.code == 0) {
              this.$Message.success('退税完成');
              this.getTaxManageList();
            } else {
              this.$Message.success('退税出现异常，请重新尝试');
            }
          });
        },
      });
    },

    // 不同报税状态对应不同的操作
    toRegister(status, row) {
      let self = this;
      this.serviceInfo = row;
      this.status = status;
      // 续费
      if (status === 2 || status === -1 || status == 9) {
        this.getProductInfo(row.countryCode, row.productFunctionCode, row.productId, row.id);
        return;
      }
      //西班牙跳转到发送文件 老服务商
      if ((status === 5 || status === 36) && row.countryCode == 'ES' && row.supplierId == '43') {
        self.$router.push({
          path: '/sendFileES',
          query: {
            servicesId: row.id,
            productFunctionCode: row.productFunctionCode,
            supplierId: row.supplierId,
            logisticsProviders: row.logisticsProviders,
            sendTime: row.sendTime,
            trackingNo: row.trackingNo,
          },
        });
        return;
      }
      //西班牙跳转到发送文件 新服务商
      if (
        (status === 5 || status === 36) &&
        row.countryCode == 'ES' &&
        (row.supplierId == '44' || row.supplierId == '87')
      ) {
        // 注释 以后或许更改

        this.$router.push({
          path: '/sendFileES',
          query: {
            servicesId: row.id,
            productFunctionCode: row.productFunctionCode,
            supplierId: row.supplierId,
          },
        });
        return;
      }
      //奥地利 捷克 重新提交申报
      if (status === 24 && (row.countryCode == 'AT' || row.countryCode == 'CZ')) {
        this.$router.push({
          path: '/taxDetails',
          query: {
            workNumber: row.vatTaxNumber,
            serviceId: row.id,
            servicesId: row.id,
            countryCode: row.countryCode,
            companyNameZh: row.companyName,
            status: row.progressBar,
            countryNameZh: row.countryNameZh,
          },
        });
        return;
      }
      // supplierId
      //法国、意大利 沙特 阿联酋 荷兰上传授权书
      if (
        (status === 7 || status === 36 || status === 38) &&
        (row.countryCode == 'FR' ||
          row.countryCode == 'IT' ||
          row.countryCode == 'SA' ||
          row.countryCode == 'AE' ||
          row.countryCode == 'NL')
      ) {
        this.sendServiceId = row.id;
        if (status == 7) {
          this.sendType = 1;
        } else if (status == 38 || status === 36) {
          this.sendType = 2;
        }
        // this.FRsendFile = true
        this.$router.push({
          path: '/authorizedRegistration',
          query: {
            countryCode: row.countryCode,
            serviceId: row.id,
            productFunctionCode: row.productFunctionCode,
            countryNameZh: row.countryNameZh,
            supplierId: row.supplierId,
          },
        });
        return;
      }
      //开始报税或修改
      if (status == 19 || status == 20) {
        self.modalStart = true;
      }
      //待缴纳税金
      if (status == 22 || status == 34 || status == 35) {
        self.workId = row.vatTaxNumber;
        self.orderId = row.id;
        self.countryCode = row.countryCode;
        if (row.countryCode === 'GB') {
          // self.showTaxDetails = true;
          this.$router.push({
            path: '/taxDetails',
            query: {
              workNumber: row.vatTaxNumber,
              serviceId: row.id,
              servicesId: row.id,
              countryCode: row.countryCode,
              companyNameZh: row.companyName,
              status: row.progressBar,
              countryNameZh: row.countryNameZh,
            },
          });
        } else {
          self.modalPay = true;
        }
        return;
      }
      //跳转到转代理上传资料页面
      // if (status == 28 || status == 32) {
      if (status == 'NODE0015') {
        this.$router.push({
          path: '/turnToAgent',
          query: {
            serviceId: row.serviceId,
            id: row.id,

            countryCode: row.countryCode,
            countryNameZh: row.countryNameZh,
            serviceNo: row.serviceNo,
            cureentNodeCode: row.cureentNodeCode,
          },
        });
      }
      //注销税号上传资料
      if (status == 51 || status == 55 || status == 56) {
        this.$router.push({
          path: '/cancelTaxNum',
          query: {
            servicesId: row.id,
            companyNameZh: row.companyName,
            status: row.progressBar,
            countryCode: row.countryCode,
          },
        });
      }
      if (status == 'orderList' || status == 'computedTax' || status == 'serviceList') {
        self.$router.push({
          path: status,
        });
        this.$store.commit('saveMenuName', '/' + status);
        let worMenukList = ['computedTax'];
        let userMenuList = ['user', 'orderList', 'coupon', 'myInvite'];
        let carList = ['serviceList'];
        var menuType = [];
        if (worMenukList.includes(status)) {
          menuType = ['2'];
        } else if (userMenuList.includes(status)) {
          menuType = ['3'];
        } else if (carList.includes(status)) {
          menuType = ['4'];
        } else {
          menuType = [];
        }
        this.$store.commit('activeOpen', menuType);
        sessionStorage.setItem('activeOpen', JSON.stringify(menuType));
      }
      if (row) {
        // 税务稽查
        if (row.productFunctionCode === 7) {
          self.$router.push({
            path: '/taxInspection',
            query: {
              servicesId: row.id,
              countryNameZh: row.countryNameZh,
              countryCode: row.countryCode,
            },
          });
          return;
        }
        if (
          (row.progressBar === 4 || row.progressBar === 21) &&
          (row.productFunctionCode === 2 || row.productFunctionCode === 5) &&
          row.status === 1 &&
          row.countryCode === 'GB'
        ) {
          this.showDeclareEntry = true;
          return;
        }
        //待提交申报，跳去提交申报数据页面
        if (status === 21) {
          self.workId = row.vatTaxNumber;
          self.orderId = row.id;
          self.countryCode = row.countryCode;
          // self.showTaxDetails = true;
          this.$router.push({
            path: '/taxDetails',
            query: {
              workNumber: row.vatTaxNumber,
              serviceId: row.id,
              servicesId: row.id,
              countryCode: row.countryCode,
              supplierId: row.supplierId,
              companyNameZh: row.companyName,
              status: row.progressBar,
              countryNameZh: row.countryNameZh,
            },
          });
          return;
        }
        if (row.productFunctionCode == 1 || row.productFunctionCode == 5 || row.productFunctionCode == 23) {
          self.$router.push({
            path: '/registerInfo',
            query: {
              serviceId: row.serviceId,
              id: row.id,

              countryCode: row.countryCode,

              hyFlag: row.hyFlag ? row.hyFlag : '',
              productFunctionCode: row.productFunctionCode,
            },
          });
        }
      }
    },
    getModelBuyTaxState(obj) {
      this.modalBuyt = obj.state;
    },
    getTaxModelBuyTax(obj) {
      if (obj.type == 'GB') {
        this.showGbTaxDetails = false;
      }
      this.showTaxDetails = obj.state;
    },
    getRegTaxModelBuyTax(obj) {
      this.showRegTax = obj;
    },
    registerChangePageHandler(page) {
      this.taxForm.page = page;
      this.getTaxManageList();
    },
    registerPageSizeChangeHandler(pageSize) {
      this.taxForm.limit = pageSize;
      this.getOrderServicesList();
    },
    handleReset(name) {
      (this.taxForm = {
        limit: 8,
        page: 1,
        countryCode: '',
        functionCode: '',
        likeName: '',
      }),
        this.$refs[name].resetFields();
    },
    //获取国家
    getCountry() {
      baseInfo().then((res) => {
        if (res.code === 0) {
          this.countryList = res.data;
        }
      });
    },
    searchBtn() {
      this.getTaxManageList(1);
      this.statisticsfun();
    },
    // 分页获取未使用服务列表
    getUnusedOrderServicesList() {
      let data = { ...this.taxForm };
      unusedOrderServices(data).then((res) => {
        if (res.code === 0) {
          this.unusedOrderServicesList = res.data.records;
          this.unusedOrderServicesListTotal = res.data.total;
          this.unusedOrderServicesListNew = res.data.records.slice(0, 1);
        }
      });
    },
    // 分页获取公司使用中服务列表
    getOrderServicesList(page) {
      if (page) {
        this.taxForm.page = page;
      }
    },
    // 客户端资讯列表
    getBulletinsHomeList() {
      bulletinsHomeList({
        limit: 8,
        page: 1,
        bulletinType: 8,
      }).then((res) => {
        if (res.code === 0) {
          this.bulletinsList = res.data.records;
        }
      });
    },
    //客户端banner
    getAdvertise() {
      advertise({
        advertiseType: 9,
      }).then((res) => {
        if (res.code === 0) {
          this.advertiseList = res.data;
        }
      });
    },
    //获取列表数据
    getTaxManageList(page) {
      this.tableLoading = true;
      if (page) {
        this.taxForm.page = page;
      }
      taxManageList(this.taxForm).then((res) => {
        if (res.code === 0) {
          this.registerList = res.data.records;
          this.registerListTotal = Number(res.data.total);
          this.tableLoading = false;
        }
      });
    },
    // 统计
    statisticsfun() {
      let data = {
        countryCode: this.taxForm.countryCode,
        functionCode: this.taxForm.functionCode,
        likeName: this.taxForm.likeName,
      };
      orderStatistic(this.taxForm).then((res) => {
        if (res.code === 0 && JSON.stringify(res.data) != '{}') {
          this.taxListStatics = res.data;
        }
      });
    },
    //根据状态查询
    handClick() {
      if (this.activeName == '-1') {
        this.taxForm.tabNodeCode = '';
      } else {
        this.taxForm.tabNodeCode = this.activeName;
      }
      this.getTaxManageList();
    },
    changeStatus(tabNodeCode, type, status) {
      this.statusIndex = type;
      if (type == 'undefined') {
        this.taxForm.tabNodeCode = '';
      } else {
        this.taxForm.tabNodeCode = tabNodeCode;
      }

      this.getTaxManageList(1);
    },
    copyLink() {
      let _this = this;
      let clipboard = new this.clipboard('.cobyOrderSn');
      clipboard.on('success', function (e) {
        _this.$Message.success('复制成功');
      });
      clipboard.on('error', function () {
        _this.$Message.info('复制失败');
      });
      setTimeout(() => {
        clipboard.destroy();
      }, 1000);
    },
    getUserService() {
      personalCenterIndex().then((res) => {
        console.log(res.data);
        //神策关联用户
        console.log('personalCenterIndex -> mobile: ', res.data.userMobile);
        this.$sensors.login(res.data.userMobile, () => {
          this.$sensors.quick('autoTrack');
        });

        if (res.code === 0) {
          let host = '',
            url = window.location.href;
          let regex = /.*\:\/\/([^\/]*).*/;
          let match = url.match(regex);
          host = match[1];
          this.shareLink = this.shareUrl + '?invitedCode=' + res.data.invitedCode;
        }
      });
    },
    closeBtn() {
      this.suspendAdvertisement = false;
      localStorage.setItem('suspendAdvertisement', false);
    },
    // 授权回调
    authorizedCallBack() {
      var that = this;
      if (window.location.search.indexOf('state') > 0 && window.location.search.indexOf('code') > 0) {
        var code = this.getQueryVariable('code');
        var state = this.getQueryVariable('state');
        authorizeCallback({
          code: code,
          state: state,
          location: 0,
        })
          .then((res) => {
            if (res.code === 0) {
              that.getOrderServicesList();
            }
          })
          .catch((error) => {
            console.log(error);
          });
        var url = window.location.href;
        url = url.split('?')[0];
        window.history.pushState({}, 0, url);
      }
    },
    needVatObligations(row) {
      row.from = 'fromRedBtn';
      this.$store.commit('getDeclareInfo', row);
      this.$router.push({ path: '/filingData?index=0' });
    },
    // 提交申报数据
    filingData(row, type = 1) {
      var that = this;
      if (type === 2) {
        var countryCode = row.countryCode;
        var serviceId = row.orderServicesId;
      } else {
        var countryCode = row.countryCode;
        var serviceId = row.id;
      }
      var vatTaxNumber = row.vatTaxNumber;
      var companyName = row.companyName || row.companyNameZh;
      retrievalVAT({
        serviceId: serviceId,
        vatTaxNumber: row.vatTaxNumber,
      })
        .then((res) => {
          if (res.code === 0) {
            this.$router.push({
              path: '/taxDetails',
              query: {
                workNumber: row.vatTaxNumber,
                serviceId: row.id,
                servicesId: row.id,
                countryCode: row.countryCode,
                supplierId: row.supplierId,
                companyNameZh: row.companyName,
                status: row.progressBar,
                countryNameZh: row.countryNameZh,
              },
            });
            that.countryCode = row.countryCode;
            that.orderId = row.id;
          }
        })
        .catch((error) => {
          this.$router.push({
            path: '/taxDetails',
            query: {
              workNumber: row.vatTaxNumber,
              serviceId: row.id,
              servicesId: row.id,
              countryCode: row.countryCode,
              companyNameZh: row.companyName,
              supplierId: row.supplierId,
              status: row.progressBar,
              countryNameZh: row.countryNameZh,
            },
          });
          that.countryCode = row.countryCode;
          that.orderId = row.id;
        });
    }, // 授权报税
    authorization(row) {
      var that = this;
      var vatTaxNumber = row.vatTaxNumber;
      isAuthorized({
        vatTaxNumber: vatTaxNumber,
        // serviceId: row.id,
        workOrderId: row.workId,
      })
        .then((res) => {
          // console.log(res);
          if (res.code == 0) {
            that.filingData(row);
          } else {
            that.$Message.error('您还没授权，请联系客服进行授权');
            // that.taxBureauGetWayFun(row)
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {});
    },
    // 税局getway授权
    taxBureauGetWayFun(row) {
      taxBureauGetWay({
        vatTaxNumber: row.vatTaxNumber,
        serviceId: row.id,
        location: 0,
      })
        .then((res) => {
          localStorage.setItem('allowAuthorized', Boolean(true));
          window.location.href = res.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 获取Url参数
    getQueryVariable(variable) {
      var query = window.location.search.substring(1);
      var vars = query.split('&');
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (pair[0] == variable) {
          return decodeURIComponent(pair[1]);
        }
      }
      return false;
    },

    uploadTaxBill(row) {
      forms({
        servicesId: row.id,
      }).then((res) => {
        if (res.code === 0) {
          if (res.data.split(';').length > 1) {
            this.declareReceiptList = res.data.split(';');
            for (let i = 0; i < this.declareReceiptList.length; i++) {
              if (this.declareReceiptList[i].slice(0, 5) == 'http:') {
                this.declareReceiptList[i] =
                  this.declareReceiptList[i].slice(0, 4) + 's' + this.declareReceiptList[i].slice(4);
              }
            }
            this.showDeclareReceipt = true;
          } else if (res.data.split(';').length == 1) {
            let url = res.data;
            if (url.slice(0, 5) == 'http:') url = url.slice(0, 4) + 's' + url.slice(4);
            window.open(url);
          } else {
            this.$Modal.info({
              title: '暂无回执',
              content: '由于税局系统报税较多，下发回执会稍有延迟， 请耐心等待...',
            });
          }
        }
      });
    },
    //下载税金确认单
    downLoadShuijin(row) {
      if (row.countryCode == 'ES' && row.supplierId == '43') {
        this.$Modal.confirm({
          title: '温馨提示',
          content:
            '支付税金一定要按照税金单的银行信息来支付（如果您是之前已经申报过的客户，因银行账户更改，请您按照现在最新的税金单上的银行信息支付）',
          onOk: () => {
            getTaxBill({ servicesId: row.id }).then((res) => {
              if (res.code == 0) {
                let url = res.data;
                if (url.slice(0, 5) == 'http:') {
                  url = url.slice(0, 4) + 's' + url.slice(4);
                }
                window.open(url);
              }
            });
          },
        });
      } else {
        getTaxBill({ servicesId: row.id }).then((res) => {
          if (res.code == 0) {
            let url = res.data;
            if (url.slice(0, 5) == 'http:') {
              url = url.slice(0, 4) + 's' + url.slice(4);
            }
            window.open(url);
          }
        });
      }
    },
    // 下载授权模板
    uploadAuthorizationTep(row) {
      let formData = new FormData();
      formData.append('servicesId', row.id);
      // 获取时间戳
      let timestamp = new Date().getTime();
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest();
      xmlResquest.open('post', this.baseUrl + '/etax/derive/client/download/authorization', true);
      // 设置请求token
      xmlResquest.setRequestHeader('token', localStorage.getItem('token'));
      xmlResquest.setRequestHeader('sessionId', localStorage.getItem('sessionId'));
      xmlResquest.responseType = 'blob';
      // 返回
      xmlResquest.onload = function (oEvent) {
        let content = xmlResquest.response;
        let fileName = '';
        if (xmlResquest.getResponseHeader('content-disposition')) {
          fileName = decodeURI(xmlResquest.getResponseHeader('content-disposition').split(';')[1].split('=')[1]);
        } else {
          self.$Message.warning('下载出错！');
          return;
        }
        // 组装a标签
        let elink = document.createElement('a');
        // 设置下载文件名
        elink.download = fileName;
        elink.style.display = 'none';

        let blob = new Blob([content]);
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
      };
      xmlResquest.send(formData);
    },
    //备注
    remarkFun() {
      let data = {
        serviceId: this.formEditor.serviceId,
        remarkRecordsClient: this.formEditor.remarkRecordsClient,
      };
      remarkEditAPI(data).then((res) => {
        if (res.code == 0) {
          this.getTaxManageList();
        }
      });
    },
    tabChaneg(n) {
      this.tabIndex = n;
      this.taxForm.page = 1;
      if (n === 2) {
        this.getRenewalServicesList();
      } else {
        this.getOrderServicesList();
      }
    },
    getRenewalServicesList() {
      let dataRenewal = { ...this.taxForm, status: 2 };
    },
    //税务问题他
    goTaxProblems(index) {
      this.$router.push({ path: '/taxProblems', query: { index: index } });
    },
    // 新手指引 不在提示
    remindFun(val) {
      window.localStorage.setItem('showGuide', JSON.stringify(!val));
    },
    // 新手指引 关闭
    close() {
      this.showGuide = false;
      sessionStorage.setItem('showGuideFromLogin', JSON.stringify(false));
      location.reload();
    },
    // 新手指引 下一步
    nextStep(n) {
      this.guiteStep = n;
    },
  },
};
</script>

<style lang="less" scoped>
.statusStyle {
  width: 80px;
  margin-right: 10px;
  text-align: center;
  height: 30px;
  line-height: 30px;
  border-radius: 5px !important;
}
/deep/ .ivu-icon {
  font-size: 17px;
  font-weight: bold;
}
/deep/ .ivu-table-tip {
  overflow-x: auto;
}
/deep/ .ivu-tooltip-rel {
  max-width: 106px;

  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  // -webkit-box-orient: vertical;
}
/deep/ .ivu-modal-body {
  padding: 0 !important;
}
.mingxi-modal {
  height: 600px;
  overflow: auto;
  // margin-top: 24px;
  padding: 24px;
}
.mingxi-content {
  background: rgba(22, 173, 233, 0.1);
  padding: 0 24px;

  p {
    padding-top: 12px;
  }
  .time {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #333333;
  }
  .price {
    font-size: 12px;
    font-family: PingFangSC;
    color: #666666;
    span {
      margin-right: 32px;
    }
  }
}
.mingxi-title {
  // padding-left: 24px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 16px;
  .title-content {
    margin-bottom: 18px;
    .title-left {
      font-size: 14px;
      font-family: PingFangSC;
      color: #666666;
    }
    .title-right {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333333;
      margin-right: 55px;
    }
  }
  .title-head {
    margin-bottom: 16px;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #333333;
  }
}
.container {
  .shenbao {
    background-color: #fff;
    margin-top: 24px;
    .shenbao-content {
      padding: 24px;
      /deep/ .ivu-form-item {
        margin-right: 32px;
        margin-bottom: 0;
      }
      .shenbao-table {
        &/deep/ td .ivu-table-cell {
          font-size: 14px;
          text-align: center;
          padding-top: 5px;
        }
      }
      /deep/ .ivu-table-cell {
        text-overflow: unset;
        white-space: nowrap;
      }
    }
    .shenbao-title {
      padding: 14px 24px;
      border-bottom: 1px solid #f6f6f6;
      display: flex;
      justify-content: space-between;
      .left {
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.85);
      }
      .right {
        span {
          font-size: 13px;
          font-family: PingFangSC;
          color: #666666;
        }
        .active {
          color: #1890ff;
        }
      }
    }
  }

  box-sizing: border-box;
  padding: 0px 20px 15px 20px;

  margin-bottom: 7px;
  border-radius: 2px;
  & .title {
    color: #212121;
    font-size: 18px;
    font-weight: bold;
    line-height: 56px;
  }
  & .line {
    border: 1px solid #f5f5f5;
    margin-bottom: 16px;
  }
  & .info {
    background: #ffffff;
    margin-bottom: 24px;
    padding: 24px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .item {
      width: 32%;
      img {
        text-align: center;
        width: 100%;
        cursor: pointer;
      }
    }
  }
  .infoTb {
    width: 100%;
    min-width: 860px;
    background-color: #fff;
    // width: calc(100vw - 450px);
    border-radius: 6px;
    .tabs-box {
      border-bottom: 1px solid #f6f6f6;
      padding-left: 24px;
      display: flex;
      div {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #333;
        margin-right: 42px;
        padding-bottom: 6px;
        cursor: pointer;
        &.active {
          color: #1890ff;
          border-bottom: 2px solid #1890ff;
        }
        .huibiao {
          display: inline-block;
          background-color: #ff5050;
          color: #fff;
          font-size: 12px;
          font-weight: 500;
          text-align: center;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
          // width: 16px;
          padding: 0 5px;
          margin-left: 2px;
        }
      }
    }
    .title_wait {
      margin: 0px 0 11px 0;

      .tax_title {
        color: #333333;
        font-weight: bold;
        font-size: 18px;
        line-height: 60px;
        padding-left: 24px;
        border-bottom: 1px solid #f6f6f6;
        margin-bottom: 20px;
      }
      .tax_content {
        padding: 0px 24px;
        margin-bottom: 32px;
      }
      /deep/ .ivu-form-item {
        margin-bottom: 0px;
        margin-right: 31px;
        .ivu-form-item-label {
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #666666;
        }
      }
      /deep/ .ivu-select-selection,
      .ivu-input {
        border-radius: 5px;
      }
      /deep/ .ivu-input {
        border-radius: 5px;
      }
    }
  }
  //TabsNav 样式
  & /deep/ .ivu-tabs-bar {
    margin: 0px;
  }
  & /deep/ .ivu-tabs-nav-container:focus .ivu-tabs-tab-focused {
    border-color: #e6e6e6 !important;
  }
  & .ivu-tabs /deep/ .ivu-tabs-bar {
    border-color: #f2f2f2;
  }

  & .ivu-tabs /deep/ .ivu-tabs-bar .ivu-tabs-tab:nth-child(2n-1) {
    border-top-left-radius: 0px;
  }
  & /deep/ .ivu-tabs-nav-container:focus .ivu-tabs-tab-focused:nth-child(2n-1),
  & .ivu-tabs /deep/ .ivu-tabs-bar .ivu-tabs-tab-focused:nth-child(2n-1),
  & .ivu-tabs /deep/ .ivu-tabs-bar .ivu-tabs-tab-active:nth-child(2n-1) {
    border-left-color: #fff !important;
    font-weight: 400;
  }
  //表格样式
  &/deep/.ivu-table:before {
    background-color: #f2f2f200;
  }
  &/deep/.ivu-table:after {
    background-color: #f2f2f2;
  }
  & .ivu-tabs /deep/ .ivu-table-wrapper {
    margin-bottom: 11px;
    border-color: #f2f2f2;
  }

  & .ivu-tabs /deep/ .ivu-table-wrapper tr td {
    color: #16ade9;
    font-size: 12px;
  }
  & /deep/ .ivu-table-tip tr {
    height: 144px;
  }
  .pageSetion {
    text-align: right;
    margin-top: 36px;
    padding-bottom: 36px;
    margin-right: 24px;
    .pagination {
      display: inline-block;
      line-height: 20px;
    }
    .totalNum {
      font-size: 14px;
      color: #9a9ca1;
    }
    &/deep/.ivu-page-simple .ivu-page-simple-pager input {
      padding: 0;
      margin: 0;
    }
    &/deep/.ivu-page-simple-pager {
      margin-right: 0;
    }
  }
}
.container {
  &/deep/.ivu-tabs .ivu-table-wrapper .ivu-table-tip tr td {
    color: #9a9ca1;
  }
  .tbNull {
    margin: 16px 23px 32px 24px;
    .prompt {
      width: 100%;
      height: 40px;
      background: #d7eefa;
      margin-top: 14px;
      padding: 0px 24px;
      img {
        margin-right: 4px;
      }
      span:nth-child(2) {
        font-size: 14px;
        font-family: 'Microsoft Yahei', PingFangSC;
        color: #333333;
        line-height: 26px;
      }
      span:nth-child(3) {
        font-size: 12px;
        font-family: 'Microsoft Yahei', PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #1890ff;
        line-height: 17px;
        img {
          margin-top: 2px;
          float: right;
        }
      }
    }
    .unUsedContainer {
      padding: 0px 24px 16px;
      position: relative;
      .more {
        text-align: center;
        padding: 6px;
        a {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
    .unUsed {
      padding: 16px 0px;
      .unUsedTitle {
        span:nth-child(1) {
          font-size: 16px;
          font-family: 'Microsoft Yahei', PingFangSC-Medium, Microsoft YaHe, PingFang SC sans-serif;
          font-weight: 500;
          color: #333333;
          line-height: 22px;
        }
        span:nth-child(2) {
          font-size: 14px;
          font-family: 'Microsoft Yahei', PingFangSC;
          color: #e38207;
          line-height: 20px;
        }
        span:nth-child(3) {
          font-size: 12px;
          font-family: 'Microsoft Yahei', PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #1890ff;
          line-height: 17px;
          img {
            margin-top: 2px;
            float: right;
          }
        }
      }
    }

    &/deep/ td .ivu-table-cell {
      font-size: 12px;
      color: #333333;
      padding-top: 5px;
      .grey {
        color: #999999;
      }
      .red {
        color: #16ade9;
      }
      .blue {
        color: #16ade9;
      }
      .yellow {
        color: #f79728;
      }
      .orange {
        color: #fc9153;
      }
      .green {
        color: #5ab187;
      }
    }
    .operate {
      cursor: pointer;
      text-align: center;
      font-weight: 500;

      padding-top: 2px;

      img {
        width: 11px;

        margin-bottom: 2px;
      }

      &/deep/ .ivu-btn-text {
        width: 63px;
        color: #16ade9;
        font-size: 12px;
        padding: 0 5px;
        text-align: left;
        background: #fff;
        border-color: #16ade9;
        margin-right: 10px;
        display: inline-block;
        margin-bottom: 10px;
        span {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        img {
          width: 18px;
          // height: 18px;
        }
      }
      .btF {
        min-width: 124px;
      }
      .btF.flex-center {
        // display: inline-block;
        min-width: 124px;
        // background: #ffffff;
        color: #f79728;
        border-color: #f79728;
        img {
          width: 18px;
          // height: 18px;
        }
      }
      .red-button {
        color: #ed3e3e;
        border-color: #ed3e3e;
      }
      .upload-btn {
        // margin-right: 10px;
        // border-color: #16ade9;
        // color: #16ade9;
        // background-color: #fff;
        img {
          width: 18px;
          // height: 18px;
        }
      }
      .btR {
        min-width: 124px;
        background: #ed3e3e;
      }
    }
    &/deep/ .ivu-table {
      color: #333333;
      font-size: 12px;
      .ivu-table-row {
        background-color: #fff;
      }
      td,
      th {
        border-bottom: 1px solid #e6e6e6;
        // padding: 16px 0;
        text-align: center;
        border-right: none;
        background-color: #fff;
      }
      th {
        color: #333;
        font-weight: 600;
        background: #d0effb;
      }
    }
    &/deep/ .ivu-table-header {
      .ivu-table-cell {
        & > div div:nth-child(1) {
          font-weight: bold;
          font-size: 12px;
        }
        & > div div:nth-child(2) {
          // font-weight: bold;
          font-size: 10px;
        }
      }
    }
    .statusBtnContent {
      button {
        background: #16ade9;
        box-shadow: 0px 2px 6px 0px rgba(9, 80, 228, 0.12);
        border-radius: 100px;
        color: #ffffff;
      }
    }
  }
  .serviceList {
    margin-top: 12px;
    background: #ffffff;
    /deep/ .ivu-tabs-tab {
      background: #ffffff !important;
    }

    /deep/ .ivu-tabs-tabpane {
      padding: 0px 24px;
    }
    /deep/ .ivu-tabs-ink-bar {
      width: 48px !important;
    }
    .companyName {
      padding: 16px 0px;
      img {
        width: 16px;
        height: 16px;
        float: left;
        margin-right: 4px;
        margin-top: 2px;
      }
      span:nth-child(2) {
        font-size: 14px;
        font-family: PingFangSC-Medium, Microsoft YaHe, PingFang SC sans-serif;
        font-weight: 500;
        color: #333333;
        line-height: 20px;
      }
      span:nth-child(3) {
        font-size: 14px;
        font-family: 'Microsoft Yahei', PingFangSC;
        color: #666666;
        line-height: 20px;
      }
    }
    .statusBtnContent {
      button {
        background: #16ade9;
        box-shadow: 0px 2px 6px 0px rgba(9, 80, 228, 0.12);
        border-radius: 100px;
        color: #ffffff;
        margin-left: 10px;
      }
    }
    /deep/ .flex-column {
      align-items: flex-end;
    }
    .tabsContainer {
      .tabTitle {
        border-bottom: 1px solid #e9e9e9ff;
        padding: 0px 24px;
        span {
          display: inline-block;
          font-size: 16px;
          font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
          color: #333333;
          line-height: 35px;
          margin-right: 46px;
          cursor: pointer;
        }
        .active-tab {
          color: #1890ffff;
          border-bottom: 2px solid #1890ffff;
          font-family: 'Microsoft Yahei', PingFangSC-Medium, Microsoft YaHe, PingFang SC sans-serif;
          font-weight: 500;
        }
      }
      .tabContent {
        padding: 0px 24px;
        .myVATFilter {
          margin-top: 16px;
          width: 100%;
          display: flex;
          /deep/ .ivu-form-item {
            margin: 0px;
          }
          .searchBtn,
          .resetBtn {
            margin-top: 0px;
          }
        }
      }
    }
  }
  .noLogin {
    position: absolute;
    top: 50%;
    left: 50%;
    .blue {
      color: #68a8f0;
      cursor: pointer;
    }
  }
  .activity-box,
  .activity-rule {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 999;
  }
  .invite-banner {
    cursor: pointer;
    width: 100%;
    height: 100%;
    position: relative;
    .inviteBox {
      position: absolute;
      left: 50%;
      margin-left: -370px;
      .bg {
        width: 100%;
        height: auto;
      }
      .btn {
        width: 143px;
        height: 29px;
        position: absolute;
        bottom: 13px;
        left: 50%;
        transform: translateX(-50%);
        background: url(../../../assets/images/survey/inviteBtn.png) no-repeat;
        background-size: contain;
        text-align: center;
        color: #ed3e3e;
        font-size: 14px;
        font-weight: 500;
        line-height: 29px;
      }
    }
    .close {
      z-index: 9999999;
      top: 140px;
      left: 50%;
      position: absolute;
      margin-left: 340px;
    }
  }
}
@media screen and (max-width: 1440px) {
  .container .info .info-item {
    padding-right: 16px;
  }
  .info-img {
    img {
      width: 100%;
    }
  }
  .info-right-wrapper {
    margin-left: 10px;
  }
}
.searchBtn {
  // margin-right: 12px;
  height: 32px;
  background-color: #16ade9;
  border: 1px solid rgba(230, 230, 230, 1);
  color: #ffffff;
  font-size: 12px;
  border-radius: 0px;
  margin-top: 2px;
  margin-left: 10px;
  &/deep/ .ivu-icon {
    font-size: 17px;
    margin-top: 3px;
  }
  &/deep/ span {
    font-size: 12px;
    margin-bottom: 10px;
    float: right;
    margin-top: 6px;
  }
}
.resetBtn {
  font-size: 12px;
  font-family: 'MicrosoftYaHei';
  color: #999999;
  border: none;
  line-height: 12px;
  border: 1px solid #cccccc;
  &/deep/ .ivu-icon {
    font-size: 19px;
    margin-top: 2px;
  }
  &/deep/ span {
    font-size: 12px;
    margin-bottom: 10px;
    float: right;
    margin-top: 9px;
  }
}
.fr &/deep/.ivu-form-item {
  margin-bottom: 0;
}
.invit-title {
  font-size: 20px;
  font-weight: 500;
  color: #303033;
  text-align: center;
  margin-top: 22px;
}
.invit-content {
  margin-left: 20px;
  margin-top: 20px;
  padding-bottom: 30px;
  .invit-input {
    width: 480px;
    display: inline-block;
    height: 40px;
    line-height: 40px;
    padding-left: 14px;
    background-color: #f0f0f0;
  }
  /deep/ .ivu-input {
    height: 40px;
    border-radius: 0;
    padding: 11px 14px;
  }
  .link-btn {
    display: inline-block;
    width: 88px;
    height: 40px;
    color: #fff;
    line-height: 40px;
    text-align: center;
    background-color: #16ade9;
    font-size: 14px;
    cursor: pointer;
  }
  .active-rule {
    width: 568px;
    margin-top: 15px;
    background-color: #faf7f8;
    padding: 18px 10px;
    color: #303033;

    .rule-title {
      font-size: 14px;
      font-size: 500;
      margin-top: 8px;
    }
    .rule-content {
      font-size: 12px;
      line-height: 24px;
    }
  }
}
/deep/ .ivu-table-wrapper,
/deep/ .ivu-table,
/deep/ .ivu-table th {
  overflow: visible;
}

.remarkEditor {
  position: relative;
  bottom: -3px;
  vertical-align: top;

  cursor: pointer;
}

.content {
  display: flex;
  width: 100%;
  .taxProblemsContent {
    margin-left: 24px;
    .bannerContent {
      width: 300px;
      height: 204px;
      background: #ffffff;
      border-radius: 4px;
      margin-bottom: 24px;
      /deep/ .ivu-carousel-item {
        height: 204px !important;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    .taxProblems {
      width: 300px;
      background: #ffffff;
      border-radius: 4px;
      .title {
        font-size: 18px;
        font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        line-height: 24px;
        border-bottom: 1px solid #e9e9e9ff;
        padding: 16px 24px;
      }
      .item {
        font-size: 12px;
        font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #666666;
        line-height: 22px;
        padding: 12px 18px;
        border-bottom: 1px solid #e9e9e9ff;
        cursor: pointer;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .viewMore {
        font-size: 12px;
        font-family: 'Microsoft Yahei', PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #1890ff;
        line-height: 17px;
        padding: 18px 0px;
        text-align: center;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          margin-top: 1px;
          float: right;
        }
      }
    }
    @media screen and (min-width: 1920px) {
      .bannerContent {
        width: 400px;
        height: 244px;
        /deep/ .ivu-carousel-item {
          height: 244px !important;
        }
      }
      .taxProblems {
        width: 400px;
      }
    }
  }
}
.contentGuideActive {
  overflow: hidden;
}
.guideContainer {
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
  .step {
    position: absolute;
    .box {
      width: 246px;
      height: 110px;
      border-radius: 4px;
      border: 1px dashed #ffffff;
      padding: 17px 10px;

      font-size: 18px;
      font-family: 'Microsoft Yahei', PingFangSC;
      color: #ffffff;
      text-align: center;
      /deep/ .ivu-checkbox-inner {
        border: 1px dashed #dcdee2;
        background: none;
      }
      .check {
        margin-top: 5px;
      }
    }
    .btns {
      display: flex;
      margin-top: 12px;
      justify-content: space-around;
      div {
        background: url(../../../assets/images/guide/btn.svg) no-repeat;
        width: 86px;
        height: 35px;
        font-size: 14px;
        font-family: 'Microsoft Yahei', PingFangSC;
        color: #ffffff;
        text-align: center;
        line-height: 31px;
        cursor: pointer;
      }
    }
  }
  .step1 {
    top: 38%;
    left: 35%;
    .star1 {
      position: absolute;
      top: -40px;
      right: -40px;
    }
    .star2 {
      position: absolute;
      left: -40px;
    }
    .jiantou {
      position: absolute;
      top: -76px;
      left: -55px;
    }
  }
  .step2 {
    top: 45%;
    left: 28%;
    .star1 {
      position: absolute;
      top: -12px;
      right: -35px;
    }
    .star2 {
      position: absolute;
      top: 51px;
      left: -31px;
    }
    .jiantou {
      position: absolute;
      top: 26px;
      left: -103px;
    }
  }
  .step3 {
    top: 75%;
    left: 40%;
    .box {
      width: 284px;
    }
    .star1 {
      position: absolute;
      top: -12px;
      right: -35px;
    }
    .star2 {
      position: absolute;
      top: 51px;
      left: -31px;
    }
    .jiantou {
      position: absolute;
      top: 75px;
      left: -107px;
    }
  }
  .step4 {
    top: 32%;
    left: 12%;
    .box {
      width: 354px;
    }
    .star1 {
      position: absolute;
      top: -12px;
      right: -35px;
    }
    .star2 {
      position: absolute;
      top: 82px;
      left: -31px;
    }
    .jiantou {
      position: absolute;
      top: 0px;
      left: -88px;
    }
  }
  @media screen and (min-width: 1920px) {
    .step1 {
      top: 38%;
      left: 25%;
    }
    .step2 {
      top: 45%;
      left: 21%;
    }
    .step3 {
      top: 63%;
      left: 24%;
    }
    .step4 {
      top: 25%;
      left: 9%;
    }
  }
}
.flex-align-center {
  display: flex;
  align-items: center;
}

/deep/ .ivu-radio {
  display: none;
}
.ActiviPop {
  /deep/ .ivu-modal-content {
    display: flex;
    justify-content: center;
    background-color: transparent;
    border-radius: 0;
    box-shadow: 0 0px 0px #ccc;
    .toActivity {
      position: relative;
      cursor: pointer;
      top: -186px;
    }
  }
  .closeBox {
    text-align: center;
    position: absolute;
    top: 100px;
    right: -10px;
    .close {
      cursor: pointer;
    }
  }
}
.ActiIcon {
  position: fixed;
  bottom: 50%;
  transform: translateY(50%);
  right: 20px;
  z-index: 999;
}
</style>
