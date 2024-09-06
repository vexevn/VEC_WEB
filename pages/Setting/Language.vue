<template lang="">
  <div>
    <el-button @click="formLang.ShowForm(true,{})"> Add </el-button>

    <DefaultForm :model="formLang" @actionOK="formLang.Save.call(this)">
      <div class="lang" style="height: calc(100vh - 30vh)" slot="content">
        <FormInfo :model="formLang.obj.form()" />
      </div>
    </DefaultForm>
  </div>
</template>
<script>
import API from "~/assets/scripts/API";
import DefaultForm from "~/assets/scripts/base/DefaultForm";
import { ShowMessage } from "~/assets/scripts/Functions";
import GetDataAPI from "~/assets/scripts/GetDataAPI";
import Lang from "~/assets/scripts/objects/language/lang";
export default {
  data() {
    return {
      formLang: new DefaultForm({
        obj: new Lang(),
        width: "800px",
        // fullscreen: true,
        title: "Add Language",
        visible: false,
        appendtobody: true,
        ShowForm: (isAdd,obj)=>{
          this.formLang.obj = new Lang(obj);
          this.formLang.visible=true;
        },
        Save:()=>{
          // console.log(this.formLang.obj)
          GetDataAPI({
            url: API.Language_AddForm,
            method: "post",
            params: this.formLang.obj.toJSON(),
            action: re =>{
              console.log(re)
              ShowMessage("Thêm thành công",'success')
              this.formLang.visible=false;
            }
          })
        }
      }),
    };
  },
};
</script>
<style lang="scss" scoped>
.lang{
  .form-info{
    height: 100%;
  }
}

</style>
