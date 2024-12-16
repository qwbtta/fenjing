<template>
  <div class="home">
    <div class="head_row">
      <span class="title">我的项目</span>
      <div class="img_btn flex" @click="showMessageNotification">
        <img src="@/assets/img/homePage/message.png" alt="" />
      </div>
    </div>
    <div class="sort_area flex">
      <span class="subtitle">排序</span>
      <div class="sort_type" id="sortType" @click="checkShowSortPanel">
        {{ sortType[0] == 0 ? "创建时间" : "修改时间" }}
        <div
          v-show="showSortPanel"
          id="sortPanel"
          @click.stop
          class="sort_panel"
        >
          <div class="sort_row flex" @click="changeSort(0, 0)">
            <img
              v-if="sortType[0] == 0"
              src="@/assets/img/operatePage/checked_green.png"
              alt=""
            />
            <span>创建时间</span>
          </div>
          <div class="sort_row flex" @click="changeSort(0, 1)">
            <img
              v-if="sortType[0] == 1"
              src="@/assets/img/operatePage/checked_green.png"
              alt=""
            />
            <span>修改时间</span>
          </div>
          <div class="devide_line"></div>
          <div class="sort_row flex" @click="changeSort(1, 0)">
            <img
              v-if="sortType[1] == 0"
              src="@/assets/img/operatePage/checked_green.png"
              alt=""
            />
            <span>从早到晚</span>
          </div>
          <div
            class="sort_row flex"
            @click="changeSort(1, 1)"
            style="margin-bottom: 0"
          >
            <img
              v-if="sortType[1] == 1"
              src="@/assets/img/operatePage/checked_green.png"
              alt=""
            />
            <span>从晚到早</span>
          </div>
        </div>
      </div>
    </div>

    <div class="project_list">
      <div class="normal_item project_add">
        <img
          class="item_img"
          src="@/assets/img/homePage/create.png"
          alt=""
          @click="showCreateConfrim = true"
        />
        <span class="project_title ellipsis">创建新项目/组</span>
        <div class="mask">
          <div class="mask_item flex" @click="showCreateConfrim = true">
            <img
              src="@/assets/img/homePage/create_project.png"
              alt=""
            />创建新项目
          </div>
          <div class="mask_item flex" @click="createGroup">
            <img src="@/assets/img/homePage/create_group.png" alt="" />创建组
          </div>
        </div>
      </div>
      <!-- 小组 -->
      <div
        class="normal_item group_item"
        v-for="(item, index) in projectGroup"
        :key="item.id + 'Group'"
        :data-id="item.id"
        @dragenter.prevent
        @dragover.prevent
        @dragleave.prevent
        @drop.prevent="dropFiles($event)"
      >
        <div :data-id="item.id" v-if="!!dragItemId" class="isDraging"></div>
        <div class="project_contain">
          <img
            class="project_icon_inner"
            v-for="(item2, index2) in item.dataList.slice(0, 4)"
            :key="index2"
            src="@/assets/img/homePage/project.png"
            alt=""
          />
          <div v-if="item.dataList.length > 0" class="group_project_list">
            <div
              class="group_project_item flex"
              v-for="(item2, index2) in item.dataList"
              :key="index2"
            >
              <img
                class="project_icon"
                src="@/assets/img/homePage/project.png"
                alt=""
              />
              <div class="info_con">
                <span class="info_title">{{ item2.projectName }}</span>
                <span class="info_subtitle"
                  >创建于{{ getTime(item2.createTime) }}</span
                >
              </div>

              <div class="more">
                <img src="@/assets/img/homePage/more.png" alt="" />
                <div class="transparent_back">
                  <div class="operation_panel">
                    <div
                      class="panel_item"
                      @click.stop="goRename('项目', item2)"
                    >
                      重命名
                    </div>
                    <div class="panel_item" @click.stop="copyProject(item2)">
                      复制分镜到新项目
                    </div>
                    <div class="panel_item" @click.stop="deleteProject(item2)">
                      移到回收站
                    </div>
                    <div class="panel_item" @click.stop="moveProject(item2.id)">
                      移出组
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <span class="project_title ellipsis">{{ item.projectName }}</span>
        <div class="project_subtitle flex">
          包含{{ item.dataList.length }}个项目
          <div class="operation_area">
            <img class="more" src="@/assets/img/homePage/more.png" alt="" />
            <div class="transparent_back">
              <div class="operation_panel">
                <div class="panel_item" @click.stop="goRename('组', item)">
                  重命名
                </div>
                <div class="panel_item" @click.stop="deleteGroup(index)">
                  删除组
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 小组 -->
      <!-- 项目 -->
      <div
        :draggable="!item.isCooperation"
        @dragstart="dragStart($event)"
        @dragend="dragEnd($event)"
        :data-id="item.id"
        class="normal_item"
        v-for="item in projectList"
        :key="item.id"
        @click="goStoryboard(item)"
      >
        <img
          draggable="false"
          class="item_img"
          src="@/assets/img/homePage/project.png"
          alt=""
        />
        <span class="project_title ellipsis"
          >{{ item.projectName
          }}<span v-if="item.isCooperation">(协作项目)</span></span
        >
        <div class="project_subtitle flex">
          创建于{{ getTime(item.createTime) }}
          <div class="operation_area">
            <img class="more" src="@/assets/img/homePage/more.png" alt="" />
            <div class="transparent_back">
              <div v-if="item.unauthorized" class="operation_panel">
                <div
                  class="panel_item"
                  style="border: unset"
                  @click.stop="exitProject(item)"
                >
                  退出项目
                </div>
              </div>
              <div v-else class="operation_panel">
                <div class="panel_item" @click.stop="goRename('项目', item)">
                  重命名
                </div>
                <div class="panel_item" @click.stop="copyProject(item)">
                  复制分镜到新项目
                </div>
                <div class="panel_item" @click.stop="deleteProject(item)">
                  移入回收站
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 项目 -->
      <div class="recycle_bin" @click="showRecycleBin = true">
        <div class="color_back flex">
          <img src="@/assets/img/homePage/recycle_bin.png" alt="" />
        </div>
        <span>回收站</span>
      </div>
    </div>
    <Rename
      v-if="showRename"
      :renameType="renameType"
      :renameData="renameItem"
      @close="showRename = false"
      @confirm="renameConfirm"
    />
    <CreateConfrim
      v-if="showCreateConfrim"
      @close="showCreateConfrim = false"
      @confirm="createProject"
    />
    <RecycleBin
      v-if="showRecycleBin"
      @close="
        showRecycleBin = false;
        getProjectList();
      "
      :projectList="projectList"
    />
  </div>
