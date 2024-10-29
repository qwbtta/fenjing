<template>
  <div class="login flex">
    <div class="main_con">
      <div class="close">x</div>
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

        <div class="SMS_login column" v-if="'短信登录' == activeTab">
          <input type="text" class="input" placeholder="请输入手机号" />
          <div class="verification_code_con">
            <input type="text" class="input" placeholder="请输入验证码" />
            <div class="get_code" @click="getcode">获取验证码</div>
          </div>
          <div class="login_btn" @click="loginWithCode">登录</div>
          <div class="tips_con">
            <div class="select"></div>
            <span class="tips"
              >未注册手机登录时会自动创建新号，我已阅读并同意<span
                class="special_span"
                >服务协议</span
              >和<span class="special_span">隐私权条款</span></span
            >
          </div>
          <button @click="login">登录</button>
        </div>
        <!-- 
        <button @click="getcode">发送验证注册</button>
        <button @click="loginWithCode">验证码登录</button> -->
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
      code: "",
      isRegist: false,
      tabList: ["短信登录", "账号登录", "扫码登录"],
      activeTab: "短信登录",
    };
  },
  methods: {
    login() {
      let params = {
        tel: "18383866864",
        password: "849746",
      };
      login(params).then((res) => {
        localStorage.setItem("token", res.token);
      });
    },
    getcode() {
      let params = {
        tel: "18383866864",
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
    loginWithCode() {
      let params = {
        tel: "18383866864",
        code: this.code,
      };
      if (!this.isRegist) {
        params.password = "849746";
      }
      loginWithCode(params).then((res) => {
        localStorage.setItem("token", res.token);
      });
    },
  },
  created() {},
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
      width: 18px;
      height: 18px;
      position: absolute;
      right: 13px;
      top: 13px;
    }
    .main {
      width: 276px;
      height: 286px;
      background: #ffffff;
      border-radius: 8px;
      margin: 132px auto 0;
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