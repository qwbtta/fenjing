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
        <img
          v-if="activeData.file?.fileUrl"
          :src="activeData.file?.fileUrl"
          alt=""
        />
      </div>
      <div class="main_right">
        <div class="shots_item" v-for="(item, index) in list" :key="index">
          <img
            v-if="index == dataAcitiveIndex"
            class="check"
            src="@/assets/img/operatePage/checked.png"
            alt=""
            @click="dataAcitiveIndex = index"
          />
          <img
            v-else
            class="check"
            src="@/assets/img/operatePage/check.png"
            alt=""
            @click="dataAcitiveIndex = index"
          />

          <img
            v-if="item.file?.fileUrl"
            class="frameImg"
            draggable="false"
            :src="item.file?.fileUrl"
            alt=""
          />
          <div v-else class="empty flex">未添加图片</div>
          <div class="shot_des">
            <span class="nums">镜头{{ item.sort }}</span
            ><span class="content">{{ item.textContent }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="footer flex">
      <span class="footer_title">放映模式</span>
      <div class="mode_item" @click="checkMode(0)">
        <div class="img_con flex" :class="{ item_active: modeType == 0 }">
          <img src="@/assets/img/operatePage/manual.png" alt="" />
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
      dataAcitiveIndex: 0, //当前渲染分镜在分镜列表的位次
      imgActiveIndex: 0, //当前渲染图片在对象图片数组的位次
      modeType: 0, //0手动切换 1自动切换
      timer: null,
    };
  },
  methods: {
    previous() {
      if (this.imgActiveIndex !== 0) {
        this.imgActiveIndex -= 1;
        return;
      }
      this.dataAcitiveIndex -= 1;
      this.imgActiveIndex = this.activeData.frame.length - 1;
      this.activeData = this.storyboardList[this.dataAcitiveIndex];
    },
    next() {
      if (this.imgActiveIndex < this.activeData.frame.length - 1) {
        this.imgActiveIndex += 1;
        return;
      }
      this.dataAcitiveIndex += 1;
      this.imgActiveIndex = 0;
      this.activeData = this.storyboardList[this.dataAcitiveIndex];
    },
    checkMode(type) {
      this.modeType = type;
      if (!type) {
        //手动切换
        clearInterval(this.timer);
      } else {
        //自动切换
        this.timer = setInterval(() => {
          if (this.list.length - 1 == this.dataAcitiveIndex) {
            this.dataAcitiveIndex = 0;
          } else {
            this.dataAcitiveIndex += 1;
          }
        }, 3000);
      }
    },
  },
  computed: {
    //当前渲染的对象
    activeData() {
      return this.list[this.dataAcitiveIndex];
    },
  },
  created() {
    // 要实现功能 对数据进行改造 有点麻烦
    let tempList = [];
    for (let i = 0; i < this.storyboardList.length; i++) {
      let tempItem = {
        sort: this.storyboardList[i].sort,
        rowId: this.storyboardList[i].rowId,
      };
      for (let y = 0; y < this.storyboardList[i].colObj.length; y++) {
        if (this.storyboardList[i].colObj[y].name == "内容") {
          tempItem.textContent = this.storyboardList[i].colObj[y].content;
        }
        if (this.storyboardList[i].colObj[y].name == "画面") {
          tempItem.imgList = this.storyboardList[i].colObj[y].content;
        }
      }
      tempList.push(tempItem);
    }
    for (let i = 0; i < tempList.length; i++) {
      if (tempList[i].imgList.length == 0) {
        this.list.push(tempList[i]);
      } else {
        for (let j = 0; j < tempList[i].imgList.length; j++) {
          let tempItem = JSON.parse(JSON.stringify(tempList[i]));
          tempItem.file = tempItem.imgList[j];
          this.list.push(tempItem);
        }
      }
    }
    console.log(this.list, " this.list");
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
        height: 100%;
        width: 100%;
        object-fit: contain;
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
        .empty {
          width: 169px;
          height: 94px;
          background: #f4f6f7;
          justify-content: center;
          font-weight: 500;
          font-size: 14px;
          color: #959595;
        }
        .frameImg {
          width: 169px;
          height: 94px;
          object-fit: contain;
        }
        .shot_des {
          display: flex;
          flex-direction: column;
          margin-left: 14px;
          .nums {
            font-weight: 400;
            font-size: 12px;
            color: #3d3d3d;
          }
          .content {
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
      font-weight: 600;
      font-size: 16px;
      color: #3d3d3d;
      margin: 0 47px 0 34px;
    }
    .mode_item {
      display: flex;
      flex-direction: column;
      align-items: center;
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