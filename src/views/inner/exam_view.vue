<template>
  <!-- 整体布局 -->
  <div>
    <!-- 加载中的提示 -->
    <div v-if="loadingQuestion" v-loading="loadingQuestion" element-loading-text="拼命加载中" class="loading"></div>
    <!-- 答题页面内容 -->
    <div v-if="!loadingQuestion" style="align-items: center;overflow: visible;margin: auto;">
      <!-- 星级评分、错误率、答题进度等信息 -->
      <el-row style="margin-bottom: 0">
        <el-col :span=4>
          <div>
            <!-- 星级评分 -->
            <div>
              <p class="errorRate">本题难度:<span :style="{ color: 'red' }">{{ currentQuestion.star + "/" + 5 }}</span></p>
            </div>
          </div>
        </el-col>
        <el-col :span=4>
          <div>
            <p class="errorRate">本题错误率: <span :style="{ color: 'red' }">{{ currentQuestion.errRate }}%</span></p>
          </div>
        </el-col>
        <el-col :span=4>
          <div>
            <!-- 答题进度 -->
            <p class="progress">答题进度: <span :style="{ color : 'green'}">{{
                Number(currentQuestionIndex) + 1
              }}/50</span></p>
          </div>
        </el-col>
        <el-col :span=4>
          <!-- 时间提示 -->
          <p v-if="timeExpired" style="color: red;" class="timer">时间已过，无法继续作答。</p>
          <p v-else style="color: green;" class="timer">剩余时间: {{ formattedTime }}</p>
        </el-col>
        <el-col :span=4>
          <!-- 暂停按钮 -->
            <el-button @click="togglePause" type="text" id="pauseButton">
              <span id="pauseButtonText">{{ isPaused ? '继续答题' : '暂停计时' }}</span>
            </el-button>
        </el-col>
      </el-row>
      <!-- 显示题目内容 -->
      <div>
        <h1 class="questionTitle">{{ currentQuestion.question }}</h1>
        <img v-if="currentQuestion.picUrl" :src="currentQuestion.picUrl" alt="题目图片" class="fig">
      </div>
      <!-- 显示选择题选项 -->
      <div v-if="currentQuestion.type === 'multiple-choice'">
        <el-radio-group v-model="currentQuestion.selectedOption">
          <el-row>
            <el-radio label="A">
              <span :class="getOptionClass('A')">{{ 'A、' + currentQuestion.itemA }}</span>
            </el-radio>
          </el-row>
          <el-row>
            <el-radio label="B">
              <span :class="getOptionClass('B')">{{ 'B、' + currentQuestion.itemB }}</span>
            </el-radio>
          </el-row>
          <el-row>
            <el-radio label="C">
              <span :class="getOptionClass('C')">{{ 'C、' + currentQuestion.itemC }}</span>
            </el-radio>
          </el-row>
          <el-row>
            <el-radio label="D">
              <span :class="getOptionClass('D')">{{ 'D、' + currentQuestion.itemD }}</span>
            </el-radio>
          </el-row>
        </el-radio-group>
      </div>
      <!-- 显示判断题选项 -->
      <div v-if="currentQuestion.type === 'true-false'">
        <el-radio-group v-model="currentQuestion.selectedOption">
          <el-row>
            <el-radio label="对">
              <span :class="getOptionClass('对')">对</span>
            </el-radio>
          </el-row>
          <el-row>
            <el-radio label="错">
              <span :class="getOptionClass('错')">错</span>
            </el-radio>
          </el-row>
        </el-radio-group>
      </div>
      <br/>
      <!-- 上一题、下一题、确认答案等按钮 -->
      <div>
          <!-- 上一题按钮 -->
          <el-button @click="showPreviousQuestion" :disabled="currentQuestionIndex === 0" class="_button">上一题
          </el-button>
          <!-- 下一题按钮 -->
          <el-button @click="showNextQuestion" :disabled="currentQuestionIndex === questions.length - 1"
                     class="_button">下一题
          </el-button>
          <!-- 确认答案按钮 -->
          <el-button @click="confirmAnswer" type="primary" :disabled="currentQuestion.answered" class="_button">
            确认答案
          </el-button>
          <!-- 答题卡按钮 -->
          <el-button @click="toggleAnswerSheet" type="primary" class="_button">答题卡</el-button>
          <!-- 提交试卷按钮 -->
          <el-button @click="confirmSubmit" type="primary" class="_button">提交试卷</el-button>
          <!-- 答题卡抽屉 -->
          <el-drawer :visible.sync="showAnswerSheet" direction="ltr" size="20%">
            <div slot="title" id="drawer-title">答题卡</div>
            <div id="menu-center-in-drawer">
              <el-menu :default-active="String(currentQuestionIndex)" class="answer-sheet-menu" @select="goToQuestion"
                       id="parent-menu">
                <el-menu-item v-for="(question, index) in questions" :key="index" :index="String(index)"
                              style="padding:  0 0 0 0; width: 42px; height: 42px">
                  <!-- 答题卡按钮 -->
                  <el-button class="answer-sheet-button" size="medium" circle autofocus
                             :class="changeAnswerSheetButtonStyle(index)" @click="goToQuestion(index)">
                    {{ index + 1 }}
                  </el-button>
                </el-menu-item>
              </el-menu>
            </div>
          </el-drawer>
      </div>
      <!-- 显示解析 -->
      <div v-if="showAnalysis" class="analysis">
        <h2>解析</h2>
        <!-- 解析内容 -->
        <div v-html="this.currentQuestion.analysis" class="analysis_inner"></div>
      </div>
    </div>
  </div>
