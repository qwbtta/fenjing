<template>
  <div class="storyVersion">
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
          <!-- <div class="new_shot">+ 新建镜头</div> -->
        </div>
        <div @click="showProjectionMode = true" class="btn flex">
          <img
            class="projection"
            src="@/assets/img/operatePage/projection.png"
            alt=""
          />放映模式
        </div>
      </div>
      <draggable
        animation="300"
        v-model="storyboardList"
        class="storyboard_list"
      >
        <div
          class="storyboard_item"
          v-for="(item, index) in storyboardList"
          :key="index"
        >
          <img
            v-if="getValue(item.colObj, '画面')[0]?.fileUrl"
            class="img_preview"
            :src="getValue(item.colObj, '画面')[0]?.fileUrl"
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
            <!-- <img
              @click="goStoryboardEdit(item)"
              class="edit"
              src="@/assets/img/operatePage/edit.png"
              alt=""
            /> -->
          </div>
        </div>
      </draggable>
    </div>
    <div v-if="showTips" class="bottom_tips flex">
      <div class="flex">
        <div class="aaa"></div>
        <div class="tips_1">
          <div class="special_font">关于预览故事板</div>
          <div>
            在故事板模式下，你可以用类似于连环画的形式浏览故事的完整性，并做出适当调整。
          </div>
        </div>
      </div>
      <div class="flex">
        <span class="tips_2">如果已经完成了分镜的制作，您可以</span>
        <div @click="$router.push('/shootingPlan')" class="router_btn flex">
          <span>预览故事版</span>
        </div>
        <div class="footer_close" @click="showTips = false">关闭</div>
      </div>
    </div>
    <StoryboardEdit
      v-if="showStoryboardEdit"
      @close="showStoryboardEdit = false"
      :editItem="editItem"
    />
    <ProjectionMode
      v-if="showProjectionMode"
      :storyboardList="storyboardList"
      @close="showProjectionMode = false"
    />
  </div>
</template>
        
  <script>
import StoryboardEdit from "@/components/StoryboardEdit.vue";
import ProjectionMode from "@/components/ProjectionMode.vue";
import FuncHead from "@/components/FuncHead.vue";
import draggable from "vuedraggable";
import { commonMethods } from "@/assets/js/mixin.js";
import { mapState, mapMutations } from "vuex";
export default {
  components: { StoryboardEdit, draggable, ProjectionMode, FuncHead },
  computed: {
    ...mapState(["activeProject"]),
  },
  data() {
    return {
      storyboardList: [],
      showStoryboardEdit: false, //编辑框显隐
      editItem: {}, //编辑项
      showProjectionMode: false, //放映模式显隐
      showTips: false,
    };
  },
  mixins: [commonMethods],
  methods: {
    goStoryboardEdit(item) {
      this.showStoryboardEdit = true;
      this.editItem = item;
    },
  },
  created() {
    this.storyboardList = this.activeProject.storyboardList;
    console.log(this.activeProject, "this.activeProject");
  },
};
</script>
  <style lang="scss" scoped>
.storyVersion {
  width: 100%;
  background: #f4f6f7;

  .main {
    padding-left: 32px;
    .head_row {
      margin-top: 24px;
      justify-content: space-between;
      padding-right: 30px;
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
      .new_shot {
        width: 112px;
        height: 40px;
        background: #12db34;
        border-radius: 12px;
        text-align: center;
        line-height: 40px;
        font-weight: 500;
        font-size: 14px;
        color: #ffffff;
        cursor: pointer;
      }
      .btn {
        width: 112px;
        height: 32px;
        background: #ffffff;
        border-radius: 54px;
        border: 1px solid #e4e5ee;
        font-weight: 400;
        font-size: 14px;
        color: #3d3d3d;
        justify-content: center;
        margin-left: 14px;
        cursor: pointer;
        .projection {
          width: 16px;
          height: 10px;
          margin-right: 5px;
        }
      }
    }
    .storyboard_list {
      display: flex;
      flex-wrap: wrap;
      .storyboard_item {
        width: 275px;
        min-height: 278px;
        background: #ffffff;
        border-radius: 10px;
        margin-right: 10px;
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
          .edit {
            width: 16px;
            height: 16px;
            margin-right: 6px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>