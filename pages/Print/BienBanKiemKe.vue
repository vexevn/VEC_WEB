<template lang="">
  <Printer :model="printConfig">
    <div class="phieu">
      <div class="phieu-header">
<div style="display:flex;    justify-content: space-around;">
  <div class="cty">
      <h3><u>TỔNG CÔNG TY ĐTPT ĐƯỜNG CAO TỐC VIỆT NAM </u></h3>
      <h3><u>KHỐI VĂN PHÒNG TỔNG CÔNG TY</u></h3>
      </div>

      <div class="quocky">
        <h3>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h3>
        <h5 style="font-size: 16px; text-decoration: underline">
          Độc lập - Tự do - Hạnh phúc
        </h5>

      </div>
</div>
     
       
        <br />
        <br />
        <h2>BIÊN BẢN KIỂM KÊ TÀI SẢN, VẬT TƯ, CÔNG CỤ, SẢN PHẨM, HÀNG HOÁ</h2>
        <div>
        <span>Từ </span
        ><span>{{ ConvertStr.ToDateStr(data.Inventory.FromDate) }} </span>
        <span>- Đến </span
        ><span>{{ ConvertStr.ToDateStr(data.Inventory.ToDate) }}</span>
      </div>
        <p>{{ data.Inventory.Description }}</p>

      </div>
<div>

     <span>Đã kiểm kê tài sản, công cụ tại </span> <span>........................................................................................</span>
     <span> như sau: </span>
</div>

      <div
        style="text-align: justify; margin-top: 15px"
        class="phieu-content"
      ></div>
      <!-- {{ data.Details.length }} -->
      <div style="margin: 6px 0" class="as-table">
        <table style="width:100%">
          <tr>
            <th style="width: 40px">STT</th>
            <th style="width:150px">Mã tài sản</th>
            <th>Tên tài sản</th>
            <th style="width: 150px">Phòng quản lý</th>
            <th style="width: 150px">Nguồn vốn</th>
            <th style="width: 100px">Trạng thái</th>
            <th style="width:200px">Ghi chú</th>
          </tr>
          <tr v-for="(item, index) in data.Details" :key="index">
            <td
              :colspan="item.hasOwnProperty('Stt') ? '7' : '1'"
              :style="{
                padding: '5px 0',
                backgroundColor: item.hasOwnProperty('Stt')
                  ? 'rgb(182 218 255)'
                  : '',
                textAlign: item.hasOwnProperty('Stt') ? 'left' : 'center',
                paddingLeft: item.hasOwnProperty('Stt') ? '5px' : '0px',
                fontWeight: item.hasOwnProperty('Stt') ? 'bold' : '',
              }"
            >
              {{
                item.hasOwnProperty("Stt")
                  ? " " + item.Stt + ". " + item.Name
                  : item.i + 1
              }}
            </td>
            <td v-if="!item.hasOwnProperty('Stt')" style="font-weight: normal">
              {{ item.Fixed_Code }}
            </td>
            <td v-if="!item.hasOwnProperty('Stt')" style="font-weight: normal">
              {{ item.Fixed_Name }}
            </td>
            <td v-if="!item.hasOwnProperty('Stt')" style="font-weight: normal">
              {{ item.Department }}
            </td>
            <td v-if="!item.hasOwnProperty('Stt')" style="font-weight: normal">
              {{ item.Nguonvon }}
            </td>
            <td v-if="!item.hasOwnProperty('Stt')" style="font-weight: normal">
              {{ Para.fixed_asset_state_Get_List.getName(item.State) }}
            </td>
            <td v-if="!item.hasOwnProperty('Stt')" style="font-weight: normal">
              {{ item.Note }}
            </td>
          </tr>
        </table>
      </div>

      <div class="phieu-footer">
        <div class="qltt">
          <b>Trưởng đơn vị kiểm kê</b>
          <p><i>(Ký, họ tên)</i></p>
        </div>
        <div class="ungvien">
          <b>Cán bộ kiểm kể</b>
          <p >
            <p><i>(Ký, họ tên)</i></p>
          </p>
        </div>
        <div class="ungvien">
          <b>Đại diện đơn vị kiểm kê</b>
         
            <p><i>(Ký, họ tên)</i></p>
      
        </div>
        <div class="date" style="margin-top: -20px;">
         <p>..........., <span>Ngày {{today.getDate().toString().length == 1 ? '0' + today.getDate() : today.getDate()}}, tháng {{today.getMonth().toString().length == 1 ? '0' + today.getMonth() : today.getMonth()}}, năm {{today.getFullYear()}}</span></p>
         <b>Trưởng ban kiểm kê</b>
          <p >
            <p><i>(Ký, họ tên)</i></p>
          </p>
        </div>
      </div>
    </div>
  </Printer>
