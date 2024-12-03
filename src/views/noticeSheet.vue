<template>
  <div class="noticeSheet">
    <div class="head flex">
      <img
        class="left_arrow"
        src="@/assets/img/operatePage/left_arrow.png"
        alt=""
        @click="$router.push('/shootingNotice')"
      />
      <span @click="$router.push('/shootingNotice')">编辑拍摄通告</span>
    </div>
    <div class="schedule">
      <div
        @click="activeIndex = index"
        v-for="(item, index) in stepList"
        class="step_item"
        :key="index"
        :class="{ step_item_active: index == activeIndex }"
      >
        <img
          class="finished"
          src="@/assets/img/operatePage/finished.png"
          alt=""
          v-if="index < activeIndex"
        />
        <div v-else class="num_block">{{ index + 1 }}</div>
        <span class="step_name">{{ item }}</span>
        <div
          v-if="index < stepList.length - 1"
          class="step_line"
          :class="{ step_line_active: index < activeIndex }"
        ></div>
      </div>
    </div>
    <div class="footer flex">
      <div class="footer_btn" @click="goPrevious" v-if="canGoPrevious">
        上一步
      </div>
      <div class="footer_btn" @click="goShootingNotice">
        {{ activeProject.banEdit ? "退出" : "存储并退出" }}
      </div>
      <div class="footer_btn" @click="goNext" v-if="canGoNext">下一步</div>
    </div>
    <NoticeCreate v-if="activeIndex == 0" />
    <NoticeImprove v-if="activeIndex == 1" />
    <NoticePlan v-if="activeIndex == 2" />
  </div>
</template>
            
<script>
import { mapState, mapMutations } from "vuex";
import NoticeCreate from "@/components/shootingNotice/NoticeCreate.vue";
import NoticeImprove from "@/components/shootingNotice/NoticeImprove.vue";
import NoticePlan from "@/components/shootingNotice/NoticePlan.vue";
import { updateShootAnnounce } from "@/assets/js/request";
export default {
  components: { NoticeCreate, NoticeImprove, NoticePlan },
  computed: {
    ...mapState(["noticeList", "activeNotice", "activeProject"]),
    canGoPrevious() {
      return this.activeIndex !== 0;
    },
    canGoNext() {
      return this.activeIndex !== this.stepList.length - 1;
    },
  },
  data() {
    return {
      stepList: ["创建通告", "完善通告", "计划与日程"],
      activeIndex: 0,
    };
  },
  methods: {
    ...mapMutations(["SET_NOTICELIST", "SET_ACTIVENOTICE"]),
    goShootingNotice() {
      if (!this.activeNotice.shootAnnounce.announceName) {
        this.$message({
          message: "请填写通告标题",
          type: "error",
        });
        return;
      }
      if (!this.activeNotice.shootAnnounce.announceTime) {
        this.$message({
          message: "请填写拍摄日期",
          type: "error",
        });
        return;
      }
      let params = this.activeNotice;
      // if (
      //   params.shootAnnounceMemberList.length == 1 &&
      //   !params.shootAnnounceMemberList[0].memberName &&
      //   !params.shootAnnounceMemberList[0].memberType
      // )
      //   params.shootAnnounceMemberList = [];
      // if (!params.shootGroupAnnounceList) params.shootGroupAnnounceList = [];
      // if (!params.shootAnnouncePlanList) params.shootAnnouncePlanList = [];
      // if (!params.shootAnnounceOtherPlanList)
      //   params.shootAnnounceOtherPlanList = [];
      if (this.activeProject.banEdit) {
        this.$router.push("/shootingNotice");
        return;
      }
      updateShootAnnounce(params).then((res) => {
        this.$router.push("/shootingNotice");
      });
    },
    goPrevious() {
      if (this.canGoPrevious) {
        this.activeIndex -= 1;
      }
    },
    goNext() {
      if (this.canGoNext) {
        this.activeIndex += 1;
      }
    },
  },
  created() {
    console.log(this.activeNotice, "this.activeNotice");
  },
};
</script><style lang="scss" scoped>
.noticeSheet {
  width: 100%;
  padding-top: 50px;
  background: #fff;
  .head {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    border-bottom: 1px solid #dedede;
    background: #fff;
    font-weight: 600;
    font-size: 16px;
    color: #3d3d3d;
    .left_arrow {
      width: 16px;
      height: 16px;
      margin-left: 28px;
      margin-right: 16px;
      cursor: pointer;
    }
    span {
      cursor: pointer;
    }
  }
  .schedule {
    width: 100%;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 28px;
    .step_item {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 200px;
      position: relative;
      cursor: pointer;
      &:last-of-type {
        margin-right: 0;
      }
      .finished {
        width: 30px;
        height: 30px;
      }
      .num_block {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        font-weight: 500;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.45);
        background: #f2f2f2;
        text-align: center;
        line-height: 30px;
      }
      .step_name {
        font-weight: 400;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        margin-top: 20px;
      }
      .step_line {
        position: absolute;
        top: 14px;
        left: 60px;
        width: 188px;
        height: 2px;
        background: #e8e8e8;
      }
      .step_line_active {
        background: #1890ff;
      }
    }
    .step_item_active {
      .num_block {
        background: #d1e9ff;
        color: #1890ff;
        border: 1px solid #1890ff;
        line-height: 28px;
      }
      .step_name {
        color: #1890ff;
      }
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80px;
    border-top: 1px solid #e4e5ee;
    justify-content: flex-end;
    .footer_btn {
      padding: 0 25px;
      height: 38px;
      background: #12db34;
      border-radius: 11px;
      text-align: center;
      line-height: 38px;
      margin-left: 16px;
      font-weight: 500;
      font-size: 14px;
      color: #ffffff;
      cursor: pointer;
      &:last-of-type {
        margin-right: 34px;
      }
    }
  }
}
</style>