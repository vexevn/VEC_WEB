<template>
  <div class="wh-c">
    <div class="wh-left">
      <div class="wh-left-title">
        <span>Danh sách thanh lý</span>
        <i class="fa fa-plus" @click="Add()"></i>
      </div>
      <div class="wh-left-filter">
        <el-input
          v-model="iSearchInfo"
          @change="Searching"
          placeholder="Tìm kiếm..."
        />
        <!-- <el-button><i class="fa fa-search"></i></el-button> -->
      </div>
      <el-scrollbar wrap-class="wh-left-list" style="flex: 1">
        <div
          class="wh-left-item"
          v-for="item in filteredData"
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
                  <b># {{ item.Serial }}</b>
                </div>
                <div
                  style="
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  "
                >
                  <b>{{ ConvertStr.ToMoneyStr(item.TotalMoney) }}</b>
                </div>
              </div>

              <div style="display: flex">
                <div>
                  {{
                    ConvertStr.ToDateStr(item.DateActive, "DD/MM/yyyy hh:MM A")
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div class="wh-right" v-if="form.visible">
      <div style="height: 100%; overflow: auto">
        <div class="wh-right-title" style="padding-bottom: 0px">
          <span> {{ form.title }} </span>
          <div class="btns">
            <el-button type="primary" @click="Save">
              <i class="fa fa-save"></i> &nbsp; Lưu
            </el-button>
            <el-button type="danger" @click="Exit">
              <i class="fa fa-times"></i> &nbsp; Thoát
            </el-button>
          </div>
        </div>
        <div class="wh-right-content" style="flex: 1; padding: 10px">
          <FormInfo :model="obj.Info.form()" ref="form_Disposal" />
          <div
            class="form-title"
            style="
              margin-top: 5px;
              flex: 0 0 28px;
              background: white;
              border: 0px;
              padding: 4px 0;
              font-weight: 500;
            "
          >
            <span>Thông tin tài sản</span>
            <span class="fa-btn" @click="AddFixedAsset"
              ><i class="fa fa-plus"></i
            ></span>
          </div>
          <div>
            <TablePaging
              :model="tp_assets"
              ref="tp_assets"
              style="margin: 0 -5px"
            >
              <template slot="column-content-btn" slot-scope="{ row }">
                <div style="text-align: center" @click="RemoveFA(row)">
                  <i
                    class="fa fa-times"
                    style="color: red; cursor: pointer"
                  ></i>
                </div>
              </template>
            </TablePaging>
          </div>
          <div
            class="form-title"
            style="
              margin-top: 5px;
              flex: 0 0 28px;
              background: white;
              border: 0px;
              padding: 4px 0;
              font-weight: 500;
            "
          >
            <span>Nhà cung cấp</span>
          </div>
          <table class="tbl-vendor pf_form" cellspacing="0" cellpadding="0">
            <tr data-v-6d63258d="">
              <th width="50">#</th>
              <th style="width: 450px">Tên đầy đủ</th>
              <th style="width: 200px">Số đăng ký/Số ID</th>
              <th style="width: 150px">Người liên hệ</th>
              <th style="width: 150px">Email</th>
              <th style="width: 160px">Số điện thoại</th>
              <th width="120">Đính kèm</th>
              <th width="120">Lựa chọn</th>
              <th width="50"></th>
            </tr>
            <ProcurementVendorForm
              v-for="(item, index) in vendor_tmp_picked"
              :key="item.IdTmp"
              :index="index"
              :vendor_state_tmp="vendor_state_tmp"
              :item="item"
              ref="vendor_form"
              @vendorRemove="vendorRemove"
            />

            <tr>
              <td>
                <el-button
                  class="icon-btn"
                  type="primary"
                  @click="handleVendorPicked(true)"
                  ><i class="fa fa-plus"></i
                ></el-button>
              </td>
              <td colspan="10">
                <InputSelect
                  v-if="isvendor"
                  :model="vendor_tmp"
                  v-model="vendor_tmp_selected"
                  style="width: 100%"
                  ref="vendor_tmp_selected"
                  @change="handleVendorPicked"
                />
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <DefaultForm :model="form_detail" @actionOK="ReloadFA">
      <div slot="content" style="height: 400px">
        <TablePaging :model="tp_detail" ref="tp_detail">
          <template slot="column-content-CheckBox" slot-scope="{ row }">
            <el-checkbox v-model="row.CheckBox" style="pointer-events: none" />
          </template>
        </TablePaging>
      </div>
    </DefaultForm>
  </div>
</template>

<script>
import API from "~/assets/scripts/API";
import APIHelper from "~/assets/scripts/API/APIHelper";
import DefaultForm from "~/assets/scripts/base/DefaultForm";
import { SelectOption } from "~/assets/scripts/base/SelectOption";
import TablePaging from "~/assets/scripts/base/TablePaging";
import TablePagingCol from "~/assets/scripts/base/TablePagingCol";
import ConvertStr from "~/assets/scripts/ConvertStr";
import {
  GetGlobalId,
  objContainStr,
  ShowMessage,
  Uni2None,
} from "~/assets/scripts/Functions";
import GetDataAPI from "~/assets/scripts/GetDataAPI";
import AddDisposal from "~/assets/scripts/objects/disposal/add_disposal";
import DisposalVendors from "~/assets/scripts/objects/disposal/disposal_vendors";
import { Para } from "~/assets/scripts/Para";
export default {
  data() {
    return {
      itv: null,
      detail_scroll_left: 0,
      iSearchInfo: "",
      obj: new AddDisposal({}),
      form: new DefaultForm({
        title: "Thông tin mới về tài sản thanh lý",
        visible: true,
      }),
      pr_detail: null,
      form_detail: new DefaultForm({
        title: "Chọn tài sản",
        width: "1000px",
        // OKtext: "Xác nhận",
      }),
      tp_detail: new TablePaging({
        // disablePaging: true,
        disableSelectRow: true,
        LoadDataSuccess: (re) => {
          re.forEach((p) => {
            p.CheckBox = this.obj.FA_Id_Lists.some((p1) => p1 == p.Id);
          });
        },
        clickRow: (row) => {
          // row.CheckBox = !row.CheckBox;
          this.CheckItem(row);
        },
        cols: [
          new TablePagingCol({
            title: "#",
            data: "SttTP",
            min_width: 50,
            sortable: false,
          }),
          new TablePagingCol({
            title: "",
            data: "CheckBox",
            min_width: 50,
            sortable: false,
          }),
          new TablePagingCol({
            title: "Tên",
            data: "Name",
            min_width: 200,
            width: "auto",
            sortable: false,
          }),

          // new TablePagingCol({
          //   title: "Số hợp đồng",
          //   data: "Project_Code",
          //   min_width: 130,
          //   sortable: false,
          // }),
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
            title: "Chủng loại",
            data: "Model",
            min_width: 150,
            sortable: false,
          }),
        ],
      }),
      tp_assets: new TablePaging({
        disablePaging: true,
        disableSelectRow: true,
        disableFixedHead: true,
        cols: [
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
            title: "Số Serial",
            data: "Serial",
            min_width: 150,
            sortable: false,
          }),
          new TablePagingCol({
            title: "Mô tả chi tiết",
            data: "Name",
            min_width: 150,
            width: "auto",
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
            title: "Chủng loại",
            data: "Model",
            min_width: 150,
            sortable: false,
          }),
          new TablePagingCol({
            title: "",
            data: "btn",
            min_width: 50,
            sortable: false,
            fix: "right",
          }),
        ],
        data: [],
      }),
      data: [],
      isFirst: false,

      vendor_tmp_selected: "",
      vendor_tmp_picked: [],
      isvendor: false,
      vendor_state_tmp: new SelectOption({
        data: [
          { Id: 1, Name: "Có" },
          { Id: 2, Name: "Không" },
        ],

        IsItemDisabled: (data) => {
          return this.vendor_tmp_picked.some(
            (p) => p.State == data.Id && p.State == 1
          );
        },
      }),
      vendor_tmp: new SelectOption({
        allowCreate: true,
        IsItemDisabled: (data) => {
          // console.log(data, this.vendor_tmp_picked);
          return this.vendor_tmp_picked.some((p) => p.vendor_id == data.Id);
        },
        placeholder: "Chọn nhà cung cấp...",
        key: "IdTmp",
        data: [],
      }),
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
  },

  computed: {
    filteredData() {
      const search = this.iSearchInfo.toLowerCase();
      return this.data.filter(
        (item) =>
          (item.Serial||'').toLowerCase().includes(search) ||
          ConvertStr.ToMoneyStr(item.TotalMoney).toLowerCase().includes(search) ||
          ConvertStr.ToDateStr(item.DateActive, "DD/MM/yyyy hh:MM A").toLowerCase().includes(search)
      );
    },
  },
  methods: {
    // Searching() {
    //   console.log(this.iSearchInfo);
    // },

    RemoveFA(item) {
      let find = this.obj.FA_Id_Lists.findIndex((p) => p.Id == p);
      this.obj.FA_Id_Lists.splice(find, 1);
      this.ReloadFA();
    },
    vendorRemove(item) {
      this.vendor_tmp_picked.splice(this.vendor_tmp_picked.indexOf(item), 1);
    },
    GetdataVendors() {
      this.isvendor = false;
      GetDataAPI({
        url: API.Get_List_Vendors,
        action: (re) => {
          let data = re;
          data.forEach((p) => {
            p.IdTmp = GetGlobalId();
          });
          this.vendor_tmp.data = data;
          this.isvendor = true;
        },
      });
    },
    handleVendorPicked(isAdd) {
      if (this.$refs.vendor_tmp_selected.selectedData) {
        this.vendor_tmp_picked.push(
          new DisposalVendors({
            ContactEmail:
              this.$refs.vendor_tmp_selected.selectedData.ContactEmail,
            ContactName:
              this.$refs.vendor_tmp_selected.selectedData.ContactName,
            ContactPhone:
              this.$refs.vendor_tmp_selected.selectedData.ContactPhone,
            Serial: this.$refs.vendor_tmp_selected.selectedData.Serial,
            vendor_id: this.$refs.vendor_tmp_selected.selectedData.Id,
            Name: this.$refs.vendor_tmp_selected.selectedData.Name,
          })
        );
      } else {
        if (this.vendor_tmp_selected || isAdd) {
          let obj = {
            Id: 0,
            IdTmp: GetGlobalId(),
            Name: this.vendor_tmp_selected,
            Serial: "",
            ContactName: "",
            State: "",
          };
          this.vendor_tmp_picked.push(obj);
          setTimeout(() => {
            document.getElementById(obj.IdTmp).focus();
          }, 0);
        }
      }
      this.vendor_tmp_selected = "";
    },
    CheckItem(item) {
      item.CheckBox = !item.CheckBox;
      let find = this.obj.FA_Id_Lists.filter((p) => p == item.Id)[0];
      if (item.CheckBox) {
        if (!find) this.obj.FA_Id_Lists.push(item.Id);
      } else {
        if (find)
          this.obj.FA_Id_Lists.splice(this.obj.FA_Id_Lists.indexOf(item.Id), 1);
      }
    },
    SelectReceipt({ Id }) {
      APIHelper.disposal
        .GetDetail({
          Id: Id,
        })
        .then((re) => {
          this.Add(re);
        });
    },
    LoadData() {
      APIHelper.disposal.GetList().then((re) => {
        this.data = re;
      });
      GetDataAPI({
        url: API.Get_Fixed_Denghi_thanhly,
        action: (re) => {
          console.log(re);
        },
      });
    },
    ReloadFA() {
      console.log(this.obj.FA_Id_Lists);
      // console.log(this.$refs.tp_detail.rawData);
      // this.$refs.tp_detail.rawData.forEach((p) => {
      //   for (let i = 0; i < p.QuantityInput; i++) {
      //     this.obj.Fixed_Assets.push(
      //       new fixed_assets({
      //         Order_detail_id: p.Id,
      //         Model: p.Model,
      //         Name: p.Description,
      //         Unit_cost: p.Unit_Cost,
      //         Type_id: p.Type_id,
      //         Producer_id: p.Producer_id,
      //         Currency_Code: this.pr_detail.Info.Money_code,
      //         Currency_VND:
      //           this.pr_detail.Info.Money_code == "VND" ? p.Unit_Cost : "",
      //         Project_Code: p.Project_code,
      //       })
      //     );
      //   }
      // });

      APIHelper.fixed_asset
        .Get_List_By_Ids({
          Ids: this.obj.FA_Id_Lists,
        })
        .then((re) => {
          this.tp_assets.data = re;
          this.$refs.tp_assets.LoadData(true);
          this.form_detail.visible = false;
        });
    },
    Add(re) {
      this.Exit();
      this.$nextTick(() => {
        this.obj = new AddDisposal(re);
        if (re) this.tp_assets.data = re.Details;
        else this.tp_assets.data = [];
        this.vendor_tmp_picked = this.obj.Vendors || [];
        this.form.title = re
          ? "Sửa thông tin về tài sản thanh lý "
          : "Thông tin mới về tài sản thanh lý";
        if (re) this.isFirst = true;
        else this.isFirst = false;

        if (re) {
        }

        this.form.visible = true;
      });
    },
    Exit() {
      this.form.visible = false;
    },
    getValidate() {
      return new Promise((rs) => {
        return Promise.all([this.$refs.form_Disposal.getValidate()]).then(
          (re) => {
            rs(re.every((p) => p));
          }
        );
      });
    },
    Save() {
      this.getValidate().then((re) => {
        if (re) {
          this.obj.Vendors = this.vendor_tmp_picked;
          let file_stuff = [];

          let file_stuff1 = new Promise((rs) => {
            this.$refs.form_Disposal
              .getEntry(this.obj.Info._formElements.FileAttach.id)
              .submitUpload()
              .then((re) => {
                this.obj.Info.FileAttach = re.join(",");
                rs();
              });
          });
          file_stuff.push(file_stuff1);

          if (this.$refs.vendor_form) {
            file_stuff.push(
              ...this.$refs.vendor_form.map((p) => p.submitUpload())
            );
          }

          Promise.all(file_stuff).then((results) => {
            if (this.obj.Info.Id) {
              APIHelper.disposal.Edit(this.obj.toJSON()).then((re) => {
                this.LoadData();
                this.SelectReceipt({
                  Id: this.obj.Info.Id,
                });
              });
            } else {
              APIHelper.disposal.Add(this.obj.toJSON()).then((re) => {
                this.LoadData();
                this.SelectReceipt({
                  Id: re,
                });
              });
            }
          });
        } else {
          ShowMessage("Please complete all information", "error");
        }
      });
    },
    AddFixedAsset() {
      APIHelper.fixed_asset
        .Get_List_In_Warehouse({
          iDisposal_id: this.obj.Info.Id || 0,
        })
        .then((re) => {
          this.tp_detail.data = re;
          this.form_detail.visible = true;
        });
    },
  },
  mounted() {
    console.log(this);
    this.LoadData();
    this.GetdataVendors();

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
    flex: 0 0 270px; // border: 1px solid #ddd;
    // border-radius: 4px;
    margin-right: 10px;
    display: flex;
    flex-direction: column; // padding: 5px;
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
      ::v-deep button {
        padding: 0;
        width: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0; // border-left: none;
        border-right: none;
      }
      ::v-deep input {
        // border-left: none;
        // border-right: none;
        border-radius: 0;
        padding: 0 10px;
        padding-left: 11px;
        margin-left: 0px; // width: calc(100% + 1px);
        border-left: 0;
        border-right: 0;
      }
    }
    ::v-deep .wh-left-list {
      overflow-x: hidden;
      .wh-left-item {
        padding: 10px; // border-bottom: 1px solid #ddd;
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
    border-left: 1px solid #ddd; // border-radius: 4px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .wh-right-title {
      // background: #f0f0f0;
      padding: 10px;
      position: relative; // border-bottom: 1px solid #ddd;
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
    ::v-deep .wh-right-content {
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

.pf_form {
  width: 100%;
  border-bottom: 1px solid #ddd;
  border-right: 1px solid #ddd;
  ::v-deep {
    td,
    th {
      padding: 10px;
      border-top: 1px solid #ddd;
      border-left: 0px solid #ddd;
      vertical-align: top;
    }
    tr {
      td {
        &:first-child {
          text-align: center;
        }
      }
    }
    input {
      padding: 0;
      border: 0;
      border-bottom: 1px solid #ddd;
    }
  }
}

.tbl-vendor {
  width: 100%;
  border-bottom: 1px solid #ddd;
  border-right: 1px solid #ddd;
  tr {
    &[role="1"] {
      color: blue;
      ::v-deep input {
        color: blue;
      }
    }
  }
  th {
    color: #2a4b69;
    background: #efefef;
    padding: 10px 10px !important;
  }
  td,
  th {
    padding: 4px 8px;
    border-top: 1px solid #ddd;
    border-left: 0px solid #ddd;
    text-align: left;
  }
}
</style>
