<template>
  <div class="shootingPlan">
    <FuncHead />
    <div class="main">
      <div class="head_row flex">
        <div class="flex">
          <span class="head_title">制定拍摄计划</span>
          <img
            class="tips"
            @click="showTips = !showTips"
            src="@/assets/img/operatePage/tips.png"
            alt=""
          />
          <div v-if="!activeProject.banEdit" @click="addPlan" class="new_shot">
            + 新建拍摄计划
          </div>
        </div>
        <!-- <div>放映模式</div> -->
      </div>
      <div class="main_con">
        <div class="unplanned_shots_con">
          <span class="tiltle"
            >未规划镜头{{ unplannedStoryboardList.length }}</span
          >
          <div class="shot_list">
            <div
              class="empty_shotList"
              v-if="unplannedStoryboardList.length == 0"
            >
              <img
                style="width: 57px; height: 50px"
                src="@/assets/img/operatePage/empty_tips.png"
                alt=""
              />
              <span>暂无未规划的镜头</span>
            </div>
            <draggable
              animation="300"
              :list="unplannedStoryboardList"
              group="items"
              class="shots_con"
              :draggable="!activeProject.banEdit"
            >
              <div
                class="shots_item"
                v-for="(item, index) in unplannedStoryboardList"
                :key="index"
                draggable="true"
              >
                <img
                  @click="
                    checkStory(item.rowId, !selectedStory.includes(item.rowId))
                  "
                  class="select_area"
                  :src="
                    !selectedStory.includes(item.rowId)
                      ? require('@/assets/img/operatePage/unselect.png')
                      : require('@/assets/img/operatePage/checked_green.png')
                  "
                  alt=""
                />

                <img
                  v-if="getValue(item.colObj, '画面')[0]?.fileUrl"
                  class="frameImg"
                  draggable="false"
                  :src="getValue(item.colObj, '画面')[0]?.fileUrl"
                  alt=""
                />
                <div v-else class="empty flex">未添加图片</div>
                <div class="shot_des">
                  <span class="index">镜头{{ item.sort }}</span
                  ><span class="content">
                    {{ getValue(item.colObj, "内容") }}</span
                  >
                </div>
              </div>
            </draggable>
          </div>
        </div>
        <div class="plan_list flex">
          <div
            class="plan_list_item"
            v-for="(item, index) in shootingList"
            :key="index"
          >
            <div class="row1 flex">
              <span>{{ item.planContent }}</span>
              <div v-if="!activeProject.banEdit" class="flex">
                <img
                  @click="edit(item)"
                  src="@/assets/img/operatePage/edit.png"
                  alt=""
                />
                <div class="more">
                  <img src="@/assets/img/operatePage/more.png" alt="" />
                  <div class="operation_panel">
                    <div
                      class="panel_item"
                      @click.stop="deleteShooting(item.id)"
                    >
                      删除
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row2 flex">
              <span v-if="item.startTime">{{
                dateTypeFormat("YYYY年mm月dd日", new Date(item.startTime))
              }}</span>
              <span v-if="item.startTime">{{
                dateTypeFormat("HH:MM", new Date(item.startTime))
              }}</span>
              <span v-if="item.dateType">{{ timeSlot[item.dateType] }}</span>
              <span>{{ scenerySlot[item.sceneryType] }}</span>
            </div>
            <div class="row2">{{ item.shootAdress }}</div>
            <div class="shot_list">
              <div class="empty_shotList" v-if="item.shotList.length == 0">
                <img src="@/assets/img/operatePage/dragTips.png" alt="" />
                <span> 你可以将未规划的静态拖到此处</span>
              </div>
              <draggable
                animation="300"
                :list="item.shotList"
                group="items"
                class="shots_con"
                :draggable="!activeProject.banEdit"
              >
                <div
                  class="shots_item flex"
                  v-for="(item2, index) in item.shotList"
                  :key="index"
                >
                  <img
                    @click="
                      checkStory(
                        item2.rowId,
                        !selectedStory.includes(item2.rowId)
                      )
                    "
                    class="select_area"
                    :src="
                      !selectedStory.includes(item2.rowId)
                        ? require('@/assets/img/operatePage/unselect.png')
                        : require('@/assets/img/operatePage/seleted.png')
                    "
                    alt=""
                  />

                  <img
                    v-if="getValue(item2.colObj, '画面')[0]?.fileUrl"
                    class="frameImg"
                    draggable="false"
                    :src="getValue(item2.colObj, '画面')[0]?.fileUrl"
                    alt=""
                  />
                  <div class="shot_des">
                    <span class="index">镜头{{ item2.sort }}</span
                    ><span class="content">
                      {{ getValue(item2.colObj, "内容") }}</span
                    >
                  </div>
                </div>
              </draggable>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedStory.length > 0" class="operation_area flex">
      <div class="operation_item flex">
        已选择{{ selectedStory.length }}个项目
      </div>
      <div class="operation_item show_list flex">
        <img src="@/assets/img/operatePage/move.png" alt="" />
        添加至
        <div class="transparent_back">
          <div class="shootingList">
            <div @click="toMovePlanSort()" class="shootingList_item">
              未规划的场景
            </div>
            <div
              v-for="(item, index) in shootingList"
              :key="index"
              @click="toMovePlanSort(item.id)"
              class="shootingList_item"
            >
              <span>场次</span>{{ item.planContent }}
            </div>
          </div>
        </div>
      </div>
      <div @click="selectedStory = []" class="operation_item flex">
        <img src="@/assets/img/operatePage/cancel.png" alt="" />
        取消选择
      </div>
    </div>
    <!-- <div v-if="showTips" class="bottom_tips flex">
      <div class="flex">
        <div class="aaa"></div>
        <div class="tips_1">
          <div class="special_font">关于预览故事板</div>
          <div>
            在故事板模式下，你可以用类似于连环画的形式浏览故事的完整性，并做出适当调整。
          </div>
        </div>
      </div>
      <div class="flex">
        <span class="tips_2">如果已经完成了分镜的制作，您可以</span>
        <div @click="$router.push('/shootingPlan')" class="router_btn flex">
          <span>预览故事版</span>
        </div>
        <img
          class="footer_close"
          @click="showTips = false"
          src="@/assets/img/operatePage/close.png"
          alt=""
        />
      </div>
    </div> -->
    <NewShootingPlan
      v-if="showShootingPlan"
      :editItem="editItem"
      :OperationType="OperationType"
      @close="closeShootingPlan"
    />
  </div>
