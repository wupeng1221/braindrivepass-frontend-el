import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loginUsername: null,
    favorite: [],//记录用户收藏的题目
    answerRecord: [],//记录用户每道题的选项,每次确认选项之后更新
    wrongOrder: [],//错题本题目的索引
    latestMockExamQuestions:[],//最后一次模拟考试的题目记录
    timeRemaining:[],//最后一次模拟考试的剩余时间
  },
  getters: {
    loginUsername: function (state) {
      return state.loginUsername;
    },
    favorite: function (state) {
      return state.favorite;
    },
    answerRecord: function (state) {
      return state.answerRecord;
    },
    wrongOrder: function (state) {
      return state.wrongOrder;
    },
    latestMockExamQuestions: function (state){
      return state.latestMockExamQuestions;
    },
    timeRemaining: function (state){
      return state.timeRemaining;
    }
  },
  mutations: {
    // 设置登录用户名
    setLoginUsername(state, loginUsername) {
      state.loginUsername = loginUsername;
    },
    // 设置用户收藏列表
    setFavorite(state, favorite) {
      state.favorite = favorite;
    },
    // 添加元素到用户收藏列表
    addFavorite(state, index) {
      state.favorite.push(index);
    },
    deleteFavorite(state, index) {
      state.favorite = state.favorite.filter((_index) => _index !== index);
    },
    // 设置用户顺序答题记录(单个题目)
    setAnswerRecord(state, {index, selectedOption}) {
      state.answerRecord[index] = selectedOption;
    },
    // 重置用户顺序答题记录(全部题目)
    resetAnswerRecord(state, answerRecord) {
      state.answerRecord = answerRecord;
    },
    // 设置错题索引列表
    setWrongOrder(state, wrongOrder) {
      state.wrongOrder = wrongOrder;
    },
    // 删除错题索引列表的元素
    deleteWrongOrder(state, index) {
      state.wrongOrder = state.wrongOrder.filter((_index) => _index !== index);
    },
    // 修改最后一次模拟考试的记录，可以设置为空，表示清除
    setLatestMockExamQuestions(state, _latestMockExamQuestions) {
      state.latestMockExamQuestions = _latestMockExamQuestions;
    },
    // 修改最后一次模拟考试的剩余时间，可以设置为空，表示清除
    setTimeRemaining(state, _timeRemaining) {
      state.timeRemaining = _timeRemaining;
    }
  },
  actions: {},
  modules: {},
  plugins: [
    createPersistedState({
      storage: window.localStorage
    })
  ]
})
