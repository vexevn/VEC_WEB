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
    </TablePaging>

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
import PR_Tool_Update from "~/assets/scripts/objects/PR_Tool_Update";
import { EventBus } from "~/assets/scripts/EventBus.js";
import GetDataAPI from "~/assets/scripts/GetDataAPI";
import {
  MessageType,
  ShowConfirm,
  ShowMessage,
} from "~/assets/scripts/Functions";
import { Para } from "~/assets/scripts/Para";
export default {
  data() {
    return {
      isAdd: null,
      tp: new TablePaging({
        title: "Tiêu đề",
        data: API.Get_List_PR_Tool_Update,
        disableSelectRow: true,

        cols: [
          new TablePagingCol({
            title: "SQ",
            data: "Info.Sequency",
            min_width: 65,
          }),
          new TablePagingCol({
            title: "Procurement Methods",
            data: "Info.Name",
            min_width: 250,
          }),

          // new TablePagingCol({
          //   title:  "Trình tự",
          //   data: "Info.Sequency",
          //   min_width: 120,
          // }),
          // new TablePagingCol({
          //   title: "URL",
          //   data: "Info.URL",
          //   min_width: 120,
          // }),
          new TablePagingCol({
            title: "Category",
            data: "Catetory_Name",
            min_width: 250,
            width: "auto",
            // formatter: (value) => Para.Para_Category.getName(value),
          }),
          new TablePagingCol({
            title: "Money Min",
            data: "Info.Money_Min",
            min_width: 120,
            formatter: "number",
          }),
          new TablePagingCol({
            title: "Money Max",
            data: "Info.Money_Max",
            min_width: 120,
            formatter: "number",
          }),
          new TablePagingCol({
            title: "Endorsed Description",
            data: "Info.Endorsed_Description",
            min_width: 200,
          }),
          new TablePagingCol({
            title: "Approval Description",
            data: "Info.Approval_Description",
            min_width: 200,
          }),

          new TablePagingCol({
            title: "Người cập nhật",
            data: "Info.UserUpdate",
            min_width: 160,
          }),
          new TablePagingCol({
            title: "Ngày cập nhật",
            data: "Info.DateUpdate",
            min_width: 120,
            formatter: "date",
          }),
          new TablePagingCol({
            title: "",
            data: "button",
            min_width: 100,
            sortable: false,
          }),
        ],
      }),
      form: new DefaultForm({
        obj: new PR_Tool_Update(),
        title: "",
        visible: false,
        width: "800px",
        ShowForm: (title, isAdd, obj) => {
          this.isAdd = isAdd;
          var _app = this;
          // var obj = null;
          if (!isAdd) {
            this.form.obj = new PR_Tool_Update({
              ...obj.Info,
              Category_id: obj.List_Catatory,
            });
          } else {
            this.form.obj = new PR_Tool_Update(obj);
          }
          this.form.title = title;

          this.form.visible = true;
        },
        Save: () => {
          this.Save();
        },
      }),
    };
  },
  methods: {
    LoadData() {
      this.$refs.tp.LoadData(true);
    },
    Add() {
      this.form.ShowForm("Add PR_Tool_Update", true, null);
    },
    Edit(row) {
      console.log(row);
      this.form.ShowForm("Edit PR_Tool_Update", false, row);
    },
    Delete(row) {
      ShowConfirm({
        message: "Xóa [" + row.Info.Name + "]",
        title: "Xác nhận!",
        type: MessageType.warning,
      })
        .then(() => {
          GetDataAPI({
            method: "POST",
            url: API.Delete_PR_Tool_Update,
            params: row.Info,
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
          this.$refs.form
            .getEntry("document_url")
            .submitUpload()
            .then((results) => {
              this.form.obj.URL = results.join(",");

              GetDataAPI({
                method: "post",
                url: this.isAdd
                  ? API.Add_PR_Tool_Update
                  : API.Edit_PR_Tool_Update,
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