</template>
            
<script>
import FuncHead from "@/components/FuncHead.vue";
import NewShootingPlan from "@/components/NewShootingPlan.vue";
import { mapState, mapMutations } from "vuex";
import draggable from "vuedraggable";
import { commonMethods } from "@/assets/js/mixin.js";
import {
  shootPlanList,
  deleteShootPlan,
  movePlanSort,
  updatePlanSort,
} from "@/assets/js/request";
import { dateTypeFormat } from "@/assets/js/methods";
import { timeSlot, scenerySlot } from "@/assets/js/data";
export default {
  components: { FuncHead, NewShootingPlan, draggable },
  computed: {
    ...mapState(["activeProject"]),
  },
  data() {
    return {
      storyboardHead: [], //表头
      storyboardList: [], //总分镜列表
      shootingList: [], //拍摄计划列表
      showShootingPlan: false,
      editItem: null, //编辑的计划
      OperationType: "", //"新建"或"编辑"
      showTips: false,
      selectedStory: [], //选中的分镜id
      timeSlot: timeSlot,
      scenerySlot: scenerySlot,
    };
  },
  mixins: [commonMethods],
  methods: {
    checkStory(rowId, toCheck) {
      if (toCheck) {
        this.selectedStory.push(rowId);
      } else {
        this.selectedStory.splice(this.selectedStory.indexOf(rowId), 1);
      }
    },
    toMovePlanSort(announcePlanId) {
      movePlanSort({
        mirrorId: this.selectedStory.join(","), //分镜id
        announcePlanId: announcePlanId, //拍摄计划id
      }).then((res) => {
        this.toGetMirrorList();
        this.selectedStory = [];
      });
    },
    addPlan() {
      this.OperationType = "新建";
      this.showShootingPlan = true;
    },
    edit(item) {
      this.editItem = item;
      this.OperationType = "编辑";
      this.showShootingPlan = true;
    },
    closeShootingPlan(e) {
      this.showShootingPlan = false;
      if (e) {
        this.getShootList();
      }
    },
    deleteShooting(id) {
      deleteShootPlan({
        id: id,
      }).then((res) => {
        this.getShootList();
      });
    },
    getShootList() {
      shootPlanList({
        projectId: this.activeProject.id,
        sortType: 1,
      }).then((res) => {
        this.shootingList = res.data;
      });
    },
    dateTypeFormat(format, time) {
      return dateTypeFormat(format, time);
    },
  },
  computed: {
    unplannedStoryboardList() {
      let tempList = [];
      for (let i = 0; i < this.storyboardList.length; i++) {
        if (!this.storyboardList[i].announcePlanId) {
          tempList.push(this.storyboardList[i]);
        }
      }
      for (let i = 0; i < this.shootingList.length; i++) {
        this.shootingList[i].shotList = [];
        for (let y = 0; y < this.storyboardList.length; y++) {
          if (
            this.storyboardList[y].announcePlanId == this.shootingList[i].id
          ) {
            this.shootingList[i].shotList.push(this.storyboardList[y]);
          }
        }
      }
      console.log(this.shootingList, "this.shootingList[i]");
      return tempList;
    },
  },
  created() {
    this.toGetMirrorList();
    this.getShootList();
  },
};
</script>
      <style lang="scss" scoped>
