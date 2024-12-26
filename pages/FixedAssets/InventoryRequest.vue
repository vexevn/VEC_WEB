<template lang="">
  <div style="height: 100%">
    <TablePaging :model="tp" ref="tp">
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
      <template slot="column-content-Active" slot-scope="obj">
        <span v-if="obj.row.Active">
          <i style="color: green" class="fa fa-check"></i
        ></span>
        <span v-else></span>
      </template>
      <template slot="column-header-buttons">
        <el-tooltip content="Lập lịch kiểm kê" >
          <el-button
            class="icon-btn icon-btn"
            v-if="pagePermission.add"
            type="primary"
            @click="Add()"
          >
            <i class="el-icon-plus"></i
          ></el-button>
        </el-tooltip>
      </template>
      <template slot="column-content-Office_Info" slot-scope="obj">
        <!-- Object.values(obj.row.Office_Info) -->
        <div v-if="Object.values(obj.row.Office_Info).length > 0">
          <div v-for="item in Object.values(obj.row.Office_Info)" :key="item">
            {{ item ? item : "" }}
          </div>
        </div>
        <div v-else></div>
      </template>

      <template slot="column-content-buttons" slot-scope="obj">
        <div style="display: flex">
          <el-tooltip content="In phiếu kiểm kê" >
            <el-button
              class="icon-btn icon-btn"
              type="primary"
              @click="Print(obj.row)"
            >
              <i class="fa fa-print" aria-hidden="true"></i
            ></el-button>
          </el-tooltip>

          <el-tooltip  v-if="
                new Date(obj.row.ToDate) > new Date() && pagePermission.edit
              " content="Sửa lịch kiểm kê" >
            <el-button
              class="icon-btn icon-btn"
             
              type="primary"
              @click="form.ShowForm('Sửa yêu cầu', false, obj.row)"
            >
              <i class="el-icon-edit"></i
            ></el-button>
          </el-tooltip>
          <el-tooltip  v-else content="Xem kiểm kê" >
            <el-button
              class="icon-btn icon-btn"
             
              type="primary"
              @click="form.ShowForm('Xem yêu cầu', false, obj.row, true)"
            >
              <i class="el-icon-view"></i
            ></el-button>
          </el-tooltip>

          <el-tooltip content="Xóa lịch kiểm kê" >
            <el-button
            class="icon-btn icon-btn"
            v-if="pagePermission.delete"
            type="danger"
            @click="Delete(obj.row)"
          >
            <i class="el-icon-delete"></i
          ></el-button>
          </el-tooltip>
       
        </div>
      </template>
    </TablePaging>
    <DefaultForm :model="formFilter" @actionOK="Search()">
      <div slot="content">
        <FormInfo :model="filter.form4()" />
      </div>
    </DefaultForm>

    <DefaultForm
      :model="form"
      @Reject="Print()"
      @actionOK="form.Save.call(this)"
    >
      <div style="height: 100%" slot="content">
        <InventoryRequestForm
          @LoadAgian="LoadTable()"
          :obj="form.obj"
          ref="formIVT"
        />
      </div>
    </DefaultForm>
  </div>
</template>

