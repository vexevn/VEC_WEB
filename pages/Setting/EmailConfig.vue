
<template>
  <div style="height: 100%">
    <TablePaging ref="tp"
                 :model="tp.model">
      <template slot="column-header-button">
        <el-button class="icon-btn icon-btn"
                   v-if="pagePermission.add"
                   type="primary"
                   @click="Add()">
          <i class="el-icon-plus"></i></el-button>
      </template>
      <template slot="column-content-button"
                slot-scope="{ row }">
        <div style="display: flex">
          <!-- <el-button
            v-if="pagePermission.SendTest"
            class="icon-btn"
            type="primary"
            @click="SendTest(row)"
          >
            <i class="fa fa-paper-plane"></i
          ></el-button> -->
          <el-button v-if="pagePermission.edit"
                     class="icon-btn"
                     type="primary"
                     @click="Edit(row)">
            <i class="el-icon-edit"></i></el-button>
          <el-button v-if="pagePermission.delete"
                     class="icon-btn"
                     type="danger"
                     @click="Delete(row)">
            <i class="el-icon-delete"></i>
          </el-button>
        </div>
      </template>
    </TablePaging>

    <DefaultForm :model="form"
                 @actionOK="Save()"
                 @send="SendTest()">
      <div slot="content">
        <FormInfo :model="obj.form()"
                  ref="form" />
      </div>
    </DefaultForm>
    <DefaultForm :model="formSend"
                 @actionOK="ProcessSend()">
      <div slot="content">
        <FormInfo :model="objSend.form()"
                  ref="form" />
      </div>
    </DefaultForm>
  </div>
</template>

<script>
import {
  GetTimeNow,
  MessageType,
  ShowConfirm,
  ShowMessage,
} from "~/assets/scripts/Functions";
import TablePaging from "~/assets/scripts/base/TablePaging";
import TablePagingCol from "~/assets/scripts/base/TablePagingCol";
import EmailConfig from "~/assets/scripts/objects/EmailConfig";
import EmailConfigSend from "~/assets/scripts/objects/EmailConfigSend";
import APIHelper from "~/assets/scripts/API/APIHelper";
import { Para } from "~/assets/scripts/Para";

export default {
  data() {
    return {
      tp: {
        tpRef: "EmailConfigTable",
        model: new TablePaging({
          title: "Danh sách EmailConfig",
          data: APIHelper.EmailConfig.GetList,
          formatter: (re) => re.map((p) => new EmailConfig(p)),
          params: {},
          disableSelectRow: true,
          cols: [
            new TablePagingCol({
              data: "Type",
              title: new EmailConfig()._formElements["Type"].label,
              formatter: (value) => Para.EmailConfigType.getName(value),
            }),

            new TablePagingCol({
              data: "Title",
              title: new EmailConfig()._formElements["Title"].label,
              min_width: 300,
            }),

            new TablePagingCol({
              data: "Description",
              title: new EmailConfig()._formElements["Description"].label,
              width: "auto",
            }),

            new TablePagingCol({
              data: "State",
              title: new EmailConfig()._formElements["State"].label,
              min_width: 100,
              formatter: (value) => Para.YesNo.getName(value),
            }),
            new TablePagingCol({
              data: "button",
              title: "",
              min_width: 80,
              sortable: false,
              fix: "right",
            }),
          ],
        }),
      },
      obj: new EmailConfig(),
      form: {
        visible: false,
        size: "md",
        title: "",
        width: "800px",
        btns: [
          {
            id: "send",
            action: "send",
            text: "Send Test",
          },
        ],
      },
      objSend: new EmailConfigSend({
        time: GetTimeNow(),
      }),
      formSend: {
        visible: false,
        size: "md",
        title: "Test send email",
        width: "400px",
        OKtext: "Send",
      },
    };
  },
  computed: {
    selectedRow: function () {
      return this.$refs.tp.selectedRow;
    },
  },
  methods: {
    ProcessSend() {
      this.Save().then(() => {
        APIHelper.EmailConfig.TestSendEmail(this.objSend).then((re) => {
          ShowMessage("Send test email success");
          this.formSend.visible = false;
        });
      })
    },
    SendTest(row) {
      this.objSend.type = this.obj.Type;
      this.formSend.visible = true;
    },
    LoadData() {
      this.$refs.tp.LoadData(true);
    },
    ShowForm(title, row) {
      var obj = row;

      this.form.title = title;
      this.obj = new EmailConfig(obj);
      this.form.visible = true;
    },
    Add() {
      this.ShowForm("Add EmailConfig");
    },
    Edit(row) {
      this.ShowForm("Edit EmailConfig", row);
    },
    Save() {
      return new Promise(rs => {
        if (this.obj.Id)
          APIHelper.EmailConfig.Edit(this.obj.toJSON()).then((re) => {
            this.LoadData();
            this.form.visible = false;
            rs();
          });
        else
          APIHelper.EmailConfig.Add(this.obj.toJSON()).then((re) => {
            this.LoadData();
            this.form.visible = false;
            rs();
          });
      })
    },
    Delete(row) {
      ShowConfirm({
        message: "Xóa [" + row.Name + "]",
        title: "Cảnh báo!",
        type: MessageType.warning,
      })
        .then(() => {
          APIHelper.EmailConfig.Delete(row).then((re) => {
            this.LoadData();
            ShowMessage("Xóa thành công");
          });
        })
        .catch((err) => {
          // An error occurred
        });
    },
  },
  mounted() { },
};
</script>

<style lang="scss" scoped></style>


