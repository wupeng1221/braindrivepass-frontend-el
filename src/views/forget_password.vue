<template>
  <div class="full-page">
    <el-container style="height: 600px">
      <el-aside width="450px"></el-aside>
      <el-main>
        <h1 style="color: black; font-size: xx-large; width: 500px; height: 50px; padding-left: 150px">找回(修改)密码</h1>
        <el-form :model="form"
                 :rules="rules"
                 ref="form"
                 label-width="100px"
                 style="width: 500px;">
          <el-form-item style="width: 500px; height: 30px;"></el-form-item>
          <el-form-item label="邮箱" prop="email" class="input">
            <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" class="input">
            <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword" class="input">
            <el-input type="password" v-model="form.confirmPassword" placeholder="请确认密码"></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="verificationCode" class="input">
            <el-input v-model="form.verificationCode" placeholder="请输入验证码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm" style="width: 150px">提交</el-button>
            <el-button @click="sendVerifyCode" :disabled="disableSendButton" style="width: 190px">{{ getCode }}</el-button>
          </el-form-item>
          <el-form-item label-width="230px">
            <router-link to="/login" class="links">返回登录页面</router-link>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import {isEmail} from '@/validate/emailValidate';
import {apiHelper} from "@/utils/apiHelper";

export default {
  data() {
    const validateEmail = (rule, value, callback) => {
      // 如果验证失败，将 disableSendButton 设置为 true
      this.disableSendButton = !isEmail(value);
      callback();
    };
    return {
      form: {
        email: '',
        password: '',
        confirmPassword: '',
        verificationCode: '',
      },
      // 提示框
      msg: '',
      title: '失败',
      type: 'error',
      // 验证码
      disableSendButton: true, // 初始禁用发送验证码按钮
      emailValid: false, // 用于保存邮箱是否验证成功的状态
      getCode: '获取验证码',
      isGetting: false,
      count: 60,
      disable: false,
      failModify: '',
      rules: {
        email: [
          {required: true, message: '请输入邮箱', trigger: 'change'},
          {type: 'email', message: '请输入正确的邮箱格式', trigger: 'change'},
          {validator: validateEmail},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 8, max: 16, message: '密码长度在8到16个字符之间', trigger: 'blur'},
        ],
        confirmPassword: [
          {required: true, message: '请确认密码', trigger: 'blur'},
          {min: 8, max: 16, message: '密码长度在8到16个字符之间', trigger: 'blur'},
          {
            validator: (rule, value, callback) => {
              if (value !== this.form.password) {
                callback(new Error('两次输入的密码不一致'));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
        verificationCode: [
          {required: true, message: '请输入验证码', trigger: 'blur'},
          {pattern: /^\d{6}$/, message: '验证码必须为6位数字', trigger: 'blur'},
        ],
      },
    };
  },
  methods: {
    async updatePassword() {
      const resp = await apiHelper.submitUpdatePassword(this.form.email, this.form.password, this.form.verificationCode);
      if (resp.data.code === 1) {
        this.title = '成功';
        this.type = 'success';
        this.msg = "修改密码成功"
        this.showStatus();
      } else {
        this.title = '失败';
        this.type = 'error';
        this.msg = resp.data.msg;
        this.showStatus();
      }
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 表单验证通过，执行提交逻辑
          this.updatePassword();
        } else {
          // 表单验证失败，不执行提交逻辑
        }
      });
    },
    async sendVerifyCode() {
      const resp = await apiHelper.sendVerificationCode(this.form.email);
      if (resp.data.code === 1) {
        this.type = 'success';
        this.title = '成功';
        this.msg = "验证码成功发送到账号(对应的邮箱)，有效期2分钟，请及时查收";
        this.showStatus()
      }
      this.count = 60;
      this.disableSendButton = true;
      const countDown = setInterval(() => {
        if (this.count < 1) {
          this.isGetting = false
          this.disableSendButton = false
          this.getCode = '获取验证码'
          this.count = 60
          clearInterval(countDown);
        } else {
          this.isGetting = true;
          this.getCode = this.count-- + 's后重新发送';
        }
      }, 1000)
    },
    showStatus() {
      this.$notify({
        title: this.title,
        message: this.msg,
        type: this.type,
      });
    },
  },
};
</script>
<style scoped>
.input {
  width: 90%;
}

.links {
  text-decoration: underline; /* 添加下划线样式 */
  color: #1e5e96; /* 超链接颜色，可以根据需求调整 */
  cursor: pointer; /* 鼠标悬停时显示手型光标 */
}

.links:hover {
  color: #50b1ee; /* 鼠标悬停时修改颜色，可以根据需求调整 */
}

.el-header, .el-footer {
  background-color: #e4e4e8;
  color: #e4e4e8;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #e4e4e8;
  color: #e4e4e8;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e4e4e8;
  color: #e4e4e8;
  //text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.el-row {
  margin-bottom: 20px;


  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
  height: 100%;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.full-page{
  width: 1450px;
  height: 600px;
  overflow: auto;
  margin: auto;
  background-color: #e4e4e8;
}
</style>