<template>
  <div id="app">
    <div class="app_header" style="background-color: #b1bec9">
      <data-header></data-header>
    </div>
    <div class="app_content">
      <div class="app_nav">
        <side-nav></side-nav>
      </div>
      <div class="app_right">
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>Brain驾考</el-breadcrumb-item>
            <el-breadcrumb-item>{{ pathName }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <router-view></router-view>
        <p class="footer"> Copyright @ 2023-{{ new Date().getFullYear() }} BrainDrivePass. All Rights Reserved</p>
      </div>
    </div>

  </div>
</template>

<script>
import DataHeader from '@/components/common/DataHeader.vue'
import SideNav from '@/components/common/SideNav.vue'

export default {
  name: 'app',
  data() {
    return {
      pathName: this.$route.name,
    }
  },
  components: {
    DataHeader,
    SideNav,
  },
  watch: {
    '$route': function () {
      this.pathName = this.$route.name;
    }
  }
}
</script>

<style>

#app {
  height: 100%;
  margin: 0;
  display: flex;
  flex-flow: column;
}

.app_header {
  position: relative;
  flex: 0 0 auto;
  z-index: 2;

}

.app_header .title {
  margin-left: 16px;
  color: #fff;
}

.app_content {
  flex: 1;
  display: flex;
  flex-flow: row;
}

.app_nav {
  position: relative;
  flex: 0 0 280px;
  background: #EFF2F7;
}

.app_right {
  flex: 1;
  overflow: auto;
  padding: 20px;
}

.breadcrumb {
  padding-bottom: 20px;
  border-bottom: 1px solid #ddd;
}
.footer{
  color: #ababad;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>