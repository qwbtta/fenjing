<template>
  <div class="storyboard">
    <FuncHead />
    <div class="main">
      <div class="head_row flex">
        <div class="flex">
          <span class="head_title">我的项目</span>
          <img
            class="tips"
            @click="showTips = !showTips"
            src="@/assets/img/operatePage/tips.png"
            alt=""
          />
          <div class="addStoryboard flex" v-if="!activeProject.banEdit">
            <div class="add_item" @click="addRow(1)">+ 新建镜头</div>
            <div class="add_item" @click="addRow(5)">+ 5</div>
            <div class="add_item" @click="addRow(10)">+ 10</div>
          </div>
        </div>
        <!-- <div class="btn_type1" style="margin-left: auto">
          <img src="@/assets/img/operatePage/sort.png" alt="" />
          分镜设置
        </div>
        <div class="btn_type1">
          <img src="@/assets/img/operatePage/sort.png" alt="" />
          列设置
          <div class="menu_panel"></div>
        </div> -->
      </div>
      <div class="storyboard_form" v-if="storyboardList.length > 0">
        <div class="form_head">
          <draggable
            animation="300"
            v-model="storyboardHead"
            class="flex"
            filter=".index"
            @change="headChange"
          >
            <div
              class="head_item"
              v-for="(item, index) in storyboardHead"
              :key="index"
              :class="[item.specialClass, { index: item.colId == 'index' }]"
            >
              {{ item.colName }}
            </div>
          </draggable>
          <!-- <div @click="showAddPanel = !showAddPanel" class="head_item add_col">
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
          </div> -->
        </div>

        <draggable
          animation="300"
          v-model="storyboardList"
          class="col_flex"
          handle=".change_order"
          @change="indexChange"
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
                v-if="!activeProject.banEdit"
                class="delete_icon"
                @click="deleteMirror(item)"
                src="@/assets/img/operatePage/delete_2.png"
                alt=""
              />
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
                v-else-if="colObj.name.includes('时长')"
                :value="colObj.content"
                type="number"
                placeholder="输入数字"
                @input="valueChanged($event, item, colObj, false, true)"
                @blur="valueChanged($event, item, colObj, true, true)"
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
                    <div class="mask" v-if="!activeProject.banEdit">
                      <div class="mask_item sort">
                        <img
                          src="@/assets/img/operatePage/sort.svg"
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
                        添加更多图片
                      </div>
                    </div>
                  </div>
                </draggable>
                <div
                  class="frame_item flex"
                  v-if="colObj.content.length == 0 && !activeProject.banEdit"
                  @click="selectImg('dealAdd', item, colObj)"
                >
                  <img
                    class="add"
                    src="@/assets/img/operatePage/add.png"
                    alt=""
                  />
                </div>
                <div
                  class="frame_item flex"
                  v-if="colObj.content.length == 0 && activeProject.banEdit"
                ></div>
              </div>
              <div
                v-else
                class="editDiv"
                :contenteditable="!activeProject.banEdit"
                placeholder="输入内容"
                @input="valueChanged($event, item, colObj)"
                @blur="valueChanged($event, item, colObj, true)"
              >
                {{ colObj.content }}
              </div>
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
        <img
          class="footer_close"
          @click="showTips = false"
          src="@/assets/img/operatePage/close.png"
          alt=""
        />
      </div>
    </div>
  </div>
</template>
    
    <script>
