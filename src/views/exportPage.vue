<template>
  <div class="export_page">
    <div class="left">
      <div class="left_head flex" @click="$router.push('/storyboard')">
        <img
          class="left_arrow"
          src="@/assets/img/operatePage/left_arrow.png"
          alt=""
        />
        <span>导出预览</span>
      </div>
      <div class="subtitle">内容选择</div>
      <div
        class="slect_item flex"
        v-for="(item, index) in slectList"
        :key="index"
        @click="change(index)"
      >
        <div
          class="circle"
          :class="{ circle_active: index == selectIndex }"
        ></div>
        <span class="select_name">{{ item }}</span>
      </div>
      <div v-if="selectIndex == 2" class="subtitle">拍摄计划选择</div>
      <el-select
        v-if="selectIndex == 2"
        v-model="selectedValue"
        placeholder="请选择拍摄计划"
        class="select"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <div v-if="selectIndex == 3" class="subtitle">拍摄通告选择</div>
      <el-select
        v-if="selectIndex == 3"
        v-model="selectedValue"
        placeholder="拍摄通告选择"
        class="select"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <div class="subtitle">页面设置</div>
      <div class="color_con flex">
        <span>导航颜色</span>
        <el-color-picker v-model="navigationColor" :predefine="predefineColors">
        </el-color-picker>
      </div>
      <div class="get_preview" @click="getPreview">生成预览</div>
      <div @click="exportFile" class="export_btn">导出文档</div>
    </div>
    <div class="right">
      <div class="right_head">
        当前为预览模式，仅可以查看前20条内容，且会隐藏图片，预览完成后请点击左下角<span
          >导出按钮</span
        >
      </div>
      <div v-if="confirmIndex == 0" class="mirrorList" id="toPDF">
        <div class="form_head">
          <div
            class="head_item"
            v-for="(item, index) in activeProject.storyboardHead.slice(1)"
            :key="index"
            :class="[item.specialClass, { index: item.colId == 'index' }]"
            :style="{ background: navigationColor }"
          >
            {{ item.colName }}
          </div>
        </div>

        <div
          class="list_row"
          v-for="(item, index) in storyboardList"
          :key="index"
        >
          <div
            class="list_item flex"
            :class="{ width300: '内容,画面'.includes(colObj.name) }"
            v-for="(colObj, index3) in item.colObj.slice(1)"
            :key="index3"
          >
            <div v-if="colObj.name == '镜号'" class="editDiv">
              {{ index + 1 }}
            </div>
            <input
              v-else-if="colObj.name.includes('时长')"
              :value="colObj.content"
              type="number"
            />

            <div v-else-if="colObj.name == '画面'" class="frame_con">
              <div
                class="frame_item"
                v-for="(item2, index2) in colObj.content"
                :key="index2"
              >
                <img class="user_img" :src="item2.base64Url" alt="" />
              </div>
              <div
                class="frame_item flex"
                v-if="colObj.content.length == 0"
                @click="selectImg('dealAdd', item, colObj)"
              >
                <img
                  class="add"
                  src="@/assets/img/operatePage/add.png"
                  alt=""
                />
              </div>
            </div>
            <div v-else class="editDiv">
              {{ colObj.content }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="confirmIndex == 1" class="storyVersion" id="toPDF">
        <div class="storyboard_list">
          <div
            class="storyboard_item"
            v-for="(item, index) in storyboardList"
            :key="index"
          >
            <img
              v-if="getValue(item.colObj, '画面')[0]?.base64Url"
              class="img_preview"
              :src="getValue(item.colObj, '画面')[0]?.base64Url"
              alt=""
            />
            <div v-else class="empty flex">未添加图片</div>
            <div class="row1 flex">
              <div v-if="getValue(item.colObj, '景别')">
                {{ getValue(item.colObj, "景别") }}
              </div>
              <div v-if="getValue(item.colObj, '时长')">
                {{ getValue(item.colObj, "时长") }}秒
              </div>
            </div>
            <div class="content">{{ item.content }}</div>
            <div class="item_foot flex">
              <span>镜头{{ index + 1 }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="confirmIndex == 2" class="mirrorList" id="toPDF">
        <div class="plan_info">
          {{ activeShootPlan.planContent }}|{{
            dateTypeFormat(
              "YYYY年mm月dd日 HH:MM",
              new Date(activeShootPlan.startTime)
            )
          }}|{{ activeShootPlan.shootAdress }}
        </div>
        <div class="form_head">
          <div
            class="head_item"
            v-for="(item, index) in activeShootPlan.headList.slice(1)"
            :key="index"
            :class="[item.specialClass, { index: item.colId == 'index' }]"
            :style="{ background: navigationColor }"
          >
            {{ item.colName }}
          </div>
        </div>

        <div
          class="list_row"
          v-for="(item, index) in activeShootPlan.shotList"
          :key="index"
        >
          <div
            class="list_item flex"
            :class="{ width300: '内容,画面'.includes(colObj.name) }"
            v-for="(colObj, index3) in item.colObj.slice(1)"
            :key="index3"
          >
            <div v-if="colObj.name == '镜号'" class="editDiv">
              {{ index + 1 }}
            </div>
            <input
              v-else-if="colObj.name.includes('时长')"
              :value="colObj.content"
              type="number"
            />

            <div v-else-if="colObj.name == '画面'" class="frame_con">
              <div
                class="frame_item"
                v-for="(item2, index2) in colObj.content"
                :key="index2"
              >
                <img class="user_img" :src="item2.base64Url" alt="" />
              </div>
              <div
                class="frame_item flex"
                v-if="colObj.content.length == 0"
                @click="selectImg('dealAdd', item, colObj)"
              >
                <img
                  class="add"
                  src="@/assets/img/operatePage/add.png"
                  alt=""
                />
              </div>
            </div>
            <div v-else class="editDiv">
              {{ colObj.content }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="confirmIndex == 3" class="shooting_notice column" id="toPDF">
        <div class="title">
          {{ announcementInfo.shootAnnounce.announceName }}
        </div>
        <div class="table_main">
          <div class="info_row flex">
            <div class="subtitle">拍摄日期</div>
            <div class="content">
              {{
                dateTypeFormat(
                  "YYYY年mm月dd日",
                  new Date(announcementInfo.shootAnnounce.createTime)
                )
              }}
            </div>
            <div class="subtitle">第一镜</div>
            <div class="content">
              {{
                dateTypeFormat(
                  "HH:MM",
                  new Date(announcementInfo.shootAnnounce.firstMirror)
                )
              }}
            </div>
          </div>
          <div class="info_row flex">
            <div class="subtitle">拍摄地点</div>
            <div class="content">
              {{ announcementInfo.shootAnnounce.shootAdress }}
            </div>
          </div>
          <div class="info_row flex">
            <div class="subtitle">天气</div>
            <div class="content">
              {{ announcementInfo.shootAnnounce.weather }}
            </div>
          </div>
          <div
            v-if="announcementInfo.shootAnnounce.remark"
            class="info_row flex"
          >
            <div class="content">
              {{ announcementInfo.shootAnnounce?.remark }}
            </div>
          </div>

          <div
            v-for="(item, index) in Math.ceil(
              announcementInfo.shootAnnounceMemberList.length / 2
            )"
            :key="index + '一'"
            class="info_row flex"
          >
            <div
              class="flex"
              style="width: 100%"
              v-for="(
                item2, index
              ) in announcementInfo.shootAnnounceMemberList.slice(
                (item - 1) * 2,
                item * 2
              )"
              :key="index + '二'"
            >
              <div class="subtitle">职业类型{{ item2.memberType }}</div>
              <div class="content">
                {{ item2.memberName }}
              </div>
            </div>
          </div>
          <div
            v-if="announcementInfo.shootAnnounceMemberList[0]?.remark"
            class="info_row flex"
          >
            <div class="content">
              {{ announcementInfo.shootAnnounceMemberList[0]?.remark }}
            </div>
          </div>
        </div>
        <div class="title">分组通告</div>
        <div class="form_head" style="width: 100%">
          <div
            class="head_item"
            :class="{ flexgrow: item != '到场时间' }"
            v-for="(item, index) in creaCallHead"
            :key="index"
            :style="{ background: navigationColor }"
          >
            {{ item }}
          </div>
        </div>
        <div
          class="form_row"
          v-for="(item, index) in announcementInfo.shootGroupAnnounceList"
          :key="index"
        >
          <div>{{ item.groupName }}</div>
          <div style="width: 120px; flex-grow: unset">
            {{ dateTypeFormat("HH:MM", new Date(item.arriveTime)) }}
          </div>
          <div>{{ item.groupAdress }}</div>
        </div>
        <div class="remark_con">
          {{ announcementInfo.shootGroupAnnounceList[0].remark }}
        </div>

        <div class="title">演员通告</div>
        <div class="form_head" style="width: 100%">
          <div
            class="head_item"
            :class="{ flexgrow: item != '到场时间' }"
            v-for="(item, index) in actorHead"
            :key="index"
            :style="{ background: navigationColor }"
          >
            {{ item }}
          </div>
        </div>
        <div
          class="form_row"
          v-for="(item, index) in announcementInfo.shootActorGroupAnnounceList"
          :key="index"
        >
          <div>{{ item.groupName }}</div>
          <div style="width: 120px; flex-grow: unset">
            {{ dateTypeFormat("HH:MM", new Date(item.arriveTime)) }}
          </div>
          <div>{{ item.groupAdress }}</div>
        </div>
        <div class="remark_con">
          {{ announcementInfo.shootActorGroupAnnounceList[0].remark }}
        </div>

        <div class="title">拍摄与日程</div>
        <div class="form_head" style="width: 100%">
          <div
            class="head_item"
            :class="{ flexgrow: item == '备注', w300: item == '场次' }"
            v-for="(item, index) in dateHead"
            :key="index"
            :style="{ background: navigationColor }"
          >
            {{ item }}
          </div>
        </div>
        <div
          class="form_row"
          v-for="(item, index) in announcementInfo.shootAnnouncePlanList"
          :key="index"
        >
          <div style="width: 120px">
            {{ dateTypeFormat("HH:MM", new Date(item.startTime)) }}-{{
              dateTypeFormat("HH:MM", new Date(item.endTime))
            }}
          </div>
          <div style="width: 300px">{{ item.planContent }}</div>
          <div style="width: 120px">{{ scenerySlot[item.sceneryType] }}</div>
          <div style="flex-grow: 1">{{ item.remark }}</div>
        </div>
        <div class="sup_line"></div>
      </div>
    </div>
  </div>
</template>
      
<script>
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  shootPlanList,
  modelColumnConfig,
  shootAnnounceList,
  announceInfo,
} from "@/assets/js/request";
import { mapState, mapMutations } from "vuex";
import { commonMethods } from "@/assets/js/mixin.js";
import { dateTypeFormat } from "@/assets/js/methods";
import { scenerySlot } from "@/assets/js/data";
export default {
  components: {},
  computed: {
    ...mapState(["activeProject"]),
  },
  data() {
    return {
      slectList: ["分镜", "故事版", "拍摄计划", "拍摄通告"],
      selectIndex: 0,
      confirmIndex: 0,
      storyboardHead: [], //表头
      storyboardList: [],
      shootingList: [], //拍摄计划列表
      activeShootPlan: {}, //渲染展示的拍摄计划
      options: [], //拍摄计划/拍摄通告选项
      selectedValue: "",
      navigationColor: "#000",
      predefineColors: [
        "#000000",
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
      ],
      announcementInfo: {}, //拍摄通告信息
      creaCallHead: ["工作组", "到场时间", "地点"], //分组通告表头
      actorHead: ["演员", "到场时间", "地点"], //演员通告表头
      dateHead: ["时间", "场次", "内/外景", "备注"], //拍摄与日程通告表头
      scenerySlot: scenerySlot,
    };
  },
  mixins: [commonMethods],
  methods: {
    ...mapMutations(["SET_ACTIVEPROJECT"]),
    change(index) {
      this.selectIndex = index;
      if (index == 2) {
        this.getShootList();
      } else if (index == 3) {
        this.getShootAnnounceList();
      }
    },
    dateTypeFormat(format, time) {
      return dateTypeFormat(format, time);
    },
    //获取分镜列表数据
    getShootList() {
      shootPlanList({
        projectId: this.activeProject.id,
        sortType: 1,
      }).then((res) => {
        modelColumnConfig({
          modelId: this.activeProject.modelId,
          projectId: this.activeProject.id,
        }).then((colRes) => {
          let tempHead = [
            {
              colName: "排序",
              colId: "index",
            },
          ];
          for (let i = 0; i < colRes.data.length; i++) {
            if (0 == colRes.data[i].isHidden) {
              let item = {
                colName: colRes.data[i].columnName,
                colId: colRes.data[i].id,
              };
              let specialHead = ["内容", "画面"];
              if (specialHead.includes(colRes.data[i].columnName)) {
                item.specialClass = "width300";
              }
              tempHead.push(item);
            }
          }

          this.options = [];
          this.shootingList = res.data;
          for (let i = 0; i < res.data.length; i++) {
            let item = {
              value: res.data[i].id,
              label: res.data[i].planContent,
            };
            this.options.push(item);
          }

          for (let i = 0; i < this.shootingList.length; i++) {
            this.shootingList[i].headList = tempHead;
            this.shootingList[i].shotList = [];
            for (let y = 0; y < this.storyboardList.length; y++) {
              if (
                this.storyboardList[y].announcePlanId == this.shootingList[i].id
              ) {
                this.shootingList[i].shotList.push(this.storyboardList[y]);
              }
            }
          }
        });
      });
    },
    //获取通告列表数据
    getShootAnnounceList() {
      shootAnnounceList({ projectId: this.activeProject.id }).then((res) => {
        let arr = [...res.data.announced, ...res.data.announcing];
        for (let i = 0; i < arr.length; i++) {
          let item = {
            value: arr[i].id,
            label: arr[i].announceName,
          };
          this.options.push(item);
        }
      });
    },
    getPreview() {
      this.confirmIndex = this.selectIndex;
      switch (this.selectIndex) {
        case 0:
          this.getSboardList();
          break;
        case 1:
          this.getSboardList();
          break;
        case 2:
          this.getShootPlan();
          break;
        case 3:
          this.getShootNotice();
          break;
        default:
          this.getSboardList();
          break;
      }
    },
    drawBase64Image(item) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous"; // 如果图片需要跨域访问，可以设置这个属性
        img.onload = function () {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const base64 = canvas.toDataURL("image/png"); // 可以改为其他格式，如 'image/jpeg'
          resolve(base64);
        };
        img.onerror = function () {
          console.error("无法加载图片：", item.fileUrl);
          reject("无法加载图片");
        };
        img.src = item.fileUrl;
      });
    },
    exportFile() {
      const element = document.getElementById("toPDF");
      const options = {
        dpi: 800, //dpi属性的值为192，表示图像的分辨率
        scale: 2, //scale属性的值为2，表示图像的缩放比例。
        backgroundColor: "#F1F6FE", //backgroundColor属性的值为"#F1F6FE"，表示图像的背景颜色。
      };
      // 将元素转换为canvas对象
      html2canvas(element, options).then((canvas) => {
        var contentWidth = canvas.width;
        var contentHeight = canvas.height;
        // 创建jsPDF对象
        const pdf = new jsPDF("1", "pt", [contentWidth, contentHeight]); //创建一个新的PDF对象，参数包括页面格式（'1'表示A4纸张）、单位（'pt'）和页面尺寸（[contentWidth, contentHeight]）
        var pageData = canvas.toDataURL("image/jpeg", 1.0); //将Canvas对象转换为JPEG格式的数据，并将其存储在pageData变量中。1.0表示图片质量
        pdf.addImage(pageData, "JPEG", 0, 0, contentWidth, contentHeight); //将JPEG格式的图片添加到PDF文件中，图片的左上角坐标为(0, 0)，宽度为contentWidth，高度为contentHeight
        pdf.save(`导出文件-${new Date().getTime()}.pdf`);
      });
    },
    async getShootPlan() {
      for (let i = 0; i < this.shootingList.length; i++) {
        if (this.shootingList[i].id == this.selectedValue) {
          this.activeShootPlan = this.shootingList[i];
          break;
        }
      }
      for (let i = 0; i < this.activeShootPlan.shotList.length; i++) {
        for (
          let y = 0;
          y < this.activeShootPlan.shotList[i].colObj.length;
          y++
        ) {
          if (this.activeShootPlan.shotList[i].colObj.name == "画面") {
            for (
              let j = 0;
              j < this.activeShootPlan.shotList[i].colObj.content.length;
              j++
            ) {
              this.$set(
                this.activeShootPlan.shotList[i].colObj.content[j],
                "base64Url",
                await this.drawBase64Image(
                  this.activeShootPlan.shotList[i].colObj.content[j]
                )
              );
            }
          }
        }
      }
      console.log(this.activeShootPlan, " this.activeShootPlan");
    },
    getShootNotice() {
      announceInfo({ announceId: this.selectedValue }).then((res) => {
        if (res.code == 200) {
          this.announcementInfo = res.data;
        } else {
          this.$message({
            message: "请求错误",
            type: "error",
          });
        }
      });
    },
    async getSboardList() {
      this.storyboardList = JSON.parse(
        JSON.stringify(this.activeProject.storyboardList)
      );
      for (let i = 0; i < this.storyboardList.length; i++) {
        for (let y = 0; y < this.storyboardList[i].colObj.length; y++) {
          if (this.storyboardList[i].colObj[y].name == "画面") {
            for (
              let j = 0;
              j < this.storyboardList[i].colObj[y].content.length;
              j++
            ) {
              this.$set(
                this.storyboardList[i].colObj[y].content[j],
                "base64Url",
                await this.drawBase64Image(
                  this.storyboardList[i].colObj[y].content[j]
                )
              );
            }
          }
        }
      }
    },
  },
  created() {
    if (!this.activeProject?.storyboardList) {
      this.$router.push("/");
      return;
    }
    this.getSboardList();
  },
};
</script>
<style lang="scss" scoped>
input,
.editDiv {
  width: 100%;
  outline: none;
  border: none;
  font-weight: 500;
  font-size: 14px;
  color: #3d3d3d;
  text-align: center;
  &::placeholder {
    color: #e2e2e2;
  }
}
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
.editDiv {
  overflow-y: auto;
}
.export_page {
  display: flex;
  width: 100vw;
  .left {
    width: 284px;
    height: 100%;
    background: #ffffff;
    position: relative;
    .left_head {
      width: 284px;
      height: 57px;
      border-bottom: 1px solid #e4e5ee;
      font-weight: 600;
      font-size: 16px;
      color: #3d3d3d;
      cursor: pointer;
      .left_arrow {
        width: 16px;
        height: 16px;
        margin-left: 28px;
        margin-right: 16px;
      }
    }
    .subtitle {
      margin-top: 23px;
      margin-left: 29px;
      font-weight: 600;
      font-size: 16px;
      color: #3d3d3d;
    }
    .slect_item {
      margin-top: 20px;
      cursor: pointer;
      .circle {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 1px solid #959595;
        margin-left: 45px;
        margin-right: 12px;
        position: relative;
      }
      .circle_active:after {
        content: "";
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #12db34;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }

      .select_name {
        font-weight: 400;
        font-size: 14px;
        color: #3d3d3d;
      }
    }
    .select {
      margin-left: 30px;
      margin-top: 16px;
    }
    .color_con {
      > span {
        font-weight: 400;
        font-size: 14px;
        color: #3d3d3d;
        margin-left: 29px;
        margin-right: 16px;
      }
      ::v-deep .el-color-picker__trigger {
        width: 68px;
        height: 34px;
        border-radius: 10px;
      }
      ::v-deep .el-color-picker {
        height: 34px;
      }
    }
    .get_preview {
      width: 207px;
      height: 36px;
      background: #ffffff;
      border-radius: 3px;
      border: 1px solid #12db34;
      font-size: 14px;
      color: #12db34;
      text-align: center;
      line-height: 36px;
      margin: 12px auto;
      cursor: pointer;
    }
    .export_btn {
      width: 208px;
      height: 36px;
      background: #12db34;
      border-radius: 5px;
      text-align: center;
      line-height: 36px;
      font-weight: 400;
      font-size: 14px;
      color: #ffffff;
      position: absolute;
      bottom: 28px;
      left: 39px;
      cursor: pointer;
    }
  }
  .right {
    width: 100%;
    padding: 0 20px;
    .right_head {
      font-weight: 400;
      font-size: 14px;
      color: #3d3d3d;
      text-align: center;
      margin-top: 28px;
      margin-bottom: 18px;
      span {
        font-weight: 600;
        margin-left: 10px;
      }
    }
    .form_head {
      display: flex;
      .head_item {
        width: 120px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        background: #f4f6f7;
        font-weight: 600;
        font-size: 16px;
        color: #fff;
      }
      .flexgrow {
        flex-grow: 1;
      }
      .w300 {
        width: 300px;
      }
    }
    .sup_line {
      border-top: 1px solid #000;
      width: 100%;
    }
    .mirrorList {
      display: flex;
      flex-direction: column;
      align-items: center;
      .width300 {
        width: 300px !important;
      }

      .plan_info {
        height: 40px;
        text-align: center;
        line-height: 40px;
        font-size: 14px;
      }
      .list_row {
        background: #fff;
        border-bottom: 1px solid #000;
        display: flex;
        font-size: 14px;
        .list_item {
          width: 120px;
          justify-content: center;
          border-right: 1px solid #000;
          &:last-of-type {
            border-right: unset;
          }
        }
        .frame_con {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 10px 0;
          .frame_item {
            width: 270px;
            height: 150px;
            justify-content: center;
            margin-bottom: 10px;
            position: relative;
            &:last-of-type {
              margin-bottom: 0;
            }
            .user_img {
              width: 270px;
              height: 150px;
            }
          }
        }
      }
    }
    .storyVersion {
      background: #fff;
      min-height: calc(100% - 100px);
      .storyboard_list {
        display: flex;
        flex-wrap: wrap;
        padding: 20px 30px;

        .storyboard_item {
          width: 275px;
          min-height: 278px;
          border-radius: 10px;
          margin-right: 10px;
          background-color: #fff;
          padding: 10px;
          margin-top: 30px;
          .img_preview {
            height: 134px;
            margin: 0 auto;
            display: block;
          }
          .empty {
            width: 258px;
            height: 134px;
            background: #f4f6f7;
            justify-content: center;
            font-weight: 500;
            font-size: 14px;
            color: #959595;
          }
          .row1 {
            height: 32px;
            margin-top: 16px;
            div {
              padding: 0 15px;
              height: 32px;
              background: #f4f6f7;
              border-radius: 54px;
              text-align: center;
              line-height: 32px;
              font-weight: 400;
              font-size: 14px;
              color: #3d3d3d;
              margin-right: 10px;
            }
          }
          .content {
            font-weight: 500;
            font-size: 14px;
            color: #3d3d3d;
            margin-top: 12px;
          }
          .item_foot {
            justify-content: space-between;
            font-weight: 400;
            font-size: 12px;
            color: #3d3d3d;
            margin-top: 22px;
          }
        }
      }
    }
    .shooting_notice {
      background: #fff;
      min-height: calc(100% - 100px);
      width: 1270px;
      padding: 20px;
      align-items: center;
      margin: 0 auto;
      .table_main {
        width: 100%;
        height: 100%;
        border-top: 1px solid #000;
        border-left: 1px solid #000;
      }
      .title {
        font-weight: 600;
        font-size: 22px;
        color: #3d3d3d;
        margin: 20px 0;
      }
      .info_row {
        width: 100%;
        border-bottom: 1px solid #000;
        .subtitle {
          width: 120px;
          height: 32px;
          line-height: 32px;
          border-right: 1px solid #000;
          flex-shrink: 0;
          padding-left: 4px;
        }
        .content {
          min-height: 32px;
          line-height: 32px;
          border-right: 1px solid #000;
          width: 100%;
          padding-left: 4px;
        }
      }
      .form_row {
        background: #fff;
        display: flex;
        border-top: 1px solid #000;
        border-left: 1px solid #000;
        width: 100%;
        height: 32px;
        line-height: 32px;
        > div {
          padding-left: 4px;
          border-right: 1px solid #000;
          width: 555px;
        }
      }
      .remark_con {
        border: 1px solid #000;
        width: 100%;
        min-height: 32px;
        padding-left: 4px;
        line-height: 32px;
      }
    }
  }
}
</style>