</template>
<script>
import API from "~/assets/scripts/API";
import PrintCfg from "~/assets/scripts/base/PrintCfg";
import GetDataAPI from "~/assets/scripts/GetDataAPI";
import { Para } from "~/assets/scripts/Para";

export default {
  layout: "PrinLayout",
  computed: {},
  computed:{
    today(){
      return new Date();
    }
  },
  data() {
    return {
      dataPrint: JSON.parse(localStorage.dataPrint),
      printConfig: "",
      data: { Inventory: {}, Details: [] },
      nonSttCounter: 0,
    };
  },
  watch: {},
  methods: {
    // getNonSttIndex() {
    //   this.nonSttCounter += 1; // Tăng bộ đếm
    //   return this.nonSttCounter; // Trả về giá trị bộ đếm
    // },
    toRoman(num) {
      const romanNumerals = [
        { value: 1000, symbol: "M" },
        { value: 900, symbol: "CM" },
        { value: 500, symbol: "D" },
        { value: 400, symbol: "CD" },
        { value: 100, symbol: "C" },
        { value: 90, symbol: "XC" },
        { value: 50, symbol: "L" },
        { value: 40, symbol: "XL" },
        { value: 10, symbol: "X" },
        { value: 9, symbol: "IX" },
        { value: 5, symbol: "V" },
        { value: 4, symbol: "IV" },
        { value: 1, symbol: "I" },
      ];

      let roman = "";

      romanNumerals.forEach(({ value, symbol }) => {
        while (num >= value) {
          roman += symbol;
          num -= value;
        }
      });

      return roman;
    },
    processData(data) {
      let tmp = [];
      data.forEach((p, index) => {
        let obj = {};
        obj.Name = p.Name;
        obj.Stt = this.toRoman(index + 1);
        tmp.push(obj);
        if (p.Childs && p.Childs.length) {
          tmp = [
            ...tmp,
            ...p.Childs.map((child, i) => {
              this.$set(
                child,
                "i",
                i + ((data[index - 1] || {}).Childs || []).length
              ); // Thêm thuộc tính 'i' vào đối tượng
              return child;
            }),
          ];
        }
      });
      return tmp;
    },
  },

  mounted() {
    GetDataAPI({
      url: API.Inventory_Get_Print,
      params: {
        iInventory_id: this.dataPrint.Id,
      },
      action: (re) => {
        // console.log(re);
        this.data = re;
        this.data.Details = this.processData(re.Details);
        // console.log(this.data);

        this.$nextTick(() => {
          setTimeout(() => {
            this.printConfig = new PrintCfg({
              layout: "landscape",
            });
          }, 0);
        });
      },
    });

    // window.print()
  },
};
</script>
<style lang="scss" scoped>
@page {
  margin: 0;
  padding: 0;
}

@media screen {
  .phieu {
    display: none;
  }
}
table,
th,
td {
  border: 1px solid rgb(130, 130, 130);
  border-collapse: collapse;
}

th{
  padding: 5px;
}

td{
  padding-left: 5px;
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
    margin-top: 30px;
    display: flex;
    align-items: center;
    > div {
      width: 50%;
      text-align: center;
    }
    b{
      font-size: 18px;
    }
    .qltt {
    }
  }
}

ol li {
  font-weight: bold;
}
</style>
