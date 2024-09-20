<template>
  <div
    class="login-c"
    style="background: url(/images/asset_bg.jpg); background-size: cover"
    v-loading="loading"
  >
    <div class="login">
      <div class="loginbox bg-white" style="padding: 20px; background: white">
        <div style="display: flex; justify-content: center">
          <img src="/images/icon/vec.jpg" />
        </div>
        <div class="loginbox-title" style="margin-bottom: 20px">
          Quản lý tài sản
        </div>
        <div>
          <label style="font-weight: bold">Email:</label>
          <el-input
            placeholder="Nhập tên tài khoản"
            size="medium"
            style="margin-top: 5px"
            v-model="obj.Email"
          />
        </div>
        <div style="margin-top: 10px">
          <label style="font-weight: bold">Mật khẩu:</label>
          <el-input
            placeholder="Nhập mật khẩu"
            size="medium"
            style="margin-top: 5px"
            v-model="obj.Password"
            type="password"
            @keyup.native.enter="Login()"
          />
        </div>
        <div style="margin-top: 20px">
          <el-button
            size="medium"
            style="width: 100%; display: flex; justify-content: center"
            type="primary"
            @click="Login()"
          >
            Đăng nhập
          </el-button>
        </div>
        <div
          style="
            display: flex;
            justify-content: flex-end;
            cursor: pointer;
            color: #2196f3;
            margin-top: 5px;
          "
          @click="ForgotPassword()"
        >
          Quên mật khẩu?
        </div>
        <!-- <div class="loginbox-social">
          <div class="social-title">Việt Nam</div>
          <div class="social-buttons"
               style="padding: 0px"
               @click="login">
            <img class="sign-in_btn"
                 width="492px"
                 height="auto"
                 src="/images/icon/sign-in-with-google.png" />
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import APIHelper from "~/assets/scripts/API/APIHelper";
import { ShowMessage } from "~/assets/scripts/Functions";
import StoreManager from "~/assets/scripts/StoreManager";
import { $auth } from "~/plugins/auth";

export default {
  layout: "blank",
  data() {
    return {
      obj: {
        Email: "",
        Password: "",
      },
    };
  },
  computed: {
    loading: function () {
      return StoreManager.IsShowLoading();
    },
  },
  methods: {
    ForgotPassword() {
      if (!this.obj.Email) {
        ShowMessage("Vui lòng nhập Email để thực hiện", "error");

        return;
      }

      APIHelper.Account.ResetPassword({
        Email: this.obj.Email,
      }).then((re) => {
        // console.log(re);
        ShowMessage(re);
      });
    },
    // login() {
    //   location.href = "/Auth/GoogleLogin";
    // },
    Login() {
      if (this.obj.Email && this.obj.Password) {
        APIHelper.Account.MobileLogin({
          Email: this.obj.Email,
          Password: this.obj.Password,
        }).then((re) => {
          $auth.access_token = re.access_token;
          $auth.identity = re.email;
          StoreManager.SetHeaders({
            Authorization: `Bearer ${re.access_token}`,
            Identity: re.email,
            SourceAuth: location.origin,
          });
          $auth.userinfo().then(() => {
            this.$router.push("/");
          });
        });
      } else ShowMessage("Vui lòng nhập đầy đủ thông tin");
    },
  },
};
</script>

<style lang="scss" scoped>
.login-c {
  background: white;
  height: 100%;

  .login {
    display: flex;
    justify-content: center;

    .loginbox {
      border: 1px solid #ddd;
      padding: 10px;
      box-shadow: 0px 0px 16px #ddd;
      margin-top: 10%;

      .loginbox-title {
        position: relative;
        text-align: center;
        width: 100%;
        height: 35px;
        padding-top: 10px;
        font-family: "Lucida Sans", "trebuchet MS", Arial, Helvetica;
        font-size: 20px;
        font-weight: normal;
        color: #444;
      }

      .loginbox-social {
        padding: 0 10px 10px;
        text-align: center;

        .social-title {
          font-size: 25px;
          font-weight: 500;
          color: #a9a9a9;
          margin-top: 10px;
        }

        .social-button {
          height: 80px;
          padding: 15px 35px;
          text-align: center;
        }
      }
    }
  }
}

.sign-in_btn {
  cursor: pointer;
}
</style>
