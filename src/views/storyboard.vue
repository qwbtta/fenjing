<template>
  <div class="storyboard">
    <FuncHead />
    <div class="main">
      <div class="head_row flex">
        <div class="flex">
          <span class="head_title">我的项目 </span>
          <img
            class="tips"
            @click="showTips = !showTips"
            src="@/assets/img/operatePage/tips.png"
            alt=""
          />
          <div class="addStoryboard flex">
            <div class="add_item" @click="addRow(1)">+ 新建镜头</div>
            <div class="add_item" @click="addRow(5)">+ 5</div>
            <div class="add_item" @click="addRow(10)">+ 10</div>
          </div>
        </div>
        <div class="btn_type1">
          <img src="@/assets/img/operatePage/sort.png" alt="" />
          分镜设置
        </div>
      </div>
      <div class="storyboard_form" v-if="storyboardList.length > 0">
        <div class="form_head">
          <draggable
            animation="300"
            v-model="storyboardHead"
            class="flex"
            @end="rowDragEnd"
          >
            <div
              class="head_item"
              v-for="(item, index) in storyboardHead"
              :key="index"
              :class="[item.specialClass]"
            >
              {{ item.colName }}
            </div>
          </draggable>
          <div @click="showAddPanel = !showAddPanel" class="head_item add_col">
            +

            <div v-if="showAddPanel" @click.stop="" class="add_panel">
              <div class="subtitle">列标题</div>
              <input type="text" v-model="colTitle" />
              <div class="subtitle">列类型</div>
              <el-select
                class="el_elect"
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
              <div class="btn_con flex">
                <div class="btn cancel" @click.stop="showAddPanel = false">
                  取消
                </div>
                <div class="btn confirm" @click.stop="addConfirm">确认</div>
              </div>
            </div>
          </div>
        </div>

        <draggable
          animation="300"
          v-model="storyboardList"
          class="col_flex"
          handle=".change_order"
          @end="colDragEnd"
        >
          <div
            class="list_row"
            v-for="(item, index) in storyboardList"
            :key="index"
          >
            <div
              class="list_item flex"
              :class="{ width300: '内容,画面'.includes(colObj.name) }"
              v-for="(colObj, index3) in item.colObj"
              :key="index3"
            >
              <img
                v-if="colObj.name == '排序'"
                class="change_order"
                src="@/assets/img/operatePage/sort.png"
                alt=""
              />
              <div v-else-if="colObj.name == '镜号'" class="editDiv">
                {{ index + 1 }}
              </div>
              <input
                v-else-if="colObj.name == '时长'"
                v-model="colObj.content"
                type="number"
                placeholder="输入数字"
              />

              <div v-else-if="colObj.name == '画面'" class="frame_con">
                <draggable
                  animation="300"
                  v-model="colObj.content"
                  handle=".sort"
                  @change="frameChange"
                >
                  <div
                    class="frame_item"
                    v-for="(item2, index2) in colObj.content"
                    :key="index2"
                  >
                    <img class="user_img" :src="item2.fileUrl" alt="" />
                    <div class="mask">
                      <div
                        class="mask_item sort"
                        @click="selectImg('dealRepalce', item, colObj, item2)"
                      >
                        <img
                          src="@/assets/img/operatePage/replace.png"
                          alt=""
                        />排序
                      </div>
                      <div
                        class="mask_item"
                        @click="selectImg('dealRepalce', item, colObj, item2)"
                      >
                        <img
                          src="@/assets/img/operatePage/replace.png"
                          alt=""
                        />替换
                      </div>
                      <div class="mask_item" @click="deleteImg(item2)">
                        <img
                          src="@/assets/img/operatePage/delete.png"
                          alt=""
                        />删除
                      </div>
                      <div
                        class="mask_add"
                        @click="selectImg('dealAdd', item, colObj)"
                      >
                        添加
                      </div>
                    </div>
                  </div>
                </draggable>
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

              <div
                v-else
                class="editDiv"
                contenteditable="true"
                placeholder="输入内容"
                :value="colObj.content"
                @input="valueChanged($event, item, colObj)"
                @blur="valueChanged($event, item, colObj, true)"
              >
                {{ colObj.content }}
              </div>
            </div>
            <div class="list_item">
              <div @click="deleteMirror(item)">删除分镜</div>
            </div>
          </div>
        </draggable>
      </div>
      <div v-else class="empty_tips flex">镜头为空，点击左上角添加镜头</div>
    </div>
    <div v-if="showTips" class="bottom_tips flex">
      <div class="flex">
        <div class="tips_1">
          <div class="special_font">关于放心分镜</div>
          <div>分镜的基础单位是镜头，在这里可以按照您的想法完成镜头信息。</div>
        </div>
      </div>
      <div class="flex">
        <span class="tips_2">如果已经完成了分镜的制作，您可以</span>
        <div @click="$router.push('/storyVersion')" class="router_btn flex">
          <span>预览故事版</span>
        </div>
        <div class="footer_close" @click="showTips = false">关闭</div>
      </div>
    </div>
  </div>
