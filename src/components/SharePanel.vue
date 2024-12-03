<template>
  <div class="SharePanel flex">
    <div class="edit_panel">
      <div class="panel_head flex">
        <span>项目协作</span>
        <img
          class="close"
          @click="$emit('close')"
          src="@/assets/img/operatePage/close.png"
          alt=""
        />
      </div>
      <div class="panel_main">
        <div class="main_left">
          <div class="title">项目协作者</div>
          <div class="tips">
            协作者中拥有<span> 编辑权限 </span>的专业版用户，可以编辑此项目。
          </div>
          <div class="table_head flex">
            <div style="width: 190px; flex-shrink: 0">项目协作者</div>
            <div>角色</div>
            <div>权限</div>
          </div>
          <div class="hide_scrollbar" style="height: 320px">
            <div
              v-for="item in userList"
              :key="item.cooperationUserId"
              class="table_body_row"
            >
              <div class="delete_con flex" v-if="item.permission !== 'ADMIN'">
                <img
                  class="delete"
                  src="@/assets/img/operatePage/close.png"
                  alt=""
                  @click="toDeleteCooperation(item.cooperationUserId)"
                />
              </div>
              <div class="name_con flex">
                <img
                  class="avatar"
                  src="@/assets/img/homePage/default_avatar.png"
                  alt=""
                />
                <span class="common_font"> {{ item.nickname }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="main_right">
          <div class="input_con">
            <img
              class="search_icon"
              src="@/assets/img/operatePage/search.png"
              alt=""
            />
            <input
              type="text"
              placeholder="输入联系人昵称"
              v-model="searchInput"
              @compositionstart="handleCompositionStart"
              @compositionend="handleCompositionEnd"
              @input="handleInput"
            />
          </div>
          <div class="common_font" style="margin-bottom: 16px">所有联系人</div>
          <div class="hide_scrollbar" style="height: 366px">
            <div
              v-for="item in myContactList"
              :key="item.groupUserId"
              class="contact_row flex"
            >
              <img
                @click="changeStatus(item)"
                class="select_area"
                :src="
                  !item.isAdd
                    ? require('@/assets/img/operatePage/unselect.png')
                    : require('@/assets/img/operatePage/checked_green.png')
                "
                alt=""
              />
              <img
                class="avatar"
                src="@/assets/img/homePage/default_avatar.png"
                alt=""
              />
              <span class="common_font"> {{ item.nickname }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="panel_bottom">
        <span class="des">链接分享</span>
        <div class="status_area flex">
          获得链接者，
          <div class="status_area_right flex">
            <span class="permission">{{ permission }}</span>
            <img
              class="arrow"
              src="@/assets/img/operatePage/left_arrow.png"
              alt=""
            />
            <div class="transparent_back">
              <div class="permissionPanel">
                <div
                  class="permission_item"
                  v-for="(item, index) in permissionList"
                  :key="index"
                  @click="permission = item"
                >
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="btn btn1" @click="copyLink">复制链接</div>
        <div class="btn btn2" @click="$emit('close')">完成</div>
      </div>
    </div>
  </div>
</template>
                
<script>
import {
  contactList,
  userList,
  insertCooperation,
  deleteCooperation,
  openShare,
  shareStatus,
} from "@/assets/js/request";
import { mapState, mapMutations } from "vuex";
export default {
  components: {},
  data() {
    return {
      userList: [], //协作者列表
      myContactList: [], //联系人列表（实际显示）
      tempContactList: [], //联系人列表（所有数据供搜索使用）
      permission: "可编辑",
      permissionList: ["可查看", "可编辑"],
      searchInput: "",
      inputEventBound: true, //输入监听器
    };
  },
  computed: {
    ...mapState(["activeProject"]),
  },
  methods: {
    getContactList() {
      contactList({
        groupId: "",
        type: "0", // ( groupId不为空的时候type为空否则 0所有  1未分组)
      }).then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].isAdd = false;
          for (let y = 0; y < this.userList.length; y++) {
            if (this.userList[y].cooperationUserId == res.data[i].groupUserId) {
              res.data[i].isAdd = true;
            }
          }
        }
        this.myContactList = res.data;
        this.tempContactList = res.data;
        console.log(this.myContactList, " this.myContactList");
      });
    },
    changeStatus(item) {
      item.isAdd = !item.isAdd;
      if (item.isAdd) {
        this.toInsertCooperation(item.groupUserId);
      } else {
        this.toDeleteCooperation(item.groupUserId);
      }
    },
    toInsertCooperation(cooperationUserId) {
      insertCooperation({
        cooperationUserId: cooperationUserId, // 协作用户id
        forId: this.activeProject.id, // 项目id
      }).then((res) => {
        this.getUserList();
      });
    },
    toDeleteCooperation(cooperationUserId) {
      deleteCooperation({
        cooperationUserId: cooperationUserId, // 协作用户id
        forId: this.activeProject.id, // 项目id
      }).then((res) => {
        this.getUserList();
      });
    },
    getUserList() {
      userList({ projectId: this.activeProject.id }).then((res) => {
        this.userList = res.data;
        this.getContactList();
      });
    },
    handleCompositionStart() {
      // 开始拼音输入时，移除input事件监听
      this.inputEventBound = false;
    },
    handleCompositionEnd() {
      // 拼音输入结束时，重新绑定input事件监听
      this.inputEventBound = true;
      // 触发input事件，以便处理拼音输入后的逻辑
      this.handleInput();
    },
    handleInput() {
      if (this.inputEventBound) {
        // 只有当input事件监听器是绑定状态时才执行处理逻辑
        let temp = [];
        for (let i = 0; i < this.tempContactList.length; i++) {
          if (this.tempContactList[i].nickname.includes(this.searchInput)) {
            temp.push(this.tempContactList[i]);
          }
        }
        this.myContactList = temp;
      }
    },
    copyLink() {
      openShare({
        projectId: this.activeProject.id, //项目id
        permission: this.permission == "可编辑" ? "UPDATE" : "CHECK", //权限 UPDATE CHECK
        status: "1", //  是否开启  0否  1开启
      }).then((res) => {
        shareStatus({
          projectId: this.activeProject.id,
        }).then((res) => {
          let link = `${location.origin}#/share?flag=${res.data.flag}`;
          navigator.clipboard.writeText(link);
          this.$message({
            message: "链接复制成功",
            type: "success",
          });
        });
      });
    },
  },
  created() {
    this.getUserList();
  },
};
</script>
  <style lang="scss" scoped>
