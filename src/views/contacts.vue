<template>
  <div class="contacts">
    <div class="head flex">
      <div class="head_left flex"><span>我的联系人</span></div>
    </div>
    <div class="main">
      <div class="main_left">
        <div class="head_row flex">
          <span class="title">人员组织架构</span>
          <div class="tabbar flex">
            <div
              class="narmal_tab tab_left"
              :class="{ active_tab: 0 == activeTabIndex }"
              @click="activeTabIndex = 0"
            >
              人员
            </div>
            <div
              class="narmal_tab tab_right"
              :class="{ active_tab: 1 == activeTabIndex }"
              @click="activeTabIndex = 1"
            >
              组织
            </div>
          </div>
        </div>
        <div v-if="0 == activeTabIndex">
          <div class="sutitle">人员架构</div>
          <div class="add_btn">+ 添加联系人</div>
          <div class="cantact_type flex">
            <img src="@/assets/img/homePage/contacts_all.png" alt="" />
            <span>所有联系人</span>
          </div>
          <div class="cantact_type flex">
            <img src="@/assets/img/homePage/contacts_ungrouped.png" alt="" />
            <span>未分组联系人</span>
          </div>
          <div class="cantact_type flex">
            <img src="@/assets/img/homePage/contacts_group.png" alt="" />
            <span>创建的新联系人</span>
          </div>
        </div>
        <div v-if="1 == activeTabIndex">
          <div class="sutitle">组织架构</div>
          <div class="add_btn">+ 添加分组</div>
          <div class="cantact_type flex">
            <img src="@/assets/img/homePage/contacts_group.png" alt="" />
            <span>创建的分组</span>
          </div>
          <div class="cantact_type flex">
            <img src="@/assets/img/homePage/contacts_group.png" alt="" />
            <span>创建的分组2</span>
          </div>
        </div>
      </div>

      <div class="main_right">
        <span class="right_sutitle">当前视图：全部人员</span>
        <div class="form_list flex">
          <div class="form_head width300">姓名</div>
          <div class="form_head">所属项目组</div>
          <div class="form_head">最后操作时间</div>
          <div class="form_head">角色</div>
          <div class="form_head">邀请人</div>
        </div>
      </div>
    </div>
  </div>
</template>
    
    <script>
export default {
  data() {
    return {
      activeTabIndex: 0,
    };
  },
  methods: {},
};
</script>
    
    <style lang="scss" scoped>
.contacts {
  width: 100%;
  background: #fff;
  .head {
    width: 100%;
    height: 56px;
    background: #f4f6f7;
    padding-left: 26px;
    .head_left {
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 16px;
      color: #3d3d3d;
    }
  }
  .main {
    display: flex;
    height: calc(100% - 56px);
    .main_left {
      width: 250px;
      height: 100%;
      background: #ffffff;
      border-right: 1px solid #e4e5ee;
      padding-left: 26px;
      .head_row {
        margin-top: 20px;
        justify-content: space-between;
        .title {
          font-family: PingFang SC, PingFang SC;
          font-weight: 600;
          font-size: 16px;
          color: #3d3d3d;
        }
        .tabbar {
          margin-right: 6px;
          .narmal_tab {
            width: 35px;
            height: 20px;
            background: #f0f0f1;
            text-align: center;
            line-height: 18px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 10px;
            color: #959595;
            border: 1px solid #f0f0f1;
            cursor: pointer;
          }
          .active_tab {
            background: #ffffff;
            color: #12db34;
          }
          .tab_left {
            border-radius: 3px 0 0 3px;
          }
          .tab_right {
            border-radius: 0 3px 3px 0;
          }
        }
      }
      .sutitle {
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 12px;
        color: #646464;
        margin-top: 20px;
      }
      .add_btn {
        width: 207px;
        height: 34px;
        background: #ffffff;
        border-radius: 3px;
        border: 1px solid #12db34;
        text-align: center;
        line-height: 34px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 14px;
        color: #12db34;
        margin-top: 10px;
        margin-bottom: 16px;
        cursor: pointer;
      }
      .cantact_type {
        margin-bottom: 20px;
        cursor: pointer;
        > img {
          width: 16px;
          height: 16px;
          margin-right: 7px;
        }
        > span {
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          font-size: 14px;
          color: #3d3d3d;
        }
      }
    }
    .main_right {
      padding-left: 36px;
      display: flex;
      flex-direction: column;
      .right_sutitle {
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        font-size: 14px;
        color: #3d3d3d;
        margin-top: 30px;
        margin-bottom: 16px;
      }
      .form_list {
        .width300 {
          width: 300px;
        }
        .form_head {
          height: 46px;
          background: #f4f6f7;
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          font-size: 12px;
          color: #3d3d3d;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          width: 200px;
          padding-left: 20px;
          &:first-of-type {
            border-radius: 5px 0 0 5px;
          }
        }
      }
    }
  }
}
</style>