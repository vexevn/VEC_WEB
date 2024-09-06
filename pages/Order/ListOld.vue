<template>
  <div style="height: 100%">
    <TablePaging :model="tp" ref="tp">
      <template slot="btn">
        <el-button
          style="
            height: 28px;
            width: 28px;
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
      <template slot="column-header-Manager">
        <span class="manager-1">Techical by</span> /
        <span class="manager-2">Approved by</span>
      </template>
      <template slot="column-content-History" slot-scope="{ row }">
        <div v-for="item in row.History" :key="item.Id">
          <nuxt-link
            style="color: red"
            :to="'/Order/Form/' + item.Id"
            :target="VendorsId ? '_blank' : ''"
          >
            {{ item ? item.Serial : "N/A" }}
          </nuxt-link>
        </div>
        <nuxt-link
          :to="'/Order/Form/' + row.Id"
          :target="VendorsId ? '_blank' : ''"
        >
          {{ row.Serial ? row.Serial : "N/A" }}
        </nuxt-link>
      </template>

      <template slot="column-content-Practice" slot-scope="{ row }">
        <div v-for="(item, index) in row.Practice" :key="index">
          {{ item }}
        </div>
      </template>
      <template slot="column-content-Status" slot-scope="{ row }">
        <span class="status" :status="row.Status">
          {{ Para.Para_Purchase_State.getName(row.Status) }}
        </span>
      </template>
    </TablePaging>
    <DefaultForm :model="form" @actionOK="Search()">
      <div slot="content">
        <FormInfo :model="filter.form()" />
      </div>
    </DefaultForm>
  </div>
</template>

