<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>

import {vuexHelper} from "@/utils/vuexHelper";
import {apiHelper} from "@/utils/apiHelper";
import {dataHelper} from "@/utils/dataHelper";

export default {

  async mounted() {
    window.addEventListener('unload', dataHelper.handleUnload);
    await dataHelper.refreshData();
    // 增加监听器，监听收藏数量的变化，在这个页面内，如果收藏的数量变为0，跳转页面
    this.$store.watch(()=>vuexHelper.getWrongOrder().length, (newValue, oldValue)=>{
      if(oldValue === 1 && newValue === 0) {
        this.$router.push('/wrong/empty')
      }
    });
    const rightAnswer = await apiHelper.getRightAnswer();
    const answerRecord = vuexHelper.getAnswerRecord();
    // 初始化错题编号数组
    const wrongOrder = [];
    // 获取错题编号
    if (answerRecord !== null && answerRecord.length !== 0) {
      for (let i = 0; i < answerRecord.length - 1; i++) {
        if (answerRecord[i + 1] !== null && rightAnswer[i] !== answerRecord[i + 1]) {
          wrongOrder.push(i + 1);
        }
      }
      vuexHelper.setWrongOrder(wrongOrder);
    }
    if (vuexHelper.getWrongOrder().length === 0) {
      await this.$router.push('/wrong/empty')
    } else {
      await this.$router.push('/wrong/not_empty')
    }
  },
  beforeDestroy() {
    dataHelper.handleUnload();
    window.removeEventListener('unload', dataHelper.handleUnload);
  }
}
</script>

