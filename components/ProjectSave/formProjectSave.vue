<template>
  <div style="height: 350px">
    <TablePaging ref="tp" :model="tp">
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

      <template slot="column-content-button" slot-scope="{ row }">
        <div style="display: flex">
          <el-button
            v-if="pagePermission.edit"
            class="icon-btn"
            type="primary"
            @click="Edit(row)"
          >
            <i class="el-icon-edit"></i
          ></el-button>
        </div>
      </template>
    </TablePaging>
  </div>
</template>

<script>
import API from "~/assets/scripts/API";
import TablePaging from "~/assets/scripts/base/TablePaging";
import TablePagingCol from "~/assets/scripts/base/TablePagingCol";
import DefaultForm from "~/assets/scripts/base/DefaultForm";
import Project_Info from "~/assets/scripts/objects/Project_Info";
import { EventBus } from "~/assets/scripts/EventBus.js";
import GetDataAPI from "~/assets/scripts/GetDataAPI";
import {
  MessageType,
  ShowConfirm,
  ShowMessage,
} from "~/assets/scripts/Functions";
import { Para } from "~/assets/scripts/Para";
export default {
  props: {
    Project_Info: {
      type: Object,
    },
  },
  data() {
    return {
      isAdd: null,
      tp: new TablePaging({
        title: "Tiêu đề",
        data: [],
        disableSelectRow: true,
        disableControl: true,
        disablePaging: true,
        // clickRow: (row, column) => {
        //   this.handleRowClick(row, column);
        // },
        cols: [
          new TablePagingCol({
            title: "Award Code",
            data: "Award_Code",
            min_width: 120,
            width: "auto",
          }),
          new TablePagingCol({
            title: "Task Code",
            data: "Task_Code",
            min_width: 120,
          }),

          new TablePagingCol({
            title: "",
            data: "button",
            min_width: 80,

            fix: "right",
            align: "center",
            sortable: false,
          }),
        ],
      }),
    };
  },
  methods: {
    handleRowClick(row, column, event) {
      this.Project_Info.Award_id = row.Award_id;
      this.Project_Info.Award_Code = row.Award_Code;
      this.Project_Info.Task_id = row.Task_id;
      this.Project_Info.Task_Code = row.Task_Code;
    },
    LoadData() {
      if (this.Project_Info.Project_id)
        GetDataAPI({
          url: API.Get_Info_Project_Info,
          params: {
            iProject_id: this.Project_Info.Project_id,
          },
          action: (re) => {
            this.tp.data = re.Details;
            this.$refs.tp.LoadData(true);
          },
        });
      else {
        this.tp.data = [];
        this.$refs.tp.LoadData(true);
      }
    },
    Add() {
      this.Project_Info.Award_id = null;
      this.Project_Info.Award_Code = null;
      this.Project_Info.Task_id = null;
      this.Project_Info.Task_Code = null;
    },
    Edit(row) {
      this.handleRowClick(row);
    },
    Delete(row) {
      ShowConfirm({
        message: "Xóa [" + row.Name + "]",
        title: "Xác nhận!",
        type: MessageType.warning,
      })
        .then(() => {
          GetDataAPI({
            method: "POST",
            url: API.Delete_Project_Info,
            params: row,
            action: (re) => {
              if (re == "OK") {
                this.LoadData();
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
  },
  mounted() {
    this.LoadData();
  },
};
</script>

<style lang="scss" scoped>
</style>
