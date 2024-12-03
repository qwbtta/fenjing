<template>
  <div class="login flex">
    <div class="main_con">
      <img class="close" src="@/assets/img/operatePage/close.png" alt="" />
      <img class="logo" src="@/assets/img/homePage/logo.png" alt="" />
      <div class="main">
        <div class="tab_list flex">
          <div
            class="tab_item"
            :class="{ active_tab_item: item == activeTab }"
            v-for="item in tabList"
            :key="item"
            @click="activeTab = item"
          >
            {{ item }}
          </div>
        </div>
        <!-- v-if="'短信登录' == activeTab" -->
        <div class="SMS_login column">
          <input
            type="text"
            class="input"
            placeholder="请输入手机号"
            v-model="phoneNumber"
          />
          <div class="verification_code_con">
            <input type="text" class="input" placeholder="请输入验证码" />
            <div class="get_code" @click="toGetcode">
              {{ timer ? countDown + "s" : "获取验证码" }}
            </div>
          </div>
          <div class="login_btn" @click="toLoginWithCode">登录</div>
          <div class="tips_con">
            <div class="select"></div>
            <span class="tips"
              >未注册手机登录时会自动创建新号，我已阅读并同意<span
                class="special_span"
                >服务协议</span
              >和<span class="special_span">隐私权条款</span></span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
              
        <script>
import { login, getCode, loginWithCode } from "@/assets/js/request";
export default {
  components: {},
  data() {
    return {
      phoneNumber: "",
      code: "",
      isRegist: false,
      tabList: ["短信登录", "账号登录", "扫码登录"],
      activeTab: "短信登录",
      timer: null,
      countDown: 60,
    };
  },
  methods: {
    toGetcode() {
      const phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;

      if (!phoneReg.test(this.phoneNumber)) {
        this.$message({
          message: "请输入正确的手机号码",
          type: "warning",
        });
        return;
      }

      if (this.timer) return;
      this.countDown = 60;
      this.timer = setInterval(() => {
        this.countDown -= 1;
        if (0 == this.countDown) {
          clearInterval(this.timer);
          this.timer = null;
        }
      }, 1000);
      let params = {
        tel: this.phoneNumber,
      };
      getCode(params).then((res) => {
        if (res.code == 200) {
          this.code = res?.data?.code;
          this.isRegist = res?.data?.isRegist;
        } else {
          this.$message({
            message: `${res.msg}`,
            type: "error",
          });
        }
      });
    },
    toLoginWithCode() {
      const phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      if (!phoneReg.test(this.phoneNumber) || !this.code) {
        this.$message({
          message: "请输入正确的手机号码和验证码！",
          type: "error",
        });
        return;
      }
      let params = {
        tel: this.phoneNumber,
        code: this.code,
      };
      if (!this.isRegist) {
        params.password =
          this.phoneNumber == "18383866864" ? "849746" : "123456";
      }
      loginWithCode(params).then((res) => {
        if (res.token) {
          localStorage.setItem("token", res.token);
          // localStorage.setItem("userInfo", res.data);
          this.$router.push("/");
        } else {
          this.$message({
            message: "登录失败",
            type: "error",
          });
        }
      });
    },
  },
  created() {},
  destroyed() {
    clearInterval(this.timer);
  },
};
</script>
<style lang="scss" scoped>
.login {
  z-index: 99;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  justify-content: center;
  background: transparent;
  justify-content: center;
  .main_con {
    width: 342px;
    height: 466px;
    background: #e6ffea;
    border-radius: 8px;
    position: relative;
    .close {
      width: 20px;
      height: 20px;
      position: absolute;
      right: 13px;
      top: 13px;
      cursor: pointer;
    }
    .logo {
      display: block;
      width: 174px;
      height: 40px;
      margin: 54px auto 38px;
    }
    .main {
      width: 276px;
      height: 286px;
      background: #ffffff;
      border-radius: 8px;
      margin: 0 auto;

      .tab_list {
        .tab_item {
          width: 92px;
          height: 42px;
          background: #f6f6f6;
          text-align: center;
          line-height: 42px;
          font-size: 14px;
          color: #474545;
          cursor: pointer;
          &:first-of-type {
            border-radius: 8px 0 0 0;
          }
          &:last-of-type {
            border-radius: 0 8px 0 0;
          }
        }
        .active_tab_item {
          font-weight: 500;
          color: #3d3d3d;
          background: #fff;
        }
      }
      .SMS_login {
        padding-top: 16px;
        align-items: center;
        .input {
          width: 234px;
          height: 37px;
          background: #f6f6f6;
          border-radius: 4px;
          padding: 0 12px;
          color: #474545;
          font-size: 12px;
          &::placeholder {
            color: #979797;
          }
        }
        .verification_code_con {
          margin-top: 10px;
          position: relative;
          .input {
            padding: 0 100px 0 12px;
          }
          .get_code {
            position: absolute;
            right: 3px;
            top: 3px;
            width: 74px;
            height: 32px;
            border-radius: 4px;
            border: 1px solid #12db34;
            text-align: center;
            line-height: 32px;
            font-family: Source Han Sans, Source Han Sans;
            font-size: 12px;
            color: #12db34;
            cursor: pointer;
          }
        }
        .login_btn {
          width: 239px;
          height: 42px;
          background: #12db34;
          border-radius: 4px;
          text-align: center;
          line-height: 42px;
          font-family: Source Han Sans, Source Han Sans;
          font-weight: 500;
          font-size: 16px;
          color: #ffffff;
          margin-top: 24px;
          margin-bottom: 15px;
          cursor: pointer;
        }
        .tips_con {
          width: 240px;
          display: flex;
          .select {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            border: 1px solid #979797;
            flex-shrink: 0;
            margin-top: 4px;
            margin-right: 4px;
            cursor: pointer;
          }
          .tips {
            font-family: Source Han Sans, Source Han Sans;
            font-size: 10px;
            color: #3d3d3d;
            .special_span {
              color: #1890ff;
              margin: 0 2px;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
</style>