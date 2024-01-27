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
              :style="{ color : 'green'}">{{ wrongCount + 1 + "/" + vuexHelper.getWrongOrder().length}}</span></p>
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
          :disabled="wrongCount === 0"
          class="_button"
      >
        上一题
      </el-button>
      <el-button
          @click="nextQuestion"
          :disabled="wrongCount === vuexHelper.getWrongOrder().length - 1"
          class="_button"
      >
        下一题
      </el-button>
      <el-button @click="cancelWrong" class="_button">删除记录</el-button>
    </div>
    <div class="analysis">
      <h2>解析</h2>
      <div v-html="currentQuestion.analysis" class="analysis_inner"></div>
    </div>
  </div>
</template>
<script>
import {vuexHelper} from "@/utils/vuexHelper";
import {apiHelper} from "@/utils/apiHelper";

export default {
  data() {
    return {
      wrongCount: 0,
      currentQuestion: {star: null},
      currentQuestionIndex: null,
      selectedOption: null,
    };
  },
  computed: {
    vuexHelper() {
      return vuexHelper
    },
  },
  methods: {
    // 页面创建时，初始化随机数组作为题目索引
    async init() {
      this.currentQuestionIndex = vuexHelper.getWrongOrder()[this.wrongCount];
      this.currentQuestion = await apiHelper.getQuestionByIndex(this.currentQuestionIndex);
    },
    // 上一题
    async prevQuestion() {
      this.currentQuestionIndex = vuexHelper.getWrongOrder()[--this.wrongCount];
      this.currentQuestion = await apiHelper.getQuestionByIndex(this.currentQuestionIndex);
    },
    // 下一题
    async nextQuestion() {
      this.currentQuestionIndex = vuexHelper.getWrongOrder()[++this.wrongCount];
      this.currentQuestion = await apiHelper.getQuestionByIndex(this.currentQuestionIndex);
    },
    async cancelWrong() {
      // 取消错误记录，总的做题记录中将对应的答案设置为正确答案
      vuexHelper.setAnswerRecord({index: this.currentQuestionIndex, selectedOption: this.currentQuestion.answer});
      vuexHelper.deleteWrongOrder(this.currentQuestionIndex);
      // 如果 wrongIndices 中还有更多题目，跳转到下一题
      if (vuexHelper.getWrongOrder().length > 0) {
        // 如果当前题目不是最后一题
        if (this.wrongCount < vuexHelper.getWrongOrder().length) {
          this.currentQuestionIndex = vuexHelper.getWrongOrder()[this.wrongCount];
        } else {
          // 如果当前题目是最后一题，跳转到前一题
          this.wrongCount = vuexHelper.getWrongOrder().length - 1;
          this.currentQuestionIndex = vuexHelper.getWrongOrder()[this.wrongCount];
        }
        // 更新题目
        this.currentQuestion = await apiHelper.getQuestionByIndex(this.currentQuestionIndex);
      }
    },
    getOptionClass(option) {
      // 根据用户的选择和正确答案返回相应的样式类
      if (this.currentQuestion.answer !== option) {
        return 'incorrect-option';
      } else if (this.currentQuestion.answer === option) {
        return 'correct-option';
      } else {
        return 'uncheck';
      }
    },
  },
  mounted() {
    // 随机答题，每次都按照随机顺序加载题目，且不会保存任何的记录
    this.init();
  },

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

._button {
width: 150px;
}

.analysis {
background-color: #d5dada;
}

.analysis_inner {
font-size: large;
}
</style>