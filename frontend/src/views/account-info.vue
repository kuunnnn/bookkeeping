<template>
  <bk-app-container>
    <template v-slot:header>
      <van-nav-bar title="账户信息" left-arrow @click-left="back" border>
        <template v-slot:right>
          <van-icon @click="jumpToEdit" name="edit" size="18" />
        </template>
      </van-nav-bar>
    </template>
    <div class="bk-card bk-fcc p20-10">
      <span class="bk-font12">余额</span>
      <span class="bk-bold">
        {{ balance }}
      </span>
    </div>
    <div class="bk-card" v-for="month in list" :key="month.date">
      <van-cell :title="month.date">
        <span class="bk-mr-5" style="color: black">
          支: {{ month.expenseMoney }}
        </span>
        <span style="color: black"> 收: {{ month.incomeMoney }} </span>
      </van-cell>
      <van-cell
        v-for="item in month.list"
        :key="item.id"
        :title="item.categoryName"
        :label="formatDate(item.date)"
      >
        <div class="bk-col">
          <span
            :style="{
              color: item.type === 'income' ? 'green' : 'red'
            }"
          >
            {{ item.money.toFixed(2) }}
          </span>
          <span class="van-cell__label">{{ account.name }}</span>
        </div>
      </van-cell>
    </div>
  </bk-app-container>
</template>

<script>
import { AccountGraphqlService } from "../services/account-graphql-service";
import { Toast } from "vant";
import day from "dayjs";
import { Utils } from "../utils/utils";
import AppContainer from "../components/app-container";

export default {
  components: {
    "bk-app-container": AppContainer
  },
  data: () => ({
    account: { expenses: "0.00", initialAmount: "0.00", incomes: "0.00" },
    list: []
  }),
  mounted() {
    this.fetchAccountInfo();
  },
  computed: {
    balance: function() {
      const { incomes, initialAmount, expenses } = this.account;
      return (
        Number(initialAmount) +
        Number(incomes) -
        Number(expenses)
      ).toFixed(2);
    }
  },
  methods: {
    jumpToEdit() {
      this.$router.push({
        path: "/account-edit",
        query: { id: this.account.id }
      });
    },
    back() {
      this.$router.back();
    },
    formatDate(date) {
      return day(date).format("MM-DD");
    },
    async fetchAccountInfo() {
      try {
        const result = await AccountGraphqlService.infoAndRecordList(
          Number(this.$route.query.id)
        );
        this.account = result.data.account;
        this.list = this.formatRecordListData(this.account.recordList);
      } catch (err) {
        Toast({ message: err.message });
      }
    },
    formatRecordListData(list) {
      const days = new Map();
      const today = day().year();
      for (let item of list) {
        const date = day(Number(item.date));
        let key = `${Utils.fillZero(date.month() + 1)}月`;
        if (today !== date.year()) {
          key = `${date.year()}-` + key;
        }
        if (days.has(key)) {
          const list = days.get(key);
          list.push(item);
          days.set(key, list);
        } else {
          days.set(key, [item]);
        }
      }

      function calcMoney(list, type = "expense") {
        return list
          .reduce((a, c) => {
            if (c.type === type) {
              return (a += c.money);
            }
            return a;
          }, 0)
          .toFixed(2);
      }

      const resultList = [];
      for (let [k, v] of days.entries()) {
        resultList.push({
          date: k,
          expenseMoney: calcMoney(v, "expense"),
          incomeMoney: calcMoney(v, "income"),
          list: v
        });
      }
      return resultList;
    }
  }
};
</script>
