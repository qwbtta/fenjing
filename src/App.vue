<template>
  <div id="home">
    <Sidebar v-if="showSidebar" />
    <router-view />
    <MessageNotification
      v-if="showMessageNotification"
      @close="showMessageNotification = false"
    />
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
import MessageNotification from "@/components/MessageNotification.vue";
import { mapState, mapMutations } from "vuex";
import bus from "@/assets/js/eventBus.js";
export default {
  components: {
    Sidebar,
    MessageNotification,
  },
  data() {
    return {
      showMessageNotification: false,
    };
  },
  computed: {
    ...mapState(["activeProject"]),
    showSidebar() {
      let temp = ["/", "/contacts"];
      return temp.includes(this.$route.path);
    },
  },
  methods: {
    ...mapMutations(["SET_ACTIVEPROJECT"]),
  },
  created() {
    let token = localStorage.getItem("token");
    if (!token) {
      this.$router.push("/login");
    }
    if (!this.activeProject.id) {
      let temp = JSON.parse(sessionStorage.getItem("activeProject"));
      if (temp) {
        this.SET_ACTIVEPROJECT(temp);
      }
    }

    bus.$off("showMessageNotification").$on("showMessageNotification", (e) => {
      this.showMessageNotification = e;
    });
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