</template>
<script>
import math from 'math';
import {apiHelper} from "@/utils/apiHelper";
import {vuexHelper} from "@/utils/vuexHelper";
import {notifyMessageHelper} from "@/utils/notifyMessageHelper";

export default {
  data() {
    return {
      timer: null,
      isPaused: false,
      timeRemaining: 45 * 60, // 初始考试时长 45 分钟
      timeExpired: false, // 考试时间是否过期
      questions: [], // 存储试卷题目数组
      showAnswerSheet: false, // 是否显示答题卡
      currentQuestionIndex: 0, // 当前题目索引
      currentQuestion: {star: null}, // 当前题目对象
      showAnalysis: null, // 是否显示解析
      userScore: 0, // 用户得分
      loadingQuestion: true, // 是否正在加载题目
      haveSubmitMockExamPaper: false, // 是否已经提交试卷
    };
  },
  computed: {
    formattedTime() {
      // 格式化剩余时间
      const minutes = Math.floor(this.timeRemaining / 60);
      const seconds = this.timeRemaining % 60;
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    },
  },
  methods: {
    generateRandomNumbers(min, max, count) {
      if (count > max - min + 1) {
        throw new Error("生成的数字数量大于范围大小");
      }

      const result = [];
      while (result.length < count) {
        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!result.includes(randomNum)) {
          result.push(randomNum);
        }
      }
      return result;
    },

    startTimer() {
      // 启动计时器
      this.timer = setInterval(() => {
        this.timeRemaining--;
        if (this.timeRemaining <= 0 && !this.timeExpired) {
          this.timeExpired = true;
          clearInterval(this.timer);
        }
      }, 1000);
    },

    goToQuestion(index) {
      // 跳转到指定题目
      this.currentQuestionIndex = index;
      this.currentQuestion = this.questions[this.currentQuestionIndex];
      this.showAnswerSheet = false;
      },

    showNextQuestion() {
      // 显示下一题
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
        this.currentQuestion = this.questions[this.currentQuestionIndex];
        this.selectedOption = null;
        this.showAnalysis = this.currentQuestion.answered;
      }
    },

    showPreviousQuestion() {
      // 显示上一题
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
        this.currentQuestion = this.questions[this.currentQuestionIndex];
        this.selectedOption = null;
        this.showAnalysis = this.currentQuestion.answered;
      }
    },

    toggleAnswerSheet() {
      // 切换答题卡显示状态
      this.showAnswerSheet = !this.showAnswerSheet;
    },
    async generateMockExamPaper() {
      const minRange = 1;
      const maxRange = 1723;
      const numberOfRandomNumbers = 50;
      const randomNumbers = this.generateRandomNumbers(minRange, maxRange, numberOfRandomNumbers);
      const mockExamQuestions  = await apiHelper.getMockExamPaper(randomNumbers);
      mockExamQuestions.forEach(question =>{
        question.type = parseInt(question.type) === 1 ? 'true-false' : 'multiple-choice';
        question.errRate = math.round(question.errRate.toPrecision(3) * 100);
      })
      this.questions =mockExamQuestions;
      this.showAnalysis = false;
      this.currentQuestion = this.questions[this.currentQuestionIndex];
      this.loadingQuestion = false;
    },
    getOptionClass(option) {
      // 获取选项样式类
      if (this.currentQuestion.answered) {
        if (option === this.currentQuestion.answer) {
          return 'correct-answer';
        } else {
          return 'incorrect-option';
        }
      }
      return 'uncheck'; // 默认样式
    },
    confirmAnswer() {
      // 确认答案
      if (this.currentQuestion.selectedOption) {
        this.currentQuestion.answered = true;
        this.showAnalysis = true;
        if (this.currentQuestion.selectedOption === this.currentQuestion.answer) {
          notifyMessageHelper.showAnswerCorrectMessage(this)
        } else {
          notifyMessageHelper.showAnswerIncorrectMessage(this, this.currentQuestion.answer, this.currentQuestion.selectedOption)
        }
      } else {
        notifyMessageHelper.showUnselectedMessage(this)
      }
    },
    changeAnswerSheetButtonStyle(index) {
      // 获取答题卡按钮样式
      const question = this.questions[index];
      if (question.answered) {
        return question.selectedOption === question.answer ? 'answer-sheet-button-correct' : 'answer-sheet-button-incorrect';
      } else {
        return 'unanswered';
      }
    },
    confirmSubmit() {
      // 确认提交试卷
      const allAnswered = this.questions.every(question => question.answered);
      this.calculateUserScore();
      const passMsg = this.userScore < 90 ? '未通过考试' : '通过考试';
      if (allAnswered && !this.haveSubmitMockExamPaper) {
        this.$confirm(
            '本次模拟考试的得分是【' + this.userScore + '】分, ' + passMsg,
            '提示',
            {
              confirmButtonText: '确认',
              cancelButtonText: '开始新的模拟考试',
              type: 'warning'
            }
        )
            .then(() => {
              clearInterval(this.timer);
              this.submitMockExamPaper();
            })
            .catch(() => {
              this.submitMockExamPaper();
              this.generateMockExamPaper();
              this.currentQuestionIndex = 0;
              this.timeRemaining = 45 * 60;
              this.isPaused = false;
            });
      } else if (allAnswered && this.haveSubmitMockExamPaper) {
        this.$confirm(
            '本次作答已经提交',
            '提示',
            {
              confirmButtonText: '开始新的模拟考试',
              cancelButtonText: '取消',
              type: 'warning'
            })
            .then(() => {
              this.submitMockExamPaper();
              this.generateMockExamPaper();
              this.currentQuestionIndex = 0;
              this.timeRemaining = 45 * 60;
              this.isPaused = false;
            })
            .catch(() => {
            });
      } else {
        this.showAnswerSheet = true;
        this.$message({
          showClose: true,
          message: '有题目未作答，请完成所有题目后再提交。',
          type: 'warning'
        });
      }
    },
    submitMockExamPaper() {
      // 提交试卷
      this.haveSubmitMockExamPaper = true;
      apiHelper.writeScore(vuexHelper.getLoginUsername(), this.userScore)
          .then(() => this.$message.success('试卷提交成功！'));
      vuexHelper.setLatestMockExamQuestions(null);
      vuexHelper.setTimeRemaining(null);
    },
    calculateUserScore() {
      // 计算用户得分
      this.userScore = this.questions.reduce((totalScore, question) => {
        return totalScore + (question.answered && question.selectedOption === question.answer ? 2 : 0);
      }, 0);
    },
    togglePause() {
      // 切换暂停状态
      this.isPaused = !this.isPaused;
      if (this.isPaused) {
        clearInterval(this.timer);
        document.querySelectorAll('button').forEach(btn => btn.disabled = true);
        const pulseButton = document.querySelector('#pauseButton');
        if (pulseButton) {
          pulseButton.disabled = false;
        }
      } else {
        this.startTimer();
        document.querySelectorAll('button').forEach(btn => btn.disabled = false);
      }
    },
    handleBeforeUnload() {
      // 刷新页面保存答题数据到本地
      if (!this.haveSubmitMockExamPaper) {
        vuexHelper.setLatestMockExamQuestions(this.questions);
        vuexHelper.setTimeRemaining(this.timeRemaining);
      }
    },
    saveLeastExam2vuex() {
      // 组件销毁保存数据到本地
      if (!this.haveSubmitMockExamPaper) {
        vuexHelper.setLatestMockExamQuestions(this.questions);
        vuexHelper.setTimeRemaining(this.timeRemaining);
      }
    },
    hasLatestExamRecord() {
      // 判断是否有上次的答题记录
      const _latestMockExamQuestions = vuexHelper.getLatestMockExamQuestions();
      const _timeRemaining = vuexHelper.getTimeRemaining();
      return _latestMockExamQuestions ? {"latestMockExamQuestions": _latestMockExamQuestions, "timeRemaining": _timeRemaining,} : null;
    }
  },
  created() {
    // 判断是否有答题记录, false->gen ,true -> 加载并询问是否继续回答
    if (this.hasLatestExamRecord()) {
      const {latestMockExamQuestions, timeRemaining} = this.hasLatestExamRecord();
      this.questions = latestMockExamQuestions;
      this.timeRemaining = timeRemaining;
      this.loadingQuestion = false;
      this.$confirm(
          '检测到上次有未完成的模拟考试，请选择是否继续上次的作答',
          '提示',
          {
            showClose: false,
            confirmButtonText: '继续作答',
            cancelButtonText: '重新加载'
          }
      ).then(() => {
        this.currentQuestion = this.questions[this.currentQuestionIndex];
        this.showAnswerSheet = true;
      }).catch(() => {
        this.loadingQuestion = true;
        this.generateMockExamPaper();
        this.timeRemaining = 45 * 60;
        vuexHelper.setLatestMockExamQuestions(null);
        vuexHelper.setTimeRemaining(null);
      })
    } else {
      this.loadingQuestion = true;
      this.timeRemaining = 45 * 60;
      this.generateMockExamPaper();
    }
  },

  mounted() {
    // 监听刷新
    this.handleBeforeUnloadListener = (ev) => this.handleBeforeUnload(ev);
    window.addEventListener('beforeunload', this.handleBeforeUnloadListener)

    this.startTimer();
  },

  beforeDestroy() {
    clearInterval(this.timer);
    window.removeEventListener('beforeunload', this.handleBeforeUnloadListener);
    this.saveLeastExam2vuex();
  },
};
</script>

