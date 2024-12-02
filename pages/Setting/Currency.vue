<template>
  <div style="height: 100%">
    <el-tabs style="height: 100%" v-model="activeName">
      <el-tab-pane style="height: 100%" label="Present" name="Present">
        <div style="height: 100%">
          <TablePaging ref="tp" :model="tp">
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
                <el-button
                  v-if="pagePermission.edit"
                  class="icon-btn"
                  type="primary"
                  @click="Edit(row)"
                >
                  <i class="el-icon-edit"></i
                ></el-button>
                <el-button
                  v-if="pagePermission.delete"
                  class="icon-btn"
                  type="danger"
                  @click="Delete(row)"
                >
                  <i class="el-icon-delete"></i>
                </el-button>
              </div>
            </template>
            <template slot="column-content-Currency_Code" slot-scope="{ row }">
              <div style="display: flex">
                <span
                  style="text-decoration: underline"
                  @click="ShowHistory(row)"
                  >{{ row.Currency_Code }}</span
                >
              </div>
            </template>
          </TablePaging>
        </div>
      </el-tab-pane>
      <el-tab-pane style="height: 100%" label="History" name="history">
        <HistoryCurrency :row="isCurrency" />
      </el-tab-pane>
    </el-tabs>

    <DefaultForm :model="form" @actionOK="form.Save.call(this)">
      <div slot="content">
        <FormInfo ref="form" :model="form.obj.form()" />
      </div>
    </DefaultForm>
  </div>
</template>

<script>
import API from "~/assets/scripts/API";
import TablePaging from "~/assets/scripts/base/TablePaging";
import TablePagingCol from "~/assets/scripts/base/TablePagingCol";
import DefaultForm from "~/assets/scripts/base/DefaultForm";
import Currency from "~/assets/scripts/objects/Currency";
import { EventBus } from "~/assets/scripts/EventBus.js";
import GetDataAPI from "~/assets/scripts/GetDataAPI";
import {
  MessageType,
  ShowConfirm,
  ShowMessage,
} from "~/assets/scripts/Functions";
import { Para } from "~/assets/scripts/Para";
import ConvertStr from "~/assets/scripts/ConvertStr";
export default {
  data() {
    return {
      isAdd: null,
      activeName: "Present",
      isCurrency: {},
      tp: new TablePaging({
        title: "Tiêu đề",
        data: API.Get_Currency,
        disableSelectRow: true,

        cols: [
          new TablePagingCol({
            title:  "Trình tự",
            data: "Sequency",
            min_width: 100,
          }),
          new TablePagingCol({
            title: "From currency",
            data: "Currency_Code",
            min_width: 150,
          }),
          new TablePagingCol({
            title: "To currency",
            data: "To_Currency_Code",
            min_width: 150,
            formatter: (value) => "CHF",
          }),
          new TablePagingCol({
            title: "Conversion Rate",
            data: "Percent",
            min_width: 150,
          }),

          new TablePagingCol({
            title: "Date Active",
            data: "DateActive",
            min_width: 150,
            formatter: (value) =>
              ConvertStr.ToDateStr(value, "DD MMM yyyy, hh:mm"),
          }),
          new TablePagingCol({
            title: "Người cập nhật",
            data: "UserUpdate",
            min_width: 160,
          }),
          new TablePagingCol({
            title: "Ngày cập nhật",
            data: "DateUpdate",
            min_width: 150,
            formatter: (value) =>
              ConvertStr.ToDateStr(value, "DD MMM yyyy, hh:mm"),
          }),
          // new TablePagingCol({
          //   title: "",
          //   data: "tpm",
          //   width: "auto",
          //   min_width: 1,
          // }),
          new TablePagingCol({
            title: "",
            data: "button",
            min_width: 100,
            width: "auto",
            sortable: false,
          }),
        ],
      }),
      form: new DefaultForm({
        obj: new Currency(),
        title: "",
        visible: false,
        width: "500px",
        ShowForm: (title, isAdd, obj) => {
          this.isAdd = isAdd;
          var _app = this;
          // var obj = null;
          // if (!isAdd) {
          //   obj = obj;
          //   if (!obj) {
          //     ShowMessage("You need choose 1 selection!");
          //     return;
          //   }
          // }
          this.form.title = title;
          this.form.obj = new Currency(obj);
          this.form.visible = true;
        },
        Save: () => {
          this.Save();
        },
      }),
    };
  },
  methods: {
    ShowHistory(row) {
      this.isCurrency = row;
      this.activeName = "history";
    },
    LoadData() {
      this.$refs.tp.LoadData(true);
    },
    Add() {
      this.form.ShowForm("Add Currency", true);
    },
    Edit(row) {
      this.form.ShowForm("Edit Currency", false, row);
    },
    Delete(row) {
      ShowConfirm({
        message: "Xóa [" + row.Currency_Code + "]",
        title: "Xác nhận!",
        type: MessageType.warning,
      })
        .then(() => {
          GetDataAPI({
            method: "POST",
            url: API.Delete_Currency,
            params: row,
            action: (re) => {
              if (re == "OK") {
                this.LoadData();
                ShowMessage("Xóa thành công");
              } else {
                ShowMessage(re);
              }
            },
          });
        })
        .catch((err) => {
          // An error occurred
        });
    },
    Save() {
      var _app = this;
      this.$refs.form.getValidate().then((re) => {
        if (!re) {
          ShowMessage(
            "Vui lòng nhập đầy đủ thông tin!",
            MessageType.error
          );
          return;
        } else {
          GetDataAPI({
            method: "post",
            url: this.isAdd ? API.Add_Currency : API.Edit_Currency,
            params: this.form.obj.toJSON(),
            action: (re) => {
              if (re == "OK" || Number.isInteger(+re)) {
                this.LoadData();
                this.form.visible = false;
                ShowMessage("Lưu thành công");
              } else {
                ShowMessage(re);
              }
            },
          });
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
    console.log(this.pagePermission);
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-tabs__header {
  margin: 0px 0px 8px 8px;
}
::v-deep .el-tabs__content {
  height: calc(100% - 55px);
}
</style>
