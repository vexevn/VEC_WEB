<template>
  <div style="height: 100%">
    <TablePaging :model="tp" ref="tp">
      <template v-if="!$route.params.id" slot="btn">
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
      </template>
      <template slot="column-content-button" slot-scope="{ row }">
        <div style="display: flex">
          <el-button
            class="icon-btn"
            type="primary"
            @click="OpenInventory(row)"
          >
            <i class="fa fa-edit"></i
          ></el-button>
        </div>
      </template>
    </TablePaging>
    <DefaultForm :model="form">
      <div slot="content" style="display: flex; flex-direction: column">
        <div style="display: flex; flex: 1; overflow: hidden">
          <div
            style="
              flex: 0 0 400px;
              display: flex;
              flex-direction: column;
              margin-right: 5px;
            "
            class="form-ticket"
          >
            <div
              class="form-title"
              style="background: white; border: 0px; margin-bottom: 5px"
            >
              Fixed asset Info
            </div>

            <FormInfo
              :model="obj.formFA()"
              style="margin-bottom: 5px"
            ></FormInfo>

            <div
              class="form-title"
              style="background: white; border: 0px; margin-bottom: 5px"
            >
              Inventory Info
            </div>
            <FormInfo
              :model="obj.form()"
              ref="form"
              style="margin-bottom: 5px"
            ></FormInfo>
          </div>
          <div
            style="
              flex: 1;
              display: flex;
              flex-direction: column;
              overflow: hidden;
              position: relative;
            "
          >
            <div
              class="form-title"
              style="background: white; border: 0px; margin-bottom: 5px"
            >
              Attach Images
            </div>
            <div
              style="
                flex: 1;
                border: 1px solid #ddd;
                margin-bottom: 5px;
                border-radius: 4px;
                overflow: hidden;
                position: relative;
              "
            >
              <img
                style="
                  height: 100%;
                  left: 50%;
                  position: absolute;
                  transform: translate(-50%, -50%);
                  top: 50%;
                  background: rgb(212, 212, 212);
                "
                v-if="obj.ImagePreview"
                :src="obj.ImagePreview.href"
              />
            </div>
            <FormInfo
              ref="formImage"
              :model="obj.formImage()"
              style="margin-bottom: 5px"
            />
          </div>
        </div>
        <div style="display: flex">
          <el-button
            v-if="checkBtn('Save')"
            type="primary"
            @click="processBtn('Save')"
          >
            Save
          </el-button>
          <el-button
            v-if="checkBtn('Submit')"
            type="success"
            @click="processBtn('Submit')"
          >
            Submit
          </el-button>
          <el-button
            v-if="checkBtn('Approved')"
            type="success"
            @click="processBtn('Approved')"
          >
            Approved
          </el-button>
          <el-button
            style="margin-left: auto"
            v-if="checkBtn('Delete')"
            type="danger"
            @click="processBtn('Delete')"
          >
            Delete
          </el-button>
        </div>
      </div>
    </DefaultForm>

    <DefaultForm :model="formFilter" @actionOK="Search()">
      <div slot="content">
        <FormInfo :model="filter.form()" />
      </div>
    </DefaultForm>
  </div>
</template>

