<template>
  <div class="sidebar">
    <div class="logo"></div>
    <div class="devide_line"></div>

    <div
      @click="go(item, index)"
      class="menu_item"
      :class="{ menu_item_active: index == activeIndex }"
      v-for="(item, index) in menu_list"
      :key="index"
    >
      <img :src="item.url" alt="" />
      <span> {{ item.name }}</span>
    </div>
  </div>
</template>
  
  <script>
export default {
  data() {
    return {
      activeIndex: 0,
      menu_list: [
        {
          name: "项目",
          url: require("@/assets/img/homePage/menu_project.png"),
          path: "/",
          isActive: true,
        },
        {
          name: "联系人",
          url: require("@/assets/img/homePage/menu_contacts.png"),
          path: "/contacts",
          isActive: false,
        },
      ],
    };
  },
  methods: {
    go(item, index) {
      this.activeIndex = index;
      this.$router.push(item.path);
    },
  },
};
</script>
  
  <style lang="scss" scoped>
.sidebar {
  width: 100px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  border-right: 1px solid #e4e5ee;
  .logo {
    width: 70px;
    height: 70px;
    // background: #dedede;
  }
  .devide_line {
    width: 70px;
    height: 1px;
    background: #efefef;
    margin-bottom: 20px;
  }

  .menu_item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80px;
    height: 80px;
    border-radius: 8px;
    margin-bottom: 30px;
    cursor: pointer;
    img {
      width: 48px;
      height: 48px;
      margin-top: 7px;
    }

    span {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 14px;
      color: #3d3d3d;
      margin-top: 4px;
    }
  }
  .menu_item_active {
    background: #f4f6f7;
  }
}
</style>