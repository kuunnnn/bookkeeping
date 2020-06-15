<template>
  <div class="bk-date-picker-bar">
    <div class="bk-date-picker-left-icon" @click="subtract">
      <van-icon name="arrow-left" />
    </div>
    <div class="bk-date-picker-content" @click="show = true">
      {{ timeString }}
    </div>
    <div class="bk-date-picker-right-icon" @click="add">
      <van-icon name="arrow" />
    </div>
    <van-calendar
      v-model="show"
      :show-confirm="false"
      :min-date="minDate"
      @confirm="onConfirm"
      :max-date="maxDate"
    />
  </div>
</template>
<script>
import day from "dayjs";

export default {
  props: {
    value: Date,
    change: Function
  },
  data: () => ({
    show: false,
    innerDate: new Date(),
    minDate: new Date(2010, 0, 1),
    maxDate: new Date(2040, 0, 31)
  }),
  computed: {
    timeString: function() {
      return day(this.innerDate).format("YYYY-MM-DD");
    }
  },
  mounted() {
    if (this.date) {
      this.innerDate = this.date;
    }
  },
  methods: {
    subtract() {
      this.innerDate = day(this.innerDate)
        .subtract(1, "day")
        .toDate();
    },
    add() {
      this.innerDate = day(this.innerDate)
        .add(1, "day")
        .toDate();
    },
    onConfirm(date) {
      this.show = false;
      this.innerDate = date;
      this.$emit("change", date);
    }
  }
};
</script>

<style scoped>
.bk-date-picker-bar {
  display: flex;
  align-items: center;
  padding: 0 8px;
  height: 45px;
  background-color: white;
  border-bottom: 1px solid #e7e7e7;
}

.bk-date-picker-left-icon,
.bk-date-picker-right-icon {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 15px;
}

.bk-date-picker-content {
  flex: 1;
  display: flex;
  justify-content: center;
}
</style>
