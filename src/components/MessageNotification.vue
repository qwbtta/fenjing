<template>
  <div @click="$emit('close')" class="MessageNotification">
    <div @click.stop class="main">
      <div class="head flex">
        <img
          class="close"
          @click="$emit('close')"
          src="@/assets/img/homePage/close_arrow.png"
          alt=""
        />
        <span class="main_title">消息通知</span>
      </div>
      <div class="main_list">
        <div class="list_left">
          <div
            class="left_item flex"
            :class="{ active_left_item: activeMenu == '协作' }"
            @click="activeMenu = '协作'"
          >
            <img src="@/assets/img/homePage/tips_1.png" alt="" /> 协作
          </div>
          <div
            class="left_item flex"
            :class="{ active_left_item: activeMenu == '公告' }"
            @click="activeMenu = '公告'"
          >
            <img src="@/assets/img/homePage/tips_2.png" alt="" />公告
          </div>
        </div>
        <div class="list_right">
          <div class="info_item" v-for="(item, index) in infoList" :key="index">
            <div class="title">{{ typeCheck(item.type) }}</div>
            <div class="info_main">{{ item.messageContent }}</div>
            <div
              v-if="item.type == 'MESSAGE_COLLABORATION'"
              class="btn_groups flex"
            >
              <div
                v-if="item.isApply == 0"
                class="btn btn1"
                @click="toMessageApply(item.id, '2')"
              >
                拒绝
              </div>
              <div
                v-if="item.isApply == 0"
                class="btn btn2"
                @click="toMessageApply(item.id, '1')"
              >
                同意
              </div>
              <div
                v-if="item.isApply == 2"
                class="btn btn1 not_allowed"
                style="margin-left: auto"
              >
                已拒绝
              </div>
              <div
                v-if="item.isApply == 1"
                class="btn btn2 not_allowed"
                style="margin-left: auto"
              >
                已同意
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
                  
  <script>
import { messageList, messageApply } from "@/assets/js/request";
export default {
  components: {},
  data() {
    return {
      activeMenu: "协作",
      infoList: [],
    };
  },
  watch: {
    activeMenu(newVal, oldVal) {
      if (newVal == "协作") {
        this.getList("MESSAGE_COLLABORATION");
      } else if (newVal == "公告") {
        this.getList("MESSAGE_ANNOUNCE");
      }
    },
  },
  methods: {
    typeCheck(type) {
      let obj = {
        MESSAGE_COLLABORATION: "联系人申请",
        MESSAGE_COLLABORATION_APPLY: "信息回复",
        MESSAGE_PROJECT_COLLABORATION: "项目协作",
        MESSAGE_ANNOUNCE: "公告",
      };
      return obj[type] || "公告";
    },
    getList(type) {
      let params = {
        type: type, //（消息类型---公告：MESSAGE_ANNOUNCE 协作 ： MESSAGE_COLLABORATION）
      };
      messageList(params).then((res) => {
        this.infoList = res.data;
      });
    },
    toMessageApply(id, type) {
      let params = {
        messageId: id,
        isApply: type, // (1同意  2拒绝)
      };
      messageApply(params).then((res) => {
        this.getList("MESSAGE_COLLABORATION");
      });
    },
  },
  created() {
    this.getList("MESSAGE_COLLABORATION");
  },
};
</script>
    <style lang="scss" scoped>
.MessageNotification {
  z-index: 99;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
  .main {
    width: 474px;
    height: 100%;
    background: #ffffff;
    margin-left: auto;
    .head {
      height: 60px;
      .close {
        width: 18px;
        height: 18px;
        margin-left: 22px;
        cursor: pointer;
      }
      .main_title {
        font-weight: 600;
        font-size: 16px;
        color: #3d3d3d;
        margin-left: 165px;
      }
    }
    .main_list {
      height: 100%;
      display: flex;
      .list_left {
        width: 104px;
        height: 100%;
        background: #f4f6f7;
        padding-top: 12px;
        .left_item {
          height: 37px;
          font-size: 14px;
          color: #3d3d3d;
          width: 100%;
          justify-content: center;
          margin-bottom: 8px;
          cursor: pointer;
          > img {
            width: 16px;
            height: 16px;
            margin-right: 10px;
          }
        }
        .active_left_item {
          background: #fff;
        }
      }
      .list_right {
        padding-left: 14px;
        .info_item {
          width: 345px;
          background: #f4f6f7;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 16px;
          .title {
            height: 25px;
            font-weight: 600;
            font-size: 18px;
            color: #3d3d3d;
            line-height: 25px;
          }
          .info_main {
            margin: 10px 0;
          }
          .btn_groups {
            justify-content: space-between;
            .btn {
              width: 150px;
              height: 38px;
              border-radius: 5px;
              text-align: center;
              line-height: 38px;
              font-weight: 500;
              font-size: 14px;
              cursor: pointer;
            }
            .btn1 {
              color: #767676;
              background: #ffffff;
              border: 1px solid #d8d8d8;
            }
            .btn2 {
              color: #ffffff;
              background: #12db34;
            }
            .not_allowed {
              cursor: not-allowed;
            }
          }
        }
      }
    }
  }
}
</style>