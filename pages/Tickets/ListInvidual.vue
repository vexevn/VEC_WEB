<template>
  <div style="height: 100%">
    <TablePaging :model="tp" ref="tp">
      <template v-if="!$route.params.id" slot="btn">
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
      <template slot="column-content-button" slot-scope="{ row }">
        <div style="display: flex">
          <el-button class="icon-btn" type="primary" @click="Edit(row)">
            <i class="fa fa-edit"></i
          ></el-button>
        </div>
      </template>
    </TablePaging>
    <DefaultForm :model="form">
      <div slot="content" style="height: calc(100vh - 100px); display: flex">
        <div
          style="
            flex: 0 0 400px;
            margin-right: 5px;
            display: flex;
            flex-direction: column;
          "
          class="form-ticket"
        >
          <div
            class="form-title"
            style="background: white; border: 0px; margin-bottom: 5px"
          >
            Fixed asset Info
          </div>

          <FormInfo :model="obj.formFA()" style="margin-bottom: 5px"></FormInfo>

          <div
            class="form-title"
            style="background: white; border: 0px; margin-bottom: 5px"
          >
            Ticket Info
          </div>
          <FormInfo
            :model="obj.formDetail()"
            :disabled="true"
            style="margin-bottom: 5px"
          ></FormInfo>
          <div style="display: flex">
            <el-button
              v-if="checkBtn('Approval')"
              type="success"
              @click="processBtn('Approval')"
            >
              Approved
            </el-button>
            <el-button
              v-if="checkBtn('Reject')"
              type="danger"
              @click="processBtn('Reject')"
            >
              Reject
            </el-button>
            <el-button
              v-if="checkBtn('Assign')"
              type="primary"
              @click="processBtn('Assign')"
            >
              Assign
            </el-button>
            <el-button
              v-if="checkBtn('Finish')"
              type="success"
              @click="processBtn('Finish')"
            >
              Finish
            </el-button>
            <el-button
              v-if="checkBtn('Confirm')"
              type="success"
              @click="processBtn('Confirm')"
            >
              Confirm
            </el-button>
            <el-button
              v-if="checkBtn('Cancel')"
              style="margin-left: auto"
              type="danger"
              @click="processBtn('Cancel')"
            >
              Cancel
            </el-button>
          </div>
        </div>
        <div style="flex: 1; display: flex; flex-direction: column">
          <div
            class="form-title"
            style="background: white; border: 0px; margin-bottom: 5px"
          >
            Comment
          </div>
          <div
            style="
              border: 1px solid #ddd;
              border-radius: 4px;
              flex: 1;
              margin-bottom: 5px;
              padding-top: 10px;
              overflow: auto;
            "
            ref="commentContainer"
          >
            <div
              v-for="item in comments"
              :key="item.Id"
              :self="user.UserSerial == item.UserCreate"
              class="comment-item-c"
            >
              <div class="comment-item">
                <div
                  v-if="user.UserSerial != item.UserCreate"
                  class="comment-name"
                >
                  <b>{{ item.FullName }}</b>
                </div>
                <div v-if="item.File_Attach" class="comment-file">
                  <InputFile
                    :model="Para.Comment_Attachment"
                    v-model="item.File_Attach"
                    :disabled="true"
                  />
                </div>
                <div
                  v-if="item.Comment"
                  class="comment-content"
                  v-html="GetComment(item)"
                ></div>
                <div class="comment-time">
                  {{
                    ConvertStr.ToDateStr(item.DateCreate, "DD, MMMM yyyy HH:mm")
                  }}
                </div>
              </div>
            </div>
          </div>
          <div
            class="input-comment"
            style="
              border: 1px solid #ddd;
              border-radius: 4px;
              padding: 10px;
              display: flex;
              align-items: flex-end;
            "
          >
            <el-input
              type="textarea"
              ref="comment"
              v-model="comment"
              :minLine="1"
              placeholder="input comment..."
              @keyup.native="handleInput"
              autosize
            />
            <input
              type="file"
              ref="file"
              style="display: none"
              @change="Upload"
            />
            <div style="display: flex">
              <el-button type="text" @click="Attach()"
                ><i class="fa fa-paperclip"></i
              ></el-button>
              <el-button type="text" @click="Send()">Send</el-button>
            </div>
          </div>
        </div>
      </div>
    </DefaultForm>
    <DefaultForm :model="formAssign" @actionOK="Assign()">
      <div slot="content">
        <div class="Table" style="height: 500px">
          <TablePaging ref="tp" :model="tp_User">
            <template slot="column-content-checkbox" slot-scope="{ row }">
              <el-checkbox style="pointer-events: none" v-model.lazy="row.act">
              </el-checkbox>
            </template>
          </TablePaging>
        </div>
      </div>
    </DefaultForm>
    <DefaultForm :model="formFilter" @actionOK="Search()">
      <div slot="content">
        <FormInfo :model="filter.form()" />
      </div>
    </DefaultForm>
    <DefaultForm :model="formEdit" @actionOK="SaveEdit">
      <div slot="content">
        <FormInfo ref="form" :model="obj.formEdit()" />

      </div>
    </DefaultForm>
  </div>
