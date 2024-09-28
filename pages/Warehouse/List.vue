<template>
  <div class="wh-c">
    <div class="wh-left">
      <div class="wh-left-title">
        <span> PR List </span>
        <i class="fa fa-plus" @click="Add()"></i>
      </div>
      <div class="wh-left-filter">
        <el-input v-model="iSearchInfo" placeholder="Searching..." />
        <el-button><i class="fa fa-search"></i></el-button>
      </div>
      <el-scrollbar wrap-class="wh-left-list" style="flex: 1">
        <div
          class="wh-left-item"
          v-for="item in Data_PR_List"
          :key="item.Id"
          @click="SelectReceipt(item)"
        >
          <div style="display: flex; align-items: center">
            <div style="padding-right: 0px">
              <i class="fa fa-ellipsis-v"></i>
            </div>
            <div style="flex: 1">
              <div style="display: flex; justify-content: space-between">
                <div>
                  <b>{{ item.Order_serial }}</b>
                </div>
                <div
                  style="
                    flex: 0 0 100px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  "
                >
                  <b>#{{ item.Code }}</b>
                </div>
              </div>

              <div style="display: flex">
                <div>
                  {{
                    ConvertStr.ToDateStr(
                      item.DateActive,
                      "DD, MMMM YYYY hh:MM A"
                    )
                  }}
                </div>
              </div>
             
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div class="wh-right" v-if="form.visible">
      <div class="wh-right-title" style="padding-bottom: 0px">
        <span> {{ form.title }} </span>
        <div class="btns">
          <el-button type="primary" @click="Save">
            <i class="fa fa-save"></i>
            &nbsp; Save
          </el-button>
          <el-button type="danger" @click="Exit">
            <i class="fa fa-times"></i>
            &nbsp; Exit
          </el-button>
        </div>
      </div>
      <div class="wh-right-content" style="flex: 1; padding: 10px">
        <FormInfo :model="obj.Ware_house.form()" ref="form_Ware_house" />
        <div
          class="form-title"
          style="margin-top: 5px; flex: 0 0 28px; background: white; border: 0"
        >
          <span>Thông tin tài sản</span>
          <span class="fa-btn" @click="AddFixedAsset"
            ><i class="fa fa-plus"></i
          ></span>
        </div>
        <div style="flex: 1">
          <TablePaging
            :model="tp_assets"
            ref="tp_assets"
            style="margin: 0 -5px"
          >
            <template slot="column-content-expand" slot-scope="{ index }">
              <div>
                <FormInfo
                  :model="obj.Fixed_Assets[index].form()"
                  :style="{
                    width: 'calc(100vw - 420px)',
                    'margin-left': detail_scroll_left + 5 + 'px',
                  }"
                />
              </div>
            </template>
            <template slot="column-content-Code" slot-scope="{ index }">
              {{ obj.Fixed_Assets[index].Code }}
            </template>
            <template slot="column-content-Serial" slot-scope="{ index }">
              {{ obj.Fixed_Assets[index].Serial }}
            </template>
          </TablePaging>
        </div>
      </div>
    </div>
    <DefaultForm :model="form_detail" @actionOK="AddItems">
      <div slot="content" style="height: 400px">
        <TablePaging :model="tp_detail" ref="tp_detail">
          <template slot="column-content-QuantityInput" slot-scope="{ row }">
            <ValidatePR
              v-if="row.Quantity > 0"
              :baseValue="row.QuantityInput"
              :validator="
                () =>
                  row.QuantityInput > row.Quantity
                    ? 'Enter more than allowed'
                    : ''
              "
              ref="Date_Request"
            >
              <div
                style="
                  display: flex;
                  white-space: nowrap;
                  align-items: baseline;
                "
              >
                <InputNumber
                  v-model="row.QuantityInput"
                  :disabled="row.Quantity == 0"
                  style="flex: 1"
                />
                <div style="flex: 1">&nbsp;/ {{ row.Quantity }}</div>
              </div>
            </ValidatePR>
            <div v-else>It's done</div>
          </template>
        </TablePaging>
      </div>
    </DefaultForm>
  </div>
</template>

