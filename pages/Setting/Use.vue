<template>
  <div style="height: 100%">
    <TablePaging ref="tp" :model="tp">
      <template slot="btn2">
        <InputContainer
          style="width: 500px; padding-left: 10px"
          label="Văn phòng"
          :labelWidth="120"
        >
          <InputSelect
            style="width: 100%"
            v-model="tp.params.iOffice_id"
            :model="Para.Para_Office"
        /></InputContainer>
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
      <template slot="column-content-UserStatus" slot-scope="{ row }">
        <span class="status" :status="row.UserStatus">
          {{ Para.Para_Use.getName(row.UserStatus) }}
        </span>
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
import User from "~/assets/scripts/objects/User";
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
        data: API.Account,
        params: {
          iOffice_id: 0,
        },
        disableSelectRow: true,

        cols: [
          new TablePagingCol({ title: "STT", data: "SttTP", min_width: 65 }),
          new TablePagingCol({
            title: "Tài khoản",
            data: "Id",
            min_width: 150,
          }),
          new TablePagingCol({
            title: "Họ tên",
            data: "FullName",
            min_width: 200,
          }),
          new TablePagingCol({
            title: "Email",
            data: "Email",
            min_width: 120,
            width: "auto",
          }),

          new TablePagingCol({
            title: "Cấp độ",
            data: "UserLevel_id",
            min_width: 120,
            formatter: (value) => Para.GroupPermission.getName(value),
          }),
          new TablePagingCol({
            title: "Chức vụ",
            data: "Title",
            min_width: 250,
          }),
          // new TablePagingCol({
          //   title: "Văn phòng",
          //   data: "Office_id",
          //   min_width: 120,
          //   formatter: (value) => Para.Para_Office.getName(value),
          // }),
          // new TablePagingCol({
          //   title: "Quốc gia",
          //   data: "Country_id",
          //   min_width: 120,
          // }),
          new TablePagingCol({
            title: "Trạng thái",
            data: "UserStatus",
            min_width: 120,
            formatter: (value) => Para.Para_Use.getName(value),
          }),
          new TablePagingCol({
            title: "Văn phòng",
            data: "Office_id",
            min_width: 200,
            formatter: (value) => Para.Para_Office.getName(value),
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
            fix: "right",
          }),
        ],
      }),
      form: new DefaultForm({
        obj: new User(),
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
          this.form.obj = new User({
            ...obj,
            isEdit: !isAdd
          });
          this.form.visible = true;
        },
        Save: () => {
          this.Save();
        },
      }),
    };
  },

  watch: {
    "tp.params.iOffice_id"(n, o) {
      this.$nextTick(() => {
        this.LoadData();
      });
    },
  },
  methods: {
    LoadData() {
      this.$refs.tp.LoadData(true);
    },
    Add() {
      this.form.ShowForm("Thêm người dùng", true);
    },
    Edit(row) {
      this.form.ShowForm("Thêm người dùng", false, row);
    },
    Delete(row) {
      ShowConfirm({
        message: "Xóa [" + row.FullName + "]",
        title: "Xác nhận!",
        type: MessageType.warning,
      })
        .then(() => {
          GetDataAPI({
            method: "delete",
            url: API.Account + "/" + row.Id,
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
          ShowMessage("Vui lòng nhập đầy đủ thông tin!", MessageType.error);
          return;
        } else {
          GetDataAPI({
            method: this.isAdd ? "post" : "put",
            url: this.isAdd
              ? API.Account
              : API.Account + "/" + this.form.obj.Id,
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
.status {
  // background: red;
  padding: 4px 0px;
  display: inline-block;
  border-radius: 4px;
  &:not([status]) {
  }

  &[status="3"],
  &[status="2"] {
    background: #d73d32;
    color: white;
    padding: 4px 6px;
  }
}
</style>
