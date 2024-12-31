<template>
  <div style="height: 100%">
    <TablePaging ref="tp" :model="tp">
      <template slot="btn">
        <el-tooltip
          class="item"
          effect="dark"
          content="Tải lên file"
          placement="top-start"
        >
          <el-button style="margin: 0 5px" type="primary" @click="showFilter()">
            <i style="margin-right: 5px" class="el-icon-upload2"></i>
            Import file
          </el-button>
        </el-tooltip>
      </template>
    </TablePaging>
    <input @change="onChangeFile" type="file" ref="fileInput" hidden />
    <DefaultForm :model="formFilter" @actionOK="Search()">
      <div style="overflow: hidden" slot="content">
        <!-- <FormInfo :model="tp.params.form2()" /> -->
        <!-- {{ formFilter. }} -->
        <el-button
          style="margin: 0 5px"
          type="primary"
          @click="showFilter()"
          >{{ formFilter.fileName }}</el-button>
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
      file: "",
      //   filter: ,
      formFilter: new DefaultForm({
        OKtext: "Tải lên",
        // visible: true,
        // type: "dialog",
        width: "400px",
        fileName: "",
        title: "Tải lên tệp",
      }),
      tp: new TablePaging({
        // title: "Tiêu đề",
        data: API.RFManage_Get_List,
        disableSelectRow: true,

        cols: [
          new TablePagingCol({ title: "STT", data: "SttTP", min_width: 65 }),
          new TablePagingCol({
            title: "Mã RF",
            data: "RF_Id",
            min_width: 270,
            sortable: false,
          }),
          new TablePagingCol({
            title: "Mã QR",
            data: "QRCode",
            min_width: 120,
            sortable: false,
          }),
          new TablePagingCol({
            title: "Loại RF",
            data: "RF_Type",
            min_width: 120,
            sortable: false,
            formatter: (value) => Para.RF_Type.getName(value),
          }),
          new TablePagingCol({
            title: "Tình trạng",
            data: "Fixed_id",
            min_width: 150,
            sortable: false,
            formatter: (value) => {
              if (value > 0) return "Đã sử dụng";
              else return "Chưa sử dụng";
            },
          }),
          new TablePagingCol({
            title: "Tệp đính kèm",
            data: "FileName",
            width: "auto",

            sortable: false,
          }),
        ],
      }),
    };
  },
  methods: {
    ImportFile(file) {
      let data = new FormData();
      data.append("file", file);
      GetDataAPI({
        method: "post",
        url: API.RFManage_UploadFile,
        params: data,
        action: (re) => {
          this.LoadData();
          this.formFilter.visible = false;

          ShowMessage({
            type: MessageType.success,
            message: "Tải lên thành công",
          });
        },
      });
    },

    onChangeFile() {
      // return (((this.$refs.fileInput|| {}).files || [])[0] || {}).name || '';
      console.log(this.$refs.fileInput.files);
      if (this.$refs.fileInput.files.length > 0) {
        this.formFilter.fileName = this.$refs.fileInput.files[0].name;
      }
      this.formFilter.visible = true;
    },
    LoadData() {
      this.$refs.tp.LoadData(true);
    },
    Search() {
      //   this.LoadData();
      this.ImportFile(this.$refs.fileInput.files[0]);
    },
    showFilter() {
      this.$refs.fileInput.click();
    },
  },

  mounted() {
    // GetDataAPI({
    //     url: API.RFManage_Get_List,
    //     // params: {},
    //     action: (res) => {
    //         // this.tp.data = res.data;
    //     },
    // })
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
