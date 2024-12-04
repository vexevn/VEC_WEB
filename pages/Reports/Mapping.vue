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
      <div  style="overflow: hidden;" slot="content">
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
        // title: "Tiêu đề",
        data: API.Get_Asset_Mapping,
        disableSelectRow: true,
        params: new Fixed_Asset_Inventory_Filter(),
        cols: [
          new TablePagingCol({ title: "STT", data: "SttTP", min_width: 65 }),
          new TablePagingCol({
            title: "Mã tài sản",
            data: "Code",
            min_width: 170,
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
            title: "Số Serial",
            data: "Serial",
            min_width: 130,
            sortable: false,
          }),
          new TablePagingCol({
            title: "Ngày tính bảo hành",
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
                title: "Vị trí",
                data: "Curent_Holder_Id",
                min_width: 150,
                sortable: false,
                formatter: (value, row) => {
                  return Para.store_Get_List
                    .set(
                      (p) =>
                        (p.data = p.data.filter((p1) => {
                          if (row.Office_id == p1.Office_id) {
                            if (row.Use_Type_id == 2)
                              if (p1.isStore == 1) return true;
                            if (row.Use_Type_id == 3)
                              if (p1.isStore == 2) return true;
                            if (row.Use_Type_id == 4)
                              if (p1.isStore == 3) return true;
                            if (row.Use_Type_id == 5)
                              if (p1.isStore == 4) return true;
                            if (row.Use_Type_id == 6)
                              if (p1.isStore == 5) return true;
                            if (row.Use_Type_id == 7)
                              if (p1.isStore == 6) return true;
                            if (row.Use_Type_id == 8)
                              if (p1.isStore == 7) return true;
                          }
                          return false;
                        }))
                    )
                    .getName(value);
                },
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
            title: "Số hợp đồng",
            data: "Project_Code",
            min_width: 150,
            sortable: false,
          }),

          new TablePagingCol({
            title: "QR Code",
            data: "QRCode",
            min_width: 160,
            sortable: false,
          }),
          new TablePagingCol({
            title: "Mã RF",
            data: "RF_Id",
            min_width: 120,
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
    LoadData() {
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

  mounted() {},
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