.shootingPlan {
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
        cursor: pointer;
      }
    }

    .main_con {
      margin-top: 32px;
      display: flex;
      align-items: flex-start;
    }
    .unplanned_shots_con {
      display: flex;
      flex-direction: column;
      background: #ffffff;
      border-radius: 10px;
      width: 400px;
      min-height: 181px;
      padding: 0 0 23px 16px;
      position: relative;
      margin-right: 20px;
      .tiltle {
        font-weight: 500;
        font-size: 16px;
        color: #3d3d3d;
        margin-top: 19px;
        margin-bottom: 4px;
      }
      .unplanned_shots_empty {
        width: 169px;
        height: 94px;
        background: #465651;
        position: absolute;
        top: 50px;
        left: 20px;
        margin-bottom: 20px;
      }
    }
    .shot_list {
      position: relative;
      margin-top: 5px;
      .empty_shotList {
        width: 328px;
        height: 136px;
        background: #ffffff;
        border-radius: 11px;
        border: 1px solid #e4e5ee;
        position: absolute;
        left: 0;
        top: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-weight: 500;
        font-size: 10px;
        color: #a2a2a2;

        > img {
          width: 107px;
          height: 55px;
          margin-top: 33px;
          margin-bottom: 21px;
        }
      }
      .shots_con {
        width: 362px;
        min-height: 136px;
        display: flex;
        flex-direction: column;
        overflow: auto;
        max-height: calc(100vh - 300px);
        .shots_item {
          display: flex;
          align-items: flex-start;
          margin-top: 20px;
          .select_area {
            width: 16px;
            height: 16px;
            align-self: center;
            margin-right: 13px;
            cursor: pointer;
          }
          .frameImg {
            width: 169px;
            height: 94px;
            flex-shrink: 0;
          }
          .empty {
            width: 169px;
            height: 94px;
            background: #f4f6f7;
            justify-content: center;
            font-weight: 500;
            font-size: 14px;
            color: #959595;
            flex-shrink: 0;
          }
          .shot_des {
            display: flex;
            flex-direction: column;
            margin-left: 14px;
            .index {
              font-weight: 400;
              font-size: 12px;
              color: #3d3d3d;
            }
            .content {
              font-weight: 500;
              font-size: 14px;
              color: #3d3d3d;
              overflow: hidden;
              white-space: nowrap;
              width: 145px;
            }
          }
        }
      }
    }

    .plan_list {
      align-items: flex-start;
      overflow: auto;
      height: calc(100vh - 162px);
      .plan_list_item {
        width: 362px;
        background: #ffffff;
        border-radius: 10px;
        margin: 0 20px;
        display: flex;
        flex-direction: column;
        padding: 20px 14px 16px 20px;
        &:first-of-type {
          margin-left: 0px;
        }
        .row1 {
          width: 100%;
          justify-content: space-between;
          font-weight: 500;
          font-size: 14px;
          color: #3d3d3d;
          img {
            width: 20px;
            margin-left: 18px;
            height: 20px;
            cursor: pointer;
          }
          .more {
            position: relative;

            &:hover {
              .operation_panel {
                display: block;
              }
            }
            cursor: pointer;
            .operation_panel {
              display: none;
              position: absolute;
              top: 24px;
              right: 0;
              width: 80px;
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
        }
        .row2 {
          font-weight: 500;
          font-size: 10px;
          color: #adadad;
          margin-top: 6px;
          > span {
            margin-right: 8px;
          }
        }
      }
    }
  }
  .operation_area {
    position: fixed;
    bottom: 60px;
    left: 50%;
    transform: translateX(-50%);
    width: 386px;
    height: 40px;
    background: #ffffff;
    border-radius: 54px;
    border: 1px solid #e4e5ee;
    padding: 0 20px;
    justify-content: space-between;
    .operation_item {
      justify-content: center;
      font-size: 14px;
      color: #3d3d3d;
      cursor: pointer;
      > img {
        width: 18px;
        height: 18px;
        margin-right: 6px;
      }
      .transparent_back {
        display: none;
        position: absolute;
        bottom: 25px;
        left: 50%;
        transform: translateX(-50%);
        padding-bottom: 20px;
      }
      .shootingList {
        background: #ffffff;
        box-shadow: 0px 1px 20px 0px rgba(0, 0, 0, 0.1);
        border-radius: 6px;
        padding: 0 12px;

        .shootingList_item {
          padding: 0 12px;
          height: 32px;
          border-bottom: 1px solid #dedede;
          word-break: keep-all;
          line-height: 32px;
          text-align: center;
          cursor: pointer;
          > span {
            margin-right: 10px;
          }
        }
      }
    }
    .show_list {
      &:hover {
        .transparent_back {
          display: block;
        }
      }
    }
  }
}
</style>