<template lang="">
  <div style="height: 100%">
    <TablePaging ref="tp" :model="tp">
      <!-- <template slot="column-content-Id" slot-scope="{ row }">
        <el-input v-if="row.isEdit" v-model="row.Id"></el-input>
        <span v-else> {{ row.Id }}</span>
      </template> -->
      <template slot="column-content-Name" slot-scope="{ row }">
        <!-- {{row.Name}} -->
        <el-input v-if="row.isEdit" v-model="row.Name"></el-input>
        <span v-else> {{ row.Name }}</span>
      </template>
      <template slot="column-content-Type_id" slot-scope="{ row }">
        <!-- <el-input v-model="row.Type_id"></el-input>
         <!--     {{row.Type_id}} -->
        <InputSelect
          v-if="row.isEdit"
          :disabled="!row.isEdit"
          :model="Para.Para_lang"
          v-model="row.Type_id"
        />
        <span v-else> {{ Para.Para_lang.getName(row.Type_id) }}</span>
      </template>

      <template slot="column-header-button">
        <el-button
          class="icon-btn icon-btn"
          type="primary"
          @click="form.ShowForm('', true, {})"
        >
          <i class="el-icon-plus"></i
        ></el-button>
      </template>
      <template slot="column-content-button" slot-scope="{ row }">
        <div style="display: flex">
          <el-button
            v-if="row.isEdit"
            class="icon-btn"
            type="primary"
            @click="SaveRowChange(row)"
          >
            <i class="el-icon-check"></i
          ></el-button>
          <el-button
            v-if="!row.isEdit"
            class="icon-btn"
            type="primary"
            @click="editClick(row)"
          >
            <i class="el-icon-edit"></i
          ></el-button>
          <el-button
            v-if="!row.isEdit"
            class="icon-btn"
            type="danger"
            @click="Delete(row)"
          >
            <i class="el-icon-delete"></i>
          </el-button>
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
import TablePaging from "~/assets/scripts/base/TablePaging";
import TablePagingCol from "~/assets/scripts/base/TablePagingCol";
import DefaultForm from "~/assets/scripts/base/DefaultForm";
import Lang_value from "~/assets/scripts/objects/language/Lang_value";
import { Para } from "~/assets/scripts/Para";
import {
  MessageType,
  ShowConfirm,
  ShowMessage,
} from "~/assets/scripts/Functions";
export default {
  props: {
    data: {},
  },
  data() {
    return {
      cacheRow: "",
      tp: new TablePaging({
        title: "Tiêu đề",
        // data: APIHelper.dm_department.GetList,
        data: [],
        disableSelectRow: true,

        cols: [
          new TablePagingCol({
            title: "Mã Chữ",
            data: "Id",
            min_width: 100,
          }),

          new TablePagingCol({
            title: "Nội dung",
            data: "Name",
            // align:'center',
            min_width: 400,
            width: "auto",
            // children: [
            //   new TablePagingCol({
            //     title: "Tiếng Việt",
            //     data: "vi",
            //     min_width: 120,width: "auto",
            //     // formatter: (value) => Para.Para_lang.getName(value),
            //   }),
            //   new TablePagingCol({
            //     title: "English",
            //     data: "en",
            //     min_width: 120,width: "auto",
            //     // formatter: (value) => Para.Para_lang.getName(value),
            //   }),
            // ],
          }),

          new TablePagingCol({
            title: "Ngôn Ngữ",
            data: "Type_id",
            min_width: 120,
            formatter: (value) => Para.Para_lang.getName(value),
          }),

          new TablePagingCol({
            title: "",
            data: "button",
            min_width: 80,
            sortable: false,
          }),
        ],
      }),
      form: new DefaultForm({
        obj: new Lang_value(),
        title: "",
        visible: false,
        width: "500px",
        appendtobody: true,
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
          this.form.obj = new Lang_value(obj);
          this.form.visible = true;
        },
        Save: () => {
          this.$set(this.form.obj, "isEdit", false);
          
          this.data.Data.push(this.form.obj.toJSON());
          this.LoadTable();
         
          this.form.visible = false;
        },
      }),
    };
  },
  watch: {

  },
  methods: {
    SaveRowChange(row) {
     
      row.isEdit = false;
      this.tp.data.forEach((p) => {
        if (p.Id == row.Id && row.Type_id == p.Type_id) {
          Object.assign(p, row);
          delete p.SttTP;
          delete p.SttBase;
        }
      });
      this.$refs.tp.LoadData(true);
    },
    editClick(row) {
      (row.isEdit = true); (this.cacheRow = JSON.parse(JSON.stringify(row)));
    },
    changeValue(row) {
      console.log(row);
      row.isEdit = true;
    },
    processData() {
      // Para.
      this.data.Data.forEach((p) => {
        this.$set(p, "isEdit", false);
      });
    },
    LoadData() {
      this.$refs.tp.LoadData(true);
    },
    Delete(obj) {
      this.data.Data = this.data.Data.filter(
        (p) => !(p.Id == obj.Id && p.Type_id == obj.Type_id)
      );
      this.LoadTable();
      // ShowMessage("Xóa thành công");
    },
    LoadTable() {
      this.tp.data = this.data.Data;

      this.LoadData();
    },
  },
  mounted() {
    this.processData();
    this.LoadTable();
  },
};
</script>
<style lang=""></style>
