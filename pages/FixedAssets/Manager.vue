<template>
  <div style="height: 100%; overflow: hidden">
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
          class="icon-btn"
          v-if="pagePermission.add"
          type="primary"
          @click="Add()"
        >
          <i class="el-icon-plus"></i
        ></el-button>
      </template>

      <template slot="column-content-cn" slot-scope="{ row }">
        <div>
          <p>{{ Para.Para_Office.getName(row.From_Office_id) }}</p>
          <p>{{ store.getName(Number(row.From_Department_id)) }}</p>
          <p>
            {{
              Para.Para_Account.getName(
                store
                  .set((p) => {
                    p.label = "Manager_id";
                  })
                  .getName(Number(row.From_Department_id))
              )
            }}
            <!-- {{ row.Trasnfer_user }} -->
          </p>
        </div>
      </template>
      <template slot="column-content-bn" slot-scope="{ row }">
        <div>
          <p>{{ Para.Para_Office.getName(row.To_Office_id) }}</p>
          <p>{{ store.getName(Number(row.To_Department_Id)) }}</p>
          <p>
            {{
              Para.Para_Account.getName(
                store
                  .set((p) => {
                    p.label = "Manager_id";
                  })
                  .getName(Number(row.To_Department_Id))
              )
            }}
          </p>
        </div>
      </template>
      <template slot="column-content-Approved_User" slot-scope="{ row }">
        <div>
          <p>{{ Para.Para_Account.getName(row.Approved_User) }}</p>
          <p :style="{ color: getColor(row.State), fontWeight: 'bold' }">
            {{ Para.TransferState.getName(row.State) }}
          </p>
          <p v-if="row.State == 3">
            {{ row.Manager_Reason }}
          </p>
          <p v-if="row.State == 4">
            {{ row.Receive_Reason }}
          </p>
        </div>
      </template>

      <template slot="column-content-button" slot-scope="{ row }">
        <div style="display: flex">
          <el-button
            class="icon-btn"
            v-if="pagePermission.edit"
            type="warning"
            @click="Edit(row)"
          >
            <i class="el-icon-edit"></i
          ></el-button>
          <el-button
            class="icon-btn"
            v-if="pagePermission.delete"
            type="danger"
            @click="Delete(row)"
          >
            <i class="el-icon-delete"></i
          ></el-button>
          <!-- <el-button
            class="icon-btn"
            v-if="row.State == 5"
            type="primary"
            @click="Print(row)"
          >
          <i class="fa fa-print" aria-hidden="true"></i></el-button> -->
        </div>
      </template>
    </TablePaging>

    <DefaultForm :model="form" @Print="Print()" @actionOK="Save()">
      <div class="form" style="height: 100%" slot="content">
        <FormInfo ref="form" :model="form.obj.form()" />
      </div>
    </DefaultForm>
    <DefaultForm :model="formFilter" @actionOK="Search()">
      <div slot="content">
        <FormInfo :model="tp.params.form4()" />
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
import Fixed_Asset_Inventory_Filter from "~/assets/scripts/objects/fixed_assets/Fixed_Asset_Inventory_Filter";

