<template lang="">
  <!-- <Printer :model="printConfig"> -->
  <div class="phieu">
    <div class="phieu-header">
      <h3>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h3>
      <h5 style="font-size: 16px; text-decoration: underline">
        Độc lập tự do hạnh phúc
      </h5>
      <br />
      <br />
      <h4>BIÊN BẢN KIỂM KÊ</h4>
      <h4>{{ data.Inventory.Description }}</h4>

      <!-- <hr style="width: 40%;"> -->
    </div>

    <div>
      <span>Từ </span><span>{{ConvertStr.ToDateStr(data.Inventory.FromDate)}} </span>
      <span>- Đến </span><span>{{ConvertStr.ToDateStr(data.Inventory.ToDate)}}</span>
    </div>

    <div
      style="text-align: justify; margin-top: 15px"
      class="phieu-content"
    ></div>
    {{data.Details.length}}
    <div style="margin: 6px 0" class="as-table">
      <table style="width: 100%">
        <tr>
          <th style="width: 40px">STT</th>
          <th>Mã tài sản</th>
          <th>Tên tài sản</th>
          <th style="width: 80px">Phòng quản lý</th>
          <th style="width: 60px">Trạng thái</th>
          <th style="width: 100px">Ghi chú</th>
        </tr>
        <!-- <tr
          v-for="(item, index) in dataPrint.Details"
          :key="item.Fixed_Asset_id"
        >
          <th style="font-weight: normal">{{ index + 1 }}</th>
          <th style="font-weight: normal">{{ item.Fixed_Code }}</th>
          <th style="font-weight: normal">{{ item.Name }}</th>
          <th style="font-weight: normal">
            {{ Para.fixed_asset_state_Get_List.getName(item.Fixed_State) }}
          </th>
          <th style="font-weight: normal">01</th>
        </tr> -->
      </table>
    </div>

    <div class="phieu-footer">
      <div class="qltt">
        <!-- <b>Bên giao</b> -->
        <!-- <p>{{ dataPrint.Info.Trasnfer_user }}</p> -->

        <p style="font-weight: bold; margin-top: 50px">
          <!-- {{ Para.Para_Account.getName(dataPrint.Info.Trasnfer_user) }} -->
        </p>
      </div>
      <div class="ungvien">
        <!-- <b>Bên nhận</b> -->
        <p style="font-weight: bold; margin-top: 50px">
          <!-- {{ Para.Para_Account.getName(dataPrint.Info.Receive_user) }} -->
        </p>
      </div>
    </div>
  </div>
  <!-- </Printer> -->
</template>
<script>
import API from "~/assets/scripts/API";
import PrintCfg from "~/assets/scripts/base/PrintCfg";
import GetDataAPI from "~/assets/scripts/GetDataAPI";
// import { Para } from "~/assets/scripts/Para";

export default {
  layout: "PrinLayout",
  computed: {},
  data() {
    return {
      dataPrint: JSON.parse(localStorage.dataPrint),
      printConfig: "",
      data: { Inventory: {},Details:[] },
    };
  },

  mounted() {
    GetDataAPI({
      url: API.Inventory_Get_Print,
      params: {
        iInventory_id: this.dataPrint.Id,
      },
      action: (re) => {
        console.log(re);
        this.data = re;
        console.log(this);
        this.$nextTick(() => {
          this.printConfig = new PrintCfg({
            layout: "portrait",
          });
        });
      },
    });

    // window.print()
  },
};
</script>
<style lang="scss" scoped>
@media screen {
  .phieu {
    // display: none;
  }
}
table,
th,
td {
  border: 1px solid rgb(130, 130, 130);
  border-collapse: collapse;
}
ol li {
  padding-bottom: 10px;
}
.phieu {
  // display: none;;
  font-family: "Times New Roman", Times, serif;
  margin: 0 10%;
  .phieu-header {
    text-align: center;
    margin-top: 10px;
  }
  .phieu-infor {
    > div {
      display: flex;
      .if-title {
        min-width: 150px;
        // padding: 0 10px;
        // background-color: aqua;
      }
      .if-content {
        width: 100%;
        // background-color: blueviolet;
      }
    }
  }
  .phieu-footer {
    margin-top: 15px;
    display: flex;
    align-items: center;
    > div {
      width: 50%;
      text-align: center;
    }
    .qltt {
    }
  }
}

ol li {
  font-weight: bold;
}
</style>
