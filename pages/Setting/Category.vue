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
      <template slot="column-content-Keywords" slot-scope="{ row }">
        <div class="tags-group">
          <el-tag
            v-for="item in GetKeywordsArray(row)"
            :key="item"
            style="margin-right: 5px"
            >{{ item }}</el-tag
          >
        </div>
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
import Category from "~/assets/scripts/objects/Category";
import { EventBus } from "~/assets/scripts/EventBus.js";
import GetDataAPI from "~/assets/scripts/GetDataAPI";
import {
  MessageType,
  ShowConfirm,
  ShowMessage,
} from "~/assets/scripts/Functions";
export default {
  data() {
    return {
      isAdd: null,
      tp: new TablePaging({
        title: "Tiêu đề",
        data: API.Get_List_Category,
        disableSelectRow: true,

        cols: [
          new TablePagingCol({ title: "SQ", data: "Sequency", min_width: 65 }),
          // new TablePagingCol({
          //   title: "Số Serial",
          //   data: "Serial",
          //   min_width: 120,
          // }),
          new TablePagingCol({
            title: "Category",
            data: "Name",
            min_width: 160,
          }),
          new TablePagingCol({
            title: "Keywords",
            data: "Keywords",
            min_width: 120,
            width: "auto",
          }),

          // new TablePagingCol({
          //   title:  "Trình tự",
          //   data: "Sequency",
          //   min_width: 120,
          // }),
          new TablePagingCol({
            title: "Người cập nhật",
            data: "UserUpdate",
            min_width: 160,
          }),
          new TablePagingCol({
            title: "Ngày cập nhật",
            data: "DateUpdate",
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
        obj: new Category(),
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
          this.form.obj = new Category(obj);
          this.form.visible = true;
        },
        Save: () => {
          this.Save();
        },
      }),
    };
  },
  methods: {
    GetKeywordsArray(row) {
      return (row.Keywords || "")
        .trim()
        .split("\n")
        .filter((p) => p);
    },
    LoadData() {
      this.$refs.tp.LoadData(true);
    },
    Add() {
      this.form.ShowForm("Add Category", true);
    },
    Edit(row) {
      this.form.ShowForm("Edit Category", false, row);
    },
    Delete(row) {
      ShowConfirm({
        message: "Xóa [" + row.Name + "]",
        title: "Xác nhận!",
        type: MessageType.warning,
      })
        .then(() => {
          GetDataAPI({
            method: "POST",
            url: API.Delete_Category,
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
            url: this.isAdd ? API.Add_Category : API.Edit_Category,
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
};
</script>

<style lang="scss" scoped>
.tags-group {
  margin-bottom: -5px;
  .el-tag {
    margin-right: 5px;
    margin-bottom: 5px;
  }
}
</style>
