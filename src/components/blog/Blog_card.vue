<script setup lang="ts">
const props = defineProps<{
  icon: string
  title: string
}>()
</script>

<template>
  <div class="blog_card">
    <div class="title">
      <i :class="'iconfont '+props.icon"></i>
      <h2>
        {{ props.title }}
      </h2>
    </div>
    <div class="body">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.blog_card {
  background-color: var(--bg);
  border-radius: 10px;
  width: 100%;
  height: 100%;

  .title {
    height: 3.5rem;
    display: flex;
    align-items: center;
    padding: 10px 20px 0 20px;
    border-bottom: 1px dotted var(--border);

    h2 {
      font-size: 20px;
      font-weight: bold;
      color: var(--text);
      margin: 10px 0 10px 5px;
    }
  }

  .body {
    width: 100%;
    height: calc(100% - 3.5rem);
    overflow: auto;
    padding: 20px;
  }
}
</style>