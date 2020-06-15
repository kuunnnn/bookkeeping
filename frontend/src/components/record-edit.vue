<template>
  <van-form @submit="onSubmit">
    <div v-if="!record.id" class="type-container">
      <van-radio-group v-model="innerType" direction="horizontal">
        <van-radio name="expense">支出</van-radio>
        <van-radio name="income">收入</van-radio>
      </van-radio-group>
    </div>
    <div class="category-list">
      <van-tag
        class="tag"
        :class="category.id === item.id ? 'selected' : ''"
        plain
        round
        @click="category = category.id === item.id ? {} : item"
        v-for="item in innerType === 'expense' ? expenseList : incomeList"
        :key="item.id"
      >
        {{ item.name }}
      </van-tag>
    </div>
    <van-field v-model="money" label="金额" type="number" />
    <van-field
      readonly
      clickable
      name="picker"
      :value="account.name"
      label="选择账户"
      placeholder="点击选择账户"
      @click="showSelectAccountPicker = true"
    />
    <bk-date-picker :value="timestamp" @change="timeChange" />
    <van-field
      v-model="remark"
      rows="4"
      autosize
      label="备注"
      type="textarea"
      maxlength="50"
      placeholder="备注"
      show-word-limit
    />
    <van-popup v-model="showSelectAccountPicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="accountColumns"
        @confirm="onSelectAccountConfirm"
        @cancel="showSelectAccountPicker = false"
      />
    </van-popup>
  </van-form>
</template>

<script>
import { Toast } from "vant";
import DatePicker from "../components/date-picker";
import { RecordGraphqlService } from "../services/record-graphql-service";
import QueryString from "../graphql/query/accountAndCategory.graphql";
import { apolloClient } from "../apollo-graphql";

export default {
  props: {
    type: {
      type: String,
      default: "expense"
    }
  },
  components: {
    "bk-date-picker": DatePicker
  },
  data: () => ({
    showSelectAccountPicker: false,
    accountColumns: [],
    innerType: "expense",
    expenseList: [],
    incomeList: [],
    accountList: [],
    record: {},
    category: { id: undefined, name: undefined },
    account: { id: undefined, name: undefined },
    remark: "",
    timestamp: new Date(),
    money: 0,
    id: undefined
  }),
  mounted() {
    this.innerType = this.type;
    this.loadData().then(() => {
      if (this.$route?.query?.id) {
        this.id = Number(this.$route.query.id);
        this.fetchRecordInfo();
      }
    });
  },
  methods: {
    async fetchRecordInfo() {
      try {
        const result = await RecordGraphqlService.fetchRecordInfo(this.id);
        this.record = result.data.record;
        this.money = this.record.money;
        this.remark = this.record.remark;
        this.timestamp = new Date(this.record.date);
        this.account = this.record.account;
        this.category = this.record.category;
      } catch (err) {
        Toast.fail(err.message);
      }
    },
    async loadData() {
      try {
        const result = await apolloClient.query({
          query: QueryString,
          fetchPolicy: "no-cache"
        });
        this.incomeList = result.data.incomeList.slice(0, 10);
        this.expenseList = result.data.expenseList.slice(0, 10);
        this.accountList = result.data.accountList;
        this.accountColumns = this.accountList.map(v => v.name);
        for (let acc of this.accountList) {
          if (acc.isDefault) {
            this.account = acc;
            break;
          }
        }
      } catch (err) {
        Toast.fail(err.message);
      }
    },

    async onSubmit() {
      const time = this.timestamp;
      const account = this.account;
      const category = this.category;
      const money = this.money;
      const remark = this.remark;
      if (!account?.id) {
        throw new Error("请选择账户!");
      }
      if (!category?.id) {
        throw new Error("请选择类别!");
      }
      if (!money) {
        throw new Error("请输入金额!");
      }
      if (this.id) {
        await RecordGraphqlService.update(this.id, {
          date: time.toISOString(),
          accountId: account.id,
          categoryId: category.id,
          type: this.innerType,
          money: Number(money),
          remark
        });
      } else {
        await RecordGraphqlService.create({
          date: time.toISOString(),
          accountId: account.id,
          categoryId: category.id,
          type: this.innerType,
          money: Number(money),
          remark
        });
      }
    },

    timeChange(date) {
      this.timestamp = date;
    },

    onSelectAccountConfirm(value) {
      this.account = this.accountList.find(v => v.name === value);
      this.showSelectAccountPicker = false;
    }
  }
};
</script>

<style scoped>
.category-list {
  display: flex;
  padding: 15px;
  flex-flow: row wrap;
  background-color: white;
  border-bottom: 1px solid #e7e7e7;
}
.tag {
  padding: 5px 10px;
  margin: 10px;
  justify-content: center;
}
.selected {
  color: red;
}
.type-container {
  padding: 15px;
  display: flex;
  justify-content: center;
  background-color: white;
  border-bottom: 1px #e7e7e7 solid;
}
</style>
