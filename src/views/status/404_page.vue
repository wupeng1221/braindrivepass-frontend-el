<template>
  <div class="not-found-container">
    <h1 class="not-found-title">404 - 页面未找到</h1>
    <p class="not-found-description">抱歉，您访问的页面可能在另一个地方。</p>
  </div>
</template>

<style scoped>
.not-found-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh; /* 使容器占满整个视口高度 */
}

.not-found-title {
  font-size: 2em; /* 设置大字体 */
}

.not-found-description {
  font-size: 1.5em; /* 设置稍小字体 */
  margin-top: 10px; /* 可根据需要调整上边距 */
}
</style>
