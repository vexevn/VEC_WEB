<template lang="">
  <div style="height: 100%">
    <!-- <el-checkbox :disable="!data.isAdd" v-model="CheckAll" @change="checkALl" /> -->

    <TablePaging :model="tp_detail" ref="tp_detail">
      <template slot="column-content-CheckBox" slot-scope="{ row }">
        <el-checkbox
          :disable="!data.isAdd"
          v-model="row.CheckBox"
          style="pointer-events: none"
        />
      </template>

      <template slot="column-header-CheckBox">
        <!-- <el-checkbox v-model="CheckAll"  @change="checkALl"></el-checkbox> -->
        <div>
          <!-- <input v-model="CheckAll" @change="checkALl" type="checkbox" />
          <el-checkbox
            v-if="data.isAdd"
            v-model="CheckAll"
            @change="checkALl"
          /> -->
          <CheckboxCustome   v-if="data.isAdd" ref="cbo" v-model="CheckAll" @change="checkALl"/>
        </div>
      </template>

      <!-- <template slot="column-content-New_Store_id" slot-scope="{ row }">
        <InputSelect
        @input="changeSl(row)"
          :model="Para.store_Get_List"
          v-model="row.New_Store_id"
        />
      </template> -->

      <template slot="column-header-btn">
        <el-button
          v-if="!data.disBtn"
          class="icon-btn icon-btn"
          type="primary"
          @click="Add()"
        >
          <i class="el-icon-plus"></i
        ></el-button>
      </template>
      <template slot="column-content-btn" slot-scope="{ row }">
        <el-button
          v-if="!data.disBtn"
          class="icon-btn icon-btn"
          type="warning"
          @click="Edit(row)"
        >
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
      CheckAll: false,
      // colAdd: []
      form: new DefaultForm({
        obj: new Fixed_Asset_Manager_Detail(),
        title: "",
        visible: false,
        width: "700px",
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
            To_Office_id: _app.data.Info.To_Office_id,
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
            data: this.data.isAdd ? "Code" : "Fixed_Code",
            min_width: 150,
            // width: "auto",
            sortable: false,
          }),
          new TablePagingCol({
            title: "Tên",
            data: "Name",
            min_width: 160,
            sortable: false,
          }),

          new TablePagingCol({
            data: "QRCode",
            title: "Mã QR",
            min_width: 180,
            // width: "auto",
            sortable: false,
          }),
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
            data: this.data.isAdd ? "Status" : "Fixed_State",
            // data: "",
            min_width: 130,
            sortable: false,
            formatter: (value) =>
              Para.fixed_asset_state_Get_List.getName(value),
          }),

          new TablePagingCol({
            title: "Kho/phòng hiện tại",
            data: "Curent_Store_id",
            min_width: 180,
            sortable: false,
            formatter: (value) => Para.store_Get_List.getName(value),
          }),
          new TablePagingCol({
            title: "Người đang sử dụng",
            data: "Curent_Person",
            min_width: 180,
            formatter: (value) => Para.Para_Account.getName(value),
            sortable: false,
          }),

          new TablePagingCol({
            title: "Kho/phòng mới",
            data: "New_Store_id",
            min_width: 180,
            sortable: false,
            formatter: (value) => Para.store_Get_List.getName(value),
          }),
          new TablePagingCol({
            title: "Người sử dụng mới",
            data: "New_Person",
            min_width: 180,
            formatter: (value) => Para.Para_Account.getName(value),
            sortable: false,
          }),

          new TablePagingCol({
            title: "Ghi chú",
            data: this.data.isAdd ? "Note" : "Description",
            min_width: 250,
            sortable: false,
            width: "auto",
          }),

          !this.data.isAdd
            ? new TablePagingCol({
                // title: "Tình trạng",
                data: "btn",
                min_width: 70,
                sortable: false,
                // align: "center",
                fix: "right",
              })
            : new TablePagingCol({
                // title: "Tình trạng",
                data: "",
                min_width: 10,
                sortable: false,
                // align: "center",
                // fix: "right",
              }),
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
        // else{
        //   this.tp_detail.data = []
        //   this.LoadTable();
        // }
      },
      deep: true,
    },
  },
  methods: {
    checkALl(value) {
      console.log(this);
      const tempRows = this.$refs.tp_detail.tempRows;
      // if(this.CheckAll){
      this.data.Details = [];
      tempRows.forEach((p) => {
        p.CheckBox =value;
        if (p.CheckBox) {
          // Clone this.obj to avoid reference issues
          const newObj = { ...this.obj };
          newObj.Fixed_State = p.Status;
          newObj.Fixed_Code = p.Code;
          newObj.Fixed_Asset_id = p.Id;
          newObj.Name = p.Name;

          this.data.Details.push(newObj);
        }
      });
      if (!value) {
        this.data.Details = [];
      }
    },
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
          newObj.Fixed_State = item.Status;
          newObj.Fixed_Code = item.Code;
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
      this.$nextTick(() => {
        if (this.$refs.tp_detail.tempRows.every((p) => p.CheckBox == true)) {
          this.CheckAll = true;
          this.$refs.cbo.CheckAll = true;
          console.log(this);
        } else {
          this.CheckAll = false;
          this.$refs.cbo.CheckAll = false;
        }
      });

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
          this.data.Details = re;

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
