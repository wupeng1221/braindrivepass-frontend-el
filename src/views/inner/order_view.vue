<template>
  <div>
    <el-row style="margin-bottom: 0">
      <el-col :span="6">
        <div>
          <p class="errorRate">本题难度:<span :style="{ color: 'red' }">{{ currentQuestion.star + "/" + 5 }}</span></p>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <p class="errorRate">本题错误率: <span :style="{ color: 'red' }">{{ currentQuestion.errRate }}%</span>
          </p></div>
      </el-col>
      <el-col :span="6">
        <div>
          <p class="progress">答题进度: <span
              :style="{ color : 'green'}">{{currentQuestionIndex + "/" + length}}</span></p>
        </div>
      </el-col>
    </el-row>
    <!-- 显示题目内容 -->
    <div>
      <h1 class="questionTitle">{{ currentQuestion.question }}</h1>
      <img v-if="currentQuestion.picUrl" :src="currentQuestion.picUrl" alt="题目图片" class="fig">
    </div>
    <!-- 显示选择题选项 -->
    <div v-if="currentQuestion.type === 'multiple-choice'">
      <el-radio-group v-model="selectedOption">
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
      <el-radio-group v-model="selectedOption">
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
    <div class="prev-and-next-button">
      <el-button
          @click="prevQuestion"
          :disabled="currentQuestionIndex === 0"
          class="__button"
      >
        上一题
      </el-button>
      <el-button
          @click="nextQuestion"
          :disabled="currentQuestionIndex === length - 1"
          class="__button"
      >
        下一题
      </el-button>
      <el-button @click="toggleFavorite" class="__button" type="primary">{{
          isFavorite ? '取消收藏' : '收藏题目'
        }}
      </el-button>
      <el-button @click="submitAnswer" class="__button" type="primary">确认答案</el-button>
    </div>
    <div v-if="showAnalysis" class="analysis">
      <h2>解析</h2>
      <div v-html="currentQuestion.analysis" class="analysis_inner"></div>
    </div>
  </div>
</template>

<script>
import {apiHelper} from "@/utils/apiHelper";
import {vuexHelper} from "@/utils/vuexHelper";
import {notifyMessageHelper} from "@/utils/notifyMessageHelper";
import {dataHelper} from "@/utils/dataHelper";

export default {
  data() {
    return {
      length: 1723,
      currentQuestion: {star: null},
      currentQuestionIndex: null,
      selectedOption: null,
      showAnalysis: null,
    }
  },
  computed: {
    isFavorite() {
      return vuexHelper.getFavorite().includes(this.currentQuestionIndex);
    },
  },
  methods: {
    // 判断是否作答过，如果是显示历史答案与解析
    showSelectedOptionsAndAnalysis() {
      const _selectedOption = vuexHelper.getAnswerRecord()[this.currentQuestionIndex];
      const _haveSubmitAnswer = !!_selectedOption;
      if (_haveSubmitAnswer) {
        this.haveSubmitAnswer = true;
        this.showAnalysis = true;
        this.selectedOption = _selectedOption;
      } else {
        this.showAnalysis = false;
        this.selectedOption = null;
        this.haveSubmitAnswer = false;
      }
    },
    getOptionClass(option) {
      // 根据用户的选择和正确答案返回相应的样式类
      if (this.haveSubmitAnswer && this.currentQuestion.answer !== option) {
        return 'incorrect-option';
      } else if (this.haveSubmitAnswer && this.currentQuestion.answer === option) {
        return 'correct-option';
      } else {
        return 'uncheck';
      }
    },
    // 上一题
    async prevQuestion() {
      this.currentQuestion = await apiHelper.getQuestionByIndex(--this.currentQuestionIndex);
      this.selectedOption = null;
      this.showSelectedOptionsAndAnalysis();

    },
    // 下一题
    async nextQuestion() {
      this.currentQuestion = await apiHelper.getQuestionByIndex(++this.currentQuestionIndex);
      this.selectedOption = null;
      this.showSelectedOptionsAndAnalysis();
    },
    // 确认答案
    submitAnswer() {
      if (this.selectedOption === null) {// 未作答
        notifyMessageHelper.showUnselectedMessage(this);
      } else {// 完成作答，显示解析，修改提交状态，进行答案判断
        this.haveSubmitAnswer = true;
        this.showAnalysis = true;
        vuexHelper.setAnswerRecord(
            {
              index: this.currentQuestionIndex,
              selectedOption: this.selectedOption
            });
        if (this.selectedOption === this.currentQuestion.answer) {
          notifyMessageHelper.showAnswerCorrectMessage(this)
        } else {
          notifyMessageHelper.showAnswerIncorrectMessage(this, this.currentQuestion.answer, this.selectedOption);
        }
      }
    },
    toggleFavorite() {
      if (!this.isFavorite) {//未收藏
        vuexHelper.addFavorite(this.currentQuestionIndex);
      } else {
        vuexHelper.deleteFavorite(this.currentQuestionIndex);
      }
    },
  },
  async mounted() {
    await dataHelper.refreshData();
    //获取题目
    this.currentQuestionIndex = vuexHelper.getAnswerRecord().length;
    this.currentQuestion = await apiHelper.getQuestionByIndex(this.currentQuestionIndex);

    window.addEventListener('unload', dataHelper.handleUnload);
  },
  beforeDestroy() {
    dataHelper.handleUnload();
    window.removeEventListener('unload', dataHelper.handleUnload);
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 10px;
}

::v-deep .el-radio__label {
  font-size: x-large;
}

.questionTitle {
  font-size: x-large;
  line-height: 2rem;
  margin-top: 0;
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

.fig {
  max-width: 100%;
  max-height: 350px;
  width: auto;
  height: auto;
}

.__button {
  width: 150px;
}

.analysis {
  background-color: #d5dada;
}

.analysis_inner {
  font-size: large;
}
</style>