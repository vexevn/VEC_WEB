<template>
  <div class="content-c">
    <!-- <div style="display: flex; padding: 10px">
      <FormInfo :model="params.formInline()" />
    </div> -->
    <div
    class="content"
      style="flex: 1; padding: 10px; display: flex; overflow: hidden"
    >
      <div style="flex: 0 0 310px; overflow: auto">
        <PRSumary
          class="procurement-c"
          v-for="item in summary"
          :key="item.id"
          :model="item"
          :type="summaryType"
          @onSelect="onPRSumarySelect"
          @onGetValue="onPRSumaryGetValue"
        />
      </div>
      <div class="content">
        <!-- <div class="content-left" style="">
        <div
          v-for="item in data.Detail"
          :key="item.Type"
          :type="item.Type"
          :active="isActived(item)"
          class="content-left-item"
          @click="SelectItem(item)"
        >
          <span> {{ item.Name }} </span>
          <span style="margin-left: auto">
            <b>{{ item.Value }} </b>
          </span>
        </div>
      </div> -->
        <div v-if="chartData" class="content-right">
          <VueChart
            type="pie"
            class="chart"
            :chartData="chartData"
            :legend="false"
          />
        </div>
        <div class="content-end">
          <div
            class="form-title"
            v-if="selectedItem"
            style="text-transform: uppercase"
          >
            List of {{ selectedItem.name }}
          </div>
          <TablePaging
            :model="tp"
            ref="tp"
            style="margin: 0 -5px; flex: 1; overflow: hidden"
          >
            <template slot="column-header-Manager">
              <span class="manager-1">Techical by</span> /
              <span class="manager-2">Approved by</span>
            </template>
            <template slot="column-content-History" slot-scope="{ row }">
              <template v-if="row.Status != 11 && row.Status != 6">
                <div v-for="item in row.History" :key="item.Id">
                  <nuxt-link
                    style="color: red"
                    :to="
                      isIndividual
                        ? '/Order/Invidual/Form/' + item.Id
                        : '/Order/Form/' + item.Id
                    "
                    :target="VendorsId ? '_blank' : ''"
                  >
                    {{ item ? item.Serial : "N/A" }}
                  </nuxt-link>
                </div>
              </template>
              <nuxt-link
                :to="
                  isIndividual
                    ? '/Order/Invidual/Form/' + row.Id
                    : '/Order/Form/' + row.Id
                "
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API, { linkAPI } from "~/assets/scripts/API";
import APIHelper from "~/assets/scripts/API/APIHelper";
import DefaultForm from "~/assets/scripts/base/DefaultForm";
// import { ReportInput } from "~/assets/scripts/API/Report";
import TablePaging from "~/assets/scripts/base/TablePaging";
import TablePagingCol from "~/assets/scripts/base/TablePagingCol";
import ConstData from "~/assets/scripts/ConstData";
import ConvertStr from "~/assets/scripts/ConvertStr";
import { ShowConfirm, ShowMessage } from "~/assets/scripts/Functions";
import GetDataAPI from "~/assets/scripts/GetDataAPI";
import PRFilter from "~/assets/scripts/objects/Form/PRFilter";
import { Para } from "~/assets/scripts/Para";
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
      data: null,
      chartData: null,
      selectedItem: null,
      loaded: true,
      tp_data: [],
      summary: [],
      summaryType: this.isIndividual ? "ForOffice" : "ForProcurment",
      tp: new TablePaging({
      //  isSearchEqual: true,
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
            fix: "left",
          }),
          new TablePagingCol({
            data: "History",
            title: "PR.No",
            fix: "left",

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
      params: new PRFilter(),
      form: new DefaultForm({
        OKtext: "Tìm kiếm",
        // visible: true,
        // type: "dialog",
        width: "800px",
        title: "Advanced Filter",
      }),
    };
  },
  computed: {
    total() {
      return Object.values(this.data).reduce((a, b) => a + b, 0);
    },
  },
  methods: {
    onPRSumarySelect(obj) {
      // console.log(obj, this.$route);
      this.SelectItem(obj.model);
      localStorage["order-list-" + this.$route.name] = JSON.stringify(obj);
    },
    onPRSumaryGetValue(obj) {
      // console.log(JSON.stringify(obj));
      if (obj.type == 0) {
        this.chartData = {
          labels: obj.child.map((p) => p.name),
          datasets: [
            {
              backgroundColor: obj.child.map((p) => p.background + "bf"),
              data: obj.child.map((p) => p.value),
            },
          ],
        };
      }
    },
    isActived(item) {
      if (!this.selectedItem) return false;
      return item.Type == this.selectedItem.Type;
    },
    SelectItem(item) {
      this.loaded = false;
      this.selectedItem = item;
      // this.tp.title = item.name;
      // this.ReloadCols();
      this.LoadData();
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
            iState: this.selectedItem.type,
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
          if (this.params.Office_id)
            check = p.Office_id == this.params.Office_id;

        if (check)
          if (this.params.Status) check = p.Status == this.params.Status;

        if (check)
          if (this.params.Categories)
            check = p.Category_id == this.params.Categories;
        if (check)
          if (this.params.ProjectCode)
            check = p.Project_Code.filter(
              (p1) => p1 == this.params.ProjectCode
            ).length;

        if (check)
          if (this.params.Practice)
            check = p.Practice_id.filter(
              (p1) => p1 == this.params.Practice
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
    this.summary = [];
    console.log('this',this);
    this.$nextTick(() => {
      this.summary = ConstData.Dashboard[this.summaryType];
      this.$nextTick(() => {
        if (localStorage["order-list-" + this.$route.name])
          this.onPRSumarySelect(
            JSON.parse(localStorage["order-list-" + this.$route.name])
          );
        else this.SelectItem(ConstData.Dashboard[this.summaryType][0]);
      });
    });
  },
};
</script>

<style lang="scss" scoped>
.content-c {
  height: 100%;
  display: flex;
  flex-direction: column;

  .content {
    flex: 1;
    overflow: hidden;
    display: flex;

    .content-left {
      padding: 20px 0;
      flex: 0 0 250px;

      .content-left-item {
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 20px;
        margin-bottom: 20px;
        color: white;
        display: flex;
        cursor: pointer;

        &:hover {
          opacity: 0.8;
        }

        &[active] {
          font-weight: bold;
        }

        &[type="1"] {
          background: #607d8b;
        }

        &[type="2"] {
          background: #409eff;
        }

        &[type="3"] {
          background: #009688;
        }

        &[type="4"] {
          background: #ebb563;
        }
      }
    }

    .content-right {
      padding-top: 20px;
      padding-left: 20px;
      padding-right: 20px;

      .chart {
        height: 295px;
        width: 295px;
        overflow: hidden;
      }
    }

    .content-end {
      flex: 1;
      // padding-top: 20px;
      // padding-left: 20px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
  }
}
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
