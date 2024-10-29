<template>
  <div class="RecycleBin">
    <div class="main">
      <div class="head flex">
        <span class="close" @click="$emit('close')">→</span>
        <span class="middle_span">回收站</span>
        <span class="right_span" @click="completelyDelete(null)">全部删除</span>
      </div>
      <div class="project_list hide_scrollbar">
        <div
          class="project_item flex"
          v-for="(item, index) in projectList"
          :key="index"
        >
          <img
            class="project_icon"
            src="@/assets/img/homePage/project.png"
            alt=""
          />
          <div class="column">
            <span class="project_title ellipsis">{{ item.projectName }}</span>
            <span class="project_subtitle">
              创建于{{ getTime(item.createTime) }}</span
            >
          </div>
          <img
            class="operate restore"
            src="@/assets/img/homePage/restore.png"
            alt=""
            @click="restore(item.id)"
          />
          <img
            class="operate completely_delete"
            src="@/assets/img/homePage/completely_delete.png"
            alt=""
            @click="completelyDelete(item.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
                
<script>
import {
  getProjectList,
  roolBackProject,
  cleanOutProject,
} from "@/assets/js/request";
export default {
  components: {},
  data() {
    return {
      projectList: [],
    };
  },
  methods: {
    restore(id) {
      roolBackProject({ ids: id }).then((res) => {
        this.getList();
      });
    },
    completelyDelete(id) {
      cleanOutProject({ ids: id }).then((res) => {
        this.getList();
      });
    },
    getList() {
      getProjectList({
        sortType: 1,
        isDelete: "1",
      }).then((res) => {
        let tempProjectList = [];
        for (let i = 0; i < res.data.length; i++) {
          if (1 == res.data[i].isDelete) {
            tempProjectList.push(res.data[i]);
          }
        }
        this.projectList = tempProjectList;
      });
    },
    getTime(timestamp) {
      const date = new Date(timestamp);
      let MM =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      let DD = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      let hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      let mm =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      return `${MM}-${DD} ${hh}:${mm}`;
    },
  },
  created() {
    this.getList();
  },
};
</script>
  <style lang="scss" scoped>
.RecycleBin {
  z-index: 99;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
  .main {
    width: 370px;
    height: 100%;
    background: #ffffff;
    margin-left: auto;
    padding: 20px;
    .head {
      justify-content: space-between;
      margin-bottom: 35px;
      .close {
        cursor: pointer;
      }
      .middle_span {
        font-weight: 600;
        font-size: 16px;
        color: #3d3d3d;
      }
      .right_span {
        font-size: 12px;
        color: #3d3d3d;
        cursor: pointer;
      }
    }
    .project_list {
      height: calc(100% - 40px);
      overflow: auto;
      .project_item {
        margin-bottom: 30px;
        .project_icon {
          width: 48px;
          height: 40px;
          margin-right: 18px;
        }
        .project_title {
          height: 20px;
          font-weight: 500;
          font-size: 14px;
          color: #3d3d3d;
          line-height: 20px;
        }
        .project_subtitle {
          height: 14px;
          font-weight: 500;
          font-size: 10px;
          color: #adadad;
          line-height: 14px;
          margin-top: 6px;
        }
        .operate {
          width: 32px;
          height: 32px;
          cursor: pointer;
        }
        .restore {
          margin-left: auto;
        }
        .completely_delete {
          margin-left: 16px;
        }
      }
    }
  }
}
</style>