</template>
    
    <script>
import draggable from "vuedraggable";
import FuncHead from "@/components/FuncHead.vue";
import { mapState, mapMutations } from "vuex";
import {
  getMirrorList,
  modelColumnConfig,
  createMirror,
  updateMirror,
  deleteMirror,
  deleteFile,
  updateFile,
  updateFileSort,
} from "@/assets/js/request";
export default {
  components: {
    draggable,
    FuncHead,
  },
  computed: {
    ...mapState(["activeProject"]),
  },
  data() {
    return {
      storyboardHead: [], //表头
      storyboardList: [], //数据列表
      showAddPanel: false, //添加列
      colTitle: "", //列标题
      showTips: false,
      options: [
        {
          value: "文本",
          label: "文本",
        },
        {
          value: "图片",
          label: "图片",
        },
      ],
      value: "文本",
      timer: null,
    };
  },
  methods: {
    ...mapMutations(["SET_ACTIVEPROJECT"]),
    addRow(rows) {
      createMirror({
        projectId: this.activeProject.id,
        num: rows,
      }).then((res) => {
        this.getMirrorList();
      });
      console.log(this.storyboardList);
    },
    selectImg(dealFunc, item, colObj, item2) {
      if (document.getElementById("fileInput")) {
        document.body.removeChild(document.getElementById("fileInput"));
      }
      let input = document.createElement("input");
      input.id = "fileInput";
      input.type = "file";
      input.style.display = "none";
      input.accept = ".png,.jpg,.jpeg,.PNG,.JPG,.JPEG";

      document.body.appendChild(input);
      input.addEventListener("change", (e) => {
        this[dealFunc](input.files[0], item, colObj, item2);
      });
      input.click();
    },
    dealRepalce(file, item, colObj, item2) {
      console.log(file, 2222);
      const reader = new FileReader();
      reader.onload = (e) => {
        updateFile({
          fileId: item2.id,
          file: file,
        }).then((res) => {
          this.getMirrorList();
        });
      };
      reader.readAsDataURL(file);
    },
    dealAdd(file, item, colObj) {
      const reader = new FileReader();
      reader.onload = (e) => {
        let params = {
          mirrorId: item.rowId, //分镜/行id
          columnConfigId: colObj.colId, //列id
          file: file,
        };

        this.updateMirror(params, colObj);
      };
      reader.readAsDataURL(file);
    },
    deleteImg(item2) {
      deleteFile({ id: item2.id }).then((res) => {
        this.getMirrorList();
      });
    },

    colDragEnd() {},
    rowDragEnd() {
      //拖拽表头后更换表单顺序
      // let tempList = [];
      // let temp = {};
      // for (let i = 0; i < this.storyboardHead.length; i++) {
      //   temp[this.storyboardHead[i].colName] = "";
      // }
      // for (let y = 0; y < this.storyboardList.length; y++) {
      //   let temp2 = JSON.parse(JSON.stringify(temp));
      //   for (let key in this.storyboardList[y]) {
      //     for (let key2 in temp2) {
      //       if (key2 == key) {
      //         temp2[key2] = this.storyboardList[y][key];
      //         break;
      //       }
      //     }
      //   }
      //   tempList.push(temp2);
      // }
      // this.storyboardList = tempList;
    },
    difference(array1, array2) {
      const set1 = new Set(array1);
      const set2 = new Set(array2);

      // 在 array1 中，但不在 array2 中的元素
      const diff1 = [...set1].filter((item) => !set2.has(item));
      // 在 array2 中，但不在 array1 中的元素
      const diff2 = [...set2].filter((item) => !set1.has(item));

      return [...new Set([...diff1, ...diff2])]; // 去除重复元素
    },
    addConfirm() {
      if (!this.colTitle) {
        this.$message({
          message: "请填写列标题",
          type: "error",
        });
        return;
      }

      let originArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      let usedArray = [];
      for (let i = 0; i < this.storyboardHead.length; i++) {
        if (this.storyboardHead[i].addIndex) {
          usedArray.push(this.storyboardHead[i].addIndex);
        }
      }
      let availableArray = this.difference(originArray, usedArray);

      this.storyboardHead.push({
        colName: this.colTitle,
        addIndex: availableArray[0],
      });
      for (let i = 0; i < this.storyboardList.length; i++) {
        this.storyboardList[i][
          `userAdd${availableArray[0]}`
        ] = `userAdd${availableArray[0]}`;
      }

      this.showAddPanel = false;
    },
    valueChanged(e, item, colObj, immediate = false) {
      clearTimeout(this.timer);
      this.timer = setTimeout(
        () => {
          let params = {
            mirrorId: item.rowId, //分镜/行id
            columnConfigId: colObj.colId, //列id
            columnContent: e.target.innerText,
          };

          this.updateMirror(params, colObj);
        },
        immediate ? 0 : 2000
      );
    },
    frameChange(e) {
      console.log(e.moved.newIndex);
      console.log(e.moved.element.id);
      updateFileSort({
        fileId: e.moved.element.id,
        sort: e.moved.newIndex,
      }).then((res) => {
        this.getMirrorList();
      });
    },
    updateMirror(params, colObj) {
      console.log(colObj);
      if (colObj.mirrorColumnId) {
        params.mirrorColumnId = colObj.mirrorColumnId; //关联id
      }
      updateMirror(params).then((res) => {
        this.getMirrorList();
      });
    },
    deleteMirror(item) {
      deleteMirror({ mirrorIds: item.rowId }).then((res) => {
        this.getMirrorList();
      });
    },
    getMirrorList() {
      getMirrorList({
        projectId: this.activeProject.id,
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
          let tempList = [];
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
          for (let x = 0; x < res.data.length; x++) {
            let item = {
              rowId: res.data[x].id,
              colObj: [],
            };

            for (let y = 0; y < tempHead.length; y++) {
              let obj = {};
              obj.colId = tempHead[y].colId;
              obj.name = tempHead[y].colName;
              obj.content = "";
              if ("画面" == tempHead[y].colName) {
                obj.content = [];
              }
              for (
                let j = 0;
                j < res.data[x].storyBoardMirrorColumns.length;
                j++
              ) {
                if (
                  tempHead[y].colId ==
                  res.data[x].storyBoardMirrorColumns[j].columnConfigId
                ) {
                  obj.mirrorColumnId =
                    res.data[x].storyBoardMirrorColumns[j].id;
                  if ("画面" == tempHead[y].colName) {
                    let fileList =
                      res.data[x].storyBoardMirrorColumns[j].fileList;
                    for (let l = 0; l < fileList.length; l++) {
                      // let config = {
                      //   method: "get",
                      //   url: fileList[l].fileUrl,
                      //   headers: {
                      //     Authorization:
                      //       "Bearer eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6ImMzOGYyMjBhLTRjNTctNDFjMy04YTRiLTc3MzEyOTA3YTEwYyJ9.hkci21S7wmQAPFiOp-k7kolDvCfn91DDLSba01YRD9Am61bI2_CwYGSW9K2osLgSugdmMzKWgEszLCE3ch0woQ",
                      //   },
                      // };
                      // axios(config).then((res) => {
                      //   console.log(res);
                      // });
                      // axios.get(fileList[l].fileUrl).then((res) => {
                      //   console.log(res);
                      // });
                    }
                    obj.content = fileList;
                  } else {
                    obj.content =
                      res.data[x].storyBoardMirrorColumns[j].columnContent;
                  }
                }
              }
              item.colObj.push(obj);
            }
            tempList.push(item);
          }

          this.activeProject.storyboardHead = this.storyboardHead = tempHead;
          this.activeProject.storyboardList = this.storyboardList = tempList;
          this.SET_ACTIVEPROJECT(this.activeProject);
          console.log(this.activeProject, "this.activeProject");
        });
      });
    },
  },
  created() {
    if (!this.activeProject.id) {
      let temp = JSON.parse(sessionStorage.getItem("activeProject"));
      if (temp) {
        this.SET_ACTIVEPROJECT(temp);
      }
    }
    this.getMirrorList();

    // // getModelList().then((res) => {});

    // 70cd532c-7afa-4988-981a-c69629456a05 //备注 dd320f95-a71f-48bd-9a28-d495e0d4fab8
    // 500162b1-bce0-4169-984a-5d7b77e69f06c //内容
    // updateMirror({
    //   // mirrorColumnId: "3c98c404-68fe-42e8-a041-2aa2be987f38", //关联id
    //   mirrorId: "18e92f64-d4e6-408c-b440-14b33e92fe2a", //分镜/行id
    //   columnConfigId: "500162b1-bce0-4169-984a-5d7b77e69f06", //列id
    //   columnContent: "777777",
    // }).then((res) => {
    //   getMirrorList({
    //     projectId: this.activeProject.id,
    //   }).then((res) => {
    //     // for (let i = 0; i < res.data.length; i++) {
    //     //   let item = {};
    //     // }
    //   });
    // });
    // this.storyboardHead = [
    //   { colName: "排序", keyName: "order" },
    //   { colName: "镜号", keyName: "nums" },
    //   { colName: "内容", keyName: "content", specialClass: "width300" },
    //   { colName: "画面", keyName: "frame", specialClass: "width300" },
    //   { colName: "景别", keyName: "scenery" },
    //   { colName: "时长/秒", keyName: "times" },
    // ];
    // if (this.activeProject.storyboardList) {
    //   this.storyboardList = this.activeProject.storyboardList;
    //   return;
    // }
    // this.activeProject.storyboardList = [
    //   //数据列表
    //   {
    //     order: "0",
    //     nums: "0-nums",
    //     content: "几点前几位带我去",
    //     frame: [
    //       require("@/assets/img/card_1.png"),
    //       require("@/assets/img/card_2.png"),
    //     ],
    //     scenery: "中景",
    //     times: 3,
    //   },
    //   {
    //     order: "1",
    //     nums: "1-nums",
    //     content: "求稳的群无多七点前无",
    //     frame: [
    //       require("@/assets/img/card_3.png"),
    //       require("@/assets/img/card_4.png"),
    //     ],
    //     scenery: "远景",
    //     times: 2,
    //   },
    //   {
    //     order: "2",
    //     nums: "2-nums",
    //     content: "带我去带我去分为",
    //     frame: [
    //       require("@/assets/img/card_5.png"),
    //       require("@/assets/img/card_6.png"),
    //     ],
    //     scenery: "近景",
    //     times: 4,
    //   },
    // ];
    // this.SET_ACTIVEPROJECT(this.activeProject);
    // this.storyboardList = this.activeProject.storyboardList;
  },
  destroyed() {
    clearInterval(this.timer);
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/footerTips.css";
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
.editDiv {
  overflow-y: auto;
}

.storyboard {
  width: 100%;
  background: #fff;
  .col_flex {
    display: flex;
    flex-direction: column;
  }

  .main {
    height: calc(100% - 80px);
    padding-left: 32px;
    .head_row {
      margin-top: 24px;
      justify-content: space-between;
      .head_title {
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        font-size: 24px;
        color: #3d3d3d;
      }
      .tips {
        width: 31px;
        height: 31px;
        margin: 0 12px;
        cursor: pointer;
      }
      .addStoryboard {
        width: 187px;
        height: 40px;
        background: #12db34;
        border-radius: 12px;
        padding-left: 10px;
        .add_item {
          height: 16px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          font-size: 14px;
          color: #ffffff;
          border-right: 1px solid rgba($color: #fff, $alpha: 0.4);
          padding: 0 8px;
          cursor: pointer;
          &:last-of-type {
            border-right: unset;
          }
        }
      }

      .btn_type1 {
        padding: 0 18px;
        height: 32px;
        background: #ffffff;
        border-radius: 54px;
        border: 1px solid #e4e5ee;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #3d3d3d;
        margin-right: 14px;
        cursor: pointer;
        > img {
          width: 16px;
          height: 16px;
          margin-right: 6px;
        }
      }
    }
    .empty_tips {
      justify-content: center;
      height: calc(100% - 40px);
    }
    .storyboard_form {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-top: 30px;
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
          font-weight: 500;
          font-size: 14px;
          color: #3d3d3d;
          border-right: 1px dashed #d9d9d9;
          cursor: pointer;
          &:first-of-type {
            border-radius: 10px 0 0 10px;
          }
        }
        .add_col {
          position: relative;
          border-radius: 0 10px 10px 0;
          border-right: unset;
          font-size: 18px;
          .add_panel {
            position: absolute;
            top: 30px;
            left: 60px;
            width: 200px;
            background: #ffffff;
            box-shadow: 0px 1px 29px 0px rgba(0, 0, 0, 0.09);
            border-radius: 6px;
            padding: 10px;
            .subtitle {
              font-family: PingFang SC, PingFang SC;
              font-weight: 400;
              font-size: 14px;
              color: #3d3d3d;
              text-align: left;
              line-height: 24px;
              height: 24px;
            }
            input {
              width: 170px;
              height: 30px;
              border-radius: 5px;
              padding: 0 12px;
              border: 1px solid #e4e5ee;
              text-align: left;
            }

            ::v-deep .el-input__inner {
              width: 170px;
              height: 30px;
              border-radius: 5px;
              font-family: PingFang SC, PingFang SC;
              font-weight: 400;
              font-size: 12px;
              color: #3d3d3d;
            }
            ::v-deep .el-input__icon {
              line-height: 30px;
            }
            ::v-deep .el-select-dropdown__item.selected {
              color: #12db34;
            }

            .btn_con {
              width: 100%;
              justify-content: space-evenly;
              margin-top: 20px;
              .btn {
                width: 60px;
                height: 30px;
                text-align: center;
                line-height: 30px;
                border-radius: 5px;
                font-family: PingFang SC, PingFang SC;
                font-weight: 400;
                font-size: 14px;
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
      }
      .list_row {
        border-bottom: 1px solid #e4e5ee;

        display: flex;
        .list_item {
          width: 120px;
          justify-content: center;
          border-right: 1px dashed #d9d9d9;
          &:last-of-type {
            border-right: unset;
          }
        }
      }
      .change_order {
        width: 16px;
        height: 16px;
        cursor: pointer;
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
          user-select: none;
          cursor: pointer;
          &:hover {
            .mask {
              display: flex;
            }
          }
          &:last-of-type {
            margin-bottom: 0;
          }
          .user_img {
            width: 270px;
            height: 150px;
          }
          .add {
            width: 14px;
            height: 14px;
          }
          .mask {
            display: none;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(61, 61, 61, 0.4);
            justify-content: center;
            .mask_item {
              width: 60px;
              display: flex;
              flex-direction: column;
              font-family: PingFang SC, PingFang SC;
              font-weight: 400;
              font-size: 14px;
              color: #ffffff;
              height: 100%;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              img {
                width: 18px;
                height: 18px;
                margin-bottom: 4px;
              }
            }
            .mask_add {
              position: absolute;
              left: 50%;
              bottom: 0;
              transform: translateX(-50%);
            }
          }
        }
      }
    }
  }
}
</style>