<script>
import API from "~/assets/scripts/API";
import DefaultForm from "~/assets/scripts/base/DefaultForm";
import TablePaging from "~/assets/scripts/base/TablePaging";
import TablePagingCol from "~/assets/scripts/base/TablePagingCol";
import ConstData from "~/assets/scripts/ConstData";
import ConvertStr from "~/assets/scripts/ConvertStr";
import { GenrerateArray, SearchTree } from "~/assets/scripts/Functions";
import GetDataAPI from "~/assets/scripts/GetDataAPI";
import PRFilter from "~/assets/scripts/objects/Form/PRFilter";
import { Para } from "~/assets/scripts/Para";
import StoreManager from "~/assets/scripts/StoreManager";
export default {
  props: {
    isIndividual: {},
    type: {
      type: String,
    },
    state: {},
    view: {
      type: String,
    },
    VendorsId: {},
  },
  data() {
    return {
      currency_code: "",
      tp: new TablePaging({
        isSearchEqual: true,
        LoadDataSuccess(re) {
          re.forEach((p) => {
            if (p.History) {
              p.History.sortBy("Id");
            }
          });
        },
        ExportConfig(opt) {
          opt.header = [
            new TablePagingCol({
              data: "SttTP",
              title: "#",
              min_width: 50,
              sortable: false,
            }),
            new TablePagingCol({
              data: "History",
              title: "PR.No",
              min_width: 200,
              sortable: false,
              exporter: (value, row) => {
                console.log(value);
                return []
                  .concat(
                    (value ?? []).map((item) => item.Serial ?? "N/A"),
                    [row.Serial ?? "N/A"]
                  )
                  .join("\n");
              },
            }),
            new TablePagingCol({
              data: "Date_Request",
              title: "PR Date",
              min_width: 100,
              formatter: "date",
            }),
            new TablePagingCol({
              data: "Office",
              title: "Văn phòng",
              min_width: 100,
              // formatter: (value) => Para.Para_Office.getName(value),
            }),
            new TablePagingCol({
              data: "Status",
              title: "Trạng thái",
              min_width: 100,
              formatter: (value) => Para.Para_Purchase_State.getName(value),
            }),
            new TablePagingCol({
              data: "Category",
              title: "Categories",
              min_width: 105,
              // formatter: (value) => Para.Para_Category.getName(value),
            }),
            new TablePagingCol({
              data: "Name",
              title: "Name/Content of Package",
              min_width: 150,
              width: "auto",
              sortable: false,
            }),
            new TablePagingCol({
              data: "RequestBy",
              title: "Requested by",
              min_width: 105,
              sortable: false,
            }),
            new TablePagingCol({
              data: "Manager",
              title: "Project Manager/ Budget Holder",
              min_width: 200,
              sortable: false,
              formatter: (value) =>
                (value ?? [])
                  .filter((p) => p && p.Approve_Type_id != 3)
                  .map((p) => p.FullName)
                  .join(" <br/> "),
              exporter: (value) =>
                (value ?? [])
                  .filter((p) => p && p.Approve_Type_id != 3)
                  .map((p) => p.FullName)
                  .join("\n"),
            }),
            new TablePagingCol({
              data: "Approved_USD",
              title: "Approved Budget (USD)",
              min_width: 105,
              formatter: (value, item) =>
                item.Money_code == "USD" ? ConvertStr.ToMoneyStr(value) : "",
              exporter: (value, item) =>
                item.Money_code == "USD" ? value : "",
            }),
            new TablePagingCol({
              data: "Approved_Budget",
              title: "Approved Budget (CHF)",
              min_width: 105,
              formatter: "number",
            }),
            new TablePagingCol({
              data: "Revised_Budget",
              title: "Revised Budget (CHF)",
              min_width: 105,
              formatter: "number",
            }),
            new TablePagingCol({
              data: "Project_Code",
              title:  "Mã dự án",
              min_width: 85,
              sortable: false,
              formatter: (value) =>
                (value ?? [])
                  .map((p) => Para.Para_Project_Code.getName(p))
                  .join(" <br/> "),
              exporter: (value) =>
                (value ?? [])
                  .map((p) => Para.Para_Project_Code.getName(p))
                  .join("\n"),
            }),
            new TablePagingCol({
              data: "AWard_Code",
              title: "Award Code",
              min_width: 85,
              sortable: false,
              formatter: (value) => (value ?? []).join(" <br/> "),
              exporter: (value) => (value ?? []).join("\n"),
            }),
            new TablePagingCol({
              data: "Practice",
              title: "Requesting Unit by Practice",
              min_width: 185,
              sortable: false,
              exporter: (value) => (value ?? []).join("\n"),
            }),
          ];
        },
        cols: [
          new TablePagingCol({
            data: "SttTP",
            title: "#",
            min_width: 50,
            sortable: false,
          }),
          new TablePagingCol({
            data: "History",
            title: "PR.No",
            min_width: 200,
            sortable: false,
            formatter: (value, row) => {
              return []
                .concat(
                  (value ?? []).map((item) => item.Serial ?? "N/A"),
                  [row.Serial ?? "N/A"]
                )
                .join("\n");
            },
            exporter: (value, row) => {
              return []
                .concat(
                  (value ?? []).map((item) => item.Serial ?? "N/A"),
                  [row.Serial ?? "N/A"]
                )
                .join("\n");
            },
          }),
          new TablePagingCol({
            data: "Date_Request",
            title: "PR Date",
            min_width: 100,
            formatter: "date",
          }),
          new TablePagingCol({
            data: "Office",
            title: "Văn phòng",
            min_width: 100,
            // formatter: (value) => Para.Para_Office.getName(value),
          }),
          new TablePagingCol({
            data: "Status",
            title: "Trạng thái",
            min_width: 100,
            formatter: (value) => Para.Para_Purchase_State.getName(value),
          }),
          new TablePagingCol({
            data: "Category",
            title: "Categories",
            min_width: 105,
            // formatter: (value) => Para.Para_Category.getName(value),
          }),
          new TablePagingCol({
            data: "Name",
            title: "Name/Content of Package",
            min_width: 250,
            width: "auto",
            sortable: false,
          }),
          new TablePagingCol({
            data: "RequestBy",
            title: "Requested by",
            min_width: 105,
            sortable: false,
          }),
          new TablePagingCol({
            data: "Manager",
            title: "Project Manager/ Budget Holder",
            min_width: 200,
            sortable: false,
            formatter: (value) =>
              (value ?? [])
                .filter((p) => p && p.Approve_Type_id != 3)
                .map(
                  (p) =>
                    `<span class="manager-${p.Approve_Type_id}">${p.FullName}</span>`
                )
                .join(" <br/> "),
            exporter: (value) =>
              (value ?? [])
                .filter((p) => p && p.Approve_Type_id != 3)
                .map((p) => p.FullName)
                .join("\n"),
          }),

          new TablePagingCol({
            data: "Approved_Budget",
            title: "Approved Budget (CHF)",
            min_width: 105,
            formatter: (value) => ConvertStr.ToMoneyStr(value, true),
            align: "right",
          }),
          new TablePagingCol({
            data: "Revised_Budget",
            title: "Revised Budget (CHF)",
            min_width: 105,
            formatter: "number",
          }),
          new TablePagingCol({
            data: "Project_Code",
            title:  "Mã dự án",
            min_width: 85,
            sortable: false,
            formatter: (value) =>
              (value ?? [])
                .map((p) => Para.Para_Project_Code.getName(p))
                .join(" <br/> "),
            exporter: (value) =>
              (value ?? [])
                .map((p) => Para.Para_Project_Code.getName(p))
                .join("\n"),
          }),
          new TablePagingCol({
            data: "AWard_Code",
            title: "Award Code",
            min_width: 85,
            sortable: false,
            formatter: (value) => (value ?? []).join(" <br/> "),
            exporter: (value) => (value ?? []).join("\n"),
          }),
          new TablePagingCol({
            data: "Practice",
            title: "Requesting Unit by Practice",
            min_width: 185,
            sortable: false,
            exporter: (value) => (value ?? []).join("\n"),
          }),
        ],
        data: [],
      }),
      tp_data: [],
      filter: new PRFilter(),
      form: new DefaultForm({
        OKtext: "Tìm kiếm",
        // visible: true,
        // type: "dialog",
        width: "800px",
        title: "Advanced Filter",
      }),
    };
  },
  watch: {
    type(newValue, oldValue) {
      this.LoadData();
    },
  },
  methods: {
    Search() {
      this.LoadTable();
      this.form.visible = false;
    },
    showFilter() {
      this.form.visible = true;
    },
    LoadData() {
      if (this.VendorsId) {
        GetDataAPI({
          url: API.GetPR_Vendors,
          params: {
            iId: this.VendorsId,
          },
          action: (re) => {
            this.tp_data = re;
            this.LoadTable();
          },
        });
      } else {
        GetDataAPI({
          url: API.Get_List_Purchase,
          params: {
            iType: this.isIndividual ? "ForOffice" : "ForProcurment",
            iState: 0,
          },
          action: (re) => {
            this.tp_data = re;
            this.LoadTable();
          },
        });
      }
    },
    GetData() {
      return this.tp_data.filter((p) => {
        let check = true;
        if (check)
          if (this.filter.Office_id)
            check = p.Office_id == this.filter.Office_id;

        if (check)
          if (this.filter.Status) check = p.Status == this.filter.Status;

        if (check)
          if (this.filter.Categories)
            check = p.Category_id == this.filter.Categories;
        // console.log(this.filter.ProjectCode, p.Project_Code);
        if (check)
          if (this.filter.ProjectCode)
            check = p.Project_Code.filter(
              (p1) => p1 == this.filter.ProjectCode
            ).length;

        if (check)
          if (this.filter.Practice)
            check = p.Practice_id.filter(
              (p1) => p1 == this.filter.Practice
            ).length;

        return check;
      });
    },
    LoadTable() {
      this.tp.data = this.GetData();
      this.$refs.tp.LoadData(true);
    },
  },

  mounted() {
    this.LoadData();
  },
};
</script>

<style lang="scss" scoped>
a {
  color: #337ab7;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}
.status {
  // background: red;
  padding: 4px 0px;
  display: inline-block;
  border-radius: 4px;
  &:not([status]) {
  }
  // white-space: nowrap;
  &[status="2"] {
    background: #ffce55;
    color: white;
    padding: 4px 6px;
  }
  &[status="4"] {
    background: #409eff;
    color: white;
    padding: 4px 6px;
  }
  &[status="3"],
  &[status="9"] {
    background: #d73d32;
    color: white;
    padding: 4px 6px;
  }
  &[status="6"] {
    background: #a0d468;
    color: white;
    padding: 4px 6px;
  }
}
::v-deep  {
  .manager-1 {
    color: #409eff;
  }
  .manager-2 {
    color: #4caf50;
  }
}
</style>
