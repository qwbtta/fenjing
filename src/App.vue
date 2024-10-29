<template>
  <div id="home">
    <Sidebar v-show="showSidebar" />
    <router-view />
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
export default {
  components: {
    Sidebar,
  },
  computed: {
    showSidebar() {
      let temp = ["/", "/contacts"];
      return temp.includes(this.$route.path);
    },
  },
};
</script>

<style lang="scss" >
@import "@/assets/css/common.scss";
#home {
  display: flex;
  justify-content: center;
  background: #f5f8f9;
  height: 100%;
  min-width: 1440px;
}
</style>