<script>
import APIHelper from "~/assets/scripts/API/APIHelper";
import DefaultForm from "~/assets/scripts/base/DefaultForm";
import TablePaging from "~/assets/scripts/base/TablePaging";
import TablePagingCol from "~/assets/scripts/base/TablePagingCol";
import { ShowMessage } from "~/assets/scripts/Functions";
import fixed_assets from "~/assets/scripts/objects/fixed_assets/fixed_assets";
import add_ware_house from "~/assets/scripts/objects/warehouse/add_ware_house";
import { Para } from "~/assets/scripts/Para";
import ConvertStr from "~/assets/scripts/ConvertStr";
export default {
  data() {
    return {
      itv: null,
      detail_scroll_left: 0,
      iSearchInfo: "",
      obj: new add_ware_house({}),
      form: new DefaultForm({
        title: "Add New Receipt",
        visible: true,
      }),
      pr_detail: null,
      form_detail: new DefaultForm({
        title: "Pick assets",
        width: "1000px",
        OKtext: "Confirm",
      }),
      tp_detail: new TablePaging({
        disablePaging: true,
        disableSelectRow: true,
        LoadDataSuccess: (re) => {
          re.forEach((p) => {
            p.Quantity =
              p.Quantity -
              p.Qty_Store -
              this.obj.Fixed_Assets.filter((p1) => p1.Order_detail_id == p.Id)
                .length;
            p.QuantityInput = p.Quantity;
          });
        },
        cols: [
          new TablePagingCol({
            title: "#",
            data: "SttTP",
            min_width: 50,
            sortable: false,
          }),
          new TablePagingCol({
            title: "Descriptions",
            data: "Description",
            min_width: 200,
            width: "auto",
            sortable: false,
          }),
          new TablePagingCol({
            title: "Quantity",
            data: "QuantityInput",
            min_width: 100,
            sortable: false,
          }),
          new TablePagingCol({
            title:  "Mã dự án",
            data: "Project_code",
            min_width: 130,
            sortable: false,
          }),
          new TablePagingCol({
            title: "Loại",
            data: "Type_id",
            min_width: 150,
            sortable: false,
            formatter: (value) => Para.fixed_asset_type_Get_List.getName(value),
          }),
          new TablePagingCol({
            title: "Nhà sản xuất",
            data: "Producer_id",
            min_width: 150,
            sortable: false,
            formatter: (value) => Para.producer_Get_List.getName(value),
          }),
          new TablePagingCol({
            title: "Model",
            data: "Model",
            min_width: 150,
            sortable: false,
          }),
        ],
      }),
      tp_assets: new TablePaging({
        disablePaging: true,
        disableSelectRow: true,
        clickRow: (row, column, event) => {
          let check =
            this.$refs.tp_assets.$refs.tpRef.store.states.expandRows.filter(
              (p) => p == row
            ).length;
          this.$refs.tp_assets.$refs.tpRef.store.states.expandRows = [];
          if (!check) this.$refs.tp_assets.$refs.tpRef.toggleRowExpansion(row);
          // console.log(this, row, column, event);
        },
        cols: [
          new TablePagingCol({
            type: "expand",
            min_width: 50,
            data: "expand",
            sortable: false,
          }),
          new TablePagingCol({
            title: "#",
            data: "SttTP",
            min_width: 50,
            sortable: false,
          }),

          new TablePagingCol({
            title: "Mã tài sản",
            data: "Code",
            min_width: 150,
            sortable: false,
          }),
          new TablePagingCol({
            title: "Serial",
            data: "Serial",
            min_width: 150,
            sortable: false,
          }),
          new TablePagingCol({
            title: "Detailed Descriptions",
            data: "Name",
            min_width: 200,
            width: "auto",
            sortable: false,
          }),
          new TablePagingCol({
            title:  "Mã dự án",
            data: "Project_Code",
            min_width: 130,
            sortable: false,
          }),
          new TablePagingCol({
            title: "Loại",
            data: "Type_id",
            min_width: 150,
            sortable: false,
            formatter: (value) => Para.fixed_asset_type_Get_List.getName(value),
          }),
          new TablePagingCol({
            title: "Nhà sản xuất",
            data: "Producer_id",
            min_width: 150,
            sortable: false,
            formatter: (value) => Para.producer_Get_List.getName(value),
          }),
          new TablePagingCol({
            title: "Model",
            data: "Model",
            min_width: 150,
            sortable: false,
          }),
        ],
        data: [],
      }),
      data: [],
      isFirst: false,
    };
  },
  watch: {
    "obj.Ware_house.Order_id"(newValue, oldValue) {
      console.log(newValue, oldValue);
      if (this.obj.Ware_house.Order_id) {
        if (!this.isFirst) {
          APIHelper.purchase
            .GetInfo({
              pr_id: this.obj.Ware_house.Order_id,
            })
            .then((re) => {
              this.pr_detail = re;
              this.tp_detail.data = re.Details;
              this.form_detail.visible = true;
              // this.$refs.tp_detail.LoadData(true);
            });
        } else {
          this.isFirst = false;
        }
      } else {
        this.pr_detail = null;
      }
    },
    // 'iSearchInfo'(newvl) {
    //   console.log(newvl)
    // },
  },
  methods: {
    SelectReceipt({ Id }) {
      APIHelper.ware_house
        .GetDetail({
          id: Id,
        })
        .then((re) => {
          this.Add(re);
        });
    },
    LoadData() {
      APIHelper.ware_house.GetList().then((re) => {
        this.data = re;
      });
    },
    AddItems() {
      console.log(this.$refs.tp_detail.rawData);
      this.$refs.tp_detail.rawData.forEach((p) => {
        for (let i = 0; i < p.QuantityInput; i++) {
          this.obj.Fixed_Assets.push(
            new fixed_assets({
              Order_detail_id: p.Id,
              Model: p.Model,
              Name: p.Description,
              Unit_cost: p.Unit_Cost,
              Type_id: p.Type_id,
              Producer_id: p.Producer_id,
              Currency_Code: this.pr_detail.Info.Money_code,
              Currency_VND:
                this.pr_detail.Info.Money_code == "VND" ? p.Unit_Cost : "",
              Project_Code: p.Project_code,
            })
          );
        }
      });

      this.tp_assets.data = this.obj.Fixed_Assets;
      this.$refs.tp_assets.LoadData(true);
      this.form_detail.visible = false;
    },
    Add(re) {
      this.Exit();
      this.$nextTick(() => {
        this.obj = new add_ware_house(re);
        this.tp_assets.data = this.obj.Fixed_Assets;
        this.form.title = re ? "Edit Receipt" : "Add New Receipt";
        if (re) this.isFirst = true;
        else this.isFirst = false;

        if (re) {
          APIHelper.purchase
            .GetInfo({
              pr_id: this.obj.Ware_house.Order_id,
            })
            .then((re) => {
              this.pr_detail = re;
              this.tp_detail.data = re.Details;
              // this.$refs.tp_detail.LoadData(true);
            });
        }

        this.form.visible = true;
      });
    },
    Exit() {
      this.form.visible = false;
    },
    getValidate() {
      return new Promise((rs) => {
        return Promise.all([this.$refs.form_Ware_house.getValidate()]).then(
          (re) => {
            rs(re.every((p) => p));
          }
        );
      });
    },
    Save() {
      this.getValidate().then((re) => {
        if (re) {
          this.obj.Fixed_Assets.forEach((p) => {
            p.Initial_Holder_id = this.obj.Ware_house.Store_id;
            p.Initial_Holder_Name = this.$refs.form_Ware_house.getEntry(
              this.obj.Ware_house._formElements.Store_id.id
            ).selectedData.Name;
          });

          // console.log(this.obj.toJSON());
          // this.obj.

          if (this.obj.Ware_house.Id) {
            APIHelper.ware_house.Edit(this.obj.toJSON()).then((re) => {
              this.LoadData();
              this.SelectReceipt({
                Id: this.obj.Ware_house.Id,
              });
            });
          } else {
            APIHelper.ware_house.Add(this.obj.toJSON()).then((re) => {
              this.LoadData();
              this.SelectReceipt({
                Id: re,
              });
            });
          }
        } else {
          ShowMessage("Please complete all information", "error");
        }
      });
    },
    AddFixedAsset() {
      this.form_detail.visible = true;
    },
  },
  computed: {
    Data_PR_List() {
      return this.data.filter((p) => {
        return (
          p.Order_serial.toLowerCase().includes(
            this.iSearchInfo.toLowerCase()
          ) ||
          ConvertStr.ToDateStr(p.DateActive, "DD, MMMM YYYY hh:MM A")
            .toLowerCase()
            .includes(this.iSearchInfo.toLowerCase())
        );
      });
    },
  },
  mounted() {
    console.log(this);
    this.LoadData();
    this.itv = setInterval(() => {
      this.detail_scroll_left =
        this.$refs.tp_assets.$refs.tpRef.$refs.bodyWrapper.scrollLeft;
    }, 50);
  },
  beforeDestroy() {
    clearInterval(this.itv);
  },
};
</script>

