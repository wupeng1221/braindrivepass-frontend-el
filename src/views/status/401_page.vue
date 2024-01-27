<template>
  <div class="unauthorized-container">
    <h1 class="unauthorized-title">401 - 未经授权</h1>
    <p class="unauthorized-description">
      抱歉,您没有权限访问此页面。
    </p>
    <p class="unauthorized-description">
      可能是因为未登录、登录信息过期或者绕过网关发起请求。
    </p>
    <el-link @click="toLogin"><span class="login">点击跳转登录界面</span></el-link>
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
