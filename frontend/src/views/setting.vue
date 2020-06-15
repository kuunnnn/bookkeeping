<template>
  <bk-app-container>
    <template v-slot:header>
      <van-nav-bar title="设置" />
    </template>
    <div class="bk-userInfo-bar">
      <div class="bk-userInfo-avatars">
        {{ avatar }}
      </div>
      <div class="bk-userInfo-bar-content">
        <span class="bk-userInfo-name">{{ userInfo.name || "无名氏" }}</span>
        <span class="bk-userInfo-phone">+86 {{ userInfo.phone }}</span>
      </div>
    </div>
    <van-cell is-link :to="editUserNameUrl">
      <template v-slot:title>
        <span style="color: #1989fa;">设置用户名</span>
      </template>
    </van-cell>
    <van-cell-group class="bk-mt20">
      <van-cell title="收入类别管理" is-link :to="incomeCategoryUrl" />
      <van-cell title="支出类别管理" is-link :to="expenseCategoryUrl" />
    </van-cell-group>
    <!--    <van-cell-group class="bk-mt-20">-->
    <!--      <van-cell title="导出账目" is-link/>-->
    <!--    </van-cell-group>-->
    <van-cell-group class="bk-mt20">
      <van-cell @click="logout">
        <div style="text-align: center;font-weight: bold;">退出登录</div>
      </van-cell>
    </van-cell-group>
    <template v-slot:footer>
      <bk-bottom-nav-bar />
    </template>
  </bk-app-container>
</template>

<script>
import BottomNavBar from "../components/bottom-navbar";
import AppContainer from "../components/app-container";
import { UserGraphqlService } from "../services/user-graphql-service";
import { Toast } from "vant";
import { AuthService } from "../services/auth-service";
import { Utils } from "../utils/utils";

export default {
  components: {
    "bk-bottom-nav-bar": BottomNavBar,
    "bk-app-container": AppContainer
  },
  data: () => ({
    userInfo: {},
    avatar: "BK",
    incomeCategoryUrl: {
      path: "/category",
      query: { type: "income" }
    },
    expenseCategoryUrl: {
      path: "/category",
      query: { type: "expense" }
    },
    editUserNameUrl: {
      path: "/editUserName"
    }
  }),
  mounted() {
    this.fetchUserInfo();
  },
  methods: {
    async fetchUserInfo() {
      try {
        const result = await UserGraphqlService.info();
        this.userInfo = result.data.user;
      } catch (err) {
        Toast.fail(err.message);
      }
    },
    async logout() {
      try {
        await AuthService.logout();
        Toast.success({ message: "退出成功!", duration: 200 });
        await Utils.sleep(200);
        await this.$router.push({ path: "/login" });
      } catch (e) {
        Toast.fail(e.message);
      }
    }
  }
};
</script>

<style scoped>
.bk-userInfo-bar {
  padding: 10px 15px;
  display: flex;
  align-items: center;
  background-color: white;
  border-bottom: 1px solid #e7e7e7;
}

.bk-userInfo-avatars {
  padding: 15px;
  margin-right: 20px;
  border-radius: 25px;
  color: white;
  background-image: linear-gradient(135deg, #fec163 10%, #de4313 100%);
}

.bk-userInfo-bar-content {
  display: flex;
  flex-direction: column;
}

.bk-userInfo-name {
  font-weight: bold;
  font-size: 18px;
}

.bk-userInfo-phone {
  color: #666;
  font-size: 14px;
}
</style>
