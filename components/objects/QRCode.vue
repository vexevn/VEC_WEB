<template lang="">
  <div class="QRCode">
    <qrcode-vue v-if="data" :value="data" :size="size" level="L"></qrcode-vue>
  </div>
</template>
<script>
import QrcodeVue from "qrcode.vue";

export default {
    components: {
    QrcodeVue,
  },
  props:{
    data: {},
  },
  data() {
    return {
      value: "qweqweqe",
      size: 91,
    };
  },
  mounted(){
    // console.log(this.data)
  }
};
</script>
<style lang=""></style>
