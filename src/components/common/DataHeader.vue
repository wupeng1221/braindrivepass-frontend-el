<template>
  <div>
    <el-container>
      <el-header height="50px" class="header">
        Brain驾考
        <div class="block">
          <el-link icon="el-icon-edit" class="link" @click="updatePass">修改密码</el-link>
          <el-link icon="el-icon-setting" class="link" @click="logout">退出登录</el-link>
        </div>
      </el-header>
    </el-container>
  </div>
</template>
<script>
import {vuexHelper} from "@/utils/vuexHelper";
import {dataHelper} from "@/utils/dataHelper";
import {apiHelper} from "@/utils/apiHelper";

export default {
  methods: {
    updatePass() {
      this.$router.push('/forget_password')
    },
    logout() {
      apiHelper.logout().then(() => {
        
        sessionStorage.clear();
        vuexHelper.setLoginUsername("");
        this.$router.push('/login');
        // 退出后禁止返回
        history.pushState(null, null, document.URL);
        window.addEventListener("popstate", function () {
          history.pushState(null, null, document.URL)
        }, false);
      })
    },
  },
  mounted() {
    window.addEventListener('unload', dataHelper.handleUnload);
  },
  beforeDestroy() {
    this.handleUnload();
    window.removeEventListener('unload', dataHelper.handleUnload);
  }
}
</script>


<style scoped>
.header {
  background-color: #cbd3dc;
  font-size: 24px;
  color: black;
  flex: auto;
  align-items: center;
  display: flex;
}

.link {
  margin-right: 20px;
}

.block {
  margin-left: auto;
}
</style>
