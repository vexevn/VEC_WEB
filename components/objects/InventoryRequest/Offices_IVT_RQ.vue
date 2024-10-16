<template lang="">
  <div class="IV" style="">
    <h4>Văn phòng</h4>
    <el-tree
      class="tree"
      :check-on-click-node="false"
      show-checkbox
      highlight-current
      :props="defaultProps"
      :data="tree"
      node-key="Id"
      @check-change="checkNodeClick"
      @node-click="nodeClick"
      @check="check"
      ref="tree"
    ></el-tree>
  </div>
</template>
<script>
import API from "~/assets/scripts/API";
import GetDataAPI from "~/assets/scripts/GetDataAPI";
import { EventBus } from "~/assets/scripts/EventBus.js";
export default {
  props: {
    data: {},
  },
  data() {
    return {
      office: [],
      tree: [],
      defaultProps: {
        children: "Department",
        label: "Name",
      },
    };
  },
  methods: {
    nodeClick(obj, node, treeNode) {
      if (obj.Type_id == 2) {
        EventBus.$emit("reloadFormFam", this.data, obj.Id);
      }
    },

    check(obj, TreeCheckStatus) {
      // console.log(obj, TreeCheckStatus);
      // this.data.Offices = [];
      this.data.Store = [];
        TreeCheckStatus.checkedNodes.forEach((p) => {
        if (p.Type_id == 1) {
          // if(p.isChangedId){
          //   let newId = p.Id;
          //   this.data.Offices.push(Number(newId.toString().slice(newId.toString().length/2)));
          // }else{
          //   this.data.Offices.push(p.Id)
          // }

        } else {     
            this.data.Store.push(p.Id); 
        }
      });
      // if(TreeCheckStatus.halfCheckedKeys.length > 0) {

      //   this.data.Offices = [...this.data.Offices,...TreeCheckStatus.halfCheckedKeys];
      // }
     
      // // console.log(this.tree)
      // console.log(this.data.Offices)
      // console.log(this.data.Store)
    },

    checkNodeClick(obj, node, e) {
      // console.log(obj,node,e)
      // if (obj.Type_id == 1) {
      //   // console.log('office')
      //   // if(node == true){
      //   //     this.data.Store.push(obj.Id)
      //   // }else{
      //   //     this.data.Store = this.data.Store.filter(p => p !== obj.Id)
      //   // }
      // } else {
      //   if (node == true) {
      //     this.data.Store.push(obj.Id);
      //   } else {
      //     this.data.Store = this.data.Store.filter((p) => p !== obj.Id);
      //   }
      //   // console.log('depart')
      // }

      // if(obj.Department && node.checkedKeys && node.checkedKeys.length > obj.Department.length){
      //     this.data.Store = node.checkedKeys.slice(1)
      // }else
      // this.data.Store = node.checkedKeys
      // if(node.cheked)
      // console.log( this.data.Store);
    },
    processData(re) {
      const lv2 = new Set();
      re.forEach((lv1) => {
        if (lv1.Department && lv1.Department.length > 0) {
          lv1.Department.forEach((lv2D) => {
            lv2.add(lv2D.Id);
          });
        }
      });

      re.forEach((lv1) => {
        if (lv2.has(lv1.Id)) {
          lv1.Id = Number(lv1.Id.toString() + lv1.Id.toString());
          lv1.isChangedId = true;
        }
      });

      return re;
    },
  },
  mounted() {
    // console.log(this.data);

    GetDataAPI({
      url: API.dm_Get_Tree,

      action: (re) => {
        //    value.children = re;
        this.tree = this.processData(re);
        // this.tree = re;
        //    this.$refs.tree.setCheckedKeys(this.data.Offices)
        // console.log(this.tree);
        this.$refs.tree.setCheckedKeys(this.data.Store);
      },
    });
  },
};
</script>
<style lang="scss" scoped>
.IV {
  height: 100%;
  display: flex;
  overflow: auto;
  flex-direction: column;
  .tree {
    // background-color: aqua;
    ::v-deep .el-tree-node__content {
      height: 20px;
      .el-tree-node__label {
        font-size: 14px;
      }
    }
  }
}

h4 {
  // position: absolute;
  // top: 0;
}
.ckb-of {
  ::v-deep .el-checkbox {
    font-size: 12px;
    color: black;
    display: flex;
    align-items: center;
    white-space: normal;
    word-wrap: break-word;
    .el-checkbox__label {
      font-size: 12px;
      font-weight: 400;
    }
  }
}
</style>
