<template>
  <div class="Rename flex">
    <div class="edit_panel">
      <div class="panel_head flex">
        <span>模板保存</span>
        <img
          class="close"
          @click="$emit('close')"
          src="@/assets/img/operatePage/close.png"
          alt=""
        />
      </div>
      <div class="subtitle">模板名称</div>
      <input v-model="modelVal" type="text" placeholder="请输入" />
      <div class="tips">当前项目的 列设置 将保存为模板</div>
      <div class="btn_group flex">
        <div class="normal_btn canel" @click="$emit('close')">取消</div>
        <div
          class="normal_btn confirm"
          :class="{ disabled_btn: !modelVal.length }"
          @click="confirm"
        >
          保存
        </div>
      </div>
    </div>
  </div>
</template>
                
  <script>
import { insertProjectModel } from "@/assets/js/request";
import { mapState, mapMutations } from "vuex";
export default {
  components: {},
  data() {
    return {
      modelVal: "",
    };
  },
  computed: {
    ...mapState(["activeProject"]),
  },
  methods: {
    confirm() {
      if (this.modelVal.length) {
        insertProjectModel({
          projectId: this.activeProject.id, // (项目id)
          modelName: this.modelVal, // (模板名称)
        }).then((res) => {
          if (res.code == 200) {
            this.$message({
              message: "保存成功",
              type: "success",
            });
          } else {
            this.$message({
              message: "保存失败",
              type: "error",
            });
          }
          this.$emit("close");
        });
      }
    },
  },
  created() {},
};
</script>
  <style lang="scss" scoped>
.Rename {
  z-index: 99;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  .edit_panel {
    width: 458px;
    background: #ffffff;
    border-radius: 18px;
    padding: 20px;
    input {
      width: 100%;
      height: 32px;
      border-radius: 5px;
      border: 1px solid #e4e5ee;
      outline: none;
      padding: 0 12px;
      font-size: 12px;
      color: #3d3d3d;
      &::placeholder {
        color: #959595;
      }
    }
    ::v-deep .el-input__inner {
      width: 418px;
      height: 32px;
      border-radius: 5px;
      font-size: 12px;
      color: #3d3d3d;
    }
    ::v-deep .el-input__icon {
      line-height: 32px;
    }
    .panel_head {
      font-weight: 600;
      font-size: 16px;
      color: #3d3d3d;
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
      margin-top: 14px;
      margin-bottom: 11px;
    }
    .tips {
      font-weight: 500;
      font-size: 14px;
      color: #959595;
      margin-top: 20px;
    }

    .btn_group {
      margin-top: 20px;
      justify-content: flex-end;
      .normal_btn {
        width: 84px;
        height: 38px;
        border-radius: 11px;
        text-align: center;
        line-height: 38px;
        font-weight: 400;
        font-size: 14px;
        margin-left: 20px;
        cursor: pointer;
      }
      .canel {
        border: 1px solid #d8d8d8;
        color: #959595;
      }
      .confirm {
        color: #ffffff;
        background: #12db34;
      }
      .disabled_btn {
        background: rgb(238, 238, 238);
      }
    }
  }
}
</style>