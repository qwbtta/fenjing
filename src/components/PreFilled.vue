<template>
  <div class="PreFilled flex">
    <div class="edit_panel">
      <div class="panel_head flex">
        <span>创建通告</span><span @click="$emit('close')">关闭</span>
      </div>
      <div class="subtitle">通告标题</div>

      <input
        v-model="tempActiveNotice.form1.title"
        type="text"
        placeholder="请输入通告标题"
      />
      <div class="subtitle">拍摄日期</div>
      <el-date-picker
        style="width: 100%"
        v-model="tempActiveNotice.form1.dateSelect"
        type="date"
        placeholder="选择日期"
        value-format="yyyy年MM月dd日"
        :clearable="false"
      >
      </el-date-picker>
      <div class="btn_group flex">
        <div class="normal_btn cancel" @click="$emit('close')">取消</div>
        <div class="normal_btn confirm" @click="confirm">确认</div>
      </div>
    </div>
  </div>
</template>
            
<script>
import { mapState, mapMutations } from "vuex";
export default {
  components: {},
  computed: {
    ...mapState(["noticeList", "activeNotice"]),
  },
  data() {
    return {
      tempActiveNotice: {
        //当前正在编辑的通告
        id: "",
        form1: {
          title: "",
          dateSelect: "",
          timeSelect: "",
          notes: "",
        }, //创建通告页
        form2: {}, //完善通告页
        form3: {}, //计划与日程页
      },
    };
  },
  methods: {
    ...mapMutations(["SET_NOTICELIST", "SET_ACTIVENOTICE"]),
    confirm() {
      if (!this.tempActiveNotice.form1.title) {
        this.$message({
          message: "请填写通告标题",
          type: "error",
        });
        return;
      }
      if (!this.tempActiveNotice.form1.dateSelect) {
        this.$message({
          message: "请填写拍摄日期",
          type: "error",
        });
        return;
      }
      this.tempActiveNotice.form1.timeStamp = Date.parse(
        this.tempActiveNotice.form1.dateSelect
          .replace("年", "/")
          .replace("月", "/")
          .replace("日", "")
      );
      this.tempActiveNotice.id = Date.now().toString();
      this.SET_ACTIVENOTICE(this.tempActiveNotice);

      this.noticeList.push(this.tempActiveNotice);
      this.SET_NOTICELIST(this.noticeList);
      this.$router.push("/noticeSheet");
    },
  },
  created() {},
};
</script>
      <style lang="scss" scoped>
.PreFilled {
  z-index: 99;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  ::v-deep .el-input__inner {
    width: 100%;
    height: 32px;
    border-radius: 5px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #3d3d3d;
  }
  ::v-deep .el-input__icon {
    line-height: 32px;
  }
  input {
    width: 100%;
    height: 32px;
    border-radius: 5px;
    border: 1px solid #e4e5ee;
    outline: none;
    padding: 0 12px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #3d3d3d;
    margin-right: 9px;
    &::placeholder {
      color: #959595;
    }
  }
  .edit_panel {
    width: 458px;
    background: #ffffff;
    border-radius: 20px;
    padding: 0 20px 29px 18px;
    .panel_head {
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 20px;
      color: #3d3d3d;
      margin-top: 32px;
      justify-content: space-between;
    }
    .subtitle {
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 14px;
      color: #3d3d3d;
      margin-top: 28px;
      margin-bottom: 11px;
    }
    .btn_group {
      margin-top: 20px;
      justify-content: flex-end;
      .normal_btn {
        width: 84px;
        height: 38px;
        border-radius: 11px;
        text-align: center;
        line-height: 38px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 14px;
        margin-left: 20px;
        cursor: pointer;
      }
      .cancel {
        border: 1px solid #d8d8d8;
        color: #959595;
      }
      .confirm {
        color: #ffffff;
        background: #12db34;
      }
    }
  }
}
</style>