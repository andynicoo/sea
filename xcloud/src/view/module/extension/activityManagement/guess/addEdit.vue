<template>
  <div class="app-container">
    <BackHerader @back="goback" title="创建猜猜猜活动"></BackHerader>
    <!-- 表单 -->
    <div class="form-container">
      <el-form label-width="140px" ref="formRef" :model="form" :rules="formRules">
        <FormTitle value="基础设置："></FormTitle>
        <el-form-item label="活动名称：" prop="answerActivityName">
          <el-input :disabled="allDisabled" v-model="form.answerActivityName" placeholder="请输入活动名称" maxlength="12" clearable style="width: 360px" />
        </el-form-item>
        <el-form-item label="活动类型：" prop="type">
          <el-select placeholder="请选择" style="width: 360px" v-model="form.type" :disabled="allDisabled">
            <el-option label="猜猜猜答题" value="GUESS_GENERAL"></el-option>
            <el-option label="猜灯谜活动" value="GUESS_RIDDLES"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="答题时间段:" prop="activityTime">
          <el-date-picker
            :disabled="allDisabled"
            :picker-options="pickerOptions"
            v-model="form.activityTime"
            type="datetimerange"
            align="right"
            size="small"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 360px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="背景图片：" prop="answerActivityPicture">
          <UploadImage
            ref="uploadImageRef"
            :disabled="allDisabled"
            :imageUrl="form.answerActivityPicture"
            :imgType="1"
            :on-success="(v) => (form.answerActivityPicture = v.file.fileUrl)"
            upload-tips="添加图片"
            :imgMaxSize="3"
            :accept="'.png, .jpg'"
            :ruleType="['image/jpeg', 'image/jpg', 'image/png']"
          ></UploadImage>
          <el-button type="text" @click="resetBackgroundImg">恢复默认图</el-button>
          <div class="subTips">建议尺寸：750*1448</div>
        </el-form-item>
        <el-form-item label="背景色：" prop="answerActivityBackgroundColor">
          <el-color-picker :disabled="allDisabled" v-model="form.answerActivityBackgroundColor"></el-color-picker>
          <el-button type="text" @click="resetBackground" style="margin-left: 10px">重置</el-button>
        </el-form-item>

        <el-form-item label="活动规则：" prop="answerActivityRule">
          <Editor :value.sync="form.answerActivityRule" style="width: 1000px" :disabled="allDisabled" v-if="!allDisabled"></Editor>
          <div v-html="form.answerActivityRule" style="word-break: break-all" v-else></div>
        </el-form-item>

        <FormTitle value="题目设置："></FormTitle>
        <el-form-item label="选择题目：" prop="answerTopicIdList">
          <el-button type="info" @click="topicDialogVisible = true" :disabled="(answerActivityStatus == '进行中' || allDisabled) && fromWhere != 'copy'">题库中添加</el-button> 最多可选择500道题 <el-button type="text" @click="resetAnswer" :disabled="allDisabled">全部清空</el-button></el-form-item
        >

        <el-table class="topic-table" ref="multipleTable" max-height="450" :data="mulSelectList" v-if="mulSelectList.length">
          <el-table-column show-overflow-tooltip label="题目内容" min-width="500">
            <template slot-scope="scope">{{ scope.row.topicName }} 【单选】</template>
          </el-table-column>

          <el-table-column type="expand" label="">
            <template slot-scope="props">
              <el-radio-group size="small" value="YES">
                <el-radio :label="item.isAnswer" v-for="item in props.row.topicOptionList" :key="item.optionName">{{ item.optionName }}</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-link type="primary" :disabled="answerActivityStatus == '进行中' && fromWhere != 'copy'" @click="delItem(scope.row)">移除</el-link>
            </template>
          </el-table-column>
        </el-table>

        <FormTitle value="答题设置："></FormTitle>
        <el-form-item label="出题规则：">
          <el-radio-group v-model="form.rulesDraw" :disabled="allDisabled">
            <el-radio label="RANDOM_ORDER">随机顺序</el-radio>
            <el-radio label="PERMANENT_ORDER">固定顺序</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="答题次数：">
          <el-radio-group v-model="form.answerAnswerNumberRule" @change="changeAnswerNum" :disabled="(answerActivityStatus == '进行中' || allDisabled) && fromWhere != 'copy'">
            <el-radio label="NO_LIMIT">不限制</el-radio>
            <el-radio label="ASTRICT">限制</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="" v-if="form.answerAnswerNumberRule == 'ASTRICT'">
          <span class="mr-10">每人每天可答题</span>
          <el-input-number class="mb-10" :step="1" :disabled="allDisabled" step-strictly v-model="form.everydayNumber" :min="1" :max="100" controls-position="right" style="width: 100px" />
          <span class="ml-10">次</span>
          <br />
          <span class="mr-10">每人总共可答题</span>
          <el-input-number :step="1" step-strictly :disabled="allDisabled" v-model="form.answerAnswerNumber" :min="1" :max="100" controls-position="right" style="width: 100px" />
          <span class="ml-10">次</span>
        </el-form-item>

        <el-form-item label="随机抽取题数：" prop="questionNumber">
          <span class="mr-10">从题目中随机抽取</span>
          <el-input-number :disabled="!mulSelectList.length || ((answerActivityStatus == '进行中' || allDisabled) && fromWhere != 'copy')" step-strictly :step="1" v-model="form.questionNumber" controls-position="right" style="width: 120px" clearable :min="1" :max="mulSelectList.length" />
          <span class="ml-10">道题</span>
        </el-form-item>
        <el-form-item label="答题分数：">
          <span class="mr-10">每道题目</span>
          <el-input-number v-model="form.topicScore" step-strictly :step="1" :disabled="!mulSelectList.length || ((answerActivityStatus == '进行中' || allDisabled) && fromWhere != 'copy')" controls-position="right" placeholder="请输入" style="width: 120px" clearable :min="0" :max="999" />
          <span class="ml-10">分</span><span v-if="form.topicScore && form.questionNumber">，总分{{ form.topicScore * form.questionNumber }}分</span>
        </el-form-item>

        <el-form-item label="计时答题：">
          <el-radio-group v-model="form.timingRules" class="mr-10" @change="changeTimeRule" :disabled="allDisabled">
            <el-radio label="NO_LIMIT">不限制</el-radio>
            <el-radio label="ASTRICT">总时间限制</el-radio>
          </el-radio-group>
          <template v-if="form.timingRules == 'ASTRICT'">
            <el-input-number v-model="form.bindingHours" step-strictly :step="1" controls-position="right" placeholder="请输入" :disabled="allDisabled" style="width: 100px" clearable :min="0" :max="999" />
            <span class="ml-10">分</span>
          </template>
        </el-form-item>

        <el-form-item label="正确答案：">
          <el-radio-group v-model="form.isOpenAnswer" :disabled="allDisabled">
            <el-radio label="YES">开启</el-radio>
            <el-radio label="NO">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>

        <FormTitle value="更多设置："></FormTitle>
        <el-form-item label="分享获得参与次数：">
          <el-switch v-model="form.shareFlag" :active-value="1" :inactive-value="0" :disabled="allDisabled" @change="changeShareFlag"></el-switch>
          <span class="ml-10">{{ form.shareFlag == 1 ? '开启' : '不开启' }}</span>
          <div v-if="form.shareFlag == 1">
            <span class="mr-10">每日可分享</span>
            <el-input-number :step="1" step-strictly :disabled="allDisabled" v-model="form.shareNum" :min="0" :max="1000" controls-position="right" style="width: 100px" />
            <span class="ml-10">次</span>
          </div>
        </el-form-item>
        <el-form-item label="展示评语：">
          <el-switch v-model="form.showComments" :active-value="1" :inactive-value="0" :disabled="allDisabled"></el-switch>
          <span class="ml-10">{{ form.showComments == 1 ? '开启' : '隐藏' }}</span>
        </el-form-item>
        <el-form-item label="添加评语：" v-if="form.showComments == 1">
          <el-form-item
            v-for="(item, index) in form.commentList"
            label=""
            :key="item.key"
            :prop="'commentList.' + index + '.remark'"
            :rules="{
              required: true,
              message: '评语不能为空',
              trigger: 'blur',
            }"
          >
            <el-select style="width: 300px" v-model="item.level" filterable @change="changeComment(index)">
              <el-option :value="commentOpt.label" :label="commentOpt.label" v-for="commentOpt in commentOpts" :key="commentOpt.label"></el-option>
            </el-select>

            分, 显示

            <el-input style="width: 200px" v-model="item.remark" class="mr-10"></el-input>

            <el-button class="ml-10" @click.prevent="removeOption(index)" :disabled="allDisabled">删除</el-button>
          </el-form-item>
          <el-button type="primary" @click="addOption" :disabled="allDisabled">添加分值区间和评语</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="handleSubmit" v-if="fromWhere != 'view'"> 保存 </el-button>
          <el-button @click="goback()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <TopicSelectDialog :couponSelectionProp="form.answerTopicIdList" :topicDialogVisible.sync="topicDialogVisible" @getSelectList="getSelectList" />
  </div>
