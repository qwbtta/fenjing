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
          <div @click="addPlan" class="new_shot">+ 新建拍摄计划</div>
        </div>
        <!-- <div>放映模式</div> -->
      </div>
      <div class="main_con">
        <div class="unplanned_shots_con">
          <span class="tiltle">未规划镜头{{ storyboardList.length }}</span>
          <div class="shot_list">
            <div class="empty_shotList" v-if="storyboardList.length == 0">
              <img src="@/assets/img/operatePage/dragTips.png" alt="" />
              <span> 已经没有未规划的镜头了</span>
            </div>
            <draggable
              animation="300"
              :list="storyboardList"
              group="items"
              class="shots_con"
            >
              <div
                class="shots_item"
                v-for="(item, index) in storyboardList"
                :key="index"
                draggable="true"
              >
                <img
                  class="frameImg"
                  draggable="false"
                  :src="item.frame[0]"
                  alt=""
                />
                <div class="shot_des">
                  <span class="nums">{{ item.nums }}</span
                  ><span class="content">{{ item.content }}</span>
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
              <span>{{ item.shootingSessions }}</span>
              <div class="flex">
                <img
                  @click="edit(index)"
                  src="@/assets/img/operatePage/edit.png"
                  alt=""
                />
                <div class="more">
                  <img src="@/assets/img/operatePage/more.png" alt="" />
                  <div class="operation_panel">
                    <div class="panel_item" @click.stop="deleteShooting(index)">
                      删除
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row2 flex">
              <span v-if="item.dateSelect">{{ item.dateSelect }}</span>
              <span v-if="item.timeSelect">{{ item.timeSelect }}</span>
              <span v-if="item.timeSlotValue">{{ item.timeSlotValue }}</span>
              <span>{{ item.scenerySlotValue }}</span>
            </div>
            <div class="row2">{{ item.shootingLocation }}</div>
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
              >
                <div
                  class="shots_item flex"
                  v-for="(item2, index) in item.shotList"
                  :key="index"
                >
                  <img
                    class="frameImg"
                    draggable="false"
                    :src="item2.frame[0]"
                    alt=""
                  />
                  <div class="shot_des">
                    <span class="nums">{{ item2.nums }}</span
                    ><span class="content">{{ item2.content }}</span>
                  </div>
                </div>
              </draggable>
            </div>
          </div>
        </div>
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
        <div class="footer_close" @click="showTips = false">关闭</div>
      </div>
    </div> -->
    <NewShootingPlan
      v-if="showShootingPlan"
      :planIndex="planIndex"
      :OperationType="OperationType"
      @close="showShootingPlan = false"
    />
  </div>
</template>
            
      <script>
import FuncHead from "@/components/FuncHead.vue";
import NewShootingPlan from "@/components/NewShootingPlan.vue";
import { mapState, mapMutations } from "vuex";
import draggable from "vuedraggable";
export default {
  components: { FuncHead, NewShootingPlan, draggable },
  computed: {
    ...mapState(["shootingList"]),
  },
  data() {
    return {
      storyboardList: [
        //数据列表
        {
          id: 1,
          order: "0-order",
          nums: "0-nums",
          frame: [
            require("@/assets/img/card_1.png"),
            require("@/assets/img/card_2.png"),
          ],
          scenery: "中景",
          times: 3,
          content: "几点前几位带我去",
        },
        {
          id: 2,
          order: "1-order",
          nums: "1-nums",
          frame: [
            require("@/assets/img/card_3.png"),
            require("@/assets/img/card_4.png"),
          ],
          scenery: "远景",
          times: 2,
          content: "求稳的群无多七点前无",
        },
        {
          id: 3,
          order: "2-order",
          nums: "2-nums",
          frame: [
            require("@/assets/img/card_5.png"),
            require("@/assets/img/card_6.png"),
          ],
          scenery: "近景",
          times: 4,
          content: "带我去带我去分为",
        },
      ],
      listB: [
        { id: 3, name: "Item 3" },
        { id: 4, name: "Item 4" },
      ],
      showShootingPlan: false,
      planIndex: 0, //编辑的计划index值
      OperationType: "", //"新建"或"编辑"
      showTips: false,
    };
  },
  methods: {
    ...mapMutations(["SET_SHOOTINGLIST"]),
    addPlan() {
      this.OperationType = "新建";
      this.showShootingPlan = true;
    },
    edit(index) {
      this.planIndex = index;
      this.OperationType = "编辑";
      this.showShootingPlan = true;
    },
    deleteShooting(index) {
      this.shootingList.splice(index, 1);
      this.SET_SHOOTINGLIST(this.shootingList);
    },
  },
  created() {},
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
      .tiltle {
        font-family: PingFang SC, PingFang SC;
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
        font-family: PingFang SC, PingFang SC;
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
        width: 328px;
        min-height: 136px;
        display: flex;
        flex-direction: column;
        .shots_item {
          display: flex;
          align-items: flex-start;
          margin-top: 20px;
          .frameImg {
            width: 169px;
            height: 94px;
            margin-right: 14px;
          }
          .shot_des {
            display: flex;
            flex-direction: column;
            .nums {
              font-family: PingFang SC, PingFang SC;
              font-weight: 400;
              font-size: 12px;
              color: #3d3d3d;
            }
            .content {
              font-family: PingFang SC, PingFang SC;
              font-weight: 500;
              font-size: 14px;
              color: #3d3d3d;
            }
          }
        }
      }
    }

    .plan_list {
      flex-wrap: wrap;
      align-items: flex-start;
      .plan_list_item {
        width: 362px;
        background: #ffffff;
        border-radius: 10px;
        margin-right: 20px;
        display: flex;
        flex-direction: column;
        padding: 20px 14px 16px 20px;
        margin-left: 20px;
        .row1 {
          width: 100%;
          justify-content: space-between;
          font-family: PingFang SC, PingFang SC;
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
              top: -45px;
              left: 10px;
              width: 80px;
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
        .row2 {
          font-family: PingFang SC, PingFang SC;
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
}
</style>