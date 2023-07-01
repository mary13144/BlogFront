<script setup lang="ts">
import {useDark} from "@vueuse/core";
import {computed, ref} from "vue";
import {throttle} from "@/utils/throttle";

const isDark = useDark()
const theme = computed(() => {
  return isDark ? 'light' : 'dark'
})
const isShow = ref<boolean>(false)
const round = ref<number>(0)
const roundMax = 30 * 2 * Math.PI
window.addEventListener('scroll', throttle(() => {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
  isShow.value = scrollTop != 0;
  round.value = scrollTop / scrollHeight * roundMax
}, 100))
const skipTop = () => {
  document.documentElement.scrollTo({
    top: 0,
    behavior: "smooth"
  })
}
</script>

<template>
  <Transition
      enter-active-class="animate__animated animate__fadeIn animate__slower"
      leave-active-class="animate__animated animate__fadeOut animate__slower"
  >
    <div class="back_to_top" v-show="isShow" @click="skipTop">
      <svg width="66" height="66">
        <circle
            class="circle"
            r="30"
            cx="33"
            cy="33"
        >
        </circle>
      </svg>
      <el-tooltip
          :effect="theme"
          content="返回顶部"
          placement="left"
      >
        <div class="iconfont icon-huojian"></div>
      </el-tooltip>

    </div>
  </Transition>

</template>

<style scoped lang="scss">
.back_to_top {
  position: fixed;
  right: 10%;
  bottom: 20%;
  z-index: 999;
  cursor: pointer;

  > svg {

  }

  .circle {
    transition: all .5s;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(0, 0, 0, .2);
    fill: #FFFFFF;
    stroke: var(--theme);
    stroke-width: 3px;
    stroke-dasharray: v-bind(round) v-bind(roundMax);
  }

  .iconfont {
    position: absolute;
    font-size: 35px;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--theme);
  }
}
</style>