<template>
  <bk-app-container>
    <template v-slot:header>
      <van-nav-bar
        :title="title"
        right-text="新增"
        left-arrow
        @click-left="back"
        @click-right="append"
      />
    </template>
    <van-list :loading="loading" :finished="finished">
      <div v-if="list.length > 0">
        <van-swipe-cell
          v-for="item in list"
          :key="item.id"
          :before-close="data => beforeClose(item.id, data)"
        >
          <van-cell
            :title="item.name"
            is-link
            :to="{ path: '/category-edit', query: { type: type, id: item.id } }"
          />
          <template v-slot:right>
            <van-button square type="danger" text="删除" />
          </template>
        </van-swipe-cell>
      </div>
      <van-empty v-else />
    </van-list>
  </bk-app-container>
</template>
<script>
import AppContainer from "../components/app-container";
import { CategoryGraphqlService } from "../services/category-graphql-service";
import { Toast, Dialog } from "vant";

export default {
  components: {
    "bk-app-container": AppContainer
  },
  data: () => ({
    list: [],
    loading: true,
    finished: false,
    type: "expense",
    title: "支出类别管理"
  }),
  mounted() {
    if (this.$route.query?.type === "income") {
      this.type = "income";
      this.title = "收入类别管理";
    }
    this.fetchCategoryList();
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
    async fetchCategoryList() {
      try {
        const result = await CategoryGraphqlService.fetchList(this.type);
        this.list = result.data.categoryList;
      } catch (err) {
        Toast.fail({ message: "数据获取失败!" });
      }
      this.loading = false;
      this.finished = true;
    },
    async beforeClose(id, { position, instance }) {
      switch (position) {
        case "left":
        case "cell":
        case "outside":
          instance.close();
          break;
        case "right":
          await Dialog.confirm({
            message: "确定删除吗？删除后已关联的账目也会被删除!",
            title: "警告"
          });
          await CategoryGraphqlService.delete(id);
          Toast.success({ message: "删除成功!" });
          await this.fetchCategoryList();
          instance.close();
          break;
      }
    }
  }
};
</script>
