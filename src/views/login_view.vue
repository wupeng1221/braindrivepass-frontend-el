<template>
  <div class="full-page">
    <el-container>
      <el-header class="header" height="150px">
          <h1 class="banner">🎉🎉🎉欢迎来到这个项目，可以通过下面的账号密码进行登录🎉🎉🎉</h1>
          <h1 class="banner">📖账号: test@wp.com&emsp;&emsp;&emsp;🔑密码: wupeng1221</h1>
      </el-header>
      <el-container>
        <el-aside class="aside" width="350px">
        </el-aside>
        <el-main style="height: 400px; padding:  0 0 0 0">
          <el-container>
            <el-aside width="600px">
              <img src="@/assets/loginpic.jpeg" style="display: flex" alt=""/>
            </el-aside>
            <el-main style="padding: 0 0 0 0">
              <el-form :model="form" :rules="rules" ref="form" label-width="30px">
                <el-form-item style="height: 60px"></el-form-item>
                <el-form-item prop="email">
                  <el-input type="text" v-model="form.email" placeholder="请输入登录的邮箱账号"
                            prefix-icon="el-icon-user" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input type="password" v-model="form.password" placeholder="请输入密码" prefix-icon="el-icon-key"
                            style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label-width="80px">
                  <!-- 忘记密码链接 -->
                  <router-link to="/forget_password" class="custom-link">忘记密码</router-link>
                  <!-- 用户注册链接 -->
                  <router-link to="/user_registry" class="custom-link">用户注册</router-link>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm" style="width: 250px">登录</el-button>
                </el-form-item>
              </el-form>
            </el-main>

          </el-container>

        </el-main>
      </el-container>

    </el-container>
  </div>

</template>
<script>
import {apiHelper} from "@/utils/apiHelper";
import {vuexHelper} from "@/utils/vuexHelper";

export default {
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      rules: {
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 8, max: 16, message: '密码长度在8到16个字符之间', trigger: 'blur'},
        ],
      },
    };
  },
  methods: {
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 表单验证通过，执行提交逻辑
          this.handleSubmission();
        } else {
          // 表单验证失败，不执行提交逻辑
        }
      });
    },
    async handleSubmission() {
      // 在这里处理表单提交逻辑
      const resp = await apiHelper.login(this.form.email, this.form.password);
      if (resp) {
        if (resp.data.code === 1) {
          // vuex存储登录信息
          vuexHelper.setLoginUsername(this.form.email)
          // 登录后跳转页面
          await this.$router.push('/order');
          // 登陆之后禁止返回
          history.pushState(null, null, document.URL);
          window.addEventListener("popstate", function () {
            history.pushState(null, null, document.URL)
          }, false);
        } else {
          this.$notify({
            type: 'error',
            title: '失败',
            message: resp.data.msg,
          });
          this.resetForm('form');
        }
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  }
}
</script>

<style scoped>
.full-page {
  width: 1450px;
  height: 600px;
}

.el-header {
  background-color: white;
}

.el-main {
  padding: 0 0 0 0;
  background-color: white;
}

.el-form {
  width: 300px;
  height: 400px;
  background-color: #a5a8af;
}

.aside {
  width: 300px;
  background-color: white;
}

.custom-link {
  margin-right: 20px; /* 超链接之间的右侧间距 */
  color: #1e5e96; /* 超链接颜色 */
  text-decoration: none; /* 去除下划线 */
  cursor: pointer;
}

.custom-link:hover {
  color: #50b1ee; /* 鼠标悬停时修改颜色 */
}

.banner {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>