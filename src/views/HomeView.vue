<template>
  <div class="home">
    <div class="head_row">
      <span class="title">我的项目</span>
    </div>
    <div class="sort_area flex"><span class="subtitle">排序</span></div>

    <div class="project_list">
      <div class="normal_item project_add">
        <img class="item_img" src="@/assets/img/homePage/create.png" alt="" />
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
                <div class="operation_panel">
                  <div
                    class="panel_item"
                    @click.stop="goRename('项目', index2)"
                  >
                    重命名
                  </div>
                  <div class="panel_item" @click.stop="copyProject(item2)">
                    复制分镜到新项目
                  </div>
                  <div class="panel_item">移到回收站</div>
                  <div class="panel_item" @click="moveProject(item2.id)">
                    移出组
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
            <div class="operation_panel">
              <div class="panel_item" @click.stop="goRename('组', index)">
                重命名
              </div>
              <div class="panel_item" @click.stop="deleteGroup(index)">
                删除组
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 小组 -->
      <!-- 项目 -->
      <div
        draggable="true"
        @dragstart="dragStart($event)"
        @dragend="dragEnd($event)"
        :data-id="item.id"
        class="normal_item project_item"
        v-for="(item, index) in projectList"
        :key="item.id"
        @click="goStoryboard(item)"
      >
        <img
          draggable="false"
          class="item_img"
          src="@/assets/img/homePage/project.png"
          alt=""
        />
        <span class="project_title ellipsis">{{ item.projectName }}</span>
        <div class="project_subtitle flex">
          创建于{{ getTime(item.createTime) }}
          <div class="operation_area">
            <img class="more" src="@/assets/img/homePage/more.png" alt="" />
            <div class="operation_panel">
              <div class="panel_item" @click.stop="goRename('项目', index)">
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
      <!-- 项目 -->
      <div class="recycle_bin flex" @click="showRecycleBin = true">回收站</div>
    </div>
    <Rename
      v-if="showRename"
      :renameType="renameType"
      :renameData="
        renameType == '项目'
          ? projectList[renameIndex]
          : projectGroup[renameIndex]
      "
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
} from "@/assets/js/request";
import Rename from "@/components/Rename.vue";
import CreateConfrim from "@/components/CreateConfrim.vue";
import RecycleBin from "@/components/RecycleBin.vue";
import { mapState, mapMutations } from "vuex";
export default {
  name: "HomeView",
  components: { Rename, CreateConfrim, RecycleBin },

  data() {
    return {
      projectGroup: [], //组列表
      projectList: [], //项目列表
      dragItemId: "", //当前拖拽元素
      showRename: false, //重命名组件
      showRecycleBin: false, //回收站组件
      showCreateConfrim: false, //新建确认组件
      renameType: "项目", //"项目"/"组"
      renameIndex: 0,
    };
  },
  methods: {
    ...mapMutations(["SET_ACTIVEPROJECT"]),

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
      getProjectList({
        sortType: 1,
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
          //没有放入组内的文件
          if (0 == res.data[i].projectType) {
            if (0 == res.data[i].parentId) {
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
        console.log(tempProjectGroup);
        console.log(tempProjectList);
        this.projectGroup = tempProjectGroup;
        this.projectList = tempProjectList;
      });
    },
    //创建项目
    createProject(data) {
      creatProject({
        projectName: data.name,
        modelId: "2",
      }).then((res) => {
        this.getProjectList();
      });
      // this.projectList.push({
      //   id: Date.now().toString(),
      //   name: `${data.name}`,
      //   createTime: this.getTime(Date.now()),
      // });
    },
    //创建组
    createGroup() {
      creatProjectGroup().then((res) => {
        this.getProjectList();
      });
      // this.projectGroup.push({
      //   id: Date.now().toString(),
      //   name: "未命名组",
      //   dataList: [],
      // });
    },
    //移出组
    removeGroup() {
      // let temp = this.projectGroup[groupIndex].dataList.splice(projectIndex, 1);
      // this.projectList.push(temp[0]);
    },
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
      });

      // this.projectList.splice(index, 1);
    },
    //删除组
    deleteGroup(index) {
      deleteProjectGroup({
        ids: this.projectGroup[index].id,
      }).then((res) => {
        this.getProjectList();
      });
      this.projectGroup.splice(index, 1);
    },
    //复制项目
    copyProject(item) {
      copyProject({
        projectId: item.id,
      }).then((res) => {
        this.getProjectList();
      });
    },
    //打开重命名
    goRename(renameType, index) {
      this.renameType = renameType;
      this.renameIndex = index;
      this.showRename = true;
    },
    //确认重命名
    renameConfirm(e) {
      console.log(e);
      // this.renameType == "项目"
      //   ? (this.projectList[this.renameIndex] = e)
      //   : (this.projectGroup[this.renameIndex] = e);
      this.getProjectList();
      this.showRename = false;
    },

    goStoryboard(item) {
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
    right: 60px;
    bottom: 60px;
    width: 100px;
    height: 100px;
    background: #dedede;
    justify-content: center;
    cursor: pointer;
  }
  .head_row {
    display: flex;
    align-items: center;
    margin-top: 10px;
    height: 32px;
    .title {
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 16px;
      color: #3d3d3d;
    }
  }
  .sort_area {
    margin-top: 20px;
    margin-bottom: 30px;
    .subtitle {
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 12px;
      color: #adadad;
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
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 14px;
        color: #3d3d3d;
        margin-top: 12px;
        width: 124px;
      }
      .project_subtitle {
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 10px;
        color: #adadad;
        margin-top: 6px;
        justify-content: space-between;
        .operation_area {
          position: relative;
          cursor: pointer;
          .more {
            width: 20px;
            height: 20px;
          }
          &:hover {
            .operation_panel {
              display: block;
            }
          }
          .operation_panel {
            display: none;
            position: absolute;
            top: 20px;
            left: 0;
            width: 154px;

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
                font-family: PingFang SC, PingFang SC;
                font-weight: 500;
                font-size: 14px;
                color: #3d3d3d;
              }
              .info_subtitle {
                font-family: PingFang SC, PingFang SC;
                font-weight: 500;
                font-size: 10px;
                color: #adadad;
                margin-top: 6px;
              }
            }
            .more {
              margin-right: 10px;
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
                width: 154px;

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
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          font-size: 14px;
          color: #3d3d3d;
          &:last-of-type {
            margin-bottom: 0px;
          }
        }
      }
    }
    .project_item {
    }
  }
}
</style>