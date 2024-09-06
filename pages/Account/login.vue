<template>
  <div class="login-c">
    <div style="width: 103px; margin: 0 auto">
      <img width="103px"  src="/images/icon/wwf-logo.jpg" />
    </div>
    <div class="login">
      <div class="loginbox bg-white">
        <div class="loginbox-title">Fixed Assets Management Tool</div>
        <div class="loginbox-social">
          <div class="social-title">WWF-Viet Nam</div>
          <div class="social-buttons" style="padding: 0px" @click="login">
            <img
              class="sign-in_btn"
              width="492px"
              height="auto"
              src="/images/icon/sign-in-with-google.png"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  layout: "blank",
  methods: {
    login() {
      location.href = "/Auth/GoogleLogin";
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