.SharePanel {
  z-index: 99;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  .edit_panel {
    width: 765px;
    height: 603px;
    background: #ffffff;
    border-radius: 22px;
    .panel_head {
      height: 70px;
      font-weight: 600;
      font-size: 23px;
      color: #3d3d3d;
      justify-content: space-between;
      padding: 0 18px;
      border-bottom: 1px solid #e4e5ee;
      .close {
        width: 20px;
        height: 20px;
        cursor: pointer;
      }
    }
    .panel_main {
      display: flex;
      .avatar {
        width: 30px;
        height: 30px;
        margin-right: 10px;
      }
      .common_font {
        font-weight: 600;
        font-size: 12px;
        color: #3d3d3d;
      }

      .main_left {
        width: 429px;
        height: 458px;
        padding: 0 20px;
        border-right: 1px solid #e4e5ee;
        .title {
          height: 20px;
          font-size: 14px;
          margin-top: 12px;
          margin-bottom: 25px;
        }
        .tips {
          font-size: 12px;
          color: #3d3d3d;
          > span {
            font-weight: 600;
          }
        }
        .table_head {
          margin: 23px 0;
          > div {
            height: 17px;
            font-weight: 600;
            font-size: 12px;
            color: #3d3d3d;
            width: 100%;
          }
        }
        .table_body_row {
          margin-bottom: 8px;
          position: relative;
          &:hover {
            .delete_con {
              display: flex;
            }
          }
          .delete_con {
            display: none;
            position: absolute;
            left: -16px;
            top: -1px;
            width: 50px;
            height: 34px;
            .delete {
              width: 12px;
              height: 12px;
              cursor: pointer;
            }
          }
        }
      }
      .main_right {
        width: 336px;
        padding: 12px;
        .input_con {
          position: relative;
          margin-bottom: 12px;
          input {
            width: 304px;
            height: 30px;
            background: #f4f6f7;
            border-radius: 5px;
            padding-left: 26px;
            padding-right: 10px;
          }
          .search_icon {
            position: absolute;
            left: 4px;
            top: 7px;
            width: 16px;
            height: 16px;
          }
        }
        .contact_row {
          margin-bottom: 8px;
          .select_area {
            width: 16px;
            height: 16px;
            margin-right: 8px;
            cursor: pointer;
          }
        }
      }
    }
    .panel_bottom {
      height: 76px;
      border-top: 1px solid #e4e5ee;
      padding: 20px 20px 0;
      display: flex;
      .des {
        font-weight: 600;
        font-size: 20px;
        color: #3d3d3d;
        margin-right: 12px;
      }
      .status_area {
        width: 169px;
        height: 30px;
        background: #f4f6f7;
        border-radius: 5px;
        font-size: 14px;
        color: #5a5a68;
        justify-content: center;
        .permission {
          font-weight: 600;
          font-size: 14px;
          color: #3d3d3d;
        }
        .arrow {
          width: 16px;
          height: 16px;
          transform: rotate(-90deg);
          margin-left: 6px;
        }
        .status_area_right {
          position: relative;
          cursor: pointer;
          &:hover {
            .transparent_back {
              display: block;
            }
          }
        }
        .transparent_back {
          display: none;
          position: absolute;
          top: 15px;
          right: -10px;
          padding-top: 10px;
        }
        .permissionPanel {
          width: 80px;
          background: #ffffff;
          box-shadow: 0px 1px 20px 0px rgba(0, 0, 0, 0.1);
          border-radius: 6px;
          z-index: 3;
          padding: 8px 0;
          .permission_item {
            height: 24px;
            line-height: 24px;
            font-size: 14px;
            color: #5a5a68;
            text-align: center;
          }
        }
      }
      .btn {
        width: 84px;
        height: 38px;

        border-radius: 11px;
        text-align: center;
        line-height: 38px;
        font-size: 14px;
        cursor: pointer;
      }
      .btn1 {
        margin-left: auto;
        color: #959595;
        border: 1px solid #d8d8d8;
      }
      .btn2 {
        margin-left: 16px;
        color: #ffffff;
        background: #12db34;
      }
    }
  }
}
</style>