</template>
<script>
import BackHerader from '@/components/backHerader';
import FormTitle from '@/components/WorkOrderComponents/FormTitle';
import Editor from '@/components/quillEditor/index';
import UploadImage from '@/components/UploadImage/index.vue';
import TopicSelectDialog from './components/topicSelectDialog.vue';
import { getGuessData, addAnswerActivityApi, editAnswerActivityApi } from '@/api/newApi/extension/activity.js';
export default {
  components: {
    BackHerader,
    FormTitle,
    Editor,
    UploadImage,
    TopicSelectDialog,
  },
  data() {
    return {
      topicDialogVisible: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        },
      },
      form: {
        answerTopicIdList: [],
        answerAnswerNumber: 1,
        type: 'GUESS_GENERAL',
        everydayNumber: 1,
        activityTime: [],
        answerActivityRule: '',
        rulesDraw: 'RANDOM_ORDER',
        answerAnswerNumberRule: 'NO_LIMIT',
        bindingHours: '',
        timingRules: 'NO_LIMIT',
        questionNumber: 1,
        showComments: '',
        shareFlag: 0,
        topicScore: 1,
        shareNum: 1,
        isOpenAnswer: 'YES',
        answerActivityPicture: 'https://file.itaxs.com/pro/productcenter/20221130/143169e9b8a44e5aa31194fefa28f288.png',
        answerActivityBackgroundColor: '#FD8210',
        commentList: [
          {
            lowerLimitScore: 0,
            remark: '',
            level: '',
            upperLimitScore: 0,
            commentOpts: this.commentOpts,
          },
        ],
      },
      commentOpts: [
        {
          label: '大于等于0少于10',
        },
        {
          label: '大于等于10少于20',
        },
        {
          label: '大于等于20少于30',
        },
        {
          label: '大于等于30少于40',
        },
        {
          label: '大于等于40少于50',
        },
        {
          label: '大于等于50少于60',
        },
        {
          label: '大于等于60少于70',
        },
        {
          label: '大于等于70少于80',
        },
        {
          label: '大于等于80少于90',
        },
        {
          label: '大于等于90少于100',
        },
        {
          label: '大于等于100少于1000',
        },
      ],
      tableData: [],
      mulSelectList: [],
      formRules: {
        answerActivityName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
        answerActivityRule: [{ required: true, message: '请输入活动规则', trigger: 'blur' }],
        activityTime: [{ required: true, message: '请选择活动时间', trigger: 'blur' }],
        answerActivityBackgroundColor: [{ required: true, message: '请选择背景色', trigger: 'change' }],
        answerActivityPicture: [{ required: true, message: '请添加商品封面', trigger: 'change' }],
        questionNumber: [{ required: true, message: '请输入随机抽取题数', trigger: 'blur' }],
        answerTopicIdList: [{ required: true, type: 'array', message: '请添加题目', trigger: 'blur' }],
      },
      submitting: false,
      fromWhere: this.$route.query.key,
      answerActivityStatus: this.$route.query.answerActivityStatus,
      dialogVisibleActivity: false,
    };
  },
  created() {},
  mounted() {
    if (this.fromWhere == 'edit' || this.fromWhere == 'copy' || this.fromWhere == 'view') this.getActivity();
  },
  filters: {
    questionTypeFilter(val) {
      if (val == 'MULTIPLE_CHOICE') {
        return '单选';
      }
      return '';
    },
  },
  computed: {
    allDisabled() {
      return ((this.answerActivityStatus == '已结束' || this.answerActivityStatus == '已失效') && this.$route.query.key == 'edit') || this.$route.query.key == 'view';
    },
  },
  methods: {
    // 保存
    handleSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          let data = {
            ...this.form,
            answerActivityEndTime: this.form.activityTime[1],
            answerActivityBeginTime: this.form.activityTime[0],
          };
          if (!this.form.answerTopicIdList.length) {
            return this.$message.error('请选择题目');
          }
          if (this.form.type == 2) {
            if (this.form.answerTopicIdList.length < 9) {
              return this.$message.error('猜灯谜活动答题数量不少于9个');
            }
          }
          if (this.form.answerAnswerNumber && this.form.everydayNumber && this.form.answerAnswerNumber < this.form.everydayNumber) {
            return this.$message.error('每日每天可答题需要少于等于每人总共可答题');
          }
          delete data.activityTime;
          if (this.form.showComments == 0) {
            delete data.commentList;
          }
          if (this.fromWhere != 'edit') {
            delete data.answerId;
          }
          if (this.form.shareFlag == 0) {
            delete data.shareNum;
          }
          const mapList = this.form.commentList.map((item) => item.level);
          if ([...new Set(mapList)].length < this.form.commentList.length) {
            return this.$message.error('评语分区值不能相同');
          }
          data.answerActivityRule = this.$Base64.encode(data.answerActivityRule);
          this.addEditActivity(data);
        } else {
          return false;
        }
      });
    },
    // 获取一个活动
    getActivity() {
      getGuessData({ answerId: this.$route.query.id }).then((res) => {
        if (res.code == 0) {
          let data = res.data;
          this.form = data;
          // this.form.activityTime = [data.answerActivityBeginTime, data.answerActivityEndTime];
          this.$set(this.form, 'activityTime', [data.answerActivityBeginTime, data.answerActivityEndTime]);
          this.getSelectList(data.answerTopicList);
          if (data.commentList && data.commentList.length) {
            this.$set(this.form, 'showComments', 1);
            this.form.commentList = data.commentList.map((item) => ({ ...item, level: `大于等于${item.upperLimitScore}少于${item.lowerLimitScore}` }));
          }
          this.$set(this.form, 'shareFlag', this.form.shareFlag ? 1 : 0);
          this.$set(this.form, 'answerActivityRule', this.$Base64.decode(data.answerActivityRule));
        } else {
          this.$message.error(res.message);
        }
      });
    },
    removeOption(index) {
      this.form.commentList.splice(index, 1);
    },
    delItem(row) {
      const index = this.mulSelectList.findIndex((item) => item.answerTopicId == row.answerTopicId);
      this.mulSelectList.splice(index, 1);
      const ind = this.form.answerTopicIdList.findIndex((item) => item == row.answerTopicId);
      this.form.answerTopicIdList.splice(ind, 1);
    },
    addOption() {
      this.form.commentList.push({
        key: Date.now(),
        remark: '',
        level: '',
        lowerLimitScore: '',
        upperLimitScore: '',
        // commentOpts: this.getOptList(),
      });
    },
    getOptList() {
      const mapList = this.form.commentList.map((item) => item.level);

      const list = this.commentOpts.map((item) => {
        if (mapList.includes(item.label)) {
          return { label: item.label, disabled: mapList.includes(item.label) };
        } else {
          return { label: item.label, disabled: false };
        }
      });
      return list;
    },
    getSelectList(val) {
      this.mulSelectList = val;
      this.form.answerTopicIdList = val.map((item) => item.answerTopicId);
    },
    // 创建活动
    addEditActivity(data) {
      this.submitting = true;
      const fnName = this.fromWhere == 'edit' ? editAnswerActivityApi : addAnswerActivityApi;
      fnName(data)
        .then((res) => {
          if (res.code == 0) {
            this.$message.success('创建成功');
            this.$router.push({ path: '/extension/activityManagement/guess/index' });
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.submitting = false;
        });
    },
    // 返回列表
    goback() {
      this.$router.push({
        path: '/extension/activityManagement/guess/index',
        name: 'guess',
      });
    },
    changeComment(index) {
      const val = this.form.commentList[index].level;
      const ind = this.commentOpts.findIndex((item) => item.label == val);
      if (ind <= 9) {
        this.form.commentList[index].upperLimitScore = ind * 10;
        this.form.commentList[index].lowerLimitScore = (ind + 1) * 10;
      } else {
        this.form.commentList[index].upperLimitScore = 100;
        this.form.commentList[index].lowerLimitScore = 1000;
      }
    },
    changeAnswerNum(val) {
      if (val == 'NO_LIMIT') {
        this.form.everydayNumber = '';
        this.form.answerAnswerNumber = '';
      }
    },
    changeTimeRule(val) {
      if (val == 'NO_LIMIT') {
        this.form.bindingHours = '';
      }
    },
    changeShareFlag(val) {
      if (val == 1) {
        this.form.shareNum = 1;
      }
    },
    changeSwitch(val) {
      if (val != 1) {
        this.form.commentList = [
          {
            lowerLimitScore: 0,
            remark: '',
            level: '',
            upperLimitScore: 0,
          },
        ];
      }
    },

    resetBackground() {
      this.form.answerActivityBackgroundColor = '#FD8210';
    },
    resetBackgroundImg() {
      this.form.answerActivityPicture = 'https://file.itaxs.com/pro/productcenter/20221130/143169e9b8a44e5aa31194fefa28f288.png';
    },
    resetAnswer() {
      this.$confirm('确认全部清空吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.mulSelectList = [];
          this.form.answerTopicIdList = [];
        })
        .catch(() => {});
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

.el-checkbox {
  margin-right: 5px;
}

.el-table .el-radio {
  display: block;
  margin: 0 0 10px 60px;
}
.topic-table {
  width: 1000px;
  margin-bottom: 20px;
}
</style>