<script>
import Fixed_Asset_Inventory_Filter from "~/assets/scripts/objects/Fixed_Asset_Inventory_Filter";
import InventoryRequest from "~/assets/scripts/objects/InventoryRequest";
import API from "~/assets/scripts/API";
import APIHelper from "~/assets/scripts/API/APIHelper";
import DefaultForm from "~/assets/scripts/base/DefaultForm";
import TablePaging from "~/assets/scripts/base/TablePaging";
import TablePagingCol from "~/assets/scripts/base/TablePagingCol";
import {
  MessageType,
  ShowConfirm,
  ShowMessage,
} from "~/assets/scripts/Functions";
import GetDataAPI from "~/assets/scripts/GetDataAPI";
export default {
  computed: {},
  data() {
    return {
      tp: new TablePaging({
        isSearchEqual: true,
        // disableSelectRow: true,

        cols: [
          new TablePagingCol({
            data: "SttTP",
            title: "#",
            min_width: 50,
            sortable: false,
          }),
          new TablePagingCol({
            data: "Description",
            title: "Nội dung",
            min_width: 180,
            width: "auto",
            sortable: false,
          }),
          new TablePagingCol({
            data: "Office_Info",
            title: "Văn phòng",
            min_width: 180,
            sortable: false,
            width: "auto",
            // exporter: (value) => {
            //   console.log(value)
            //  return
            //   // return 'abcqer'
            // },
          }),

          new TablePagingCol({
            data: "FromDate",
            title: "Ngày bắt đầu",
            min_width: 110,
            //  width: "auto",
            sortable: false,
            formatter: "date",
          }),
          new TablePagingCol({
            data: "ToDate",
            title: "Ngày kết thúc",
            min_width: 120,
            //  width: "auto",
            formatter: "date",
            sortable: false,
          }),
          new TablePagingCol({
            data: "Active",
            title: "Kích hoạt",
            min_width: 80,
            //  width: "auto",
            sortable: false,
          }),

          new TablePagingCol({
            data: "buttons",
            title: "",
            min_width: 80,
            sortable: false,
            width: "auto",
          }),
        ],
        data: [],
      }),

      filter: new Fixed_Asset_Inventory_Filter(),
      formFilter: new DefaultForm({
        OKtext: "Tìm kiếm",
        // visible: true,
        // type: "dialog",
        width: "400px",
        title: "Lọc dữ liệu",
      }),
      form: new DefaultForm({
        obj: new InventoryRequest(),
        btns: [{ Id: 1, text: "In phiếu", action: "Reject", type: "warning" }],

        title: "",
        visible: false,
        // width: "600px",
        fullscreen: true,
        ShowForm: (title, isAdd, obj, viewOnly) => {
          this.isAdd = isAdd;
          this.form.title = title;
          this.form.viewOnly = viewOnly;
          if (viewOnly) this.form.type = "dialog";
          else this.form.type = "";
          this.form.obj = new InventoryRequest({
            ...JSON.parse(JSON.stringify(obj)),
            Offices: !isAdd ? Object.keys(obj.Office_Info).map(Number) : [],
            Store: !isAdd ? Object.keys(obj.Store_Info).map(Number) : [],
            viewOnly: viewOnly,
          });
          this.form.visible = true;
          // console.log(this.form.obj)
        },
        Save: () => {
          const obj = this.form.obj.toJSON();
          obj.Offices = obj.Offices.join(",");
          obj.Store = obj.Store.join(",");
          // console.log(this);
          // return;

          this.$refs.formIVT.$refs.form.getValidate().then((re) => {
            if (!re) {
              ShowMessage("Vui lòng nhập đầy đủ thông tin!", MessageType.error);
              return;
            } else {
              GetDataAPI({
                method: "post",
                url: this.isAdd ? API.AddRequest : API.EditRequest,
                params: obj,
                action: (re) => {
                  this.LoadTable();
                  ShowMessage("Lưu thành công", "success");
                  this.form.visible = false;
                },
              });
            }
          });
        },
      }),
    };
  },
  methods: {
    formChange() {
      this.LoadTable();
    },
    Print(row) {
      // console.log(row)
      // return;
      localStorage.dataPrint = JSON.stringify(this.form.obj);

      if (row) {
        localStorage.dataPrint = JSON.stringify(row);
      }
      window.open("/Print/BienBanKiemKe");
    },
    Delete(row) {
      // var app = this;
      ShowConfirm({
        message: "Bạn có chắc chắn xóa?",
        title: "Xác nhận!",
        type: MessageType.warning,
      })
        .then(() => {
          GetDataAPI({
            method: "POST",
            url: API.DeleteRequest,
            params: row,
            action: (re) => {
              if (re === "OK") {
                this.LoadTable();
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
    Add() {
      //   console.log("add");
      this.form.ShowForm("Lập lịch kiểm kê", true, {});
    },
    LoadTable() {
      GetDataAPI({
        url: API.GetRequest,
        params: {
          Office_id: Number(this.filter.Office_id),
          FromDate: this.filter.FromDate,
          ToDate: this.filter.ToDate,
        },
        action: (re) => {
          this.tp.data = re;
          this.$refs.tp.LoadData(true);
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
  },
  mounted() {
    console.log(this);
    this.LoadTable();
  },
};
</script>

<style lang=""></style>
