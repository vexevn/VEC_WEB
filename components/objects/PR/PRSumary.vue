<template>
  <div class="pr-summary-cc" :has-child="model.child && model.child.length">
    <div
      class="pr-summary-c"
      :style="{ 'background-color': model.background, color: 'white' }"
      @click="GoToSumary(model)"
    >
      <div class="pr-summary-label">{{ model.name }}</div>
      <div class="pr-summary-value">
        <i
          v-if="!loaded"
          class="fa fa-refresh fa-spin"
          style="width: auto; height: auto"
        ></i>
        <span v-else>{{ valueStr }}</span>
      </div>
    </div>
    <div v-if="model.child" class="PRS-child">
      <PRSumary
        v-for="item in model.child"
        :key="item.type"
        :type="type"
        :model="item"
        @onSelect="onPRSumarySelect"
        @onGetValue="onPRSumaryGetValue"
      />
    </div>
  </div>
</template>

<script>
import API from "~/assets/scripts/API";
import APIHelper from "~/assets/scripts/API/APIHelper";
import ConvertStr from "~/assets/scripts/ConvertStr";
import GetDataAPI from "~/assets/scripts/GetDataAPI";
export default {
  props: {
    model: {},
    type: {},
  },
  computed: {
    valueStr() {
      return ConvertStr.ToMoneyStr(this.value.toFixed(0)) || "0";
    },
  },
  methods: {
    GoToSumary() {
      // console.log(this);s
      // this.$router.push("/PRList/" + this.type + "/" + this.model.type);
      this.$emit("onSelect", { type: this.type, model: this.model });
    },
    onPRSumarySelect(obj) {
      // console.log(this);s
      // this.$router.push("/PRList/" + this.type + "/" + this.model.type);
      this.$emit("onSelect", obj);
    },
    onPRSumaryGetValue(obj) {
      // console.log(this);s
      // this.$router.push("/PRList/" + this.type + "/" + this.model.type);
      // this.$emit("onSelect", obj);
      // console.log(obj, this.model);
      this.$emit("onGetValue", this.model);
    },
    onGetValue() {
      this.model.value = this.value;
      this.$emit("onGetValue", this.model);
    },
  },
  data() {
    return {
      loaded: true,
      value: 0,
    };
  },
  mounted() {
    // console.log(this.type, this.model.type);
    this.loaded = false;
    APIHelper.dashboard
      .GetCounterByState({
        iType: this.type,
        iState: this.model.type,
      })
      .then((re) => {
        this.value = re;
        this.onGetValue();
        this.loaded = true;
      });
    // GetDataAPI({
    //   isWait: false,
    //   url: API.Dashboard_GetCounterByState,
    //   params: {
    //     iType: this.type,
    //     iState: this.model.type,
    //   },
    //   action: (re) => {
    //     this.value = re;
    //     this.loaded = true;
    //   },
    //   error: () => {
    //     this.loaded = true;
    //   },
    // });
  },
};
</script>

<style lang="scss" scoped>
.pr-summary-cc {
  flex: 0 0 300px;
  // min-width: calc(25vw - 3px);
  // max-width: 100vw;

  .pr-summary-c {
    // border: 1px solid #ddd;
    border-radius: 10px;
    // height: 70px;
    // min-height: 22vh;

    margin-right: 10px;
    margin-bottom: 15px;
    padding: 13px;
    display: flex;
    // flex-direction: column;
    position: relative;
    cursor: pointer;
    align-items: baseline;
    // &:nth-child(4n + 4) {
    //   margin-right: 0;
    // }
    &:hover {
      opacity: 0.9;
    }
    .pr-summary-value {
      font-size: 26px;
      font-weight: bold;
    }
    .pr-summary-label {
      flex: 1;
      font-size: 13px;
      font-weight: bold;
      text-transform: uppercase;
    }
    &::after {
      content: "";
    }
  }

  &[has-child] {
    &::after {
      content: "";
    }
  }
}

.PRS-child {
  margin-left: 50px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;

  .pr-summary-cc {
    flex: auto;
    // width: 25vw;
    min-width: auto;
    position: relative;
    &:first-child {
      &::after {
        top: -15px;
        height: calc(100% - 28px);
      }
    }
    &::after {
      content: "";
      width: 25px;
      height: 100%;
      position: absolute;
      top: -43px;
      left: -25px;
      // background: black;
      border-left: 2px solid black;
      border-bottom: 2px solid black;
    }
  }
}
</style>
