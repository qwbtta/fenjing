<template>
  <div class="infoSet flex">
    <div class="main">
      <div class="head flex">
        <span>账号设置</span>
        <img
          class="close"
          @click="$emit('close')"
          src="@/assets/img/operatePage/close.png"
          alt=""
        />
      </div>
      <div class="info_row">
        <span class="subtitle">头像</span>
        <div class="avatar_con">
          <img
            class="avatar"
            :src="
              userInfo.avatar ||
              require('@/assets/img/homePage/default_avatar.png')
            "
            alt=""
          />
          <div class="avatar_mask flex" @click="getImg">更换</div>
        </div>
      </div>
      <div class="info_row">
        <span class="subtitle">昵称</span>
        <input
          ref="input0"
          type="text"
          class="info_content"
          :class="{ active_info_content: editArray[0] }"
          v-model="userInfo.nickname"
          :readonly="!editArray[0]"
        />
        <div v-if="!editArray[0]" @click="checkStatus(0)" class="edit_btn">
          编辑
        </div>
        <div v-if="editArray[0]" class="edit_btn" @click="toSave">保存</div>
        <div
          v-if="editArray[0]"
          class="edit_btn"
          style="margin-left: 12px"
          @click="checkStatus(0)"
        >
          取消
        </div>
      </div>
      <div class="info_row">
        <span class="subtitle">手机号</span>

        <input
          ref="input1"
          type="text"
          class="info_content"
          v-model="userInfo.mobile"
          readonly
        />
        <div class="edit_btn" @click="showPhoneMask = true">设置</div>
      </div>
      <div class="info_row">
        <span class="subtitle">密码</span>
        <input
          type="password"
          class="info_content"
          v-model="userInfo.password"
          readonly
        />
        <div class="edit_btn" @click="showPasswordMask = true">设置</div>
      </div>
      <div class="info_row">
        <span class="subtitle">微信号</span>
        <input
          type="text"
          class="info_content"
          v-model="userInfo.wxNickname"
          readonly
        />
        <div class="edit_btn" @click="checkWx">
          {{ userInfo.wxNickname ? "解绑" : "绑定" }}
        </div>
      </div>
      <div class="info_row">
        <span class="subtitle">版本</span>
        <div class="info_content">1.0.0</div>
      </div>
      <div class="footer flex">
        <div class="save_btn" @click="$emit('close')">完成</div>
      </div>
      <div class="mask" v-if="showPasswordMask">
        <div class="head flex" style="margin-bottom: 24px">
          <img
            @click="
              showPasswordMask = false;
              resetData();
            "
            class="left_arrow"
            src="@/assets/img/operatePage/left_arrow.png"
            alt=""
          />
          <span>修改密码</span>
          <img
            class="close"
            @click="$emit('close')"
            src="@/assets/img/operatePage/close.png"
            alt=""
          />
        </div>
        <div class="info_row">
          <span class="subtitle">手机号</span>
          <input
            type="text"
            class="info_content"
            v-model="userInfo.mobile"
            readonly
          />
        </div>
        <div class="info_row">
          <span class="subtitle">验证码</span>

          <div class="verification_code_con">
            <input
              type="text"
              v-model="code"
              class="info_content active_info_content"
              placeholder="请输入验证码"
            />
            <div class="get_code" @click="toGetCode('2')">
              {{ timer ? countDown + "s" : "获取验证码" }}
            </div>
          </div>
        </div>

        <div class="info_row">
          <span class="subtitle">新密码</span>
          <input
            type="text"
            class="info_content active_info_content"
            v-model="newPassword"
            placeholder="输入新密码"
            :disabled="code.length == 0"
          />
        </div>
        <div class="info_row">
          <span class="subtitle">确认密码</span>
          <input
            type="text"
            class="info_content active_info_content"
            v-model="newPasswordConfirm"
            placeholder="再次输入新密码"
            :disabled="code.length == 0"
          />
        </div>
        <div class="flex" style="margin-top: 20px">
          <div class="edit_btn" style="margin-left: 86px" @click="editPassword">
            修改
          </div>
        </div>
      </div>
      <div class="mask" v-if="showPhoneMask">
        <div class="head flex" style="margin-bottom: 24px">
          <img
            @click="
              showPhoneMask = false;
              resetData();
            "
            class="left_arrow"
            src="@/assets/img/operatePage/left_arrow.png"
            alt=""
          />
          <span>手机号更改</span>
          <img
            class="close"
            @click="$emit('close')"
            src="@/assets/img/operatePage/close.png"
            alt=""
          />
        </div>
        <div class="info_row">
          <span class="subtitle">原手机号</span>
          <input
            type="text"
            class="info_content"
            v-model="userInfo.mobile"
            readonly
          />
        </div>
        <div class="info_row">
          <span class="subtitle">验证码</span>
          <div class="verification_code_con">
            <input
              type="text"
              v-model="code"
              class="info_content active_info_content"
              placeholder="请输入验证码"
            />
            <div class="get_code" @click="toGetCode('1')">
              {{ timer ? countDown + "s" : "获取验证码" }}
            </div>
          </div>
        </div>
        <div class="info_row">
          <span class="subtitle">新手机号</span>
          <input
            type="text"
            class="info_content active_info_content"
            v-model="newPhone"
            :disabled="code.length == 0"
          />
        </div>
        <div v-if="newPhone" class="info_row">
          <span class="subtitle">验证码</span>
          <div class="verification_code_con">
            <input
              type="text"
              v-model="code2"
              class="info_content active_info_content"
              placeholder="请输入验证码"
            />
            <div class="get_code" @click="toGetNewPhoneCode">
              {{ timer2 ? countDown2 + "s" : "获取验证码" }}
            </div>
          </div>
        </div>
        <div class="flex" style="margin-top: 20px">
          <div class="edit_btn" style="margin-left: 86px" @click="editPhone">
            修改
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
              
  <script>
