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
            v-for="(item, index) in form3"
            :key="index"
            v-show="item.isDelete == '0' || !item.isDelete"
          >
            <el-select
              style="width: 165px; margin-right: 14px"
              v-model="item.planId"
              placeholder="请选择"
              :popper-append-to-body="false"
              @change="change($event, index)"
              :disabled="activeProject.banEdit"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-select
              style="width: 90px; margin-right: 14px"
              v-model="item.sceneryType"
              placeholder="内/外景"
              :popper-append-to-body="false"
              :disabled="activeProject.banEdit"
            >
              <el-option
                v-for="item in sceneryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-time-picker
              style="width: 118px; margin-right: 14px"
              v-model="item.startTime"
              placeholder="开始时间"
              format="HH:mm"
              :clearable="false"
              :readonly="activeProject.banEdit"
            >
            </el-time-picker>
            <el-time-picker
              style="width: 118px"
              v-model="item.endTime"
              placeholder="结束时间"
              format="HH:mm"
              :clearable="false"
              :readonly="activeProject.banEdit"
            >
            </el-time-picker>
            <div
              v-if="!activeProject.banEdit"
              class="deleteMember flex"
              @click="item.isDelete = '1'"
            >
              <img src="@/assets/img/homePage/recycle_bin.png" alt="" />
            </div>
          </div>
          <img
            v-if="!activeProject.banEdit"
            @click="addRow"
            class="add_row"
            src="@/assets/img/operatePage/add_row.png"
            alt=""
          />
          <div class="subtitle">备注</div>
          <input
            type="text"
            placeholder="请输入"
            v-model="notes"
            :readonly="activeProject.banEdit"
          />
        </div>
      </div>
    </div>
  </div>
</template>
              
        <script>
import { mapState, mapMutations } from "vuex";
import { shootPlanList } from "@/assets/js/request";
import { timeSlot, scenerySlot } from "@/assets/js/data";
export default {
  components: {},
  computed: {
    ...mapState(["activeNotice", "activeProject"]),
  },
  data() {
    return {
      form3: [],
      notes: "",
      options: [],
      sceneryOptions: [
        {
          value: "0",
          label: "内景",
        },
        {
          value: "1",
          label: "外景",
        },
      ],
      shootingList: [],
    };
  },
  watch: {
    form3: {
      handler: function (newVal, oldVal) {
        this.activeNotice.shootAnnouncePlanList = newVal;
        this.SET_ACTIVENOTICE(this.activeNotice);
        console.log(this.activeNotice, "this.activeNotice");
      },
      deep: true,
    },
  },
  methods: {
    ...mapMutations(["SET_NOTICELIST", "SET_ACTIVENOTICE"]),
    addRow() {
      this.form3.push({
        id: null,
        projectId: this.activeProject.id,
        planId: "", // (和拍摄计划关联id)
        announceId: this.activeNotice.shootAnnounce.id,
      });
    },
    change(e, index) {
      for (let i = 0; i < this.shootingList.length; i++) {
        if (this.shootingList[i].id == e) {
          this.form3[index].type = "1";
          this.$set(
            this.form3[index],
            "sceneryType",
            this.shootingList[i].sceneryType
          );
          this.$set(
            this.form3[index],
            "startTime",
            this.shootingList[i].startTime
          );
          this.$set(this.form3[index], "endTime", this.shootingList[i].endTime);
        }
      }
    },
    getShootList() {
      shootPlanList({
        projectId: this.activeProject.id,
        sortType: 1,
      }).then((res) => {
        this.shootingList = res.data;
        this.options = [];
        for (let i = 0; i < res.data.length; i++) {
          let item = {
            value: res.data[i].id,
            label: res.data[i].planContent,
          };
          this.options.push(item);
        }
      });
    },
  },
  created() {
    this.getShootList();
    this.form3 = this.activeNotice.shootAnnouncePlanList;
    if (this.activeNotice.shootAnnouncePlanList.length == 0) {
      this.addRow();
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
    font-weight: 500;
    font-size: 16px;
    color: #3d3d3d;
  }
  .des {
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
    position: relative;
    .deleteMember {
      position: absolute;
      right: -36px;
      top: 4px;
      width: 26px;
      height: 26px;
      background: #ededed;
      border-radius: 50%;
      justify-content: center;
      cursor: pointer;
      > img {
        width: 16px;
        height: 16px;
      }
    }
  }
  .add_row {
    width: 26px;
    height: 26px;
    margin-top: 12px;
    cursor: pointer;
  }
}
</style>