<script>
import API from "~/assets/scripts/API";
import APIHelper from "~/assets/scripts/API/APIHelper";
import DefaultForm from "~/assets/scripts/base/DefaultForm";
import TablePaging from "~/assets/scripts/base/TablePaging";
import TablePagingCol from "~/assets/scripts/base/TablePagingCol";
import {
  GetStartMonth,
  GetTimeNow,
  MessageType,
  ShowConfirm,
  ShowMessage,
} from "~/assets/scripts/Functions";
import GetDataAPI from "~/assets/scripts/GetDataAPI";
import Fixed_Asset_Inventory from "~/assets/scripts/objects/Fixed_Asset_Inventory";
import Fixed_Asset_Inventory_Filter from "~/assets/scripts/objects/Fixed_Asset_Inventory_Filter";
import Tickets from "~/assets/scripts/objects/Tickets";
import TicketsFilter from "~/assets/scripts/objects/TicketsFilter";
import { Para } from "~/assets/scripts/Para";
export default {
  props: {
    admin: {},
    isInvidual: null,
  },
  data() {
    return {
      tp: new TablePaging({
        data: this.$route.params.id
          ? APIHelper.inventory.Get_List_ByAssets
          : this.isInvidual
          ? APIHelper.inventory.Get_List_Individual
          : APIHelper.inventory.GetList,
        params: {
          From: GetStartMonth(),
          To: GetTimeNow(),
          State: "",
          iFixed_assset_id: this.$route.params.id,
        },
        disableSelectRow: true,

        cols: [
          new TablePagingCol({
            title: "STT",
            data: "SttTP",
            min_width: 60,
            sortable: false,
          }),

          new TablePagingCol({
            sortable: false,
            title: "Mã tài sản",
            data: "Fixed_Code",
            min_width: 200,
          }),
          new TablePagingCol({
            sortable: false,
            title: "Asset Serial",
            data: "Fixed_Serial",
            min_width: 200,
          }),
          new TablePagingCol({
            title: "Asset model",
            data: "Fixed_Model",
            min_width: 200,
            sortable: false,
          }),
          new TablePagingCol({
            title: "Asset Producer",
            data: "Fixed_Producer",
            min_width: 200,
            sortable: false,
          }),
          new TablePagingCol({
            title: "Asset State",
            data: "Fixed_Asset_State",
            min_width: 200,
            sortable: false,
            formatter: (value) =>
              Para.fixed_asset_state_Get_List.getName(value),
          }),
          new TablePagingCol({
            title: "Mô tả",
            data: "Description",
            min_width: 120,
            width: "auto",
            sortable: false,
          }),
          new TablePagingCol({
            title: "Tình trạng",
            data: "State",
            min_width: 100,
            sortable: false,
            formatter: (value) => Para.InventoryState.getName(value),
            fix: "right",
          }),
          new TablePagingCol({
            title: "",
            data: "button",
            min_width: 50,
            sortable: false,
            fix: "right",
          }),
        ],
      }),

      comment: "",
      comments: [],
      Act_User: null,
      obj: new Fixed_Asset_Inventory(),
      form: new DefaultForm({
        title: "Inventory Monitoring",
        type: "dialog",
        width: "1000px",
        visible: false,
      }),

      filter: new Fixed_Asset_Inventory_Filter(),
      formFilter: new DefaultForm({
        OKtext: "Tìm kiếm",
        // visible: true,
        // type: "dialog",
        width: "800px",
        title: "Lọc dữ liệu",
      }),
    };
  },
  watch: {
    "tp.params": {
      deep: true,
      handler() {
        this.$nextTick(() => {
          this.$refs.tp.LoadData(true);
        });
      },
    },
  },
  methods: {
    Search() {
      Object.assign(this.tp.params, this.filter);
      this.formFilter.visible = false;
    },
    showFilter() {
      this.formFilter.visible = true;
    },

    LoadData() {
      this.$refs.tp.LoadData(true);
    },
    checkBtn(action) {
      switch (action) {
        case "Approved":
          if (
            this.obj.State == 2 &&
            (this.user.UserLevel == "202303031015160093" || // Quản lý kỹ thuật
              this.user.UserLevel == "1") // Admin
          ) {
            return true;
          }
          break;
        case "Submit":
        case "Save":
          if (this.obj.State == 1 && this.user.UserSerial == this.obj.User_Use)
            return true;
          break;
        case "Delete":
          if (
            this.obj.State != 3 &&
            (this.user.UserLevel == "202303031015160093" || // Quản lý kỹ thuật
              this.user.UserLevel == "1") // Admin
          )
            return true;
          break;
      }
      return false;
    },
    getValidate() {
      return new Promise((rs) => {
        this.$refs.form.getValidate().then((re) => {
          if (!re) {
            ShowMessage(
              "Vui lòng nhập đầy đủ thông tin!",
              MessageType.error
            );
            return;
          } else {
            rs();
          }
        });
      });
    },
    processBtn(action) {
      switch (action) {
        case "Save":
        case "Submit":
          this.getValidate().then(() => {
            let stuff = [];
            if (
              this.$refs.formImage.getEntry(this.obj._formElements.Images.id)
            ) {
              let file_stuff = this.$refs.formImage
                .getEntry(this.obj._formElements.Images.id)
                .submitUpload();
              stuff.push(file_stuff);
            }
            Promise.all(stuff).then((results) => {
              APIHelper.inventory[action == "Save" ? "Edit" : "Submitted"](
                this.obj.toJSON()
              ).then((re) => {
                this.LoadObj();
                this.LoadData();
                ShowMessage(
                  (action == "Save" ? "Edit" : "Submitted") + " successfully"
                );
              });
            });
          });
          break;
        case "Approved":
          this.getValidate().then(() => {
            APIHelper.inventory.Approved(this.obj.toJSON()).then((re) => {
              this.LoadObj();
              this.LoadData();
              ShowMessage("Approved successfully");
            });
          });
          break;
        case "Delete":
          APIHelper.inventory.Delete(this.obj.toJSON()).then((re) => {
            this.LoadData();
            this.form.visible = false;
            ShowMessage("Xóa thành công");
          });
          break;
      }
    },

    LoadObj() {
      APIHelper.inventory
        .Get_Info({
          iId: this.obj.Id,
        })
        .then((re) => {
          this.obj.update(re);
        });
    },

    OpenInventory(row) {
      this.obj = new Fixed_Asset_Inventory(row);
      this.form.visible = true;
    },
  },
  mounted() {
    console.log("isInvidual", this.isInvidual);
    // console.log('this',this);
  },
};
</script>

<style lang="scss" scoped>
::v-deep  {
  textarea {
    min-height: 90px !important;
  }
}
.comment-item-c {
  display: flex;
  &[self] {
    justify-content: flex-end;
  }
  .comment-item {
    font-size: 13px;
    border: 1px solid #ddd;
    padding: 10px;
    margin: 10px;
    margin-top: 0;
    margin-bottom: 10px;

    border-radius: 4px;
    color: black;

    .comment-name {
      padding-bottom: 10px;
      color: gray;
    }
    .comment-content {
      padding-bottom: 10px;
    }
    .comment-file {
      ::v-deep  .uploader {
        padding: 5px 10px;
        .el-upload-list__item:first-child {
          margin-top: 0;
        }
      }
    }
    .comment-time {
      font-size: 11px;
    }
  }
}
</style>
