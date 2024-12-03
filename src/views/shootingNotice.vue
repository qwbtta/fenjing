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
        <div class="inner flex" @click="toShowPreFilled">
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
          <div class="color_block flex">未添加图片</div>
          <span class="title">{{ item.announceName }}</span>
          <div class="dateSelect_con flex">
            <span class="special">开机日期</span
            ><span class="dateSelect">{{
              dateTypeFormat("YYYY年mm月dd日", new Date(item.announceTime))
            }}</span>
            <div class="more">
              <img src="@/assets/img/homePage/more.png" alt="" />
              <div @click.stop class="operation_panel">
                <div class="panel_item" @click="deleteNotice(item)">删除</div>
              </div>
            </div>
            <img
              class="status"
              src="@/assets/img/operatePage/unexecuted.png"
              alt=""
            />
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
          <div class="color_block flex">未添加图片</div>
          <span class="title">{{ item.announceName }}</span>
          <div class="dateSelect_con flex">
            <span class="special">开机日期</span
            ><span class="dateSelect">{{
              dateTypeFormat("YYYY年mm月dd日", new Date(item.announceTime))
            }}</span>
            <div class="more">
              <img src="@/assets/img/homePage/more.png" alt="" />
              <div @click.stop class="operation_panel">
                <div class="panel_item" @click="deleteNotice(item)">删除</div>
              </div>
            </div>
            <img
              class="status"
              src="@/assets/img/operatePage/expired .png"
              alt=""
            />
          </div>
        </div>
      </div>
      <PreFilled
        v-if="showPreFilled"
        @close="showPreFilled = false"
        @getList="getShootAnnounceList()"
      />
    </div>
  </div>
</template>
            
      <script>
import FuncHead from "@/components/FuncHead.vue";
import PreFilled from "@/components/PreFilled.vue";
import { mapState, mapMutations } from "vuex";
import {
  shootAnnounceList,
  announceInfo,
  deleteShootAnnounce,
} from "@/assets/js/request";
import { dateTypeFormat } from "@/assets/js/methods";
export default {
  components: { FuncHead, PreFilled },
  data() {
    return {
      showPreFilled: false,
      unfinishedList: [],
      overdueList: [],
    };
  },
  computed: {
    ...mapState(["noticeList", "activeNotice", "activeProject"]),
  },
  methods: {
    ...mapMutations(["SET_NOTICELIST", "SET_ACTIVENOTICE"]),
    getShootAnnounceList() {
      shootAnnounceList({ projectId: this.activeProject.id }).then((res) => {
        this.overdueList = res.data.announced;
        this.unfinishedList = res.data.announcing;
      });
    },
    goNoticeSheet(item) {
      announceInfo({ announceId: item.id }).then((res) => {
        if (res.code == 200) {
          this.SET_ACTIVENOTICE(res.data);
          this.$router.push("/noticeSheet");
        } else {
          this.$message({
            message: "请求错误",
            type: "error",
          });
        }
      });
    },
    deleteNotice(item) {
      deleteShootAnnounce({
        id: item.id,
      }).then((res) => {
        this.getShootAnnounceList();
      });
    },
    dateTypeFormat(format, time) {
      return dateTypeFormat(format, time);
    },
    toShowPreFilled() {
      if (this.activeProject.banEdit) {
        this.$message({
          message: "当前无编辑权限",
          type: "error",
        });
        return;
      }
      this.showPreFilled = true;
    },
  },
  mounted() {
    console.log(this.noticeList, "noticeList");
    this.getShootAnnounceList();
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
          font-weight: 400;
          font-size: 14px;
          color: #3d3d3d;
        }
      }
    }
    .subtitle {
      margin-top: 30px;
      margin-bottom: 24px;
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
        position: relative;
        .color_block {
          width: 258px;
          height: 134px;
          background: #f4f6f7;
          justify-content: center;
          font-weight: 500;
          font-size: 14px;
          color: #959595;
          user-select: none;
        }
        .title {
          font-weight: 500;
          font-size: 14px;
          color: #3d3d3d;
          margin-top: 20px;
        }
        .dateSelect_con {
          font-weight: 500;
          font-size: 14px;
          color: #3d3d3d;
          margin-top: 17px;
          .special {
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
                font-weight: 400;
                font-size: 14px;
                color: #3d3d3d;
                height: 48px;
                line-height: 48px;
                cursor: pointer;
              }
            }
          }
          .status {
            width: 76px;
            height: 60px;
            position: absolute;
            right: 8px;
            bottom: 50px;
          }
        }
      }
    }
  }
}
</style>