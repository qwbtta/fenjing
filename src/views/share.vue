<template>
  <div class="share"></div>
</template>
                
          <script>
import { getProjectList, insertShareCooperation } from "@/assets/js/request";
export default {
  components: {},
  data() {
    return {};
  },
  methods: {},
  created() {
    getProjectList({
      sortType: 1,
      isDelete: "0",
    }).then((res) => {
      if (res.code == 401) {
        return;
      }

      insertShareCooperation({ flag: this.$route.query.flag }).then((res) => {
        if (res.code == 200) {
          this.$router.push("/");
        } else {
          this.$message({
            message: res.msg,
            type: "warning",
          });
          setTimeout(() => {
            this.$router.push("/");
          }, 1500);
        }
      });
    });
  },
};
</script>
  <style lang="scss" scoped>
</style>