<template lang="">
  <div style="height: 100%; overflow: auto; padding: 10px">
    <div class="db-total" style="display: flex">
      <div>
        <span>Tổng tài sản </span>
        <span>{{ data.Total_Asset }}</span>
      </div>
      <div>
        <span>Văn phòng </span>
        <span>{{ data.Total_Office }}</span>
      </div>
      <div>
        <span>Loại tài sản </span>
        <span>{{ data.Total_Type }}</span>
      </div>
    </div>
    <div class="dashboard">
      <div style="text-align: center">
        <p >Thống kê tài sản theo văn phòng</p>
        <VueChart type="pie" :chartData="LoadData(data.Offices || [])" />
      </div>
      <div style="text-align: center">
        <p >Thống kê tài sản loại tài sản</p>

        <VueChart type="pie" :chartData="LoadData(data.Types || [])" />
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
      dataOffec: [
        {
          Id: 1,
          Name: "abc",
          Total: 12,
        },
        {
          Id: 2,
          Name: "abc12",
          Total: 32,
        },
        {
          Id: 3,
          Name: "abc123",
          Total: 11,
        },
        {
          Id: 4,
          Name: "abc1234",
          Total: 42,
        },
        {
          Id: 5,
          Name: "abc3123",
          Total: 33,
        },
      ],
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
    // color: #;
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
  display: flex;
  align-items: flex-start;
  gap: 50px;
  div {
    width: 300px;
  }
}
</style>