<style lang="scss" scoped>
.wh-c {
  height: 100%;
  display: flex;
  padding: 10px;

  .wh-left {
    flex: 0 0 270px;
    // border: 1px solid #ddd;
    // border-radius: 4px;
    margin-right: 10px;
    display: flex;
    flex-direction: column;
    // padding: 5px;
    .wh-left-title {
      // background: #f0f0f0;
      padding: 10px;
      position: relative;
      span {
        font-weight: 600;
      }
      i {
        position: absolute;
        height: 100%;
        top: 0;
        right: 0;
        width: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        &:hover {
          background: #f0f0f0;
        }
      }
    }
    .wh-left-filter {
      display: flex;
      ::v-deep  button {
        padding: 0;
        width: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0;
        // border-left: none;
        border-right: none;
      }
      ::v-deep  input {
        // border-left: none;
        // border-right: none;
        border-radius: 0;
        padding: 0 10px;
        padding-left: 11px;
        margin-left: 0px;
        // width: calc(100% + 1px);
        border-left: 0;
        border-right: 0;
      }
    }
    ::v-deep  .wh-left-list {
      overflow-x: hidden;
      .wh-left-item {
        padding: 10px;
        // border-bottom: 1px solid #ddd;
        cursor: pointer;
        &:hover,
        &.active {
          background: #f0f0f0;
        }
      }
    }
  }
  .wh-right {
    flex: 1;
    border-left: 1px solid #ddd;
    // border-radius: 4px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .wh-right-title {
      // background: #f0f0f0;
      padding: 10px;
      position: relative;
      // border-bottom: 1px solid #ddd;
      display: flex;
      justify-content: space-between;
      .btns {
        position: absolute;
        top: 6px;
        right: 10px;
        display: flex;
        button {
          padding: 5px 10px;
        }
        .el-button + .el-button {
          margin-left: 5px;
        }
      }
      span {
        font-weight: 600;
      }
    }
    ::v-deep  .wh-right-content {
      overflow: hidden;
      display: flex;
      flex-direction: column;
      .fa-btn {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        width: 26px;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover {
          background: white;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
