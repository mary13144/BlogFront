<script setup lang="ts">
const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  data: {
    type: Number,
    default: 0
  },
})
</script>

<template>
  <div class="dataShow">
    <div class="icon">
      <i :class="'iconfont '+props.icon"></i>
    </div>
    <div class="text">
      <h3 class="dataTitle">
        {{ props.title }}
      </h3>
      <span class="dataNumber">
          {{ props.data }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dataShow {
  width: 300px;
  height: 120px;
  background-color: var(--bg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
  border: 1px solid var(--border);
  border-radius: 15px;

  .icon {
    .iconfont {
      color: var(--theme);
      font-size: 60px;
    }
  }

  .text {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    color: var(--text);

    .dataTitle {
      margin: 0;
      font-size: 23px;
    }

    .dataNumber {
      font-size: 20px;
      font-weight: bold;
    }
  }
}
</style>