<template>
  <FormVue :pr_id="$route.params.id" />
</template>

<script>
import FormVue from "../Form.vue";

export default {
  components: {
    FormVue,
  },
};
</script>

<style lang="scss" scoped>
</style>
