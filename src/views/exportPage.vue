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
      <div class="subtitle">页面设置</div>
      <div class="color_con flex">
        <span>导航颜色</span>
        <el-color-picker v-model="navigationColor" :predefine="predefineColors">
        </el-color-picker>
      </div>
      <div @click="exportFile" class="export_btn">导出文档</div>
    </div>
    <div class="right">
      <div class="right_head">
        当前为预览模式，仅可以查看前20条内容，且会隐藏图片，预览完成后请点击左下角<span
          >导出按钮</span
        >
      </div>
      <div class="mirrorList" id="qqq">
        <div class="form_head">
          <div
            class="head_item"
            v-for="(item, index) in storyboardHead"
            :key="index"
            :class="[item.specialClass]"
            :style="{ background: navigationColor }"
          >
            {{ item.coldName }}
          </div>
        </div>
        <div
          class="list_row"
          v-for="(item, index) in activeProject.storyboardList"
          :key="index"
        >
          <div
            class="list_item flex"
            :class="{ width300: 'frame,content'.includes(key) }"
            v-for="(value, key) in item"
            :key="key"
            v-show="key != 'order'"
          >
            <div v-if="key == 'nums'">
              {{ index + 1 }}
            </div>

            <div v-else-if="key == 'frame'" class="frame_con">
              <div
                class="frame_item"
                v-for="(item2, index2) in item['frame']"
                :key="index2"
              >
                <img class="user_img" :src="item2" alt="" />
              </div>

              <div
                class="frame_item flex"
                v-if="item['frame'].length == 0"
                @click="selectImg('dealAdd', index, 0)"
              >
                <img
                  class="add"
                  src="@/assets/img/operatePage/add.png"
                  alt=""
                />
              </div>
            </div>

            <div v-else>
              {{ item[key] }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
      
<script>
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { mapState, mapMutations } from "vuex";
export default {
  components: {},
  computed: {
    ...mapState(["activeProject"]),
  },
  data() {
    return {
      slectList: ["分镜", "故事版", "拍摄计划", "拍摄通告"],
      selectIndex: 0,
      storyboardHead: [], //表头
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
    };
  },
  methods: {
    change(index) {
      this.selectIndex = index;
      // switch (this.selectIndex) {
      //   case 0:

      //     break;
      //   default:
      //     break;
      // }
    },
    exportFile() {
      const element = document.getElementById("qqq");
      const options = {
        dpi: 800, //dpi属性的值为192，表示图像的分辨率
        scale: 1, //scale属性的值为2，表示图像的缩放比例。
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
        pdf.save("test.pdf");
      });
    },
  },
  created() {
    this.storyboardHead = [
      { coldName: "镜号", keyName: "nums" },
      { coldName: "内容", keyName: "content", specialClass: "width300" },
      { coldName: "画面", keyName: "frame", specialClass: "width300" },
      { coldName: "景别", keyName: "scenery" },
      { coldName: "时长/秒", keyName: "times" },
    ];
  },
};
</script>
<style lang="scss" scoped>
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
      font-family: PingFang SC, PingFang SC;
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
      font-family: PingFang SC, PingFang SC;
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
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 14px;
        color: #3d3d3d;
      }
    }
    .color_con {
      > span {
        font-family: PingFang SC, PingFang SC;
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
    .export_btn {
      width: 208px;
      height: 36px;
      background: #12db34;
      border-radius: 5px;
      text-align: center;
      line-height: 36px;
      font-family: PingFang SC, PingFang SC;
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
    .right_head {
      font-family: PingFang SC, PingFang SC;
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
    .mirrorList {
      display: flex;
      flex-direction: column;
      align-items: center;
      .width300 {
        width: 300px !important;
      }
      .form_head {
        display: flex;
        .head_item {
          width: 120px;
          height: 50px;
          text-align: center;
          line-height: 50px;
          background: #f4f6f7;
          font-family: PingFang SC, PingFang SC;
          font-weight: 600;
          font-size: 16px;
          color: #fff;
        }
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
  }
}
</style>