import {
  getUserInfo,
  updateUser,
  updateTelGetCode,
  updateUserPassword,
  checkTelCode,
  updateUserTel,
  uploadReturnUrl,
  unBindWechat,
  loginOut,
} from "@/assets/js/request";
export default {
  props: ["editItem", "OperationType"],
  components: {},

  data() {
    return {
      userInfo: {},
      editArray: [false, false, false, false], //编辑状态顺序排列 false常规态 true编辑状态
      showPasswordMask: false, //修改密码二级页面
      showPhoneMask: false, //修改手机号二级页面
      newPassword: "", //新密码
      newPasswordConfirm: "", //新密码输入确认
      code: "", //手机验证码
      timer: null,
      countDown: 60, //验证码倒计时
      newPhone: "", //新手机号
      code2: "", //手机验证码  新手机号操作使用
      timer2: null,
      countDown2: 60, //验证码倒计时
    };
  },
  watch: {
    showPasswordMask() {
      for (let i = 0; i < this.editArray.length; i++) {
        this.$set(this.editArray, i, false);
      }
    },
  },
  methods: {
    toGetUserInfo() {
      getUserInfo().then((res) => {
        this.userInfo = res.data;
      });
    },
    checkStatus(index) {
      for (let i = 0; i < this.editArray.length; i++) {
        if (index == i) {
          this.$set(this.editArray, index, !this.editArray[index]);
          this.$refs[`input${index}`].focus();
        } else {
          this.$set(this.editArray, i, false);
        }
      }
    },
    checkWx() {
      if (this.userInfo.wxNickname) {
        //解绑
        unBindWechat().then((res) => {
          if (res.code == 200) {
            this.$message({
              message: "解绑成功",
              type: "success",
            });
          }
          this.toGetUserInfo();
        });
      } else {
        let token = localStorage.getItem("token");
        //绑定
        loginOut({ token: token }).then((res) => {});
        localStorage.removeItem("token");
        this.$router.push({ path: "/login", query: { bindType: "bind" } });
      }
    },
    toSave() {
      this.checkStatus(0);
      updateUser({
        id: this.userInfo.id, //用户id
        nickname: this.userInfo.nickname, // 用户昵称
      }).then((res) => {
        this.toGetUserInfo();
      });
    },
    toGetCode(type) {
      if (this.timer) return;
      this.countDown = 60;
      this.timer = setInterval(() => {
        this.countDown -= 1;
        if (0 == this.countDown) {
          clearInterval(this.timer);
          this.timer = null;
        }
      }, 1000);
      updateTelGetCode({
        tel: this.userInfo.mobile, //  手机号
        type: type, // (1:修改手机号 2修改密码)
      }).then((res) => {});
    },
    toGetNewPhoneCode() {
      const phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;

      if (!phoneReg.test(this.newPhone)) {
        this.$message({
          message: "请输入正确的手机号码",
          type: "warning",
        });
        return;
      }
      if (this.timer2) return;
      this.countDown2 = 60;
      this.timer2 = setInterval(() => {
        this.countDown2 -= 1;
        if (0 == this.countDown2) {
          clearInterval(this.timer2);
          this.timer2 = null;
        }
      }, 1000);
      checkTelCode({
        userId: this.userInfo.id,
        oldTel: this.userInfo.mobile, //现手机号
        oldCode: this.code, // 现手机号验证码
        newTel: this.newPhone, //新手机号
      }).then((res) => {});
    },
    editPhone() {
      if (!this.code2 || !this.newPhone) {
        this.$message({
          message: "请输入验证码",
          type: "warning",
        });
        return;
      }
      updateUserTel({
        userId: this.userInfo.id,
        newTel: this.newPhone, // 新手机号
        newCode: this.code2, //  新手机号验证码
      }).then((res) => {
        this.showPhoneMask = false;
        this.resetData();
      });
    },
    editPassword() {
      let params = {
        code: this.code, //  验证码
        tel: this.userInfo.mobile, //手机号
        password: this.newPasswordConfirm, //  密码
        userId: this.userInfo.id, //用户id
      };
      for (const key in params) {
        if (!params[key]) {
          this.$message({
            message: "请填写每项内容",
            type: "warning",
          });
          return;
        }
      }
      updateUserPassword(params).then((res) => {
        this.showPasswordMask = false;
        this.resetData();
      });
    },
    getImg() {
      if (document.getElementById("fileInput")) {
        document.body.removeChild(document.getElementById("fileInput"));
      }
      let input = document.createElement("input");
      input.id = "fileInput";
      input.type = "file";
      input.style.display = "none";
      input.accept = ".png,.jpg,.jpeg,.PNG,.JPG,.JPEG";

      document.body.appendChild(input);
      input.addEventListener("change", (e) => {
        this.dealFile(input.files[0]);
      });
      input.click();
    },
    dealFile(file) {
      uploadReturnUrl({
        file: file,
      }).then((res) => {
        updateUser({
          id: this.userInfo.id, //用户id
          avatar: res.data.fileUrl,
        }).then((res2) => {
          this.toGetUserInfo();
        });
      });
    },
    resetData() {
      Object.assign(this.$data, this.$options.data());
      this.toGetUserInfo();
    },
  },
  created() {
    this.toGetUserInfo();
  },
  destroyed() {
    clearInterval(this.timer);
  },
};
</script>
        <style lang="scss" scoped>
