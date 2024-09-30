<template lang="">
  <div style="height:100%">
    <TablePaging :model="tp_detail" ref="tp_detail">
      <template slot="column-content-CheckBox" slot-scope="{ row }">
        <el-checkbox v-model="row.CheckBox" style="pointer-events: none" />
      </template>
    </TablePaging>
  </div>
</template>
<script>
import API from "~/assets/scripts/API";
import GetDataAPI from "~/assets/scripts/GetDataAPI";
import TablePaging from "~/assets/scripts/base/TablePaging";

import TablePagingCol from "~/assets/scripts/base/TablePagingCol";

export default {
  props: {
    data: {},
  },
  data() {
    return {
        tp_detail: new TablePaging({
      // disablePaging: true,
      disableSelectRow: true,
    //   LoadDataSuccess: (re) => {
    //     re.forEach((p) => {
    //       p.CheckBox = this.obj.FA_Id_Lists.some((p1) => p1 == p.Id);
    //     });
    //   },
    //   clickRow: (row) => {
    //     // row.CheckBox = !row.CheckBox;
    //     this.CheckItem(row);
    //   },
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
          title: "Tên",
          data: "Name",
          min_width: 200,
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
          data: "Type_id",
          min_width: 150,
          sortable: false,
        //   formatter: (value) => Para.fixed_asset_type_Get_List.getName(value),
        }),
        new TablePagingCol({
          title: "Nhà sản xuất",
          data: "Producer_id",
          min_width: 150,
          sortable: false,
        //   formatter: (value) => Para.producer_Get_List.getName(value),
        }),
        new TablePagingCol({
          title: "Model",
          data: "Model",
          min_width: 150,
          sortable: false,
        }),
      ],
    }),
    }
  },

  mounted() {
    // GetDataAPI({
    //   url: API.Manager_GetDetail + `?`,
    // });
  },
};
</script>
<style lang=""></style>
