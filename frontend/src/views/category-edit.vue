<template>
  <bk-app-container>
    <template v-slot:header>
      <van-nav-bar :title="title" left-arrow @click-left="back" />
    </template>
    <van-form @submit="onSubmit" class="bk-mt20">
      <van-cell-group>
        <van-field
          v-model="name"
          autofocus
          label="类别"
          placeholder="请输入类别"
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
import { CategoryGraphqlService } from "../services/category-graphql-service";

import { Toast } from "vant";
import { Utils } from "../utils/utils";

export default {
  components: {
    "bk-app-container": AppContainer,
    "bk-submit-button": SubmitButton
  },
  data: () => ({
    valid: false,
    type: "expense",
    title: "新增支出类别",
    id: void 0,
    category: {},
    name: "",
    nameRules: [
      { required: true, message: "请输入类别名称" },
      {
        validator: v => v.length < 8,
        message: "最多 8 个字符"
      }
    ]
  }),
  mounted() {
    const query = this.$route.query;
    if (query.type === "income") {
      this.type = "income";
      this.title = "新增收入类别";
    }
    if (typeof query.id === "number") {
      this.id = query.id;
      this.title = this.type === "income" ? "编辑收入类别" : "编辑支出类别";
      this.fetchCategoryInfo();
    }
  },
  methods: {
    back() {
      this.$router.back();
    },
    async append() {
      await this.$router.push({
        path: "/category-edit",
        query: { type: this.type }
      });
    },
    async fetchCategoryInfo() {
      try {
        const result = await CategoryGraphqlService.fetchSignInfo(this.id);
        this.category = result.data.category;
        this.name = this.category.name;
      } catch (e) {
        Toast.fail({ message: e.message });
      }
    },
    async onSubmit() {
      try {
        if (this.id !== void 0) {
          if (this.name !== this.category.name) {
            await CategoryGraphqlService.updateInfo(this.id, this.name);
          }
        } else {
          await CategoryGraphqlService.createCategory({
            name: this.name,
            type: this.type
          });
        }
        Toast.success({ message: "ok", duration: 200 });
        await Utils.sleep(200);
        this.$router.back();
      } catch (e) {
        Toast.fail({ message: e.message });
      }
    }
  }
};
</script>