</template>

<script>
import {
  getProjectList,
  creatProjectGroup,
  deleteProjectGroup,
  creatProject,
  deleteProject,
  copyProject,
  moveProjectToGroup,
  outProject,
} from "@/assets/js/request";
import bus from "@/assets/js/eventBus.js";
import Rename from "@/components/Rename.vue";
import CreateConfrim from "@/components/CreateConfrim.vue";
import RecycleBin from "@/components/RecycleBin.vue";
import { mapState, mapMutations } from "vuex";
export default {
  name: "HomeView",
  components: { Rename, CreateConfrim, RecycleBin },

  data() {
    return {
      sortType: [0, 0], //第一项 0-创建时间 1-修改时间 第二项0-从早到晚 第二项1-从晚到早
      showSortPanel: false, //排序弹窗
      projectGroup: [], //组列表
      projectList: [], //项目列表
      dragItemId: "", //当前拖拽元素
      showRename: false, //重命名组件
      showRecycleBin: false, //回收站组件
      showCreateConfrim: false, //新建确认组件
      renameType: "项目", //"项目"/"组"
      renameItem: null,
    };
  },
  methods: {
    ...mapMutations(["SET_ACTIVEPROJECT"]),
    showMessageNotification() {
      bus.$emit("showMessageNotification", true);
    },
    dropFiles(e) {
      for (let i = 0; i < this.projectList.length; i++) {
        if (this.projectList[i].id == this.dragItemId) {
          for (let y = 0; y < this.projectGroup.length; y++) {
            if (this.projectGroup[y].id == e.target.dataset.id) {
              this.moveProject(this.projectList[i].id, this.projectGroup[y].id);
              // this.projectGroup[y].dataList.push(this.projectList[i]);
              // this.projectList.splice(i, 1);
              break;
            }
          }
        }
      }
      this.dragItemId = "";
    },
    dragStart(e) {
      this.dragItemId = e.target.dataset.id;
    },
    dragEnd() {
      this.dragItemId = "";
    },
    changeSort(index, value) {
      this.$set(this.sortType, index, value);
      this.getProjectList();
    },
    checkShowSortPanel() {
      this.showSortPanel = !this.showSortPanel;
      let _this = this;
      function listen(e) {
        const sortPanel = document.getElementById("sortPanel");
        const sortType = document.getElementById("sortType");
        // 如果点击的区域不在弹框内部;
        if (!sortPanel.contains(e.target) && e.target !== sortType) {
          // 隐藏弹框
          _this.showSortPanel = false;
          document.removeEventListener("click", listen);
        }
      }
      if (this.showSortPanel) {
        document.addEventListener("click", listen);
      } else {
        document.removeEventListener("click", listen);
      }
    },
    getTime(timestamp) {
      const date = new Date(timestamp);
      let MM =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      let DD = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      let hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      let mm =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      return `${MM}-${DD} ${hh}:${mm}`;
    },
    getProjectList() {
      let arr = [
        [1, 2],
        [3, 4],
      ];
      let sortType = arr[this.sortType[0]][this.sortType[1]];
      getProjectList({
        sortType: sortType,
        isDelete: "0",
      }).then((res) => {
        let tempProjectList = [];
        let tempProjectGroup = [];
        //得到组/文件夹列表
        for (let i = 0; i < res.data.length; i++) {
          if (1 == res.data[i].projectType) {
            res.data[i].dataList = [];
            tempProjectGroup.push(res.data[i]);
          }
        }
        // 写两个循环是因为 在这个接口返回的数据结构下 判断文件属于哪个文件夹时 如果写在一个循环里  会造成文件夹数组还没有读完 文件归属判断出问题
        //文件
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].isCooperation) {
            res.data[i].unauthorized = true;
          }
          //没有放入组内的文件
          if (0 == res.data[i].projectType) {
            if (0 == res.data[i].parentId || !res.data[i].parentId) {
              tempProjectList.push(res.data[i]);
            } else {
              //放入组内的文件
              for (let y = 0; y < tempProjectGroup.length; y++) {
                if (tempProjectGroup[y].id == res.data[i].parentId) {
                  tempProjectGroup[y].dataList.push(res.data[i]);
                }
              }
            }
          }
        }
        this.projectGroup = tempProjectGroup;
        this.projectList = tempProjectList;
      });
    },
    //创建项目
    createProject(data) {
      creatProject({
        projectName: data.name,
        modelId: data.modelId,
      }).then((res) => {
        this.getProjectList();
        this.errorHandle(res);
      });
    },
    //创建组
    createGroup() {
      creatProjectGroup().then((res) => {
        this.getProjectList();
        this.errorHandle(res);
      });
    },
    //移出组
    removeGroup() {},
    moveProject(projectId, parentId = 0) {
      let params = {
        projectId: projectId,
        parentId: parentId,
      };
      console.log(params);
      moveProjectToGroup(params).then((res) => {
        this.getProjectList();
      });
    },
    //删除项目
    deleteProject(item) {
      deleteProject({
        ids: item.id,
      }).then((res) => {
        this.getProjectList();
        this.errorHandle(res);
      });
    },
    //删除组
    deleteGroup(index) {
      deleteProjectGroup({
        ids: this.projectGroup[index].id,
      }).then((res) => {
        this.errorHandle(res);
        this.getProjectList();
      });
    },
    //复制项目
    copyProject(item) {
      copyProject({
        projectId: item.id,
      }).then((res) => {
        this.getProjectList();
        this.errorHandle(res);
      });
    },
    exitProject(item) {
      outProject({ forId: item.id }).then((res) => {
        this.errorHandle(res);
        this.getProjectList();
      });
    },
    errorHandle(res) {
      if (res.code != 200) {
        this.$message({
          message: res.msg,
          type: "error",
        });
      } else {
        this.$message({
          message: "操作成功",
          type: "success",
        });
      }
    },
    //打开重命名
    goRename(renameType, item) {
      this.renameType = renameType;
      this.renameItem = item;
      this.showRename = true;
    },
    //确认重命名
    renameConfirm() {
      this.getProjectList();
      this.showRename = false;
    },

    goStoryboard(item) {
      item.banEdit = item.isCooperation && item.permission == "CHECK";
      this.SET_ACTIVEPROJECT(item);
      this.$router.push("/storyboard");
      sessionStorage.setItem("activeProject", JSON.stringify(item));
    },
  },
  created() {
    let token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    this.getProjectList();
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
.home {
  width: 100%;
  background: #f4f6f7;
  padding-left: 26px;
  .recycle_bin {
    position: fixed;
    right: 32px;
    bottom: 30px;
    cursor: pointer;
    .color_back {
      width: 32px;
      height: 32px;
      background: #ffffff;
      box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      justify-content: center;
      > img {
        width: 18px;
        height: 18px;
        margin-bottom: 2px;
      }
    }
    > span {
      height: 14px;
      font-family: Source Han Sans, Source Han Sans;
      font-size: 10px;
      color: #3d3d3d;
      line-height: 14px;
    }
  }
  .head_row {
    display: flex;
    align-items: center;
    margin-top: 10px;
    height: 32px;
    padding-right: 28px;
    .title {
      font-weight: 600;
      font-size: 16px;
      color: #3d3d3d;
    }
    .img_btn {
      width: 32px;
      height: 32px;
      background: #ffffff;
      box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.1);
      border-radius: 54px 54px 54px 54px;
      justify-content: center;
      margin-left: auto;
      cursor: pointer;
      > img {
        width: 18px;
        height: 18px;
      }
    }
  }
  .sort_area {
    margin-top: 20px;
    margin-bottom: 30px;
    .subtitle {
      font-weight: 500;
      font-size: 12px;
      color: #adadad;
    }
    .sort_type {
      position: relative;
      font-weight: 500;
      font-size: 12px;
      color: #646464;
      margin-left: 20px;
      cursor: pointer;
      .sort_panel {
        position: absolute;
        left: -12px;
        top: 30px;
        width: 120px;
        height: 186px;
        background: #ffffff;
        box-shadow: 0px 1px 20px 0px rgba(0, 0, 0, 0.1);
        border-radius: 6px;
        z-index: 3;
        padding: 13px 15px;
        .sort_row {
          height: 20px;
          width: 100%;
          margin-bottom: 20px;
          font-size: 14px;
          color: #3d3d3d;
          cursor: pointer;
          > img {
            width: 16px;
            height: 16px;
            margin-right: 10px;
          }
          > span {
            margin-left: auto;
            margin-right: 8px;
          }
        }
        .devide_line {
          width: 100%;
          height: 0px;
          border-top: 1px solid #e4e5ee;
          margin-bottom: 20px;
        }
      }
    }
  }
  .project_list {
    display: flex;
    flex-wrap: wrap;
    .normal_item {
      display: flex;
      flex-direction: column;
      margin-right: 46px;
      cursor: pointer;
      .item_img {
        width: 124px;
        height: 105px;
      }
      .project_title {
        font-weight: 500;
        font-size: 14px;
        color: #3d3d3d;
        margin-top: 12px;
        width: 124px;
      }
      .project_subtitle {
        font-weight: 500;
        font-size: 10px;
        color: #adadad;
        margin-top: 6px;
        justify-content: space-between;
        margin-bottom: 20px;
        .operation_area {
          position: relative;
          cursor: pointer;
          .more {
            width: 20px;
            height: 20px;
          }
          &:hover {
            .transparent_back {
              display: block;
            }
          }
          .transparent_back {
            display: none;
            position: absolute;
            top: 0px;
            left: 0;
            padding-top: 20px;
          }
          .operation_panel {
            width: 154px;

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
              border-bottom: 1px solid #e4e5ee;
              line-height: 48px;
              cursor: pointer;
            }
          }
        }
      }
    }

    .group_item {
      position: relative;
      .isDraging {
        width: 136px;
        height: 200px;
        background: transparent;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
      }
      .project_contain {
        width: 124px;
        height: 105px;
        background: #fff;
        border-radius: 5px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-wrap: wrap;
        position: relative;
        &:hover {
          .group_project_list {
            display: block;
          }
        }
        .project_icon_inner {
          width: 47px;
          height: 42px;
        }
        .group_project_list {
          display: none;
          position: absolute;
          top: 34px;
          left: 76px;
          width: 390px;
          background: #ffffff;
          box-shadow: 0px 1px 20px 0px rgba(0, 0, 0, 0.1);
          border-radius: 6px;
          z-index: 1;
          padding: 20px 0;
          .group_project_item {
            margin-bottom: 24px;
            &:last-of-type {
              margin-bottom: 0px;
            }
            .project_icon {
              width: 47px;
              height: 42px;
              margin: 0 20px;
            }
            .info_con {
              display: flex;
              flex-direction: column;
              width: 100%;
              .info_title {
                font-weight: 500;
                font-size: 14px;
                color: #3d3d3d;
              }
              .info_subtitle {
                font-weight: 500;
                font-size: 10px;
                color: #adadad;
                margin-top: 6px;
              }
            }
            .more {
              margin-right: 10px;
              position: relative;
              cursor: pointer;
              > img {
                width: 20px;
                height: 20px;
              }
              &:hover {
                .transparent_back {
                  display: block;
                }
              }

              .transparent_back {
                display: none;
                position: absolute;
                top: 0px;
                left: 0;
                padding-top: 20px;
              }
              .operation_panel {
                width: 154px;

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
                  border-bottom: 1px solid #e4e5ee;
                  line-height: 48px;
                  cursor: pointer;
                }
              }
            }
          }
        }
      }
    }

    .project_add {
      position: relative;
      &:hover {
        .mask {
          display: block;
        }
      }
      .mask {
        display: none;
        position: absolute;
        top: 65px;
        left: 70px;
        width: 180px;
        padding: 16px 0;
        background: #fff;
        box-shadow: 0px 1px 20px 0px rgba(0, 0, 0, 0.1);
        border-radius: 6px;
        z-index: 2;
        .mask_item {
          margin-bottom: 20px;
          img {
            width: 16px;
            height: 16px;
            margin-left: 20px;
            margin-right: 12px;
          }
          font-weight: 500;
          font-size: 14px;
          color: #3d3d3d;
          &:last-of-type {
            margin-bottom: 0px;
          }
        }
      }
    }
  }
}
</style>