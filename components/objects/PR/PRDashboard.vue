<template>
  <div v-if="type == 'ForProcurment'" class="fo-c">
    <div
      style="
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        align-items: center;
        height: 100%;
      "
    >

      <div
        style="
          display: flex;
          width: 100%;
          flex: 1;
          overflow: auto;
          justify-content: center;
        "
      >

        <PRSumary
          class="procurement-c"
          v-for="item in summary.filter((p) => p.child)"
          :key="item.id"
          :model="item"
          :type="type"
        />
      </div>
    </div>
    <DefaultForm :model="form_profile" @actionOK="SaveProfile()">
      <div slot="content">
        <FormInfo ref="user_profile" :model="user_profile.form()" />
      </div>
    </DefaultForm>
  </div>

  <div v-else-if="type == 'ForOffice'" class="fo-c">
    <div
      style="
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        align-items: center;
        height: 100%;
      "
    >
      <div class="fo-head-c">
        <div class="fo-head-avatar" @click="profile()">
          <img :src="$auth.user.Picture" style="padding-right: 10px" />
          <span> {{ user.FullName }} </span>
        </div>
        <div class="fo-items">
          <PRSumary
            v-for="item in home"
            :key="item.id"
            :model="item"
            :type="type"
          />
        </div>
      </div>
      <div
        style="
          display: flex;
          width: 100%;
          flex: 1;
          overflow: auto;
          justify-content: center;
        "
      >
        <PRSumary
          v-for="item in summary.filter((p) => p.child)"
          :key="item.id"
          :model="item"
          :type="type"
        />
      </div>
    </div>
    <DefaultForm :model="form_profile" @actionOK="SaveProfile()">
      <div slot="content">
        <FormInfo ref="user_profile" :model="user_profile.form()" />
      </div>
    </DefaultForm>
  </div>
  <div v-else>
    <div
      style="
        display: flex;
        flex-wrap: wrap;
        padding: 0 10px;
        margin-right: -20px;
      "
    >
      <PRSumary
        v-for="item in summary"
        :key="item.id"
        :model="item"
        :type="type"
      />
    </div>

    <!-- <PRSumary :model="master" :type="type" /> -->
  </div>
</template>

<script>
import API from "~/assets/scripts/API";
import DefaultForm from "~/assets/scripts/base/DefaultForm";
import ConstData from "~/assets/scripts/ConstData";
import GetDataAPI from "~/assets/scripts/GetDataAPI";
import { LoginResult } from "~/assets/scripts/objects/LoginResult";
import StoreManager from "~/assets/scripts/StoreManager";
export default {
  props: {
    summary: {
      type: Array,
    },
    type: {},
  },
  data() {
    return {
      master: {
        type: 0,
        name: "MASTER LIST",
        background: "#795548",
      },
      actionRequired: 0,
      home: ConstData.Dashboard.ForOffice.filter((p) => !p.child),
      procurment: ConstData.Dashboard.ForProcurment.filter((p) => !p.child),
      profile_pop_visible: false,
      user_profile: new LoginResult(),
      form_profile: new DefaultForm({
        title: "User profile",
        width: "400px",
      }),
    };
  },
  methods: {
    SaveProfile() {
      // alert("123");
      // console.log(this);
      this.$refs.user_profile.getValidate().then((re) => {
        if (re) {
          this.$refs.user_profile
            .getEntry("txtImage")
            .submitUpload()
            .then((results) => {
              this.user_profile.Image = results[0];
              GetDataAPI({
                method: "post",
                url: API.UpdateProfile,
                params: this.user_profile.toJSON(),
                action: (re) => {
                  StoreManager.SetUser(this.user_profile);
                  this.form_profile.visible = false;
                  // location.reload(true);
                },
              });
            });
        } else {
          ShowMessage("Please enter full information", "error");
        }
      });
    },
    profile() {
      this.profile_pop_visible = false;
      this.user_profile.update({
        ...this.user,
        Email: this.$auth.user.Email,
      });
      this.form_profile.visible = true;
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.fo-head-c {
  flex: 0 0 100px;
  background: black;
  width: 100%;
  margin-bottom: 50px;
  display: flex;
  justify-content: center;
  color: white;
  font-size: 15px;
  .fo-head-avatar {
    display: flex;
    align-items: center;
    margin-right: 150px;
    cursor: pointer;

    img {
      height: 60px;
    }
  }
  .fo-items {
    min-width: 450px;
    display: flex;
    align-items: center;

    .pr-summary-cc {
      flex: auto;
      min-width: auto;
      padding-left: 20px;
      &:last-of-type {
        ::v-deep  .pr-summary-c {
          border: 0;
        }
      }
      ::v-deep  .pr-summary-c {
        background: transparent !important;
        border: 0;
        margin: 0;
        padding: 0;
        border-right: 1px solid white;
        border-radius: 0;
        height: auto;
        padding-right: 20px;

        .pr-summary-value {
          font-size: 35px;
          font-weight: normal;
        }
        .pr-summary-label {
          font-size: 15px;
          font-weight: normal;
          text-transform: none;
        }
      }
    }
  }
}
.fo-c {
  padding: 0px;
  margin: 0px -5px;
  height: 100%;
  // background: url(/images/background.jpg);
  overflow-x: hidden;
  background-size: cover;
}

// .procurement-c.pr-summary-cc {
//   ::v-deep  {
//     > .pr-summary-c {
//       height: 110px;
//       .pr-summary-value {
//         font-size: 35px;
//       }
//       .pr-summary-label {
//         font-size: 20px;
//       }
//     }
//   }
// }
</style>
