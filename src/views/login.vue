<template>
  <div class="login flex">
    <div class="main_con" :class="{ code_main_con: '扫码登录' == activeTab }">
      <!-- <img class="close" src="@/assets/img/operatePage/close.png" alt="" /> -->
      <img class="logo" src="@/assets/img/homePage/logo.png" alt="" />
      <div class="main" :class="{ code_main: '扫码登录' == activeTab }">
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

        <div v-if="'短信登录' == activeTab" class="SMS_login column">
          <input
            type="text"
            class="input"
            placeholder="请输入手机号"
            v-model="phoneNumber"
          />
          <div class="verification_code_con">
            <input
              type="text"
              v-model="code"
              class="input"
              placeholder="请输入验证码"
            />
            <div class="get_code" @click="toGetcode">
              {{ timer ? countDown + "s" : "获取验证码" }}
            </div>
          </div>
          <input
            v-if="!this.isRegist"
            type="text"
            class="input"
            placeholder="请输入密码"
            v-model="registPassword"
          />
          <input
            v-if="!this.isRegist"
            type="text"
            class="input"
            placeholder="请确认输入密码"
            v-model="registPasswordConfirm"
          />
          <div class="login_btn" @click="toLoginWithCode">登录</div>
          <div v-show="false" class="tips_con">
            <div class="select"></div>
            <span class="tips"
              >未注册手机登录时会自动创建新号，我已阅读并同意<span
                class="special_span"
                >服务协议</span
              >和<span class="special_span">隐私权条款</span></span
            >
          </div>
        </div>
        <div v-if="'账号登录' == activeTab" class="SMS_login column">
          <input
            type="text"
            class="input"
            placeholder="请输入手机号"
            v-model="phoneNumber2"
          />
          <input
            type="text"
            class="input"
            placeholder="请输入密码"
            v-model="password"
          />
          <div class="login_btn" @click="toLogin">登录</div>
          <div v-show="false" class="tips_con">
            <div class="select"></div>
            <span class="tips"
              >未注册手机登录时会自动创建新号，我已阅读并同意<span
                class="special_span"
                >服务协议</span
              >和<span class="special_span">隐私权条款</span></span
            >
          </div>
        </div>
        <div
          v-if="'扫码登录' == activeTab"
          class="code_area"
          :class="{
            SMS_login: wechatLoggedin && !wechatIsRegist,
            column: wechatLoggedin && !wechatIsRegist,
          }"
        >
          <iframe
            v-if="!wechatLoggedin"
            :src="qrCode"
            frameborder="0"
            class="iframe"
          ></iframe>
          <div v-if="wechatLoggedin && !wechatIsRegist">
            <input
              type="text"
              class="input"
              placeholder="请输入手机号"
              v-model="phoneNumber3"
            />
            <div class="verification_code_con">
              <input
                type="text"
                v-model="code2"
                class="input"
                placeholder="请输入验证码"
              />
              <div class="get_code" @click="toGetcode('wechat')">
                {{ timer2 ? countDown2 + "s" : "获取验证码" }}
              </div>
            </div>
            <div class="login_btn" @click="toLoginWithQRCodeRegist">登录</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
              
        <script>
