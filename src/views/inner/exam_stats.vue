<template>
  <div class="exam-history">
    <!-- 页面标题和通过率统计 -->
    <el-row>
      <h1 class="title">模拟考试历史记录</h1>
      <p class="pass-rate">通过率：{{ passRate }}%</p>
    </el-row>
    <!-- 表格 -->
    <el-table :data="examHistory" v-loading="!examHistory" style="width: auto">

      <!-- 时间列 -->
      <el-table-column prop="time" label="时间" width="300"></el-table-column>

      <!-- 分数列 -->
      <el-table-column prop="score" label="分数" width="200"></el-table-column>

      <!-- 是否通过列 -->
      <el-table-column label="是否通过" width="200">
        <template slot-scope="scope">
          <span :style="{ color: scope.row.pass ? 'green' : 'red' }">
            {{ scope.row.pass ? '通过' : '未通过' }}
          </span>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import math from 'math';
import {vuexHelper} from "@/utils/vuexHelper";
import {apiHelper} from "@/utils/apiHelper";

export default {
  data() {
    return {
      examHistory: [], // 存储模拟考试历史记录
      passRate: 0,    // 存储通过率
    };
  },
  methods: {

    // 将日期时间字符串格式化为指定格式
    formatDateTime(dateTimeString) {
      const date = new Date(dateTimeString);
      return new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(date);
    },

    // 从后端读取模拟考试记录
    async readExamRecord() {
      const records  = await apiHelper.readScore(vuexHelper.getLoginUsername());

      let passCount = 0;
      const recordsLength = records.length;

      for (const record of records) {
        const score = record.score;
        const pass = score >= 90;
        if (pass) passCount++;

        // 将记录添加到 examHistory 数组
        this.examHistory.push({
          time: this.formatDateTime(record.createTime),
          score: score,
          pass: pass
        });
      }
      // 计算通过率
      this.passRate = math.round((passCount / recordsLength) * 100);
    }
  },
  async mounted() {
    // 在组件挂载时读取模拟考试记录
    await this.readExamRecord();
  }
};
</script>

<style scoped>

/* 样式限定在组件范围内生效 */

.exam-history {
  max-width: 700px;
  margin: 0 auto;
}

/* 隔行背景色 */
.el-table--mini > tbody > tr:nth-child(even) {
  background-color: #f5f5f5;
}

/* 表头背景色 */
.el-table--mini > thead > tr {
  background-color: #409EFF;
  color: #fff;
}

/* 单元格文字居中 */
.el-table--mini > tbody > tr > td {
  text-align: center;
}

/* 页面标题样式 */
.title {
  font-size: x-large;
}
</style>