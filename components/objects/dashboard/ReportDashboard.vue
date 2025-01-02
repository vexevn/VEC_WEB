<template lang="">
  <div
    style="
      height: 100%;
      overflow: auto;
      padding: 10px;
      display: flex;
      flex-direction: column;
    "
  >
    <div>
      <div class="db-total" style="display: flex">
        <div style="background-color: rgb(3 167 3)">
          <span>Tổng tài sản </span>
          <span style="font-size: 24px;">{{ data.Total_Asset }}</span>
        </div>
        <div style="background-color: #1e90ff">
          <span>Văn phòng </span>
          <span style="font-size: 24px;">{{ data.Total_Office }}</span>
        </div>
        <div style="background-color: #daa520">
          <span>Nhóm tài sản </span>
          <span style="font-size: 24px;"> {{ data.Total_Type }}</span>
        </div>
      </div>
      <div class="dashboard">
        <div class="office" style="min-width: 660px; max-width: 800px">
          <!-- <p></p> -->
          <VueChart
            type="pie"
            :chartTitle="data.Offices_Chart_Tile"
            :chartData="LoadData(data.Offices || [])"
          />
        </div>
        <div class="type"  style="min-width: 660px; max-width: 800px">
          <!-- <p></p> -->

          <VueChart
            type="pie"
            :chartTitle="'Thống kê tài sản theo nhóm tài sản'"
            :chartData="LoadData(data.Types || [])"
          />
        </div>
      </div>
    </div>

    <div style="height: 500px" class="reportStatus">
      <TablePaging ref="tp" style="max-width: 65%;" :model="tp"> </TablePaging>
      <div class="note" style="flex: 1; padding-left: 10px">
        <!-- <p>Chú thích:</p> -->

        <p style="font-size: 14px;padding: 4px 0" v-for="item in (data.Status[0] || {}).Offices" :key="item.Id">
          <b>{{ item.Code }} :</b> {{ item.Name }}
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import GetDataAPI from "~/assets/scripts/GetDataAPI";
import API from "~/assets/scripts/API";
import TablePaging from "~/assets/scripts/base/TablePaging";
import TablePagingCol from "~/assets/scripts/base/TablePagingCol";
// import { oslogin_v1 } from "googleapis";
export default {
  data() {
    return {
      data: {
        Status: [],
      },
      tp: new TablePaging({
        // title: "Tiêu đề",
        data: [],
        disableSelectRow: true,
        disableControl: true,
        cols: [
          new TablePagingCol({
            title: "",
            data: "SttTP",
            min_width: 65,
            width: "auto",
          }),
        ],
      }),
    };
  },
  methods: {
    LoadDataTP() {
      this.$refs.tp.LoadData(true);
    },
    LoadData(re) {
      let chartData = {
        labels: re.map((p) => p.Name),
        datasets: [
          {
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
              "#FF9F40",
              "#FFCD56",
              "#46BFBD",
              "#F7464A",
              "#949FB1",
              "#4D5360",
              "#C0C0C0",
              "#E7E9ED",
              "#8B0000",
              "#FFD700",
              "#00FF00",
              "#00CED1",
              "#4682B4",
              "#EE82EE",
              "#D2691E",
            ],

            data: re.map((p) => p.Total),
          },
        ],
      };
      return chartData;
    },
    InitCol(data) {
      let defaultCol = [
        new TablePagingCol({
          title: "Trạng thái",
          data: "Name",
          min_width: 200,

          // width: "auto",
        }),
        
      ];
      

      if (data[0].Offices && data[0].Offices.length > 0) {
        data[0].Offices.forEach((office) => {
          defaultCol.push(
            new TablePagingCol({
              title: office.Code,
              data: `Total_Office_${office.Id}`,
              min_width: 90,
              formatter: "number",
              align: "right",
              sortable: false,
              // width: "auto",
            })
          );
        });
      }

      return defaultCol;
    },
    ModifyTbData(re) {
      return re.map((item) => {
        let transformedItem = {
          Id: item.Id,
          Name: item.Name,
        };

        if (item.Offices && item.Offices.length > 0) {
          item.Offices.forEach((office) => {
            transformedItem[`Id_Office_${office.Id}`] = office.Id;
            transformedItem[`Name_Office_${office.Id}`] = office.Name;
            transformedItem[`Code_Office_${office.Id}`] = office.Code;
            transformedItem[`Total_Office_${office.Id}`] = office.Total;
          });
        }

        return transformedItem;
      });
    },
  },
  mounted() {
    GetDataAPI({
      url: API.Reports_Dashboard,
      // params: this.params,
      action: (re) => {
        // console.log(this);
        this.data = re;
        this.tp.data = this.ModifyTbData(re.Status);
        this.tp.cols = this.InitCol(re.Status);
        this.LoadDataTP();

        // console.log(this.InitCol(re.Status));
        // console.log(this.tp);
      },
    });
  },
};
</script>
<style lang="scss" scoped>
.db-total {
  display: flex;
  gap: 10px;
  > div {
    color: #fff;
    border: 1px solid rgb(200, 200, 200);
    min-width: 150px;
    padding: 5px;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    font-weight: 600;
  }
}

.dashboard {
  margin-top: 10px;
  display: flex;
  align-items: flex-start;
  //justify-content: space-between;
  gap: 20px;
  > div {
    width: 47%;
    border: 2px solid rgb(209, 208, 208);
    border-radius: 10px;
    padding-bottom: 20px;
    padding-left: 10px;
    p {
      font-size: 16px;
      font-weight: 600;
    }
  }
}

.reportStatus {
  margin-top: 30px;
  display: flex;
  width: 100%;


  ::v-deep .main-content .el-table--border .el-table__cell{
    border-right: 1px solid #ddd;
  }
  ::v-deep .paging-control {
    display: none !important;
  }

  
}
</style>
