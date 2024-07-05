<template>
  <div class="home">
    <div class="head_row">
      <span class="title">我的项目</span>
    </div>
    <div class="ddd">排序</div>

    <div class="project_list">
      <div class="normal_item project_add">
        <img class="item_img" src="@/assets/logo.png" alt="" />
        <span>创建新项目/组</span>
        <div class="mask">
          <div class="mask_item" @click="createProject">创建新项目</div>
          <div class="mask_item" @click="createGroup">创建组</div>
        </div>
      </div>
      <div
        class="normal_item group_item"
        v-for="(item, index) in projectGroup"
        :key="item.id"
        :data-id="item.id"
        @dragenter.prevent="dragEnter"
        @dragover.prevent="dragOver"
        @dragleave.prevent="dragLeave"
        @drop.prevent="dropFiles($event)"
      >
        <img
          draggable="false"
          class="item_img"
          src="@/assets/logo.png"
          alt=""
          :data-id="item.id"
        />
        <span :data-id="item.id">小组{{ index + 1 }}</span>
        <span :data-id="item.id"
          >包含{{ projectGroup[index].dataList.length }}个项目</span
        >
      </div>
      <div
        draggable="true"
        @dragstart="dragStart($event)"
        :data-id="item.id"
        class="normal_item project_item"
        v-for="item in projectList"
        :key="item.id"
        @click="goStoryboard"
      >
        <img
          draggable="false"
          class="item_img"
          src="@/assets/logo.png"
          alt=""
        />
        <span>{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeView",
  components: {},
  data() {
    return {
      projectGroup: [],
      projectList: [],
      drag: false,
      dragItemId: "",
    };
  },
  methods: {
    dragEnter() {},
    dragOver() {},
    dragLeave() {},
    dropFiles(e) {
      console.log(e.target, "e.target.dataset.id");
      for (let i = 0; i < this.projectList.length; i++) {
        if (this.projectList[i].id == this.dragItemId) {
          for (let y = 0; y < this.projectGroup.length; y++) {
            if (this.projectGroup[y].id == e.target.dataset.id) {
              this.projectGroup[y].dataList.push(this.projectList[i]);
              this.projectList.splice(i, 1);
              break;
            }
          }
        }
      }
      console.log(this.projectGroup);
    },
    dragStart(e) {
      this.dragItemId = e.target.dataset.id;
    },
    createProject() {
      this.projectList.push({
        id: Date.now().toString(),
        name: `Item ${Date.now().toString()}`,
      });
    },
    createGroup() {
      this.projectGroup.push({ id: Date.now().toString(), dataList: [] });
    },
    goStoryboard() {
      this.$router.push("/storyboard");
    },
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
.home {
  width: 100%;
  background-color: rgb(244, 246, 247);
  .head_row {
    display: flex;
    align-items: center;
    .title {
      font-weight: 600;
      color: #24252c;
    }
  }
  .project_list {
    display: flex;
    flex-wrap: wrap;
    .normal_item {
      display: flex;
      flex-direction: column;
      margin-right: 60px;
      cursor: pointer;
      .item_img {
        width: 126px;
        height: 110px;
      }
    }
    .group_item {
    }

    .project_add {
      position: relative;

      .mask {
        position: absolute;
        top: 50px;
        left: 50px;
        width: 100px;
        height: 120px;
        background: #fff;
        .mask_item {
          margin-top: 20px;
        }
      }
    }
    .project_item {
    }
  }
}
</style>