<template>
  <div style="height: 100%">
    <TablePaging ref="tp" :model="tp">
      <template slot="btn">
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
    </TablePaging>

    <DefaultForm :model="form" @actionOK="Search()">
      <div slot="content">
        <FormInfo :model="form.obj.form()" />
      </div>
    </DefaultForm>
    <DefaultForm :model="formFilter" @actionOK="Search()">
      <div slot="content">
        <FormInfo :model="tp.params.form2()" />
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
  addMonth,
  GetTimeNow,
  MessageType,
  ShowConfirm,
  ShowMessage,
} from "~/assets/scripts/Functions";
import { Para } from "~/assets/scripts/Para";
import transfer_fa from "~/assets/scripts/objects/fixed_assets/transfer_fa";
import Fixed_Asset_Inventory_Filter from "~/assets/scripts/objects/Fixed_Asset_Inventory_Filter";

import ConvertStr from "~/assets/scripts/ConvertStr";
export default {
  data() {
    return {
      isAdd: null,
      //   filter: ,
      formFilter: new DefaultForm({
        OKtext: "Tìm kiếm",
        // visible: true,
        // type: "dialog",
        width: "400px",
        title: "Lọc dữ liệu",
      }),
      form: new DefaultForm({
        obj: new transfer_fa(),
        // OKtext: "Tìm kiếm",
        visible: false,
        // type: "dialog",
        fullscreen: true,
        title: "Chuyển nhượng tài sản",
        ShowForm: (title, isAdd, obj) => {
          this.form.obj = new transfer_fa(obj);
          this.form.visible = true;

          console.log(this.form.obj)
        },
      }),
      tp: new TablePaging({
        title: "Danh sách chuyển tài sản",
        data: API.Manager_GetList,
        // disableSelectRow: true,
        params: new Fixed_Asset_Inventory_Filter(),

        cols: [
          new TablePagingCol({ title: "STT", data: "SttTP", min_width: 65 }),
          new TablePagingCol({
            title: "Bên chuyển nhượng",

            sortable: false,
            children: [
              new TablePagingCol({
                title: "Văn phòng",
                width: "auto",
                min_width: 150,
              }),
              new TablePagingCol({
                title: "Phòng ban",
                width: "auto",
                min_width: 150,
              }),
            ],
          }),
          new TablePagingCol({
            title: "Bên nhận",
            children: [
              new TablePagingCol({
                title: "Văn phòng",
                width: "auto",
                min_width: 150,
              }),
              new TablePagingCol({
                title: "Phòng ban",
                width: "auto",
                min_width: 150,
              }),
            ],
          }),
          new TablePagingCol({
            title: "Ghi chú",
            data: "Producer_Name",
            min_width: 150,
            sortable: false,
          }),
          new TablePagingCol({
            title: "",
            data: "button",
            min_width: 100,
            sortable: false,
            align: "center",
            fix: "right",
          }),
        ],
      }),
    };
  },
  methods: {
    // LoadTable() {
    //   GetDataAPI({
    //     url: API.Reports_Khauhao,
    //     params: {
    //       iMonth: this.tp.params.iMonth,
    //       iOffice_id: this.tp.params.iOffice_id,
    //     },
    //     action: (re) => {
    //       this.tp.data = re;
    //       this.LoadData();
    //     },
    //   });
    // },
    Add() {
      this.form.ShowForm("abc", true, {});
    },
    LoadData() {
      // this.tp.params.iMonth =  ;
      this.$refs.tp.LoadData(true);
    },
    Search() {
      this.LoadData();
      this.formFilter.visible = false;
    },
    showFilter() {
      this.formFilter.visible = true;
    },
  },

  mounted() {
    console.log(this);
    // <!-- this.LoadTable(); -->
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
