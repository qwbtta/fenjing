<template>
  <div class="Rename flex">
    <div class="edit_panel">
      <div class="panel_head flex">
        <span>修改{{ renameType }}名称</span
        ><span @click="$emit('close')">x</span>
      </div>
      <div class="subtitle">{{ renameType }}名称</div>
      <input
        v-model="editData.projectName"
        type="text"
        :placeholder="`输入${renameType}名称`"
      />
      <div class="btn_group flex">
        <div class="normal_btn canel" @click="$emit('close')">取消</div>
        <div class="normal_btn confirm" @click="confirm">修改</div>
      </div>
    </div>
  </div>
</template>
            
      <script>
import { updateProjectGroup, updateProjectName } from "@/assets/js/request";
export default {
  props: ["renameType", "renameData"],
  components: {},
  data() {
    return {
      editData: {},
    };
  },
  methods: {
    confirm() {
      if (this.renameType == "项目") {
        updateProjectName({
          id: this.editData.id,
          projectName: this.editData.projectName,
        }).then((res) => {
          this.$emit("confirm", this.editData);
        });
      } else {
        updateProjectGroup({
          id: this.editData.id,
          projectName: this.editData.projectName,
        }).then((res) => {
          this.$emit("confirm", this.editData);
        });
      }
    },
  },
  created() {
    console.log(this.renameData, "this.renameData");
    this.editData = JSON.parse(JSON.stringify(this.renameData));
  },
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
      font-weight: 400;
      font-size: 12px;
      color: #3d3d3d;
      &::placeholder {
        color: #959595;
      }
    }
    .panel_head {
      font-weight: 600;
      font-size: 16px;
      color: #3d3d3d;
      justify-content: space-between;
      .close {
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
    }
  }
}
</style>