</template>

<script>
import API from "~/assets/scripts/API";
import APIHelper from "~/assets/scripts/API/APIHelper";
import DefaultForm from "~/assets/scripts/base/DefaultForm";
import TablePaging from "~/assets/scripts/base/TablePaging";
import TablePagingCol from "~/assets/scripts/base/TablePagingCol";
import {
  GetStartMonth,
  GetTimeNow,
  ShowConfirm,
  ShowMessage,
} from "~/assets/scripts/Functions";
import GetDataAPI from "~/assets/scripts/GetDataAPI";
import Tickets from "~/assets/scripts/objects/Tickets";
import TicketsFilter from "~/assets/scripts/objects/TicketsFilter";
import { Para } from "~/assets/scripts/Para";
export default {
  props: {
    admin: {},
  },
  data() {
    return {
      tp: new TablePaging({
        data: this.$route.params.id
          ? APIHelper.ticket.Get_List_ByAssets
          : APIHelper.ticket.GetList,
        params: {
          From: GetStartMonth(),
          To: GetTimeNow(),
          State: "",
          iFixed_assset_id: this.$route.params.id,
        },
        disableSelectRow: true,

        cols: [
          new TablePagingCol({
            title: "STT",
            data: "SttTP",
            min_width: 60,
            sortable: false,
          }),

          new TablePagingCol({
            sortable: false,
            title: "Mã tài sản",
            data: "Fixed_Code",
            min_width: 200,
          }),
          new TablePagingCol({
            sortable: false,
            title: "Số Serial",
            data: "Fixed_Serial",
            min_width: 200,
          }),
          new TablePagingCol({
            title: "Chủng loại",
            data: "Fixed_Model",
            min_width: 200,
            sortable: false,
          }),
          new TablePagingCol({
            title: "Nhà sản xuất",
            data: "Fixed_Producer",
            min_width: 200,
            sortable: false,
          }),
          new TablePagingCol({
            // title: "Ticket content",
            title: "Nội dung",
            data: "Content",
            min_width: 120,
            width: "auto",
            sortable: false,
          }),
          new TablePagingCol({
            // title: "Ticket content",
            title: "Ngày cập nhật",
            data: "DateUpdate",
            min_width: 120,
            // width: "auto",
            formatter: 'date',
            sortable: false,
          }),
          // new TablePagingCol({
          //   // title: "Ticket State",
          //   title: "Tình trạng",
          //   data: "State",
          //   min_width: 150,
          //   sortable: false,
          //   formatter: (value) => Para.TicketsState.getName(value),
          // }),
          new TablePagingCol({
            title: "",
            data: "button",
            min_width: 80,
            
            sortable: false,
          }),
        ],
      }),

      tp_User: new TablePaging({
        // title: "xxx",
        isSearchEqual: true,
        params: {
          iSearchInfo: "",
        },
        LoadDataSuccess: (re) => {
          let _app = this;
          (re || []).forEach((element) => {
            if (this.obj.Act_User && element.Id == this.obj.Act_User) {
              element.act = true;
            } else element.act = false;
          });
        },
        clickRow: (row) => {
          row.act = !row.act;

          if (!this.Act_User) this.Act_User = row;

          if (this.Act_User != row) {
            this.Act_User.act = false;
          }

          this.Act_User = row;
        },
        // disablePaging: true,
        // noFilter: true,
        disableSelectRow: true,
        data: [],
        cols: [
          new TablePagingCol({
            title: "",
            data: "checkbox",
            min_width: 50,
          }),
          new TablePagingCol({
            title: "Họ tên",
            data: "FullName",
            min_width: 200,
            width: "auto",
            sortable: false,
          }),
          new TablePagingCol({
            title: "Email",
            data: "Email",
            min_width: 220,
            sortable: false,
          }),
          new TablePagingCol({
            title: "Tiêu đề",
            data: "Title",
            min_width: 200,
            sortable: false,
          }),
        ],
      }),
      comment: "",
      comments: [],
      Act_User: null,
      obj: new Tickets(),
      form: new DefaultForm({
        title: "Ticket Monitoring",

        // type: "dialog",
        width: "calc(100vw - 200px)",
        visible: false,
      }),
      formAssign: new DefaultForm({
        title: "Ticket Monitoring",
        // type: "dialog",
        width: "calc(100vw - 200px)",
        visible: false,
        OKtext: "Assign",
      }),
      filter: new TicketsFilter(),
      formEdit: new DefaultForm({
        
        width: "400px",
        title: "Sửa",
      }),
      formFilter: new DefaultForm({
        OKtext: "Tìm kiếm",
        // visible: true,
        // type: "dialog",
        width: "400px",
        title: "Lọc dữ liệu",
      }),
    };
  },
  watch: {
    "tp.params": {
      deep: true,
      handler() {
        this.$nextTick(() => {
          this.$refs.tp.LoadData(true);
        });
      },
    },
  },
  methods: {
    SaveEdit(){
      console.log(this.obj)
      GetDataAPI({
        url: API.Ticket_Edit,
        params:this.obj.toJSON(),
        method:'post',
        action: re=>{
          ShowMessage("Sửa thành công",'success');
          this.formEdit.visible = false;
          this.LoadData();
        }
      })
    },
    Edit(row){
      this.obj = new Tickets(row);

      this.formEdit.visible = true;
    },
    Search() {
      Object.assign(this.tp.params, this.filter);
      this.formFilter.visible = false;
    },
    showFilter() {
      this.formFilter.visible = true;
    },
    Attach() {
      this.$refs.file.click();
    },
    LoadData() {
      this.$refs.tp.LoadData(true);
    },
    checkBtn(action) {
      switch (action) {
        case "Approval":
        case "Reject":
          if (
            (this.obj.State == 1 || !this.obj.State) &&
            (this.user.UserLevel == "202303031015160093" || // Quản lý kỹ thuật
              this.user.UserLevel == "1") // Admin
          ) {
            return true;
          }
          break;
        case "Assign":
          if (
            this.obj.State == 2 &&
            this.user.UserSerial == this.obj.Receive_User
          )
            return true;
          break;
        case "Finish":
          if (this.obj.State == 3 && this.user.UserSerial == this.obj.Act_User)
            return true;
          break;
        case "Confirm":
          if (
            this.obj.State == 4 &&
            this.user.UserSerial == this.obj.UserCreate
          )
            return true;
          break;
        case "Cancel":
          if (
            this.user.UserSerial == this.obj.UserCreate &&
            this.obj.State != 5 &&
            this.obj.State != 6 &&
            this.obj.State != 7
          )
            return true;
          break;
      }
      return false;
    },
    processBtn(action) {
      switch (action) {
        case "Approval":
          APIHelper.ticket
            .Approved({
              iRejected: false,
              iTicket_id: this.obj.Id,
            })
            .then((re) => {
              this.LoadObj();
              this.LoadData();
              ShowMessage("Approved ticket successfully");
            });
          break;
        case "Reject":
          APIHelper.ticket
            .Approved({
              iRejected: true,
              iTicket_id: this.obj.Id,
            })
            .then((re) => {
              this.LoadObj();

              this.LoadData();
              ShowMessage("Rejected ticket successfully");
            });
          break;
        case "Assign":
          this.ShowFormAssign();
          break;
        case "Finish":
          APIHelper.ticket
            .Finish({
              iTicket_id: this.obj.Id,
            })
            .then((re) => {
              this.LoadObj();

              this.LoadData();
              ShowMessage("Finish ticket successfully");
            });
          break;
        case "Confirm":
          APIHelper.ticket
            .Success({
              iTicket_id: this.obj.Id,
            })
            .then((re) => {
              this.LoadObj();

              this.LoadData();
              ShowMessage("Confirm ticket successfully");
            });
          break;
        case "Cancel":
          this.Cancel();
          break;
      }
    },
    Assign() {
      if (this.Act_User) {
        this.obj.Act_User = this.Act_User.Id;
        this.obj.Act_Name = this.Act_User.FullName;
        APIHelper.ticket.Executor(this.obj.toJSON()).then((p) => {
          ShowMessage("Assign ticker successfully");
          this.LoadObj();
          this.LoadData();
          this.formAssign.visible = false;
        });
      } else {
        if (this.obj.Act_User) {
          this.formAssign.visible = false;
        } else {
          ShowMessage("Pick user to assign", "error");
        }
      }
    },
    LoadObj() {
      APIHelper.ticket
        .Get_Info({
          iTicket_id: this.obj.Id,
        })
        .then((re) => {
          this.obj.update(re);
        });
    },
    ShowFormAssign() {
      GetDataAPI({
        url: API.Account,
        action: (re) => {
          this.tp_User.data = re;
          this.Act_User = null;
          this.formAssign.title = "Select user for Assign ticket";
          this.formAssign.visible = true;
        },
      });
    },
    Upload() {
      if (this.$refs.file.files.length) {
        APIHelper.util
          .UploadFile({
            file: this.$refs.file.files[0],
            path: Para.Comment_Attachment.baseUrl,
          })
          .then((re) => {
            console.log(re);
            APIHelper.ticket
              .Comment({
                Ticket_id: this.obj.Id,
                Comment: "",
                File_Attach: re,
              })
              .then((re) => {
                this.LoadComment();
              });
          });
        this.$refs.file.value = "";
      }
    },
    OpenTicket(row) {
      this.obj = new Tickets(row);
      this.LoadComment();
      this.form.visible = true;
    },
    GetComment(item) {
      return item.Comment.replace(/\n/g, "<br />");
    },
    Cancel() {
      ShowConfirm({
        message: "Are you sure?",
      }).then(() => {
        APIHelper.ticket.Cancel(this.obj.toJSON()).then((re) => {
          ShowMessage("Cancel ticker successfully");
          this.LoadObj();
          this.LoadData();
        });
      });
    },
    LoadComment() {
      APIHelper.ticket
        .Get_Comment({
          iTicket_id: this.obj.Id,
        })
        .then((re) => {
          this.comments = re;
          this.$nextTick(() => {
            this.$refs.commentContainer.scrollTop =
              this.$refs.commentContainer.scrollHeight;
          });
        });
    },
    Send() {
      if (this.comment.trim()) {
        APIHelper.ticket
          .Comment({
            Ticket_id: this.obj.Id,
            Comment: this.comment.trim(),
          })
          .then((re) => {
            this.comment = "";
            this.LoadComment();
          });
      }
    },
    handleInput(e) {
      if (e.key == "Enter" && !e.shiftKey) {
        this.Send();
        this.comment = "";
      }
    },
  },
  mounted() {
    console.log(this);
  },
};
</script>

