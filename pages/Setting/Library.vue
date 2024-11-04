<template>
  <div style="height: 100%; display: flex">
    <div class="Folder-Add" style="">
      <div
        style="
          display: flex;
          align-items: center;
          margin: 5px;
          font-size: 20px;
          justify-content: space-between;
          padding-bottom: 5px;
          border-bottom: 1px solid rgb(221, 221, 221);
        "
      >
        <b> Folder </b>
        <el-button v-if="Userlevel == 1" class="" type="primary" @click="Add()"
          ><i class="el-icon-folder-add"></i
        ></el-button>
      </div>
      <el-tree
        ref="myTree"
        :data="data"
        node-key="Id"
        :props="defaultProps"
        highlight-current
        @node-click="handleNodeClick"
        style="height: 100%"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span :class="{ active: datafile.Id == data.Id ? true : false }">
            <i class="fa fa-folder" aria-hidden="true"></i>
            {{ node.label }}</span
          >
          <div
            v-if="Userlevel == 1"
            class="btn-action"
            @click="isBtnClick = true"
          >
            <el-button class="icon-btn" type="primary" @click="Add(data)">
              <i class="el-icon-plus"></i>
            </el-button>
            <el-button class="icon-btn" type="primary" @click="Edit(data)">
              <i class="el-icon-edit"></i>
            </el-button>
            <el-button class="icon-btn" type="danger" @click="Delete(data)">
              <i class="el-icon-delete"></i>
            </el-button>
          </div>
        </span>
      </el-tree>
    </div>
    <div class="folder-info" style="">
      <div class="folder-info-title" style="">
        <div class="Tiêu đề">
          <b>{{ datafile.Name }}</b>
        </div>
        <div style="margin: 5px">
          <el-input placeholder="Tìm kiếm..." :clearable="true"></el-input>
        </div>
      </div>

      <div class="folder-info-table">
        <table v-if="isLoaded" border="0" cellspacing="0" cellpadding="1">
          <!-- <thead>
            <tr>
              <th style="width: 60px"></th>
              <th style="width: 100px"></th>
              <th style="width: auto"></th>
              <th style="width: 110px"></th>
            </tr>
          </thead> -->
          <!-- <tbody
            @dblclick="handleNodeClick(item)"
            class="folder"
            v-for="item in datafile.Childs"
            :key="item.Id"
          >
            <tr>
              <td align="center" rowspan="2">
                <i class="el-icon-folder-opened"></i>
              </td>
              <td align="center"><b>28/11/2022</b></td>
              <td>
                <b>{{ item.Name }}</b>
              </td>
              <td></td>
            </tr>
          </tbody> -->

          <tbody class="folder" v-for="item in datatp" :key="item.Id">
            <tr style="height: 5px">
              <td colspan="5"></td>
            </tr>
            <tr>
              <td align="center" rowspan="3" style="width: 100px">
                <el-button
                  v-if="item.URL"
                  style="margin: 18px 5px"
                  class="icon-btn"
                  type="primary"
                  @click="DownloadFile(item)"
                >
                  <i style="font-size: 15px" class="el-icon-download"></i>
                </el-button>
              </td>
              <td>
                <b style="font-size: 15px">
                  {{ GetFileName(item) }}
                </b>
              </td>
              <td style="width: 110px">
                <div
                  v-if="Userlevel == 1"
                  style="display: flex; justify-content: flex-end"
                >
                  <el-button
                    style="margin: 0px 5px"
                    class="icon-btn"
                    type="primary"
                    @click="EditFile(item)"
                  >
                    <i style="font-size: 15px" class="el-icon-edit"></i>
                  </el-button>
                  <el-button
                    style="margin: 0px 5px"
                    class="icon-btn"
                    type="danger"
                    @click="DeleteFile(item)"
                  >
                    <i style="font-size: 15px" class="el-icon-delete"></i>
                  </el-button>
                </div>
              </td>
            </tr>

            <tr>
              <!-- <td></td> -->
              <td colspan="2">
                <p style="white-space: break-spaces">{{ item.Description }}</p>
              </td>
              <td></td>
            </tr>
            <tr>
              <td colspan="2" style="text-align: right; font-style: italic">
                <span style="margin-left: 10px"
                  >{{ user.UserLevel != 1 ? "" : item.UserName + " - " }}
                  {{
                    ConvertStr.ToDateStr(item.DateCreate, "DD/MM/YYYY HH:mm")
                  }}</span
                >
              </td>
            </tr>
            <tr style="height: 5px">
              <td style="border-bottom: 1px solid #ddd" colspan="4"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <DefaultForm :model="form" @actionOK="form.Save.call(this)">
      <div slot="content">
        <FormInfo ref="form" :model="form.obj.form()" />
      </div>
    </DefaultForm>

    <DefaultForm :model="formFiles" @actionOK="formFiles.Save.call(this)">
      <div slot="content">
        <FormInfo ref="formFiles" :model="formFiles.obj.form()" />
      </div>
    </DefaultForm>

    <div class="preview-c" v-if="formPreview.visible">
      <span
        @click="formPreview.visible = false"
        class="el-image-viewer__btn el-image-viewer__close"
        ><i class="el-icon-circle-close"></i
      ></span>

      <!-- <div class="el-image-viewer__btn el-image-viewer__actions">
        <div class="el-image-viewer__actions__inner"><i class="el-icon-zoom-out"></i><i class="el-icon-zoom-in"></i><i class="el-image-viewer__actions__divider"></i><i class="el-icon-full-screen"></i><i class="el-image-viewer__actions__divider"></i><i class="el-icon-refresh-left"></i><i class="el-icon-refresh-right"></i></div>
      </div> -->
      <el-carousel
        height="100vh"
        style="margin-bottom: 5px"
        :autoplay="false"
        :initial-index="previewFileIndex"
        @change="handlerPreviewChange"
      >
        <el-carousel-item v-for="item in previewFiles" :key="item.href">
          <div style="height: 100%; position: relative">
            <!-- {{ item.href }} -->
            <img
              v-if="isImg(item.getNameDownload())"
              :src="item.href"
              :alt="item.getNameDownload()"
              style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                max-width: 100%;
                max-height: 100%;
              "
              srcset=""
            />
            <iframe
              v-else-if="isPDF(item.getNameDownload())"
              :src="item.href"
              :alt="item.getNameDownload()"
              style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 100vw;
                height: 100vh;
              "
              srcset=""
            />
            <!-- <iframe
              v-else-if="
                isDOC(item.getNameDownload()) && previewFileIndex == index
              "
              :src="GetGoogleEmbeddedLink(item)"
              :alt="item.getNameDownload()"
              style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 100vw;
                height: 100vh;
              "
              srcset=""
            /> -->
            <div
              v-else-if="isVideo(item.getNameDownload())"
              style="
                height: calc(100vh - 62px);
                width: 100%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
              "
            >
              <video height="100%" controls>
                <source :src="item.href" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div
              v-else
              style="
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                font-size: 100px;
                flex-direction: column;
              "
            >
              <span
                style="
                  font-size: 30px;
                  text-align: center;
                  color: white;
                  font-weight: bold;
                  margin-bottom: 32px;
                "
                >{{ item.getNameDownload() }}</span
              >
              <div style="display: flex">
                <a
                  :href="item.href"
                  style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-decoration: none;
                    color: white;
                  "
                  :download="item.getNameDownload()"
                >
                  <i
                    class="fa fa-download"
                    style="width: 100px; height: 100px"
                  ></i>

                  <span
                    style="
                      font-size: 24px;
                      text-align: center;
                      font-weight: bold;
                    "
                    >Download</span
                  >
                </a>
                <a
                  :href="GetGoogleEmbeddedLink(item)"
                  target="_blank"
                  style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-decoration: none;
                    color: white;
                    margin-left: 80px;
                  "
                >
                  <i class="fa fa-eye" style="width: 100px; height: 100px"></i>

                  <span
                    style="
                      font-size: 24px;
                      text-align: center;
                      font-weight: bold;
                    "
                    >View</span
                  >
                </a>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
