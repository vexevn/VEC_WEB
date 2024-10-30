<template>
  <div style="height: 100%">
    <TablePaging v-if="!pr_no"
                 :model="tp"
                 ref="tp">
      <template slot="column-header-Manager">
        <span class="manager-1">Endorsed by</span> /
        <span class="manager-2">Approved by</span>
      </template>
      <template slot="column-content-History"
                slot-scope="{ row }">
        <!-- :to="'/Form/Create/' + row.Id" -->
        <el-button @click="OpenForm(row)"
                   type="text">
          {{ row.Serial ? row.Serial : "N/A" }}
        </el-button>
      </template>

      <template slot="column-content-Practice"
                slot-scope="{ row }">
        <div v-for="(item, index) in row.Practice"
             :key="index">
          {{ item }}
        </div>
      </template>
    </TablePaging>
    <FormVue v-else
             :pr_no="pr_no" />
  </div>
</template>

<script>
import APIHelper from "~/assets/scripts/API/APIHelper";
import DefaultForm from "~/assets/scripts/base/DefaultForm";
import TablePaging from "~/assets/scripts/base/TablePaging";
import TablePagingCol from "~/assets/scripts/base/TablePagingCol";
import ConvertStr from "~/assets/scripts/ConvertStr";
import { Para } from "~/assets/scripts/Para";
import FormVue from "../Order/Form.vue";
export default {
  components: {
    FormVue,
  },
  data() {
    return {
      currency_code: "",
      pr_no: "",
      tp: new TablePaging({
        isSearchEqual: true,
        disableSelectRow: true,
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
              title:  "Số hợp đồng",
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
            title:  "Số hợp đồng",
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
      form: new DefaultForm({
        OKtext: "Tìm kiếm",
        // visible: true,
        // type: "dialog",
        width: "800px",
        title: "Lọc dữ liệu",
      }),
    };
  },

  methods: {
    OpenForm(row) {
      this.pr_no = row.Serial
      // APIHelper.purchase.ProcurementTranferToOrder({
      //   pr_no: row.Serial
      // }).then(re => {
      //   window.open('/Order/Invidual/Form/' + re);
      //   this.LoadData();
      // })
      // console.log(row);
    },
    LoadData() {
      APIHelper.purchase.Get_List_Approval().then((re) => {
        this.tp_data = re;
        this.LoadTable();
      });
    },

    LoadTable() {
      this.tp.data = this.tp_data;
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

  &:not([status]) {}

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
