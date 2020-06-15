<template>
  <div class="bk-m20">
    <van-button native-type="submit" class="bk-radius-10" block type="info">
      {{ text }}
    </van-button>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: "提交"
    }
  }
};
</script>

<style scoped>
.bk-m20 {
  margin: 20px;
}

.bk-radius-10 {
  border-radius: 20px;
  background-color: orange;
  border: none;
  height: 40px;
}
</style>
