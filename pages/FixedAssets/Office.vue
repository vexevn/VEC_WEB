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
            <span style="text-align: left; font-size: 13px; font-weight: 500">{{
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
      <InputSelect
        v-model="obj.Department_id"
        :model="
          department_select.set((p) => {
            p.label = 'Name';
            p.placeholder = 'Phòng ban';
          })
        "
      />

      <InputSelect
        v-model="obj.Group_id"
        @input="obj.Type = ''"
        :model="
          Para.fixed_asset_group_Get_List.set((p) => {
            p.placeholder = 'Nhóm tài sản';
          })
        "
      />

      <InputSelect
        v-model="obj.Type"
        :model="
          Para.fixed_asset_type_Get_List.set((p) => {
            p.label = 'Name';
            p.data = p.data.filter((x) => x.group_id == obj.Group_id);
            p.placeholder = 'Loại tài sản';
          })
        "
      />
      <InputSelect
        v-model="obj.Use_Type_id"
        :disabled="disabledSelect"
        @input="handleChange()"
        :model="
          Para.TransferType.set((p) => (p.placeholder = 'Đối tượng sử dụng'))
        "
      />
      <!-- <InputSelect
      
        key="para_account"
        :disabled="disabledSelect"
        v-model="obj.User_ID"
        :model="
          Para.Para_Account.set((p) => {
            p.placeholder = 'Nhân viên';
          }).set(
            (p) => (p.data = p.data.filter((x) => x.Office_id == obj.Office_id))
          )
        "
      /> -->
      <InputSelect

        key="para_other"
        :disabled="disabledSelect"
        v-model="obj.User_ID"
        :model="typeUser"
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
import { SelectOption } from "~/assets/scripts/base/SelectOption";
import { Para } from "~/assets/scripts/Para";

export default {
  data() {
    return {
      activeItem: null,
      assetnumber: null,
      department_select: new SelectOption(),
      // GroupSelect: new SelectOption(),
      abc: "",
    };
  },
  props: {
    obj: {},
    data: {},
  },
  computed: {
    disabledSelect() {
      return this.obj.Office_id == 0;
    },
    typeUser() {
      let filterOption = (data) => {
        return data.filter((p1) => {
          if (this.obj.Office_id !== p1.Office_id) return false;

          switch (this.obj.Use_Type_id) {
            case 2:
              return p1.isStore === 1;
            case 3:
              return p1.isStore === 2;
            case 4:
              return p1.isStore === 3;
            case 5:
              return p1.isStore === 4;
            case 6:
              return p1.isStore === 5;
            case 7:
              return p1.isStore === 6;
            case 8:
              return p1.isStore === 7;
            default:
              return false;
          }
        });
      };

      return Para.store_Get_List.set((p) => (p.data = filterOption(p.data)));
    },
  },
  methods: {
    handleChange() {
      // Para.fixed_asset_type_Get_List.set(p=>{
      //   p.data = p.data.filter(x=> x.group_id == this.obj.Group_id)
      // })
      // console.log(this.Para.fixed_asset_type_Get_List)
      this.obj.User_ID = "";
    },
    handClickOF(item) {
      this.activeItem = item;
      this.obj.Office_id = item.Id;
      this.obj.Project_Code = "";
      this.obj.State = 0;
      this.obj.Type = "";
      this.obj.User_ID = "";
      this.obj.Department_id = 0;
      this.obj.Group_id = 0;
      this.obj.Use_Type_id = 0;
      GetDataAPI({
        url: API.dm_department_Get_List,
        params: {
          iOffice_id: item.Id,
        },
        action: (re) => {
          this.department_select.data = re;
        },
      });
      this.$emit("officeChange", item);
    },
    changeAS() {
      this.$emit("asChange", this.assetnumber);
    },

    LoadData() {},
  },
  watch: {
    data() {
      // console.log(this.data);
      if (this.data) {
        GetDataAPI({
          url: API.dm_department_Get_List,
          params: {
            iOffice_id: this.data[0].Id || 0,
          },
          action: (re) => {
            this.department_select.data = re;
          },
        });
      }
    },
  },

  mounted() {
    // this.$nextTick(() => {
    //   GetDataAPI({
    //     url: API.dm_department_Get_List,
    //     params: {
    //       iOffice_id: this.data[0].Id || 0,
    //     },
    //     action: (re) => {
    //       this.department_select.data = re;
    //     },
    //   });
    // });
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
  width: 200px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  .main_ofs {
    display: flex;
    flex-direction: column;
    justify-content: center;
    border: 1px solid rgb(210, 210, 210);

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
