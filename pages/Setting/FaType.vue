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
import dm_fixed_asset_type from "~/assets/scripts/objects/dm_fixed_asset_type";
import { EventBus } from "~/assets/scripts/EventBus.js";
import GetDataAPI from "~/assets/scripts/GetDataAPI";
import {
  MessageType,
  ShowConfirm,
  ShowMessage,
} from "~/assets/scripts/Functions";
import { Para } from "~/assets/scripts/Para";
import APIHelper from "~/assets/scripts/API/APIHelper";
export default {
  data() {
    return {
      isAdd: null,
      tp: new TablePaging({
        title: "Tiêu đề",
        data: APIHelper.fixed_asset_type.GetList,
        disableSelectRow: true,

        cols: [
          new TablePagingCol({ title: "Mã", data: "Code", min_width: 100 }),

          new TablePagingCol({
            title: "Tên",
            data: "Name",
            min_width: 120,
            width: "auto",
          }),

          new TablePagingCol({
            title: "Nhóm",
            data: "group_id",
            min_width: 180,
            formatter: (value) => Para.fixed_asset_group_Get_List.getName(value),
          }),
          new TablePagingCol({
            title:  "Trình tự",
            data: "Sequency",
            min_width: 120,
          }),
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
        obj: new dm_fixed_asset_type(),
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
          this.form.obj = new dm_fixed_asset_type(obj);
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
      this.form.ShowForm("Thêm loại tài sản", true);
    },
    Edit(row) {
      this.form.ShowForm("Sửa loại tài sản", false, row);
    },
    Delete(row) {
      ShowConfirm({
        message: "Xóa [" + row.Name + "]",
        title: "Cảnh báo!",
        type: MessageType.warning,
      })
        .then(() => {
          APIHelper.fixed_asset_type.Delete(row).then((re) => {
            this.LoadData();
            ShowMessage("Xóa thành công");
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
          if (!this.form.obj.Id) {
            APIHelper.fixed_asset_type
              .Add(this.form.obj.toJSON())
              .then((re) => {
                this.LoadData();
                this.form.visible = false;
                ShowMessage("Lưu thành công");
              });
          } else {
            APIHelper.fixed_asset_type
              .Edit(this.form.obj.toJSON())
              .then((re) => {
                this.LoadData();
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
    console.log(this.pagePermission);
  },
};
</script>

<style lang="scss" scoped>
</style>
