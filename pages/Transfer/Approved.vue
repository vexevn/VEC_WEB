<template>
  <div style="height: 100%">
    <TablePaging ref="tp" :model="tp">
      <template slot="btn2">
        <InputContainer
          style="width: 220px; padding-left: 10px"
          label="Trạng thái"
          :labelWidth="90"
        >
          <InputSelect
            style="width: 100%"
            v-model="tp.params.iState"
            :model="Para.TransferState"
        /></InputContainer>
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
          <p class="state" :style="{ color: getColor(row.State) }">
            {{ Para.TransferState.getName(row.State) }}
          </p>
          <p>
            {{ row.Manager_Reason }}
          </p>
        </div>
      </template>

      <template slot="column-content-button" slot-scope="{ row }">
      <div style="display:flex">
        <el-tooltip  content="Duyệt" placement="top">
          <el-button class="icon-btn" type="primary">
            <i class="fa fa-check-square" aria-hidden="true"></i
          ></el-button>
        </el-tooltip>



        <el-tooltip content="Từ chối" placement="top">
            <el-button class="icon-btn" type="warning"> <i class="fa fa-exclamation-circle" aria-hidden="true"></i> </el-button>

        </el-tooltip>
      </div>
     
      </template>
    </TablePaging>

    <DefaultForm :model="form" @actionOK="form.Save.call(this)">
      <div slot="content">
        <FormInfo ref="form" :model="form.obj.form()" />
      </div>
    </DefaultForm>
  </div>
</template>

<script>
import API from "~/assets/scripts/API";
import TablePaging from "~/assets/scripts/base/TablePaging";
import TablePagingCol from "~/assets/scripts/base/TablePagingCol";
import DefaultForm from "~/assets/scripts/base/DefaultForm";
import dm_fixed_asset_type from "~/assets/scripts/objects/fixed_asset_group";
import { EventBus } from "~/assets/scripts/EventBus.js";
import GetDataAPI from "~/assets/scripts/GetDataAPI";
import { SelectOption } from "~/assets/scripts/base/SelectOption";

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

      tp: new TablePaging({
        title: "Tiêu đề",
        data: API.Manager_GetList_Approved,
        params: {
          iState: 1,
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
          //   new TablePagingCol({
          //     title: "Lý do",
          //     data: "Receive_Reason",
          //     min_width: 150,
          //     sortable: false,
          //   }),
          new TablePagingCol({
            title: "",
            data: "button",
            min_width: 70,
            sortable: false,
            align: "center",
            fix: "right",
          }),
        ],
      }),
      form: new DefaultForm({
        obj: new dm_fixed_asset_type(),
        title: "",
        visible: false,
        width: "500px",
        ShowForm: (title, isAdd, obj) => {
          this.isAdd = isAdd;
          var _app = this;
          // var obj = null;
          // if (!isAdd) {
          //   obj = obj;
          //   if (!obj) {
          //     ShowMessage("You need choose 1 selection!");
          //     return;
          //   }
          // }
          this.form.title = title;
          this.form.obj = new dm_fixed_asset_type(obj);
          this.form.visible = true;
        },
        Save: () => {
          this.Save();
        },
      }),
    };
  },
  watch: {
    "tp.params.iState": {
      deep: true,
      handler: function (n, o) {
        this.$nextTick(() => {
          this.LoadData();
          // console.log(n)
        });
      },
    },
  },
  methods: {
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
    Add() {
      this.form.ShowForm("Thêm nhóm tài sản", true);
    },
    Edit(row) {
      this.form.ShowForm("Sửa nhóm tài sản", false, row);
    },
    Delete(row) {
      ShowConfirm({
        message: "Xóa [" + row.Name + "]",
        title: "Cảnh báo!",
        type: MessageType.warning,
      })
        .then(() => {
          APIHelper.fixed_asset_group.Delete(row).then((re) => {
            this.LoadData();
            ShowMessage("Xóa thành công");
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
          ShowMessage("Vui lòng nhập đầy đủ thông tin!", MessageType.error);
          return;
        } else {
          if (!this.form.obj.Id) {
            APIHelper.fixed_asset_group
              .Add(this.form.obj.toJSON())
              .then((re) => {
                this.LoadData();
                this.form.visible = false;
                ShowMessage("Lưu thành công");
              });
          } else {
            APIHelper.fixed_asset_group
              .Edit(this.form.obj.toJSON())
              .then((re) => {
                this.LoadData();
                this.form.visible = false;
                ShowMessage("Lưu thành công");
              });
          }
        }
      });
    },
  },

  mounted() {
    // console.log(this.pagePermission);
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
</style>
