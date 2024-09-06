<template>
  <div class="prcm-c" :isDiff="customMessage !== ''">
    <el-tooltip
      :content="customMessage"
      :placement="'right'"
      :disabled="!customMessage || isPopup"
      style="display: flex"
    >
      <div>
        <slot></slot>
      </div>
    </el-tooltip>

    <i
      v-if="customMessage"
      class="fa fa-info-circle prcm-c-icon"
      style="color: blue"
      @click="openForm()"
    ></i>

    <DefaultForm :model="form">
      <div slot="content">
        <!-- <div><b>Current data:</b></div>
        <div>{{ baseValue }}</div> -->
        <!-- <div><b>Original Info:</b></div> -->
        <slot name="popupContent">
          <div>{{ onMessage || oldValue || "(No Data)" }}</div>
        </slot>
      </div>
    </DefaultForm>
  </div>
</template>

<script>
import DefaultForm from "~/assets/scripts/base/DefaultForm";
import ConvertStr from "~/assets/scripts/ConvertStr";
export default {
  props: {
    oldValue: {},
    baseValue: {},
    onMessage: {},
    isPopup: {},
    isoldValue: {},
    isNumber: {},
  },
  data() {
    return {
      message: "",
      form: new DefaultForm({
        type: "dialog",
        title: "Original Info",
      }),
    };
  },
  computed: {
    customMessage() {
      // console.log(
      //   this.baseValue,
      //   this.oldValue,
      //   this.isoldValue,
      //   this.onMessage,
      //   this.message
      // );
      if (this.baseValue == this.oldValue) return "";
      if (!this.isoldValue) return "";
      return this.onMessage ? "Original Info: " + this.onMessage : this.message;
    },
  },
  watch: {
    baseValue(newValue, oldValue) {
      this.getMessage();
    },
    oldValue(newValue, oldValue) {
      this.getMessage();
    },
  },
  methods: {
    openForm() {
      this.form.visible = true;
    },
    getMessage() {
      this.message = "";
      if (this.onMessage !== undefined) {
        this.message = "";
        return;
      }
      if (this.isoldValue)
        if (this.baseValue != this.oldValue) {
          let content = this.isNumber
            ? ConvertStr.ToMoneyStr(this.oldValue)
            : this.oldValue;
          this.message = `Original Info: ${content || "..."}`;
        } else this.message = "";
    },
  },
  mounted() {
    this.getMessage();
    // setTimeout(() => , 1500);
  },
};
</script>

<style lang="scss" scoped>
::v-deep .form-c {
  font-size: 13px;
  text-align: left;
}
.prcm-c {
  position: relative;
  &[isDiff] {
    ::v-deep  input {
      color: blue !important;
    }
    ::v-deep  textarea {
      color: blue !important;
    }
  }
  .prcm-c-icon {
    position: absolute;
    bottom: -5px;
    right: -5px;

    cursor: pointer;
  }
}
</style>
