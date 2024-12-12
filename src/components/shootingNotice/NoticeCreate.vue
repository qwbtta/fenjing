<template>
  <div class="notice_scroll_area">
    <div class="sheet_box">
      <div class="box_left">
        <span class="title">基本信息</span>
        <span class="des">我们建议单天的拍摄计划至少出具 一张拍摄通告</span>
      </div>
      <div class="box_right">
        <div class="subtitle">
          <img src="@/assets/img/operatePage/necessary.png" alt="" />通告标题
        </div>
        <input
          v-model="form1.shootAnnounce.announceName"
          type="text"
          placeholder="请输入"
          :readonly="activeProject.banEdit"
        />
        <div class="subtitle">
          <img src="@/assets/img/operatePage/necessary.png" alt="" />拍摄日期
        </div>
        <el-date-picker
          style="width: 415px"
          v-model="form1.shootAnnounce.announceTime"
          type="date"
          placeholder="选择日期"
          :clearable="false"
          :readonly="activeProject.banEdit"
        >
        </el-date-picker>
        <div class="subtitle">第一镜时间</div>
        <el-time-picker
          style="width: 415px"
          v-model="form1.shootAnnounce.firstMirror"
          placeholder="选择第一镜时间"
          format="HH:mm"
          :clearable="false"
          :readonly="activeProject.banEdit"
        >
        </el-time-picker>
        <div class="subtitle">拍摄地点</div>
        <input
          type="text"
          placeholder="请输入"
          v-model="form1.shootAnnounce.shootAdress"
          :readonly="activeProject.banEdit"
        />
        <div class="subtitle">天气</div>
        <input
          type="text"
          placeholder="请输入"
          v-model="form1.shootAnnounce.weather"
          :readonly="activeProject.banEdit"
        />
        <div class="subtitle">备注</div>
        <input
          v-model="form1.shootAnnounce.remark"
          type="text"
          placeholder="你可以输入一些针对整个通告的备注信息"
          :readonly="activeProject.banEdit"
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

        <div
          class="info_row flex"
          v-for="(item, index) in form1.shootAnnounceMemberList"
          :key="index"
          v-show="item.isDelete == '0'"
        >
          <el-select
            style="width: 165px; margin-right: 14px"
            v-model="item.memberType"
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
            v-model="item.memberName"
            :readonly="activeProject.banEdit"
          />
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
          class="add_row"
          src="@/assets/img/operatePage/add_row.png"
          alt=""
          @click="addMember()"
        />
        <div class="subtitle">备注</div>
        <input
          type="text"
          placeholder="请输入"
          v-model="form1.shootAnnounceMemberList[0].remark"
          :readonly="activeProject.banEdit"
        />
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
      form1: {},
      options: [
        {
          value: "1",
          label: "导演",
        },
        {
          value: "2",
          label: "摄影",
        },
        {
          value: "3",
          label: "制片",
        },
      ],
    };
  },
  methods: {
    ...mapMutations(["SET_NOTICELIST", "SET_ACTIVENOTICE"]),
    addMember() {
      this.form1.shootAnnounceMemberList.push({
        id: null,
        projectId: this.activeProject.id,
        announceId: this.activeNotice.shootAnnounce.id,
        memberType: "", //人员类型 按原型顺序从1开始排
        memberName: "", // 名称
        remark: "",
        status: "0",
        isDelete: "0",
      });
    },
  },
  created() {
    this.form1 = this.activeNotice;
    if (this.form1.shootAnnounceMemberList.length == 0) {
      this.addMember();
    }
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
}
</style>