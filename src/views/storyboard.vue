<template>
  <div class="storyboard">
    <div class="head">项目名</div>
    <div class="main">
      <div class="head_row flex">
        <span>制作分镜</span>
        <div class="addStoryboard">
          <span @click="addRow(1)">+1</span>
          <span @click="addRow(5)">+5</span>
          <span @click="addRow(10)">+10</span>
        </div>
      </div>

      <div class="storyboard_form" v-if="storyboardList.length > 0">
        <div class="form_head">
          <draggable v-model="storyboardHead" class="flex" @end="rowDragEnd">
            <div
              class="head_item"
              v-for="item in storyboardHead"
              :key="item.headName"
              :class="[item.specialClass]"
            >
              {{ item.headName }}
            </div>
          </draggable>
        </div>

        <draggable v-model="storyboardList" class="col_flex" @end="colDragEnd">
          <div
            class="list_row flex"
            v-for="(item, index) in storyboardList"
            :key="index"
          >
            <div
              class="list_item flex"
              :class="{ width300: 'nums'.includes(key) }"
              v-for="(value, key) in item"
              :key="value"
            >
              <div v-if="key == 'order'" class="change_order">
                <span>+</span>
                <span>-</span>
              </div>
              <span v-else>{{ value }}</span>
            </div>
          </div>
        </draggable>
      </div>
    </div>
  </div>
</template>
    
    <script>
import draggable from "vuedraggable";
export default {
  components: {
    draggable,
  },
  data() {
    return {
      storyboardHead: [],
      storyboardList: [],
    };
  },
  methods: {
    addRow(rows) {
      for (let i = 0; i < rows; i++) {
        let item = {};
        for (let y = 0; y < this.storyboardHead.length; y++) {
          item[
            this.storyboardHead[y].keyName
          ] = `${i}-${this.storyboardHead[y].keyName}`;
        }
        this.storyboardList.push(item);
      }
      console.log(this.storyboardList);
    },
    colDragEnd() {},
    rowDragEnd() {
      //拖拽表头后更换表单顺序
      let tempList = [];
      let temp = {};
      for (let i = 0; i < this.storyboardHead.length; i++) {
        temp[this.storyboardHead[i].keyName] = "";
      }
      for (let y = 0; y < this.storyboardList.length; y++) {
        let temp2 = JSON.parse(JSON.stringify(temp));
        for (let key in this.storyboardList[y]) {
          for (let key2 in temp2) {
            if (key2 == key) {
              temp2[key2] = this.storyboardList[y][key];
              break;
            }
          }
        }
        tempList.push(temp2);
      }
      this.storyboardList = tempList;
    },
  },
  created() {
    this.storyboardHead = [
      { headName: "排序", keyName: "order" },
      { headName: "镜号", keyName: "nums", specialClass: "width300" },
      { headName: "画面", keyName: "frame" },
      { headName: "景别", keyName: "scenery" },
    ];
    this.addRow(3);
  },
};
</script>
<style lang="scss" scoped>
.storyboard {
  width: 100vw;
  background: #fff;
  .col_flex {
    display: flex;
    flex-direction: column;
  }
  .head {
    width: 100%;
    height: 50px;
    border-bottom: 1px solid #dedede;
    display: flex;
    align-items: center;
  }
  .main {
    .head_row {
      .addStoryboard {
        span {
          margin-right: 20px;
          cursor: pointer;
        }
      }
    }
    .storyboard_form {
      .width300 {
        width: 300px !important;
      }
      .form_head {
        display: flex;
        .head_item {
          width: 100px;
          height: 50px;
          text-align: center;
          line-height: 50px;
          background: rgb(244, 246, 247);
        }
      }
      .list_row {
        .list_item {
          width: 100px;
          justify-content: center;
        }
      }
      .change_order {
        display: flex;
        flex-direction: column;
        span {
          margin-bottom: 10px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>