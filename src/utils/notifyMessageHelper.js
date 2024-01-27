export const notifyMessageHelper = {
    //用户确认答案，作答正确显示正确的消息
    showAnswerCorrectMessage(_this) {
        _this.$message({
            message: '回答正确',
            type: "success",
        });
    },

    //用户确认答案，作答错误显示错误的消息
    showAnswerIncorrectMessage(_this, rightAnswer, selectedOption) {
        _this.$message({
            message: '回答错误!正确的选项是【' + rightAnswer + '】,你的回答是【' + selectedOption + '】',
            type: "error",
        })
    },

    //用户确认答案，但是还未作答
    showUnselectedMessage(_this) {
        _this.$message({
            message: '请先进行选择',
            type: 'error',
        })
    },

    // 顺序答题历史记录提示
    showByOrderHistory(_this, currentQuestionIndex) {
        _this.$message({
            type: 'info',
            message: '系统检测到你回答到第【' + currentQuestionIndex + '】题',
        });
    },

    // 用户成功保存进度
    showSaveProgressSuc(_this){
        _this.$message({
            type: 'success',
            message: '成功保存进度,保存进度可以防止出现浏览器缓存清除后没有历史记录的情况',
        })
    }

}