<template>
  <div style="height: 100%">
    <TablePaging ref="tp" :model="tp">
      <template slot="btn2">
        <InputContainer
          style="width: 250px; padding-left: 10px"
          label="Trạng thái"
          :labelWidth="90"
        >
          <InputSelect
            style="width: 100%"
            v-model="tp.params.iState"
            :model="Para.TransferRecivedState"
        /></InputContainer>
      </template>
      <template slot="column-content-cn" slot-scope="{ row }">
        <div>
          <p>{{ Para.Para_Office.getName(row.From_Office_id) }}</p>
          <p>{{ store.getName(Number(row.From_Department_id)) }}</p>
          <p>
            {{ Para.Para_Account.getName(row.Trasnfer_user) }}
          </p>
        </div>
      </template>
      <template slot="column-content-bn" slot-scope="{ row }">
        <div>
          <p>{{ Para.Para_Office.getName(row.To_Office_id) }}</p>
          <p>{{ store.getName(Number(row.To_Department_Id)) }}</p>
          <p>
            {{ Para.Para_Account.getName(row.Receive_user) }}
          </p>
        </div>
      </template>
      <template slot="column-content-Approved_User" slot-scope="{ row }">
        <div>
          <p>{{ Para.Para_Account.getName(row.Approved_User) }}</p>
          <p class="state" :style="{ color: getColor(row.State) }">
            {{ Para.TransferState.getName(row.State) }}
          </p>
          <p>
            {{ row.Receive_Reason }}
          </p>
        </div>
      </template>

      <template slot="column-content-button" slot-scope="{ row }">
        <div style="display: flex">
          <el-button
            @click="
              formDetail.ShowForm('Thông tin tài sản luân chuyển', false, row)
            "
            class="icon-btn"
            type="primary"
          >
            <i class="fa fa-eye" aria-hidden="true"></i>
          </el-button>
          <div v-if="row.State == 2" style="display: flex">
            <el-tooltip content="Nhận tài sản" placement="top">
              <el-button  style="margin-left: 5px;" @click="Approve(row)" class="icon-btn" type="primary">
                <i class="fa fa-hand-paper-o" aria-hidden="true"></i></el-button>
            </el-tooltip>

            <el-tooltip content="Từ chối" placement="top">
              <el-button  style="margin-left: 5px;" @click="Reject(row)" class="icon-btn" type="warning">
                <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
              </el-button>
            </el-tooltip>
          </div>
        </div>
      </template>
    </TablePaging>

    <DefaultForm :model="form" @actionOK="form.Save.call(this)">
      <div slot="content">
        <FormInfo ref="form" :model="obj.form()" />
      </div>
    </DefaultForm>

    <DefaultForm
      :model="formDetail"
      @Reject="formDetail.Rj.call(this)"
      @actionOK="formDetail.Save.call(this)"
    >
      <div class="form" style="height: 100%" slot="content">
        <FormInfo ref="formDetail" :model="formDetail.obj.form()" />
      </div>
    </DefaultForm>
  </div>
</template>

<script>
import API from "~/assets/scripts/API";
import TablePaging from "~/assets/scripts/base/TablePaging";
import TablePagingCol from "~/assets/scripts/base/TablePagingCol";
import DefaultForm from "~/assets/scripts/base/DefaultForm";
import AprovedST from "~/assets/scripts/objects/AprovedST";
import { EventBus } from "~/assets/scripts/EventBus.js";
import GetDataAPI from "~/assets/scripts/GetDataAPI";
import { SelectOption } from "~/assets/scripts/base/SelectOption";
import Fixed_Asset_Manager from "~/assets/scripts/objects/fixed_assets/Fixed_Asset_Manager";
import transfer_fa from "~/assets/scripts/objects/fixed_assets/transfer_fa";

