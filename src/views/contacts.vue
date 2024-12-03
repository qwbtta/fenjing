<template>
  <div class="contacts">
    <div class="head flex">
      <div class="head_left flex"><span>我的联系人</span></div>
      <div class="img_btn flex" @click="showMessageNotification">
        <img src="@/assets/img/homePage/message.png" alt="" />
      </div>
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
              @click="
                activeTabIndex = 1;
                activeGroup = {};
              "
            >
              组织
            </div>
          </div>
        </div>
        <div v-if="0 == activeTabIndex">
          <div class="sutitle">人员架构</div>
          <div class="add_btn" @click="toShowAddContact('contact')">
            + 添加联系人
          </div>
          <div
            @click="
              getContactList({
                groupId: '',
                type: '0',
              })
            "
            class="contact_type flex"
          >
            <img src="@/assets/img/homePage/contacts_all.png" alt="" />
            <span>所有联系人</span>
          </div>
          <div
            @click="
              getContactList({
                groupId: '',
                type: '1',
              })
            "
            class="contact_type flex"
          >
            <img src="@/assets/img/homePage/contacts_ungrouped.png" alt="" />
            <span>未分组联系人</span>
          </div>
          <div class="contact_type flex">
            <img src="@/assets/img/homePage/contacts_group.png" alt="" />
            <span>创建的新联系人</span>
          </div>
        </div>
        <div v-if="1 == activeTabIndex">
          <div class="sutitle">组织架构</div>
          <div class="add_btn" @click="toShowAddContact('group')">
            + 添加分组
          </div>
          <div
            class="contact_type flex"
            v-for="(item, index) in groupList"
            :key="index"
            @click="checkGroup(item)"
          >
            <img src="@/assets/img/homePage/contacts_group.png" alt="" />
            <span>{{ item.groupName }}</span>
            <div class="more" @click.stop>
              ···
              <div class="more_panel">
                <div class="panel_item" @click="toEditGroup(item)">重命名</div>
                <div class="panel_item" @click="toDeleteGroup(item.id)">
                  删除分组
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="0 == activeTabIndex" class="main_right">
        <span class="right_sutitle">当前视图：全部人员</span>
        <table>
          <thead>
            <tr>
              <th>姓名</th>
              <th>所属项目组</th>
              <!-- <th>最后操作时间</th>
              <th>角色</th>
              <th>邀请人</th> -->
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in myContactList" :key="index">
              <td>{{ item.nickname }}</td>
              <td>
                <span v-for="(item2, index2) in groupList" :key="index2"
                  >{{ item2.groupName
                  }}<span v-if="index2 !== groupList.length - 1">,</span> </span
                >等{{ groupList.length }}个分组
                <!-- <div class="group_panel">
                  <div class="subtitle">分组管理</div>
                  <div class="group_row"></div>
                </div> -->
              </td>
              <td>
                <span class="delete" @click="toDeleteContact(item.groupUserId)"
                  >删除</span
                >
              </td>
            </tr>
          </tbody>
        </table>
        <!-- <div class="form_list flex">
          <div class="form_head width300">姓名</div>
          <div class="form_head">所属项目组</div>
          <div class="form_head">最后操作时间</div>
          <div class="form_head">角色</div>
          <div class="form_head">邀请人</div>
        </div>
        <div v-for="(item, index) in myContactList" :key="index" class="flex">
          <span> {{ item.nickname }}</span>
          <div
            v-for="(item2, index2) in groupList"
            :key="index2"
            @click="joinGroup(item, item2)"
            style="margin-left: 16px"
          >
            <span>添加进分组{{ item2.groupName }}</span>
          </div>
          <span style="margin-left: 16px" @click="toDeleteContact(item.id)"
            >删除联系人</span
          >
        </div> -->
      </div>
      <div v-if="1 == activeTabIndex" class="main_right">
        <span class="right_sutitle"
          >当前视图：{{
            activeGroup.groupName ? activeGroup.groupName : "全部人员"
          }}</span
        >
        <table>
          <thead>
            <tr>
              <th>姓名</th>
              <!-- <th>所属项目组</th> -->
              <!-- <th>最后操作时间</th>
              <th>角色</th>
              <th>邀请人</th> -->
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in myContactList" :key="index">
              <td>{{ item.nickname }}</td>
              <!-- <td>
                <span v-for="(item2, index2) in groupList" :key="index2"
                  >{{ item2.groupName
                  }}<span v-if="index2 !== groupList.length - 1">,</span> </span
                >等{{ groupList.length }}个分组
              </td> -->
              <td>
                <span
                  v-if="1 == activeTabIndex && contactListParams.groupId"
                  @click="toRemoveGroupContact(item.groupUserId)"
                  class="delete"
                  >移出分组</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <AddContact
      v-if="showAddContact"
      :addType="addType"
      :editData="editData"
      @close="
        showAddContact = false;
        editData = null;
      "
      @freshList="freshList"
    />
  </div>
</template>
    
    <script>
