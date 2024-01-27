<template>
  <div class="unauthorized-container">
    <h1 class="unauthorized-title">400 - 请求错误</h1>
    <p class="unauthorized-description">客户端发起了错误请求。</p>
  </div>
</template>

<script>

export default {
  methods:{
    toLogin(){
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.unauthorized-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
}

.unauthorized-title {
  font-size: 2em;
}

.unauthorized-description {
  font-size: 1.5em;
  margin-top: 10px;
}
.login{
  text-decoration: underline;
}
</style>
