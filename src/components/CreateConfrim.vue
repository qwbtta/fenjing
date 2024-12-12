<template>
  <div class="Rename flex">
    <div class="edit_panel">
      <div class="panel_head flex">
        <span>创建项目</span>
        <img
          class="close"
          @click="$emit('close')"
          src="@/assets/img/operatePage/close.png"
          alt=""
        />
      </div>
      <div class="subtitle">项目名</div>
      <input
        v-model="confirmData.name"
        type="text"
        :placeholder="`必填，输入项目名`"
      />
      <div class="subtitle">模板</div>
      <el-select v-model="confirmData.modelId" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <div class="btn_group flex">
        <div class="normal_btn canel" @click="$emit('close')">取消</div>
        <div
          class="normal_btn confirm"
          :class="{ disabled_btn: !confirmData?.name.length }"
          @click="confirm"
        >
          创建
        </div>
      </div>
    </div>
  </div>
</template>
              
<script>
import { getModelList } from "@/assets/js/request";
export default {
  components: {},
  data() {
    return {
      confirmData: {
        name: "",
        modelId: "2",
      },
      options: [],
    };
  },
  methods: {
    confirm() {
      if (this.confirmData?.name.length) {
        this.$emit("close");
        this.$emit("confirm", this.confirmData);
      }
    },
  },
  created() {
    getModelList().then((res) => {
      for (let i = 0; i < res.data.length; i++) {
        let item = {
          value: res.data[i].id,
          label: res.data[i].modelName,
        };
        this.options.push(item);
      }
    });
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