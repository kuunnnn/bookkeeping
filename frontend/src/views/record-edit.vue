<template>
  <bk-app-container>
    <template v-slot:header>
      <van-nav-bar left-arrow @click-left="back" title="编辑">
        <template #right>
          <span style="color:red;" @click="onSubmit">提交</span>
        </template>
      </van-nav-bar>
    </template>

    <bk-record-edit ref="form" />
  </bk-app-container>
</template>

<script>
import RecordEdit from "../components/record-edit";
import AppContainer from "../components/app-container";
import { Toast } from "vant";

export default {
  components: {
    "bk-record-edit": RecordEdit,
    "bk-app-container": AppContainer
  },
  data: () => ({
    active: 0,
    type: "expense"
  }),
  mounted() {},
  methods: {
    back() {
      this.$router.back();
    },
    async onSubmit() {
      try {
        await this.$refs.form.onSubmit();
        this.back();
      } catch (e) {
        Toast.fail(e.message);
      }
    }
  }
};
</script>

<style scoped>
.category-list {
  display: flex;
  padding: 15px;
  flex-flow: row wrap;
}
.tag {
  padding: 5px 10px;
  margin: 10px;
  justify-content: center;
}
.selected {
  color: red;
}
</style>
