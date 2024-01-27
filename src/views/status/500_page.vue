<template>
  <div class="internal-server-error-container">
    <h1 class="internal-server-error-title">500 - 服务器内部错误</h1>
    <p class="internal-server-error-description">抱歉，服务器遇到了意料之外的问题。请稍后再试。</p>
  </div>
</template>

<style scoped>
.internal-server-error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
}

.internal-server-error-title {
  font-size: 2em;
}

.internal-server-error-description {
  font-size: 1.5em;
  margin-top: 10px;
}
</style>
