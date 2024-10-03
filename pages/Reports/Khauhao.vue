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
    </TablePaging>

    <DefaultForm :model="formFilter" @actionOK="Search()">
      <div slot="content">
        <!-- <FormInfo :model="tp.params.form2()" /> -->
        <InputContainer label="Số tháng khấu hao còn lại" :labelWidth="180">
          <InputNumber style="width: 80%" v-model="tp.params.iMonth" />

          <label> tháng</label>
        </InputContainer>

        <InputContainer
          style="margin-top: 5px"
          label="Văn phòng"
          :labelWidth="120"
        >
          <InputSelect
            style="width: 100%"
            v-model="tp.params.iOffice_id"
            :model="Para.Para_Office"
        /></InputContainer>
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
      tp: new TablePaging({
        title: "Tiêu đề",
        data: [],
        disableSelectRow: true,
        params: {
          iMonth: 1,
          iOffice_id: 0,
        },
        cols: [
          new TablePagingCol({ title: "STT", data: "SttTP", min_width: 65 }),
          new TablePagingCol({
            title: "Mã tài sản",
            data: "Code",
            min_width: 150,
            sortable: false,
          }),
          new TablePagingCol({
            title: "Tên tài sản",
            data: "Name",
            min_width: 200,
            width: "auto",
            sortable: false,
          }),
          new TablePagingCol({
            title: "Nhà sản xuất",
            data: "Producer_Name",
            min_width: 150,
            sortable: false,
          }),
          new TablePagingCol({
            title: "Chủng loại",
            data: "Model",
            min_width: 150,
            sortable: false,
          }),

          new TablePagingCol({
            title: "Serial",
            data: "Serial",
            min_width: 130,
            sortable: false,
          }),
          new TablePagingCol({
            title: "Ngày mua",
            data: "Purchase_Date",
            min_width: 130,
            sortable: false,
            formatter: "date",
          }),

          // new TablePagingCol({
          //   // title: "Accounting voucher no./General ledger code",
          //   title: "Số chứng từ kế toán/Mã số sổ cái",
          //   data: "Invoice_code",
          //   min_width: 200,
          //   sortable: false,
          // }),
          // new TablePagingCol({
          //   title: "Unit Cost",
          //   data: "Unit_cost",
          //   min_width: 150,
          //   sortable: false,
          // }),
          // new TablePagingCol({
          //   title: "Qty",
          //   data: "Qty",
          //   min_width: 150,
          //   sortable: false,
          // }),
          // new TablePagingCol({
          //   title: "Total Value in purchase currency ",
          //   data: "Qty",
          //   min_width: 150,
          //   sortable: false,
          // }),
          // new TablePagingCol({
          //   title: "Total Value in local currency (VND)",
          //   data: "Qty",
          //   min_width: 150,
          //   sortable: false,
          // }),
          new TablePagingCol({
            title: "Ví trí vật lý",
            data: "Office_Name",
            min_width: 150,
            sortable: false,
          }),
          new TablePagingCol({
            title: "Tình trạng tài sản",
            data: "Status",
            min_width: 150,
            sortable: false,
            formatter: (value) =>
              Para.fixed_asset_state_Get_List.getName(value),
          }),
          // new TablePagingCol({
          //   title: "Initial Holder",
          //   data: "Initial_Holder_Name",
          //   min_width: 150,
          //   sortable: false,
          // }),
          // new TablePagingCol({
          //   title: "Current Holder",
          //   data: "Curent_Holder_Name",
          //   min_width: 150,
          //   sortable: false,
          // }),
          new TablePagingCol({
            title: "Số dự án",
            data: "Project_Code",
            min_width: 150,
            sortable: false,
          }),
          // new TablePagingCol({
          //   title: "Thời hạn bảo hành",
          //   data: "Warranty_Period",
          //   min_width: 150,
          //   sortable: false,
          //   formatter: (value, row) => {
          //     return row.Purchase_Date
          //       ? ConvertStr.ToDateStr(addMonth(row.Purchase_Date, value))
          //       : value;
          //   },
          // }),
          // new TablePagingCol({
          //   title: "Bảo trì",
          //   data: "Maintenance",
          //   min_width: 150,

          //   sortable: false,
          //   formatter: (value) => {
          //     return value ? "Có" : "Không";
          //   },
          // }),
          new TablePagingCol({
            title: "Khấu hao dự kiến",
            data: "Estimated_Life_Min",
            min_width: 150,
            sortable: false,
          }),

          new TablePagingCol({
            title: "Ghi chú",
            data: "Note",
            min_width: 150,
            sortable: false,
          }),
        ],
      }),
    };
  },
  methods: {
    LoadTable() {
      GetDataAPI({
        url: API.Reports_Khauhao,
        params: {
          iMonth: this.tp.params.iMonth,
          iOffice_id: this.tp.params.iOffice_id,
        },
        action: (re) => {
          this.tp.data = re;
          this.LoadData();
        },
      });
    },
    LoadData() {
      // this.tp.params.iMonth =  ;
      this.$refs.tp.LoadData(true);
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
    this.LoadTable();
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
