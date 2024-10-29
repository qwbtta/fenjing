<template>
  <div class="NoticePlan">
    <div class="sheet_box">
      <div class="box_left">
        <span class="title">通告拍摄计划</span>
        <span class="des">选择今日要执行的拍摄计划</span>
      </div>
      <div class="box_right">
        <div class="box_right">
          <div class="subtitle">
            <img src="@/assets/img/operatePage/necessary.png" alt="" />拍摄计划
            + 内/外景 + 开始时间 + 结束时间
          </div>
          <div
            class="info_row flex"
            v-for="(item, index) in form3.planList"
            :key="index"
          >
            <el-select
              style="width: 165px; margin-right: 14px"
              v-model="item.name"
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
            <input
              style="width: 236px"
              type="text"
              placeholder="请输入"
              v-model="item.place"
            />
            <el-time-picker
              style="width: 236px"
              v-model="item.time"
              placeholder="选择时间"
              format="HH:mm"
              value-format="HH:mm"
              :clearable="false"
            >
            </el-time-picker>
          </div>
          <img
            @click="addRow"
            class="add_row"
            src="@/assets/img/operatePage/add_row.png"
            alt=""
          />
          <div class="subtitle">备注</div>
          <input
            type="text"
            placeholder="请输入"
            v-model="form3.planList.notes"
          />
        </div>
      </div>
      <!-- <span
          v-if="index !== 0"
          @click="form2.groupNotice.groupList.splice(index, 1)"
          >删除</span
        > -->
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
      form3: {
        planList: [
          {
            name: "",
            place: "",
            time: "",
            notes: "",
          },
        ],
      },
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
    addRow() {
      this.form3.planList.push({
        name: "",
        place: "",
        time: "",
      });
      this.SET_ACTIVENOTICE(this.activeNotice);
    },
  },
  created() {
    if (this.activeNotice.form3.planList) {
      this.form3 = this.activeNotice.form3;
    }
  },
};
</script>
  <style lang="scss" scoped>
.sheet_box {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
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
  margin-right: 14px;
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
</style>