import GetDataAPI from "~/assets/scripts/GetDataAPI";
import API, { linkAPI } from "~/assets/scripts/API";
import {
  ShowAlert,
  ShowConfirm,
  ShowMessage,
  MessageType,
  getNameDownload,
  getFileObj,
} from "~/assets/scripts/Functions";

import StoreManager from "~/assets/scripts/StoreManager";
import { EventBus } from "~/assets/scripts/EventBus";
import DefaultForm from "~/assets/scripts/base/DefaultForm";
import Document_Folder from "~/assets/scripts/objects/Document_Folder";
import Document_File from "~/assets/scripts/objects/Document_File";
import TablePaging from "~/assets/scripts/base/TablePaging";
import TablePagingCol from "~/assets/scripts/base/TablePagingCol";
import ConvertStr from "~/assets/scripts/ConvertStr";
export default {
  data() {
    return {
      formPreview: {
        type: "dialog",
        visible: false,
        size: "lg",
        title: "Xem trước",
      },
      previewFileIndex: 0,
      previewFiles: [],

      isAdd: null,
      isBtnClick: false,
      disabled: false,
      timer: 0,
      isLoaded: false,
      checked: [],
      data: [],
      User: StoreManager.GetUser(),
      params: {},
      datatp: [],
      defaultProps: {
        label: "Name",
        children: "Childs",
      },
      Userlevel: StoreManager.GetUser().UserLevel,
      form: new DefaultForm({
        obj: new Document_Folder(),
        title: "",
        visible: false,
        width: "500px",
        ShowForm: (title, isAdd, obj) => {
          this.isAdd = isAdd;
          var _app = this;
          if (isAdd) {
            this.form.obj = new Document_Folder({
              ...null,
              Parent_id: obj ? obj.Id : null,
            });
          } else
            this.form.obj = new Document_Folder({
              ...obj,
            });
          this.form.title = title;
          this.form.visible = true;
        },
        Save: () => {
          this.Save();
        },
      }),
      formFiles: new DefaultForm({
        obj: new Document_File(),
        title: "",
        visible: false,
        width: "800px",
        ShowForm: (title, isAdd, obj) => {
          this.isAdd = isAdd;
          var _app = this;
          if (!obj.Id) {
            ShowMessage("You need choose 1 selection!");
            return;
          }
          if (isAdd) {
            this.formFiles.obj = new Document_File({
              ...null,
              folder_id: obj ? obj.Id : null,
            });
          } else
            this.formFiles.obj = new Document_File({
              ...obj,
            });
          this.formFiles.title = title;
          this.formFiles.visible = true;
        },
        Save: () => {
          this.SaveFile();
        },
      }),
      datafile: {},
    };
  },
  computed: {},
  watch: {},
  methods: {
    handlerPreviewChange(index) {
      this.previewFileIndex = index;
    },
    GetGoogleEmbeddedLink(item) {
      return `https://view.officeapps.live.com/op/view.aspx?src=${
        location.origin + item.href
      }`;
    },
    isDOC(item) {
      var type = [".DOC", ".DOCX", ".XLS", ".XLSX"];
      var splt = item.split(".");
      var ext = splt[splt.length - 1].toUpperCase();
      return type.some((p) => p == "." + ext);
    },
    isPDF(item) {
      var type = [".PDF"];
      var splt = item.split(".");
      var ext = splt[splt.length - 1].toUpperCase();
      return type.some((p) => p == "." + ext);
    },
    isImg(item) {
      var type = [".JPG", ".JPE", ".BMP", ".GIF", ".PNG", ".WEBP"];
      var splt = item.split(".");
      var ext = splt[splt.length - 1].toUpperCase();
      return type.some((p) => p == "." + ext);
    },
    isVideo(item) {
      var type = [
        ".PNG",
        ".JPG",
        ".JPEG",
        ".BMP",
        ".GIF", //etc
        ".WAV",
        ".MID",
        ".MIDI",
        ".WMA",
        ".MP3",
        ".OGG",
        ".RMA", //etc
        ".AVI",
        ".MP4",
        ".DIVX",
        ".WMV",
      ];
      var splt = item.split(".");
      var ext = splt[splt.length - 1].toUpperCase();
      return type.some((p) => p == "." + ext);
    },
    GetFileName(item) {
      return getFileObj(item.URL).fileDownload;
    },
    DownloadFile(item) {
      let fileO = getFileObj(item.URL);
      this.previewFiles = [
        {
          name: fileO.file,
          name_download: fileO.fileDownload || fileO.file,
          href: "/upload/Library/" + fileO.file,
          getNameDownload() {
            return fileO.fileDownload || fileO.file;
          },
        },
      ];

      this.formPreview.visible = true;
      // console.log("/upload/Library/" + getFileObj(item.URL).file);
      // //creating an invisible element
      // var element = document.createElement("a");
      // element.setAttribute(
      //   "href",
      //   "/upload/Library/" + getFileObj(item.URL).file
      // );
      // element.setAttribute("download", getFileObj(item.URL).fileDownload);

      // // Above code is equivalent to
      // // <a href="path of file" download="file name">

      // document.body.appendChild(element);

      // //onClick property
      // element.click();

      // document.body.removeChild(element);
    },
    dbClick(row) {
      // console.log(row)
      this.Edit(row, true);
    },

    filterNode(value, data) {
      return data.Id > 0;
    },
    expand(node) {
      if (!this.isBtnClick) node.expanded = !node.expanded;
      else this.isBtnClick = false;
      // //console.log(node, this.$refs.tree);
    },
    handleCheckChange(data, checked, indeterminate) {
      let _app = this;
      _app.timer += 1;
      let timer = _app.timer;
      setTimeout(function () {
        if (timer == _app.timer) {
          let values = _app.$refs.tree
            .getCheckedKeys()
            .filter((p) => p.indexOf("Menu") < 0);
          _app.$emit("input", values);
        }
      }, 0);
    },
    Add(row) {
      this.form.ShowForm("Add Document Folder", true, row);
    },
    AddFile() {
      this.formFiles.ShowForm("Thêm mới", true, this.datafile);
    },
    Edit(row) {
      this.form.ShowForm("Edit Document Folder", false, row);
    },
    EditFile(row) {
      this.formFiles.ShowForm("Edit Folder", false, row);
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
            url: this.isAdd ? API.Add_Folder_Library : API.Edit_Folder_Library,
            params: this.form.obj.toJSON(),
            action: (re) => {
              if (re == "OK" || Number.isInteger(+re)) {
                this.LoadData();
                this.form.visible = false;
              } else {
                ShowMessage(re);
              }
            },
          });
        }
      });
    },
    SaveFile() {
      var _app = this;
      this.$refs.formFiles.getValidate().then((re) => {
        if (!re) {
          ShowMessage(
            "Vui lòng nhập đầy đủ thông tin!",
            MessageType.error
          );
          return;
        } else {
          this.$refs.formFiles
            .getEntry("document_url")
            .submitUpload()
            .then((results) => {
              this.formFiles.obj.URL = results[0];
              GetDataAPI({
                method: "post",
                url: this.isAdd ? API.Add_File_Library : API.Edit_File_Library,
                params: this.formFiles.obj.toJSON(),
                action: (re) => {
                  if (re == "OK" || Number.isInteger(+re)) {
                    this.LoadDataFile();
                    this.formFiles.visible = false;
                  } else {
                    ShowMessage(re);
                  }
                },
              });
            });
        }
      });
    },
    Delete(data) {
      ShowConfirm({
        message: "Delete Folder [" + data.Name + "]",
        title: "Cảnh báo!",
        type: MessageType.warning,
      }).then(() => {
        GetDataAPI({
          method: "post",
          url: API.Delete_Folder_Library,
          params: data,
          action: (re) => {
            this.LoadData();
          },
        });
      });
    },
    DeleteFile(data) {
      ShowConfirm({
        message: "Delete File [" + ConvertStr.ToDateStr(data.DateCreate) + "]",
        title: "Cảnh báo!",
        type: MessageType.warning,
      }).then(() => {
        GetDataAPI({
          method: "post",
          url: API.Delete_File_Library,
          params: data,
          action: (re) => {
            this.LoadDataFile();
          },
        });
      });
    },
    GetTitle(data) {
      let str = data.Title;
      //   if (data.LiClass.indexOf("hidden") > -1) str += " <b>[Ẩn]</b>";
      return str;
    },
    ShowAction(data) {
      // //console.log(data);
      ShowAlert({ message: data.Action });
    },
    ProcessData(rawData, Stt) {
      // let data = JSON.parse(JSON.stringify(rawData));

      rawData.forEach((p, index) => {
        if (p.Childs && p.Childs.length > 0) {
          this.ProcessData(p.Childs, p.STTtree);
        }
      });

      return rawData;
    },

    LoadData() {
      let _app = this;
      GetDataAPI({
        url: API.Get_Folder_Library,
        //   params: {
        //     IActivity_id: this.params.Parent_id,
        //   },
        action: (re) => {
          //   _app.data = _app.ProcessData(re, null);
          //   console.log(_app.ProcessData(re, null));
          _app.data = re;
          // this.Getdata();

          console.log(_app.data);

          _app.$nextTick(function () {
            let arr = document.querySelectorAll("[isButton]").forEach((p) => {
              p.parentElement.parentElement.parentElement.setAttribute(
                "btn-container",
                ""
              );
            });
          });
        },
      });
    },
    Getdata() {
      //   if (this.params.Parent_id) {
      //     return this.data.filter((p) => p.Id == this.params.Parent_id);
      //   } else {
      return this.data;
      //   }
    },
    LoadDataFile() {
      GetDataAPI({
        url: API.Get_Files_Library,
        params: {
          iFolder_id: this.datafile.Id,
        },
        action: (re) => {
          this.datatp = re;
          this.isLoaded = false;
          this.$nextTick((p) => {
            this.isLoaded = true;
          });
        },
      });
    },
    handleNodeClick(data) {
      this.isLoaded = false;
      this.datafile = data;
      this.$nextTick((p) => {
        this.$refs.myTree.setCurrentKey(this.datafile.Id);
      });
      this.LoadDataFile();
      this.$nextTick((p) => {
        this.isLoaded = true;
      });
      // console.log(this.datafile);
    },
  },

  mounted() {
    console.log(this.User);
    this.LoadData();
  },
  beforeMount() {
    EventBus.$on("Add", this.AddFile);
  },

  beforeDestroy() {
    EventBus.$off("Add", this.AddFile);
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/variable.scss";
.Folder-Add {
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 0 0 350px;
  background: #fff;
  border-right: 1px solid rgb(221, 221, 221);
}
.custom-tree-node {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  // border-bottom: 1px solid #ddd;
  min-height: 26px;
}

.main {
  flex: 1;
  overflow: auto;
}
::v-deep  #div_formLichSuStatu {
  max-height: calc(100vh - 300px);
  height: 450px;
}
::v-deep  .el-tree {
  .el-tree-node__content {
    height: auto;

    ::v-deep  .expanded {
      background-color: #8bc34a33;
    }
  }
}