import {
  contactList,
  groupList,
  groupContact,
  deleteGroup,
  deleteContact,
  removeGroupContact,
} from "@/assets/js/request";
import AddContact from "@/components/AddContact.vue";
import bus from "@/assets/js/eventBus.js";
export default {
  components: {
    AddContact,
  },
  data() {
    return {
      activeTabIndex: 0,
      showAddContact: false, //添加联系人/组 组件显隐
      addType: "", //添加联系人/组 组件显类型
      editData: null, //重命名组的信息
      myContactList: [],
      groupList: [],
      contactListParams: {
        //弄到这里是为了在不同条件的列表下 进行操作后 方便重新请求刷新数据
        groupId: "",
        type: "0", // ( groupId不为空的时候type为空否则 0所有  1未分组)
      },
      activeGroup: {},
    };
  },
  watch: {
    activeTabIndex(newVal, oldVal) {
      if (newVal) {
        this.getGroupList();
      } else {
        this.getContactList(this.contactListParams);
      }
    },
  },
  methods: {
    showMessageNotification() {
      bus.$emit("showMessageNotification", true);
    },
    checkGroup(item) {
      this.activeGroup = item;
      this.getContactList({
        groupId: item.id,
      });
    },
    getContactList(params) {
      if (params) {
        this.contactListParams = params;
      }
      contactList(this.contactListParams).then((res) => {
        this.myContactList = res.data;
      });
    },
    getGroupList() {
      groupList().then((res) => {
        this.groupList = res.data;
      });
    },
    freshList(e) {
      this[e]();
    },
    toShowAddContact(type) {
      this.addType = type;
      this.showAddContact = true;
    },
    joinGroup(contact, group) {
      groupContact({
        applyUserId: contact.groupUserId, //(联系人用户id)
        groupId: group.id,
      }).then((res) => {});
    },
    toEditGroup(item) {
      this.editData = item;
      this.addType = "group";
      this.showAddContact = true;
    },
    toDeleteGroup(id) {
      deleteGroup({ groupId: id }).then((res) => {
        this.getGroupList();
      });
    },
    toDeleteContact(id) {
      deleteContact({ applyUserId: id }).then((res) => {
        this.getContactList();
      });
    },
    toRemoveGroupContact(id) {
      removeGroupContact({
        applyUserId: id,
        groupIds: this.contactListParams.groupId,
      }).then((res) => {
        this.getContactList();
      });
    },
  },
  created() {
    this.getContactList(this.contactListParams);
    this.getGroupList();
  },
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
    padding-right: 28px;
    .head_left {
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
  .main {
    display: flex;
    height: calc(100% - 56px);
    .main_left {
      width: 250px;
      flex-shrink: 0;
      height: 100%;
      background: #ffffff;
      border-right: 1px solid #e4e5ee;
      padding-left: 26px;
      .head_row {
        margin-top: 20px;
        justify-content: space-between;
        .title {
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
        font-size: 14px;
        color: #12db34;
        margin-top: 10px;
        margin-bottom: 16px;
        cursor: pointer;
      }
      .contact_type {
        margin-bottom: 20px;
        cursor: pointer;
        > img {
          width: 16px;
          height: 16px;
          margin-right: 7px;
        }
        > span {
          font-weight: 400;
          font-size: 14px;
          color: #3d3d3d;
        }
        .more {
          margin-left: auto;
          margin-right: 16px;
          position: relative;
          &:hover {
            .more_panel {
              display: block;
            }
          }
          .more_panel {
            display: none;
            position: absolute;
            top: 20px;
            right: -8px;
            background: #ffffff;
            box-shadow: 0px 1px 20px 0px rgba(0, 0, 0, 0.1);
            border-radius: 6px;
            z-index: 3;
            padding: 10px;
            width: 80px;
            .panel_item {
              height: 24px;
              line-height: 24px;
              font-size: 14px;
              color: #5a5a68;
              text-align: center;
            }
          }
        }
      }
    }
    .main_right {
      width: 100%;
      padding: 0 36px;
      display: flex;
      flex-direction: column;
      .right_sutitle {
        font-weight: 600;
        font-size: 14px;
        color: #3d3d3d;
        margin-top: 30px;
        margin-bottom: 16px;
      }
      table {
        border-spacing: 0;
      }
      th {
        height: 46px;
        background: #f4f6f7;
        font-weight: 500;
        font-size: 12px;
        color: #3d3d3d;
        text-align: left;
        padding-left: 20px;
        &:first-of-type {
          border-radius: 5px 0 0 5px;
        }
      }
      td {
        height: 60px;
        padding-left: 20px;
        font-size: 14px;
        color: #3d3d3d;
        position: relative;
        .group_panel {
          position: absolute;
          top: 20px;
          left: 0;
          background: #ffffff;
          box-shadow: 0px 1px 20px 0px rgba(0, 0, 0, 0.1);
          border-radius: 6px;
          z-index: 3;
          padding: 10px;
        }
        .delete {
          color: #e81515;
          cursor: pointer;
        }
      }
    }
  }
}
</style>