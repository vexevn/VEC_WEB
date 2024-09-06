<template>
  <div style="height: 100%">
    <div style="display: flex; margin: 5px">
      <FormInfo
        :model="param.form()"
        @onChanged="LoadData()"
        v-once
        style="max-width: 215px; width: 100%"
      />
    </div>
    <TablePaging ref="tp" :model="tp"> </TablePaging>
  </div>
</template>

<script>
import API from "~/assets/scripts/API";
import TablePaging from "~/assets/scripts/base/TablePaging";
import TablePagingCol from "~/assets/scripts/base/TablePagingCol";
import DefaultForm from "~/assets/scripts/base/DefaultForm";
import ParamHistoryCurrency from "~/assets/scripts/objects/ParamHistoryCurrency";
import { EventBus } from "~/assets/scripts/EventBus.js";
import GetDataAPI from "~/assets/scripts/GetDataAPI";
import {
  MessageType,
  ShowConfirm,
  ShowMessage,
} from "~/assets/scripts/Functions";
import { Para } from "~/assets/scripts/Para";
import ConvertStr from "~/assets/scripts/ConvertStr";
export default {
  props: {
    row: {
      typeof: Object,
    },
  },
  data() {
    return {
      isAdd: null,
      activeName: "Present",
      param: new ParamHistoryCurrency(),
      tp: new TablePaging({
        title: "Tiêu đề",
        data: [],
        disableSelectRow: true,

        cols: [
          new TablePagingCol({ title: "STT", data: "SttTP", min_width: 65 }),
          new TablePagingCol({
            title: "From currency",
            data: "Currency_Code",
            min_width: 150,
          }),
          //   new TablePagingCol({
          //     title: "To currency",
          //     data: "To_Currency_Code",
          //     min_width: 150,
          //     formatter: (value) => "CHF",
          //   }),
          new TablePagingCol({
            title: "Conversion Rate",
            data: "Percent",
            min_width: 150,
          }),

          new TablePagingCol({
            title: "Người cập nhật",
            data: "UserCreate",
            min_width: 160,
          }),
          new TablePagingCol({
            title: "Ngày cập nhật",
            data: "DateCreate",
            min_width: 150,
            formatter: (value) =>
              ConvertStr.ToDateStr(value, "DD MMM yyyy, hh:mm"),
          }),
          new TablePagingCol({
            width: "auto",
          }),
        ],
      }),
    };
  },
  methods: {
    LoadData() {
      GetDataAPI({
        url: API.Get_History,
        params: this.param,
        action: (re) => {
          this.tp.data = re;
          this.$refs.tp.LoadData(true);
          console.log(re);
        },
      });
    },
  },
  watch: {
    row() {
      console.log(this.row);
      this.param.iCode = this.row.Currency_Code;
    },
  },
  //   beforeMount() {
  //     EventBus.$on("Add", this.Add);
  //   },

  //   beforeDestroy() {
  //     EventBus.$off("Add", this.Add);
  //   },
  mounted() {
    this.LoadData();
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-tabs__header {
  margin: 0px 0px 8px 8px;
}
::v-deep .el-tabs__content {
  height: calc(100% - 55px);
}
</style>