import draggable from "vuedraggable";
import FuncHead from "@/components/FuncHead.vue";
import { mapState, mapMutations } from "vuex";
import {
  createMirror,
  updateMirror,
  deleteMirror,
  deleteFile,
  updateFile,
  updateFileSort,
  insertMirror,
  moveModelColumnConfig,
} from "@/assets/js/request";
import { commonMethods } from "@/assets/js/mixin.js";
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
  mixins: [commonMethods],
  methods: {
    ...mapMutations(["SET_ACTIVEPROJECT"]),
    addRow(rows) {
      createMirror({
        projectId: this.activeProject.id,
        num: rows,
      }).then((res) => {
        this.toGetMirrorList();
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
      const reader = new FileReader();
      reader.onload = (e) => {
        updateFile({
          fileId: item2.id,
          file: file,
        }).then((res) => {
          this.toGetMirrorList();
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
        this.toGetMirrorList();
      });
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
    valueChanged(e, item, colObj, immediate = false, numberLimit = false) {
      clearTimeout(this.timer);
      let value = numberLimit ? e.target.value : e.target.innerText;
      if (numberLimit) {
        // input number类型在vue限制下无效  手动处理下长度限制
        let data = JSON.stringify(e.target.value);
        if (data.length > 6) {
          this.$nextTick(() => {
            colObj.content = value = Number(data.slice(0, 6));
          });
        }
      }

      this.timer = setTimeout(
        () => {
          let params = {
            mirrorId: item.rowId, //分镜/行id
            columnConfigId: colObj.colId, //列id
            columnContent: value,
          };
          this.updateMirror(params, colObj);
        },
        immediate ? 0 : 2000
      );
    },

    headChange(e) {
      console.log(e.moved.newIndex, " e.moved.newIndex");
      if (e.moved.newIndex == 0) {
        this.$message({
          message: "不能将列移动至排序之前",
          type: "warning",
        });
        return;
      }
      let params = {
        modelId: this.activeProject.modelId,
        projectId: this.activeProject.id,
        modelColumnConfigId: e.moved.element.colId,
        // modelColumnConfigId: "f41dd78b-7e8e-48c7-9713-10f9ae6652b2",
        sort: e.moved.newIndex - 1,
      };
      moveModelColumnConfig(params).then((res) => {
        this.toGetMirrorList();
      });
      // updateFileSort({
      //   fileId: e.moved.element.id,
      //   sort: e.moved.newIndex,
      // }).then((res) => {
      //   this.toGetMirrorList();
      // });
    },
    indexChange(e) {
      let params = {
        mirroId: e.moved.element.rowId,
        projectId: this.activeProject.id,
        sort: e.moved.newIndex + 1,
      };
      insertMirror(params).then((res) => {});
    },
    frameChange(e) {
      updateFileSort({
        fileId: e.moved.element.id,
        sort: e.moved.newIndex,
      }).then((res) => {
        this.toGetMirrorList();
      });
    },
    updateMirror(params, colObj) {
      if (colObj.mirrorColumnId) {
        params.mirrorColumnId = colObj.mirrorColumnId; //关联id
      }
      updateMirror(params).then((res) => {
        this.toGetMirrorList();
      });
    },
    deleteMirror(item) {
      deleteMirror({ mirrorIds: item.rowId }).then((res) => {
        this.toGetMirrorList();
      });
    },
  },
  created() {
    this.toGetMirrorList();
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
      .head_title {
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
        position: relative;
        cursor: pointer;
        > img {
          width: 16px;
          height: 16px;
          margin-right: 6px;
        }
        .menu_panel {
          position: absolute;
          top: 34px;
          right: 0;
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
        position: relative;
        &:hover {
          .delete_icon {
            display: block;
          }
        }
        .list_item {
          width: 120px;
          justify-content: center;
          border-right: 1px dashed #d9d9d9;
          &:last-of-type {
            border-right: unset;
          }
        }
        .delete_icon {
          display: none;
          position: absolute;
          left: 106px;
          top: 50%;
          transform: translateY(-50%);
          width: 26px;
          height: 26px;
          cursor: pointer;
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
              width: 120px;
              height: 26px;
              line-height: 26px;
              font-size: 12px;
              color: #3d3d3d;
              text-align: center;
              border-radius: 8px;
              background: #f4f6f7;
            }
          }
        }
      }
    }
  }
}
</style>