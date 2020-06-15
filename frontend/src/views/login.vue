<template>
  <bk-app-container>
    <template v-slot:header>
      <van-nav-bar title="登录/注册" :border="false" class="bk-login-bar-bg" />
    </template>
    <img src="../assets/4.webp" alt="bookkeeping" class="bk-w100" />
    <van-form @submit="onSubmit" class="bk-mt20">
      <van-cell-group>
        <van-field
          v-model="phone"
          label="手机"
          placeholder="请输入手机号"
          :rules="phoneRules"
          required
        />
        <van-field
          v-model="password"
          label="密码"
          placeholder="请输入密码"
          type="password"
          :rules="passwordRules"
          required
        />
      </van-cell-group>
      <bk-submit-button text="登录/注册" />
    </van-form>
  </bk-app-container>
</template>

<script>
import AppContainer from "../components/app-container";
import SubmitButton from "../components/submit-button";
import { AuthService } from "../services/auth-service";
import { StorageHelper } from "../utils/storage-helper";
import { phoneRegex, passwordRegex } from "../utils/regex-helper";
import { Toast } from "vant";
import { Utils } from "../utils/utils";

export default {
  components: {
    "bk-app-container": AppContainer,
    "bk-submit-button": SubmitButton
  },
  data: () => ({
    phone: "",
    phoneRules: [
      { required: true, message: "请输入手机号码" },
      {
        pattern: phoneRegex,
        message: "请输入正确的手机号码!"
      }
    ],
    password: "",
    passwordRules: [
      { required: true, message: "请输入密码" },
      {
        pattern: passwordRegex,
        message: "最短6位，最长16位 {6,16}"
      }
    ]
  }),
  mounted() {
    if (StorageHelper.getToken().access_token) {
      AuthService.tokenLogin()
        .then(this.jump)
        .catch(console.log);
    }
  },
  methods: {
    async onSubmit() {
      try {
        const isRegister = await AuthService.isRegister(this.phone);
        let user;
        if (isRegister) {
          user = await AuthService.login(this.phone, this.password);
        } else {
          user = await AuthService.register(this.phone, this.password);
        }
        StorageHelper.setToken(user.access_token, user.refresh_token);
        Toast.success({ message: "登录成功", duration: 300 });
        await Utils.sleep(300);
        await this.$router.push({ path: "/" });
      } catch (e) {
        Toast.fail(e.message);
      }
    },
    async jump() {
      if (this.$route.query?.redirect) {
        await this.$router.push(this.$route.query.redirect);
      }
    }
  }
};
</script>
