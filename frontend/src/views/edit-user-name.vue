<template>
  <bk-app-container>
    <template v-slot:header>
      <van-nav-bar title="编辑用户名" left-arrow @click-left="back" />
    </template>
    <van-form @submit="onSubmit" class="bk-mt20">
      <van-cell-group>
        <van-field
          v-model="name"
          label="用户名"
          placeholder="请输入用户名"
          :rules="nameRules"
          required
        />
      </van-cell-group>
      <bk-submit-button />
    </van-form>
  </bk-app-container>
</template>

<script>
import AppContainer from "../components/app-container";
import SubmitButton from "../components/submit-button";
import { UserGraphqlService } from "../services/user-graphql-service";
import { Toast } from "vant";
import { userNameRegex } from "../utils/regex-helper";
import { Utils } from "../utils/utils";

export default {
  components: {
    "bk-app-container": AppContainer,
    "bk-submit-button": SubmitButton
  },
  data: () => ({
    name: "",
    userInfo: {},
    nameRules: [
      { required: true, message: "请填写用户名" },
      {
        pattern: userNameRegex,
        message: "4-16位字母,数字,汉字,下划线的组合"
      }
    ]
  }),
  mounted() {
    this.fetchUserInfo();
  },
  methods: {
    back() {
      this.$router.back();
    },
    async fetchUserInfo() {
      try {
        const result = await UserGraphqlService.info();
        this.userInfo = result.data.user;
        this.name = this.userInfo.name;
      } catch (err) {
        Toast.fail(err.message);
      }
    },
    async onSubmit() {
      try {
        if (this.name !== this.userInfo.name) {
          await UserGraphqlService.updateUserName(this.name);
          Toast.success("修改成功");
          await Utils.sleep(300);
        }
        this.back();
      } catch (err) {
        Toast.fail(err.message);
      }
    }
  }
};
</script>
