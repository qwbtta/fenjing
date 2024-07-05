<template>
  <div id="home">
    <Sidebar v-show="showSiderbar" />
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
    showSiderbar() {
      let temp = ["/UploadWorks", "/login"];
      return temp.includes(this.$route.path);
    },
  },
};
</script>

<style lang="scss" scoped>
#home {
  display: flex;
  justify-content: center;
  background: #f5f8f9;
  min-height: 100vh;
  min-width: 1920px;
  box-sizing: border-box;
}
</style>
