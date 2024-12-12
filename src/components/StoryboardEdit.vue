<template>
  <div class="StoryboardEdit flex">
    <div class="edit_panel">
      <div class="panel_head flex">
        <span>故事版编辑</span>
        <img
          class="close"
          @click="$emit('close')"
          src="@/assets/img/operatePage/close.png"
          alt=""
        />
      </div>
      <div class="subtitle">画面</div>

      <draggable
        handle=".sort"
        class="frame_list"
        animation="300"
        v-model="frameList"
        @change="frameChange"
      >
        <div class="img_con" v-for="(item, index) in frameList" :key="index">
          <img class="frame_img" :src="item.fileUrl" alt="" />
          <div class="mask">
            <div class="mask_item sort">
              <img src="@/assets/img/operatePage/sort.svg" alt="" />排序
            </div>
            <div class="mask_item" @click="selectImg('dealRepalce', item)">
              <img src="@/assets/img/operatePage/replace.png" alt="" />替换
            </div>
            <div class="mask_item" @click="deleteImg(item)">
              <img src="@/assets/img/operatePage/delete.png" alt="" />删除
            </div>
          </div>
        </div>
        <div draggable="false" @click="selectImg('dealAdd')" class="add flex">
          <img src="@/assets/img/operatePage/add.png" alt="" />
        </div>
      </draggable>

      <div class="flex">
        <div class="row_item">
          <div class="subtitle">景别</div>
          <input type="text" placeholder="请输入" v-model="scenes.content" />
          <!-- <el-select
            class="el_elect"
            v-model="editItem.scenery"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select> -->
        </div>
        <div class="row_item">
          <div class="subtitle">时长（秒）</div>
          <input type="number" v-model="times.content" placeholder="输入数字" />
        </div>
      </div>
      <div class="subtitle">内容</div>
      <input type="text" v-model="content.content" placeholder="请输入" />
      <div class="subtitle">备注</div>
      <input type="text" v-model="remark.content" placeholder="请输入" />
      <div class="btn_groups flex">
        <div class="btn btn1" @click="$emit('close')">取消</div>
        <div class="btn btn2" @click="toSave">保存</div>
      </div>
    </div>
  </div>
</template>
          
    <script>
import draggable from "vuedraggable";
import { commonMethods } from "@/assets/js/mixin.js";
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
import { mapState } from "vuex";
export default {
  props: ["editItem"],
  components: { draggable },
  data() {
    return {
      dataArr: [
        { keyName: "frame", name: "画面" },
        { keyName: "scenes", name: "景别" },
        { keyName: "times", name: "时长" },
        { keyName: "content", name: "内容" },
        { keyName: "remark", name: "备注" },
      ],
      frameList: [], //画面列表
      storyboardList: [],
      frame: {}, // 画面关联列
      scenes: {}, //景别关联列
      times: {}, //时长关联列
      content: {}, //时长关联列
      remark: {}, //时长关联列
    };
  },
  mixins: [commonMethods],
  methods: {
    frameChange(e) {
      updateFileSort({
        fileId: e.moved.element.id,
        sort: e.moved.newIndex,
      }).then((res) => {
        this.toGetMirrorList();
      });
    },
    selectImg(dealFunc, item) {
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
        this[dealFunc](input.files[0], item);
      });
      input.click();
    },
    dealRepalce(file, item) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateFile({
          fileId: item.id,
          file: file,
        }).then((res) => {
          this.toGetMirrorList();
        });
      };
      reader.readAsDataURL(file);
    },
    dealAdd(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        let params = {
          mirrorId: this.editItem.rowId, //分镜/行id
          columnConfigId: this.frame.colId, //列id
          file: file,
        };

        if (this.frame.mirrorColumnId) {
          params.mirrorColumnId = this.frame.mirrorColumnId; //关联id
        }
        updateMirror(params).then((res) => {
          this.toGetMirrorList();
        });
      };
      reader.readAsDataURL(file);
    },
    deleteImg(item) {
      deleteFile({ id: item.id }).then((res) => {
        this.toGetMirrorList();
      });
    },
    getColobj(list, data, colName) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].name.includes(colName)) {
          this[data] = JSON.parse(JSON.stringify(list[i]));
          break;
        }
      }
    },
    toSave() {
      for (let i = 1; i < this.dataArr.length; i++) {
        let params = {
          mirrorId: this.editItem.rowId, //分镜/行id
          columnConfigId: this[this.dataArr[i]["keyName"]].colId, //列id
          columnContent: this[this.dataArr[i]["keyName"]].content,
        };
        if (this[this.dataArr[i]["keyName"]].mirrorColumnId) {
          params.mirrorColumnId =
            this[this.dataArr[i]["keyName"]].mirrorColumnId; //关联id
        }
        updateMirror(params).then((res) => {
          if ((i = this.dataArr.length - 1)) {
            this.$emit("edit");
            this.$emit("close");
          }
        });
      }
    },
  },
  computed: {
    ...mapState(["activeProject"]),
  },
  watch: {
    storyboardList: {
      handler: function (newValue, oldValue) {
        for (let i = 0; i < this.storyboardList.length; i++) {
          if (this.storyboardList[i].rowId == this.editItem.rowId) {
            this.frameList = this.getValue(
              this.storyboardList[i].colObj,
              "画面"
            );
            for (let y = 0; y < this.dataArr.length; y++) {
              this.getColobj(
                this.storyboardList[i].colObj,
                this.dataArr[y].keyName,
                this.dataArr[y].name
              );
            }

            break;
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    console.log(this.editItem);
    // this.frameList = this.getValue(this.editItem.colObj, "画面");
    this.storyboardList = this.activeProject.storyboardList;
  },
};
</script>
    <style lang="scss" scoped>
.StoryboardEdit {
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
    width: calc(100% - 9px);
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
  .edit_panel {
    width: 458px;
    // min-height: 493px;
    background: #ffffff;
    border-radius: 18px;
    padding: 0 11px 31px 18px;
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
    }
    .frame_list {
      display: flex;
      flex-wrap: wrap;
      max-width: 458px;

      .img_con {
        margin-right: 5px;
        margin-bottom: 5px;
        border-radius: 5px;
        position: relative;
        width: 138px;
        height: 78px;
        cursor: pointer;
        &:hover {
          .mask {
            display: flex;
          }
        }
        .frame_img {
          width: 138px;
          height: 78px;
        }
        .mask {
          display: none;
          position: absolute;
          left: 0;
          top: 0;
          width: 138px;
          height: 78px;
          background: rgba(61, 61, 61, 0.4);
          justify-content: center;
          .mask_item {
            width: 34px;
            display: flex;
            flex-direction: column;
            font-weight: 400;
            font-size: 10px;
            color: #ffffff;
            height: 100%;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            img {
              width: 16px;
              height: 16px;
              margin-bottom: 2px;
            }
          }
        }
      }
      .add {
        justify-content: center;
        width: 138px;
        height: 78px;
        background: #f4f6f7;
        border: 1px solid #e4e5ee;
        cursor: pointer;
        img {
          width: 14px;
          height: 14px;
        }
      }
    }
    .row_item {
      width: 100%;
    }
    .btn_groups {
      margin-top: 22px;
      justify-content: flex-end;
      .btn {
        width: 84px;
        height: 38px;
        border-radius: 11px;
        text-align: center;
        line-height: 38px;
        font-size: 14px;
        cursor: pointer;
      }
      .btn1 {
        color: #959595;
        background: #ffffff;
        border: 1px solid #d8d8d8;
      }
      .btn2 {
        color: #ffffff;
        background: #12db34;
        margin-left: 16px;
      }
    }
  }
}
</style>