<style scoped>
::v-deep .el-radio__label {
  font-size: x-large;
}

.questionTitle {
  font-size: x-large;
  line-height: 2rem;
}

._button {
  width: 150px;
}

.analysis {
  background-color: #d5dada;
}

.analysis_inner {
  font-size: large;
}

.errorRate, .progress {
  font-size: large;
}

.star-errRate {
  align-items: center;
  height: 30px;
}

.correct-option {
  color: green;
}

.incorrect-option {
  color: red;
}

.correct-answer {
  color: green;
}

.fig {
  max-width: 100%;
  max-height: 350px;
  width: auto;
  height: auto;
}

.answer-sheet-menu {
  display: grid;
  grid-template-columns: repeat(5, 0fr);
  grid-gap: 10px; /* 可根据需要调整按钮上下间距 */
}

.answer-sheet-button {
  width: 42px; /* 设置按钮宽度 */
  height: 42px; /* 设置按钮高度 */
  border-radius: 50%; /* 使按钮呈现圆形 */
  line-height: 42px; /* 让文字垂直水平居中 */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff; /* 设置按钮背景色，可根据需要修改 */
  cursor: pointer;
}

.answer-sheet-menu .el-menu-item:hover {
  background-color: #fff; /* 鼠标悬停时显示白色背景 */
}

.el-menu::before {
  display: none;
  content: none;
}

#menu-center-in-drawer {
  display: flex;
  justify-content: center;
}

#parent-menu {
  border-right: none;
}

#drawer-title {
  text-align: center;
  font-size: 18px;
  color: #333;
  font-weight: bolder;
}

.correct-option {
  color: green;
}

.incorrect-option {
  color: red;
}

.correct-answer {
  color: green;
}

.answer-sheet-button-correct {
  color: black;
  background-color: #d8e7ba;
}

.answer-sheet-button-incorrect {
  color: black;
  background-color: #e8afa0;
}

.timer {
  font-size: large;
}

.loading {
  font-size: x-large;
  width: 1150px;
  height: 300px;
}

#pauseButton {
  color: red;
  font-size: large;
}
.el-row {
  margin-bottom: 10px;
}

.errorRate, .progress {
  font-size: large;
}
#pauseButton{
  padding-top: 20px;
}
#pauseButtonText{
  text-decoration: underline;
}
</style>
