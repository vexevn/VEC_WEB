<template lang="">
  <div style="height: 100%; overflow: auto; padding: 10px">
    <div class="db-total" style="display: flex">
      <div style="background-color: rgb(3 167 3);">
        <span>Tổng tài sản </span>
        <span>{{ data.Total_Asset }}</span>
      </div>
      <div  style="background-color: #1E90FF;">
        <span>Văn phòng </span>
        <span>{{ data.Total_Office }}</span>
      </div>
      <div  style="background-color: #DAA520;">
        <span>Loại tài sản </span>
        <span>{{ data.Total_Type }}</span>
      </div>
    </div>
    <div class="dashboard">
      <div class="office">
        <!-- <p></p> -->
        <VueChart type="pie" :chartTitle="'Thống kê tài sản theo văn phòng'" :chartData="LoadData(data.Offices || [])" />
      </div>
      <div class="type">
        <!-- <p></p> -->

        <VueChart type="pie" :chartTitle="'Thống kê tài sản loại tài sản'" :chartData="LoadData(data.Types || [])" />
      </div>
    </div>
  </div>
</template>
<script>
import GetDataAPI from "~/assets/scripts/GetDataAPI";
import API from "~/assets/scripts/API";
import TablePaging from "~/assets/scripts/base/TablePaging";
import TablePagingCol from "~/assets/scripts/base/TablePagingCol";
export default {
  data() {
    return {
      data: [],
 
    };
  },
  methods: {
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
  },
  mounted() {
    GetDataAPI({
      url: API.Reports_Dashboard,
      // params: this.params,
      action: (re) => {
        console.log(this);
        this.data = re;
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
  justify-content: space-between;
  // gap: 20px;
   > div {
   width: 47%;
    border: 2px solid rgb(209, 208, 208);
    border-radius: 10px;
    p{
      font-size: 16px;
      font-weight: 600;
    }
  }
}
</style>
