<template>
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
            v-if="row.Total"
            class="icon-btn"
            type="primary"
            @click="ShowPR(row)"
          >
            <i class="fa fa-list-alt"></i
          ></el-button>
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
      <!-- <template slot="column-content-Total" slot-scope="{ row }">
        <div style="display: flex">
          <span style="text-decoration: underline" @click="ShowPR(row)">{{
            row.Total || ""
          }}</span>
        </div>
      </template> -->
    </TablePaging>

    <DefaultForm :model="form" @actionOK="form.Save.call(this)">
      <div slot="content">
        <FormInfo ref="form" :model="form.obj.form()" />
      </div>
    </DefaultForm>
    <DefaultForm :model="formListPR">
      <div slot="content" style="height: 600px">
        <FormPR ref="form" :VendorsId="VendorsId" />
      </div>
    </DefaultForm>
  </div>
</template>

<script>
import API from "~/assets/scripts/API";
import TablePaging from "~/assets/scripts/base/TablePaging";
import TablePagingCol from "~/assets/scripts/base/TablePagingCol";
import DefaultForm from "~/assets/scripts/base/DefaultForm";
import Office from "~/assets/scripts/objects/Office";
import { EventBus } from "~/assets/scripts/EventBus.js";
import GetDataAPI from "~/assets/scripts/GetDataAPI";
import {
  MessageType,
  ShowConfirm,
  ShowMessage,
} from "~/assets/scripts/Functions";
import { Para } from "~/assets/scripts/Para";
import Vendors from "~/assets/scripts/objects/Vendors";
export default {
  data() {
    return {
      isAdd: null,
      tp: new TablePaging({
        title: "Tiêu đề",
        data: API.Get_List_Vendors,
        disableSelectRow: true,

        cols: [
          new TablePagingCol({ title: "SQ", data: "Sequency", min_width: 65 }),
          new TablePagingCol({
            title: "Serial",
            data: "Serial",
            min_width: 120,
          }),
          new TablePagingCol({
            title: "Vendors",
            data: "Name",
            min_width: 120,
            width: "auto",
          }),

          new TablePagingCol({
            title: "Money",
            data: "Money",
            min_width: 120,
            formatter: "number",
          }),
          new TablePagingCol({
            title: "Total",
            data: "Total",
            min_width: 80,
            formatter: "number",
          }),
          new TablePagingCol({
            title: "Contact Name",
            data: "ContactName",
            min_width: 160,
          }),
          new TablePagingCol({
            title: "Contact Phone",
            data: "ContactPhone",
            min_width: 120,
          }),
          new TablePagingCol({
            title: "Contact Email",
            data: "ContactEmail",
            min_width: 200,
          }),
          new TablePagingCol({
            title: "Technical Evaluation",
            data: "TechnicalEvaluation",
            min_width: 150,
          }),

          new TablePagingCol({
            title: "Overall Score",
            data: "OverallScore",
            min_width: 120,
          }),
          new TablePagingCol({
            title: "Offices",
            data: "Offices",
            min_width: 120,
          }),
          new TablePagingCol({
            title: "Categories",
            data: "Categories",
            min_width: 120,
          }),
          new TablePagingCol({
            title: "Use",
            data: "Use",
            min_width: 120,
            formatter: (value) => Para.Para_Active.getName(value),
          }),
          new TablePagingCol({
            title: "",
            data: "button",
            min_width: 115,
            sortable: false,
          }),
        ],
      }),
      form: new DefaultForm({
        obj: new Vendors(),
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
          this.form.obj = new Vendors(obj);
          this.form.visible = true;
        },
        Save: () => {
          this.Save();
        },
      }),
      formListPR: new DefaultForm({
        title: "",
        visible: false,
        width: "1300px",
        type: "dialog",
        ShowForm: (title, isAdd, obj) => {
          this.isAdd = isAdd;
          var _app = this;
          this.VendorsId = obj.Id;

          this.formListPR.title = title;
          this.formListPR.visible = true;
        },
      }),
      VendorsId: "",
    };
  },
  methods: {
    LoadData() {
      this.$refs.tp.LoadData(true);
    },
    ShowPR(row) {
      this.formListPR.ShowForm("List PR Vendors", true, row);
    },
    Add() {
      this.form.ShowForm("Add Vendors", true);
    },
    Edit(row) {
      this.form.ShowForm("Edit Vendors", false, row);
    },
    Delete(row) {
      ShowConfirm({
        message: "Xóa [" + row.Name + "]",
        title: "Cảnh báo!",
        type: MessageType.warning,
      })
        .then(() => {
          GetDataAPI({
            method: "POST",
            url: API.Delete_Vendors,
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
            url: this.isAdd ? API.Add_Vendors : API.Edit_Vendors,
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
</style>
