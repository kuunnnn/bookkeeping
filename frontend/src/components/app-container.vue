<template>
  <div class="bk-container">
    <slot name="header"></slot>
    <div class="bk-content">
      <slot></slot>
    </div>
    <slot name="footer"></slot>
  </div>
</template>
<style scoped>
.bk-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f5f5f5;
}

.bk-content {
  flex: 1;
  overflow: auto;
}
</style>
