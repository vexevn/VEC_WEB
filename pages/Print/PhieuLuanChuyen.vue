<template lang="">
  <Printer :model="printConfig">
  <div class="phieu">
    <div class="phieu-header">
      <h3>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h3>
      <h5 style="font-size: 16px; text-decoration: underline">
        Độc lập - Tự do - Hạnh phúc
      </h5>
      <br />
      <br />
      <h4>BIÊN BẢN BÀN GIAO CÔNG CỤ DỤNG CỤ</h4>
      <!-- <hr style="width: 40%;"> -->
    </div>
    <div>
      <p style="text-indent: 2.5em">
        Hôm này, ngày
        {{ ConvertStr.ToDateStr(dataPrint.Info.Start_Date) }} tại Cơ quan Tổng
        công ty Đầu tư và phát triển đường cao tốc Việt Nam (VEC), chúng tôi
        gồm:
      </p>
    </div>

    <div style="text-align: justify; margin-top: 15px" class="phieu-content">
      <ol style="margin-top: 10px; padding-left: 15px">
        <li>
          Bên giao: Văn phòng

          <div style="display: flex; font-weight: normal">
            <div style="width: 200px">
              {{ Para.Para_Account.getName(dataPrint.Info.Trasnfer_user) }}
            </div>
            <span
              v-if="
                Para.Para_Account.set((p) => (p.label = `Title`)).getName(
                  dataPrint.Info.Trasnfer_user
                )
              "
              >-
              {{
                Para.Para_Account.set((p) => (p.label = "Title")).getName(
                  dataPrint.Info.Trasnfer_user
                )
              }}</span
            >
          </div>
        </li>
        <li>
          Bên nhận:
          <div style="display: flex; font-weight: normal">
            <div style="width: 200px">
              {{ Para.Para_Account.getName(dataPrint.Info.Receive_user) }}
            </div>

            <span
              v-if="
                Para.Para_Account.set((p) => (p.label = `Title`)).getName(
                  dataPrint.Info.Receive_user
                )
              "
              >-
              {{
                Para.Para_Account.set((p) => (p.label = "Title")).getName(
                  dataPrint.Info.Receive_user
                )
              }}</span
            >
          </div>
        </li>
      </ol>
    </div>

    <div>
      <p style="text-indent: 2.5em">{{ dataPrint.Info.Description }}</p>
      <p style="text-indent: 2.5em">
        Hai bên cùng tiến hành lập biên bản bàn giao công cụ dụng cụ, cụ thể như
        sau:
      </p>
    </div>

    <div style="margin: 6px 0" class="as-table">
      <table style="width: 100%">
        <tr>
          <th style="width: 40px">STT</th>
          <th style="width: 150px">Mã tài sản</th>
          <th style="width: 220px">Tên tài sản</th>
          <th>Vị trí</th>
          <th style="width: 100px">Trạng thái</th>
          <th style="width: 60px">Số lượng</th>
          <th>Người dùng</th>
          <!-- <th style="width: 100px">Ghi chú</th> -->
          <th style="width: 90px">Ký nhận</th>
        </tr>
        <tr
          v-for="(item, index) in dataPrint.Details"
          :key="item.Fixed_Asset_id"
        >
          <th style="font-weight: normal">{{ index + 1 }}</th>
          <th style="font-weight: normal">{{ item.Fixed_Code }}</th>
          <th style="font-weight: normal">{{ item.Name }}</th>
          <th style="font-weight: normal">{{ Para.store_Get_List.getName(item.New_Store_id)}}</th>
          <th style="font-weight: normal">
            {{ Para.fixed_asset_state_Get_List.getName(item.Fixed_State) }}
          </th>
          <th style="font-weight: normal">01</th>
          <th style="font-weight: normal">{{ Para.Para_Account.getName(item.New_Person) }}</th>
          <th style="font-weight: normal"></th>

        </tr>
      </table>
    </div>

    <div>
      <p style="text-indent: 2.5em">
        Biên bản được lập thành 03 bản có giá trị như nhau, mỗi bên giao nhận
        giữ 01 bản, Ban TCKT giữ 01 bản
      </p>
    </div>

    <div class="phieu-footer">
      <div class="qltt">
        <b>Bên giao</b>
        <!-- <p>{{ dataPrint.Info.Trasnfer_user }}</p> -->

        <p style="font-weight: bold; margin-top: 50px">
          {{ Para.Para_Account.getName(dataPrint.Info.Trasnfer_user) }}
        </p>
      </div>
      <div class="ungvien">
        <b>Bên nhận</b>
        <p style="font-weight: bold; margin-top: 50px">
          {{ Para.Para_Account.getName(dataPrint.Info.Receive_user) }}
        </p>
      </div>
    </div>
  </div>
  </Printer>
</template>
<script>
import API from "~/assets/scripts/API";
import PrintCfg from "~/assets/scripts/base/PrintCfg";
import { SelectOption } from "~/assets/scripts/base/SelectOption";
import GetDataAPI from "~/assets/scripts/GetDataAPI";
import { Para } from "~/assets/scripts/Para";

export default {
  layout: "PrinLayout",
  computed: {},
  data() {
    return {
      dataPrint: JSON.parse(localStorage.dataPrint),
      printConfig: "",
      store: new SelectOption()
    };
  },
  mounted() {
    GetDataAPI({
      url: API.Account,
      action: (re) => {
        this.Para.Para_Account.data = re;
        console.log(this);
        this.$nextTick(() => {
          this.printConfig = new PrintCfg({
            layout: "landscape",
          });
        });
      },
    });

    GetDataAPI({
      url: API.dm_store_Get_List,
      action: (re) => {
        Para.store_Get_List.data = re;
        // rs();
      },
    });

    // window.print()
  },
};
</script>
<style lang="scss" scoped>
@media screen {
  .phieu {
    display: none;
  }
}
@page {
  margin: 0;
  padding: 0;
}

table,
th,
td {
  border: 1px solid rgb(130, 130, 130);
  border-collapse: collapse;
}th{
  padding: 2.5px;
}

td{
  padding-left: 2.5px;
}

ol li {
  padding-bottom: 10px;
}
.phieu {
  // display: none;;
  font-family: "Times New Roman", Times, serif;
  margin: 0 5%;
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
