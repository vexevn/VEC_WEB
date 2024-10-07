<template>
  <div class="Filter">
    <div class="main_ofs">
      <div class="header">
        <span>Văn phòng</span>
        <span>Số lượng</span>
      </div>
      <div class="content">
        <div
          @click="handClickOF(item)"
          class="nameOF"
          :class="{
            'active-button': activeItem && activeItem.Id === item.Id,
          }"
          v-for="(item, index) in data"
          :key="item.Id"
        >
          <div class="button-content">
            <span style="text-align: left; font-size: 11px; font-weight: 500">{{
              item.Name
            }}</span>
            <span style="color: #000000; padding-left: 10px">{{
              item.Count_Asset
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="filter-input">
      <!-- <InputSelect
        v-model="obj.Type"
        :model="
          Para.fixed_asset_type_Get_List.set((p) => {
            p.label = 'Name';
            p.placeholder = 'Loại tài sản';
          })
        "
      /> -->
      <InputSelect
        v-model="obj.Type"
        :model="
          Para.fixed_asset_type_Get_List.set((p) => {
            p.label = 'Name';
            p.placeholder = 'Loại tài sản';
          })
        "
      />
      <InputSelect
        v-model="obj.User_ID"
        :model="Para.Para_Account.set((p) => (p.placeholder = 'Nhân viên'))"
      />
      <el-input
        @change="changeAS()"
        placeholder="Mã tài sản"
        v-model="assetnumber"
      ></el-input>
    </div>
  </div>
</template>

<script>
import GetDataAPI from "~/assets/scripts/GetDataAPI";
import API from "~/assets/scripts/API";

export default {
  data() {
    return {
      data: null,
      activeItem: null,
      assetnumber: null,
      colorsBtn: JSON.parse(localStorage.getItem("colorsBtn")) || {},
    };
  },
  props: {
    obj: {},
  },
  methods: {
    handClickOF(item) {
      this.activeItem = item;
      this.obj.Office_id = item.Id;
      this.$emit("officeChange", item);
    },
    changeAS() {
      this.$emit("asChange", this.assetnumber);
    },

    LoadData() {
      GetDataAPI({
        url: API.Get_List_Office_Asset,
        action: (re) => {
          this.data = re;
        },
      });
    },
  },

  mounted() {
    this.LoadData();
  },
};
</script>

<style lang="scss" scoped>
.active-button {
  background: linear-gradient(
    266deg,
    rgba(64, 158, 255, 1) 0%,
    rgba(255, 255, 255, 1) 95%
  ) !important;
  span:nth-child(1) {
    color: black;
  }
  span:nth-child(2) {
    color: white !important;
  }
}

.Filter {
  width: 180px;
  height: 100%;
  display: flex;
  flex-direction: column;

  .main_ofs {
    display: flex;
    flex-direction: column;
    justify-content: center;
    border: 1px solid rgb(210, 210, 210);
    overflow-y: auto;
    overflow-x: hidden;
    // padding: 2px;
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 10px;
      // font-size: 14px;
      font-weight: 600;
      // border: 1px solid rgb(210, 210, 210);
      // border-bottom: none;
    }

    .content {
      overflow-y: auto;
      height: 100%;
    }

    .nameOF {
      cursor: pointer;
      width: 100%;
      border-radius: 0 !important;
      border: none;
      font-weight: 500;
      position: relative;
      padding: 5px 5px;
      border-radius: 10px;
      z-index: 100;
      overflow: hidden;
      color: white;
      // background: #409EFF;
      background: linear-gradient(
        266deg,
        rgb(152, 204, 255) 0%,
        rgba(64, 158, 255, 1) 74%
      );
      transition: background-color 0.3s ease, background 0.3s ease; /* Ensure smooth transition */
      &::before {
        position: absolute;
        content: "";
        inset: 0; /* same as { top: 0; right: 0; bottom: 0; left: 0; } */
        background: linear-gradient(
          266deg,
          rgba(64, 158, 255, 1) 0%,
          rgba(255, 255, 255, 1) 95%
        );
        z-index: -100;
        opacity: 0;
        // width: 0;
        transition: all 0.4s cubic-bezier(0.2, 0.25, 0.55, 0.55);
      }

      &:hover {
        &::before {
          opacity: 1;
          // width: 100%;
        }

        span:nth-child(1) {
          color: black;
        }
        span:nth-child(2) {
          color: white;
        }
      }

      .button-content {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        span {
          display: inline;
        }
      }
    }
  }

  .filter-input {
    margin-top: 5px;

    .el-select {
      margin-bottom: 8px !important;
      height: 25px;
    }
  }
}
</style>
