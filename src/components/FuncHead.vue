<template>
  <div class="FuncHead flex">
    <div class="head_left" @click="$router.push('/')">
      <img
        class="left_arrow"
        src="@/assets/img/operatePage/left_arrow.png"
        alt=""
      /><span class="title">{{ activeProject.projectName }}</span>
    </div>
    <div class="func_area flex">
      <div
        class="func_item"
        v-for="(item, index) in headList"
        :key="index"
        @click="go(item.path)"
        :class="{
          func_item_active: $route.path.includes(item.path),
        }"
      >
        <span class="item_name">{{ item.name }}</span>
        <div v-if="$route.path.includes(item.path)" class="color_block"></div>
      </div>
    </div>
    <div class="export_btn flex" @click="$router.push('/exportPage')">
      <img src="@/assets/img/operatePage/export.png" alt="" /> 导出
    </div>
  </div>
</template>
              
        <script>
import { mapState } from "vuex";
export default {
  components: {},
  computed: {
    ...mapState(["activeProject"]),
  },
  data() {
    return {
      headList: [
        { name: "分镜制作", path: "/storyboard" },
        { name: "故事版", path: "/storyVersion" },
        { name: "拍摄计划", path: "/shootingPlan" },
        { name: "拍摄通告", path: "/shootingNotice" },
      ],
    };
  },
  methods: {
    go(path) {
      if (!this.$route.path.includes(path)) {
        this.$router.push(path);
      }
    },
  },
  created() {},
};
</script>
        <style lang="scss" scoped>
.FuncHead {
  width: 100%;
  height: 55px;
  border-bottom: 1px solid #eeeeee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 0 32px;
  .head_left {
    font-family: PingFang SC, PingFang SC;
    font-weight: 600;
    font-size: 16px;
    color: #3d3d3d;
    cursor: pointer;
    .left_arrow {
      width: 16px;
      height: 16px;
    }
    .title {
      margin-left: 16px;
    }
  }
  .func_area {
    .func_item {
      background: url("@/assets/img/operatePage/head_item_back.png") no-repeat
        center / 120px 55px;
      width: 120px;
      height: 55px;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 14px;
      color: #959595;
      cursor: pointer;
      .item_name {
        margin-top: 15px;
        margin-bottom: 3px;
      }
      .color_block {
        width: 20px;
        height: 6px;
        border-radius: 6px;
        background: #12db34;
      }
    }
    .func_item_active {
      color: #3d3d3d;
    }
  }
  .export_btn {
    width: 80px;
    height: 32px;
    background: #ffffff;
    border-radius: 54px;
    border: 1px solid #e4e5ee;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #3d3d3d;
    justify-content: center;
    cursor: pointer;
    img {
      width: 18px;
      height: 18px;
      margin-right: 5px;
    }
  }
}
</style>