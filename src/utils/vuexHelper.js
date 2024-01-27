import store from "@/store/index";

export const vuexHelper = {
    // 获取登录用户名
    getLoginUsername() {
        return store.getters.loginUsername
    },
    // 获取收藏题目编号列表
    getFavorite() {
        return store.getters.favorite;
    },
    // 获取答题记录列表
    getAnswerRecord() {
        return store.getters.answerRecord
    },
    // 设置登录用户名
    setLoginUsername(loginUsername) {
        store.commit('setLoginUsername', loginUsername);
    },
    // 设置用户收藏列表
    setFavorite(favorite) {
        store.commit('setFavorite', favorite);
    },
    // 添加元素到用户收藏列表
    addFavorite(index) {
        store.commit('addFavorite', index);
    },
    // 从用户收藏列表删除元素
    deleteFavorite(index) {
        store.commit('deleteFavorite', index);
    },
    // 设置用户顺序答题记录(单个题目)
    setAnswerRecord({index, selectedOption}) {
        store.commit('setAnswerRecord', {index, selectedOption});
    },
    // 重置用户顺序答题记录(全部题目)
    resetAnswerRecord(answerRecord) {
        store.commit('resetAnswerRecord', answerRecord);
    },
    // 设置用户错题索引列表
    setWrongOrder(wrongOrder) {
        store.commit('setWrongOrder', wrongOrder);
    },
    // 获取用户错题索引列表
    getWrongOrder() {
        return store.getters.wrongOrder;
    },
    // 获取用户错题索引列表的元素
    deleteWrongOrder(index) {
        store.commit('deleteWrongOrder', index);
    },
    // 修改最后一次模拟考试的记录，可以设置为空，表示清除
    setLatestMockExamQuestions(latestMockExamQuestions) {
        store.commit('setLatestMockExamQuestions', latestMockExamQuestions);
    },
    // 获取最后一次模拟考试的记录
    getLatestMockExamQuestions(){
        return store.getters.latestMockExamQuestions;
    },
    // 修改最后一次模拟考试的剩余时间，可以设置为空，表示清除
    setTimeRemaining( _timeRemaining) {
        store.commit('setTimeRemaining', _timeRemaining);
    },
    // 获取最后一次模拟考试的剩余时间
    getTimeRemaining(){
        return store.getters.timeRemaining;
    },
}