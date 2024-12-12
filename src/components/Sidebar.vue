<template>
  <div class="sidebar">
    <div class="logo"></div>
    <div class="devide_line" style="margin-bottom: 12px"></div>

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
    <div
      class="devide_line"
      style="margin-top: auto; margin-bottom: 17px"
    ></div>
    <div class="column user_con">
      <img
        class="avatar"
        :src="
          userInfo.avatar || require('@/assets/img/homePage/default_avatar.png')
        "
        alt=""
      />
      <span class="nick_name">{{ userInfo?.nickname }}</span>
      <div class="transparent_back">
        <div class="panel">
          <div class="info_con flex">
            <img
              :src="
                userInfo.avatar ||
                require('@/assets/img/homePage/default_avatar.png')
              "
              alt=""
            />
            <span>{{ userInfo?.nickname }}</span>
          </div>
          <div class="devide_line"></div>
          <div class="item_row flex" @click="showInfoSet = true">
            <img src="@/assets/img/homePage/info_set.png" alt="" />
            账户设置
          </div>
          <div class="item_row flex" @click="toLogOut">
            <img src="@/assets/img/homePage/logOut.png" alt="" />
            退出登录
          </div>
        </div>
      </div>
    </div>
    <InfoSet
      v-if="showInfoSet"
      @close="
        showInfoSet = false;
        toGetUserInfo();
      "
    />
  </div>
</template>
  
  <script>
import { getUserInfo, loginOut } from "@/assets/js/request";
import InfoSet from "@/components/InfoSet.vue";
export default {
  components: {
    InfoSet,
  },
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
      userInfo: {},
      showInfoSet: false, //显示账号设置页面
    };
  },
  methods: {
    go(item, index) {
      if (this.$route.path == item.path) {
        this.$router.go(0);
        return;
      }
      this.$router.push(item.path);
    },
    toLogOut() {
      let token = localStorage.getItem("token");
      loginOut({ token: token }).then((res) => {
        localStorage.removeItem("token");
      });
      this.$router.push("/login");
    },
    toGetUserInfo() {
      let token = localStorage.getItem("token");
      if (token) {
        getUserInfo().then((res) => {
          this.userInfo = res.data;
        });
      }
    },
  },
  watch: {
    $route(newVal, oldVal) {
      for (let i = 0; i < this.menu_list.length; i++) {
        if (newVal.path == this.menu_list[i].path) {
          this.activeIndex = i;
        }
      }
    },
  },
  created() {
    this.toGetUserInfo();
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
      font-weight: 400;
      font-size: 14px;
      color: #3d3d3d;
      margin-top: 4px;
    }
  }
  .menu_item_active {
    background: #f4f6f7;
  }
  .user_con {
    align-items: center;
    position: relative;
    cursor: pointer;
    &:hover {
      .transparent_back {
        display: block;
      }
    }
    .avatar {
      width: 38px;
      height: 38px;
    }
    .nick_name {
      height: 14px;
      font-weight: 600;
      font-size: 10px;
      color: #adadad;
      line-height: 14px;
      margin-top: 8px;
      margin-bottom: 50px;
    }
    .transparent_back {
      display: none;
      position: absolute;
      top: -98px;
      right: -218px;
      padding-left: 44px;
    }
    .panel {
      width: 182px;
      height: 162px;
      background: #ffffff;
      box-shadow: 0px 1px 20px 0px rgba(0, 0, 0, 0.1);
      border-radius: 6px;
      z-index: 3;
      padding: 0 12px;
      .info_con {
        padding-top: 15px;
        > img {
          width: 38px;
          height: 38px;
          margin-right: 13px;
        }
        > span {
          font-weight: 600;
          font-size: 14px;
          color: #333333;
        }
      }
      .devide_line {
        width: 150px;
        height: 0px;
        border: 1px solid #efefef;
        margin: 16px 0;
      }
      .item_row {
        font-weight: 600;
        font-size: 14px;
        color: #3d3d3d;
        margin-bottom: 20px;
        cursor: pointer;
        > img {
          width: 16px;
          height: 16px;
          margin-left: 9px;
          margin-right: 12px;
        }
      }
    }
  }
}
</style>