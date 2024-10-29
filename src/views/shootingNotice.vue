<template>
  <div class="shootingNotice">
    <FuncHead />
    <div class="main">
      <div class="head_row flex">
        <div class="flex">
          <span class="head_title">发布拍摄通告</span>
          <!-- <img
            class="tips"
            @click="showTips = !showTips"
            src="@/assets/img/operatePage/tips.png"
            alt=""
          /> -->
        </div>
      </div>
      <div class="add_con flex">
        <div class="inner flex" @click="showPreFilled = true">
          <img src="@/assets/img/operatePage/add_2.png" alt="" /><span
            >创建通告</span
          >
        </div>
      </div>
      <div class="subtitle">待执行 {{ unfinishedList.length }}</div>
      <div class="notice_list">
        <div
          class="notice_item"
          v-for="(item, index) in unfinishedList"
          :key="index"
          @click="goNoticeSheet(item)"
        >
          <div class="color_block"></div>
          <span class="title">{{ item.form1.title }}</span>
          <div class="dateSelect_con flex">
            <span class="special">开机日期</span
            ><span class="dateSelect">{{ item.form1.dateSelect }}</span>
            <div class="more">
              <img src="@/assets/img/homePage/more.png" alt="" />
              <div class="operation_panel">
                <div class="panel_item" @click.stop="deleteNotice(item)">
                  删除
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="subtitle">已过期 {{ overdueList.length }}</div>
      <div class="notice_list">
        <div
          class="notice_item"
          v-for="(item, index) in overdueList"
          :key="index"
          @click="goNoticeSheet(item)"
        >
          <div class="color_block"></div>
          <span class="title">{{ item.form1.title }}</span>
          <div class="dateSelect_con flex">
            <span class="special">开机日期</span
            ><span class="dateSelect">{{ item.form1.dateSelect }}</span>
            <div class="more">
              <img src="@/assets/img/homePage/more.png" alt="" />
              <div class="operation_panel">
                <div class="panel_item" @click.stop="deleteNotice(item)">
                  删除
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PreFilled v-if="showPreFilled" @close="showPreFilled = false" />
    </div>
  </div>
</template>
            
      <script>
import FuncHead from "@/components/FuncHead.vue";
import PreFilled from "@/components/PreFilled.vue";
import { mapState, mapMutations } from "vuex";
export default {
  components: { FuncHead, PreFilled },
  data() {
    return {
      showPreFilled: false,
    };
  },
  computed: {
    ...mapState(["noticeList", "activeNotice"]),
    unfinishedList() {
      let now = Date.now().toString();
      let tempList = [];
      for (let i = 0; i < this.noticeList.length; i++) {
        if (this.noticeList[i].form1.timeStamp + 86400000 > now) {
          tempList.push(this.noticeList[i]);
        }
      }
      return tempList;
    },
    overdueList() {
      let now = Date.now().toString();
      let tempList = [];
      for (let i = 0; i < this.noticeList.length; i++) {
        if (this.noticeList[i].form1.timeStamp + 86400000 <= now) {
          tempList.push(this.noticeList[i]);
        }
      }
      return tempList;
    },
  },
  methods: {
    ...mapMutations(["SET_NOTICELIST", "SET_ACTIVENOTICE"]),
    goNoticeSheet(item) {
      this.SET_ACTIVENOTICE(item);
      this.$router.push("/noticeSheet");
    },
    deleteNotice(item) {
      for (let i = 0; i < this.noticeList.length; i++) {
        if (this.noticeList[i].id == item.id) {
          this.noticeList.splice(i, 1);
          break;
        }
      }
      this.SET_NOTICELIST(this.noticeList);
    },
  },
  mounted() {
    console.log(this.noticeList, "noticeList");
  },
};
</script>
      <style lang="scss" scoped>
.shootingNotice {
  width: 100%;
  background: #f4f6f7;
  .main {
    padding-left: 32px;
    .head_row {
      margin-top: 24px;
      justify-content: space-between;
      .head_title {
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        font-size: 24px;
        color: #3d3d3d;
      }
      .tips {
        width: 31px;
        height: 31px;
        margin: 0 12px;
        cursor: pointer;
      }
      .new_shot {
        width: 112px;
        height: 40px;
        background: #12db34;
        border-radius: 12px;
        text-align: center;
        line-height: 40px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 14px;
        color: #ffffff;
      }
    }
    .add_con {
      width: 275px;
      height: 154px;
      background: #ffffff;
      border-radius: 10px;
      justify-content: center;
      margin-top: 30px;
      .inner {
        width: 258px;
        height: 134px;
        background: #f4f6f7;
        justify-content: center;
        cursor: pointer;
        img {
          width: 18px;
          height: 18px;
          margin-right: 4px;
        }
        span {
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          font-size: 14px;
          color: #3d3d3d;
        }
      }
    }
    .subtitle {
      margin-top: 30px;
      margin-bottom: 24px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 16px;
      color: #3d3d3d;
    }
    .notice_list {
      display: flex;
      flex-wrap: wrap;
      .notice_item {
        width: 275px;
        height: 230px;
        background: #ffffff;
        border-radius: 10px;
        margin-right: 40px;
        margin-bottom: 40px;
        display: flex;
        flex-direction: column;
        padding: 9px;
        .color_block {
          width: 258px;
          height: 134px;
          background: #f4f6f7;
        }
        .title {
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          font-size: 14px;
          color: #3d3d3d;
          margin-top: 20px;
        }
        .dateSelect_con {
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          font-size: 14px;
          color: #3d3d3d;
          margin-top: 17px;
          .special {
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 12px;
            color: #959595;
            flex-shrink: 0;
            margin-right: 10px;
          }
          .dateSelect {
            width: 100%;
          }
          .more {
            width: 20px;
            height: 20px;
            position: relative;
            > img {
              width: 20px;
              height: 20px;
            }
            &:hover {
              .operation_panel {
                display: block;
              }
            }
            cursor: pointer;
            .operation_panel {
              display: none;
              position: absolute;
              top: 20px;
              left: 0;
              width: 100px;
              background: #ffffff;
              box-shadow: 0px 1px 20px 0px rgba(0, 0, 0, 0.1);
              border-radius: 6px;
              z-index: 3;
              padding: 0 13px 0 25px;
              .panel_item {
                font-family: PingFang SC, PingFang SC;
                font-weight: 400;
                font-size: 14px;
                color: #3d3d3d;
                height: 48px;
                line-height: 48px;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
}
</style>