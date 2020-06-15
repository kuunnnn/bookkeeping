<template>
  <bk-app-container>
    <template v-slot:header>
      <van-nav-bar
        title="编辑账目"
        left-arrow
        @click-left="back"
        @click-right="onSubmit"
        right-text="保存"
      />
    </template>
    <bk-record-edit ref="recordEdit" :type="type" />
  </bk-app-container>
</template>
<script>
import AppContainer from "../components/app-container";
import RecordEdit from "../components/record-edit";
import { Toast } from "vant";

export default {
  components: {
    "bk-app-container": AppContainer,
    "bk-record-edit": RecordEdit
  },
  data: () => ({
    type: "expense"
  }),
  mounted() {
    if (this.$route?.query?.type === "income") {
      this.type = "income";
    }
  },
  methods: {
    back() {
      this.$router.back();
    },

    async onSubmit() {
      try {
        await this.$refs.recordEdit.onSubmit();
        this.back();
      } catch (e) {
        Toast.fail(e.message);
      }
    }
  }
};
</script>
