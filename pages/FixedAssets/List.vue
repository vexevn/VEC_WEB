S
<template>
  <div style="height: 100%; display: flex">
    <div v-if="!isIndividual" style="padding: 5px 0 0 5px; height: 100%">
      <Office ref="of" @asChange="handleASChange" :obj="tp.params" />
    </div>
    <div style="width: 100%; height: 100%; overflow: auto">
      <TablePaging ref="tp" :model="tp">
        <!-- <template v-if="!isIndividual" slot="btn">
          <el-button
            style="
              height: 25px;
              width: 25px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 5px;
            "
            @click="showFilter()"
          >
            <i class="fa fa-filter"></i>
          </el-button>

        </template> -->

        <template slot="column-header-button">
          <el-button
            class="icon-btn icon-btn"
            v-if="pagePermission.add"
            type="primary"
            @click="Add()"
          >
            <i class="el-icon-plus"></i
          ></el-button>
        </template>
        <template slot="column-content-button" slot-scope="{ row }">
          <div style="display: flex">
            <template v-if="isIndividual">
              <el-tooltip content="Gọi hỗ trợ" :enterable="false">
                <el-button
                  v-if="row.State == 1 || row.State == 3"
                  class="icon-btn"
                  type="primary"
                  @click="CreateTicket(row)"
                >
                  <i class="fa fa-ticket"></i
                ></el-button>
              </el-tooltip>

              <el-tooltip
                class="item"
                effect="dark"
                content="Xác nhận chuyển"
                placement="top"
              >
                <el-button
                  v-if="row.State == 2"
                  class="icon-btn"
                  type="primary"
                  @click="TransferApproved(row)"
                >
                  <i class="fa fa-check"></i
                ></el-button>
              </el-tooltip>
            </template>

            <template v-if="!isIndividual">
              <el-tooltip
                class="item"
                effect="dark"
                content="Sửa chữa tài sản"
                placement="top"
              >
                <el-button
                  class="icon-btn"
                  type="primary"
                  @click="RequestInventory(row)"
                >
                  <i class="fa fa-wrench"></i
                ></el-button>
              </el-tooltip>

              <el-tooltip
                class="item"
                effect="dark"
                content="Thay đổi vị trí"
                placement="top"
              >
                <el-button
                  class="icon-btn"
                  type="primary"
                  @click="Transfer(row)"
                  :disabled="row.State == 3"
                >
                  <i class="fa fa-exchange"></i>
                </el-button>
              </el-tooltip>

              <el-tooltip
                class="item"
                effect="dark"
                content="Sửa tài sản cố định"
                placement="top"
              >
                <el-button
                  v-if="pagePermission.edit"
                  class="icon-btn"
                  type="primary"
                  @click="Edit(row)"
                >
                  <i class="el-icon-edit"></i
                ></el-button>
              </el-tooltip>

              <el-button
                v-if="pagePermission.delete"
                class="icon-btn"
                type="danger"
                @click="Delete(row)"
              >
                <i class="el-icon-delete"></i>
              </el-button>
            </template>
          </div>
        </template>
        <template slot="column-content-Name" slot-scope="{ row }">
          <span class="name-link" @click="ViewAssets(row)">
            {{ row.Name }}
          </span>
        </template>
        <template slot="column-content-Maintenance" slot-scope="{ row }">
          <span v-if="row.Maintenance"> Có </span>
          <span v-else> Không </span>
        </template>
        <template slot="column-content-Note" slot-scope="{ row }">
          <div class="Note-cell">
            {{ row.Note }}
          </div>
        </template>
      </TablePaging>
    </div>

    <DefaultForm :model="formTicket" @actionOK="formTicket.Save.call(this)">
      <div slot="content">
        <FormInfo :model="form.obj.formView()" style="margin-bottom: 10px" />
        <FormInfo ref="form" :model="formTicket.obj.form()" />
      </div>
    </DefaultForm>
    <DefaultForm :model="form" @actionOK="form.Save.call(this)">
      <div style="" slot="content">
        <FormInfo
          ref="form"
          :model="form.obj.form2()"
          :disabled="form.viewOnly"
        />
      </div>
    </DefaultForm>

    <DefaultForm
      :model="form_transfer"
      @actionOK="form_transfer.Save.call(this)"
    >
      <div slot="content">
        <FormInfo :model="form.obj.formView()" style="margin-bottom: 5px" />
        <FormInfo ref="form" :model="form_transfer.obj.form()" />
      </div>
    </DefaultForm>
    <!-- <DefaultForm :model="formFilter" @actionOK="Search()">
      <div slot="content">
        <FormInfo :model="filter.form()" />
      </div>
    </DefaultForm> -->
    <DefaultForm :model="formInventory" @actionOK="AddInventory()">
      <div slot="content">
        <FormInfo ref="form" :model="formInventory.obj.form()" />
      </div>
    </DefaultForm>
    <DefaultForm :model="formConfirmTransfer">
      <div slot="content">
        <div
          data-v-39db714f=""
          style="margin-bottom: 20px; display: flex; align-items: center"
        >
          <div
            data-v-39db714f=""
            class="el-icon-info"
            style="font-size: 24px; margin-right: 7px; color: #909399"
          ></div>
          This item is delivered to you
        </div>
        <div style="display: flex; justify-content: flex-end">
          <el-button type="success" @click="TransferApprovedProcess(1)"
            >Agree</el-button
          >
          <el-button type="danger" @click="TransferApprovedProcess(2)"
            >Refuse</el-button
          >
          <el-button @click="formConfirmTransfer.visible = false"
            >Cancel</el-button
          >
        </div>
      </div>
    </DefaultForm>
    <!-- <DefaultForm
      :model="formChooseFile"
      @actionOK="formChooseFile.Save.call(this)"
    >
      <div slot="content">
        <div
          style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            column-gap: 5px;
            row-gap: 5px;
          "
        >
          <div style="border-radius: 2px; overflow: hidden">
            <el-button @click="PickFile()" type="primary">
              <p>{{ fileName }}</p></el-button
            >
          </div>

          <input
            type="file"
            @change="displayFileName"
            ref="file"
            style="display: none"
          />
          <div>
            <InputContainer
              class="date"
              label="Sheet"
              :labelWidth="120"
              :required="true"
            >
              <el-input-number
                style="width: 100%"
                v-model="sheet"
                controls-position="right"
                size="mini"
                :min="1"
                placeholder="All sheet"
              ></el-input-number
            ></InputContainer>
          </div>
          <div></div>
          <div>
            <FormInfo
              ref="typeFA"
              :model="typeFA.form()"
              v-once
              style="width: 100%"
            />
          </div>
        </div>
      </div>
    </DefaultForm> -->
  </div>
