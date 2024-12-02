<template>
  <div style="height: 100%">
    <!-- {{ $t("welcome") }} -->
    <TablePaging ref="tp" :model="tp">
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
    <DefaultForm :model="formFilter" @actionOK="Search()">
      <div slot="content">
        <FormInfo :model="filter.form3()" />
      </div>
    </DefaultForm>

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
import dm_store from "~/assets/scripts/objects/dm_store";
import { EventBus } from "~/assets/scripts/EventBus.js";
import {
  MessageType,
  ShowConfirm,
  ShowMessage,
} from "~/assets/scripts/Functions";
import { Para } from "~/assets/scripts/Para";
import APIHelper from "~/assets/scripts/API/APIHelper";
import Fixed_Asset_Inventory_Filter from "~/assets/scripts/objects/Fixed_Asset_Inventory_Filter";
import GetDataAPI from "~/assets/scripts/GetDataAPI";

export default {
  data() {
    return {
      isAdd: null,
      filter: new Fixed_Asset_Inventory_Filter(),
      formFilter: new DefaultForm({
        OKtext: "Tìm kiếm",
        // visible: true,
        // type: "dialog",
        width: "400px",
        title: "Lọc dữ liệu",
      }),

      tp: new TablePaging({
        title: "Tiêu đề",
        // data: APIHelper.dm_store.GetList,
        data: [],
        params: {
          // Office_id: Number(filter.Office_id)
        },
        disableSelectRow: true,

        cols: [
          new TablePagingCol({
            title: "Mã",
            data: "Serial",
            min_width: 100,
          }),

          new TablePagingCol({
            title: "Tên",
            data: "Name",
            min_width: 220,
          }),

          new TablePagingCol({
            title: "Loại",
            data: "isStore",
            min_width: 120,
            formatter: (value) => Para.StoreType.getName(value),
          }),

          new TablePagingCol({
            title: "Văn phòng",
            data: "Office_id",
            min_width: 150,
            width: "auto",
            formatter: (value) => Para.Para_Office.getName(value),
          }),
          new TablePagingCol({
            title: "Mô tả",
            data: "Description",
            min_width: 260,
            // width: "auto",
          }),
          new TablePagingCol({
            title: "Người cập nhật",
            data: "UserUpdate",
            min_width: 120,
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
            min_width: 80,
            sortable: false,
          }),
        ],
      }),
      form: new DefaultForm({
        obj: new dm_store(),
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
          this.form.obj = new dm_store(obj);
          this.form.visible = true;
        },
        Save: () => {
          this.Save();
        },
      }),
    };
  },
  methods: {
    LoadTable() {
      GetDataAPI({
        url: API.dm_store_Get_List,
        params: {
          iOffice_id: Number(this.filter.Office_id),
        },
        action: (re) => {
          this.tp.data = re;
          this.LoadData();
        },
      });
    },
    Search() {
      this.LoadTable();
      this.formFilter.visible = false;
    },
    showFilter() {
      this.formFilter.visible = true;
    },
    LoadData() {
      this.$refs.tp.LoadData(true);
    },
    Add() {
      this.form.ShowForm("Thêm vị trí", true);
    },
    Edit(row) {
      this.form.ShowForm("Sửa vị trí", false, row);
    },
    Delete(row) {
      ShowConfirm({
        message: "Xóa [" + row.Name + "]",
        title: "Xác nhận!",
        type: MessageType.warning,
      })
        .then(() => {
          APIHelper.dm_store.Delete(row).then((re) => {
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
            APIHelper.dm_store.Add(this.form.obj.toJSON()).then((re) => {
              this.LoadData();
              this.form.visible = false;
              ShowMessage("Lưu thành công");
            });
          } else {
            APIHelper.dm_store.Edit(this.form.obj.toJSON()).then((re) => {
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
    this.LoadTable();
  },
};
</script>

<style lang="scss" scoped></style>
