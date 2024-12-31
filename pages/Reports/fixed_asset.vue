<template>
  <div style="height: 100%; display: flex">
    <div v-if="!isIndividual" style="padding: 5px 0 0 5px; height: 100%">
      <Office
        ref="of"
        @asChange="handleASChange"
        :data="dataOF"
        :obj="tp.params"
      />
    </div>
    <div style="width: 100%; height: 100%; overflow: auto">
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
    </div>

    <!-- <DefaultForm :model="formFilter" @actionOK="Search()">
      <div slot="content">
        <FormInfo :model="tp.params.form()" />
      </div>
    </DefaultForm> -->
  </div>
</template>

<script>
import API from "~/assets/scripts/API";
import TablePaging from "~/assets/scripts/base/TablePaging";
import TablePagingCol from "~/assets/scripts/base/TablePagingCol";
import DefaultForm from "~/assets/scripts/base/DefaultForm";
import Office from "~/pages/FixedAssets/Office.vue";

import GetDataAPI from "~/assets/scripts/GetDataAPI";
import {
  addMonth,
  GetTimeNow,
  MessageType,
  ShowConfirm,
  ShowMessage,
} from "~/assets/scripts/Functions";
import { Para } from "~/assets/scripts/Para";
import report_Fa from "~/assets/scripts/objects/fixed_assets/report_Fa";
import ConvertStr from "~/assets/scripts/ConvertStr";
export default {
  components: {
    Office,
  },
  watch: {
    "tp.params": {
      deep: true,
      handler() {
        this.$nextTick(() => {
          // if (this.tp.params.Type || this.tp.params.User_ID) {
          //   this.tp.params.From = "";
          //   this.tp.params.To = "";
          // }
          console.log("aklc");
          this.LoadTable();
        });
      },
    },
  },
  data() {
    return {
      isAdd: null,
      dataOF: [],
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
        data: [],
        disableSelectRow: true,
        params: {
          From: "",
          To: "",
          Office_id: 0,
          Project_Code: "",
          State: 0,
          Type: "",
          User_ID: "",
          Department_id: 0,
          Group_id: 0,
          Use_Type_id: 0,
        },
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
            title: "Phòng ban",
            data: "Department_id",
            min_width: 150,
            sortable: false,
            formatter: (value) => Para.dm_department.getName(value),
          }),
          // new TablePagingCol({
          //   title: "Đối tượng sử dụng",
          //   data: "Use_Type_id",
          //   min_width: 170,
          //   sortable: false,
          //   formatter: (value) => Para.TransferType.getName(value),
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
          // new TablePagingCol({
          //   title: "Người sử dụng",
          //   data: "Person_id",
          //   min_width: 170,
          //   sortable: false,
          //   formatter: (value) => Para.Para_Account.getName(value),
          // }),
           new TablePagingCol({
            title: "Ngày tính bảo hành",
            data: "Purchase_Date",
            min_width: 130,
            sortable: false,
            formatter: "date",
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
            title: "Thời hạn bảo hành",
            data: "Warranty_Period",
            min_width: 150,
            sortable: false,
            formatter: (value, row) => {
              return row.Purchase_Date
                ? ConvertStr.ToDateStr(addMonth(row.Purchase_Date, value))
                : value;
            },
          }),
          new TablePagingCol({
            title: "Bảo trì",
            data: "Maintenance",
            min_width: 100,
            sortable: false,
            formatter: (value) => {
              return value ? "Có" : "Không";
            },
          }),
          new TablePagingCol({
            title: "Khấu hao dự kiến",
            data: "Estimated_Life_Min",
            min_width: 120,
            sortable: false,
          }),
          new TablePagingCol({
            title: "Nguồn tài sản",
            data: "Nguonvon_id",
            min_width: 150,
            sortable: false,
            formatter: value => Para.eNguonvon.getName(value),
          }),
          new TablePagingCol({
            title: "Ghi chú",
            data: "Note",
            min_width: 250,
            sortable: false,
          }),
        ],
      }),
    };
  },
  methods: {
    handleASChange(value) {
      if (value) {
        this.$refs.tp.tempRows = this.tp.data.filter((p) =>
          objContainStr(p.Code, Uni2None(value), false)
        );
      } else {
        this.$refs.tp.tempRows = this.tp.data;
      }
      // console.log("after", newTP);
    },
    LoadTable() {
      GetDataAPI({
        url: API.fixed_asset_Get_List,
        params: this.tp.params,
        action: (re) => {
          this.tp.data = re;
          this.LoadData();
        },
      });
    },
    // abc(){
    //   this.date = addMonth(this.date,4)
    //   console.log(this.date)
    // },
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
    GetDataAPI({
      url: API.Get_List_Office_Asset,
      action: (re) => {
        this.dataOF = re;
        this.tp.params.Office_id = (re[0] || {}).Id || 0;
        // console.log(this.tp.params.Office_id )
        this.$refs.of.activeItem = re[0];
        this.LoadTable();
      },
    });
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
