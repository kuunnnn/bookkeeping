<template>
  <bk-app-container>
    <template v-slot:header>
      <van-nav-bar title="账户管理" @click-right="toAdd">
        <template v-slot:right>
          <van-icon name="plus" size="18" />
        </template>
      </van-nav-bar>
    </template>
    <div class="bk-card bk-p10">
      <div class="bk-fcc">
        <span class="bk-font12">净资产</span>
        <span class="bk-bold">{{ assets.toFixed(2) }}</span>
      </div>
    </div>
    <div class="bk-card">
      <van-list style="width: 100%">
        <van-cell-group>
          <van-cell
            v-for="item in accountList"
            :key="item.id"
            @click="jumpToInfo(item.id)"
          >
            <template #title>
              <span>{{ item.name }}</span>
              <van-tag v-if="item.isDefault">默认</van-tag>
            </template>
            <span style="color: black">
              {{
                (
                  Number(item.initialAmount) +
                  Number(item.incomes) -
                  Number(item.expenses)
                ).toFixed(2)
              }}
            </span>
          </van-cell>
        </van-cell-group>
      </van-list>
    </div>
    <template v-slot:footer>
      <bk-bottom-nav-bar />
    </template>
  </bk-app-container>
</template>
<script>
import { AccountGraphqlService } from "../services/account-graphql-service";
import { Toast } from "vant";
import BottomNavBar from "../components/bottom-navbar";
import AppContainer from "../components/app-container";

export default {
  components: {
    "bk-bottom-nav-bar": BottomNavBar,
    "bk-app-container": AppContainer
  },
  data: () => ({
    accountList: [],
    loading: [],
    assets: 0
  }),
  mounted() {
    this.fetchAccountList();
  },
  methods: {
    back() {
      this.$router.back();
    },
    toAdd() {
      this.$router.push({ path: "/account-edit" });
    },
    async fetchAccountList() {
      try {
        const result = await AccountGraphqlService.fetchAccountList();
        this.accountList = result.data.accountList;
        this.loading = result.loading;
        this.assets = this.accountList.reduce((a, c) => {
          return (a +=
            Number(c.initialAmount) + Number(c.incomes) - Number(c.expenses));
        }, 0);
        if (result.errors) {
          Toast.fail("数据加载失败");
        }
      } catch (err) {
        Toast.fail("数据加载失败");
      }
    },
    jumpToInfo(id) {
      this.$router.push({ path: "/account-info", query: { id } });
    }
  }
};
</script>
