<template>
  <div class="prcm-c" :invalid="!!validate()">
    <!-- <el-tooltip
      :disabled="!validate()"

      :message="validate()"
      placement="top-start"
      effect="light"
      popper-class="iValid-class"
      :enterable="false"
      :tabindex="-1"
    > -->

    <slot></slot>

    <div
      class="PRvalidate"
      v-if="validate() != 'Required'"
      v-html="validate()"
    ></div>
  </div>
</template>

<script>
import DefaultForm from "~/assets/scripts/base/DefaultForm";
import DelayCall from "~/assets/scripts/base/DelayCall";
export default {
  props: {
    baseValue: {},
    validator: {},
    isRequired: {},
  },
  data() {
    return {
      message: "",
      /**
       * @type {DelayCall} type - description
       */
      dc: null,
    };
  },
  watch: {
    baseValue(newValue, oldValue) {
      this.dc.run();
    },
  },
  methods: {
    validate() {
      if (this.isRequired == undefined || this.isRequired == true) {
        if (!this.baseValue) return "Required";
      }

      if (this.validator) return this.validator();

      return "";
    },
    getValidate() {
      if (this.validate()) {
        return false;
      } else return true;
    },
  },
  mounted() {
    this.dc = new DelayCall(() => {
      this.getValidate();
    });
    this.getValidate();
  },
};
</script>

<style lang="scss" scoped>
.prcm-c {
  position: relative;

  &[invalid][showAlert] {
    & > * {
      box-shadow: 0px 0px 3px red;
    }
    // color: red !important;
    .PRvalidate {
      color: red !important;
      font-size: 11px;
      text-align: left;
    }
  }
  .PRvalidate {
    color: red !important;
    font-size: 11px;
    line-height: 11px;
    text-align: left;
  }
}
</style>