.infoSet {
  z-index: 99;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  .head {
    font-weight: 500;
    font-size: 16px;
    color: #3d3d3d;
    margin-top: 28px;
    padding: 0 20px;
    .left_arrow {
      width: 20px;
      height: 20px;
      margin-right: 10px;
      cursor: pointer;
    }
    .close {
      width: 20px;
      height: 20px;
      margin-left: auto;
      margin-right: 4px;
      cursor: pointer;
    }
  }
  .info_row {
    display: flex;
    align-items: center;
    margin-top: 12px;
    padding: 0 20px;
    .subtitle {
      width: 58px;
      font-weight: 500;
      font-size: 14px;
      color: #3d3d3d;
    }
    .avatar_con {
      margin-left: 6px;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      position: relative;
      &:hover {
        .avatar_mask {
          display: flex;
        }
      }
      .avatar {
        width: 38px;
        height: 38px;
        border-radius: 50%;
      }
      .avatar_mask {
        display: none;
        position: absolute;
        left: 0;
        top: 0;
        width: 38px;
        height: 38px;
        font-size: 12px;
        color: #959595;
        background: rgba(255, 255, 255, 0.4);
        justify-content: center;
        cursor: pointer;
      }
    }
    .info_content {
      width: 230px;
      height: 28px;
      padding-left: 6px;
      margin-left: 4px;
      line-height: 28px;
      font-size: 14px;
      color: #3d3d3d;
      outline: none;
      border: none;
      &::placeholder {
        color: #959595;
      }
    }
    .active_info_content {
      border: 1px solid #eeeeee;
      border-radius: 2px;
    }
    .verification_code_con {
      position: relative;
      .get_code {
        position: absolute;
        right: 3px;
        top: 3px;
        width: 75px;
        height: 22px;
        border-radius: 4px;
        border: 1px solid #12db34;
        text-align: center;
        line-height: 22px;
        font-family: Source Han Sans, Source Han Sans;
        font-size: 12px;
        color: #12db34;
        cursor: pointer;
      }
    }
  }
  .edit_btn {
    width: 49px;
    height: 28px;
    background: rgba(194, 246, 202, 0.6);
    border-radius: 3px;
    font-size: 14px;
    color: #12db34;
    text-align: center;
    line-height: 28px;
    margin-left: auto;
    cursor: pointer;
  }
  .main {
    width: 458px;
    height: 422px;
    background: #ffffff;
    border-radius: 18px;
    position: relative;

    .footer {
      width: 100%;
      height: 76px;
      border-top: 1px solid #eeeeee;
      position: absolute;
      bottom: 0;
      left: 0;
      .save_btn {
        width: 84px;
        height: 38px;
        background: #12db34;
        border-radius: 11px;
        font-weight: 500;
        font-size: 14px;
        color: #ffffff;
        text-align: center;
        line-height: 38px;
        margin-left: auto;
        margin-right: 20px;
        cursor: pointer;
      }
    }
  }
  .mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 458px;
    height: 422px;
    background: #ffffff;
    border-radius: 18px;
  }
}
</style>