.btn-action {
  display: none;
  //   display: flex;
  margin-right: 5px;
  //   button {
  //     width: 45px;
  //   }
  // position: absolute;
  // top: 50%;
  // right: 5px;
  // transform: translateY(-50%);
  // margin-bottom: 5px;
}
::v-deep .el-tree-node__content:hover .btn-action {
  display: flex;
}

.el-tree {
  ::v-deep  button {
    padding: 5px 10px;
  }

  ::v-deep  .el-tree-node__content:hover {
    background: #f5f7fa;
  }

  ::v-deep  .el-tree-node:focus > .el-tree-node__content {
    background: transparent;
  }

  .menu-parent {
    display: flex;
    justify-content: space-between;
    white-space: normal;
    i {
      margin-right: 5px;
    }
  }
  ::v-deep  [btn-container] {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: -5px;
    padding-left: 56px;
    .el-tree-node {
      flex: 0 0 25%;
      margin-bottom: 5px;
      .el-tree-node__content {
        padding-left: 0px !important;
      }
      //   background: red;
    }
  }
}

::v-deep .ClassTitle {
  background: #c6e0b4 !important;
  color: #000000 !important;
}
.list-file {
  li {
    .link-file {
      display: flex;
      flex-direction: column;
    }
  }
}
::v-deep 
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #e4effc;

  // color: #fff9ff;
}
.folder-info {
  flex: 1;
  background: white;
  overflow: hidden;
  .folder-info-title {
    display: flex;
    justify-content: space-between;

    border-bottom: 1px solid rgb(221, 221, 221);
    .title {
      display: flex;
      align-items: center;
      margin: 5px;
      font-size: 20px;
    }
  }
  .folder-info-table {
    overflow-y: auto;
    height: calc(100% - 38px);
    thead {
      th {
        position: sticky;
        top: 0;
        z-index: 1;
      }
    }
    tbody {
      border-bottom: 1px solid;
      th {
        position: sticky;
        left: 0;
      }
    }
    tbody:hover {
      cursor: pointer;
      background-color: #ddd;
    }
    table {
      border-collapse: separate;
      //   border: 1px solid #ccc;
      width: 99%;
      margin: 0px 5px;
      i {
        font-size: 35px;
      }
      th {
        border: 1px solid #ccc;
        background-color: #ededed;
      }
      td {
        vertical-align: top;
      }
    }
  }
}
.preview-c {
  position: fixed;
  height: 100vh;
  width: 100vw;
  top: 0px;
  left: 0px;
  background: #00000080;
  z-index: 9999999;
  .el-image-viewer__close {
    color: white;
    z-index: 99999999999999999999;
    background-color: red;
  }
  .el-image-viewer__actions {
    color: white;
    z-index: 99999999999999999999;
  }
}
</style>
