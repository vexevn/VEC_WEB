<template>
  <div style="height: 100%" class="pi-c">
    <ProjectInfoManage
      :type="0"
      style="flex: 1"
      @onPickProject="handlePockProject"
    />
    <ProjectInfoManage
      :type="1"
      style="flex: 0 0 300px"
      :project_code="project_code"
    />
    <ProjectInfoManage
      :type="2"
      style="flex: 0 0 300px"
      :project_code="project_code"
    />
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
export default {
  data() {
    return {
      project_code: "",
      // isAdd: null,
      // tp: new TablePaging({
      //   title: "Tiêu đề",
      //   data: [],
      //   disableSelectRow: true,
      //   clickRow: (row, column) => {
      //     this.handleRowClick(row, column);
      //   },
      //   spanMethod({ row, column, rowIndex, columnIndex }) {
      //     if (row.type == 1) {
      //       if (columnIndex == 2) {
      //         return [1, 2];
      //       }
      //       if (columnIndex == 3) {
      //         return [0, 0];
      //       }
      //     }
      //   },
      //   cols: [
      //     new TablePagingCol({
      //       title: "STT",
      //       data: "SttTP",
      //       min_width: 65,
      //       align: "right",
      //     }),

      //     new TablePagingCol({
      //       title:  "Số hợp đồng",
      //       data: "Project_Code",
      //       min_width: 120,
      //     }),
      //     new TablePagingCol({
      //       title: "Project Name",
      //       data: "Value_Code",
      //       min_width: 240,
      //       width: "auto",
      //     }),

      //     new TablePagingCol({
      //       title: "",
      //       data: "button",
      //       min_width: 80,

      //       fix: "right",
      //       align: "center",
      //       sortable: false,
      //     }),
      //   ],
      // }),
      // form: new DefaultForm({
      //   obj: new Project_Info(),
      //   title: "",
      //   visible: false,
      //   width: "800px",
      //   ShowForm: (title, isAdd, obj) => {
      //     this.isAdd = isAdd;
      //     var _app = this;
      //     if (obj) {
      //       this.form.obj = new Project_Info({
      //         Project_Code: obj.Code,
      //         Project_id: obj.Id,
      //         Project_Name: obj.Name,
      //         Details: obj.Details,
      //       });
      //     } else this.form.obj = new Project_Info(obj);
      //     this.form.title = title;

      //     this.form.visible = true;
      //   },
      //   Save: () => {
      //     this.Save();
      //   },
      // }),
    };
  },
  methods: {
    handlePockProject(row) {
      this.project_code = row ? row.Project_Code : "";
    },
    handleRowClick(row, column, event) {
      if (column) this.$refs.tp.$refs.tpRef.toggleRowExpansion(row);
    },
    ProcessData(rawData) {
      let data = JSON.parse(JSON.stringify(rawData));
      data.forEach((p) => {
        p.Childs = [];
        if (p.Id) {
          p.type = 1;
          p.Award_Code = p.Name;
        }

        if (p.Award_id || p.Task_id) p.type = 2;
        p.Idtree =
          p.type === 1
            ? p.Id + "_" + "P"
            : p.Award_id + "_" + p.Task_id + "_" + "A";
        if ((p.Details || []).length > 0) {
          p.Childs = this.ProcessData(p.Details);
        }
      });
      return data;
    },
    LoadData() {
      GetDataAPI({
        url: API.Get_Project_Info,
        action: (re) => {
          this.tp.data = this.ProcessData(re);
          console.log(this.tp.data);
          this.$refs.tp.LoadData(true);
        },
      });
    },
    Add() {
      this.form.ShowForm("Add Type of Competition", true, null);
    },
    Edit(row) {
      this.form.ShowForm("Edit Type of Competition", false, row);
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
    Save() {
      var _app = this;
      this.$refs.form.getValidate().then((re) => {
        if (!re) {
          ShowMessage(
            "Vui lòng nhập đầy đủ thông tin!",
            MessageType.error
          );
          return;
        } else {
          GetDataAPI({
            method: "post",
            url: API.Save_Project_Info,
            params: this.form.obj.toJSON(),
            action: (re) => {
              this.LoadData();
              console.log(re);
              if (this.isAdd) {
                this.form.obj.Project_id = re;
              }
              this.$refs.form.getEntry("formProjectSave").LoadData();
              ShowMessage("Lưu thành công");
              // this.form.visible = false;
            },
          });
        }
      });
    },
    ReSync() {
      new Promise(() => {
        GetDataAPI({
          url: API.Project_Info_CheckReSync,
          action: (re) => {
            if (re) {
              ShowMessage("Project Info is syncing");
            } else {
              ShowConfirm({
                message: "Are you sure?",
              }).then(() => {
                GetDataAPI({
                  url: API.Project_Info_ReSync,
                  method: "post",
                  action: (re) => {
                    location.reload();
                  },
                });
              });
            }
          },
        });
      });
    },
  },
  beforeMount() {
    EventBus.$on("ReSync", this.ReSync);
  },
  beforeDestroy() {
    EventBus.$off("ReSync", this.ReSync);
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.pi-c {
  display: flex;
  // flex-direction: column;
  > * {
    margin-right: 10px;
  }
}
</style>
