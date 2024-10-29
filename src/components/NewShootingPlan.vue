<template>
  <div class="NewShootingPlan flex">
    <div class="shooting_panel">
      <div class="panel_head flex">
        <span>{{ this.OperationType == "编辑" ? "修改场次" : "新建场次" }}</span
        ><span @click="$emit('close')">关闭</span>
      </div>
      <div class="subtitle flex">
        <img
          class="necessary"
          src="@/assets/img/operatePage/necessary.png"
          alt=""
        />拍摄场次
      </div>
      <input
        v-model="shootingData.shootingSessions"
        type="text"
        placeholder="请填写需要拍摄场次的编号或者名称"
      />

      <div class="row flex">
        <div class="row_item">
          <div class="subtitle">时段</div>
          <el-select
            class="el_elect"
            v-model="shootingData.timeSlotValue"
            placeholder="请选择"
          >
            <el-option
              v-for="item in timeSlot"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="row_item">
          <div class="subtitle">内/外景</div>
          <el-select
            class="el_elect"
            v-model="shootingData.scenerySlotValue"
            placeholder="请选择"
          >
            <el-option
              v-for="item in scenerySlot"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="row flex">
        <div class="row_item">
          <div class="subtitle">计划拍摄日期</div>
          <el-date-picker
            v-model="shootingData.dateSelect"
            type="date"
            placeholder="选择日期"
            value-format="yyyy年MM月dd日"
            :clearable="false"
          >
          </el-date-picker>
        </div>
        <div class="row_item">
          <div class="subtitle">计划拍摄时间</div>
          <el-time-picker
            v-model="shootingData.timeSelect"
            placeholder="任意时间点"
            format="HH:mm"
            value-format="HH:mm"
            :clearable="false"
          >
          </el-time-picker>
        </div>
      </div>

      <div class="subtitle">拍摄地点</div>
      <input
        v-model="shootingData.shootingLocation"
        type="text"
        placeholder="请填写地址"
      />
      <div class="btn_group flex">
        <div class="normal_btn canel" @click="$emit('close')">取消</div>
        <div class="normal_btn confirm" @click="confirm">
          {{ this.OperationType == "编辑" ? "保存" : "创建" }}
        </div>
      </div>
    </div>
  </div>
</template>
            
<script>
import { mapState, mapMutations } from "vuex";
export default {
  props: ["planIndex", "OperationType"],
  components: {},
  computed: {
    ...mapState(["shootingList"]),
  },
  data() {
    return {
      shootingData: {
        shootingSessions: "", //拍摄场次
        timeSlotValue: "白天", //拍摄时段
        scenerySlotValue: "内景", //拍摄景别
        dateSelect: "", //计划拍摄日期
        timeSelect: "", //计划拍摄时间
        shootingLocation: "", //拍摄地点
        shotList: [], //镜头列表
      },
      timeSlot: [
        {
          value: "白天",
          label: "白天",
        },
        {
          value: "夜晚",
          label: "夜晚",
        },
        {
          value: "上午",
          label: "上午",
        },
        {
          value: "下午",
          label: "下午",
        },
      ],
      scenerySlot: [
        {
          value: "内景",
          label: "内景",
        },
        {
          value: "外景",
          label: "外景",
        },
      ],
    };
  },
  methods: {
    ...mapMutations(["SET_SHOOTINGLIST"]),
    checkValue(value, activeValue) {
      this.shootingData[activeValue] = value;
      this[`${activeValue}Show`] = false;
    },
    confirm() {
      if (!this.shootingData.shootingSessions) {
        this.$message({
          message: "请填写需要拍摄场次的编号或者名称",
          type: "error",
        });
        return;
      }
      if (this.OperationType == "编辑") {
        this.shootingList[this.planIndex] = this.shootingData;
      } else {
        this.shootingList.push(this.shootingData);
      }
      this.SET_SHOOTINGLIST(this.shootingList);
      this.$emit("close");
    },
  },
  created() {
    if (this.OperationType == "编辑") {
      this.shootingData = JSON.parse(
        JSON.stringify(this.shootingList[this.planIndex])
      );
    }
  },
};
</script>
      <style lang="scss" scoped>
.NewShootingPlan {
  z-index: 99;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);

  ::v-deep .el-input__inner {
    width: 204px;
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
  .shooting_panel {
    width: 458px;
    background: #ffffff;
    border-radius: 18px;
    padding: 0 20px 31px;
    .panel_head {
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 16px;
      color: #3d3d3d;
      margin-top: 28px;
      justify-content: space-between;
      .close {
        margin-right: 4px;
        cursor: pointer;
      }
    }
    .subtitle {
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 14px;
      color: #3d3d3d;
      margin-top: 28px;
      margin-bottom: 11px;
      .necessary {
        width: 10px;
        height: 10px;
        margin-right: 5px;
      }
    }
    .row {
      justify-content: space-between;
    }
    .row_item {
      width: 204px;
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
      .canel {
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