</template>

<script>
import API from "~/assets/scripts/API";
import TablePaging from "~/assets/scripts/base/TablePaging";
import TablePagingCol from "~/assets/scripts/base/TablePagingCol";
import DefaultForm from "~/assets/scripts/base/DefaultForm";
import { EventBus } from "~/assets/scripts/EventBus.js";
import GetDataAPI from "~/assets/scripts/GetDataAPI";
import {
  addMonth,
  GetStartMonth,
  GetTimeNow,
  MessageType,
  ShowConfirm,
  ShowMessage,
} from "~/assets/scripts/Functions";
import { Para } from "~/assets/scripts/Para";
import APIHelper from "~/assets/scripts/API/APIHelper";
import fixed_assets from "~/assets/scripts/objects/fixed_assets/fixed_assets";
import Fixed_Asset_Transfer from "~/assets/scripts/objects/Fixed_Asset_Transfer";
import Tickets from "~/assets/scripts/objects/Tickets";
import fixed_asets_filter from "~/assets/scripts/objects/fixed_assets/fixed_asets_filter";
import Fixed_Asset_Fix from "~/assets/scripts/objects/Fixed_Asset_Fix";

import Office from "./Office.vue";
import { objContainStr, Uni2None } from "~/assets/scripts/Functions";
import ConvertStr from "~/assets/scripts/ConvertStr";
export default {
  props: {
    isIndividual: {},
  },
  components: {
    Office,
  },
  data() {
    return {
      isAdd: null,
      // fileName: "Choose File",
      // sheet: null,

      tp: new TablePaging({
        title: "Danh sách tài sản",
        data: [],
        disableSelectRow: true,
        params: {
          From: "",
          To: "",
          Office_id: 0,
          Project_Code: "",
          State: 0,
          Type: "",
          User_ID: "",
          Department_id: 0,
          Group_id: 0,
          Use_Type_id: 0,
        },
        cols: this.isIndividual
          ? [
              new TablePagingCol({
                title: "Mã tài sản",
                data: "Code",
                min_width: 150,
                sortable: false,
              }),
              new TablePagingCol({
                title: "Mô tả",
                data: "Name",
                min_width: 200,
                width: "auto",
                sortable: false,
              }),
              new TablePagingCol({
                title: "Ngày tính bảo hành",
                data: "Purchase_Date",
                min_width: 150,
                sortable: false,
                formatter: "date",
              }),
              new TablePagingCol({
                title: "Ngày chuyển",
                data: "Curent_Date_Use",
                min_width: 150,
                sortable: false,
                formatter: "date",
              }),

              new TablePagingCol({
                title: "Thời hạn bảo hành",
                data: "Warranty_Period",
                min_width: 130,
                sortable: false,
                // formatter: "number",
                formatter: (value, row) => {
                  return row.Purchase_Date
                    ? ConvertStr.ToDateStr(addMonth(row.Purchase_Date, value))
                    : value;
                },
              }),
              new TablePagingCol({
                title: "Mã dự án",
                data: "Project_Code",
                min_width: 130,
                sortable: false,
              }),

              new TablePagingCol({
                title: "Ghi chú",
                data: "Note",
                min_width: 200,
                sortable: false,
              }),
              new TablePagingCol({
                title: "Tình trạng",
                data: "State",
                min_width: 150,
                sortable: false,
                formatter: (value) => Para.FixedAssetsState.getName(value),
                fix: "right",
              }),
              new TablePagingCol({
                title: "Xác nhận/Hỗ trợ",
                data: "button",
                min_width: 150,
                sortable: false,
                align: "right",
                fix: "right",
              }),
            ]
          : [
              new TablePagingCol({
                title: "Mã tài sản",
                data: "Code",
                min_width: 150,
                sortable: false,
              }),
              new TablePagingCol({
                title: "Tên tài sản",
                data: "Name",
                min_width: 200,
                width: "auto",
                sortable: false,
              }),
              new TablePagingCol({
                title: "Nhà sản xuất",
                data: "Producer_Name",
                min_width: 150,
                sortable: false,
              }),
              new TablePagingCol({
                title: "Chủng loại",
                data: "Model",
                min_width: 150,
                sortable: false,
              }),

              new TablePagingCol({
                title: "Serial",
                data: "Serial",
                min_width: 130,
                sortable: false,
              }),
              new TablePagingCol({
                title: "Ngày tính bảo hành",
                data: "Purchase_Date",
                min_width: 130,
                sortable: false,
                formatter: "date",
              }),

              // new TablePagingCol({
              //   // title: "Accounting voucher no./General ledger code",
              //   title: "Số chứng từ kế toán/Mã số sổ cái",
              //   data: "Invoice_code",
              //   min_width: 200,
              //   sortable: false,
              // }),
              // new TablePagingCol({
              //   title: "Unit Cost",
              //   data: "Unit_cost",
              //   min_width: 150,
              //   sortable: false,
              // }),
              // new TablePagingCol({
              //   title: "Qty",
              //   data: "Qty",
              //   min_width: 150,
              //   sortable: false,
              // }),
              // new TablePagingCol({
              //   title: "Total Value in purchase currency ",
              //   data: "Qty",
              //   min_width: 150,
              //   sortable: false,
              // }),
              // new TablePagingCol({
              //   title: "Total Value in local currency (VND)",
              //   data: "Qty",
              //   min_width: 150,
              //   sortable: false,
              // }),
              new TablePagingCol({
                title: "Vị trí",
                data: "Curent_Holder_Name",
                min_width: 150,
                sortable: false,
              }),
              new TablePagingCol({
                title: "Tình trạng tài sản",
                data: "Status",
                min_width: 150,
                sortable: false,
                formatter: (value) =>
                  Para.fixed_asset_state_Get_List.getName(value),
              }),
              // new TablePagingCol({
              //   title: "Initial Holder",
              //   data: "Initial_Holder_Name",
              //   min_width: 150,
              //   sortable: false,
              // }),
              // new TablePagingCol({
              //   title: "Current Holder",
              //   data: "Curent_Holder_Name",
              //   min_width: 150,
              //   sortable: false,
              // }),
              new TablePagingCol({
                title: "Mã dự án",
                data: "Project_Code",
                min_width: 150,
                sortable: false,
              }),
              new TablePagingCol({
                title: "Thời hạn bảo hành",
                data: "Warranty_Period",
                min_width: 150,
                sortable: false,
                formatter: (value, row) => {
                  return row.Purchase_Date
                    ? ConvertStr.ToDateStr(addMonth(row.Purchase_Date, value))
                    : value;
                },
              }),
              new TablePagingCol({
                title: "Bảo trì",
                data: "Maintenance",
                min_width: 150,
                sortable: false,
              }),
              new TablePagingCol({
                title: "Khấu hao dự kiến",
                data: "Estimated_Life_Min",
                min_width: 150,
                sortable: false,
                formatter: "number",
              }),
              // new TablePagingCol({
              //   title: "Date of Disposal",
              //   data: "Disposal_Date",
              //   min_width: 150,
              //   sortable: false,
              //   formatter: 'date'
              // }),
              new TablePagingCol({
                title: "Ghi chú",
                data: "Note",
                min_width: 250,
                sortable: false,
              }),
              new TablePagingCol({
                title: "",
                data: "button",
                min_width: 150,
                sortable: false,
                align: "right",
                fix: "right",
              }),
            ],
      }),
      form_transfer: new DefaultForm({
        obj: new Fixed_Asset_Transfer(),
        title: "",
        visible: false,
        width: "500px",
        /**
         * @param {fixed_assets} obj - description
         */
        ShowForm: (title, obj) => {
          this.form_transfer.title = title;
          this.form.obj = new fixed_assets(obj);
          this.form_transfer.obj = new Fixed_Asset_Transfer({
            Fixed_Asset_id: obj.Id,
            From_Holder_id: obj.Curent_Holder_Id || obj.Initial_Holder_id,
            From_Holder_Name: obj.Curent_Holder_Name || obj.Initial_Holder_Name,
            From_Type_id: obj.Use_Type_id,
            Start_Date: GetTimeNow(),
          });
          this.form_transfer.visible = true;
        },
        Save: () => {
          this.SaveTransfer();
        },
      }),
      formConfirmTransfer: new DefaultForm({
        type: "dialog",
        title: "Confirm",
        width: "400px",
      }),
      formTicket: new DefaultForm({
        obj: new Tickets(),
        title: "",
        visible: false,
        width: "500px",
        /**
         * @param {fixed_assets} obj - description
         */
        ShowForm: (title, obj) => {
          this.formTicket.title = title;
          this.form.obj = new fixed_assets(obj);
          this.formTicket.obj = new Tickets({
            Fixed_Asset_id: obj.Id,
          });
          this.formTicket.visible = true;
        },
        Save: () => {
          this.SaveTicket();
        },
      }),
      form: new DefaultForm({
        obj: new fixed_assets(),
        title: "",
        visible: false,
        fullscreen: true,
        // width: "1200px",
        ShowForm: (title, isAdd, obj, viewOnly) => {
          this.isAdd = isAdd;
          this.form.title = title;
          this.form.viewOnly = viewOnly;
          if (viewOnly) this.form.type = "dialog";
          else this.form.type = "";
          this.form.obj = new fixed_assets({
            ...obj,
            isAdd: isAdd,
          });
          if (this.form.obj.Use_Type_id !== 1) {
            this.form.obj.Curent_Holder_Id = Number(
              this.form.obj.Curent_Holder_Id
            );
          }
          this.form.visible = true;
        },
        Save: () => {
          this.Save();
        },
      }),
      formInventory: new DefaultForm({
        obj: new Fixed_Asset_Fix(),
        title: "",
        visible: false,
        width: "500px",
        ShowForm: (title, obj) => {
          this.formInventory.title = title;
          this.formInventory.obj = new Fixed_Asset_Fix({
            Fixed_Asset_id: obj.Id,
            FA_Code: obj.Code,
            FA_Name: obj.Name,
            // User_Use: obj.Curent_Holder_Id,
            // User_Name: obj.Curent_Holder_Name,
          });
          this.formInventory.visible = true;
        },
      }),
      filter: new fixed_asets_filter(),
      // formFilter: new DefaultForm({
      //   OKtext: "Tìm kiếm",
      //   // visible: true,
      //   // type: "dialog",
      //   width: "800px",
      //   title: "Lọc dữ liệu",
      // }),
    };
  },
  watch: {
    "tp.params": {
      deep: true,
      handler() {
        this.$nextTick(() => {
          // if (this.tp.params.Type || this.tp.params.User_ID) {
          //   this.tp.params.From = "";
          //   this.tp.params.To = "";
          // }
          console.log("aklc");
          this.LoadTable();
        });
      },
    },
  },
  methods: {
    LoadTable() {
      if (this.isIndividual) {
        APIHelper.fixed_asset.GetListIndividual().then((re) => {
          this.tp.data = re;
          this.$refs.tp.LoadData(true);
        });
      } else {
        GetDataAPI({
          url: API.fixed_asset_Get_List,
          // params: {
          //   From:
          //     this.tp.params.Type ||
          //     this.tp.params.User_ID ||
          //     this.tp.params.Office_id
          //       ? null
          //       : this.tp.params.From,
          //   To:
          //     this.tp.params.Type ||
          //     this.tp.params.User_ID ||
          //     this.tp.params.Office_id
          //       ? null
          //       : this.tp.params.To,
          //   Office_id: this.tp.params.Office_id,
          //   Project_Code: this.tp.params.Project_Code,
          //   State: this.tp.params.State,
          //   Type: this.tp.params.Type,
          //   User_ID: this.tp.params.User_ID,
          // },params
          params: this.tp.params,
          action: (re) => {
            this.tp.data = re;
            this.$refs.tp.LoadData(true);
          },
        });
      }
    },
    handleASChange(value) {
      if (value) {
        this.$refs.tp.tempRows = this.tp.data.filter((p) =>
          objContainStr(p.Code, Uni2None(value), false)
        );
      } else {
        this.$refs.tp.tempRows = this.tp.data;
      }
      // console.log("after", newTP);
    },
    PickFile() {
      this.$refs.file.click();
    },
    displayFileName() {
      this.fileName = this.$refs.file.files[0].name;
    },
    AddInventory() {
      // console.log(this);
      // return;
      this.$refs.form.getValidate().then((re) => {
        if (!re) {
          ShowMessage("Vui lòng nhập đầy đủ thông tin!", MessageType.error);
          return;
        } else {
          GetDataAPI({
            url: API.Ticket_Add,
            params: this.formInventory.obj.toJSON(),
            method: "post",
            action: (re) => {
              this.LoadTable();
              this.formInventory.visible = false;
              ShowMessage("Sửa chữa tài sản thành công");
            },
          });
        }
      });
    },
    RequestInventory(row) {
      this.formInventory.ShowForm("Sửa chữa tài sản", row);
    },
    // Search() {
    //   Object.assign(this.tp.params, this.filter);
    //   //  console.log(this.tp.params)
    //   this.formFilter.visible = false;
    // },
    // showFilter() {
    //   this.formFilter.visible = true;
    // },
    LoadData() {
      this.$refs.tp.LoadData(true);
    },
    Add() {
      this.form.ShowForm("Thêm tài sản", true);
    },
    CreateTicket(row) {
      if (row.State == 1) this.formTicket.ShowForm("Tạo vé", row);
      if (row.State == 3) this.$router.push("/Tickets/ListByAssets/" + row.Id);
    },
    SaveTicket() {
      this.$refs.form.getValidate().then((re) => {
        if (!re) {
          ShowMessage("Vui lòng nhập đầy đủ thông tin!", MessageType.error);
          return;
        } else {
          APIHelper.ticket.Add(this.formTicket.obj.toJSON()).then((re) => {
            this.LoadTable();
            this.formTicket.visible = false;
            ShowMessage("Thêm vé thành công");
          });
        }
      });
    },
    TransferApprovedProcess(type) {
      switch (type) {
        case 1:
        case 2:
          APIHelper.transfer
            .Approved({
              Fixed_Asset_id: this.formConfirmTransfer.obj.Id,
              Type: type,
            })
            .then(() => {
              this.formConfirmTransfer.visible = false;
              this.LoadTable();
              ShowMessage(
                `${type == 1 ? "Chấp thuận" : "Từ chối"} chuyển thành công`
              );
            });
          break;
        default:
          break;
      }
    },
    TransferApproved(row) {
      this.formConfirmTransfer.visible = true;
      this.formConfirmTransfer.obj = row;
      // ShowConfirm({
      //   message: "This item is delivered to you?",
      // }).then(() => {
      //   APIHelper.transfer
      //     .Approved({
      //       Fixed_Asset_id: row.Id,
      //     })
      //     .then(() => {
      //       this.LoadTable();
      //       ShowMessage("Approved Tranfer Successfully");
      //     });
      // });
    },
    Transfer(row) {
      this.form_transfer.ShowForm("Thay đổi vị trí", row);
    },
    Edit(row) {
      console.log(JSON.parse(JSON.stringify(row)));

      this.form.ShowForm("Sửa tài sản cố định", false, row);
    },
    ViewAssets(row) {
      this.form.ShowForm("Thông tin tài sản cố định", false, row, true);
    },

    Delete(row) {
      ShowConfirm({
        message: "Xóa [" + row.Name + "]",
        title: "Cảnh báo!",
        type: MessageType.warning,
      })
        .then(() => {
          APIHelper.fixed_asset.Delete(row).then((re) => {
            this.LoadTable();
            ShowMessage("Xóa thành công");
            this.$refs.of.LoadData();
          });
        })
        .catch((err) => {
          // An error occurred
        });
    },
    SaveTransfer() {
      this.$refs.form.getValidate().then((re) => {
        if (!re) {
          ShowMessage("Vui lòng nhập đầy đủ thông tin!", MessageType.error);
          return;
        } else {
          APIHelper.transfer.Add(this.form_transfer.obj.toJSON()).then((re) => {
            this.LoadTable();
            this.form_transfer.visible = false;
            ShowMessage("Chuyển đổi thành công");
          });
        }
      });
    },
    Save() {
      var _app = this;
      this.$refs.form.getValidate().then((re) => {
        if (!re) {
          ShowMessage("Vui lòng nhập đầy đủ thông tin!", MessageType.error);
          return;
        } else {
          if (!this.form.obj.Id) {
            APIHelper.fixed_asset.Add(this.form.obj.toJSON()).then((re) => {
              this.LoadTable();
              this.form.visible = false;
              ShowMessage("Lưu thành công");
              this.$refs.of.LoadData();
            });
          } else {
            APIHelper.fixed_asset.Edit(this.form.obj.toJSON()).then((re) => {
              this.LoadTable();
              this.form.visible = false;
              ShowMessage("Lưu thành công");
            });
          }
        }
      });
    },
  },
  beforeMount() {
    EventBus.$on("Add", this.Add);
  },

  beforeDestroy() {
    EventBus.$off("Add", this.Add);
  },
  mounted() {
    this.LoadTable();
    console.log(this.pagePermission);
  },
};
</script>

<style lang="scss" scoped>
::v-deep tr th {
  &:last-child {
    color: #1a7fe7 !important;
  }
}
::v-deep tr td {
  cursor: inherit !important;
}

.Note-cell {
  height: 100%;
  width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.name-link {
  color: #464feb;
  text-decoration: underline;
  cursor: pointer;
}
::v-deep .Es_md {
  display: flex;
  justify-content: center;
  align-items: center;
  .form-title {
    padding: 0;
    line-height: 23px;
  }
}

::v-deep .esMax {
  input {
    text-align: left !important;
  }
}

::v-deep .Es_label .form-title {
  // font-size:normal;
  background-color: #f5f7fa !important;
  border: 1px solid #dcdfe6 !important;
  font-weight: normal !important;
}

::v-deep .fa_images {
  // background: red;
  .input-file-type-default {
    .uploader {
      flex-direction: column-reverse;
      // padding: 0 !important;
      .el-upload {
        margin-bottom: 8px !important;
      }
    }
  }
}
</style>
