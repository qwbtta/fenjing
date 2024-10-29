<template>
  <div class="ProjectionMode">
    <div class="panel_head flex">
      <img
        @click="$emit('close')"
        class="left_arrow"
        src="@/assets/img/operatePage/left_arrow.png"
        alt=""
      /><span>放映模式</span>
    </div>
    <div class="main flex">
      <div class="main_left flex">
        <img :src="activeData.imgUrl" alt="" />
      </div>
      <div class="main_right">
        <div class="shots_item" v-for="(item, index) in list" :key="index">
          <img
            v-if="index == activeDataIndex"
            class="check"
            src="@/assets/img/operatePage/checked.png"
            alt=""
            @click="activeDataIndex = index"
          />
          <img
            v-else
            class="check"
            src="@/assets/img/operatePage/check.png"
            alt=""
            @click="activeDataIndex = index"
          />
          <img class="frameImg" draggable="false" :src="item.imgUrl" alt="" />
          <div class="shot_des">
            <span class="nums">{{ item.nums }}</span
            ><span class="content">{{ item.content }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="footer flex">
      <span class="footer_title">放映模式</span>
      <div class="mode_item" @click="checkMode(0)">
        <div class="img_con flex" :class="{ item_active: modeType == 0 }">
          <img src="@/assets/img/operatePage/auto.png" alt="" />
        </div>
        <span class="mode_name">手动切换</span>
      </div>
      <div class="mode_item" @click="checkMode(1)">
        <div class="img_con flex" :class="{ item_active: modeType == 1 }">
          <img src="@/assets/img/operatePage/auto.png" alt="" />
        </div>
        <span class="mode_name">自动切换</span>
      </div>
    </div>
  </div>
</template>
            
      <script>
export default {
  props: {
    storyboardList: {
      type: Array,
    },
  },
  components: {},
  data() {
    return {
      list: [],
      activeDataIndex: 0, //当前渲染对象在数组的位次
      activeImgIndex: 0, //当前渲染图片在对象图片数组的位次
      modeType: 0, //0手动切换 1自动切换
      timer: null,
    };
  },
  methods: {
    previous() {
      if (this.activeImgIndex !== 0) {
        this.activeImgIndex -= 1;
        return;
      }
      this.activeDataIndex -= 1;
      this.activeImgIndex = this.activeData.frame.length - 1;
      this.activeData = this.storyboardList[this.activeDataIndex];
    },
    next() {
      if (this.activeImgIndex < this.activeData.frame.length - 1) {
        this.activeImgIndex += 1;
        return;
      }
      this.activeDataIndex += 1;
      this.activeImgIndex = 0;
      this.activeData = this.storyboardList[this.activeDataIndex];
    },
    checkMode(type) {
      this.modeType = type;
      if (!type) {
        //手动切换
        clearInterval(this.timer);
      } else {
        //自动切换
        this.timer = setInterval(() => {
          if (this.list.length - 1 == this.activeDataIndex) {
            this.activeDataIndex = 0;
          } else {
            this.activeDataIndex += 1;
          }
        }, 3000);
      }
    },
  },
  computed: {
    // showPrevious() {
    //   return !(this.activeDataIndex == 0 && this.activeImgIndex == 0);
    // },
    // showNext() {
    //   return !(
    //     this.activeDataIndex == this.storyboardList.length - 1 &&
    //     this.activeImgIndex == this.activeData.frame.length - 1
    //   );
    // },
    //当前渲染的对象
    activeData() {
      return this.list[this.activeDataIndex];
    },
  },
  created() {
    for (let i = 0; i < this.storyboardList.length; i++) {
      for (let y = 0; y < this.storyboardList[i].frame.length; y++) {
        let tempItem = JSON.parse(JSON.stringify(this.storyboardList[i]));
        tempItem.imgUrl = this.storyboardList[i].frame[y];
        this.list.push(tempItem);
      }
    }
  },
  destroyed() {
    clearInterval(this.timer);
  },
};
</script>
      <style lang="scss" scoped>
.ProjectionMode {
  z-index: 99;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: #fff;
  .panel_head {
    width: 100%;
    height: 54px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 600;
    font-size: 16px;
    color: #3d3d3d;
    border-bottom: 1px solid #eeeeee;
    .left_arrow {
      width: 16px;
      height: 16px;
      margin-left: 28px;
      margin-right: 16px;
    }
  }
  .main {
    height: calc(100% - 134px);
    align-items: flex-start;
    .main_left {
      height: 100%;
      width: 100%;
      background: #000;
      justify-content: center;
      > img {
        width: 100%;
      }
    }
    .main_right {
      width: 370px;
      flex-shrink: 0;
      .shots_item {
        display: flex;
        align-items: flex-start;
        margin-top: 20px;
        .check {
          width: 16px;
          height: 16px;
          margin: 0 10px 0 20px;
          align-self: center;
          cursor: pointer;
        }
        .frameImg {
          width: 169px;
          height: 94px;
          margin-right: 14px;
        }
        .shot_des {
          display: flex;
          flex-direction: column;
          .nums {
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 12px;
            color: #3d3d3d;
          }
          .content {
            font-family: PingFang SC, PingFang SC;
            font-weight: 500;
            font-size: 14px;
            color: #3d3d3d;
          }
        }
      }
    }
  }
  .footer {
    width: 100%;
    height: 80px;
    border-top: 1px solid #eeeeee;
    .footer_title {
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 16px;
      color: #3d3d3d;
      margin: 0 47px 0 34px;
    }
    .mode_item {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 12px;
      color: #3d3d3d;
      margin-right: 36px;
      cursor: pointer;
      .img_con {
        width: 48px;
        height: 40px;
        border-radius: 6px;
        justify-content: center;

        margin-bottom: 2px;
        img {
          width: 24px;
          height: 24px;
        }
      }
      .item_active {
        background: #f4f6f7;
      }
    }
  }
}
</style>