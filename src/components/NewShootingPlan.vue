<template>
  <div class="NewShootingPlan flex">
    <div class="shooting_panel">
      <div class="panel_head flex">
        <span>{{ this.OperationType == "编辑" ? "修改场次" : "新建场次" }}</span
        ><img
          class="close"
          @click="$emit('close')"
          src="@/assets/img/operatePage/close.png"
          alt=""
        />
      </div>
      <div class="subtitle flex">
        <img
          class="necessary"
          src="@/assets/img/operatePage/necessary.png"
          alt=""
        />拍摄场次
      </div>
      <input
        v-model="shootingData.planContent"
        type="text"
        placeholder="请填写需要拍摄场次的编号或者名称"
      />

      <div class="row flex">
        <div class="row_item">
          <div class="subtitle">时段</div>
          <el-select
            class="el_elect"
            v-model="shootingData.dateType"
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
            v-model="shootingData.sceneryType"
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
            v-model="dateSelect"
            type="date"
            placeholder="选择日期"
            :clearable="false"
            @change="dateChange"
          >
          </el-date-picker>
        </div>
        <div class="row_item">
          <div class="subtitle">计划拍摄时间</div>
          <el-time-picker
            v-model="timeSelect"
            placeholder="任意时间点"
            format="HH:mm"
            :clearable="false"
            @change="timeChange"
          >
          </el-time-picker>
        </div>
      </div>

      <div class="subtitle">拍摄地点</div>
      <input
        v-model="shootingData.shootAdress"
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
import { creatShootPlan, updateShootPlan } from "@/assets/js/request";
import { timeSlot, scenerySlot } from "@/assets/js/data";
export default {
  props: ["editItem", "OperationType"],
  components: {},
  computed: {
    ...mapState(["activeProject"]),
  },
  data() {
    return {
      shootingData: {
        planContent: "", //拍摄场次
        dateType: "0", //拍摄时段
        sceneryType: "0", //拍摄景别
        startTime: "", //开始时间
        shootAdress: "", //拍摄地点
      },
      dateSelect: "", //计划拍摄日期
      timeSelect: "", //计划拍摄时间
      timeSlot: this.dealData(timeSlot),
      scenerySlot: this.dealData(scenerySlot),
    };
  },

  methods: {
    dealData(data) {
      let tempList = [];
      for (let i = 0; i < data.length; i++) {
        let tempItem = {
          value: i.toString(),
          label: data[i],
        };
        tempList.push(tempItem);
      }
      return tempList;
    },
    checkValue(value, activeValue) {
      this.shootingData[activeValue] = value;
      this[`${activeValue}Show`] = false;
    },
    dateChange() {
      if (!this.timeSelect) {
        let currentDate = new Date();
        let hours = currentDate.getHours();
        let minutes = currentDate.getMinutes();
        this.dateSelect.setHours(hours);
        this.dateSelect.setMinutes(minutes);
        this.timeSelect = this.dateSelect;
      } else {
        this.dateSelect.setHours(this.timeSelect.getHours());
        this.dateSelect.setMinutes(this.timeSelect.getMinutes());
      }
    },
    timeChange() {
      if (!this.dateSelect) {
        this.dateSelect = this.timeSelect;
      } else {
        this.dateSelect.setHours(this.timeSelect.getHours());
        this.dateSelect.setMinutes(this.timeSelect.getMinutes());
      }
    },
    confirm() {
      if (!this.shootingData.planContent) {
        this.$message({
          message: "请填写需要拍摄场次的编号或者名称",
          type: "error",
        });
        return;
      }
      // if (this.OperationType == "编辑") {
      //   this.shootingList[this.planIndex] = this.shootingData;
      // } else {
      //   this.shootingList.push(this.shootingData);
      // }
      let params = {
        planContent: this.shootingData.planContent,
        dateType: this.shootingData.dateType,
        sceneryType: this.shootingData.sceneryType,
        // startTime: this.shootingData.startTime,
        shootAdress: this.shootingData.shootAdress,
      };
      params.startTime = this.dateSelect;
      if (this.OperationType == "新建") {
        params.projectId = this.activeProject.id;
        creatShootPlan(params).then((res) => {
          this.$emit("close", "refreshList");
        });
      } else {
        params.id = this.shootingData.id;
        // params.endTime = "";
        // params.remark = "";
        updateShootPlan(params).then((res) => {
          this.$emit("close", "refreshList");
        });
      }
    },
  },
  created() {
    if (this.OperationType == "编辑" && this.editItem) {
      this.shootingData = JSON.parse(JSON.stringify(this.editItem));
      this.dateSelect = this.timeSelect = new Date(this.shootingData.startTime);
    }
    console.log(this.shootingData, "this.shootingData ");
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
      font-weight: 500;
      font-size: 16px;
      color: #3d3d3d;
      margin-top: 28px;
      justify-content: space-between;
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