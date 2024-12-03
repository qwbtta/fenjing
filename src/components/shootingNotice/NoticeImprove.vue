<template>
  <div class="NoticeImprove">
    <div class="sheet_box">
      <div class="box_left">
        <span class="title">分组通告</span>
        <span class="des">用于规定各个制作小组的集合时间和集合地点</span>
      </div>
      <div class="box_right">
        <div class="box_right">
          <div class="subtitle">
            <img src="@/assets/img/operatePage/necessary.png" alt="" />工作组 +
            地点 + 到场时间
          </div>
          <div
            class="info_row flex"
            v-for="(item, index) in form2"
            :key="index"
            v-show="item.type == 0 && item.isDelete == '0'"
          >
            <el-select
              style="width: 165px; margin-right: 14px"
              v-model="item.groupName"
              placeholder="请选择"
              :popper-append-to-body="false"
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
            <input
              style="width: 236px"
              type="text"
              placeholder="请输入"
              v-model="item.groupAdress"
              :readonly="activeProject.banEdit"
            />
            <el-time-picker
              style="width: 236px"
              v-model="item.arriveTime"
              placeholder="选择时间"
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
            @click="addRow('0')"
            class="add_row"
            src="@/assets/img/operatePage/add_row.png"
            alt=""
          />
          <div class="subtitle">备注</div>
          <input
            @input="setNotes(false, $event)"
            type="text"
            placeholder="请输入"
            v-model="groupNotes"
            :readonly="activeProject.banEdit"
          />
        </div>
      </div>
      <!-- <span
          v-if="index !== 0"
          @click="form2.groupNotice.groupList.splice(index, 1)"
          >删除</span
        > -->
    </div>
    <div class="sheet_box">
      <div class="box_left">
        <span class="title">演员通告</span>
        <span class="des">用于规定演员的集合时间和集合地点</span>
      </div>
      <div class="box_right">
        <div class="box_right">
          <div class="subtitle">
            <img src="@/assets/img/operatePage/necessary.png" alt="" />演员 +
            地点 + 到场时间
          </div>
          <div
            class="info_row flex"
            v-for="(item, index) in form2"
            :key="index"
            v-show="item.type == 1 && item.isDelete == '0'"
          >
            <el-select
              style="width: 165px; margin-right: 14px"
              v-model="item.groupName"
              placeholder="请选择"
              :popper-append-to-body="false"
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
            <input
              style="width: 236px"
              type="text"
              placeholder="请输入"
              v-model="item.groupAdress"
              :readonly="activeProject.banEdit"
            />
            <el-time-picker
              style="width: 236px"
              v-model="item.arriveTime"
              placeholder="选择时间"
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
            @click="addRow('1')"
            class="add_row"
            src="@/assets/img/operatePage/add_row.png"
            alt=""
            v-if="!activeProject.banEdit"
          />
          <div class="subtitle">备注</div>
          <input
            @input="setNotes(true, $event)"
            type="text"
            placeholder="请输入"
            v-model="actorNotes"
            :readonly="activeProject.banEdit"
          />
        </div>
      </div>
    </div>
  </div>
</template>
              
        <script>
import { mapState, mapMutations } from "vuex";
export default {
  components: {},
  computed: {
    ...mapState(["activeNotice", "activeProject"]),
  },
  data() {
    return {
      form2: [],
      groupNotes: "",
      actorNotes: "",
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
  watch: {
    form2: {
      handler: function (newVal, oldVal) {
        this.activeNotice.shootGroupAnnounceList = newVal;
        this.SET_ACTIVENOTICE(this.activeNotice);
      },
      deep: true,
    },
  },
  methods: {
    ...mapMutations(["SET_NOTICELIST", "SET_ACTIVENOTICE"]),
    addRow(type) {
      this.form2.push({
        id: null,
        projectId: this.activeProject.id,
        announceId: this.activeNotice.shootAnnounce.id,
        groupName: "", // 分组名称
        groupAdress: "",
        arriveTime: "", //到达时间
        remark: "",
        type: type, // 0分组通告  1演员通告
        status: "0",
        isDelete: "0",
      });
      // this.SET_ACTIVENOTICE(this.activeNotice);
    },

    setNotes(isActor, e) {
      //接口数据设计问题  只能这么手动弄下
      for (let i = 0; i < this.form2.length; i++) {
        if (
          (isActor && this.form2[i].type == 1) ||
          (!isActor && this.form2[i].type == 0)
        ) {
          this.form2[i].remark = e.target.value;
        }
      }
    },
  },
  created() {
    //接口数据设计的上传一个数组  回来两个数组  只能手动调整下
    // if (this.activeNotice.shootGroupAnnounceList.length == 0) {
    //   this.addRow("0");
    // }
    // console.log(this.activeNotice, "this.activeNotice");
    // if (this.activeNotice.shootActorGroupAnnounceList.length == 0) {
    //   this.addRow("1");
    // }
    this.form2 = [
      ...this.form2,
      ...JSON.parse(JSON.stringify(this.activeNotice.shootGroupAnnounceList)),
      ...JSON.parse(
        JSON.stringify(this.activeNotice.shootActorGroupAnnounceList)
      ),
    ];
    for (let i = 0; i < this.form2.length; i++) {
      if (this.form2[i].type == 1) {
        this.actorNotes = this.form2[i]?.remark;
      }
      if (this.form2[i].type == 0) {
        this.groupNotes = this.form2[i]?.remark;
      }
    }
    console.log(this.form2, "this.form2");
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
  min-width: 665px;
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