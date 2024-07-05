<template>
  <div class="sidebar">
    <div class="logo"></div>
    <div class="devide_line"></div>

    <div class="menu_item" v-for="(item, index) in menu_list" :key="index">
      <img src="@/assets/logo.png" alt="" />
      <span> {{ item.name }}</span>
    </div>
  </div>
</template>
  
  <script>
export default {
  data() {
    return {
      menu_list: [
        {
          name: "项目",
          class: "workbench",
          activeClass: "workbench_active",
          path: "/",
          isActive: true,
        },
        {
          name: "联系人",
          class: "miniProgram",
          activeClass: "miniProgram_active",
          path: "",
          isActive: false,
        },
      ],
    };
  },
  methods: {},
};
</script>
  
  <style lang="scss" scoped>
.sidebar {
  width: 90px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  .logo {
    width: 70px;
    height: 70px;
    background: #dedede;
  }
  .devide_line {
    width: 50px;
    height: 1px;
    background: rgb(237, 240, 245);
    margin-bottom: 20px;
  }

  .menu_item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 70px;
    height: 70px;
    margin-bottom: 20px;
    img {
      width: 40px;
      height: 40px;
    }
    span {
    }
  }
}
</style>