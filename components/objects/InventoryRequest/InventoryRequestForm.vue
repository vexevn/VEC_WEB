<template lang="">
  <div style="display: flex; height: 100%">
    <FormInfo style="width: 30%" ref="form" :model="obj.form()" />
    <div style="width:70%" class="asset-info">
        <TablePaging :model="tp" ref="tp">
     
            <template slot="column-content-State" slot-scope="obj">
                <span v-if="obj.row.State == 2"> <i style="color:green" class="fa fa-check"></i></span>
                <span v-else> <i style="color:red" class="fa fa-times"></i></span>
      </template>
    </TablePaging>
    </div>
  </div>
</template>
<script>
import API from "~/assets/scripts/API";
import TablePaging from "~/assets/scripts/base/TablePaging";
import TablePagingCol from "~/assets/scripts/base/TablePagingCol";
import GetDataAPI from "~/assets/scripts/GetDataAPI";
import { EventBus } from "~/assets/scripts/EventBus.js";
import { Para } from "~/assets/scripts/Para";

export default {
  props: {
    obj: {},
  },
  data() {
    return {
        tp: new TablePaging({
        isSearchEqual: true,
        // disableSelectRow: true,
        cols: [
          new TablePagingCol({
            data: "SttTP",
            title: "#",
            min_width: 50,
            sortable: false,
          }),
          new TablePagingCol({
            data: "Fixed_Asset_Name",
            title: "Tên tài sản",
            min_width: 180,
            width: "auto",
            sortable: false,
          }),
          new TablePagingCol({
            data: "Fixed_Asset_State",
            title: "Trạng thái",
            min_width: 180,
            width: "auto",
            sortable: false,
            formatter: (value) =>  Para.fixed_asset_state_Get_List.getName(value)
          }),
          new TablePagingCol({
            data: "Description",
            title: "Mô tả",
            min_width: 180,
            width: "auto",
            sortable: false,
          }),
          new TablePagingCol({
            data: "State",
            title: "Tình trạng kiểm kê",
            min_width: 180,
            width: "auto",
            sortable: false,
            align: 'center'
          }),
     

          // new TablePagingCol({
          //   data: "Store_Info",
          //   title: "Store",
          //   min_width: 180,
          //   width: "auto",
          //   sortable: false,
          // }),
        

          new TablePagingCol({
            data: "buttons",
            title: "",
            min_width: 80,
            sortable: false,
          }),
        ],
        data: [],
      }),
    };
  },
  methods:{
    LoadData(data,id){
        console.log(data,id)
        GetDataAPI({
            url: API.GetFixed_Asset_Inventory,
            params:{
                Inventory_id: data.Id,
                Store_id: id,
            },
            action:(re)=>{
                this.tp.data = re;
                this.$refs.tp.LoadData(true)
            }
        })
    },
    // LoadTable(){
    //     GetDataAPI({
    //         url: API.GetFixed_Asset_Inventory,
    //         params:{
    //             Inventory_id: obj.Id,
    //             Store_id: 
    //         }
    //     })
    // }
  },
  mounted(){
    console.log(this.obj)
  },

  beforeMount() {
    EventBus.$on("reloadFormFam", this.LoadData);
  },

  beforeDestroy() {
    EventBus.$off("reloadFormFam", this.LoadData);
  },

};
</script>
<style lang="scss">
.form-info-c{
    height: 100%;
    overflow: hidden;
display: flex;
flex-direction: column;
    .el-row:last-child{
        height: 100%;
        overflow: hidden;
    }
}
</style>
