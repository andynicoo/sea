<template>
  <div class="app-container">
    <BackHerader @back="goback" title="新增抽奖活动"></BackHerader>
    <!-- 表单 -->
    <div class="form-container">
      <el-form label-width="140px" ref="formRef" :model="form" :rules="formRules">
        <FormTitle value="基础设置："></FormTitle>
        <el-form-item label="活动类型：" prop="activityType">
          <el-select placeholder="请选择" style="width: 360px" v-model="form.activityType" :disabled="isEdit" @change="changeActivityType">
            <el-option label="即时抽奖" value="INSTANT_DRAW"></el-option>
            <el-option label="定时抽奖" value="REGULAR_DRAW"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动名称：" prop="name">
          <el-input v-model="form.name" placeholder="请输入活动名称" maxlength="20" clearable style="width: 360px" :disabled="isEdit && form.status != '1'" />
        </el-form-item>
        <el-form-item label="活动时间：" prop="activityTime">
          <el-date-picker
            v-model="form.activityTime"
            type="datetimerange"
            align="right"
            size="small"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 360px"
            :disabled="isEdit && form.status != '1'"
            :picker-options="pickerOptions"
          ></el-date-picker>
          <el-checkbox v-model="form.theLastFlag" style="margin-left: 10px"></el-checkbox>
          <span>不展示倒计时</span>
        </el-form-item>
        <el-form-item label="活动栏目：" prop="displayColumn">
          <el-select placeholder="请选择" style="width: 360px" v-model="form.displayColumn" :disabled="isEdit">
            <el-option label="积分商城抽奖" value="POINTS_MALL"></el-option>
            <el-option label="猜猜猜抽奖" value="GUESS"></el-option>
            <el-option label="日常活动抽奖" value="DAILY_ACTIVITY"></el-option>
            <el-option label="猜灯谜活动" value="GUESS_RIDDLES"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参与抽奖条件：">
          <el-radio-group v-model="form.drawType" :disabled="isEdit">
            <el-radio label="POINTS_DRAW">积分抽奖</el-radio>
            <el-radio label="NUMBER_DRAW" v-if="form.activityType == 'INSTANT_DRAW'">完成任务抽奖</el-radio>
          </el-radio-group>
          <div v-if="form.drawType == 'POINTS_DRAW'">
            <div style="margin-top: 10px">
              <!-- <el-checkbox  v-model="form.everyDayLuckDraw">每人每天可抽奖</el-checkbox> -->
              每次抽奖消耗
              <el-input-number v-model="form.everyTimeConsumePoint" controls-position="right" placeholder="" style="width: 100px; margin: 0 10px" clearable :min="1" :max="99999" :disabled="isEdit" />
              <span>积分</span>
            </div>
          </div>
          <div v-if="form.drawType == 'NUMBER_DRAW'">
            <div v-for="(item, index) in form.luckyDrawZgObtainRuleDtoS" :key="index" style="margin-top: 10px">
              <div v-if="item.type == 'every_day_give' || item.type == 'register'">
                <el-checkbox v-model="isSelect[item.type]" @change="(val) => handleCheckedCitiesChange(val, index, item.type)" :disabled="isEdit">{{ ruleText[item.type].text }}</el-checkbox>
                <el-input-number v-model="item.giveNum" controls-position="right" placeholder="请输入" style="width: 100px; margin: 0 10px" clearable :min="0" :max="9999" :disabled="isEdit || !isSelect[item.type]" />
                <span>次抽奖机会</span>
              </div>
              <div v-if="item.type == 'place_order'">
                <el-checkbox v-model="isSelect[item.type]" @change="(val) => handleCheckedCitiesChange(val, index, item.type)" :disabled="isEdit">{{ ruleText[item.type].text }}</el-checkbox>
                <div>(每支付完成1笔订单，可获得一次)</div>
                <div v-if="isSelect[item.type]">
                  <div>
                    <span>订单最低门槛为</span>
                    <el-input-number v-model="item.miniThreshold" controls-position="right" placeholder="请输入" style="width: 150px; margin: 0 10px" clearable :min="0" :max="1000000" :disabled="isEdit" />
                    <span>元</span>
                  </div>
                  <div>
                    <span>下单获得抽奖机会</span>
                    <el-button type="text" style="margin-left: 10px" @click="dialogVisibleActivityAlert" :disabled="isEdit">{{ item.extendData.activities.length ? '修改' : '选择' }}</el-button>
                  </div>
                  <el-table :data="item.extendData.activities" stripe style="width: 480px" v-if="item.extendData.activities.length">
                    <el-table-column align="center" label="活动名称">
                      <template slot-scope="scope">{{ scope.row.activityName }}</template>
                    </el-table-column>
                    <el-table-column align="center" label="活动类型" width="100">
                      <template slot-scope="scope">{{ typeText[scope.row.type] }}</template>
                    </el-table-column>
                    <el-table-column label="操作" width="120" align="center">
                      <template slot-scope="scope">
                        <el-button type="text" size="small" @click="deleteCouponSelection(scope.$index)" :disabled="isEdit"> 删除 </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>

              <div v-if="item.type == 'guess'">
                <el-checkbox v-model="isSelect[item.type]" @change="(val) => handleCheckedCitiesChange(val, index, item.type)" :disabled="isEdit">{{ ruleText[item.type].text }}</el-checkbox>

                <div>(每答题 1 次，可获得 1 次抽奖机会)</div>

                答题分数最低分为

                <el-input-number v-model="item.miniThreshold" controls-position="right" placeholder="请输入" style="width: 100px; margin: 0 10px" clearable :min="0" :max="999" :disabled="isEdit || !isSelect[item.type]" />
              </div>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="活动展示渠道：">
          <el-checkbox-group v-model="supportPayType" disabled>
            <el-checkbox label="1">小程序</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="活动规则：" prop="activityRule">
          <Editor :value.sync="form.activityRule" style="width: 1000px" :disabled="isEdit" v-if="!isEdit"></Editor>
          <div v-html="form.activityRule" style="word-break: break-all" v-else></div>
        </el-form-item>
        <FormTitle value="奖项设置："></FormTitle>
        <el-form-item label="抽奖奖品：">
          <div style="margin-bottom: 10px">
            需要设置8个奖品，抽中概率总和不能超过1，未中奖类型的抽中概率无需填写，发布后不可修改
            <el-tooltip content="Top center" placement="top" effect="light">
              <div slot="content">
                <div class="tooltip-box">
                  <el-row>
                    <el-col :span="8"><div class="grid-content">1</div></el-col>
                    <el-col :span="8"><div class="grid-content">2</div></el-col>
                    <el-col :span="8"><div class="grid-content">3</div></el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8"><div class="grid-content">4</div></el-col>
                    <el-col :span="8"></el-col>
                    <el-col :span="8"><div class="grid-content">5</div></el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8"><div class="grid-content">6</div></el-col>
                    <el-col :span="8"><div class="grid-content">7</div></el-col>
                    <el-col :span="8"><div class="grid-content">8</div></el-col>
                  </el-row>
                  <div class="tooltip-text">九宫格位置示意图</div>
                </div>
              </div>
              <el-button type="text">奖品位置示例</el-button>
            </el-tooltip>
          </div>
          <el-table border :data="form.luckyDrawPrizeDTOS">
            <el-table-column align="center" width="100px" label="位置">
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="奖品名称">
              <template slot-scope="scope">{{ scope.row.prizeName }}</template>
            </el-table-column>
            <el-table-column align="center" label="奖品图片">
              <template slot-scope="scope">
                <el-image style="width: 48px; height: 33px" :src="scope.row.prizeImg" v-if="scope.row.prizeImg && scope.$index < 7">
                  <div slot="error" class="image-slot"><img src="@/assets/images/infoDetail/default.png" alt="" /></div>
                </el-image>
                <el-image style="width: 48px; height: 33px" :src="scope.row.prizeImg" v-if="scope.$index == 7">
                  <div slot="error" class="image-slot"><img src="@/assets/images/infoDetail/default.png" alt="" /></div>
                </el-image>
              </template>
            </el-table-column>
            <el-table-column align="center" label="奖品类型">
              <template slot-scope="scope">{{ scope.row.prizeType ? prizeType[scope.row.prizeType] : '' }}</template>
            </el-table-column>
            <el-table-column align="center" label="奖品数量">
              <template slot-scope="scope"
                ><div>{{ scope.row.num }}</div></template
              >
            </el-table-column>
            <el-table-column align="center" label="中奖概率">
              <template slot-scope="scope"
                ><div>{{ scope.row.probability }}</div></template
              >
            </el-table-column>
            <el-table-column align="center" label="中奖规则"
              >winningRule
              <template slot-scope="scope">{{ prizeRule[scope.row.winningRule] }}</template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="100px">
              <template slot-scope="scope">
                <el-button type="text" @click="editPrizeBtn(scope.row, scope.$index)">{{ isEdit ? '查看' : '编辑' }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <FormTitle value="抽奖设置："></FormTitle>
        <el-form-item label="抽奖次数：">
          <el-radio-group v-model="form.luckDrawLimit" :disabled="isEdit || form.activityType == 'REGULAR_DRAW'">
            <el-radio :label="1">限制</el-radio>
            <el-radio :label="0">不限制</el-radio>
          </el-radio-group>
          <div v-if="form.luckDrawLimit == 1">
            <div style="margin-top: 10px">
              <!-- <el-checkbox  v-model="form.everyDayLuckDraw">每人总共可抽奖</el-checkbox> -->
              每人总共可抽奖
              <el-input-number v-model="form.totalLuckDraw" controls-position="right" placeholder="" style="width: 100px; margin: 0 10px" clearable :min="0" :max="999" :disabled="isEdit || form.activityType == 'REGULAR_DRAW'" @blur="(e) => luckDraw(e, 'totalLuckDraw')" />
              <span>次</span>
            </div>
            <div style="margin-top: 10px">
              <!-- <el-checkbox  v-model="form.everyDayLuckDraw">每人每天可抽奖</el-checkbox> -->
              每人每天可抽奖
              <el-input-number v-model="form.everyDayLuckDraw" controls-position="right" placeholder="" style="width: 100px; margin: 0 10px" clearable :min="0" :max="999" :disabled="isEdit || form.activityType == 'REGULAR_DRAW'" @blur="(e) => luckDraw(e, 'everyDayLuckDraw')" />
              <span>次</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="中奖次数：">
          <el-radio-group v-model="form.winningLimit" :disabled="isEdit || form.activityType == 'REGULAR_DRAW'">
            <el-radio :label="1">限制</el-radio>
            <el-radio :label="0">不限制</el-radio>
          </el-radio-group>
          <div v-if="form.winningLimit == 1">
            <div style="margin-top: 10px">
              <!-- <el-checkbox  v-model="form.couponSuperpose">每人总共可中奖</el-checkbox> -->
              每人总共可中奖
              <el-input-number v-model="form.totalWinning" controls-position="right" placeholder="" style="width: 100px; margin: 0 10px" clearable :min="0" :max="999" :disabled="isEdit || form.activityType == 'REGULAR_DRAW'" @blur="(e) => luckDraw(e, 'totalWinning')" />
              <span>次</span>
            </div>
            <div style="margin-top: 10px">
              <!-- <el-checkbox  v-model="form.couponSuperpose">每人每天可中奖</el-checkbox> -->
              每人每天可中奖
              <el-input-number v-model="form.everyDayWinning" controls-position="right" placeholder="" style="width: 100px; margin: 0 10px" clearable :min="0" :max="999" :disabled="isEdit || form.activityType == 'REGULAR_DRAW'" @blur="(e) => luckDraw(e, 'everyDayWinning')" />
              <span>次</span>
            </div>
          </div>
        </el-form-item>
        <!-- <el-form-item label="中奖率策略设置：" >
          <el-radio-group  v-model="form.winningRule">
            <el-row>
              <el-col :span="5">
                <el-radio :label="0">按总中奖概率开奖</el-radio>
                <div  class="setting">适合100%必中场景，如：奖项一30%、奖项二70%，奖项一被抽完后，奖项一的概率会被分配给奖项二</div>
              </el-col>
              <el-col :span="5">
                <el-radio :label="1">按单奖项中奖率开奖</el-radio>
                <div class="setting">适合随机中奖场景，如奖项一30%、奖项二70%，累计中奖率100%也存在不中奖，因每个奖项概率独立</div>
              </el-col>
            </el-row>
          </el-radio-group>
        </el-form-item> -->
        <FormTitle value="其他设置："></FormTitle>
        <el-form-item label="背景图片：" prop="backgroundImg">
          <UploadImage ref="uploadImageRef" :imageUrl="form.backgroundImg" :imgType="1" :on-success="(v) => (form.backgroundImg = v.file.fileUrl)" upload-tips="添加图片" :imgMaxSize="3" :accept="'.png, .jpg'" :ruleType="['image/jpeg', 'image/jpg', 'image/png']"></UploadImage>
          <el-button type="text" @click="resetBackgroundImg" :disabled="isEdit && form.status != '1'">恢复默认图</el-button>
          <div class="subTips">建议尺寸：800*800</div>
        </el-form-item>
        <el-form-item label="背景色：" prop="backgroundColour">
          <el-color-picker v-model="form.backgroundColour" :disabled="isEdit && form.status != '1'"></el-color-picker>
          <el-button type="text" @click="resetBackground" :disabled="isEdit && form.status != '1'" style="margin-left: 10px">重置</el-button>
        </el-form-item>
        <el-form-item label="虚拟抽奖次数：">
          <el-input-number v-model="form.fictitiousNum" controls-position="right" placeholder="请输入" style="width: 100px" clearable :min="0" :max="999" :disabled="isEdit && form.status != '1'" />
          <span>次</span>
        </el-form-item>
        <el-form-item label="轮播中奖信息：">
          <el-radio-group v-model="form.winningInfoShow" :disabled="isEdit && form.status != '1'">
            <el-radio :label="1" :disabled="form.activityType == 'REGULAR_DRAW'">显示</el-radio>
            <el-radio :label="0" :disabled="form.activityType == 'REGULAR_DRAW'">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="handleSubmit" :disabled="isEdit && form.status != '1'"> 保存 </el-button>
          <el-button @click="goback()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="编辑奖品" :visible.sync="dialogVisible" width="900" center destroy-on-close>
      <EditPrize @cancleDialog="cancleDialog" @getPrizeData="getPrizeData" :form="prizeData" :couponId="couponId" :probability="probability" :isEdit="isEdit" :originProbability="originProbability" :editPrizeIndex="editPrizeIndex" />
    </el-dialog>
    <el-dialog title="选择活动" :visible.sync="dialogVisibleActivity" width="900" center destroy-on-close>
      <SelectActivity ref="coupon" @getCouponSelection="getCouponSelection" :couponSelectionProp="couponSelection" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleActivity = false">取 消</el-button>
        <el-button type="primary" @click="activitySure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import BackHerader from '@/components/backHerader';
import FormTitle from '@/components/WorkOrderComponents/FormTitle';
import Editor from '@/components/quillEditor/index';
import UploadImage from '@/components/UploadImage/index.vue';
import EditPrize from './editPrizePage/index.vue';
import SelectActivity from './selectActivity/index.vue';
import { drawAdd, getDrawData, drawEdit } from '@/api/newApi/extension/activity.js';
export default {
  components: {
    BackHerader,
    FormTitle,
    Editor,
    EditPrize,
    UploadImage,
    SelectActivity,
  },
  data() {
    return {
      supportPayType: ['1'],
      couponId: '0',
      probability: 0,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 86400000;
        },
      },
      originProbability: 0,
      prizeData: {
        prizeName: '',
        prizeInfo: '',
        prizeType: '',
        num: 0,
        probability: 0,
        prizeEntityId: 0,
        prizeImg: '',
        clew: '',
        productIds: [],
        winningRule: '0',
        url: '',
      },
      typeText: {
        SECOND_KILL: '秒杀活动',
        SPELL_GROUP: '拼团活动',
      },
      form: {
        name: '',
        activityType: 'INSTANT_DRAW',
        displayColumn: '',
        luckyDrawPrizeDTOS: [
          {
            prizeName: '',
            prizeInfo: '',
            prizeType: '',
            num: 0,
            probability: 0,
            prizeEntityId: 0,
            prizeImg: '',
            clew: '',
            productIds: [],
            winningRule: '0',
            url: '',
          },
          {
            prizeName: '',
            prizeInfo: '',
            prizeType: '',
            num: 0,
            probability: 0,
            prizeEntityId: 0,
            prizeImg: '',
            clew: '',
            productIds: [],
            winningRule: '0',
            url: '',
          },
          {
            prizeName: '',
            prizeInfo: '',
            prizeType: '',
            num: 0,
            probability: 0,
            prizeEntityId: 0,
            prizeImg: '',
            clew: '',
            productIds: [],
            winningRule: '0',
            url: '',
          },
          {
            prizeName: '',
            prizeInfo: '',
            prizeType: '',
            num: 0,
            probability: 0,
            prizeEntityId: 0,
            prizeImg: '',
            clew: '',
            productIds: [],
            winningRule: '0',
            url: '',
          },
          {
            prizeName: '',
            prizeInfo: '',
            prizeType: '',
            num: 0,
            probability: 0,
            prizeEntityId: 0,
            prizeImg: '',
            clew: '',
            productIds: [],
            winningRule: '0',
            url: '',
          },
          {
            prizeName: '',
            prizeInfo: '',
            prizeType: '',
            num: 0,
            probability: 0,
            prizeEntityId: 0,
            prizeImg: '',
            clew: '',
            productIds: [],
            winningRule: '0',
            url: '',
          },
          {
            prizeName: '',
            prizeInfo: '',
            prizeType: '',
            num: 0,
            probability: 0,
            prizeEntityId: 0,
            prizeImg: '',
            clew: '',
            productIds: [],
            winningRule: '0',
            url: '',
          },
          {
            prizeName: '谢谢惠顾',
            prizeInfo: '谢谢惠顾',
            prizeType: 'nothing',
            num: 0,
            probability: 0.0,
            prizeEntityId: 0,
            prizeImg: '',
            clew: '谢谢惠顾',
            productIds: [],
            winningRule: '0',
            url: '',
          },
        ],
        drawType: 'POINTS_DRAW',
        luckyDrawZgObtainRuleDtoS: [
          {
            type: 'register',
            giveNum: 0,
            miniThreshold: 0,
            extendData: {},
          },
          {
            type: 'place_order',
            giveNum: 0,
            miniThreshold: 0,
            extendData: {
              activities: [],
            },
          },
          {
            type: 'guess',
            giveNum: 0,
            miniThreshold: 0,
            extendData: {},
          },
        ],
        luckDrawLimit: 1,
        winningLimit: 1,
        everyDayLuckDraw: 1,
        everyDayWinning: 1,
        activityRule: '',
        backgroundImg: 'https://file.itaxs.com/dev/20221018/f390753b8ac0400b96ec1334b4ce7e93.png',
        backgroundColour: '#FFC92E',
        totalLuckDraw: 1,
        totalWinning: 1,
        fictitiousNum: 1,
        // winningRule: 0,
        winningInfoShow: 1,
      },
      isSelect: {
        register: false,
        place_order: false,
        guess: false,
      },
      ruleText: {
        register: { label: '额外抽奖机会：', text: '注册获得抽奖机会' },
        place_order: { label: '', text: '下单获得抽奖机会' },
        guess: { label: '', text: '猜猜猜活动获得次抽奖机会' },
      },
      prizeType: {
        nothing: '未中奖',
        coupon: '优惠券',
        entity: '实物商品',
      },
      prizeRule: {
        0: '按中奖概率开奖',
        1: '购买指定商品开奖',
      },
      selectList: [],
      firmList: [],
      tableData: [],
      formRules: {
        name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        activityType: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
        displayColumn: [{ required: true, message: '请选择活动栏目', trigger: 'change' }],
        activityRule: [{ required: true, message: '请输入活动规则', trigger: 'blur' }],
        activityTime: [{ required: true, message: '请选择活动时间', trigger: 'blur' }],
        backgroundColour: [{ required: true, message: '请选择背景色', trigger: 'change' }],
        backgroundImg: [{ required: true, message: '请添加商品封面', trigger: 'change' }],
      },
      submitting: false,
      fromWhere: this.$route.query.key,
      dialogVisible: false,
      editPrizeIndex: 0,
      dialogVisibleActivity: false,
      couponSelection: [], // 弹窗选择的优惠券
      couponSelectionTemp: [], // 弹窗选择的优惠券临时
    };
  },
  created() {},
  mounted() {
    if (this.fromWhere == 'edit' || this.fromWhere == 'copy' || this.fromWhere == 'view') this.getActivity();
  },
  computed: {
    isEdit() {
      return this.$route.query.key == 'view' || this.form.status == '1';
    },
  },
  methods: {
    // 保存
    handleSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          let data = {
            ...this.form,
            finishTime: this.form.activityTime[1],
            startTime: this.form.activityTime[0],
          };
          delete data.activityTime;
          let prize = this.form.luckyDrawPrizeDTOS;
          for (let i in prize) {
            if (prize[i].prizeName == '') {
              this.$message.warning('请编辑完整的8个奖品信息');
              return false;
            }
          }
          let isSelectActivity = false;
          if (data.drawType == 'POINTS_DRAW') {
            delete data.luckyDrawZgObtainRuleDtoS;
          } else {
            delete data.everyTimeConsumePoint;
            data.luckyDrawZgObtainRuleDtoS.forEach((item, index) => {
              if (item.type == 'place_order') {
                if (!this.isSelect[item.type]) {
                  data.luckyDrawZgObtainRuleDtoS.splice(index, 1);
                } else {
                  // if (item.extendData.activities.length == 0) {
                  //   isSelectActivity = true;
                  // }
                }
              } else {
                item.extendData = {};
              }
            });
          }
          if (isSelectActivity) {
            this.$message.warning('请选择活动');
            return false;
          }
          if (this.fromWhere == 'edit') {
            this.editActivity(data);
          } else {
            this.createActivity(data);
          }
        } else {
          return false;
        }
      });
    },
    // 获取活动详情
    getActivity() {
      getDrawData({ id: this.$route.query.id }).then((res) => {
        if (res.code == 0) {
          let data = res.data;
          data.luckyDrawPrizes.forEach((item) => {
            if (item.prizeType == 'nothing') {
              item.num = 0;
              item.probability = 0;
            }
            item.probability = item.probability.toFixed(2);
          });
          if (data.luckyDrawZgObtainRule.length == 2) {
            data.luckyDrawZgObtainRule.splice(1, 0, {
              type: 'place_order',
              giveNum: 0,
              miniThreshold: 0,
              extendData: {
                activities: [],
              },
            });
            this.isSelect['place_order'] = false;
          }
          let ruleArry = [
            {
              type: 'register',
              giveNum: 0,
              miniThreshold: 0,
              extendData: {},
            },
            {
              type: 'place_order',
              giveNum: 0,
              miniThreshold: 0,
              extendData: {
                activities: [],
              },
            },
            {
              type: 'guess',
              giveNum: 0,
              miniThreshold: 0,
              extendData: {},
            },
          ];
          if (this.fromWhere == 'edit') {
            this.form = res.data;
            data.luckyDrawZgObtainRule.forEach((item) => {
              if (item.type == 'place_order') {
                this.isSelect[item.type] = item.giveNum > 0 ? true : false;
                this.couponSelection = item.extendData.activities;
              } else if (item.type == 'register') {
                this.isSelect[item.type] = item.giveNum > 0 ? true : false;
              } else if (item.type == 'guess') {
                this.isSelect[item.type] = item.miniThreshold > 0 ? true : false;
              }
            });

            this.$set(this.form, 'activityTime', [data.startTime, data.finishTime]);
            this.$set(this.form, 'luckyDrawPrizeDTOS', data.luckyDrawPrizes);
            this.$set(this.form, 'luckDrawLimit', data.luckDrawLimit ? 1 : 0);
            this.$set(this.form, 'winningInfoShow', data.winningInfoShow ? 1 : 0);
            this.$set(this.form, 'winningLimit', data.winningLimit ? 1 : 0);
            this.$set(this.form, 'activityRule', this.$Base64.decode(data.encryptionActivityRule));
            if (this.form.drawType == 'POINTS_DRAW') {
              this.$set(this.form, 'luckyDrawZgObtainRuleDtoS', ruleArry);
            } else {
              this.$set(this.form, 'luckyDrawZgObtainRuleDtoS', data.luckyDrawZgObtainRule);
            }
          } else {
            let arryRule = [];
            if (data.drawType == 'POINTS_DRAW') {
              arryRule = ruleArry;
            } else {
              arryRule = data.luckyDrawZgObtainRule.map((item) => {
                let json = {
                  type: item.type,
                  giveNum: item.giveNum,
                  miniThreshold: item.miniThreshold,
                  extendData: {},
                };
                if (item.type == 'place_order') {
                  this.isSelect[item.type] = item.giveNum > 0 ? true : false;
                  if (this.fromWhere == 'copy') {
                    json.extendData.activities = [];
                  } else {
                    json.extendData = item.extendData;
                  }
                  this.couponSelection = item.extendData.activities;
                } else if (item.type == 'register') {
                  this.isSelect[item.type] = item.giveNum > 0 ? true : false;
                } else if (item.type == 'guess') {
                  this.isSelect[item.type] = item.miniThreshold > 0 ? true : false;
                }
                return json;
              });
            }
            this.form = {
              activityTime: [data.startTime, data.finishTime],
              name: data.name,
              activityType: data.activityType,
              theLastFlag: data.theLastFlag,
              drawType: data.drawType,
              displayColumn: data.displayColumn,
              luckyDrawPrizeDTOS: data.luckyDrawPrizes,
              luckyDrawZgObtainRuleDtoS: arryRule,
              luckDrawLimit: data.luckDrawLimit ? 1 : 0,
              winningLimit: data.winningLimit ? 1 : 0,
              everyDayLuckDraw: data.everyDayLuckDraw,
              everyDayWinning: data.everyDayWinning,
              backgroundImg: data.backgroundImg,
              backgroundColour: data.backgroundColour,
              totalLuckDraw: data.totalLuckDraw,
              totalWinning: data.totalWinning,
              fictitiousNum: data.fictitiousNum,
              everyTimeConsumePoint: data.everyTimeConsumePoint,
              // winningRule: 0,
              winningInfoShow: data.winningInfoShow ? 1 : 0,
            };
            this.$set(this.form, 'activityRule', this.$Base64.decode(data.encryptionActivityRule));
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 活动编辑
    editActivity(data) {
      this.submitting = true;
      drawEdit(data, this.$route.query.id)
        .then((res) => {
          if (res.code == 0) {
            this.$message.success('编辑成功');
            this.$router.push({ path: '/extension/activityManagement/draw/index' });
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.submitting = false;
        });
    },
    // 创建活动
    createActivity(data) {
      this.submitting = true;
      drawAdd(data)
        .then((res) => {
          if (res.code == 0) {
            this.$message.success('创建成功');
            this.$router.push({ path: '/extension/activityManagement/draw/index' });
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.submitting = false;
        });
    },
    // 删除商品
    deleteGoods(key, index) {
      this.$confirm('确定删除该商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          if (key === 'form') {
            this.form.marketingActivitiesProductDTOS = [];
          } else {
            this.form.marketingActivitiesProductDTOS.splice(index, 1);
          }
        })
        .catch(() => {});
    },
    // 返回列表
    goback() {
      this.$router.push({
        path: '/extension/activityManagement/draw/index.vue',
        name: 'draw',
      });
    },
    editPrizeBtn(row, index) {
      let probability = 0;
      this.form.luckyDrawPrizeDTOS.forEach((item, i) => {
        if (index != i) {
          probability += Number(item.probability);
        }
      });
      this.dialogVisible = true;
      this.editPrizeIndex = index;
      let data = { ...row };
      this.prizeData = data;
      this.couponId = row.prizeEntityId;
      this.probability = probability.toFixed(2);
      this.originProbability = row.probability;
      this.originValue = row.probability;
    },
    cancleDialog() {
      this.dialogVisible = false;
    },
    getPrizeData(data) {
      this.dialogVisible = false;
      this.$set(this.form.luckyDrawPrizeDTOS, this.editPrizeIndex, data);
    },
    resetBackground() {
      this.form.backgroundColour = '#FFC92E';
    },
    resetBackgroundImg() {
      this.form.backgroundImg = 'https://file.itaxs.com/dev/20221018/f390753b8ac0400b96ec1334b4ce7e93.png';
    },
    handleCheckedCitiesChange(val, index, type) {
      if (val == false) {
        this.form.luckyDrawZgObtainRuleDtoS[index].giveNum = 0;
        if (type == 'place_order' || type == 'guess') {
          this.form.luckyDrawZgObtainRuleDtoS[index].miniThreshold = 0;
        }
      } else {
        if (type == 'place_order') {
          this.form.luckyDrawZgObtainRuleDtoS[index].giveNum = 1;
        }
      }
    },
    dialogVisibleActivityAlert() {
      this.dialogVisibleActivity = true;
      this.form.luckyDrawZgObtainRuleDtoS.forEach((item) => {
        if (item.type == 'place_order') {
          this.couponSelection = item.extendData.activities;
        }
      });
    },
    getCouponSelection(data) {
      this.couponSelectionTemp = data;
    },
    activitySure() {
      this.$refs.coupon.getCouponSelection();
      // let couponLength = this.couponSelectionTemp.length;
      // if (couponLength == 0) {
      //   this.$message({
      //     type: 'error',
      //     message: '请选择活动',
      //   });
      //   return false;
      // }
      this.form.luckyDrawZgObtainRuleDtoS.forEach((item) => {
        if (item.type == 'place_order') {
          item.extendData.activities = this.couponSelectionTemp;
        }
      });
      this.couponSelection = this.couponSelectionTemp;
      this.dialogVisibleActivity = false;
    },
    changeActivityType(val) {
      if (val == 'REGULAR_DRAW') {
        this.form.everyDayLuckDraw = 1;
        this.form.totalLuckDraw = 1;
        this.form.totalWinning = 1;
        this.form.everyDayWinning = 1;
        this.form.luckDrawLimit = 1;
        this.form.winningLimit = 1;
        this.form.winningInfoShow = 0;
      }
    },
    deleteCouponSelection(index) {
      this.form.luckyDrawZgObtainRuleDtoS.forEach((item) => {
        if (item.type == 'place_order') {
          item.extendData.activities.splice(index, 1);
        }
      });
    },
    luckDraw(e, type) {
      let num = Number(e.target.value);
      if (type == 'everyDayLuckDraw') {
        if (num > Number(this.form.totalLuckDraw)) {
          this.$message.warning('每人每天可抽奖不能大于每人总共可抽奖次数');
          this.form.everyDayLuckDraw = 1;
        }
      } else if (type == 'totalLuckDraw') {
        if (num < Number(this.form.everyDayLuckDraw)) {
          this.$message.warning('每人每天可抽奖不能小于每人总共可抽奖次数');
          this.form.totalLuckDraw = this.form.everyDayLuckDraw;
        }
      } else if (type == 'everyDayWinning') {
        if (num > Number(this.form.totalWinning)) {
          this.$message.warning('每人每天可中奖不能大于每人总共可中奖次数');
          this.form.everyDayWinning = 1;
        }
      } else if (type == 'totalWinning') {
        if (num < Number(this.form.everyDayWinning)) {
          this.$message.warning('每人每天可抽奖不能小于每人总共可抽奖次数');
          this.form.totalWinning = this.form.everyDayWinning;
        }
      }
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
