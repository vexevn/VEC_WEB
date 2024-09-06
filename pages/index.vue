<template>
  <!-- <div style="display: flex; justify-content: center">
      <div v-for="item in UserPermission" :key="item.Id">
        <el-button @click="ProcessUserPermission(item)">
          {{ item.Name }}
        </el-button>
      </div>
    </div>
    Chức vụ hiện tại: {{ permission }} -->
  <!-- <div>
    <nuxt-link :to="switchLocalePath('en')">English</nuxt-link>
    <nuxt-link :to="switchLocalePath('vi')">Tiếng Việt</nuxt-link>

    {{ $t('welcome') }}
    {{ $t('xxx') }}
  </div> -->
  <!-- <pre>
    {{ $store.state.menu }}
  </pre> -->
</template>

<script>
import StoreManager from "~/assets/scripts/StoreManager";

export default {
  data() {
    return {};
  },
  computed: {
    user_level() {
      return StoreManager.GetUserLevel();
    },
  },
  methods: {},
  mounted() {
    // this.$router.push('/PRList/ForOffice')
  },
};
</script>

<style lang="scss" scoped></style>
