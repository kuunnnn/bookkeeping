<template>
  <van-tabbar route :fixed="false">
    <van-tabbar-item icon="balance-list-o" replace to="/">
      支出
    </van-tabbar-item>
    <van-tabbar-item icon="bar-chart-o" replace to="/income">
      收入
    </van-tabbar-item>
    <van-tabbar-item to="/record-edit">
      <div class="bk-add">记一笔</div>
    </van-tabbar-item>
    <van-tabbar-item icon="balance-o" replace to="/account">
      账户
    </van-tabbar-item>
    <van-tabbar-item icon="setting-o" replace to="/setting">
      设置
    </van-tabbar-item>
  </van-tabbar>
</template>

<style scoped>
.bk-add {
  padding: 10px 16px;
  border-radius: 15px;
  color: white;
  background-color: orange;
}
</style>
