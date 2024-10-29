<template>
  <div>
    <div class="sheet_box">
      <div class="box_left">
        <span class="title">基本信息</span>
        <span class="des">我们建议单天的拍摄计划至少出具 一张拍摄通告</span>
      </div>
      <div class="box_right">
        <div class="subtitle">
          <img src="@/assets/img/operatePage/necessary.png" alt="" />通告标题
        </div>
        <input v-model="form1.title" type="text" placeholder="请输入" />
        <div class="subtitle">
          <img src="@/assets/img/operatePage/necessary.png" alt="" />拍摄日期
        </div>
        <el-date-picker
          style="width: 415px"
          v-model="form1.dateSelect"
          type="date"
          placeholder="选择日期"
          value-format="yyyy年MM月dd日"
          :clearable="false"
        >
        </el-date-picker>
        <div class="subtitle">第一镜时间</div>
        <el-time-picker
          style="width: 415px"
          v-model="form1.timeSelect"
          placeholder="选择第一镜时间"
          format="HH:mm"
          value-format="HH:mm"
          :clearable="false"
        >
        </el-time-picker>
        <div class="subtitle">拍摄地点</div>
        <input type="text" placeholder="请输入" />
        <div class="subtitle">天气</div>
        <input type="text" placeholder="请输入" />
        <div class="subtitle">备注</div>
        <input
          v-model="form1.notes"
          type="text"
          placeholder="你可以输入一些针对整个通告的备注信息"
        />
      </div>
    </div>
    <div class="sheet_box">
      <div class="box_left">
        <div class="title">人员信息</div>
        <div class="des">如果有多位可以使用“、”隔开</div>
      </div>
      <div class="box_right">
        <div class="subtitle">
          <img src="@/assets/img/operatePage/necessary.png" alt="" />角色 + 姓名
        </div>
        <div class="info_row flex">
          <el-select
            style="width: 165px; margin-right: 14px"
            v-model="value"
            placeholder="请选择"
            :popper-append-to-body="false"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <input style="width: 236px" type="text" placeholder="请输入" />
        </div>
        <img
          class="add_row"
          src="@/assets/img/operatePage/add_row.png"
          alt=""
        />
        <div class="subtitle">备注</div>
        <input type="text" placeholder="请输入" />
      </div>
    </div>
  </div>
</template>
            
      <script>
import { mapState, mapMutations } from "vuex";
export default {
  components: {},
  computed: {
    ...mapState(["activeNotice"]),
  },
  data() {
    return {
      form1: {},
      options: [
        {
          value: "导演",
          label: "导演",
        },
        {
          value: "摄影",
          label: "摄影",
        },
        {
          value: "制片",
          label: "制片",
        },
      ],
      value: "导演",
    };
  },
  methods: {
    ...mapMutations(["SET_NOTICELIST", "SET_ACTIVENOTICE"]),
  },
  created() {
    this.form1 = this.activeNotice.form1;
  },
};
</script>
<style lang="scss" scoped>
.sheet_box {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  input {
    width: 415px;
    height: 32px;
    border-radius: 5px;
    border: 1px solid #e4e5ee;
    outline: none;
    padding: 0 12px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #3d3d3d;
    &::placeholder {
      color: #959595;
    }
  }
  ::v-deep .el-input__inner {
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
  .box_left {
    display: flex;
    flex-direction: column;
    width: 150px;
    margin-right: 70px;
    padding-top: 20px;
    .title {
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 16px;
      color: #3d3d3d;
    }
    .des {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 12px;
      color: #959595;
      line-height: 18px;
      margin-top: 2px;
    }
  }
  .box_right {
    display: flex;
    flex-direction: column;
    .subtitle {
      margin-top: 20px;
      margin-bottom: 10px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 14px;
      color: #3d3d3d;
      img {
        width: 10px;
        height: 10px;
        margin-right: 5px;
      }
    }
    .info_row {
      margin-top: 10px;
    }
    .add_row {
      width: 26px;
      height: 26px;
      margin-top: 12px;
      cursor: pointer;
    }
  }
}
</style>