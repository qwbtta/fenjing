<template>
  <div class="addContact flex">
    <div class="edit_panel">
      <div class="panel_head flex">
        <span
          >{{ editData ? "重命名" : "添加"
          }}{{ addType == "contact" ? "联系人" : "分组" }}</span
        ><img
          class="close"
          @click="$emit('close')"
          src="@/assets/img/operatePage/close.png"
          alt=""
        />
      </div>
      <div v-if="addType == 'contact'">
        <div class="flex">
          <input
            v-model="inputValue"
            type="text"
            placeholder="输入用户完整手机号"
          />
          <div class="normal_btn confirm special" @click="confirm">查询</div>
        </div>
        <div v-if="searchResult" class="result_con flex">
          <img
            class="avatar"
            :src="
              searchResult.avatar ||
              require('@/assets/img/homePage/default_avatar.png')
            "
            alt=""
          />
          <span>{{ searchResult?.nickname }}</span>
          <div
            class="normal_btn confirm"
            style="margin-top: 0"
            @click="addUser"
          >
            添加
          </div>
        </div>
      </div>
      <div v-if="addType == 'group'">
        <input v-model="inputValue" type="text" placeholder="请输入分组名" />
        <div
          class="normal_btn confirm"
          @click="editData ? toUpdateGroup() : toAddGroup()"
        >
          {{ editData ? "确认" : "添加" }}
        </div>
      </div>
    </div>
  </div>
</template>
              
        <script>
import {
  selContact,
  messageSend,
  addGroup,
  updateGroup,
} from "@/assets/js/request";
export default {
  components: {},
  props: ["addType", "editData"],
  data() {
    return {
      inputValue: "",
      searchResult: null,
    };
  },
  methods: {
    confirm() {
      selContact({ tel: this.inputValue }).then((res) => {
        if (!res.data) {
          this.$message({
            message: "该用户不存在",
            type: "warning",
          });
          return;
        }
        this.searchResult = res.data;
      });
    },
    addUser() {
      messageSend({ userId: this.searchResult.id }).then((res) => {
        if (res.code != 200) {
          this.errHandle(res.msg);
        }
        this.$emit("close");
        this.$emit("freshList", "getContactList");
      });
    },
    toUpdateGroup() {
      updateGroup({
        groupId: this.editData.id,
        groupName: this.inputValue,
      }).then((res) => {
        if (res.code != 200) {
          this.errHandle(res.msg);
        }
        this.$emit("close");
        this.$emit("freshList", "getGroupList");
      });
    },
    toAddGroup() {
      addGroup({ groupName: this.inputValue }).then((res) => {
        if (res.code != 200) {
          this.errHandle(res.msg);
        }
        this.$emit("close");
        this.$emit("freshList", "getGroupList");
      });
    },
    errHandle(msg) {
      this.$message({
        message: msg,
        type: "error",
      });
    },
  },
  created() {
    this.inputValue = this.editData?.groupName || "";
  },
};
</script>
<style lang="scss" scoped>
.addContact {
  z-index: 99;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  .edit_panel {
    width: 458px;
    background: #ffffff;
    border-radius: 18px;
    padding: 20px;
    input {
      width: 100%;
      height: 32px;
      border-radius: 5px;
      border: 1px solid #e4e5ee;
      outline: none;
      padding: 0 12px;
      font-weight: 400;
      font-size: 12px;
      color: #3d3d3d;
      &::placeholder {
        color: #959595;
      }
    }
    .panel_head {
      font-weight: 600;
      font-size: 16px;
      color: #3d3d3d;
      justify-content: space-between;
      margin-bottom: 25px;
      .close {
        width: 20px;
        height: 20px;
        margin-right: 4px;
        cursor: pointer;
      }
    }
    .subtitle {
      font-weight: 500;
      font-size: 14px;
      color: #3d3d3d;
      margin-top: 14px;
      margin-bottom: 11px;
    }

    .result_con {
      margin-top: 12px;
      .avatar {
        width: 22px;
        height: 22px;
        margin-right: 10px;
      }
    }
    .normal_btn {
      width: 84px;
      height: 38px;
      border-radius: 11px;
      text-align: center;
      line-height: 38px;
      font-weight: 400;
      font-size: 14px;
      margin-top: 20px;
      margin-left: auto;
      cursor: pointer;
    }
    .canel {
      border: 1px solid #d8d8d8;
      color: #959595;
    }
    .confirm {
      color: #ffffff;
      background: #12db34;
    }
    .special {
      margin-left: 16px;
      margin-top: 0px;
      flex-shrink: 0;
    }
  }
}
</style>