<style lang="scss" scoped>
::v-deep  {
  .form-ticket {
    textarea {
      height: calc(100vh - 493px);
    }
  }
}
::v-deep  {
  .input-comment {
    textarea {
      font-family: "Open Sans", "Segoe UI";
      font-size: 13px;
      color: #444444;
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
      padding: 0;
      border: none;
      line-height: 25px !important;
      width: 100%;
      // min-height: 50px;
      resize: none;
      outline: none;
      &[disabled] {
        color: black; // #858585;
        cursor: not-allowed;
        background-color: #fbfbfb;
        border-color: #e5e5e5;
      }
    }
  }
}
.comment-item-c {
  display: flex;
  &[self] {
    justify-content: flex-end;
  }
  .comment-item {
    font-size: 13px;
    border: 1px solid #ddd;
    padding: 10px;
    margin: 10px;
    margin-top: 0;
    margin-bottom: 10px;

    border-radius: 4px;
    color: black;

    .comment-name {
      padding-bottom: 10px;
      color: gray;
    }
    .comment-content {
      padding-bottom: 10px;
    }
    .comment-file {
      ::v-deep  .uploader {
        padding: 5px 10px;
        .el-upload-list__item:first-child {
          margin-top: 0;
        }
      }
    }
    .comment-time {
      font-size: 11px;
    }
  }
}
</style>