import {
  MessageType,
  ShowConfirm,
  ShowMessage,
} from "~/assets/scripts/Functions";
import { Para } from "~/assets/scripts/Para";
import APIHelper from "~/assets/scripts/API/APIHelper";
export default {
  data() {
    return {
      isAdd: null,
      store: new SelectOption({ data: [] }),
      obj: new AprovedST(),
      tp: new TablePaging({
        title: "Tiêu đề",
        data: [],
        params: {
          iState: 2 ,
        },
        disableSelectRow: true,

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
            align: "center",
            fix: "right",
          }),
        ],
      }),
      formDetail: new DefaultForm({
        obj: new transfer_fa(),
        OKtext: "Duyệt",
        btns: [{ Id: 1, text: "Từ chối", action: "Reject", type: "warning" }],

        visible: false,
        // type: "dialog",
        fullscreen: true,
        title: "Tài sản luân chuyển",

        ShowForm: (title, isAdd, obj) => {
          this.isAdd = isAdd;
          if (this.tp.params.iState != 2) {
            this.formDetail.type = "dialog";
          }

          if (!isAdd) {
            obj.From_Department_id = Number(obj.From_Department_id);
            obj.To_Department_Id = Number(obj.To_Department_Id);
          }

          this.formDetail.obj = new transfer_fa({
            Info: new Fixed_Asset_Manager(obj),
            isAdd: isAdd,
            disBtn: true,
            iFixed_Asset_Manager_id: !isAdd ? obj.Id : "",
          });

          this.formDetail.visible = true;

          // console.log(this.form.obj);
        },
        Save: () => {
          // console.log(this.formDetail.obj.toJSON().Info)
          // return;
          this.Approve(this.formDetail.obj.toJSON().Info);
        },
        Rj: () => {
          // console.log(this.formDetail.obj.toJSON().Info)
          // return;
          this.Reject(this.formDetail.obj.toJSON().Info);
        },
      }),
      form: new DefaultForm({
        title: "",
        visible: false,
        width: "400px",
        Save: () => {
          this.$refs.form.getValidate().then((re) => {
            if (re) {
              GetDataAPI({
                url: API.Manager_Accept,
                params: this.obj.toJSON(),
                method: "POST",

                action: (re) => {
                  ShowMessage("Đã từ nhận", "success");
                  this.LoadData();
                  this.form.visible = false;
                  this.formDetail.visible = false;
                },
              });
            } else {
              ShowMessage("Vui lòng nhập đầy đủ thông tin", "error");
            }
          });
        },
      }),
    };
  },
  watch: {
    "tp.params.iState": {
      deep: true,
      handler: function (n, o) {
        this.$nextTick(() => {
          this.LoadTable();
          // console.log(n)
        });
      },
    },
  },
  methods: {
    LoadTable(){
      GetDataAPI({
        url: API.Manager_GetList_Received,
        params:{
          iState: this.tp.params.iState || 0
        },
        action: re=>{
          this.tp.data = re;
          this.LoadData();
        }
      })
    },
    Reject(row) {
      this.form.title = "Lý do từ chối";
      this.obj.Id = row.Id;
      this.obj.Approved = false;
      // console.log(this.obj);
      this.form.visible = true;
    },
    Approve(row) {
      ShowConfirm({
        message: "Bạn có chắc nhận tài sản này ?",
        title: "Xác nhận",
        type: MessageType.info,
      })
        .then(() => {
          this.obj.Id = row.Id;
      this.obj.Approved = true;

          // return
          GetDataAPI({
            url: API.Manager_Accept,
            params: this.obj.toJSON(),
            method: "POST",

            action: (re) => {
              ShowMessage("Thao tác thành công", "success");
              this.LoadData();
              this.formDetail.visible = false;
            },
          });
          //  this.obj.
        })
        .catch((err) => {
          // An error occurred
        });
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
    LoadData() {
      this.$refs.tp.LoadData(true);
    },
  },

  mounted() {
    // console.log(this.pagePermission);
    this.LoadTable();
    GetDataAPI({
      url: API.dm_department_Get_List,
      params: {
        Office_id: this.tp.params.Office_id,
      },
      action: (re) => {
        this.store.data = re;
      },
    });
  },
};
</script>

<style lang="scss" scoped>
.state {
  font-weight: bold;
  [color] {
  }
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
