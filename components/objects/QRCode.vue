<template lang="">
  <div class="QRCode">
    <el-button
      class="btn-print"
      type="primary"
      style="padding: 5px 7px"
      @click="printQRCode"
      ><i class="fa fa-print" aria-hidden="true"></i
    ></el-button>
    <qrcode-vue
      ref="qrcode"
      v-if="data"
      :value="data"
      :size="size"
      level="L"
    ></qrcode-vue>
  </div>
</template>
<script>
import QrcodeVue from "qrcode.vue";

export default {
  components: {
    QrcodeVue,
  },
  props: {
    data: {},
  },
  data() {
    return {
      value: "qweqweqe",
      size: 91,
    };
  },
  methods: {
    printQRCode() {
      const qrcodeElement = this.$refs.qrcode.$el.querySelector("canvas");
      
      const imageURL = qrcodeElement.toDataURL("image/png");
      const newWindow = window.open("", "_blank");
      const style = newWindow.document.createElement("style");
      style.textContent = `
      @media screen {
        img {
          display: none; 
        }
      }
      `;
      newWindow.document.head.appendChild(style);
      const image = new Image();
      image.src = imageURL;

      image.onload = () => {
        newWindow.document.body.appendChild(image);
        newWindow.document.close();
        newWindow.focus();
        newWindow.print();
        newWindow.close();
      };
    },
  },
  mounted() {
    // console.log(this.data)
  },
};
</script>
<style lang="scss" scoped>
.QRCode {
  position: relative;
  &:hover {
    .btn-print {
      opacity: 1;
    }
  }
  .btn-print {
    opacity: 0;
    position: absolute;
    transition: opacity 0.2 ease;
  }
}
</style>
