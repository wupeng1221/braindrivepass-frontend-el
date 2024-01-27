<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
import {vuexHelper} from "@/utils/vuexHelper";
import {dataHelper} from "@/utils/dataHelper";
export default {
  methods: {
  },
  async mounted() {
    window.addEventListener('unload', dataHelper.handleUnload);
    await dataHelper.refreshData();
    // 增加监听器，监听收藏数量的变化，在这个页面内，如果收藏的数量变为0，跳转页面
    this.$store.watch(()=>vuexHelper.getFavorite().length, (newValue, oldValue)=>{
      if(oldValue ===1 && newValue ===0) {
        this.$router.push('/fav/empty')
      }
    });
    if (vuexHelper.getFavorite().length === 0) {
      this.$router.push('/fav/empty')
    } else {
      this.$router.push('/fav/not_empty')
    }
  },
  beforeDestroy() {
    dataHelper.handleUnload();
    window.removeEventListener('unload', dataHelper.handleUnload);
  }
}
</script>