import ConvertStr from "~/assets/scripts/ConvertStr";
import Fixed_Asset_Manager from "~/assets/scripts/objects/fixed_assets/Fixed_Asset_Manager";
import { SelectOption } from "~/assets/scripts/base/SelectOption";
export default {
  data() {
    return {
      isAdd: null,
      store: new SelectOption({ data: [] }),
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
        btns: [{ Id: 1, text: "In phiếu", action: "Print", type: "warning" }],

        visible: false,
        // type: "dialog",
        fullscreen: true,
        title: "Luân chuyển tài sản",
        ShowForm: (title, isAdd, obj) => {
          this.isAdd = isAdd;

          if (!isAdd) {
            obj.From_Department_id = Number(obj.From_Department_id);
            obj.To_Department_Id = Number(obj.To_Department_Id);
          } else {
            obj.DateCreate = new Date();
            obj.UserCreate = this.user.UserSerial;
          }

          this.form.obj = new transfer_fa({
            Info: new Fixed_Asset_Manager(obj),
            isAdd: isAdd,
            iFixed_Asset_Manager_id: !isAdd ? obj.Id : "",
          });

          this.form.visible = true;

          // console.log(this.form.obj);
        },
      }),
      tp: new TablePaging({
        title: "Danh sách chuyển tài sản",
        data: [],
        data: API.Manager_GetList,
        // disableSelectRow: true,
        params: new Fixed_Asset_Inventory_Filter(),

        cols: [
          new TablePagingCol({ title: "STT", data: "SttTP", min_width: 65 }),
          new TablePagingCol({
            title: "Ngày thực hiện",
            data: "Start_Date",
            formatter: "date",
            min_width: 130,
          }),
          new TablePagingCol({
            title: "Bên giao",
            data: "cn",
            sortable: false,
            min_width: 200,
            width: "auto",
          }),
          new TablePagingCol({
            title: "Bên nhận",
            width: "auto",

            data: "bn",
            sortable: false,
            min_width: 200,
          }),
          // new TablePagingCol({
          //   title: "Bên chuyển nhượng",
          //   sortable: false,
          //   children: [
          //     new TablePagingCol({
          //       title: "Văn phòng",
          //       width: "auto",
          //       min_width: 200,
          //       data: "From_Office_id",
          //       formatter: (value) => Para.Para_Office.getName(value),
          //     }),
          //     new TablePagingCol({
          //       title: "Phòng ban",
          //       width: "auto",
          //       min_width: 150,
          //       data: "From_Department_id",
          //       // formatter:(value)=> this.store.getName(Number(value)),
          //     }),
          //   ],
          // }),
          // new TablePagingCol({
          //   title: "Bên nhận",
          //   children: [
          //     new TablePagingCol({
          //       title: "Văn phòng",
          //       width: "auto",
          //       data: "To_Office_id",
          //       min_width: 200,
          //       formatter: (value) => Para.Para_Office.getName(value),
          //     }),
          //     new TablePagingCol({
          //       title: "Phòng ban",
          //       data: "To_Department_Id",
          //       width: "auto",
          //       min_width: 150,
          //       // formatter:(value)=> this.store.getName(Number(value)),
          //     }),
          //   ],
          // }),
          new TablePagingCol({
            title: "Người duyệt",
            data: "Approved_User",
            min_width: 150,
            sortable: false,
            formatter: (value) => Para.Para_Account.getName(value),
          }),
          new TablePagingCol({
            title: "Ghi chú",
            data: "Description",
            min_width: 270,
            sortable: false,
          }),
          new TablePagingCol({
            title: "",
            data: "button",
            min_width: 100,
            sortable: false,
            // align: "center",
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
    Print() {
      localStorage.dataPrint = JSON.stringify(this.form.obj);
      console.log(this.form.obj);
      window.open("/Print/PhieuLuanChuyen");

      // console.log(this.form.obj)
    },
    getColor(state) {
      switch (state) {
        // case 1:
        //   return 'black';
        case 2:
          return "blue";
        case 3:
          return "red";
        case 4:
          return "red";
        case 5:
          return "green";
        default:
          return "black";
      }
    },
    Save() {
      this.$refs.form.getValidate().then((re) => {
        if (!re) {
          ShowMessage("Vui lòng nhập đầy đủ thông tin!", MessageType.error);
          return;
        } else {
          if (!this.form.obj.toJSON().Info.To_Department_Id) {
            this.form.obj.toJSON().Info.To_Department_Id = 0;
          }
          if (!this.form.obj.toJSON().Info.From_Department_id) {
            this.form.obj.toJSON().Info.From_Department_id = 0;
          }
          this.form.obj.toJSON().Info._formElements = undefined;
          GetDataAPI({
            url: this.isAdd ? API.Manager_Add : API.Manager_Edit,
            params: this.isAdd
              ? this.form.obj.toJSON()
              : this.form.obj.toJSON().Info,
            method: "post",
            action: (re) => {
              this.LoadTable();
              ShowMessage("Lưu thành công", "success");
              this.form.visible = false;
            },
          });
        }
      });
    },

    Delete(row) {
      ShowConfirm({
        message: "Xóa luân chuyển",
        title: "Cảnh báo!",
        type: MessageType.warning,
      })
        .then(() => {
          GetDataAPI({
            method: "POST",
            url: API.Manager_Delete,
            params: row,
            action: (re) => {
              if (re == "OK") {
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

    LoadTable() {
      // console.log(this.tp.params.Office_id)
      GetDataAPI({
        url: API.Manager_GetList,
        params: {
          Office_id: this.tp.params.Office_id,
          FromDate: this.tp.params.FromDate,
          ToDate: this.tp.params.ToDate,
          // iFixed_Asset_Manager_id: this.data.iFixed_Asset_Manager_id,
          // Store_id: this.data.Info.From_Department_id,
        },
        action: (re) => {
          this.tp.data = re;
          this.LoadData();
        },
      });
    },
    Add() {
      this.form.ShowForm("abc", true, {});
    },
    Edit(row) {
      this.form.ShowForm("abc", false, row);
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
    // this.LoadTable();
    // this.LoadData();

    GetDataAPI({
      url: API.dm_department_Get_List,
      params: {
        Office_id: this.tp.params.Office_id,
      },
      action: (re) => {
        this.store.data = re;
        Para.dm_department.data = re;
      },
    });
  },
};
</script>

<style lang="scss" scoped>
.icon-btn {
  margin-left: 5px !important;
}
.form {
  ::v-deep .form-info {
    height: 100%;
    .form-info-c {
      height: 100%;
    }
  }
}
</style>
