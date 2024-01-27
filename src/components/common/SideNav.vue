<template>
  <el-menu :default-active="topPath" class="el-menu-vertical-demo" active-text-color="#50b1ee" router>
    <el-menu-item index="/order">
      <template slot="title"><i class="el-icon-s-promotion"></i>顺序练习</template>
    </el-menu-item>
    <el-menu-item index="/random">
      <template slot="title"><i class="el-icon-tickets"></i>随机练习</template>
    </el-menu-item>

    <el-menu-item index="/exam">
      <template slot="title"><i class="el-icon-document-checked"></i>模拟考试</template>

    </el-menu-item>
    <el-menu-item index="/wrong">
      <template slot="title"><i class="el-icon-close"></i>错题记录</template>

    </el-menu-item>
    <el-menu-item index="/fav">
      <template slot="title"><i class="el-icon-star-off"></i>收藏记录</template>

    </el-menu-item>
    <el-menu-item index="/stats">
      <template slot="title"><i class="el-icon-data-analysis"></i>考试记录</template>
    </el-menu-item>
  </el-menu>
</template>
<script>

export default {
  computed: {
    topPath() {
      return '/' + this.$route.path.split('/')[1];
    }
  }
}
</script>