<template>
  <div class="StoryboardEdit flex">
    <div class="edit_panel">
      <div class="panel_head flex">
        <span>故事版编辑</span
        ><span class="close" @click="$emit('close')">x</span>
      </div>
      <div class="subtitle">画面</div>

      <draggable
        filter=".unDrag"
        class="frame_list"
        animation="300"
        v-model="editItem.frame"
      >
        <div
          class="img_con"
          v-for="(item, index) in editItem.frame"
          :key="index"
        >
          <img class="frame_img" :src="item" alt="" />
          <div class="mask">
            <div class="mask_item" @click="selectImg('dealRepalce', index)">
              <img src="@/assets/img/operatePage/replace.png" alt="" />替换
            </div>
            <div class="mask_item" @click="deleteImg(index)">
              <img src="@/assets/img/operatePage/delete.png" alt="" />删除
            </div>
          </div>
        </div>
        <div
          draggable="false"
          @click="selectImg('dealAdd')"
          class="unDrag add flex"
        >
          <img src="@/assets/img/operatePage/add.png" alt="" />
        </div>
      </draggable>

      <div class="flex">
        <div class="row_item">
          <div class="subtitle">景别</div>
          <el-select
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
          </el-select>
        </div>
        <div class="row_item">
          <div class="subtitle">时长（秒）</div>
          <input type="number" v-model="editItem.times" placeholder="请输入" />
        </div>
      </div>
      <div class="subtitle">名称</div>
      <input type="text" placeholder="请输入" />
      <div class="subtitle">声音</div>
      <input type="text" placeholder="请输入" />
    </div>
  </div>
</template>
          
    <script>
import draggable from "vuedraggable";
export default {
  props: ["editItem"],
  components: { draggable },
  data() {
    return {
      options: [
        {
          value: "近景",
          label: "近景",
        },
        {
          value: "远景",
          label: "远景",
        },
        {
          value: "中景",
          label: "中景",
        },
      ],
      value: "",
    };
  },
  methods: {
    selectImg(dealFunc, index) {
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
        this[dealFunc](input.files[0], index);
      });
      input.click();
    },
    dealRepalce(file, index) {
      const reader = new FileReader();
      reader.onload = (e) => {
        let imgUrl = e.target.result;
        this.editItem.frame.splice(index, 1, imgUrl);
      };
      reader.readAsDataURL(file);
    },
    dealAdd(file, index) {
      const reader = new FileReader();
      reader.onload = (e) => {
        let imgUrl = e.target.result;
        this.editItem.frame.push(imgUrl);
      };
      reader.readAsDataURL(file);
    },
    deleteImg(index) {
      this.editItem.frame.splice(index, 1);
    },
  },
  created() {
    console.log(this.editItem);
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
    font-family: PingFang SC, PingFang SC;
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
    font-family: PingFang SC, PingFang SC;
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
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 16px;
      color: #3d3d3d;
      margin-top: 28px;
      justify-content: space-between;
      .close {
        margin-right: 4px;
        cursor: pointer;
      }
    }
    .subtitle {
      font-family: PingFang SC, PingFang SC;
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
            font-family: PingFang SC, PingFang SC;
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
  }
}
</style>