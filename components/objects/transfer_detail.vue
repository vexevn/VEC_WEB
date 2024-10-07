<template lang="">
  <div style="height: 100%">
    <TablePaging :model="tp_detail" ref="tp_detail">
      <template slot="column-content-CheckBox" slot-scope="{ row }">
        <el-checkbox
          :disable="!data.isAdd"
          v-model="row.CheckBox"
          style="pointer-events: none"
        />
      </template>

      <template slot="column-header-btn">
        <el-button class="icon-btn icon-btn" type="primary" @click="Add()">
          <i class="el-icon-plus"></i
        ></el-button>
      </template>
      <template slot="column-content-btn" slot-scope="{ row }">
        <el-button class="icon-btn icon-btn" type="warning" @click="Edit(row)">
          <i class="el-icon-edit"></i
        ></el-button>
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
import GetDataAPI from "~/assets/scripts/GetDataAPI";
import { Para } from "~/assets/scripts/Para";
import TablePaging from "~/assets/scripts/base/TablePaging";
import Fixed_Asset_Manager_Detail from "~/assets/scripts/objects/fixed_assets/Fixed_Asset_Manager_Detail";
import {
  MessageType,
  ShowConfirm,
  ShowMessage,
} from "~/assets/scripts/Functions";
import TablePagingCol from "~/assets/scripts/base/TablePagingCol";
import DefaultForm from "~/assets/scripts/base/DefaultForm";

export default {
  props: {
    data: {},
  },
  data() {
    return {
      isAdd: null,
      // colAdd: []
      form: new DefaultForm({
        obj: new Fixed_Asset_Manager_Detail(),
        title: "",
        visible: false,
        width: "500px",
        appendtobody: true,

        ShowForm: (title, isAdd, obj) => {
          this.isAdd = isAdd;
          this.title = title;
          var _app = this;
          // var obj = null;
          // if (!isAdd) {
          //   obj = obj;
          //   if (!obj) {
          //     ShowMessage("You need choose 1 selection!");
          //     return;
          //   }
          // }
          _app.form.title = title;
          _app.form.obj = new Fixed_Asset_Manager_Detail({
            ...obj,
            Fixed_Asset_Manager_Id: _app.data.iFixed_Asset_Manager_id,
            From_Department_id: _app.data.Info.From_Department_id,
            From_Office_id: _app.data.Info.From_Office_id,
            table: _app.tp_detail.data,
          });
          _app.form.visible = true;
        },
        Save: () => {
          var _app = this;
          _app.$refs.form.getValidate().then((re) => {
            if (!re) {
              ShowMessage("Vui lòng nhập đầy đủ thông tin!", MessageType.error);
              return;
            } else {
              GetDataAPI({
                url: _app.isAdd
                  ? API.Manager_Add_Detail
                  : API.Manager_Edit_Detail,
                params: _app.form.obj.toJSON(),
                method: "post",
                action: (re) => {
                  _app.LoadDetail();
                  ShowMessage("Lưu thành công", "success");
                  _app.form.visible = false;
                },
              });
            }
          });
        },
      }),
      obj: new Fixed_Asset_Manager_Detail(),
      tp_detail: new TablePaging({
        // disablePaging: true,
        disableSelectRow: true,
        LoadDataSuccess: (re) => {
          re.forEach((p) => {
            if (this.data.isAdd) p.CheckBox = false;
            else {
              p.CheckBox = true;
            }
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
            title: "Mã tài sản",
            data: "Code",
            min_width: 150,
            // width: "auto",
            sortable: false,
          }),
          new TablePagingCol({
            title: "Tên",
            data: "Name",
            min_width: 130,
            width: "auto",
            sortable: false,
          }),

          // new TablePagingCol({
          //   title: "Mã dự án",
          //   data: "Project_Code",
          //   min_width: 130,
          //   sortable: false,
          // }),
          new TablePagingCol({
            title: "Loại",
            data: this.data.isAdd ? "Type_id" : "Type",
            min_width: 150,
            sortable: false,
            formatter: (value) => {
              return this.data.isAdd
                ? Para.fixed_asset_type_Get_List.getName(value)
                : value;
            },
          }),

          new TablePagingCol({
            title: "Tình trạng",
            data: this.data.isAdd ? "State" : "Fixed_State",
            // data: "",
            min_width: 100,
            sortable: false,
            formatter: (value) =>
              Para.fixed_asset_state_Get_List.getName(value),
          }),
          new TablePagingCol({
            title: "Mô tả",
            data: this.data.isAdd ? "Note" : "Description",
            min_width: 150,
            sortable: false,
          }),
          !this.data.isAdd
            ? new TablePagingCol({
                // title: "Tình trạng",
                data: "btn",
                min_width: 100,
                sortable: false,
                // align: "center",
                fix: "right",
              })
            : null,
        ],
      }),
    };
  },
  watch: {
    "data.Info.From_Department_id": {
      handler: function (n, o) {
        // console.log(this);
        if (n) this.LoadTable();
      },
      deep: true,
    },

    "data.Info.From_Office_id": {
      handler: function (n, o) {
        // console.log(this);
        if (n) this.LoadTable();
      },
      deep: true,
    },
  },
  methods: {
    Edit(row) {
      this.form.ShowForm("Sửa tài sản luân chuyển", false, row);
    },
    Add() {
      this.form.ShowForm("Thêm tài sản luân chuyển", true, {});
    },
    CheckItem(item) {
      if (this.data.isAdd) {
        item.CheckBox = !item.CheckBox;
        if (item.CheckBox) {
          // Clone this.obj to avoid reference issues
          const newObj = { ...this.obj };
          newObj.Fixed_State = item.State;
          newObj.Fixed_Asset_id = item.Id;
          newObj.Name = item.Name;

          this.data.Details.push(newObj);
        } else {
          if (this.data.isAdd) {
            // Assign the filtered result back to this.data.Details
            this.data.Details = this.data.Details.filter(
              (p) => p.Fixed_Asset_id !== item.Id
            );
          } else {
            this.data.Details = this.data.Details.filter(
              (p) => p.Id !== item.Id
            );
          }
        }
      }

      // console.log(this.data.Details);
    },
    LoadData() {
      this.$refs.tp_detail.LoadData();
    },
    LoadTable() {
      GetDataAPI({
        url: API.fixed_asset_Get_List,
        params: {
          Office_id: this.data.Info.From_Office_id,
          Department_id: this.data.Info.From_Department_id,
        },
        action: (re) => {
          // if(this.data.isAdd)
          this.tp_detail.data = re;
          this.LoadData();
        },
      });
    },
    LoadDetail() {
      GetDataAPI({
        url: API.Manager_GetDetail,
        params: {
          iFixed_Asset_Manager_id: this.data.iFixed_Asset_Manager_id,
          // Store_id: this.data.Info.From_Department_id,
        },
        action: (re) => {
          this.tp_detail.data = re;
          this.LoadData();
        },
      });
    },
  },

  mounted() {
    // console.log(this);
    if (!this.data.isAdd) {
      this.LoadDetail();
    }
  },
};
</script>
<style lang=""></style>
