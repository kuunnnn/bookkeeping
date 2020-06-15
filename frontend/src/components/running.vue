<template>
  <bk-app-container>
    <template v-slot:header>
      <van-nav-bar :title="type === 'expense' ? '支出' : '收入'" border />
    </template>
    <van-list v-if="list.length > 0">
      <div v-for="day in list" :key="day.date">
        <van-sticky :offset-top="47">
          <van-cell :title="day.date" style="background-color: #f5f5f5">
            <template v-slot:extra>
              <span>{{ day.money }}</span>
            </template>
          </van-cell>
        </van-sticky>
        <van-cell
          v-for="item in day.list"
          :key="item.id"
          :title="item.categoryName"
          @click="toRecordInfo(item.id, item.type)"
        >
          <template v-slot:extra>
            <span>{{ item.money.toFixed(2) }}</span>
          </template>
        </van-cell>
      </div>
    </van-list>
    <van-empty v-else />
    <template v-slot:footer>
      <bk-bottom-nav-bar />
    </template>
  </bk-app-container>
</template>

<script>
import { RecordGraphqlService } from "../services/record-graphql-service";
import BottomNavBar from "./bottom-navbar";
import AppContainer from "./app-container";
import { Utils } from "../utils/utils";
import { Toast } from "vant";

export default {
  props: {
    type: {
      type: String,
      default: "expense"
    }
  },
  components: {
    "bk-bottom-nav-bar": BottomNavBar,
    "bk-app-container": AppContainer
  },
  data: () => ({ list: [] }),
  mounted() {
    this.onLoad();
  },
  methods: {
    toRecordInfo(id, type) {
      this.$router.push({ path: "/record-info", query: { id, type } });
    },
    async onLoad() {
      try {
        const result = await RecordGraphqlService.fetchRecordAll(this.type);
        this.list = this.formatRecordDataByDay(result.data.recordList);
      } catch (err) {
        Toast.fail(err.message);
      }
    },
    formatRecordDataByDay(data) {
      const map = new Map();
      for (let item of data) {
        const date = new Date(Number(item.date));
        const month = Utils.fillZero(date.getMonth() + 1);
        const day = Utils.fillZero(date.getDate());
        const key = `${month}-${day}`;
        if (map.has(key)) {
          const v = map.get(key);
          v.push(item);
          map.set(key, v);
        } else {
          map.set(key, [item]);
        }
      }
      const list = [];
      for (let [k, v] of map.entries()) {
        list.push({
          date: k,
          money: v.reduce((a, c) => (a += c.money), 0).toFixed(2),
          list: v
        });
      }
      return list;
    }
  }
};
</script>