import {
  login,
  getCode,
  loginWithCode,
  getQRCodeUrl,
  loginWithQRCode,
  loginWithQRCodeRegist,
} from "@/assets/js/request";
export default {
  components: {},
  data() {
    return {
      phoneNumber: "", //手机登录页  这里都弄成两个变量 是想切换菜单时保留值
      phoneNumber2: "", // 账号密码登录页
      phoneNumber3: "", //微信绑定页
      code: "", //手机登录页
      code2: "", //微信绑定页
      timer: null, //手机登录页
      timer2: null, //微信绑定页
      countDown: 60, //手机登录页
      countDown2: 60, //微信绑定页
      password: "", //登录密码
      registPassword: "", // 注册密码
      registPasswordConfirm: "", // 注册密码输入确认
      isRegist: true,
      tabList: ["短信登录", "账号登录", "扫码登录"], //
      activeTab: "短信登录",
      qrCode: "", //微信二维码
      wechatLoggedin: false, //是否已微信登录
      wechatIsRegist: true, //微信账号是否注册
    };
  },
  methods: {
    toGetcode(type) {
      const phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      let phoneNumber = type != "wechat" ? this.phoneNumber : this.phoneNumber3;
      if (!phoneReg.test(phoneNumber)) {
        this.$message({
          message: "请输入正确的手机号码",
          type: "warning",
        });
        return;
      }

      if ((type != "wechat" && this.timer) || (type == "wechat" && this.timer2))
        return;
      type != "wechat" ? (this.countDown = 60) : (this.countDown2 = 60);

      // let timer = type != "wechat" ? this.timer : this.timer2;
      // 这种写法无效 没找到原因  只有写成if else
      if (type != "wechat") {
        this.timer = setInterval(() => {
          this.countDown -= 1;
          if (0 == this.countDown) {
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      } else {
        this.timer2 = setInterval(() => {
          this.countDown2 -= 1;
          if (0 == this.countDown2) {
            clearInterval(this.timer2);
            this.timer2 = null;
          }
        }, 1000);
      }

      let params = {
        tel: phoneNumber,
      };
      getCode(params).then((res) => {
        if (res.code == 200) {
          this.isRegist = res?.data?.isRegist;
        } else {
          this.$message({
            message: `${res.msg}`,
            type: "error",
          });
        }
      });
    },
    toLogin() {
      if (!this.phoneNumber2 || !this.password) {
        this.$message({
          message: "请输入手机号码和密码",
          type: "error",
        });
        return;
      }
      login({
        tel: this.phoneNumber2,
        password: this.password,
      }).then((res) => {
        this.checkLogin(res);
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
        if (!this.registPassword || !this.registPasswordConfirm) {
          this.$message({
            message: "请输入密码！",
            type: "error",
          });
          return;
        }

        if (this.registPassword != this.registPasswordConfirm) {
          this.$message({
            message: "密码输入不一致",
            type: "error",
          });
          return;
        }
        params.password = this.registPasswordConfirm;
      }
      loginWithCode(params).then((res) => {
        this.checkLogin(res);
      });
    },
    toLoginWithQRCodeRegist() {
      const phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      if (!phoneReg.test(this.phoneNumber3) || !this.code2) {
        this.$message({
          message: "请输入正确的手机号码和验证码！",
          type: "error",
        });
        return;
      }
      let params = {
        tel: this.phoneNumber3,
        code: this.code2,
        openId: sessionStorage.getItem("openId"),
        wxNickname: sessionStorage.getItem("wxNickname"),
      };

      loginWithQRCodeRegist(params).then((res) => {
        this.checkLogin(res);
      });
    },
    checkLogin(res) {
      if (res.token) {
        localStorage.setItem("token", res.token);

        location.href =
          `${location.host.includes("localhost") ? "http://" : "https://"}` +
          location.host; //这样跳转是为了清除微信回调浏览器会在域名后一直保存参数
      } else {
        this.$message({
          message: res.msg || "登录失败",
          type: "error",
        });
      }
    },
    GetRequest() {
      let url = location.search; //获取url中"?"符后的字符串
      let theRequest = new Object();
      if (url.indexOf("?") != -1) {
        let str = url.slice(1);
        let strs = str.split("&");
        for (let i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
        }
      }
      return theRequest;
    },
  },
  watch: {
    activeTab(newVal) {
      if (newVal == "扫码登录") {
        getQRCodeUrl().then((res) => {
          if (res.code == 200) {
            this.qrCode = res.msg;
          }
        });
      }
    },
  },
  created() {
    console.log(this.GetRequest(), "参数");
    let args = this.GetRequest();

    if (args.code) {
      this.activeTab = "扫码登录";
      this.wechatLoggedin = true;
      loginWithQRCode({ code: args.code }).then((res) => {
        if (!res.data.isRegist) {
          this.wechatIsRegist = false;
          if (res.data.openId) {
            sessionStorage.setItem("openId", res.data.openId);
            sessionStorage.setItem("wxNickname", res.data.wxNickname);
            sessionStorage.setItem("res.data", JSON.stringify(res.data));
            console.log(res.data);
          }
        } else if (res.data.isRegist && res.data.token) {
          localStorage.setItem("token", res.data.token);
          location.href =
            `${location.host.includes("localhost") ? "http://" : "https://"}` +
            location.host; //这样跳转是为了清除微信回调浏览器会在域名后一直保存参数
        }
      });
    }
    if (this.$route.query.bindType == "bind") {
      this.activeTab = "扫码登录";
    }
  },
  destroyed() {
    clearInterval(this.timer);
    clearInterval(this.timer2);
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
  .code_main_con {
    width: 460px !important;
  }
  .main_con {
    width: 342px;
    // height: 466px;
    background: #e6ffea;
    border-radius: 8px;
    position: relative;
    padding-bottom: 48px;
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
    .code_main {
      width: 284px !important;
    }
    .main {
      width: 276px;
      min-height: 286px;
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
        padding-bottom: 34px;
        align-items: center;
        .input {
          width: 234px;
          height: 37px;
          background: #f6f6f6;
          border-radius: 4px;
          padding: 0 12px;
          color: #474545;
          font-size: 12px;
          margin-bottom: 10px;
          &::placeholder {
            color: #979797;
          }
        }
        .verification_code_con {
          margin-bottom: 10px;
          position: relative;
          .input {
            padding: 0 100px 0 12px;
            margin-bottom: 0;
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
          margin-top: 12px;
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
      .code_area {
        height: 476px;
        padding-top: 32px;
      }
      .iframe {
        width: 284px;
        height: 440px;
      }
    }
  }
}
</style>