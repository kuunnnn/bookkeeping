<template>
  <bk-app-container>
    <template v-slot:header>
      <van-nav-bar :title="title" left-arrow @click-left="back" />
    </template>
    <van-form @submit="onSubmit">
      <van-field
        readonly
        clickable
        value="¥"
        label="币种"
        :rules="[{ validator: r => true, message: '请选择币种' }]"
      />
      <van-field
        v-model="name"
        label="账户名称"
        placeholder="名称"
        :rules="[{ validator: r => !!r, message: '请输入账户名称' }]"
      />
      <van-field
        v-model="money"
        label="初始金额"
        type="number"
        placeholder="金额"
        :rules="[{ validator: r => !!r, message: '请输入金额' }]"
      />
      <van-cell title="默认账户">
        <template #right-icon>
          <van-switch v-model="isDefault" size="24" />
        </template>
      </van-cell>
      <bk-submit-button />
    </van-form>
  </bk-app-container>
</template>
<script>
import SubmitButton from "../components/submit-button";
import AppContainer from "../components/app-container";
import { AccountGraphqlService } from "../services/account-graphql-service";
import { Toast } from "vant";

export default {
  components: {
    "bk-submit-button": SubmitButton,
    "bk-app-container": AppContainer
  },
  data: () => ({
    valid: false,
    isDefault: false,
    title: "新增账户",
    id: void 0,
    name: "",
    money: void 0
  }),
  mounted() {
    const query = this.$route.query;
    if (query && query?.id) {
      this.title = "编辑账户";
      this.id = query.id;
      this.fetchAccountInfo();
    }
  },
  methods: {
    back() {
      this.$router.back();
    },
    async fetchAccountInfo() {
      try {
        const result = await AccountGraphqlService.info(Number(this.id));
        this.account = result.data.account;
        this.name = this.account.name;
        this.money = this.account.initialAmount;
      } catch (err) {
        Toast({ message: err.message });
      }
    },
    async onSubmit() {
      try {
        if (this.id) {
          await AccountGraphqlService.update(Number(this.id), {
            currencyId: this.account.currencyId,
            initialAmount: Number(this.money),
            isDefault: this.isDefault,
            name: this.name
          });
        } else {
          await AccountGraphqlService.create({
            currencyId: 1,
            initialAmount: Number(this.money),
            isDefault: this.isDefault,
            name: this.name
          });
        }
        this.$router.back();
      } catch (e) {
        Toast({ message: e.message });
      }
    }
  }
};
</script>
