<template lang="">
  <div  style="flex:1;max-height:290px;overflow:auto">
    <h4 style="margin-bottom: 10px;">Lịch sử thay đổi vị trí</h4>
    <div class="his-c" v-for="(item,index) in data" :key="item.Id">
      <p class="his-time">
        {{ ConvertStr.ToDateStr(item.Start_Date, "DD/MM/yyyy HH:mm") }}
      </p>
      <div class="his-content">
        <div class="his-content-item">
        <span><b>Từ </b></span>
          <span>{{ Para.TransferType.getName(item.From_Type_id) }}: </span>
          <span>{{ Para.store_Get_List.getName(item.From_Holder_id) }}</span>
        </div>
        <!-- <i class="fa fa-long-arrow-up" aria-hidden="true"></i> -->
        <div class="his-content-item">
            <span><b>Đến </b></span>

          <span>{{ Para.TransferType.getName(item.To_Type_id) }}: </span>
          <span :style="{color: index == data.length  - 1 ? '#0058b0' : ''}">{{ Para.store_Get_List.getName(item.To_Holder_Id) }}</span>
        </div>
      </div>
    </div>

    <div v-if="data.length== 0">
        <i>Chưa ghi nhận sự thay đổi</i>
    </div>
  </div>
</template>
<script>
import API from "~/assets/scripts/API";
import GetDataAPI from "~/assets/scripts/GetDataAPI";

export default {
  props: {
    obj: {},
  },
  data() {
    return {
      data: [],
    };
  },
  mounted() {
    // console.log(this);
    GetDataAPI({
      url: API.Get_Transfer + `?iFixed_Asset_id=${this.obj.Fixed_Asset_id}`,
      action: (re) => {
        console.log(re);
        this.data = re;

        this.$nextTick(()=>{
            // console.log(this)
            this.$el.scrollTop = this.$el.clientHeight
        })
      },
    });
  },
};
</script>
<style lang="scss" scoped>
.his-c{
    width: 100%;
    border:1px solid rgb(205, 205, 205);
    border-radius: 5px;
    margin-bottom: 10px;
    position: relative;
    .his-time{  
        color: #0058b0;
        position: absolute;
        top: 0;
        left: 0;
        transform: translate(10px,-50%);
        z-index: 1
        ;
        background-color: white;
        padding: 2px;

        border-radius: 5px;
    }
    .his-content{
        padding: 8px 5px 5px 5px;
        position: relative;
        // i{      color: #2f91f2;
        //     font-size: 18px;
        //     position: absolute;
        //     left: -5px;
        //     top: 24px;
        //     transform: rotate(-180deg);
        //     // transform: translateX(0px)
        // }

        .his-content-item{
            span{
                word-break: auto-phrase;
            }
        }
    }
}
</style>
